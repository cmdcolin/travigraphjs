import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    alert(`A name was submitted: ${this.state.value}`)
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

function App() {
  const [data, setData] = useState({ hits: [] })

  useEffect(async () => {
    const result = await fetch('http://hn.algolia.com/api/v1/search?query=redux')

    setData(result.data)
  })

  return (
    <>
      <NameForm onChange={evt => this.setData(evt.target.value)} />
      <BarChart data={barData} />
    </>
  )
}
