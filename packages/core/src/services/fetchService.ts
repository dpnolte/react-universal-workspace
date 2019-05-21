export enum FetchErrorType {
  NetworkError = 'NetworkError',
  ServerError = 'ServerError',
  ApplicationError = 'ApplicationError',
  InvalidJSON = 'InvalidJSON',
}

export interface IFetchErrorResult<TResult> {
  success: false
  status: number
  errorType?: FetchErrorType
  message?: string
  body?: TResult | string
}
export interface IFetchSuccessResult<TResult> {
  success: true
  body: TResult
}

export const fetchJSON = async <TResult>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<IFetchSuccessResult<TResult> | IFetchErrorResult<TResult>> => {
  const response = await fetch(input, init)
  let responseBody
  try {
    responseBody = await response.text()
  } catch (err) {
    return {
      success: false,
      errorType: FetchErrorType.NetworkError,
      status: response.status,
    }
  }

  let body: TResult
  try {
    body = JSON.parse(responseBody)
  } catch (err) {
    return {
      success: false,
      errorType: FetchErrorType.InvalidJSON,
      status: response.status,
      body: responseBody,
    }
  }

  if (response.ok) {
    return {
      success: true,
      body,
    }
  }

  return {
    success: false,
    status: response.status,
    body,
    errorType:
      response.status >= 500
        ? FetchErrorType.ServerError
        : FetchErrorType.ApplicationError,
  }
}

export const fetchService = {
  fetchJSON,
}
