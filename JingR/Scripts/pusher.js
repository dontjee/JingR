﻿/*!
* Pusher JavaScript Library v1.12.1
* http://pusherapp.com/
*
* Copyright 2011, Pusher
* Released under the MIT licence.
*/

(function () {
   if (Function.prototype.scopedTo === void 0) Function.prototype.scopedTo = function (a, c) { var e = this; return function () { return e.apply(a, Array.prototype.slice.call(c || []).concat(Array.prototype.slice.call(arguments))) } }; var b = function (a, c) {
      this.options = c || {}; this.key = a; this.channels = new b.Channels; this.global_emitter = new b.EventsDispatcher; var e = this; this.checkAppKey(); this.connection = new b.Connection(this.key, this.options); this.connection.bind("connected", function () { e.subscribeAll() }).bind("message",
function (c) { var a = c.event.indexOf("pusher_internal:") === 0; if (c.channel) { var b; (b = e.channel(c.channel)) && b.emit(c.event, c.data) } a || e.global_emitter.emit(c.event, c.data) }).bind("disconnected", function () { e.channels.disconnect() }).bind("error", function (c) { b.warn("Error", c) }); b.instances.push(this); b.isReady && e.connect()
   }; b.instances = []; b.prototype = { channel: function (a) { return this.channels.find(a) }, connect: function () { this.connection.connect() }, disconnect: function () { this.connection.disconnect() }, bind: function (a,
c) { this.global_emitter.bind(a, c); return this }, bind_all: function (a) { this.global_emitter.bind_all(a); return this }, subscribeAll: function () { for (channelName in this.channels.channels) this.channels.channels.hasOwnProperty(channelName) && this.subscribe(channelName) }, subscribe: function (a) {
   var c = this, e = this.channels.add(a, this); this.connection.state === "connected" && e.authorize(this.connection.socket_id, this.options, function (b, f) {
      b ? e.emit("pusher:subscription_error", f) : c.send_event("pusher:subscribe", { channel: a,
         auth: f.auth, channel_data: f.channel_data
      })
   }); return e
}, unsubscribe: function (a) { this.channels.remove(a); this.connection.state === "connected" && this.send_event("pusher:unsubscribe", { channel: a }) }, send_event: function (a, c, e) { return this.connection.send_event(a, c, e) }, checkAppKey: function () { (this.key === null || this.key === void 0) && b.warn("Warning", "You must pass your app key when you instantiate Pusher.") } 
   }; b.Util = { extend: function c(e, b) {
      for (var f in b) e[f] = b[f] && b[f].constructor && b[f].constructor === Object ? c(e[f] ||
{}, b[f]) : b[f]; return e
   }, stringify: function () { for (var c = ["Pusher"], b = 0; b < arguments.length; b++) typeof arguments[b] === "string" ? c.push(arguments[b]) : window.JSON == void 0 ? c.push(arguments[b].toString()) : c.push(JSON.stringify(arguments[b])); return c.join(" : ") }, arrayIndexOf: function (c, b) { var g = Array.prototype.indexOf; if (c == null) return -1; if (g && c.indexOf === g) return c.indexOf(b); for (i = 0, l = c.length; i < l; i++) if (c[i] === b) return i; return -1 } 
   }; b.debug = function () { b.log && b.log(b.Util.stringify.apply(this, arguments)) };
   b.warn = function () { window.console && window.console.warn ? window.console.warn(b.Util.stringify.apply(this, arguments)) : b.log && b.log(b.Util.stringify.apply(this, arguments)) }; b.VERSION = "1.12.1"; b.host = "ws.pusherapp.com"; b.ws_port = 80; b.wss_port = 443; b.channel_auth_endpoint = "/pusher/auth"; b.cdn_http = "http://js.pusher.com/"; b.cdn_https = "https://d3dy5gmtp8yhk7.cloudfront.net/"; b.dependency_suffix = ".min"; b.channel_auth_transport = "ajax"; b.activity_timeout = 12E4; b.pong_timeout = 3E4; b.isReady = !1; b.ready = function () {
      b.isReady =
!0; for (var c = 0, e = b.instances.length; c < e; c++) b.instances[c].connect()
   }; this.Pusher = b
}).call(this);
(function () {
   function b(a) { this.callbacks = {}; this.global_callbacks = []; this.failThrough = a } b.prototype.bind = function (a, c) { this.callbacks[a] = this.callbacks[a] || []; this.callbacks[a].push(c); return this }; b.prototype.unbind = function (a, c) { if (this.callbacks[a]) { var b = Pusher.Util.arrayIndexOf(this.callbacks[a], c); this.callbacks[a].splice(b, 1) } return this }; b.prototype.emit = function (a, c) {
      for (var b = 0; b < this.global_callbacks.length; b++) this.global_callbacks[b](a, c); var g = this.callbacks[a]; if (g) for (b = 0; b < g.length; b++) g[b](c);
      else this.failThrough && this.failThrough(a, c); return this
   }; b.prototype.bind_all = function (a) { this.global_callbacks.push(a); return this }; this.Pusher.EventsDispatcher = b
}).call(this);
(function () {
   function b(c, a, b) { if (a[c] !== void 0) a[c](b) } function a(a, b, f) { c.EventsDispatcher.call(this); this.state = void 0; this.errors = []; this.stateActions = f; this.transitions = b; this.transition(a) } var c = this.Pusher; a.prototype.transition = function (a, g) {
      var f = this.state, h = this.stateActions; if (f && c.Util.arrayIndexOf(this.transitions[f], a) == -1) throw this.emit("invalid_transition_attempt", { oldState: f, newState: a }), Error("Invalid transition [" + f + " to " + a + "]"); b(f + "Exit", h, g); b(f + "To" + (a.substr(0, 1).toUpperCase() +
a.substr(1)), h, g); b(a + "Pre", h, g); this.state = a; this.emit("state_change", { oldState: f, newState: a }); b(a + "Post", h, g)
   }; a.prototype.is = function (a) { return this.state === a }; a.prototype.isNot = function (a) { return this.state !== a }; c.Util.extend(a.prototype, c.EventsDispatcher.prototype); this.Pusher.Machine = a
}).call(this);
(function () { var b = function () { var a = this; Pusher.EventsDispatcher.call(this); window.addEventListener !== void 0 && (window.addEventListener("online", function () { a.emit("online", null) }, !1), window.addEventListener("offline", function () { a.emit("offline", null) }, !1)) }; b.prototype.isOnLine = function () { return window.navigator.onLine === void 0 ? !0 : window.navigator.onLine }; Pusher.Util.extend(b.prototype, Pusher.EventsDispatcher.prototype); this.Pusher.NetInfo = b }).call(this);
(function () {
   function b(a) { a.connectionWait = 0; a.openTimeout = c.TransportType === "flash" ? 5E3 : 2E3; a.connectedTimeout = 2E3; a.connectionSecure = a.compulsorySecure; a.connectionAttempts = 0 } function a(a, r) {
      function k() { d.connectionWait < s && (d.connectionWait += g); d.openTimeout < t && (d.openTimeout += f); d.connectedTimeout < u && (d.connectedTimeout += h); if (d.compulsorySecure !== !0) d.connectionSecure = !d.connectionSecure; d.connectionAttempts++ } function m() { d._machine.transition("impermanentlyClosing") } function p() {
         d._activityTimer &&
clearTimeout(d._activityTimer); d._activityTimer = setTimeout(function () { d.send_event("pusher:ping", {}); d._activityTimer = setTimeout(function () { d.socket.close() }, d.options.pong_timeout || c.pong_timeout) }, d.options.activity_timeout || c.activity_timeout)
      } function v() { var a = d.connectionWait; if (a === 0 && d.connectedAt) { var c = (new Date).getTime() - d.connectedAt; c < 1E3 && (a = 1E3 - c) } return a } function w() { d._machine.transition("open") } function x(a) {
         a = q(a); if (a !== void 0) if (a.event === "pusher:connection_established") d._machine.transition("connected",
a.data.socket_id); else if (a.event === "pusher:error") { var c = a.data.code; d.emit("error", { type: "PusherError", data: { code: c, message: a.data.message} }); c === 4E3 ? (d.compulsorySecure = !0, d.connectionSecure = !0, d.options.encrypted = !0, m()) : c < 4100 ? d._machine.transition("permanentlyClosing") : c < 4200 ? (d.connectionWait = 1E3, d._machine.transition("waiting")) : c < 4300 ? m() : d._machine.transition("permanentlyClosing") } 
      } function y(a) {
         p(); a = q(a); if (a !== void 0) {
            c.debug("Event recd", a); switch (a.event) {
               case "pusher:error": d.emit("error",
{ type: "PusherError", data: a.data }); break; case "pusher:ping": d.send_event("pusher:pong", {})
            } d.emit("message", a)
         } 
      } function q(a) { try { var c = JSON.parse(a.data); if (typeof c.data === "string") try { c.data = JSON.parse(c.data) } catch (b) { if (!(b instanceof SyntaxError)) throw b; } return c } catch (e) { d.emit("error", { type: "MessageParseError", error: e, data: a.data }) } } function n() { d._machine.transition("waiting") } function o(a) { d.emit("error", { type: "WebSocketError", error: a }) } function j(a, b) {
         var e = d.state; d.state = a; e !== a && (c.debug("State changed",
e + " -> " + a), d.emit("state_change", { previous: e, current: a }), d.emit(a, b))
      } var d = this; c.EventsDispatcher.call(this); this.options = c.Util.extend({ encrypted: !1 }, r); this.netInfo = new c.NetInfo; this.netInfo.bind("online", function () { d._machine.is("waiting") && (d._machine.transition("connecting"), j("connecting")) }); this.netInfo.bind("offline", function () {
         if (d._machine.is("connected")) d.socket.onclose = void 0, d.socket.onmessage = void 0, d.socket.onerror = void 0, d.socket.onopen = void 0, d.socket.close(), d.socket = void 0,
d._machine.transition("waiting")
      }); this._machine = new c.Machine("initialized", e, { initializedPre: function () { d.compulsorySecure = d.options.encrypted; d.key = a; d.socket = null; d.socket_id = null; d.state = "initialized" }, waitingPre: function () { d.connectionWait > 0 && d.emit("connecting_in", d.connectionWait); d.netInfo.isOnLine() && d.connectionAttempts <= 4 ? j("connecting") : j("unavailable"); if (d.netInfo.isOnLine()) d._waitingTimer = setTimeout(function () { d._machine.transition("connecting") }, v()) }, waitingExit: function () { clearTimeout(d._waitingTimer) },
         connectingPre: function () { if (d.netInfo.isOnLine() === !1) d._machine.transition("waiting"), j("unavailable"); else { var a; a = c.ws_port; var b = "ws://"; if (d.connectionSecure || document.location.protocol === "https:") a = c.wss_port, b = "wss://"; a = b + c.host + ":" + a + "/app/" + d.key + "?protocol=5&client=js&version=" + c.VERSION + "&flash=" + (c.TransportType === "flash" ? "true" : "false"); c.debug("Connecting", a); d.socket = new c.Transport(a); d.socket.onopen = w; d.socket.onclose = n; d.socket.onerror = o; d._connectingTimer = setTimeout(m, d.openTimeout) } },
         connectingExit: function () { clearTimeout(d._connectingTimer); d.socket.onopen = void 0 }, connectingToWaiting: function () { k() }, connectingToImpermanentlyClosing: function () { k() }, openPre: function () { d.socket.onmessage = x; d.socket.onerror = o; d.socket.onclose = n; d._openTimer = setTimeout(m, d.connectedTimeout) }, openExit: function () { clearTimeout(d._openTimer); d.socket.onmessage = void 0 }, openToWaiting: function () { k() }, openToImpermanentlyClosing: function () { k() }, connectedPre: function (a) {
            d.socket_id = a; d.socket.onmessage = y; d.socket.onerror =
o; d.socket.onclose = n; b(d); d.connectedAt = (new Date).getTime(); p()
         }, connectedPost: function () { j("connected") }, connectedExit: function () { d._activityTimer && clearTimeout(d._activityTimer); j("disconnected") }, impermanentlyClosingPost: function () { if (d.socket) d.socket.onclose = n, d.socket.close() }, permanentlyClosingPost: function () { d.socket ? (d.socket.onclose = function () { b(d); d._machine.transition("permanentlyClosed") }, d.socket.close()) : (b(d), d._machine.transition("permanentlyClosed")) }, failedPre: function () {
            j("failed");
            c.debug("WebSockets are not available in this browser.")
         }, permanentlyClosedPost: function () { j("disconnected") } 
      })
   } var c = this.Pusher, e = { initialized: ["waiting", "failed"], waiting: ["connecting", "permanentlyClosed"], connecting: ["open", "permanentlyClosing", "impermanentlyClosing", "waiting"], open: ["connected", "permanentlyClosing", "impermanentlyClosing", "waiting"], connected: ["permanentlyClosing", "waiting"], impermanentlyClosing: ["waiting", "permanentlyClosing"], permanentlyClosing: ["permanentlyClosed"], permanentlyClosed: ["waiting"],
      failed: ["permanentlyClosed"]
   }, g = 2E3, f = 2E3, h = 2E3, s = 5 * g, t = 5 * f, u = 5 * h; a.prototype.connect = function () { c.Transport === null || c.Transport === void 0 ? this._machine.transition("failed") : this._machine.is("initialized") ? (b(this), this._machine.transition("waiting")) : this._machine.is("waiting") && this.netInfo.isOnLine() === !0 ? this._machine.transition("connecting") : this._machine.is("permanentlyClosed") && (b(this), this._machine.transition("waiting")) }; a.prototype.send = function (a) {
      if (this._machine.is("connected")) {
         var c =
this; setTimeout(function () { c.socket.send(a) }, 0); return !0
      } else return !1
   }; a.prototype.send_event = function (a, b, e) { a = { event: a, data: b }; e && (a.channel = e); c.debug("Event sent", a); return this.send(JSON.stringify(a)) }; a.prototype.disconnect = function () { this._machine.is("permanentlyClosed") || (this._machine.is("waiting") || this._machine.is("failed") ? this._machine.transition("permanentlyClosed") : this._machine.transition("permanentlyClosing")) }; c.Util.extend(a.prototype, c.EventsDispatcher.prototype); this.Pusher.Connection =
a
}).call(this);
(function () {
   Pusher.Channels = function () { this.channels = {} }; Pusher.Channels.prototype = { add: function (a, c) { var b = this.find(a); b || (b = Pusher.Channel.factory(a, c), this.channels[a] = b); return b }, find: function (a) { return this.channels[a] }, remove: function (a) { delete this.channels[a] }, disconnect: function () { for (var a in this.channels) this.channels[a].disconnect() } }; Pusher.Channel = function (a, c) {
      var b = this; Pusher.EventsDispatcher.call(this, function (c) { Pusher.debug("No callbacks on " + a + " for " + c) }); this.pusher = c; this.name =
a; this.subscribed = !1; this.bind("pusher_internal:subscription_succeeded", function (a) { b.onSubscriptionSucceeded(a) })
   }; Pusher.Channel.prototype = { init: function () { }, disconnect: function () { this.subscribed = !1; this.emit("pusher_internal:disconnected") }, onSubscriptionSucceeded: function () { this.subscribed = !0; this.emit("pusher:subscription_succeeded") }, authorize: function (a, c, b) { return b(!1, {}) }, trigger: function (a, c) { return this.pusher.send_event(a, c, this.name) } }; Pusher.Util.extend(Pusher.Channel.prototype, Pusher.EventsDispatcher.prototype);
   Pusher.Channel.PrivateChannel = { authorize: function (a, c, b) { var g = this; return (new Pusher.Channel.Authorizer(this, Pusher.channel_auth_transport, c)).authorize(a, function (a, c) { a || g.emit("pusher_internal:authorized", c); b(a, c) }) } }; Pusher.Channel.PresenceChannel = { init: function () { this.members = new b(this) }, onSubscriptionSucceeded: function () { this.subscribed = !0 } }; var b = function (a) {
      var c = this, b = function () { this._members_map = {}; this.count = 0; this.me = null }; b.call(this); a.bind("pusher_internal:authorized", function (b) {
         var e =
JSON.parse(b.channel_data); a.bind("pusher_internal:subscription_succeeded", function (b) { c._members_map = b.presence.hash; c.count = b.presence.count; c.me = c.get(e.user_id); a.emit("pusher:subscription_succeeded", c) })
      }); a.bind("pusher_internal:member_added", function (b) { c.get(b.user_id) === null && c.count++; c._members_map[b.user_id] = b.user_info; a.emit("pusher:member_added", c.get(b.user_id)) }); a.bind("pusher_internal:member_removed", function (b) {
         var e = c.get(b.user_id); e && (delete c._members_map[b.user_id], c.count--,
a.emit("pusher:member_removed", e))
      }); a.bind("pusher_internal:disconnected", function () { b.call(c) })
   }; b.prototype = { each: function (a) { for (var b in this._members_map) a(this.get(b)) }, get: function (a) { return this._members_map.hasOwnProperty(a) ? { id: a, info: this._members_map[a]} : null } }; Pusher.Channel.factory = function (a, b) {
      var e = new Pusher.Channel(a, b); a.indexOf("private-") === 0 ? Pusher.Util.extend(e, Pusher.Channel.PrivateChannel) : a.indexOf("presence-") === 0 && (Pusher.Util.extend(e, Pusher.Channel.PrivateChannel),
Pusher.Util.extend(e, Pusher.Channel.PresenceChannel)); e.init(); return e
   } 
}).call(this);
(function () {
   Pusher.Channel.Authorizer = function (b, a, c) { this.channel = b; this.type = a; this.authOptions = (c || {}).auth || {} }; Pusher.Channel.Authorizer.prototype = { composeQuery: function (b) { var b = "&socket_id=" + encodeURIComponent(b) + "&channel_name=" + encodeURIComponent(this.channel.name), a; for (a in this.authOptions.params) b += "&" + encodeURIComponent(a) + "=" + encodeURIComponent(this.authOptions.params[a]); return b }, authorize: function (b, a) { return Pusher.authorizers[this.type].call(this, b, a) } }; Pusher.auth_callbacks = {};
   Pusher.authorizers = { ajax: function (b, a) {
      var c; c = Pusher.XHR ? new Pusher.XHR : window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"); c.open("POST", Pusher.channel_auth_endpoint, !0); c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); for (var e in this.authOptions.headers) c.setRequestHeader(e, this.authOptions.headers[e]); c.onreadystatechange = function () {
         if (c.readyState == 4) if (c.status == 200) {
            var b, e = !1; try { b = JSON.parse(c.responseText), e = !0 } catch (h) {
               a(!0, "JSON returned from webapp was invalid, yet status code was 200. Data was: " +
c.responseText)
            } e && a(!1, b)
         } else Pusher.warn("Couldn't get auth info from your webapp", c.status), a(!0, c.status)
      }; c.send(this.composeQuery(b)); return c
   }, jsonp: function (b, a) {
      this.authOptions.headers !== void 0 && Pusher.warn("Warn", "To send headers with the auth request, you must use AJAX, rather than JSONP."); var c = document.createElement("script"); Pusher.auth_callbacks[this.channel.name] = function (b) { a(!1, b) }; c.src = Pusher.channel_auth_endpoint + "?callback=" + encodeURIComponent("Pusher.auth_callbacks['" + this.channel.name +
"']") + this.composeQuery(b); var e = document.getElementsByTagName("head")[0] || document.documentElement; e.insertBefore(c, e.firstChild)
   } 
   }
}).call(this);
var _require = function () {
   var b; b = document.addEventListener ? function (a, b) { a.addEventListener("load", b, !1) } : function (a, b) { a.attachEvent("onreadystatechange", function () { (a.readyState == "loaded" || a.readyState == "complete") && b() }) }; return function (a, c) {
      function e(a, c) {
         var c = c || function () { }, e = document.getElementsByTagName("head")[0], h = document.createElement("script"); h.setAttribute("src", a); h.setAttribute("type", "text/javascript"); h.setAttribute("async", !0); b(h, function () { var a = c; g++; f == g && setTimeout(a, 0) });
         e.appendChild(h)
      } for (var g = 0, f = a.length, h = 0; h < f; h++) e(a[h], c)
   } 
} ();
(function () {
   var b = (document.location.protocol == "http:" ? Pusher.cdn_http : Pusher.cdn_https) + Pusher.VERSION, a = []; window.JSON === void 0 && a.push(b + "/json2" + Pusher.dependency_suffix + ".js"); if (window.WebSocket === void 0 && window.MozWebSocket === void 0) window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0, a.push(b + "/flashfallback" + Pusher.dependency_suffix + ".js"); var c = function () {
      return window.WebSocket === void 0 && window.MozWebSocket === void 0 ? function () {
         window.WebSocket !== void 0 && window.MozWebSocket === void 0 ? (Pusher.Transport =
window.WebSocket, Pusher.TransportType = "flash", window.WEB_SOCKET_SWF_LOCATION = b + "/WebSocketMain.swf", WebSocket.__addTask(function () { Pusher.ready() }), WebSocket.__initialize()) : (Pusher.Transport = null, Pusher.TransportType = "none", Pusher.ready())
      } : function () { Pusher.Transport = window.MozWebSocket !== void 0 ? window.MozWebSocket : window.WebSocket; Pusher.TransportType = "native"; Pusher.ready() } 
   } (), e = function (a) { var b = function () { document.body ? a() : setTimeout(b, 0) }; b() }, g = function () { e(c) }; a.length > 0 ? _require(a, g) : g()
})();