/* global vega, vl */


// stackoverflow
function getParameterByName(name) {
    const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
// stackoverflow
function filterOutliers(someArray) {
    const values = someArray.concat();
    values.sort((a, b) => a.duration - b.duration);

    const q1 = values[Math.floor((values.length / 4))].duration;
    const q3 = values[Math.ceil((values.length * (3 / 4)))].duration;
    const iqr = q3 - q1;

    const maxValue = q3 + iqr * 3;
    const minValue = q1 - iqr * 3;

    const filteredValues = values.filter(x => (x.duration < maxValue) && (x.duration > minValue));

    return filteredValues;
}

// create spec
function process(data) {
    Promise.all(data).then((total_builds) => {
        const json = total_builds.map(m => m.json());
        Promise.all(json).then((ret) => {
            let d = Array.prototype.concat.apply([], ret);
            if (!d.length) {
                document.querySelector('#view').innerHTML = '<div class="alert alert-warning">Error: no results found for repository</div>';
                return;
            }

            d.map((r) => { if (r.result == 0) r.state = 'succeeded'; });
            d.map((r) => { if (r.result == 1) r.state = 'failed'; });
            d.map((r) => { if (r.result == null) r.state = 'errored'; });
            d.map((r) => { r.duration /= 60; });
            d = filterOutliers(d);
            const spec = {
                description: 'Travis-CI builds',
                data: { values: d },
                mark: 'point',
                encoding: {
                    y: { field: 'duration', type: 'quantitative', axis: { title: 'Duration (minutes)' } },
                    x: { field: 'finished_at', type: 'temporal', axis: { title: 'Date' } },
                    color: { field: 'state', type: 'nominal', scale: { range: ['#d62728', '#ff7f0e', '#1f77b4'] } },
                },
                width: 1000,
                height: 400,
            };


            const vgSpec = vl.compile(spec).spec;
            const runtime = vega.parse(vgSpec);
            const view = new vega.View(runtime);
            view.initialize(document.querySelector('#view')).run();
        }, (error) => {
            document.querySelector('#view').innerHTML = `<div class="alert alert-warning">${error}</div>`;
        });
    }, (error) => {
        document.querySelector('#view').innerHTML = `<div class="alert alert-warning">${error}</div>`;
    });
}
function graph(e) {
    const repo = document.getElementById('repo').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    document.getElementById('view').innerHTML = 'Loading...';

    window.history.replaceState({}, '', `?repo=${repo}&start=${start}&end=${end}`);


    const data = [];
    let iter = +start;
    let intervalId = null;
    const fetcher = function () {
        if (iter < +end) {
            const builds = fetch(`https://api.travis-ci.org/repos/${repo}/builds?after_number=${iter}`);
            data.push(builds);
            document.getElementById('view').innerHTML = `Loading build ${iter}...`;
        } else {
            clearInterval(intervalId);
            process(data);
        }
        iter += 25;
    };

    intervalId = setInterval(fetcher, 200);
    e && e.preventDefault();
}

document.querySelector('form').addEventListener('submit', graph);

const f = getParameterByName;
if (f('repo')) document.getElementById('repo').value = f('repo');
if (f('start')) document.getElementById('start').value = f('start');
if (f('end')) document.getElementById('end').value = f('end');
graph();

