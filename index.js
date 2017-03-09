var vg = require('vega')
// Assign the specification to a local variable vlSpec.
var vlSpec = {
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "bar",
  "encoding": {
    "y": {"field": "a", "type": "nominal"},
    "x": {
      "aggregate": "average", "field": "b", "type": "quantitative",
      "axis": {
        "title": "Average of b"
      }
    }
  }
};

var embedSpec = {
  mode: "vega-lite",  // Instruct Vega-Embed to use the Vega-Lite compiler
  spec: vlSpec
  // You can add more vega-embed configuration properties here.
  // See https://github.com/vega/vega/wiki/Embed-Vega-Web-Components#configuration-propeties for more information.
};

// Embed the visualization in the container with id `vis`
vg.embed("#vis", embedSpec, function(error, result) {
  // Callback receiving the View instance and parsed Vega spec
  // result.view is the View, which resides under the '#vis' element
});
