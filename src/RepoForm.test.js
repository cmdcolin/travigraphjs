import React from 'react'
import ReactDOM from 'react-dom'
import { RepoForm } from './RepoForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<RepoForm />, div)
  ReactDOM.unmountComponentAtNode(div)
})
