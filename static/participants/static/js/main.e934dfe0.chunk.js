(this.webpackJsonpparticipants=this.webpackJsonpparticipants||[]).push([[0],{69:function(e,t,a){},77:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(20),s=a.n(c),i=a(10),o=(a(69),a(55)),u=a(79),l=a(2),b=a(27),j=Object(b.b)({name:"alertSlice",initialState:{show:!1,variant:"success",text:""},reducers:{alertHide:function(e){return Object(l.a)(Object(l.a)({},e),{},{show:!1})},alertShow:function(e,t){var a=t.payload;return Object(l.a)(Object(l.a)({},e),{},{show:!0,variant:a.variant,text:a.text})}}}),d=j.actions,O=d.alertHide,p=d.alertShow,f=j.reducer,h=a(1),m=function(){var e=Object(i.c)((function(e){return e.alertState})),t=e.show,a=e.variant,n=e.text,r=Object(i.b)();return t?Object(h.jsx)(u.a,{variant:a,dismissible:!0,className:"position-fixed top-0 left-0 mt-1 w-100",style:{zIndex:1080},onClose:function(){return r(O())},children:n}):Object(h.jsx)(h.Fragment,{})},x=a(80),v=a(85),g=a(84),S=Object(b.b)({name:"authSlice",initialState:{id:null},reducers:{authSliceLogin:function(e,t){var a=t.payload;return Object(l.a)(Object(l.a)({},e),{},{id:a._id,name:a.name})},authSliceLogout:function(e){return Object(l.a)(Object(l.a)({},e),{},{id:null,name:null})}}}),w=S.actions,k=w.authSliceLogin,y=w.authSliceLogout,N=S.reducer,E=function(){var e=Object(i.b)(),t=Object(n.useCallback)((function(t){var a=t._id,n=t.name;e(k({_id:a,name:n})),localStorage.setItem("drobot-participant",JSON.stringify({_id:a,name:n}))}),[e]),a=Object(n.useCallback)((function(){e(y()),localStorage.removeItem("drobot-participant")}),[e]);return Object(n.useEffect)((function(){try{var e=JSON.parse(localStorage.getItem("drobot-participant")),a=e._id,n=e.name;a&&t({_id:a,name:n})}catch(r){}}),[t]),{login:t,logout:a}},R=function(){var e=Object(i.c)((function(e){return e.authState})).id,t=E().logout;return e?Object(h.jsx)(x.a,{fluid:!0,className:"p-0",children:Object(h.jsxs)(v.a,{bg:"light",expand:"lg",className:"px-1",children:[Object(h.jsx)(v.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(h.jsx)(v.a.Collapse,{id:"basic-navbar-nav",children:Object(h.jsx)(g.a,{className:"ms-auto",children:Object(h.jsx)(g.a.Link,{href:"#",onClick:t,children:"\u0412\u044b\u0445\u043e\u0434"})})})]})}):null},C=a(81),I=function(){var e=Object(i.c)((function(e){return e.loaderState})).show;return Object(h.jsx)(x.a,{fluid:!0,className:"min-vh-100 m-0 position-fixed top-0 left-0 justify-content-center align-items-center "+(e?"d-flex":"d-none"),style:{backgroundColor:"rgba(255, 255, 255, 0.85)"},children:Object(h.jsx)(C.a,{animation:"border",variant:"primary"})})},J=a(9),L=a(7),_=a(12),A=a.n(_),P=a(25),T=a(6),V=Object(b.b)({name:"loaderSlice",initialState:{show:!1},reducers:{loaderSetShow:function(e,t){return{show:t.payload}}}}),B=V.actions.loaderSetShow,F=V.reducer,H=function(){var e=Object(n.useState)(null),t=Object(T.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)(!1),s=Object(T.a)(c,2),o=s[0],u=s[1],l=Object(n.useState)(0),b=Object(T.a)(l,2),j=b[0],d=b[1],O=E().auth,f=Object(i.b)(),h=Object(n.useCallback)(function(){var e=Object(P.a)(A.a.mark((function e(t){var a,n,c,s,i,o,l=arguments;return A.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=l.length>1&&void 0!==l[1]?l[1]:"GET",n=l.length>2&&void 0!==l[2]?l[2]:null,c=l.length>3&&void 0!==l[3]?l[3]:{},u(!0),c["Content-Type"]="application/json",c.Authorization="Base ".concat(O),n&&(n=JSON.stringify(n)),e.prev=7,e.next=10,fetch(t,{method:a,body:n,headers:c});case 10:return s=e.sent,e.next=13,s.text();case 13:i=e.sent,e.prev=14,JSON.parse(i),e.next=21;break;case 18:throw e.prev=18,e.t0=e.catch(14),new Error("INVALID SERVER RESPONSE");case 21:if(o=JSON.parse(i),s.ok){e.next=24;break}throw new Error(o.message||"SERVER ERROR");case 24:return u(!1),e.abrupt("return",o);case 28:throw e.prev=28,e.t1=e.catch(7),u(!1),r(e.t1.message),e.t1;case 33:case"end":return e.stop()}}),e,null,[[7,28],[14,18]])})));return function(t){return e.apply(this,arguments)}}(),[O]),m=Object(n.useCallback)(function(){var e=Object(P.a)(A.a.mark((function e(t,a,n){var c,s,i,o,l,b,j,p,f,h,m,x,v,g,S,w,k,y=arguments;return A.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(c=y.length>3&&void 0!==y[3]?y[3]:{},s=new FormData,i=0,o=Object.entries(a);i<o.length;i++)l=Object(T.a)(o[i],2),b=l[0],j=l[1],s.append(b,j);for(p in n)f=Object(T.a)(Object.entries(n[p])[0],2),h=f[0],m=f[1],s.append(h,m);for((x=new XMLHttpRequest).open("POST",t),c.Authorization="Base ".concat(O),v=0,g=Object.entries(c);v<g.length;v++)S=Object(T.a)(g[v],2),w=S[0],k=S[1],x.setRequestHeader(w,k);return e.prev=8,e.next=11,new Promise((function(e,t){d(0),u(!0),x.send(s),x.upload.onprogress=function(e){d(parseInt(100*e.loaded/e.total))},x.onreadystatechange=function(){if(4===parseInt(x.readyState)){try{JSON.parse(x.response)}catch(n){t({message:"INVALID SERVER RESPONSE"})}var a=JSON.parse(x.response);parseInt(x.status)<300&&(d(0),u(!1),e(a)),t(a)}}}));case 11:return e.abrupt("return",e.sent);case 14:throw e.prev=14,e.t0=e.catch(8),d(0),u(!1),r(e.t0.message),e.t0;case 20:case"end":return e.stop()}}),e,null,[[8,14]])})));return function(t,a,n){return e.apply(this,arguments)}}(),[O]),x=Object(n.useCallback)(function(){var e=Object(P.a)(A.a.mark((function e(t){var a,n,c;return A.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u(!0),(a={}).Authorization="Base ".concat(O),e.prev=3,e.next=6,fetch(t,{method:"GET",body:null,headers:a});case 6:return n=e.sent,e.next=9,n.blob();case 9:if(c=e.sent,n.ok){e.next=12;break}throw new Error(c.message||"SERVER ERROR");case 12:return u(!1),e.abrupt("return",c);case 16:throw e.prev=16,e.t0=e.catch(3),u(!1),r(e.t0.message),e.t0;case 21:case"end":return e.stop()}}),e,null,[[3,16]])})));return function(t){return e.apply(this,arguments)}}(),[O]),v=Object(n.useCallback)((function(){return r(null)}),[]);return Object(n.useEffect)((function(){f(B(o))}),[o]),Object(n.useEffect)((function(){a&&f(p({text:a,variant:"danger"}))}),[a,v]),{request:h,sendFormData:m,getFile:x,loading:o,progress:j,error:a,clearError:v}},q=a(83),z=a(82),D=function(){var e=Object(n.useState)({mail:""}),t=Object(T.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)({mail:""}),s=Object(T.a)(c,2),i=s[0],o=s[1],u=Object(n.useState)(!1),b=Object(T.a)(u,2),j=b[0],d=b[1],O=H(),p=O.request,f=O.loading,m=O.error,v=O.clearError,g=E().login,S=function(){var e=Object(P.a)(A.a.mark((function e(){var t;return A.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,p("/api/masters/login","POST",a);case 3:t=e.sent,g(t),e.next=9;break;case 7:e.prev=7,e.t0=e.catch(0);case 9:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){d(!0),o((function(e){return Object(l.a)(Object(l.a)({},e),{},{mail:""})}))}),[a]),Object(n.useEffect)((function(){m&&(o((function(e){return Object(l.a)(Object(l.a)({},e),{},{mail:m})})),d(!1),v())}),[m,v]),Object(h.jsx)(x.a,{fluid:!0,className:"min-vh-100 d-flex justify-content-center align-items-center",children:Object(h.jsxs)(q.a,{noValidate:!0,validated:j,onSubmit:function(e){e.preventDefault(),""===a.mail?(o((function(e){return Object(l.a)(Object(l.a)({},e),{},{mail:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u043e\u0447\u0442\u0443"})})),d(!1)):S()},children:[Object(h.jsxs)(q.a.Group,{className:"mb-3",controlId:"formBasicEmail",children:[Object(h.jsx)(q.a.Label,{children:"\u041f\u043e\u0447\u0442\u0430"}),Object(h.jsx)(q.a.Control,{type:"email",name:"mail",value:a.mail,onChange:function(e){return r((function(t){return Object(l.a)(Object(l.a)({},t),{},Object(L.a)({},e.target.name,e.target.value))}))},isInvalid:""!==i.mail}),Object(h.jsx)(q.a.Control.Feedback,{type:"invalid",children:i.mail}),Object(h.jsx)(q.a.Text,{className:"text-muted",children:"\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0442\u0443 \u0436\u0435 \u043f\u043e\u0447\u0442\u0443, \u0447\u0442\u043e \u0438 \u043f\u0440\u0438 \u0440\u0435\u0433\u0438\u0442\u0441\u0440\u0430\u0446\u0438\u0438 \u043d\u0430 PE-2021"})]}),Object(h.jsxs)(z.a,{variant:"primary",type:"submit",disabled:f,className:"col-3",children:[!f&&Object(h.jsx)(h.Fragment,{children:"\u0412\u043e\u0439\u0442\u0438"}),f&&Object(h.jsx)(C.a,{animation:"border",variant:"white",size:"sm"})]})]})})},G=a(61),M=function(){var e=Object(n.useState)([]),t=Object(T.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)(!1),s=Object(T.a)(c,2),o=s[0],u=s[1],l=Object(n.useState)({referee:"",taks:""}),b=Object(T.a)(l,2),j=b[0],d=b[1],O=Object(n.useState)(),p=Object(T.a)(O,2),f=p[0],m=p[1],v=H().request,g=Object(i.c)((function(e){return e.authState})),S=g.id,w=g.name,k=Object(n.useCallback)(Object(P.a)(A.a.mark((function e(){var t;return A.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v("/api/masters/get-comments","POST",{id:S});case 3:t=e.sent,r(t),e.next=9;break;case 7:e.prev=7,e.t0=e.catch(0);case 9:case"end":return e.stop()}}),e,null,[[0,7]])}))),[v,S]),y=function(){var e=Object(P.a)(A.a.mark((function e(t){return A.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:m(t.target.getAttribute("data-link")),d({referee:t.target.getAttribute("data-referee"),task:t.target.getAttribute("data-task")}),u(!0);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(n.useEffect)(k,[k]),Object(h.jsxs)(x.a,{fluid:!0,children:[Object(h.jsx)("h3",{children:w}),a.map((function(e){var t=e._id,a=e.competition,n=e.comments;return Object(h.jsxs)("div",{className:"mb-3",children:[Object(h.jsx)("p",{children:a}),n.map((function(e){var t=e._id,a=e.categoryName,n=e.items;return Object(h.jsxs)("div",{className:"mb-3",children:[Object(h.jsx)("p",{children:a}),n.map((function(e){var t=e._id,a=e.refereeName,n=e.taskName,r=e.link;return Object(h.jsx)("button",{className:"p-2 rounded bg-light mb-1 w-100 border-0","data-link":r,"data-referee":a,"data-task":n,onClick:y,children:Object(h.jsxs)("span",{"data-link":r,"data-referee":a,"data-task":n,children:[a," - ",n]})},t)}))]},t)}))]},t)})),Object(h.jsxs)(G.a,{show:o,onHide:function(){m(null),u(!1)},placement:"bottom",children:[Object(h.jsxs)(G.a.Header,{className:"d-flex flex-column justify-content-start align-items-start",children:[Object(h.jsx)("p",{className:"m-0",children:j.referee}),Object(h.jsx)("p",{className:"m-0",children:j.task})]}),Object(h.jsx)(G.a.Body,{className:"d-flex justify-content-center align-items-center",children:Object(h.jsx)("audio",{src:f,controls:!0,autoPlay:!0,className:"w-100"})})]})]})},X=function(){return Object(i.c)((function(e){return e.authState})).id?Object(h.jsxs)(J.d,{children:[Object(h.jsx)(J.b,{path:"/participants/profile",children:Object(h.jsx)(M,{})}),Object(h.jsx)(J.a,{to:"/participants/profile"})]}):Object(h.jsxs)(J.d,{children:[Object(h.jsx)(J.b,{path:"/participants/login",children:Object(h.jsx)(D,{})}),Object(h.jsx)(J.a,{to:"/participants/login"})]})};var K=function(){return Object(h.jsxs)(o.a,{children:[Object(h.jsx)(I,{}),Object(h.jsx)(m,{}),Object(h.jsx)(R,{}),Object(h.jsx)(X,{})]})},Q=Object(b.a)({reducer:{authState:N,loaderState:F,alertState:f}});s.a.render(Object(h.jsx)(r.a.StrictMode,{children:Object(h.jsx)(i.a,{store:Q,children:Object(h.jsx)(K,{})})}),document.getElementById("root"))}},[[77,1,2]]]);
//# sourceMappingURL=main.e934dfe0.chunk.js.map