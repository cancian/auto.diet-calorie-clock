﻿!function(){var a,b,c,d;!function(){var e={},f={};a=function(a,b,c){e[a]={deps:b,callback:c}},d=c=b=function(a){function c(b){if("."!==b.charAt(0))return b;for(var c=b.split("/"),d=a.split("/").slice(0,-1),e=0,f=c.length;f>e;e++){var g=c[e];if(".."===g)d.pop();else{if("."===g)continue;d.push(g)}}return d.join("/")}if(d._eak_seen=e,f[a])return f[a];if(f[a]={},!e[a])throw new Error("Could not find module "+a);for(var g,h=e[a],i=h.deps,j=h.callback,k=[],l=0,m=i.length;m>l;l++)"exports"===i[l]?k.push(g={}):k.push(b(c(i[l])));var n=j.apply(this,k);return f[a]=g||n}}(),a("promise/all",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to all.");return new b(function(b,c){function d(a){return function(b){f(a,b)}}function f(a,c){h[a]=c,0===--i&&b(h)}var g,h=[],i=a.length;0===i&&b([]);for(var j=0;j<a.length;j++)g=a[j],g&&e(g.then)?g.then(d(j),c):f(j,g)})}var d=a.isArray,e=a.isFunction;b.all=c}),a("promise/asap",["exports"],function(a){"use strict";function b(){return function(){process.nextTick(e)}}function c(){var a=0,b=new i(e),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function d(){return function(){j.setTimeout(e,1)}}function e(){for(var a=0;a<k.length;a++){var b=k[a],c=b[0],d=b[1];c(d)}k=[]}function f(a,b){var c=k.push([a,b]);1===c&&g()}var g,h="undefined"!=typeof window?window:{},i=h.MutationObserver||h.WebKitMutationObserver,j="undefined"!=typeof global?global:void 0===this?window:this,k=[];g="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?b():i?c():d(),a.asap=f}),a("promise/config",["exports"],function(a){"use strict";function b(a,b){return 2!==arguments.length?c[a]:void(c[a]=b)}var c={instrument:!1};a.config=c,a.configure=b}),a("promise/polyfill",["./promise","./utils","exports"],function(a,b,c){"use strict";function d(){var a;a="undefined"!=typeof global?global:"undefined"!=typeof window&&window.document?window:self;var b="Promise"in a&&"resolve"in a.Promise&&"reject"in a.Promise&&"all"in a.Promise&&"race"in a.Promise&&function(){var b;return new a.Promise(function(a){b=a}),f(b)}();b||(a.Promise=e)}var e=a.Promise,f=b.isFunction;c.polyfill=d}),a("promise/promise",["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],function(a,b,c,d,e,f,g,h){"use strict";function i(a){if(!v(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof i))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._subscribers=[],j(a,this)}function j(a,b){function c(a){o(b,a)}function d(a){q(b,a)}try{a(c,d)}catch(e){d(e)}}function k(a,b,c,d){var e,f,g,h,i=v(c);if(i)try{e=c(d),g=!0}catch(j){h=!0,f=j}else e=d,g=!0;n(b,e)||(i&&g?o(b,e):h?q(b,f):a===D?o(b,e):a===E&&q(b,e))}function l(a,b,c,d){var e=a._subscribers,f=e.length;e[f]=b,e[f+D]=c,e[f+E]=d}function m(a,b){for(var c,d,e=a._subscribers,f=a._detail,g=0;g<e.length;g+=3)c=e[g],d=e[g+b],k(b,c,d,f);a._subscribers=null}function n(a,b){var c,d=null;try{if(a===b)throw new TypeError("A promises callback cannot return that same promise.");if(u(b)&&(d=b.then,v(d)))return d.call(b,function(d){return c?!0:(c=!0,void(b!==d?o(a,d):p(a,d)))},function(b){return c?!0:(c=!0,void q(a,b))}),!0}catch(e){return c?!0:(q(a,e),!0)}return!1}function o(a,b){a===b?p(a,b):n(a,b)||p(a,b)}function p(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(r,a))}function q(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(s,a))}function r(a){m(a,a._state=D)}function s(a){m(a,a._state=E)}var t=a.config,u=(a.configure,b.objectOrFunction),v=b.isFunction,w=(b.now,c.all),x=d.race,y=e.resolve,z=f.reject,A=g.asap;t.async=A;var B=void 0,C=0,D=1,E=2;i.prototype={constructor:i,_state:void 0,_detail:void 0,_subscribers:void 0,then:function(a,b){var c=this,d=new this.constructor(function(){});if(this._state){var e=arguments;t.async(function(){k(c._state,d,e[c._state-1],c._detail)})}else l(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}},i.all=w,i.race=x,i.resolve=y,i.reject=z,h.Promise=i}),a("promise/race",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to race.");return new b(function(b,c){for(var d,e=0;e<a.length;e++)d=a[e],d&&"function"==typeof d.then?d.then(b,c):b(d)})}var d=a.isArray;b.race=c}),a("promise/reject",["exports"],function(a){"use strict";function b(a){var b=this;return new b(function(b,c){c(a)})}a.reject=b}),a("promise/resolve",["exports"],function(a){"use strict";function b(a){if(a&&"object"==typeof a&&a.constructor===this)return a;var b=this;return new b(function(b){b(a)})}a.resolve=b}),a("promise/utils",["exports"],function(a){"use strict";function b(a){return c(a)||"object"==typeof a&&null!==a}function c(a){return"function"==typeof a}function d(a){return"[object Array]"===Object.prototype.toString.call(a)}var e=Date.now||function(){return(new Date).getTime()};a.objectOrFunction=b,a.isFunction=c,a.isArray=d,a.now=e}),b("promise/polyfill").polyfill()}(),function(a,b){"object"==typeof exports&&"object"==typeof module?module.exports=b():"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?exports.localforage=b():a.localforage=b()}(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){"use strict";function d(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}b.__esModule=!0,function(){function a(a,b){a[b]=function(){var c=arguments;return a.ready().then(function(){return a[b].apply(a,c)})}}function e(){for(var a=1;a<arguments.length;a++){var b=arguments[a];if(b)for(var c in b)b.hasOwnProperty(c)&&(m(b[c])?arguments[0][c]=b[c].slice():arguments[0][c]=b[c])}return arguments[0]}function f(a){for(var b in h)if(h.hasOwnProperty(b)&&h[b]===a)return!0;return!1}var g={},h={INDEXEDDB:"asyncStorage",LOCALSTORAGE:"localStorageWrapper",WEBSQL:"webSQLStorage"},i=[h.INDEXEDDB,h.WEBSQL,h.LOCALSTORAGE],j=["clear","getItem","iterate","key","keys","length","removeItem","setItem"],k={description:"",driver:i.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},l=function(a){var b=b||a.indexedDB||a.webkitIndexedDB||a.mozIndexedDB||a.OIndexedDB||a.msIndexedDB,c={};return c[h.WEBSQL]=!!a.openDatabase,c[h.INDEXEDDB]=!!function(){if("undefined"!=typeof a.openDatabase&&a.navigator&&a.navigator.userAgent&&/Safari/.test(a.navigator.userAgent)&&!/Chrome/.test(a.navigator.userAgent))return!1;try{return b&&"function"==typeof b.open&&"undefined"!=typeof a.IDBKeyRange}catch(c){return!1}}(),c[h.LOCALSTORAGE]=!!function(){try{return a.localStorage&&"setItem"in a.localStorage&&a.localStorage.setItem}catch(b){return!1}}(),c}(this),m=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},n=function(){function b(a){d(this,b),this.INDEXEDDB=h.INDEXEDDB,this.LOCALSTORAGE=h.LOCALSTORAGE,this.WEBSQL=h.WEBSQL,this._config=e({},k,a),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver)}return b.prototype.config=function(a){if("object"==typeof a){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var b in a)"storeName"===b&&(a[b]=a[b].replace(/\W/g,"_")),this._config[b]=a[b];return"driver"in a&&a.driver&&this.setDriver(this._config.driver),!0}return"string"==typeof a?this._config[a]:this._config},b.prototype.defineDriver=function(a,b,c){var d=new Promise(function(b,c){try{var d=a._driver,e=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"),h=new Error("Custom driver name already in use: "+a._driver);if(!a._driver)return void c(e);if(f(a._driver))return void c(h);for(var i=j.concat("_initStorage"),k=0;k<i.length;k++){var m=i[k];if(!m||!a[m]||"function"!=typeof a[m])return void c(e)}var n=Promise.resolve(!0);"_support"in a&&(n=a._support&&"function"==typeof a._support?a._support():Promise.resolve(!!a._support)),n.then(function(c){l[d]=c,g[d]=a,b()},c)}catch(o){c(o)}});return d.then(b,c),d},b.prototype.driver=function(){return this._driver||null},b.prototype.getDriver=function(a,b,d){var e=this,h=function(){if(f(a))switch(a){case e.INDEXEDDB:return new Promise(function(a,b){a(c(1))});case e.LOCALSTORAGE:return new Promise(function(a,b){a(c(2))});case e.WEBSQL:return new Promise(function(a,b){a(c(4))})}else if(g[a])return Promise.resolve(g[a]);return Promise.reject(new Error("Driver not found."))}();return h.then(b,d),h},b.prototype.ready=function(a){var b=this,c=b._driverSet.then(function(){return null===b._ready&&(b._ready=b._initDriver()),b._ready});return c.then(a,a),c},b.prototype.setDriver=function(a,b,c){function d(){f._config.driver=f.driver()}function e(a){return function(){function b(){for(;c<a.length;){var e=a[c];return c++,f._dbInfo=null,f._ready=null,f.getDriver(e).then(function(a){return f._extend(a),d(),f._ready=f._initStorage(f._config),f._ready})["catch"](b)}d();var g=new Error("No available storage method found.");return f._driverSet=Promise.reject(g),f._driverSet}var c=0;return b()}}var f=this;m(a)||(a=[a]);var g=this._getSupportedDrivers(a),h=null!==this._driverSet?this._driverSet["catch"](function(){return Promise.resolve()}):Promise.resolve();return this._driverSet=h.then(function(){var a=g[0];return f._dbInfo=null,f._ready=null,f.getDriver(a).then(function(a){f._driver=a._driver,d(),f._wrapLibraryMethodsWithReady(),f._initDriver=e(g)})})["catch"](function(){d();var a=new Error("No available storage method found.");return f._driverSet=Promise.reject(a),f._driverSet}),this._driverSet.then(b,c),this._driverSet},b.prototype.supports=function(a){return!!l[a]},b.prototype._extend=function(a){e(this,a)},b.prototype._getSupportedDrivers=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];this.supports(e)&&b.push(e)}return b},b.prototype._wrapLibraryMethodsWithReady=function(){for(var b=0;b<j.length;b++)a(this,j[b])},b.prototype.createInstance=function(a){return new b(a)},b}(),o=new n;b["default"]=o}.call("undefined"!=typeof window?window:self),a.exports=b["default"]},function(a,b){"use strict";b.__esModule=!0,function(){function a(a,b){a=a||[],b=b||{};try{return new Blob(a,b)}catch(c){if("TypeError"!==c.name)throw c;for(var d=t.BlobBuilder||t.MSBlobBuilder||t.MozBlobBuilder||t.WebKitBlobBuilder,e=new d,f=0;f<a.length;f+=1)e.append(a[f]);return e.getBlob(b.type)}}function c(a){for(var b=a.length,c=new ArrayBuffer(b),d=new Uint8Array(c),e=0;b>e;e++)d[e]=a.charCodeAt(e);return c}function d(a){return new Promise(function(b,c){var d=new XMLHttpRequest;d.open("GET",a),d.withCredentials=!0,d.responseType="arraybuffer",d.onreadystatechange=function(){return 4===d.readyState?200===d.status?b({response:d.response,type:d.getResponseHeader("Content-Type")}):void c({status:d.status,response:d.response}):void 0},d.send()})}function e(b){return new Promise(function(c,e){var f=a([""],{type:"image/png"}),g=b.transaction([w],"readwrite");g.objectStore(w).put(f,"key"),g.oncomplete=function(){var a=b.transaction([w],"readwrite"),f=a.objectStore(w).get("key");f.onerror=e,f.onsuccess=function(a){var b=a.target.result,e=URL.createObjectURL(b);d(e).then(function(a){c(!(!a||"image/png"!==a.type))},function(){c(!1)}).then(function(){URL.revokeObjectURL(e)})}}})["catch"](function(){return!1})}function f(a){return"boolean"==typeof v?Promise.resolve(v):e(a).then(function(a){return v=a})}function g(a){return new Promise(function(b,c){var d=new FileReader;d.onerror=c,d.onloadend=function(c){var d=btoa(c.target.result||"");b({__local_forage_encoded_blob:!0,data:d,type:a.type})},d.readAsBinaryString(a)})}function h(b){var d=c(atob(b.data));return a([d],{type:b.type})}function i(a){return a&&a.__local_forage_encoded_blob}function j(a){var b=this,c={db:null};if(a)for(var d in a)c[d]=a[d];return new Promise(function(a,d){var e=u.open(c.name,c.version);e.onerror=function(){d(e.error)},e.onupgradeneeded=function(a){e.result.createObjectStore(c.storeName),a.oldVersion<=1&&e.result.createObjectStore(w)},e.onsuccess=function(){c.db=e.result,b._dbInfo=c,a()}})}function k(a,b){var c=this;"string"!=typeof a&&(t.console.warn(a+" used as a key, but it is not a string."),a=String(a));var d=new Promise(function(b,d){c.ready().then(function(){var e=c._dbInfo,f=e.db.transaction(e.storeName,"readonly").objectStore(e.storeName),g=f.get(a);g.onsuccess=function(){var a=g.result;void 0===a&&(a=null),i(a)&&(a=h(a)),b(a)},g.onerror=function(){d(g.error)}})["catch"](d)});return s(d,b),d}function l(a,b){var c=this,d=new Promise(function(b,d){c.ready().then(function(){var e=c._dbInfo,f=e.db.transaction(e.storeName,"readonly").objectStore(e.storeName),g=f.openCursor(),j=1;g.onsuccess=function(){var c=g.result;if(c){var d=c.value;i(d)&&(d=h(d));var e=a(d,c.key,j++);void 0!==e?b(e):c["continue"]()}else b()},g.onerror=function(){d(g.error)}})["catch"](d)});return s(d,b),d}function m(a,b,c){var d=this;"string"!=typeof a&&(t.console.warn(a+" used as a key, but it is not a string."),a=String(a));var e=new Promise(function(c,e){var h;d.ready().then(function(){return h=d._dbInfo,f(h.db)}).then(function(a){return!a&&b instanceof Blob?g(b):b}).then(function(b){var d=h.db.transaction(h.storeName,"readwrite"),f=d.objectStore(h.storeName);null===b&&(b=void 0);var g=f.put(b,a);d.oncomplete=function(){void 0===b&&(b=null),c(b)},d.onabort=d.onerror=function(){var a=g.error?g.error:g.transaction.error;e(a)}})["catch"](e)});return s(e,c),e}function n(a,b){var c=this;"string"!=typeof a&&(t.console.warn(a+" used as a key, but it is not a string."),a=String(a));var d=new Promise(function(b,d){c.ready().then(function(){var e=c._dbInfo,f=e.db.transaction(e.storeName,"readwrite"),g=f.objectStore(e.storeName),h=g["delete"](a);f.oncomplete=function(){b()},f.onerror=function(){d(h.error)},f.onabort=function(){var a=h.error?h.error:h.transaction.error;d(a)}})["catch"](d)});return s(d,b),d}function o(a){var b=this,c=new Promise(function(a,c){b.ready().then(function(){var d=b._dbInfo,e=d.db.transaction(d.storeName,"readwrite"),f=e.objectStore(d.storeName),g=f.clear();e.oncomplete=function(){a()},e.onabort=e.onerror=function(){var a=g.error?g.error:g.transaction.error;c(a)}})["catch"](c)});return s(c,a),c}function p(a){var b=this,c=new Promise(function(a,c){b.ready().then(function(){var d=b._dbInfo,e=d.db.transaction(d.storeName,"readonly").objectStore(d.storeName),f=e.count();f.onsuccess=function(){a(f.result)},f.onerror=function(){c(f.error)}})["catch"](c)});return s(c,a),c}function q(a,b){var c=this,d=new Promise(function(b,d){return 0>a?void b(null):void c.ready().then(function(){var e=c._dbInfo,f=e.db.transaction(e.storeName,"readonly").objectStore(e.storeName),g=!1,h=f.openCursor();h.onsuccess=function(){var c=h.result;return c?void(0===a?b(c.key):g?b(c.key):(g=!0,c.advance(a))):void b(null)},h.onerror=function(){d(h.error)}})["catch"](d)});return s(d,b),d}function r(a){var b=this,c=new Promise(function(a,c){b.ready().then(function(){var d=b._dbInfo,e=d.db.transaction(d.storeName,"readonly").objectStore(d.storeName),f=e.openCursor(),g=[];f.onsuccess=function(){var b=f.result;return b?(g.push(b.key),void b["continue"]()):void a(g)},f.onerror=function(){c(f.error)}})["catch"](c)});return s(c,a),c}function s(a,b){b&&a.then(function(a){b(null,a)},function(a){b(a)})}var t=this,u=u||this.indexedDB||this.webkitIndexedDB||this.mozIndexedDB||this.OIndexedDB||this.msIndexedDB;if(u){var v,w="local-forage-detect-blob-support",x={_driver:"asyncStorage",_initStorage:j,iterate:l,getItem:k,setItem:m,removeItem:n,clear:o,length:p,key:q,keys:r};b["default"]=x}}.call("undefined"!=typeof window?window:self),a.exports=b["default"]},function(a,b,c){"use strict";b.__esModule=!0,function(){function a(a){var b=this,d={};if(a)for(var e in a)d[e]=a[e];return d.keyPrefix=d.name+"/",b._dbInfo=d,new Promise(function(a,b){a(c(3))}).then(function(a){return n=a,Promise.resolve()})}function d(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo.keyPrefix,c=o.length-1;c>=0;c--){var d=o.key(c);0===d.indexOf(a)&&o.removeItem(d)}});return l(c,a),c}function e(a,b){var c=this;"string"!=typeof a&&(m.console.warn(a+" used as a key, but it is not a string."),a=String(a));var d=c.ready().then(function(){var b=c._dbInfo,d=o.getItem(b.keyPrefix+a);return d&&(d=n.deserialize(d)),d});return l(d,b),d}function f(a,b){var c=this,d=c.ready().then(function(){for(var b=c._dbInfo.keyPrefix,d=b.length,e=o.length,f=1,g=0;e>g;g++){var h=o.key(g);if(0===h.indexOf(b)){var i=o.getItem(h);if(i&&(i=n.deserialize(i)),i=a(i,h.substring(d),f++),void 0!==i)return i}}});return l(d,b),d}function g(a,b){var c=this,d=c.ready().then(function(){var b,d=c._dbInfo;try{b=o.key(a)}catch(e){b=null}return b&&(b=b.substring(d.keyPrefix.length)),b});return l(d,b),d}function h(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo,c=o.length,d=[],e=0;c>e;e++)0===o.key(e).indexOf(a.keyPrefix)&&d.push(o.key(e).substring(a.keyPrefix.length));return d});return l(c,a),c}function i(a){var b=this,c=b.keys().then(function(a){return a.length});return l(c,a),c}function j(a,b){var c=this;"string"!=typeof a&&(m.console.warn(a+" used as a key, but it is not a string."),a=String(a));var d=c.ready().then(function(){var b=c._dbInfo;o.removeItem(b.keyPrefix+a)});return l(d,b),d}function k(a,b,c){var d=this;"string"!=typeof a&&(m.console.warn(a+" used as a key, but it is not a string."),a=String(a));var e=d.ready().then(function(){void 0===b&&(b=null);var c=b;return new Promise(function(e,f){n.serialize(b,function(b,g){if(g)f(g);else try{var h=d._dbInfo;o.setItem(h.keyPrefix+a,b),e(c)}catch(i){("QuotaExceededError"===i.name||"NS_ERROR_DOM_QUOTA_REACHED"===i.name)&&f(i),f(i)}})})});return l(e,c),e}function l(a,b){b&&a.then(function(a){b(null,a)},function(a){b(a)})}var m=this,n=null,o=null;try{if(!(this.localStorage&&"setItem"in this.localStorage))return;o=this.localStorage}catch(p){return}var q={_driver:"localStorageWrapper",_initStorage:a,iterate:f,getItem:e,setItem:k,removeItem:j,clear:d,length:i,key:g,keys:h};b["default"]=q}.call("undefined"!=typeof window?window:self),a.exports=b["default"]},function(a,b){"use strict";b.__esModule=!0,function(){function a(a,b){a=a||[],b=b||{};try{return new Blob(a,b)}catch(c){if("TypeError"!==c.name)throw c;for(var d=x.BlobBuilder||x.MSBlobBuilder||x.MozBlobBuilder||x.WebKitBlobBuilder,e=new d,f=0;f<a.length;f+=1)e.append(a[f]);return e.getBlob(b.type)}}function c(a,b){var c="";if(a&&(c=a.toString()),a&&("[object ArrayBuffer]"===a.toString()||a.buffer&&"[object ArrayBuffer]"===a.buffer.toString())){var d,e=j;a instanceof ArrayBuffer?(d=a,e+=l):(d=a.buffer,"[object Int8Array]"===c?e+=n:"[object Uint8Array]"===c?e+=o:"[object Uint8ClampedArray]"===c?e+=p:"[object Int16Array]"===c?e+=q:"[object Uint16Array]"===c?e+=s:"[object Int32Array]"===c?e+=r:"[object Uint32Array]"===c?e+=t:"[object Float32Array]"===c?e+=u:"[object Float64Array]"===c?e+=v:b(new Error("Failed to get type for BinaryArray"))),b(e+f(d))}else if("[object Blob]"===c){var g=new FileReader;g.onload=function(){var c=h+a.type+"~"+f(this.result);b(j+m+c)},g.readAsArrayBuffer(a)}else try{b(JSON.stringify(a))}catch(i){console.error("Couldn't convert value into a JSON string: ",a),b(null,i)}}function d(b){if(b.substring(0,k)!==j)return JSON.parse(b);var c,d=b.substring(w),f=b.substring(k,w);if(f===m&&i.test(d)){var g=d.match(i);c=g[1],d=d.substring(g[0].length)}var h=e(d);switch(f){case l:return h;case m:return a([h],{type:c});case n:return new Int8Array(h);case o:return new Uint8Array(h);case p:return new Uint8ClampedArray(h);case q:return new Int16Array(h);case s:return new Uint16Array(h);case r:return new Int32Array(h);case t:return new Uint32Array(h);case u:return new Float32Array(h);case v:return new Float64Array(h);default:throw new Error("Unkown type: "+f)}}function e(a){var b,c,d,e,f,h=.75*a.length,i=a.length,j=0;"="===a[a.length-1]&&(h--,"="===a[a.length-2]&&h--);var k=new ArrayBuffer(h),l=new Uint8Array(k);for(b=0;i>b;b+=4)c=g.indexOf(a[b]),d=g.indexOf(a[b+1]),e=g.indexOf(a[b+2]),f=g.indexOf(a[b+3]),l[j++]=c<<2|d>>4,l[j++]=(15&d)<<4|e>>2,l[j++]=(3&e)<<6|63&f;return k}function f(a){var b,c=new Uint8Array(a),d="";for(b=0;b<c.length;b+=3)d+=g[c[b]>>2],d+=g[(3&c[b])<<4|c[b+1]>>4],d+=g[(15&c[b+1])<<2|c[b+2]>>6],d+=g[63&c[b+2]];return c.length%3===2?d=d.substring(0,d.length-1)+"=":c.length%3===1&&(d=d.substring(0,d.length-2)+"=="),d}var g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",h="~~local_forage_type~",i=/^~~local_forage_type~([^~]+)~/,j="__lfsc__:",k=j.length,l="arbf",m="blob",n="si08",o="ui08",p="uic8",q="si16",r="si32",s="ur16",t="ui32",u="fl32",v="fl64",w=k+l.length,x=this,y={serialize:c,deserialize:d,stringToBuffer:e,bufferToString:f};b["default"]=y}.call("undefined"!=typeof window?window:self),a.exports=b["default"]},function(a,b,c){"use strict";b.__esModule=!0,function(){function a(a){var b=this,d={db:null};if(a)for(var e in a)d[e]="string"!=typeof a[e]?a[e].toString():a[e];var f=new Promise(function(c,e){try{d.db=o(d.name,String(d.version),d.description,d.size)}catch(f){return b.setDriver(b.LOCALSTORAGE).then(function(){return b._initStorage(a)}).then(c)["catch"](e)}d.db.transaction(function(a){a.executeSql("CREATE TABLE IF NOT EXISTS "+d.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],function(){b._dbInfo=d,c()},function(a,b){e(b)})})});return new Promise(function(a,b){a(c(3))}).then(function(a){return n=a,f})}function d(a,b){var c=this;"string"!=typeof a&&(m.console.warn(a+" used as a key, but it is not a string."),a=String(a));var d=new Promise(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("SELECT * FROM "+e.storeName+" WHERE key = ? LIMIT 1",[a],function(a,c){var d=c.rows.length?c.rows.item(0).value:null;d&&(d=n.deserialize(d)),b(d)},function(a,b){d(b)})})})["catch"](d)});return l(d,b),d}function e(a,b){var c=this,d=new Promise(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("SELECT * FROM "+e.storeName,[],function(c,d){for(var e=d.rows,f=e.length,g=0;f>g;g++){var h=e.item(g),i=h.value;if(i&&(i=n.deserialize(i)),i=a(i,h.key,g+1),void 0!==i)return void b(i)}b()},function(a,b){d(b)})})})["catch"](d)});return l(d,b),d}function f(a,b,c){var d=this;"string"!=typeof a&&(m.console.warn(a+" used as a key, but it is not a string."),a=String(a));var e=new Promise(function(c,e){d.ready().then(function(){void 0===b&&(b=null);var f=b;n.serialize(b,function(b,g){if(g)e(g);else{var h=d._dbInfo;h.db.transaction(function(d){d.executeSql("INSERT OR REPLACE INTO "+h.storeName+" (key, value) VALUES (?, ?)",[a,b],function(){c(f)},function(a,b){e(b)})},function(a){a.code===a.QUOTA_ERR&&e(a)})}})})["catch"](e)});return l(e,c),e}function g(a,b){var c=this;"string"!=typeof a&&(m.console.warn(a+" used as a key, but it is not a string."),a=String(a));var d=new Promise(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("DELETE FROM "+e.storeName+" WHERE key = ?",[a],function(){b()},function(a,b){d(b)})})})["catch"](d)});return l(d,b),d}function h(a){var b=this,c=new Promise(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){b.executeSql("DELETE FROM "+d.storeName,[],function(){a()},function(a,b){c(b)})})})["catch"](c)});return l(c,a),c}function i(a){var b=this,c=new Promise(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){b.executeSql("SELECT COUNT(key) as c FROM "+d.storeName,[],function(b,c){var d=c.rows.item(0).c;a(d)},function(a,b){c(b)})})})["catch"](c)});return l(c,a),c}function j(a,b){var c=this,d=new Promise(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("SELECT key FROM "+e.storeName+" WHERE id = ? LIMIT 1",[a+1],function(a,c){var d=c.rows.length?c.rows.item(0).key:null;b(d)},function(a,b){d(b)})})})["catch"](d)});return l(d,b),d}function k(a){var b=this,c=new Promise(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){b.executeSql("SELECT key FROM "+d.storeName,[],function(b,c){for(var d=[],e=0;e<c.rows.length;e++)d.push(c.rows.item(e).key);a(d)},function(a,b){c(b)})})})["catch"](c)});return l(c,a),c}function l(a,b){b&&a.then(function(a){b(null,a)},function(a){b(a)})}var m=this,n=null,o=this.openDatabase;if(o){var p={_driver:"webSQLStorage",_initStorage:a,iterate:e,getItem:d,setItem:f,removeItem:g,clear:h,length:i,key:j,keys:k};b["default"]=p}}.call("undefined"!=typeof window?window:self),a.exports=b["default"]}])});