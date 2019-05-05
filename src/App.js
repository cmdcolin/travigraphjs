import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import { useQueryParams, StringParam, NumberParam, ArrayParam } from 'use-query-params'
import pLimit from 'p-limit'
import { createClassFromLiteSpec } from 'react-vega-lite'

const headers = new Headers({ 'Travis-API-Version': '3' })
const BUILDS_PER_REQUEST = 25

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

  return (
    <form
      onSubmit={evt => {
        evt.preventDefault()
        onSubmit({ repo, start: +start, end: +end })
      }}
    >
      <input value={repo} onChange={evt => setRepo(evt.target.value)} />
      <input value={start} onChange={evt => setStart(evt.target.value)} />
      <input value={end} onChange={evt => setEnd(evt.target.value)} />
      <button type="submit">Submit</button>
    </form>
  )
}

async function getBuilds({ repo, start, end }) {
  const prefix = `https://api.travis-ci.org/repo/${encodeURIComponent(repo)}/builds?limit=${BUILDS_PER_REQUEST}`
  const input = []
  const limit = pLimit(1)

  for (let i = start; i <= end; i += BUILDS_PER_REQUEST) {
    input.push(
      limit(() => {
        return fetch(`${prefix}&offset=${i}&sort_by=id`, { headers })
          .then(m => m.json())
          .then(m => m.builds)
      }),
    )
  }

  const result = await Promise.all(input)
  return result.flat()
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
  const [query, setQuery] = useQueryParams({
    repo: StringParam,
    start: NumberParam,
    end: NumberParam,
  })

  const { repo, start, end } = query
  useEffect(() => {
    if (repo && !repo.includes('/')) {
      setError('Repo should be in the form user/name')
    }
  })
  if (end <= start) {
    setError('End should be greater than start')
  }
  useEffect(() => {
    async function getData(query) {
      const result = await getBuilds(query)
      setTimeout(() => {
        setLoading(false)
        setDownloadedRepoData(process(result))
      }, 100)
    }
    getData(query)
  }, [query])

  const Error = err => {
    console.log(err)
    return <p style={{ color: 'red' }}>{err.error}</p>
  }
  console.log(downloadedRepoData)
  return (
    <>
      <RepoForm
        init={query}
        onSubmit={res => {
          setLoading(true)
          setQuery(res)
        }}
      />
      {loading && <p>Loading...</p>}
      {error && <Error error={error} />}
      {downloadedRepoData && <LineChart data={downloadedRepoData} />}
    </>
  )
}
