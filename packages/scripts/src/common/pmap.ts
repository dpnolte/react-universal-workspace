// https://github.com/sindresorhus/p-map/
// but then with AggregateError
import AggregateError from 'aggregate-error'

interface IOptions {
  /**
  Number of concurrently pending promises returned by `mapper`.
  @default Infinity
  */
  concurrency?: number
  aggregateError?: boolean
}

/**
	Function which is called for every item in `input`. Expected to return a `Promise` or value.
	@param input - Iterated element.
	@param index - Index of the element in the source array.
	*/
type Mapper<Element = any, NewElement = any> = (
  input: Element,
  index: number
) => NewElement | Promise<NewElement>

/**
	Returns a `Promise` that is fulfilled when all promises in `input` and ones returned from `mapper` are fulfilled, or rejects if any of the promises reject. The fulfilled value is an `Array` of the fulfilled values returned from `mapper` in `input` order.
	@param input - Iterated over concurrently in the `mapper` function.
	@param mapper - Function which is called for every item in `input`. Expected to return a `Promise` or value.
	@example
	```
	import pMap = require('p-map');
	import got = require('got');
	const sites = [
		getWebsiteFromUsername('sindresorhus'), //=> Promise
		'ava.li',
		'todomvc.com',
		'github.com'
	];
	(async () => {
		const mapper = async site => {
			const {requestUrl} = await got.head(site);
			return requestUrl;
		};
		const result = await pMap(sites, mapper, {concurrency: 2});
		console.log(result);
		//=> ['http://sindresorhus.com/', 'http://ava.li/', 'http://todomvc.com/', 'http://github.com/']
	})();
	```
	*/
export const pMap = <Element, NewElement>(
  iterable: Iterable<Element>,
  mapper: Mapper<Element, NewElement>,
  providedOptions?: IOptions
): Promise<NewElement[]> =>
  new Promise((resolve, reject) => {
    const options = Object.assign(
      {
        concurrency: Infinity,
        aggregateError: false,
      },
      providedOptions
    )

    if (typeof mapper !== 'function') {
      throw new TypeError('Mapper function is required')
    }

    const { concurrency, aggregateError } = options

    if (!(typeof concurrency === 'number' && concurrency >= 1)) {
      throw new TypeError(
        `Expected \`concurrency\` to be a number from 1 and up, got \`${concurrency}\` (${typeof concurrency})`
      )
    }

    const ret: NewElement[] = []
    const errors: Error[] = []
    const iterator = iterable[Symbol.iterator]()
    let isRejected = false
    let isIterableDone = false
    let resolvingCount = 0
    let currentIndex = 0

    const next = () => {
      if (isRejected) {
        return
      }

      const nextItem = iterator.next()
      const i = currentIndex
      currentIndex += 1

      if (nextItem.done) {
        isIterableDone = true

        if (resolvingCount === 0) {
          if (aggregateError && errors) {
            reject(new AggregateError(errors))
          } else {
            resolve(ret)
          }
        }

        return
      }

      resolvingCount += 1

      Promise.resolve(nextItem.value)
        .then(element => mapper(element, i))
        .then(
          value => {
            ret[i] = value
            resolvingCount -= 1
            next()
          },
          error => {
            if (aggregateError) {
              errors.push(error)
              resolvingCount -= 1
              next()
            } else {
              isRejected = true
              reject(error)
            }
          }
        )
    }

    for (let i = 0; i < concurrency; i += 1) {
      next()

      if (isIterableDone) {
        break
      }
    }
  })
