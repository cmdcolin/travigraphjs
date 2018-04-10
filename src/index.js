/* global vegaTooltip, vegaEmbed, vega, vl */
import '@babel/polyfill';


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
async function process(data) {
    const requests = await Promise.all(data);
    const ret = await requests.map(m => m.json());
    let d = [].concat(...(ret.map(m => m.builds)));
    d = d.map(m => ({
        message: m.commit.message,
        branch: (m.branch || {}).name,
        duration: m.duration,
        number: m.number,
        finished_at: m.finished_at,
        state: m.state,
    }));
    if (!d.length) {
        document.querySelector('#view').innerHTML = '<div class="alert alert-warning">Error: no results found for repository</div>';
        return;
    }

    for (let i = 0; i < d.length; i += 1) {
        d[i].duration /= 60;
    }
    d = filterOutliers(d);
    const spec = {
        description: 'Travis-CI builds',
        data: { values: d },
        mark: 'point',
        encoding: {
            y: { field: 'duration', type: 'quantitative', axis: { title: 'Duration (minutes)' } },
            x: { field: 'finished_at', type: 'temporal', axis: { title: 'Date' } },
            color: {
                field: 'state',
                type: 'nominal',
                scale: {
                    domain: ['failed', 'errored', 'cancelled', 'passed'],
                    range: ['#d62728', '#ff7f0e', '#5ab43c', '#1f77b4'],
                },
            },
        },
        width: 1000,
        height: 400,
    };

    vegaEmbed('#view', spec, { mode: 'vega-lite' }).then((result) => {
        vegaTooltip.vegaLite(result.view, spec);
    });
}

function timer(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function graph(e) {
    if (e) {
        e.preventDefault();
    }
    const repo = encodeURIComponent(document.getElementById('repo').value);
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    document.getElementById('view').innerHTML = 'Loading...';

    window.history.replaceState({}, '', `?repo=${repo}&start=${start}&end=${end}`);


    const data = [];
    const limit = 100;
    const headers = new Headers({ 'Travis-API-Version': '3' });
    const res = await fetch(`https://api.travis-ci.org/repo/${repo}/builds?sort_by=id:desc`, { headers });
    if (res.status === '404') {
        document.querySelector('#view').innerHTML = '<div class="alert alert-warning">Repo not found</div>';
        return;
    } else if (res.status !== '200') {
        document.querySelector('#view').innerHTML = `<div class="alert alert-warning">Error ${res.status}: ${res.statusText}</div>`;
        return;
    }
    const resjs = await res.json();
    document.querySelector('#totalBuilds').innerHTML = `Total number of builds: ${resjs.builds[0].number}`;
    for (let i = +start; i <= +end; i += limit) {
        const builds = fetch(`https://api.travis-ci.org/repo/${repo}/builds?limit=${limit}&offset=${i}&sort_by=id`, { headers });
        data.push(builds);
        document.getElementById('view').innerHTML = `Loading build ${i}...`;
        await timer(500);
    }
    process(data);
}

document.querySelector('form').addEventListener('submit', graph);

const params = new URLSearchParams(window.location.search.slice(1));
if (params.get('repo')) document.getElementById('repo').value = params.get('repo');
if (params.get('start')) document.getElementById('start').value = params.get('start');
if (params.get('end')) document.getElementById('end').value = params.get('end');
graph();


document.getElementById('versions').innerHTML += `vega: ${vega.version} vega-lite: ${vl.version}`;
