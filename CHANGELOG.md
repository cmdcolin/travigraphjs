## [1.1.0]

- Add build details on click
- Add tooltip
- Add babel-eslint for proper eslint
- Autoinfer number of builds

## [1.0.6](https://github.com/cmdcolin/travigraphjs/compare/v1.0.5...v1.0.6) (2019-12-01)

- Make the basis of the app use create-react-app

## [1.0.5](https://github.com/cmdcolin/travigraphjs/compare/v1.0.4...v1.0.5) (2019-06-12)



- Remove lscache due to unpredictability

## [1.0.4](https://github.com/cmdcolin/travigraphjs/compare/v1.0.3...v1.0.4) (2019-05-30)



- Added aborting
- Added example button
- Added local storage cache

## [1.0.3](https://github.com/cmdcolin/travigraphjs/compare/v1.0.2...v1.0.3) (2019-05-05)

### Features

- Rewrote app in react
- Implements a cache to help store current results
- Implements 1-request-at-a-time fetching to be nice to travis
- Adds support for travis-ci.com

## [1.0.2](https://github.com/cmdcolin/travigraphjs/compare/v1.0.1...v1.0.2) (2019-04-09)

### Features

- Upgraded to Travis-CI API v3
- Grabs 100 builds at a time instead of 25
- Uses p-limit for throttling
- Improved browser support
- Lists total number of builds on submit

### Bugfixes

- Fixed coloring of statuses using ordinal domain and range

### Behind the scenes upgrades

- Uses async/await patterns
- Uses webpack for more browser support



## [1.0.1](https://github.com/cmdcolin/travigraphjs/compare/v1.0.0...v1.0.1) (2019-02-06)

### Features

- Add mouseover

## 1.0.0 (2017-04-08)

Initial release!

### Features

- Fetches build data from the travis v3 API
- Uses vega 3.0 beta, vega-lite 2.0 beta, and d3 4.0

