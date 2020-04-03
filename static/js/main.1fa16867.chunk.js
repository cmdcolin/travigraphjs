(this.webpackJsonptravigraphjs=this.webpackJsonptravigraphjs||[]).push([[0],{113:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a.n(n),i=a(57),o=a.n(i),c=(a(73),a(29)),s=a(4),u=a(3),l=a.n(u),d=a(5),m=a(13),p=a(119),b=a(58),h=a.n(b),f=a(59),v=a.n(f),g=a(60),j=a(17);var E=function(e){var t=e.onSubmit,a=e.initialValues,n=Object(j.b)({onSubmit:t,initialValues:a}),i=n.form,o=n.handleSubmit,c=n.pristine,s=n.submitting,u=Object(j.a)("repo",i),l=Object(j.a)("token",i),d=Object(j.a)("com",i),m=Object(j.a)("queue",i);return r.a.createElement("form",{onSubmit:o},r.a.createElement("div",null,r.a.createElement("label",null,"Repo name"),r.a.createElement("input",u.input)),r.a.createElement("div",null,r.a.createElement("label",null,"Authorization token (only needed for private)"),r.a.createElement("input",l.input)),r.a.createElement("div",null,r.a.createElement("label",null,"On travis-ci.com instead of travis-ci.org?"),r.a.createElement("input",Object.assign({type:"checkbox",id:d.input.name,checked:d.input.value},d.input))),r.a.createElement("div",null,r.a.createElement("label",null,"View queue time instead of build duration?"),r.a.createElement("input",Object.assign({type:"checkbox",id:m.input.name,checked:m.input.value},m.input))),r.a.createElement("button",{type:"submit",disabled:c||s},"Submit"))};function O(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(!e.length)return[];var t=e.concat();t.sort((function(e,t){return e.duration-t.duration}));var a=t[Math.floor(t.length/4)].duration,n=t[Math.min(Math.ceil(t.length*(3/4)),t.length-1)].duration,r=n-a,i=n+3*r,o=a-3*r;return t.filter((function(e){return e.duration<i&&e.duration>o&&!!e.finished_at}))}var k={$schema:"https://vega.github.io/schema/vega-lite/v4.json",width:1e3,height:400,mark:{type:"point",tooltip:{content:"data"}},data:{name:"values"},selection:{grid:{type:"interval",bind:"scales"}},encoding:{y:{field:"duration",type:"quantitative",axis:{title:"Duration (minutes)"}},x:{field:"finished_at",timeUnit:"yearmonthdatehoursminutes",type:"temporal",scale:{nice:"week"},axis:{title:"Date"}},color:{field:"state",type:"nominal",scale:{domain:["passed","failed","errored","canceled"],range:["#39aa56","#ff7f0e","#db4545","#9d9d9d"]}}}},w={$schema:"https://vega.github.io/schema/vega-lite/v4.json",width:1e3,height:400,mark:{type:"point",tooltip:{content:"data"}},data:{name:"values"},selection:{grid:{type:"interval",bind:"scales"}},encoding:{y:{field:"queue",type:"quantitative",axis:{title:"Queue time (minutes)"}},x:{field:"finished_at",timeUnit:"yearmonthdatehoursminutes",type:"temporal",scale:{nice:"week"},axis:{title:"Date"}},color:{field:"state",type:"nominal",scale:{domain:["passed","failed","errored","canceled"],range:["#39aa56","#ff7f0e","#db4545","#9d9d9d"]}}}},x=new h.a({cache:new v.a({maxSize:1e3}),fill:function(e,t){return Object(d.a)(l.a.mark((function a(){var n,r,i,o,c;return l.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return n=e.url,r=e.headers,a.next=3,Object(g.a)(n,{headers:r,signal:t});case 3:if((i=a.sent).ok){a.next=6;break}throw new Error("failed http status ".concat(i.status));case 6:return a.next=8,i.json();case 8:return o=a.sent,c=O(o.builds.map((function(e){var t=e.started_at&&e.commit.committed_at?(new Date(e.updated_at||e.started_at)-new Date(e.commit.committed_at))/6e4:0;return console.log(e),{message:(e.commit||{}).message.slice(0,20),branch:(e.branch||{}).name,duration:e.duration/60,queue:t>500?0:t,number:e.number,commit_sha:e.commit.sha,compare:e.commit.compare_url,finished_at:e.finished_at,state:e.state}}))),a.abrupt("return",c);case 11:case"end":return a.stop()}}),a)})))()}});function y(e){var t=e.counter,a=e.com,n=e.repo,r=e.end,i="https://api.travis-ci.".concat(a?"com":"org","/repo/").concat(encodeURIComponent(n),"/builds?limit=").concat(100),o=100*t,c="".concat(i,"&offset=").concat(o,"&sort_by=id");return o<r?c:void 0}function S(e){var t=e.com,a=e.repo;return"https://api.travis-ci.".concat(t?"com":"org","/repo/").concat(encodeURIComponent(a),"/builds?limit=1&offset=-1")}function _(){var e=Object(n.useState)(new AbortController),t=Object(s.a)(e,2),a=t[0],i=t[1],o=Object(m.d)({repo:m.c,start:m.b,end:m.b,com:m.a,queue:m.a,token:m.c}),u=Object(s.a)(o,2),b=u[0],h=u[1],f=function(e,t){var a=Object(n.useState)(0),r=Object(s.a)(a,2),i=r[0],o=r[1],u=Object(n.useState)(),m=Object(s.a)(u,2),p=m[0],b=m[1],h=Object(n.useState)(t.repo?"Loading...":"Enter a repo"),f=Object(s.a)(h,2),v=f[0],g=f[1],j=Object(n.useState)([]),E=Object(s.a)(j,2),O=E[0],k=E[1],w=Object(n.useState)(),_=Object(s.a)(w,2),A=_[0],q=_[1],C={"Travis-API-Version":"3"};t.token&&(C.Authorization="token "+t.token);var D=new Headers(C);return Object(n.useEffect)((function(){Object(d.a)(l.a.mark((function e(){var a,n,r,i;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==A||void 0===t.repo){e.next=9;break}return a=S(t),e.next=4,fetch(a,{headers:D});case 4:return n=e.sent,e.next=7,n.json();case 7:(r=e.sent.builds)&&r.length&&(i=+r[0].number,q(i));case 9:case"end":return e.stop()}}),e)})))()})),Object(n.useEffect)((function(){Object(d.a)(l.a.mark((function a(){var n,r;return l.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(a.prev=0,void 0===A){a.next=14;break}if(!t||!t.repo){a.next=14;break}if(g("Loading build ".concat(100*i,"/").concat(A)),!(n=y(Object(c.a)({},t,{counter:i,end:A})))){a.next=13;break}return a.next=8,x.get(JSON.stringify({url:n,headers:D}),{url:n,headers:D},e);case 8:r=a.sent,k(O.concat(r)),o(i+1),a.next=14;break;case 13:O.length?g(void 0):b("No builds loaded");case 14:a.next=19;break;case 16:a.prev=16,a.t0=a.catch(0),"AbortError"!==(s=a.t0).name&&"ERR_ABORTED"!==s.code&&"AbortError: aborted"!==s.message&&"Error: aborted"!==s.message&&(console.error(a.t0),b(a.t0.message));case 19:case"end":return a.stop()}var s}),a,null,[[0,16]])})))()}),[v,t,i,O,e,D,A]),[v,p,O]}(a.signal,b),v=Object(s.a)(f,3),g=v[0],j=v[1],O=v[2];return r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"travigraph-js - Travis-CI duration graph"),r.a.createElement("p",null,"Enter a repo name and optionally an authorization token, used for private repos Also specify whether this is on travis-ci.com or travis-ci.org with the checkbox. NOTE: The repository name is case sensitive!"),r.a.createElement(E,{initialValues:b,onSubmit:function(e){g&&a.abort(),i(new AbortController),h(e)},onCancel:function(){g&&a.abort()}}),j?r.a.createElement("p",{style:{color:"red"}},j):g?r.a.createElement("p",null,g):r.a.createElement(p.a,{data:{values:O},spec:b.queue?w:k}),r.a.createElement("a",{href:"https://github.com/cmdcolin/travigraphjs/"},"travigraph@GitHub"))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},68:function(e,t,a){e.exports=a(113)},73:function(e,t,a){}},[[68,1,2]]]);
//# sourceMappingURL=main.1fa16867.chunk.js.map