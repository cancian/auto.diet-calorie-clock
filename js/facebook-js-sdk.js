﻿// SDK //
if (!window.FB) {
	window.FB = {
		_apiKey : null,
		_authResponse : null,
		_userStatus : "unknown",
		_logging : true,
		_inCanvas : window.name.indexOf("iframe_canvas") > -1 || window.name.indexOf("app_runner") > -1,
		_https : window.name.indexOf("_fb_https") > -1,
		_domain : {
			api : "https://api.facebook.com/",
			api_read : "https://api-read.facebook.com/",
			cdn : "http://static.ak.fbcdn.net/",
			https_cdn : "https://s-static.ak.fbcdn.net/",
			graph : "https://graph.facebook.com/",
			staticfb : "http://static.ak.facebook.com/",
			https_staticfb : "https://s-static.ak.facebook.com/",
			www : "http://www.facebook.com/",
			https_www : "https://www.facebook.com/",
			m : "http://m.facebook.com/",
			https_m : "https://m.facebook.com/"
		},
		_locale : null,
		_localeIsRtl : false,
		_nativeInterface : null,
		getDomain : function (e, t) {
			var n = !t && (window.location.protocol == "https:" || FB._https);
			switch (e) {
			case "api":
				return FB._domain.api;
			case "api_read":
				return FB._domain.api_read;
			case "cdn":
				return n ? FB._domain.https_cdn : FB._domain.cdn;
			case "cdn_foreign":
				return FB._domain.cdn_foreign;
			case "https_cdn":
				return FB._domain.https_cdn;
			case "graph":
				return FB._domain.graph;
			case "staticfb":
				return n ? FB._domain.https_staticfb : FB._domain.staticfb;
			case "https_staticfb":
				return FB._domain.https_staticfb;
			case "www":
				return n ? FB._domain.https_www : FB._domain.www;
			case "https_www":
				return FB._domain.https_www;
			case "m":
				return n ? FB._domain.https_m : FB._domain.m;
			case "https_m":
				return FB._domain.https_m
			}
		},
		copy : function (e, t, n, r) {
			for (var i in t) {
				if (n || typeof e[i] === "undefined") {
					e[i] = r ? r(t[i]) : t[i]
				}
			}
			return e
		},
		create : function (e, t) {
			var n = window.FB,
			r = e ? e.split(".") : [],
			i = r.length;
			for (var s = 0; s < i; s++) {
				var o = r[s];
				var u = n[o];
				if (!u) {
					u = t && s + 1 == i ? t : {};
					n[o] = u
				}
				n = u
			}
			return n
		},
		provide : function (e, t, n) {
			return FB.copy(typeof e == "string" ? FB.create(e) : e, t, n)
		},
		guid : function () {
			return "f" + (Math.random() * (1 << 30)).toString(16).replace(".", "")
		},
		log : function (e) {
			if (FB._logging) {
				if (window.Debug && window.Debug.writeln) {
					window.Debug.writeln(e)
				} else if (window.console) {
					window.console.log(e)
				}
			}
			if (FB.Event) {
				FB.Event.fire("fb.log", e)
			}
		},
		$ : function (e) {
			return document.getElementById(e)
		}
	}
}
FB.provide("Array", {
	indexOf : function (e, t) {
		if (e.indexOf) {
			return e.indexOf(t)
		}
		var n = e.length;
		if (n) {
			for (var r = 0; r < n; r++) {
				if (e[r] === t) {
					return r
				}
			}
		}
		return -1
	},
	merge : function (e, t) {
		for (var n = 0; n < t.length; n++) {
			if (FB.Array.indexOf(e, t[n]) < 0) {
				e.push(t[n])
			}
		}
		return e
	},
	filter : function (e, t) {
		var n = [];
		for (var r = 0; r < e.length; r++) {
			if (t(e[r])) {
				n.push(e[r])
			}
		}
		return n
	},
	keys : function (e, t) {
		var n = [];
		for (var r in e) {
			if (t || e.hasOwnProperty(r)) {
				n.push(r)
			}
		}
		return n
	},
	map : function (e, t) {
		var n = [];
		for (var r = 0; r < e.length; r++) {
			n.push(t(e[r]))
		}
		return n
	},
	forEach : function (e, t, n) {
		if (!e) {
			return
		}
		if (Object.prototype.toString.apply(e) === "[object Array]" || !(e instanceof Function) && typeof e.length == "number") {
			if (e.forEach) {
				e.forEach(t)
			} else {
				for (var r = 0, i = e.length; r < i; r++) {
					t(e[r], r, e)
				}
			}
		} else {
			for (var s in e) {
				if (n || e.hasOwnProperty(s)) {
					t(e[s], s, e)
				}
			}
		}
	},
	toArray : function (e) {
		for (var t = 0, n = [], r = e.length; t < r; t++) {
			n[t] = e[t]
		}
		return n
	}
});
FB.provide("QS", {
	encode : function (e, t, n) {
		t = t === undefined ? "&" : t;
		n = n === false ? function (e) {
			return e
		}
		 : encodeURIComponent;
		var r = [];
		FB.Array.forEach(e, function (e, t) {
			if (e !== null && typeof e != "undefined") {
				r.push(n(t) + "=" + n(e))
			}
		});
		r.sort();
		return r.join(t)
	},
	decode : function (e) {
		var t = decodeURIComponent,
		n = {},
		r = e.split("&"),
		i,
		s;
		for (i = 0; i < r.length; i++) {
			s = r[i].split("=", 2);
			if (s && s[0]) {
				n[t(s[0])] = t(s[1] || "")
			}
		}
		return n
	}
});
FB.provide("Content", {
	_root : null,
	_hiddenRoot : null,
	_callbacks : {},
	append : function (e, t) {
		if (!t) {
			if (!FB.Content._root) {
				FB.Content._root = t = FB.$("fb-root");
				if (!t) {
					FB.log('The "fb-root" div has not been created.');
					return
				} else {
					t.className += " fb_reset"
				}
			} else {
				t = FB.Content._root
			}
		}
		if (typeof e == "string") {
			var n = document.createElement("div");
			t.appendChild(n).innerHTML = e;
			return n
		} else {
			return t.appendChild(e)
		}
	},
	appendHidden : function (e) {
		if (!FB.Content._hiddenRoot) {
			var t = document.createElement("div"),
			n = t.style;
			n.position = "absolute";
			n.top = "-10000px";
			n.width = n.height = 0;
			FB.Content._hiddenRoot = FB.Content.append(t)
		}
		return FB.Content.append(e, FB.Content._hiddenRoot)
	},
	insertIframe : function (e) {
		e.id = e.id || FB.guid();
		e.name = e.name || FB.guid();
		var t = FB.guid(),
		n = false,
		r = false;
		FB.Content._callbacks[t] = function () {
			if (n && !r) {
				r = true;
				e.onload && e.onload(e.root.firstChild)
			}
		};
		if (document.attachEvent) {
			var i = "<iframe" + ' id="' + e.id + '"' + ' name="' + e.name + '"' + (e.title ? ' title="' + e.title + '"' : "") + (e.className ? ' class="' + e.className + '"' : "") + ' style="border:none;' + (e.width ? "width:" + e.width + "px;" : "") + (e.height ? "height:" + e.height + "px;" : "") + '"' + ' src="javascript:false;"' + ' frameborder="0"' + ' scrolling="no"' + ' allowtransparency="true"' + ' onload="FB.Content._callbacks.' + t + '()"' + "></iframe>";
			e.root.innerHTML = '<iframe src="javascript:false"' + ' frameborder="0"' + ' scrolling="no"' + ' style="height:1px"></iframe>';
			n = true;
			window.setTimeout(function () {
				e.root.innerHTML = i;
				e.root.firstChild.src = e.url;
				e.onInsert && e.onInsert(e.root.firstChild)
			}, 0)
		} else {
			var s = document.createElement("iframe");
			s.id = e.id;
			s.name = e.name;
			s.onload = FB.Content._callbacks[t];
			s.scrolling = "no";
			s.style.border = "none";
			s.style.overflow = "hidden";
			if (e.title) {
				s.title = e.title
			}
			if (e.className) {
				s.className = e.className
			}
			if (e.height) {
				s.style.height = e.height + "px"
			}
			if (e.width) {
				if (e.width == "100%") {
					s.style.width = e.width
				} else {
					s.style.width = e.width + "px"
				}
			}
			e.root.appendChild(s);
			n = true;
			s.src = e.url;
			e.onInsert && e.onInsert(s)
		}
	},
	submitToTarget : function (e, t) {
		var n = document.createElement("form");
		n.action = e.url;
		n.target = e.target;
		n.method = t ? "GET" : "POST";
		FB.Content.appendHidden(n);
		FB.Array.forEach(e.params, function (e, t) {
			if (e !== null && e !== undefined) {
				var r = document.createElement("input");
				r.name = t;
				r.value = e;
				n.appendChild(r)
			}
		});
		n.submit();
		n.parentNode.removeChild(n)
	}
});
FB.provide("Flash", {
	_minVersions : [[9, 0, 159, 0], [10, 0, 22, 87]],
	_swfPath : "swf/XdComm.swf",
	_callbacks : [],
	_names : {},
	_unloadRegistered : false,
	init : function () {
		if (FB.Flash._init) {
			return
		}
		FB.Flash._init = true;
		window.FB_OnFlashXdCommReady = function () {
			FB.Flash._ready = true;
			for (var e = 0, t = FB.Flash._callbacks.length; e < t; e++) {
				FB.Flash._callbacks[e]()
			}
			FB.Flash._callbacks = []
		};
		FB.Flash.embedSWF("XdComm", FB.getDomain("cdn_foreign") + FB.Flash._swfPath)
	},
	embedSWF : function (e, t, n) {
		var r = !!document.attachEvent,
		i = "<object " + 'type="application/x-shockwave-flash" ' + 'id="' + e + '" ' + (n ? 'flashvars="' + n + '" ' : "") + (r ? 'name="' + e + '" ' : "") + (r ? "" : 'data="' + t + '" ') + (r ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' : "") + 'allowscriptaccess="always">' + '<param name="movie" value="' + t + '"></param>' + '<param name="allowscriptaccess" value="always"></param>' + "</object>";
		FB.Content.appendHidden(i);
		if (FB.UA.ie() >= 9) {
			if (!FB.Flash._unloadRegistered) {
				var s = function () {
					FB.Array.forEach(FB.Flash._names, function (e, t) {
						var n = document.getElementById(t);
						if (n) {
							n.removeNode(true)
						}
					})
				};
				window.attachEvent("onunload", s);
				FB.Flash._unloadRegistered = true
			}
			FB.Flash._names[e] = true
		}
	},
	hasMinVersion : function () {
		if (typeof FB.Flash._hasMinVersion === "undefined") {
			var e,
			t,
			n,
			r = [];
			try {
				e = (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
			} catch (i) {
				if (navigator.mimeTypes.length > 0) {
					var s = "application/x-shockwave-flash";
					if (navigator.mimeTypes[s].enabledPlugin) {
						var o = "Shockwave Flash";
						e = (navigator.plugins[o + " 2.0"] || navigator.plugins[o]).description
					}
				}
			}
			if (e) {
				var u = e.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1].split(",");
				for (t = 0, n = u.length; t < n; t++) {
					r.push(parseInt(u[t], 10))
				}
			}
			FB.Flash._hasMinVersion = false;
			e : for (t = 0, n = FB.Flash._minVersions.length; t < n; t++) {
				var a = FB.Flash._minVersions[t];
				if (a[0] != r[0]) {
					continue
				}
				for (var f = 1, l = a.length, c = r.length; f < l && f < c; f++) {
					if (r[f] < a[f]) {
						FB.Flash._hasMinVersion = false;
						continue e
					} else {
						FB.Flash._hasMinVersion = true;
						if (r[f] > a[f]) {
							break e
						}
					}
				}
			}
		}
		return FB.Flash._hasMinVersion
	},
	onReady : function (e) {
		FB.Flash.init();
		if (FB.Flash._ready) {
			window.setTimeout(e, 0)
		} else {
			FB.Flash._callbacks.push(e)
		}
	}
});
if (!this.JSON) {
	this.JSON = {}

}
(function () {
	function f(e) {
		return e < 10 ? "0" + e : e
	}
	function quote(e) {
		escapable.lastIndex = 0;
		return escapable.test(e) ? '"' + e.replace(escapable, function (e) {
			var t = meta[e];
			return typeof t === "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + e + '"'
	}
	function str(e, t) {
		var n,
		r,
		i,
		s,
		o = gap,
		u,
		a = t[e];
		if (a && typeof a === "object" && typeof a.toJSON === "function") {
			a = a.toJSON(e)
		}
		if (typeof rep === "function") {
			a = rep.call(t, e, a)
		}
		switch (typeof a) {
		case "string":
			return quote(a);
		case "number":
			return isFinite(a) ? String(a) : "null";
		case "boolean":
		case "null":
			return String(a);
		case "object":
			if (!a) {
				return "null"
			}
			gap += indent;
			u = [];
			if (Object.prototype.toString.apply(a) === "[object Array]") {
				s = a.length;
				for (n = 0; n < s; n += 1) {
					u[n] = str(n, a) || "null"
				}
				i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]";
				gap = o;
				return i
			}
			if (rep && typeof rep === "object") {
				s = rep.length;
				for (n = 0; n < s; n += 1) {
					r = rep[n];
					if (typeof r === "string") {
						i = str(r, a);
						if (i) {
							u.push(quote(r) + (gap ? ": " : ":") + i)
						}
					}
				}
			} else {
				for (r in a) {
					if (Object.hasOwnProperty.call(a, r)) {
						i = str(r, a);
						if (i) {
							u.push(quote(r) + (gap ? ": " : ":") + i)
						}
					}
				}
			}
			i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}";
			gap = o;
			return i
		}
	}
	if (typeof Date.prototype.toJSON !== "function") {
		Date.prototype.toJSON = function (e) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (e) {
			return this.valueOf()
		}
	}
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	gap,
	indent,
	meta = {
		"\b" : "\\b",
		"	" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		'"' : '\\"',
		"\\" : "\\\\"
	},
	rep;
	if (typeof JSON.stringify !== "function") {
		JSON.stringify = function (e, t, n) {
			var r;
			gap = "";
			indent = "";
			if (typeof n === "number") {
				for (r = 0; r < n; r += 1) {
					indent += " "
				}
			} else if (typeof n === "string") {
				indent = n
			}
			rep = t;
			if (t && typeof t !== "function" && (typeof t !== "object" || typeof t.length !== "number")) {
				throw new Error("JSON.stringify")
			}
			return str("", {
				"" : e
			})
		}
	}
	if (typeof JSON.parse !== "function") {
		JSON.parse = function (text, reviver) {
			function walk(e, t) {
				var n,
				r,
				i = e[t];
				if (i && typeof i === "object") {
					for (n in i) {
						if (Object.hasOwnProperty.call(i, n)) {
							r = walk(i, n);
							if (r !== undefined) {
								i[n] = r
							} else {
								delete i[n]
							}
						}
					}
				}
				return reviver.call(e, t, i)
			}
			var j;
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (e) {
						return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
					})
			}
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")");
				return typeof reviver === "function" ? walk({
					"" : j
				}, "") : j
			}
			throw new SyntaxError("JSON.parse")
		}
	}
})();
FB.provide("JSON", {
	stringify : function (e) {
		if (window.Prototype && Object.toJSON) {
			return Object.toJSON(e)
		} else {
			return JSON.stringify(e)
		}
	},
	parse : function (e) {
		return JSON.parse(e)
	},
	flatten : function (e) {
		var t = {};
		for (var n in e) {
			if (e.hasOwnProperty(n)) {
				var r = e[n];
				if (null === r || undefined === r) {
					continue
				} else if (typeof r == "string") {
					t[n] = r
				} else {
					t[n] = FB.JSON.stringify(r)
				}
			}
		}
		return t
	}
});
FB.provide("", {
	api : function () {
		if (typeof arguments[0] === "string") {
			FB.ApiServer.graph.apply(FB.ApiServer, arguments)
		} else {
			FB.ApiServer.rest.apply(FB.ApiServer, arguments)
		}
	}
});
FB.provide("ApiServer", {
	METHODS : ["get", "post", "delete", "put"],
	_callbacks : {},
	_readOnlyCalls : {
		fql_query : true,
		fql_multiquery : true,
		friends_get : true,
		notifications_get : true,
		stream_get : true,
		users_getinfo : true
	},
	graph : function () {
		var e = Array.prototype.slice.call(arguments),
		t = e.shift().match(/\/?([^?]*)\??([^#]*)/),
		n = t[1],
		r = e.shift(),
		i,
		s,
		o;
		while (r) {
			var u = typeof r;
			if (u === "string" && !i) {
				i = r.toLowerCase()
			} else if (u === "function" && !o) {
				o = r
			} else if (u === "object" && !s) {
				s = r
			} else {
				FB.log("Invalid argument passed to FB.api(): " + r);
				return
			}
			r = e.shift()
		}
		i = i || "get";
		s = FB.copy(s || {}, FB.QS.decode(t[2]));
		if (FB.Array.indexOf(FB.ApiServer.METHODS, i) < 0) {
			FB.log("Invalid method passed to FB.api(): " + i);
			return
		}
		FB.ApiServer.oauthRequest("graph", n, i, s, o)
	},
	rest : function (e, t) {
		var n = e.method.toLowerCase().replace(".", "_");
		if (FB.Auth && n === "auth_revokeauthorization") {
			var r = t;
			t = function (e) {
				if (e === true) {
					FB.Auth.setAuthResponse(null, "not_authorized")
				}
				r && r(e)
			}
		}
		e.format = "json-strings";
		e.api_key = FB._apiKey;
		var i = FB.ApiServer._readOnlyCalls[n] ? "api_read" : "api";
		FB.ApiServer.oauthRequest(i, "restserver.php", "get", e, t)
	},
	oauthRequest : function (e, t, n, r, i) {
		if (!r.access_token && FB.getAccessToken()) {
			r.access_token = FB.getAccessToken()
		}
		r.sdk = "joey";
		r.pretty = 0;
		var s = i;
		i = function (e) {
			if (FB.Auth && e && FB.getAccessToken() == r.access_token && (e.error_code === "190" || e.error && (e.error === "invalid_token" || e.error.type === "OAuthException"))) {
				FB.getLoginStatus(null, true)
			}
			s && s(e)
		};
		try {
			FB.ApiServer.jsonp(e, t, n, FB.JSON.flatten(r), i)
		} catch (o) {
			try {
				if (!FB.initSitevars.corsKillSwitch && FB.ApiServer.corsPost(e, t, n, FB.JSON.flatten(r), i)) {
					return
				}
			} catch (u) {}

			if (FB.Flash.hasMinVersion()) {
				FB.ApiServer.flash(e, t, n, FB.JSON.flatten(r), i)
			} else {
				throw new Error("Your browser does not support long connect " + "requests. You can fix this problem by upgrading your browser " + "or installing the latest version of Flash")
			}
		}
	},
	corsPost : function (e, t, n, r, i) {
		var s = FB.getDomain(e) + t;
		if (e == "graph") {
			r.method = n
		}
		var o = FB.QS.encode(r);
		var u = "application/x-www-form-urlencoded";
		var a = FB.ApiServer._createCORSRequest("POST", s, u);
		if (a) {
			a.onload = function () {
				i && i(FB.JSON.parse(a.responseText))
			};
			a.send(o);
			return true
		} else {
			return false
		}
	},
	_createCORSRequest : function (e, t, n) {
		if (!window.XMLHttpRequest) {
			return null
		}
		var r = new XMLHttpRequest;
		if ("withCredentials" in r) {
			r.open(e, t, true);
			r.setRequestHeader("Content-type", n)
		} else if (window.XDomainRequest) {
			r = new XDomainRequest;
			r.open(e, t)
		} else {
			r = null
		}
		return r
	},
	jsonp : function (e, t, n, r, i) {
		var s = FB.guid(),
		o = document.createElement("script");
		if (e === "graph" && n !== "get") {
			r.method = n
		}
		r.callback = "FB.ApiServer._callbacks." + s;
		var u = FB.getDomain(e) + t + (t.indexOf("?") > -1 ? "&" : "?") + FB.QS.encode(r);
		if (u.length > 2e3) {
			throw new Error("JSONP only support a maximum of 2000 bytes of input.")
		}
		FB.ApiServer._callbacks[s] = function (e) {
			i && i(e);
			delete FB.ApiServer._callbacks[s];
			o.parentNode.removeChild(o)
		};
		o.src = u;
		document.getElementsByTagName("head")[0].appendChild(o)
	},
	flash : function (e, t, n, r, i) {
		if (!window.FB_OnXdHttpResult) {
			window.FB_OnXdHttpResult = function (e, t) {
				FB.ApiServer._callbacks[e](decodeURIComponent(t))
			}
		}
		FB.Flash.onReady(function () {
			if (e === "graph") {
				r.suppress_http_code = 1
			}
			var s = FB.getDomain(e) + t,
			o = FB.QS.encode(r);
			if (n === "get") {
				if (s.length + o.length > 2e3) {
					if (e === "graph") {
						r.method = "get"
					}
					n = "post";
					o = FB.QS.encode(r)
				} else {
					s += (s.indexOf("?") > -1 ? "&" : "?") + o;
					o = ""
				}
			} else if (n !== "post") {
				if (e === "graph") {
					r.method = n
				}
				n = "post";
				o = FB.QS.encode(r)
			}
			var u = document.XdComm.sendXdHttpRequest(n.toUpperCase(), s, o, null);
			FB.ApiServer._callbacks[u] = function (e) {
				i && i(FB.JSON.parse(e));
				delete FB.ApiServer._callbacks[u]
			}
		})
	}
});
FB.provide("EventProvider", {
	subscribers : function () {
		if (!this._subscribersMap) {
			this._subscribersMap = {}

		}
		return this._subscribersMap
	},
	subscribe : function (e, t) {
		var n = this.subscribers();
		if (!n[e]) {
			n[e] = [t]
		} else {
			n[e].push(t)
		}
	},
	unsubscribe : function (e, t) {
		var n = this.subscribers()[e];
		FB.Array.forEach(n, function (e, r) {
			if (e == t) {
				n[r] = null
			}
		})
	},
	monitor : function (e, t) {
		if (!t()) {
			var n = this,
			r = function () {
				if (t.apply(t, arguments)) {
					n.unsubscribe(e, r)
				}
			};
			this.subscribe(e, r)
		}
	},
	clear : function (e) {
		delete this.subscribers()[e]
	},
	fire : function () {
		var e = Array.prototype.slice.call(arguments),
		t = e.shift();
		FB.Array.forEach(this.subscribers()[t], function (t) {
			if (t) {
				t.apply(this, e)
			}
		})
	},
	listen : function (e, t, n) {
		if (e.addEventListener) {
			e.addEventListener(t, n, false)
		} else if (e.attachEvent) {
			e.attachEvent("on" + t, n)
		}
	},
	unlisten : function (e, t, n) {
		if (e.removeEventListener) {
			e.removeEventListener(t, n, false)
		} else if (e.detachEvent) {
			e.detachEvent("on" + t, n)
		}
	}
});
FB.provide("Event", FB.EventProvider);
FB.provide("XD", {
	_origin : null,
	_transport : null,
	_callbacks : {},
	_forever : {},
	_xdProxyUrl : "connect/xd_proxy.php",
	_openerTransport : null,
	_openerOrigin : null,
	_nonOpenerOrigin : null,
	init : function (e) {
		if (FB.XD._origin) {
			return
		}
		var t = window.location.protocol + "//" + window.location.host + "/" + FB.guid();
		if (window.addEventListener && !window.attachEvent && window.postMessage) {
			FB.XD._origin = t;
			FB.XD.PostMessage.init();
			FB.XD._transport = "postmessage"
		} else if (!e && FB.Flash.hasMinVersion()) {
			if (document.getElementById("fb-root")) {
				var n = document.domain;
				if (n == "facebook.com") {
					n = window.location.host
				}
				FB.XD._origin = window.location.protocol + "//" + n + "/" + FB.guid();
				FB.XD.Flash.init();
				FB.XD._transport = "flash"
			} else {
				if (FB.log) {
					FB.log("missing fb-root, defaulting to fragment-based xdcomm")
				}
				FB.XD._transport = "fragment";
				FB.XD.Fragment._channelUrl = e || window.location.toString()
			}
		} else {
			FB.XD._transport = "fragment";
			FB.XD.Fragment._channelUrl = e || window.location.toString()
		}
		var r = !!window.attachEvent;
		if (FB.XD._transport != "postmessage" && r && window.postMessage) {
			FB.XD._openerTransport = FB.XD._transport;
			FB.XD._openerOrigin = FB.XD._origin;
			FB.XD._nonOpenerOrigin = t
		}
	},
	resolveRelation : function (e) {
		var t,
		n,
		r = e.split("."),
		i = window;
		for (var s = 0, o = r.length; s < o; s++) {
			t = r[s];
			if (t === "opener" || t === "parent" || t === "top") {
				i = i[t]
			} else if (n = /^frames\[['"]?([a-zA-Z0-9-_]+)['"]?\]$/.exec(t)) {
				i = i.frames[n[1]]
			} else {
				throw new SyntaxError("Malformed id to resolve: " + e + ", pt: " + t)
			}
		}
		return i
	},
	handler : function (e, t, n, r, i) {
		if (window.location.toString().indexOf(FB.XD.Fragment._magic) > 0) {
			return "javascript:false;//"
		}
		if (FB.initSitevars.forceSecureXdProxy) {
			i = true
		}
		var s = FB.getDomain((i ? "https_" : "") + "cdn") + FB.XD._xdProxyUrl + "#";
		r = r || FB.guid();
		t = t || "opener";
		if (FB.XD._openerTransport) {
			if (t == "opener") {
				FB.XD._transport = FB.XD._openerTransport;
				FB.XD._origin = FB.XD._openerOrigin
			} else {
				FB.XD.PostMessage.init();
				FB.XD._transport = "postmessage";
				FB.XD._origin = FB.XD._nonOpenerOrigin
			}
		}
		if (FB.XD._transport == "fragment") {
			s = FB.XD.Fragment._channelUrl;
			var o = s.indexOf("#");
			if (o > 0) {
				s = s.substr(0, o)
			}
			s += (s.indexOf("?") < 0 ? "?" : "&") + FB.XD.Fragment._magic + "#?=&"
		}
		if (n) {
			FB.XD._forever[r] = true
		}
		FB.XD._callbacks[r] = e;
		return s + FB.QS.encode({
			cb : r,
			origin : FB.XD._origin,
			relation : t,
			transport : FB.XD._transport
		})
	},
	recv : function (e) {
		if (typeof e == "string") {
			try {
				e = FB.JSON.parse(e)
			} catch (t) {
				e = FB.QS.decode(e)
			}
		}
		var n = FB.XD._callbacks[e.cb];
		if (!FB.XD._forever[e.cb]) {
			delete FB.XD._callbacks[e.cb]
		}
		n && n(e)
	},
	PostMessage : {
		_isInitialized : false,
		init : function () {
			if (!FB.XD.PostMessage._isInitialized) {
				var e = FB.XD.PostMessage.onMessage;
				window.addEventListener ? window.addEventListener("message", e, false) : window.attachEvent("onmessage", e);
				FB.XD.PostMessage._isInitialized = true
			}
		},
		onMessage : function (e) {
			FB.XD.recv(e.data)
		}
	},
	WebView : {
		onMessage : function (e, t, n) {
			FB.XD.recv(n)
		}
	},
	Flash : {
		init : function () {
			FB.Flash.onReady(function () {
				document.XdComm.postMessage_init("FB.XD.Flash.onMessage", FB.XD._openerOrigin ? FB.XD._openerOrigin : FB.XD._origin)
			})
		},
		onMessage : function (e) {
			FB.XD.recv(decodeURIComponent(e))
		}
	},
	Fragment : {
		_magic : "fb_xd_fragment",
		checkAndDispatch : function () {
			var e = window.location.toString(),
			t = e.substr(e.indexOf("#") + 1),
			n = e.indexOf(FB.XD.Fragment._magic);
			if (n > 0) {
				FB.init = FB.getLoginStatus = FB.api = function () {};
				document.documentElement.style.display = "none";
				FB.XD.resolveRelation(FB.QS.decode(t).relation).FB.XD.recv(t)
			}
		}
	}
});
FB.XD.Fragment.checkAndDispatch();
FB.provide("UA", {
	ie : function () {
		return FB.UA._populate() || this._ie
	},
	firefox : function () {
		return FB.UA._populate() || this._firefox
	},
	opera : function () {
		return FB.UA._populate() || this._opera
	},
	safari : function () {
		return FB.UA._populate() || this._safari
	},
	chrome : function () {
		return FB.UA._populate() || this._chrome
	},
	windows : function () {
		return FB.UA._populate() || this._windows
	},
	osx : function () {
		return FB.UA._populate() || this._osx
	},
	linux : function () {
		return FB.UA._populate() || this._linux
	},
	ios : function () {
		FB.UA._populate();
		return FB.UA.mobile() && this._ios
	},
	mobile : function () {
		FB.UA._populate();
		return !FB._inCanvas && this._mobile
	},
	nativeApp : function () {
		return FB.UA.mobile() && navigator.userAgent.match(/FBAN\/\w+;/i)
	},
	android : function () {
		FB.UA._populate();
		return FB.UA.mobile() && this._android
	},
	iPad : function () {
		FB.UA._populate();
		return FB.UA.mobile() && this._iPad
	},
	_populated : false,
	_populate : function () {
		if (FB.UA._populated) {
			return
		}
		FB.UA._populated = true;
		var e = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(navigator.userAgent);
		var t = /(Mac OS X)|(Windows)|(Linux)/.exec(navigator.userAgent);
		var n = /\b(iPhone|iP[ao]d)/.exec(navigator.userAgent);
		FB.UA._iPad = /\b(iPad)/.exec(navigator.userAgent);
		FB.UA._android = navigator.userAgent.match(/Android/i);
		FB.UA._mobile = n || FB.UA._android || navigator.userAgent.match(/Mobile/i);
		if (e) {
			FB.UA._ie = e[1] ? parseFloat(e[1]) : NaN;
			if (FB.UA._ie >= 8 && !window.HTMLCollection) {
				FB.UA._ie = 7
			}
			FB.UA._firefox = e[2] ? parseFloat(e[2]) : NaN;
			FB.UA._opera = e[3] ? parseFloat(e[3]) : NaN;
			FB.UA._safari = e[4] ? parseFloat(e[4]) : NaN;
			if (FB.UA._safari) {
				e = /(?:Chrome\/(\d+\.\d+))/.exec(navigator.userAgent);
				FB.UA._chrome = e && e[1] ? parseFloat(e[1]) : NaN
			} else {
				FB.UA._chrome = NaN
			}
		} else {
			FB.UA._ie = FB.UA._firefox = FB.UA._opera = FB.UA._chrome = FB.UA._safari = NaN
		}
		if (t) {
			FB.UA._osx = !!t[1];
			FB.UA._windows = !!t[2];
			FB.UA._linux = !!t[3]
		} else {
			FB.UA._osx = FB.UA._windows = FB.UA._linux = false
		}
		FB.UA._ios = n
	}
});
FB.provide("Arbiter", {
	_canvasProxyUrl : "connect/canvas_proxy.php",
	BEHAVIOR_EVENT : "e",
	BEHAVIOR_PERSISTENT : "p",
	BEHAVIOR_STATE : "s",
	inform : function (e, t, n, r, i) {
		if (FB.Canvas.isTabIframe() || FB._inPlugin && window.postMessage || !FB._inCanvas && FB.UA.mobile() && window.postMessage) {
			var s = FB.JSON.stringify({
					method : e,
					params : t,
					behavior : i || FB.Arbiter.BEHAVIOR_PERSISTENT
				});
			if (window.postMessage) {
				FB.XD.resolveRelation(n || "parent").postMessage(s, "*");
				return
			} else {
				try {
					window.opener.postMessage(s);
					return
				} catch (o) {}

			}
		}
		r |= window != window.parent && document.referrer.indexOf("https:") === 0;
		var u = FB.getDomain((r ? "https_" : "") + "staticfb", true) + FB.Arbiter._canvasProxyUrl + "#" + FB.QS.encode({
				method : e,
				params : FB.JSON.stringify(t || {}),
				behavior : i || FB.Arbiter.BEHAVIOR_PERSISTENT,
				relation : n
			});
		var a = FB.Content.appendHidden("");
		FB.Content.insertIframe({
			url : u,
			root : a,
			width : 1,
			height : 1,
			onload : function () {
				setTimeout(function () {
					a.parentNode.removeChild(a)
				}, 10)
			}
		})
	}
});
FB.provide("Canvas", {
	_timer : null,
	_lastSize : {},
	_pageInfo : {
		clientWidth : 0,
		clientHeight : 0,
		scrollLeft : 0,
		scrollTop : 0,
		offsetLeft : 0,
		offsetTop : 0
	},
	getPageInfo : function (e) {
		var t = "top.frames[" + window.name + "]";
		var n = FB.XD.handler(function (t) {
				for (var n in FB.Canvas._pageInfo) {
					if (t[n]) {
						FB.Canvas._pageInfo[n] = t[n] | 0
					}
				}
				e && e(FB.Canvas._pageInfo)
			}, t, true);
		var r = {
			channelUrl : n,
			frame : window.name
		};
		FB.Arbiter.inform("getPageInfo", r, "top")
	},
	hideFlashElement : function (e) {
		e.style.visibility = "hidden"
	},
	showFlashElement : function (e) {
		e.style.visibility = ""
	},
	_flashClassID : "CLSID:D27CDB6E-AE6D-11CF-96B8-444553540000",
	_hideFlashCallback : function (e) {
		var t = window.document.getElementsByTagName("object");
		for (var n = 0; n < t.length; n++) {
			var r = t[n];
			if (r.type.toLowerCase() != "application/x-shockwave-flash" && r.classid.toUpperCase() != FB.Canvas._flashClassID) {
				continue
			}
			var i = false;
			for (var s = 0; s < r.childNodes.length; s++) {
				if (r.childNodes[s].nodeName.toLowerCase() == "param" && r.childNodes[s].name.toLowerCase() == "wmode") {
					if (r.childNodes[s].value.toLowerCase() == "opaque" || r.childNodes[s].value.toLowerCase() == "transparent") {
						i = true
					}
				}
			}
			if (!i) {
				var o = Math.random();
				if (o <= 1 / 1e3) {
					FB.api(FB._apiKey + "/occludespopups", "post", {})
				}
				if (FB.Canvas._devHideFlashCallback) {
					var u = 200;
					var a = {
						state : e.state,
						elem : r
					};
					var f = FB.bind(function (e) {
							if (e.state == "opened") {
								FB.Canvas.hideFlashElement(e.elem)
							} else {
								FB.Canvas.showFlashElement(e.elem)
							}
						}, this, a);
					setTimeout(f, u);
					FB.Canvas._devHideFlashCallback(a)
				} else {
					if (e.state == "opened") {
						r._old_visibility = r.style.visibility;
						r.style.visibility = "hidden"
					} else if (e.state == "closed") {
						r.style.visibility = r._old_visibility;
						delete r._old_visibility
					}
				}
			}
		}
	},
	_devHideFlashCallback : null,
	_setHideFlashCallback : function (e) {
		FB.Canvas._devHideFlashCallback = e
	},
	init : function () {
		var e = FB.Dom.getViewportInfo();
		FB.Canvas._pageInfo.clientWidth = e.width;
		FB.Canvas._pageInfo.clientHeight = e.height;
		FB.Canvas.getPageInfo();
		var t = FB.XD.handler(FB.Canvas._hideFlashCallback, "top.frames[" + window.name + "]", true);
		FB.Arbiter.inform("iframeSetupFlashHiding", {
			channelUrl : t
		})
	},
	setSize : function (e) {
		if (typeof e != "object") {
			e = {}

		}
		var t = 0,
		n = 0;
		e = e || {};
		if (e.width == null || e.height == null) {
			e = FB.copy(e, FB.Canvas._computeContentSize());
			t = 16;
			n = 4
		}
		e = FB.copy(e, {
				frame : window.name || "iframe_canvas"
			});
		if (FB.Canvas._lastSize[e.frame]) {
			var r = FB.Canvas._lastSize[e.frame].height;
			var i = e.height - r;
			if (FB.Canvas._lastSize[e.frame].width == e.width && i <= n && i >= -t) {
				return false
			}
		}
		FB.Canvas._lastSize[e.frame] = e;
		FB.Arbiter.inform("setSize", e);
		return true
	},
	scrollTo : function (e, t) {
		FB.Arbiter.inform("scrollTo", {
			frame : window.name || "iframe_canvas",
			x : e,
			y : t
		})
	},
	setAutoGrow : function (e, t) {
		if (t === undefined && typeof e == "number") {
			t = e;
			e = true
		}
		if (e === undefined || e) {
			if (FB.Canvas._timer === null) {
				FB.Canvas._timer = window.setInterval(FB.Canvas.setSize, t || 100)
			}
			FB.Canvas.setSize()
		} else {
			if (FB.Canvas._timer !== null) {
				window.clearInterval(FB.Canvas._timer);
				FB.Canvas._timer = null
			}
		}
	},
	setAutoResize : function (e, t) {
		return FB.Canvas.setAutoGrow(e, t)
	},
	isTabIframe : function () {
		return window.name.indexOf("app_runner_") === 0
	},
	setDoneLoading : function (e) {
		FB.Canvas._passAppTtiMessage(e, "RecordIframeAppTti")
	},
	stopTimer : function (e) {
		FB.Canvas._passAppTtiMessage(e, "StopIframeAppTtiTimer")
	},
	setUrlHandler : function (e) {
		var t = FB.XD.handler(e, "top.frames[" + window.name + "]", true);
		FB.Arbiter.inform("setUrlHandler", t);
		FB.Event.listen(window, "load", function () {
			FB.Arbiter.inform("setUrlHandler", t)
		})
	},
	startTimer : function () {
		FB.Canvas._passAppTtiMessage(null, "StartIframeAppTtiTimer")
	},
	_passAppTtiMessage : function (e, t) {
		var n = null;
		if (e) {
			n = FB.XD.handler(e, "top.frames[" + window.name + "]", false)
		}
		FB.Arbiter.inform(t, {
			frame : window.name || "iframe_canvas",
			time : (new Date).getTime(),
			appId : parseInt(FB._apiKey, 10),
			channelUrl : n
		})
	},
	_computeContentSize : function () {
		var e = document.body,
		t = document.documentElement,
		n = 0,
		r = Math.max(e.offsetTop, 0),
		i = Math.max(t.offsetTop, 0),
		s = e.scrollHeight + r,
		o = e.offsetHeight + r,
		u = t.scrollHeight + i,
		a = t.offsetHeight + i;
		bottom = Math.max(s, o, u, a);
		if (e.offsetWidth < e.scrollWidth) {
			n = e.scrollWidth + e.offsetLeft
		} else {
			FB.Array.forEach(e.childNodes, function (e) {
				var t = e.offsetWidth + e.offsetLeft;
				if (t > n) {
					n = t
				}
			})
		}
		if (t.clientLeft > 0) {
			n += t.clientLeft * 2
		}
		if (t.clientTop > 0) {
			bottom += t.clientTop * 2
		}
		return {
			height : bottom,
			width : n
		}
	}
});
FB.provide("String", {
	trim : function (e) {
		return e.replace(/^\s*|\s*$/g, "")
	},
	format : function (e) {
		if (!FB.String.format._formatRE) {
			FB.String.format._formatRE = /(\{[^\}^\{]+\})/g
		}
		var t = arguments;
		return e.replace(FB.String.format._formatRE, function (e, n) {
			var r = parseInt(n.substr(1), 10),
			i = t[r + 1];
			if (i === null || i === undefined) {
				return ""
			}
			return i.toString()
		})
	},
	escapeHTML : function (e) {
		var t = document.createElement("div");
		t.appendChild(document.createTextNode(e));
		return t.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;")
	},
	quote : function (e) {
		var t = /["\\\x00-\x1f\x7f-\x9f]/g,
		n = {
			"\b" : "\\b",
			"	" : "\\t",
			"\n" : "\\n",
			"\f" : "\\f",
			"\r" : "\\r",
			'"' : '\\"',
			"\\" : "\\\\"
		};
		return t.test(e) ? '"' + e.replace(t, function (e) {
			var t = n[e];
			if (t) {
				return t
			}
			t = e.charCodeAt();
			return "\\u00" + Math.floor(t / 16).toString(16) + (t % 16).toString(16)
		}) + '"' : '"' + e + '"'
	}
});
FB.provide("Dom", {
	containsCss : function (e, t) {
		var n = " " + e.className + " ";
		return n.indexOf(" " + t + " ") >= 0
	},
	addCss : function (e, t) {
		if (!FB.Dom.containsCss(e, t)) {
			e.className = e.className + " " + t
		}
	},
	removeCss : function (e, t) {
		if (FB.Dom.containsCss(e, t)) {
			e.className = e.className.replace(t, "");
			FB.Dom.removeCss(e, t)
		}
	},
	getByClass : function (e, t, n) {
		t = t || document.body;
		n = n || "*";
		if (t.querySelectorAll) {
			return FB.Array.toArray(t.querySelectorAll(n + "." + e))
		}
		var r = t.getElementsByTagName(n),
		i = [];
		for (var s = 0, o = r.length; s < o; s++) {
			if (this.containsCss(r[s], e)) {
				i[i.length] = r[s]
			}
		}
		return i
	},
	getStyle : function (e, t) {
		var n = false,
		r = e.style;
		if (e.currentStyle) {
			FB.Array.forEach(t.match(/\-([a-z])/g), function (e) {
				t = t.replace(e, e.substr(1, 1).toUpperCase())
			});
			n = e.currentStyle[t]
		} else {
			FB.Array.forEach(t.match(/[A-Z]/g), function (e) {
				t = t.replace(e, "-" + e.toLowerCase())
			});
			if (window.getComputedStyle) {
				n = document.defaultView.getComputedStyle(e, null).getPropertyValue(t);
				if (t == "background-position-y" || t == "background-position-x") {
					if (n == "top" || n == "left") {
						n = "0px"
					}
				}
			}
		}
		if (t == "opacity") {
			if (e.filters && e.filters.alpha) {
				return n
			}
			return n * 100
		}
		return n
	},
	setStyle : function (e, t, n) {
		var r = e.style;
		if (t == "opacity") {
			if (n >= 100) {
				n = 99.999
			}
			if (n < 0) {
				n = 0
			}
			r.opacity = n / 100;
			r.MozOpacity = n / 100;
			r.KhtmlOpacity = n / 100;
			if (e.filters) {
				if (e.filters.alpha == undefined) {
					e.filter = "alpha(opacity=" + n + ")"
				} else {
					e.filters.alpha.opacity = n
				}
			}
		} else {
			r[t] = n
		}
	},
	addScript : function (e) {
		var t = document.createElement("script");
		t.type = "text/javascript";
		t.src = e;
		return document.getElementsByTagName("head")[0].appendChild(t)
	},
	addCssRules : function (e, t) {
		if (!FB.Dom._cssRules) {
			FB.Dom._cssRules = {}

		}
		var n = true;
		FB.Array.forEach(t, function (e) {
			if (!(e in FB.Dom._cssRules)) {
				n = false;
				FB.Dom._cssRules[e] = true
			}
		});
		if (n) {
			return
		}
		if (!FB.UA.ie()) {
			var r = document.createElement("style");
			r.type = "text/css";
			r.textContent = e;
			document.getElementsByTagName("head")[0].appendChild(r)
		} else {
			try {
				document.createStyleSheet().cssText = e
			} catch (i) {
				if (document.styleSheets[0]) {
					document.styleSheets[0].cssText += e
				}
			}
		}
	},
	getViewportInfo : function () {
		var e = document.documentElement && document.compatMode == "CSS1Compat" ? document.documentElement : document.body;
		return {
			scrollTop : e.scrollTop,
			scrollLeft : e.scrollLeft,
			width : self.innerWidth ? self.innerWidth : e.clientWidth,
			height : self.innerHeight ? self.innerHeight : e.clientHeight
		}
	},
	ready : function (e) {
		if (FB.Dom._isReady) {
			e && e()
		} else {
			FB.Event.subscribe("dom.ready", e)
		}
	},
	getPosition : function (e) {
		var t = 0,
		n = 0;
		do {
			t += e.offsetLeft;
			n += e.offsetTop
		} while (e = e.offsetParent);
		return {
			x : t,
			y : n
		}
	}
});
(function () {
	function domReady() {
		FB.Dom._isReady = true;
		FB.Event.fire("dom.ready");
		FB.Event.clear("dom.ready")
	}
	if (FB.Dom._isReady || document.readyState == "complete") {
		return domReady()
	}
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", domReady, false)
	} else if (document.attachEvent) {
		document.attachEvent("onreadystatechange", domReady)
	}
	if (FB.UA.ie() && window === top) {
		(function () {
			try {
				document.documentElement.doScroll("left")
			} catch (e) {
				setTimeout(arguments.callee, 0);
				return
			}
			domReady()
		})()
	}
	var oldonload = window.onload;
	window.onload = function () {
		domReady();
		if (oldonload) {
			if (typeof oldonload == "string") {
				eval(oldonload)
			} else {
				oldonload()
			}
		}
	}
})();
FB.provide("Intl", function () {
	function t(t) {
		if (typeof t != "string") {
			return false
		}
		return t.match(new RegExp(e + "[" + ')"' + "'" + "»" + "༻" + "༽" + "’" + "”" + "›" + "〉" + "》" + "」" + "』" + "】" + "〕" + "〗" + "〙" + "〛" + "〞" + "〟" + "﴿" + "＇" + "）" + "］" + "s" + "]*$"))
	}
	function n(n, r) {
		if (r !== undefined) {
			if (typeof r != "object") {
				FB.log("The second arg to FB.Intl.tx() must be an Object for " + "FB.Intl.tx(" + n + ", ...)")
			} else {
				var i;
				for (var s in r) {
					if (r.hasOwnProperty(s)) {
						if (t(r[s])) {
							i = new RegExp("{" + s + "}" + e + "*", "g")
						} else {
							i = new RegExp("{" + s + "}", "g")
						}
						n = n.replace(i, r[s])
					}
				}
			}
		}
		return n
	}
	function r(e, t) {
		if (!FB.Intl._stringTable) {
			return null
		}
		return n(FB.Intl._stringTable[e], t)
	}
	var e = "[" + ".!?" + "。" + "！" + "？" + "।" + "…" + "ຯ" + "᠁" + "ฯ" + "．" + "]";
	r._ = n;
	return {
		tx : r,
		_tx : n
	}
}
	());
FB.provide("", {
	bind : function () {
		var e = Array.prototype.slice.call(arguments),
		t = e.shift(),
		n = e.shift();
		return function () {
			return t.apply(n, e.concat(Array.prototype.slice.call(arguments)))
		}
	},
	Class : function (e, t, n) {
		if (FB.CLASSES[e]) {
			return FB.CLASSES[e]
		}
		var r = t || function () {};
		r.prototype = n;
		r.prototype.bind = function (e) {
			return FB.bind(e, this)
		};
		r.prototype.constructor = r;
		FB.create(e, r);
		FB.CLASSES[e] = r;
		return r
	},
	subclass : function (e, t, n, r) {
		if (FB.CLASSES[e]) {
			return FB.CLASSES[e]
		}
		var i = FB.create(t);
		FB.copy(r, i.prototype);
		r._base = i;
		r._callBase = function (e) {
			var t = Array.prototype.slice.call(arguments, 1);
			return i.prototype[e].apply(this, t)
		};
		return FB.Class(e, n ? n : function () {
			if (i.apply) {
				i.apply(this, arguments)
			}
		}, r)
	},
	CLASSES : {}

});
FB.provide("Type", {
	isType : function (e, t) {
		while (e) {
			if (e.constructor === t || e === t) {
				return true
			} else {
				e = e._base
			}
		}
		return false
	}
});
FB.Class("Obj", null, FB.copy({
		setProperty : function (e, t) {
			if (FB.JSON.stringify(t) != FB.JSON.stringify(this[e])) {
				this[e] = t;
				this.fire(e, t)
			}
		}
	}, FB.EventProvider));
FB.subclass("Dialog", "Obj", function (e) {
	this.id = e;
	if (!FB.Dialog._dialogs) {
		FB.Dialog._dialogs = {};
		FB.Dialog._addOrientationHandler()
	}
	FB.Dialog._dialogs[e] = this
}, {});
FB.provide("Dialog", {
	_dialogs : null,
	_lastYOffset : 0,
	_loaderEl : null,
	_overlayEl : null,
	_stack : [],
	_active : null,
	_popStateListenerOn : false,
	_hideOnPopState : function (e) {
		FB.Dialog.hide(FB.Dialog._stack.pop())
	},
	get : function (e) {
		return FB.Dialog._dialogs[e]
	},
	_findRoot : function (e) {
		while (e) {
			if (FB.Dom.containsCss(e, "fb_dialog")) {
				return e
			}
			e = e.parentNode
		}
	},
	_createWWWLoader : function (e) {
		e = parseInt(e, 10);
		e = e ? e : 460;
		return FB.Dialog.create({
			content : '<div class="dialog_title">' + '  <a id="fb_dialog_loader_close">' + '    <div class="fb_dialog_close_icon"></div>' + "  </a>" + "  <span>Facebook</span>" + '  <div style="clear:both;"></div>' + "</div>" + '<div class="dialog_content"></div>' + '<div class="dialog_footer"></div>',
			width : e
		})
	},
	_createMobileLoader : function () {
		var e = FB.UA.nativeApp() ? "" : "<table>" + "  <tbody>" + "    <tr>" + '      <td class="header_left">' + '        <label class="touchable_button">' + '          <input type="submit" value="' + FB.Intl.tx._("Cancel") + '"' + '            id="fb_dialog_loader_close"/>' + "        </label>" + "      </td>" + '      <td class="header_center">' + "        <div>" + FB.Intl.tx._("Loading...") + "</div>" + "      </td>" + '      <td class="header_right">' + "      </td>" + "    </tr>" + "  </tbody>" + "</table>";
		return FB.Dialog.create({
			classes : "loading" + (FB.UA.iPad() ? " centered" : ""),
			content : '<div class="dialog_header">' + e + "</div>"
		})
	},
	_restoreBodyPosition : function () {
		if (!FB.UA.iPad()) {
			var e = document.getElementsByTagName("body")[0];
			FB.Dom.removeCss(e, "fb_hidden")
		}
	},
	_showIPadOverlay : function () {
		if (!FB.UA.iPad()) {
			return
		}
		if (!FB.Dialog._overlayEl) {
			FB.Dialog._overlayEl = document.createElement("div");
			FB.Dialog._overlayEl.setAttribute("id", "fb_dialog_ipad_overlay");
			FB.Content.append(FB.Dialog._overlayEl, null)
		}
		FB.Dialog._overlayEl.className = ""
	},
	_hideIPadOverlay : function () {
		if (FB.UA.iPad()) {
			FB.Dialog._overlayEl.className = "hidden"
		}
	},
	showLoader : function (e, t) {
		FB.Dialog._showIPadOverlay();
		if (!FB.Dialog._loaderEl) {
			FB.Dialog._loaderEl = FB.Dialog._findRoot(FB.UA.mobile() ? FB.Dialog._createMobileLoader() : FB.Dialog._createWWWLoader(t))
		}
		if (!e) {
			e = function () {}

		}
		var n = FB.$("fb_dialog_loader_close");
		FB.Dom.removeCss(n, "fb_hidden");
		n.onclick = function () {
			FB.Dialog._hideLoader();
			FB.Dialog._restoreBodyPosition();
			FB.Dialog._hideIPadOverlay();
			e()
		};
		var r = FB.$("fb_dialog_ipad_overlay");
		if (r) {
			r.ontouchstart = n.onclick
		}
		FB.Dialog._makeActive(FB.Dialog._loaderEl)
	},
	_hideLoader : function () {
		if (FB.Dialog._loaderEl && FB.Dialog._loaderEl == FB.Dialog._active) {
			FB.Dialog._loaderEl.style.top = "-10000px"
		}
	},
	_makeActive : function (e) {
		FB.Dialog._setDialogSizes();
		FB.Dialog._lowerActive();
		FB.Dialog._active = e;
		if (FB.Canvas) {
			FB.Canvas.getPageInfo(function (e) {
				FB.Dialog._centerActive(e)
			})
		}
		FB.Dialog._centerActive(FB.Canvas._pageInfo)
	},
	_lowerActive : function () {
		if (!FB.Dialog._active) {
			return
		}
		FB.Dialog._active.style.top = "-10000px";
		FB.Dialog._active = null
	},
	_removeStacked : function (e) {
		FB.Dialog._stack = FB.Array.filter(FB.Dialog._stack, function (t) {
				return t != e
			})
	},
	_centerActive : function (e) {
		var t = FB.Dialog._active;
		if (!t) {
			return
		}
		var n = FB.Dom.getViewportInfo();
		var r = parseInt(t.offsetWidth, 10);
		var i = parseInt(t.offsetHeight, 10);
		var s = n.scrollLeft + (n.width - r) / 2;
		var o = (n.height - i) / 2.5;
		if (s < o) {
			o = s
		}
		var u = n.height - i - o;
		var a = (n.height - i) / 2;
		if (e) {
			a = e.scrollTop - e.offsetTop + (e.clientHeight - i) / 2
		}
		if (a < o) {
			a = o
		} else if (a > u) {
			a = u
		}
		a += n.scrollTop;
		if (FB.UA.mobile()) {
			var f = 100;
			if (FB.UA.iPad()) {
				f += (n.height - i) / 2
			} else {
				var l = document.getElementsByTagName("body")[0];
				FB.Dom.addCss(l, "fb_hidden");
				s = 1e4;
				a = 1e4
			}
			var c = FB.Dom.getByClass("fb_dialog_padding", t);
			if (c.length) {
				c[0].style.height = f + "px"
			}
		}
		t.style.left = (s > 0 ? s : 0) + "px";
		t.style.top = (a > 0 ? a : 0) + "px"
	},
	_setDialogSizes : function () {
		if (!FB.UA.mobile() || FB.UA.iPad()) {
			return
		}
		for (var e in FB.Dialog._dialogs) {
			if (document.getElementById(e)) {
				var t = document.getElementById(e);
				t.style.width = FB.UIServer.getDefaultSize().width + "px";
				t.style.height = FB.UIServer.getDefaultSize().height + "px"
			}
		}
	},
	_handleOrientationChange : function (e) {
		if (FB.UA.android() && screen.availWidth == FB.Dialog._availScreenWidth) {
			window.setTimeout(FB.Dialog._handleOrientationChange, 50);
			return
		}
		FB.Dialog._availScreenWidth = screen.availWidth;
		if (FB.UA.iPad()) {
			FB.Dialog._centerActive()
		} else {
			for (var t in FB.Dialog._dialogs) {
				if (document.getElementById(t)) {
					document.getElementById(t).style.width = FB.UIServer.getDefaultSize().width + "px"
				}
			}
		}
	},
	_addOrientationHandler : function () {
		if (!FB.UA.mobile()) {
			return
		}
		var e = "onorientationchange" in window ? "orientationchange" : "resize";
		FB.Dialog._availScreenWidth = screen.availWidth;
		FB.Event.listen(window, e, FB.Dialog._handleOrientationChange)
	},
	create : function (e) {
		e = e || {};
		var t = document.createElement("div"),
		n = document.createElement("div"),
		r = "fb_dialog";
		if (e.closeIcon && e.onClose) {
			var i = document.createElement("a");
			i.className = "fb_dialog_close_icon";
			i.onclick = e.onClose;
			t.appendChild(i)
		}
		r += " " + (e.classes || "");
		if (FB.UA.ie()) {
			r += " fb_dialog_legacy";
			FB.Array.forEach(["vert_left", "vert_right", "horiz_top", "horiz_bottom", "top_left", "top_right", "bottom_left", "bottom_right"], function (e) {
				var n = document.createElement("span");
				n.className = "fb_dialog_" + e;
				t.appendChild(n)
			})
		} else {
			r += FB.UA.mobile() ? " fb_dialog_mobile" : " fb_dialog_advanced"
		}
		if (e.content) {
			FB.Content.append(e.content, n)
		}
		t.className = r;
		var s = parseInt(e.width, 10);
		if (!isNaN(s)) {
			t.style.width = s + "px"
		}
		n.className = "fb_dialog_content";
		t.appendChild(n);
		if (FB.UA.mobile()) {
			var o = document.createElement("div");
			o.className = "fb_dialog_padding";
			t.appendChild(o)
		}
		FB.Content.append(t);
		if (e.visible) {
			FB.Dialog.show(t)
		}
		return n
	},
	show : function (e) {
		var t = FB.Dialog._findRoot(e);
		if (t) {
			FB.Dialog._removeStacked(t);
			FB.Dialog._hideLoader();
			FB.Dialog._makeActive(t);
			FB.Dialog._stack.push(t);
			if ("fbCallID" in e) {
				FB.Dialog.get(e.fbCallID).fire("iframe_show")
			}
			if (!FB.Event._popStateListenerOn) {
				FB.Event.listen(window, "popstate", FB.Dialog._hideOnPopState);
				FB.Event._popStateListenerOn = true
			}
		}
	},
	hide : function (e) {
		var t = FB.Dialog._findRoot(e);
		if (t == FB.Dialog._active) {
			FB.Dialog._lowerActive();
			FB.Dialog._restoreBodyPosition();
			FB.Dialog._hideIPadOverlay();
			if ("fbCallID" in e) {
				FB.Dialog.get(e.fbCallID).fire("iframe_hide")
			}
			if (FB.Event._popStateListenerOn) {
				FB.Event.unlisten(window, "popstate", FB.Dialog._hideOnPopState);
				FB.Event._popStateListenerOn = false
			}
		}
	},
	remove : function (e) {
		e = FB.Dialog._findRoot(e);
		if (e) {
			var t = FB.Dialog._active == e;
			FB.Dialog._removeStacked(e);
			if (t) {
				FB.Dialog._hideLoader();
				if (FB.Dialog._stack.length > 0) {
					FB.Dialog.show(FB.Dialog._stack.pop())
				} else {
					FB.Dialog._lowerActive();
					FB.Dialog._restoreBodyPosition();
					FB.Dialog._hideIPadOverlay()
				}
			} else if (FB.Dialog._active === null && FB.Dialog._stack.length > 0) {
				FB.Dialog.show(FB.Dialog._stack.pop())
			}
			window.setTimeout(function () {
				e.parentNode.removeChild(e)
			}, 3e3)
		}
	},
	isActive : function (e) {
		var t = FB.Dialog._findRoot(e);
		return t && t === FB.Dialog._active
	}
});
FB.provide("", {
	ui : function (e, t) {
		e = FB.copy({}, e);
		if (!e.method) {
			FB.log('"method" is a required parameter for FB.ui().');
			return null
		}
		if (FB._nativeInterface) {
			switch (e.method) {
			case "auth.login":
				FB._nativeInterface.login(e, t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on login!" + e)
				});
				break;
			case "permissions.request":
				FB._nativeInterface.login(e, t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on login!" + e)
				});
				break;
			case "permissions.oauth":
				FB._nativeInterface.login(e, t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on login!" + e)
				});
				break;
			case "auth.logout":
				FB._nativeInterface.logout(t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on logout!")
				});
				break;
			case "auth.status":
				FB._nativeInterface.getLoginStatus(t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on auth.status!")
				});
				break;
			case "login.status":
				FB._nativeInterface.getLoginStatus(t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on auth.status!")
				});
				break;
			case "feed":
				FB._nativeInterface.dialog(e, t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on auth.status!")
				});
				break;
			case "apprequests":
				FB._nativeInterface.dialog(e, t, function (e) {
					console.log("Cordova Facebook Connect plugin fail on auth.status!")
				});
				break
			}
			return
		}
		if ((e.method == "permissions.request" || e.method == "permissions.oauth") && (e.display == "iframe" || e.display == "dialog")) {
			var n;
			var r;
			n = e.scope;
			r = n.split(/\s|,/g);
			for (var i = 0; i < r.length; i++) {
				var s = FB.String.trim(r[i]);
				if (s && !FB.initSitevars.iframePermissions[s]) {
					e.display = "popup";
					break
				}
			}
		}
		var o = FB.UIServer.prepareCall(e, t);
		if (!o) {
			return null
		}
		var u = o.params.display;
		if (u === "dialog") {
			u = "iframe"
		} else if (u === "none") {
			u = "hidden"
		}
		var a = FB.UIServer[u];
		if (!a) {
			FB.log('"display" must be one of "popup", ' + '"dialog", "iframe", "touch", "async", "hidden", or "none"');
			return null
		}
		a(o);
		return o.dialog
	}
});
FB.provide("UIServer", {
	Methods : {},
	_loadedNodes : {},
	_defaultCb : {},
	_resultToken : '"xxRESULTTOKENxx"',
	_forceHTTPS : false,
	genericTransform : function (e) {
		if (e.params.display == "dialog" || e.params.display == "iframe") {
			e.params.display = "iframe";
			e.params.channel = FB.UIServer._xdChannelHandler(e.id, "parent.parent")
		}
		return e
	},
	prepareCall : function (e, t) {
		var n = e.method.toLowerCase(),
		r = FB.copy({}, FB.UIServer.Methods[n]),
		i = FB.guid(),
		s = r.noHttps !== true && (FB._https || n !== "auth.status" && n != "login.status");
		FB.UIServer._forceHTTPS = s;
		FB.copy(e, {
			api_key : FB._apiKey,
			app_id : FB._apiKey,
			locale : FB._locale,
			sdk : "joey",
			access_token : s && FB.getAccessToken() || undefined
		});
		e.display = FB.UIServer.getDisplayMode(r, e);
		if (!r.url) {
			r.url = "dialog/" + n
		}
		var o = {
			cb : t,
			id : i,
			size : r.size || FB.UIServer.getDefaultSize(),
			url : FB.getDomain(s ? "https_www" : "www") + r.url,
			forceHTTPS : s,
			params : e,
			name : n,
			dialog : new FB.Dialog(i)
		};
		var u = r.transform ? r.transform : FB.UIServer.genericTransform;
		if (u) {
			o = u(o);
			if (!o) {
				return
			}
		}
		var a = r.getXdRelation || FB.UIServer.getXdRelation;
		var f = a(o.params);
		if (!(o.id in FB.UIServer._defaultCb) && !("next" in o.params) && !("redirect_uri" in o.params)) {
			o.params.next = FB.UIServer._xdResult(o.cb, o.id, f, true)
		}
		if (f === "parent") {
			o.params.channel_url = FB.UIServer._xdChannelHandler(i, "parent.parent")
		}
		o = FB.UIServer.prepareParams(o);
		return o
	},
	prepareParams : function (e) {
		var t = e.params.method;
		if (!FB.Canvas.isTabIframe()) {
			delete e.params.method
		}
		if (FB.TemplateUI && FB.TemplateUI.supportsTemplate(t, e)) {
			if (FB.reportTemplates) {
				console.log("Using template for " + t + ".")
			}
			FB.TemplateUI.useCachedUI(t, e)
		} else {
			e.params = FB.JSON.flatten(e.params);
			var n = FB.QS.encode(e.params);
			if (!FB.UA.nativeApp() && FB.UIServer.urlTooLongForIE(e.url + "?" + n)) {
				e.post = true
			} else if (n) {
				e.url += "?" + n
			}
		}
		return e
	},
	urlTooLongForIE : function (e) {
		return e.length > 2e3
	},
	getDisplayMode : function (e, t) {
		if (t.display === "hidden" || t.display === "none") {
			return t.display
		}
		if (FB.Canvas.isTabIframe() && t.display !== "popup") {
			return "async"
		}
		if (FB.UA.mobile() || t.display === "touch") {
			return "touch"
		}
		if (!FB.getAccessToken() && t.display == "dialog" && !e.loggedOutIframe) {
			FB.log('"dialog" mode can only be used when the user is connected.');
			return "popup"
		}
		if (e.connectDisplay && !FB._inCanvas) {
			return e.connectDisplay
		}
		return t.display || (FB.getAccessToken() ? "dialog" : "popup")
	},
	getXdRelation : function (e) {
		var t = e.display;
		if (t === "popup" || t === "touch") {
			return "opener"
		}
		if (t === "dialog" || t === "iframe" || t === "hidden" || t === "none") {
			return "parent"
		}
		if (t === "async") {
			return "parent.frames[" + window.name + "]"
		}
	},
	popup : function (e) {
		var t = typeof window.screenX != "undefined" ? window.screenX : window.screenLeft,
		n = typeof window.screenY != "undefined" ? window.screenY : window.screenTop,
		r = typeof window.outerWidth != "undefined" ? window.outerWidth : document.documentElement.clientWidth,
		i = typeof window.outerHeight != "undefined" ? window.outerHeight : document.documentElement.clientHeight - 22,
		s = FB.UA.mobile() ? null : e.size.width,
		o = FB.UA.mobile() ? null : e.size.height,
		u = t < 0 ? window.screen.width + t : t,
		a = parseInt(u + (r - s) / 2, 10),
		f = parseInt(n + (i - o) / 2.5, 10),
		l = [];
		if (s !== null) {
			l.push("width=" + s)
		}
		if (o !== null) {
			l.push("height=" + o)
		}
		l.push("left=" + a);
		l.push("top=" + f);
		l.push("scrollbars=1");
		if (e.name == "permissions.request" || e.name == "permissions.oauth") {
			l.push("location=1,toolbar=0")
		}
		l = l.join(",");
		if (e.post) {
			FB.UIServer.setLoadedNode(e, window.open("about:blank", e.id, l), "popup");
			FB.Content.submitToTarget({
				url : e.url,
				target : e.id,
				params : e.params
			})
		} else {
			FB.UIServer.setLoadedNode(e, window.open(e.url, e.id, l), "popup")
		}
		if (e.id in FB.UIServer._defaultCb) {
			FB.UIServer._popupMonitor()
		}
	},
	setLoadedNode : function (e, t, n) {
		if (e.params && e.params.display != "popup") {
			t.fbCallID = e.id
		}
		t = {
			node : t,
			type : n,
			fbCallID : e.id
		};
		FB.UIServer._loadedNodes[e.id] = t
	},
	getLoadedNode : function (e) {
		var t = typeof e == "object" ? e.id : e,
		n = FB.UIServer._loadedNodes[t];
		return n ? n.node : null
	},
	hidden : function (e) {
		e.className = "FB_UI_Hidden";
		e.root = FB.Content.appendHidden("");
		FB.UIServer._insertIframe(e)
	},
	iframe : function (e) {
		e.className = "FB_UI_Dialog";
		var t = function () {
			FB.UIServer._triggerDefault(e.id)
		};
		e.root = FB.Dialog.create({
				onClose : t,
				closeIcon : true,
				classes : FB.UA.iPad() ? "centered" : ""
			});
		if (!e.hideLoader) {
			FB.Dialog.showLoader(t, e.size.width)
		}
		FB.Dom.addCss(e.root, "fb_dialog_iframe");
		FB.UIServer._insertIframe(e)
	},
	touch : function (e) {
		if (e.params && e.params.in_iframe) {
			if (e.ui_created) {
				FB.Dialog.showLoader(function () {
					FB.UIServer._triggerDefault(e.id)
				}, 0)
			} else {
				FB.UIServer.iframe(e)
			}
		} else if (FB.UA.nativeApp() && !e.ui_created) {
			e.frame = e.id;
			FB.Native.onready(function () {
				FB.UIServer.setLoadedNode(e, FB.Native.open(e.url + "#cb=" + e.frameName))
			});
			FB.UIServer._popupMonitor()
		} else if (!e.ui_created) {
			FB.UIServer.popup(e)
		}
	},
	async : function (e) {
		e.frame = window.name;
		delete e.url;
		delete e.size;
		FB.Arbiter.inform("showDialog", e)
	},
	getDefaultSize : function () {
		if (FB.UA.mobile()) {
			if (FB.UA.iPad()) {
				return {
					width : 500,
					height : 590
				}
			} else if (FB.UA.android()) {
				return {
					width : screen.availWidth,
					height : screen.availHeight
				}
			} else {
				var e = window.innerWidth;
				var t = window.innerHeight;
				var n = e / t > 1.2;
				return {
					width : e,
					height : Math.max(t, n ? screen.width : screen.height)
				}
			}
		}
		return {
			width : 575,
			height : 240
		}
	},
	_insertIframe : function (e) {
		FB.UIServer._loadedNodes[e.id] = false;
		var t = function (t) {
			if (e.id in FB.UIServer._loadedNodes) {
				FB.UIServer.setLoadedNode(e, t, "iframe")
			}
		};
		if (e.post) {
			FB.Content.insertIframe({
				url : "about:blank",
				root : e.root,
				className : e.className,
				width : e.size.width,
				height : e.size.height,
				id : e.id,
				onInsert : t,
				onload : function (t) {
					FB.Content.submitToTarget({
						url : e.url,
						target : t.name,
						params : e.params
					})
				}
			})
		} else {
			FB.Content.insertIframe({
				url : e.url,
				root : e.root,
				className : e.className,
				width : e.size.width,
				height : e.size.height,
				id : e.id,
				name : e.frameName,
				onInsert : t
			})
		}
	},
	_handleResizeMessage : function (e, t) {
		var n = FB.UIServer.getLoadedNode(e);
		if (!n) {
			return
		}
		if (t.height) {
			n.style.height = t.height + "px"
		}
		if (t.width) {
			n.style.width = t.width + "px"
		}
		FB.Arbiter.inform("resize.ack", t || {}, "parent.frames[" + n.name + "]", true);
		if (!FB.Dialog.isActive(n)) {
			FB.Dialog.show(n)
		}
	},
	_triggerDefault : function (e) {
		FB.UIServer._xdRecv({
			frame : e
		}, FB.UIServer._defaultCb[e] || function () {})
	},
	_popupMonitor : function () {
		var e;
		for (var t in FB.UIServer._loadedNodes) {
			if (FB.UIServer._loadedNodes.hasOwnProperty(t) && t in FB.UIServer._defaultCb) {
				var n = FB.UIServer._loadedNodes[t];
				if (n.type != "popup") {
					continue
				}
				win = n.node;
				try {
					if (win.closed) {
						FB.UIServer._triggerDefault(t)
					} else {
						e = true
					}
				} catch (r) {}

			}
		}
		if (e && !FB.UIServer._popupInterval) {
			FB.UIServer._popupInterval = window.setInterval(FB.UIServer._popupMonitor, 100)
		} else if (!e && FB.UIServer._popupInterval) {
			window.clearInterval(FB.UIServer._popupInterval);
			FB.UIServer._popupInterval = null
		}
	},
	_xdChannelHandler : function (e, t) {
		var n = FB.UIServer._forceHTTPS && FB.UA.ie() !== 7;
		return FB.XD.handler(function (t) {
			var n = FB.UIServer.getLoadedNode(e);
			if (!n) {
				return
			}
			if (t.type == "resize") {
				FB.UIServer._handleResizeMessage(e, t)
			} else if (t.type == "hide") {
				FB.Dialog.hide(n)
			} else if (t.type == "rendered") {
				var r = FB.Dialog._findRoot(n);
				FB.Dialog.show(r)
			} else if (t.type == "fireevent") {
				FB.Event.fire(t.event)
			}
		}, t, true, null, n)
	},
	_xdNextHandler : function (e, t, n, r) {
		if (r) {
			FB.UIServer._defaultCb[t] = e
		}
		return FB.XD.handler(function (t) {
			FB.UIServer._xdRecv(t, e)
		}, n) + "&frame=" + t
	},
	_xdRecv : function (e, t) {
		var n = FB.UIServer.getLoadedNode(e.frame);
		if (n) {
			try {
				if (FB.Dom.containsCss(n, "FB_UI_Hidden")) {
					window.setTimeout(function () {
						n.parentNode.parentNode.removeChild(n.parentNode)
					}, 3e3)
				} else if (FB.Dom.containsCss(n, "FB_UI_Dialog")) {
					FB.Dialog.remove(n);
					if (FB.TemplateUI && FB.UA.mobile()) {
						FB.TemplateUI.populateCache()
					}
				}
			} catch (r) {}

			try {
				if (n.close) {
					n.close();
					FB.UIServer._popupCount--
				}
			} catch (i) {}

		}
		delete FB.UIServer._loadedNodes[e.frame];
		delete FB.UIServer._defaultCb[e.frame];
		t(e)
	},
	_xdResult : function (e, t, n, r) {
		return FB.UIServer._xdNextHandler(function (t) {
			e && e(t.result && t.result != FB.UIServer._resultToken && FB.JSON.parse(t.result))
		}, t, n, r) + "&result=" + encodeURIComponent(FB.UIServer._resultToken)
	}
});
FB.provide("", {
	getLoginStatus : function (e, t) {
		if (!FB._apiKey) {
			FB.log("FB.getLoginStatus() called before calling FB.init().");
			return
		}
		if (e) {
			if (!t && FB.Auth._loadState == "loaded") {
				e({
					status : FB._userStatus,
					authResponse : FB._authResponse
				});
				return
			} else {
				FB.Event.subscribe("FB.loginStatus", e)
			}
		}
		if (!t && FB.Auth._loadState == "loading") {
			return
		}
		FB.Auth._loadState = "loading";
		var n = function (e) {
			FB.Auth._loadState = "loaded";
			FB.Event.fire("FB.loginStatus", e);
			FB.Event.clear("FB.loginStatus")
		};
		FB.Auth.fetchLoginStatus(n)
	},
	getAuthResponse : function () {
		return FB._authResponse
	},
	getAccessToken : function () {
		return FB._authResponse && FB._authResponse.accessToken || null
	},
	getUserID : function () {
		return FB._userID
	},
	login : function (e, t) {
		if (t && t.perms && !t.scope) {
			t.scope = t.perms;
			delete t.perms;
			FB.log("OAuth2 specification states that 'perms' " + "should now be called 'scope'.  Please update.")
		}
		FB.ui(FB.copy({
				method : "permissions.oauth",
				display : "popup",
				domain : location.hostname
			}, t || {}), e)
	},
	logout : function (e) {
		FB.ui({
			method : "auth.logout",
			display : "hidden"
		}, e)
	}
});
FB.provide("Auth", {
	_callbacks : [],
	_xdStorePath : "xd_localstorage/",
	fetchLoginStatus : function (e) {
		if (FB.UA.mobile() && window.postMessage && window.localStorage && !FB._nativeInterface) {
			FB.Auth.staticAuthCheck(e)
		} else {
			FB.ui({
				method : "login.status",
				display : "none",
				domain : location.hostname
			}, e)
		}
	},
	staticAuthCheck : function (e) {
		var t = FB.getDomain("https_staticfb");
		FB.Content.insertIframe({
			root : FB.Content.appendHidden(""),
			className : "FB_UI_Hidden",
			url : t + FB.Auth._xdStorePath,
			onload : function (n) {
				var r = frames[n.name];
				var i = FB.guid();
				var s = false;
				var o = function (t) {
					if (!s) {
						s = true;
						FB.Auth._staticAuthHandler(e, t)
					}
				};
				FB.XD.handler(o, "parent", true, i);
				setTimeout(o, 500);
				r.postMessage(FB.JSON.stringify({
						method : "getItem",
						params : ["LoginInfo_" + FB._apiKey, true],
						returnCb : i
					}), t)
			}
		})
	},
	_staticAuthHandler : function (e, t) {
		if (t && t.data && t.data.status && t.data.status == "connected") {
			var n;
			var r = t.data.status;
			if (t.data.https == 1) {
				FB._https = true
			}
			var i = t.data.authResponse || null;
			n = FB.Auth.setAuthResponse(i, r);
			e && e(n)
		} else {
			FB.ui({
				method : "login.status",
				display : "none"
			}, e)
		}
	},
	setAuthResponse : function (e, t) {
		var n = 0;
		if (e) {
			if (e.userID) {
				n = e.userID
			} else if (e.signedRequest) {
				var r = FB.Auth.parseSignedRequest(e.signedRequest);
				if (r && r.user_id) {
					n = r.user_id
				}
			}
		}
		var i = !FB._userID && e,
		s = FB._userID && !e,
		o = e && FB._userID != n,
		u = i || s || o,
		a = t != FB._userStatus;
		var f = {
			authResponse : e,
			status : t
		};
		FB._authResponse = e;
		FB._userID = n;
		FB._userStatus = t;
		if (s || o) {
			FB.Event.fire("auth.logout", f)
		}
		if (i || o) {
			FB.Event.fire("auth.login", f)
		}
		if (u) {
			FB.Event.fire("auth.authResponseChange", f)
		}
		if (a) {
			FB.Event.fire("auth.statusChange", f)
		}
		if (FB.Auth._refreshTimer) {
			window.clearTimeout(FB.Auth._refreshTimer);
			delete FB.Auth._refreshTimer
		}
		if (FB.Auth._loadState && e) {
			FB.Auth._refreshTimer = window.setTimeout(function () {
					FB.getLoginStatus(null, true)
				}, 12e5)
		}
		return f
	},
	_getContextType : function () {
		if (FB.UA.nativeApp()) {
			return 3
		}
		if (FB.UA.mobile()) {
			return 2
		}
		if (FB._inCanvas) {
			return 5
		}
		return 1
	},
	xdHandler : function (e, t, n, r, i) {
		return FB.UIServer._xdNextHandler(FB.Auth.xdResponseWrapper(e, r, i), t, n, true)
	},
	xdResponseWrapper : function (e, t, n) {
		return function (r) {
			if (r.access_token) {
				var i = FB.Auth.parseSignedRequest(r.signed_request);
				t = {
					accessToken : r.access_token,
					userID : i.user_id,
					expiresIn : parseInt(r.expires_in, 10),
					signedRequest : r.signed_request
				};
				if (FB.Cookie.getEnabled()) {
					var s = t.expiresIn === 0 ? 0 : (new Date).getTime() + t.expiresIn * 1e3;
					var o = FB.Cookie._domain;
					if (!o && r.base_domain) {
						o = "." + r.base_domain
					}
					FB.Cookie.setSignedRequestCookie(r.signed_request, s, o)
				}
				FB.Auth.setAuthResponse(t, "connected")
			} else if (!FB._authResponse && t) {
				FB.Auth.setAuthResponse(t, "connected")
			} else if (!(t && n == "permissions.oauth")) {
				var u;
				if (r.error && r.error === "not_authorized") {
					u = "not_authorized"
				} else {
					u = "unknown"
				}
				FB.Auth.setAuthResponse(null, u);
				if (FB.Cookie.getEnabled()) {
					FB.Cookie.clearSignedRequestCookie()
				}
			}
			if (r && r.https == 1 && !FB._https) {
				FB._https = true
			}
			response = {
				authResponse : FB._authResponse,
				status : FB._userStatus
			};
			e && e(response)
		}
	},
	parseSignedRequest : function (e) {
		if (!e) {
			return null
		}
		var t = e.split(".", 2);
		var n = t[1];
		var r = FB.Auth.base64URLDecode(n);
		return FB.JSON.parse(r)
	},
	base64URLDecode : function (e) {
		e = e.replace(/\-/g, "+").replace(/\_/g, "/");
		if (e.length % 4 !== 0) {
			var t = 4 - e.length % 4;
			for (var n = 0; n < t; n++) {
				e = e + "="
			}
		}
		var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var i = "";
		var s,
		o,
		u = "";
		var a,
		f,
		l,
		c = "";
		for (var h = 0; h < e.length; h += 4) {
			a = r.indexOf(e.charAt(h));
			f = r.indexOf(e.charAt(h + 1));
			l = r.indexOf(e.charAt(h + 2));
			c = r.indexOf(e.charAt(h + 3));
			s = a << 2 | f >> 4;
			o = (f & 15) << 4 | l >> 2;
			u = (l & 3) << 6 | c;
			i = i + String.fromCharCode(s);
			if (l != 64) {
				i = i + String.fromCharCode(o)
			}
			if (c != 64) {
				i = i + String.fromCharCode(u)
			}
			s = o = u = "";
			a = f = l = c = ""
		}
		return unescape(i)
	}
});
FB.provide("UIServer.Methods", {
	"permissions.oauth" : {
		url : "dialog/oauth",
		size : {
			width : FB.UA.mobile() ? null : 627,
			height : FB.UA.mobile() ? null : 326
		},
		transform : function (e) {
			if (!FB._apiKey) {
				FB.log("FB.login() called before FB.init().");
				return
			}
			if (FB._authResponse && !e.params.scope) {
				FB.log("FB.login() called when user is already connected.");
				e.cb && e.cb({
					status : FB._userStatus,
					authResponse : FB._authResponse
				});
				return
			}
			var t = e.cb,
			n = e.id;
			delete e.cb;
			FB.copy(e.params, {
				client_id : FB._apiKey,
				redirect_uri : FB.URI.resolve(FB.Auth.xdHandler(t, n, "opener", FB._authResponse, "permissions.oauth")),
				origin : FB.Auth._getContextType(),
				response_type : "token,signed_request",
				domain : location.hostname
			});
			return e
		}
	},
	"auth.logout" : {
		url : "logout.php",
		transform : function (e) {
			if (!FB._apiKey) {
				FB.log("FB.logout() called before calling FB.init().")
			} else if (!FB._authResponse) {
				FB.log("FB.logout() called without an access token.")
			} else {
				e.params.next = FB.Auth.xdHandler(e.cb, e.id, "parent", FB._authResponse);
				return e
			}
		}
	},
	"login.status" : {
		url : "dialog/oauth",
		transform : function (e) {
			var t = e.cb,
			n = e.id;
			delete e.cb;
			FB.copy(e.params, {
				client_id : FB._apiKey,
				redirect_uri : FB.Auth.xdHandler(t, n, "parent", FB._authResponse),
				origin : FB.Auth._getContextType(),
				response_type : "token,signed_request,code",
				domain : location.hostname
			});
			return e
		}
	}
});
FB.provide("CanvasInsights", {
	setDoneLoading : function (e) {
		FB.Canvas.setDoneLoading(e)
	}
});
FB.provide("Cookie", {
	_domain : null,
	_enabled : false,
	setEnabled : function (e) {
		FB.Cookie._enabled = !!e;
		if (typeof e == "string") {
			FB.Cookie._domain = e
		}
	},
	getEnabled : function () {
		return FB.Cookie._enabled
	},
	loadMeta : function () {
		var e = document.cookie.match("\\bfbm_" + FB._apiKey + "=([^;]*)\\b"),
		t;
		if (e) {
			t = FB.QS.decode(e[1]);
			if (!FB.Cookie._domain) {
				FB.Cookie._domain = t.base_domain
			}
		}
		return t
	},
	loadSignedRequest : function () {
		var e = document.cookie.match("\\bfbsr_" + FB._apiKey + "=([^;]*)\\b");
		if (!e) {
			return null
		}
		return e[1]
	},
	setSignedRequestCookie : function (e, t, n) {
		if (!e) {
			throw new Error("Value passed to FB.Cookie.setSignedRequestCookie " + "was empty.")
		}
		if (!FB.Cookie.getEnabled()) {
			return
		}
		if (n) {
			var r = FB.QS.encode({
					base_domain : n
				});
			FB.Cookie.setRaw("fbm_", r, t, n)
		}
		FB.Cookie._domain = n;
		FB.Cookie.setRaw("fbsr_", e, t, n)
	},
	clearSignedRequestCookie : function () {
		if (!FB.Cookie.getEnabled()) {
			return
		}
		FB.Cookie.setRaw("fbsr_", "", 0, FB.Cookie._domain)
	},
	setRaw : function (e, t, n, r) {
		if (r) {
			document.cookie = e + FB._apiKey + "=; expires=Wed, 04 Feb 2004 08:00:00 GMT;";
			document.cookie = e + FB._apiKey + "=; expires=Wed, 04 Feb 2004 08:00:00 GMT;" + "domain=" + location.hostname + ";"
		}
		var i = (new Date(n)).toGMTString();
		document.cookie = e + FB._apiKey + "=" + t + (t && n === 0 ? "" : "; expires=" + i) + "; path=/" + (r ? "; domain=" + r : "")
	}
});
FB.provide("Frictionless", {
	_allowedRecipients : {},
	_useFrictionless : false,
	_updateRecipients : function () {
		FB.Frictionless._allowedRecipients = {};
		FB.api("/me/apprequestformerrecipients", function (e) {
			if (!e || e.error) {
				return
			}
			FB.Array.forEach(e.data, function (e) {
				FB.Frictionless._allowedRecipients[e.recipient_id] = true
			}, false)
		})
	},
	init : function () {
		FB.Frictionless._useFrictionless = true;
		FB.getLoginStatus(function (e) {
			if (e.status == "connected") {
				FB.Frictionless._updateRecipients()
			}
		});
		FB.Event.subscribe("auth.login", function (e) {
			if (e.authResponse) {
				FB.Frictionless._updateRecipients()
			}
		})
	},
	_processRequestResponse : function (e, t) {
		return function (n) {
			var r = n && n.updated_frictionless;
			if (FB.Frictionless._useFrictionless && r) {
				FB.Frictionless._updateRecipients()
			}
			if (n) {
				if (!t && n.frictionless) {
					FB.Dialog._hideLoader();
					FB.Dialog._restoreBodyPosition();
					FB.Dialog._hideIPadOverlay()
				}
				delete n.frictionless;
				delete n.updated_frictionless
			}
			e && e(n)
		}
	},
	isAllowed : function (e) {
		if (!e) {
			return false
		}
		if (typeof e === "number") {
			return FB.Frictionless._allowedRecipients[e]
		}
		if (typeof e === "string") {
			e = e.split(",")
		}
		e = FB.Array.map(e, FB.String.trim);
		var t = true;
		var n = false;
		FB.Array.forEach(e, function (e) {
			t = t && FB.Frictionless._allowedRecipients[e];
			n = true
		}, false);
		return t && n
	}
});
FB.provide("Canvas.Prefetcher", {
	_sampleRate : 0,
	_appIdsBlacklist : [],
	_links : [],
	COLLECT_AUTOMATIC : 0,
	COLLECT_MANUAL : 1,
	_collectionMode : 0,
	addStaticResource : function (e) {
		if (!FB._inCanvas || !FB._apiKey) {
			return
		}
		FB.Canvas.Prefetcher._links.push(e)
	},
	setCollectionMode : function (e) {
		if (!FB._inCanvas || !FB._apiKey) {
			return false
		}
		if (e != FB.Canvas.Prefetcher.COLLECT_AUTOMATIC && e != FB.Canvas.Prefetcher.COLLECT_MANUAL) {
			return false
		}
		FB.Canvas.Prefetcher._collectionMode = e
	},
	_maybeSample : function () {
		if (!FB._inCanvas || !FB._apiKey || !FB.Canvas.Prefetcher._sampleRate) {
			return
		}
		var e = Math.random();
		if (e > 1 / FB.Canvas.Prefetcher._sampleRate) {
			return
		}
		if (FB.Canvas.Prefetcher._appIdsBlacklist == "*") {
			return
		}
		if (FB.Array.indexOf(FB.Canvas.Prefetcher._appIdsBlacklist, parseInt(FB._apiKey, 10)) != -1) {
			return
		}
		window.setTimeout(FB.Canvas.Prefetcher._sample, 3e4)
	},
	_sample : function () {
		var e = {
			object : "data",
			link : "href",
			script : "src"
		};
		if (FB.Canvas.Prefetcher._collectionMode == FB.Canvas.Prefetcher.COLLECT_AUTOMATIC) {
			FB.Array.forEach(e, function (e, t) {
				FB.Array.forEach(window.document.getElementsByTagName(t), function (t) {
					if (t[e]) {
						FB.Canvas.Prefetcher._links.push(t[e])
					}
				})
			})
		}
		var t = FB.JSON.stringify(FB.Canvas.Prefetcher._links);
		FB.api(FB._apiKey + "/staticresources", "post", {
			urls : t,
			is_https : FB._https
		});
		FB.Canvas.Prefetcher._links = []
	}
});
FB.provide("Canvas.EarlyFlush", {
	addResource : function (e) {
		return FB.Canvas.Prefetcher.addStaticResource(e)
	},
	setCollectionMode : function (e) {
		return FB.Canvas.Prefetcher.setCollectionMode(e)
	}
});
FB.provide("", {
	initSitevars : {},
	init : function (e) {
		e = FB.copy(e || {}, {
				logging : true,
				status : true
			});
		FB._userID = 0;
		FB._apiKey = e.appId || e.apiKey;
		FB._nativeInterface = e.nativeInterface;
		if (FB._nativeInterface) {
			FB._nativeInterface.init(FB._apiKey, function (e) {
				console.log("Cordova Facebook Connect plugin fail on init!")
			})
		}
		if (!e.logging && window.location.toString().indexOf("fb_debug=1") < 0) {
			FB._logging = false
		}
		FB.XD.init(e.channelUrl);
		if (FB.UA.mobile() && FB.TemplateUI && FB.TemplateData && FB.TemplateData._enabled && e.useCachedDialogs !== false) {
			FB.TemplateUI.init();
			FB.Event.subscribe("auth.statusChange", FB.TemplateData.update)
		}
		if (e.reportTemplates) {
			FB.reportTemplates = true
		}
		if (e.frictionlessRequests) {
			FB.Frictionless.init()
		}
		if (FB._apiKey) {
			FB.Cookie.setEnabled(e.cookie);

			if (e.authResponse) {
				FB.Auth.setAuthResponse(e.authResponse, "connected")
			} else {
				var t = FB.Cookie.loadSignedRequest();
				var n = FB.Auth.parseSignedRequest(t);
				FB._userID = n && n.user_id || 0;
				FB.Cookie.loadMeta()
			}
			if (e.status) {
				FB.getLoginStatus()
			}
		}
		if (FB._inCanvas) {
			FB.Canvas._setHideFlashCallback(e.hideFlashCallback);
			FB.Canvas.init()
		}
		FB.Event.subscribe("xfbml.parse", function () {
			FB.XFBML.IframeWidget.batchWidgetPipeRequests()
		});
		if (e.xfbml) {
			window.setTimeout(function () {
				if (FB.XFBML) {
					if (FB.initSitevars.parseXFBMLBeforeDomReady) {
						FB.XFBML.parse();
						var e = window.setInterval(function () {
								FB.XFBML.parse()
							}, 100);
						FB.Dom.ready(function () {
							window.clearInterval(e);
							FB.XFBML.parse()
						})
					} else {
						FB.Dom.ready(FB.XFBML.parse)
					}
				}
			}, 0)
		}
		if (FB.Canvas && FB.Canvas.Prefetcher) {
			FB.Canvas.Prefetcher._maybeSample()
		}
	}
});
FB.provide("UIServer.MobileIframableMethod", {
	transform : function (e) {
		if (e.params.display === "touch" && e.params.access_token && window.postMessage) {
			e.params.channel = FB.UIServer._xdChannelHandler(e.id, "parent");
			if (!FB.UA.nativeApp()) {
				e.params.in_iframe = 1
			}
			return e
		} else {
			return FB.UIServer.genericTransform(e)
		}
	},
	getXdRelation : function (e) {
		var t = e.display;
		if (t === "touch" && window.postMessage && e.in_iframe) {
			return "parent"
		}
		return FB.UIServer.getXdRelation(e)
	}
});
FB.provide("UIServer.Methods", {
	"stream.share" : {
		size : {
			width : 650,
			height : 340
		},
		url : "sharer.php",
		transform : function (e) {
			if (!e.params.u) {
				e.params.u = window.location.toString()
			}
			return e
		}
	},
	"fbml.dialog" : {
		size : {
			width : 575,
			height : 300
		},
		url : "render_fbml.php",
		loggedOutIframe : true,
		transform : function (e) {
			return e
		}
	},
	"auth.logintofacebook" : {
		size : {
			width : 530,
			height : 287
		},
		url : "login.php",
		transform : function (e) {
			e.params.skip_api_login = 1;
			var t = FB.UIServer.getXdRelation(e.params);
			var n = FB.UIServer._xdResult(e.cb, e.id, t, true);
			e.params.next = FB.getDomain(FB._https ? "https_www" : "www") + "login.php?" + FB.QS.encode({
					api_key : FB._apiKey,
					next : n,
					skip_api_login : 1
				});
			return e
		}
	},
	apprequests : {
		transform : function (e) {
			e = FB.UIServer.MobileIframableMethod.transform(e);
			e.params.frictionless = FB.Frictionless && FB.Frictionless._useFrictionless;
			if (e.params.frictionless) {
				if (FB.Frictionless.isAllowed(e.params.to)) {
					e.params.in_iframe = true;
					e.hideLoader = true
				}
				e.cb = FB.Frictionless._processRequestResponse(e.cb, e.hideLoader)
			}
			return e
		},
		getXdRelation : function (e) {
			return FB.UIServer.MobileIframableMethod.getXdRelation(e)
		}
	},
	feed : FB.UIServer.MobileIframableMethod
});
FB.provide("", {
	share : function (e) {
		FB.log("FB.share() has been deprecated. Please use FB.ui() instead.");
		FB.ui({
			display : "popup",
			method : "stream.share",
			u : e
		})
	},
	publish : function (e, t) {
		FB.log("FB.publish() has been deprecated. Please use FB.ui() instead.");
		e = e || {};
		FB.ui(FB.copy({
				display : "popup",
				method : "stream.publish",
				preview : 1
			}, e || {}), t)
	},
	addFriend : function (e, t) {
		FB.log("FB.addFriend() has been deprecated. Please use FB.ui() instead.");
		FB.ui({
			display : "popup",
			id : e,
			method : "friend.add"
		}, t)
	}
});
FB.UIServer.Methods["auth.login"] = FB.UIServer.Methods["permissions.request"];
FB.provide("XFBML", {
	_renderTimeout : 3e4,
	getElements : function (e, t, n) {
		var r = FB.Array,
		i = FB.XFBML._getDomElements(e, t, n),
		s = FB.Dom.getByClass(t + "-" + n, e, "div");
		i = r.toArray(i);
		s = r.toArray(s);
		s = r.filter(s, function (e) {
				return !e.hasChildNodes() || e.childNodes.length === 1 && e.childNodes[0].nodeType === 3
			});
		return r.merge(i, s)
	},
	parse : function (e, t) {
		e = e || document.body;
		var n = 1,
		r = function () {
			n--;
			if (n === 0) {
				t && t();
				FB.Event.fire("xfbml.render")
			}
		};
		var i = {};
		if (FB.XFBML._widgetPipeIsEnabled()) {
			FB.Array.forEach(FB.XFBML._tagInfos, function (t) {
				if (t.supportsWidgetPipe) {
					var n = t.xmlns ? t.xmlns : "fb";
					var r = FB.XFBML.getElements(e, n, t.localName);
					i[t.localName] = r;
					FB.XFBML._widgetPipeEnabledTagCount += r.length
				}
			})
		}
		FB.Array.forEach(FB.XFBML._tagInfos, function (t) {
			if (!t.xmlns) {
				t.xmlns = "fb"
			}
			var s;
			if (i[t.localName] !== undefined) {
				s = i[t.localName]
			} else {
				s = FB.XFBML.getElements(e, t.xmlns, t.localName)
			}
			for (var o = 0; o < s.length; o++) {
				n++;
				FB.XFBML._processElement(s[o], t, r)
			}
		});
		FB.Event.fire("xfbml.parse");
		window.setTimeout(function () {
			if (n > 0) {
				FB.log(n + " XFBML tags failed to render in " + FB.XFBML._renderTimeout + "ms.")
			}
		}, FB.XFBML._renderTimeout);
		r()
	},
	registerTag : function (e) {
		FB.XFBML._tagInfos.push(e)
	},
	shouldUseWidgetPipe : function () {
		if (!FB.XFBML._widgetPipeIsEnabled()) {
			return false
		}
		var e = FB.XFBML._widgetPipeEnabledTagCount > 1;
		return e
	},
	getBoolAttr : function (e, t) {
		t = FB.XFBML.getAttr(e, t);
		return t && FB.Array.indexOf(["true", "1", "yes", "on"], t.toLowerCase()) > -1
	},
	getAttr : function (e, t) {
		return e.getAttribute(t) || e.getAttribute(t.replace(/_/g, "-")) || e.getAttribute(t.replace(/-/g, "_")) || e.getAttribute(t.replace(/-/g, "")) || e.getAttribute(t.replace(/_/g, "")) || e.getAttribute("data-" + t) || e.getAttribute("data-" + t.replace(/_/g, "-")) || e.getAttribute("data-" + t.replace(/-/g, "_")) || e.getAttribute("data-" + t.replace(/-/g, "")) || e.getAttribute("data-" + t.replace(/_/g, "")) || null
	},
	_processElement : function (dom, tagInfo, cb) {
		var element = dom._element;
		if (element) {
			element.subscribe("render", cb);
			element.process()
		} else {
			var processor = function () {
				var fn = eval(tagInfo.className);
				var isLogin = false;
				var showFaces = true;
				var showLoginFace = false;
				var renderInIframe = false;
				var addToTimeline = tagInfo.className === "FB.XFBML.AddToTimeline";
				if (tagInfo.className === "FB.XFBML.LoginButton" || addToTimeline) {
					renderInIframe = FB.XFBML.getBoolAttr(dom, "render-in-iframe");
					mode = FB.XFBML.getAttr(dom, "mode");
					showFaces = addToTimeline && mode != "button" || FB.XFBML.getBoolAttr(dom, "show-faces");
					showLoginFace = FB.XFBML.getBoolAttr(dom, "show-login-face");
					isLogin = addToTimeline || renderInIframe || showFaces || showLoginFace || FB.XFBML.getBoolAttr(dom, "oneclick");
					if (isLogin && !addToTimeline) {
						fn = FB.XFBML.Login
					}
				}
				element = dom._element = new fn(dom);
				if (isLogin) {
					showFaces = !!showFaces;
					showLoginFace = !!showLoginFace;
					var extraParams = {
						show_faces : showFaces,
						show_login_face : showLoginFace,
						add_to_profile : addToTimeline,
						mode : mode
					};
					var scope = FB.XFBML.getAttr(dom, "scope") || FB.XFBML.getAttr(dom, "perms");
					if (scope) {
						extraParams.scope = scope
					}
					element.setExtraParams(extraParams)
				}
				element.subscribe("render", cb);
				element.process()
			};
			if (FB.CLASSES[tagInfo.className.substr(3)]) {
				processor()
			} else {
				FB.log("Tag " + tagInfo.className + " was not found.")
			}
		}
	},
	_getDomElements : function (e, t, n) {
		var r = t + ":" + n;
		if (FB.UA.firefox()) {
			return e.getElementsByTagNameNS(document.body.namespaceURI, r)
		} else if (FB.UA.ie() < 9) {
			try {
				var i = document.namespaces;
				if (i && i[t]) {
					var s = e.getElementsByTagName(n);
					if (!document.addEventListener || s.length > 0) {
						return s
					}
				}
			} catch (o) {}

			return e.getElementsByTagName(r)
		} else {
			return e.getElementsByTagName(r)
		}
	},
	_tagInfos : [{
			localName : "activity",
			className : "FB.XFBML.Activity"
		}, {
			localName : "add-profile-tab",
			className : "FB.XFBML.AddProfileTab"
		}, {
			localName : "add-to-timeline",
			className : "FB.XFBML.AddToTimeline"
		}, {
			localName : "bookmark",
			className : "FB.XFBML.Bookmark"
		}, {
			localName : "comments",
			className : "FB.XFBML.Comments"
		}, {
			localName : "comments-count",
			className : "FB.XFBML.CommentsCount"
		}, {
			localName : "connect-bar",
			className : "FB.XFBML.ConnectBar"
		}, {
			localName : "fan",
			className : "FB.XFBML.Fan"
		}, {
			localName : "like",
			className : "FB.XFBML.Like",
			supportsWidgetPipe : true
		}, {
			localName : "like-box",
			className : "FB.XFBML.LikeBox"
		}, {
			localName : "live-stream",
			className : "FB.XFBML.LiveStream"
		}, {
			localName : "login",
			className : "FB.XFBML.Login"
		}, {
			localName : "login-button",
			className : "FB.XFBML.LoginButton"
		}, {
			localName : "facepile",
			className : "FB.XFBML.Facepile"
		}, {
			localName : "friendpile",
			className : "FB.XFBML.Friendpile"
		}, {
			localName : "name",
			className : "FB.XFBML.Name"
		}, {
			localName : "profile-pic",
			className : "FB.XFBML.ProfilePic"
		}, {
			localName : "question",
			className : "FB.XFBML.Question"
		}, {
			localName : "recommendations",
			className : "FB.XFBML.Recommendations"
		}, {
			localName : "recommendations-bar",
			className : "FB.XFBML.RecommendationsBar"
		}, {
			localName : "registration",
			className : "FB.XFBML.Registration"
		}, {
			localName : "send",
			className : "FB.XFBML.Send"
		}, {
			localName : "serverfbml",
			className : "FB.XFBML.ServerFbml"
		}, {
			localName : "share-button",
			className : "FB.XFBML.ShareButton"
		}, {
			localName : "social-context",
			className : "FB.XFBML.SocialContext"
		}, {
			localName : "subscribe",
			className : "FB.XFBML.Subscribe"
		}
	],
	_widgetPipeEnabledTagCount : 0,
	_widgetPipeIsEnabled : function () {
		return FB.widgetPipeEnabledApps && FB.widgetPipeEnabledApps[FB._apiKey] !== undefined
	}
});
(function () {
	try {
		if (document.namespaces && !document.namespaces.item.fb) {
			document.namespaces.add("fb")
		}
	} catch (e) {}

})();
FB.provide("XFBML", {
	set : function (e, t, n) {
		FB.log("FB.XFBML.set() has been deprecated.");
		e.innerHTML = t;
		FB.XFBML.parse(e, n)
	}
});
FB.subclass("Waitable", "Obj", function () {}, {
	set : function (e) {
		this.setProperty("value", e)
	},
	error : function (e) {
		this.fire("error", e)
	},
	wait : function (e, t) {
		if (t) {
			this.subscribe("error", t)
		}
		this.monitor("value", this.bind(function () {
				if (this.value !== undefined) {
					e(this.value);
					return true
				}
			}))
	}
});
FB.subclass("Data.Query", "Waitable", function () {
	if (!FB.Data.Query._c) {
		FB.Data.Query._c = 1
	}
	this.name = "v_" + FB.Data.Query._c++
}, {
	parse : function (e) {
		var t = FB.String.format.apply(null, e),
		n = /^select (.*?) from (\w+)\s+where (.*)$/i.exec(t);
		this.fields = this._toFields(n[1]);
		this.table = n[2];
		this.where = this._parseWhere(n[3]);
		for (var r = 1; r < e.length; r++) {
			if (FB.Type.isType(e[r], FB.Data.Query)) {
				e[r].hasDependency = true
			}
		}
		return this
	},
	toFql : function () {
		var e = "select " + this.fields.join(",") + " from " + this.table + " where ";
		switch (this.where.type) {
		case "unknown":
			e += this.where.value;
			break;
		case "index":
			e += this.where.key + "=" + this._encode(this.where.value);
			break;
		case "in":
			if (this.where.value.length == 1) {
				e += this.where.key + "=" + this._encode(this.where.value[0])
			} else {
				e += this.where.key + " in (" + FB.Array.map(this.where.value, this._encode).join(",") + ")"
			}
			break
		}
		return e
	},
	_encode : function (e) {
		return typeof e == "string" ? FB.String.quote(e) : e
	},
	toString : function () {
		return "#" + this.name
	},
	_toFields : function (e) {
		return FB.Array.map(e.split(","), FB.String.trim)
	},
	_parseWhere : function (s) {
		var re = /^\s*(\w+)\s*=\s*(.*)\s*$/i.exec(s),
		result,
		value,
		type = "unknown";
		if (re) {
			value = re[2];
			if (/^(["'])(?:\\?.)*?\1$/.test(value)) {
				value = eval(value);
				type = "index"
			} else if (/^\d+\.?\d*$/.test(value)) {
				type = "index"
			}
		}
		if (type == "index") {
			result = {
				type : "index",
				key : re[1],
				value : value
			}
		} else {
			result = {
				type : "unknown",
				value : s
			}
		}
		return result
	}
});
FB.provide("Data", {
	query : function (e, t) {
		var n = (new FB.Data.Query).parse(arguments);
		FB.Data.queue.push(n);
		FB.Data._waitToProcess();
		return n
	},
	waitOn : function (dependencies, callback) {
		var result = new FB.Waitable,
		count = dependencies.length;
		if (typeof callback == "string") {
			var s = callback;
			callback = function (args) {
				return eval(s)
			}
		}
		FB.Array.forEach(dependencies, function (e) {
			e.monitor("value", function () {
				var t = false;
				if (FB.Data._getValue(e) !== undefined) {
					count--;
					t = true
				}
				if (count === 0) {
					var n = callback(FB.Array.map(dependencies, FB.Data._getValue));
					result.set(n !== undefined ? n : true)
				}
				return t
			})
		});
		return result
	},
	_getValue : function (e) {
		return FB.Type.isType(e, FB.Waitable) ? e.value : e
	},
	_selectByIndex : function (e, t, n, r) {
		var i = new FB.Data.Query;
		i.fields = e;
		i.table = t;
		i.where = {
			type : "index",
			key : n,
			value : r
		};
		FB.Data.queue.push(i);
		FB.Data._waitToProcess();
		return i
	},
	_waitToProcess : function () {
		if (FB.Data.timer < 0) {
			FB.Data.timer = setTimeout(FB.Data._process, 10)
		}
	},
	_process : function () {
		FB.Data.timer = -1;
		var e = {},
		t = FB.Data.queue;
		FB.Data.queue = [];
		for (var n = 0; n < t.length; n++) {
			var r = t[n];
			if (r.where.type == "index" && !r.hasDependency) {
				FB.Data._mergeIndexQuery(r, e)
			} else {
				e[r.name] = r
			}
		}
		var i = {
			q : {}

		};
		FB.copy(i.q, e, true, function (e) {
			return e.toFql()
		});
		i.queries = FB.JSON.stringify(i.queries);
		FB.api("/fql", "GET", i, function (t) {
			if (t.error) {
				FB.Array.forEach(e, function (e) {
					e.error(new Error(t.error.message))
				})
			} else {
				FB.Array.forEach(t.data, function (t) {
					e[t.name].set(t.fql_result_set)
				})
			}
		})
	},
	_mergeIndexQuery : function (e, t) {
		var n = e.where.key,
		r = e.where.value;
		var i = "index_" + e.table + "_" + n;
		var s = t[i];
		if (!s) {
			s = t[i] = new FB.Data.Query;
			s.fields = [n];
			s.table = e.table;
			s.where = {
				type : "in",
				key : n,
				value : []
			}
		}
		FB.Array.merge(s.fields, e.fields);
		FB.Array.merge(s.where.value, [r]);
		s.wait(function (t) {
			e.set(FB.Array.filter(t, function (e) {
					return e[n] == r
				}))
		})
	},
	timer : -1,
	queue : []
});
window.setTimeout(function () {
	var e = /(connect.facebook.net|facebook.com\/assets.php).*?#(.*)/;
	FB.Array.forEach(document.getElementsByTagName("script"), function (t) {
		if (t.src) {
			var n = e.exec(t.src);
			if (n) {
				var r = FB.QS.decode(n[2]);
				FB.Array.forEach(r, function (e, t) {
					if (e == "0") {
						r[t] = 0
					}
				});
				r.oauth = true;
				FB.init(r)
			}
		}
	});
	if (window.fbAsyncInit && !window.fbAsyncInit.hasRun) {
		window.fbAsyncInit.hasRun = true;
		fbAsyncInit()
	}
}, 0);
FB.provide("Native", {
	NATIVE_READY_EVENT : "fbNativeReady",
	onready : function (e) {
		if (!FB.UA.nativeApp()) {
			FB.log("FB.Native.onready only works when the page is rendered " + "in a WebView of the native Facebook app. Test if this is the " + "case calling FB.UA.nativeApp()");
			return
		}
		if (window.__fbNative && !this.nativeReady) {
			FB.provide("Native", window.__fbNative)
		}
		if (this.nativeReady) {
			e()
		} else {
			var t = function (n) {
				window.removeEventListener(FB.Native.NATIVE_READY_EVENT, t);
				FB.Native.onready(e)
			};
			window.addEventListener(FB.Native.NATIVE_READY_EVENT, t, false)
		}
	}
});
FB.provide("UIServer.Methods", {
	"pay.prompt" : {
		transform : function (e) {
			var t = FB.XD.handler(function (t) {
					e.cb(FB.JSON.parse(t.response))
				}, "parent.frames[" + (window.name || "iframe_canvas") + "]");
			e.params.channel = t;
			FB.Arbiter.inform("Pay.Prompt", e.params);
			return false
		}
	}
});
FB.provide("UIServer.Methods", {
	pay : {
		size : {
			width : 555,
			height : 120
		},
		noHttps : true,
		connectDisplay : "popup",
		transform : function (e) {
			if (!FB._inCanvas) {
				e.params.order_info = FB.JSON.stringify(e.params.order_info);
				return e
			}
			var t = FB.XD.handler(function (t) {
					e.cb(FB.JSON.parse(t.response))
				}, "parent.frames[" + (window.name || "iframe_canvas") + "]");
			e.params.channel = t;
			e.params.uiserver = true;
			FB.Arbiter.inform("Pay.Prompt", e.params);
			return false
		}
	}
});
FB.provide("Helper", {
	isUser : function (e) {
		return e < 22e8 || e >= 1e14 && e <= 0x5b0a58f100ef || e >= 89e12 && e <= 89999999999999
	},
	getLoggedInUser : function () {
		return FB.getUserID()
	},
	upperCaseFirstChar : function (e) {
		if (e.length > 0) {
			return e.substr(0, 1).toUpperCase() + e.substr(1)
		} else {
			return e
		}
	},
	getProfileLink : function (e, t, n) {
		n = n || (e ? FB.getDomain("www") + "profile.php?id=" + e.uid : null);
		if (n) {
			t = '<a class="fb_link" href="' + n + '">' + t + "</a>"
		}
		return t
	},
	invokeHandler : function (handler, scope, args) {
		if (handler) {
			if (typeof handler === "string") {
				eval(handler)
			} else if (handler.apply) {
				handler.apply(scope, args || [])
			}
		}
	},
	fireEvent : function (e, t) {
		var n = t._attr.href;
		t.fire(e, n);
		FB.Event.fire(e, n, t)
	},
	executeFunctionByName : function (e) {
		var t = Array.prototype.slice.call(arguments, 1);
		var n = e.split(".");
		var r = n.pop();
		var i = window;
		for (var s = 0; s < n.length; s++) {
			i = i[n[s]]
		}
		return i[r].apply(this, t)
	}
});
FB.provide("TemplateData", {
	_initialized : false,
	_version : 0,
	_response : null,
	_localStorageTimeout : 60 * 60 * 24,
	_enabled : true,
	enabled : function () {
		return FB.TemplateData._enabled && FB.TemplateData._initialized && FB.TemplateData.supportsLocalStorage() && FB._userStatus == "connected" && FB.TemplateData.getResponse()
	},
	supportsLocalStorage : function () {
		try {
			return "localStorage" in window && window.localStorage !== null
		} catch (e) {
			return false
		}
	},
	_isStale : function (e) {
		if (!e || !e.version || e.version != FB.TemplateData._version || e.currentUserID != FB.getUserID()) {
			return true
		}
		var t = Math.round((new Date).getTime());
		return (t - e.setAt) / 1e3 > FB.TemplateData._localStorageTimeout
	},
	getResponse : function () {
		var e = FB.TemplateData;
		try {
			e._response = e._response || e.supportsLocalStorage() && FB.JSON.parse(localStorage.FB_templateDataResponse || "null")
		} catch (t) {
			e._response = null
		}
		if (e._isStale(e._response)) {
			e.saveResponse(null)
		}
		return e._response
	},
	saveResponse : function (e) {
		FB.TemplateData._response = e;
		if (FB.TemplateData.supportsLocalStorage()) {
			localStorage.FB_templateDataResponse = FB.JSON.stringify(e)
		}
	},
	getData : function () {
		var e = FB.TemplateData.getResponse();
		return e ? e.data : {}

	},
	init : function (e) {
		if (!e) {
			return
		}
		FB.TemplateData._initialized = true;
		FB.TemplateData._version = e;
		if (FB.TemplateData.supportsLocalStorage() && !("FB_templateDataResponse" in localStorage)) {
			FB.TemplateData.clear()
		}
	},
	clear : function () {
		FB.TemplateData.saveResponse(null)
	},
	update : function (e) {
		if (FB._userStatus != "connected") {
			FB.TemplateData.clear()
		}
		if (FB._userStatus == "connected" && !FB.TemplateData.getResponse()) {
			FB.api({
				method : "dialog.template_data"
			}, function (e) {
				if ("error_code" in e) {
					return
				}
				var t = {
					data : e,
					currentUserID : FB.getUserID(),
					setAt : (new Date).getTime(),
					version : FB.TemplateData._version
				};
				FB.TemplateData.saveResponse(t)
			})
		}
	}
});
FB.subclass("TemplateUI", "Obj", function (e, t) {
	this.method = e;
	var n = FB.UA.nativeApp() ? 0 : 1;
	var r = {
		display : "touch",
		preview_template : 1,
		in_iframe : n,
		locale : FB._locale,
		v : FB.TemplateUI._version,
		user_agent : navigator.userAgent
	};
	if (window.devicePixelRatio) {
		r.m_pixel_ratio = window.devicePixelRatio
	}
	var i = FB.QS.encode(r);
	this.cachedCall = {
		url : FB.getDomain("staticfb") + "dialog/" + e + "?" + i,
		frameName : FB.guid(),
		id : FB.guid(),
		size : FB.UIServer.getDefaultSize(),
		hideLoader : true
	};
	FB.XD.handler(this.bind(function (e) {
			if (e.type == "getParams") {
				this.setProperty("getParamsCb", e.returnCb)
			}
		}), "parent", true, this.cachedCall.frameName);
	if (n) {
		FB.UIServer.iframe(this.cachedCall);
		FB.Dialog.hide(this.cachedCall.root)
	} else if (t && !FB.TemplateUI._preloads[this.cachedCall.url]) {
		var s = document.createElement("div");
		FB.TemplateUI._preloads[this.cachedCall.url] = {
			container : s
		};
		FB.Content.insertIframe({
			url : this.cachedCall.url,
			root : FB.Content.appendHidden(s)
		})
	}
}, {
	use : function (e) {
		if (!this.cachedCall.root) {
			FB.UIServer.touch(this.cachedCall);
			var t = FB.TemplateUI._preloads[this.cachedCall.url];
			if (t && t.container) {
				t.container.parentNode.removeChild(t.container);
				delete t.container
			}
		}
		e.ui_created = true;
		e.root = this.cachedCall.root;
		FB.UIServer.setLoadedNode(e, FB.UIServer.getLoadedNode(this.cachedCall.id));
		delete FB.UIServer._loadedNodes[this.cachedCall.id];
		var n = FB.Dialog._dialogs[e.id];
		FB.Dialog._dialogs[this.cachedCall.id] = n;
		n.id = this.cachedCall.id;
		delete FB.Dialog._dialogs[e.id];
		FB.UIServer.getLoadedNode(e).fbCallID = this.cachedCall.id;
		this.cachedCall.id = e.id;
		var r = {};
		FB.copy(r, e.params);
		FB.copy(r, FB.TemplateData.getData()[this.method]);
		r.frictionless = FB.TemplateUI.isFrictionlessAppRequest(this.method, r);
		r.common = FB.TemplateData.getData().common;
		r.method = this.method;
		this.setParams(r);
		if (FB.UA.nativeApp()) {
			FB.UIServer._popupMonitor()
		}
	},
	setParams : function (e) {
		this.monitor("getParamsCb", this.bind(function () {
				if (this.getParamsCb) {
					var t = frames[this.cachedCall.frameName] || FB.UIServer.getLoadedNode(this.cachedCall);
					t.postMessage(FB.JSON.stringify({
							params : e,
							cb : this.getParamsCb
						}), "*");
					return true
				}
			}))
	}
});
FB.provide("TemplateUI", {
	_timer : null,
	_cache : {},
	_preloads : {},
	_version : 0,
	init : function () {
		FB.TemplateData.init(FB.TemplateUI._version);
		FB.TemplateUI.initCache()
	},
	useCachedUI : function (e, t) {
		try {
			FB.TemplateUI.populateCache();
			cache = FB.TemplateUI._cache[e];
			delete FB.TemplateUI._cache[e];
			cache.use(t)
		} catch (n) {
			FB.TemplateData.clear()
		}
	},
	populateCache : function (e) {
		if (!FB.TemplateData.enabled() || !FB.UA.mobile()) {
			return
		}
		clearInterval(FB.TemplateUI._timer);
		var t = {
			feed : true,
			apprequests : true
		};
		for (var n in t) {
			if (!(n in FB.TemplateUI._cache)) {
				FB.TemplateUI._cache[n] = new FB.TemplateUI(n, e)
			}
		}
	},
	initCache : function () {
		FB.TemplateUI._timer = setInterval(function () {
				FB.TemplateUI.populateCache(true)
			}, 2e3)
	},
	supportsTemplate : function (e, t) {
		return FB.TemplateData.enabled() && FB.TemplateUI.paramsAllowTemplate(e, t.params) && t.params.display === "touch" && FB.UA.mobile()
	},
	paramsAllowTemplate : function (e, t) {
		var n = {
			feed : {
				to : 1,
				attachment : 1,
				source : 1
			},
			apprequests : {}

		};
		if (!(e in n)) {
			return false
		}
		for (var r in n[e]) {
			if (t[r]) {
				return false
			}
		}
		return !FB.TemplateUI.willWriteOnGet(e, t)
	},
	isFrictionlessAppRequest : function (e, t) {
		return e === "apprequests" && FB.Frictionless && FB.Frictionless._useFrictionless
	},
	willWriteOnGet : function (e, t) {
		return FB.TemplateUI.isFrictionlessAppRequest(e, t) && t.to && FB.Frictionless.isAllowed(t.to)
	}
});
FB.provide("URI", {
	resolve : function (e) {
		if (!e) {
			return window.location.href
		}
		var t = document.createElement("div");
		t.innerHTML = '<a href="' + e.replace(/"/g, "&quot;") + '"></a>';
		return t.firstChild.href
	}
});
FB.Class("XFBML.Element", function (e) {
	this.dom = e
}, FB.copy({
		getAttribute : function (e, t, n) {
			var r = FB.XFBML.getAttr(this.dom, e);
			return r ? n ? n(r) : r : t
		},
		_getBoolAttribute : function (e, t) {
			if (FB.XFBML.getAttr(this.dom, e) === null) {
				return t
			}
			return FB.XFBML.getBoolAttr(this.dom, e)
		},
		_getPxAttribute : function (e, t) {
			return this.getAttribute(e, t, function (e) {
				var n = parseInt(e.replace("px", ""), 10);
				if (isNaN(n)) {
					return t
				} else {
					return n
				}
			})
		},
		_getAttributeFromList : function (e, t, n) {
			return this.getAttribute(e, t, function (e) {
				e = e.toLowerCase();
				if (FB.Array.indexOf(n, e) > -1) {
					return e
				} else {
					return t
				}
			})
		},
		isValid : function () {
			for (var e = this.dom; e; e = e.parentNode) {
				if (e == document.body) {
					return true
				}
			}
		},
		clear : function () {
			this.dom.innerHTML = ""
		}
	}, FB.EventProvider));
FB.subclass("XFBML.IframeWidget", "XFBML.Element", null, {
	_iframeName : null,
	_showLoader : true,
	_refreshOnAuthChange : false,
	_allowReProcess : false,
	_fetchPreCachedLoader : false,
	_visibleAfter : "load",
	_widgetPipeEnabled : false,
	getUrlBits : function () {
		throw new Error("Inheriting class needs to implement getUrlBits().")
	},
	setupAndValidate : function () {
		return true
	},
	oneTimeSetup : function () {},
	getSize : function () {},
	getIframeName : function () {
		if (!this._iframeName && this._widgetPipeEnabled && FB.XFBML.shouldUseWidgetPipe()) {
			this._iframeName = this.generateWidgetPipeIframeName();
			FB.XFBML.IframeWidget.allWidgetPipeIframes[this._iframeName] = this;
			if (FB.XFBML.IframeWidget.masterWidgetPipeIframe === null) {
				FB.XFBML.IframeWidget.masterWidgetPipeIframe = this
			}
		}
		return this._iframeName
	},
	getIframeTitle : function () {},
	getChannelUrl : function () {
		if (!this._channelUrl) {
			var e = this;
			this._channelUrl = FB.XD.handler(function (t) {
					e.fire("xd." + t.type, t)
				}, "parent.parent", true)
		}
		return this._channelUrl
	},
	getIframeNode : function () {
		return this.dom.getElementsByTagName("iframe")[0]
	},
	arbiterInform : function (e, t, n) {
		if (this.loaded) {
			this._arbiterInform(e, t, n)
		} else {
			this.subscribe("iframe.onload", FB.bind(this._arbiterInform, this, e, t, n))
		}
	},
	_arbiterInform : function (e, t, n) {
		var r = 'parent.frames["' + this.getIframeNode().name + '"]';
		FB.Arbiter.inform(e, t, r, window.location.protocol == "https:", n)
	},
	getDefaultWebDomain : function () {
		return "www"
	},
	getDefaultStaticDomain : function () {
		return "cdn"
	},
	process : function (e) {
		if (this._done) {
			if (!this._allowReProcess && !e) {
				return
			}
			this.clear()
		} else {
			this._oneTimeSetup()
		}
		this._done = true;
		if (!this.setupAndValidate()) {
			this.fire("render");
			return
		}
		if (this._showLoader) {
			this._addLoader()
		}
		FB.Dom.addCss(this.dom, "fb_iframe_widget");
		if (this._visibleAfter != "immediate") {
			FB.Dom.addCss(this.dom, "fb_hide_iframes")
		} else {
			this.subscribe("iframe.onload", FB.bind(this.fire, this, "render"))
		}
		var t = this.getSize() || {};
		var n = this.getFullyQualifiedURL();
		if (t.width == "100%") {
			FB.Dom.addCss(this.dom, "fb_iframe_widget_fluid")
		}
		FB.Content.insertIframe({
			url : n,
			root : this.dom.appendChild(document.createElement("span")),
			name : this.getIframeName(),
			title : this.getIframeTitle(),
			className : FB._localeIsRtl ? "fb_rtl" : "fb_ltr",
			height : t.height,
			width : t.width,
			onload : FB.bind(this.fire, this, "iframe.onload")
		});
		this.loaded = false;
		this.subscribe("iframe.onload", FB.bind(function () {
				this.loaded = true
			}, this))
	},
	generateWidgetPipeIframeName : function () {
		FB.XFBML.IframeWidget.widgetPipeIframeCount++;
		return "fb_iframe_" + FB.XFBML.IframeWidget.widgetPipeIframeCount
	},
	getFullyQualifiedURL : function () {
		if (FB.XFBML.shouldUseWidgetPipe() && this._widgetPipeEnabled) {
			return this._getWidgetPipeShell()
		}
		var e = this._getURL();
		if (!this._fetchPreCachedLoader) {
			e += "?" + FB.QS.encode(this._getQS())
		}
		if (e.length > 2e3) {
			e = "about:blank";
			var t = FB.bind(function () {
					this._postRequest();
					this.unsubscribe("iframe.onload", t)
				}, this);
			this.subscribe("iframe.onload", t)
		}
		return e
	},
	_getWidgetPipeShell : function () {
		return FB.getDomain("www") + "common/widget_pipe_shell.php"
	},
	_oneTimeSetup : function () {
		this.subscribe("xd.resize", FB.bind(this._handleResizeMsg, this));
		if (FB.getLoginStatus) {
			this.subscribe("xd.refreshLoginStatus", FB.bind(FB.getLoginStatus, FB, function () {}, true));
			this.subscribe("xd.logout", FB.bind(FB.logout, FB, function () {}))
		}
		if (this._refreshOnAuthChange) {
			this._setupAuthRefresh()
		}
		if (this._visibleAfter == "load") {
			this.subscribe("iframe.onload", FB.bind(this._makeVisible, this))
		}
		this.oneTimeSetup()
	},
	_makeVisible : function () {
		this._removeLoader();
		FB.Dom.removeCss(this.dom, "fb_hide_iframes");
		this.fire("render")
	},
	_setupAuthRefresh : function () {
		FB.getLoginStatus(FB.bind(function (e) {
				var t = e.status;
				FB.Event.subscribe("auth.statusChange", FB.bind(function (e) {
						if (!this.isValid()) {
							return
						}
						if (t == "unknown" || e.status == "unknown") {
							this.process(true)
						}
						t = e.status
					}, this))
			}, this))
	},
	_handleResizeMsg : function (e) {
		if (!this.isValid()) {
			return
		}
		var t = this.getIframeNode();
		t.style.height = e.height + "px";
		if (e.width) {
			t.style.width = e.width + "px"
		}
		t.style.border = "none";
		this._makeVisible()
	},
	_addLoader : function () {
		if (!this._loaderDiv) {
			FB.Dom.addCss(this.dom, "fb_iframe_widget_loader");
			this._loaderDiv = document.createElement("div");
			this._loaderDiv.className = "FB_Loader";
			this.dom.appendChild(this._loaderDiv)
		}
	},
	_removeLoader : function () {
		if (this._loaderDiv) {
			FB.Dom.removeCss(this.dom, "fb_iframe_widget_loader");
			if (this._loaderDiv.parentNode) {
				this._loaderDiv.parentNode.removeChild(this._loaderDiv)
			}
			this._loaderDiv = null
		}
	},
	_getQS : function () {
		return FB.copy({
			api_key : FB._apiKey,
			locale : FB._locale,
			sdk : "joey",
			ref : this.getAttribute("ref")
		}, this.getUrlBits().params)
	},
	_getURL : function () {
		var e = this.getDefaultWebDomain(),
		t = "";
		if (this._fetchPreCachedLoader) {
			e = this.getDefaultStaticDomain();
			t = "static/"
		}
		return FB.getDomain(e) + "plugins/" + t + this.getUrlBits().name + ".php"
	},
	_postRequest : function () {
		FB.Content.submitToTarget({
			url : this._getURL(),
			target : this.getIframeNode().name,
			params : this._getQS()
		})
	}
});
FB.provide("XFBML.IframeWidget", {
	widgetPipeIframeCount : 0,
	masterWidgetPipeIframe : null,
	allWidgetPipeIframes : {},
	batchWidgetPipeRequests : function () {
		if (!FB.XFBML.IframeWidget.masterWidgetPipeIframe) {
			return
		}
		var e = FB.XFBML.IframeWidget._groupWidgetPipeDescriptions();
		var t = {
			widget_pipe : FB.JSON.stringify(e),
			href : window.location,
			site : location.hostname,
			channel : FB.XFBML.IframeWidget.masterWidgetPipeIframe.getChannelUrl(),
			api_key : FB._apiKey,
			locale : FB._locale,
			sdk : "joey"
		};
		var n = FB.guid();
		var r = FB.XFBML.IframeWidget.masterWidgetPipeIframe.dom;
		var i = r.appendChild(document.createElement("span"));
		FB.Content.insertIframe({
			url : "about:blank",
			root : i,
			name : n,
			className : "fb_hidden fb_invisible",
			onload : function () {
				FB.Content.submitToTarget({
					url : FB._domain.www + "widget_pipe.php?widget_pipe=1",
					target : n,
					params : t
				})
			}
		})
	},
	_groupWidgetPipeDescriptions : function () {
		var e = {};
		for (var t in FB.XFBML.IframeWidget.allWidgetPipeIframes) {
			var n = FB.XFBML.IframeWidget.allWidgetPipeIframes[t];
			var r = n.getUrlBits();
			var i = {
				widget : r.name
			};
			FB.copy(i, r.params);
			e[t] = i
		}
		return e
	}
});
FB.subclass("XFBML.Activity", "XFBML.IframeWidget", null, {
	_visibleAfter : "load",
	_refreshOnAuthChange : true,
	setupAndValidate : function () {
		this._attr = {
			border_color : this.getAttribute("border-color"),
			colorscheme : this.getAttribute("color-scheme"),
			filter : this.getAttribute("filter"),
			action : this.getAttribute("action"),
			max_age : this.getAttribute("max_age"),
			font : this.getAttribute("font"),
			linktarget : this.getAttribute("linktarget", "_blank"),
			header : this._getBoolAttribute("header"),
			height : this._getPxAttribute("height", 300),
			recommendations : this._getBoolAttribute("recommendations"),
			site : this.getAttribute("site", location.hostname),
			width : this._getPxAttribute("width", 300)
		};
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		return {
			name : "activity",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.ButtonElement", "XFBML.Element", null, {
	_allowedSizes : ["icon", "small", "medium", "large", "xlarge"],
	onClick : function () {
		throw new Error("Inheriting class needs to implement onClick().")
	},
	setupAndValidate : function () {
		return true
	},
	getButtonMarkup : function () {
		return this.getOriginalHTML()
	},
	getOriginalHTML : function () {
		return this._originalHTML
	},
	process : function () {
		if (!("_originalHTML" in this)) {
			this._originalHTML = FB.String.trim(this.dom.innerHTML)
		}
		if (!this.setupAndValidate()) {
			this.fire("render");
			return
		}
		var e = this._getAttributeFromList("size", "medium", this._allowedSizes),
		t = "",
		n = "";
		if (e == "icon") {
			t = "fb_button_simple"
		} else {
			var r = FB._localeIsRtl ? "_rtl" : "";
			n = this.getButtonMarkup();
			t = "fb_button" + r + " fb_button_" + e + r
		}
		if (n !== "") {
			this.dom.innerHTML = '<a class="' + t + '">' + '<span class="fb_button_text">' + n + "</span>" + "</a>";
			this.dom.firstChild.onclick = FB.bind(this.onClick, this)
		}
		this.fire("render")
	}
});
FB.subclass("XFBML.AddProfileTab", "XFBML.ButtonElement", null, {
	getButtonMarkup : function () {
		return FB.Intl.tx._("Add Profile Tab on Facebook")
	},
	onClick : function () {
		FB.ui({
			method : "profile.addtab"
		}, this.bind(function (e) {
				if (e.tab_added) {
					FB.Helper.invokeHandler(this.getAttribute("on-add"), this)
				}
			}))
	}
});
FB.subclass("XFBML.Facepile", "XFBML.IframeWidget", null, {
	_visibleAfter : "load",
	_extraParams : {},
	setupAndValidate : function () {
		this._attr = {
			href : this.getAttribute("href"),
			channel : this.getChannelUrl(),
			colorscheme : this.getAttribute("colorscheme", "light"),
			max_rows : this.getAttribute("max-rows"),
			action : this.getAttribute("action", "like"),
			tense : this.getAttribute("tense", "past"),
			width : this._getPxAttribute("width", 200),
			ref : this.getAttribute("ref"),
			size : this.getAttribute("size", "small"),
			extended_social_context : this.getAttribute("extended_social_context", false),
			login_text : this.dom.innerHTML
		};
		this.clear();
		for (var e in this._extraParams) {
			this._attr[e] = this._extraParams[e]
		}
		return true
	},
	setExtraParams : function (e) {
		this._extraParams = e
	},
	oneTimeSetup : function () {
		var e = FB._userStatus;
		FB.Event.subscribe("auth.statusChange", FB.bind(function (t) {
				if (e == "connected" || t.status == "connected") {
					this.process(true)
				}
				e = t.status
			}, this))
	},
	getSize : function () {
		if (this._attr.size == "large") {
			return {
				width : this._attr.width,
				height : 90
			}
		}
		return {
			width : this._attr.width,
			height : 70
		}
	},
	getUrlBits : function () {
		return {
			name : "facepile",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.AddToTimeline", "XFBML.Facepile", null, {
	_visibleAfter : "load",
	getSize : function () {
		return {
			width : 300,
			height : 250
		}
	},
	getUrlBits : function () {
		return {
			name : "add_to_timeline",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.Bookmark", "XFBML.ButtonElement", null, {
	getButtonMarkup : function () {
		return FB.Intl.tx._("Bookmark on Facebook")
	},
	onClick : function () {
		FB.ui({
			method : "bookmark.add"
		}, this.bind(function (e) {
				if (e.bookmarked) {
					FB.Helper.invokeHandler(this.getAttribute("on-add"), this)
				}
			}))
	}
});
FB.subclass("XFBML.Comments", "XFBML.IframeWidget", null, {
	_visibleAfter : "immediate",
	_refreshOnAuthChange : true,
	setupAndValidate : function () {
		var e = {
			channel_url : this.getChannelUrl(),
			colorscheme : this.getAttribute("colorscheme"),
			numposts : this.getAttribute("num-posts", 10),
			width : this._getPxAttribute("width", 550),
			href : this.getAttribute("href"),
			permalink : this.getAttribute("permalink"),
			publish_feed : this.getAttribute("publish_feed"),
			mobile : this._getBoolAttribute("mobile")
		};
		if (FB.initSitevars.enableMobileComments && FB.UA.mobile() && e.mobile !== false) {
			e.mobile = true
		}
		if (!e.href) {
			e.migrated = this.getAttribute("migrated");
			e.xid = this.getAttribute("xid");
			e.title = this.getAttribute("title", document.title);
			e.url = this.getAttribute("url", document.URL);
			e.quiet = this.getAttribute("quiet");
			e.reverse = this.getAttribute("reverse");
			e.simple = this.getAttribute("simple");
			e.css = this.getAttribute("css");
			e.notify = this.getAttribute("notify");
			if (!e.xid) {
				var t = document.URL.indexOf("#");
				if (t > 0) {
					e.xid = encodeURIComponent(document.URL.substring(0, t))
				} else {
					e.xid = encodeURIComponent(document.URL)
				}
			}
			if (e.migrated) {
				e.href = "http://www.facebook.com/plugins/comments_v1.php?" + "app_id=" + FB._apiKey + "&xid=" + encodeURIComponent(e.xid) + "&url=" + encodeURIComponent(e.url)
			}
		} else {
			var n = this.getAttribute("fb_comment_id");
			if (!n) {
				n = FB.QS.decode(document.URL.substring(document.URL.indexOf("?") + 1)).fb_comment_id;
				if (n && n.indexOf("#") > 0) {
					n = n.substring(0, n.indexOf("#"))
				}
			}
			if (n) {
				e.fb_comment_id = n;
				this.subscribe("render", FB.bind(function () {
						window.location.hash = this.getIframeNode().id
					}, this))
			}
		}
		this._attr = e;
		return true
	},
	oneTimeSetup : function () {
		this.subscribe("xd.addComment", FB.bind(this._handleCommentMsg, this));
		this.subscribe("xd.commentCreated", FB.bind(this._handleCommentCreatedMsg, this));
		this.subscribe("xd.commentRemoved", FB.bind(this._handleCommentRemovedMsg, this))
	},
	getSize : function () {
		if (this._attr.mobile) {
			return {
				width : "100%",
				height : 160
			}
		}
		return {
			width : this._attr.width,
			height : 160
		}
	},
	getUrlBits : function () {
		return {
			name : "comments",
			params : this._attr
		}
	},
	getDefaultWebDomain : function () {
		if (this._attr.mobile) {
			return "https_m"
		} else {
			return "https_www"
		}
	},
	_handleCommentMsg : function (e) {
		if (!this.isValid()) {
			return
		}
		FB.Event.fire("comments.add", {
			post : e.post,
			user : e.user,
			widget : this
		})
	},
	_handleCommentCreatedMsg : function (e) {
		if (!this.isValid()) {
			return
		}
		var t = {
			href : e.href,
			commentID : e.commentID,
			parentCommentID : e.parentCommentID
		};
		FB.Event.fire("comment.create", t)
	},
	_handleCommentRemovedMsg : function (e) {
		if (!this.isValid()) {
			return
		}
		var t = {
			href : e.href,
			commentID : e.commentID
		};
		FB.Event.fire("comment.remove", t)
	}
});
FB.subclass("XFBML.CommentsCount", "XFBML.Element", null, {
	process : function () {
		this._href = this.getAttribute("href", window.location.href);
		this._count = FB.Data._selectByIndex(["commentsbox_count"], "link_stat", "url", this._href);
		FB.Dom.addCss(this.dom, "fb_comments_count_zero");
		this._count.wait(FB.bind(function () {
				var e = this._count.value[0].commentsbox_count;
				this.dom.innerHTML = FB.String.format('<span class="fb_comments_count">{0}</span>', e);
				if (e > 0) {
					FB.Dom.removeCss(this.dom, "fb_comments_count_zero")
				}
				this.fire("render")
			}, this))
	}
});
FB.provide("Anim", {
	ate : function (e, t, n, r) {
		n = !isNaN(parseFloat(n)) && n >= 0 ? n : 750;
		var i = 40,
		s = {},
		o = {},
		u = null,
		a = e.style,
		f = setInterval(FB.bind(function () {
					if (!u) {
						u = (new Date).getTime()
					}
					var i = 1;
					if (n != 0) {
						i = Math.min(((new Date).getTime() - u) / n, 1)
					}
					FB.Array.forEach(t, FB.bind(function (t, n) {
							if (!s[n]) {
								var r = FB.Dom.getStyle(e, n);
								if (r === false) {
									return
								}
								s[n] = this._parseCSS(r + "")
							}
							if (!o[n]) {
								o[n] = this._parseCSS(t.toString())
							}
							var u = "";
							FB.Array.forEach(s[n], function (e, t) {
								if (isNaN(o[n][t].numPart) && o[n][t].textPart == "?") {
									u = e.numPart + e.textPart
								} else if (isNaN(e.numPart)) {
									u = e.textPart
								} else {
									u += e.numPart + Math.ceil((o[n][t].numPart - e.numPart) * Math.sin(Math.PI / 2 * i)) + o[n][t].textPart + " "
								}
							});
							FB.Dom.setStyle(e, n, u)
						}, this));
					if (i == 1) {
						clearInterval(f);
						if (r) {
							r(e)
						}
					}
				}, this), i)
	},
	_parseCSS : function (e) {
		var t = [];
		FB.Array.forEach(e.split(" "), function (e) {
			var n = parseInt(e, 10);
			t.push({
				numPart : n,
				textPart : e.replace(n, "")
			})
		});
		return t
	}
});
FB.provide("Insights", {
	impression : function (e, t) {
		var n = FB.guid(),
		r = "//ah8.facebook.com/impression.php/" + n + "/",
		i = new Image(1, 1),
		s = [];
		if (!e.api_key && FB._apiKey) {
			e.api_key = FB._apiKey
		}
		for (var o in e) {
			s.push(encodeURIComponent(o) + "=" + encodeURIComponent(e[o]))
		}
		r += "?" + s.join("&");
		if (t) {
			i.onload = t
		}
		i.src = r
	}
});
FB.subclass("XFBML.ConnectBar", "XFBML.Element", null, {
	_initialHeight : null,
	_initTopMargin : 0,
	_picFieldName : "pic_square",
	_page : null,
	_displayed : false,
	_notDisplayed : false,
	_container : null,
	_animationSpeed : 0,
	process : function () {
		FB.getLoginStatus(this.bind(function (e) {
				FB.Event.monitor("auth.statusChange", this.bind(function () {
						if (this.isValid() && FB._userStatus == "connected") {
							this._uid = FB.Helper.getLoggedInUser();
							FB.api({
								method : "Connect.shouldShowConnectBar"
							}, this.bind(function (e) {
									if (e != 2) {
										this._animationSpeed = e == 0 ? 750 : 0;
										this._showBar()
									} else {
										this._noRender()
									}
								}))
						} else {
							this._noRender()
						}
						return false
					}))
			}))
	},
	_showBar : function () {
		var e = FB.Data._selectByIndex(["first_name", "profile_url", this._picFieldName], "user", "uid", this._uid);
		var t = FB.Data._selectByIndex(["display_name"], "application", "api_key", FB._apiKey);
		FB.Data.waitOn([e, t], FB.bind(function (e) {
				e[0][0].site_name = e[1][0].display_name;
				if (!this._displayed) {
					this._displayed = true;
					this._notDisplayed = false;
					this._renderConnectBar(e[0][0]);
					this.fire("render");
					FB.Insights.impression({
						lid : 104,
						name : "widget_load"
					});
					this.fire("connectbar.ondisplay");
					FB.Event.fire("connectbar.ondisplay", this);
					FB.Helper.invokeHandler(this.getAttribute("on-display"), this)
				}
			}, this))
	},
	_noRender : function () {
		if (this._displayed) {
			this._displayed = false;
			this._closeConnectBar()
		}
		if (!this._notDisplayed) {
			this._notDisplayed = true;
			this.fire("render");
			this.fire("connectbar.onnotdisplay");
			FB.Event.fire("connectbar.onnotdisplay", this);
			FB.Helper.invokeHandler(this.getAttribute("on-not-display"), this)
		}
	},
	_renderConnectBar : function (e) {
		var t = document.createElement("div"),
		n = document.createElement("div");
		t.className = "fb_connect_bar";
		n.className = "fb_reset fb_connect_bar_container";
		n.appendChild(t);
		document.body.appendChild(n);
		this._container = n;
		this._initialHeight = Math.round(parseFloat(FB.Dom.getStyle(n, "height")) + parseFloat(FB.Dom.getStyle(n, "borderBottomWidth")));
		t.innerHTML = FB.String.format('<div class="fb_buttons">' + '<a href="#" class="fb_bar_close">' + '<img src="{1}" alt="{2}" title="{2}"/>' + "</a>" + "</div>" + '<a href="{7}" class="fb_profile" target="_blank">' + '<img src="{3}" alt="{4}" title="{4}"/>' + "</a>" + "{5}" + " <span>" + '<a href="{8}" class="fb_learn_more" target="_blank">{6}</a> &ndash; ' + '<a href="#" class="fb_no_thanks">{0}</a>' + "</span>", FB.Intl.tx._("No Thanks"), FB.getDomain("cdn") + FB.XFBML.ConnectBar.imgs.buttonUrl, FB.Intl.tx._("Close"), e[this._picFieldName] || FB.getDomain("cdn") + FB.XFBML.ConnectBar.imgs.missingProfileUrl, FB.String.escapeHTML(e.first_name), FB.Intl.tx._("Hi {firstName}. <strong>{siteName}</strong> is using Facebook to personalize your experience.", {
					firstName : FB.String.escapeHTML(e.first_name),
					siteName : FB.String.escapeHTML(e.site_name)
				}), FB.Intl.tx._("Learn More"), e.profile_url, FB.getDomain("www") + "sitetour/connect.php");
		var r = this;
		FB.Array.forEach(t.getElementsByTagName("a"), function (e) {
			e.onclick = FB.bind(r._clickHandler, r)
		});
		this._page = document.body;
		var i = 0;
		if (this._page.parentNode) {
			i = Math.round((parseFloat(FB.Dom.getStyle(this._page.parentNode, "height")) - parseFloat(FB.Dom.getStyle(this._page, "height"))) / 2)
		} else {
			i = parseInt(FB.Dom.getStyle(this._page, "marginTop"), 10)
		}
		i = isNaN(i) ? 0 : i;
		this._initTopMargin = i;
		if (!window.XMLHttpRequest) {
			n.className += " fb_connect_bar_container_ie6"
		} else {
			n.style.top = -1 * this._initialHeight + "px";
			FB.Anim.ate(n, {
				top : "0px"
			}, this._animationSpeed)
		}
		var s = {
			marginTop : this._initTopMargin + this._initialHeight + "px"
		};
		if (FB.UA.ie()) {
			s.backgroundPositionY = this._initialHeight + "px"
		} else {
			s.backgroundPosition = "? " + this._initialHeight + "px"
		}
		FB.Anim.ate(this._page, s, this._animationSpeed)
	},
	_clickHandler : function (e) {
		e = e || window.event;
		var t = e.target || e.srcElement;
		while (t.nodeName != "A") {
			t = t.parentNode
		}
		switch (t.className) {
		case "fb_bar_close":
			FB.api({
				method : "Connect.connectBarMarkAcknowledged"
			});
			FB.Insights.impression({
				lid : 104,
				name : "widget_user_closed"
			});
			this._closeConnectBar();
			break;
		case "fb_learn_more":
		case "fb_profile":
			window.open(t.href);
			break;
		case "fb_no_thanks":
			this._closeConnectBar();
			FB.api({
				method : "Connect.connectBarMarkAcknowledged"
			});
			FB.Insights.impression({
				lid : 104,
				name : "widget_user_no_thanks"
			});
			FB.api({
				method : "auth.revokeAuthorization",
				block : true
			}, this.bind(function () {
					this.fire("connectbar.ondeauth");
					FB.Event.fire("connectbar.ondeauth", this);
					FB.Helper.invokeHandler(this.getAttribute("on-deauth"), this);
					if (this._getBoolAttribute("auto-refresh", true)) {
						window.location.reload()
					}
				}));
			break
		}
		return false
	},
	_closeConnectBar : function () {
		this._notDisplayed = true;
		var e = {
			marginTop : this._initTopMargin + "px"
		};
		if (FB.UA.ie()) {
			e.backgroundPositionY = "0px"
		} else {
			e.backgroundPosition = "? 0px"
		}
		var t = this._animationSpeed == 0 ? 0 : 300;
		FB.Anim.ate(this._page, e, t);
		FB.Anim.ate(this._container, {
			top : -1 * this._initialHeight + "px"
		}, t, function (e) {
			e.parentNode.removeChild(e)
		});
		this.fire("connectbar.onclose");
		FB.Event.fire("connectbar.onclose", this);
		FB.Helper.invokeHandler(this.getAttribute("on-close"), this)
	}
});
FB.provide("XFBML.ConnectBar", {
	imgs : {
		buttonUrl : "images/facebook-widgets/close_btn.png",
		missingProfileUrl : "pics/q_silhouette.gif"
	}
});
FB.subclass("XFBML.Fan", "XFBML.IframeWidget", null, {
	_visibleAfter : "load",
	setupAndValidate : function () {
		this._attr = {
			api_key : FB._apiKey,
			connections : this.getAttribute("connections", "10"),
			css : this.getAttribute("css"),
			height : this._getPxAttribute("height"),
			id : this.getAttribute("profile-id"),
			logobar : this._getBoolAttribute("logo-bar"),
			name : this.getAttribute("name"),
			stream : this._getBoolAttribute("stream", true),
			width : this._getPxAttribute("width", 300)
		};
		if (!this._attr.id && !this._attr.name) {
			FB.log('<fb:fan> requires one of the "id" or "name" attributes.');
			return false
		}
		var e = this._attr.height;
		if (!e) {
			if ((!this._attr.connections || this._attr.connections === "0") && !this._attr.stream) {
				e = 65
			} else if (!this._attr.connections || this._attr.connections === "0") {
				e = 375
			} else if (!this._attr.stream) {
				e = 250
			} else {
				e = 550
			}
		}
		if (this._attr.logobar) {
			e += 25
		}
		this._attr.height = e;
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		return {
			name : "fan",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.Friendpile", "XFBML.Facepile", null, {});
FB.subclass("XFBML.EdgeCommentWidget", "XFBML.IframeWidget", function (e) {
	this._iframeWidth = e.width + 1;
	this._iframeHeight = e.height;
	this._attr = {
		master_frame_name : e.masterFrameName,
		offsetX : e.relativeWidthOffset - e.paddingLeft
	};
	this.dom = e.commentNode;
	this.dom.style.top = e.relativeHeightOffset + "px";
	this.dom.style.left = e.relativeWidthOffset + "px";
	this.dom.style.zIndex = FB.XFBML.EdgeCommentWidget.NextZIndex++;
	FB.Dom.addCss(this.dom, "fb_edge_comment_widget")
}, {
	_visibleAfter : "load",
	_showLoader : false,
	getSize : function () {
		return {
			width : this._iframeWidth,
			height : this._iframeHeight
		}
	},
	getUrlBits : function () {
		return {
			name : "comment_widget_shell",
			params : this._attr
		}
	}
});
FB.provide("XFBML.EdgeCommentWidget", {
	NextZIndex : 1e4
});
FB.subclass("XFBML.EdgeWidget", "XFBML.IframeWidget", null, {
	_visibleAfter : "immediate",
	_showLoader : false,
	_rootPadding : null,
	setupAndValidate : function () {
		FB.Dom.addCss(this.dom, "fb_edge_widget_with_comment");
		this._attr = {
			channel_url : this.getChannelUrl(),
			debug : this._getBoolAttribute("debug"),
			href : this.getAttribute("href", window.location.href),
			is_permalink : this._getBoolAttribute("is-permalink"),
			node_type : this.getAttribute("node-type", "link"),
			width : this._getWidgetWidth(),
			font : this.getAttribute("font"),
			layout : this._getLayout(),
			colorscheme : this.getAttribute("color-scheme"),
			action : this.getAttribute("action"),
			ref : this.getAttribute("ref"),
			show_faces : this._shouldShowFaces(),
			no_resize : this._getBoolAttribute("no_resize"),
			send : this._getBoolAttribute("send"),
			url_map : this.getAttribute("url_map"),
			extended_social_context : this._getBoolAttribute("extended_social_context", false)
		};
		this._rootPadding = {
			left : parseFloat(FB.Dom.getStyle(this.dom, "paddingLeft")),
			top : parseFloat(FB.Dom.getStyle(this.dom, "paddingTop"))
		};
		return true
	},
	oneTimeSetup : function () {
		this.subscribe("xd.authPrompted", FB.bind(this._onAuthPrompt, this));
		this.subscribe("xd.edgeCreated", FB.bind(this._onEdgeCreate, this));
		this.subscribe("xd.edgeRemoved", FB.bind(this._onEdgeRemove, this));
		this.subscribe("xd.presentEdgeCommentDialog", FB.bind(this._handleEdgeCommentDialogPresentation, this));
		this.subscribe("xd.dismissEdgeCommentDialog", FB.bind(this._handleEdgeCommentDialogDismissal, this));
		this.subscribe("xd.hideEdgeCommentDialog", FB.bind(this._handleEdgeCommentDialogHide, this));
		this.subscribe("xd.showEdgeCommentDialog", FB.bind(this._handleEdgeCommentDialogShow, this))
	},
	getSize : function () {
		return {
			width : this._getWidgetWidth(),
			height : this._getWidgetHeight()
		}
	},
	_getWidgetHeight : function () {
		var e = this._getLayout();
		var t = this._shouldShowFaces() ? "show" : "hide";
		var n = this._getBoolAttribute("send");
		var r = 65 + (n ? 25 : 0);
		var i = {
			standard : {
				show : 80,
				hide : 35
			},
			box_count : {
				show : r,
				hide : r
			},
			button_count : {
				show : 21,
				hide : 21
			},
			simple : {
				show : 20,
				hide : 20
			}
		};
		return i[e][t]
	},
	_getWidgetWidth : function () {
		var e = this._getLayout();
		var t = this._getBoolAttribute("send");
		var n = this._shouldShowFaces() ? "show" : "hide";
		var r = this.getAttribute("action") === "recommend";
		var i = (r ? 265 : 225) + (t ? 60 : 0);
		var s = (r ? 130 : 90) + (t ? 60 : 0);
		var o = this.getAttribute("action") === "recommend" ? 100 : 55;
		var u = this.getAttribute("action") === "recommend" ? 90 : 50;
		var a = {
			standard : {
				show : 450,
				hide : 450
			},
			box_count : {
				show : o,
				hide : o
			},
			button_count : {
				show : s,
				hide : s
			},
			simple : {
				show : u,
				hide : u
			}
		};
		var f = a[e][n];
		var l = this._getPxAttribute("width", f);
		var c = {
			standard : {
				min : i,
				max : 900
			},
			box_count : {
				min : o,
				max : 900
			},
			button_count : {
				min : s,
				max : 900
			},
			simple : {
				min : 49,
				max : 900
			}
		};
		if (l < c[e].min) {
			l = c[e].min
		} else if (l > c[e].max) {

			l = c[e].max
		}
		return l
	},
	_getLayout : function () {
		return this._getAttributeFromList("layout", "standard", ["standard", "button_count", "box_count", "simple"])
	},
	_shouldShowFaces : function () {
		return this._getLayout() === "standard" && this._getBoolAttribute("show-faces", true)
	},
	_handleEdgeCommentDialogPresentation : function (e) {
		if (!this.isValid()) {
			return
		}
		var t = document.createElement("span");
		this._commentSlave = this._createEdgeCommentWidget(e, t);
		this.dom.appendChild(t);
		this._commentSlave.process();
		this._commentWidgetNode = t
	},
	_createEdgeCommentWidget : function (e, t) {
		var n = {
			commentNode : t,
			externalUrl : e.externalURL,
			masterFrameName : e.masterFrameName,
			layout : this._getLayout(),
			relativeHeightOffset : this._getHeightOffset(e),
			relativeWidthOffset : this._getWidthOffset(e),
			anchorTargetX : parseFloat(e["query[anchorTargetX]"]) + this._rootPadding.left,
			anchorTargetY : parseFloat(e["query[anchorTargetY]"]) + this._rootPadding.top,
			width : parseFloat(e.width),
			height : parseFloat(e.height),
			paddingLeft : this._rootPadding.left
		};
		return new FB.XFBML.EdgeCommentWidget(n)
	},
	_getHeightOffset : function (e) {
		return parseFloat(e["anchorGeometry[y]"]) + parseFloat(e["anchorPosition[y]"]) + this._rootPadding.top
	},
	_getWidthOffset : function (e) {
		var t = parseFloat(e["anchorPosition[x]"]) + this._rootPadding.left;
		var n = FB.Dom.getPosition(this.dom).x;
		var r = this.dom.offsetWidth;
		var i = FB.Dom.getViewportInfo().width;
		var s = parseFloat(e.width);
		var o = false;
		if (FB._localeIsRtl) {
			o = s < n
		} else if (n + s > i) {
			o = true
		}
		if (o) {
			t += parseFloat(e["anchorGeometry[x]"]) - s
		}
		return t
	},
	_getCommonEdgeCommentWidgetOpts : function (e, t) {
		return {
			colorscheme : this._attr.colorscheme,
			commentNode : t,
			controllerID : e.controllerID,
			nodeImageURL : e.nodeImageURL,
			nodeRef : this._attr.ref,
			nodeTitle : e.nodeTitle,
			nodeURL : e.nodeURL,
			nodeSummary : e.nodeSummary,
			width : parseFloat(e.width),
			height : parseFloat(e.height),
			relativeHeightOffset : this._getHeightOffset(e),
			relativeWidthOffset : this._getWidthOffset(e),
			error : e.error,
			siderender : e.siderender,
			extended_social_context : e.extended_social_context,
			anchorTargetX : parseFloat(e["query[anchorTargetX]"]) + this._rootPadding.left,
			anchorTargetY : parseFloat(e["query[anchorTargetY]"]) + this._rootPadding.top
		}
	},
	_handleEdgeCommentDialogDismissal : function (e) {
		if (this._commentWidgetNode) {
			this.dom.removeChild(this._commentWidgetNode);
			delete this._commentWidgetNode
		}
	},
	_handleEdgeCommentDialogHide : function () {
		if (this._commentWidgetNode) {
			this._commentWidgetNode.style.display = "none"
		}
	},
	_handleEdgeCommentDialogShow : function () {
		if (this._commentWidgetNode) {
			this._commentWidgetNode.style.display = "block"
		}
	},
	_fireEventAndInvokeHandler : function (e, t) {
		FB.Helper.fireEvent(e, this);
		FB.Helper.invokeHandler(this.getAttribute(t), this, [this._attr.href])
	},
	_onEdgeCreate : function () {
		this._fireEventAndInvokeHandler("edge.create", "on-create")
	},
	_onEdgeRemove : function () {
		this._fireEventAndInvokeHandler("edge.remove", "on-remove")
	},
	_onAuthPrompt : function () {
		this._fireEventAndInvokeHandler("auth.prompt", "on-prompt")
	}
});
FB.subclass("XFBML.SendButtonFormWidget", "XFBML.EdgeCommentWidget", function (e) {
	this._base(e);
	FB.Dom.addCss(this.dom, "fb_send_button_form_widget");
	FB.Dom.addCss(this.dom, e.colorscheme);
	FB.Dom.addCss(this.dom, typeof e.siderender != "undefined" && e.siderender ? "siderender" : "");
	this._attr.nodeImageURL = e.nodeImageURL;
	this._attr.nodeRef = e.nodeRef;
	this._attr.nodeTitle = e.nodeTitle;
	this._attr.nodeURL = e.nodeURL;
	this._attr.nodeSummary = e.nodeSummary;
	this._attr.offsetX = e.relativeWidthOffset;
	this._attr.offsetY = e.relativeHeightOffset;
	this._attr.anchorTargetX = e.anchorTargetX;
	this._attr.anchorTargetY = e.anchorTargetY;
	this._attr.channel = this.getChannelUrl();
	this._attr.controllerID = e.controllerID;
	this._attr.colorscheme = e.colorscheme;
	this._attr.error = e.error;
	this._attr.siderender = e.siderender;
	this._attr.extended_social_context = e.extended_social_context
}, {
	_showLoader : true,
	getUrlBits : function () {
		return {
			name : "send_button_form_shell",
			params : this._attr
		}
	},
	oneTimeSetup : function () {
		this.subscribe("xd.messageSent", FB.bind(this._onMessageSent, this))
	},
	_onMessageSent : function () {
		FB.Event.fire("message.send", this._attr.nodeURL, this)
	}
});
FB.subclass("XFBML.Send", "XFBML.EdgeWidget", null, {
	setupAndValidate : function () {
		FB.Dom.addCss(this.dom, "fb_edge_widget_with_comment");
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			font : this.getAttribute("font"),
			colorscheme : this.getAttribute("colorscheme", "light"),
			href : this.getAttribute("href", window.location.href),
			ref : this.getAttribute("ref"),
			extended_social_context : this.getAttribute("extended_social_context", false)
		};
		this._rootPadding = {
			left : parseFloat(FB.Dom.getStyle(this.dom, "paddingLeft")),
			top : parseFloat(FB.Dom.getStyle(this.dom, "paddingTop"))
		};
		return true
	},
	getUrlBits : function () {
		return {
			name : "send",
			params : this._attr
		}
	},
	_createEdgeCommentWidget : function (e, t) {
		var n = this._getCommonEdgeCommentWidgetOpts(e, t);
		return new FB.XFBML.SendButtonFormWidget(n)
	},
	getSize : function () {
		return {
			width : FB.XFBML.Send.Dimensions.width,
			height : FB.XFBML.Send.Dimensions.height
		}
	}
});
FB.provide("XFBML.Send", {
	Dimensions : {
		width : 80,
		height : 25
	}
});
FB.subclass("XFBML.Like", "XFBML.EdgeWidget", null, {
	_widgetPipeEnabled : true,
	getUrlBits : function () {
		return {
			name : "like",
			params : this._attr
		}
	},
	_createEdgeCommentWidget : function (e, t) {
		if ("send" in this._attr && "widget_type" in e && e.widget_type == "send") {
			var n = this._getCommonEdgeCommentWidgetOpts(e, t);
			return new FB.XFBML.SendButtonFormWidget(n)
		} else {
			return this._callBase("_createEdgeCommentWidget", e, t)
		}
	},
	getIframeTitle : function () {
		return "Like this content on Facebook."
	}
});
FB.subclass("XFBML.LikeBox", "XFBML.EdgeWidget", null, {
	_visibleAfter : "load",
	setupAndValidate : function () {
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			connections : this.getAttribute("connections"),
			css : this.getAttribute("css"),
			height : this.getAttribute("height"),
			id : this.getAttribute("profile-id"),
			header : this._getBoolAttribute("header", true),
			name : this.getAttribute("name"),
			show_faces : this._getBoolAttribute("show-faces", true),
			stream : this._getBoolAttribute("stream", true),
			width : this._getPxAttribute("width", 300),
			href : this.getAttribute("href"),
			colorscheme : this.getAttribute("colorscheme", "light"),
			border_color : this.getAttribute("border_color")
		};
		if (this._getBoolAttribute("force_wall", false)) {
			this._attr.force_wall = true
		}
		if (this._attr.connections === "0") {
			this._attr.show_faces = false
		} else if (this._attr.connections) {
			this._attr.show_faces = true
		}
		if (!this._attr.id && !this._attr.name && !this._attr.href) {
			FB.log('<fb:like-box> requires one of the "id" or "name" attributes.');
			return false
		}
		var e = this._attr.height;
		if (!e) {
			if (!this._attr.show_faces && !this._attr.stream) {
				e = 62
			} else {
				e = 95;
				if (this._attr.show_faces) {
					e += 163
				}
				if (this._attr.stream) {
					e += 300
				}
				if (this._attr.header && this._attr.header !== "0") {
					e += 32
				}
			}
		}
		this._attr.height = e;
		this.subscribe("xd.likeboxLiked", FB.bind(this._onLiked, this));
		this.subscribe("xd.likeboxUnliked", FB.bind(this._onUnliked, this));
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		return {
			name : "likebox",
			params : this._attr
		}
	},
	_onLiked : function () {
		FB.Helper.fireEvent("edge.create", this)
	},
	_onUnliked : function () {
		FB.Helper.fireEvent("edge.remove", this)
	}
});
FB.subclass("XFBML.LiveStream", "XFBML.IframeWidget", null, {
	_visibleAfter : "load",
	setupAndValidate : function () {
		this._attr = {
			app_id : this.getAttribute("event-app-id"),
			height : this._getPxAttribute("height", 500),
			hideFriendsTab : this.getAttribute("hide-friends-tab"),
			redesigned : this._getBoolAttribute("redesigned-stream"),
			width : this._getPxAttribute("width", 400),
			xid : this.getAttribute("xid", "default"),
			always_post_to_friends : this._getBoolAttribute("always-post-to-friends"),
			via_url : this.getAttribute("via_url")
		};
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		var e = this._attr.redesigned ? "live_stream_box" : "livefeed";
		if (this._getBoolAttribute("modern", false)) {
			e = "live_stream"
		}
		return {
			name : e,
			params : this._attr
		}
	}
});
FB.subclass("XFBML.Login", "XFBML.Facepile", null, {
	_visibleAfter : "load",
	getSize : function () {
		return {
			width : this._attr.width,
			height : 94
		}
	},
	getUrlBits : function () {
		return {
			name : "login",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.LoginButton", "XFBML.ButtonElement", null, {
	setupAndValidate : function () {
		if (this._alreadySetup) {
			return true
		}
		this._alreadySetup = true;
		this._attr = {
			autologoutlink : this._getBoolAttribute("auto-logout-link"),
			length : this._getAttributeFromList("length", "short", ["long", "short"]),
			onlogin : this.getAttribute("on-login"),
			perms : this.getAttribute("perms"),
			scope : this.getAttribute("scope"),
			registration_url : this.getAttribute("registration-url"),
			status : "unknown"
		};
		if (this._attr.autologoutlink) {
			FB.Event.subscribe("auth.statusChange", FB.bind(this.process, this))
		}
		if (this._attr.registration_url) {
			FB.Event.subscribe("auth.statusChange", this._saveStatus(this.process, false));
			FB.getLoginStatus(this._saveStatus(this.process, false))
		}
		return true
	},
	getButtonMarkup : function () {
		var e = this.getOriginalHTML();
		if (e) {
			return e
		}
		if (!this._attr.registration_url) {
			if (FB.getAccessToken() && this._attr.autologoutlink) {
				return FB.Intl.tx._("Facebook Logout")
			} else if (FB.getAccessToken()) {
				return ""
			} else {
				return this._getLoginText()
			}
		} else {
			switch (this._attr.status) {
			case "unknown":
				return this._getLoginText();
			case "notConnected":
			case "not_authorized":
				return FB.Intl.tx._("Register");
			case "connected":
				if (FB.getAccessToken() && this._attr.autologoutlink) {
					return FB.Intl.tx._("Facebook Logout")
				}
				return "";
			default:
				FB.log("Unknown status: " + this._attr.status);
				return FB.Intl.tx._("Log In")
			}
		}
	},
	_getLoginText : function () {
		return this._attr.length == "short" ? FB.Intl.tx._("Log In") : FB.Intl.tx._("Log In with Facebook")
	},
	onClick : function () {
		if (!this._attr.registration_url) {
			if (!FB.getAccessToken() || !this._attr.autologoutlink) {
				FB.login(FB.bind(this._authCallback, this), {
					perms : this._attr.perms,
					scope : this._attr.scope
				})
			} else {
				FB.logout(FB.bind(this._authCallback, this))
			}
		} else {
			switch (this._attr.status) {
			case "unknown":
				FB.ui({
					method : "auth.logintoFacebook"
				}, FB.bind(function (e) {
						FB.bind(FB.getLoginStatus(this._saveStatus(this._authCallback, true), true), this)
					}, this));
				break;
			case "notConnected":
			case "not_authorized":
				window.top.location = this._attr.registration_url;
				break;
			case "connected":
				if (!FB.getAccessToken() || !this._attr.autologoutlink) {
					this._authCallback()
				} else {
					FB.logout(FB.bind(this._authCallback, this))
				}
				break;
			default:
				FB.log("Unknown status: " + this._attr.status)
			}
		}
	},
	_authCallback : function (e) {
		FB.Helper.invokeHandler(this._attr.onlogin, this, [e])
	},
	_saveStatus : function (e, t) {
		return FB.bind(function (n) {
			if (t && this._attr.registration_url && (this._attr.status == "notConnected" || this._attr.status == "not_authorized") && (n.status == "notConnected" || n.status == "not_authorized")) {
				window.top.location = this._attr.registration_url
			}
			this._attr.status = n.status;
			if (e) {
				e = this.bind(e, this);
				return e(n)
			}
		}, this)
	}
});
FB.subclass("XFBML.Name", "XFBML.Element", null, {
	process : function () {
		FB.copy(this, {
			_uid : this.getAttribute("uid"),
			_firstnameonly : this._getBoolAttribute("first-name-only"),
			_lastnameonly : this._getBoolAttribute("last-name-only"),
			_possessive : this._getBoolAttribute("possessive"),
			_reflexive : this._getBoolAttribute("reflexive"),
			_objective : this._getBoolAttribute("objective"),
			_linked : this._getBoolAttribute("linked", true),
			_subjectId : this.getAttribute("subject-id")
		});
		if (!this._uid) {
			FB.log('"uid" is a required attribute for <fb:name>');
			this.fire("render");
			return
		}
		var e = [];
		if (this._firstnameonly) {
			e.push("first_name")
		} else if (this._lastnameonly) {
			e.push("last_name")
		} else {
			e.push("name")
		}
		if (this._subjectId) {
			e.push("sex");
			if (this._subjectId == FB.Helper.getLoggedInUser()) {
				this._reflexive = true
			}
		}
		var t;
		FB.Event.monitor("auth.statusChange", this.bind(function () {
				if (!this.isValid()) {
					this.fire("render");
					return true
				}
				if (!this._uid || this._uid == "loggedinuser") {
					this._uid = FB.Helper.getLoggedInUser()
				}
				if (!this._uid) {
					return
				}
				if (FB.Helper.isUser(this._uid)) {
					t = FB.Data._selectByIndex(e, "user", "uid", this._uid)
				} else {
					t = FB.Data._selectByIndex(["name", "id"], "profile", "id", this._uid)
				}
				t.wait(this.bind(function (e) {
						if (this._subjectId == this._uid) {
							this._renderPronoun(e[0])
						} else {
							this._renderOther(e[0])
						}
						this.fire("render")
					}))
			}))
	},
	_renderPronoun : function (e) {
		var t = "",
		n = this._objective;
		if (this._subjectId) {
			n = true;
			if (this._subjectId === this._uid) {
				this._reflexive = true
			}
		}
		if (this._uid == FB.Connect.get_loggedInUser() && this._getBoolAttribute("use-you", true)) {
			if (this._possessive) {
				if (this._reflexive) {
					t = "your own"
				} else {
					t = "your"
				}
			} else {
				if (this._reflexive) {
					t = "yourself"
				} else {
					t = "you"
				}
			}
		} else {
			switch (e.sex) {
			case "male":
				if (this._possessive) {
					t = this._reflexive ? "his own" : "his"
				} else {
					if (this._reflexive) {
						t = "himself"
					} else if (n) {
						t = "him"
					} else {
						t = "he"
					}
				}
				break;
			case "female":
				if (this._possessive) {
					t = this._reflexive ? "her own" : "her"
				} else {
					if (this._reflexive) {
						t = "herself"
					} else if (n) {
						t = "her"
					} else {
						t = "she"
					}
				}
				break;
			default:
				if (this._getBoolAttribute("use-they", true)) {
					if (this._possessive) {
						if (this._reflexive) {
							t = "their own"
						} else {
							t = "their"
						}
					} else {
						if (this._reflexive) {
							t = "themselves"
						} else if (n) {
							t = "them"
						} else {
							t = "they"
						}
					}
				} else {
					if (this._possessive) {
						if (this._reflexive) {
							t = "his/her own"
						} else {
							t = "his/her"
						}
					} else {
						if (this._reflexive) {
							t = "himself/herself"
						} else if (n) {
							t = "him/her"
						} else {
							t = "he/she"
						}
					}
				}
				break
			}
		}
		if (this._getBoolAttribute("capitalize", false)) {
			t = FB.Helper.upperCaseFirstChar(t)
		}
		this.dom.innerHTML = t
	},
	_renderOther : function (e) {
		var t = "",
		n = "";
		if (this._uid == FB.Helper.getLoggedInUser() && this._getBoolAttribute("use-you", true)) {
			if (this._reflexive) {
				if (this._possessive) {
					t = "your own"
				} else {
					t = "yourself"
				}
			} else {
				if (this._possessive) {
					t = "your"
				} else {
					t = "you"
				}
			}
		} else if (e) {
			if (null === e.first_name) {
				e.first_name = ""
			}
			if (null === e.last_name) {
				e.last_name = ""
			}
			if (this._firstnameonly && e.first_name !== undefined) {
				t = FB.String.escapeHTML(e.first_name)
			} else if (this._lastnameonly && e.last_name !== undefined) {
				t = FB.String.escapeHTML(e.last_name)
			}
			if (!t) {
				t = FB.String.escapeHTML(e.name)
			}
			if (t !== "" && this._possessive) {
				t += "'s"
			}
		}
		if (!t) {
			t = FB.String.escapeHTML(this.getAttribute("if-cant-see", "Facebook User"))
		}
		if (t) {
			if (this._getBoolAttribute("capitalize", false)) {
				t = FB.Helper.upperCaseFirstChar(t)
			}
			if (e && this._linked) {
				n = FB.Helper.getProfileLink(e, t, this.getAttribute("href", null))
			} else {
				n = t
			}
		}
		this.dom.innerHTML = n
	}
});
FB.subclass("XFBML.ProfilePic", "XFBML.Element", null, {
	process : function () {
		var e = this.getAttribute("size", "thumb"),
		t = FB.XFBML.ProfilePic._sizeToPicFieldMap[e],
		n = this._getPxAttribute("width"),
		r = this._getPxAttribute("height"),
		i = this.dom.style,
		s = this.getAttribute("uid");
		if (this._getBoolAttribute("facebook-logo")) {
			t += "_with_logo"
		}
		if (n) {
			n = n + "px";
			i.width = n
		}
		if (r) {
			r = r + "px";
			i.height = r
		}
		var o = this.bind(function (e) {
				var i = e ? e[0] : null,
				s = i ? i[t] : null;
				if (!s) {
					s = FB.getDomain("cdn") + FB.XFBML.ProfilePic._defPicMap[t]
				}
				var o = (n ? "width:" + n + ";" : "") + (r ? "height:" + n + ";" : ""),
				u = FB.String.format('<img src="{0}" alt="{1}" title="{1}" style="{2}" class="{3}" />', s, i ? FB.String.escapeHTML(i.name) : "", o, this.dom.className);
				if (this._getBoolAttribute("linked", true)) {
					u = FB.Helper.getProfileLink(i, u, this.getAttribute("href", null))
				}
				this.dom.innerHTML = u;
				FB.Dom.addCss(this.dom, "fb_profile_pic_rendered");
				this.fire("render")
			});
		FB.Event.monitor("auth.statusChange", this.bind(function () {
				if (!this.isValid()) {
					this.fire("render");
					return true
				}
				if (this.getAttribute("uid", null) == "loggedinuser") {
					s = FB.Helper.getLoggedInUser()
				}
				if (FB._userStatus && s) {
					FB.Data._selectByIndex(["name", t], FB.Helper.isUser(s) ? "user" : "profile", FB.Helper.isUser(s) ? "uid" : "id", s).wait(o)
				} else {
					o()
				}
			}))
	}
});
FB.provide("XFBML.ProfilePic", {
	_defPicMap : {
		pic : "pics/s_silhouette.jpg",
		pic_big : "pics/d_silhouette.gif",
		pic_big_with_logo : "pics/d_silhouette_logo.gif",
		pic_small : "pics/t_silhouette.jpg",
		pic_small_with_logo : "pics/t_silhouette_logo.gif",
		pic_square : "pics/q_silhouette.gif",
		pic_square_with_logo : "pics/q_silhouette_logo.gif",
		pic_with_logo : "pics/s_silhouette_logo.gif"
	},
	_sizeToPicFieldMap : {
		n : "pic_big",
		normal : "pic_big",
		q : "pic_square",
		s : "pic",
		small : "pic",
		square : "pic_square",
		t : "pic_small",
		thumb : "pic_small"
	}
});
FB.subclass("XFBML.Question", "XFBML.IframeWidget", null, {
	_visibleAfter : "load",
	setupAndValidate : function () {
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			permalink : this.getAttribute("permalink"),
			id : this.getAttribute("id"),
			width : this._getPxAttribute("width", 400),
			height : 0,
			questiontext : this.getAttribute("questiontext"),
			options : this.getAttribute("options")
		};
		this.subscribe("xd.firstVote", FB.bind(this._onInitialVote, this));
		this.subscribe("xd.vote", FB.bind(this._onChangedVote, this));
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		return {
			name : "question",
			params : this._attr
		}
	},
	_onInitialVote : function (e) {
		FB.Event.fire("question.firstVote", this._attr.permalink, e.vote)
	},
	_onChangedVote : function (e) {
		FB.Event.fire("question.vote", this._attr.permalink, e.vote)
	}
});
FB.subclass("XFBML.Recommendations", "XFBML.IframeWidget", null, {
	_visibleAfter : "load",
	_refreshOnAuthChange : true,
	setupAndValidate : function () {
		this._attr = {
			border_color : this.getAttribute("border-color"),
			colorscheme : this.getAttribute("color-scheme"),
			filter : this.getAttribute("filter"),
			font : this.getAttribute("font"),
			action : this.getAttribute("action"),
			linktarget : this.getAttribute("linktarget", "_blank"),
			max_age : this.getAttribute("max_age"),
			header : this._getBoolAttribute("header"),
			height : this._getPxAttribute("height", 300),
			site : this.getAttribute("site", location.hostname),
			width : this._getPxAttribute("width", 300)
		};
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		return {
			name : "recommendations",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.RecommendationsBar", "XFBML.IframeWidget", null, {
	getUrlBits : function () {
		return {
			name : "recommendations_bar",
			params : this._attr
		}
	},
	setupAndValidate : function () {
		function e(e, t) {
			function i() {
				t();
				r = null;
				n = (new Date).getTime()
			}
			var n = 0;
			var r = null;
			return function () {
				if (!r) {
					var t = (new Date).getTime();
					if (t - n < e) {
						r = window.setTimeout(i, e - (t - n))
					} else {
						i()
					}
				}
				return true
			}
		}
		function t(e) {
			if (e.match(/^\d+(?:\.\d+)?%$/)) {
				var t = Math.min(Math.max(parseInt(e, 10), 0), 100);
				e = t / 100
			} else if (e != "manual" && e != "onvisible") {
				e = "onvisible"
			}
			return e
		}
		function n(e) {
			return Math.max(parseInt(e, 10) || 30, 10)
		}
		function r(e) {
			if (e == "left" || e == "right") {
				return e
			}
			return FB._localeIsRtl ? "left" : "right"
		}
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			font : this.getAttribute("font"),
			colorscheme : this.getAttribute("colorscheme"),
			href : FB.URI.resolve(this.getAttribute("href")),
			side : r(this.getAttribute("side")),
			site : this.getAttribute("site"),
			action : this.getAttribute("action"),
			ref : this.getAttribute("ref"),
			max_age : this.getAttribute("max_age"),
			trigger : t(this.getAttribute("trigger", "")),
			read_time : n(this.getAttribute("read_time")),
			num_recommendations : parseInt(this.getAttribute("num_recommendations"), 10) || 2
		};
		FB._inPlugin = true;
		this._showLoader = false;
		this.subscribe("iframe.onload", FB.bind(function () {
				var e = this.dom.children[0];
				e.className = "fbpluginrecommendationsbar" + this._attr.side
			}, this));
		var i = FB.bind(function () {
				FB.Event.unlisten(window, "scroll", i);
				FB.Event.unlisten(document.documentElement, "click", i);
				FB.Event.unlisten(document.documentElement, "mousemove", i);
				window.setTimeout(FB.bind(this.arbiterInform, this, "platform/plugins/recommendations_bar/action", null, FB.Arbiter.BEHAVIOR_STATE), this._attr.read_time * 1e3);
				return true
			}, this);
		FB.Event.listen(window, "scroll", i);
		FB.Event.listen(document.documentElement, "click", i);
		FB.Event.listen(document.documentElement, "mousemove", i);
		if (this._attr.trigger == "manual") {
			var s = FB.bind(function (e) {
					if (e == this._attr.href) {
						FB.Event.unsubscribe("xfbml.recommendationsbar.read", s);
						this.arbiterInform("platform/plugins/recommendations_bar/trigger", null, FB.Arbiter.BEHAVIOR_STATE)
					}
					return true
				}, this);
			FB.Event.subscribe("xfbml.recommendationsbar.read", s)
		} else {
			var o = e(500, FB.bind(function () {
						if (this.calculateVisibility()) {
							FB.Event.unlisten(window, "scroll", o);
							FB.Event.unlisten(window, "resize", o);
							this.arbiterInform("platform/plugins/recommendations_bar/trigger", null, FB.Arbiter.BEHAVIOR_STATE)
						}
						return true
					}, this));
			FB.Event.listen(window, "scroll", o);
			FB.Event.listen(window, "resize", o);
			o()
		}
		this.visible = false;
		var u = e(500, FB.bind(function () {
					if (!this.visible && this.calculateVisibility()) {
						this.visible = true;
						this.arbiterInform("platform/plugins/recommendations_bar/visible")
					} else if (this.visible && !this.calculateVisibility()) {
						this.visible = false;
						this.arbiterInform("platform/plugins/recommendations_bar/invisible")
					}
					return true
				}, this));
		FB.Event.listen(window, "scroll", u);
		FB.Event.listen(window, "resize", u);
		u();
		this.focused = true;
		var a = FB.bind(function () {
				this.focused = !this.focused;
				return true
			}, this);
		FB.Event.listen(window, "blur", a);
		FB.Event.listen(window, "focus", a);
		this.resize_running = false;
		this.animate = false;
		this.subscribe("xd.signal_animation", FB.bind(function () {
				this.animate = true
			}, this));
		return true
	},
	getSize : function () {
		return {
			height : 25,
			width : this._attr.action == "recommend" ? 140 : 96
		}
	},
	calculateVisibility : function () {
		var e = document.documentElement.clientHeight;
		if (!this.focused && window.console && window.console.firebug) {
			return this.visible
		}
		switch (this._attr.trigger) {
		case "manual":
			return false;
		case "onvisible":
			var t = this.dom.getBoundingClientRect().top;
			return t <= e;
		default:
			var n = window.pageYOffset || document.body.scrollTop;
			var r = document.documentElement.scrollHeight;
			return (n + e) / r >= this._attr.trigger
		}
	},
	_handleResizeMsg : function (e) {
		if (!this.isValid()) {
			return
		}
		if (e.width) {
			this.getIframeNode().style.width = e.width + "px"
		}
		if (e.height) {
			this._setNextResize(e.height);
			this._checkNextResize()
		}
		this._makeVisible()
	},
	_setNextResize : function (e) {
		this.next_resize = e
	},
	_checkNextResize : function () {
		if (!this.next_resize || this.resize_running) {
			return
		}
		var e = this.getIframeNode();
		var t = this.next_resize;
		this.next_resize = null;
		if (this.animate) {
			this.animate = false;
			this.resize_running = true;
			FB.Anim.ate(e, {
				height : t + "px"
			}, 330, FB.bind(function () {
					this.resize_running = false;
					this._checkNextResize()
				}, this))
		} else {
			e.style.height = t + "px"
		}
	}
});
FB.XFBML.RecommendationsBar.markRead = function (e) {
	FB.Event.fire("xfbml.recommendationsbar.read", e || window.location.href)
};
FB.subclass("XFBML.Registration", "XFBML.IframeWidget", null, {
	_visibleAfter : "immediate",
	_baseHeight : 167,
	_fieldHeight : 28,
	_skinnyWidth : 520,
	_skinnyBaseHeight : 173,
	_skinnyFieldHeight : 52,
	setupAndValidate : function () {
		this._attr = {
			action : this.getAttribute("action"),
			border_color : this.getAttribute("border-color"),
			channel_url : this.getChannelUrl(),
			client_id : FB._apiKey,
			fb_only : this._getBoolAttribute("fb-only", false),
			fb_register : this._getBoolAttribute("fb-register", false),
			fields : this.getAttribute("fields"),
			height : this._getPxAttribute("height"),
			redirect_uri : this.getAttribute("redirect-uri", window.location.href),
			no_footer : this._getBoolAttribute("no-footer"),
			no_header : this._getBoolAttribute("no-header"),
			onvalidate : this.getAttribute("onvalidate"),
			width : this._getPxAttribute("width", 600),
			target : this.getAttribute("target")
		};
		if (this._attr.onvalidate) {
			this.subscribe("xd.validate", this.bind(function (e) {
					var t = FB.JSON.parse(e.value);
					var n = this.bind(function (t) {
							FB.Arbiter.inform("Registration.Validation", {
								errors : t,
								id : e.id
							}, 'parent.frames["' + this.getIframeNode().name + '"]', this._attr.channel_url.substring(0, 5) == "https")
						});
					var r = FB.Helper.executeFunctionByName(this._attr.onvalidate, t, n);
					if (r) {
						n(r)
					}
				}))
		}
		this.subscribe("xd.authLogin", FB.bind(this._onAuthLogin, this));
		this.subscribe("xd.authLogout", FB.bind(this._onAuthLogout, this));
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._getHeight()
		}
	},
	_getHeight : function () {
		if (this._attr.height) {
			return this._attr.height
		}
		var e;
		if (!this._attr.fields) {
			e = ["name"]
		} else {
			try {
				e = FB.JSON.parse(this._attr.fields)
			} catch (t) {
				e = this._attr.fields.split(/,/)
			}
		}
		if (this._attr.width < this._skinnyWidth) {
			return this._skinnyBaseHeight + e.length * this._skinnyFieldHeight
		} else {
			return this._baseHeight + e.length * this._fieldHeight
		}
	},
	getUrlBits : function () {
		return {
			name : "registration",
			params : this._attr
		}
	},
	getDefaultWebDomain : function () {
		return "https_www"
	},
	_onAuthLogin : function () {
		if (!FB.getAuthResponse()) {
			FB.getLoginStatus()
		}
		FB.Helper.fireEvent("auth.login", this)
	},
	_onAuthLogout : function () {
		if (!FB.getAuthResponse()) {
			FB.getLoginStatus()
		}
		FB.Helper.fireEvent("auth.logout", this)
	}
});
FB.subclass("XFBML.ServerFbml", "XFBML.IframeWidget", null, {
	_visibleAfter : "resize",
	setupAndValidate : function () {
		this._attr = {
			channel_url : this.getChannelUrl(),
			fbml : this.getAttribute("fbml"),
			width : this._getPxAttribute("width")
		};
		if (!this._attr.fbml) {
			var e = this.dom.getElementsByTagName("script")[0];
			if (e && e.type === "text/fbml") {
				this._attr.fbml = e.innerHTML
			}
		}
		if (!this._attr.fbml) {
			FB.log('<fb:serverfbml> requires the "fbml" attribute.');
			return false
		}
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		return {
			name : "serverfbml",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.ShareButton", "XFBML.Element", null, {
	process : function () {
		this._href = this.getAttribute("href", window.location.href);
		this._type = this.getAttribute("type", "icon_link");
		FB.Dom.addCss(this.dom, "fb_share_count_hidden");
		this._renderButton(true)
	},
	_renderButton : function (e) {
		if (!this.isValid()) {
			this.fire("render");
			return
		}
		var t = "",
		n = "",
		r = "",
		i = "",
		s = FB.Intl.tx._("Share"),
		o = "";
		switch (this._type) {
		case "icon":
		case "icon_link":
			i = "fb_button_simple";
			t = '<span class="fb_button_text">' + (this._type == "icon_link" ? s : "&nbsp;") + "</span>";
			e = false;
			break;
		case "link":
			t = FB.Intl.tx._("Share on Facebook");
			e = false;
			break;
		case "button":
			t = '<span class="fb_button_text">' + s + "</span>";
			i = "fb_button fb_button_small";
			e = false;
			break;
		case "button_count":
			t = '<span class="fb_button_text">' + s + "</span>";
			n = '<span class="fb_share_count_nub_right">&nbsp;</span>' + '<span class="fb_share_count fb_share_count_right">' + this._getCounterMarkup() + "</span>";
			i = "fb_button fb_button_small";
			break;
		default:
			t = '<span class="fb_button_text">' + s + "</span>";
			r = '<span class="fb_share_count_nub_top">&nbsp;</span>' + '<span class="fb_share_count fb_share_count_top">' + this._getCounterMarkup() + "</span>";
			i = "fb_button fb_button_small";
			o = "fb_share_count_wrapper"
		}
		var u = FB.guid();
		this.dom.innerHTML = FB.String.format('<span class="{0}">{4}<a id="{1}" class="{2}" ' + 'target="_blank">{3}</a>{5}</span>', o, u, i, t, r, n);
		var a = document.getElementById(u);
		a.href = this._href;
		a.onclick = function () {
			FB.ui({
				method : "stream.share",
				u : this.href
			});
			return false
		};
		if (!e) {
			this.fire("render")
		}
	},
	_getCounterMarkup : function () {
		if (!this._count) {
			this._count = FB.Data._selectByIndex(["total_count"], "link_stat", "url", this._href)
		}
		var e = "0";
		if (this._count.value !== undefined) {
			if (this._count.value.length > 0) {
				var t = this._count.value[0].total_count;
				if (t > 3) {
					FB.Dom.removeCss(this.dom, "fb_share_count_hidden");
					e = t >= 1e7 ? Math.round(t / 1e6) + "M" : t >= 1e4 ? Math.round(t / 1e3) + "K" : t
				}
			}
		} else {
			this._count.wait(FB.bind(this._renderButton, this, false))
		}
		return '<span class="fb_share_count_inner">' + e + "</span>"
	}
});
FB.subclass("XFBML.SocialContext", "XFBML.IframeWidget", null, {
	setupAndValidate : function () {
		var e = this.getAttribute("size", "small");
		this._attr = {
			channel : this.getChannelUrl(),
			width : this._getPxAttribute("width", 400),
			height : this._getPxAttribute("height", 100),
			ref : this.getAttribute("ref"),
			size : this.getAttribute("size"),
			keywords : this.getAttribute("keywords"),
			urls : this.getAttribute("urls")
		};
		return true
	},
	getSize : function () {
		return {
			width : this._attr.width,
			height : this._attr.height
		}
	},
	getUrlBits : function () {
		return {
			name : "social_context",
			params : this._attr
		}
	}
});
FB.subclass("XFBML.Subscribe", "XFBML.EdgeWidget", null, {
	setupAndValidate : function () {
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			font : this.getAttribute("font"),
			colorscheme : this.getAttribute("colorscheme", "light"),
			href : this.getAttribute("href"),
			ref : this.getAttribute("ref"),
			layout : this._getLayout(),
			show_faces : this._shouldShowFaces(),
			width : this._getWidgetWidth()
		};
		return true
	},
	getUrlBits : function () {
		return {
			name : "subscribe",
			params : this._attr
		}
	},
	_getWidgetWidth : function () {
		var e = this._getLayout();
		var t = {
			standard : 450,
			box_count : 83,
			button_count : 115
		};
		var n = t[e];
		var r = this._getPxAttribute("width", n);
		var i = {
			standard : {
				min : 225,
				max : 900
			},
			box_count : {
				min : 43,
				max : 900
			},
			button_count : {
				min : 63,
				max : 900
			}
		};
		if (r < i[e].min) {
			r = i[e].min
		} else if (r > i[e].max) {
			r = i[e].max
		}
		return r
	}
});

