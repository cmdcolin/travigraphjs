## [1.0.4](https://github.com/cmdcolin/travigraphjs/compare/1.0.3...1.0.4) (2019-05-30)



- Added aborting
- Added example button
- Added local storage cache

## Version 1.0.3 - May 5th, 2019

### Features

- Rewrote app in react
- Implements a cache to help store current results
- Implements 1-request-at-a-time fetching to be nice to travis
- Adds support for travis-ci.com

## Version 1.0.2 - April 9th, 2018

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



## Version 1.0.1 - February 6th, 2018

### Features

- Add mouseover

## Version 1.0.0 - April 8th, 2017

Initial release!

### Features

- Fetches build data from the travis v3 API
- Uses vega 3.0 beta, vega-lite 2.0 beta, and d3 4.0
