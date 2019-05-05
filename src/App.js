import React, { useState, useEffect } from 'react'
import { useQueryParams, BooleanParam, StringParam, NumberParam } from 'use-query-params'
import { createClassFromLiteSpec } from 'react-vega-lite'
import AbortablePromiseCache from 'abortable-promise-cache'
import LSCache from 'lscache'
import QuickLRU from 'quick-lru'
import tenaciousFetch from 'tenacious-fetch'
import { RepoForm } from './RepoForm'
import { filterOutliers, isAbortException } from './util'
import './App.css'
//use for debugging
//import setFixtures from './set-fixtures'
//setFixtures()

const BUILDS_PER_REQUEST = 100
LSCache.setExpiryMilliseconds(3600000)

const cache = new AbortablePromiseCache({
  cache: new QuickLRU({ maxSize: 1000 }),
  async fill(requestData, signal) {
    const { url, headers } = requestData
    const ret = LSCache.get(url)
    return (
      ret ||
      tenaciousFetch(url, { headers, signal })
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error(`failed http status ${res.status}`)
          }
        })
        .then(res => res.builds)
        .then(data =>
          data.map(m => ({
            message: (m.commit || {}).message,
            branch: (m.branch || {}).name,
            duration: m.duration / 60,
            number: m.number,
            finished_at: m.finished_at,
            state: m.state,
          })),
        )
        .then(data => filterOutliers(data))
        .then(data => {
          LSCache.set(url, data)
          return data
        })
    )
  },
})

const LineChart = createClassFromLiteSpec('LineChart', {
  $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
  width: 1000,
  height: 400,
  mark: 'point',
  selection: {
    grid: {
      type: 'interval',
      bind: 'scales',
    },
  },
  encoding: {
    y: {
      field: 'duration',
      type: 'quantitative',
      axis: {
        title: 'Duration (minutes)',
      },
    },
    x: {
      field: 'finished_at',
      timeUnit: 'yearmonthdatehoursminutes',
      type: 'temporal',
      scale: {
        nice: 'week', // add some padding/niceness to domain
      },
      axis: {
        title: 'Date',
      },
    },
    color: {
      field: 'state',
      type: 'nominal',
      scale: {
        domain: ['failed', 'errored', 'canceled', 'passed'],
        range: ['#d62728', '#ff7f0e', '#5ab43c', '#1f77b4'],
      },
    },
  },
})

function getBuilds({ counter, repo, start, end, com }) {
  //prettier-ignore
  const root = `https://api.travis-ci.${com ? 'com' : 'org'}/repo/${encodeURIComponent(
    repo,
  )}/builds?limit=${BUILDS_PER_REQUEST}`
  const offset = start + BUILDS_PER_REQUEST * counter
  const url = `${root}&offset=${offset}&sort_by=id`
  return offset <= end ? url : undefined
}

const blankState = () => {
  return {
    loading: null,
    error: null,
    downloaded: null,
    controller: new AbortController(),
    counter: 0,
    builds: [],
  }
}
export default function App() {
  const [state, setState] = useState(blankState())

  const [query, setQuery] = useQueryParams({
    repo: StringParam,
    start: NumberParam,
    end: NumberParam,
    com: BooleanParam,
  })
  const { counter, controller, builds, loading, downloaded, error } = state
  useEffect(
    query => {
      const { repo, start, end } = query || {}
      if (repo && !repo.includes('/')) {
        setState({ ...blankState(), error: 'Repo should be in the form user/name' })
      }
      if (end <= start) {
        setState({ ...blankState(), error: 'End should be greater than start' })
      }
    },
    [query],
  )

  useEffect(() => {
    async function getData(query) {
      try {
        if (loading && query && query.repo) {
          setState({ ...state, loading: `Loading...build ${counter * BUILDS_PER_REQUEST}` })
          const url = getBuilds({ ...query, counter })
          if (url) {
            const headers = new Headers({ 'Travis-API-Version': '3' })
            const result = await cache.get(url, { url, headers }, controller.signal)
            setState({
              ...state,
              counter: counter + 1,
              controller: new AbortController(),
              builds: builds.concat(result),
            })
          } else if (!builds.length) {
            setState({ ...blankState(), error: 'No builds loaded' })
          } else {
            setState({ ...state, loading: null, downloaded: { values: builds } })
          }
        }
      } catch (e) {
        if (!isAbortException(e)) {
          console.error(e)
          setState({
            ...blankState(),
            error: e.message,
          })
        }
      }
    }
    getData(query)
  }, [loading, query, counter, controller])

  return (
    <>
      <h1>travigraph-js - Travis-CI duration graph</h1>
      <p>
        Enter a repo name, the start build, and end build to query for. Also specify whether this is on travis-ci.com
        instead of .org with the checkbox. NOTE: The repository name is case sensitive!
      </p>
      <RepoForm
        init={query}
        onSubmit={res => {
          if (loading) {
            controller.abort()
          }
          setQuery(res)
          setState({
            ...blankState(),
            loading: 'Loading...',
          })
        }}
        onCancel={() => {
          if (loading) {
            controller.abort()
          }
          setState({
            ...blankState(),
          })
        }}
      />
      {loading && <p>{loading}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {downloaded && <LineChart data={downloaded} />}
      <a href="https://github.com/cmdcolin/travigraphjs/">travigraph@GitHub</a>
    </>
  )
}
