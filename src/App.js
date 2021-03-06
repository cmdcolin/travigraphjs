import React, { useState, useEffect } from 'react'
import {
  useQueryParams,
  BooleanParam,
  StringParam,
  NumberParam,
} from 'use-query-params'
import { VegaLite } from 'react-vega'
import AbortablePromiseCache from 'abortable-promise-cache'
import QuickLRU from 'quick-lru'
import tenaciousFetch from 'tenacious-fetch'
import RepoForm from './RepoForm'
import { filterOutliers, isAbortException } from './util'

const BUILDS_PER_REQUEST = 100

const cache = new AbortablePromiseCache({
  cache: new QuickLRU({ maxSize: 1000 }),
  async fill(requestData, signal) {
    const { url, headers } = requestData
    const ret = await tenaciousFetch(url, { headers, signal })
    if (!ret.ok) {
      throw new Error(`failed http status ${ret.status}`)
    }
    const json = await ret.json()
    const result = filterOutliers(
      json.builds.map((m) => {
        const queue =
          m.started_at && m.commit.committed_at
            ? (new Date(m.updated_at || m.started_at) -
                new Date(m.commit.committed_at)) /
              60000
            : 0
        return {
          message: (m.commit || {}).message.slice(0, 20),
          branch: (m.branch || {}).name,
          travisci_link: m.id,
          duration: m.duration / 60,
          queue: queue > 500 ? 0 : queue,
          build_number: m.number,
          commit_sha: m.commit.sha,
          compare: m.commit.compare_url,
          finished_at: m.finished_at,
          state: m.state,
        }
      })
    )
    return result
  },
})

function getBuilds({ counter, com, repo, end }) {
  const root = `https://api.travis-ci.${
    com ? 'com' : 'org'
  }/repo/${encodeURIComponent(repo)}/builds?limit=${BUILDS_PER_REQUEST}`
  const offset = BUILDS_PER_REQUEST * counter
  const url = `${root}&offset=${offset}&sort_by=id`
  return offset < end ? url : undefined
}

function getNumBuilds({ com, repo }) {
  return `https://api.travis-ci.${
    com ? 'com' : 'org'
  }/repo/${encodeURIComponent(repo)}/builds?limit=1&offset=-1`
}

function useTravisCI(signal, query) {
  const [counter, setCounter] = useState(0)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(
    query.repo ? 'Loading...' : 'Enter a repo'
  )
  const [builds, setBuilds] = useState([])
  const [end, setEnd] = useState()

  const h = {
    'Travis-API-Version': '3',
  }
  if (query.token) {
    h.Authorization = 'token ' + query.token
  }
  const headers = new Headers(h)

  useEffect(() => {
    ;(async () => {
      if (end === undefined && query.repo !== undefined) {
        const url = getNumBuilds(query)

        const res = await fetch(url, { headers })
        const builds = (await res.json()).builds
        if (builds && builds.length) {
          const numBuilds = +builds[0].number
          setEnd(numBuilds)
        }
      }
    })()
  })

  useEffect(() => {
    ;(async () => {
      try {
        if (end !== undefined) {
          if (query && query.repo) {
            setLoading(`Loading build ${counter * BUILDS_PER_REQUEST}/${end}`)

            const url = getBuilds({ ...query, counter, end })
            if (url) {
              const result = await cache.get(
                JSON.stringify({ url, headers }),
                { url, headers },
                signal
              )
              setBuilds(builds.concat(result))
              setCounter(counter + 1)
            } else if (!builds.length) {
              setError('No builds loaded')
            } else {
              setLoading(undefined)
            }
          }
        }
      } catch (e) {
        if (!isAbortException(e)) {
          console.error(e)
          setError(e.message)
        }
      }
    })()
  }, [loading, query, counter, builds, signal, headers, end])

  return [loading, error, builds]
}

function BuildDetails({ build, repo, com }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(build).map(([key, value]) => {
          if (key === 'travisci_link') {
            const link = `http://travis-ci.${com}/${repo}/builds/${value}`

            return (
              <tr key={key + '_' + value}>
                <td>{String(key)}</td>
                <td>
                  <a target="_blank" href={link}>
                    {link}
                  </a>
                </td>
              </tr>
            )
          } else {
            return (
              <tr key={key + '_' + value}>
                <td>{String(key)}</td>
                <td>{String(value)}</td>
              </tr>
            )
          }
        })}
      </tbody>
    </table>
  )
}

export default function App() {
  const [controller, setController] = useState(new AbortController())
  const [query, setQuery] = useQueryParams({
    repo: StringParam,
    start: NumberParam,
    end: NumberParam,
    com: BooleanParam,
    queue: BooleanParam,
    token: StringParam,
  })

  const [loading, error, builds] = useTravisCI(controller.signal, query)
  const [clickedBuild, setClickedBuild] = useState(undefined)
  return (
    <>
      <h1>travigraph-js - Travis-CI duration graph</h1>
      <p>
        Enter a repo name and optionally an authorization token, used for
        private repos Also specify whether this is on travis-ci.com or
        travis-ci.org with the checkbox. NOTE: The repository name is case
        sensitive!
      </p>
      <RepoForm
        initialValues={query}
        onSubmit={(res) => {
          if (loading) {
            controller.abort()
          }
          setController(new AbortController())
          setQuery(res)
        }}
        onCancel={() => {
          if (loading) {
            controller.abort()
          }
        }}
      />
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : loading ? (
        <p>{loading}</p>
      ) : (
        <div style={{ display: 'flex' }}>
          <VegaLite
            data={{ values: builds }}
            patch={(spec) => {
              spec.signals.push({
                name: 'barClick',
                value: 0,
                on: [{ events: '*:mousedown', update: 'datum' }],
              })
              return spec
            }}
            signalListeners={{
              barClick: (command, args) => {
                setClickedBuild(args)
              },
            }}
            spec={{
              $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
              width: 1000,
              height: 400,
              mark: { type: 'point', tooltip: { content: 'data' } },
              data: { name: 'values' },
              selection: {
                grid: {
                  type: 'interval',
                  bind: 'scales',
                },
              },
              encoding: {
                y: query.queue
                  ? {
                      field: 'query',
                      type: 'quantitative',
                      axis: { title: 'Queue time(minutes)' },
                    }
                  : {
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
                    domain: ['passed', 'failed', 'errored', 'canceled'],
                    range: ['#39aa56', '#ff7f0e', '#db4545', '#9d9d9d'],
                  },
                },
              },
            }}
          />
          {clickedBuild ? (
            <BuildDetails
              repo={query.repo}
              com={query.com ? 'com' : 'org'}
              build={clickedBuild}
            />
          ) : null}
        </div>
      )}
      <a href="https://github.com/cmdcolin/travigraphjs/">travigraph@GitHub</a>
    </>
  )
}
