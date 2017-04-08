/* global vega, vl */


//stackoverflow
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
//stackoverflow
function filterOutliers(someArray) {  
    var values = someArray.concat();
    values.sort( function(a, b) {
        return a.duration - b.duration;
    });

    var q1 = values[Math.floor((values.length / 4))].duration;
    var q3 = values[Math.ceil((values.length * (3 / 4)))].duration;
    var iqr = q3 - q1;

    var maxValue = q3 + iqr*3;
    var minValue = q1 - iqr*3;

    var filteredValues = values.filter(function(x) {
        return (x.duration < maxValue) && (x.duration > minValue);
    });

    return filteredValues;
}

// create spec
function process(data) {
    Promise.all(data).then(function(total_builds) {
        var json = total_builds.map(function(m) { return m.json(); });
        Promise.all(json).then(function(ret) {
            var d = Array.prototype.concat.apply([], ret);
            if(!d.length) {
                document.querySelector('#view').innerHTML = '<div class="alert alert-warning">Error: no results found for repository</div>';
                return;
            }

            d.map(function(r) { if(r.result==0) r.state='succeeded'; });
            d.map(function(r) { if(r.result==1) r.state='failed'; });
            d.map(function(r) { if(r.result==null) r.state='errored'; });
            d.map(function(r) { r.duration/=60; });
            d=filterOutliers(d);
            var spec = {
                description: 'Travis-CI builds',
                data: { values: d },
                mark: 'point',
                encoding: {
                    y: {field: 'duration',type: 'quantitative', axis: {title: 'Duration (minutes)'} },
                    x: {field: 'finished_at',type: 'temporal', axis: {title: 'Date'} },
                    color: {field: 'state', type: 'nominal', scale: {range: ['#d62728', '#ff7f0e', '#1f77b4']}},
                },
                width: 1000,
                height: 400
            };


            var vgSpec = vl.compile(spec).spec;
            var runtime = vega.parse(vgSpec);
            var view = new vega.View(runtime);
            view.initialize(document.querySelector('#view')).run();
        }, function(error) {
            document.querySelector('#view').innerHTML = '<div class="alert alert-warning">'+error+'</div>';
        });
    }, function(error) {
        document.querySelector('#view').innerHTML = '<div class="alert alert-warning">'+error+'</div>';
    });
}
function graph(e) {
    var repo = document.getElementById('repo').value;
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    document.getElementById('view').innerHTML = 'Loading...';

    window.history.replaceState({}, '', '?repo='+repo+'&start='+start+'&end='+end);


    var data = [];
    var iter = +start;
    var intervalId = null;
    var fetcher = function() {
        if(iter < +end) {
            var builds = fetch('https://api.travis-ci.org/repos/' + repo + '/builds?after_number=' + iter);
            data.push(builds);
            document.getElementById('view').innerHTML = 'Loading build '+iter+'...';
        } else {
            clearInterval(intervalId);
            process(data);
        }
        iter += 25;
    };
    
    intervalId = setInterval(fetcher, 200);
    e&&e.preventDefault();
}

document.querySelector('form').addEventListener('submit',graph);

var ret = getParameterByName('repo');
if(ret) document.getElementById('repo').value = ret;
ret = getParameterByName('start');
if(ret) document.getElementById('start').value = ret;
ret = getParameterByName('end');
if(ret) document.getElementById('end').value = ret;
graph();

