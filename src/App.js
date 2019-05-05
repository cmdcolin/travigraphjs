import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import { useQueryParams, StringParam, NumberParam, ArrayParam } from 'use-query-params'
import pLimit from 'p-limit'
import BarChart from './barChart'

const headers = new Headers({ 'Travis-API-Version': '3' })
const BUILDS_PER_REQUEST = 25

const barData = {
  values: [
    { a: 'A', b: 20 },
    { a: 'B', b: 34 },
    { a: 'C', b: 55 },
    { a: 'D', b: 19 },
    { a: 'E', b: 40 },
    { a: 'F', b: 34 },
    { a: 'G', b: 91 },
    { a: 'H', b: 78 },
    { a: 'I', b: 25 },
  ],
}

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
  // return (
  //   <>
  //     <form
  //       onSubmit={evt => {
  //       }}
  //     >
  //       <label htmlFor="repo">Repository name</label>
  //       <input id="repo" type="text" onChange={evt => setName(evt.target.value)} />
  //       <label htmlFor="start">Start</label>
  //       <input id="start" type="number" value={start} onChange={evt => setStart(evt.target.value)} />
  //       <label htmlFor="end">End</label>
  //       <input id="end" type="number" value={end} onChange={evt => setEnd(evt.target.value)} />
  //       <button type="submit">Submit</button>
  //     </form>
  //   </>
  // )
}

async function getBuilds({ repo, start, end }) {
  const prefix = `https://api.travis-ci.org/repo/${repo}/builds`
  const input = []
  const limit = pLimit(1)

  for (let i = start; i <= end; i += BUILDS_PER_REQUEST) {
    input.push(
      //limit(() => {
      //return fetch(`${prefix}?limit=${BUILDS_PER_REQUEST}&offset=${i}&sort_by=id`, { headers })
      `${prefix}?limit=${BUILDS_PER_REQUEST}&offset=${i}&sort_by=id`,
    )
  }
  console.log(input)

  //   const result = await Promise.all(input)
  //   const ret = await Promise.all(result.map(m => m.json()))
  //   const builds = ret.map(m => m.builds)
  //   return process([].concat(...builds))
  return 'hello world'
}

export default function App() {
  const [downloadedRepoData, setDownloadedRepoData] = useState({ hits: [] })
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useQueryParams({
    repo: StringParam,
    start: NumberParam,
    end: NumberParam,
  })

  const { repo, start, end } = query
  useEffect(() => {
    async function getData(query) {
      console.log('query', query)
      const result = await getBuilds(query)
      console.log('here')
      setTimeout(() => {
        setLoading(false)
      }, 100)

      //setDownloadedRepoData(result)
    }
    getData(query)
  }, [query])

  return (
    <>
      <RepoForm
        init={query}
        onSubmit={res => {
          console.log('submitted', res)
          setLoading(true)
          setQuery(res)
        }}
      />
      {loading && <p>Loading...</p>}
      {repo && !loading && <BarChart />}
    </>
  )
}
