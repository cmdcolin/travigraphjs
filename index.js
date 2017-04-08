var vg = require('vega');
var vl = require('vega-lite');
// Assign the specification to a local variable vlSpec.
var vlSpec = {
  "description": "A scatterplot showing horsepower and miles per gallons for various cars.",
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"}
  }
}

//var embedSpec = {
//  mode: "vega-lite",  // Instruct Vega-Embed to use the Vega-Lite compiler
//  spec: vlSpec
//  // You can add more vega-embed configuration properties here.
//  // See https://github.com/vega/vega/wiki/Embed-Vega-Web-Components#configuration-propeties for more information.
//};
//
//// Embed the visualization in the container with id `vis`
//vg.embed("#vis", embedSpec, function(error, result) {
//  // Callback receiving the View instance and parsed Vega spec
//  // result.view is the View, which resides under the '#vis' element
//});
//
//

var vgSpec = vl.compile(vlSpec).spec;
console.log(vgSpec)

// parse a spec and create a visualization view
vg.parse.spec(vgSpec, (chart) => {
    var view = chart({ el: 'vis' }).update();

    if (animate) {
        updategraph(view, csvdata, 1);
    }
});
