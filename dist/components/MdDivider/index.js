/*!
 * vue-material v1.0.0-beta-15
 * Made with <3 by marcosmoura 2021
 * Released under the MIT License.
 */
!(function(e,t){var n,r;if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("vue"));else if("function"==typeof define&&define.amd)define(["vue"],t);else{n=t("object"==typeof exports?require("vue"):e.Vue);for(r in n)("object"==typeof exports?exports:e)[r]=n[r]}})("undefined"!=typeof self?self:this,(function(e){return (function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=550)})({0:function(e,t){e.exports=function(e,t,n,r,o,u){var i,a,s,c,l,f=e=e||{},d=typeof e.default;return"object"!==d&&"function"!==d||(i=e,f=e.default),a="function"==typeof f?f.options:f,t&&(a.render=t.render,a.staticRenderFns=t.staticRenderFns,a._compiled=!0),n&&(a.functional=!0),o&&(a._scopeId=o),u?(s=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),r&&r.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(u)},a._ssrRegister=s):r&&(s=r),s&&(c=a.functional,l=c?a.render:a.beforeCreate,c?(a._injectStyles=s,a.render=function(e,t){return s.call(t),l(e,t)}):a.beforeCreate=l?[].concat(l,s):[s]),{esModule:i,exports:f,options:a}}},189:function(e,t,n){"use strict";var r,o;Object.defineProperty(t,"__esModule",{value:!0}),r=n(2),o=(function(e){return e&&e.__esModule?e:{default:e}})(r),t.default=new o.default({name:"MdDivider",computed:{insideList:function(){return"md-list"===this.$parent.$options._componentTag}}})},2:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o,u,i,a;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t={props:{mdTheme:null},computed:{$mdActiveTheme:function(){var e=u.default.enabled,t=u.default.getThemeName,n=u.default.getAncestorTheme;return e&&!1!==this.mdTheme?t(this.mdTheme||n(this)):null}}};return(0,a.default)(t,e)},o=n(6),u=r(o),i=n(8),a=r(i)},3:function(t,n){t.exports=e},385:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o,u,i,a;Object.defineProperty(t,"__esModule",{value:!0}),o=n(5),u=r(o),i=n(386),a=r(i),t.default=function(e){(0,u.default)(e),e.component(a.default.name,a.default)}},386:function(e,t,n){"use strict";function r(e){n(387)}var o,u,i,a,s,c,l,f,d,m;Object.defineProperty(t,"__esModule",{value:!0}),o=n(189),u=n.n(o);for(i in o)"default"!==i&&(function(e){n.d(t,e,(function(){return o[e]}))})(i);a=n(388),s=n(0),c=!1,l=r,f=null,d=null,m=s(u.a,a.a,c,l,f,d),t.default=m.exports},387:function(e,t){},388:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.insideList?n("li",{staticClass:"md-divider",class:[e.$mdActiveTheme]}):n("hr",{staticClass:"md-divider",class:[e.$mdActiveTheme]})},o=[],u={render:r,staticRenderFns:o};t.a=u},5:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o,u,i,a,s;Object.defineProperty(t,"__esModule",{value:!0}),n(9),o=n(7),u=r(o),i=n(6),a=r(i),s=function(){var e=new u.default({ripple:!0,theming:{},locale:{startYear:1900,endYear:2099,dateFormat:"yyyy-MM-dd",days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shorterDays:["S","M","T","W","T","F","S"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"],shorterMonths:["J","F","M","A","M","Ju","Ju","A","Se","O","N","D"],firstDayOfAWeek:0,cancel:"Cancel",confirm:"Ok"},router:{linkActiveClass:"router-link-active"}});return Object.defineProperties(e.theming,{metaColors:{get:function(){return a.default.metaColors},set:function(e){a.default.metaColors=e}},theme:{get:function(){return a.default.theme},set:function(e){a.default.theme=e}},enabled:{get:function(){return a.default.enabled},set:function(e){a.default.enabled=e}}}),e},t.default=function(e){e.material||(e.material=s(),e.prototype.$material=e.material)}},550:function(e,t,n){e.exports=n(385)},6:function(e,t,n){"use strict";var r,o,u,i,a;Object.defineProperty(t,"__esModule",{value:!0}),r=n(3),o=(function(e){return e&&e.__esModule?e:{default:e}})(r),u=null,i=null,a=null,t.default=new o.default({data:function(){return{prefix:"md-theme-",theme:"default",enabled:!0,metaColors:!1}},computed:{themeTarget:function(){return!this.$isServer&&document.documentElement},fullThemeName:function(){return this.getThemeName()}},watch:{enabled:{immediate:!0,handler:function(){var e=this.fullThemeName,t=this.themeTarget,n=this.enabled;t&&(n?(t.classList.add(e),this.metaColors&&this.setHtmlMetaColors(e)):(t.classList.remove(e),this.metaColors&&this.setHtmlMetaColors()))}},theme:function(e,t){var n=this.getThemeName,r=this.themeTarget;e=n(e),r.classList.remove(n(t)),r.classList.add(e),this.metaColors&&this.setHtmlMetaColors(e)},metaColors:function(e){e?this.setHtmlMetaColors(this.fullThemeName):this.setHtmlMetaColors()}},methods:{getAncestorTheme:function(e){var t,n=this;return e?(t=e.mdTheme,(function e(r){if(r){var o=r.mdTheme,u=r.$parent;return o&&o!==t?o:e(u)}return n.theme})(e.$parent)):null},getThemeName:function(e){var t=e||this.theme;return this.prefix+t},setMicrosoftColors:function(e){u&&u.setAttribute("content",e)},setThemeColors:function(e){i&&i.setAttribute("content",e)},setMaskColors:function(e){a&&a.setAttribute("color",e)},setHtmlMetaColors:function(e){var t,n="#fff";e&&(t=window.getComputedStyle(document.documentElement),n=t.getPropertyValue("--"+e+"-primary")),n&&(this.setMicrosoftColors(n),this.setThemeColors(n),this.setMaskColors(n))}},mounted:function(){var e=this;u=document.querySelector('[name="msapplication-TileColor"]'),i=document.querySelector('[name="theme-color"]'),a=document.querySelector('[rel="mask-icon"]'),this.enabled&&this.metaColors&&window.addEventListener("load",(function(){e.setHtmlMetaColors(e.fullThemeName)}))}})},7:function(e,t,n){"use strict";var r,o;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t={};return o.default.util.defineReactive(t,"reactive",e),t.reactive},r=n(3),o=(function(e){return e&&e.__esModule?e:{default:e}})(r)},8:function(e,t,n){!(function(t,n){e.exports=n()})(0,(function(){"use strict";function e(e){return!!e&&"object"==typeof e}function t(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||n(e)}function n(e){return e.$$typeof===f}function r(e){return Array.isArray(e)?[]:{}}function o(e,t){return!1!==t.clone&&t.isMergeableObject(e)?s(r(e),e,t):e}function u(e,t,n){return e.concat(t).map((function(e){return o(e,n)}))}function i(e,t){if(!t.customMerge)return s;var n=t.customMerge(e);return"function"==typeof n?n:s}function a(e,t,n){var r={};return n.isMergeableObject(e)&&Object.keys(e).forEach((function(t){r[t]=o(e[t],n)})),Object.keys(t).forEach((function(u){n.isMergeableObject(t[u])&&e[u]?r[u]=i(u,n)(e[u],t[u],n):r[u]=o(t[u],n)})),r}function s(e,t,n){var r,i,s;return n=n||{},n.arrayMerge=n.arrayMerge||u,n.isMergeableObject=n.isMergeableObject||c,r=Array.isArray(t),i=Array.isArray(e),s=r===i,s?r?n.arrayMerge(e,t,n):a(e,t,n):o(t,n)}var c=function(n){return e(n)&&!t(n)},l="function"==typeof Symbol&&Symbol.for,f=l?Symbol.for("react.element"):60103;return s.all=function(e,t){if(!Array.isArray(e))throw Error("first argument should be an array");return e.reduce((function(e,n){return s(e,n,t)}),{})},s}))},9:function(e,t){}})}));