/*!
 * vue-material v1.0.0-beta-15
 * Made with <3 by marcosmoura 2021
 * Released under the MIT License.
 */
!(function(e,t){var n,o;if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("vue"));else if("function"==typeof define&&define.amd)define(["vue"],t);else{n=t("object"==typeof exports?require("vue"):e.Vue);for(o in n)("object"==typeof exports?exports:e)[o]=n[o]}})("undefined"!=typeof self?self:this,(function(e){return (function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=539)})({0:function(e,t){e.exports=function(e,t,n,o,r,i){var s,u,a,l,c,d=e=e||{},m=typeof e.default;return"object"!==m&&"function"!==m||(s=e,d=e.default),u="function"==typeof d?d.options:d,t&&(u.render=t.render,u.staticRenderFns=t.staticRenderFns,u._compiled=!0),n&&(u.functional=!0),r&&(u._scopeId=r),i?(a=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(i)},u._ssrRegister=a):o&&(a=o),a&&(l=u.functional,c=l?u.render:u.beforeCreate,l?(u._injectStyles=a,u.render=function(e,t){return a.call(t),c(e,t)}):u.beforeCreate=c?[].concat(c,a):[a]),{esModule:s,exports:d,options:u}}},10:function(e,t,n){"use strict";var o,r;Object.defineProperty(t,"__esModule",{value:!0}),o=n(3),r=(function(e){return e&&e.__esModule?e:{default:e}})(o),t.default=function(e,t){return{validator:function(n){return!!t.includes(n)||(r.default.util.warn("The "+e+" prop is invalid. Given value: "+n+". Available options: "+t.join(", ")+".",void 0),!1)}}}},139:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r,i,s,u,a,l,c,d;Object.defineProperty(t,"__esModule",{value:!0}),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=Object.assign||function(e){var t,n,o;for(t=1;t<arguments.length;t++){n=arguments[t];for(o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},s=n(293),u=o(s),a=n(294),l=o(a),c=n(10),d=o(c),t.default={name:"MdAutocomplete",props:{value:{type:null,required:!0},mdDense:Boolean,mdLayout:i({type:String,default:"floating"},(0,d.default)("md-layout",["floating","box"])),mdOpenOnFocus:{type:Boolean,default:!0},mdFuzzySearch:{type:Boolean,default:!0},mdOptions:{type:[Array,Promise],required:!0},mdInputName:String,mdInputId:String,mdInputMaxlength:[String,Number],mdInputPlaceholder:[String,Number]},data:function(){return{searchTerm:this.value,showMenu:!1,triggerPopover:!1,isPromisePending:!1,filteredAsyncOptions:[]}},computed:{isBoxLayout:function(){return"box"===this.mdLayout},fieldClasses:function(){if(this.isBoxLayout)return"md-autocomplete-box"},contentClasses:function(){if(this.isBoxLayout)return"md-autocomplete-box-content"},shouldFilter:function(){return this.mdOptions[0]&&this.searchTerm},filteredStaticOptions:function(){if(this.isPromise(this.mdOptions))return!1;var e=this.mdOptions[0];if(this.shouldFilter){if("string"==typeof e)return this.filterByString();if("object"===(void 0===e?"undefined":r(e)))return this.filterByObject()}return this.mdOptions},hasFilteredItems:function(){return this.filteredStaticOptions.length>0||this.filteredAsyncOptions.length>0},hasScopedEmptySlot:function(){return this.$scopedSlots["md-autocomplete-empty"]}},watch:{mdOptions:{deep:!0,immediate:!0,handler:function(){var e=this;this.isPromise(this.mdOptions)&&(this.isPromisePending=!0,this.mdOptions.then((function(t){e.filteredAsyncOptions=t,e.isPromisePending=!1})))}},value:function(e){this.searchTerm=e}},methods:{getOptions:function(){return this.isPromise(this.mdOptions)?this.filteredAsyncOptions:this.filteredStaticOptions},isPromise:function(e){return(0,l.default)(e)},matchText:function(e){var t=e.toLowerCase(),n=this.searchTerm.toLowerCase();return this.mdFuzzySearch?(0,u.default)(n,t):t.includes(n)},filterByString:function(){var e=this;return this.mdOptions.filter((function(t){return e.matchText(t)}))},filterByObject:function(){var e=this;return this.mdOptions.filter((function(t){var n,o=Object.values(t),r=o.length;for(n=0;n<=r;n++)if("string"==typeof o[n]&&e.matchText(o[n]))return!0}))},openOnFocus:function(){this.mdOpenOnFocus&&this.showOptions()},onInput:function(e){this.$emit("input",e),this.mdOpenOnFocus||this.showOptions(),"inputevent"!==(""+this.searchTerm.constructor).match(/function (\w*)/)[1].toLowerCase()&&this.$emit("md-changed",this.searchTerm)},showOptions:function(){var e=this;if(this.showMenu)return!1;this.showMenu=!0,this.$nextTick((function(){e.triggerPopover=!0,e.$emit("md-opened")}))},hideOptions:function(){var e=this;this.$nextTick((function(){e.triggerPopover=!1,e.$emit("md-closed")}))},selectItem:function(e,t){var n=t.target.textContent.trim();this.searchTerm=n,this.$emit("input",e),this.$emit("md-selected",e),this.hideOptions()}}}},290:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r,i,s,u;Object.defineProperty(t,"__esModule",{value:!0}),r=n(5),i=o(r),s=n(291),u=o(s),t.default=function(e){(0,i.default)(e),e.component(u.default.name,u.default)}},291:function(e,t,n){"use strict";function o(e){n(292)}var r,i,s,u,a,l,c,d,m,f;Object.defineProperty(t,"__esModule",{value:!0}),r=n(139),i=n.n(r);for(s in r)"default"!==s&&(function(e){n.d(t,e,(function(){return r[e]}))})(s);u=n(295),a=n(0),l=!1,c=o,d=null,m=null,f=a(i.a,u.a,l,c,d,m),t.default=f.exports},292:function(e,t){},293:function(e,t,n){"use strict";function o(e,t){var n,o,r,i=t.length,s=e.length;if(s>i)return!1;if(s===i)return e===t;e:for(n=0,o=0;n<s;n++){for(r=e.charCodeAt(n);o<i;)if(t.charCodeAt(o++)===r)continue e;return!1}return!0}e.exports=o},294:function(e,t){function n(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}e.exports=n},295:function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("md-field",{staticClass:"md-autocomplete",class:e.fieldClasses,attrs:{"md-clearable":"","md-inline":e.isBoxLayout}},[n("md-menu",{attrs:{"md-direction":"bottom-start","md-dense":e.mdDense,"md-align-trigger":"","md-full-width":"","md-active":e.showMenu},on:{"update:mdActive":function(t){e.showMenu=t},"update:md-active":function(t){e.showMenu=t}}},[n("md-input",e._b({attrs:{id:e.mdInputId,name:e.mdInputName,maxlength:e.mdInputMaxlength,placeholder:e.mdInputPlaceholder},on:{focus:function(t){return t.stopPropagation(),e.openOnFocus(t)},blur:e.hideOptions,input:e.onInput,click:function(t){return t.stopPropagation(),t.preventDefault(),e.openOnFocus(t)}},model:{value:e.searchTerm,callback:function(t){e.searchTerm=t},expression:"searchTerm"}},"md-input",e.$attrs,!1)),e._v(" "),n("md-menu-content",{directives:[{name:"show",rawName:"v-show",value:e.hasScopedEmptySlot||e.hasFilteredItems,expression:"hasScopedEmptySlot || hasFilteredItems"}],class:e.contentClasses},[e.isPromisePending?n("div",{staticClass:"md-autocomplete-loading"},[n("md-progress-spinner",{attrs:{"md-diameter":40,"md-stroke":4,"md-mode":"indeterminate"}})],1):e._e(),e._v(" "),e.hasFilteredItems?n("div",{staticClass:"md-autocomplete-items"},e._l(e.getOptions(),(function(t,o){return n("md-menu-item",{key:o,on:{click:function(n){return e.selectItem(t,n)}}},[e.$scopedSlots["md-autocomplete-item"]?e._t("md-autocomplete-item",null,{item:t,term:e.searchTerm}):[e._v(e._s(t))]],2)})),1):e.hasScopedEmptySlot?n("md-menu-item",[n("div",{staticClass:"md-autocomplete-empty"},[e._t("md-autocomplete-empty",null,{term:e.searchTerm})],2)]):e._e()],1)],1),e._v(" "),e._t("default")],2)},r=[],i={render:o,staticRenderFns:r};t.a=i},3:function(t,n){t.exports=e},5:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r,i,s,u,a;Object.defineProperty(t,"__esModule",{value:!0}),n(9),r=n(7),i=o(r),s=n(6),u=o(s),a=function(){var e=new i.default({ripple:!0,theming:{},locale:{startYear:1900,endYear:2099,dateFormat:"yyyy-MM-dd",days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shorterDays:["S","M","T","W","T","F","S"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"],shorterMonths:["J","F","M","A","M","Ju","Ju","A","Se","O","N","D"],firstDayOfAWeek:0,cancel:"Cancel",confirm:"Ok"},router:{linkActiveClass:"router-link-active"}});return Object.defineProperties(e.theming,{metaColors:{get:function(){return u.default.metaColors},set:function(e){u.default.metaColors=e}},theme:{get:function(){return u.default.theme},set:function(e){u.default.theme=e}},enabled:{get:function(){return u.default.enabled},set:function(e){u.default.enabled=e}}}),e},t.default=function(e){e.material||(e.material=a(),e.prototype.$material=e.material)}},539:function(e,t,n){e.exports=n(290)},6:function(e,t,n){"use strict";var o,r,i,s,u;Object.defineProperty(t,"__esModule",{value:!0}),o=n(3),r=(function(e){return e&&e.__esModule?e:{default:e}})(o),i=null,s=null,u=null,t.default=new r.default({data:function(){return{prefix:"md-theme-",theme:"default",enabled:!0,metaColors:!1}},computed:{themeTarget:function(){return!this.$isServer&&document.documentElement},fullThemeName:function(){return this.getThemeName()}},watch:{enabled:{immediate:!0,handler:function(){var e=this.fullThemeName,t=this.themeTarget,n=this.enabled;t&&(n?(t.classList.add(e),this.metaColors&&this.setHtmlMetaColors(e)):(t.classList.remove(e),this.metaColors&&this.setHtmlMetaColors()))}},theme:function(e,t){var n=this.getThemeName,o=this.themeTarget;e=n(e),o.classList.remove(n(t)),o.classList.add(e),this.metaColors&&this.setHtmlMetaColors(e)},metaColors:function(e){e?this.setHtmlMetaColors(this.fullThemeName):this.setHtmlMetaColors()}},methods:{getAncestorTheme:function(e){var t,n=this;return e?(t=e.mdTheme,(function e(o){if(o){var r=o.mdTheme,i=o.$parent;return r&&r!==t?r:e(i)}return n.theme})(e.$parent)):null},getThemeName:function(e){var t=e||this.theme;return this.prefix+t},setMicrosoftColors:function(e){i&&i.setAttribute("content",e)},setThemeColors:function(e){s&&s.setAttribute("content",e)},setMaskColors:function(e){u&&u.setAttribute("color",e)},setHtmlMetaColors:function(e){var t,n="#fff";e&&(t=window.getComputedStyle(document.documentElement),n=t.getPropertyValue("--"+e+"-primary")),n&&(this.setMicrosoftColors(n),this.setThemeColors(n),this.setMaskColors(n))}},mounted:function(){var e=this;i=document.querySelector('[name="msapplication-TileColor"]'),s=document.querySelector('[name="theme-color"]'),u=document.querySelector('[rel="mask-icon"]'),this.enabled&&this.metaColors&&window.addEventListener("load",(function(){e.setHtmlMetaColors(e.fullThemeName)}))}})},7:function(e,t,n){"use strict";var o,r;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t={};return r.default.util.defineReactive(t,"reactive",e),t.reactive},o=n(3),r=(function(e){return e&&e.__esModule?e:{default:e}})(o)},9:function(e,t){}})}));