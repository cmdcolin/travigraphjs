import React, { PropTypes } from 'react'
import { createClassFromLiteSpec } from 'react-vega-lite'

export default createClassFromLiteSpec('BarChart', {
  description: 'A simple bar chart with embedded data.',
  mark: 'bar',
  encoding: {
    x: { field: 'a', type: 'ordinal' },
    y: { field: 'b', type: 'quantitative' },
  },
})
