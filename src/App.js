import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import BarChart from './barChart'

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

function SetRepoForm(props) {
  const { onSubmit, initialRepo } = props
  const [name, setName] = useState(initialRepo)
  return (
    <>
      <form onSubmit={evt => onSubmit(name)}>
        <label htmlFor="repo">Repository name</label>
        <input id="repo" type="text" onChange={evt => setName(evt.target.name)} />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
export default function App() {
  const [repo, setRepo] = useState()
  const [downloadedRepoData, setDownloadedRepoData] = useState({ hits: [] })
  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    async function f() {
      document.getElementById('view').innerHTML = 'Loading...'
      const result = await fetch('http://hn.algolia.com/api/v1/search?query=redux')
      setLoading(false)
      console.log(repo, loading, downloadedRepoData)

      setDownloadedRepoData(result.data)
    }
    f()
  }, [])

  return (
    <>
      <SetRepoForm
        initialRepo="angular/angular"
        onSubmit={repoName => {
          setLoading(true)
          setRepo(repoName)
        }}
      />
      <BarChart data={barData} />
    </>
  )
}
