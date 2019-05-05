import React, { useState, useEffect } from 'react'
import { useQueryParams, BooleanParam, StringParam, NumberParam } from 'use-query-params'
import PropTypes from 'prop-types'
import pLimit from 'p-limit'
import { createClassFromLiteSpec } from 'react-vega-lite'
import AbortablePromiseCache from 'abortable-promise-cache'
import QuickLRU from 'quick-lru'
import tenaciousFetch from 'tenacious-fetch'

const headers = new Headers({ 'Travis-API-Version': '3' })
const BUILDS_PER_REQUEST = 25

const cache = new AbortablePromiseCache({
  cache: new QuickLRU({ maxSize: 1000 }),
  async fill(requestData, signal) {
    const { url, headers } = requestData
    return tenaciousFetch(url, { headers, signal })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(`failed http status ${res.status}`)
        }
      })
      .then(res => {
        return res.builds
      })
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
      timeUnit: 'yearmonthdate',
      type: 'temporal',
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

function RepoForm(props) {
  const { onSubmit, init } = props
  const [repo, setRepo] = useState(init.repo || '')
  const [start, setStart] = useState(init.start || 0)
  const [end, setEnd] = useState(init.end || 100)
  const [checked, setChecked] = useState(init.com || false)

  return (
    <form
      onSubmit={evt => {
        evt.preventDefault()
        onSubmit({ repo, start: +start, end: +end, com: checked })
      }}
    >
      <label htmlFor="repo">Repository name</label>
      <input name="repo" value={repo} onChange={evt => setRepo(evt.target.value)} />

      <label htmlFor="start">Start build</label>
      <input name="start" value={start} onChange={evt => setStart(evt.target.value)} />

      <label htmlFor="end">End build</label>
      <input name="end" value={end} onChange={evt => setEnd(evt.target.value)} />

      <label htmlFor="com">Using travis-ci.com (instead of .org)?</label>
      <input name="com" type="checkbox" checked={checked} onChange={evt => setChecked(evt.target.checked)} />
      <button type="submit">Submit</button>
    </form>
  )
}
RepoForm.propTypes = {
  init: PropTypes.object,
  onSubmit: PropTypes.func,
}

function getBuilds({ counter, repo, start, end, com }) {
  //prettier-ignore
  const root = `https://api.travis-ci.${com ? 'com' : 'org'}/repo/${encodeURIComponent(repo)}/builds?limit=${BUILDS_PER_REQUEST}`
  const offset = start + BUILDS_PER_REQUEST * counter
  const url = `${root}&offset=${offset}&sort_by=id`
  return offset <= end ? url : undefined
}

// stackoverflow
function filterOutliers(someArray) {
  const values = someArray.concat()
  values.sort((a, b) => a.duration - b.duration)

  const q1 = values[Math.floor(values.length / 4)].duration
  const q3 = values[Math.ceil(values.length * (3 / 4))].duration
  const iqr = q3 - q1

  const maxValue = q3 + iqr * 3
  const minValue = q1 - iqr * 3

  const filteredValues = values.filter(x => x.duration < maxValue && x.duration > minValue)

  return filteredValues
}

function process(data) {
  data = data.map(m => ({
    message: (m.commit || {}).message,
    branch: (m.branch || {}).name,
    duration: m.duration,
    number: m.number,
    finished_at: m.finished_at,
    state: m.state,
  }))
  if (!data.length) {
    throw new Error('No results found for this repository')
  }

  for (let i = 0; i < data.length; i += 1) {
    data[i].duration /= 60
  }
  return {
    values: filterOutliers(data),
  }
}

export default function App() {
  const [downloadedRepoData, setDownloadedRepoData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [builds, setBuilds] = useState([])
  const [counter, setCounter] = useState(0)
  const [query, setQuery] = useQueryParams({
    repo: StringParam,
    start: NumberParam,
    end: NumberParam,
    com: BooleanParam,
  })

  const { repo, start, end } = query
  useEffect(() => {
    if (repo && !repo.includes('/')) {
      setError('Repo should be in the form user/name')
    }
    if (end <= start) {
      setError('End should be greater than start')
    }
  })

  useEffect(() => {
    async function getData(query) {
      try {
        if (query.repo) {
          setLoading(`Loading...build ${counter * BUILDS_PER_REQUEST}`)
          const url = getBuilds({ counter, ...query })
          if (url) {
            const result = await cache.get(url, { url, headers })
            setCounter(counter + 1)
            setBuilds(builds.concat(result))
          } else {
            setLoading(null)
            setDownloadedRepoData(process(builds))
          }
        }
      } catch (e) {
        setError(e.message)
      }
    }
    getData(query)
  }, [query, counter])

  const Error = props => {
    const { error } = props
  }
  return (
    <>
      <h1>travigraph-js - Travis-CI duration graph</h1>
      <p>
        Enter a repo name, the start build, and end build to query for. Also specify whether this is on travis-ci.com
        instead of .org with the checkbox
      </p>
      <RepoForm
        init={query}
        onSubmit={res => {
          setLoading('Loading...')
          setQuery(res)
        }}
      />
      {loading && <p>{loading}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {downloadedRepoData && <LineChart data={downloadedRepoData} />}
      <a href="https://github.com/cmdcolin/travigraphjs/">travigraph@GitHub</a>
    </>
  )
}
