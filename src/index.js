/* global vegaTooltip, vegaEmbed, vega, vl */
import '@babel/polyfill';

const pLimit = require('p-limit');
const headers = new Headers({ 'Travis-API-Version': '3' });


// stackoverflow
function filterOutliers(someArray) {
    const values = someArray.concat();
    values.sort((a, b) => a.duration - b.duration);

    const q1 = values[Math.floor((values.length / 4))].duration;
    const q3 = values[Math.ceil((values.length * (3 / 4)))].duration;
    const iqr = q3 - q1;

    const maxValue = q3 + (iqr * 3);
    const minValue = q1 - (iqr * 3);

    const filteredValues = values.filter(x => (x.duration < maxValue) && (x.duration > minValue));

    return filteredValues;
}

// create spec
async function process(d) {
    const data = d.map(m => ({
        message: (m.commit || {}).message,
        branch: (m.branch || {}).name,
        duration: m.duration,
        number: m.number,
        finished_at: m.finished_at,
        state: m.state,
    }));
    if (!data.length) {
        throw new Error('No results found for this repository');
    }

    for (let i = 0; i < data.length; i += 1) {
        data[i].duration /= 60;
    }
    const spec = {
        data: { values: filterOutliers(data) },
        vconcat: [
            {
                description: 'Travis-CI builds (zoom view)',
                width: 1000,
                height: 300,
                mark: 'point',
                bind: "scales",
                encoding: {
                    y: { field: 'duration', type: 'quantitative', axis: { title: 'Duration (minutes)' } },
                    x: {
                        field: 'finished_at',
                        type: 'temporal',
                        axis: { title: 'Date' },
                        scale: { domain: { selection: 'brush' } },
                    },
                    color: {
                        field: 'state',
                        type: 'nominal',
                        scale: {
                            domain: ['failed', 'errored', 'canceled', 'passed'],
                            range: ['#d62728', '#ff7f0e', '#5ab43c', '#1f77b4'],
                        },
                    },
                },
            },
            {
                description: 'Travis-CI builds (click+drag to zoom)',
                width: 1000,
                height: 300,
                mark: 'point',
                selection: {
                    brush: {
                        type: 'interval',
                        encodings: ['x'],
                        on: '[mousedown, window:mouseup] > window:mousemove!',
                        translate: '[mousedown, window:mouseup] > window:mousemove!',
                        zoom: 'wheel!',
                        mark: { fill: '#333', fillOpacity: 0.125, stroke: 'white' },
                        resolve: 'global',
                    },
                },
                encoding: {
                    y: { field: 'duration', type: 'quantitative', axis: { title: 'Duration (minutes)' } },
                    x: {
                        field: 'finished_at',
                        type: 'temporal',
                        axis: { title: 'Date' },
                        scale: { domain: { selection: 'brush' } },
                    },
                    color: {
                        field: 'state',
                        type: 'nominal',
                        scale: {
                            domain: ['failed', 'errored', 'canceled', 'passed'],
                            range: ['#d62728', '#ff7f0e', '#5ab43c', '#1f77b4'],
                        },
                    },
                },
            },
        ],
    };

    vegaEmbed('#view', spec, { mode: 'vega-lite' }).then((result) => {
        vegaTooltip.vegaLite(result.view, spec);
    });
}


async function graph(e) {
    if (e) {
        e.preventDefault();
    }
    const repo = encodeURIComponent(document.getElementById('repo').value);
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    document.getElementById('view').innerHTML = 'Loading...';


    const nBuilds = 100;
    const prefix = `https://api.travis-ci.org/repo/${repo}/builds`;
    window.history.replaceState({}, '', `?repo=${repo}&start=${start}&end=${end}`);
    const input = [];
    const limit = pLimit(3);

    for (let i = +start; i <= +end; i += nBuilds) {
        input.push(limit(() => {
            document.getElementById('view').innerHTML = `Loading build ${i}...`;
            return fetch(`${prefix}?limit=${nBuilds}&offset=${i}&sort_by=id`, { headers });
        }));
    }

    const result = await Promise.all(input);
    const ret = await Promise.all(result.map(m => m.json()));
    const builds = ret.map(m => m.builds);
    return process([].concat(...builds));
}

function catchgraph(e) {
    graph(e).catch((error) => {
        document.querySelector('#view').innerHTML = `<div class="alert alert-warning">${error}</div>`;
        console.error(error);
    });
}

document.querySelector('form').addEventListener('submit', catchgraph);
document.getElementById('lookup').addEventListener('click', async function(e) {
    if (e) {
        e.preventDefault();
    }
    const repo = encodeURIComponent(document.getElementById('repo').value);
    const prefix = `https://api.travis-ci.org/repo/${repo}/builds`;
    const res = await fetch(`${prefix}?sort_by=id:desc`, { headers });
    if (res.status !== 200) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    const resjs = await res.json();
    const total = +resjs.builds[0].number;
    const start = Math.max(1,total-1000);
    document.getElementById('end').value = total;
    document.getElementById('start').value = start;
    window.history.replaceState({}, '', `?repo=${repo}&start=${start}&end=${total}`);
});

const params = new URLSearchParams(window.location.search.slice(1));
if (params.get('repo')) document.getElementById('repo').value = params.get('repo');
if (params.get('start')) document.getElementById('start').value = params.get('start');
if (params.get('end')) document.getElementById('end').value = params.get('end');


catchgraph();


document.getElementById('versions').innerHTML = `vega: ${vega.version} vega-lite: ${vl.version}`;
