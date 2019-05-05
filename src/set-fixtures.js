// enable easily swapping out test data for real API calls in dev environment
// by https://hackernoon.com/liberate-your-ui-development-setup-a-mock-api-9b6167d06ffa
//
import fetchMock from 'fetch-mock'
import data from './testData.json'

const FIXTURE_KEY = 'fixtures'

/**
 * Turns on fixtures, if they should be turned on. Adds a function
 * to the window object in the browser that makes it easy to toggle
 * fixtures.
 */
export default function() {
  if (process.env.NODE_ENV !== 'production') {
    const useFixtures = areFixturesOn()
    setFixtures(useFixtures)
    setFixtureToggle(useFixtures)
  }
}

function areFixturesOn() {
  const useFixtures = window.localStorage.getItem(FIXTURE_KEY)
  return useFixtures === null || useFixtures === 'true'
}

function setFixtureToggle(useFixtures) {
  window.toggleFixtures = () => {
    window.localStorage.setItem(FIXTURE_KEY, (!useFixtures).toString())
    window.location.reload()
  }
}

function setFixtures(useFixtures) {
  if (useFixtures) {
    fetchMock.get('*', data)
  }
}
