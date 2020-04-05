(this.webpackJsonptravigraphjs=this.webpackJsonptravigraphjs||[]).push([[0],{113:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a.n(n),i=a(57),c=a.n(i),o=(a(73),a(29)),l=a(4),u=a(3),s=a.n(u),m=a(5),d=a(13),b=a(119),p=a(58),h=a.n(p),f=a(59),v=a.n(f),g=a(60),E=a(17);var j=function(e){var t=e.onSubmit,a=e.initialValues,n=Object(E.b)({onSubmit:t,initialValues:a}),i=n.form,c=n.handleSubmit,o=n.pristine,l=n.submitting,u=Object(E.a)("repo",i),s=Object(E.a)("token",i),m=Object(E.a)("com",i),d=Object(E.a)("queue",i);return r.a.createElement("form",{onSubmit:c},r.a.createElement("div",null,r.a.createElement("label",null,"Repo name"),r.a.createElement("input",u.input)),r.a.createElement("div",null,r.a.createElement("label",null,"Authorization token (only needed for private)"),r.a.createElement("input",s.input)),r.a.createElement("div",null,r.a.createElement("label",null,"On travis-ci.com instead of travis-ci.org?"),r.a.createElement("input",Object.assign({type:"checkbox",id:m.input.name,checked:m.input.value},m.input))),r.a.createElement("div",null,r.a.createElement("label",null,"View queue time instead of build duration?"),r.a.createElement("input",Object.assign({type:"checkbox",id:d.input.name,checked:d.input.value},d.input))),r.a.createElement("button",{type:"submit",disabled:o||l},"Submit"))};function O(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(!e.length)return[];var t=e.concat();t.sort((function(e,t){return e.duration-t.duration}));var a=t[Math.floor(t.length/4)].duration,n=t[Math.min(Math.ceil(t.length*(3/4)),t.length-1)].duration,r=n-a,i=n+3*r,c=a-3*r;return t.filter((function(e){return e.duration<i&&e.duration>c&&!!e.finished_at}))}var k=new h.a({cache:new v.a({maxSize:1e3}),fill:function(e,t){return Object(m.a)(s.a.mark((function a(){var n,r,i,c,o;return s.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return n=e.url,r=e.headers,a.next=3,Object(g.a)(n,{headers:r,signal:t});case 3:if((i=a.sent).ok){a.next=6;break}throw new Error("failed http status ".concat(i.status));case 6:return a.next=8,i.json();case 8:return c=a.sent,o=O(c.builds.map((function(e){var t=e.started_at&&e.commit.committed_at?(new Date(e.updated_at||e.started_at)-new Date(e.commit.committed_at))/6e4:0;return{message:(e.commit||{}).message.slice(0,20),branch:(e.branch||{}).name,travisci_link:e.id,duration:e.duration/60,queue:t>500?0:t,build_number:e.number,commit_sha:e.commit.sha,compare:e.commit.compare_url,finished_at:e.finished_at,state:e.state}}))),a.abrupt("return",o);case 11:case"end":return a.stop()}}),a)})))()}});function w(e){var t=e.counter,a=e.com,n=e.repo,r=e.end,i="https://api.travis-ci.".concat(a?"com":"org","/repo/").concat(encodeURIComponent(n),"/builds?limit=").concat(100),c=100*t,o="".concat(i,"&offset=").concat(c,"&sort_by=id");return c<r?o:void 0}function y(e){var t=e.com,a=e.repo;return"https://api.travis-ci.".concat(t?"com":"org","/repo/").concat(encodeURIComponent(a),"/builds?limit=1&offset=-1")}function x(e){var t=e.build,a=e.repo,n=e.com;return r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Key"),r.a.createElement("th",null,"Value"))),r.a.createElement("tbody",null,Object.entries(t).map((function(e){var t=Object(l.a)(e,2),i=t[0],c=t[1];if("travisci_link"===i){var o="http://travis-ci.".concat(n,"/").concat(a,"/builds/").concat(c);return r.a.createElement("tr",{key:i+"_"+c},r.a.createElement("td",null,String(i)),r.a.createElement("td",null,r.a.createElement("a",{target:"_blank",href:o},o)))}return r.a.createElement("tr",{key:i+"_"+c},r.a.createElement("td",null,String(i)),r.a.createElement("td",null,String(c)))}))))}function _(){var e=Object(n.useState)(new AbortController),t=Object(l.a)(e,2),a=t[0],i=t[1],c=Object(d.d)({repo:d.c,start:d.b,end:d.b,com:d.a,queue:d.a,token:d.c}),u=Object(l.a)(c,2),p=u[0],h=u[1],f=function(e,t){var a=Object(n.useState)(0),r=Object(l.a)(a,2),i=r[0],c=r[1],u=Object(n.useState)(),d=Object(l.a)(u,2),b=d[0],p=d[1],h=Object(n.useState)(t.repo?"Loading...":"Enter a repo"),f=Object(l.a)(h,2),v=f[0],g=f[1],E=Object(n.useState)([]),j=Object(l.a)(E,2),O=j[0],x=j[1],_=Object(n.useState)(),S=Object(l.a)(_,2),A=S[0],q=S[1],C={"Travis-API-Version":"3"};t.token&&(C.Authorization="token "+t.token);var R=new Headers(C);return Object(n.useEffect)((function(){Object(m.a)(s.a.mark((function e(){var a,n,r,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==A||void 0===t.repo){e.next=9;break}return a=y(t),e.next=4,fetch(a,{headers:R});case 4:return n=e.sent,e.next=7,n.json();case 7:(r=e.sent.builds)&&r.length&&(i=+r[0].number,q(i));case 9:case"end":return e.stop()}}),e)})))()})),Object(n.useEffect)((function(){Object(m.a)(s.a.mark((function a(){var n,r;return s.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(a.prev=0,void 0===A){a.next=14;break}if(!t||!t.repo){a.next=14;break}if(g("Loading build ".concat(100*i,"/").concat(A)),!(n=w(Object(o.a)({},t,{counter:i,end:A})))){a.next=13;break}return a.next=8,k.get(JSON.stringify({url:n,headers:R}),{url:n,headers:R},e);case 8:r=a.sent,x(O.concat(r)),c(i+1),a.next=14;break;case 13:O.length?g(void 0):p("No builds loaded");case 14:a.next=19;break;case 16:a.prev=16,a.t0=a.catch(0),"AbortError"!==(l=a.t0).name&&"ERR_ABORTED"!==l.code&&"AbortError: aborted"!==l.message&&"Error: aborted"!==l.message&&(console.error(a.t0),p(a.t0.message));case 19:case"end":return a.stop()}var l}),a,null,[[0,16]])})))()}),[v,t,i,O,e,R,A]),[v,b,O]}(a.signal,p),v=Object(l.a)(f,3),g=v[0],E=v[1],O=v[2],_=Object(n.useState)(void 0),S=Object(l.a)(_,2),A=S[0],q=S[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"travigraph-js - Travis-CI duration graph"),r.a.createElement("p",null,"Enter a repo name and optionally an authorization token, used for private repos Also specify whether this is on travis-ci.com or travis-ci.org with the checkbox. NOTE: The repository name is case sensitive!"),r.a.createElement(j,{initialValues:p,onSubmit:function(e){g&&a.abort(),i(new AbortController),h(e)},onCancel:function(){g&&a.abort()}}),E?r.a.createElement("p",{style:{color:"red"}},E):g?r.a.createElement("p",null,g):r.a.createElement("div",{style:{display:"flex"}},r.a.createElement(b.a,{data:{values:O},patch:function(e){return e.signals.push({name:"barClick",value:0,on:[{events:"*:mousedown",update:"datum"}]}),e},signalListeners:{barClick:function(e,t){q(t)}},spec:{$schema:"https://vega.github.io/schema/vega-lite/v4.json",width:1e3,height:400,mark:{type:"point",tooltip:{content:"data"}},data:{name:"values"},selection:{grid:{type:"interval",bind:"scales"}},encoding:{y:p.queue?{field:"query",type:"quantitative",axis:{title:"Queue time(minutes)"}}:{field:"duration",type:"quantitative",axis:{title:"Duration (minutes)"}},x:{field:"finished_at",timeUnit:"yearmonthdatehoursminutes",type:"temporal",scale:{nice:"week"},axis:{title:"Date"}},color:{field:"state",type:"nominal",scale:{domain:["passed","failed","errored","canceled"],range:["#39aa56","#ff7f0e","#db4545","#9d9d9d"]}}}}}),A?r.a.createElement(x,{repo:p.repo,com:p.com?"com":"org",build:A}):null),r.a.createElement("a",{href:"https://github.com/cmdcolin/travigraphjs/"},"travigraph@GitHub"))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},68:function(e,t,a){e.exports=a(113)},73:function(e,t,a){}},[[68,1,2]]]);
//# sourceMappingURL=main.655c7f43.chunk.js.map