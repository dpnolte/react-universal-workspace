# react-universal-workspace

![react-universal-workspace](https://raw.githubusercontent.com/dpnolte/react-universal-workspace/master/universal.png "Universal app across Desktop, Mobile and Web")

## why?
* Shared components that can be created once and run on web, desktop (Windows/Mac), and mobile (Android/IOS)
* One monorepo but separate packages enables code sharing but at the same time allows for platform-specific build processes and isolating platform-specific dependencies, for example:
  * Server-side rendering for the web
  * Background processing for electron (desktop app)
  * Don't add react-dom to mobile
* Minimize effort to set up/configure project by leveraging create react app / razzle 
* Boilerplate for code quality using lint-staging (e.g., run relevant tests on staged files)
* This set up allows for sourcemapping and debugging in the typescript source files
* Packages with separation of concern in mind. Use core package to create view-agnostic application logic for higher re-usability and cleaner code.

## Usage

### Install

   ```sh
   yarn
   ```

### Run the project on a specific platform

#### Android/iOS
```sh
yarn android
yarn ios
```

#### Desktop
```sh
yarn desktop
```

#### Web
```sh
yarn web
```
