import React, { useState } from 'react'
import PropTypes from 'prop-types'

export function RepoForm(props) {
  const { onSubmit = () => {}, onCancel = () => {}, init = {} } = props
  const [state, setState] = useState(init)
  const { repo = '', start = '', end = '', com = false } = state

  return (
    <form
      onSubmit={evt => {
        evt.preventDefault()
        onSubmit({ repo, start: +start, end: +end, com })
      }}
    >
      <label htmlFor="repo">Repository name</label>
      <input
        name="repo"
        value={repo}
        onChange={evt => setState({ ...state, repo: evt.target.value })}
      />

      <label htmlFor="start">Start build</label>
      <input
        name="start"
        value={start}
        onChange={evt => setState({ ...state, start: evt.target.value })}
      />

      <label htmlFor="end">End build</label>
      <input
        name="end"
        value={end}
        onChange={evt => setState({ ...state, end: evt.target.value })}
      />

      <label htmlFor="com">Using travis-ci.com (instead of .org)?</label>
      <input
        name="com"
        type="checkbox"
        checked={com}
        onChange={evt => setState({ ...state, com: evt.target.checked })}
      />
      <button type="submit">Submit</button>
      <button
        onClick={evt => {
          evt.preventDefault()
          onCancel(evt)
        }}
      >
        Cancel
      </button>
      <button
        onClick={evt => {
          evt.preventDefault()
          const s = {
            repo: 'facebook/create-react-app',
            start: 0,
            end: 500,
            com: false,
          }
          setState(s)
          onSubmit(s)
        }}
      >
        Example
      </button>
    </form>
  )
}
RepoForm.propTypes = {
  init: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}
