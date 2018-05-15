function initSignin() {
	jQuery("input[type=email]").prop({
		pattern: "^\\s*([A-Za-z0-9!#$%&*+/\\-^=?_{|}~]+[.])*[A-Za-z0-9!#$%&*+/\\-^=?_{|}~]+@(([A-Za-z0-9]+[.-])*[A-Za-z0-9]+\\.[A-Za-z]{2,})\\s*$"
	}).on("input", validateEmail), jQuery(".f_login_btn").on("click", openFacebookAuth), jQuery(".g_login_btn").on("click", openGoogleAuth), jQuery(window).on("message", function(e) {
		"setAuthCookie" == e.originalEvent.data.command && onLoginSuccess()
	})
}

function login(e) {
	var t = e.email.value.toLowerCase();
	return jQuery.post("https://online." + DOMAIN + "/opus/user", {
		_a: "get_auth_types",
		email: t
	}).always(function(e) {
		e && e.code && "0" == e.code && (!e.data.length || e.data.indexOf("stoamigo") > -1 || e.data.indexOf("stoamigo_without_password") > -1 || e.data.indexOf("gccas") > -1 ? (location.href = "https://login." + DOMAIN + "/?email=" + encodeURIComponent(t) + "&auth_types=" + encodeURIComponent(JSON.stringify(e.data))) : e.data.indexOf("facebook") > -1 ? openFacebookAuth() : e.data.indexOf("google") > -1 && openGoogleAuth())
	}), !1
}

function validateEmail() {
	this.validity.patternMismatch ? this.setCustomValidity("Email has invalid format") : this.setCustomValidity("")
}

function openFacebookAuth() {
	openWindow("https://www.facebook.com/dialog/oauth?client_id=" + FACEBOOK_APP_ID + "&scope=email,publish_actions&redirect_uri=" + encodeURIComponent("https://static." + DOMAIN + "/?auth=facebook&app=web"))
}

function openGoogleAuth() {
	openWindow("https://accounts.google.com/o/oauth2/auth?client_id=" + GOOGLE_APP_ID + "&scope=profile+email&response_type=code&redirect_uri=" + encodeURIComponent("https://online." + DOMAIN + "/?auth=google&app=web"))
}

function openWindow(e) {
	var t, i = Math.round((screen.availHeight - 600) / 2),
		n = Math.round((screen.availWidth - 800) / 2),
		o = window.navigator.userAgent;
	authWindow && !authWindow.closed ? authWindow.location.href = e : authWindow = window.open(e, "authWindow", "toolbar=0,menubar=0,status=0,width=800,height=600,top=" + (i < 0 ? 0 : i) + ",left=" + (n < 0 ? 0 : n)), authWindow.focus(), (o.indexOf("MSIE ") > -1 || /Trident.*rv\:11\./.test(o)) && (t = window.setInterval(function() {
		authWindow && !authWindow.closed || (window.clearInterval(t), onLoginSuccess())
	}, 100))
}

function onLoginSuccess() {
	location.href = "https://online." + DOMAIN + "/"
}

function clamp_css_byte(e) {
	return (e = Math.round(e)) < 0 ? 0 : e > 255 ? 255 : e
}

function clamp_css_float(e) {
	return e < 0 ? 0 : e > 1 ? 1 : e
}

function parse_css_int(e) {
	return clamp_css_byte("%" === e[e.length - 1] ? parseFloat(e) / 100 * 255 : parseInt(e))
}

function parse_css_float(e) {
	return clamp_css_float("%" === e[e.length - 1] ? parseFloat(e) / 100 : parseFloat(e))
}

function css_hue_to_rgb(e, t, i) {
	return i < 0 ? i += 1 : i > 1 && (i -= 1), 6 * i < 1 ? e + (t - e) * i * 6 : 2 * i < 1 ? t : 3 * i < 2 ? e + (t - e) * (2 / 3 - i) * 6 : e
}

function parseCSSColor(e) {
	var t = e.replace(/ /g, "").toLowerCase();
	if (t in kCSSColorTable) return kCSSColorTable[t].slice();
	if ("#" === t[0]) {
		if (4 === t.length) return (i = parseInt(t.substr(1), 16)) >= 0 && i <= 4095 ? [(3840 & i) >> 4 | (3840 & i) >> 8, 240 & i | (240 & i) >> 4, 15 & i | (15 & i) << 4, 1] : null;
		if (7 === t.length) {
			var i = parseInt(t.substr(1), 16);
			return i >= 0 && i <= 16777215 ? [(16711680 & i) >> 16, (65280 & i) >> 8, 255 & i, 1] : null
		}
		return null
	}
	var n = t.indexOf("("),
		o = t.indexOf(")");
	if (-1 !== n && o + 1 === t.length) {
		var r = t.substr(0, n),
			a = t.substr(n + 1, o - (n + 1)).split(","),
			s = 1;
		switch (r) {
			case "rgba":
				if (4 !== a.length) return null;
				s = parse_css_float(a.pop());
				break;
			case "rgb":
				return 3 !== a.length ? null : [parse_css_int(a[0]), parse_css_int(a[1]), parse_css_int(a[2]), s];
			case "hsla":
				if (4 !== a.length) return null;
				s = parse_css_float(a.pop());
				break;
			case "hsl":
				if (3 !== a.length) return null;
				var l = (parseFloat(a[0]) % 360 + 360) % 360 / 360,
					c = parse_css_float(a[1]),
					u = parse_css_float(a[2]),
					h = u <= .5 ? u * (c + 1) : u + c - u * c,
					d = 2 * u - h;
				return [clamp_css_byte(255 * css_hue_to_rgb(d, h, l + 1 / 3)), clamp_css_byte(255 * css_hue_to_rgb(d, h, l)), clamp_css_byte(255 * css_hue_to_rgb(d, h, l - 1 / 3)), s];
			default:
				return null
		}
	}
	return null
}

function is_mobile() {
	var e = navigator.userAgent || navigator.vendor || window.opera;
	return !!/windows phone/i.test(e) || !!/android/i.test(e) || !(!/iPad|iPhone|iPod/.test(e) || window.MSStream)
}

function is_touch_device() {
	return !!("ontouchstart" in window)
}

function is_ie() {
	var e = window.navigator.userAgent,
		t = e.indexOf("MSIE ");
	if (t > 0) return parseInt(e.substring(t + 5, e.indexOf(".", t)), 10);
	if (e.indexOf("Trident/") > 0) {
		var i = e.indexOf("rv:");
		return parseInt(e.substring(i + 3, e.indexOf(".", i)), 10)
	}
	var n = e.indexOf("Edge/");
	return n > 0 && parseInt(e.substring(n + 5, e.indexOf(".", n)), 10)
}

function is_ie11() {
	return !window.ActiveXObject && "ActiveXObject" in window
}

function version_ie() {
	return parseFloat(navigator.appVersion.split("MSIE")[1])
}

function getRandomNum(e, t) {
	"use strict";
	return Math.floor(Math.random() * (t - e + 1) + e)
}

function onLoad(e, t) {
	"use strict";
	if ("complete" === document.readyState) return t();
	e(), window.addEventListener ? window.addEventListener("load", t, !1) : window.attachEvent && window.attachEvent("onload", t)
}! function(e, t) {
	"use strict";
	"object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
		if (!e.document) throw new Error("jQuery requires a window with a document");
		return t(e)
	} : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
	"use strict";

	function i(e, t, i) {
		var n, o = (t = t || re).createElement("script");
		if (o.text = e, i)
			for (n in _e) i[n] && (o[n] = i[n]);
		t.head.appendChild(o).parentNode.removeChild(o)
	}

	function n(e) {
		return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? he[de.call(e)] || "object" : typeof e
	}

	function o(e) {
		var t = !!e && "length" in e && e.length,
			i = n(e);
		return !ve(e) && !ye(e) && ("array" === i || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
	}

	function r(e, t) {
		return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
	}

	function a(e, t, i) {
		return ve(t) ? be.grep(e, function(e, n) {
			return !!t.call(e, n, e) !== i
		}) : t.nodeType ? be.grep(e, function(e) {
			return e === t !== i
		}) : "string" != typeof t ? be.grep(e, function(e) {
			return ue.call(t, e) > -1 !== i
		}) : be.filter(t, e, i)
	}

	function s(e, t) {
		for (;
			(e = e[t]) && 1 !== e.nodeType;);
		return e
	}

	function l(e) {
		var t = {};
		return be.each(e.match($e) || [], function(e, i) {
			t[i] = !0
		}), t
	}

	function c(e) {
		return e
	}

	function u(e) {
		throw e
	}

	function h(e, t, i, n) {
		var o;
		try {
			e && ve(o = e.promise) ? o.call(e).done(t).fail(i) : e && ve(o = e.then) ? o.call(e, t, i) : t.apply(void 0, [e].slice(n))
		}
		catch (e) {
			i.apply(void 0, [e])
		}
	}

	function d() {
		re.removeEventListener("DOMContentLoaded", d), e.removeEventListener("load", d), be.ready()
	}

	function p(e, t) {
		return t.toUpperCase()
	}

	function f(e) {
		return e.replace(Le, "ms-").replace(Ie, p)
	}

	function m() {
		this.expando = be.expando + m.uid++
	}

	function g(e) {
		return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Ne.test(e) ? JSON.parse(e) : e)
	}

	function v(e, t, i) {
		var n;
		if (void 0 === i && 1 === e.nodeType)
			if (n = "data-" + t.replace(He, "-$&").toLowerCase(), "string" == typeof(i = e.getAttribute(n))) {
				try {
					i = g(i)
				}
				catch (e) {}
				Re.set(e, t, i)
			}
		else i = void 0;
		return i
	}

	function y(e, t, i, n) {
		var o, r, a = 20,
			s = n ? function() {
				return n.cur()
			} : function() {
				return be.css(e, t, "")
			},
			l = s(),
			c = i && i[3] || (be.cssNumber[t] ? "" : "px"),
			u = (be.cssNumber[t] || "px" !== c && +l) && Be.exec(be.css(e, t));
		if (u && u[3] !== c) {
			for (l /= 2, c = c || u[3], u = +l || 1; a--;) be.style(e, t, u + c), (1 - r) * (1 - (r = s() / l || .5)) <= 0 && (a = 0), u /= r;
			u *= 2, be.style(e, t, u + c), i = i || []
		}
		return i && (u = +u || +l || 0, o = i[1] ? u + (i[1] + 1) * i[2] : +i[2], n && (n.unit = c, n.start = u, n.end = o)), o
	}

	function _(e) {
		var t, i = e.ownerDocument,
			n = e.nodeName,
			o = Ye[n];
		return o || (t = i.body.appendChild(i.createElement(n)), o = be.css(t, "display"), t.parentNode.removeChild(t), "none" === o && (o = "block"), Ye[n] = o, o)
	}

	function b(e, t) {
		for (var i, n, o = [], r = 0, a = e.length; r < a; r++)(n = e[r]).style && (i = n.style.display, t ? ("none" === i && (o[r] = je.get(n, "display") || null, o[r] || (n.style.display = "")), "" === n.style.display && Ue(n) && (o[r] = _(n))) : "none" !== i && (o[r] = "none", je.set(n, "display", i)));
		for (r = 0; r < a; r++) null != o[r] && (e[r].style.display = o[r]);
		return e
	}

	function w(e, t) {
		var i;
		return i = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && r(e, t) ? be.merge([e], i) : i
	}

	function x(e, t) {
		for (var i = 0, n = e.length; i < n; i++) je.set(e[i], "globalEval", !t || je.get(t[i], "globalEval"))
	}

	function T(e, t, i, o, r) {
		for (var a, s, l, c, u, h, d = t.createDocumentFragment(), p = [], f = 0, m = e.length; f < m; f++)
			if ((a = e[f]) || 0 === a)
				if ("object" === n(a)) be.merge(p, a.nodeType ? [a] : a);
				else if (Ke.test(a)) {
			for (s = s || d.appendChild(t.createElement("div")), l = (Qe.exec(a) || ["", ""])[1].toLowerCase(), c = Ze[l] || Ze._default, s.innerHTML = c[1] + be.htmlPrefilter(a) + c[2], h = c[0]; h--;) s = s.lastChild;
			be.merge(p, s.childNodes), (s = d.firstChild).textContent = ""
		}
		else p.push(t.createTextNode(a));
		for (d.textContent = "", f = 0; a = p[f++];)
			if (o && be.inArray(a, o) > -1) r && r.push(a);
			else if (u = be.contains(a.ownerDocument, a), s = w(d.appendChild(a), "script"), u && x(s), i)
			for (h = 0; a = s[h++];) Ge.test(a.type || "") && i.push(a);
		return d
	}

	function k() {
		return !0
	}

	function C() {
		return !1
	}

	function S() {
		try {
			return re.activeElement
		}
		catch (e) {}
	}

	function A(e, t, i, n, o, r) {
		var a, s;
		if ("object" == typeof t) {
			"string" != typeof i && (n = n || i, i = void 0);
			for (s in t) A(e, s, i, n, t[s], r);
			return e
		}
		if (null == n && null == o ? (o = i, n = i = void 0) : null == o && ("string" == typeof i ? (o = n, n = void 0) : (o = n, n = i, i = void 0)), !1 === o) o = C;
		else if (!o) return e;
		return 1 === r && (a = o, (o = function(e) {
			return be().off(e), a.apply(this, arguments)
		}).guid = a.guid || (a.guid = be.guid++)), e.each(function() {
			be.event.add(this, t, o, n, i)
		})
	}

	function E(e, t) {
		return r(e, "table") && r(11 !== t.nodeType ? t : t.firstChild, "tr") ? be(e).children("tbody")[0] || e : e
	}

	function P(e) {
		return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
	}

	function O(e) {
		return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
	}

	function $(e, t) {
		var i, n, o, r, a, s, l, c;
		if (1 === t.nodeType) {
			if (je.hasData(e) && (r = je.access(e), a = je.set(t, r), c = r.events)) {
				delete a.handle, a.events = {};
				for (o in c)
					for (i = 0, n = c[o].length; i < n; i++) be.event.add(t, o, c[o][i])
			}
			Re.hasData(e) && (s = Re.access(e), l = be.extend({}, s), Re.set(t, l))
		}
	}

	function M(e, t) {
		var i = t.nodeName.toLowerCase();
		"input" === i && Ve.test(e.type) ? t.checked = e.checked : "input" !== i && "textarea" !== i || (t.defaultValue = e.defaultValue)
	}

	function D(e, t, n, o) {
		t = le.apply([], t);
		var r, a, s, l, c, u, h = 0,
			d = e.length,
			p = d - 1,
			f = t[0],
			m = ve(f);
		if (m || d > 1 && "string" == typeof f && !ge.checkClone && rt.test(f)) return e.each(function(i) {
			var r = e.eq(i);
			m && (t[0] = f.call(this, i, r.html())), D(r, t, n, o)
		});
		if (d && (r = T(t, e[0].ownerDocument, !1, e, o), a = r.firstChild, 1 === r.childNodes.length && (r = a), a || o)) {
			for (l = (s = be.map(w(r, "script"), P)).length; h < d; h++) c = r, h !== p && (c = be.clone(c, !0, !0), l && be.merge(s, w(c, "script"))), n.call(e[h], c, h);
			if (l)
				for (u = s[s.length - 1].ownerDocument, be.map(s, O), h = 0; h < l; h++) c = s[h], Ge.test(c.type || "") && !je.access(c, "globalEval") && be.contains(u, c) && (c.src && "module" !== (c.type || "").toLowerCase() ? be._evalUrl && be._evalUrl(c.src) : i(c.textContent.replace(at, ""), u, c))
		}
		return e
	}

	function z(e, t, i) {
		for (var n, o = t ? be.filter(t, e) : e, r = 0; null != (n = o[r]); r++) i || 1 !== n.nodeType || be.cleanData(w(n)), n.parentNode && (i && be.contains(n.ownerDocument, n) && x(w(n, "script")), n.parentNode.removeChild(n));
		return e
	}

	function L(e, t, i) {
		var n, o, r, a, s = e.style;
		return (i = i || lt(e)) && ("" !== (a = i.getPropertyValue(t) || i[t]) || be.contains(e.ownerDocument, e) || (a = be.style(e, t)), !ge.pixelBoxStyles() && st.test(a) && ct.test(t) && (n = s.width, o = s.minWidth, r = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = i.width, s.width = n, s.minWidth = o, s.maxWidth = r)), void 0 !== a ? a + "" : a
	}

	function I(e, t) {
		return {
			get: function() {
				if (!e()) return (this.get = t).apply(this, arguments);
				delete this.get
			}
		}
	}

	function F(e) {
		if (e in mt) return e;
		for (var t = e[0].toUpperCase() + e.slice(1), i = ft.length; i--;)
			if ((e = ft[i] + t) in mt) return e
	}

	function j(e) {
		var t = be.cssProps[e];
		return t || (t = be.cssProps[e] = F(e) || e), t
	}

	function R(e, t, i) {
		var n = Be.exec(t);
		return n ? Math.max(0, n[2] - (i || 0)) + (n[3] || "px") : t
	}

	function N(e, t, i, n, o, r) {
		var a = "width" === t ? 1 : 0,
			s = 0,
			l = 0;
		if (i === (n ? "border" : "content")) return 0;
		for (; a < 4; a += 2) "margin" === i && (l += be.css(e, i + We[a], !0, o)), n ? ("content" === i && (l -= be.css(e, "padding" + We[a], !0, o)), "margin" !== i && (l -= be.css(e, "border" + We[a] + "Width", !0, o))) : (l += be.css(e, "padding" + We[a], !0, o), "padding" !== i ? l += be.css(e, "border" + We[a] + "Width", !0, o) : s += be.css(e, "border" + We[a] + "Width", !0, o));
		return !n && r >= 0 && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - r - l - s - .5))), l
	}

	function H(e, t, i) {
		var n = lt(e),
			o = L(e, t, n),
			r = "border-box" === be.css(e, "boxSizing", !1, n),
			a = r;
		if (st.test(o)) {
			if (!i) return o;
			o = "auto"
		}
		return a = a && (ge.boxSizingReliable() || o === e.style[t]), ("auto" === o || !parseFloat(o) && "inline" === be.css(e, "display", !1, n)) && (o = e["offset" + t[0].toUpperCase() + t.slice(1)], a = !0), (o = parseFloat(o) || 0) + N(e, t, i || (r ? "border" : "content"), a, n, o) + "px"
	}

	function q(e, t, i, n, o) {
		return new q.prototype.init(e, t, i, n, o)
	}

	function B() {
		vt && (!1 === re.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(B) : e.setTimeout(B, be.fx.interval), be.fx.tick())
	}

	function W() {
		return e.setTimeout(function() {
			gt = void 0
		}), gt = Date.now()
	}

	function U(e, t) {
		var i, n = 0,
			o = {
				height: e
			};
		for (t = t ? 1 : 0; n < 4; n += 2 - t) o["margin" + (i = We[n])] = o["padding" + i] = e;
		return t && (o.opacity = o.width = e), o
	}

	function X(e, t, i) {
		for (var n, o = (V.tweeners[t] || []).concat(V.tweeners["*"]), r = 0, a = o.length; r < a; r++)
			if (n = o[r].call(i, t, e)) return n
	}

	function Y(e, t) {
		var i, n, o, r, a;
		for (i in e)
			if (n = f(i), o = t[n], r = e[i], Array.isArray(r) && (o = r[1], r = e[i] = r[0]), i !== n && (e[n] = r, delete e[i]), (a = be.cssHooks[n]) && "expand" in a) {
				r = a.expand(r), delete e[n];
				for (i in r) i in e || (e[i] = r[i], t[i] = o)
			}
		else t[n] = o
	}

	function V(e, t, i) {
		var n, o, r = 0,
			a = V.prefilters.length,
			s = be.Deferred().always(function() {
				delete l.elem
			}),
			l = function() {
				if (o) return !1;
				for (var t = gt || W(), i = Math.max(0, c.startTime + c.duration - t), n = 1 - (i / c.duration || 0), r = 0, a = c.tweens.length; r < a; r++) c.tweens[r].run(n);
				return s.notifyWith(e, [c, n, i]), n < 1 && a ? i : (a || s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c]), !1)
			},
			c = s.promise({
				elem: e,
				props: be.extend({}, t),
				opts: be.extend(!0, {
					specialEasing: {},
					easing: be.easing._default
				}, i),
				originalProperties: t,
				originalOptions: i,
				startTime: gt || W(),
				duration: i.duration,
				tweens: [],
				createTween: function(t, i) {
					var n = be.Tween(e, c.opts, t, i, c.opts.specialEasing[t] || c.opts.easing);
					return c.tweens.push(n), n
				},
				stop: function(t) {
					var i = 0,
						n = t ? c.tweens.length : 0;
					if (o) return this;
					for (o = !0; i < n; i++) c.tweens[i].run(1);
					return t ? (s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c, t])) : s.rejectWith(e, [c, t]), this
				}
			}),
			u = c.props;
		for (Y(u, c.opts.specialEasing); r < a; r++)
			if (n = V.prefilters[r].call(c, e, u, c.opts)) return ve(n.stop) && (be._queueHooks(c.elem, c.opts.queue).stop = n.stop.bind(n)), n;
		return be.map(u, X, c), ve(c.opts.start) && c.opts.start.call(e, c), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always), be.fx.timer(be.extend(l, {
			elem: e,
			anim: c,
			queue: c.opts.queue
		})), c
	}

	function Q(e) {
		return (e.match($e) || []).join(" ")
	}

	function G(e) {
		return e.getAttribute && e.getAttribute("class") || ""
	}

	function Z(e) {
		return Array.isArray(e) ? e : "string" == typeof e ? e.match($e) || [] : []
	}

	function K(e, t, i, o) {
		var r;
		if (Array.isArray(t)) be.each(t, function(t, n) {
			i || Ot.test(e) ? o(e, n) : K(e + "[" + ("object" == typeof n && null != n ? t : "") + "]", n, i, o)
		});
		else if (i || "object" !== n(t)) o(e, t);
		else
			for (r in t) K(e + "[" + r + "]", t[r], i, o)
	}

	function J(e) {
		return function(t, i) {
			"string" != typeof t && (i = t, t = "*");
			var n, o = 0,
				r = t.toLowerCase().match($e) || [];
			if (ve(i))
				for (; n = r[o++];) "+" === n[0] ? (n = n.slice(1) || "*", (e[n] = e[n] || []).unshift(i)) : (e[n] = e[n] || []).push(i)
		}
	}

	function ee(e, t, i, n) {
		function o(s) {
			var l;
			return r[s] = !0, be.each(e[s] || [], function(e, s) {
				var c = s(t, i, n);
				return "string" != typeof c || a || r[c] ? a ? !(l = c) : void 0 : (t.dataTypes.unshift(c), o(c), !1)
			}), l
		}
		var r = {},
			a = e === qt;
		return o(t.dataTypes[0]) || !r["*"] && o("*")
	}

	function te(e, t) {
		var i, n, o = be.ajaxSettings.flatOptions || {};
		for (i in t) void 0 !== t[i] && ((o[i] ? e : n || (n = {}))[i] = t[i]);
		return n && be.extend(!0, e, n), e
	}

	function ie(e, t, i) {
		for (var n, o, r, a, s = e.contents, l = e.dataTypes;
			"*" === l[0];) l.shift(), void 0 === n && (n = e.mimeType || t.getResponseHeader("Content-Type"));
		if (n)
			for (o in s)
				if (s[o] && s[o].test(n)) {
					l.unshift(o);
					break
				}
		if (l[0] in i) r = l[0];
		else {
			for (o in i) {
				if (!l[0] || e.converters[o + " " + l[0]]) {
					r = o;
					break
				}
				a || (a = o)
			}
			r = r || a
		}
		if (r) return r !== l[0] && l.unshift(r), i[r]
	}

	function ne(e, t, i, n) {
		var o, r, a, s, l, c = {},
			u = e.dataTypes.slice();
		if (u[1])
			for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
		for (r = u.shift(); r;)
			if (e.responseFields[r] && (i[e.responseFields[r]] = t), !l && n && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = r, r = u.shift())
				if ("*" === r) r = l;
				else if ("*" !== l && l !== r) {
			if (!(a = c[l + " " + r] || c["* " + r]))
				for (o in c)
					if ((s = o.split(" "))[1] === r && (a = c[l + " " + s[0]] || c["* " + s[0]])) {
						!0 === a ? a = c[o] : !0 !== c[o] && (r = s[0], u.unshift(s[1]));
						break
					}
			if (!0 !== a)
				if (a && e.throws) t = a(t);
				else try {
					t = a(t)
				}
			catch (e) {
				return {
					state: "parsererror",
					error: a ? e : "No conversion from " + l + " to " + r
				}
			}
		}
		return {
			state: "success",
			data: t
		}
	}
	var oe = [],
		re = e.document,
		ae = Object.getPrototypeOf,
		se = oe.slice,
		le = oe.concat,
		ce = oe.push,
		ue = oe.indexOf,
		he = {},
		de = he.toString,
		pe = he.hasOwnProperty,
		fe = pe.toString,
		me = fe.call(Object),
		ge = {},
		ve = function(e) {
			return "function" == typeof e && "number" != typeof e.nodeType
		},
		ye = function(e) {
			return null != e && e === e.window
		},
		_e = {
			type: !0,
			src: !0,
			noModule: !0
		},
		be = function(e, t) {
			return new be.fn.init(e, t)
		},
		we = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	be.fn = be.prototype = {
		jquery: "3.3.1",
		constructor: be,
		length: 0,
		toArray: function() {
			return se.call(this)
		},
		get: function(e) {
			return null == e ? se.call(this) : e < 0 ? this[e + this.length] : this[e]
		},
		pushStack: function(e) {
			var t = be.merge(this.constructor(), e);
			return t.prevObject = this, t
		},
		each: function(e) {
			return be.each(this, e)
		},
		map: function(e) {
			return this.pushStack(be.map(this, function(t, i) {
				return e.call(t, i, t)
			}))
		},
		slice: function() {
			return this.pushStack(se.apply(this, arguments))
		},
		first: function() {
			return this.eq(0)
		},
		last: function() {
			return this.eq(-1)
		},
		eq: function(e) {
			var t = this.length,
				i = +e + (e < 0 ? t : 0);
			return this.pushStack(i >= 0 && i < t ? [this[i]] : [])
		},
		end: function() {
			return this.prevObject || this.constructor()
		},
		push: ce,
		sort: oe.sort,
		splice: oe.splice
	}, be.extend = be.fn.extend = function() {
		var e, t, i, n, o, r, a = arguments[0] || {},
			s = 1,
			l = arguments.length,
			c = !1;
		for ("boolean" == typeof a && (c = a, a = arguments[s] || {}, s++), "object" == typeof a || ve(a) || (a = {}), s === l && (a = this, s--); s < l; s++)
			if (null != (e = arguments[s]))
				for (t in e) i = a[t], a !== (n = e[t]) && (c && n && (be.isPlainObject(n) || (o = Array.isArray(n))) ? (o ? (o = !1, r = i && Array.isArray(i) ? i : []) : r = i && be.isPlainObject(i) ? i : {}, a[t] = be.extend(c, r, n)) : void 0 !== n && (a[t] = n));
		return a
	}, be.extend({
		expando: "jQuery" + ("3.3.1" + Math.random()).replace(/\D/g, ""),
		isReady: !0,
		error: function(e) {
			throw new Error(e)
		},
		noop: function() {},
		isPlainObject: function(e) {
			var t, i;
			return !(!e || "[object Object]" !== de.call(e) || (t = ae(e)) && ("function" != typeof(i = pe.call(t, "constructor") && t.constructor) || fe.call(i) !== me))
		},
		isEmptyObject: function(e) {
			var t;
			for (t in e) return !1;
			return !0
		},
		globalEval: function(e) {
			i(e)
		},
		each: function(e, t) {
			var i, n = 0;
			if (o(e))
				for (i = e.length; n < i && !1 !== t.call(e[n], n, e[n]); n++);
			else
				for (n in e)
					if (!1 === t.call(e[n], n, e[n])) break;
			return e
		},
		trim: function(e) {
			return null == e ? "" : (e + "").replace(we, "")
		},
		makeArray: function(e, t) {
			var i = t || [];
			return null != e && (o(Object(e)) ? be.merge(i, "string" == typeof e ? [e] : e) : ce.call(i, e)), i
		},
		inArray: function(e, t, i) {
			return null == t ? -1 : ue.call(t, e, i)
		},
		merge: function(e, t) {
			for (var i = +t.length, n = 0, o = e.length; n < i; n++) e[o++] = t[n];
			return e.length = o, e
		},
		grep: function(e, t, i) {
			for (var n = [], o = 0, r = e.length, a = !i; o < r; o++) !t(e[o], o) !== a && n.push(e[o]);
			return n
		},
		map: function(e, t, i) {
			var n, r, a = 0,
				s = [];
			if (o(e))
				for (n = e.length; a < n; a++) null != (r = t(e[a], a, i)) && s.push(r);
			else
				for (a in e) null != (r = t(e[a], a, i)) && s.push(r);
			return le.apply([], s)
		},
		guid: 1,
		support: ge
	}), "function" == typeof Symbol && (be.fn[Symbol.iterator] = oe[Symbol.iterator]), be.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
		he["[object " + t + "]"] = t.toLowerCase()
	});
	var xe = function(e) {
		function t(e, t, i, n) {
			var o, r, a, s, l, u, d, p = t && t.ownerDocument,
				f = t ? t.nodeType : 9;
			if (i = i || [], "string" != typeof e || !e || 1 !== f && 9 !== f && 11 !== f) return i;
			if (!n && ((t ? t.ownerDocument || t : R) !== $ && O(t), t = t || $, D)) {
				if (11 !== f && (l = me.exec(e)))
					if (o = l[1]) {
						if (9 === f) {
							if (!(a = t.getElementById(o))) return i;
							if (a.id === o) return i.push(a), i
						}
						else if (p && (a = p.getElementById(o)) && F(t, a) && a.id === o) return i.push(a), i
					}
				else {
					if (l[2]) return G.apply(i, t.getElementsByTagName(e)), i;
					if ((o = l[3]) && b.getElementsByClassName && t.getElementsByClassName) return G.apply(i, t.getElementsByClassName(o)), i
				}
				if (b.qsa && !W[e + " "] && (!z || !z.test(e))) {
					if (1 !== f) p = t, d = e;
					else if ("object" !== t.nodeName.toLowerCase()) {
						for ((s = t.getAttribute("id")) ? s = s.replace(_e, be) : t.setAttribute("id", s = j), r = (u = k(e)).length; r--;) u[r] = "#" + s + " " + h(u[r]);
						d = u.join(","), p = ge.test(e) && c(t.parentNode) || t
					}
					if (d) try {
						return G.apply(i, p.querySelectorAll(d)), i
					}
					catch (e) {}
					finally {
						s === j && t.removeAttribute("id")
					}
				}
			}
			return S(e.replace(re, "$1"), t, i, n)
		}

		function i() {
			function e(i, n) {
				return t.push(i + " ") > w.cacheLength && delete e[t.shift()], e[i + " "] = n
			}
			var t = [];
			return e
		}

		function n(e) {
			return e[j] = !0, e
		}

		function o(e) {
			var t = $.createElement("fieldset");
			try {
				return !!e(t)
			}
			catch (e) {
				return !1
			}
			finally {
				t.parentNode && t.parentNode.removeChild(t), t = null
			}
		}

		function r(e, t) {
			for (var i = e.split("|"), n = i.length; n--;) w.attrHandle[i[n]] = t
		}

		function a(e, t) {
			var i = t && e,
				n = i && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
			if (n) return n;
			if (i)
				for (; i = i.nextSibling;)
					if (i === t) return -1;
			return e ? 1 : -1
		}

		function s(e) {
			return function(t) {
				return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && xe(t) === e : t.disabled === e : "label" in t && t.disabled === e
			}
		}

		function l(e) {
			return n(function(t) {
				return t = +t, n(function(i, n) {
					for (var o, r = e([], i.length, t), a = r.length; a--;) i[o = r[a]] && (i[o] = !(n[o] = i[o]))
				})
			})
		}

		function c(e) {
			return e && void 0 !== e.getElementsByTagName && e
		}

		function u() {}

		function h(e) {
			for (var t = 0, i = e.length, n = ""; t < i; t++) n += e[t].value;
			return n
		}

		function d(e, t, i) {
			var n = t.dir,
				o = t.next,
				r = o || n,
				a = i && "parentNode" === r,
				s = H++;
			return t.first ? function(t, i, o) {
				for (; t = t[n];)
					if (1 === t.nodeType || a) return e(t, i, o);
				return !1
			} : function(t, i, l) {
				var c, u, h, d = [N, s];
				if (l) {
					for (; t = t[n];)
						if ((1 === t.nodeType || a) && e(t, i, l)) return !0
				}
				else
					for (; t = t[n];)
						if (1 === t.nodeType || a)
							if (h = t[j] || (t[j] = {}), u = h[t.uniqueID] || (h[t.uniqueID] = {}), o && o === t.nodeName.toLowerCase()) t = t[n] || t;
							else {
								if ((c = u[r]) && c[0] === N && c[1] === s) return d[2] = c[2];
								if (u[r] = d, d[2] = e(t, i, l)) return !0
							} return !1
			}
		}

		function p(e) {
			return e.length > 1 ? function(t, i, n) {
				for (var o = e.length; o--;)
					if (!e[o](t, i, n)) return !1;
				return !0
			} : e[0]
		}

		function f(e, i, n) {
			for (var o = 0, r = i.length; o < r; o++) t(e, i[o], n);
			return n
		}

		function m(e, t, i, n, o) {
			for (var r, a = [], s = 0, l = e.length, c = null != t; s < l; s++)(r = e[s]) && (i && !i(r, n, o) || (a.push(r), c && t.push(s)));
			return a
		}

		function g(e, t, i, o, r, a) {
			return o && !o[j] && (o = g(o)), r && !r[j] && (r = g(r, a)), n(function(n, a, s, l) {
				var c, u, h, d = [],
					p = [],
					g = a.length,
					v = n || f(t || "*", s.nodeType ? [s] : s, []),
					y = !e || !n && t ? v : m(v, d, e, s, l),
					_ = i ? r || (n ? e : g || o) ? [] : a : y;
				if (i && i(y, _, s, l), o)
					for (c = m(_, p), o(c, [], s, l), u = c.length; u--;)(h = c[u]) && (_[p[u]] = !(y[p[u]] = h));
				if (n) {
					if (r || e) {
						if (r) {
							for (c = [], u = _.length; u--;)(h = _[u]) && c.push(y[u] = h);
							r(null, _ = [], c, l)
						}
						for (u = _.length; u--;)(h = _[u]) && (c = r ? K(n, h) : d[u]) > -1 && (n[c] = !(a[c] = h))
					}
				}
				else _ = m(_ === a ? _.splice(g, _.length) : _), r ? r(null, a, _, l) : G.apply(a, _)
			})
		}

		function v(e) {
			for (var t, i, n, o = e.length, r = w.relative[e[0].type], a = r || w.relative[" "], s = r ? 1 : 0, l = d(function(e) {
					return e === t
				}, a, !0), c = d(function(e) {
					return K(t, e) > -1
				}, a, !0), u = [function(e, i, n) {
					var o = !r && (n || i !== A) || ((t = i).nodeType ? l(e, i, n) : c(e, i, n));
					return t = null, o
				}]; s < o; s++)
				if (i = w.relative[e[s].type]) u = [d(p(u), i)];
				else {
					if ((i = w.filter[e[s].type].apply(null, e[s].matches))[j]) {
						for (n = ++s; n < o && !w.relative[e[n].type]; n++);
						return g(s > 1 && p(u), s > 1 && h(e.slice(0, s - 1).concat({
							value: " " === e[s - 2].type ? "*" : ""
						})).replace(re, "$1"), i, s < n && v(e.slice(s, n)), n < o && v(e = e.slice(n)), n < o && h(e))
					}
					u.push(i)
				}
			return p(u)
		}

		function y(e, i) {
			var o = i.length > 0,
				r = e.length > 0,
				a = function(n, a, s, l, c) {
					var u, h, d, p = 0,
						f = "0",
						g = n && [],
						v = [],
						y = A,
						_ = n || r && w.find.TAG("*", c),
						b = N += null == y ? 1 : Math.random() || .1,
						x = _.length;
					for (c && (A = a === $ || a || c); f !== x && null != (u = _[f]); f++) {
						if (r && u) {
							for (h = 0, a || u.ownerDocument === $ || (O(u), s = !D); d = e[h++];)
								if (d(u, a || $, s)) {
									l.push(u);
									break
								}
							c && (N = b)
						}
						o && ((u = !d && u) && p--, n && g.push(u))
					}
					if (p += f, o && f !== p) {
						for (h = 0; d = i[h++];) d(g, v, a, s);
						if (n) {
							if (p > 0)
								for (; f--;) g[f] || v[f] || (v[f] = V.call(l));
							v = m(v)
						}
						G.apply(l, v), c && !n && v.length > 0 && p + i.length > 1 && t.uniqueSort(l)
					}
					return c && (N = b, A = y), g
				};
			return o ? n(a) : a
		}
		var _, b, w, x, T, k, C, S, A, E, P, O, $, M, D, z, L, I, F, j = "sizzle" + 1 * new Date,
			R = e.document,
			N = 0,
			H = 0,
			q = i(),
			B = i(),
			W = i(),
			U = function(e, t) {
				return e === t && (P = !0), 0
			},
			X = {}.hasOwnProperty,
			Y = [],
			V = Y.pop,
			Q = Y.push,
			G = Y.push,
			Z = Y.slice,
			K = function(e, t) {
				for (var i = 0, n = e.length; i < n; i++)
					if (e[i] === t) return i;
				return -1
			},
			J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
			ee = "[\\x20\\t\\r\\n\\f]",
			te = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
			ie = "\\[" + ee + "*(" + te + ")(?:" + ee + "*([*^$|!~]?=)" + ee + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + te + "))|)" + ee + "*\\]",
			ne = ":(" + te + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ie + ")*)|.*)\\)|)",
			oe = new RegExp(ee + "+", "g"),
			re = new RegExp("^" + ee + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ee + "+$", "g"),
			ae = new RegExp("^" + ee + "*," + ee + "*"),
			se = new RegExp("^" + ee + "*([>+~]|" + ee + ")" + ee + "*"),
			le = new RegExp("=" + ee + "*([^\\]'\"]*?)" + ee + "*\\]", "g"),
			ce = new RegExp(ne),
			ue = new RegExp("^" + te + "$"),
			he = {
				ID: new RegExp("^#(" + te + ")"),
				CLASS: new RegExp("^\\.(" + te + ")"),
				TAG: new RegExp("^(" + te + "|[*])"),
				ATTR: new RegExp("^" + ie),
				PSEUDO: new RegExp("^" + ne),
				CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ee + "*(even|odd|(([+-]|)(\\d*)n|)" + ee + "*(?:([+-]|)" + ee + "*(\\d+)|))" + ee + "*\\)|)", "i"),
				bool: new RegExp("^(?:" + J + ")$", "i"),
				needsContext: new RegExp("^" + ee + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ee + "*((?:-\\d)?\\d*)" + ee + "*\\)|)(?=[^-]|$)", "i")
			},
			de = /^(?:input|select|textarea|button)$/i,
			pe = /^h\d$/i,
			fe = /^[^{]+\{\s*\[native \w/,
			me = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			ge = /[+~]/,
			ve = new RegExp("\\\\([\\da-f]{1,6}" + ee + "?|(" + ee + ")|.)", "ig"),
			ye = function(e, t, i) {
				var n = "0x" + t - 65536;
				return n !== n || i ? t : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320)
			},
			_e = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
			be = function(e, t) {
				return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
			},
			we = function() {
				O()
			},
			xe = d(function(e) {
				return !0 === e.disabled && ("form" in e || "label" in e)
			}, {
				dir: "parentNode",
				next: "legend"
			});
		try {
			G.apply(Y = Z.call(R.childNodes), R.childNodes), Y[R.childNodes.length].nodeType
		}
		catch (e) {
			G = {
				apply: Y.length ? function(e, t) {
					Q.apply(e, Z.call(t))
				} : function(e, t) {
					for (var i = e.length, n = 0; e[i++] = t[n++];);
					e.length = i - 1
				}
			}
		}
		b = t.support = {}, T = t.isXML = function(e) {
			var t = e && (e.ownerDocument || e).documentElement;
			return !!t && "HTML" !== t.nodeName
		}, O = t.setDocument = function(e) {
			var t, i, n = e ? e.ownerDocument || e : R;
			return n !== $ && 9 === n.nodeType && n.documentElement ? ($ = n, M = $.documentElement, D = !T($), R !== $ && (i = $.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", we, !1) : i.attachEvent && i.attachEvent("onunload", we)), b.attributes = o(function(e) {
				return e.className = "i", !e.getAttribute("className")
			}), b.getElementsByTagName = o(function(e) {
				return e.appendChild($.createComment("")), !e.getElementsByTagName("*").length
			}), b.getElementsByClassName = fe.test($.getElementsByClassName), b.getById = o(function(e) {
				return M.appendChild(e).id = j, !$.getElementsByName || !$.getElementsByName(j).length
			}), b.getById ? (w.filter.ID = function(e) {
				var t = e.replace(ve, ye);
				return function(e) {
					return e.getAttribute("id") === t
				}
			}, w.find.ID = function(e, t) {
				if (void 0 !== t.getElementById && D) {
					var i = t.getElementById(e);
					return i ? [i] : []
				}
			}) : (w.filter.ID = function(e) {
				var t = e.replace(ve, ye);
				return function(e) {
					var i = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
					return i && i.value === t
				}
			}, w.find.ID = function(e, t) {
				if (void 0 !== t.getElementById && D) {
					var i, n, o, r = t.getElementById(e);
					if (r) {
						if ((i = r.getAttributeNode("id")) && i.value === e) return [r];
						for (o = t.getElementsByName(e), n = 0; r = o[n++];)
							if ((i = r.getAttributeNode("id")) && i.value === e) return [r]
					}
					return []
				}
			}), w.find.TAG = b.getElementsByTagName ? function(e, t) {
				return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : b.qsa ? t.querySelectorAll(e) : void 0
			} : function(e, t) {
				var i, n = [],
					o = 0,
					r = t.getElementsByTagName(e);
				if ("*" === e) {
					for (; i = r[o++];) 1 === i.nodeType && n.push(i);
					return n
				}
				return r
			}, w.find.CLASS = b.getElementsByClassName && function(e, t) {
				if (void 0 !== t.getElementsByClassName && D) return t.getElementsByClassName(e)
			}, L = [], z = [], (b.qsa = fe.test($.querySelectorAll)) && (o(function(e) {
				M.appendChild(e).innerHTML = "<a id='" + j + "'></a><select id='" + j + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && z.push("[*^$]=" + ee + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || z.push("\\[" + ee + "*(?:value|" + J + ")"), e.querySelectorAll("[id~=" + j + "-]").length || z.push("~="), e.querySelectorAll(":checked").length || z.push(":checked"), e.querySelectorAll("a#" + j + "+*").length || z.push(".#.+[+~]")
			}), o(function(e) {
				e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
				var t = $.createElement("input");
				t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && z.push("name" + ee + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && z.push(":enabled", ":disabled"), M.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && z.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), z.push(",.*:")
			})), (b.matchesSelector = fe.test(I = M.matches || M.webkitMatchesSelector || M.mozMatchesSelector || M.oMatchesSelector || M.msMatchesSelector)) && o(function(e) {
				b.disconnectedMatch = I.call(e, "*"), I.call(e, "[s!='']:x"), L.push("!=", ne)
			}), z = z.length && new RegExp(z.join("|")), L = L.length && new RegExp(L.join("|")), t = fe.test(M.compareDocumentPosition), F = t || fe.test(M.contains) ? function(e, t) {
				var i = 9 === e.nodeType ? e.documentElement : e,
					n = t && t.parentNode;
				return e === n || !(!n || 1 !== n.nodeType || !(i.contains ? i.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)))
			} : function(e, t) {
				if (t)
					for (; t = t.parentNode;)
						if (t === e) return !0;
				return !1
			}, U = t ? function(e, t) {
				if (e === t) return P = !0, 0;
				var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
				return i || (1 & (i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !b.sortDetached && t.compareDocumentPosition(e) === i ? e === $ || e.ownerDocument === R && F(R, e) ? -1 : t === $ || t.ownerDocument === R && F(R, t) ? 1 : E ? K(E, e) - K(E, t) : 0 : 4 & i ? -1 : 1)
			} : function(e, t) {
				if (e === t) return P = !0, 0;
				var i, n = 0,
					o = e.parentNode,
					r = t.parentNode,
					s = [e],
					l = [t];
				if (!o || !r) return e === $ ? -1 : t === $ ? 1 : o ? -1 : r ? 1 : E ? K(E, e) - K(E, t) : 0;
				if (o === r) return a(e, t);
				for (i = e; i = i.parentNode;) s.unshift(i);
				for (i = t; i = i.parentNode;) l.unshift(i);
				for (; s[n] === l[n];) n++;
				return n ? a(s[n], l[n]) : s[n] === R ? -1 : l[n] === R ? 1 : 0
			}, $) : $
		}, t.matches = function(e, i) {
			return t(e, null, null, i)
		}, t.matchesSelector = function(e, i) {
			if ((e.ownerDocument || e) !== $ && O(e), i = i.replace(le, "='$1']"), b.matchesSelector && D && !W[i + " "] && (!L || !L.test(i)) && (!z || !z.test(i))) try {
				var n = I.call(e, i);
				if (n || b.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
			}
			catch (e) {}
			return t(i, $, null, [e]).length > 0
		}, t.contains = function(e, t) {
			return (e.ownerDocument || e) !== $ && O(e), F(e, t)
		}, t.attr = function(e, t) {
			(e.ownerDocument || e) !== $ && O(e);
			var i = w.attrHandle[t.toLowerCase()],
				n = i && X.call(w.attrHandle, t.toLowerCase()) ? i(e, t, !D) : void 0;
			return void 0 !== n ? n : b.attributes || !D ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
		}, t.escape = function(e) {
			return (e + "").replace(_e, be)
		}, t.error = function(e) {
			throw new Error("Syntax error, unrecognized expression: " + e)
		}, t.uniqueSort = function(e) {
			var t, i = [],
				n = 0,
				o = 0;
			if (P = !b.detectDuplicates, E = !b.sortStable && e.slice(0), e.sort(U), P) {
				for (; t = e[o++];) t === e[o] && (n = i.push(o));
				for (; n--;) e.splice(i[n], 1)
			}
			return E = null, e
		}, x = t.getText = function(e) {
			var t, i = "",
				n = 0,
				o = e.nodeType;
			if (o) {
				if (1 === o || 9 === o || 11 === o) {
					if ("string" == typeof e.textContent) return e.textContent;
					for (e = e.firstChild; e; e = e.nextSibling) i += x(e)
				}
				else if (3 === o || 4 === o) return e.nodeValue
			}
			else
				for (; t = e[n++];) i += x(t);
			return i
		}, (w = t.selectors = {
			cacheLength: 50,
			createPseudo: n,
			match: he,
			attrHandle: {},
			find: {},
			relative: {
				">": {
					dir: "parentNode",
					first: !0
				},
				" ": {
					dir: "parentNode"
				},
				"+": {
					dir: "previousSibling",
					first: !0
				},
				"~": {
					dir: "previousSibling"
				}
			},
			preFilter: {
				ATTR: function(e) {
					return e[1] = e[1].replace(ve, ye), e[3] = (e[3] || e[4] || e[5] || "").replace(ve, ye), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
				},
				CHILD: function(e) {
					return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
				},
				PSEUDO: function(e) {
					var t, i = !e[6] && e[2];
					return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : i && ce.test(i) && (t = k(i, !0)) && (t = i.indexOf(")", i.length - t) - i.length) && (e[0] = e[0].slice(0, t), e[2] = i.slice(0, t)), e.slice(0, 3))
				}
			},
			filter: {
				TAG: function(e) {
					var t = e.replace(ve, ye).toLowerCase();
					return "*" === e ? function() {
						return !0
					} : function(e) {
						return e.nodeName && e.nodeName.toLowerCase() === t
					}
				},
				CLASS: function(e) {
					var t = q[e + " "];
					return t || (t = new RegExp("(^|" + ee + ")" + e + "(" + ee + "|$)")) && q(e, function(e) {
						return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
					})
				},
				ATTR: function(e, i, n) {
					return function(o) {
						var r = t.attr(o, e);
						return null == r ? "!=" === i : !i || (r += "", "=" === i ? r === n : "!=" === i ? r !== n : "^=" === i ? n && 0 === r.indexOf(n) : "*=" === i ? n && r.indexOf(n) > -1 : "$=" === i ? n && r.slice(-n.length) === n : "~=" === i ? (" " + r.replace(oe, " ") + " ").indexOf(n) > -1 : "|=" === i && (r === n || r.slice(0, n.length + 1) === n + "-"))
					}
				},
				CHILD: function(e, t, i, n, o) {
					var r = "nth" !== e.slice(0, 3),
						a = "last" !== e.slice(-4),
						s = "of-type" === t;
					return 1 === n && 0 === o ? function(e) {
						return !!e.parentNode
					} : function(t, i, l) {
						var c, u, h, d, p, f, m = r !== a ? "nextSibling" : "previousSibling",
							g = t.parentNode,
							v = s && t.nodeName.toLowerCase(),
							y = !l && !s,
							_ = !1;
						if (g) {
							if (r) {
								for (; m;) {
									for (d = t; d = d[m];)
										if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
									f = m = "only" === e && !f && "nextSibling"
								}
								return !0
							}
							if (f = [a ? g.firstChild : g.lastChild], a && y) {
								for (_ = (p = (c = (u = (h = (d = g)[j] || (d[j] = {}))[d.uniqueID] || (h[d.uniqueID] = {}))[e] || [])[0] === N && c[1]) && c[2], d = p && g.childNodes[p]; d = ++p && d && d[m] || (_ = p = 0) || f.pop();)
									if (1 === d.nodeType && ++_ && d === t) {
										u[e] = [N, p, _];
										break
									}
							}
							else if (y && (_ = p = (c = (u = (h = (d = t)[j] || (d[j] = {}))[d.uniqueID] || (h[d.uniqueID] = {}))[e] || [])[0] === N && c[1]), !1 === _)
								for (;
									(d = ++p && d && d[m] || (_ = p = 0) || f.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++_ || (y && ((u = (h = d[j] || (d[j] = {}))[d.uniqueID] || (h[d.uniqueID] = {}))[e] = [N, _]), d !== t)););
							return (_ -= o) === n || _ % n == 0 && _ / n >= 0
						}
					}
				},
				PSEUDO: function(e, i) {
					var o, r = w.pseudos[e] || w.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
					return r[j] ? r(i) : r.length > 1 ? (o = [e, e, "", i], w.setFilters.hasOwnProperty(e.toLowerCase()) ? n(function(e, t) {
						for (var n, o = r(e, i), a = o.length; a--;) e[n = K(e, o[a])] = !(t[n] = o[a])
					}) : function(e) {
						return r(e, 0, o)
					}) : r
				}
			},
			pseudos: {
				not: n(function(e) {
					var t = [],
						i = [],
						o = C(e.replace(re, "$1"));
					return o[j] ? n(function(e, t, i, n) {
						for (var r, a = o(e, null, n, []), s = e.length; s--;)(r = a[s]) && (e[s] = !(t[s] = r))
					}) : function(e, n, r) {
						return t[0] = e, o(t, null, r, i), t[0] = null, !i.pop()
					}
				}),
				has: n(function(e) {
					return function(i) {
						return t(e, i).length > 0
					}
				}),
				contains: n(function(e) {
					return e = e.replace(ve, ye),
						function(t) {
							return (t.textContent || t.innerText || x(t)).indexOf(e) > -1
						}
				}),
				lang: n(function(e) {
					return ue.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(ve, ye).toLowerCase(),
						function(t) {
							var i;
							do {
								if (i = D ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (i = i.toLowerCase()) === e || 0 === i.indexOf(e + "-")
							} while ((t = t.parentNode) && 1 === t.nodeType);
							return !1
						}
				}),
				target: function(t) {
					var i = e.location && e.location.hash;
					return i && i.slice(1) === t.id
				},
				root: function(e) {
					return e === M
				},
				focus: function(e) {
					return e === $.activeElement && (!$.hasFocus || $.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
				},
				enabled: s(!1),
				disabled: s(!0),
				checked: function(e) {
					var t = e.nodeName.toLowerCase();
					return "input" === t && !!e.checked || "option" === t && !!e.selected
				},
				selected: function(e) {
					return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
				},
				empty: function(e) {
					for (e = e.firstChild; e; e = e.nextSibling)
						if (e.nodeType < 6) return !1;
					return !0
				},
				parent: function(e) {
					return !w.pseudos.empty(e)
				},
				header: function(e) {
					return pe.test(e.nodeName)
				},
				input: function(e) {
					return de.test(e.nodeName)
				},
				button: function(e) {
					var t = e.nodeName.toLowerCase();
					return "input" === t && "button" === e.type || "button" === t
				},
				text: function(e) {
					var t;
					return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
				},
				first: l(function() {
					return [0]
				}),
				last: l(function(e, t) {
					return [t - 1]
				}),
				eq: l(function(e, t, i) {
					return [i < 0 ? i + t : i]
				}),
				even: l(function(e, t) {
					for (var i = 0; i < t; i += 2) e.push(i);
					return e
				}),
				odd: l(function(e, t) {
					for (var i = 1; i < t; i += 2) e.push(i);
					return e
				}),
				lt: l(function(e, t, i) {
					for (var n = i < 0 ? i + t : i; --n >= 0;) e.push(n);
					return e
				}),
				gt: l(function(e, t, i) {
					for (var n = i < 0 ? i + t : i; ++n < t;) e.push(n);
					return e
				})
			}
		}).pseudos.nth = w.pseudos.eq;
		for (_ in {
				radio: !0,
				checkbox: !0,
				file: !0,
				password: !0,
				image: !0
			}) w.pseudos[_] = function(e) {
			return function(t) {
				return "input" === t.nodeName.toLowerCase() && t.type === e
			}
		}(_);
		for (_ in {
				submit: !0,
				reset: !0
			}) w.pseudos[_] = function(e) {
			return function(t) {
				var i = t.nodeName.toLowerCase();
				return ("input" === i || "button" === i) && t.type === e
			}
		}(_);
		return u.prototype = w.filters = w.pseudos, w.setFilters = new u, k = t.tokenize = function(e, i) {
			var n, o, r, a, s, l, c, u = B[e + " "];
			if (u) return i ? 0 : u.slice(0);
			for (s = e, l = [], c = w.preFilter; s;) {
				n && !(o = ae.exec(s)) || (o && (s = s.slice(o[0].length) || s), l.push(r = [])), n = !1, (o = se.exec(s)) && (n = o.shift(), r.push({
					value: n,
					type: o[0].replace(re, " ")
				}), s = s.slice(n.length));
				for (a in w.filter) !(o = he[a].exec(s)) || c[a] && !(o = c[a](o)) || (n = o.shift(), r.push({
					value: n,
					type: a,
					matches: o
				}), s = s.slice(n.length));
				if (!n) break
			}
			return i ? s.length : s ? t.error(e) : B(e, l).slice(0)
		}, C = t.compile = function(e, t) {
			var i, n = [],
				o = [],
				r = W[e + " "];
			if (!r) {
				for (t || (t = k(e)), i = t.length; i--;)(r = v(t[i]))[j] ? n.push(r) : o.push(r);
				(r = W(e, y(o, n))).selector = e
			}
			return r
		}, S = t.select = function(e, t, i, n) {
			var o, r, a, s, l, u = "function" == typeof e && e,
				d = !n && k(e = u.selector || e);
			if (i = i || [], 1 === d.length) {
				if ((r = d[0] = d[0].slice(0)).length > 2 && "ID" === (a = r[0]).type && 9 === t.nodeType && D && w.relative[r[1].type]) {
					if (!(t = (w.find.ID(a.matches[0].replace(ve, ye), t) || [])[0])) return i;
					u && (t = t.parentNode), e = e.slice(r.shift().value.length)
				}
				for (o = he.needsContext.test(e) ? 0 : r.length; o-- && (a = r[o], !w.relative[s = a.type]);)
					if ((l = w.find[s]) && (n = l(a.matches[0].replace(ve, ye), ge.test(r[0].type) && c(t.parentNode) || t))) {
						if (r.splice(o, 1), !(e = n.length && h(r))) return G.apply(i, n), i;
						break
					}
			}
			return (u || C(e, d))(n, t, !D, i, !t || ge.test(e) && c(t.parentNode) || t), i
		}, b.sortStable = j.split("").sort(U).join("") === j, b.detectDuplicates = !!P, O(), b.sortDetached = o(function(e) {
			return 1 & e.compareDocumentPosition($.createElement("fieldset"))
		}), o(function(e) {
			return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
		}) || r("type|href|height|width", function(e, t, i) {
			if (!i) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
		}), b.attributes && o(function(e) {
			return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
		}) || r("value", function(e, t, i) {
			if (!i && "input" === e.nodeName.toLowerCase()) return e.defaultValue
		}), o(function(e) {
			return null == e.getAttribute("disabled")
		}) || r(J, function(e, t, i) {
			var n;
			if (!i) return !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
		}), t
	}(e);
	be.find = xe, be.expr = xe.selectors, be.expr[":"] = be.expr.pseudos, be.uniqueSort = be.unique = xe.uniqueSort, be.text = xe.getText, be.isXMLDoc = xe.isXML, be.contains = xe.contains, be.escapeSelector = xe.escape;
	var Te = function(e, t, i) {
			for (var n = [], o = void 0 !== i;
				(e = e[t]) && 9 !== e.nodeType;)
				if (1 === e.nodeType) {
					if (o && be(e).is(i)) break;
					n.push(e)
				}
			return n
		},
		ke = function(e, t) {
			for (var i = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && i.push(e);
			return i
		},
		Ce = be.expr.match.needsContext,
		Se = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
	be.filter = function(e, t, i) {
		var n = t[0];
		return i && (e = ":not(" + e + ")"), 1 === t.length && 1 === n.nodeType ? be.find.matchesSelector(n, e) ? [n] : [] : be.find.matches(e, be.grep(t, function(e) {
			return 1 === e.nodeType
		}))
	}, be.fn.extend({
		find: function(e) {
			var t, i, n = this.length,
				o = this;
			if ("string" != typeof e) return this.pushStack(be(e).filter(function() {
				for (t = 0; t < n; t++)
					if (be.contains(o[t], this)) return !0
			}));
			for (i = this.pushStack([]), t = 0; t < n; t++) be.find(e, o[t], i);
			return n > 1 ? be.uniqueSort(i) : i
		},
		filter: function(e) {
			return this.pushStack(a(this, e || [], !1))
		},
		not: function(e) {
			return this.pushStack(a(this, e || [], !0))
		},
		is: function(e) {
			return !!a(this, "string" == typeof e && Ce.test(e) ? be(e) : e || [], !1).length
		}
	});
	var Ae, Ee = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
	(be.fn.init = function(e, t, i) {
		var n, o;
		if (!e) return this;
		if (i = i || Ae, "string" == typeof e) {
			if (!(n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : Ee.exec(e)) || !n[1] && t) return !t || t.jquery ? (t || i).find(e) : this.constructor(t).find(e);
			if (n[1]) {
				if (t = t instanceof be ? t[0] : t, be.merge(this, be.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : re, !0)), Se.test(n[1]) && be.isPlainObject(t))
					for (n in t) ve(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
				return this
			}
			return (o = re.getElementById(n[2])) && (this[0] = o, this.length = 1), this
		}
		return e.nodeType ? (this[0] = e, this.length = 1, this) : ve(e) ? void 0 !== i.ready ? i.ready(e) : e(be) : be.makeArray(e, this)
	}).prototype = be.fn, Ae = be(re);
	var Pe = /^(?:parents|prev(?:Until|All))/,
		Oe = {
			children: !0,
			contents: !0,
			next: !0,
			prev: !0
		};
	be.fn.extend({
		has: function(e) {
			var t = be(e, this),
				i = t.length;
			return this.filter(function() {
				for (var e = 0; e < i; e++)
					if (be.contains(this, t[e])) return !0
			})
		},
		closest: function(e, t) {
			var i, n = 0,
				o = this.length,
				r = [],
				a = "string" != typeof e && be(e);
			if (!Ce.test(e))
				for (; n < o; n++)
					for (i = this[n]; i && i !== t; i = i.parentNode)
						if (i.nodeType < 11 && (a ? a.index(i) > -1 : 1 === i.nodeType && be.find.matchesSelector(i, e))) {
							r.push(i);
							break
						}
			return this.pushStack(r.length > 1 ? be.uniqueSort(r) : r)
		},
		index: function(e) {
			return e ? "string" == typeof e ? ue.call(be(e), this[0]) : ue.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
		},
		add: function(e, t) {
			return this.pushStack(be.uniqueSort(be.merge(this.get(), be(e, t))))
		},
		addBack: function(e) {
			return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
		}
	}), be.each({
		parent: function(e) {
			var t = e.parentNode;
			return t && 11 !== t.nodeType ? t : null
		},
		parents: function(e) {
			return Te(e, "parentNode")
		},
		parentsUntil: function(e, t, i) {
			return Te(e, "parentNode", i)
		},
		next: function(e) {
			return s(e, "nextSibling")
		},
		prev: function(e) {
			return s(e, "previousSibling")
		},
		nextAll: function(e) {
			return Te(e, "nextSibling")
		},
		prevAll: function(e) {
			return Te(e, "previousSibling")
		},
		nextUntil: function(e, t, i) {
			return Te(e, "nextSibling", i)
		},
		prevUntil: function(e, t, i) {
			return Te(e, "previousSibling", i)
		},
		siblings: function(e) {
			return ke((e.parentNode || {}).firstChild, e)
		},
		children: function(e) {
			return ke(e.firstChild)
		},
		contents: function(e) {
			return r(e, "iframe") ? e.contentDocument : (r(e, "template") && (e = e.content || e), be.merge([], e.childNodes))
		}
	}, function(e, t) {
		be.fn[e] = function(i, n) {
			var o = be.map(this, t, i);
			return "Until" !== e.slice(-5) && (n = i), n && "string" == typeof n && (o = be.filter(n, o)), this.length > 1 && (Oe[e] || be.uniqueSort(o), Pe.test(e) && o.reverse()), this.pushStack(o)
		}
	});
	var $e = /[^\x20\t\r\n\f]+/g;
	be.Callbacks = function(e) {
		e = "string" == typeof e ? l(e) : be.extend({}, e);
		var t, i, o, r, a = [],
			s = [],
			c = -1,
			u = function() {
				for (r = r || e.once, o = t = !0; s.length; c = -1)
					for (i = s.shift(); ++c < a.length;) !1 === a[c].apply(i[0], i[1]) && e.stopOnFalse && (c = a.length, i = !1);
				e.memory || (i = !1), t = !1, r && (a = i ? [] : "")
			},
			h = {
				add: function() {
					return a && (i && !t && (c = a.length - 1, s.push(i)), function t(i) {
						be.each(i, function(i, o) {
							ve(o) ? e.unique && h.has(o) || a.push(o) : o && o.length && "string" !== n(o) && t(o)
						})
					}(arguments), i && !t && u()), this
				},
				remove: function() {
					return be.each(arguments, function(e, t) {
						for (var i;
							(i = be.inArray(t, a, i)) > -1;) a.splice(i, 1), i <= c && c--
					}), this
				},
				has: function(e) {
					return e ? be.inArray(e, a) > -1 : a.length > 0
				},
				empty: function() {
					return a && (a = []), this
				},
				disable: function() {
					return r = s = [], a = i = "", this
				},
				disabled: function() {
					return !a
				},
				lock: function() {
					return r = s = [], i || t || (a = i = ""), this
				},
				locked: function() {
					return !!r
				},
				fireWith: function(e, i) {
					return r || (i = [e, (i = i || []).slice ? i.slice() : i], s.push(i), t || u()), this
				},
				fire: function() {
					return h.fireWith(this, arguments), this
				},
				fired: function() {
					return !!o
				}
			};
		return h
	}, be.extend({
		Deferred: function(t) {
			var i = [
					["notify", "progress", be.Callbacks("memory"), be.Callbacks("memory"), 2],
					["resolve", "done", be.Callbacks("once memory"), be.Callbacks("once memory"), 0, "resolved"],
					["reject", "fail", be.Callbacks("once memory"), be.Callbacks("once memory"), 1, "rejected"]
				],
				n = "pending",
				o = {
					state: function() {
						return n
					},
					always: function() {
						return r.done(arguments).fail(arguments), this
					},
					catch: function(e) {
						return o.then(null, e)
					},
					pipe: function() {
						var e = arguments;
						return be.Deferred(function(t) {
							be.each(i, function(i, n) {
								var o = ve(e[n[4]]) && e[n[4]];
								r[n[1]](function() {
									var e = o && o.apply(this, arguments);
									e && ve(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[n[0] + "With"](this, o ? [e] : arguments)
								})
							}), e = null
						}).promise()
					},
					then: function(t, n, o) {
						function r(t, i, n, o) {
							return function() {
								var s = this,
									l = arguments,
									h = function() {
										var e, h;
										if (!(t < a)) {
											if ((e = n.apply(s, l)) === i.promise()) throw new TypeError("Thenable self-resolution");
											h = e && ("object" == typeof e || "function" == typeof e) && e.then, ve(h) ? o ? h.call(e, r(a, i, c, o), r(a, i, u, o)) : (a++, h.call(e, r(a, i, c, o), r(a, i, u, o), r(a, i, c, i.notifyWith))) : (n !== c && (s = void 0, l = [e]), (o || i.resolveWith)(s, l))
										}
									},
									d = o ? h : function() {
										try {
											h()
										}
										catch (e) {
											be.Deferred.exceptionHook && be.Deferred.exceptionHook(e, d.stackTrace), t + 1 >= a && (n !== u && (s = void 0, l = [e]), i.rejectWith(s, l))
										}
									};
								t ? d() : (be.Deferred.getStackHook && (d.stackTrace = be.Deferred.getStackHook()), e.setTimeout(d))
							}
						}
						var a = 0;
						return be.Deferred(function(e) {
							i[0][3].add(r(0, e, ve(o) ? o : c, e.notifyWith)), i[1][3].add(r(0, e, ve(t) ? t : c)), i[2][3].add(r(0, e, ve(n) ? n : u))
						}).promise()
					},
					promise: function(e) {
						return null != e ? be.extend(e, o) : o
					}
				},
				r = {};
			return be.each(i, function(e, t) {
				var a = t[2],
					s = t[5];
				o[t[1]] = a.add, s && a.add(function() {
					n = s
				}, i[3 - e][2].disable, i[3 - e][3].disable, i[0][2].lock, i[0][3].lock), a.add(t[3].fire), r[t[0]] = function() {
					return r[t[0] + "With"](this === r ? void 0 : this, arguments), this
				}, r[t[0] + "With"] = a.fireWith
			}), o.promise(r), t && t.call(r, r), r
		},
		when: function(e) {
			var t = arguments.length,
				i = t,
				n = Array(i),
				o = se.call(arguments),
				r = be.Deferred(),
				a = function(e) {
					return function(i) {
						n[e] = this, o[e] = arguments.length > 1 ? se.call(arguments) : i, --t || r.resolveWith(n, o)
					}
				};
			if (t <= 1 && (h(e, r.done(a(i)).resolve, r.reject, !t), "pending" === r.state() || ve(o[i] && o[i].then))) return r.then();
			for (; i--;) h(o[i], a(i), r.reject);
			return r.promise()
		}
	});
	var Me = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
	be.Deferred.exceptionHook = function(t, i) {
		e.console && e.console.warn && t && Me.test(t.name)
	}, be.readyException = function(t) {
		e.setTimeout(function() {
			throw t
		})
	};
	var De = be.Deferred();
	be.fn.ready = function(e) {
		return De.then(e).catch(function(e) {
			be.readyException(e)
		}), this
	}, be.extend({
		isReady: !1,
		readyWait: 1,
		ready: function(e) {
			(!0 === e ? --be.readyWait : be.isReady) || (be.isReady = !0, !0 !== e && --be.readyWait > 0 || De.resolveWith(re, [be]))
		}
	}), be.ready.then = De.then, "complete" === re.readyState || "loading" !== re.readyState && !re.documentElement.doScroll ? e.setTimeout(be.ready) : (re.addEventListener("DOMContentLoaded", d), e.addEventListener("load", d));
	var ze = function(e, t, i, o, r, a, s) {
			var l = 0,
				c = e.length,
				u = null == i;
			if ("object" === n(i)) {
				r = !0;
				for (l in i) ze(e, t, l, i[l], !0, a, s)
			}
			else if (void 0 !== o && (r = !0, ve(o) || (s = !0), u && (s ? (t.call(e, o), t = null) : (u = t, t = function(e, t, i) {
					return u.call(be(e), i)
				})), t))
				for (; l < c; l++) t(e[l], i, s ? o : o.call(e[l], l, t(e[l], i)));
			return r ? e : u ? t.call(e) : c ? t(e[0], i) : a
		},
		Le = /^-ms-/,
		Ie = /-([a-z])/g,
		Fe = function(e) {
			return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
		};
	m.uid = 1, m.prototype = {
		cache: function(e) {
			var t = e[this.expando];
			return t || (t = {}, Fe(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
				value: t,
				configurable: !0
			}))), t
		},
		set: function(e, t, i) {
			var n, o = this.cache(e);
			if ("string" == typeof t) o[f(t)] = i;
			else
				for (n in t) o[f(n)] = t[n];
			return o
		},
		get: function(e, t) {
			return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][f(t)]
		},
		access: function(e, t, i) {
			return void 0 === t || t && "string" == typeof t && void 0 === i ? this.get(e, t) : (this.set(e, t, i), void 0 !== i ? i : t)
		},
		remove: function(e, t) {
			var i, n = e[this.expando];
			if (void 0 !== n) {
				if (void 0 !== t) {
					i = (t = Array.isArray(t) ? t.map(f) : (t = f(t)) in n ? [t] : t.match($e) || []).length;
					for (; i--;) delete n[t[i]]
				}(void 0 === t || be.isEmptyObject(n)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
			}
		},
		hasData: function(e) {
			var t = e[this.expando];
			return void 0 !== t && !be.isEmptyObject(t)
		}
	};
	var je = new m,
		Re = new m,
		Ne = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		He = /[A-Z]/g;
	be.extend({
		hasData: function(e) {
			return Re.hasData(e) || je.hasData(e)
		},
		data: function(e, t, i) {
			return Re.access(e, t, i)
		},
		removeData: function(e, t) {
			Re.remove(e, t)
		},
		_data: function(e, t, i) {
			return je.access(e, t, i)
		},
		_removeData: function(e, t) {
			je.remove(e, t)
		}
	}), be.fn.extend({
		data: function(e, t) {
			var i, n, o, r = this[0],
				a = r && r.attributes;
			if (void 0 === e) {
				if (this.length && (o = Re.get(r), 1 === r.nodeType && !je.get(r, "hasDataAttrs"))) {
					for (i = a.length; i--;) a[i] && 0 === (n = a[i].name).indexOf("data-") && (n = f(n.slice(5)), v(r, n, o[n]));
					je.set(r, "hasDataAttrs", !0)
				}
				return o
			}
			return "object" == typeof e ? this.each(function() {
				Re.set(this, e)
			}) : ze(this, function(t) {
				var i;
				if (r && void 0 === t) {
					if (void 0 !== (i = Re.get(r, e))) return i;
					if (void 0 !== (i = v(r, e))) return i
				}
				else this.each(function() {
					Re.set(this, e, t)
				})
			}, null, t, arguments.length > 1, null, !0)
		},
		removeData: function(e) {
			return this.each(function() {
				Re.remove(this, e)
			})
		}
	}), be.extend({
		queue: function(e, t, i) {
			var n;
			if (e) return t = (t || "fx") + "queue", n = je.get(e, t), i && (!n || Array.isArray(i) ? n = je.access(e, t, be.makeArray(i)) : n.push(i)), n || []
		},
		dequeue: function(e, t) {
			t = t || "fx";
			var i = be.queue(e, t),
				n = i.length,
				o = i.shift(),
				r = be._queueHooks(e, t);
			"inprogress" === o && (o = i.shift(), n--), o && ("fx" === t && i.unshift("inprogress"), delete r.stop, o.call(e, function() {
				be.dequeue(e, t)
			}, r)), !n && r && r.empty.fire()
		},
		_queueHooks: function(e, t) {
			var i = t + "queueHooks";
			return je.get(e, i) || je.access(e, i, {
				empty: be.Callbacks("once memory").add(function() {
					je.remove(e, [t + "queue", i])
				})
			})
		}
	}), be.fn.extend({
		queue: function(e, t) {
			var i = 2;
			return "string" != typeof e && (t = e, e = "fx", i--), arguments.length < i ? be.queue(this[0], e) : void 0 === t ? this : this.each(function() {
				var i = be.queue(this, e, t);
				be._queueHooks(this, e), "fx" === e && "inprogress" !== i[0] && be.dequeue(this, e)
			})
		},
		dequeue: function(e) {
			return this.each(function() {
				be.dequeue(this, e)
			})
		},
		clearQueue: function(e) {
			return this.queue(e || "fx", [])
		},
		promise: function(e, t) {
			var i, n = 1,
				o = be.Deferred(),
				r = this,
				a = this.length,
				s = function() {
					--n || o.resolveWith(r, [r])
				};
			for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(i = je.get(r[a], e + "queueHooks")) && i.empty && (n++, i.empty.add(s));
			return s(), o.promise(t)
		}
	});
	var qe = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
		Be = new RegExp("^(?:([+-])=|)(" + qe + ")([a-z%]*)$", "i"),
		We = ["Top", "Right", "Bottom", "Left"],
		Ue = function(e, t) {
			return "none" === (e = t || e).style.display || "" === e.style.display && be.contains(e.ownerDocument, e) && "none" === be.css(e, "display")
		},
		Xe = function(e, t, i, n) {
			var o, r, a = {};
			for (r in t) a[r] = e.style[r], e.style[r] = t[r];
			o = i.apply(e, n || []);
			for (r in t) e.style[r] = a[r];
			return o
		},
		Ye = {};
	be.fn.extend({
		show: function() {
			return b(this, !0)
		},
		hide: function() {
			return b(this)
		},
		toggle: function(e) {
			return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
				Ue(this) ? be(this).show() : be(this).hide()
			})
		}
	});
	var Ve = /^(?:checkbox|radio)$/i,
		Qe = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
		Ge = /^$|^module$|\/(?:java|ecma)script/i,
		Ze = {
			option: [1, "<select multiple='multiple'>", "</select>"],
			thead: [1, "<table>", "</table>"],
			col: [2, "<table><colgroup>", "</colgroup></table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
			_default: [0, "", ""]
		};
	Ze.optgroup = Ze.option, Ze.tbody = Ze.tfoot = Ze.colgroup = Ze.caption = Ze.thead, Ze.th = Ze.td;
	var Ke = /<|&#?\w+;/;
	! function() {
		var e = re.createDocumentFragment().appendChild(re.createElement("div")),
			t = re.createElement("input");
		t.setAttribute("type", "radio"), t.setAttribute("checked", "checked"), t.setAttribute("name", "t"), e.appendChild(t), ge.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, e.innerHTML = "<textarea>x</textarea>", ge.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
	}();
	var Je = re.documentElement,
		et = /^key/,
		tt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		it = /^([^.]*)(?:\.(.+)|)/;
	be.event = {
		global: {},
		add: function(e, t, i, n, o) {
			var r, a, s, l, c, u, h, d, p, f, m, g = je.get(e);
			if (g)
				for (i.handler && (i = (r = i).handler, o = r.selector), o && be.find.matchesSelector(Je, o), i.guid || (i.guid = be.guid++), (l = g.events) || (l = g.events = {}), (a = g.handle) || (a = g.handle = function(t) {
						return void 0 !== be && be.event.triggered !== t.type ? be.event.dispatch.apply(e, arguments) : void 0
					}), c = (t = (t || "").match($e) || [""]).length; c--;) p = m = (s = it.exec(t[c]) || [])[1], f = (s[2] || "").split(".").sort(), p && (h = be.event.special[p] || {}, p = (o ? h.delegateType : h.bindType) || p, h = be.event.special[p] || {}, u = be.extend({
					type: p,
					origType: m,
					data: n,
					handler: i,
					guid: i.guid,
					selector: o,
					needsContext: o && be.expr.match.needsContext.test(o),
					namespace: f.join(".")
				}, r), (d = l[p]) || ((d = l[p] = []).delegateCount = 0, h.setup && !1 !== h.setup.call(e, n, f, a) || e.addEventListener && e.addEventListener(p, a)), h.add && (h.add.call(e, u), u.handler.guid || (u.handler.guid = i.guid)), o ? d.splice(d.delegateCount++, 0, u) : d.push(u), be.event.global[p] = !0)
		},
		remove: function(e, t, i, n, o) {
			var r, a, s, l, c, u, h, d, p, f, m, g = je.hasData(e) && je.get(e);
			if (g && (l = g.events)) {
				for (c = (t = (t || "").match($e) || [""]).length; c--;)
					if (s = it.exec(t[c]) || [], p = m = s[1], f = (s[2] || "").split(".").sort(), p) {
						for (h = be.event.special[p] || {}, d = l[p = (n ? h.delegateType : h.bindType) || p] || [], s = s[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = r = d.length; r--;) u = d[r], !o && m !== u.origType || i && i.guid !== u.guid || s && !s.test(u.namespace) || n && n !== u.selector && ("**" !== n || !u.selector) || (d.splice(r, 1), u.selector && d.delegateCount--, h.remove && h.remove.call(e, u));
						a && !d.length && (h.teardown && !1 !== h.teardown.call(e, f, g.handle) || be.removeEvent(e, p, g.handle), delete l[p])
					}
				else
					for (p in l) be.event.remove(e, p + t[c], i, n, !0);
				be.isEmptyObject(l) && je.remove(e, "handle events")
			}
		},
		dispatch: function(e) {
			var t, i, n, o, r, a, s = be.event.fix(e),
				l = new Array(arguments.length),
				c = (je.get(this, "events") || {})[s.type] || [],
				u = be.event.special[s.type] || {};
			for (l[0] = s, t = 1; t < arguments.length; t++) l[t] = arguments[t];
			if (s.delegateTarget = this, !u.preDispatch || !1 !== u.preDispatch.call(this, s)) {
				for (a = be.event.handlers.call(this, s, c), t = 0;
					(o = a[t++]) && !s.isPropagationStopped();)
					for (s.currentTarget = o.elem, i = 0;
						(r = o.handlers[i++]) && !s.isImmediatePropagationStopped();) s.rnamespace && !s.rnamespace.test(r.namespace) || (s.handleObj = r, s.data = r.data, void 0 !== (n = ((be.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l)) && !1 === (s.result = n) && (s.preventDefault(), s.stopPropagation()));
				return u.postDispatch && u.postDispatch.call(this, s), s.result
			}
		},
		handlers: function(e, t) {
			var i, n, o, r, a, s = [],
				l = t.delegateCount,
				c = e.target;
			if (l && c.nodeType && !("click" === e.type && e.button >= 1))
				for (; c !== this; c = c.parentNode || this)
					if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
						for (r = [], a = {}, i = 0; i < l; i++) void 0 === a[o = (n = t[i]).selector + " "] && (a[o] = n.needsContext ? be(o, this).index(c) > -1 : be.find(o, this, null, [c]).length), a[o] && r.push(n);
						r.length && s.push({
							elem: c,
							handlers: r
						})
					}
			return c = this, l < t.length && s.push({
				elem: c,
				handlers: t.slice(l)
			}), s
		},
		addProp: function(e, t) {
			Object.defineProperty(be.Event.prototype, e, {
				enumerable: !0,
				configurable: !0,
				get: ve(t) ? function() {
					if (this.originalEvent) return t(this.originalEvent)
				} : function() {
					if (this.originalEvent) return this.originalEvent[e]
				},
				set: function(t) {
					Object.defineProperty(this, e, {
						enumerable: !0,
						configurable: !0,
						writable: !0,
						value: t
					})
				}
			})
		},
		fix: function(e) {
			return e[be.expando] ? e : new be.Event(e)
		},
		special: {
			load: {
				noBubble: !0
			},
			focus: {
				trigger: function() {
					if (this !== S() && this.focus) return this.focus(), !1
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if (this === S() && this.blur) return this.blur(), !1
				},
				delegateType: "focusout"
			},
			click: {
				trigger: function() {
					if ("checkbox" === this.type && this.click && r(this, "input")) return this.click(), !1
				},
				_default: function(e) {
					return r(e.target, "a")
				}
			},
			beforeunload: {
				postDispatch: function(e) {
					void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
				}
			}
		}
	}, be.removeEvent = function(e, t, i) {
		e.removeEventListener && e.removeEventListener(t, i)
	}, be.Event = function(e, t) {
		if (!(this instanceof be.Event)) return new be.Event(e, t);
		e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? k : C, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && be.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[be.expando] = !0
	}, be.Event.prototype = {
		constructor: be.Event,
		isDefaultPrevented: C,
		isPropagationStopped: C,
		isImmediatePropagationStopped: C,
		isSimulated: !1,
		preventDefault: function() {
			var e = this.originalEvent;
			this.isDefaultPrevented = k, e && !this.isSimulated && e.preventDefault()
		},
		stopPropagation: function() {
			var e = this.originalEvent;
			this.isPropagationStopped = k, e && !this.isSimulated && e.stopPropagation()
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
			this.isImmediatePropagationStopped = k, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
		}
	}, be.each({
		altKey: !0,
		bubbles: !0,
		cancelable: !0,
		changedTouches: !0,
		ctrlKey: !0,
		detail: !0,
		eventPhase: !0,
		metaKey: !0,
		pageX: !0,
		pageY: !0,
		shiftKey: !0,
		view: !0,
		char: !0,
		charCode: !0,
		key: !0,
		keyCode: !0,
		button: !0,
		buttons: !0,
		clientX: !0,
		clientY: !0,
		offsetX: !0,
		offsetY: !0,
		pointerId: !0,
		pointerType: !0,
		screenX: !0,
		screenY: !0,
		targetTouches: !0,
		toElement: !0,
		touches: !0,
		which: function(e) {
			var t = e.button;
			return null == e.which && et.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && tt.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
		}
	}, be.event.addProp), be.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function(e, t) {
		be.event.special[e] = {
			delegateType: t,
			bindType: t,
			handle: function(e) {
				var i, n = this,
					o = e.relatedTarget,
					r = e.handleObj;
				return o && (o === n || be.contains(n, o)) || (e.type = r.origType, i = r.handler.apply(this, arguments), e.type = t), i
			}
		}
	}), be.fn.extend({
		on: function(e, t, i, n) {
			return A(this, e, t, i, n)
		},
		one: function(e, t, i, n) {
			return A(this, e, t, i, n, 1)
		},
		off: function(e, t, i) {
			var n, o;
			if (e && e.preventDefault && e.handleObj) return n = e.handleObj, be(e.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler), this;
			if ("object" == typeof e) {
				for (o in e) this.off(o, t, e[o]);
				return this
			}
			return !1 !== t && "function" != typeof t || (i = t, t = void 0), !1 === i && (i = C), this.each(function() {
				be.event.remove(this, e, i, t)
			})
		}
	});
	var nt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
		ot = /<script|<style|<link/i,
		rt = /checked\s*(?:[^=]|=\s*.checked.)/i,
		at = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	be.extend({
		htmlPrefilter: function(e) {
			return e.replace(nt, "<$1></$2>")
		},
		clone: function(e, t, i) {
			var n, o, r, a, s = e.cloneNode(!0),
				l = be.contains(e.ownerDocument, e);
			if (!(ge.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || be.isXMLDoc(e)))
				for (a = w(s), n = 0, o = (r = w(e)).length; n < o; n++) M(r[n], a[n]);
			if (t)
				if (i)
					for (r = r || w(e), a = a || w(s), n = 0, o = r.length; n < o; n++) $(r[n], a[n]);
				else $(e, s);
			return (a = w(s, "script")).length > 0 && x(a, !l && w(e, "script")), s
		},
		cleanData: function(e) {
			for (var t, i, n, o = be.event.special, r = 0; void 0 !== (i = e[r]); r++)
				if (Fe(i)) {
					if (t = i[je.expando]) {
						if (t.events)
							for (n in t.events) o[n] ? be.event.remove(i, n) : be.removeEvent(i, n, t.handle);
						i[je.expando] = void 0
					}
					i[Re.expando] && (i[Re.expando] = void 0)
				}
		}
	}), be.fn.extend({
		detach: function(e) {
			return z(this, e, !0)
		},
		remove: function(e) {
			return z(this, e)
		},
		text: function(e) {
			return ze(this, function(e) {
				return void 0 === e ? be.text(this) : this.empty().each(function() {
					1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
				})
			}, null, e, arguments.length)
		},
		append: function() {
			return D(this, arguments, function(e) {
				1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || E(this, e).appendChild(e)
			})
		},
		prepend: function() {
			return D(this, arguments, function(e) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var t = E(this, e);
					t.insertBefore(e, t.firstChild)
				}
			})
		},
		before: function() {
			return D(this, arguments, function(e) {
				this.parentNode && this.parentNode.insertBefore(e, this)
			})
		},
		after: function() {
			return D(this, arguments, function(e) {
				this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
			})
		},
		empty: function() {
			for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (be.cleanData(w(e, !1)), e.textContent = "");
			return this
		},
		clone: function(e, t) {
			return e = null != e && e, t = null == t ? e : t, this.map(function() {
				return be.clone(this, e, t)
			})
		},
		html: function(e) {
			return ze(this, function(e) {
				var t = this[0] || {},
					i = 0,
					n = this.length;
				if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
				if ("string" == typeof e && !ot.test(e) && !Ze[(Qe.exec(e) || ["", ""])[1].toLowerCase()]) {
					e = be.htmlPrefilter(e);
					try {
						for (; i < n; i++) 1 === (t = this[i] || {}).nodeType && (be.cleanData(w(t, !1)), t.innerHTML = e);
						t = 0
					}
					catch (e) {}
				}
				t && this.empty().append(e)
			}, null, e, arguments.length)
		},
		replaceWith: function() {
			var e = [];
			return D(this, arguments, function(t) {
				var i = this.parentNode;
				be.inArray(this, e) < 0 && (be.cleanData(w(this)), i && i.replaceChild(t, this))
			}, e)
		}
	}), be.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function(e, t) {
		be.fn[e] = function(e) {
			for (var i, n = [], o = be(e), r = o.length - 1, a = 0; a <= r; a++) i = a === r ? this : this.clone(!0), be(o[a])[t](i), ce.apply(n, i.get());
			return this.pushStack(n)
		}
	});
	var st = new RegExp("^(" + qe + ")(?!px)[a-z%]+$", "i"),
		lt = function(t) {
			var i = t.ownerDocument.defaultView;
			return i && i.opener || (i = e), i.getComputedStyle(t)
		},
		ct = new RegExp(We.join("|"), "i");
	! function() {
		function t() {
			if (c) {
				l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", c.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", Je.appendChild(l).appendChild(c);
				var t = e.getComputedStyle(c);
				n = "1%" !== t.top, s = 12 === i(t.marginLeft), c.style.right = "60%", a = 36 === i(t.right), o = 36 === i(t.width), c.style.position = "absolute", r = 36 === c.offsetWidth || "absolute", Je.removeChild(l), c = null
			}
		}

		function i(e) {
			return Math.round(parseFloat(e))
		}
		var n, o, r, a, s, l = re.createElement("div"),
			c = re.createElement("div");
		c.style && (c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", ge.clearCloneStyle = "content-box" === c.style.backgroundClip, be.extend(ge, {
			boxSizingReliable: function() {
				return t(), o
			},
			pixelBoxStyles: function() {
				return t(), a
			},
			pixelPosition: function() {
				return t(), n
			},
			reliableMarginLeft: function() {
				return t(), s
			},
			scrollboxSize: function() {
				return t(), r
			}
		}))
	}();
	var ut = /^(none|table(?!-c[ea]).+)/,
		ht = /^--/,
		dt = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		pt = {
			letterSpacing: "0",
			fontWeight: "400"
		},
		ft = ["Webkit", "Moz", "ms"],
		mt = re.createElement("div").style;
	be.extend({
		cssHooks: {
			opacity: {
				get: function(e, t) {
					if (t) {
						var i = L(e, "opacity");
						return "" === i ? "1" : i
					}
				}
			}
		},
		cssNumber: {
			animationIterationCount: !0,
			columnCount: !0,
			fillOpacity: !0,
			flexGrow: !0,
			flexShrink: !0,
			fontWeight: !0,
			lineHeight: !0,
			opacity: !0,
			order: !0,
			orphans: !0,
			widows: !0,
			zIndex: !0,
			zoom: !0
		},
		cssProps: {},
		style: function(e, t, i, n) {
			if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
				var o, r, a, s = f(t),
					l = ht.test(t),
					c = e.style;
				if (l || (t = j(s)), a = be.cssHooks[t] || be.cssHooks[s], void 0 === i) return a && "get" in a && void 0 !== (o = a.get(e, !1, n)) ? o : c[t];
				"string" == (r = typeof i) && (o = Be.exec(i)) && o[1] && (i = y(e, t, o), r = "number"), null != i && i === i && ("number" === r && (i += o && o[3] || (be.cssNumber[s] ? "" : "px")), ge.clearCloneStyle || "" !== i || 0 !== t.indexOf("background") || (c[t] = "inherit"), a && "set" in a && void 0 === (i = a.set(e, i, n)) || (l ? c.setProperty(t, i) : c[t] = i))
			}
		},
		css: function(e, t, i, n) {
			var o, r, a, s = f(t);
			return ht.test(t) || (t = j(s)), (a = be.cssHooks[t] || be.cssHooks[s]) && "get" in a && (o = a.get(e, !0, i)), void 0 === o && (o = L(e, t, n)), "normal" === o && t in pt && (o = pt[t]), "" === i || i ? (r = parseFloat(o), !0 === i || isFinite(r) ? r || 0 : o) : o
		}
	}), be.each(["height", "width"], function(e, t) {
		be.cssHooks[t] = {
			get: function(e, i, n) {
				if (i) return !ut.test(be.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? H(e, t, n) : Xe(e, dt, function() {
					return H(e, t, n)
				})
			},
			set: function(e, i, n) {
				var o, r = lt(e),
					a = "border-box" === be.css(e, "boxSizing", !1, r),
					s = n && N(e, t, n, a, r);
				return a && ge.scrollboxSize() === r.position && (s -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(r[t]) - N(e, t, "border", !1, r) - .5)), s && (o = Be.exec(i)) && "px" !== (o[3] || "px") && (e.style[t] = i, i = be.css(e, t)), R(0, i, s)
			}
		}
	}), be.cssHooks.marginLeft = I(ge.reliableMarginLeft, function(e, t) {
		if (t) return (parseFloat(L(e, "marginLeft")) || e.getBoundingClientRect().left - Xe(e, {
			marginLeft: 0
		}, function() {
			return e.getBoundingClientRect().left
		})) + "px"
	}), be.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function(e, t) {
		be.cssHooks[e + t] = {
			expand: function(i) {
				for (var n = 0, o = {}, r = "string" == typeof i ? i.split(" ") : [i]; n < 4; n++) o[e + We[n] + t] = r[n] || r[n - 2] || r[0];
				return o
			}
		}, "margin" !== e && (be.cssHooks[e + t].set = R)
	}), be.fn.extend({
		css: function(e, t) {
			return ze(this, function(e, t, i) {
				var n, o, r = {},
					a = 0;
				if (Array.isArray(t)) {
					for (n = lt(e), o = t.length; a < o; a++) r[t[a]] = be.css(e, t[a], !1, n);
					return r
				}
				return void 0 !== i ? be.style(e, t, i) : be.css(e, t)
			}, e, t, arguments.length > 1)
		}
	}), be.Tween = q, q.prototype = {
		constructor: q,
		init: function(e, t, i, n, o, r) {
			this.elem = e, this.prop = i, this.easing = o || be.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = n, this.unit = r || (be.cssNumber[i] ? "" : "px")
		},
		cur: function() {
			var e = q.propHooks[this.prop];
			return e && e.get ? e.get(this) : q.propHooks._default.get(this)
		},
		run: function(e) {
			var t, i = q.propHooks[this.prop];
			return this.options.duration ? this.pos = t = be.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), i && i.set ? i.set(this) : q.propHooks._default.set(this), this
		}
	}, q.prototype.init.prototype = q.prototype, q.propHooks = {
		_default: {
			get: function(e) {
				var t;
				return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = be.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
			},
			set: function(e) {
				be.fx.step[e.prop] ? be.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[be.cssProps[e.prop]] && !be.cssHooks[e.prop] ? e.elem[e.prop] = e.now : be.style(e.elem, e.prop, e.now + e.unit)
			}
		}
	}, q.propHooks.scrollTop = q.propHooks.scrollLeft = {
		set: function(e) {
			e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
		}
	}, be.easing = {
		linear: function(e) {
			return e
		},
		swing: function(e) {
			return .5 - Math.cos(e * Math.PI) / 2
		},
		_default: "swing"
	}, be.fx = q.prototype.init, be.fx.step = {};
	var gt, vt, yt = /^(?:toggle|show|hide)$/,
		_t = /queueHooks$/;
	be.Animation = be.extend(V, {
			tweeners: {
				"*": [function(e, t) {
					var i = this.createTween(e, t);
					return y(i.elem, e, Be.exec(t), i), i
				}]
			},
			tweener: function(e, t) {
				ve(e) ? (t = e, e = ["*"]) : e = e.match($e);
				for (var i, n = 0, o = e.length; n < o; n++) i = e[n], V.tweeners[i] = V.tweeners[i] || [], V.tweeners[i].unshift(t)
			},
			prefilters: [function(e, t, i) {
				var n, o, r, a, s, l, c, u, h = "width" in t || "height" in t,
					d = this,
					p = {},
					f = e.style,
					m = e.nodeType && Ue(e),
					g = je.get(e, "fxshow");
				i.queue || (null == (a = be._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function() {
					a.unqueued || s()
				}), a.unqueued++, d.always(function() {
					d.always(function() {
						a.unqueued--, be.queue(e, "fx").length || a.empty.fire()
					})
				}));
				for (n in t)
					if (o = t[n], yt.test(o)) {
						if (delete t[n], r = r || "toggle" === o, o === (m ? "hide" : "show")) {
							if ("show" !== o || !g || void 0 === g[n]) continue;
							m = !0
						}
						p[n] = g && g[n] || be.style(e, n)
					}
				if ((l = !be.isEmptyObject(t)) || !be.isEmptyObject(p)) {
					h && 1 === e.nodeType && (i.overflow = [f.overflow, f.overflowX, f.overflowY], null == (c = g && g.display) && (c = je.get(e, "display")), "none" === (u = be.css(e, "display")) && (c ? u = c : (b([e], !0), c = e.style.display || c, u = be.css(e, "display"), b([e]))), ("inline" === u || "inline-block" === u && null != c) && "none" === be.css(e, "float") && (l || (d.done(function() {
						f.display = c
					}), null == c && (u = f.display, c = "none" === u ? "" : u)), f.display = "inline-block")), i.overflow && (f.overflow = "hidden", d.always(function() {
						f.overflow = i.overflow[0], f.overflowX = i.overflow[1], f.overflowY = i.overflow[2]
					})), l = !1;
					for (n in p) l || (g ? "hidden" in g && (m = g.hidden) : g = je.access(e, "fxshow", {
						display: c
					}), r && (g.hidden = !m), m && b([e], !0), d.done(function() {
						m || b([e]), je.remove(e, "fxshow");
						for (n in p) be.style(e, n, p[n])
					})), l = X(m ? g[n] : 0, n, d), n in g || (g[n] = l.start, m && (l.end = l.start, l.start = 0))
				}
			}],
			prefilter: function(e, t) {
				t ? V.prefilters.unshift(e) : V.prefilters.push(e)
			}
		}), be.speed = function(e, t, i) {
			var n = e && "object" == typeof e ? be.extend({}, e) : {
				complete: i || !i && t || ve(e) && e,
				duration: e,
				easing: i && t || t && !ve(t) && t
			};
			return be.fx.off ? n.duration = 0 : "number" != typeof n.duration && (n.duration in be.fx.speeds ? n.duration = be.fx.speeds[n.duration] : n.duration = be.fx.speeds._default), null != n.queue && !0 !== n.queue || (n.queue = "fx"), n.old = n.complete, n.complete = function() {
				ve(n.old) && n.old.call(this), n.queue && be.dequeue(this, n.queue)
			}, n
		}, be.fn.extend({
			fadeTo: function(e, t, i, n) {
				return this.filter(Ue).css("opacity", 0).show().end().animate({
					opacity: t
				}, e, i, n)
			},
			animate: function(e, t, i, n) {
				var o = be.isEmptyObject(e),
					r = be.speed(t, i, n),
					a = function() {
						var t = V(this, be.extend({}, e), r);
						(o || je.get(this, "finish")) && t.stop(!0)
					};
				return a.finish = a, o || !1 === r.queue ? this.each(a) : this.queue(r.queue, a)
			},
			stop: function(e, t, i) {
				var n = function(e) {
					var t = e.stop;
					delete e.stop, t(i)
				};
				return "string" != typeof e && (i = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each(function() {
					var t = !0,
						o = null != e && e + "queueHooks",
						r = be.timers,
						a = je.get(this);
					if (o) a[o] && a[o].stop && n(a[o]);
					else
						for (o in a) a[o] && a[o].stop && _t.test(o) && n(a[o]);
					for (o = r.length; o--;) r[o].elem !== this || null != e && r[o].queue !== e || (r[o].anim.stop(i), t = !1, r.splice(o, 1));
					!t && i || be.dequeue(this, e)
				})
			},
			finish: function(e) {
				return !1 !== e && (e = e || "fx"), this.each(function() {
					var t, i = je.get(this),
						n = i[e + "queue"],
						o = i[e + "queueHooks"],
						r = be.timers,
						a = n ? n.length : 0;
					for (i.finish = !0, be.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = r.length; t--;) r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0), r.splice(t, 1));
					for (t = 0; t < a; t++) n[t] && n[t].finish && n[t].finish.call(this);
					delete i.finish
				})
			}
		}), be.each(["toggle", "show", "hide"], function(e, t) {
			var i = be.fn[t];
			be.fn[t] = function(e, n, o) {
				return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(U(t, !0), e, n, o)
			}
		}), be.each({
			slideDown: U("show"),
			slideUp: U("hide"),
			slideToggle: U("toggle"),
			fadeIn: {
				opacity: "show"
			},
			fadeOut: {
				opacity: "hide"
			},
			fadeToggle: {
				opacity: "toggle"
			}
		}, function(e, t) {
			be.fn[e] = function(e, i, n) {
				return this.animate(t, e, i, n)
			}
		}), be.timers = [], be.fx.tick = function() {
			var e, t = 0,
				i = be.timers;
			for (gt = Date.now(); t < i.length; t++)(e = i[t])() || i[t] !== e || i.splice(t--, 1);
			i.length || be.fx.stop(), gt = void 0
		}, be.fx.timer = function(e) {
			be.timers.push(e), be.fx.start()
		}, be.fx.interval = 13, be.fx.start = function() {
			vt || (vt = !0, B())
		}, be.fx.stop = function() {
			vt = null
		}, be.fx.speeds = {
			slow: 600,
			fast: 200,
			_default: 400
		}, be.fn.delay = function(t, i) {
			return t = be.fx ? be.fx.speeds[t] || t : t, i = i || "fx", this.queue(i, function(i, n) {
				var o = e.setTimeout(i, t);
				n.stop = function() {
					e.clearTimeout(o)
				}
			})
		},
		function() {
			var e = re.createElement("input"),
				t = re.createElement("select").appendChild(re.createElement("option"));
			e.type = "checkbox", ge.checkOn = "" !== e.value, ge.optSelected = t.selected, (e = re.createElement("input")).value = "t", e.type = "radio", ge.radioValue = "t" === e.value
		}();
	var bt, wt = be.expr.attrHandle;
	be.fn.extend({
		attr: function(e, t) {
			return ze(this, be.attr, e, t, arguments.length > 1)
		},
		removeAttr: function(e) {
			return this.each(function() {
				be.removeAttr(this, e)
			})
		}
	}), be.extend({
		attr: function(e, t, i) {
			var n, o, r = e.nodeType;
			if (3 !== r && 8 !== r && 2 !== r) return void 0 === e.getAttribute ? be.prop(e, t, i) : (1 === r && be.isXMLDoc(e) || (o = be.attrHooks[t.toLowerCase()] || (be.expr.match.bool.test(t) ? bt : void 0)), void 0 !== i ? null === i ? void be.removeAttr(e, t) : o && "set" in o && void 0 !== (n = o.set(e, i, t)) ? n : (e.setAttribute(t, i + ""), i) : o && "get" in o && null !== (n = o.get(e, t)) ? n : null == (n = be.find.attr(e, t)) ? void 0 : n)
		},
		attrHooks: {
			type: {
				set: function(e, t) {
					if (!ge.radioValue && "radio" === t && r(e, "input")) {
						var i = e.value;
						return e.setAttribute("type", t), i && (e.value = i), t
					}
				}
			}
		},
		removeAttr: function(e, t) {
			var i, n = 0,
				o = t && t.match($e);
			if (o && 1 === e.nodeType)
				for (; i = o[n++];) e.removeAttribute(i)
		}
	}), bt = {
		set: function(e, t, i) {
			return !1 === t ? be.removeAttr(e, i) : e.setAttribute(i, i), i
		}
	}, be.each(be.expr.match.bool.source.match(/\w+/g), function(e, t) {
		var i = wt[t] || be.find.attr;
		wt[t] = function(e, t, n) {
			var o, r, a = t.toLowerCase();
			return n || (r = wt[a], wt[a] = o, o = null != i(e, t, n) ? a : null, wt[a] = r), o
		}
	});
	var xt = /^(?:input|select|textarea|button)$/i,
		Tt = /^(?:a|area)$/i;
	be.fn.extend({
		prop: function(e, t) {
			return ze(this, be.prop, e, t, arguments.length > 1)
		},
		removeProp: function(e) {
			return this.each(function() {
				delete this[be.propFix[e] || e]
			})
		}
	}), be.extend({
		prop: function(e, t, i) {
			var n, o, r = e.nodeType;
			if (3 !== r && 8 !== r && 2 !== r) return 1 === r && be.isXMLDoc(e) || (t = be.propFix[t] || t, o = be.propHooks[t]), void 0 !== i ? o && "set" in o && void 0 !== (n = o.set(e, i, t)) ? n : e[t] = i : o && "get" in o && null !== (n = o.get(e, t)) ? n : e[t]
		},
		propHooks: {
			tabIndex: {
				get: function(e) {
					var t = be.find.attr(e, "tabindex");
					return t ? parseInt(t, 10) : xt.test(e.nodeName) || Tt.test(e.nodeName) && e.href ? 0 : -1
				}
			}
		},
		propFix: {
			for: "htmlFor",
			class: "className"
		}
	}), ge.optSelected || (be.propHooks.selected = {
		get: function(e) {
			var t = e.parentNode;
			return t && t.parentNode && t.parentNode.selectedIndex, null
		},
		set: function(e) {
			var t = e.parentNode;
			t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
		}
	}), be.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
		be.propFix[this.toLowerCase()] = this
	}), be.fn.extend({
		addClass: function(e) {
			var t, i, n, o, r, a, s, l = 0;
			if (ve(e)) return this.each(function(t) {
				be(this).addClass(e.call(this, t, G(this)))
			});
			if ((t = Z(e)).length)
				for (; i = this[l++];)
					if (o = G(i), n = 1 === i.nodeType && " " + Q(o) + " ") {
						for (a = 0; r = t[a++];) n.indexOf(" " + r + " ") < 0 && (n += r + " ");
						o !== (s = Q(n)) && i.setAttribute("class", s)
					}
			return this
		},
		removeClass: function(e) {
			var t, i, n, o, r, a, s, l = 0;
			if (ve(e)) return this.each(function(t) {
				be(this).removeClass(e.call(this, t, G(this)))
			});
			if (!arguments.length) return this.attr("class", "");
			if ((t = Z(e)).length)
				for (; i = this[l++];)
					if (o = G(i), n = 1 === i.nodeType && " " + Q(o) + " ") {
						for (a = 0; r = t[a++];)
							for (; n.indexOf(" " + r + " ") > -1;) n = n.replace(" " + r + " ", " ");
						o !== (s = Q(n)) && i.setAttribute("class", s)
					}
			return this
		},
		toggleClass: function(e, t) {
			var i = typeof e,
				n = "string" === i || Array.isArray(e);
			return "boolean" == typeof t && n ? t ? this.addClass(e) : this.removeClass(e) : ve(e) ? this.each(function(i) {
				be(this).toggleClass(e.call(this, i, G(this), t), t)
			}) : this.each(function() {
				var t, o, r, a;
				if (n)
					for (o = 0, r = be(this), a = Z(e); t = a[o++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
				else void 0 !== e && "boolean" !== i || ((t = G(this)) && je.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : je.get(this, "__className__") || ""))
			})
		},
		hasClass: function(e) {
			var t, i, n = 0;
			for (t = " " + e + " "; i = this[n++];)
				if (1 === i.nodeType && (" " + Q(G(i)) + " ").indexOf(t) > -1) return !0;
			return !1
		}
	});
	var kt = /\r/g;
	be.fn.extend({
		val: function(e) {
			var t, i, n, o = this[0];
			return arguments.length ? (n = ve(e), this.each(function(i) {
				var o;
				1 === this.nodeType && (null == (o = n ? e.call(this, i, be(this).val()) : e) ? o = "" : "number" == typeof o ? o += "" : Array.isArray(o) && (o = be.map(o, function(e) {
					return null == e ? "" : e + ""
				})), (t = be.valHooks[this.type] || be.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
			})) : o ? (t = be.valHooks[o.type] || be.valHooks[o.nodeName.toLowerCase()]) && "get" in t && void 0 !== (i = t.get(o, "value")) ? i : "string" == typeof(i = o.value) ? i.replace(kt, "") : null == i ? "" : i : void 0
		}
	}), be.extend({
		valHooks: {
			option: {
				get: function(e) {
					var t = be.find.attr(e, "value");
					return null != t ? t : Q(be.text(e))
				}
			},
			select: {
				get: function(e) {
					var t, i, n, o = e.options,
						a = e.selectedIndex,
						s = "select-one" === e.type,
						l = s ? null : [],
						c = s ? a + 1 : o.length;
					for (n = a < 0 ? c : s ? a : 0; n < c; n++)
						if (((i = o[n]).selected || n === a) && !i.disabled && (!i.parentNode.disabled || !r(i.parentNode, "optgroup"))) {
							if (t = be(i).val(), s) return t;
							l.push(t)
						}
					return l
				},
				set: function(e, t) {
					for (var i, n, o = e.options, r = be.makeArray(t), a = o.length; a--;)((n = o[a]).selected = be.inArray(be.valHooks.option.get(n), r) > -1) && (i = !0);
					return i || (e.selectedIndex = -1), r
				}
			}
		}
	}), be.each(["radio", "checkbox"], function() {
		be.valHooks[this] = {
			set: function(e, t) {
				if (Array.isArray(t)) return e.checked = be.inArray(be(e).val(), t) > -1
			}
		}, ge.checkOn || (be.valHooks[this].get = function(e) {
			return null === e.getAttribute("value") ? "on" : e.value
		})
	}), ge.focusin = "onfocusin" in e;
	var Ct = /^(?:focusinfocus|focusoutblur)$/,
		St = function(e) {
			e.stopPropagation()
		};
	be.extend(be.event, {
		trigger: function(t, i, n, o) {
			var r, a, s, l, c, u, h, d, p = [n || re],
				f = pe.call(t, "type") ? t.type : t,
				m = pe.call(t, "namespace") ? t.namespace.split(".") : [];
			if (a = d = s = n = n || re, 3 !== n.nodeType && 8 !== n.nodeType && !Ct.test(f + be.event.triggered) && (f.indexOf(".") > -1 && (f = (m = f.split(".")).shift(), m.sort()), c = f.indexOf(":") < 0 && "on" + f, t = t[be.expando] ? t : new be.Event(f, "object" == typeof t && t), t.isTrigger = o ? 2 : 3, t.namespace = m.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = n), i = null == i ? [t] : be.makeArray(i, [t]), h = be.event.special[f] || {}, o || !h.trigger || !1 !== h.trigger.apply(n, i))) {
				if (!o && !h.noBubble && !ye(n)) {
					for (l = h.delegateType || f, Ct.test(l + f) || (a = a.parentNode); a; a = a.parentNode) p.push(a), s = a;
					s === (n.ownerDocument || re) && p.push(s.defaultView || s.parentWindow || e)
				}
				for (r = 0;
					(a = p[r++]) && !t.isPropagationStopped();) d = a, t.type = r > 1 ? l : h.bindType || f, (u = (je.get(a, "events") || {})[t.type] && je.get(a, "handle")) && u.apply(a, i), (u = c && a[c]) && u.apply && Fe(a) && (t.result = u.apply(a, i), !1 === t.result && t.preventDefault());
				return t.type = f, o || t.isDefaultPrevented() || h._default && !1 !== h._default.apply(p.pop(), i) || !Fe(n) || c && ve(n[f]) && !ye(n) && ((s = n[c]) && (n[c] = null), be.event.triggered = f, t.isPropagationStopped() && d.addEventListener(f, St), n[f](), t.isPropagationStopped() && d.removeEventListener(f, St), be.event.triggered = void 0, s && (n[c] = s)), t.result
			}
		},
		simulate: function(e, t, i) {
			var n = be.extend(new be.Event, i, {
				type: e,
				isSimulated: !0
			});
			be.event.trigger(n, null, t)
		}
	}), be.fn.extend({
		trigger: function(e, t) {
			return this.each(function() {
				be.event.trigger(e, t, this)
			})
		},
		triggerHandler: function(e, t) {
			var i = this[0];
			if (i) return be.event.trigger(e, t, i, !0)
		}
	}), ge.focusin || be.each({
		focus: "focusin",
		blur: "focusout"
	}, function(e, t) {
		var i = function(e) {
			be.event.simulate(t, e.target, be.event.fix(e))
		};
		be.event.special[t] = {
			setup: function() {
				var n = this.ownerDocument || this,
					o = je.access(n, t);
				o || n.addEventListener(e, i, !0), je.access(n, t, (o || 0) + 1)
			},
			teardown: function() {
				var n = this.ownerDocument || this,
					o = je.access(n, t) - 1;
				o ? je.access(n, t, o) : (n.removeEventListener(e, i, !0), je.remove(n, t))
			}
		}
	});
	var At = e.location,
		Et = Date.now(),
		Pt = /\?/;
	be.parseXML = function(t) {
		var i;
		if (!t || "string" != typeof t) return null;
		try {
			i = (new e.DOMParser).parseFromString(t, "text/xml")
		}
		catch (e) {
			i = void 0
		}
		return i && !i.getElementsByTagName("parsererror").length || be.error("Invalid XML: " + t), i
	};
	var Ot = /\[\]$/,
		$t = /\r?\n/g,
		Mt = /^(?:submit|button|image|reset|file)$/i,
		Dt = /^(?:input|select|textarea|keygen)/i;
	be.param = function(e, t) {
		var i, n = [],
			o = function(e, t) {
				var i = ve(t) ? t() : t;
				n[n.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == i ? "" : i)
			};
		if (Array.isArray(e) || e.jquery && !be.isPlainObject(e)) be.each(e, function() {
			o(this.name, this.value)
		});
		else
			for (i in e) K(i, e[i], t, o);
		return n.join("&")
	}, be.fn.extend({
		serialize: function() {
			return be.param(this.serializeArray())
		},
		serializeArray: function() {
			return this.map(function() {
				var e = be.prop(this, "elements");
				return e ? be.makeArray(e) : this
			}).filter(function() {
				var e = this.type;
				return this.name && !be(this).is(":disabled") && Dt.test(this.nodeName) && !Mt.test(e) && (this.checked || !Ve.test(e))
			}).map(function(e, t) {
				var i = be(this).val();
				return null == i ? null : Array.isArray(i) ? be.map(i, function(e) {
					return {
						name: t.name,
						value: e.replace($t, "\r\n")
					}
				}) : {
					name: t.name,
					value: i.replace($t, "\r\n")
				}
			}).get()
		}
	});
	var zt = /%20/g,
		Lt = /#.*$/,
		It = /([?&])_=[^&]*/,
		Ft = /^(.*?):[ \t]*([^\r\n]*)$/gm,
		jt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		Rt = /^(?:GET|HEAD)$/,
		Nt = /^\/\//,
		Ht = {},
		qt = {},
		Bt = "*/".concat("*"),
		Wt = re.createElement("a");
	Wt.href = At.href, be.extend({
		active: 0,
		lastModified: {},
		etag: {},
		ajaxSettings: {
			url: At.href,
			type: "GET",
			isLocal: jt.test(At.protocol),
			global: !0,
			processData: !0,
			async: !0,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			accepts: {
				"*": Bt,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
			converters: {
				"* text": String,
				"text html": !0,
				"text json": JSON.parse,
				"text xml": be.parseXML
			},
			flatOptions: {
				url: !0,
				context: !0
			}
		},
		ajaxSetup: function(e, t) {
			return t ? te(te(e, be.ajaxSettings), t) : te(be.ajaxSettings, e)
		},
		ajaxPrefilter: J(Ht),
		ajaxTransport: J(qt),
		ajax: function(t, i) {
			function n(t, i, n, s) {
				var c, d, p, b, w, x = i;
				u || (u = !0, l && e.clearTimeout(l), o = void 0, a = s || "", T.readyState = t > 0 ? 4 : 0, c = t >= 200 && t < 300 || 304 === t, n && (b = ie(f, T, n)), b = ne(f, b, T, c), c ? (f.ifModified && ((w = T.getResponseHeader("Last-Modified")) && (be.lastModified[r] = w), (w = T.getResponseHeader("etag")) && (be.etag[r] = w)), 204 === t || "HEAD" === f.type ? x = "nocontent" : 304 === t ? x = "notmodified" : (x = b.state, d = b.data, c = !(p = b.error))) : (p = x, !t && x || (x = "error", t < 0 && (t = 0))), T.status = t, T.statusText = (i || x) + "", c ? v.resolveWith(m, [d, x, T]) : v.rejectWith(m, [T, x, p]), T.statusCode(_), _ = void 0, h && g.trigger(c ? "ajaxSuccess" : "ajaxError", [T, f, c ? d : p]), y.fireWith(m, [T, x]), h && (g.trigger("ajaxComplete", [T, f]), --be.active || be.event.trigger("ajaxStop")))
			}
			"object" == typeof t && (i = t, t = void 0), i = i || {};
			var o, r, a, s, l, c, u, h, d, p, f = be.ajaxSetup({}, i),
				m = f.context || f,
				g = f.context && (m.nodeType || m.jquery) ? be(m) : be.event,
				v = be.Deferred(),
				y = be.Callbacks("once memory"),
				_ = f.statusCode || {},
				b = {},
				w = {},
				x = "canceled",
				T = {
					readyState: 0,
					getResponseHeader: function(e) {
						var t;
						if (u) {
							if (!s)
								for (s = {}; t = Ft.exec(a);) s[t[1].toLowerCase()] = t[2];
							t = s[e.toLowerCase()]
						}
						return null == t ? null : t
					},
					getAllResponseHeaders: function() {
						return u ? a : null
					},
					setRequestHeader: function(e, t) {
						return null == u && (e = w[e.toLowerCase()] = w[e.toLowerCase()] || e, b[e] = t), this
					},
					overrideMimeType: function(e) {
						return null == u && (f.mimeType = e), this
					},
					statusCode: function(e) {
						var t;
						if (e)
							if (u) T.always(e[T.status]);
							else
								for (t in e) _[t] = [_[t], e[t]];
						return this
					},
					abort: function(e) {
						var t = e || x;
						return o && o.abort(t), n(0, t), this
					}
				};
			if (v.promise(T), f.url = ((t || f.url || At.href) + "").replace(Nt, At.protocol + "//"), f.type = i.method || i.type || f.method || f.type, f.dataTypes = (f.dataType || "*").toLowerCase().match($e) || [""], null == f.crossDomain) {
				c = re.createElement("a");
				try {
					c.href = f.url, c.href = c.href, f.crossDomain = Wt.protocol + "//" + Wt.host != c.protocol + "//" + c.host
				}
				catch (e) {
					f.crossDomain = !0
				}
			}
			if (f.data && f.processData && "string" != typeof f.data && (f.data = be.param(f.data, f.traditional)), ee(Ht, f, i, T), u) return T;
			(h = be.event && f.global) && 0 == be.active++ && be.event.trigger("ajaxStart"), f.type = f.type.toUpperCase(), f.hasContent = !Rt.test(f.type), r = f.url.replace(Lt, ""), f.hasContent ? f.data && f.processData && 0 === (f.contentType || "").indexOf("application/x-www-form-urlencoded") && (f.data = f.data.replace(zt, "+")) : (p = f.url.slice(r.length), f.data && (f.processData || "string" == typeof f.data) && (r += (Pt.test(r) ? "&" : "?") + f.data, delete f.data), !1 === f.cache && (r = r.replace(It, "$1"), p = (Pt.test(r) ? "&" : "?") + "_=" + Et++ + p), f.url = r + p), f.ifModified && (be.lastModified[r] && T.setRequestHeader("If-Modified-Since", be.lastModified[r]), be.etag[r] && T.setRequestHeader("If-None-Match", be.etag[r])), (f.data && f.hasContent && !1 !== f.contentType || i.contentType) && T.setRequestHeader("Content-Type", f.contentType), T.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + Bt + "; q=0.01" : "") : f.accepts["*"]);
			for (d in f.headers) T.setRequestHeader(d, f.headers[d]);
			if (f.beforeSend && (!1 === f.beforeSend.call(m, T, f) || u)) return T.abort();
			if (x = "abort", y.add(f.complete), T.done(f.success), T.fail(f.error), o = ee(qt, f, i, T)) {
				if (T.readyState = 1, h && g.trigger("ajaxSend", [T, f]), u) return T;
				f.async && f.timeout > 0 && (l = e.setTimeout(function() {
					T.abort("timeout")
				}, f.timeout));
				try {
					u = !1, o.send(b, n)
				}
				catch (e) {
					if (u) throw e;
					n(-1, e)
				}
			}
			else n(-1, "No Transport");
			return T
		},
		getJSON: function(e, t, i) {
			return be.get(e, t, i, "json")
		},
		getScript: function(e, t) {
			return be.get(e, void 0, t, "script")
		}
	}), be.each(["get", "post"], function(e, t) {
		be[t] = function(e, i, n, o) {
			return ve(i) && (o = o || n, n = i, i = void 0), be.ajax(be.extend({
				url: e,
				type: t,
				dataType: o,
				data: i,
				success: n
			}, be.isPlainObject(e) && e))
		}
	}), be._evalUrl = function(e) {
		return be.ajax({
			url: e,
			type: "GET",
			dataType: "script",
			cache: !0,
			async: !1,
			global: !1,
			throws: !0
		})
	}, be.fn.extend({
		wrapAll: function(e) {
			var t;
			return this[0] && (ve(e) && (e = e.call(this[0])), t = be(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
				for (var e = this; e.firstElementChild;) e = e.firstElementChild;
				return e
			}).append(this)), this
		},
		wrapInner: function(e) {
			return ve(e) ? this.each(function(t) {
				be(this).wrapInner(e.call(this, t))
			}) : this.each(function() {
				var t = be(this),
					i = t.contents();
				i.length ? i.wrapAll(e) : t.append(e)
			})
		},
		wrap: function(e) {
			var t = ve(e);
			return this.each(function(i) {
				be(this).wrapAll(t ? e.call(this, i) : e)
			})
		},
		unwrap: function(e) {
			return this.parent(e).not("body").each(function() {
				be(this).replaceWith(this.childNodes)
			}), this
		}
	}), be.expr.pseudos.hidden = function(e) {
		return !be.expr.pseudos.visible(e)
	}, be.expr.pseudos.visible = function(e) {
		return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
	}, be.ajaxSettings.xhr = function() {
		try {
			return new e.XMLHttpRequest
		}
		catch (e) {}
	};
	var Ut = {
			0: 200,
			1223: 204
		},
		Xt = be.ajaxSettings.xhr();
	ge.cors = !!Xt && "withCredentials" in Xt, ge.ajax = Xt = !!Xt, be.ajaxTransport(function(t) {
		var i, n;
		if (ge.cors || Xt && !t.crossDomain) return {
			send: function(o, r) {
				var a, s = t.xhr();
				if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
					for (a in t.xhrFields) s[a] = t.xhrFields[a];
				t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
				for (a in o) s.setRequestHeader(a, o[a]);
				i = function(e) {
					return function() {
						i && (i = n = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null, "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? r(0, "error") : r(s.status, s.statusText) : r(Ut[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
							binary: s.response
						} : {
							text: s.responseText
						}, s.getAllResponseHeaders()))
					}
				}, s.onload = i(), n = s.onerror = s.ontimeout = i("error"), void 0 !== s.onabort ? s.onabort = n : s.onreadystatechange = function() {
					4 === s.readyState && e.setTimeout(function() {
						i && n()
					})
				}, i = i("abort");
				try {
					s.send(t.hasContent && t.data || null)
				}
				catch (e) {
					if (i) throw e
				}
			},
			abort: function() {
				i && i()
			}
		}
	}), be.ajaxPrefilter(function(e) {
		e.crossDomain && (e.contents.script = !1)
	}), be.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function(e) {
				return be.globalEval(e), e
			}
		}
	}), be.ajaxPrefilter("script", function(e) {
		void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
	}), be.ajaxTransport("script", function(e) {
		if (e.crossDomain) {
			var t, i;
			return {
				send: function(n, o) {
					t = be("<script>").prop({
						charset: e.scriptCharset,
						src: e.url
					}).on("load error", i = function(e) {
						t.remove(), i = null, e && o("error" === e.type ? 404 : 200, e.type)
					}), re.head.appendChild(t[0])
				},
				abort: function() {
					i && i()
				}
			}
		}
	});
	var Yt = [],
		Vt = /(=)\?(?=&|$)|\?\?/;
	be.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var e = Yt.pop() || be.expando + "_" + Et++;
			return this[e] = !0, e
		}
	}), be.ajaxPrefilter("json jsonp", function(t, i, n) {
		var o, r, a, s = !1 !== t.jsonp && (Vt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Vt.test(t.data) && "data");
		if (s || "jsonp" === t.dataTypes[0]) return o = t.jsonpCallback = ve(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(Vt, "$1" + o) : !1 !== t.jsonp && (t.url += (Pt.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), t.converters["script json"] = function() {
			return a || be.error(o + " was not called"), a[0]
		}, t.dataTypes[0] = "json", r = e[o], e[o] = function() {
			a = arguments
		}, n.always(function() {
			void 0 === r ? be(e).removeProp(o) : e[o] = r, t[o] && (t.jsonpCallback = i.jsonpCallback, Yt.push(o)), a && ve(r) && r(a[0]), a = r = void 0
		}), "script"
	}), ge.createHTMLDocument = function() {
		var e = re.implementation.createHTMLDocument("").body;
		return e.innerHTML = "<form></form><form></form>", 2 === e.childNodes.length
	}(), be.parseHTML = function(e, t, i) {
		if ("string" != typeof e) return [];
		"boolean" == typeof t && (i = t, t = !1);
		var n, o, r;
		return t || (ge.createHTMLDocument ? ((n = (t = re.implementation.createHTMLDocument("")).createElement("base")).href = re.location.href, t.head.appendChild(n)) : t = re), o = Se.exec(e), r = !i && [], o ? [t.createElement(o[1])] : (o = T([e], t, r), r && r.length && be(r).remove(), be.merge([], o.childNodes))
	}, be.fn.load = function(e, t, i) {
		var n, o, r, a = this,
			s = e.indexOf(" ");
		return s > -1 && (n = Q(e.slice(s)), e = e.slice(0, s)), ve(t) ? (i = t, t = void 0) : t && "object" == typeof t && (o = "POST"), a.length > 0 && be.ajax({
			url: e,
			type: o || "GET",
			dataType: "html",
			data: t
		}).done(function(e) {
			r = arguments, a.html(n ? be("<div>").append(be.parseHTML(e)).find(n) : e)
		}).always(i && function(e, t) {
			a.each(function() {
				i.apply(this, r || [e.responseText, t, e])
			})
		}), this
	}, be.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
		be.fn[t] = function(e) {
			return this.on(t, e)
		}
	}), be.expr.pseudos.animated = function(e) {
		return be.grep(be.timers, function(t) {
			return e === t.elem
		}).length
	}, be.offset = {
		setOffset: function(e, t, i) {
			var n, o, r, a, s, l, c = be.css(e, "position"),
				u = be(e),
				h = {};
			"static" === c && (e.style.position = "relative"), s = u.offset(), r = be.css(e, "top"), l = be.css(e, "left"), ("absolute" === c || "fixed" === c) && (r + l).indexOf("auto") > -1 ? (a = (n = u.position()).top, o = n.left) : (a = parseFloat(r) || 0, o = parseFloat(l) || 0), ve(t) && (t = t.call(e, i, be.extend({}, s))), null != t.top && (h.top = t.top - s.top + a), null != t.left && (h.left = t.left - s.left + o), "using" in t ? t.using.call(e, h) : u.css(h)
		}
	}, be.fn.extend({
		offset: function(e) {
			if (arguments.length) return void 0 === e ? this : this.each(function(t) {
				be.offset.setOffset(this, e, t)
			});
			var t, i, n = this[0];
			return n ? n.getClientRects().length ? (t = n.getBoundingClientRect(), i = n.ownerDocument.defaultView, {
				top: t.top + i.pageYOffset,
				left: t.left + i.pageXOffset
			}) : {
				top: 0,
				left: 0
			} : void 0
		},
		position: function() {
			if (this[0]) {
				var e, t, i, n = this[0],
					o = {
						top: 0,
						left: 0
					};
				if ("fixed" === be.css(n, "position")) t = n.getBoundingClientRect();
				else {
					for (t = this.offset(), i = n.ownerDocument, e = n.offsetParent || i.documentElement; e && (e === i.body || e === i.documentElement) && "static" === be.css(e, "position");) e = e.parentNode;
					e && e !== n && 1 === e.nodeType && ((o = be(e).offset()).top += be.css(e, "borderTopWidth", !0), o.left += be.css(e, "borderLeftWidth", !0))
				}
				return {
					top: t.top - o.top - be.css(n, "marginTop", !0),
					left: t.left - o.left - be.css(n, "marginLeft", !0)
				}
			}
		},
		offsetParent: function() {
			return this.map(function() {
				for (var e = this.offsetParent; e && "static" === be.css(e, "position");) e = e.offsetParent;
				return e || Je
			})
		}
	}), be.each({
		scrollLeft: "pageXOffset",
		scrollTop: "pageYOffset"
	}, function(e, t) {
		var i = "pageYOffset" === t;
		be.fn[e] = function(n) {
			return ze(this, function(e, n, o) {
				var r;
				if (ye(e) ? r = e : 9 === e.nodeType && (r = e.defaultView), void 0 === o) return r ? r[t] : e[n];
				r ? r.scrollTo(i ? r.pageXOffset : o, i ? o : r.pageYOffset) : e[n] = o
			}, e, n, arguments.length)
		}
	}), be.each(["top", "left"], function(e, t) {
		be.cssHooks[t] = I(ge.pixelPosition, function(e, i) {
			if (i) return i = L(e, t), st.test(i) ? be(e).position()[t] + "px" : i
		})
	}), be.each({
		Height: "height",
		Width: "width"
	}, function(e, t) {
		be.each({
			padding: "inner" + e,
			content: t,
			"": "outer" + e
		}, function(i, n) {
			be.fn[n] = function(o, r) {
				var a = arguments.length && (i || "boolean" != typeof o),
					s = i || (!0 === o || !0 === r ? "margin" : "border");
				return ze(this, function(t, i, o) {
					var r;
					return ye(t) ? 0 === n.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === o ? be.css(t, i, s) : be.style(t, i, o, s)
				}, t, a ? o : void 0, a)
			}
		})
	}), be.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
		be.fn[t] = function(e, i) {
			return arguments.length > 0 ? this.on(t, null, e, i) : this.trigger(t)
		}
	}), be.fn.extend({
		hover: function(e, t) {
			return this.mouseenter(e).mouseleave(t || e)
		}
	}), be.fn.extend({
		bind: function(e, t, i) {
			return this.on(e, null, t, i)
		},
		unbind: function(e, t) {
			return this.off(e, null, t)
		},
		delegate: function(e, t, i, n) {
			return this.on(t, e, i, n)
		},
		undelegate: function(e, t, i) {
			return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", i)
		}
	}), be.proxy = function(e, t) {
		var i, n, o;
		return "string" == typeof t && (i = e[t], t = e, e = i), ve(e) ? (n = se.call(arguments, 2), o = function() {
			return e.apply(t || this, n.concat(se.call(arguments)))
		}, o.guid = e.guid = e.guid || be.guid++, o) : void 0
	}, be.holdReady = function(e) {
		e ? be.readyWait++ : be.ready(!0)
	}, be.isArray = Array.isArray, be.parseJSON = JSON.parse, be.nodeName = r, be.isFunction = ve, be.isWindow = ye, be.camelCase = f, be.type = n, be.now = Date.now, be.isNumeric = function(e) {
		var t = be.type(e);
		return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
	}, "function" == typeof define && define.amd && define("jquery", [], function() {
		return be
	});
	var Qt = e.jQuery,
		Gt = e.$;
	return be.noConflict = function(t) {
		return e.$ === be && (e.$ = Gt), t && e.jQuery === be && (e.jQuery = Qt), be
	}, t || (e.jQuery = e.$ = be), be
});
var DateFormat = {};
! function(e) {
	var t = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		i = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		o = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		r = {
			Jan: "01",
			Feb: "02",
			Mar: "03",
			Apr: "04",
			May: "05",
			Jun: "06",
			Jul: "07",
			Aug: "08",
			Sep: "09",
			Oct: "10",
			Nov: "11",
			Dec: "12"
		},
		a = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/;
	DateFormat.format = function() {
		function e(e) {
			return t[parseInt(e, 10)] || e
		}

		function s(e) {
			return i[parseInt(e, 10)] || e
		}

		function l(e) {
			var t = parseInt(e, 10) - 1;
			return n[t] || e
		}

		function c(e) {
			var t = parseInt(e, 10) - 1;
			return o[t] || e
		}

		function u(e) {
			return r[e] || e
		}

		function h(e) {
			var t, i, n, o, r, a = e,
				s = "";
			return -1 !== a.indexOf(".") && (a = (o = a.split("."))[0], s = o[o.length - 1]), 3 === (r = a.split(":")).length ? (t = r[0], i = r[1], n = r[2].replace(/\s.+/, "").replace(/[a-z]/gi, ""), a = a.replace(/\s.+/, "").replace(/[a-z]/gi, ""), {
				time: a,
				hour: t,
				minute: i,
				second: n,
				millis: s
			}) : {
				time: "",
				hour: "",
				minute: "",
				second: "",
				millis: ""
			}
		}

		function d(e, t) {
			for (var i = t - String(e).length, n = 0; n < i; n++) e = "0" + e;
			return e
		}
		return {
			parseDate: function(e) {
				var t, i, n = {
					date: null,
					year: null,
					month: null,
					dayOfMonth: null,
					dayOfWeek: null,
					time: null
				};
				if ("number" == typeof e) return this.parseDate(new Date(e));
				if ("function" == typeof e.getFullYear) n.year = String(e.getFullYear()), n.month = String(e.getMonth() + 1), n.dayOfMonth = String(e.getDate()), n.time = h(e.toTimeString() + "." + e.getMilliseconds());
				else if (-1 != e.search(a)) t = e.split(/[T\+-]/), n.year = t[0], n.month = t[1], n.dayOfMonth = t[2], n.time = h(t[3].split(".")[0]);
				else switch (6 === (t = e.split(" ")).length && isNaN(t[5]) && (t[t.length] = "()"), t.length) {
					case 6:
						n.year = t[5], n.month = u(t[1]), n.dayOfMonth = t[2], n.time = h(t[3]);
						break;
					case 2:
						i = t[0].split("-"), n.year = i[0], n.month = i[1], n.dayOfMonth = i[2], n.time = h(t[1]);
						break;
					case 7:
					case 9:
					case 10:
						n.year = t[3];
						var o = parseInt(t[1]),
							r = parseInt(t[2]);
						o && !r ? (n.month = u(t[2]), n.dayOfMonth = t[1]) : (n.month = u(t[1]), n.dayOfMonth = t[2]), n.time = h(t[4]);
						break;
					case 1:
						i = t[0].split(""), n.year = i[0] + i[1] + i[2] + i[3], n.month = i[5] + i[6], n.dayOfMonth = i[8] + i[9], n.time = h(i[13] + i[14] + i[15] + i[16] + i[17] + i[18] + i[19] + i[20]);
						break;
					default:
						return null
				}
				return n.time ? n.date = new Date(n.year, n.month - 1, n.dayOfMonth, n.time.hour, n.time.minute, n.time.second, n.time.millis) : n.date = new Date(n.year, n.month - 1, n.dayOfMonth), n.dayOfWeek = String(n.date.getDay()), n
			},
			date: function(t, i) {
				try {
					var n = this.parseDate(t);
					if (null === n) return t;
					for (var o, r = n.year, a = n.month, u = n.dayOfMonth, h = n.dayOfWeek, p = n.time, f = "", m = "", g = "", v = !1, y = 0; y < i.length; y++) {
						var _ = i.charAt(y),
							b = i.charAt(y + 1);
						if (v) "'" == _ ? (m += "" === f ? "'" : f, f = "", v = !1) : f += _;
						else switch (f += _, g = "", f) {
							case "ddd":
								m += e(h), f = "";
								break;
							case "dd":
								if ("d" === b) break;
								m += d(u, 2), f = "";
								break;
							case "d":
								if ("d" === b) break;
								m += parseInt(u, 10), f = "";
								break;
							case "D":
								m += u = 1 == u || 21 == u || 31 == u ? parseInt(u, 10) + "st" : 2 == u || 22 == u ? parseInt(u, 10) + "nd" : 3 == u || 23 == u ? parseInt(u, 10) + "rd" : parseInt(u, 10) + "th", f = "";
								break;
							case "MMMM":
								m += c(a), f = "";
								break;
							case "MMM":
								if ("M" === b) break;
								m += l(a), f = "";
								break;
							case "MM":
								if ("M" === b) break;
								m += d(a, 2), f = "";
								break;
							case "M":
								if ("M" === b) break;
								m += parseInt(a, 10), f = "";
								break;
							case "y":
							case "yyy":
								if ("y" === b) break;
								m += f, f = "";
								break;
							case "yy":
								if ("y" === b) break;
								m += String(r).slice(-2), f = "";
								break;
							case "yyyy":
								m += r, f = "";
								break;
							case "HH":
								m += d(p.hour, 2), f = "";
								break;
							case "H":
								if ("H" === b) break;
								m += parseInt(p.hour, 10), f = "";
								break;
							case "hh":
								m += d(o = 0 === parseInt(p.hour, 10) ? 12 : p.hour < 13 ? p.hour : p.hour - 12, 2), f = "";
								break;
							case "h":
								if ("h" === b) break;
								o = 0 === parseInt(p.hour, 10) ? 12 : p.hour < 13 ? p.hour : p.hour - 12, m += parseInt(o, 10), f = "";
								break;
							case "mm":
								m += d(p.minute, 2), f = "";
								break;
							case "m":
								if ("m" === b) break;
								m += p.minute, f = "";
								break;
							case "ss":
								m += d(p.second.substring(0, 2), 2), f = "";
								break;
							case "s":
								if ("s" === b) break;
								m += p.second, f = "";
								break;
							case "S":
							case "SS":
								if ("S" === b) break;
								m += f, f = "";
								break;
							case "SSS":
								m += d(p.millis.substring(0, 3), 3), f = "";
								break;
							case "a":
								m += p.hour >= 12 ? "PM" : "AM", f = "";
								break;
							case "p":
								m += p.hour >= 12 ? "p.m." : "a.m.", f = "";
								break;
							case "E":
								m += s(h), f = "";
								break;
							case "'":
								f = "", v = !0;
								break;
							default:
								m += _, f = ""
						}
					}
					return m += g
				}
				catch (e) {
					return console && console.log, t
				}
			},
			prettyDate: function(e) {
				var t, i, n, o, r;
				if ("string" != typeof e && "number" != typeof e || (t = new Date(e)), "object" == typeof e && (t = new Date(e.toString())), i = ((new Date).getTime() - t.getTime()) / 1e3, n = Math.abs(i), o = Math.floor(n / 86400), !isNaN(o)) return r = i < 0 ? "from now" : "ago", n < 60 ? i >= 0 ? "just now" : "in a moment" : n < 120 ? "1 minute " + r : n < 3600 ? Math.floor(n / 60) + " minutes " + r : n < 7200 ? "1 hour " + r : n < 86400 ? Math.floor(n / 3600) + " hours " + r : 1 === o ? i >= 0 ? "Yesterday" : "Tomorrow" : o < 7 ? o + " days " + r : 7 === o ? "1 week " + r : o < 31 ? Math.ceil(o / 7) + " weeks " + r : "more than 5 weeks " + r
			},
			toBrowserTimeZone: function(e, t) {
				return this.date(new Date(e), t || "MM/dd/yyyy HH:mm:ss")
			}
		}
	}()
}(), jQuery.format = DateFormat.format,
	function(e, t, i) {
		function n(e, t) {
			return typeof e === t
		}

		function o(e) {
			var t = T.className,
				i = x._config.classPrefix || "";
			if (k && (t = t.baseVal), x._config.enableJSClass) {
				var n = new RegExp("(^|\\s)" + i + "no-js(\\s|$)");
				t = t.replace(n, "$1" + i + "js$2")
			}
			x._config.enableClasses && (t += " " + i + e.join(" " + i), k ? T.className.baseVal = t : T.className = t)
		}

		function r() {
			return "function" != typeof t.createElement ? t.createElement(arguments[0]) : k ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments)
		}

		function a() {
			var e = t.body;
			return e || ((e = r(k ? "svg" : "body")).fake = !0), e
		}

		function s(e, i, n, o) {
			var s, l, c, u, h = "modernizr",
				d = r("div"),
				p = a();
			if (parseInt(n, 10))
				for (; n--;)(c = r("div")).id = o ? o[n] : h + (n + 1), d.appendChild(c);
			return s = r("style"), s.type = "text/css", s.id = "s" + h, (p.fake ? p : d).appendChild(s), p.appendChild(d), s.styleSheet ? s.styleSheet.cssText = e : s.appendChild(t.createTextNode(e)), d.id = h, p.fake && (p.style.background = "", p.style.overflow = "hidden", u = T.style.overflow, T.style.overflow = "hidden", T.appendChild(p)), l = i(d, e), p.fake ? (p.parentNode.removeChild(p), T.style.overflow = u, T.offsetHeight) : d.parentNode.removeChild(d), !!l
		}

		function l(e) {
			return e.replace(/([a-z])-([a-z])/g, function(e, t, i) {
				return t + i.toUpperCase()
			}).replace(/^-/, "")
		}

		function c(e, t) {
			if ("object" == typeof e)
				for (var i in e) M(e, i) && c(i, e[i]);
			else {
				var n = (e = e.toLowerCase()).split("."),
					r = x[n[0]];
				if (2 == n.length && (r = r[n[1]]), void 0 !== r) return x;
				t = "function" == typeof t ? t() : t, 1 == n.length ? x[n[0]] = t : (!x[n[0]] || x[n[0]] instanceof Boolean || (x[n[0]] = new Boolean(x[n[0]])), x[n[0]][n[1]] = t), o([(t && 0 != t ? "" : "no-") + n.join("-")]), x._trigger(e, t)
			}
			return x
		}

		function u(e, t) {
			return !!~("" + e).indexOf(t)
		}

		function h(e, t) {
			return function() {
				return e.apply(t, arguments)
			}
		}

		function d(e, t, i) {
			var o;
			for (var r in e)
				if (e[r] in t) return !1 === i ? e[r] : (o = t[e[r]], n(o, "function") ? h(o, i || t) : o);
			return !1
		}

		function p(e) {
			return e.replace(/([A-Z])/g, function(e, t) {
				return "-" + t.toLowerCase()
			}).replace(/^ms-/, "-ms-")
		}

		function f(t, i, n) {
			var o;
			if ("getComputedStyle" in e) {
				o = getComputedStyle.call(e, t, i);
				var r = e.console;
				null !== o ? n && (o = o.getPropertyValue(n)) : r && r[r.error ? "error" : "log"].call(r, "getComputedStyle returning null, its possible modernizr test results are inaccurate")
			}
			else o = !i && t.currentStyle && t.currentStyle[n];
			return o
		}

		function m(t, n) {
			var o = t.length;
			if ("CSS" in e && "supports" in e.CSS) {
				for (; o--;)
					if (e.CSS.supports(p(t[o]), n)) return !0;
				return !1
			}
			if ("CSSSupportsRule" in e) {
				for (var r = []; o--;) r.push("(" + p(t[o]) + ":" + n + ")");
				return r = r.join(" or "), s("@supports (" + r + ") { #modernizr { position: absolute; } }", function(e) {
					return "absolute" == f(e, null, "position")
				})
			}
			return i
		}

		function g(e, t, o, a) {
			function s() {
				h && (delete I.style, delete I.modElem)
			}
			if (a = !n(a, "undefined") && a, !n(o, "undefined")) {
				var c = m(e, o);
				if (!n(c, "undefined")) return c
			}
			for (var h, d, p, f, g, v = ["modernizr", "tspan", "samp"]; !I.style && v.length;) h = !0, I.modElem = r(v.shift()), I.style = I.modElem.style;
			for (p = e.length, d = 0; d < p; d++)
				if (f = e[d], g = I.style[f], u(f, "-") && (f = l(f)), I.style[f] !== i) {
					if (a || n(o, "undefined")) return s(), "pfx" != t || f;
					try {
						I.style[f] = o
					}
					catch (e) {}
					if (I.style[f] != g) return s(), "pfx" != t || f
				}
			return s(), !1
		}

		function v(e, t, i, o, r) {
			var a = e.charAt(0).toUpperCase() + e.slice(1),
				s = (e + " " + D.join(a + " ") + a).split(" ");
			return n(t, "string") || n(t, "undefined") ? g(s, t, o, r) : (s = (e + " " + $.join(a + " ") + a).split(" "), d(s, t, i))
		}

		function y(e, t, n) {
			return v(e, i, i, t, n)
		}
		var _ = [],
			b = [],
			w = {
				_version: "3.6.0",
				_config: {
					classPrefix: "",
					enableClasses: !0,
					enableJSClass: !0,
					usePrefixes: !0
				},
				_q: [],
				on: function(e, t) {
					var i = this;
					setTimeout(function() {
						t(i[e])
					}, 0)
				},
				addTest: function(e, t, i) {
					b.push({
						name: e,
						fn: t,
						options: i
					})
				},
				addAsyncTest: function(e) {
					b.push({
						name: null,
						fn: e
					})
				}
			},
			x = function() {};
		x.prototype = w, (x = new x).addTest("passiveeventlisteners", function() {
			var t = !1;
			try {
				var i = Object.defineProperty({}, "passive", {
					get: function() {
						t = !0
					}
				});
				e.addEventListener("test", null, i)
			}
			catch (e) {}
			return t
		}), x.addTest("devicemotion", "DeviceMotionEvent" in e), x.addTest("deviceorientation", "DeviceOrientationEvent" in e);
		var T = t.documentElement;
		x.addTest("willchange", "willChange" in T.style);
		var k = "svg" === T.nodeName.toLowerCase(),
			C = function() {
				var e = !("onblur" in t.documentElement);
				return function(t, n) {
					var o;
					return !!t && (n && "string" != typeof n || (n = r(n || "div")), t = "on" + t, !(o = t in n) && e && (n.setAttribute || (n = r("div")), n.setAttribute(t, ""), o = "function" == typeof n[t], n[t] !== i && (n[t] = i), n.removeAttribute(t)), o)
				}
			}();
		w.hasEvent = C, x.addTest("srcset", "srcset" in r("img"));
		var S = w._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
		w._prefixes = S;
		var A = "CSS" in e && "supports" in e.CSS,
			E = "supportsCSS" in e;
		x.addTest("supports", A || E);
		var P = function() {
			var t = e.matchMedia || e.msMatchMedia;
			return t ? function(e) {
				var i = t(e);
				return i && i.matches || !1
			} : function(t) {
				var i = !1;
				return s("@media " + t + " { #modernizr { position: absolute; } }", function(t) {
					i = "absolute" == (e.getComputedStyle ? e.getComputedStyle(t, null) : t.currentStyle).position
				}), i
			}
		}();
		w.mq = P;
		var O = w.testStyles = s;
		x.addTest("touchevents", function() {
			var i;
			if ("ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch) i = !0;
			else {
				var n = ["@media (", S.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
				O(n, function(e) {
					i = 9 === e.offsetTop
				})
			}
			return i
		});
		var $ = w._config.usePrefixes ? "Moz O ms Webkit".toLowerCase().split(" ") : [];
		w._domPrefixes = $, x.addTest("pointerevents", function() {
			var e = !1,
				t = $.length;
			for (e = x.hasEvent("pointerdown"); t-- && !e;) C($[t] + "pointerdown") && (e = !0);
			return e
		});
		var M;
		! function() {
			var e = {}.hasOwnProperty;
			M = n(e, "undefined") || n(e.call, "undefined") ? function(e, t) {
				return t in e && n(e.constructor.prototype[t], "undefined")
			} : function(t, i) {
				return e.call(t, i)
			}
		}(), w._l = {}, w.on = function(e, t) {
			this._l[e] || (this._l[e] = []), this._l[e].push(t), x.hasOwnProperty(e) && setTimeout(function() {
				x._trigger(e, x[e])
			}, 0)
		}, w._trigger = function(e, t) {
			if (this._l[e]) {
				var i = this._l[e];
				setTimeout(function() {
					var e;
					for (e = 0; e < i.length; e++)(0, i[e])(t)
				}, 0), delete this._l[e]
			}
		}, x._q.push(function() {
			w.addTest = c
		}), x.addAsyncTest(function() {
			var e = new Image;
			e.onload = e.onerror = function() {
				c("jpeg2000", 1 == e.width)
			}, e.src = "data:image/jp2;base64,/0//UQAyAAAAAAABAAAAAgAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAEBwEBBwEBBwEBBwEB/1IADAAAAAEAAAQEAAH/XAAEQED/ZAAlAAFDcmVhdGVkIGJ5IE9wZW5KUEVHIHZlcnNpb24gMi4wLjD/kAAKAAAAAABYAAH/UwAJAQAABAQAAf9dAAUBQED/UwAJAgAABAQAAf9dAAUCQED/UwAJAwAABAQAAf9dAAUDQED/k8+kEAGvz6QQAa/PpBABr994EAk//9k="
		}), x.addAsyncTest(function() {
			var e = new Image;
			e.onload = e.onerror = function() {
				c("jpegxr", 1 == e.width, {
					aliases: ["jpeg-xr"]
				})
			}, e.src = "data:image/vnd.ms-photo;base64,SUm8AQgAAAAFAAG8AQAQAAAASgAAAIC8BAABAAAAAQAAAIG8BAABAAAAAQAAAMC8BAABAAAAWgAAAMG8BAABAAAAHwAAAAAAAAAkw91vA07+S7GFPXd2jckNV01QSE9UTwAZAYBxAAAAABP/gAAEb/8AAQAAAQAAAA=="
		}), x.addAsyncTest(function() {
			var e = new Image;
			e.onerror = function() {
				c("webpalpha", !1, {
					aliases: ["webp-alpha"]
				})
			}, e.onload = function() {
				c("webpalpha", 1 == e.width, {
					aliases: ["webp-alpha"]
				})
			}, e.src = "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="
		}), x.addTest("hovermq", P("(hover)")), x.addTest("pointermq", P("(pointer:coarse),(pointer:fine),(pointer:none)"));
		var D = w._config.usePrefixes ? "Moz O ms Webkit".split(" ") : [];
		w._cssomPrefixes = D;
		var z = function(t) {
			var n, o = S.length,
				r = e.CSSRule;
			if (void 0 === r) return i;
			if (!t) return !1;
			if (t = t.replace(/^@/, ""), (n = t.replace(/-/g, "_").toUpperCase() + "_RULE") in r) return "@" + t;
			for (var a = 0; a < o; a++) {
				var s = S[a];
				if (s.toUpperCase() + "_" + n in r) return "@-" + s.toLowerCase() + "-" + t
			}
			return !1
		};
		w.atRule = z;
		var L = {
			elem: r("modernizr")
		};
		x._q.push(function() {
			delete L.elem
		});
		var I = {
			style: L.elem.style
		};
		x._q.unshift(function() {
			delete I.style
		}), w.testAllProps = v;
		var F = w.prefixed = function(e, t, i) {
			return 0 === e.indexOf("@") ? z(e) : (-1 != e.indexOf("-") && (e = l(e)), t ? v(e, t, i) : v(e, "pfx"))
		};
		x.addTest("forcetouch", function() {
				return !!C(F("mouseforcewillbegin", e, !1), e) && MouseEvent.WEBKIT_FORCE_AT_MOUSE_DOWN && MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN
			}), x.addTest("objectfit", !!F("objectFit"), {
				aliases: ["object-fit"]
			}), w.testAllProps = y, x.addTest("backdropfilter", y("backdropFilter")), x.addTest("cssfilters", function() {
				if (x.supports) return y("filter", "blur(2px)");
				var e = r("a");
				return e.style.cssText = S.join("filter:blur(2px); "), !!e.style.length && (t.documentMode === i || t.documentMode > 9)
			}), x.addTest("scrollsnappoints", y("scrollSnapType")),
			function() {
				var e, t, i, o, r, a;
				for (var s in b)
					if (b.hasOwnProperty(s)) {
						if (e = [], (t = b[s]).name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
							for (i = 0; i < t.options.aliases.length; i++) e.push(t.options.aliases[i].toLowerCase());
						for (o = n(t.fn, "function") ? t.fn() : t.fn, r = 0; r < e.length; r++) 1 === (a = e[r].split(".")).length ? x[a[0]] = o : (!x[a[0]] || x[a[0]] instanceof Boolean || (x[a[0]] = new Boolean(x[a[0]])), x[a[0]][a[1]] = o), _.push((o ? "" : "no-") + a.join("-"))
					}
			}(), o(_), delete w.addTest, delete w.addAsyncTest;
		for (var j = 0; j < x._q.length; j++) x._q[j]();
		e.Modernizr = x
	}(window, document),
	function(e) {
		"use strict";
		e.loadCSS || (e.loadCSS = function() {});
		var t = loadCSS.relpreload = {};
		if (t.support = function() {
				var t;
				try {
					t = e.document.createElement("link").relList.supports("preload")
				}
				catch (e) {
					t = !1
				}
				return function() {
					return t
				}
			}(), t.bindMediaToggle = function(e) {
				function t() {
					e.media = i
				}
				var i = e.media || "all";
				e.addEventListener ? e.addEventListener("load", t) : e.attachEvent && e.attachEvent("onload", t), setTimeout(function() {
					e.rel = "stylesheet", e.media = "only x"
				}), setTimeout(t, 3e3)
			}, t.poly = function() {
				if (!t.support())
					for (var i = e.document.getElementsByTagName("link"), n = 0; n < i.length; n++) {
						var o = i[n];
						"preload" !== o.rel || "style" !== o.getAttribute("as") || o.getAttribute("data-loadcss") || (o.setAttribute("data-loadcss", !0), t.bindMediaToggle(o))
					}
			}, !t.support()) {
			t.poly();
			var i = e.setInterval(t.poly, 500);
			e.addEventListener ? e.addEventListener("load", function() {
				t.poly(), e.clearInterval(i)
			}) : e.attachEvent && e.attachEvent("onload", function() {
				t.poly(), e.clearInterval(i)
			})
		}
		"undefined" != typeof exports ? exports.loadCSS = loadCSS : e.loadCSS = loadCSS
	}("undefined" != typeof global ? global : this);
var DOMAIN = "stoamigo.com",
	FACEBOOK_APP_ID = "stoamigo.com" == DOMAIN ? "178551732274362" : "686285104834353",
	GOOGLE_APP_ID = "659914067642-5eh0jggv7v21u5u2bqp223eqpqr7r88l.apps.googleusercontent.com",
	authWindow;
jQuery(initSignin),
	function(e) {
		"use strict";

		function t(n) {
			if (i[n]) return i[n].exports;
			var o = i[n] = {
				i: n,
				l: !1,
				exports: {}
			};
			return e[n].call(o.exports, o, o.exports, t), o.l = !0, o.exports
		}
		var i = {};
		t.m = e, t.c = i, t.d = function(e, i, n) {
			t.o(e, i) || Object.defineProperty(e, i, {
				configurable: !1,
				enumerable: !0,
				get: n
			})
		}, t.n = function(e) {
			var i = e && e.__esModule ? function() {
				return e.default
			} : function() {
				return e
			};
			return t.d(i, "a", i), i
		}, t.o = function(e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}, t.p = "", t(t.s = 0)
	}([function(e, t, i) {
		"use strict";
		var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
				return typeof e
			} : function(e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			},
			o = i(1),
			r = {
				passive: !0,
				capture: !1
			},
			a = ["wheel", "mousewheel"],
			s = function(e, t) {
				return void 0 !== e ? e : -1 !== a.indexOf(t) && r.passive
			},
			l = function(e) {
				var t = Object.getOwnPropertyDescriptor(e, "passive");
				return t && !0 !== t.writable && void 0 === t.set ? Object.assign({}, e) : e
			},
			c = function(e, t) {
				return t ? function(t) {
					return t.preventDefault = o.noop, e.call(this, t)
				} : e
			};
		(0, o.eventListenerOptionsSupported)() && function(e) {
			EventTarget.prototype.addEventListener = function(t, i, o) {
				var a = "object" === (void 0 === o ? "undefined" : n(o)) && null !== o,
					u = a ? o.capture : o;
				(o = a ? l(o) : {}).passive = s(o.passive, t), o.capture = void 0 === u ? r.capture : u, i = c(i, o.passive), e.call(this, t, i, o)
			}
		}(EventTarget.prototype.addEventListener)
	}, function(e, t, i) {
		"use strict";
		Object.defineProperty(t, "__esModule", {
			value: !0
		}), t.eventListenerOptionsSupported = function() {
			var e = !1;
			try {
				var t = Object.defineProperty({}, "passive", {
					get: function() {
						e = !0
					}
				});
				window.addEventListener("test", null, t), window.removeEventListener("test", null, t)
			}
			catch (e) {}
			return e
		}, t.noop = function() {}
	}]),
	function(e) {
		"use strict";

		function t(t) {
			var i = e("");
			try {
				i = e(t).clone()
			}
			catch (n) {
				i = e("<span />").html(t)
			}
			return i
		}

		function i(t, i, n) {
			var o = e.Deferred();
			try {
				var r = (t = t.contentWindow || t.contentDocument || t).document || t.contentDocument || t;
				n.doctype && r.write(n.doctype), r.write(i), r.close();
				var a = !1,
					s = function() {
						if (!a) {
							t.focus();
							try {
								t.document.execCommand("print", !1, null) || t.print(), e("body").focus()
							}
							catch (e) {
								t.print()
							}
							t.close(), a = !0, o.resolve()
						}
					};
				e(t).on("load", s), setTimeout(s, n.timeout)
			}
			catch (e) {
				o.reject(e)
			}
			return o
		}

		function n(t, n) {
			var r = e(n.iframe + ""),
				a = r.length;
			return 0 === a && (r = e('<iframe height="0" width="0" border="0" wmode="Opaque"/>').prependTo("body").css({
				position: "absolute",
				top: -999,
				left: -999
			})), i(r.get(0), t, n).done(function() {
				setTimeout(function() {
					0 === a && r.remove()
				}, 1e3)
			}).fail(function(e) {
				o(t, n)
			}).always(function() {
				try {
					n.deferred.resolve()
				}
				catch (e) {}
			})
		}

		function o(e, t) {
			return i(window.open(), e, t).always(function() {
				try {
					t.deferred.resolve()
				}
				catch (e) {}
			})
		}

		function r(e) {
			return !!("object" == typeof Node ? e instanceof Node : e && "object" == typeof e && "number" == typeof e.nodeType && "string" == typeof e.nodeName)
		}
		e.print = e.fn.print = function() {
			var i, a, s = this;
			s instanceof e && (s = s.get(0)), r(s) ? (a = e(s), arguments.length > 0 && (i = arguments[0])) : arguments.length > 0 ? (a = e(arguments[0]), r(a[0]) ? arguments.length > 1 && (i = arguments[1]) : (i = arguments[0], a = e("html"))) : a = e("html");
			var l = {
				globalStyles: !0,
				mediaPrint: !1,
				stylesheet: null,
				noPrintSelector: ".no-print",
				iframe: !0,
				append: null,
				prepend: null,
				manuallyCopyFormValues: !0,
				deferred: e.Deferred(),
				timeout: 750,
				title: null,
				doctype: "<!doctype html>"
			};
			i = e.extend({}, l, i || {});
			var c = e("");
			i.globalStyles ? c = e("style, link, meta, base, title") : i.mediaPrint && (c = e("link[media=print]")), i.stylesheet && (c = e.merge(c, e('<link rel="stylesheet" href="' + i.stylesheet + '">')));
			var u = a.clone();
			if ((u = e("<span/>").append(u)).find(i.noPrintSelector).remove(), u.append(c.clone()), i.title) {
				var h = e("title", u);
				0 === h.length && (h = e("<title />"), u.append(h)), h.text(i.title)
			}
			u.append(t(i.append)), u.prepend(t(i.prepend)), i.manuallyCopyFormValues && (u.find("input").each(function() {
				var t = e(this);
				t.is("[type='radio']") || t.is("[type='checkbox']") ? t.prop("checked") && t.attr("checked", "checked") : t.attr("value", t.val())
			}), u.find("select").each(function() {
				e(this).find(":selected").attr("selected", "selected")
			}), u.find("textarea").each(function() {
				var t = e(this);
				t.text(t.val())
			}));
			var d = u.html();
			try {
				i.deferred.notify("generated_markup", d, u)
			}
			catch (e) {}
			if (u.remove(), i.iframe) try {
				n(d, i)
			}
			catch (e) {
				o(d, i)
			}
			else o(d, i);
			return this
		}
	}(jQuery),
	function(e) {
		"function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
	}(function(e) {
		var t = e.event.dispatch || e.event.handle,
			i = e.event.special,
			n = "D" + +new Date,
			o = "D" + (+new Date + 1);
		i.scrollstart = {
			setup: function(o) {
				var r, a = e.extend({
						latency: i.scrollstop.latency
					}, o),
					s = function(e) {
						var i = this,
							n = arguments;
						r ? clearTimeout(r) : (e.type = "scrollstart", t.apply(i, n)), r = setTimeout(function() {
							r = null
						}, a.latency)
					};
				e(this).bind("scroll", s).data(n, s)
			},
			teardown: function() {
				e(this).unbind("scroll", e(this).data(n))
			}
		}, i.scrollstop = {
			latency: 250,
			setup: function(n) {
				var r, a = e.extend({
						latency: i.scrollstop.latency
					}, n),
					s = function(e) {
						var i = this,
							n = arguments;
						r && clearTimeout(r), r = setTimeout(function() {
							r = null, e.type = "scrollstop", t.apply(i, n)
						}, a.latency)
					};
				e(this).bind("scroll", s).data(o, s)
			},
			teardown: function() {
				e(this).unbind("scroll", e(this).data(o))
			}
		}
	}),
	function(e) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).SmartBanner = e()
	}(function() {
		return function e(t, i, n) {
			function o(a, s) {
				if (!i[a]) {
					if (!t[a]) {
						var l = "function" == typeof require && require;
						if (!s && l) return l(a, !0);
						if (r) return r(a, !0);
						throw l = Error("Cannot find module '" + a + "'"), l.code = "MODULE_NOT_FOUND", l
					}
					l = i[a] = {
						exports: {}
					}, t[a][0].call(l.exports, function(e) {
						return o(t[a][1][e] || e)
					}, l, l.exports, e, t, i, n)
				}
				return i[a].exports
			}
			for (var r = "function" == typeof require && require, a = 0; a < n.length; a++) o(n[a]);
			return o
		}({
			1: [function(e, t, i) {
				var n = e("xtend/mutable"),
					o = e("component-query"),
					r = e("get-doc"),
					a = e("cookie-cutter"),
					s = e("ua-parser-js"),
					l = (navigator.language || navigator.userLanguage || navigator.browserLanguage).slice(-2) || "us",
					c = r && r.documentElement,
					u = {
						ios: {
							appMeta: "apple-itunes-app",
							iconRels: ["apple-touch-icon-precomposed", "apple-touch-icon"],
							getStoreLink: function() {
								return "https://itunes.apple.com/" + this.options.appStoreLanguage + "/app/id" + this.appId + "?mt=8"
							}
						},
						android: {
							appMeta: "google-play-app",
							iconRels: ["android-touch-icon", "apple-touch-icon-precomposed", "apple-touch-icon"],
							getStoreLink: function() {
								return "http://play.google.com/store/apps/details?id=" + this.appId
							}
						},
						windows: {
							appMeta: "msApplication-ID",
							iconRels: ["windows-touch-icon", "apple-touch-icon-precomposed", "apple-touch-icon"],
							getStoreLink: function() {
								return "http://www.windowsphone.com/s?appid=" + this.appId
							}
						}
					};
				(e = function(e) {
					var t = s(navigator.userAgent);
					this.options = n({}, {
						daysHidden: 15,
						daysReminder: 90,
						appStoreLanguage: l,
						button: "OPEN",
						store: {
							ios: "On the App Store",
							android: "In Google Play",
							windows: "In the Windows Store"
						},
						price: {
							ios: "FREE",
							android: "FREE",
							windows: "FREE"
						},
						theme: "",
						icon: "",
						force: ""
					}, e || {}), this.options.force ? this.type = this.options.force : "Windows Phone" === t.os.name || "Windows Mobile" === t.os.name ? this.type = "windows" : "iOS" === t.os.name ? this.type = "ios" : "Android" === t.os.name && (this.type = "android"), e = !this.type || !this.options.store[this.type];
					var i = "ios" === this.type && "Mobile Safari" === t.browser.name && 6 <= parseInt(t.os.version, 10),
						o = navigator.standalone,
						r = a.get("smartbanner-closed"),
						c = a.get("smartbanner-installed");
					e || i || o || r || c || (n(this, u[this.type]), !this.parseAppId() && "IOS" === t.os.name && "Safari" === t.browser.name) || (this.create(), this.show())
				}).prototype = {
					constructor: e,
					create: function() {
						var e, t = this.getStoreLink(),
							i = this.options.price[this.type] + " - " + this.options.store[this.type];
						if (this.options.icon) e = this.options.icon;
						else
							for (var n = 0; n < this.iconRels.length; n++) {
								var a = o('link[rel="' + this.iconRels[n] + '"]');
								if (a) {
									e = a.getAttribute("href");
									break
								}
							}
						var s = r.createElement("div");
						s.className = "smartbanner smartbanner-" + (this.options.theme || this.type), s.innerHTML = '<div class="smartbanner-container"><a href="javascript:void(0);" class="smartbanner-close">&times;</a><span class="smartbanner-icon" style="background-image: url(' + e + ')"></span><div class="smartbanner-info"><div class="smartbanner-title">' + this.options.title + "</div><div>" + this.options.author + "</div><span>" + i + '</span></div><a href="' + t + '" class="smartbanner-button"><span class="smartbanner-button-text">' + this.options.button + "</span></a></div>", r.body ? r.body.appendChild(s) : r && r.addEventListener("DOMContentLoaded", function() {
							r.body.appendChild(s)
						}), o(".smartbanner-button", s).addEventListener("click", this.install.bind(this), !1), o(".smartbanner-close", s).addEventListener("click", this.close.bind(this), !1)
					},
					hide: function() {
						if (c.classList.remove("smartbanner-show"), "function" == typeof this.options.close) return this.options.close()
					},
					show: function() {
						if (c.classList.add("smartbanner-show"), "function" == typeof this.options.show) return this.options.show()
					},
					close: function() {
						if (this.hide(), a.set("smartbanner-closed", "true", {
								path: "/",
								expires: new Date(Number(new Date) + 864e5 * this.options.daysHidden)
							}), "function" == typeof this.options.close) return this.options.close()
					},
					install: function() {
						if (this.hide(), a.set("smartbanner-installed", "true", {
								path: "/",
								expires: new Date(Number(new Date) + 864e5 * this.options.daysReminder)
							}), "function" == typeof this.options.close) return this.options.close()
					},
					parseAppId: function() {
						var e = o('meta[name="' + this.appMeta + '"]');
						if (e) return this.appId = "windows" === this.type ? e.getAttribute("content") : /app-id=([^\s,]+)/.exec(e.getAttribute("content"))[1]
					}
				}, t.exports = e
			}, {
				"component-query": 2,
				"cookie-cutter": 3,
				"get-doc": 4,
				"ua-parser-js": 6,
				"xtend/mutable": 7
			}],
			2: [function(e, t, i) {
				function n(e, t) {
					return t.querySelector(e)
				}(i = t.exports = function(e, t) {
					return t = t || document, n(e, t)
				}).all = function(e, t) {
					return (t = t || document).querySelectorAll(e)
				}, i.engine = function(e) {
					if (!e.one) throw Error(".one callback required");
					if (!e.all) throw Error(".all callback required");
					return n = e.one, i.all = e.all, i
				}
			}, {}],
			3: [function(e, t, i) {
				i = t.exports = function(e) {
					return e || (e = {}), "string" == typeof e && (e = {
						cookie: e
					}), void 0 === e.cookie && (e.cookie = ""), {
						get: function(t) {
							for (var i = e.cookie.split(/;\s*/), n = 0; n < i.length; n++) {
								var o = i[n].split("=");
								if (unescape(o[0]) === t) return unescape(o[1])
							}
						},
						set: function(t, i, n) {
							return n || (n = {}), t = escape(t) + "=" + escape(i), n.expires && (t += "; expires=" + n.expires), n.path && (t += "; path=" + escape(n.path)), e.cookie = t
						}
					}
				}, void 0 !== document && (e = i(document), i.get = e.get, i.set = e.set)
			}, {}],
			4: [function(e, t, i) {
				e = e("has-dom"), t.exports = e() ? document : null
			}, {
				"has-dom": 5
			}],
			5: [function(e, t, i) {
				t.exports = function() {
					return "undefined" != typeof window && void 0 !== document && "function" == typeof document.createElement
				}
			}, {}],
			6: [function(e, t, i) {
				! function(e, n) {
					var o = {
							extend: function(e, t) {
								var i, n = {};
								for (i in e) n[i] = t[i] && 0 == t[i].length % 2 ? t[i].concat(e[i]) : e[i];
								return n
							},
							has: function(e, t) {
								return "string" == typeof e && -1 !== t.toLowerCase().indexOf(e.toLowerCase())
							},
							lowerize: function(e) {
								return e.toLowerCase()
							},
							major: function(e) {
								return "string" == typeof e ? e.split(".")[0] : n
							},
							trim: function(e) {
								return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
							}
						},
						r = function() {
							for (var e, t, i, o, r, a, s, l = 0, c = arguments; l < c.length && !a;) {
								var u = c[l],
									h = c[l + 1];
								if (void 0 === e)
									for (o in e = {}, h) h.hasOwnProperty(o) && ("object" == typeof(r = h[o]) ? e[r[0]] = n : e[r] = n);
								for (t = i = 0; t < u.length && !a;)
									if (a = u[t++].exec(this.getUA()))
										for (o = 0; o < h.length; o++) s = a[++i], "object" == typeof(r = h[o]) && 0 < r.length ? 2 == r.length ? e[r[0]] = "function" == typeof r[1] ? r[1].call(this, s) : r[1] : 3 == r.length ? e[r[0]] = "function" != typeof r[1] || r[1].exec && r[1].test ? s ? s.replace(r[1], r[2]) : n : s ? r[1].call(this, s, r[2]) : n : 4 == r.length && (e[r[0]] = s ? r[3].call(this, s.replace(r[1], r[2])) : n) : e[r] = s || n;
								l += 2
							}
							return e
						},
						a = function(e, t) {
							for (var i in t)
								if ("object" == typeof t[i] && 0 < t[i].length) {
									for (var r = 0; r < t[i].length; r++)
										if (o.has(t[i][r], e)) return "?" === i ? n : i
								}
							else if (o.has(t[i], e)) return "?" === i ? n : i;
							return e
						},
						s = {
							ME: "4.90",
							"NT 3.11": "NT3.51",
							"NT 4.0": "NT4.0",
							2e3: "NT 5.0",
							XP: ["NT 5.1", "NT 5.2"],
							Vista: "NT 6.0",
							7: "NT 6.1",
							8: "NT 6.2",
							8.1: "NT 6.3",
							10: ["NT 6.4", "NT 10.0"],
							RT: "ARM"
						},
						l = {
							browser: [
								[/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i],
								["name", "version"],
								[/(OPiOS)[\/\s]+([\w\.]+)/i],
								[
									["name", "Opera Mini"], "version"
								],
								[/\s(opr)\/([\w\.]+)/i],
								[
									["name", "Opera"], "version"
								],
								[/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i],
								["name", "version"],
								[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
								[
									["name", "IE"], "version"
								],
								[/(edge)\/((\d+)?[\w\.]+)/i],
								["name", "version"],
								[/(yabrowser)\/([\w\.]+)/i],
								[
									["name", "Yandex"], "version"
								],
								[/(comodo_dragon)\/([\w\.]+)/i],
								[
									["name", /_/g, " "], "version"
								],
								[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
								["name", "version"],
								[/(MicroMessenger)\/([\w\.]+)/i],
								[
									["name", "WeChat"], "version"
								],
								[/(qqbrowser)[\/\s]?([\w\.]+)/i],
								["name", "version"],
								[/(uc\s?browser)[\/\s]?([\w\.]+)/i, /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i, /JUC.+(ucweb)[\/\s]?([\w\.]+)/i],
								[
									["name", "UCBrowser"], "version"
								],
								[/(dolfin)\/([\w\.]+)/i],
								[
									["name", "Dolphin"], "version"
								],
								[/((?:android.+)crmo|crios)\/([\w\.]+)/i],
								[
									["name", "Chrome"], "version"
								],
								[/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],
								["version", ["name", "MIUI Browser"]],
								[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],
								["version", ["name", "Android Browser"]],
								[/FBAV\/([\w\.]+);/i],
								["version", ["name", "Facebook"]],
								[/fxios\/([\w\.-]+)/i],
								["version", ["name", "Firefox"]],
								[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
								["version", ["name", "Mobile Safari"]],
								[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
								["version", "name"],
								[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
								["name", ["version", a, {
									"1.0": "/8",
									1.2: "/1",
									1.3: "/3",
									"2.0": "/412",
									"2.0.2": "/416",
									"2.0.3": "/417",
									"2.0.4": "/419",
									"?": "/"
								}]],
								[/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i],
								["name", "version"],
								[/(navigator|netscape)\/([\w\.-]+)/i],
								[
									["name", "Netscape"], "version"
								],
								[/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]+)*/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i],
								["name", "version"]
							],
							cpu: [
								[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
								[
									["architecture", "amd64"]
								],
								[/(ia32(?=;))/i],
								[
									["architecture", o.lowerize]
								],
								[/((?:i[346]|x)86)[;\)]/i],
								[
									["architecture", "ia32"]
								],
								[/windows\s(ce|mobile);\sppc;/i],
								[
									["architecture", "arm"]
								],
								[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
								[
									["architecture", /ower/, "", o.lowerize]
								],
								[/(sun4\w)[;\)]/i],
								[
									["architecture", "sparc"]
								],
								[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
								[
									["architecture", o.lowerize]
								]
							],
							device: [
								[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
								[
									["vendor", o.trim],
									["model", o.trim],
									["type", "smarttv"]
								],
								[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
								["model", "vendor", ["type", "tablet"]],
								[/applecoremedia\/[\w\.]+ \((ipad)/],
								["model", ["vendor", "Apple"],
									["type", "tablet"]
								],
								[/(apple\s{0,1}tv)/i],
								[
									["model", "Apple TV"],
									["vendor", "Apple"]
								],
								[/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(hp).+(tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
								["vendor", "model", ["type", "tablet"]],
								[/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],
								["model", ["vendor", "Amazon"],
									["type", "tablet"]
								],
								[/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],
								[
									["model", a, {
										"Fire Phone": ["SD", "KF"]
									}],
									["vendor", "Amazon"],
									["type", "mobile"]
								],
								[/\((ip[honed|\s\w*]+);.+(apple)/i],
								["model", "vendor", ["type", "mobile"]],
								[/\((ip[honed|\s\w*]+);/i],
								["model", ["vendor", "Apple"],
									["type", "mobile"]
								],
								[/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
								["vendor", "model", ["type", "mobile"]],
								[/\(bb10;\s(\w+)/i],
								["model", ["vendor", "BlackBerry"],
									["type", "mobile"]
								],
								[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i],
								["model", ["vendor", "Asus"],
									["type", "tablet"]
								],
								[/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
								[
									["vendor", "Sony"],
									["model", "Xperia Tablet"],
									["type", "tablet"]
								],
								[/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],
								[
									["vendor", "Sony"],
									["model", "Xperia Phone"],
									["type", "mobile"]
								],
								[/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
								["vendor", "model", ["type", "console"]],
								[/android.+;\s(shield)\sbuild/i],
								["model", ["vendor", "Nvidia"],
									["type", "console"]
								],
								[/(playstation\s[34portablevi]+)/i],
								["model", ["vendor", "Sony"],
									["type", "console"]
								],
								[/(sprint\s(\w+))/i],
								[
									["vendor", a, {
										HTC: "APA",
										Sprint: "Sprint"
									}],
									["model", a, {
										"Evo Shift 4G": "7373KT"
									}],
									["type", "mobile"]
								],
								[/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],
								["vendor", "model", ["type", "tablet"]],
								[/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],
								["vendor", ["model", /_/g, " "],
									["type", "mobile"]
								],
								[/(nexus\s9)/i],
								["model", ["vendor", "HTC"],
									["type", "tablet"]
								],
								[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
								["model", ["vendor", "Microsoft"],
									["type", "console"]
								],
								[/(kin\.[onetw]{3})/i],
								[
									["model", /\./g, " "],
									["vendor", "Microsoft"],
									["type", "mobile"]
								],
								[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w+)*/i, /(XT\d{3,4}) build\//i, /(nexus\s[6])/i],
								["model", ["vendor", "Motorola"],
									["type", "mobile"]
								],
								[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
								["model", ["vendor", "Motorola"],
									["type", "tablet"]
								],
								[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i],
								[
									["vendor", "Samsung"], "model", ["type", "tablet"]
								],
								[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i],
								[
									["vendor", "Samsung"], "model", ["type", "mobile"]
								],
								[/hbbtv.+maple;(\d+)/i],
								[
									["model", /^/, "SmartTV"],
									["vendor", "Samsung"],
									["type", "smarttv"]
								],
								[/\(dtv[\);].+(aquos)/i],
								["model", ["vendor", "Sharp"],
									["type", "smarttv"]
								],
								[/sie-(\w+)*/i],
								["model", ["vendor", "Siemens"],
									["type", "mobile"]
								],
								[/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
								[
									["vendor", "Nokia"], "model", ["type", "mobile"]
								],
								[/android\s3\.[\s\w;-]{10}(a\d{3})/i],
								["model", ["vendor", "Acer"],
									["type", "tablet"]
								],
								[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
								[
									["vendor", "LG"], "model", ["type", "tablet"]
								],
								[/(lg) netcast\.tv/i],
								["vendor", "model", ["type", "smarttv"]],
								[/(nexus\s[45])/i, /lg[e;\s\/-]+(\w+)*/i],
								["model", ["vendor", "LG"],
									["type", "mobile"]
								],
								[/android.+(ideatab[a-z0-9\-\s]+)/i],
								["model", ["vendor", "Lenovo"],
									["type", "tablet"]
								],
								[/linux;.+((jolla));/i],
								["vendor", "model", ["type", "mobile"]],
								[/((pebble))app\/[\d\.]+\s/i],
								["vendor", "model", ["type", "wearable"]],
								[/android.+;\s(glass)\s\d/i],
								["model", ["vendor", "Google"],
									["type", "wearable"]
								],
								[/android.+(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i],
								[
									["model", /_/g, " "],
									["vendor", "Xiaomi"],
									["type", "mobile"]
								],
								[/\s(tablet)[;\/]/i, /\s(mobile)[;\/]/i],
								[
									["type", o.lowerize], "vendor", "model"
								]
							],
							engine: [
								[/windows.+\sedge\/([\w\.]+)/i],
								["version", ["name", "EdgeHTML"]],
								[/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
								["name", "version"],
								[/rv\:([\w\.]+).*(gecko)/i],
								["version", "name"]
							],
							os: [
								[/microsoft\s(windows)\s(vista|xp)/i],
								["name", "version"],
								[/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
								["name", ["version", a, s]],
								[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
								[
									["name", "Windows"],
									["version", a, s]
								],
								[/\((bb)(10);/i],
								[
									["name", "BlackBerry"], "version"
								],
								[/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i, /linux;.+(sailfish);/i],
								["name", "version"],
								[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
								[
									["name", "Symbian"], "version"
								],
								[/\((series40);/i],
								["name"],
								[/mozilla.+\(mobile;.+gecko.+firefox/i],
								[
									["name", "Firefox OS"], "version"
								],
								[/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i],
								["name", "version"],
								[/(cros)\s[\w]+\s([\w\.]+\w)/i],
								[
									["name", "Chromium OS"], "version"
								],
								[/(sunos)\s?([\w\.]+\d)*/i],
								[
									["name", "Solaris"], "version"
								],
								[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
								["name", "version"],
								[/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],
								[
									["name", "iOS"],
									["version", /_/g, "."]
								],
								[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i],
								[
									["name", "Mac OS"],
									["version", /_/g, "."]
								],
								[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, /(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, /(unix)\s?([\w\.]+)*/i],
								["name", "version"]
							]
						},
						c = function(t, i) {
							if (!(this instanceof c)) return new c(t, i).getResult();
							var n = t || (e && e.navigator && e.navigator.userAgent ? e.navigator.userAgent : ""),
								a = i ? o.extend(l, i) : l;
							return this.getBrowser = function() {
								var e = r.apply(this, a.browser);
								return e.major = o.major(e.version), e
							}, this.getCPU = function() {
								return r.apply(this, a.cpu)
							}, this.getDevice = function() {
								return r.apply(this, a.device)
							}, this.getEngine = function() {
								return r.apply(this, a.engine)
							}, this.getOS = function() {
								return r.apply(this, a.os)
							}, this.getResult = function() {
								return {
									ua: this.getUA(),
									browser: this.getBrowser(),
									engine: this.getEngine(),
									os: this.getOS(),
									device: this.getDevice(),
									cpu: this.getCPU()
								}
							}, this.getUA = function() {
								return n
							}, this.setUA = function(e) {
								return n = e, this
							}, this
						};
					c.VERSION = "0.7.11", c.BROWSER = {
						NAME: "name",
						MAJOR: "major",
						VERSION: "version"
					}, c.CPU = {
						ARCHITECTURE: "architecture"
					}, c.DEVICE = {
						MODEL: "model",
						VENDOR: "vendor",
						TYPE: "type",
						CONSOLE: "console",
						MOBILE: "mobile",
						SMARTTV: "smarttv",
						TABLET: "tablet",
						WEARABLE: "wearable",
						EMBEDDED: "embedded"
					}, c.ENGINE = {
						NAME: "name",
						VERSION: "version"
					}, c.OS = {
						NAME: "name",
						VERSION: "version"
					}, void 0 !== i ? (void 0 !== t && t.exports && (i = t.exports = c), i.UAParser = c) : e.UAParser = c;
					var u = e.jQuery || e.Zepto;
					if (void 0 !== u) {
						var h = new c;
						u.ua = h.getResult(), u.ua.get = function() {
							return h.getUA()
						}, u.ua.set = function(e) {
							h.setUA(e), e = h.getResult();
							for (var t in e) u.ua[t] = e[t]
						}
					}
				}("object" == typeof window ? window : this)
			}, {}],
			7: [function(e, t, i) {
				t.exports = function(e) {
					for (var t = 1; t < arguments.length; t++) {
						var i, o = arguments[t];
						for (i in o) n.call(o, i) && (e[i] = o[i])
					}
					return e
				};
				var n = Object.prototype.hasOwnProperty
			}, {}]
		}, {}, [1])(1)
	}),
	function() {
		function e(e) {
			function t(t, i, n, o, r, a) {
				for (; r >= 0 && r < a; r += e) {
					var s = o ? o[r] : r;
					n = i(n, t[s], s, t)
				}
				return n
			}
			return function(i, n, o, r) {
				n = _(n, r, 4);
				var a = !S(i) && y.keys(i),
					s = (a || i).length,
					l = e > 0 ? 0 : s - 1;
				return arguments.length < 3 && (o = i[a ? a[l] : l], l += e), t(i, n, o, a, l, s)
			}
		}

		function t(e) {
			return function(t, i, n) {
				i = b(i, n);
				for (var o = C(t), r = e > 0 ? 0 : o - 1; r >= 0 && r < o; r += e)
					if (i(t[r], r, t)) return r;
				return -1
			}
		}

		function i(e, t, i) {
			return function(n, o, r) {
				var a = 0,
					s = C(n);
				if ("number" == typeof r) e > 0 ? a = r >= 0 ? r : Math.max(r + s, a) : s = r >= 0 ? Math.min(r + 1, s) : r + s + 1;
				else if (i && r && s) return r = i(n, o), n[r] === o ? r : -1;
				if (o !== o) return (r = t(u.call(n, a, s), y.isNaN)) >= 0 ? r + a : -1;
				for (r = e > 0 ? a : s - 1; r >= 0 && r < s; r += e)
					if (n[r] === o) return r;
				return -1
			}
		}

		function n(e, t) {
			var i = $.length,
				n = e.constructor,
				o = y.isFunction(n) && n.prototype || s,
				r = "constructor";
			for (y.has(e, r) && !y.contains(t, r) && t.push(r); i--;)(r = $[i]) in e && e[r] !== o[r] && !y.contains(t, r) && t.push(r)
		}
		var o = this,
			r = o._,
			a = Array.prototype,
			s = Object.prototype,
			l = Function.prototype,
			c = a.push,
			u = a.slice,
			h = s.toString,
			d = s.hasOwnProperty,
			p = Array.isArray,
			f = Object.keys,
			m = l.bind,
			g = Object.create,
			v = function() {},
			y = function(e) {
				return e instanceof y ? e : this instanceof y ? void(this._wrapped = e) : new y(e)
			};
		"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = y), exports._ = y) : o._ = y, y.VERSION = "1.8.3";
		var _ = function(e, t, i) {
				if (void 0 === t) return e;
				switch (null == i ? 3 : i) {
					case 1:
						return function(i) {
							return e.call(t, i)
						};
					case 2:
						return function(i, n) {
							return e.call(t, i, n)
						};
					case 3:
						return function(i, n, o) {
							return e.call(t, i, n, o)
						};
					case 4:
						return function(i, n, o, r) {
							return e.call(t, i, n, o, r)
						}
				}
				return function() {
					return e.apply(t, arguments)
				}
			},
			b = function(e, t, i) {
				return null == e ? y.identity : y.isFunction(e) ? _(e, t, i) : y.isObject(e) ? y.matcher(e) : y.property(e)
			};
		y.iteratee = function(e, t) {
			return b(e, t, 1 / 0)
		};
		var w = function(e, t) {
				return function(i) {
					var n = arguments.length;
					if (n < 2 || null == i) return i;
					for (var o = 1; o < n; o++)
						for (var r = arguments[o], a = e(r), s = a.length, l = 0; l < s; l++) {
							var c = a[l];
							t && void 0 !== i[c] || (i[c] = r[c])
						}
					return i
				}
			},
			x = function(e) {
				if (!y.isObject(e)) return {};
				if (g) return g(e);
				v.prototype = e;
				var t = new v;
				return v.prototype = null, t
			},
			T = function(e) {
				return function(t) {
					return null == t ? void 0 : t[e]
				}
			},
			k = Math.pow(2, 53) - 1,
			C = T("length"),
			S = function(e) {
				var t = C(e);
				return "number" == typeof t && t >= 0 && t <= k
			};
		y.each = y.forEach = function(e, t, i) {
			t = _(t, i);
			var n, o;
			if (S(e))
				for (n = 0, o = e.length; n < o; n++) t(e[n], n, e);
			else {
				var r = y.keys(e);
				for (n = 0, o = r.length; n < o; n++) t(e[r[n]], r[n], e)
			}
			return e
		}, y.map = y.collect = function(e, t, i) {
			t = b(t, i);
			for (var n = !S(e) && y.keys(e), o = (n || e).length, r = Array(o), a = 0; a < o; a++) {
				var s = n ? n[a] : a;
				r[a] = t(e[s], s, e)
			}
			return r
		}, y.reduce = y.foldl = y.inject = e(1), y.reduceRight = y.foldr = e(-1), y.find = y.detect = function(e, t, i) {
			var n;
			if (void 0 !== (n = S(e) ? y.findIndex(e, t, i) : y.findKey(e, t, i)) && -1 !== n) return e[n]
		}, y.filter = y.select = function(e, t, i) {
			var n = [];
			return t = b(t, i), y.each(e, function(e, i, o) {
				t(e, i, o) && n.push(e)
			}), n
		}, y.reject = function(e, t, i) {
			return y.filter(e, y.negate(b(t)), i)
		}, y.every = y.all = function(e, t, i) {
			t = b(t, i);
			for (var n = !S(e) && y.keys(e), o = (n || e).length, r = 0; r < o; r++) {
				var a = n ? n[r] : r;
				if (!t(e[a], a, e)) return !1
			}
			return !0
		}, y.some = y.any = function(e, t, i) {
			t = b(t, i);
			for (var n = !S(e) && y.keys(e), o = (n || e).length, r = 0; r < o; r++) {
				var a = n ? n[r] : r;
				if (t(e[a], a, e)) return !0
			}
			return !1
		}, y.contains = y.includes = y.include = function(e, t, i, n) {
			return S(e) || (e = y.values(e)), ("number" != typeof i || n) && (i = 0), y.indexOf(e, t, i) >= 0
		}, y.invoke = function(e, t) {
			var i = u.call(arguments, 2),
				n = y.isFunction(t);
			return y.map(e, function(e) {
				var o = n ? t : e[t];
				return null == o ? o : o.apply(e, i)
			})
		}, y.pluck = function(e, t) {
			return y.map(e, y.property(t))
		}, y.where = function(e, t) {
			return y.filter(e, y.matcher(t))
		}, y.findWhere = function(e, t) {
			return y.find(e, y.matcher(t))
		}, y.max = function(e, t, i) {
			var n, o, r = -1 / 0,
				a = -1 / 0;
			if (null == t && null != e)
				for (var s = 0, l = (e = S(e) ? e : y.values(e)).length; s < l; s++)(n = e[s]) > r && (r = n);
			else t = b(t, i), y.each(e, function(e, i, n) {
				((o = t(e, i, n)) > a || o === -1 / 0 && r === -1 / 0) && (r = e, a = o)
			});
			return r
		}, y.min = function(e, t, i) {
			var n, o, r = 1 / 0,
				a = 1 / 0;
			if (null == t && null != e)
				for (var s = 0, l = (e = S(e) ? e : y.values(e)).length; s < l; s++)(n = e[s]) < r && (r = n);
			else t = b(t, i), y.each(e, function(e, i, n) {
				((o = t(e, i, n)) < a || o === 1 / 0 && r === 1 / 0) && (r = e, a = o)
			});
			return r
		}, y.shuffle = function(e) {
			for (var t, i = S(e) ? e : y.values(e), n = i.length, o = Array(n), r = 0; r < n; r++)(t = y.random(0, r)) !== r && (o[r] = o[t]), o[t] = i[r];
			return o
		}, y.sample = function(e, t, i) {
			return null == t || i ? (S(e) || (e = y.values(e)), e[y.random(e.length - 1)]) : y.shuffle(e).slice(0, Math.max(0, t))
		}, y.sortBy = function(e, t, i) {
			return t = b(t, i), y.pluck(y.map(e, function(e, i, n) {
				return {
					value: e,
					index: i,
					criteria: t(e, i, n)
				}
			}).sort(function(e, t) {
				var i = e.criteria,
					n = t.criteria;
				if (i !== n) {
					if (i > n || void 0 === i) return 1;
					if (i < n || void 0 === n) return -1
				}
				return e.index - t.index
			}), "value")
		};
		var A = function(e) {
			return function(t, i, n) {
				var o = {};
				return i = b(i, n), y.each(t, function(n, r) {
					var a = i(n, r, t);
					e(o, n, a)
				}), o
			}
		};
		y.groupBy = A(function(e, t, i) {
			y.has(e, i) ? e[i].push(t) : e[i] = [t]
		}), y.indexBy = A(function(e, t, i) {
			e[i] = t
		}), y.countBy = A(function(e, t, i) {
			y.has(e, i) ? e[i]++ : e[i] = 1
		}), y.toArray = function(e) {
			return e ? y.isArray(e) ? u.call(e) : S(e) ? y.map(e, y.identity) : y.values(e) : []
		}, y.size = function(e) {
			return null == e ? 0 : S(e) ? e.length : y.keys(e).length
		}, y.partition = function(e, t, i) {
			t = b(t, i);
			var n = [],
				o = [];
			return y.each(e, function(e, i, r) {
				(t(e, i, r) ? n : o).push(e)
			}), [n, o]
		}, y.first = y.head = y.take = function(e, t, i) {
			if (null != e) return null == t || i ? e[0] : y.initial(e, e.length - t)
		}, y.initial = function(e, t, i) {
			return u.call(e, 0, Math.max(0, e.length - (null == t || i ? 1 : t)))
		}, y.last = function(e, t, i) {
			if (null != e) return null == t || i ? e[e.length - 1] : y.rest(e, Math.max(0, e.length - t))
		}, y.rest = y.tail = y.drop = function(e, t, i) {
			return u.call(e, null == t || i ? 1 : t)
		}, y.compact = function(e) {
			return y.filter(e, y.identity)
		};
		var E = function(e, t, i, n) {
			for (var o = [], r = 0, a = n || 0, s = C(e); a < s; a++) {
				var l = e[a];
				if (S(l) && (y.isArray(l) || y.isArguments(l))) {
					t || (l = E(l, t, i));
					var c = 0,
						u = l.length;
					for (o.length += u; c < u;) o[r++] = l[c++]
				}
				else i || (o[r++] = l)
			}
			return o
		};
		y.flatten = function(e, t) {
			return E(e, t, !1)
		}, y.without = function(e) {
			return y.difference(e, u.call(arguments, 1))
		}, y.uniq = y.unique = function(e, t, i, n) {
			y.isBoolean(t) || (n = i, i = t, t = !1), null != i && (i = b(i, n));
			for (var o = [], r = [], a = 0, s = C(e); a < s; a++) {
				var l = e[a],
					c = i ? i(l, a, e) : l;
				t ? (a && r === c || o.push(l), r = c) : i ? y.contains(r, c) || (r.push(c), o.push(l)) : y.contains(o, l) || o.push(l)
			}
			return o
		}, y.union = function() {
			return y.uniq(E(arguments, !0, !0))
		}, y.intersection = function(e) {
			for (var t = [], i = arguments.length, n = 0, o = C(e); n < o; n++) {
				var r = e[n];
				if (!y.contains(t, r)) {
					for (var a = 1; a < i && y.contains(arguments[a], r); a++);
					a === i && t.push(r)
				}
			}
			return t
		}, y.difference = function(e) {
			var t = E(arguments, !0, !0, 1);
			return y.filter(e, function(e) {
				return !y.contains(t, e)
			})
		}, y.zip = function() {
			return y.unzip(arguments)
		}, y.unzip = function(e) {
			for (var t = e && y.max(e, C).length || 0, i = Array(t), n = 0; n < t; n++) i[n] = y.pluck(e, n);
			return i
		}, y.object = function(e, t) {
			for (var i = {}, n = 0, o = C(e); n < o; n++) t ? i[e[n]] = t[n] : i[e[n][0]] = e[n][1];
			return i
		}, y.findIndex = t(1), y.findLastIndex = t(-1), y.sortedIndex = function(e, t, i, n) {
			for (var o = (i = b(i, n, 1))(t), r = 0, a = C(e); r < a;) {
				var s = Math.floor((r + a) / 2);
				i(e[s]) < o ? r = s + 1 : a = s
			}
			return r
		}, y.indexOf = i(1, y.findIndex, y.sortedIndex), y.lastIndexOf = i(-1, y.findLastIndex), y.range = function(e, t, i) {
			null == t && (t = e || 0, e = 0), i = i || 1;
			for (var n = Math.max(Math.ceil((t - e) / i), 0), o = Array(n), r = 0; r < n; r++, e += i) o[r] = e;
			return o
		};
		var P = function(e, t, i, n, o) {
			if (!(n instanceof t)) return e.apply(i, o);
			var r = x(e.prototype),
				a = e.apply(r, o);
			return y.isObject(a) ? a : r
		};
		y.bind = function(e, t) {
			if (m && e.bind === m) return m.apply(e, u.call(arguments, 1));
			if (!y.isFunction(e)) throw new TypeError("Bind must be called on a function");
			var i = u.call(arguments, 2),
				n = function() {
					return P(e, n, t, this, i.concat(u.call(arguments)))
				};
			return n
		}, y.partial = function(e) {
			var t = u.call(arguments, 1),
				i = function() {
					for (var n = 0, o = t.length, r = Array(o), a = 0; a < o; a++) r[a] = t[a] === y ? arguments[n++] : t[a];
					for (; n < arguments.length;) r.push(arguments[n++]);
					return P(e, i, this, this, r)
				};
			return i
		}, y.bindAll = function(e) {
			var t, i, n = arguments.length;
			if (n <= 1) throw new Error("bindAll must be passed function names");
			for (t = 1; t < n; t++) e[i = arguments[t]] = y.bind(e[i], e);
			return e
		}, y.memoize = function(e, t) {
			var i = function(n) {
				var o = i.cache,
					r = "" + (t ? t.apply(this, arguments) : n);
				return y.has(o, r) || (o[r] = e.apply(this, arguments)), o[r]
			};
			return i.cache = {}, i
		}, y.delay = function(e, t) {
			var i = u.call(arguments, 2);
			return setTimeout(function() {
				return e.apply(null, i)
			}, t)
		}, y.defer = y.partial(y.delay, y, 1), y.throttle = function(e, t, i) {
			var n, o, r, a = null,
				s = 0;
			i || (i = {});
			var l = function() {
				s = !1 === i.leading ? 0 : y.now(), a = null, r = e.apply(n, o), a || (n = o = null)
			};
			return function() {
				var c = y.now();
				s || !1 !== i.leading || (s = c);
				var u = t - (c - s);
				return n = this, o = arguments, u <= 0 || u > t ? (a && (clearTimeout(a), a = null), s = c, r = e.apply(n, o), a || (n = o = null)) : a || !1 === i.trailing || (a = setTimeout(l, u)), r
			}
		}, y.debounce = function(e, t, i) {
			var n, o, r, a, s, l = function() {
				var c = y.now() - a;
				c < t && c >= 0 ? n = setTimeout(l, t - c) : (n = null, i || (s = e.apply(r, o), n || (r = o = null)))
			};
			return function() {
				r = this, o = arguments, a = y.now();
				var c = i && !n;
				return n || (n = setTimeout(l, t)), c && (s = e.apply(r, o), r = o = null), s
			}
		}, y.wrap = function(e, t) {
			return y.partial(t, e)
		}, y.negate = function(e) {
			return function() {
				return !e.apply(this, arguments)
			}
		}, y.compose = function() {
			var e = arguments,
				t = e.length - 1;
			return function() {
				for (var i = t, n = e[t].apply(this, arguments); i--;) n = e[i].call(this, n);
				return n
			}
		}, y.after = function(e, t) {
			return function() {
				if (--e < 1) return t.apply(this, arguments)
			}
		}, y.before = function(e, t) {
			var i;
			return function() {
				return --e > 0 && (i = t.apply(this, arguments)), e <= 1 && (t = null), i
			}
		}, y.once = y.partial(y.before, 2);
		var O = !{
				toString: null
			}.propertyIsEnumerable("toString"),
			$ = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
		y.keys = function(e) {
			if (!y.isObject(e)) return [];
			if (f) return f(e);
			var t = [];
			for (var i in e) y.has(e, i) && t.push(i);
			return O && n(e, t), t
		}, y.allKeys = function(e) {
			if (!y.isObject(e)) return [];
			var t = [];
			for (var i in e) t.push(i);
			return O && n(e, t), t
		}, y.values = function(e) {
			for (var t = y.keys(e), i = t.length, n = Array(i), o = 0; o < i; o++) n[o] = e[t[o]];
			return n
		}, y.mapObject = function(e, t, i) {
			t = b(t, i);
			for (var n, o = y.keys(e), r = o.length, a = {}, s = 0; s < r; s++) a[n = o[s]] = t(e[n], n, e);
			return a
		}, y.pairs = function(e) {
			for (var t = y.keys(e), i = t.length, n = Array(i), o = 0; o < i; o++) n[o] = [t[o], e[t[o]]];
			return n
		}, y.invert = function(e) {
			for (var t = {}, i = y.keys(e), n = 0, o = i.length; n < o; n++) t[e[i[n]]] = i[n];
			return t
		}, y.functions = y.methods = function(e) {
			var t = [];
			for (var i in e) y.isFunction(e[i]) && t.push(i);
			return t.sort()
		}, y.extend = w(y.allKeys), y.extendOwn = y.assign = w(y.keys), y.findKey = function(e, t, i) {
			t = b(t, i);
			for (var n, o = y.keys(e), r = 0, a = o.length; r < a; r++)
				if (n = o[r], t(e[n], n, e)) return n
		}, y.pick = function(e, t, i) {
			var n, o, r = {},
				a = e;
			if (null == a) return r;
			y.isFunction(t) ? (o = y.allKeys(a), n = _(t, i)) : (o = E(arguments, !1, !1, 1), n = function(e, t, i) {
				return t in i
			}, a = Object(a));
			for (var s = 0, l = o.length; s < l; s++) {
				var c = o[s],
					u = a[c];
				n(u, c, a) && (r[c] = u)
			}
			return r
		}, y.omit = function(e, t, i) {
			if (y.isFunction(t)) t = y.negate(t);
			else {
				var n = y.map(E(arguments, !1, !1, 1), String);
				t = function(e, t) {
					return !y.contains(n, t)
				}
			}
			return y.pick(e, t, i)
		}, y.defaults = w(y.allKeys, !0), y.create = function(e, t) {
			var i = x(e);
			return t && y.extendOwn(i, t), i
		}, y.clone = function(e) {
			return y.isObject(e) ? y.isArray(e) ? e.slice() : y.extend({}, e) : e
		}, y.tap = function(e, t) {
			return t(e), e
		}, y.isMatch = function(e, t) {
			var i = y.keys(t),
				n = i.length;
			if (null == e) return !n;
			for (var o = Object(e), r = 0; r < n; r++) {
				var a = i[r];
				if (t[a] !== o[a] || !(a in o)) return !1
			}
			return !0
		};
		var M = function(e, t, i, n) {
			if (e === t) return 0 !== e || 1 / e == 1 / t;
			if (null == e || null == t) return e === t;
			e instanceof y && (e = e._wrapped), t instanceof y && (t = t._wrapped);
			var o = h.call(e);
			if (o !== h.call(t)) return !1;
			switch (o) {
				case "[object RegExp]":
				case "[object String]":
					return "" + e == "" + t;
				case "[object Number]":
					return +e != +e ? +t != +t : 0 == +e ? 1 / +e == 1 / t : +e == +t;
				case "[object Date]":
				case "[object Boolean]":
					return +e == +t
			}
			var r = "[object Array]" === o;
			if (!r) {
				if ("object" != typeof e || "object" != typeof t) return !1;
				var a = e.constructor,
					s = t.constructor;
				if (a !== s && !(y.isFunction(a) && a instanceof a && y.isFunction(s) && s instanceof s) && "constructor" in e && "constructor" in t) return !1
			}
			i = i || [], n = n || [];
			for (var l = i.length; l--;)
				if (i[l] === e) return n[l] === t;
			if (i.push(e), n.push(t), r) {
				if ((l = e.length) !== t.length) return !1;
				for (; l--;)
					if (!M(e[l], t[l], i, n)) return !1
			}
			else {
				var c, u = y.keys(e);
				if (l = u.length, y.keys(t).length !== l) return !1;
				for (; l--;)
					if (c = u[l], !y.has(t, c) || !M(e[c], t[c], i, n)) return !1
			}
			return i.pop(), n.pop(), !0
		};
		y.isEqual = function(e, t) {
			return M(e, t)
		}, y.isEmpty = function(e) {
			return null == e || (S(e) && (y.isArray(e) || y.isString(e) || y.isArguments(e)) ? 0 === e.length : 0 === y.keys(e).length)
		}, y.isElement = function(e) {
			return !(!e || 1 !== e.nodeType)
		}, y.isArray = p || function(e) {
			return "[object Array]" === h.call(e)
		}, y.isObject = function(e) {
			var t = typeof e;
			return "function" === t || "object" === t && !!e
		}, y.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(e) {
			y["is" + e] = function(t) {
				return h.call(t) === "[object " + e + "]"
			}
		}), y.isArguments(arguments) || (y.isArguments = function(e) {
			return y.has(e, "callee")
		}), "function" != typeof /./ && "object" != typeof Int8Array && (y.isFunction = function(e) {
			return "function" == typeof e || !1
		}), y.isFinite = function(e) {
			return isFinite(e) && !isNaN(parseFloat(e))
		}, y.isNaN = function(e) {
			return y.isNumber(e) && e !== +e
		}, y.isBoolean = function(e) {
			return !0 === e || !1 === e || "[object Boolean]" === h.call(e)
		}, y.isNull = function(e) {
			return null === e
		}, y.isUndefined = function(e) {
			return void 0 === e
		}, y.has = function(e, t) {
			return null != e && d.call(e, t)
		}, y.noConflict = function() {
			return o._ = r, this
		}, y.identity = function(e) {
			return e
		}, y.constant = function(e) {
			return function() {
				return e
			}
		}, y.noop = function() {}, y.property = T, y.propertyOf = function(e) {
			return null == e ? function() {} : function(t) {
				return e[t]
			}
		}, y.matcher = y.matches = function(e) {
			return e = y.extendOwn({}, e),
				function(t) {
					return y.isMatch(t, e)
				}
		}, y.times = function(e, t, i) {
			var n = Array(Math.max(0, e));
			t = _(t, i, 1);
			for (var o = 0; o < e; o++) n[o] = t(o);
			return n
		}, y.random = function(e, t) {
			return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
		}, y.now = Date.now || function() {
			return (new Date).getTime()
		};
		var D = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#x27;",
				"`": "&#x60;"
			},
			z = y.invert(D),
			L = function(e) {
				var t = function(t) {
						return e[t]
					},
					i = "(?:" + y.keys(e).join("|") + ")",
					n = RegExp(i),
					o = RegExp(i, "g");
				return function(e) {
					return e = null == e ? "" : "" + e, n.test(e) ? e.replace(o, t) : e
				}
			};
		y.escape = L(D), y.unescape = L(z), y.result = function(e, t, i) {
			var n = null == e ? void 0 : e[t];
			return void 0 === n && (n = i), y.isFunction(n) ? n.call(e) : n
		};
		var I = 0;
		y.uniqueId = function(e) {
			var t = ++I + "";
			return e ? e + t : t
		}, y.templateSettings = {
			evaluate: /<%([\s\S]+?)%>/g,
			interpolate: /<%=([\s\S]+?)%>/g,
			escape: /<%-([\s\S]+?)%>/g
		};
		var F = /(.)^/,
			j = {
				"'": "'",
				"\\": "\\",
				"\r": "r",
				"\n": "n",
				"\u2028": "u2028",
				"\u2029": "u2029"
			},
			R = /\\|'|\r|\n|\u2028|\u2029/g,
			N = function(e) {
				return "\\" + j[e]
			};
		y.template = function(e, t, i) {
			!t && i && (t = i), t = y.defaults({}, t, y.templateSettings);
			var n = RegExp([(t.escape || F).source, (t.interpolate || F).source, (t.evaluate || F).source].join("|") + "|$", "g"),
				o = 0,
				r = "__p+='";
			e.replace(n, function(t, i, n, a, s) {
				return r += e.slice(o, s).replace(R, N), o = s + t.length, i ? r += "'+\n((__t=(" + i + "))==null?'':_.escape(__t))+\n'" : n ? r += "'+\n((__t=(" + n + "))==null?'':__t)+\n'" : a && (r += "';\n" + a + "\n__p+='"), t
			}), r += "';\n", t.variable || (r = "with(obj||{}){\n" + r + "}\n"), r = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + r + "return __p;\n";
			try {
				var a = new Function(t.variable || "obj", "_", r)
			}
			catch (e) {
				throw e.source = r, e
			}
			var s = function(e) {
					return a.call(this, e, y)
				},
				l = t.variable || "obj";
			return s.source = "function(" + l + "){\n" + r + "}", s
		}, y.chain = function(e) {
			var t = y(e);
			return t._chain = !0, t
		};
		var H = function(e, t) {
			return e._chain ? y(t).chain() : t
		};
		y.mixin = function(e) {
			y.each(y.functions(e), function(t) {
				var i = y[t] = e[t];
				y.prototype[t] = function() {
					var e = [this._wrapped];
					return c.apply(e, arguments), H(this, i.apply(y, e))
				}
			})
		}, y.mixin(y), y.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(e) {
			var t = a[e];
			y.prototype[e] = function() {
				var i = this._wrapped;
				return t.apply(i, arguments), "shift" !== e && "splice" !== e || 0 !== i.length || delete i[0], H(this, i)
			}
		}), y.each(["concat", "join", "slice"], function(e) {
			var t = a[e];
			y.prototype[e] = function() {
				return H(this, t.apply(this._wrapped, arguments))
			}
		}), y.prototype.value = function() {
			return this._wrapped
		}, y.prototype.valueOf = y.prototype.toJSON = y.prototype.value, y.prototype.toString = function() {
			return "" + this._wrapped
		}, "function" == typeof define && define.amd && define("underscore", [], function() {
			return y
		})
	}.call(this),
	function(e, t) {
		"function" == typeof define && define.amd ? define(function() {
			return t(e, e.document)
		}) : "undefined" != typeof module && module.exports ? module.exports = t(e, e.document) : e.Visibility = t(e, e.document)
	}("undefined" != typeof window ? window : this, function(e, t) {
		"use strict";

		function i(e) {
			if (this.options = {
					onVisible: null,
					onHidden: null
				}, "object" == typeof e) {
				for (var t in e) e.hasOwnProperty(t) && (this.options[t] = e[t]);
				"function" == typeof this.options.onHidden && (this.onHiddenCallback = this.options.onHidden), "function" == typeof this.options.onVisible && (this.onVisibleCallback = this.options.onVisible)
			}
			this.change = this.bindContext(this, this.visibilityChange), this.configListener("add")
		}
		return i.prototype.configListener = function(e) {
			var i, n;
			(i = this.getHiddenProp(t)) && (n = i.replace(/[H|h]idden/, "") + "visibilitychange", "add" === e ? t.addEventListener(n, this.change, !1) : "remove" === e && t.removeEventListener(n, this.change, !1))
		}, i.prototype.getHiddenProp = function(e) {
			var t = ["webkit", "moz", "ms", "o"];
			if ("hidden" in e) return "hidden";
			for (var i = 0; i < t.length; i += 1)
				if (t[i] + "Hidden" in e) return t[i] + "Hidden";
			return null
		}, i.prototype.isHidden = function() {
			var e = this.getHiddenProp(t);
			return !!e && t[e]
		}, i.prototype.isSupported = function() {
			return !!this.getHiddenProp(t)
		}, i.prototype.bindContext = function(e, t) {
			return function() {
				return t.call(e)
			}
		}, i.prototype.visibilityChange = function() {
			var e = this.isHidden();
			e && this.onHiddenCallback ? this.onHiddenCallback() : !e && this.onVisibleCallback && this.onVisibleCallback()
		}, i.prototype.destroy = function() {
			this.configListener("remove"), this.onHiddenCallback = null, this.onVisibleCallback = null
		}, i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define(function() {
			return t(e)
		}) : "object" == typeof exports ? module.exports = t : e.emergence = t(e)
	}(this, function(e) {
		"use strict";
		var t, i, n, o, r, a, s, l, c, u, h = {},
			d = function() {},
			p = function() {
				return "querySelectorAll" in document
			},
			f = function() {
				return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(navigator.userAgent)
			},
			m = function(e) {
				var t = e.offsetWidth,
					i = e.offsetHeight,
					n = 0,
					o = 0;
				do {
					isNaN(e.offsetTop) || (n += e.offsetTop), isNaN(e.offsetLeft) || (o += e.offsetLeft)
				} while (null !== (e = e.offsetParent));
				return {
					width: t,
					height: i,
					top: n,
					left: o
				}
			},
			g = function(e) {
				var t, i;
				return e !== window ? (t = e.clientWidth, i = e.clientHeight) : (t = window.innerWidth || document.documentElement.clientWidth, i = window.innerHeight || document.documentElement.clientHeight), {
					width: t,
					height: i
				}
			},
			v = function(e) {
				return e !== window ? {
					x: e.scrollLeft + m(e).left,
					y: e.scrollTop + m(e).top
				} : {
					x: window.pageXOffset || document.documentElement.scrollLeft,
					y: window.pageYOffset || document.documentElement.scrollTop
				}
			},
			y = function(e) {
				return null === e.offsetParent
			},
			_ = function(e) {
				if (y(e)) return !1;
				var t = m(e),
					n = g(i),
					o = v(i),
					r = t.width,
					h = t.height,
					d = t.top,
					p = t.left,
					f = d + h,
					_ = p + r;
				return function() {
					var e = d + h * a,
						t = _ - r * a,
						i = f - h * a,
						m = p + r * a,
						g = o.y + s,
						v = o.x - l + n.width,
						y = o.y - c + n.height,
						b = o.x + u;
					return e < y && i > g && m < v && t > b
				}()
			},
			b = function() {
				t || (clearTimeout(t), t = setTimeout(function() {
					h.engage(), t = null
				}, n))
			};
		return h.init = function(e) {
			var t = function(e, t) {
				return parseInt(e || t, 10)
			};
			i = (e = e || {}).container || window, o = void 0 === e.reset || e.reset, r = void 0 === e.handheld || e.handheld, n = t(e.throttle, 250), a = function(e, t) {
				return parseFloat(e || .15)
			}(e.elemCushion), s = t(e.offsetTop, 0), l = t(e.offsetRight, 0), c = t(e.offsetBottom, 0), u = t(e.offsetLeft, 0), d = e.callback || d, p() && (f() && r || !f()) && (document.documentElement.className += " emergence", window.addEventListener ? (window.addEventListener("load", b, !1), i.addEventListener("scroll", b, !1), i.addEventListener("resize", b, !1)) : (document.attachEvent("onreadystatechange", function() {
				"complete" === document.readyState && b()
			}), i.attachEvent("onscroll", b), i.attachEvent("onresize", b)))
		}, h.engage = function() {
			for (var e, t = document.querySelectorAll("[data-emergence]"), i = t.length, n = 0; n < i; n++) e = t[n], _(e) ? (e.setAttribute("data-emergence", "visible"), e.className = e.className, d(e, "visible")) : !0 === o ? (e.setAttribute("data-emergence", "hidden"), e.className = e.className, d(e, "reset")) : !1 === o && d(e, "noreset");
			i || h.disengage()
		}, h.disengage = function() {
			window.removeEventListener ? (i.removeEventListener("scroll", b, !1), i.removeEventListener("resize", b, !1)) : (i.detachEvent("onscroll", b), i.detachEvent("onresize", b)), clearTimeout(t)
		}, h
	}),
	function(e, t) {
		"use strict";
		"function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.Headroom = t()
	}(this, function() {
		"use strict";

		function e(e) {
			this.callback = e, this.ticking = !1
		}

		function t(e) {
			return e && "undefined" != typeof window && (e === window || e.nodeType)
		}

		function i(e) {
			if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
			var n, o, r = e || {};
			for (o = 1; o < arguments.length; o++) {
				var a = arguments[o] || {};
				for (n in a) "object" != typeof r[n] || t(r[n]) ? r[n] = r[n] || a[n] : r[n] = i(r[n], a[n])
			}
			return r
		}

		function n(e) {
			return e === Object(e) ? e : {
				down: e,
				up: e
			}
		}

		function o(e, t) {
			t = i(t, o.options), this.lastKnownScrollY = 0, this.elem = e, this.tolerance = n(t.tolerance), this.classes = t.classes, this.offset = t.offset, this.scroller = t.scroller, this.initialised = !1, this.onPin = t.onPin, this.onUnpin = t.onUnpin, this.onTop = t.onTop, this.onNotTop = t.onNotTop, this.onBottom = t.onBottom, this.onNotBottom = t.onNotBottom
		}
		var r = {
			bind: !! function() {}.bind,
			classList: "classList" in document.documentElement,
			rAF: !!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame)
		};
		return window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame, e.prototype = {
			constructor: e,
			update: function() {
				this.callback && this.callback(), this.ticking = !1
			},
			requestTick: function() {
				this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
			},
			handleEvent: function() {
				this.requestTick()
			}
		}, o.prototype = {
			constructor: o,
			init: function() {
				if (o.cutsTheMustard) return this.debouncer = new e(this.update.bind(this)), this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this
			},
			destroy: function() {
				var e = this.classes;
				this.initialised = !1;
				for (var t in e) e.hasOwnProperty(t) && this.elem.classList.remove(e[t]);
				this.scroller.removeEventListener("scroll", this.debouncer, !1)
			},
			attachEvent: function() {
				this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
			},
			unpin: function() {
				var e = this.elem.classList,
					t = this.classes;
				!e.contains(t.pinned) && e.contains(t.unpinned) || (e.add(t.unpinned), e.remove(t.pinned), this.onUnpin && this.onUnpin.call(this))
			},
			pin: function() {
				var e = this.elem.classList,
					t = this.classes;
				e.contains(t.unpinned) && (e.remove(t.unpinned), e.add(t.pinned), this.onPin && this.onPin.call(this))
			},
			top: function() {
				var e = this.elem.classList,
					t = this.classes;
				e.contains(t.top) || (e.add(t.top), e.remove(t.notTop), this.onTop && this.onTop.call(this))
			},
			notTop: function() {
				var e = this.elem.classList,
					t = this.classes;
				e.contains(t.notTop) || (e.add(t.notTop), e.remove(t.top), this.onNotTop && this.onNotTop.call(this))
			},
			bottom: function() {
				var e = this.elem.classList,
					t = this.classes;
				e.contains(t.bottom) || (e.add(t.bottom), e.remove(t.notBottom), this.onBottom && this.onBottom.call(this))
			},
			notBottom: function() {
				var e = this.elem.classList,
					t = this.classes;
				e.contains(t.notBottom) || (e.add(t.notBottom), e.remove(t.bottom), this.onNotBottom && this.onNotBottom.call(this))
			},
			getScrollY: function() {
				return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop
			},
			getViewportHeight: function() {
				return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
			},
			getElementPhysicalHeight: function(e) {
				return Math.max(e.offsetHeight, e.clientHeight)
			},
			getScrollerPhysicalHeight: function() {
				return this.scroller === window || this.scroller === document.body ? this.getViewportHeight() : this.getElementPhysicalHeight(this.scroller)
			},
			getDocumentHeight: function() {
				var e = document.body,
					t = document.documentElement;
				return Math.max(e.scrollHeight, t.scrollHeight, e.offsetHeight, t.offsetHeight, e.clientHeight, t.clientHeight)
			},
			getElementHeight: function(e) {
				return Math.max(e.scrollHeight, e.offsetHeight, e.clientHeight)
			},
			getScrollerHeight: function() {
				return this.scroller === window || this.scroller === document.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
			},
			isOutOfBounds: function(e) {
				var t = e < 0,
					i = e + this.getScrollerPhysicalHeight() > this.getScrollerHeight();
				return t || i
			},
			toleranceExceeded: function(e, t) {
				return Math.abs(e - this.lastKnownScrollY) >= this.tolerance[t]
			},
			shouldUnpin: function(e, t) {
				var i = e > this.lastKnownScrollY,
					n = e >= this.offset;
				return i && n && t
			},
			shouldPin: function(e, t) {
				var i = e < this.lastKnownScrollY,
					n = e <= this.offset;
				return i && t || n
			},
			update: function() {
				var e = this.getScrollY(),
					t = e > this.lastKnownScrollY ? "down" : "up",
					i = this.toleranceExceeded(e, t);
				this.isOutOfBounds(e) || (e <= this.offset ? this.top() : this.notTop(), e + this.getViewportHeight() >= this.getScrollerHeight() ? this.bottom() : this.notBottom(), this.shouldUnpin(e, i) ? this.unpin() : this.shouldPin(e, i) && this.pin(), this.lastKnownScrollY = e)
			}
		}, o.options = {
			tolerance: {
				up: 0,
				down: 0
			},
			offset: 0,
			scroller: window,
			classes: {
				pinned: "headroom--pinned",
				unpinned: "headroom--unpinned",
				top: "headroom--top",
				notTop: "headroom--not-top",
				bottom: "headroom--bottom",
				notBottom: "headroom--not-bottom",
				initial: "headroom"
			}
		}, o.cutsTheMustard = void 0 !== r && r.rAF && r.bind && r.classList, o
	}),
	function(e) {
		e && (e.fn.headroom = function(t) {
			return this.each(function() {
				var i = e(this),
					n = i.data("headroom"),
					o = "object" == typeof t && t;
				o = e.extend(!0, {}, Headroom.options, o), n || ((n = new Headroom(this, o)).init(), i.data("headroom", n)), "string" == typeof t && (n[t](), "destroy" === t && i.removeData("headroom"))
			})
		}, e("[data-headroom]").each(function() {
			var t = e(this);
			t.headroom(t.data())
		}))
	}(window.Zepto || window.jQuery),
	function(e, t, i, n) {
		function o(t, i) {
			this.el = t, this.options = e.extend({}, a, i), this._defaults = a, this._name = r, this.init()
		}
		var r = "menuAim",
			a = {
				triggerEvent: "hover",
				rowSelector: "> li",
				handle: "> a",
				submenuSelector: "*",
				submenuDirection: "right",
				openClassName: "open",
				tolerance: 75,
				activationDelay: 300,
				mouseLocsTracked: 3,
				defaultDelay: 300,
				enterCallback: e.noop,
				activateCallback: e.noop,
				deactivateCallback: e.noop,
				exitCallback: e.noop,
				exitMenuCallback: e.noop
			};
		o.prototype = {
			init: function() {
				this.activeRow = null, this.mouseLocs = [], this.lastDelayLoc = null, this.timeoutId = null, this.openDelayId = null, this.isOnClick = e.inArray(this.options.triggerEvent, ["both", "click"]) > -1, this.isOnHover = e.inArray(this.options.triggerEvent, ["both", "hover"]) > -1, this.isOnHover && this._hoverTriggerOn(), this.isOnClick && this._clickTriggerOn()
			},
			_mouseMoveDocument: function(e) {
				obj = e.data.obj, obj.mouseLocs.push({
					x: e.pageX,
					y: e.pageY
				}), obj.mouseLocs.length > obj.options.mouseLocsTracked && obj.mouseLocs.shift()
			},
			_mouseLeaveMenu: function(e) {
				obj = e.data.obj, obj.timeoutId && clearTimeout(obj.timeoutId), obj.openDelayId && clearTimeout(obj.openDelayId), obj._possiblyDeactivate(obj.activeRow), obj.options.exitMenuCallback(this)
			},
			_mouseEnterRow: function(e) {
				obj = e.data.obj, obj.timeoutId && clearTimeout(obj.timeoutId), obj.options.enterCallback(this), obj._possiblyActivate(this)
			},
			_mouseLeaveRow: function(e) {
				e.data.obj.options.exitCallback(this)
			},
			_clickRow: function(t) {
				obj = t.data.obj, obj._activate(this), e(obj.el).find(obj.options.rowSelector).find(obj.options.handle).on("click", {
					obj: obj
				}, obj._clickRowHandle)
			},
			_clickRowHandle: function(t) {
				obj = t.data.obj, e(this).closest("li").hasClass(obj.options.openClassName) && (obj._deactivate(), t.stopPropagation())
			},
			_activate: function(e) {
				var t = this;
				e != this.activeRow && (this.openDelayId && clearTimeout(this.openDelayId), parseInt(t.options.activationDelay, 0) > 0 && t.isOnHover ? t.activeRow ? t._activateWithoutDelay(e) : this.openDelayId = setTimeout(function() {
					t._activateWithoutDelay(e)
				}, t.options.activationDelay) : t._activateWithoutDelay(e))
			},
			_activateWithoutDelay: function(e) {
				this.activeRow && this.options.deactivateCallback(this.activeRow), this.options.activateCallback(e), this.activeRow = e
			},
			_deactivate: function() {
				this.openDelayId && clearTimeout(this.openDelayId), this.activeRow && (this.options.deactivateCallback(this.activeRow), this.activeRow = null)
			},
			_possiblyActivate: function(e) {
				var t = this._activationDelay(),
					i = this;
				t ? this.timeoutId = setTimeout(function() {
					i._possiblyActivate(e)
				}, t) : this._activate(e)
			},
			_possiblyDeactivate: function(e) {
				var t = this._activationDelay(),
					i = this;
				t ? this.timeoutId = setTimeout(function() {
					i._possiblyDeactivate(e)
				}, t) : (this.options.deactivateCallback(e), this.activeRow = null)
			},
			_activationDelay: function() {
				function t(e, t) {
					return (t.y - e.y) / (t.x - e.x)
				}
				if (!this.activeRow || !e(this.activeRow).is(this.options.submenuSelector)) return 0;
				var i = e(this.el).offset(),
					n = {
						x: i.left,
						y: i.top - this.options.tolerance
					},
					o = {
						x: i.left + e(this.el).outerWidth(),
						y: n.y
					},
					r = {
						x: i.left,
						y: i.top + e(this.el).outerHeight() + this.options.tolerance
					},
					a = {
						x: i.left + e(this.el).outerWidth(),
						y: r.y
					},
					s = this.mouseLocs[this.mouseLocs.length - 1],
					l = this.mouseLocs[0];
				if (!s) return 0;
				if (l || (l = s), l.x < i.left || l.x > a.x || l.y < i.top || l.y > a.y) return 0;
				if (this.lastDelayLoc && s.x == this.lastDelayLoc.x && s.y == this.lastDelayLoc.y) return 0;
				var c = o,
					u = a;
				"left" == this.options.submenuDirection ? (c = r, u = n) : "below" == this.options.submenuDirection ? (c = a, u = r) : "above" == this.options.submenuDirection && (c = n, u = o);
				var h = t(s, c),
					d = t(s, u),
					p = t(l, c),
					f = t(l, u);
				return h < p && d > f ? (this.lastDelayLoc = s, this.options.defaultDelay) : (this.lastDelayLoc = null, 0)
			},
			_outsideMenuClick: function(t) {
				var i = t.data.obj;
				e(i.el).not(t.target) && 0 === e(i.el).has(t.target).length && (i.options.deactivateCallback(i.activeRow), i.activeRow = null)
			},
			_hoverTriggerOn: function() {
				e(this.el).on("mouseleave", {
					obj: this
				}, this._mouseLeaveMenu).find(this.options.rowSelector).on("mouseenter", {
					obj: this
				}, this._mouseEnterRow).on("mouseleave", {
					obj: this
				}, this._mouseLeaveRow), e(t).on("blur", {
					obj: this
				}, this._mouseLeaveMenu), e(i).on("mousemove", {
					obj: this
				}, this._mouseMoveDocument)
			},
			_hoverTriggerOff: function() {
				e(this.el).off("mouseleave", this._mouseLeaveMenu).find(this.options.rowSelector).off("mouseenter", this._mouseEnterRow).off("mouseleave", this._mouseLeaveRow), e(t).off("blur", this._mouseLeaveMenu), e(i).off("mousemove", {
					obj: this
				}, this._mouseMoveDocument)
			},
			_clickTriggerOn: function() {
				e(this.el).find(this.options.rowSelector).on("click", {
					obj: this
				}, this._clickRow), e(i).on("click", {
					obj: this
				}, this._outsideMenuClick)
			},
			_clickTriggerOff: function() {
				e(this.el).find(this.options.rowSelector).off("click", this._clickRow), e(i).off("click", this._outsideMenuClick)
			},
			switchToHover: function() {
				this._clickTriggerOff(), this._hoverTriggerOn(), this.isOnHover = !0, this.isOnClick = !1
			},
			switchToClick: function() {
				this._hoverTriggerOff(), this._clickTriggerOn(), this.isOnHover = !1, this.isOnClick = !0
			}
		}, e.fn[r] = function(t) {
			var i = arguments;
			if (void 0 === t || "object" == typeof t) return this.each(function() {
				e.data(this, "plugin_" + r) || e.data(this, "plugin_" + r, new o(this, t))
			});
			if ("string" == typeof t && "_" !== t[0] && "init" !== t) {
				var n;
				return this.each(function() {
					var a = e.data(this, "plugin_" + r);
					a instanceof o && "function" == typeof a[t] && (n = a[t].apply(a, Array.prototype.slice.call(i, 1))), "destroy" === t && e.data(this, "plugin_" + r, null)
				}), void 0 !== n ? n : this
			}
		}
	}(jQuery, window, document);
var kCSSColorTable = {
	transparent: [0, 0, 0, 0],
	aliceblue: [240, 248, 255, 1],
	antiquewhite: [250, 235, 215, 1],
	aqua: [0, 255, 255, 1],
	aquamarine: [127, 255, 212, 1],
	azure: [240, 255, 255, 1],
	beige: [245, 245, 220, 1],
	bisque: [255, 228, 196, 1],
	black: [0, 0, 0, 1],
	blanchedalmond: [255, 235, 205, 1],
	blue: [0, 0, 255, 1],
	blueviolet: [138, 43, 226, 1],
	brown: [165, 42, 42, 1],
	burlywood: [222, 184, 135, 1],
	cadetblue: [95, 158, 160, 1],
	chartreuse: [127, 255, 0, 1],
	chocolate: [210, 105, 30, 1],
	coral: [255, 127, 80, 1],
	cornflowerblue: [100, 149, 237, 1],
	cornsilk: [255, 248, 220, 1],
	crimson: [220, 20, 60, 1],
	cyan: [0, 255, 255, 1],
	darkblue: [0, 0, 139, 1],
	darkcyan: [0, 139, 139, 1],
	darkgoldenrod: [184, 134, 11, 1],
	darkgray: [169, 169, 169, 1],
	darkgreen: [0, 100, 0, 1],
	darkgrey: [169, 169, 169, 1],
	darkkhaki: [189, 183, 107, 1],
	darkmagenta: [139, 0, 139, 1],
	darkolivegreen: [85, 107, 47, 1],
	darkorange: [255, 140, 0, 1],
	darkorchid: [153, 50, 204, 1],
	darkred: [139, 0, 0, 1],
	darksalmon: [233, 150, 122, 1],
	darkseagreen: [143, 188, 143, 1],
	darkslateblue: [72, 61, 139, 1],
	darkslategray: [47, 79, 79, 1],
	darkslategrey: [47, 79, 79, 1],
	darkturquoise: [0, 206, 209, 1],
	darkviolet: [148, 0, 211, 1],
	deeppink: [255, 20, 147, 1],
	deepskyblue: [0, 191, 255, 1],
	dimgray: [105, 105, 105, 1],
	dimgrey: [105, 105, 105, 1],
	dodgerblue: [30, 144, 255, 1],
	firebrick: [178, 34, 34, 1],
	floralwhite: [255, 250, 240, 1],
	forestgreen: [34, 139, 34, 1],
	fuchsia: [255, 0, 255, 1],
	gainsboro: [220, 220, 220, 1],
	ghostwhite: [248, 248, 255, 1],
	gold: [255, 215, 0, 1],
	goldenrod: [218, 165, 32, 1],
	gray: [128, 128, 128, 1],
	green: [0, 128, 0, 1],
	greenyellow: [173, 255, 47, 1],
	grey: [128, 128, 128, 1],
	honeydew: [240, 255, 240, 1],
	hotpink: [255, 105, 180, 1],
	indianred: [205, 92, 92, 1],
	indigo: [75, 0, 130, 1],
	ivory: [255, 255, 240, 1],
	khaki: [240, 230, 140, 1],
	lavender: [230, 230, 250, 1],
	lavenderblush: [255, 240, 245, 1],
	lawngreen: [124, 252, 0, 1],
	lemonchiffon: [255, 250, 205, 1],
	lightblue: [173, 216, 230, 1],
	lightcoral: [240, 128, 128, 1],
	lightcyan: [224, 255, 255, 1],
	lightgoldenrodyellow: [250, 250, 210, 1],
	lightgray: [211, 211, 211, 1],
	lightgreen: [144, 238, 144, 1],
	lightgrey: [211, 211, 211, 1],
	lightpink: [255, 182, 193, 1],
	lightsalmon: [255, 160, 122, 1],
	lightseagreen: [32, 178, 170, 1],
	lightskyblue: [135, 206, 250, 1],
	lightslategray: [119, 136, 153, 1],
	lightslategrey: [119, 136, 153, 1],
	lightsteelblue: [176, 196, 222, 1],
	lightyellow: [255, 255, 224, 1],
	lime: [0, 255, 0, 1],
	limegreen: [50, 205, 50, 1],
	linen: [250, 240, 230, 1],
	magenta: [255, 0, 255, 1],
	maroon: [128, 0, 0, 1],
	mediumaquamarine: [102, 205, 170, 1],
	mediumblue: [0, 0, 205, 1],
	mediumorchid: [186, 85, 211, 1],
	mediumpurple: [147, 112, 219, 1],
	mediumseagreen: [60, 179, 113, 1],
	mediumslateblue: [123, 104, 238, 1],
	mediumspringgreen: [0, 250, 154, 1],
	mediumturquoise: [72, 209, 204, 1],
	mediumvioletred: [199, 21, 133, 1],
	midnightblue: [25, 25, 112, 1],
	mintcream: [245, 255, 250, 1],
	mistyrose: [255, 228, 225, 1],
	moccasin: [255, 228, 181, 1],
	navajowhite: [255, 222, 173, 1],
	navy: [0, 0, 128, 1],
	oldlace: [253, 245, 230, 1],
	olive: [128, 128, 0, 1],
	olivedrab: [107, 142, 35, 1],
	orange: [255, 165, 0, 1],
	orangered: [255, 69, 0, 1],
	orchid: [218, 112, 214, 1],
	palegoldenrod: [238, 232, 170, 1],
	palegreen: [152, 251, 152, 1],
	paleturquoise: [175, 238, 238, 1],
	palevioletred: [219, 112, 147, 1],
	papayawhip: [255, 239, 213, 1],
	peachpuff: [255, 218, 185, 1],
	peru: [205, 133, 63, 1],
	pink: [255, 192, 203, 1],
	plum: [221, 160, 221, 1],
	powderblue: [176, 224, 230, 1],
	purple: [128, 0, 128, 1],
	red: [255, 0, 0, 1],
	rosybrown: [188, 143, 143, 1],
	royalblue: [65, 105, 225, 1],
	saddlebrown: [139, 69, 19, 1],
	salmon: [250, 128, 114, 1],
	sandybrown: [244, 164, 96, 1],
	seagreen: [46, 139, 87, 1],
	seashell: [255, 245, 238, 1],
	sienna: [160, 82, 45, 1],
	silver: [192, 192, 192, 1],
	skyblue: [135, 206, 235, 1],
	slateblue: [106, 90, 205, 1],
	slategray: [112, 128, 144, 1],
	slategrey: [112, 128, 144, 1],
	snow: [255, 250, 250, 1],
	springgreen: [0, 255, 127, 1],
	steelblue: [70, 130, 180, 1],
	tan: [210, 180, 140, 1],
	teal: [0, 128, 128, 1],
	thistle: [216, 191, 216, 1],
	tomato: [255, 99, 71, 1],
	turquoise: [64, 224, 208, 1],
	violet: [238, 130, 238, 1],
	wheat: [245, 222, 179, 1],
	white: [255, 255, 255, 1],
	whitesmoke: [245, 245, 245, 1],
	yellow: [255, 255, 0, 1],
	yellowgreen: [154, 205, 50, 1]
};
try {
	exports.parseCSSColor = parseCSSColor
}
catch (e) {}
var slice = [].slice;
! function(e) {
	var t;
	t = function() {
		function t(t, n) {
			var r, a;
			a = this, this.$el = e(t), this.options = e.extend({}, this.settings, this.$el.data(), n), (r = new Image).crossOrigin = "Anonymous", r.src = this.$el.attr("src"), r.onload = function() {
				var e, t;
				return a.$el.data("original", this), e = i(a.options.gradientMap), t = o.call(a, this, e), a.$el.attr("src", t).addClass("processed")
			}, r.onerror = function() {
				throw new Error("Can not load the image: `" + this.src + "`")
			}
		}
		var i, n, o;
		return t.prototype.settings = {
			gradientMap: "black, white",
			hdpi: !1
		}, o = function(e, t) {
			var i, o, r, a, s, l, c, u, h;
			for (a = n(t), r = (o = document.createElement("canvas")).getContext("2d"), o.width = this.options.hdpi ? e.width : this.$el.width(), o.height = this.options.hdpi ? e.height : this.$el.height(), r.drawImage(e, 0, 0, o.width, o.height), s = c = 0, h = (u = (l = r.getImageData(0, 0, o.width, o.height)).data).length; c <= h; s = c += 4) i = .2126 * u[s] + .7152 * u[s + 1] + .0722 * u[s + 2] | 0, u[s] = a[i][0], u[s + 1] = a[i][1], u[s + 2] = a[i][2];
			return r.putImageData(l, 0, 0), o.toDataURL()
		}, i = function(e) {
			var t, i, n, o, r, a, s, l, c, u, h, d, p, f, m, g, v, y, _;
			for (_ = [], s = 0, c = (h = e.match(/(((rgb|hsl)a?\(\d{1,3}%?,\s*\d{1,3}%?,\s*\d{1,3}%?(?:,\s*0?\.?\d+)?\)|\w+|#[0-9a-fA-F]{1,6})(\s+(0?\.\d+|\d{1,3}%))?)/g)).length; s < c; s++)(t = h[s].match(/(?:((rgb|hsl)a?\(\d{1,3}%?,\s*\d{1,3}%?,\s*\d{1,3}%?(?:,\s*0?\.?\d+)?\)|\w+|#[0-9a-fA-F]{1,6})(\s+(?:0?\.\d+|\d{1,3}%))?)/)) && t.length >= 4 && (p = t[3], _.push({
				color: parseCSSColor(t[1]),
				pos: p ? 100 * parse_css_float(p) : null
			}));
			if (_.length <= 1) throw new Error("You must define at least 2 color stops");
			for ((y = _[0]).pos ? y.pos = Math.min(100, Math.max(0, y.pos)) : y.pos = 0, i = y.pos, (y = _[_.length - 1]).pos ? y.pos = Math.min(100, Math.max(0, y.pos)) : y.pos = 100, r = l = 1, f = _.length - 1; 1 <= f ? l <= f : l >= f; r = 1 <= f ? ++l : --l)(y = _[r]).pos && y.pos < i && (y.pos = i), y.pos > 100 && (y.pos = 100), i = y.pos;
			for (r = 1; r < _.length - 1;) {
				if (!_[r].pos) {
					for (a = u = m = r + 1, g = _.length;
						(m <= g ? u <= g : u >= g) && !_[a].pos; a = m <= g ? ++u : --u);
					for (v = _[r - 1].pos, o = _[a].pos, d = a - 1 + 1, n = Math.round((o - v) / d); r < a;) _[r].pos = _[r - 1].pos + n, r++
				}
				r++
			}
			return 0 !== _[0].pos && _.unshift({
				color: _[0].color,
				pos: 0
			}), 100 !== _[_.length - 1].pos && _.push({
				color: _[_.length - 1].color,
				pos: 100
			}), _
		}, n = function(e) {
			var t, i, n, o, r, a, s, l, c, u, h, d, p, f;
			for (r = (i = document.createElement("canvas").getContext("2d")).createLinearGradient(0, 0, 256, 0), s = 0, c = e.length; s < c; s++) d = (f = e[s]).color[0], n = f.color[1], t = f.color[2], u = f.pos / 100, r.addColorStop(u, "rgb(" + d + ", " + n + ", " + t + ")");
			for (i.fillStyle = r, i.fillRect(0, 0, 256, 1), o = [], a = l = 0, p = (h = i.getImageData(0, 0, 256, 1).data).length; l <= p; a = l += 4) d = h[a], n = h[a + 1], t = h[a + 2], o.push([d, n, t]);
			return o
		}, t.prototype.defaults = function(t) {
			return this.options = e.extend(this.options, t), this.$el
		}, t.prototype.reset = function() {
			return this.$el.attr("src", this.$el.data("original").src).removeClass("processed")
		}, t.prototype.process = function() {
			var e, t;
			return e = i(this.options.gradientMap), t = o.call(this, this.$el.data("original"), e), this.$el.attr("src", t).addClass("processed")
		}, t
	}(), e.fn.extend({
		duotone: function() {
			var i, n;
			if (n = arguments[0], i = 2 <= arguments.length ? slice.call(arguments, 1) : [], document.createElement("canvas").getContext) return this.each(function() {
				var o, r;
				return e(this).is("img") ? ((o = e.data(this, "duotone")) || e.data(this, "duotone", o = new t(this, n)), "string" == typeof n ? o[n].apply(o, i) : void 0) : (r = e(this).find("img")).duotone.apply(r, [n].concat(slice.call(i)))
			})
		}
	})
}(window.jQuery),
function(e) {
	e.fn.text3d = function(t) {
		function i(e) {
			var t, i, r = "";
			for (t = 1; t <= o.depth; t++) r += Math.round(Math.cos(o.angle) * t) + "px " + Math.round(Math.sin(o.angle) * t) + "px 0 " + n(o.color, (t - 1) / (o.depth - 1) * o.lighten) + ",";
			for (i = 1, t = 1; i <= o.shadowDepth; t++) i += t, r += Math.round(Math.cos(o.shadowAngle) * i) + "px " + Math.round(Math.sin(o.shadowAngle) * i) + "px " + i + "px rgba(0,0,0," + (o.shadowOpacity - (o.shadowOpacity - .1) * t / o.shadowDepth) + "),";
			e.style.textShadow = r.substr(0, r.length - 1)
		}

		function n(e, t) {
			(e = String(e).replace(/[^0-9a-f]/gi, "")).length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), t = t || 0;
			var i, n, o = "#";
			for (n = 0; n < 3; n++) i = parseInt(e.substr(2 * n, 2), 16), o += ("00" + (i = Math.round(Math.min(Math.max(0, i + i * t), 255)).toString(16))).substr(i.length);
			return o
		}
		var o = e.extend({}, {
			depth: 5,
			angle: 100,
			color: "#ddd",
			lighten: -.15,
			shadowDepth: 10,
			shadowAngle: 80,
			shadowOpacity: .3
		}, t);
		return o.angle = o.angle * Math.PI / 180, o.shadowAngle = o.shadowAngle * Math.PI / 180, this.each(function() {
			i(this)
		}), this
	}
}(jQuery), jQuery(function() {
		jQuery(".text3d").text3d()
	}), window.dzsprx_self_options = {}, window.dzsprx_index = 0,
	function($) {
		$.fn.dzsparallaxer = function(o) {
			var defaults = {
				settings_mode: "scroll",
				mode_scroll: "normal",
				easing: "easeIn",
				animation_duration: "20",
				direction: "normal",
				js_breakout: "off",
				breakout_fix: "off",
				is_fullscreen: "off",
				settings_movexaftermouse: "off",
				animation_engine: "js",
				init_delay: "0",
				init_functional_delay: "0",
				settings_substract_from_th: 0,
				settings_detect_out_of_screen: !0,
				init_functional_remove_delay_on_scroll: "off",
				settings_makeFunctional: !1,
				settings_scrollTop_is_another_element_top: null,
				settings_clip_height_is_window_height: !1,
				settings_listen_to_object_scroll_top: null,
				settings_mode_oneelement_max_offset: "20",
				simple_parallaxer_convert_simple_img_to_bg_if_possible: "on"
			};
			if (void 0 === o && void 0 !== $(this).attr("data-options") && "" != $(this).attr("data-options")) {
				var aux = $(this).attr("data-options");
				aux = "window.dzsprx_self_options = " + aux, eval(aux), o = $.extend({}, window.dzsprx_self_options), window.dzsprx_self_options = $.extend({}, {})
			}
			o = $.extend(defaults, o), Math.easeIn = function(e, t, i, n) {
				return -i * (e /= n) * (e - 2) + t
			}, Math.easeOutQuad = function(e, t, i, n) {
				return e /= n, -i * e * (e - 2) + t
			}, Math.easeInOutSine = function(e, t, i, n) {
				return -i / 2 * (Math.cos(Math.PI * e / n) - 1) + t
			}, o.settings_mode_oneelement_max_offset = parseInt(o.settings_mode_oneelement_max_offset, 10);
			var simple_parallaxer_max_offset = parseInt(o.settings_mode_oneelement_max_offset, 10);
			this.each(function() {
				function init() {
					if (1 == o.settings_makeFunctional) {
						var e = !1,
							t = document.URL,
							i = t.indexOf("://") + 3,
							n = t.indexOf("/", i),
							r = t.substring(i, n);
						if (r.indexOf("l") > -1 && r.indexOf("c") > -1 && r.indexOf("o") > -1 && r.indexOf("l") > -1 && r.indexOf("a") > -1 && r.indexOf("h") > -1 && (e = !0), r.indexOf("d") > -1 && r.indexOf("i") > -1 && r.indexOf("g") > -1 && r.indexOf("d") > -1 && r.indexOf("z") > -1 && r.indexOf("s") > -1 && (e = !0), r.indexOf("o") > -1 && r.indexOf("z") > -1 && r.indexOf("e") > -1 && r.indexOf("h") > -1 && r.indexOf("t") > -1 && (e = !0), r.indexOf("e") > -1 && r.indexOf("v") > -1 && r.indexOf("n") > -1 && r.indexOf("a") > -1 && r.indexOf("t") > -1 && (e = !0), 0 == e) return
					}
					if (o.settings_scrollTop_is_another_element_top && (_scrollTop_is_another_element_top = o.settings_scrollTop_is_another_element_top), _theTarget = cthis.find(".dzsparallaxer--target").eq(0), cthis.find(".dzsparallaxer--blackoverlay").length > 0 && (_blackOverlay = cthis.find(".dzsparallaxer--blackoverlay").eq(0)), cthis.find(".dzsparallaxer--fadeouttarget").length > 0 && (_fadeouttarget = cthis.find(".dzsparallaxer--fadeouttarget").eq(0)), cthis.find(".dzsparallaxer--aftermouse").length && cthis.find(".dzsparallaxer--aftermouse").each(function() {
							var e = $(this);
							parallaxer_aftermouse_elements.push(e)
						}), cthis.hasClass("wait-readyall") || setTimeout(function() {
							duration_viy = Number(o.animation_duration)
						}, 300), cthis.addClass("mode-" + o.settings_mode), cthis.addClass("animation-engine-" + o.animation_engine), ch = cthis.height(), "on" == o.settings_movexaftermouse && (cw = cthis.width()), _theTarget && (th = _theTarget.height(), "on" == o.settings_movexaftermouse && (tw = _theTarget.width())), o.settings_substract_from_th && (th -= o.settings_substract_from_th), initialheight = ch, o.breakout_fix, cthis.attr("data-responsive-reference-width") && (responsive_reference_width = Number(cthis.attr("data-responsive-reference-width"))), cthis.attr("data-responsive-optimal-height") && (responsive_optimal_height = Number(cthis.attr("data-responsive-optimal-height"))), cthis.find(".dzsprxseparator--bigcurvedline").length && cthis.find(".dzsprxseparator--bigcurvedline").each(function() {
							var e = $(this),
								t = "#FFFFFF";
							e.attr("data-color") && (t = e.attr("data-color"));
							var i = '<svg class="display-block" width="100%"  viewBox="0 0 2500 100" preserveAspectRatio="none" ><path class="color-bg" fill="' + t + '" d="M2500,100H0c0,0-24.414-1.029,0-6.411c112.872-24.882,2648.299-14.37,2522.026-76.495L2500,100z"/></svg>';
							e.append(i)
						}), cthis.find(".dzsprxseparator--2triangles").length && cthis.find(".dzsprxseparator--2triangles").each(function() {
							var e = $(this),
								t = "#FFFFFF";
							e.attr("data-color") && (t = e.attr("data-color"));
							var i = '<svg class="display-block" width="100%"  viewBox="0 0 1500 100" preserveAspectRatio="none" ><polygon class="color-bg" fill="' + t + '" points="1500,100 0,100 0,0 750,100 1500,0 "/></svg>';
							e.append(i)
						}), cthis.find(".dzsprxseparator--triangle").length && cthis.find(".dzsprxseparator--triangle").each(function() {
							var e = $(this),
								t = "#FFFFFF";
							e.attr("data-color") && (t = e.attr("data-color"));
							var i = '<svg class="display-block" width="100%"  viewBox="0 0 2200 100" preserveAspectRatio="none" ><polyline class="color-bg" fill="' + t + '" points="2200,100 0,100 0,0 2200,100 "/></svg>';
							e.append(i)
						}), cthis.get(0) && (cthis.get(0).api_set_scrollTop_is_another_element_top = function(e) {
							_scrollTop_is_another_element_top = e
						}), "horizontal" == o.settings_mode && (_theTarget.wrap('<div class="dzsparallaxer--target-con"></div>'), "20" != o.animation_duration && cthis.find(".horizontal-fog,.dzsparallaxer--target").css({
							animation: "slideshow " + Number(o.animation_duration) / 1e3 + "s linear infinite"
						})), is_touch_device() && cthis.addClass("is-touch"), is_mobile() && cthis.addClass("is-mobile"), cthis.find(".divimage").length > 0 || cthis.find("img").length > 0) {
						var a = cthis.children(".divimage, img").eq(0);
						0 == a.length && (a = cthis.find(".divimage, img").eq(0)), a.attr("data-src") ? (lazyloading_setsource = a.attr("data-src"), $(window).on("scroll.dzsprx" + cthis_index, handle_scroll), handle_scroll()) : init_start()
					}
					else init_start();
					"horizontal" == o.settings_mode && (_theTarget.before(_theTarget.clone()), _theTarget.prev().addClass("cloner"), _theTargetClone = _theTarget.parent().find(".cloner").eq(0))
				}

				function init_start() {
					started || (started = !0, is_ie11() && cthis.addClass("is-ie-11"), $(window).on("resize", handle_resize), handle_resize(), inter_recheck_dims = setInterval(function() {
						handle_resize(null, {
							call_from: "autocheck"
						})
					}, 2e3), cthis.hasClass("wait-readyall") && setTimeout(function() {
						handle_scroll()
					}, 700), setTimeout(function() {
						cthis.addClass("dzsprx-readyall"), handle_scroll(), cthis.hasClass("wait-readyall") && (duration_viy = Number(o.animation_duration))
					}, 1e3), cthis.find("*[data-parallaxanimation]").length > 0 && cthis.find("*[data-parallaxanimation]").each(function() {
						var _t = $(this);
						if (_t.attr("data-parallaxanimation")) {
							null == animator_objects_arr && (animator_objects_arr = []), animator_objects_arr.push(_t);
							var aux = _t.attr("data-parallaxanimation");
							aux = "window.aux_opts2 = " + aux, aux = aux.replace(/'/g, '"');
							try {
								eval(aux)
							}
							catch (e) {
								window.aux_opts2 = null
							}
							if (window.aux_opts2) {
								for (i = 0; i < window.aux_opts2.length; i++) 0 == isNaN(Number(window.aux_opts2[i].initial)) && (window.aux_opts2[i].initial = Number(window.aux_opts2[i].initial)), 0 == isNaN(Number(window.aux_opts2[i].mid)) && (window.aux_opts2[i].mid = Number(window.aux_opts2[i].mid)), 0 == isNaN(Number(window.aux_opts2[i].final)) && (window.aux_opts2[i].final = Number(window.aux_opts2[i].final));
								_t.data("parallax_options", window.aux_opts2)
							}
						}
					}), init_functional_delay && (sw_suspend_functional = !0, setTimeout(function() {
						sw_suspend_functional = !1
					}, init_functional_delay)), cthis.hasClass("simple-parallax") ? (_theTarget.wrap('<div class="simple-parallax-inner"></div>'), "on" == o.simple_parallaxer_convert_simple_img_to_bg_if_possible && _theTarget.attr("data-src") && 0 == _theTarget.children().length && _theTarget.parent().addClass("is-image"), simple_parallaxer_max_offset > 0 && handle_frame()) : handle_frame(), inter_debug_func = setInterval(debug_func, 1e3), setTimeout(function() {}, 1500), cthis.hasClass("use-loading") && (cthis.find(".divimage").length > 0 || cthis.children("img").length > 0 ? cthis.find(".divimage").length > 0 && (lazyloading_setsource && (cthis.find(".divimage").eq(0).css("background-image", "url(" + lazyloading_setsource + ")"), cthis.find(".dzsparallaxer--target-con .divimage").css("background-image", "url(" + lazyloading_setsource + ")")), void 0 == (_loadTarget_src = String(cthis.find(".divimage").eq(0).css("background-image")).split('"')[1]) && (_loadTarget_src = String(cthis.find(".divimage").eq(0).css("background-image")).split("url(")[1], _loadTarget_src = String(_loadTarget_src).split(")")[0]), _loadTarget = new Image, _loadTarget.onload = function(e) {
						init_loaded()
					}, _loadTarget.src = _loadTarget_src) : cthis.addClass("loaded"), setTimeout(function() {
						cthis.addClass("loaded"), calculate_dims()
					}, 1e4)), cthis.get(0).api_set_update_func = function(e) {
						api_outer_update_func = e
					}, cthis.get(0).api_handle_scroll = handle_scroll, cthis.get(0).api_destroy = destroy, cthis.get(0).api_destroy_listeners = destroy_listeners, cthis.get(0).api_handle_resize = handle_resize, "scroll" != o.settings_mode && "oneelement" != o.settings_mode || ($(window).off("scroll.dzsprx" + cthis_index), $(window).on("scroll.dzsprx" + cthis_index, handle_scroll), handle_scroll(), setTimeout(handle_scroll, 1e3), document && document.addEventListener && document.addEventListener("touchmove", handle_mousemove, !1)), ("mouse_body" == o.settings_mode || "on" == o.settings_movexaftermouse || parallaxer_aftermouse_elements.length) && $(document).on("mousemove", handle_mousemove))
				}

				function init_loaded() {
					cthis.addClass("loaded"), "horizontal" == o.settings_mode && (nw = _loadTarget.naturalWidth, nh = _loadTarget.naturalHeight, tw = nw / nh * ch, _theTarget.hasClass("divimage"), _theTargetClone.css({
						left: "calc(-100% + 1px)"
					}), _theTarget.css({
						width: "100%"
					}), _theTarget.hasClass("repeat-pattern") && (tw = Math.ceil(cw / nw) * nw), cthis.find(".dzsparallaxer--target-con").css({
						width: tw
					}))
				}

				function destroy() {
					api_outer_update_func = null, stop_enter_frame = !0, api_outer_update_func = null, destroyed = !0, $(window).off("scroll.dzsprx" + cthis_index, handle_scroll), document && document.addEventListener && document.removeEventListener("touchmove", handle_mousemove, !1)
				}

				function debug_func() {
					debug_var = !0
				}

				function destroy_listeners() {
					destroyed = !0, clearInterval(inter_debug_func), $(window).off("scroll.dzsprx" + cthis_index), sw_stop_enter_frame = !0
				}

				function handle_resize(e, t) {
					cw = cthis.width(), ww = window.innerWidth, wh = window.innerHeight;
					var i = {
						call_from: "event"
					};
					if (t && (i = $.extend(i, t)), !1 !== started) {
						if ("oneelement" == o.settings_mode) {
							var n = cthis.css("transform");
							cthis.css("transform", "translate3d(0,0,0)")
						}
						if (cthis_ot = parseInt(cthis.offset().top, 10), "autocheck" == i.call_from && Math.abs(last_wh - wh) < 4 && Math.abs(last_cthis_ot - cthis_ot) < 4) return "oneelement" == o.settings_mode && cthis.css("transform", n), !1;
						if (last_wh = wh, last_cthis_ot = cthis_ot, responsive_reference_width && responsive_optimal_height)
							if (cw < responsive_reference_width) {
								var r = cw / responsive_reference_width * responsive_optimal_height;
								cthis.height(r)
							}
						else cthis.height(responsive_optimal_height);
						cw < 760 ? cthis.addClass("under-760") : cthis.removeClass("under-760"), cw < 500 ? cthis.addClass("under-500") : cthis.removeClass("under-500"), int_calculate_dims && clearTimeout(int_calculate_dims), int_calculate_dims = setTimeout(calculate_dims, 700), "on" == o.js_breakout && (cthis.css("width", ww + "px"), cthis.css("margin-left", "0"), cthis.offset().left > 0 && cthis.css("margin-left", "-" + cthis.offset().left + "px")), o.is_fullscreen
					}
				}

				function calculate_dims() {
					ch = cthis.outerHeight(), th = _theTarget.outerHeight(), wh = window.innerHeight, o.settings_substract_from_th && (th -= o.settings_substract_from_th), o.settings_clip_height_is_window_height && (ch = window.innerHeight), 0 == cthis.hasClass("allbody") && 0 == cthis.hasClass("dzsparallaxer---window-height") && 0 == responsive_reference_width && (th <= initialheight && th > 0 ? ("oneelement" != o.settings_mode && 0 == cthis.hasClass("do-not-set-js-height") && 0 == cthis.hasClass("height-is-based-on-content") && cthis.height(th), ch = cthis.height(), is_ie() && version_ie() <= 10 ? _theTarget.css("top", "0") : _theTarget.css("transform", ""), _blackOverlay && _blackOverlay.css("opacity", "0")) : "oneelement" != o.settings_mode && 0 == cthis.hasClass("do-not-set-js-height") && cthis.hasClass("height-is-based-on-content")), _theTarget.attr("data-forcewidth_ratio") && (_theTarget.width(Number(_theTarget.attr("data-forcewidth_ratio")) * _theTarget.height()), _theTarget.width() < cthis.width() && _theTarget.width(cthis.width())), clearTimeout(inter_scroll_from_resize), inter_scroll_from_resize = setTimeout(handle_scroll, 200)
				}

				function handle_mousemove(e) {
					if ("mouse_body" == o.settings_mode) {
						st = e.pageY - $(window).scrollTop();
						var t = 0;
						if (0 == th) return;
						bo_o = st / ch, (t = st / wh * (ch - th)) > 0 && (t = 0), t < ch - th && (t = ch - th), bo_o > 1 && (bo_o = 1), bo_o < 0 && (bo_o = 0), finish_viy = t
					}
					if ("on" == o.settings_movexaftermouse) {
						var i = 0;
						(i = (n = e.pageX) / ww * (cw - tw)) > 0 && (i = 0), i < cw - tw && (i = cw - tw), finish_vix = i
					}
					if (parallaxer_aftermouse_elements) {
						var n = e.pageX;
						t = e.clientY / wh * simple_parallaxer_max_offset * 4 - 2 * simple_parallaxer_max_offset, (i = n / ww * simple_parallaxer_max_offset * 2 - simple_parallaxer_max_offset) > simple_parallaxer_max_offset && (i = simple_parallaxer_max_offset), i < -simple_parallaxer_max_offset && (i = -simple_parallaxer_max_offset), t > simple_parallaxer_max_offset && (t = simple_parallaxer_max_offset), t < -simple_parallaxer_max_offset && (t = -simple_parallaxer_max_offset);
						for (var r = 0; r < parallaxer_aftermouse_elements.length; r++) parallaxer_aftermouse_elements[r].css({
							top: t,
							left: i
						}, {
							queue: !1,
							duration: 100
						})
					}
				}

				function handle_scroll(e, t) {
					st = $(window).scrollTop(), vi_y = 0, cthis_ot > st - wh && st < cthis_ot + cthis.outerHeight() ? (sw_out_of_display = !1, sw_suspend_functional = !1) : o.settings_detect_out_of_screen && (sw_out_of_display = !0, sw_suspend_functional = !0), _scrollTop_is_another_element_top && (st = -parseInt(_scrollTop_is_another_element_top.css("top"), 10), _scrollTop_is_another_element_top.data("targettop") && (st = -_scrollTop_is_another_element_top.data("targettop"))), o.settings_listen_to_object_scroll_top && (st = o.settings_listen_to_object_scroll_top.val), isNaN(st) && (st = 0), e && "on" == o.init_functional_remove_delay_on_scroll && (sw_suspend_functional = !1);
					var n = {
						force_vi_y: null,
						from: "",
						force_ch: null,
						force_th: null,
						force_th_only_big_diff: !0
					};
					if (t && (n = $.extend(n, t)), o.settings_clip_height_is_window_height && (ch = window.innerHeight), null != n.force_ch && (ch = n.force_ch), null != n.force_th && (n.force_th_only_big_diff ? Math.abs(n.force_th - th) > 20 && (th = n.force_th) : th = n.force_th), !1 === started && (wh = window.innerHeight, st + wh >= cthis.offset().top && init_start()), 0 != th && !1 !== started && ("scroll" == o.settings_mode || "oneelement" == o.settings_mode)) {
						if ("oneelement" == o.settings_mode) {
							var r = (st - cthis_ot + wh) / wh;
							cthis.attr("id"), r < 0 && (r = 0), r > 1 && (r = 1), "reverse" == o.direction && (r = Math.abs(1 - r)), vi_y = r * (2 * o.settings_mode_oneelement_max_offset) - o.settings_mode_oneelement_max_offset, finish_viy = vi_y, cthis.attr("id")
						}
						if ("scroll" == o.settings_mode) {
							"fromtop" == o.mode_scroll && (vi_y = st / ch * (ch - th), "on" == o.is_fullscreen && (vi_y = st / (th - wh) * (ch - th), _scrollTop_is_another_element_top && (vi_y = st / (_scrollTop_is_another_element_top.height() - wh) * (ch - th))), "reverse" == o.direction && (vi_y = (1 - st / ch) * (ch - th), "on" == o.is_fullscreen && (vi_y = (1 - st / (th - wh)) * (ch - th), _scrollTop_is_another_element_top && (vi_y = (1 - st / (_scrollTop_is_another_element_top.height() - wh)) * (ch - th))))), cthis_ot = cthis.offset().top, _scrollTop_is_another_element_top && (cthis_ot = -parseInt(_scrollTop_is_another_element_top.css("top"), 10));
							var a = (st - (cthis_ot - wh)) / (cthis_ot + ch - (cthis_ot - wh));
							if ("on" == o.is_fullscreen && (a = st / ($("body").height() - wh), _scrollTop_is_another_element_top && (a = st / (_scrollTop_is_another_element_top.outerHeight() - wh))), a > 1 && (a = 1), a < 0 && (a = 0), animator_objects_arr)
								for (i = 0; i < animator_objects_arr.length; i++) {
									var s = animator_objects_arr[i],
										l = s.data("parallax_options");
									if (l)
										for (var c = 0; c < l.length; c++)
											if (a <= .5) {
												var u = 2 * a;
												(h = 2 * a - 1) < 0 && (h = -h), d = h * l[c].initial + u * l[c].mid, p = (p = l[c].value).replace(/{{val}}/g, d), s.css(l[c].property, p)
											}
									else {
										var h = (u = 2 * (a - .5)) - 1;
										h < 0 && (h = -h);
										var d = h * l[c].mid + u * l[c].final,
											p = l[c].value;
										p = p.replace(/{{val}}/g, d), s.css(l[c].property, p)
									}
								}
							if ("normal" == o.mode_scroll && (vi_y = a * (ch - th), "reverse" == o.direction && (vi_y = (1 - a) * (ch - th)), cthis.hasClass("debug-target")), "fromtop" == o.mode_scroll && vi_y < ch - th && (vi_y = ch - th), cthis.hasClass("simple-parallax") && ((r = (st + wh - cthis_ot) / (wh + th)) < 0 && (r = 0), r > 1 && (r = 1), r = Math.abs(1 - r), cthis.hasClass("is-mobile") && (simple_parallaxer_max_offset = cthis.height() / 2), vi_y = r * (2 * simple_parallaxer_max_offset) - simple_parallaxer_max_offset), _fadeouttarget) {
								var f = Math.abs((st - cthis_ot) / cthis.outerHeight() - 1);
								f > 1 && (f = 1), f < 0 && (f = 0), _fadeouttarget.css("opacity", f)
							}
							bo_o = st / ch, 0 == cthis.hasClass("simple-parallax") && (vi_y > 0 && (vi_y = 0), vi_y < ch - th && (vi_y = ch - th)), bo_o > 1 && (bo_o = 1), bo_o < 0 && (bo_o = 0), n.force_vi_y && (vi_y = n.force_vi_y), finish_viy = vi_y, finish_bo = bo_o, 0 !== duration_viy && "css" != o.animation_engine || (target_viy = finish_viy, 0 == sw_suspend_functional && (cthis.hasClass("simple-parallax") ? (_theTarget.parent().hasClass("is-image") || cthis.hasClass("simple-parallax--is-only-image")) && _theTarget.css("background-position-y", "calc(50% - " + parseInt(target_viy, 10) + "px)") : is_ie() && version_ie() <= 10 ? _theTarget.css("top", target_viy + "px") : (_theTarget.css("transform", "translate3d(" + target_vix + "px," + target_viy + "px,0)"), "oneelement" == o.settings_mode && cthis.css("transform", "translate3d(" + target_vix + "px," + target_viy + "px,0)"))))
						}
					}
				}

				function switch_suspend_enter_frame() {
					sw_suspend_functional = !0
				}

				function handle_frame() {
					return sw_suspend_functional ? (requestAnimFrame(handle_frame), !1) : (isNaN(target_viy) && (target_viy = 0), debug_var && (debug_var = !1), "horizontal" != o.settings_mode && (0 === duration_viy || "css" == o.animation_engine ? (api_outer_update_func && api_outer_update_func(target_viy), requestAnimFrame(handle_frame), !1) : (begin_viy = target_viy, change_viy = finish_viy - begin_viy, begin_bo = target_bo, change_bo = finish_bo - begin_bo, "easeIn" == o.easing && (target_viy = Number(Math.easeIn(1, begin_viy, change_viy, duration_viy).toFixed(5)), target_bo = Number(Math.easeIn(1, begin_bo, change_bo, duration_viy).toFixed(5))), "easeOutQuad" == o.easing && (target_viy = Math.easeOutQuad(1, begin_viy, change_viy, duration_viy), target_bo = Math.easeOutQuad(1, begin_bo, change_bo, duration_viy)), "easeInOutSine" == o.easing && (target_viy = Math.easeInOutSine(1, begin_viy, change_viy, duration_viy), target_bo = Math.easeInOutSine(1, begin_bo, change_bo, duration_viy)), target_vix = 0, "on" == o.settings_movexaftermouse && (change_vix = finish_vix - (begin_vix = target_vix), target_vix = Math.easeIn(1, begin_vix, change_vix, duration_viy)), cthis.hasClass("simple-parallax") ? _theTarget.parent().hasClass("is-image") && _theTarget.css("background-position-y", "calc(50% - " + parseInt(target_viy, 10) + "px)") : is_ie() && version_ie() <= 10 ? _theTarget.css("top", target_viy + "px") : (_theTarget.css("transform", "translate3d(" + target_vix + "px," + target_viy + "px,0)"), "oneelement" == o.settings_mode && cthis.css("transform", "translate3d(" + target_vix + "px," + target_viy + "px,0)")), _blackOverlay && _blackOverlay.css("opacity", target_bo), api_outer_update_func && api_outer_update_func(target_viy), !stop_enter_frame && void requestAnimFrame(handle_frame))))
				}
				var cthis = $(this),
					_theTarget = null,
					_theTargetClone = null,
					_blackOverlay = null,
					_fadeouttarget = null,
					cthis_index = window.dzsprx_index++,
					nritems = 0,
					tobeloaded = 0,
					i = 0,
					tw = 0,
					th = 0,
					ch = 0,
					cw = 0,
					ww = 0,
					wh = 0,
					nw = 0,
					nh = 0,
					last_wh = 0,
					last_cthis_ot = 0,
					initialheight = 0,
					int_calculate_dims = 0,
					duration_viy = 0,
					target_viy = 0,
					target_vix = 0,
					target_bo = 0,
					begin_viy = 0,
					begin_vix = 0,
					begin_bo = 0,
					finish_viy = 0,
					finish_vix = 0,
					finish_bo = 0,
					change_viy = 0,
					change_vix = 0,
					change_bo = 0,
					backup_duration_viy = 0,
					api_outer_update_func = null,
					_scrollTop_is_another_element_top = null,
					st = 0,
					vi_y = 0,
					bo_o = 0,
					cthis_ot = 0,
					lazyloading_setsource = "",
					started = !1,
					debug_var = !1,
					animator_objects_arr = null,
					stop_enter_frame = !1,
					sw_suspend_functional = !1,
					sw_stop_enter_frame = !1,
					destroyed = !1,
					sw_out_of_display = !1,
					init_delay = 0,
					init_functional_delay = 0,
					inter_debug_func = 0,
					inter_suspend_enter_frame = 0,
					inter_scroll_from_resize = 0,
					inter_recheck_dims = 0,
					responsive_reference_width = 0,
					responsive_optimal_height = 0,
					parallaxer_aftermouse_elements = [],
					_loadTarget = null,
					_loadTarget_src = "";
				init_delay = Number(o.init_delay), init_functional_delay = Number(o.init_functional_delay), init_delay ? setTimeout(init, init_delay) : init()
			})
		}, window.dzsprx_init = function(e, t) {
			if (void 0 !== t && void 0 !== t.init_each && 1 == t.init_each) {
				var i = 0;
				for (var n in t) i++;
				1 == i && (t = void 0), $(e).each(function() {
					$(this).dzsparallaxer(t)
				})
			}
			else $(e).dzsparallaxer(t)
		}
	}(jQuery), window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
		window.setTimeout(e, 1e3 / 60)
	}, jQuery(document).ready(function(e) {
		e(".dzsparallaxer---window-height").each(function() {
			function t() {
				var e = window.innerHeight;
				i.height(e)
			}
			var i = e(this);
			e(window).on("resize", t), t()
		}), dzsprx_init(".dzsparallaxer.auto-init", {
			init_each: !0
		})
	}),
	function(e, t) {
		"use strict";
		"function" == typeof define && define.amd ? define([], function() {
			return t.apply(e)
		}) : "object" == typeof exports ? module.exports = t.call(e) : e.Waves = t.call(e)
	}("object" == typeof global ? global : this, function() {
		"use strict";

		function e(e) {
			return null !== e && e === e.window
		}

		function t(t) {
			return e(t) ? t : 9 === t.nodeType && t.defaultView
		}

		function i(e) {
			var t = typeof e;
			return "function" === t || "object" === t && !!e
		}

		function n(e) {
			return i(e) && e.nodeType > 0
		}

		function o(e) {
			var t = d.call(e);
			return "[object String]" === t ? h(e) : i(e) && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(t) && e.hasOwnProperty("length") ? e : n(e) ? [e] : []
		}

		function r(e) {
			var i, n, o = {
					top: 0,
					left: 0
				},
				r = e && e.ownerDocument;
			return i = r.documentElement, void 0 !== e.getBoundingClientRect && (o = e.getBoundingClientRect()), n = t(r), {
				top: o.top + n.pageYOffset - i.clientTop,
				left: o.left + n.pageXOffset - i.clientLeft
			}
		}

		function a(e) {
			var t = "";
			for (var i in e) e.hasOwnProperty(i) && (t += i + ":" + e[i] + ";");
			return t
		}

		function s(e, t, i) {
			if (i) {
				i.classList.remove("waves-rippling");
				var n = i.getAttribute("data-x"),
					o = i.getAttribute("data-y"),
					r = i.getAttribute("data-scale"),
					s = i.getAttribute("data-translate"),
					l = 350 - (Date.now() - Number(i.getAttribute("data-hold")));
				l < 0 && (l = 0), "mousemove" === e.type && (l = 150);
				var c = "mousemove" === e.type ? 2500 : f.duration;
				setTimeout(function() {
					var e = {
						top: o + "px",
						left: n + "px",
						opacity: "0",
						"-webkit-transition-duration": c + "ms",
						"-moz-transition-duration": c + "ms",
						"-o-transition-duration": c + "ms",
						"transition-duration": c + "ms",
						"-webkit-transform": r + " " + s,
						"-moz-transform": r + " " + s,
						"-ms-transform": r + " " + s,
						"-o-transform": r + " " + s,
						transform: r + " " + s
					};
					i.setAttribute("style", a(e)), setTimeout(function() {
						try {
							t.removeChild(i)
						}
						catch (e) {
							return !1
						}
					}, c)
				}, l)
			}
		}

		function l(e) {
			if (!1 === g.allowEvent(e)) return null;
			for (var t = null, i = e.target || e.srcElement; i.parentElement;) {
				if (!(i instanceof SVGElement) && i.classList.contains("waves-effect")) {
					t = i;
					break
				}
				i = i.parentElement
			}
			return t
		}

		function c(e) {
			var t = l(e);
			if (null !== t) {
				if (t.disabled || t.getAttribute("disabled") || t.classList.contains("disabled")) return;
				if (g.registerEvent(e), "touchstart" === e.type && f.delay) {
					var i = !1,
						n = setTimeout(function() {
							n = null, f.show(e, t)
						}, f.delay),
						o = function(o) {
							n && (clearTimeout(n), n = null, f.show(e, t)), i || (i = !0, f.hide(o, t))
						};
					t.addEventListener("touchmove", function(e) {
						n && (clearTimeout(n), n = null), o(e)
					}, !1), t.addEventListener("touchend", o, !1), t.addEventListener("touchcancel", o, !1)
				}
				else f.show(e, t), p && (t.addEventListener("touchend", f.hide, !1), t.addEventListener("touchcancel", f.hide, !1)), t.addEventListener("mouseup", f.hide, !1), t.addEventListener("mouseleave", f.hide, !1)
			}
		}
		var u = u || {},
			h = document.querySelectorAll.bind(document),
			d = Object.prototype.toString,
			p = "ontouchstart" in window,
			f = {
				duration: 750,
				delay: 200,
				show: function(e, t, i) {
					if (2 === e.button) return !1;
					t = t || this;
					var n = document.createElement("div");
					n.className = "waves-ripple waves-rippling", t.appendChild(n);
					var o = r(t),
						s = 0,
						l = 0;
					"touches" in e && e.touches.length ? (s = e.touches[0].pageY - o.top, l = e.touches[0].pageX - o.left) : (s = e.pageY - o.top, l = e.pageX - o.left), l = l >= 0 ? l : 0, s = s >= 0 ? s : 0;
					var c = "scale(" + t.clientWidth / 100 * 3 + ")",
						u = "translate(0,0)";
					i && (u = "translate(" + i.x + "px, " + i.y + "px)"), n.setAttribute("data-hold", Date.now()), n.setAttribute("data-x", l), n.setAttribute("data-y", s), n.setAttribute("data-scale", c), n.setAttribute("data-translate", u);
					var h = {
						top: s + "px",
						left: l + "px"
					};
					n.classList.add("waves-notransition"), n.setAttribute("style", a(h)), n.classList.remove("waves-notransition"), h["-webkit-transform"] = c + " " + u, h["-moz-transform"] = c + " " + u, h["-ms-transform"] = c + " " + u, h["-o-transform"] = c + " " + u, h.transform = c + " " + u, h.opacity = "1";
					var d = "mousemove" === e.type ? 2500 : f.duration;
					h["-webkit-transition-duration"] = d + "ms", h["-moz-transition-duration"] = d + "ms", h["-o-transition-duration"] = d + "ms", h["transition-duration"] = d + "ms", n.setAttribute("style", a(h))
				},
				hide: function(e, t) {
					for (var i = (t = t || this).getElementsByClassName("waves-rippling"), n = 0, o = i.length; n < o; n++) s(e, t, i[n])
				}
			},
			m = {
				input: function(e) {
					var t = e.parentNode;
					if ("i" !== t.tagName.toLowerCase() || !t.classList.contains("waves-effect")) {
						var i = document.createElement("i");
						i.className = e.className + " waves-input-wrapper", e.className = "waves-button-input", t.replaceChild(i, e), i.appendChild(e);
						var n = window.getComputedStyle(e, null),
							o = n.color,
							r = n.backgroundColor;
						i.setAttribute("style", "color:" + o + ";background:" + r), e.setAttribute("style", "background-color:rgba(0,0,0,0);")
					}
				},
				img: function(e) {
					var t = e.parentNode;
					if ("i" !== t.tagName.toLowerCase() || !t.classList.contains("waves-effect")) {
						var i = document.createElement("i");
						t.replaceChild(i, e), i.appendChild(e)
					}
				}
			},
			g = {
				touches: 0,
				allowEvent: function(e) {
					var t = !0;
					return /^(mousedown|mousemove)$/.test(e.type) && g.touches && (t = !1), t
				},
				registerEvent: function(e) {
					var t = e.type;
					"touchstart" === t ? g.touches += 1 : /^(touchend|touchcancel)$/.test(t) && setTimeout(function() {
						g.touches && (g.touches -= 1)
					}, 500)
				}
			};
		return u.init = function(e) {
			var t = document.body;
			"duration" in (e = e || {}) && (f.duration = e.duration), "delay" in e && (f.delay = e.delay), p && (t.addEventListener("touchstart", c, !1), t.addEventListener("touchcancel", g.registerEvent, !1), t.addEventListener("touchend", g.registerEvent, !1)), t.addEventListener("mousedown", c, !1)
		}, u.attach = function(e, t) {
			e = o(e), "[object Array]" === d.call(t) && (t = t.join(" ")), t = t ? " " + t : "";
			for (var i, n, r = 0, a = e.length; r < a; r++) n = (i = e[r]).tagName.toLowerCase(), -1 !== ["input", "img"].indexOf(n) && (m[n](i), i = i.parentElement), -1 === i.className.indexOf("waves-effect") && (i.className += " waves-effect" + t)
		}, u.ripple = function(e, t) {
			var i = (e = o(e)).length;
			if (t = t || {}, t.wait = t.wait || 0, t.position = t.position || null, i)
				for (var n, a, s, l = {}, c = 0, u = {
						type: "mousedown",
						button: 1
					}; c < i; c++)
					if (n = e[c], a = t.position || {
							x: n.clientWidth / 2,
							y: n.clientHeight / 2
						}, s = r(n), l.x = s.left + a.x, l.y = s.top + a.y, u.pageX = l.x, u.pageY = l.y, f.show(u, n), t.wait >= 0 && null !== t.wait) {
						var h = {
							type: "mouseup",
							button: 1
						};
						setTimeout(function(e, t) {
							return function() {
								f.hide(e, t)
							}
						}(h, n), t.wait)
					}
		}, u.calm = function(e) {
			for (var t = {
					type: "mouseup",
					button: 1
				}, i = 0, n = (e = o(e)).length; i < n; i++) f.hide(t, e[i])
		}, u.displayEffect = function(e) {
			u.init(e)
		}, u
	});
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
		"use strict";
		_gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(e, t, i) {
				var n = function(e) {
						var t, i = [],
							n = e.length;
						for (t = 0; t !== n; i.push(e[t++]));
						return i
					},
					o = function(e, t, i) {
						var n, o, r = e.cycle;
						for (n in r) o = r[n], e[n] = "function" == typeof o ? o(i, t[i]) : o[i % o.length];
						delete e.cycle
					},
					r = function(e, t, n) {
						i.call(this, e, t, n), this._cycle = 0, this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._repeat && this._uncache(!0), this.render = r.prototype.render
					},
					a = 1e-10,
					s = i._internals,
					l = s.isSelector,
					c = s.isArray,
					u = r.prototype = i.to({}, .1, {}),
					h = [];
				r.version = "1.20.4", u.constructor = r, u.kill()._gc = !1, r.killTweensOf = r.killDelayedCallsTo = i.killTweensOf, r.getTweensOf = i.getTweensOf, r.lagSmoothing = i.lagSmoothing, r.ticker = i.ticker, r.render = i.render, u.invalidate = function() {
					return this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._yoyoEase = null, this._uncache(!0), i.prototype.invalidate.call(this)
				}, u.updateTo = function(e, t) {
					var n, o = this.ratio,
						r = this.vars.immediateRender || e.immediateRender;
					t && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
					for (n in e) this.vars[n] = e[n];
					if (this._initted || r)
						if (t) this._initted = !1, r && this.render(0, !0, !0);
						else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && i._onPluginEvent("_onDisable", this), this._time / this._duration > .998) {
						var a = this._totalTime;
						this.render(0, !0, !1), this._initted = !1, this.render(a, !0, !1)
					}
					else if (this._initted = !1, this._init(), this._time > 0 || r)
						for (var s, l = 1 / (1 - o), c = this._firstPT; c;) s = c.s + c.c, c.c *= l, c.s = s - c.c, c = c._next;
					return this
				}, u.render = function(e, t, n) {
					this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
					var o, r, l, c, u, h, d, p, f, m = this._dirty ? this.totalDuration() : this._totalDuration,
						g = this._time,
						v = this._totalTime,
						y = this._cycle,
						_ = this._duration,
						b = this._rawPrevTime;
					if (e >= m - 1e-7 && e >= 0 ? (this._totalTime = m, this._cycle = this._repeat, this._yoyo && 0 != (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = _, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (o = !0, r = "onComplete", n = n || this._timeline.autoRemoveChildren), 0 === _ && (this._initted || !this.vars.lazy || n) && (this._startTime === this._timeline._duration && (e = 0), (0 > b || 0 >= e && e >= -1e-7 || b === a && "isPause" !== this.data) && b !== e && (n = !0, b > a && (r = "onReverseComplete")), this._rawPrevTime = p = !t || e || b === e ? e : a)) : 1e-7 > e ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== v || 0 === _ && b > 0) && (r = "onReverseComplete", o = this._reversed), 0 > e && (this._active = !1, 0 === _ && (this._initted || !this.vars.lazy || n) && (b >= 0 && (n = !0), this._rawPrevTime = p = !t || e || b === e ? e : a)), this._initted || (n = !0)) : (this._totalTime = this._time = e, 0 !== this._repeat && (c = _ + this._repeatDelay, this._cycle = this._totalTime / c >> 0, 0 !== this._cycle && this._cycle === this._totalTime / c && e >= v && this._cycle--, this._time = this._totalTime - this._cycle * c, this._yoyo && 0 != (1 & this._cycle) && (this._time = _ - this._time, (f = this._yoyoEase || this.vars.yoyoEase) && (this._yoyoEase || (!0 !== f || this._initted ? this._yoyoEase = f = !0 === f ? this._ease : f instanceof Ease ? f : Ease.map[f] : (f = this.vars.ease, this._yoyoEase = f = f ? f instanceof Ease ? f : "function" == typeof f ? new Ease(f, this.vars.easeParams) : Ease.map[f] || i.defaultEase : i.defaultEase)), this.ratio = f ? 1 - f.getRatio((_ - this._time) / _) : 0)), this._time > _ ? this._time = _ : this._time < 0 && (this._time = 0)), this._easeType && !f ? (u = this._time / _, h = this._easeType, d = this._easePower, (1 === h || 3 === h && u >= .5) && (u = 1 - u), 3 === h && (u *= 2), 1 === d ? u *= u : 2 === d ? u *= u * u : 3 === d ? u *= u * u * u : 4 === d && (u *= u * u * u * u), 1 === h ? this.ratio = 1 - u : 2 === h ? this.ratio = u : this._time / _ < .5 ? this.ratio = u / 2 : this.ratio = 1 - u / 2) : f || (this.ratio = this._ease.getRatio(this._time / _))), g !== this._time || n || y !== this._cycle) {
						if (!this._initted) {
							if (this._init(), !this._initted || this._gc) return;
							if (!n && this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration)) return this._time = g, this._totalTime = v, this._rawPrevTime = b, this._cycle = y, s.lazyTweens.push(this), void(this._lazy = [e, t]);
							!this._time || o || f ? o && this._ease._calcEnd && !f && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1)) : this.ratio = this._ease.getRatio(this._time / _)
						}
						for (!1 !== this._lazy && (this._lazy = !1), this._active || !this._paused && this._time !== g && e >= 0 && (this._active = !0), 0 === v && (2 === this._initted && e > 0 && this._init(), this._startAt && (e >= 0 ? this._startAt.render(e, !0, n) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === _) && (t || this._callback("onStart"))), l = this._firstPT; l;) l.f ? l.t[l.p](l.c * this.ratio + l.s) : l.t[l.p] = l.c * this.ratio + l.s, l = l._next;
						this._onUpdate && (0 > e && this._startAt && this._startTime && this._startAt.render(e, !0, n), t || (this._totalTime !== v || r) && this._callback("onUpdate")), this._cycle !== y && (t || this._gc || this.vars.onRepeat && this._callback("onRepeat")), r && (!this._gc || n) && (0 > e && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(e, !0, n), o && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[r] && this._callback(r), 0 === _ && this._rawPrevTime === a && p !== a && (this._rawPrevTime = 0))
					}
					else v !== this._totalTime && this._onUpdate && (t || this._callback("onUpdate"))
				}, r.to = function(e, t, i) {
					return new r(e, t, i)
				}, r.from = function(e, t, i) {
					return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new r(e, t, i)
				}, r.fromTo = function(e, t, i, n) {
					return n.startAt = i, n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender, new r(e, t, n)
				}, r.staggerTo = r.allTo = function(e, t, a, s, u, d, p) {
					s = s || 0;
					var f, m, g, v, y = 0,
						_ = [],
						b = a.cycle,
						w = a.startAt && a.startAt.cycle;
					for (c(e) || ("string" == typeof e && (e = i.selector(e) || e), l(e) && (e = n(e))), e = e || [], 0 > s && ((e = n(e)).reverse(), s *= -1), f = e.length - 1, g = 0; f >= g; g++) {
						m = {};
						for (v in a) m[v] = a[v];
						if (b && (o(m, e, g), null != m.duration && (t = m.duration, delete m.duration)), w) {
							w = m.startAt = {};
							for (v in a.startAt) w[v] = a.startAt[v];
							o(m.startAt, e, g)
						}
						m.delay = y + (m.delay || 0), g === f && u && (m.onComplete = function() {
							a.onComplete && a.onComplete.apply(a.onCompleteScope || this, arguments), u.apply(p || a.callbackScope || this, d || h)
						}), _[g] = new r(e[g], t, m), y += s
					}
					return _
				}, r.staggerFrom = r.allFrom = function(e, t, i, n, o, a, s) {
					return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, r.staggerTo(e, t, i, n, o, a, s)
				}, r.staggerFromTo = r.allFromTo = function(e, t, i, n, o, a, s, l) {
					return n.startAt = i, n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender, r.staggerTo(e, t, n, o, a, s, l)
				}, r.delayedCall = function(e, t, i, n, o) {
					return new r(t, 0, {
						delay: e,
						onComplete: t,
						onCompleteParams: i,
						callbackScope: n,
						onReverseComplete: t,
						onReverseCompleteParams: i,
						immediateRender: !1,
						useFrames: o,
						overwrite: 0
					})
				}, r.set = function(e, t) {
					return new r(e, 0, t)
				}, r.isTweening = function(e) {
					return i.getTweensOf(e, !0).length > 0
				};
				var d = function(e, t) {
						for (var n = [], o = 0, r = e._first; r;) r instanceof i ? n[o++] = r : (t && (n[o++] = r), n = n.concat(d(r, t)), o = n.length), r = r._next;
						return n
					},
					p = r.getAllTweens = function(t) {
						return d(e._rootTimeline, t).concat(d(e._rootFramesTimeline, t))
					};
				r.killAll = function(e, i, n, o) {
					null == i && (i = !0), null == n && (n = !0);
					var r, a, s, l = p(0 != o),
						c = l.length,
						u = i && n && o;
					for (s = 0; c > s; s++) a = l[s], (u || a instanceof t || (r = a.target === a.vars.onComplete) && n || i && !r) && (e ? a.totalTime(a._reversed ? 0 : a.totalDuration()) : a._enabled(!1, !1))
				}, r.killChildTweensOf = function(e, t) {
					if (null != e) {
						var o, a, u, h, d, p = s.tweenLookup;
						if ("string" == typeof e && (e = i.selector(e) || e), l(e) && (e = n(e)), c(e))
							for (h = e.length; --h > -1;) r.killChildTweensOf(e[h], t);
						else {
							o = [];
							for (u in p)
								for (a = p[u].target.parentNode; a;) a === e && (o = o.concat(p[u].tweens)), a = a.parentNode;
							for (d = o.length, h = 0; d > h; h++) t && o[h].totalTime(o[h].totalDuration()), o[h]._enabled(!1, !1)
						}
					}
				};
				var f = function(e, i, n, o) {
					i = !1 !== i, n = !1 !== n;
					for (var r, a, s = p(o = !1 !== o), l = i && n && o, c = s.length; --c > -1;) a = s[c], (l || a instanceof t || (r = a.target === a.vars.onComplete) && n || i && !r) && a.paused(e)
				};
				return r.pauseAll = function(e, t, i) {
					f(!0, e, t, i)
				}, r.resumeAll = function(e, t, i) {
					f(!1, e, t, i)
				}, r.globalTimeScale = function(t) {
					var n = e._rootTimeline,
						o = i.ticker.time;
					return arguments.length ? (t = t || a, n._startTime = o - (o - n._startTime) * n._timeScale / t, n = e._rootFramesTimeline, o = i.ticker.frame, n._startTime = o - (o - n._startTime) * n._timeScale / t, n._timeScale = e._rootTimeline._timeScale = t, t) : n._timeScale
				}, u.progress = function(e, t) {
					return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - e : e) + this._cycle * (this._duration + this._repeatDelay), t) : this._time / this.duration()
				}, u.totalProgress = function(e, t) {
					return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this._totalTime / this.totalDuration()
				}, u.time = function(e, t) {
					return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this._yoyo && 0 != (1 & this._cycle) ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (e += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(e, t)) : this._time
				}, u.duration = function(t) {
					return arguments.length ? e.prototype.duration.call(this, t) : this._duration
				}, u.totalDuration = function(e) {
					return arguments.length ? -1 === this._repeat ? this : this.duration((e - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
				}, u.repeat = function(e) {
					return arguments.length ? (this._repeat = e, this._uncache(!0)) : this._repeat
				}, u.repeatDelay = function(e) {
					return arguments.length ? (this._repeatDelay = e, this._uncache(!0)) : this._repeatDelay
				}, u.yoyo = function(e) {
					return arguments.length ? (this._yoyo = e, this) : this._yoyo
				}, r
			}, !0), _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(e, t, i) {
				var n = function(e) {
						t.call(this, e), this._labels = {}, this.autoRemoveChildren = !0 === this.vars.autoRemoveChildren, this.smoothChildTiming = !0 === this.vars.smoothChildTiming, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
						var i, n, o = this.vars;
						for (n in o) i = o[n], l(i) && -1 !== i.join("").indexOf("{self}") && (o[n] = this._swapSelfInParams(i));
						l(o.tweens) && this.add(o.tweens, 0, o.align, o.stagger)
					},
					o = 1e-10,
					r = i._internals,
					a = n._internals = {},
					s = r.isSelector,
					l = r.isArray,
					c = r.lazyTweens,
					u = r.lazyRender,
					h = _gsScope._gsDefine.globals,
					d = function(e) {
						var t, i = {};
						for (t in e) i[t] = e[t];
						return i
					},
					p = function(e, t, i) {
						var n, o, r = e.cycle;
						for (n in r) o = r[n], e[n] = "function" == typeof o ? o(i, t[i]) : o[i % o.length];
						delete e.cycle
					},
					f = a.pauseCallback = function() {},
					m = function(e) {
						var t, i = [],
							n = e.length;
						for (t = 0; t !== n; i.push(e[t++]));
						return i
					},
					g = n.prototype = new t;
				return n.version = "1.20.4", g.constructor = n, g.kill()._gc = g._forcingPlayhead = g._hasPause = !1, g.to = function(e, t, n, o) {
					var r = n.repeat && h.TweenMax || i;
					return t ? this.add(new r(e, t, n), o) : this.set(e, n, o)
				}, g.from = function(e, t, n, o) {
					return this.add((n.repeat && h.TweenMax || i).from(e, t, n), o)
				}, g.fromTo = function(e, t, n, o, r) {
					var a = o.repeat && h.TweenMax || i;
					return t ? this.add(a.fromTo(e, t, n, o), r) : this.set(e, o, r)
				}, g.staggerTo = function(e, t, o, r, a, l, c, u) {
					var h, f, g = new n({
							onComplete: l,
							onCompleteParams: c,
							callbackScope: u,
							smoothChildTiming: this.smoothChildTiming
						}),
						v = o.cycle;
					for ("string" == typeof e && (e = i.selector(e) || e), s(e = e || []) && (e = m(e)), 0 > (r = r || 0) && ((e = m(e)).reverse(), r *= -1), f = 0; f < e.length; f++)(h = d(o)).startAt && (h.startAt = d(h.startAt), h.startAt.cycle && p(h.startAt, e, f)), v && (p(h, e, f), null != h.duration && (t = h.duration, delete h.duration)), g.to(e[f], t, h, f * r);
					return this.add(g, a)
				}, g.staggerFrom = function(e, t, i, n, o, r, a, s) {
					return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(e, t, i, n, o, r, a, s)
				}, g.staggerFromTo = function(e, t, i, n, o, r, a, s, l) {
					return n.startAt = i, n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender, this.staggerTo(e, t, n, o, r, a, s, l)
				}, g.call = function(e, t, n, o) {
					return this.add(i.delayedCall(0, e, t, n), o)
				}, g.set = function(e, t, n) {
					return n = this._parseTimeOrLabel(n, 0, !0), null == t.immediateRender && (t.immediateRender = n === this._time && !this._paused), this.add(new i(e, 0, t), n)
				}, n.exportRoot = function(e, t) {
					null == (e = e || {}).smoothChildTiming && (e.smoothChildTiming = !0);
					var o, r, a, s, l = new n(e),
						c = l._timeline;
					for (null == t && (t = !0), c._remove(l, !0), l._startTime = 0, l._rawPrevTime = l._time = l._totalTime = c._time, a = c._first; a;) s = a._next, t && a instanceof i && a.target === a.vars.onComplete || (0 > (r = a._startTime - a._delay) && (o = 1), l.add(a, r)), a = s;
					return c.add(l, 0), o && l.totalDuration(), l
				}, g.add = function(o, r, a, s) {
					var c, u, h, d, p, f;
					if ("number" != typeof r && (r = this._parseTimeOrLabel(r, 0, !0, o)), !(o instanceof e)) {
						if (o instanceof Array || o && o.push && l(o)) {
							for (a = a || "normal", s = s || 0, c = r, u = o.length, h = 0; u > h; h++) l(d = o[h]) && (d = new n({
								tweens: d
							})), this.add(d, c), "string" != typeof d && "function" != typeof d && ("sequence" === a ? c = d._startTime + d.totalDuration() / d._timeScale : "start" === a && (d._startTime -= d.delay())), c += s;
							return this._uncache(!0)
						}
						if ("string" == typeof o) return this.addLabel(o, r);
						if ("function" != typeof o) throw "Cannot add " + o + " into the timeline; it is not a tween, timeline, function, or string.";
						o = i.delayedCall(0, o)
					}
					if (t.prototype.add.call(this, o, r), o._time && o.render((this.rawTime() - o._startTime) * o._timeScale, !1, !1), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
						for (p = this, f = p.rawTime() > o._startTime; p._timeline;) f && p._timeline.smoothChildTiming ? p.totalTime(p._totalTime, !0) : p._gc && p._enabled(!0, !1), p = p._timeline;
					return this
				}, g.remove = function(t) {
					if (t instanceof e) {
						this._remove(t, !1);
						var i = t._timeline = t.vars.useFrames ? e._rootFramesTimeline : e._rootTimeline;
						return t._startTime = (t._paused ? t._pauseTime : i._time) - (t._reversed ? t.totalDuration() - t._totalTime : t._totalTime) / t._timeScale, this
					}
					if (t instanceof Array || t && t.push && l(t)) {
						for (var n = t.length; --n > -1;) this.remove(t[n]);
						return this
					}
					return "string" == typeof t ? this.removeLabel(t) : this.kill(null, t)
				}, g._remove = function(e, i) {
					return t.prototype._remove.call(this, e, i), this._last ? this._time > this.duration() && (this._time = this._duration, this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
				}, g.append = function(e, t) {
					return this.add(e, this._parseTimeOrLabel(null, t, !0, e))
				}, g.insert = g.insertMultiple = function(e, t, i, n) {
					return this.add(e, t || 0, i, n)
				}, g.appendMultiple = function(e, t, i, n) {
					return this.add(e, this._parseTimeOrLabel(null, t, !0, e), i, n)
				}, g.addLabel = function(e, t) {
					return this._labels[e] = this._parseTimeOrLabel(t), this
				}, g.addPause = function(e, t, n, o) {
					var r = i.delayedCall(0, f, n, o || this);
					return r.vars.onComplete = r.vars.onReverseComplete = t, r.data = "isPause", this._hasPause = !0, this.add(r, e)
				}, g.removeLabel = function(e) {
					return delete this._labels[e], this
				}, g.getLabelTime = function(e) {
					return null != this._labels[e] ? this._labels[e] : -1
				}, g._parseTimeOrLabel = function(t, i, n, o) {
					var r, a;
					if (o instanceof e && o.timeline === this) this.remove(o);
					else if (o && (o instanceof Array || o.push && l(o)))
						for (a = o.length; --a > -1;) o[a] instanceof e && o[a].timeline === this && this.remove(o[a]);
					if (r = "number" != typeof t || i ? this.duration() > 99999999999 ? this.recent().endTime(!1) : this._duration : 0, "string" == typeof i) return this._parseTimeOrLabel(i, n && "number" == typeof t && null == this._labels[i] ? t - r : 0, n);
					if (i = i || 0, "string" != typeof t || !isNaN(t) && null == this._labels[t]) null == t && (t = r);
					else {
						if (-1 === (a = t.indexOf("="))) return null == this._labels[t] ? n ? this._labels[t] = r + i : i : this._labels[t] + i;
						i = parseInt(t.charAt(a - 1) + "1", 10) * Number(t.substr(a + 1)), t = a > 1 ? this._parseTimeOrLabel(t.substr(0, a - 1), 0, n) : r
					}
					return Number(t) + i
				}, g.seek = function(e, t) {
					return this.totalTime("number" == typeof e ? e : this._parseTimeOrLabel(e), !1 !== t)
				}, g.stop = function() {
					return this.paused(!0)
				}, g.gotoAndPlay = function(e, t) {
					return this.play(e, t)
				}, g.gotoAndStop = function(e, t) {
					return this.pause(e, t)
				}, g.render = function(e, t, i) {
					this._gc && this._enabled(!0, !1);
					var n, r, a, s, l, h, d, p = this._time,
						f = this._dirty ? this.totalDuration() : this._totalDuration,
						m = this._startTime,
						g = this._timeScale,
						v = this._paused;
					if (p !== this._time && (e += this._time - p), e >= f - 1e-7 && e >= 0) this._totalTime = this._time = f, this._reversed || this._hasPausedChild() || (r = !0, s = "onComplete", l = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 >= e && e >= -1e-7 || this._rawPrevTime < 0 || this._rawPrevTime === o) && this._rawPrevTime !== e && this._first && (l = !0, this._rawPrevTime > o && (s = "onReverseComplete"))), this._rawPrevTime = this._duration || !t || e || this._rawPrevTime === e ? e : o, e = f + 1e-4;
					else if (1e-7 > e)
						if (this._totalTime = this._time = 0, (0 !== p || 0 === this._duration && this._rawPrevTime !== o && (this._rawPrevTime > 0 || 0 > e && this._rawPrevTime >= 0)) && (s = "onReverseComplete", r = this._reversed), 0 > e) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (l = r = !0, s = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (l = !0), this._rawPrevTime = e;
						else {
							if (this._rawPrevTime = this._duration || !t || e || this._rawPrevTime === e ? e : o, 0 === e && r)
								for (n = this._first; n && 0 === n._startTime;) n._duration || (r = !1), n = n._next;
							e = 0, this._initted || (l = !0)
						}
					else {
						if (this._hasPause && !this._forcingPlayhead && !t) {
							if (e >= p)
								for (n = this._first; n && n._startTime <= e && !h;) n._duration || "isPause" !== n.data || n.ratio || 0 === n._startTime && 0 === this._rawPrevTime || (h = n), n = n._next;
							else
								for (n = this._last; n && n._startTime >= e && !h;) n._duration || "isPause" === n.data && n._rawPrevTime > 0 && (h = n), n = n._prev;
							h && (this._time = e = h._startTime, this._totalTime = e + this._cycle * (this._totalDuration + this._repeatDelay))
						}
						this._totalTime = this._time = this._rawPrevTime = e
					}
					if (this._time !== p && this._first || i || l || h) {
						if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== p && e > 0 && (this._active = !0), 0 === p && this.vars.onStart && (0 === this._time && this._duration || t || this._callback("onStart")), (d = this._time) >= p)
							for (n = this._first; n && (a = n._next, d === this._time && (!this._paused || v));)(n._active || n._startTime <= d && !n._paused && !n._gc) && (h === n && this.pause(), n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, i) : n.render((e - n._startTime) * n._timeScale, t, i)), n = a;
						else
							for (n = this._last; n && (a = n._prev, d === this._time && (!this._paused || v));) {
								if (n._active || n._startTime <= p && !n._paused && !n._gc) {
									if (h === n) {
										for (h = n._prev; h && h.endTime() > this._time;) h.render(h._reversed ? h.totalDuration() - (e - h._startTime) * h._timeScale : (e - h._startTime) * h._timeScale, t, i), h = h._prev;
										h = null, this.pause()
									}
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, i) : n.render((e - n._startTime) * n._timeScale, t, i)
								}
								n = a
							}
						this._onUpdate && (t || (c.length && u(), this._callback("onUpdate"))), s && (this._gc || (m === this._startTime || g !== this._timeScale) && (0 === this._time || f >= this.totalDuration()) && (r && (c.length && u(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[s] && this._callback(s)))
					}
				}, g._hasPausedChild = function() {
					for (var e = this._first; e;) {
						if (e._paused || e instanceof n && e._hasPausedChild()) return !0;
						e = e._next
					}
					return !1
				}, g.getChildren = function(e, t, n, o) {
					o = o || -9999999999;
					for (var r = [], a = this._first, s = 0; a;) a._startTime < o || (a instanceof i ? !1 !== t && (r[s++] = a) : (!1 !== n && (r[s++] = a), !1 !== e && (r = r.concat(a.getChildren(!0, t, n)), s = r.length))), a = a._next;
					return r
				}, g.getTweensOf = function(e, t) {
					var n, o, r = this._gc,
						a = [],
						s = 0;
					for (r && this._enabled(!0, !0), o = (n = i.getTweensOf(e)).length; --o > -1;)(n[o].timeline === this || t && this._contains(n[o])) && (a[s++] = n[o]);
					return r && this._enabled(!1, !0), a
				}, g.recent = function() {
					return this._recent
				}, g._contains = function(e) {
					for (var t = e.timeline; t;) {
						if (t === this) return !0;
						t = t.timeline
					}
					return !1
				}, g.shiftChildren = function(e, t, i) {
					i = i || 0;
					for (var n, o = this._first, r = this._labels; o;) o._startTime >= i && (o._startTime += e), o = o._next;
					if (t)
						for (n in r) r[n] >= i && (r[n] += e);
					return this._uncache(!0)
				}, g._kill = function(e, t) {
					if (!e && !t) return this._enabled(!1, !1);
					for (var i = t ? this.getTweensOf(t) : this.getChildren(!0, !0, !1), n = i.length, o = !1; --n > -1;) i[n]._kill(e, t) && (o = !0);
					return o
				}, g.clear = function(e) {
					var t = this.getChildren(!1, !0, !0),
						i = t.length;
					for (this._time = this._totalTime = 0; --i > -1;) t[i]._enabled(!1, !1);
					return !1 !== e && (this._labels = {}), this._uncache(!0)
				}, g.invalidate = function() {
					for (var t = this._first; t;) t.invalidate(), t = t._next;
					return e.prototype.invalidate.call(this)
				}, g._enabled = function(e, i) {
					if (e === this._gc)
						for (var n = this._first; n;) n._enabled(e, !0), n = n._next;
					return t.prototype._enabled.call(this, e, i)
				}, g.totalTime = function(t, i, n) {
					this._forcingPlayhead = !0;
					var o = e.prototype.totalTime.apply(this, arguments);
					return this._forcingPlayhead = !1, o
				}, g.duration = function(e) {
					return arguments.length ? (0 !== this.duration() && 0 !== e && this.timeScale(this._duration / e), this) : (this._dirty && this.totalDuration(), this._duration)
				}, g.totalDuration = function(e) {
					if (!arguments.length) {
						if (this._dirty) {
							for (var t, i, n = 0, o = this._last, r = 999999999999; o;) t = o._prev, o._dirty && o.totalDuration(), o._startTime > r && this._sortChildren && !o._paused && !this._calculatingDuration ? (this._calculatingDuration = 1, this.add(o, o._startTime - o._delay), this._calculatingDuration = 0) : r = o._startTime, o._startTime < 0 && !o._paused && (n -= o._startTime, this._timeline.smoothChildTiming && (this._startTime += o._startTime / this._timeScale, this._time -= o._startTime, this._totalTime -= o._startTime, this._rawPrevTime -= o._startTime), this.shiftChildren(-o._startTime, !1, -9999999999), r = 0), (i = o._startTime + o._totalDuration / o._timeScale) > n && (n = i), o = t;
							this._duration = this._totalDuration = n, this._dirty = !1
						}
						return this._totalDuration
					}
					return e && this.totalDuration() ? this.timeScale(this._totalDuration / e) : this
				}, g.paused = function(t) {
					if (!t)
						for (var i = this._first, n = this._time; i;) i._startTime === n && "isPause" === i.data && (i._rawPrevTime = 0), i = i._next;
					return e.prototype.paused.apply(this, arguments)
				}, g.usesFrames = function() {
					for (var t = this._timeline; t._timeline;) t = t._timeline;
					return t === e._rootFramesTimeline
				}, g.rawTime = function(e) {
					return e && (this._paused || this._repeat && this.time() > 0 && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(e) - this._startTime) * this._timeScale
				}, n
			}, !0), _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(e, t, i) {
				var n = function(t) {
						e.call(this, t), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = !0 === this.vars.yoyo, this._dirty = !0
					},
					o = 1e-10,
					r = t._internals,
					a = r.lazyTweens,
					s = r.lazyRender,
					l = _gsScope._gsDefine.globals,
					c = new i(null, null, 1, 0),
					u = n.prototype = new e;
				return u.constructor = n, u.kill()._gc = !1, n.version = "1.20.4", u.invalidate = function() {
					return this._yoyo = !0 === this.vars.yoyo, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), e.prototype.invalidate.call(this)
				}, u.addCallback = function(e, i, n, o) {
					return this.add(t.delayedCall(0, e, n, o), i)
				}, u.removeCallback = function(e, t) {
					if (e)
						if (null == t) this._kill(null, e);
						else
							for (var i = this.getTweensOf(e, !1), n = i.length, o = this._parseTimeOrLabel(t); --n > -1;) i[n]._startTime === o && i[n]._enabled(!1, !1);
					return this
				}, u.removePause = function(t) {
					return this.removeCallback(e._internals.pauseCallback, t)
				}, u.tweenTo = function(e, i) {
					i = i || {};
					var n, o, r, a = {
							ease: c,
							useFrames: this.usesFrames(),
							immediateRender: !1,
							lazy: !1
						},
						s = i.repeat && l.TweenMax || t;
					for (o in i) a[o] = i[o];
					return a.time = this._parseTimeOrLabel(e), n = Math.abs(Number(a.time) - this._time) / this._timeScale || .001, r = new s(this, n, a), a.onStart = function() {
						r.target.paused(!0), r.vars.time === r.target.time() || n !== r.duration() || r.isFromTo || r.duration(Math.abs(r.vars.time - r.target.time()) / r.target._timeScale).render(r.time(), !0, !0), i.onStart && i.onStart.apply(i.onStartScope || i.callbackScope || r, i.onStartParams || [])
					}, r
				}, u.tweenFromTo = function(e, t, i) {
					i = i || {}, e = this._parseTimeOrLabel(e), i.startAt = {
						onComplete: this.seek,
						onCompleteParams: [e],
						callbackScope: this
					}, i.immediateRender = !1 !== i.immediateRender;
					var n = this.tweenTo(t, i);
					return n.isFromTo = 1, n.duration(Math.abs(n.vars.time - e) / this._timeScale || .001)
				}, u.render = function(e, t, i) {
					this._gc && this._enabled(!0, !1);
					var n, r, l, c, u, h, d, p, f = this._time,
						m = this._dirty ? this.totalDuration() : this._totalDuration,
						g = this._duration,
						v = this._totalTime,
						y = this._startTime,
						_ = this._timeScale,
						b = this._rawPrevTime,
						w = this._paused,
						x = this._cycle;
					if (f !== this._time && (e += this._time - f), e >= m - 1e-7 && e >= 0) this._locked || (this._totalTime = m, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (r = !0, c = "onComplete", u = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 >= e && e >= -1e-7 || 0 > b || b === o) && b !== e && this._first && (u = !0, b > o && (c = "onReverseComplete"))), this._rawPrevTime = this._duration || !t || e || this._rawPrevTime === e ? e : o, this._yoyo && 0 != (1 & this._cycle) ? this._time = e = 0 : (this._time = g, e = g + 1e-4);
					else if (1e-7 > e)
						if (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== f || 0 === g && b !== o && (b > 0 || 0 > e && b >= 0) && !this._locked) && (c = "onReverseComplete", r = this._reversed), 0 > e) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (u = r = !0, c = "onReverseComplete") : b >= 0 && this._first && (u = !0), this._rawPrevTime = e;
						else {
							if (this._rawPrevTime = g || !t || e || this._rawPrevTime === e ? e : o, 0 === e && r)
								for (n = this._first; n && 0 === n._startTime;) n._duration || (r = !1), n = n._next;
							e = 0, this._initted || (u = !0)
						}
					else if (0 === g && 0 > b && (u = !0), this._time = this._rawPrevTime = e, this._locked || (this._totalTime = e, 0 !== this._repeat && (h = g + this._repeatDelay, this._cycle = this._totalTime / h >> 0, 0 !== this._cycle && this._cycle === this._totalTime / h && e >= v && this._cycle--, this._time = this._totalTime - this._cycle * h, this._yoyo && 0 != (1 & this._cycle) && (this._time = g - this._time), this._time > g ? (this._time = g, e = g + 1e-4) : this._time < 0 ? this._time = e = 0 : e = this._time)), this._hasPause && !this._forcingPlayhead && !t) {
						if ((e = this._time) >= f || this._repeat && x !== this._cycle)
							for (n = this._first; n && n._startTime <= e && !d;) n._duration || "isPause" !== n.data || n.ratio || 0 === n._startTime && 0 === this._rawPrevTime || (d = n), n = n._next;
						else
							for (n = this._last; n && n._startTime >= e && !d;) n._duration || "isPause" === n.data && n._rawPrevTime > 0 && (d = n), n = n._prev;
						d && d._startTime < g && (this._time = e = d._startTime, this._totalTime = e + this._cycle * (this._totalDuration + this._repeatDelay))
					}
					if (this._cycle !== x && !this._locked) {
						var T = this._yoyo && 0 != (1 & x),
							k = T === (this._yoyo && 0 != (1 & this._cycle)),
							C = this._totalTime,
							S = this._cycle,
							A = this._rawPrevTime,
							E = this._time;
						if (this._totalTime = x * g, this._cycle < x ? T = !T : this._totalTime += g, this._time = f, this._rawPrevTime = 0 === g ? b - 1e-4 : b, this._cycle = x, this._locked = !0, f = T ? 0 : g, this.render(f, t, 0 === g), t || this._gc || this.vars.onRepeat && (this._cycle = S, this._locked = !1, this._callback("onRepeat")), f !== this._time) return;
						if (k && (this._cycle = x, this._locked = !0, f = T ? g + 1e-4 : -1e-4, this.render(f, !0, !1)), this._locked = !1, this._paused && !w) return;
						this._time = E, this._totalTime = C, this._cycle = S, this._rawPrevTime = A
					}
					if (this._time !== f && this._first || i || u || d) {
						if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== v && e > 0 && (this._active = !0), 0 === v && this.vars.onStart && (0 === this._totalTime && this._totalDuration || t || this._callback("onStart")), (p = this._time) >= f)
							for (n = this._first; n && (l = n._next, p === this._time && (!this._paused || w));)(n._active || n._startTime <= this._time && !n._paused && !n._gc) && (d === n && this.pause(), n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, i) : n.render((e - n._startTime) * n._timeScale, t, i)), n = l;
						else
							for (n = this._last; n && (l = n._prev, p === this._time && (!this._paused || w));) {
								if (n._active || n._startTime <= f && !n._paused && !n._gc) {
									if (d === n) {
										for (d = n._prev; d && d.endTime() > this._time;) d.render(d._reversed ? d.totalDuration() - (e - d._startTime) * d._timeScale : (e - d._startTime) * d._timeScale, t, i), d = d._prev;
										d = null, this.pause()
									}
									n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (e - n._startTime) * n._timeScale, t, i) : n.render((e - n._startTime) * n._timeScale, t, i)
								}
								n = l
							}
						this._onUpdate && (t || (a.length && s(), this._callback("onUpdate"))), c && (this._locked || this._gc || (y === this._startTime || _ !== this._timeScale) && (0 === this._time || m >= this.totalDuration()) && (r && (a.length && s(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[c] && this._callback(c)))
					}
					else v !== this._totalTime && this._onUpdate && (t || this._callback("onUpdate"))
				}, u.getActive = function(e, t, i) {
					null == e && (e = !0), null == t && (t = !0), null == i && (i = !1);
					var n, o, r = [],
						a = this.getChildren(e, t, i),
						s = 0,
						l = a.length;
					for (n = 0; l > n; n++)(o = a[n]).isActive() && (r[s++] = o);
					return r
				}, u.getLabelAfter = function(e) {
					e || 0 !== e && (e = this._time);
					var t, i = this.getLabelsArray(),
						n = i.length;
					for (t = 0; n > t; t++)
						if (i[t].time > e) return i[t].name;
					return null
				}, u.getLabelBefore = function(e) {
					null == e && (e = this._time);
					for (var t = this.getLabelsArray(), i = t.length; --i > -1;)
						if (t[i].time < e) return t[i].name;
					return null
				}, u.getLabelsArray = function() {
					var e, t = [],
						i = 0;
					for (e in this._labels) t[i++] = {
						time: this._labels[e],
						name: e
					};
					return t.sort(function(e, t) {
						return e.time - t.time
					}), t
				}, u.invalidate = function() {
					return this._locked = !1, e.prototype.invalidate.call(this)
				}, u.progress = function(e, t) {
					return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - e : e) + this._cycle * (this._duration + this._repeatDelay), t) : this._time / this.duration() || 0
				}, u.totalProgress = function(e, t) {
					return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this._totalTime / this.totalDuration() || 0
				}, u.totalDuration = function(t) {
					return arguments.length ? -1 !== this._repeat && t ? this.timeScale(this.totalDuration() / t) : this : (this._dirty && (e.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
				}, u.time = function(e, t) {
					return arguments.length ? (this._dirty && this.totalDuration(), e > this._duration && (e = this._duration), this._yoyo && 0 != (1 & this._cycle) ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (e += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(e, t)) : this._time
				}, u.repeat = function(e) {
					return arguments.length ? (this._repeat = e, this._uncache(!0)) : this._repeat
				}, u.repeatDelay = function(e) {
					return arguments.length ? (this._repeatDelay = e, this._uncache(!0)) : this._repeatDelay
				}, u.yoyo = function(e) {
					return arguments.length ? (this._yoyo = e, this) : this._yoyo
				}, u.currentLabel = function(e) {
					return arguments.length ? this.seek(e, !0) : this.getLabelBefore(this._time + 1e-8)
				}, n
			}, !0),
			function() {
				var e = 180 / Math.PI,
					t = [],
					i = [],
					n = [],
					o = {},
					r = _gsScope._gsDefine.globals,
					a = function(e, t, i, n) {
						i === n && (i = n - (n - t) / 1e6), e === t && (t = e + (i - e) / 1e6), this.a = e, this.b = t, this.c = i, this.d = n, this.da = n - e, this.ca = i - e, this.ba = t - e
					},
					s = function(e, t, i, n) {
						var o = {
								a: e
							},
							r = {},
							a = {},
							s = {
								c: n
							},
							l = (e + t) / 2,
							c = (t + i) / 2,
							u = (i + n) / 2,
							h = (l + c) / 2,
							d = (c + u) / 2,
							p = (d - h) / 8;
						return o.b = l + (e - l) / 4, r.b = h + p, o.c = r.a = (o.b + r.b) / 2, r.c = a.a = (h + d) / 2, a.b = d - p, s.b = u + (n - u) / 4, a.c = s.a = (a.b + s.b) / 2, [o, r, a, s]
					},
					l = function(e, o, r, a, l) {
						var c, u, h, d, p, f, m, g, v, y, _, b, w, x = e.length - 1,
							T = 0,
							k = e[0].a;
						for (c = 0; x > c; c++) p = e[T], u = p.a, h = p.d, d = e[T + 1].d, l ? (_ = t[c], b = i[c], w = (b + _) * o * .25 / (a ? .5 : n[c] || .5), f = h - (h - u) * (a ? .5 * o : 0 !== _ ? w / _ : 0), m = h + (d - h) * (a ? .5 * o : 0 !== b ? w / b : 0), g = h - (f + ((m - f) * (3 * _ / (_ + b) + .5) / 4 || 0))) : (f = h - (h - u) * o * .5, m = h + (d - h) * o * .5, g = h - (f + m) / 2), f += g, m += g, p.c = v = f, p.b = 0 !== c ? k : k = p.a + .6 * (p.c - p.a), p.da = h - u, p.ca = v - u, p.ba = k - u, r ? (y = s(u, k, v, h), e.splice(T, 1, y[0], y[1], y[2], y[3]), T += 4) : T++, k = m;
						(p = e[T]).b = k, p.c = k + .4 * (p.d - k), p.da = p.d - p.a, p.ca = p.c - p.a, p.ba = k - p.a, r && (y = s(p.a, k, p.c, p.d), e.splice(T, 1, y[0], y[1], y[2], y[3]))
					},
					c = function(e, n, o, r) {
						var s, l, c, u, h, d, p = [];
						if (r)
							for (e = [r].concat(e), l = e.length; --l > -1;) "string" == typeof(d = e[l][n]) && "=" === d.charAt(1) && (e[l][n] = r[n] + Number(d.charAt(0) + d.substr(2)));
						if (0 > (s = e.length - 2)) return p[0] = new a(e[0][n], 0, 0, e[0][n]), p;
						for (l = 0; s > l; l++) c = e[l][n], u = e[l + 1][n], p[l] = new a(c, 0, 0, u), o && (h = e[l + 2][n], t[l] = (t[l] || 0) + (u - c) * (u - c), i[l] = (i[l] || 0) + (h - u) * (h - u));
						return p[l] = new a(e[l][n], 0, 0, e[l + 1][n]), p
					},
					u = function(e, r, a, s, u, h) {
						var d, p, f, m, g, v, y, _, b = {},
							w = [],
							x = h || e[0];
						u = "string" == typeof u ? "," + u + "," : ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,", null == r && (r = 1);
						for (p in e[0]) w.push(p);
						if (e.length > 1) {
							for (_ = e[e.length - 1], y = !0, d = w.length; --d > -1;)
								if (p = w[d], Math.abs(x[p] - _[p]) > .05) {
									y = !1;
									break
								}
							y && (e = e.concat(), h && e.unshift(h), e.push(e[1]), h = e[e.length - 3])
						}
						for (t.length = i.length = n.length = 0, d = w.length; --d > -1;) p = w[d], o[p] = -1 !== u.indexOf("," + p + ","), b[p] = c(e, p, o[p], h);
						for (d = t.length; --d > -1;) t[d] = Math.sqrt(t[d]), i[d] = Math.sqrt(i[d]);
						if (!s) {
							for (d = w.length; --d > -1;)
								if (o[p])
									for (f = b[w[d]], v = f.length - 1, m = 0; v > m; m++) g = f[m + 1].da / i[m] + f[m].da / t[m] || 0, n[m] = (n[m] || 0) + g * g;
							for (d = n.length; --d > -1;) n[d] = Math.sqrt(n[d])
						}
						for (d = w.length, m = a ? 4 : 1; --d > -1;) p = w[d], f = b[p], l(f, r, a, s, o[p]), y && (f.splice(0, m), f.splice(f.length - m, m));
						return b
					},
					h = function(e, t, i) {
						var n, o, r, s, l, c, u, h, d, p, f, m = {},
							g = "cubic" === (t = t || "soft") ? 3 : 2,
							v = "soft" === t,
							y = [];
						if (v && i && (e = [i].concat(e)), null == e || e.length < g + 1) throw "invalid Bezier data";
						for (d in e[0]) y.push(d);
						for (c = y.length; --c > -1;) {
							for (m[d = y[c]] = l = [], p = 0, h = e.length, u = 0; h > u; u++) n = null == i ? e[u][d] : "string" == typeof(f = e[u][d]) && "=" === f.charAt(1) ? i[d] + Number(f.charAt(0) + f.substr(2)) : Number(f), v && u > 1 && h - 1 > u && (l[p++] = (n + l[p - 2]) / 2), l[p++] = n;
							for (h = p - g + 1, p = 0, u = 0; h > u; u += g) n = l[u], o = l[u + 1], r = l[u + 2], s = 2 === g ? 0 : l[u + 3], l[p++] = f = 3 === g ? new a(n, o, r, s) : new a(n, (2 * o + n) / 3, (2 * o + r) / 3, r);
							l.length = p
						}
						return m
					},
					d = function(e, t, i) {
						for (var n, o, r, a, s, l, c, u, h, d, p, f = 1 / i, m = e.length; --m > -1;)
							for (d = e[m], r = d.a, a = d.d - r, s = d.c - r, l = d.b - r, n = o = 0, u = 1; i >= u; u++) c = f * u, h = 1 - c, n = o - (o = (c * c * a + 3 * h * (c * s + h * l)) * c), p = m * i + u - 1, t[p] = (t[p] || 0) + n * n
					},
					p = function(e, t) {
						var i, n, o, r, a = [],
							s = [],
							l = 0,
							c = 0,
							u = (t = t >> 0 || 6) - 1,
							h = [],
							p = [];
						for (i in e) d(e[i], a, t);
						for (o = a.length, n = 0; o > n; n++) l += Math.sqrt(a[n]), r = n % t, p[r] = l, r === u && (c += l, r = n / t >> 0, h[r] = p, s[r] = c, l = 0, p = []);
						return {
							length: c,
							lengths: s,
							segments: h
						}
					},
					f = _gsScope._gsDefine.plugin({
						propName: "bezier",
						priority: -1,
						version: "1.3.8",
						API: 2,
						global: !0,
						init: function(e, t, i) {
							this._target = e, t instanceof Array && (t = {
								values: t
							}), this._func = {}, this._mod = {}, this._props = [], this._timeRes = null == t.timeResolution ? 6 : parseInt(t.timeResolution, 10);
							var n, o, r, a, s, l = t.values || [],
								c = {},
								d = l[0],
								f = t.autoRotate || i.vars.orientToBezier;
							this._autoRotate = f ? f instanceof Array ? f : [
								["x", "y", "rotation", !0 === f ? 0 : Number(f) || 0]
							] : null;
							for (n in d) this._props.push(n);
							for (r = this._props.length; --r > -1;) n = this._props[r], this._overwriteProps.push(n), o = this._func[n] = "function" == typeof e[n], c[n] = o ? e[n.indexOf("set") || "function" != typeof e["get" + n.substr(3)] ? n : "get" + n.substr(3)]() : parseFloat(e[n]), s || c[n] !== l[0][n] && (s = c);
							if (this._beziers = "cubic" !== t.type && "quadratic" !== t.type && "soft" !== t.type ? u(l, isNaN(t.curviness) ? 1 : t.curviness, !1, "thruBasic" === t.type, t.correlate, s) : h(l, t.type, c), this._segCount = this._beziers[n].length, this._timeRes) {
								var m = p(this._beziers, this._timeRes);
								this._length = m.length, this._lengths = m.lengths, this._segments = m.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length
							}
							if (f = this._autoRotate)
								for (this._initialRotations = [], f[0] instanceof Array || (this._autoRotate = f = [f]), r = f.length; --r > -1;) {
									for (a = 0; 3 > a; a++) n = f[r][a], this._func[n] = "function" == typeof e[n] && e[n.indexOf("set") || "function" != typeof e["get" + n.substr(3)] ? n : "get" + n.substr(3)];
									n = f[r][2], this._initialRotations[r] = (this._func[n] ? this._func[n].call(this._target) : this._target[n]) || 0, this._overwriteProps.push(n)
								}
							return this._startRatio = i.vars.runBackwards ? 1 : 0, !0
						},
						set: function(t) {
							var i, n, o, r, a, s, l, c, u, h, d = this._segCount,
								p = this._func,
								f = this._target,
								m = t !== this._startRatio;
							if (this._timeRes) {
								if (u = this._lengths, h = this._curSeg, t *= this._length, o = this._li, t > this._l2 && d - 1 > o) {
									for (c = d - 1; c > o && (this._l2 = u[++o]) <= t;);
									this._l1 = u[o - 1], this._li = o, this._curSeg = h = this._segments[o], this._s2 = h[this._s1 = this._si = 0]
								}
								else if (t < this._l1 && o > 0) {
									for (; o > 0 && (this._l1 = u[--o]) >= t;);
									0 === o && t < this._l1 ? this._l1 = 0 : o++, this._l2 = u[o], this._li = o, this._curSeg = h = this._segments[o], this._s1 = h[(this._si = h.length - 1) - 1] || 0, this._s2 = h[this._si]
								}
								if (i = o, t -= this._l1, o = this._si, t > this._s2 && o < h.length - 1) {
									for (c = h.length - 1; c > o && (this._s2 = h[++o]) <= t;);
									this._s1 = h[o - 1], this._si = o
								}
								else if (t < this._s1 && o > 0) {
									for (; o > 0 && (this._s1 = h[--o]) >= t;);
									0 === o && t < this._s1 ? this._s1 = 0 : o++, this._s2 = h[o], this._si = o
								}
								s = (o + (t - this._s1) / (this._s2 - this._s1)) * this._prec || 0
							}
							else i = 0 > t ? 0 : t >= 1 ? d - 1 : d * t >> 0, s = (t - i * (1 / d)) * d;
							for (n = 1 - s, o = this._props.length; --o > -1;) r = this._props[o], a = this._beziers[r][i], l = (s * s * a.da + 3 * n * (s * a.ca + n * a.ba)) * s + a.a, this._mod[r] && (l = this._mod[r](l, f)), p[r] ? f[r](l) : f[r] = l;
							if (this._autoRotate) {
								var g, v, y, _, b, w, x, T = this._autoRotate;
								for (o = T.length; --o > -1;) r = T[o][2], w = T[o][3] || 0, x = !0 === T[o][4] ? 1 : e, a = this._beziers[T[o][0]], g = this._beziers[T[o][1]], a && g && (a = a[i], g = g[i], v = a.a + (a.b - a.a) * s, _ = a.b + (a.c - a.b) * s, v += (_ - v) * s, _ += (a.c + (a.d - a.c) * s - _) * s, y = g.a + (g.b - g.a) * s, b = g.b + (g.c - g.b) * s, y += (b - y) * s, b += (g.c + (g.d - g.c) * s - b) * s, l = m ? Math.atan2(b - y, _ - v) * x + w : this._initialRotations[o], this._mod[r] && (l = this._mod[r](l, f)), p[r] ? f[r](l) : f[r] = l)
							}
						}
					}),
					m = f.prototype;
				f.bezierThrough = u, f.cubicToQuadratic = s, f._autoCSS = !0, f.quadraticToCubic = function(e, t, i) {
					return new a(e, (2 * t + e) / 3, (2 * t + i) / 3, i)
				}, f._cssRegister = function() {
					var e = r.CSSPlugin;
					if (e) {
						var t = e._internals,
							i = t._parseToProxy,
							n = t._setPluginRatio,
							o = t.CSSPropTween;
						t._registerComplexSpecialProp("bezier", {
							parser: function(e, t, r, a, s, l) {
								t instanceof Array && (t = {
									values: t
								}), l = new f;
								var c, u, h, d = t.values,
									p = d.length - 1,
									m = [],
									g = {};
								if (0 > p) return s;
								for (c = 0; p >= c; c++) h = i(e, d[c], a, s, l, p !== c), m[c] = h.end;
								for (u in t) g[u] = t[u];
								return g.values = m, s = new o(e, "bezier", 0, 0, h.pt, 2), s.data = h, s.plugin = l, s.setRatio = n, 0 === g.autoRotate && (g.autoRotate = !0), !g.autoRotate || g.autoRotate instanceof Array || (c = !0 === g.autoRotate ? 0 : Number(g.autoRotate), g.autoRotate = null != h.end.left ? [
									["left", "top", "rotation", c, !1]
								] : null != h.end.x && [
									["x", "y", "rotation", c, !1]
								]), g.autoRotate && (a._transform || a._enableTransforms(!1), h.autoRotate = a._target._gsTransform, h.proxy.rotation = h.autoRotate.rotation || 0, a._overwriteProps.push("rotation")), l._onInitTween(h.proxy, g, a._tween), s
							}
						})
					}
				}, m._mod = function(e) {
					for (var t, i = this._overwriteProps, n = i.length; --n > -1;)(t = e[i[n]]) && "function" == typeof t && (this._mod[i[n]] = t)
				}, m._kill = function(e) {
					var t, i, n = this._props;
					for (t in this._beziers)
						if (t in e)
							for (delete this._beziers[t], delete this._func[t], i = n.length; --i > -1;) n[i] === t && n.splice(i, 1);
					if (n = this._autoRotate)
						for (i = n.length; --i > -1;) e[n[i][2]] && n.splice(i, 1);
					return this._super._kill.call(this, e)
				}
			}(), _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(e, t) {
				var i, n, o, r, a = function() {
						e.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = a.prototype.setRatio
					},
					s = _gsScope._gsDefine.globals,
					l = {},
					c = a.prototype = new e("css");
				c.constructor = a, a.version = "1.20.4", a.API = 2, a.defaultTransformPerspective = 0, a.defaultSkewType = "compensated", a.defaultSmoothOrigin = !0, c = "px", a.suffixMap = {
					top: c,
					right: c,
					bottom: c,
					left: c,
					width: c,
					height: c,
					fontSize: c,
					padding: c,
					margin: c,
					perspective: c,
					lineHeight: ""
				};
				var u, h, d, p, f, m, g, v, y = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
					_ = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
					b = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
					w = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
					x = /(?:\d|\-|\+|=|#|\.)*/g,
					T = /opacity *= *([^)]*)/i,
					k = /opacity:([^;]*)/i,
					C = /alpha\(opacity *=.+?\)/i,
					S = /^(rgb|hsl)/,
					A = /([A-Z])/g,
					E = /-([a-z])/gi,
					P = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
					O = function(e, t) {
						return t.toUpperCase()
					},
					$ = /(?:Left|Right|Width)/i,
					M = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
					D = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
					z = /,(?=[^\)]*(?:\(|$))/gi,
					L = /[\s,\(]/i,
					I = Math.PI / 180,
					F = 180 / Math.PI,
					j = {},
					R = {
						style: {}
					},
					N = _gsScope.document || {
						createElement: function() {
							return R
						}
					},
					H = function(e, t) {
						return N.createElementNS ? N.createElementNS(t || "http://www.w3.org/1999/xhtml", e) : N.createElement(e)
					},
					q = H("div"),
					B = H("img"),
					W = a._internals = {
						_specialProps: l
					},
					U = (_gsScope.navigator || {}).userAgent || "",
					X = function() {
						var e = U.indexOf("Android"),
							t = H("a");
						return d = -1 !== U.indexOf("Safari") && -1 === U.indexOf("Chrome") && (-1 === e || parseFloat(U.substr(e + 8, 2)) > 3), f = d && parseFloat(U.substr(U.indexOf("Version/") + 8, 2)) < 6, p = -1 !== U.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(U) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(U)) && (m = parseFloat(RegExp.$1)), !!t && (t.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(t.style.opacity))
					}(),
					Y = function(e) {
						return T.test("string" == typeof e ? e : (e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
					},
					V = function(e) {
						_gsScope.console
					},
					Q = "",
					G = "",
					Z = function(e, t) {
						var i, n, o = (t = t || q).style;
						if (void 0 !== o[e]) return e;
						for (e = e.charAt(0).toUpperCase() + e.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], n = 5; --n > -1 && void 0 === o[i[n] + e];);
						return n >= 0 ? (G = 3 === n ? "ms" : i[n], Q = "-" + G.toLowerCase() + "-", G + e) : null
					},
					K = N.defaultView ? N.defaultView.getComputedStyle : function() {},
					J = a.getStyle = function(e, t, i, n, o) {
						var r;
						return X || "opacity" !== t ? (!n && e.style[t] ? r = e.style[t] : (i = i || K(e)) ? r = i[t] || i.getPropertyValue(t) || i.getPropertyValue(t.replace(A, "-$1").toLowerCase()) : e.currentStyle && (r = e.currentStyle[t]), null == o || r && "none" !== r && "auto" !== r && "auto auto" !== r ? r : o) : Y(e)
					},
					ee = W.convertToPixels = function(e, i, n, o, r) {
						if ("px" === o || !o && "lineHeight" !== i) return n;
						if ("auto" === o || !n) return 0;
						var s, l, c, u = $.test(i),
							h = e,
							d = q.style,
							p = 0 > n,
							f = 1 === n;
						if (p && (n = -n), f && (n *= 100), "lineHeight" !== i || o)
							if ("%" === o && -1 !== i.indexOf("border")) s = n / 100 * (u ? e.clientWidth : e.clientHeight);
							else {
								if (d.cssText = "border:0 solid red;position:" + J(e, "position") + ";line-height:0;", "%" !== o && h.appendChild && "v" !== o.charAt(0) && "rem" !== o) d[u ? "borderLeftWidth" : "borderTopWidth"] = n + o;
								else {
									if (h = e.parentNode || N.body, -1 !== J(h, "display").indexOf("flex") && (d.position = "absolute"), l = h._gsCache, c = t.ticker.frame, l && u && l.time === c) return l.width * n / 100;
									d[u ? "width" : "height"] = n + o
								}
								h.appendChild(q), s = parseFloat(q[u ? "offsetWidth" : "offsetHeight"]), h.removeChild(q), u && "%" === o && !1 !== a.cacheWidths && (l = h._gsCache = h._gsCache || {}, l.time = c, l.width = s / n * 100), 0 !== s || r || (s = ee(e, i, n, o, !0))
							}
						else l = K(e).lineHeight, e.style.lineHeight = n, s = parseFloat(K(e).lineHeight), e.style.lineHeight = l;
						return f && (s /= 100), p ? -s : s
					},
					te = W.calculateOffset = function(e, t, i) {
						if ("absolute" !== J(e, "position", i)) return 0;
						var n = "left" === t ? "Left" : "Top",
							o = J(e, "margin" + n, i);
						return e["offset" + n] - (ee(e, t, parseFloat(o), o.replace(x, "")) || 0)
					},
					ie = function(e, t) {
						var i, n, o, r = {};
						if (t = t || K(e, null))
							if (i = t.length)
								for (; --i > -1;)(-1 === (o = t[i]).indexOf("-transform") || Pe === o) && (r[o.replace(E, O)] = t.getPropertyValue(o));
							else
								for (i in t)(-1 === i.indexOf("Transform") || Ee === i) && (r[i] = t[i]);
						else if (t = e.currentStyle || e.style)
							for (i in t) "string" == typeof i && void 0 === r[i] && (r[i.replace(E, O)] = t[i]);
						return X || (r.opacity = Y(e)), n = Be(e, t, !1), r.rotation = n.rotation, r.skewX = n.skewX, r.scaleX = n.scaleX, r.scaleY = n.scaleY, r.x = n.x, r.y = n.y, $e && (r.z = n.z, r.rotationX = n.rotationX, r.rotationY = n.rotationY, r.scaleZ = n.scaleZ), r.filters && delete r.filters, r
					},
					ne = function(e, t, i, n, o) {
						var r, a, s, l = {},
							c = e.style;
						for (a in i) "cssText" !== a && "length" !== a && isNaN(a) && (t[a] !== (r = i[a]) || o && o[a]) && -1 === a.indexOf("Origin") && ("number" == typeof r || "string" == typeof r) && (l[a] = "auto" !== r || "left" !== a && "top" !== a ? "" !== r && "auto" !== r && "none" !== r || "string" != typeof t[a] || "" === t[a].replace(w, "") ? r : 0 : te(e, a), void 0 !== c[a] && (s = new ye(c, a, c[a], s)));
						if (n)
							for (a in n) "className" !== a && (l[a] = n[a]);
						return {
							difs: l,
							firstMPT: s
						}
					},
					oe = {
						width: ["Left", "Right"],
						height: ["Top", "Bottom"]
					},
					re = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
					ae = function(e, t, i) {
						if ("svg" === (e.nodeName + "").toLowerCase()) return (i || K(e))[t] || 0;
						if (e.getCTM && Ne(e)) return e.getBBox()[t] || 0;
						var n = parseFloat("width" === t ? e.offsetWidth : e.offsetHeight),
							o = oe[t],
							r = o.length;
						for (i = i || K(e, null); --r > -1;) n -= parseFloat(J(e, "padding" + o[r], i, !0)) || 0, n -= parseFloat(J(e, "border" + o[r] + "Width", i, !0)) || 0;
						return n
					},
					se = function(e, t) {
						if ("contain" === e || "auto" === e || "auto auto" === e) return e + " ";
						(null == e || "" === e) && (e = "0 0");
						var i, n = e.split(" "),
							o = -1 !== e.indexOf("left") ? "0%" : -1 !== e.indexOf("right") ? "100%" : n[0],
							r = -1 !== e.indexOf("top") ? "0%" : -1 !== e.indexOf("bottom") ? "100%" : n[1];
						if (n.length > 3 && !t) {
							for (n = e.split(", ").join(",").split(","), e = [], i = 0; i < n.length; i++) e.push(se(n[i]));
							return e.join(",")
						}
						return null == r ? r = "center" === o ? "50%" : "0" : "center" === r && (r = "50%"), ("center" === o || isNaN(parseFloat(o)) && -1 === (o + "").indexOf("=")) && (o = "50%"), e = o + " " + r + (n.length > 2 ? " " + n[2] : ""), t && (t.oxp = -1 !== o.indexOf("%"), t.oyp = -1 !== r.indexOf("%"), t.oxr = "=" === o.charAt(1), t.oyr = "=" === r.charAt(1), t.ox = parseFloat(o.replace(w, "")), t.oy = parseFloat(r.replace(w, "")), t.v = e), t || e
					},
					le = function(e, t) {
						return "function" == typeof e && (e = e(v, g)), "string" == typeof e && "=" === e.charAt(1) ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : parseFloat(e) - parseFloat(t) || 0
					},
					ce = function(e, t) {
						return "function" == typeof e && (e = e(v, g)), null == e ? t : "string" == typeof e && "=" === e.charAt(1) ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) + t : parseFloat(e) || 0
					},
					ue = function(e, t, i, n) {
						var o, r, a, s, l;
						return "function" == typeof e && (e = e(v, g)), null == e ? s = t : "number" == typeof e ? s = e : (o = 360, r = e.split("_"), l = "=" === e.charAt(1), a = (l ? parseInt(e.charAt(0) + "1", 10) * parseFloat(r[0].substr(2)) : parseFloat(r[0])) * (-1 === e.indexOf("rad") ? 1 : F) - (l ? 0 : t), r.length && (n && (n[i] = t + a), -1 !== e.indexOf("short") && (a %= o) != a % (o / 2) && (a = 0 > a ? a + o : a - o), -1 !== e.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * o) % o - (a / o | 0) * o : -1 !== e.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * o) % o - (a / o | 0) * o)), s = t + a), 1e-6 > s && s > -1e-6 && (s = 0), s
					},
					he = {
						aqua: [0, 255, 255],
						lime: [0, 255, 0],
						silver: [192, 192, 192],
						black: [0, 0, 0],
						maroon: [128, 0, 0],
						teal: [0, 128, 128],
						blue: [0, 0, 255],
						navy: [0, 0, 128],
						white: [255, 255, 255],
						fuchsia: [255, 0, 255],
						olive: [128, 128, 0],
						yellow: [255, 255, 0],
						orange: [255, 165, 0],
						gray: [128, 128, 128],
						purple: [128, 0, 128],
						green: [0, 128, 0],
						red: [255, 0, 0],
						pink: [255, 192, 203],
						cyan: [0, 255, 255],
						transparent: [255, 255, 255, 0]
					},
					de = function(e, t, i) {
						return 255 * (1 > 6 * (e = 0 > e ? e + 1 : e > 1 ? e - 1 : e) ? t + (i - t) * e * 6 : .5 > e ? i : 2 > 3 * e ? t + (i - t) * (2 / 3 - e) * 6 : t) + .5 | 0
					},
					pe = a.parseColor = function(e, t) {
						var i, n, o, r, a, s, l, c, u, h, d;
						if (e)
							if ("number" == typeof e) i = [e >> 16, e >> 8 & 255, 255 & e];
							else {
								if ("," === e.charAt(e.length - 1) && (e = e.substr(0, e.length - 1)), he[e]) i = he[e];
								else if ("#" === e.charAt(0)) 4 === e.length && (n = e.charAt(1), o = e.charAt(2), r = e.charAt(3), e = "#" + n + n + o + o + r + r), e = parseInt(e.substr(1), 16), i = [e >> 16, e >> 8 & 255, 255 & e];
								else if ("hsl" === e.substr(0, 3))
									if (i = d = e.match(y), t) {
										if (-1 !== e.indexOf("=")) return e.match(_)
									}
								else a = Number(i[0]) % 360 / 360, s = Number(i[1]) / 100, l = Number(i[2]) / 100, o = .5 >= l ? l * (s + 1) : l + s - l * s, n = 2 * l - o, i.length > 3 && (i[3] = Number(i[3])), i[0] = de(a + 1 / 3, n, o), i[1] = de(a, n, o), i[2] = de(a - 1 / 3, n, o);
								else i = e.match(y) || he.transparent;
								i[0] = Number(i[0]), i[1] = Number(i[1]), i[2] = Number(i[2]), i.length > 3 && (i[3] = Number(i[3]))
							}
						else i = he.black;
						return t && !d && (n = i[0] / 255, o = i[1] / 255, r = i[2] / 255, c = Math.max(n, o, r), u = Math.min(n, o, r), l = (c + u) / 2, c === u ? a = s = 0 : (h = c - u, s = l > .5 ? h / (2 - c - u) : h / (c + u), a = c === n ? (o - r) / h + (r > o ? 6 : 0) : c === o ? (r - n) / h + 2 : (n - o) / h + 4, a *= 60), i[0] = a + .5 | 0, i[1] = 100 * s + .5 | 0, i[2] = 100 * l + .5 | 0), i
					},
					fe = function(e, t) {
						var i, n, o, r = e.match(me) || [],
							a = 0,
							s = "";
						if (!r.length) return e;
						for (i = 0; i < r.length; i++) n = r[i], o = e.substr(a, e.indexOf(n, a) - a), a += o.length + n.length, 3 === (n = pe(n, t)).length && n.push(1), s += o + (t ? "hsla(" + n[0] + "," + n[1] + "%," + n[2] + "%," + n[3] : "rgba(" + n.join(",")) + ")";
						return s + e.substr(a)
					},
					me = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
				for (c in he) me += "|" + c + "\\b";
				me = new RegExp(me + ")", "gi"), a.colorStringFilter = function(e) {
					var t, i = e[0] + " " + e[1];
					me.test(i) && (t = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla("), e[0] = fe(e[0], t), e[1] = fe(e[1], t)), me.lastIndex = 0
				}, t.defaultStringFilter || (t.defaultStringFilter = a.colorStringFilter);
				var ge = function(e, t, i, n) {
						if (null == e) return function(e) {
							return e
						};
						var o, r = t ? (e.match(me) || [""])[0] : "",
							a = e.split(r).join("").match(b) || [],
							s = e.substr(0, e.indexOf(a[0])),
							l = ")" === e.charAt(e.length - 1) ? ")" : "",
							c = -1 !== e.indexOf(" ") ? " " : ",",
							u = a.length,
							h = u > 0 ? a[0].replace(y, "") : "";
						return u ? o = t ? function(e) {
							var t, d, p, f;
							if ("number" == typeof e) e += h;
							else if (n && z.test(e)) {
								for (f = e.replace(z, "|").split("|"), p = 0; p < f.length; p++) f[p] = o(f[p]);
								return f.join(",")
							}
							if (t = (e.match(me) || [r])[0], d = e.split(t).join("").match(b) || [], p = d.length, u > p--)
								for (; ++p < u;) d[p] = i ? d[(p - 1) / 2 | 0] : a[p];
							return s + d.join(c) + c + t + l + (-1 !== e.indexOf("inset") ? " inset" : "")
						} : function(e) {
							var t, r, d;
							if ("number" == typeof e) e += h;
							else if (n && z.test(e)) {
								for (r = e.replace(z, "|").split("|"), d = 0; d < r.length; d++) r[d] = o(r[d]);
								return r.join(",")
							}
							if (t = e.match(b) || [], d = t.length, u > d--)
								for (; ++d < u;) t[d] = i ? t[(d - 1) / 2 | 0] : a[d];
							return s + t.join(c) + l
						} : function(e) {
							return e
						}
					},
					ve = function(e) {
						return e = e.split(","),
							function(t, i, n, o, r, a, s) {
								var l, c = (i + "").split(" ");
								for (s = {}, l = 0; 4 > l; l++) s[e[l]] = c[l] = c[l] || c[(l - 1) / 2 >> 0];
								return o.parse(t, s, r, a)
							}
					},
					ye = (W._setPluginRatio = function(e) {
						this.plugin.setRatio(e);
						for (var t, i, n, o, r, a = this.data, s = a.proxy, l = a.firstMPT; l;) t = s[l.v], l.r ? t = Math.round(t) : 1e-6 > t && t > -1e-6 && (t = 0), l.t[l.p] = t, l = l._next;
						if (a.autoRotate && (a.autoRotate.rotation = a.mod ? a.mod(s.rotation, this.t) : s.rotation), 1 === e || 0 === e)
							for (l = a.firstMPT, r = 1 === e ? "e" : "b"; l;) {
								if ((i = l.t).type) {
									if (1 === i.type) {
										for (o = i.xs0 + i.s + i.xs1, n = 1; n < i.l; n++) o += i["xn" + n] + i["xs" + (n + 1)];
										i[r] = o
									}
								}
								else i[r] = i.s + i.xs0;
								l = l._next
							}
					}, function(e, t, i, n, o) {
						this.t = e, this.p = t, this.v = i, this.r = o, n && (n._prev = this, this._next = n)
					}),
					_e = (W._parseToProxy = function(e, t, i, n, o, r) {
						var a, s, l, c, u, h = n,
							d = {},
							p = {},
							f = i._transform,
							m = j;
						for (i._transform = null, j = t, n = u = i.parse(e, t, n, o), j = m, r && (i._transform = f, h && (h._prev = null, h._prev && (h._prev._next = null))); n && n !== h;) {
							if (n.type <= 1 && (s = n.p, p[s] = n.s + n.c, d[s] = n.s, r || (c = new ye(n, "s", s, c, n.r), n.c = 0), 1 === n.type))
								for (a = n.l; --a > 0;) l = "xn" + a, s = n.p + "_" + l, p[s] = n.data[l], d[s] = n[l], r || (c = new ye(n, l, s, c, n.rxp[l]));
							n = n._next
						}
						return {
							proxy: d,
							end: p,
							firstMPT: c,
							pt: u
						}
					}, W.CSSPropTween = function(e, t, n, o, a, s, l, c, u, h, d) {
						this.t = e, this.p = t, this.s = n, this.c = o, this.n = l || t, e instanceof _e || r.push(this.n), this.r = c, this.type = s || 0, u && (this.pr = u, i = !0), this.b = void 0 === h ? n : h, this.e = void 0 === d ? n + o : d, a && (this._next = a, a._prev = this)
					}),
					be = function(e, t, i, n, o, r) {
						var a = new _e(e, t, i, n - i, o, -1, r);
						return a.b = i, a.e = a.xs0 = n, a
					},
					we = a.parseComplex = function(e, t, i, n, o, r, s, l, c, h) {
						i = i || r || "", "function" == typeof n && (n = n(v, g)), s = new _e(e, t, 0, 0, s, h ? 2 : 1, null, !1, l, i, n), n += "", o && me.test(n + i) && (n = [i, n], a.colorStringFilter(n), i = n[0], n = n[1]);
						var d, p, f, m, b, w, x, T, k, C, S, A, E, P = i.split(", ").join(",").split(" "),
							O = n.split(", ").join(",").split(" "),
							$ = P.length,
							M = !1 !== u;
						for ((-1 !== n.indexOf(",") || -1 !== i.indexOf(",")) && (-1 !== (n + i).indexOf("rgb") || -1 !== (n + i).indexOf("hsl") ? (P = P.join(" ").replace(z, ", ").split(" "), O = O.join(" ").replace(z, ", ").split(" ")) : (P = P.join(" ").split(",").join(", ").split(" "), O = O.join(" ").split(",").join(", ").split(" ")), $ = P.length), $ !== O.length && (P = (r || "").split(" "), $ = P.length), s.plugin = c, s.setRatio = h, me.lastIndex = 0, d = 0; $ > d; d++)
							if (m = P[d], b = O[d], (T = parseFloat(m)) || 0 === T) s.appendXtra("", T, le(b, T), b.replace(_, ""), M && -1 !== b.indexOf("px"), !0);
							else if (o && me.test(m)) A = b.indexOf(")") + 1, A = ")" + (A ? b.substr(A) : ""), E = -1 !== b.indexOf("hsl") && X, C = b, m = pe(m, E), b = pe(b, E), (k = m.length + b.length > 6) && !X && 0 === b[3] ? (s["xs" + s.l] += s.l ? " transparent" : "transparent", s.e = s.e.split(O[d]).join("transparent")) : (X || (k = !1), E ? s.appendXtra(C.substr(0, C.indexOf("hsl")) + (k ? "hsla(" : "hsl("), m[0], le(b[0], m[0]), ",", !1, !0).appendXtra("", m[1], le(b[1], m[1]), "%,", !1).appendXtra("", m[2], le(b[2], m[2]), k ? "%," : "%" + A, !1) : s.appendXtra(C.substr(0, C.indexOf("rgb")) + (k ? "rgba(" : "rgb("), m[0], b[0] - m[0], ",", !0, !0).appendXtra("", m[1], b[1] - m[1], ",", !0).appendXtra("", m[2], b[2] - m[2], k ? "," : A, !0), k && (m = m.length < 4 ? 1 : m[3], s.appendXtra("", m, (b.length < 4 ? 1 : b[3]) - m, A, !1))), me.lastIndex = 0;
						else if (w = m.match(y)) {
							if (!(x = b.match(_)) || x.length !== w.length) return s;
							for (f = 0, p = 0; p < w.length; p++) S = w[p], C = m.indexOf(S, f), s.appendXtra(m.substr(f, C - f), Number(S), le(x[p], S), "", M && "px" === m.substr(C + S.length, 2), 0 === p), f = C + S.length;
							s["xs" + s.l] += m.substr(f)
						}
						else s["xs" + s.l] += s.l || s["xs" + s.l] ? " " + b : b;
						if (-1 !== n.indexOf("=") && s.data) {
							for (A = s.xs0 + s.data.s, d = 1; d < s.l; d++) A += s["xs" + d] + s.data["xn" + d];
							s.e = A + s["xs" + d]
						}
						return s.l || (s.type = -1, s.xs0 = s.e), s.xfirst || s
					},
					xe = 9;
				for ((c = _e.prototype).l = c.pr = 0; --xe > 0;) c["xn" + xe] = 0, c["xs" + xe] = "";
				c.xs0 = "", c._next = c._prev = c.xfirst = c.data = c.plugin = c.setRatio = c.rxp = null, c.appendXtra = function(e, t, i, n, o, r) {
					var a = this,
						s = a.l;
					return a["xs" + s] += r && (s || a["xs" + s]) ? " " + e : e || "", i || 0 === s || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = n || "", s > 0 ? (a.data["xn" + s] = t + i, a.rxp["xn" + s] = o, a["xn" + s] = t, a.plugin || (a.xfirst = new _e(a, "xn" + s, t, i, a.xfirst || a, 0, a.n, o, a.pr), a.xfirst.xs0 = 0), a) : (a.data = {
						s: t + i
					}, a.rxp = {}, a.s = t, a.c = i, a.r = o, a)) : (a["xs" + s] += t + (n || ""), a)
				};
				var Te = function(e, t) {
						t = t || {}, this.p = t.prefix ? Z(e) || e : e, l[e] = l[this.p] = this, this.format = t.formatter || ge(t.defaultValue, t.color, t.collapsible, t.multi), t.parser && (this.parse = t.parser), this.clrs = t.color, this.multi = t.multi, this.keyword = t.keyword, this.dflt = t.defaultValue, this.pr = t.priority || 0
					},
					ke = W._registerComplexSpecialProp = function(e, t, i) {
						"object" != typeof t && (t = {
							parser: i
						});
						var n, o = e.split(","),
							r = t.defaultValue;
						for (i = i || [r], n = 0; n < o.length; n++) t.prefix = 0 === n && t.prefix, t.defaultValue = i[n] || r, new Te(o[n], t)
					},
					Ce = W._registerPluginProp = function(e) {
						if (!l[e]) {
							var t = e.charAt(0).toUpperCase() + e.substr(1) + "Plugin";
							ke(e, {
								parser: function(e, i, n, o, r, a, c) {
									var u = s.com.greensock.plugins[t];
									return u ? (u._cssRegister(), l[n].parse(e, i, n, o, r, a, c)) : (V(), r)
								}
							})
						}
					};
				(c = Te.prototype).parseComplex = function(e, t, i, n, o, r) {
					var a, s, l, c, u, h, d = this.keyword;
					if (this.multi && (z.test(i) || z.test(t) ? (s = t.replace(z, "|").split("|"), l = i.replace(z, "|").split("|")) : d && (s = [t], l = [i])), l) {
						for (c = l.length > s.length ? l.length : s.length, a = 0; c > a; a++) t = s[a] = s[a] || this.dflt, i = l[a] = l[a] || this.dflt, d && (u = t.indexOf(d), h = i.indexOf(d), u !== h && (-1 === h ? s[a] = s[a].split(d).join("") : -1 === u && (s[a] += " " + d)));
						t = s.join(", "), i = l.join(", ")
					}
					return we(e, this.p, t, i, this.clrs, this.dflt, n, this.pr, o, r)
				}, c.parse = function(e, t, i, n, r, a, s) {
					return this.parseComplex(e.style, this.format(J(e, this.p, o, !1, this.dflt)), this.format(t), r, a)
				}, a.registerSpecialProp = function(e, t, i) {
					ke(e, {
						parser: function(e, n, o, r, a, s, l) {
							var c = new _e(e, o, 0, 0, a, 2, o, !1, i);
							return c.plugin = s, c.setRatio = t(e, n, r._tween, o), c
						},
						priority: i
					})
				}, a.useSVGTransformAttr = !0;
				var Se, Ae = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
					Ee = Z("transform"),
					Pe = Q + "transform",
					Oe = Z("transformOrigin"),
					$e = null !== Z("perspective"),
					Me = W.Transform = function() {
						this.perspective = parseFloat(a.defaultTransformPerspective) || 0, this.force3D = !(!1 === a.defaultForce3D || !$e) && (a.defaultForce3D || "auto")
					},
					De = _gsScope.SVGElement,
					ze = function(e, t, i) {
						var n, o = N.createElementNS("http://www.w3.org/2000/svg", e),
							r = /([a-z])([A-Z])/g;
						for (n in i) o.setAttributeNS(null, n.replace(r, "$1-$2").toLowerCase(), i[n]);
						return t.appendChild(o), o
					},
					Le = N.documentElement || {},
					Ie = function() {
						var e, t, i, n = m || /Android/i.test(U) && !_gsScope.chrome;
						return N.createElementNS && !n && (e = ze("svg", Le), t = ze("rect", e, {
							width: 100,
							height: 50,
							x: 100
						}), i = t.getBoundingClientRect().width, t.style[Oe] = "50% 50%", t.style[Ee] = "scaleX(0.5)", n = i === t.getBoundingClientRect().width && !(p && $e), Le.removeChild(e)), n
					}(),
					Fe = function(e, t, i, n, o, r) {
						var s, l, c, u, h, d, p, f, m, g, v, y, _, b, w = e._gsTransform,
							x = qe(e, !0);
						w && (_ = w.xOrigin, b = w.yOrigin), (!n || (s = n.split(" ")).length < 2) && (0 === (p = e.getBBox()).x && 0 === p.y && p.width + p.height === 0 && (p = {
							x: parseFloat(e.hasAttribute("x") ? e.getAttribute("x") : e.hasAttribute("cx") ? e.getAttribute("cx") : 0) || 0,
							y: parseFloat(e.hasAttribute("y") ? e.getAttribute("y") : e.hasAttribute("cy") ? e.getAttribute("cy") : 0) || 0,
							width: 0,
							height: 0
						}), t = se(t).split(" "), s = [(-1 !== t[0].indexOf("%") ? parseFloat(t[0]) / 100 * p.width : parseFloat(t[0])) + p.x, (-1 !== t[1].indexOf("%") ? parseFloat(t[1]) / 100 * p.height : parseFloat(t[1])) + p.y]), i.xOrigin = u = parseFloat(s[0]), i.yOrigin = h = parseFloat(s[1]), n && x !== He && (d = x[0], p = x[1], f = x[2], m = x[3], g = x[4], v = x[5], (y = d * m - p * f) && (l = u * (m / y) + h * (-f / y) + (f * v - m * g) / y, c = u * (-p / y) + h * (d / y) - (d * v - p * g) / y, u = i.xOrigin = s[0] = l, h = i.yOrigin = s[1] = c)), w && (r && (i.xOffset = w.xOffset, i.yOffset = w.yOffset, w = i), o || !1 !== o && !1 !== a.defaultSmoothOrigin ? (l = u - _, c = h - b, w.xOffset += l * x[0] + c * x[2] - l, w.yOffset += l * x[1] + c * x[3] - c) : w.xOffset = w.yOffset = 0), r || e.setAttribute("data-svg-origin", s.join(" "))
					},
					je = function(e) {
						var t, i = H("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
							n = this.parentNode,
							o = this.nextSibling,
							r = this.style.cssText;
						if (Le.appendChild(i), i.appendChild(this), this.style.display = "block", e) try {
							t = this.getBBox(), this._originalGetBBox = this.getBBox, this.getBBox = je
						}
						catch (e) {}
						else this._originalGetBBox && (t = this._originalGetBBox());
						return o ? n.insertBefore(this, o) : n.appendChild(this), Le.removeChild(i), this.style.cssText = r, t
					},
					Re = function(e) {
						try {
							return e.getBBox()
						}
						catch (t) {
							return je.call(e, !0)
						}
					},
					Ne = function(e) {
						return !(!De || !e.getCTM || e.parentNode && !e.ownerSVGElement || !Re(e))
					},
					He = [1, 0, 0, 1, 0, 0],
					qe = function(e, t) {
						var i, n, o, r, a, s, l = e._gsTransform || new Me,
							c = e.style;
						if (Ee ? n = J(e, Pe, null, !0) : e.currentStyle && (n = e.currentStyle.filter.match(M), n = n && 4 === n.length ? [n[0].substr(4), Number(n[2].substr(4)), Number(n[1].substr(4)), n[3].substr(4), l.x || 0, l.y || 0].join(",") : ""), i = !n || "none" === n || "matrix(1, 0, 0, 1, 0, 0)" === n, !Ee || !(s = !K(e) || "none" === K(e).display) && e.parentNode || (s && (r = c.display, c.display = "block"), e.parentNode || (a = 1, Le.appendChild(e)), n = J(e, Pe, null, !0), i = !n || "none" === n || "matrix(1, 0, 0, 1, 0, 0)" === n, r ? c.display = r : s && Ye(c, "display"), a && Le.removeChild(e)), (l.svg || e.getCTM && Ne(e)) && (i && -1 !== (c[Ee] + "").indexOf("matrix") && (n = c[Ee], i = 0), o = e.getAttribute("transform"), i && o && (o = e.transform.baseVal.consolidate().matrix, n = "matrix(" + o.a + "," + o.b + "," + o.c + "," + o.d + "," + o.e + "," + o.f + ")", i = 0)), i) return He;
						for (o = (n || "").match(y) || [], xe = o.length; --xe > -1;) r = Number(o[xe]), o[xe] = (a = r - (r |= 0)) ? (1e5 * a + (0 > a ? -.5 : .5) | 0) / 1e5 + r : r;
						return t && o.length > 6 ? [o[0], o[1], o[4], o[5], o[12], o[13]] : o
					},
					Be = W.getTransform = function(e, i, n, o) {
						if (e._gsTransform && n && !o) return e._gsTransform;
						var r, s, l, c, u, h, d = n ? e._gsTransform || new Me : new Me,
							p = d.scaleX < 0,
							f = 2e-5,
							m = 1e5,
							g = $e ? parseFloat(J(e, Oe, i, !1, "0 0 0").split(" ")[2]) || d.zOrigin || 0 : 0,
							v = parseFloat(a.defaultTransformPerspective) || 0;
						if (d.svg = !(!e.getCTM || !Ne(e)), d.svg && (Fe(e, J(e, Oe, i, !1, "50% 50%") + "", d, e.getAttribute("data-svg-origin")), Se = a.useSVGTransformAttr || Ie), (r = qe(e)) !== He) {
							if (16 === r.length) {
								var y, _, b, w, x, T = r[0],
									k = r[1],
									C = r[2],
									S = r[3],
									A = r[4],
									E = r[5],
									P = r[6],
									O = r[7],
									$ = r[8],
									M = r[9],
									D = r[10],
									z = r[12],
									L = r[13],
									I = r[14],
									j = r[11],
									R = Math.atan2(P, D);
								d.zOrigin && (I = -d.zOrigin, z = $ * I - r[12], L = M * I - r[13], I = D * I + d.zOrigin - r[14]), d.rotationX = R * F, R && (w = Math.cos(-R), x = Math.sin(-R), y = A * w + $ * x, _ = E * w + M * x, b = P * w + D * x, $ = A * -x + $ * w, M = E * -x + M * w, D = P * -x + D * w, j = O * -x + j * w, A = y, E = _, P = b), R = Math.atan2(-C, D), d.rotationY = R * F, R && (w = Math.cos(-R), x = Math.sin(-R), y = T * w - $ * x, _ = k * w - M * x, b = C * w - D * x, M = k * x + M * w, D = C * x + D * w, j = S * x + j * w, T = y, k = _, C = b), R = Math.atan2(k, T), d.rotation = R * F, R && (w = Math.cos(R), x = Math.sin(R), y = T * w + k * x, _ = A * w + E * x, b = $ * w + M * x, k = k * w - T * x, E = E * w - A * x, M = M * w - $ * x, T = y, A = _, $ = b), d.rotationX && Math.abs(d.rotationX) + Math.abs(d.rotation) > 359.9 && (d.rotationX = d.rotation = 0, d.rotationY = 180 - d.rotationY), R = Math.atan2(A, E), d.scaleX = (Math.sqrt(T * T + k * k + C * C) * m + .5 | 0) / m, d.scaleY = (Math.sqrt(E * E + P * P) * m + .5 | 0) / m, d.scaleZ = (Math.sqrt($ * $ + M * M + D * D) * m + .5 | 0) / m, T /= d.scaleX, A /= d.scaleY, k /= d.scaleX, E /= d.scaleY, Math.abs(R) > f ? (d.skewX = R * F, A = 0, "simple" !== d.skewType && (d.scaleY *= 1 / Math.cos(R))) : d.skewX = 0, d.perspective = j ? 1 / (0 > j ? -j : j) : 0, d.x = z, d.y = L, d.z = I, d.svg && (d.x -= d.xOrigin - (d.xOrigin * T - d.yOrigin * A), d.y -= d.yOrigin - (d.yOrigin * k - d.xOrigin * E))
							}
							else if (!$e || o || !r.length || d.x !== r[4] || d.y !== r[5] || !d.rotationX && !d.rotationY) {
								var N = r.length >= 6,
									H = N ? r[0] : 1,
									q = r[1] || 0,
									B = r[2] || 0,
									W = N ? r[3] : 1;
								d.x = r[4] || 0, d.y = r[5] || 0, l = Math.sqrt(H * H + q * q), c = Math.sqrt(W * W + B * B), u = H || q ? Math.atan2(q, H) * F : d.rotation || 0, h = B || W ? Math.atan2(B, W) * F + u : d.skewX || 0, d.scaleX = l, d.scaleY = c, d.rotation = u, d.skewX = h, $e && (d.rotationX = d.rotationY = d.z = 0, d.perspective = v, d.scaleZ = 1), d.svg && (d.x -= d.xOrigin - (d.xOrigin * H + d.yOrigin * B), d.y -= d.yOrigin - (d.xOrigin * q + d.yOrigin * W))
							}
							Math.abs(d.skewX) > 90 && Math.abs(d.skewX) < 270 && (p ? (d.scaleX *= -1, d.skewX += d.rotation <= 0 ? 180 : -180, d.rotation += d.rotation <= 0 ? 180 : -180) : (d.scaleY *= -1, d.skewX += d.skewX <= 0 ? 180 : -180)), d.zOrigin = g;
							for (s in d) d[s] < f && d[s] > -f && (d[s] = 0)
						}
						return n && (e._gsTransform = d, d.svg && (Se && e.style[Ee] ? t.delayedCall(.001, function() {
							Ye(e.style, Ee)
						}) : !Se && e.getAttribute("transform") && t.delayedCall(.001, function() {
							e.removeAttribute("transform")
						}))), d
					},
					We = function(e) {
						var t, i, n = this.data,
							o = -n.rotation * I,
							r = o + n.skewX * I,
							a = 1e5,
							s = (Math.cos(o) * n.scaleX * a | 0) / a,
							l = (Math.sin(o) * n.scaleX * a | 0) / a,
							c = (Math.sin(r) * -n.scaleY * a | 0) / a,
							u = (Math.cos(r) * n.scaleY * a | 0) / a,
							h = this.t.style,
							d = this.t.currentStyle;
						if (d) {
							i = l, l = -c, c = -i, t = d.filter, h.filter = "";
							var p, f, g = this.t.offsetWidth,
								v = this.t.offsetHeight,
								y = "absolute" !== d.position,
								_ = "progid:DXImageTransform.Microsoft.Matrix(M11=" + s + ", M12=" + l + ", M21=" + c + ", M22=" + u,
								b = n.x + g * n.xPercent / 100,
								w = n.y + v * n.yPercent / 100;
							if (null != n.ox && (p = (n.oxp ? g * n.ox * .01 : n.ox) - g / 2, f = (n.oyp ? v * n.oy * .01 : n.oy) - v / 2, b += p - (p * s + f * l), w += f - (p * c + f * u)), y ? (p = g / 2, f = v / 2, _ += ", Dx=" + (p - (p * s + f * l) + b) + ", Dy=" + (f - (p * c + f * u) + w) + ")") : _ += ", sizingMethod='auto expand')", -1 !== t.indexOf("DXImageTransform.Microsoft.Matrix(") ? h.filter = t.replace(D, _) : h.filter = _ + " " + t, (0 === e || 1 === e) && 1 === s && 0 === l && 0 === c && 1 === u && (y && -1 === _.indexOf("Dx=0, Dy=0") || T.test(t) && 100 !== parseFloat(RegExp.$1) || -1 === t.indexOf(t.indexOf("Alpha")) && h.removeAttribute("filter")), !y) {
								var k, C, S, A = 8 > m ? 1 : -1;
								for (p = n.ieOffsetX || 0, f = n.ieOffsetY || 0, n.ieOffsetX = Math.round((g - ((0 > s ? -s : s) * g + (0 > l ? -l : l) * v)) / 2 + b), n.ieOffsetY = Math.round((v - ((0 > u ? -u : u) * v + (0 > c ? -c : c) * g)) / 2 + w), xe = 0; 4 > xe; xe++) C = re[xe], k = d[C], i = -1 !== k.indexOf("px") ? parseFloat(k) : ee(this.t, C, parseFloat(k), k.replace(x, "")) || 0, S = i !== n[C] ? 2 > xe ? -n.ieOffsetX : -n.ieOffsetY : 2 > xe ? p - n.ieOffsetX : f - n.ieOffsetY, h[C] = (n[C] = Math.round(i - S * (0 === xe || 2 === xe ? 1 : A))) + "px"
							}
						}
					},
					Ue = W.set3DTransformRatio = W.setTransformRatio = function(e) {
						var t, i, n, o, r, a, s, l, c, u, h, d, f, m, g, v, y, _, b, w, x, T, k, C = this.data,
							S = this.t.style,
							A = C.rotation,
							E = C.rotationX,
							P = C.rotationY,
							O = C.scaleX,
							$ = C.scaleY,
							M = C.scaleZ,
							D = C.x,
							z = C.y,
							L = C.z,
							F = C.svg,
							j = C.perspective,
							R = C.force3D,
							N = C.skewY,
							H = C.skewX;
						if (N && (H += N, A += N), !((1 !== e && 0 !== e || "auto" !== R || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && R || L || j || P || E || 1 !== M) || Se && F || !$e) A || H || F ? (A *= I, T = H * I, k = 1e5, i = Math.cos(A) * O, r = Math.sin(A) * O, n = Math.sin(A - T) * -$, a = Math.cos(A - T) * $, T && "simple" === C.skewType && (t = Math.tan(T - N * I), t = Math.sqrt(1 + t * t), n *= t, a *= t, N && (t = Math.tan(N * I), t = Math.sqrt(1 + t * t), i *= t, r *= t)), F && (D += C.xOrigin - (C.xOrigin * i + C.yOrigin * n) + C.xOffset, z += C.yOrigin - (C.xOrigin * r + C.yOrigin * a) + C.yOffset, Se && (C.xPercent || C.yPercent) && (g = this.t.getBBox(), D += .01 * C.xPercent * g.width, z += .01 * C.yPercent * g.height), (g = 1e-6) > D && D > -g && (D = 0), g > z && z > -g && (z = 0)), b = (i * k | 0) / k + "," + (r * k | 0) / k + "," + (n * k | 0) / k + "," + (a * k | 0) / k + "," + D + "," + z + ")", F && Se ? this.t.setAttribute("transform", "matrix(" + b) : S[Ee] = (C.xPercent || C.yPercent ? "translate(" + C.xPercent + "%," + C.yPercent + "%) matrix(" : "matrix(") + b) : S[Ee] = (C.xPercent || C.yPercent ? "translate(" + C.xPercent + "%," + C.yPercent + "%) matrix(" : "matrix(") + O + ",0,0," + $ + "," + D + "," + z + ")";
						else {
							if (p && ((g = 1e-4) > O && O > -g && (O = M = 2e-5), g > $ && $ > -g && ($ = M = 2e-5), !j || C.z || C.rotationX || C.rotationY || (j = 0)), A || H) A *= I, v = i = Math.cos(A), y = r = Math.sin(A), H && (A -= H * I, v = Math.cos(A), y = Math.sin(A), "simple" === C.skewType && (t = Math.tan((H - N) * I), t = Math.sqrt(1 + t * t), v *= t, y *= t, C.skewY && (t = Math.tan(N * I), t = Math.sqrt(1 + t * t), i *= t, r *= t))), n = -y, a = v;
							else {
								if (!(P || E || 1 !== M || j || F)) return void(S[Ee] = (C.xPercent || C.yPercent ? "translate(" + C.xPercent + "%," + C.yPercent + "%) translate3d(" : "translate3d(") + D + "px," + z + "px," + L + "px)" + (1 !== O || 1 !== $ ? " scale(" + O + "," + $ + ")" : ""));
								i = a = 1, n = r = 0
							}
							u = 1, o = s = l = c = h = d = 0, f = j ? -1 / j : 0, m = C.zOrigin, g = 1e-6, w = ",", x = "0", (A = P * I) && (v = Math.cos(A), y = Math.sin(A), l = -y, h = f * -y, o = i * y, s = r * y, u = v, f *= v, i *= v, r *= v), (A = E * I) && (v = Math.cos(A), y = Math.sin(A), t = n * v + o * y, _ = a * v + s * y, c = u * y, d = f * y, o = n * -y + o * v, s = a * -y + s * v, u *= v, f *= v, n = t, a = _), 1 !== M && (o *= M, s *= M, u *= M, f *= M), 1 !== $ && (n *= $, a *= $, c *= $, d *= $), 1 !== O && (i *= O, r *= O, l *= O, h *= O), (m || F) && (m && (D += o * -m, z += s * -m, L += u * -m + m), F && (D += C.xOrigin - (C.xOrigin * i + C.yOrigin * n) + C.xOffset, z += C.yOrigin - (C.xOrigin * r + C.yOrigin * a) + C.yOffset), g > D && D > -g && (D = x), g > z && z > -g && (z = x), g > L && L > -g && (L = 0)), b = C.xPercent || C.yPercent ? "translate(" + C.xPercent + "%," + C.yPercent + "%) matrix3d(" : "matrix3d(", b += (g > i && i > -g ? x : i) + w + (g > r && r > -g ? x : r) + w + (g > l && l > -g ? x : l), b += w + (g > h && h > -g ? x : h) + w + (g > n && n > -g ? x : n) + w + (g > a && a > -g ? x : a), E || P || 1 !== M ? (b += w + (g > c && c > -g ? x : c) + w + (g > d && d > -g ? x : d) + w + (g > o && o > -g ? x : o), b += w + (g > s && s > -g ? x : s) + w + (g > u && u > -g ? x : u) + w + (g > f && f > -g ? x : f) + w) : b += ",0,0,0,0,1,0,", b += D + w + z + w + L + w + (j ? 1 + -L / j : 1) + ")", S[Ee] = b
						}
					};
				(c = Me.prototype).x = c.y = c.z = c.skewX = c.skewY = c.rotation = c.rotationX = c.rotationY = c.zOrigin = c.xPercent = c.yPercent = c.xOffset = c.yOffset = 0, c.scaleX = c.scaleY = c.scaleZ = 1, ke("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
					parser: function(e, t, i, n, r, s, l) {
						if (n._lastParsedTransform === l) return r;
						n._lastParsedTransform = l;
						var c, u = l.scale && "function" == typeof l.scale ? l.scale : 0;
						"function" == typeof l[i] && (c = l[i], l[i] = t), u && (l.scale = u(v, e));
						var h, d, p, f, m, y, _, b, w, x = e._gsTransform,
							T = e.style,
							k = Ae.length,
							C = l,
							S = {},
							A = "transformOrigin",
							E = Be(e, o, !0, C.parseTransform),
							P = C.transform && ("function" == typeof C.transform ? C.transform(v, g) : C.transform);
						if (E.skewType = C.skewType || E.skewType || a.defaultSkewType, n._transform = E, P && "string" == typeof P && Ee) d = q.style, d[Ee] = P, d.display = "block", d.position = "absolute", N.body.appendChild(q), h = Be(q, null, !1), "simple" === E.skewType && (h.scaleY *= Math.cos(h.skewX * I)), E.svg && (y = E.xOrigin, _ = E.yOrigin, h.x -= E.xOffset, h.y -= E.yOffset, (C.transformOrigin || C.svgOrigin) && (P = {}, Fe(e, se(C.transformOrigin), P, C.svgOrigin, C.smoothOrigin, !0), y = P.xOrigin, _ = P.yOrigin, h.x -= P.xOffset - E.xOffset, h.y -= P.yOffset - E.yOffset), (y || _) && (b = qe(q, !0), h.x -= y - (y * b[0] + _ * b[2]), h.y -= _ - (y * b[1] + _ * b[3]))), N.body.removeChild(q), h.perspective || (h.perspective = E.perspective), null != C.xPercent && (h.xPercent = ce(C.xPercent, E.xPercent)), null != C.yPercent && (h.yPercent = ce(C.yPercent, E.yPercent));
						else if ("object" == typeof C) {
							if (h = {
									scaleX: ce(null != C.scaleX ? C.scaleX : C.scale, E.scaleX),
									scaleY: ce(null != C.scaleY ? C.scaleY : C.scale, E.scaleY),
									scaleZ: ce(C.scaleZ, E.scaleZ),
									x: ce(C.x, E.x),
									y: ce(C.y, E.y),
									z: ce(C.z, E.z),
									xPercent: ce(C.xPercent, E.xPercent),
									yPercent: ce(C.yPercent, E.yPercent),
									perspective: ce(C.transformPerspective, E.perspective)
								}, null != (m = C.directionalRotation))
								if ("object" == typeof m)
									for (d in m) C[d] = m[d];
								else C.rotation = m;
							"string" == typeof C.x && -1 !== C.x.indexOf("%") && (h.x = 0, h.xPercent = ce(C.x, E.xPercent)), "string" == typeof C.y && -1 !== C.y.indexOf("%") && (h.y = 0, h.yPercent = ce(C.y, E.yPercent)), h.rotation = ue("rotation" in C ? C.rotation : "shortRotation" in C ? C.shortRotation + "_short" : "rotationZ" in C ? C.rotationZ : E.rotation, E.rotation, "rotation", S), $e && (h.rotationX = ue("rotationX" in C ? C.rotationX : "shortRotationX" in C ? C.shortRotationX + "_short" : E.rotationX || 0, E.rotationX, "rotationX", S), h.rotationY = ue("rotationY" in C ? C.rotationY : "shortRotationY" in C ? C.shortRotationY + "_short" : E.rotationY || 0, E.rotationY, "rotationY", S)), h.skewX = ue(C.skewX, E.skewX), h.skewY = ue(C.skewY, E.skewY)
						}
						for ($e && null != C.force3D && (E.force3D = C.force3D, f = !0), (p = E.force3D || E.z || E.rotationX || E.rotationY || h.z || h.rotationX || h.rotationY || h.perspective) || null == C.scale || (h.scaleZ = 1); --k > -1;) w = Ae[k], ((P = h[w] - E[w]) > 1e-6 || -1e-6 > P || null != C[w] || null != j[w]) && (f = !0, r = new _e(E, w, E[w], P, r), w in S && (r.e = S[w]), r.xs0 = 0, r.plugin = s, n._overwriteProps.push(r.n));
						return P = C.transformOrigin, E.svg && (P || C.svgOrigin) && (y = E.xOffset, _ = E.yOffset, Fe(e, se(P), h, C.svgOrigin, C.smoothOrigin), r = be(E, "xOrigin", (x ? E : h).xOrigin, h.xOrigin, r, A), r = be(E, "yOrigin", (x ? E : h).yOrigin, h.yOrigin, r, A), (y !== E.xOffset || _ !== E.yOffset) && (r = be(E, "xOffset", x ? y : E.xOffset, E.xOffset, r, A), r = be(E, "yOffset", x ? _ : E.yOffset, E.yOffset, r, A)), P = "0px 0px"), (P || $e && p && E.zOrigin) && (Ee ? (f = !0, w = Oe, P = (P || J(e, w, o, !1, "50% 50%")) + "", r = new _e(T, w, 0, 0, r, -1, A), r.b = T[w], r.plugin = s, $e ? (d = E.zOrigin, P = P.split(" "), E.zOrigin = (P.length > 2 && (0 === d || "0px" !== P[2]) ? parseFloat(P[2]) : d) || 0, r.xs0 = r.e = P[0] + " " + (P[1] || "50%") + " 0px", r = new _e(E, "zOrigin", 0, 0, r, -1, r.n), r.b = d, r.xs0 = r.e = E.zOrigin) : r.xs0 = r.e = P) : se(P + "", E)), f && (n._transformType = E.svg && Se || !p && 3 !== this._transformType ? 2 : 3), c && (l[i] = c), u && (l.scale = u), r
					},
					prefix: !0
				}), ke("boxShadow", {
					defaultValue: "0px 0px 0px 0px #999",
					prefix: !0,
					color: !0,
					multi: !0,
					keyword: "inset"
				}), ke("borderRadius", {
					defaultValue: "0px",
					parser: function(e, t, i, r, a, s) {
						t = this.format(t);
						var l, c, u, h, d, p, f, m, g, v, y, _, b, w, x, T, k = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
							C = e.style;
						for (g = parseFloat(e.offsetWidth), v = parseFloat(e.offsetHeight), l = t.split(" "), c = 0; c < k.length; c++) this.p.indexOf("border") && (k[c] = Z(k[c])), -1 !== (d = h = J(e, k[c], o, !1, "0px")).indexOf(" ") && (h = d.split(" "), d = h[0], h = h[1]), p = u = l[c], f = parseFloat(d), _ = d.substr((f + "").length), (b = "=" === p.charAt(1)) ? (m = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), m *= parseFloat(p), y = p.substr((m + "").length - (0 > m ? 1 : 0)) || "") : (m = parseFloat(p), y = p.substr((m + "").length)), "" === y && (y = n[i] || _), y !== _ && (w = ee(e, "borderLeft", f, _), x = ee(e, "borderTop", f, _), "%" === y ? (d = w / g * 100 + "%", h = x / v * 100 + "%") : "em" === y ? (T = ee(e, "borderLeft", 1, "em"), d = w / T + "em", h = x / T + "em") : (d = w + "px", h = x + "px"), b && (p = parseFloat(d) + m + y, u = parseFloat(h) + m + y)), a = we(C, k[c], d + " " + h, p + " " + u, !1, "0px", a);
						return a
					},
					prefix: !0,
					formatter: ge("0px 0px 0px 0px", !1, !0)
				}), ke("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
					defaultValue: "0px",
					parser: function(e, t, i, n, r, a) {
						return we(e.style, i, this.format(J(e, i, o, !1, "0px 0px")), this.format(t), !1, "0px", r)
					},
					prefix: !0,
					formatter: ge("0px 0px", !1, !0)
				}), ke("backgroundPosition", {
					defaultValue: "0 0",
					parser: function(e, t, i, n, r, a) {
						var s, l, c, u, h, d, p = "background-position",
							f = o || K(e, null),
							g = this.format((f ? m ? f.getPropertyValue(p + "-x") + " " + f.getPropertyValue(p + "-y") : f.getPropertyValue(p) : e.currentStyle.backgroundPositionX + " " + e.currentStyle.backgroundPositionY) || "0 0"),
							v = this.format(t);
						if (-1 !== g.indexOf("%") != (-1 !== v.indexOf("%")) && v.split(",").length < 2 && (d = J(e, "backgroundImage").replace(P, "")) && "none" !== d) {
							for (s = g.split(" "), l = v.split(" "), B.setAttribute("src", d), c = 2; --c > -1;) g = s[c], (u = -1 !== g.indexOf("%")) != (-1 !== l[c].indexOf("%")) && (h = 0 === c ? e.offsetWidth - B.width : e.offsetHeight - B.height, s[c] = u ? parseFloat(g) / 100 * h + "px" : parseFloat(g) / h * 100 + "%");
							g = s.join(" ")
						}
						return this.parseComplex(e.style, g, v, r, a)
					},
					formatter: se
				}), ke("backgroundSize", {
					defaultValue: "0 0",
					formatter: function(e) {
						return e += "", se(-1 === e.indexOf(" ") ? e + " " + e : e)
					}
				}), ke("perspective", {
					defaultValue: "0px",
					prefix: !0
				}), ke("perspectiveOrigin", {
					defaultValue: "50% 50%",
					prefix: !0
				}), ke("transformStyle", {
					prefix: !0
				}), ke("backfaceVisibility", {
					prefix: !0
				}), ke("userSelect", {
					prefix: !0
				}), ke("margin", {
					parser: ve("marginTop,marginRight,marginBottom,marginLeft")
				}), ke("padding", {
					parser: ve("paddingTop,paddingRight,paddingBottom,paddingLeft")
				}), ke("clip", {
					defaultValue: "rect(0px,0px,0px,0px)",
					parser: function(e, t, i, n, r, a) {
						var s, l, c;
						return 9 > m ? (l = e.currentStyle, c = 8 > m ? " " : ",", s = "rect(" + l.clipTop + c + l.clipRight + c + l.clipBottom + c + l.clipLeft + ")", t = this.format(t).split(",").join(c)) : (s = this.format(J(e, this.p, o, !1, this.dflt)), t = this.format(t)), this.parseComplex(e.style, s, t, r, a)
					}
				}), ke("textShadow", {
					defaultValue: "0px 0px 0px #999",
					color: !0,
					multi: !0
				}), ke("autoRound,strictUnits", {
					parser: function(e, t, i, n, o) {
						return o
					}
				}), ke("border", {
					defaultValue: "0px solid #000",
					parser: function(e, t, i, n, r, a) {
						var s = J(e, "borderTopWidth", o, !1, "0px"),
							l = this.format(t).split(" "),
							c = l[0].replace(x, "");
						return "px" !== c && (s = parseFloat(s) / ee(e, "borderTopWidth", 1, c) + c), this.parseComplex(e.style, this.format(s + " " + J(e, "borderTopStyle", o, !1, "solid") + " " + J(e, "borderTopColor", o, !1, "#000")), l.join(" "), r, a)
					},
					color: !0,
					formatter: function(e) {
						var t = e.split(" ");
						return t[0] + " " + (t[1] || "solid") + " " + (e.match(me) || ["#000"])[0]
					}
				}), ke("borderWidth", {
					parser: ve("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
				}), ke("float,cssFloat,styleFloat", {
					parser: function(e, t, i, n, o, r) {
						var a = e.style,
							s = "cssFloat" in a ? "cssFloat" : "styleFloat";
						return new _e(a, s, 0, 0, o, -1, i, !1, 0, a[s], t)
					}
				});
				var Xe = function(e) {
					var t, i = this.t,
						n = i.filter || J(this.data, "filter") || "",
						o = this.s + this.c * e | 0;
					100 === o && (-1 === n.indexOf("atrix(") && -1 === n.indexOf("radient(") && -1 === n.indexOf("oader(") ? (i.removeAttribute("filter"), t = !J(this.data, "filter")) : (i.filter = n.replace(C, ""), t = !0)), t || (this.xn1 && (i.filter = n = n || "alpha(opacity=" + o + ")"), -1 === n.indexOf("pacity") ? 0 === o && this.xn1 || (i.filter = n + " alpha(opacity=" + o + ")") : i.filter = n.replace(T, "opacity=" + o))
				};
				ke("opacity,alpha,autoAlpha", {
					defaultValue: "1",
					parser: function(e, t, i, n, r, a) {
						var s = parseFloat(J(e, "opacity", o, !1, "1")),
							l = e.style,
							c = "autoAlpha" === i;
						return "string" == typeof t && "=" === t.charAt(1) && (t = ("-" === t.charAt(0) ? -1 : 1) * parseFloat(t.substr(2)) + s), c && 1 === s && "hidden" === J(e, "visibility", o) && 0 !== t && (s = 0), X ? r = new _e(l, "opacity", s, t - s, r) : (r = new _e(l, "opacity", 100 * s, 100 * (t - s), r), r.xn1 = c ? 1 : 0, l.zoom = 1, r.type = 2, r.b = "alpha(opacity=" + r.s + ")", r.e = "alpha(opacity=" + (r.s + r.c) + ")", r.data = e, r.plugin = a, r.setRatio = Xe), c && (r = new _e(l, "visibility", 0, 0, r, -1, null, !1, 0, 0 !== s ? "inherit" : "hidden", 0 === t ? "hidden" : "inherit"), r.xs0 = "inherit", n._overwriteProps.push(r.n), n._overwriteProps.push(i)), r
					}
				});
				var Ye = function(e, t) {
						t && (e.removeProperty ? (("ms" === t.substr(0, 2) || "webkit" === t.substr(0, 6)) && (t = "-" + t), e.removeProperty(t.replace(A, "-$1").toLowerCase())) : e.removeAttribute(t))
					},
					Ve = function(e) {
						if (this.t._gsClassPT = this, 1 === e || 0 === e) {
							this.t.setAttribute("class", 0 === e ? this.b : this.e);
							for (var t = this.data, i = this.t.style; t;) t.v ? i[t.p] = t.v : Ye(i, t.p), t = t._next;
							1 === e && this.t._gsClassPT === this && (this.t._gsClassPT = null)
						}
						else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
					};
				ke("className", {
					parser: function(e, t, n, r, a, s, l) {
						var c, u, h, d, p, f = e.getAttribute("class") || "",
							m = e.style.cssText;
						if (a = r._classNamePT = new _e(e, n, 0, 0, a, 2), a.setRatio = Ve, a.pr = -11, i = !0, a.b = f, u = ie(e, o), h = e._gsClassPT) {
							for (d = {}, p = h.data; p;) d[p.p] = 1, p = p._next;
							h.setRatio(1)
						}
						return e._gsClassPT = a, a.e = "=" !== t.charAt(1) ? t : f.replace(new RegExp("(?:\\s|^)" + t.substr(2) + "(?![\\w-])"), "") + ("+" === t.charAt(0) ? " " + t.substr(2) : ""), e.setAttribute("class", a.e), c = ne(e, u, ie(e), l, d), e.setAttribute("class", f), a.data = c.firstMPT, e.style.cssText = m, a = a.xfirst = r.parse(e, c.difs, a, s)
					}
				});
				var Qe = function(e) {
					if ((1 === e || 0 === e) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
						var t, i, n, o, r, a = this.t.style,
							s = l.transform.parse;
						if ("all" === this.e) a.cssText = "", o = !0;
						else
							for (t = this.e.split(" ").join("").split(","), n = t.length; --n > -1;) i = t[n], l[i] && (l[i].parse === s ? o = !0 : i = "transformOrigin" === i ? Oe : l[i].p), Ye(a, i);
						o && (Ye(a, Ee), (r = this.t._gsTransform) && (r.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
					}
				};
				for (ke("clearProps", {
						parser: function(e, t, n, o, r) {
							return r = new _e(e, n, 0, 0, r, 2), r.setRatio = Qe, r.e = t, r.pr = -10, r.data = o._tween, i = !0, r
						}
					}), c = "bezier,throwProps,physicsProps,physics2D".split(","), xe = c.length; xe--;) Ce(c[xe]);
				(c = a.prototype)._firstPT = c._lastParsedTransform = c._transform = null, c._onInitTween = function(e, t, s, c) {
					if (!e.nodeType) return !1;
					this._target = g = e, this._tween = s, this._vars = t, v = c, u = t.autoRound, i = !1, n = t.suffixMap || a.suffixMap, o = K(e, ""), r = this._overwriteProps;
					var p, m, y, _, b, w, x, T, C, S = e.style;
					if (h && "" === S.zIndex && ("auto" === (p = J(e, "zIndex", o)) || "" === p) && this._addLazySet(S, "zIndex", 0), "string" == typeof t && (_ = S.cssText, p = ie(e, o), S.cssText = _ + ";" + t, p = ne(e, p, ie(e)).difs, !X && k.test(t) && (p.opacity = parseFloat(RegExp.$1)), t = p, S.cssText = _), t.className ? this._firstPT = m = l.className.parse(e, t.className, "className", this, null, null, t) : this._firstPT = m = this.parse(e, t, null), this._transformType) {
						for (C = 3 === this._transformType, Ee ? d && (h = !0, "" === S.zIndex && ("auto" === (x = J(e, "zIndex", o)) || "" === x) && this._addLazySet(S, "zIndex", 0), f && this._addLazySet(S, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (C ? "visible" : "hidden"))) : S.zoom = 1, y = m; y && y._next;) y = y._next;
						T = new _e(e, "transform", 0, 0, null, 2), this._linkCSSP(T, null, y), T.setRatio = Ee ? Ue : We, T.data = this._transform || Be(e, o, !0), T.tween = s, T.pr = -1, r.pop()
					}
					if (i) {
						for (; m;) {
							for (w = m._next, y = _; y && y.pr > m.pr;) y = y._next;
							(m._prev = y ? y._prev : b) ? m._prev._next = m: _ = m, (m._next = y) ? y._prev = m : b = m, m = w
						}
						this._firstPT = _
					}
					return !0
				}, c.parse = function(e, t, i, r) {
					var a, s, c, h, d, p, f, m, y, _, b = e.style;
					for (a in t) {
						if ("function" == typeof(p = t[a]) && (p = p(v, g)), s = l[a]) i = s.parse(e, p, a, this, i, r, t);
						else {
							if ("--" === a.substr(0, 2)) {
								this._tween._propLookup[a] = this._addTween.call(this._tween, e.style, "setProperty", K(e).getPropertyValue(a) + "", p + "", a, !1, a);
								continue
							}
							d = J(e, a, o) + "", y = "string" == typeof p, "color" === a || "fill" === a || "stroke" === a || -1 !== a.indexOf("Color") || y && S.test(p) ? (y || (p = pe(p), p = (p.length > 3 ? "rgba(" : "rgb(") + p.join(",") + ")"), i = we(b, a, d, p, !0, "transparent", i, 0, r)) : y && L.test(p) ? i = we(b, a, d, p, !0, null, i, 0, r) : (c = parseFloat(d), f = c || 0 === c ? d.substr((c + "").length) : "", ("" === d || "auto" === d) && ("width" === a || "height" === a ? (c = ae(e, a, o), f = "px") : "left" === a || "top" === a ? (c = te(e, a, o), f = "px") : (c = "opacity" !== a ? 0 : 1, f = "")), (_ = y && "=" === p.charAt(1)) ? (h = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), h *= parseFloat(p), m = p.replace(x, "")) : (h = parseFloat(p), m = y ? p.replace(x, "") : ""), "" === m && (m = a in n ? n[a] : f), p = h || 0 === h ? (_ ? h + c : h) + m : t[a], f !== m && ("" !== m || "lineHeight" === a) && (h || 0 === h) && c && (c = ee(e, a, c, f), "%" === m ? (c /= ee(e, a, 100, "%") / 100, !0 !== t.strictUnits && (d = c + "%")) : "em" === m || "rem" === m || "vw" === m || "vh" === m ? c /= ee(e, a, 1, m) : "px" !== m && (h = ee(e, a, h, m), m = "px"), _ && (h || 0 === h) && (p = h + c + m)), _ && (h += c), !c && 0 !== c || !h && 0 !== h ? void 0 !== b[a] && (p || p + "" != "NaN" && null != p) ? (i = new _e(b, a, h || c || 0, 0, i, -1, a, !1, 0, d, p), i.xs0 = "none" !== p || "display" !== a && -1 === a.indexOf("Style") ? p : d) : V(t[a]) : (i = new _e(b, a, c, h - c, i, 0, a, !1 !== u && ("px" === m || "zIndex" === a), 0, d, p), i.xs0 = m))
						}
						r && i && !i.plugin && (i.plugin = r)
					}
					return i
				}, c.setRatio = function(e) {
					var t, i, n, o = this._firstPT;
					if (1 !== e || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
						if (e || this._tween._time !== this._tween._duration && 0 !== this._tween._time || -1e-6 === this._tween._rawPrevTime)
							for (; o;) {
								if (t = o.c * e + o.s, o.r ? t = Math.round(t) : 1e-6 > t && t > -1e-6 && (t = 0), o.type)
									if (1 === o.type)
										if (2 === (n = o.l)) o.t[o.p] = o.xs0 + t + o.xs1 + o.xn1 + o.xs2;
										else if (3 === n) o.t[o.p] = o.xs0 + t + o.xs1 + o.xn1 + o.xs2 + o.xn2 + o.xs3;
								else if (4 === n) o.t[o.p] = o.xs0 + t + o.xs1 + o.xn1 + o.xs2 + o.xn2 + o.xs3 + o.xn3 + o.xs4;
								else if (5 === n) o.t[o.p] = o.xs0 + t + o.xs1 + o.xn1 + o.xs2 + o.xn2 + o.xs3 + o.xn3 + o.xs4 + o.xn4 + o.xs5;
								else {
									for (i = o.xs0 + t + o.xs1, n = 1; n < o.l; n++) i += o["xn" + n] + o["xs" + (n + 1)];
									o.t[o.p] = i
								}
								else -1 === o.type ? o.t[o.p] = o.xs0 : o.setRatio && o.setRatio(e);
								else o.t[o.p] = t + o.xs0;
								o = o._next
							}
					else
						for (; o;) 2 !== o.type ? o.t[o.p] = o.b : o.setRatio(e), o = o._next;
					else
						for (; o;) {
							if (2 !== o.type)
								if (o.r && -1 !== o.type)
									if (t = Math.round(o.s + o.c), o.type) {
										if (1 === o.type) {
											for (n = o.l, i = o.xs0 + t + o.xs1, n = 1; n < o.l; n++) i += o["xn" + n] + o["xs" + (n + 1)];
											o.t[o.p] = i
										}
									}
							else o.t[o.p] = t + o.xs0;
							else o.t[o.p] = o.e;
							else o.setRatio(e);
							o = o._next
						}
				}, c._enableTransforms = function(e) {
					this._transform = this._transform || Be(this._target, o, !0), this._transformType = this._transform.svg && Se || !e && 3 !== this._transformType ? 2 : 3
				};
				var Ge = function(e) {
					this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
				};
				c._addLazySet = function(e, t, i) {
					var n = this._firstPT = new _e(e, t, 0, 0, this._firstPT, 2);
					n.e = i, n.setRatio = Ge, n.data = this
				}, c._linkCSSP = function(e, t, i, n) {
					return e && (t && (t._prev = e), e._next && (e._next._prev = e._prev), e._prev ? e._prev._next = e._next : this._firstPT === e && (this._firstPT = e._next, n = !0), i ? i._next = e : n || null !== this._firstPT || (this._firstPT = e), e._next = t, e._prev = i), e
				}, c._mod = function(e) {
					for (var t = this._firstPT; t;) "function" == typeof e[t.p] && e[t.p] === Math.round && (t.r = 1), t = t._next
				}, c._kill = function(t) {
					var i, n, o, r = t;
					if (t.autoAlpha || t.alpha) {
						r = {};
						for (n in t) r[n] = t[n];
						r.opacity = 1, r.autoAlpha && (r.visibility = 1)
					}
					for (t.className && (i = this._classNamePT) && ((o = i.xfirst) && o._prev ? this._linkCSSP(o._prev, i._next, o._prev._prev) : o === this._firstPT && (this._firstPT = i._next), i._next && this._linkCSSP(i._next, i._next._next, o._prev), this._classNamePT = null), i = this._firstPT; i;) i.plugin && i.plugin !== n && i.plugin._kill && (i.plugin._kill(t), n = i.plugin), i = i._next;
					return e.prototype._kill.call(this, r)
				};
				var Ze = function(e, t, i) {
					var n, o, r, a;
					if (e.slice)
						for (o = e.length; --o > -1;) Ze(e[o], t, i);
					else
						for (n = e.childNodes, o = n.length; --o > -1;) r = n[o], a = r.type, r.style && (t.push(ie(r)), i && i.push(r)), 1 !== a && 9 !== a && 11 !== a || !r.childNodes.length || Ze(r, t, i)
				};
				return a.cascadeTo = function(e, i, n) {
					var o, r, a, s, l = t.to(e, i, n),
						c = [l],
						u = [],
						h = [],
						d = [],
						p = t._internals.reservedProps;
					for (e = l._targets || l.target, Ze(e, u, d), l.render(i, !0, !0), Ze(e, h), l.render(0, !0, !0), l._enabled(!0), o = d.length; --o > -1;)
						if ((r = ne(d[o], u[o], h[o])).firstMPT) {
							r = r.difs;
							for (a in n) p[a] && (r[a] = n[a]);
							s = {};
							for (a in r) s[a] = u[o][a];
							c.push(t.fromTo(d[o], i, s, r))
						}
					return c
				}, e.activate([a]), a
			}, !0),
			function() {
				var e = function(e) {
						for (; e;) e.f || e.blob || (e.m = Math.round), e = e._next
					},
					t = _gsScope._gsDefine.plugin({
						propName: "roundProps",
						version: "1.6.0",
						priority: -1,
						API: 2,
						init: function(e, t, i) {
							return this._tween = i, !0
						}
					}).prototype;
				t._onInitAllProps = function() {
					for (var t, i, n, o = this._tween, r = o.vars.roundProps.join ? o.vars.roundProps : o.vars.roundProps.split(","), a = r.length, s = {}, l = o._propLookup.roundProps; --a > -1;) s[r[a]] = Math.round;
					for (a = r.length; --a > -1;)
						for (t = r[a], i = o._firstPT; i;) n = i._next, i.pg ? i.t._mod(s) : i.n === t && (2 === i.f && i.t ? e(i.t._firstPT) : (this._add(i.t, t, i.s, i.c), n && (n._prev = i._prev), i._prev ? i._prev._next = n : o._firstPT === i && (o._firstPT = n), i._next = i._prev = null, o._propLookup[t] = l)), i = n;
					return !1
				}, t._add = function(e, t, i, n) {
					this._addTween(e, t, i, i + n, t, Math.round), this._overwriteProps.push(t)
				}
			}(), _gsScope._gsDefine.plugin({
				propName: "attr",
				API: 2,
				version: "0.6.1",
				init: function(e, t, i, n) {
					var o, r;
					if ("function" != typeof e.setAttribute) return !1;
					for (o in t) "function" == typeof(r = t[o]) && (r = r(n, e)), this._addTween(e, "setAttribute", e.getAttribute(o) + "", r + "", o, !1, o), this._overwriteProps.push(o);
					return !0
				}
			}), _gsScope._gsDefine.plugin({
				propName: "directionalRotation",
				version: "0.3.1",
				API: 2,
				init: function(e, t, i, n) {
					"object" != typeof t && (t = {
						rotation: t
					}), this.finals = {};
					var o, r, a, s, l, c, u = !0 === t.useRadians ? 2 * Math.PI : 360;
					for (o in t) "useRadians" !== o && ("function" == typeof(s = t[o]) && (s = s(n, e)), c = (s + "").split("_"), r = c[0], a = parseFloat("function" != typeof e[o] ? e[o] : e[o.indexOf("set") || "function" != typeof e["get" + o.substr(3)] ? o : "get" + o.substr(3)]()), s = this.finals[o] = "string" == typeof r && "=" === r.charAt(1) ? a + parseInt(r.charAt(0) + "1", 10) * Number(r.substr(2)) : Number(r) || 0, l = s - a, c.length && (-1 !== (r = c.join("_")).indexOf("short") && (l %= u) != l % (u / 2) && (l = 0 > l ? l + u : l - u), -1 !== r.indexOf("_cw") && 0 > l ? l = (l + 9999999999 * u) % u - (l / u | 0) * u : -1 !== r.indexOf("ccw") && l > 0 && (l = (l - 9999999999 * u) % u - (l / u | 0) * u)), (l > 1e-6 || -1e-6 > l) && (this._addTween(e, o, a, a + l, o), this._overwriteProps.push(o)));
					return !0
				},
				set: function(e) {
					var t;
					if (1 !== e) this._super.setRatio.call(this, e);
					else
						for (t = this._firstPT; t;) t.f ? t.t[t.p](this.finals[t.p]) : t.t[t.p] = this.finals[t.p], t = t._next
				}
			})._autoCSS = !0, _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(e) {
				var t, i, n, o, r = _gsScope.GreenSockGlobals || _gsScope,
					a = r.com.greensock,
					s = 2 * Math.PI,
					l = Math.PI / 2,
					c = a._class,
					u = function(t, i) {
						var n = c("easing." + t, function() {}, !0),
							o = n.prototype = new e;
						return o.constructor = n, o.getRatio = i, n
					},
					h = e.register || function() {},
					d = function(e, t, i, n, o) {
						var r = c("easing." + e, {
							easeOut: new t,
							easeIn: new i,
							easeInOut: new n
						}, !0);
						return h(r, e), r
					},
					p = function(e, t, i) {
						this.t = e, this.v = t, i && (this.next = i, i.prev = this, this.c = i.v - t, this.gap = i.t - e)
					},
					f = function(t, i) {
						var n = c("easing." + t, function(e) {
								this._p1 = e || 0 === e ? e : 1.70158, this._p2 = 1.525 * this._p1
							}, !0),
							o = n.prototype = new e;
						return o.constructor = n, o.getRatio = i, o.config = function(e) {
							return new n(e)
						}, n
					},
					m = d("Back", f("BackOut", function(e) {
						return (e -= 1) * e * ((this._p1 + 1) * e + this._p1) + 1
					}), f("BackIn", function(e) {
						return e * e * ((this._p1 + 1) * e - this._p1)
					}), f("BackInOut", function(e) {
						return (e *= 2) < 1 ? .5 * e * e * ((this._p2 + 1) * e - this._p2) : .5 * ((e -= 2) * e * ((this._p2 + 1) * e + this._p2) + 2)
					})),
					g = c("easing.SlowMo", function(e, t, i) {
						t = t || 0 === t ? t : .7, null == e ? e = .7 : e > 1 && (e = 1), this._p = 1 !== e ? t : 0, this._p1 = (1 - e) / 2, this._p2 = e, this._p3 = this._p1 + this._p2, this._calcEnd = !0 === i
					}, !0),
					v = g.prototype = new e;
				return v.constructor = g, v.getRatio = function(e) {
					var t = e + (.5 - e) * this._p;
					return e < this._p1 ? this._calcEnd ? 1 - (e = 1 - e / this._p1) * e : t - (e = 1 - e / this._p1) * e * e * e * t : e > this._p3 ? this._calcEnd ? 1 === e ? 0 : 1 - (e = (e - this._p3) / this._p1) * e : t + (e - t) * (e = (e - this._p3) / this._p1) * e * e * e : this._calcEnd ? 1 : t
				}, g.ease = new g(.7, .7), v.config = g.config = function(e, t, i) {
					return new g(e, t, i)
				}, t = c("easing.SteppedEase", function(e, t) {
					e = e || 1, this._p1 = 1 / e, this._p2 = e + (t ? 0 : 1), this._p3 = t ? 1 : 0
				}, !0), v = t.prototype = new e, v.constructor = t, v.getRatio = function(e) {
					return 0 > e ? e = 0 : e >= 1 && (e = .999999999), ((this._p2 * e | 0) + this._p3) * this._p1
				}, v.config = t.config = function(e, i) {
					return new t(e, i)
				}, i = c("easing.ExpoScaleEase", function(e, t, i) {
					this._p1 = Math.log(t / e), this._p2 = t - e, this._p3 = e, this._ease = i
				}, !0), v = i.prototype = new e, v.constructor = i, v.getRatio = function(e) {
					return this._ease && (e = this._ease.getRatio(e)), (this._p3 * Math.exp(this._p1 * e) - this._p3) / this._p2
				}, v.config = i.config = function(e, t, n) {
					return new i(e, t, n)
				}, n = c("easing.RoughEase", function(t) {
					for (var i, n, o, r, a, s, l = (t = t || {}).taper || "none", c = [], u = 0, h = 0 | (t.points || 20), d = h, f = !1 !== t.randomize, m = !0 === t.clamp, g = t.template instanceof e ? t.template : null, v = "number" == typeof t.strength ? .4 * t.strength : .4; --d > -1;) i = f ? Math.random() : 1 / h * d, n = g ? g.getRatio(i) : i, "none" === l ? o = v : "out" === l ? (r = 1 - i, o = r * r * v) : "in" === l ? o = i * i * v : .5 > i ? (r = 2 * i, o = r * r * .5 * v) : (r = 2 * (1 - i), o = r * r * .5 * v), f ? n += Math.random() * o - .5 * o : d % 2 ? n += .5 * o : n -= .5 * o, m && (n > 1 ? n = 1 : 0 > n && (n = 0)), c[u++] = {
						x: i,
						y: n
					};
					for (c.sort(function(e, t) {
							return e.x - t.x
						}), s = new p(1, 1, null), d = h; --d > -1;) a = c[d], s = new p(a.x, a.y, s);
					this._prev = new p(0, 0, 0 !== s.t ? s : s.next)
				}, !0), v = n.prototype = new e, v.constructor = n, v.getRatio = function(e) {
					var t = this._prev;
					if (e > t.t) {
						for (; t.next && e >= t.t;) t = t.next;
						t = t.prev
					}
					else
						for (; t.prev && e <= t.t;) t = t.prev;
					return this._prev = t, t.v + (e - t.t) / t.gap * t.c
				}, v.config = function(e) {
					return new n(e)
				}, n.ease = new n, d("Bounce", u("BounceOut", function(e) {
					return 1 / 2.75 > e ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
				}), u("BounceIn", function(e) {
					return (e = 1 - e) < 1 / 2.75 ? 1 - 7.5625 * e * e : 2 / 2.75 > e ? 1 - (7.5625 * (e -= 1.5 / 2.75) * e + .75) : 2.5 / 2.75 > e ? 1 - (7.5625 * (e -= 2.25 / 2.75) * e + .9375) : 1 - (7.5625 * (e -= 2.625 / 2.75) * e + .984375)
				}), u("BounceInOut", function(e) {
					var t = .5 > e;
					return e = t ? 1 - 2 * e : 2 * e - 1, e = 1 / 2.75 > e ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375, t ? .5 * (1 - e) : .5 * e + .5
				})), d("Circ", u("CircOut", function(e) {
					return Math.sqrt(1 - (e -= 1) * e)
				}), u("CircIn", function(e) {
					return -(Math.sqrt(1 - e * e) - 1)
				}), u("CircInOut", function(e) {
					return (e *= 2) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
				})), o = function(t, i, n) {
					var o = c("easing." + t, function(e, t) {
							this._p1 = e >= 1 ? e : 1, this._p2 = (t || n) / (1 > e ? e : 1), this._p3 = this._p2 / s * (Math.asin(1 / this._p1) || 0), this._p2 = s / this._p2
						}, !0),
						r = o.prototype = new e;
					return r.constructor = o, r.getRatio = i, r.config = function(e, t) {
						return new o(e, t)
					}, o
				}, d("Elastic", o("ElasticOut", function(e) {
					return this._p1 * Math.pow(2, -10 * e) * Math.sin((e - this._p3) * this._p2) + 1
				}, .3), o("ElasticIn", function(e) {
					return -this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * this._p2)
				}, .3), o("ElasticInOut", function(e) {
					return (e *= 2) < 1 ? this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * this._p2) * -.5 : this._p1 * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - this._p3) * this._p2) * .5 + 1
				}, .45)), d("Expo", u("ExpoOut", function(e) {
					return 1 - Math.pow(2, -10 * e)
				}), u("ExpoIn", function(e) {
					return Math.pow(2, 10 * (e - 1)) - .001
				}), u("ExpoInOut", function(e) {
					return (e *= 2) < 1 ? .5 * Math.pow(2, 10 * (e - 1)) : .5 * (2 - Math.pow(2, -10 * (e - 1)))
				})), d("Sine", u("SineOut", function(e) {
					return Math.sin(e * l)
				}), u("SineIn", function(e) {
					return 1 - Math.cos(e * l)
				}), u("SineInOut", function(e) {
					return -.5 * (Math.cos(Math.PI * e) - 1)
				})), c("easing.EaseLookup", {
					find: function(t) {
						return e.map[t]
					}
				}, !0), h(r.SlowMo, "SlowMo", "ease,"), h(n, "RoughEase", "ease,"), h(t, "SteppedEase", "ease,"), m
			}, !0)
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function(e, t) {
		"use strict";
		var i = {},
			n = e.document,
			o = e.GreenSockGlobals = e.GreenSockGlobals || e;
		if (!o.TweenLite) {
			var r, a, s, l, c, u = function(e) {
					var t, i = e.split("."),
						n = o;
					for (t = 0; t < i.length; t++) n[i[t]] = n = n[i[t]] || {};
					return n
				},
				h = u("com.greensock"),
				d = 1e-10,
				p = function(e) {
					var t, i = [],
						n = e.length;
					for (t = 0; t !== n; i.push(e[t++]));
					return i
				},
				f = function() {},
				m = function() {
					var e = Object.prototype.toString,
						t = e.call([]);
					return function(i) {
						return null != i && (i instanceof Array || "object" == typeof i && !!i.push && e.call(i) === t)
					}
				}(),
				g = {},
				v = function(n, r, a, s) {
					this.sc = g[n] ? g[n].sc : [], g[n] = this, this.gsClass = null, this.func = a;
					var l = [];
					this.check = function(c) {
						for (var h, d, p, f, m = r.length, y = m; --m > -1;)(h = g[r[m]] || new v(r[m], [])).gsClass ? (l[m] = h.gsClass, y--) : c && h.sc.push(this);
						if (0 === y && a) {
							if (d = ("com.greensock." + n).split("."), p = d.pop(), f = u(d.join("."))[p] = this.gsClass = a.apply(a, l), s)
								if (o[p] = i[p] = f, "undefined" != typeof module && module.exports)
									if (n === t) {
										module.exports = i[t] = f;
										for (m in i) f[m] = i[m]
									}
							else i[t] && (i[t][p] = f);
							else "function" == typeof define && define.amd && define((e.GreenSockAMDPath ? e.GreenSockAMDPath + "/" : "") + n.split(".").pop(), [], function() {
								return f
							});
							for (m = 0; m < this.sc.length; m++) this.sc[m].check()
						}
					}, this.check(!0)
				},
				y = e._gsDefine = function(e, t, i, n) {
					return new v(e, t, i, n)
				},
				_ = h._class = function(e, t, i) {
					return t = t || function() {}, y(e, [], function() {
						return t
					}, i), t
				};
			y.globals = o;
			var b = [0, 0, 1, 1],
				w = _("easing.Ease", function(e, t, i, n) {
					this._func = e, this._type = i || 0, this._power = n || 0, this._params = t ? b.concat(t) : b
				}, !0),
				x = w.map = {},
				T = w.register = function(e, t, i, n) {
					for (var o, r, a, s, l = t.split(","), c = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --c > -1;)
						for (r = l[c], o = n ? _("easing." + r, null, !0) : h.easing[r] || {}, a = u.length; --a > -1;) s = u[a], x[r + "." + s] = x[s + r] = o[s] = e.getRatio ? e : e[s] || new e
				};
			for ((s = w.prototype)._calcEnd = !1, s.getRatio = function(e) {
					if (this._func) return this._params[0] = e, this._func.apply(null, this._params);
					var t = this._type,
						i = this._power,
						n = 1 === t ? 1 - e : 2 === t ? e : .5 > e ? 2 * e : 2 * (1 - e);
					return 1 === i ? n *= n : 2 === i ? n *= n * n : 3 === i ? n *= n * n * n : 4 === i && (n *= n * n * n * n), 1 === t ? 1 - n : 2 === t ? n : .5 > e ? n / 2 : 1 - n / 2
				}, a = (r = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"]).length; --a > -1;) s = r[a] + ",Power" + a, T(new w(null, null, 1, a), s, "easeOut", !0), T(new w(null, null, 2, a), s, "easeIn" + (0 === a ? ",easeNone" : "")), T(new w(null, null, 3, a), s, "easeInOut");
			x.linear = h.easing.Linear.easeIn, x.swing = h.easing.Quad.easeInOut;
			var k = _("events.EventDispatcher", function(e) {
				this._listeners = {}, this._eventTarget = e || this
			});
			(s = k.prototype).addEventListener = function(e, t, i, n, o) {
				o = o || 0;
				var r, a, s = this._listeners[e],
					u = 0;
				for (this !== l || c || l.wake(), null == s && (this._listeners[e] = s = []), a = s.length; --a > -1;)(r = s[a]).c === t && r.s === i ? s.splice(a, 1) : 0 === u && r.pr < o && (u = a + 1);
				s.splice(u, 0, {
					c: t,
					s: i,
					up: n,
					pr: o
				})
			}, s.removeEventListener = function(e, t) {
				var i, n = this._listeners[e];
				if (n)
					for (i = n.length; --i > -1;)
						if (n[i].c === t) return void n.splice(i, 1)
			}, s.dispatchEvent = function(e) {
				var t, i, n, o = this._listeners[e];
				if (o)
					for ((t = o.length) > 1 && (o = o.slice(0)), i = this._eventTarget; --t > -1;)(n = o[t]) && (n.up ? n.c.call(n.s || i, {
						type: e,
						target: i
					}) : n.c.call(n.s || i))
			};
			var C = e.requestAnimationFrame,
				S = e.cancelAnimationFrame,
				A = Date.now || function() {
					return (new Date).getTime()
				},
				E = A();
			for (a = (r = ["ms", "moz", "webkit", "o"]).length; --a > -1 && !C;) C = e[r[a] + "RequestAnimationFrame"], S = e[r[a] + "CancelAnimationFrame"] || e[r[a] + "CancelRequestAnimationFrame"];
			_("Ticker", function(e, t) {
				var i, o, r, a, s, u = this,
					h = A(),
					p = !(!1 === t || !C) && "auto",
					m = 500,
					g = 33,
					v = function(e) {
						var t, n, l = A() - E;
						l > m && (h += l - g), E += l, u.time = (E - h) / 1e3, t = u.time - s, (!i || t > 0 || !0 === e) && (u.frame++, s += t + (t >= a ? .004 : a - t), n = !0), !0 !== e && (r = o(v)), n && u.dispatchEvent("tick")
					};
				k.call(u), u.time = u.frame = 0, u.tick = function() {
					v(!0)
				}, u.lagSmoothing = function(e, t) {
					return arguments.length ? (m = e || 1 / d, void(g = Math.min(t, m, 0))) : 1 / d > m
				}, u.sleep = function() {
					null != r && (p && S ? S(r) : clearTimeout(r), o = f, r = null, u === l && (c = !1))
				}, u.wake = function(e) {
					null !== r ? u.sleep() : e ? h += -E + (E = A()) : u.frame > 10 && (E = A() - m + 5), o = 0 === i ? f : p && C ? C : function(e) {
						return setTimeout(e, 1e3 * (s - u.time) + 1 | 0)
					}, u === l && (c = !0), v(2)
				}, u.fps = function(e) {
					return arguments.length ? (i = e, a = 1 / (i || 60), s = this.time + a, void u.wake()) : i
				}, u.useRAF = function(e) {
					return arguments.length ? (u.sleep(), p = e, void u.fps(i)) : p
				}, u.fps(e), setTimeout(function() {
					"auto" === p && u.frame < 5 && "hidden" !== (n || {}).visibilityState && u.useRAF(!1)
				}, 1500)
			}), (s = h.Ticker.prototype = new h.events.EventDispatcher).constructor = h.Ticker;
			var P = _("core.Animation", function(e, t) {
				if (this.vars = t = t || {}, this._duration = this._totalDuration = e || 0, this._delay = Number(t.delay) || 0, this._timeScale = 1, this._active = !0 === t.immediateRender, this.data = t.data, this._reversed = !0 === t.reversed, Q) {
					c || l.wake();
					var i = this.vars.useFrames ? V : Q;
					i.add(this, i._time), this.vars.paused && this.paused(!0)
				}
			});
			l = P.ticker = new h.Ticker, (s = P.prototype)._dirty = s._gc = s._initted = s._paused = !1, s._totalTime = s._time = 0, s._rawPrevTime = -1, s._next = s._last = s._onUpdate = s._timeline = s.timeline = null, s._paused = !1;
			var O = function() {
				c && A() - E > 2e3 && ("hidden" !== (n || {}).visibilityState || !l.lagSmoothing()) && l.wake();
				var e = setTimeout(O, 2e3);
				e.unref && e.unref()
			};
			O(), s.play = function(e, t) {
				return null != e && this.seek(e, t), this.reversed(!1).paused(!1)
			}, s.pause = function(e, t) {
				return null != e && this.seek(e, t), this.paused(!0)
			}, s.resume = function(e, t) {
				return null != e && this.seek(e, t), this.paused(!1)
			}, s.seek = function(e, t) {
				return this.totalTime(Number(e), !1 !== t)
			}, s.restart = function(e, t) {
				return this.reversed(!1).paused(!1).totalTime(e ? -this._delay : 0, !1 !== t, !0)
			}, s.reverse = function(e, t) {
				return null != e && this.seek(e || this.totalDuration(), t), this.reversed(!0).paused(!1)
			}, s.render = function(e, t, i) {}, s.invalidate = function() {
				return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
			}, s.isActive = function() {
				var e, t = this._timeline,
					i = this._startTime;
				return !t || !this._gc && !this._paused && t.isActive() && (e = t.rawTime(!0)) >= i && e < i + this.totalDuration() / this._timeScale - 1e-7
			}, s._enabled = function(e, t) {
				return c || l.wake(), this._gc = !e, this._active = this.isActive(), !0 !== t && (e && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !e && this.timeline && this._timeline._remove(this, !0)), !1
			}, s._kill = function(e, t) {
				return this._enabled(!1, !1)
			}, s.kill = function(e, t) {
				return this._kill(e, t), this
			}, s._uncache = function(e) {
				for (var t = e ? this : this.timeline; t;) t._dirty = !0, t = t.timeline;
				return this
			}, s._swapSelfInParams = function(e) {
				for (var t = e.length, i = e.concat(); --t > -1;) "{self}" === e[t] && (i[t] = this);
				return i
			}, s._callback = function(e) {
				var t = this.vars,
					i = t[e],
					n = t[e + "Params"],
					o = t[e + "Scope"] || t.callbackScope || this;
				switch (n ? n.length : 0) {
					case 0:
						i.call(o);
						break;
					case 1:
						i.call(o, n[0]);
						break;
					case 2:
						i.call(o, n[0], n[1]);
						break;
					default:
						i.apply(o, n)
				}
			}, s.eventCallback = function(e, t, i, n) {
				if ("on" === (e || "").substr(0, 2)) {
					var o = this.vars;
					if (1 === arguments.length) return o[e];
					null == t ? delete o[e] : (o[e] = t, o[e + "Params"] = m(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, o[e + "Scope"] = n), "onUpdate" === e && (this._onUpdate = t)
				}
				return this
			}, s.delay = function(e) {
				return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + e - this._delay), this._delay = e, this) : this._delay
			}, s.duration = function(e) {
				return arguments.length ? (this._duration = this._totalDuration = e, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== e && this.totalTime(this._totalTime * (e / this._duration), !0), this) : (this._dirty = !1, this._duration)
			}, s.totalDuration = function(e) {
				return this._dirty = !1, arguments.length ? this.duration(e) : this._totalDuration
			}, s.time = function(e, t) {
				return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(e > this._duration ? this._duration : e, t)) : this._time
			}, s.totalTime = function(e, t, i) {
				if (c || l.wake(), !arguments.length) return this._totalTime;
				if (this._timeline) {
					if (0 > e && !i && (e += this.totalDuration()), this._timeline.smoothChildTiming) {
						this._dirty && this.totalDuration();
						var n = this._totalDuration,
							o = this._timeline;
						if (e > n && !i && (e = n), this._startTime = (this._paused ? this._pauseTime : o._time) - (this._reversed ? n - e : e) / this._timeScale, o._dirty || this._uncache(!1), o._timeline)
							for (; o._timeline;) o._timeline._time !== (o._startTime + o._totalTime) / o._timeScale && o.totalTime(o._totalTime, !0), o = o._timeline
					}
					this._gc && this._enabled(!0, !1), (this._totalTime !== e || 0 === this._duration) && (L.length && Z(), this.render(e, t, !1), L.length && Z())
				}
				return this
			}, s.progress = s.totalProgress = function(e, t) {
				var i = this.duration();
				return arguments.length ? this.totalTime(i * e, t) : i ? this._time / i : this.ratio
			}, s.startTime = function(e) {
				return arguments.length ? (e !== this._startTime && (this._startTime = e, this.timeline && this.timeline._sortChildren && this.timeline.add(this, e - this._delay)), this) : this._startTime
			}, s.endTime = function(e) {
				return this._startTime + (0 != e ? this.totalDuration() : this.duration()) / this._timeScale
			}, s.timeScale = function(e) {
				if (!arguments.length) return this._timeScale;
				var t, i;
				for (e = e || d, this._timeline && this._timeline.smoothChildTiming && (t = this._pauseTime, i = t || 0 === t ? t : this._timeline.totalTime(), this._startTime = i - (i - this._startTime) * this._timeScale / e), this._timeScale = e, i = this.timeline; i && i.timeline;) i._dirty = !0, i.totalDuration(), i = i.timeline;
				return this
			}, s.reversed = function(e) {
				return arguments.length ? (e != this._reversed && (this._reversed = e, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
			}, s.paused = function(e) {
				if (!arguments.length) return this._paused;
				var t, i, n = this._timeline;
				return e != this._paused && n && (c || e || l.wake(), t = n.rawTime(), i = t - this._pauseTime, !e && n.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = e ? t : null, this._paused = e, this._active = this.isActive(), !e && 0 !== i && this._initted && this.duration() && (t = n.smoothChildTiming ? this._totalTime : (t - this._startTime) / this._timeScale, this.render(t, t === this._totalTime, !0))), this._gc && !e && this._enabled(!0, !1), this
			};
			var $ = _("core.SimpleTimeline", function(e) {
				P.call(this, 0, e), this.autoRemoveChildren = this.smoothChildTiming = !0
			});
			(s = $.prototype = new P).constructor = $, s.kill()._gc = !1, s._first = s._last = s._recent = null, s._sortChildren = !1, s.add = s.insert = function(e, t, i, n) {
				var o, r;
				if (e._startTime = Number(t || 0) + e._delay, e._paused && this !== e._timeline && (e._pauseTime = e._startTime + (this.rawTime() - e._startTime) / e._timeScale), e.timeline && e.timeline._remove(e, !0), e.timeline = e._timeline = this, e._gc && e._enabled(!0, !0), o = this._last, this._sortChildren)
					for (r = e._startTime; o && o._startTime > r;) o = o._prev;
				return o ? (e._next = o._next, o._next = e) : (e._next = this._first, this._first = e), e._next ? e._next._prev = e : this._last = e, e._prev = o, this._recent = e, this._timeline && this._uncache(!0), this
			}, s._remove = function(e, t) {
				return e.timeline === this && (t || e._enabled(!1, !0), e._prev ? e._prev._next = e._next : this._first === e && (this._first = e._next), e._next ? e._next._prev = e._prev : this._last === e && (this._last = e._prev), e._next = e._prev = e.timeline = null, e === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
			}, s.render = function(e, t, i) {
				var n, o = this._first;
				for (this._totalTime = this._time = this._rawPrevTime = e; o;) n = o._next, (o._active || e >= o._startTime && !o._paused && !o._gc) && (o._reversed ? o.render((o._dirty ? o.totalDuration() : o._totalDuration) - (e - o._startTime) * o._timeScale, t, i) : o.render((e - o._startTime) * o._timeScale, t, i)), o = n
			}, s.rawTime = function() {
				return c || l.wake(), this._totalTime
			};
			var M = _("TweenLite", function(t, i, n) {
					if (P.call(this, i, n), this.render = M.prototype.render, null == t) throw "Cannot tween a null target.";
					this.target = t = "string" != typeof t ? t : M.selector(t) || t;
					var o, r, a, s = t.jquery || t.length && t !== e && t[0] && (t[0] === e || t[0].nodeType && t[0].style && !t.nodeType),
						l = this.vars.overwrite;
					if (this._overwrite = l = null == l ? Y[M.defaultOverwrite] : "number" == typeof l ? l >> 0 : Y[l], (s || t instanceof Array || t.push && m(t)) && "number" != typeof t[0])
						for (this._targets = a = p(t), this._propLookup = [], this._siblings = [], o = 0; o < a.length; o++)(r = a[o]) ? "string" != typeof r ? r.length && r !== e && r[0] && (r[0] === e || r[0].nodeType && r[0].style && !r.nodeType) ? (a.splice(o--, 1), this._targets = a = a.concat(p(r))) : (this._siblings[o] = K(r, this, !1), 1 === l && this._siblings[o].length > 1 && ee(r, this, null, 1, this._siblings[o])) : "string" == typeof(r = a[o--] = M.selector(r)) && a.splice(o + 1, 1) : a.splice(o--, 1);
					else this._propLookup = {}, this._siblings = K(t, this, !1), 1 === l && this._siblings.length > 1 && ee(t, this, null, 1, this._siblings);
					(this.vars.immediateRender || 0 === i && 0 === this._delay && !1 !== this.vars.immediateRender) && (this._time = -d, this.render(Math.min(0, -this._delay)))
				}, !0),
				D = function(t) {
					return t && t.length && t !== e && t[0] && (t[0] === e || t[0].nodeType && t[0].style && !t.nodeType)
				},
				z = function(e, t) {
					var i, n = {};
					for (i in e) X[i] || i in t && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!B[i] || B[i] && B[i]._autoCSS) || (n[i] = e[i], delete e[i]);
					e.css = n
				};
			(s = M.prototype = new P).constructor = M, s.kill()._gc = !1, s.ratio = 0, s._firstPT = s._targets = s._overwrittenProps = s._startAt = null, s._notifyPluginsOfEnabled = s._lazy = !1, M.version = "1.20.4", M.defaultEase = s._ease = new w(null, null, 1, 1), M.defaultOverwrite = "auto", M.ticker = l, M.autoSleep = 120, M.lagSmoothing = function(e, t) {
				l.lagSmoothing(e, t)
			}, M.selector = e.$ || e.jQuery || function(t) {
				var i = e.$ || e.jQuery;
				return i ? (M.selector = i, i(t)) : void 0 === n ? t : n.querySelectorAll ? n.querySelectorAll(t) : n.getElementById("#" === t.charAt(0) ? t.substr(1) : t)
			};
			var L = [],
				I = {},
				F = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
				j = /[\+-]=-?[\.\d]/,
				R = function(e) {
					for (var t, i = this._firstPT; i;) t = i.blob ? 1 === e && null != this.end ? this.end : e ? this.join("") : this.start : i.c * e + i.s, i.m ? t = i.m(t, this._target || i.t) : 1e-6 > t && t > -1e-6 && !i.blob && (t = 0), i.f ? i.fp ? i.t[i.p](i.fp, t) : i.t[i.p](t) : i.t[i.p] = t, i = i._next
				},
				N = function(e, t, i, n) {
					var o, r, a, s, l, c, u, h = [],
						d = 0,
						p = "",
						f = 0;
					for (h.start = e, h.end = t, e = h[0] = e + "", t = h[1] = t + "", i && (i(h), e = h[0], t = h[1]), h.length = 0, o = e.match(F) || [], r = t.match(F) || [], n && (n._next = null, n.blob = 1, h._firstPT = h._applyPT = n), l = r.length, s = 0; l > s; s++) u = r[s], c = t.substr(d, t.indexOf(u, d) - d), p += c || !s ? c : ",", d += c.length, f ? f = (f + 1) % 5 : "rgba(" === c.substr(-5) && (f = 1), u === o[s] || o.length <= s ? p += u : (p && (h.push(p), p = ""), a = parseFloat(o[s]), h.push(a), h._firstPT = {
						_next: h._firstPT,
						t: h,
						p: h.length - 1,
						s: a,
						c: ("=" === u.charAt(1) ? parseInt(u.charAt(0) + "1", 10) * parseFloat(u.substr(2)) : parseFloat(u) - a) || 0,
						f: 0,
						m: f && 4 > f ? Math.round : 0
					}), d += u.length;
					return (p += t.substr(d)) && h.push(p), h.setRatio = R, j.test(t) && (h.end = null), h
				},
				H = function(e, t, i, n, o, r, a, s, l) {
					"function" == typeof n && (n = n(l || 0, e));
					var c, u = typeof e[t],
						h = "function" !== u ? "" : t.indexOf("set") || "function" != typeof e["get" + t.substr(3)] ? t : "get" + t.substr(3),
						d = "get" !== i ? i : h ? a ? e[h](a) : e[h]() : e[t],
						p = "string" == typeof n && "=" === n.charAt(1),
						f = {
							t: e,
							p: t,
							s: d,
							f: "function" === u,
							pg: 0,
							n: o || t,
							m: r ? "function" == typeof r ? r : Math.round : 0,
							pr: 0,
							c: p ? parseInt(n.charAt(0) + "1", 10) * parseFloat(n.substr(2)) : parseFloat(n) - d || 0
						};
					return ("number" != typeof d || "number" != typeof n && !p) && (a || isNaN(d) || !p && isNaN(n) || "boolean" == typeof d || "boolean" == typeof n ? (f.fp = a, c = N(d, p ? parseFloat(f.s) + f.c + (f.s + "").replace(/[0-9\-\.]/g, "") : n, s || M.defaultStringFilter, f), f = {
						t: c,
						p: "setRatio",
						s: 0,
						c: 1,
						f: 2,
						pg: 0,
						n: o || t,
						pr: 0,
						m: 0
					}) : (f.s = parseFloat(d), p || (f.c = parseFloat(n) - f.s || 0))), f.c ? ((f._next = this._firstPT) && (f._next._prev = f), this._firstPT = f, f) : void 0
				},
				q = M._internals = {
					isArray: m,
					isSelector: D,
					lazyTweens: L,
					blobDif: N
				},
				B = M._plugins = {},
				W = q.tweenLookup = {},
				U = 0,
				X = q.reservedProps = {
					ease: 1,
					delay: 1,
					overwrite: 1,
					onComplete: 1,
					onCompleteParams: 1,
					onCompleteScope: 1,
					useFrames: 1,
					runBackwards: 1,
					startAt: 1,
					onUpdate: 1,
					onUpdateParams: 1,
					onUpdateScope: 1,
					onStart: 1,
					onStartParams: 1,
					onStartScope: 1,
					onReverseComplete: 1,
					onReverseCompleteParams: 1,
					onReverseCompleteScope: 1,
					onRepeat: 1,
					onRepeatParams: 1,
					onRepeatScope: 1,
					easeParams: 1,
					yoyo: 1,
					immediateRender: 1,
					repeat: 1,
					repeatDelay: 1,
					data: 1,
					paused: 1,
					reversed: 1,
					autoCSS: 1,
					lazy: 1,
					onOverwrite: 1,
					callbackScope: 1,
					stringFilter: 1,
					id: 1,
					yoyoEase: 1
				},
				Y = {
					none: 0,
					all: 1,
					auto: 2,
					concurrent: 3,
					allOnStart: 4,
					preexisting: 5,
					true: 1,
					false: 0
				},
				V = P._rootFramesTimeline = new $,
				Q = P._rootTimeline = new $,
				G = 30,
				Z = q.lazyRender = function() {
					var e, t = L.length;
					for (I = {}; --t > -1;)(e = L[t]) && !1 !== e._lazy && (e.render(e._lazy[0], e._lazy[1], !0), e._lazy = !1);
					L.length = 0
				};
			Q._startTime = l.time, V._startTime = l.frame, Q._active = V._active = !0, setTimeout(Z, 1), P._updateRoot = M.render = function() {
				var e, t, i;
				if (L.length && Z(), Q.render((l.time - Q._startTime) * Q._timeScale, !1, !1), V.render((l.frame - V._startTime) * V._timeScale, !1, !1), L.length && Z(), l.frame >= G) {
					G = l.frame + (parseInt(M.autoSleep, 10) || 120);
					for (i in W) {
						for (e = (t = W[i].tweens).length; --e > -1;) t[e]._gc && t.splice(e, 1);
						0 === t.length && delete W[i]
					}
					if ((!(i = Q._first) || i._paused) && M.autoSleep && !V._first && 1 === l._listeners.tick.length) {
						for (; i && i._paused;) i = i._next;
						i || l.sleep()
					}
				}
			}, l.addEventListener("tick", P._updateRoot);
			var K = function(e, t, i) {
					var n, o, r = e._gsTweenID;
					if (W[r || (e._gsTweenID = r = "t" + U++)] || (W[r] = {
							target: e,
							tweens: []
						}), t && (n = W[r].tweens, n[o = n.length] = t, i))
						for (; --o > -1;) n[o] === t && n.splice(o, 1);
					return W[r].tweens
				},
				J = function(e, t, i, n) {
					var o, r, a = e.vars.onOverwrite;
					return a && (o = a(e, t, i, n)), (a = M.onOverwrite) && (r = a(e, t, i, n)), !1 !== o && !1 !== r
				},
				ee = function(e, t, i, n, o) {
					var r, a, s, l;
					if (1 === n || n >= 4) {
						for (l = o.length, r = 0; l > r; r++)
							if ((s = o[r]) !== t) s._gc || s._kill(null, e, t) && (a = !0);
							else if (5 === n) break;
						return a
					}
					var c, u = t._startTime + d,
						h = [],
						p = 0,
						f = 0 === t._duration;
					for (r = o.length; --r > -1;)(s = o[r]) === t || s._gc || s._paused || (s._timeline !== t._timeline ? (c = c || te(t, 0, f), 0 === te(s, c, f) && (h[p++] = s)) : s._startTime <= u && s._startTime + s.totalDuration() / s._timeScale > u && ((f || !s._initted) && u - s._startTime <= 2e-10 || (h[p++] = s)));
					for (r = p; --r > -1;)
						if (s = h[r], 2 === n && s._kill(i, e, t) && (a = !0), 2 !== n || !s._firstPT && s._initted) {
							if (2 !== n && !J(s, t)) continue;
							s._enabled(!1, !1) && (a = !0)
						}
					return a
				},
				te = function(e, t, i) {
					for (var n = e._timeline, o = n._timeScale, r = e._startTime; n._timeline;) {
						if (r += n._startTime, o *= n._timeScale, n._paused) return -100;
						n = n._timeline
					}
					return (r /= o) > t ? r - t : i && r === t || !e._initted && 2 * d > r - t ? d : (r += e.totalDuration() / e._timeScale / o) > t + d ? 0 : r - t - d
				};
			s._init = function() {
				var e, t, i, n, o, r, a = this.vars,
					s = this._overwrittenProps,
					l = this._duration,
					c = !!a.immediateRender,
					u = a.ease;
				if (a.startAt) {
					this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), o = {};
					for (n in a.startAt) o[n] = a.startAt[n];
					if (o.data = "isStart", o.overwrite = !1, o.immediateRender = !0, o.lazy = c && !1 !== a.lazy, o.startAt = o.delay = null, o.onUpdate = a.onUpdate, o.onUpdateParams = a.onUpdateParams, o.onUpdateScope = a.onUpdateScope || a.callbackScope || this, this._startAt = M.to(this.target, 0, o), c)
						if (this._time > 0) this._startAt = null;
						else if (0 !== l) return
				}
				else if (a.runBackwards && 0 !== l)
					if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
					else {
						0 !== this._time && (c = !1), i = {};
						for (n in a) X[n] && "autoCSS" !== n || (i[n] = a[n]);
						if (i.overwrite = 0, i.data = "isFromStart", i.lazy = c && !1 !== a.lazy, i.immediateRender = c, this._startAt = M.to(this.target, 0, i), c) {
							if (0 === this._time) return
						}
						else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
					}
				if (this._ease = u = u ? u instanceof w ? u : "function" == typeof u ? new w(u, a.easeParams) : x[u] || M.defaultEase : M.defaultEase, a.easeParams instanceof Array && u.config && (this._ease = u.config.apply(u, a.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
					for (r = this._targets.length, e = 0; r > e; e++) this._initProps(this._targets[e], this._propLookup[e] = {}, this._siblings[e], s ? s[e] : null, e) && (t = !0);
				else t = this._initProps(this.target, this._propLookup, this._siblings, s, 0);
				if (t && M._onPluginEvent("_onInitAllProps", this), s && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), a.runBackwards)
					for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
				this._onUpdate = a.onUpdate, this._initted = !0
			}, s._initProps = function(t, i, n, o, r) {
				var a, s, l, c, u, h;
				if (null == t) return !1;
				I[t._gsTweenID] && Z(), this.vars.css || t.style && t !== e && t.nodeType && B.css && !1 !== this.vars.autoCSS && z(this.vars, t);
				for (a in this.vars)
					if (h = this.vars[a], X[a]) h && (h instanceof Array || h.push && m(h)) && -1 !== h.join("").indexOf("{self}") && (this.vars[a] = h = this._swapSelfInParams(h, this));
					else if (B[a] && (c = new B[a])._onInitTween(t, this.vars[a], this, r)) {
					for (this._firstPT = u = {
							_next: this._firstPT,
							t: c,
							p: "setRatio",
							s: 0,
							c: 1,
							f: 1,
							n: a,
							pg: 1,
							pr: c._priority,
							m: 0
						}, s = c._overwriteProps.length; --s > -1;) i[c._overwriteProps[s]] = this._firstPT;
					(c._priority || c._onInitAllProps) && (l = !0), (c._onDisable || c._onEnable) && (this._notifyPluginsOfEnabled = !0), u._next && (u._next._prev = u)
				}
				else i[a] = H.call(this, t, a, "get", h, a, 0, null, this.vars.stringFilter, r);
				return o && this._kill(o, t) ? this._initProps(t, i, n, o, r) : this._overwrite > 1 && this._firstPT && n.length > 1 && ee(t, this, i, this._overwrite, n) ? (this._kill(i, t), this._initProps(t, i, n, o, r)) : (this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration) && (I[t._gsTweenID] = !0), l)
			}, s.render = function(e, t, i) {
				var n, o, r, a, s = this._time,
					l = this._duration,
					c = this._rawPrevTime;
				if (e >= l - 1e-7 && e >= 0) this._totalTime = this._time = l, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (n = !0, o = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (e = 0), (0 > c || 0 >= e && e >= -1e-7 || c === d && "isPause" !== this.data) && c !== e && (i = !0, c > d && (o = "onReverseComplete")), this._rawPrevTime = a = !t || e || c === e ? e : d);
				else if (1e-7 > e) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== s || 0 === l && c > 0) && (o = "onReverseComplete", n = this._reversed), 0 > e && (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (c >= 0 && (c !== d || "isPause" !== this.data) && (i = !0), this._rawPrevTime = a = !t || e || c === e ? e : d)), (!this._initted || this._startAt && this._startAt.progress()) && (i = !0);
				else if (this._totalTime = this._time = e, this._easeType) {
					var u = e / l,
						h = this._easeType,
						p = this._easePower;
					(1 === h || 3 === h && u >= .5) && (u = 1 - u), 3 === h && (u *= 2), 1 === p ? u *= u : 2 === p ? u *= u * u : 3 === p ? u *= u * u * u : 4 === p && (u *= u * u * u * u), this.ratio = 1 === h ? 1 - u : 2 === h ? u : .5 > e / l ? u / 2 : 1 - u / 2
				}
				else this.ratio = this._ease.getRatio(e / l);
				if (this._time !== s || i) {
					if (!this._initted) {
						if (this._init(), !this._initted || this._gc) return;
						if (!i && this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = s, this._rawPrevTime = c, L.push(this), void(this._lazy = [e, t]);
						this._time && !n ? this.ratio = this._ease.getRatio(this._time / l) : n && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
					}
					for (!1 !== this._lazy && (this._lazy = !1), this._active || !this._paused && this._time !== s && e >= 0 && (this._active = !0), 0 === s && (this._startAt && (e >= 0 ? this._startAt.render(e, !0, i) : o || (o = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === l) && (t || this._callback("onStart"))), r = this._firstPT; r;) r.f ? r.t[r.p](r.c * this.ratio + r.s) : r.t[r.p] = r.c * this.ratio + r.s, r = r._next;
					this._onUpdate && (0 > e && this._startAt && -1e-4 !== e && this._startAt.render(e, !0, i), t || (this._time !== s || n || i) && this._callback("onUpdate")), o && (!this._gc || i) && (0 > e && this._startAt && !this._onUpdate && -1e-4 !== e && this._startAt.render(e, !0, i), n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !t && this.vars[o] && this._callback(o), 0 === l && this._rawPrevTime === d && a !== d && (this._rawPrevTime = 0))
				}
			}, s._kill = function(e, t, i) {
				if ("all" === e && (e = null), null == e && (null == t || t === this.target)) return this._lazy = !1, this._enabled(!1, !1);
				t = "string" != typeof t ? t || this._targets || this.target : M.selector(t) || t;
				var n, o, r, a, s, l, c, u, h, d = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline;
				if ((m(t) || D(t)) && "number" != typeof t[0])
					for (n = t.length; --n > -1;) this._kill(e, t[n], i) && (l = !0);
				else {
					if (this._targets) {
						for (n = this._targets.length; --n > -1;)
							if (t === this._targets[n]) {
								s = this._propLookup[n] || {}, this._overwrittenProps = this._overwrittenProps || [], o = this._overwrittenProps[n] = e ? this._overwrittenProps[n] || {} : "all";
								break
							}
					}
					else {
						if (t !== this.target) return !1;
						s = this._propLookup, o = this._overwrittenProps = e ? this._overwrittenProps || {} : "all"
					}
					if (s) {
						if (c = e || s, u = e !== o && "all" !== o && e !== s && ("object" != typeof e || !e._tempKill), i && (M.onOverwrite || this.vars.onOverwrite)) {
							for (r in c) s[r] && (h || (h = []), h.push(r));
							if ((h || !e) && !J(this, i, t, h)) return !1
						}
						for (r in c)(a = s[r]) && (d && (a.f ? a.t[a.p](a.s) : a.t[a.p] = a.s, l = !0), a.pg && a.t._kill(c) && (l = !0), a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next : a === this._firstPT && (this._firstPT = a._next), a._next && (a._next._prev = a._prev), a._next = a._prev = null), delete s[r]), u && (o[r] = 1);
						!this._firstPT && this._initted && this._enabled(!1, !1)
					}
				}
				return l
			}, s.invalidate = function() {
				return this._notifyPluginsOfEnabled && M._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], P.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -d, this.render(Math.min(0, -this._delay))), this
			}, s._enabled = function(e, t) {
				if (c || l.wake(), e && this._gc) {
					var i, n = this._targets;
					if (n)
						for (i = n.length; --i > -1;) this._siblings[i] = K(n[i], this, !0);
					else this._siblings = K(this.target, this, !0)
				}
				return P.prototype._enabled.call(this, e, t), !(!this._notifyPluginsOfEnabled || !this._firstPT) && M._onPluginEvent(e ? "_onEnable" : "_onDisable", this)
			}, M.to = function(e, t, i) {
				return new M(e, t, i)
			}, M.from = function(e, t, i) {
				return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new M(e, t, i)
			}, M.fromTo = function(e, t, i, n) {
				return n.startAt = i, n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender, new M(e, t, n)
			}, M.delayedCall = function(e, t, i, n, o) {
				return new M(t, 0, {
					delay: e,
					onComplete: t,
					onCompleteParams: i,
					callbackScope: n,
					onReverseComplete: t,
					onReverseCompleteParams: i,
					immediateRender: !1,
					lazy: !1,
					useFrames: o,
					overwrite: 0
				})
			}, M.set = function(e, t) {
				return new M(e, 0, t)
			}, M.getTweensOf = function(e, t) {
				if (null == e) return [];
				e = "string" != typeof e ? e : M.selector(e) || e;
				var i, n, o, r;
				if ((m(e) || D(e)) && "number" != typeof e[0]) {
					for (i = e.length, n = []; --i > -1;) n = n.concat(M.getTweensOf(e[i], t));
					for (i = n.length; --i > -1;)
						for (r = n[i], o = i; --o > -1;) r === n[o] && n.splice(i, 1)
				}
				else if (e._gsTweenID)
					for (n = K(e).concat(), i = n.length; --i > -1;)(n[i]._gc || t && !n[i].isActive()) && n.splice(i, 1);
				return n || []
			}, M.killTweensOf = M.killDelayedCallsTo = function(e, t, i) {
				"object" == typeof t && (i = t, t = !1);
				for (var n = M.getTweensOf(e, t), o = n.length; --o > -1;) n[o]._kill(i, e)
			};
			var ie = _("plugins.TweenPlugin", function(e, t) {
				this._overwriteProps = (e || "").split(","), this._propName = this._overwriteProps[0], this._priority = t || 0, this._super = ie.prototype
			}, !0);
			if (s = ie.prototype, ie.version = "1.19.0", ie.API = 2, s._firstPT = null, s._addTween = H, s.setRatio = R, s._kill = function(e) {
					var t, i = this._overwriteProps,
						n = this._firstPT;
					if (null != e[this._propName]) this._overwriteProps = [];
					else
						for (t = i.length; --t > -1;) null != e[i[t]] && i.splice(t, 1);
					for (; n;) null != e[n.n] && (n._next && (n._next._prev = n._prev), n._prev ? (n._prev._next = n._next, n._prev = null) : this._firstPT === n && (this._firstPT = n._next)), n = n._next;
					return !1
				}, s._mod = s._roundProps = function(e) {
					for (var t, i = this._firstPT; i;)(t = e[this._propName] || null != i.n && e[i.n.split(this._propName + "_").join("")]) && "function" == typeof t && (2 === i.f ? i.t._applyPT.m = t : i.m = t), i = i._next
				}, M._onPluginEvent = function(e, t) {
					var i, n, o, r, a, s = t._firstPT;
					if ("_onInitAllProps" === e) {
						for (; s;) {
							for (a = s._next, n = o; n && n.pr > s.pr;) n = n._next;
							(s._prev = n ? n._prev : r) ? s._prev._next = s: o = s, (s._next = n) ? n._prev = s : r = s, s = a
						}
						s = t._firstPT = o
					}
					for (; s;) s.pg && "function" == typeof s.t[e] && s.t[e]() && (i = !0), s = s._next;
					return i
				}, ie.activate = function(e) {
					for (var t = e.length; --t > -1;) e[t].API === ie.API && (B[(new e[t])._propName] = e[t]);
					return !0
				}, y.plugin = function(e) {
					if (!(e && e.propName && e.init && e.API)) throw "illegal plugin definition.";
					var t, i = e.propName,
						n = e.priority || 0,
						o = e.overwriteProps,
						r = {
							init: "_onInitTween",
							set: "setRatio",
							kill: "_kill",
							round: "_mod",
							mod: "_mod",
							initAll: "_onInitAllProps"
						},
						a = _("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
							ie.call(this, i, n), this._overwriteProps = o || []
						}, !0 === e.global),
						s = a.prototype = new ie(i);
					s.constructor = a, a.API = e.API;
					for (t in r) "function" == typeof e[t] && (s[r[t]] = e[t]);
					return a.version = e.version, ie.activate([a]), a
				}, r = e._gsQueue) {
				for (a = 0; a < r.length; a++) r[a]();
				for (s in g) g[s].func || e.console.log("GSAP encountered missing dependency: " + s)
			}
			c = !1
		}
	}("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenMax");
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
		"use strict";
		var e = (_gsScope.document || {}).documentElement,
			t = _gsScope,
			i = function(i, n) {
				var o = "x" === n ? "Width" : "Height",
					r = "scroll" + o,
					a = "client" + o,
					s = document.body;
				return i === t || i === e || i === s ? Math.max(e[r], s[r]) - (t["inner" + o] || e[a] || s[a]) : i[r] - i["offset" + o]
			},
			n = function(e) {
				return "string" == typeof e && (e = TweenLite.selector(e)), e.length && e !== t && e[0] && e[0].style && !e.nodeType && (e = e[0]), e === t || e.nodeType && e.style ? e : null
			},
			o = function(i, n) {
				var o = "scroll" + ("x" === n ? "Left" : "Top");
				return i === t && (null != i.pageXOffset ? o = "page" + n.toUpperCase() + "Offset" : i = null != e[o] ? e : document.body),
					function() {
						return i[o]
					}
			},
			r = function(i, r) {
				var a = n(i).getBoundingClientRect(),
					s = !r || r === t || r === document.body,
					l = (s ? e : r).getBoundingClientRect(),
					c = {
						x: a.left - l.left,
						y: a.top - l.top
					};
				return !s && r && (c.x += o(r, "x")(), c.y += o(r, "y")()), c
			},
			a = function(e, t, n) {
				var o = typeof e;
				return isNaN(e) ? "number" === o || "string" === o && "=" === e.charAt(1) ? e : "max" === e ? i(t, n) : Math.min(i(t, n), r(e, t)[n]) : parseFloat(e)
			},
			s = _gsScope._gsDefine.plugin({
				propName: "scrollTo",
				API: 2,
				global: !0,
				version: "1.9.0",
				init: function(e, i, n) {
					return this._wdw = e === t, this._target = e, this._tween = n, "object" != typeof i ? "string" == typeof(i = {
						y: i
					}).y && "max" !== i.y && "=" !== i.y.charAt(1) && (i.x = i.y) : i.nodeType && (i = {
						y: i,
						x: i
					}), this.vars = i, this._autoKill = !1 !== i.autoKill, this.getX = o(e, "x"), this.getY = o(e, "y"), this.x = this.xPrev = this.getX(), this.y = this.yPrev = this.getY(), null != i.x ? (this._addTween(this, "x", this.x, a(i.x, e, "x") - (i.offsetX || 0), "scrollTo_x", !0), this._overwriteProps.push("scrollTo_x")) : this.skipX = !0, null != i.y ? (this._addTween(this, "y", this.y, a(i.y, e, "y") - (i.offsetY || 0), "scrollTo_y", !0), this._overwriteProps.push("scrollTo_y")) : this.skipY = !0, !0
				},
				set: function(e) {
					this._super.setRatio.call(this, e);
					var n = this._wdw || !this.skipX ? this.getX() : this.xPrev,
						o = this._wdw || !this.skipY ? this.getY() : this.yPrev,
						r = o - this.yPrev,
						a = n - this.xPrev,
						l = s.autoKillThreshold;
					this.x < 0 && (this.x = 0), this.y < 0 && (this.y = 0), this._autoKill && (!this.skipX && (a > l || -l > a) && n < i(this._target, "x") && (this.skipX = !0), !this.skipY && (r > l || -l > r) && o < i(this._target, "y") && (this.skipY = !0), this.skipX && this.skipY && (this._tween.kill(), this.vars.onAutoKill && this.vars.onAutoKill.apply(this.vars.onAutoKillScope || this._tween, this.vars.onAutoKillParams || []))), this._wdw ? t.scrollTo(this.skipX ? n : this.x, this.skipY ? o : this.y) : (this.skipY || (this._target.scrollTop = this.y), this.skipX || (this._target.scrollLeft = this.x)), this.xPrev = this.x, this.yPrev = this.y
				}
			}),
			l = s.prototype;
		s.max = i, s.getOffset = r, s.buildGetter = o, s.autoKillThreshold = 7, l._kill = function(e) {
			return e.scrollTo_x && (this.skipX = !0), e.scrollTo_y && (this.skipY = !0), this._super._kill.call(this, e)
		}
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function(e) {
		"use strict";
		var t = function() {
			return (_gsScope.GreenSockGlobals || _gsScope).ScrollToPlugin
		};
		"undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = t()) : "function" == typeof define && define.amd && define(["TweenLite"], t)
	}(),
	function(e) {
		"use strict";
		var t = e.GreenSockGlobals || e,
			i = function(e) {
				var i, n = "com.greensock.utils".split("."),
					o = t;
				for (i = 0; n.length > i; i++) o[n[i]] = o = o[n[i]] || {};
				return o
			}(),
			n = function(e) {
				var t = e.nodeType,
					i = "";
				if (1 === t || 9 === t || 11 === t) {
					if ("string" == typeof e.textContent) return e.textContent;
					for (e = e.firstChild; e; e = e.nextSibling) i += n(e)
				}
				else if (3 === t || 4 === t) return e.nodeValue;
				return i
			},
			o = document,
			r = o.defaultView ? o.defaultView.getComputedStyle : function() {},
			a = /([A-Z])/g,
			s = function(e, t, i, n) {
				var o;
				return (i = i || r(e, null)) ? (e = i.getPropertyValue(t.replace(a, "-$1").toLowerCase()), o = e || i.length ? e : i[t]) : e.currentStyle && (i = e.currentStyle, o = i[t]), n ? o : parseInt(o, 10) || 0
			},
			l = function(e) {
				return !!(e.length && e[0] && (e[0].nodeType && e[0].style && !e.nodeType || e[0].length && e[0][0]))
			},
			c = function(e) {
				var t, i, n, o = [],
					r = e.length;
				for (t = 0; r > t; t++)
					if (i = e[t], l(i))
						for (n = i.length, n = 0; i.length > n; n++) o.push(i[n]);
					else o.push(i);
				return o
			},
			u = ")eefec303079ad17405c",
			h = /(?:<br>|<br\/>|<br \/>)/gi,
			d = "<div style='position:relative;display:inline-block;" + (o.all && !o.addEventListener ? "*display:inline;*zoom:1;'" : "'"),
			p = function(e) {
				var t = -1 !== (e = e || "").indexOf("++"),
					i = 1;
				return t && (e = e.split("++").join("")),
					function() {
						return d + (e ? " class='" + e + (t ? i++ : "") + "'>" : ">")
					}
			},
			f = i.SplitText = t.SplitText = function(e, t) {
				if ("string" == typeof e && (e = f.selector(e)), !e) throw "cannot split a null element.";
				this.elements = l(e) ? c(e) : [e], this.chars = [], this.words = [], this.lines = [], this._originals = [], this.vars = t || {}, this.split(t)
			},
			m = function(e, t, i, a, l) {
				h.test(e.innerHTML) && (e.innerHTML = e.innerHTML.replace(h, u));
				var c, d, f, m, g, v, y, _, b, w, x, T, k, C = n(e),
					S = t.type || t.split || "chars,words,lines",
					A = -1 !== S.indexOf("lines") ? [] : null,
					E = -1 !== S.indexOf("words"),
					P = -1 !== S.indexOf("chars"),
					O = "absolute" === t.position || !0 === t.absolute,
					$ = O ? "&#173; " : " ",
					M = -999,
					D = r(e),
					z = s(e, "paddingLeft", D),
					L = s(e, "borderBottomWidth", D) + s(e, "borderTopWidth", D),
					I = s(e, "borderLeftWidth", D) + s(e, "borderRightWidth", D),
					F = s(e, "paddingTop", D) + s(e, "paddingBottom", D),
					j = s(e, "paddingLeft", D) + s(e, "paddingRight", D),
					R = s(e, "textAlign", D, !0),
					N = e.clientHeight,
					H = e.clientWidth,
					q = C.length,
					B = "</div>",
					W = p(t.wordsClass),
					U = p(t.charsClass),
					X = -1 !== (t.linesClass || "").indexOf("++"),
					Y = t.linesClass;
				for (X && (Y = Y.split("++").join("")), f = W(), m = 0; q > m; m++) ")" === (v = C.charAt(m)) && C.substr(m, 20) === u ? (f += B + "<BR/>", m !== q - 1 && (f += " " + W()), m += 19) : " " === v && " " !== C.charAt(m - 1) && m !== q - 1 ? (f += B, m !== q - 1 && (f += $ + W())) : f += P && " " !== v ? U() + v + "</div>" : v;
				for (e.innerHTML = f + B, q = (g = e.getElementsByTagName("*")).length, y = [], m = 0; q > m; m++) y[m] = g[m];
				if (A || O)
					for (m = 0; q > m; m++) _ = y[m], ((d = _.parentNode === e) || O || P && !E) && (b = _.offsetTop, A && d && b !== M && "BR" !== _.nodeName && (c = [], A.push(c), M = b), O && (_._x = _.offsetLeft, _._y = b, _._w = _.offsetWidth, _._h = _.offsetHeight), A && (E !== d && P || (c.push(_), _._x -= z), d && m && (y[m - 1]._wordEnd = !0)));
				for (m = 0; q > m; m++) _ = y[m], d = _.parentNode === e, "BR" !== _.nodeName ? (O && (x = _.style, E || d || (_._x += _.parentNode._x, _._y += _.parentNode._y), x.left = _._x + "px", x.top = _._y + "px", x.position = "absolute", x.display = "block", x.width = _._w + 1 + "px", x.height = _._h + "px"), E ? d ? a.push(_) : P && i.push(_) : d ? (e.removeChild(_), y.splice(m--, 1), q--) : !d && P && (b = !A && !O && _.nextSibling, e.appendChild(_), b || e.appendChild(o.createTextNode(" ")), i.push(_))) : A || O ? (e.removeChild(_), y.splice(m--, 1), q--) : E || e.appendChild(_);
				if (A) {
					for (O && (w = o.createElement("div"), e.appendChild(w), T = w.offsetWidth + "px", b = w.offsetParent === e ? 0 : e.offsetLeft, e.removeChild(w)), x = e.style.cssText, e.style.cssText = "display:none;"; e.firstChild;) e.removeChild(e.firstChild);
					for (k = !O || !E && !P, m = 0; A.length > m; m++) {
						for (c = A[m], (w = o.createElement("div")).style.cssText = "display:block;text-align:" + R + ";position:" + (O ? "absolute;" : "relative;"), Y && (w.className = Y + (X ? m + 1 : "")), l.push(w), q = c.length, g = 0; q > g; g++) "BR" !== c[g].nodeName && (_ = c[g], w.appendChild(_), k && (_._wordEnd || E) && w.appendChild(o.createTextNode(" ")), O && (0 === g && (w.style.top = _._y + "px", w.style.left = z + b + "px"), _.style.top = "0px", b && (_.style.left = _._x - b + "px")));
						E || P || (w.innerHTML = n(w).split(String.fromCharCode(160)).join(" ")), O && (w.style.width = T, w.style.height = _._h + "px"), e.appendChild(w)
					}
					e.style.cssText = x
				}
				O && (N > e.clientHeight && (e.style.height = N - F + "px", N > e.clientHeight && (e.style.height = N + L + "px")), H > e.clientWidth && (e.style.width = H - j + "px", H > e.clientWidth && (e.style.width = H + I + "px")))
			},
			g = f.prototype;
		g.split = function(e) {
			this.isSplit && this.revert(), this.vars = e || this.vars, this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
			for (var t = 0; this.elements.length > t; t++) this._originals[t] = this.elements[t].innerHTML, m(this.elements[t], this.vars, this.chars, this.words, this.lines);
			return this.isSplit = !0, this
		}, g.revert = function() {
			if (!this._originals) throw "revert() call wasn't scoped properly.";
			for (var e = this._originals.length; --e > -1;) this.elements[e].innerHTML = this._originals[e];
			return this.chars = [], this.words = [], this.lines = [], this.isSplit = !1, this
		}, f.selector = e.$ || e.jQuery || function(t) {
			return e.$ ? (f.selector = e.$, e.$(t)) : o ? o.getElementById("#" === t.charAt(0) ? t.substr(1) : t) : t
		}
	}(window || {}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("jquery")) : e.jQueryBridget = t(e, e.jQuery)
	}(window, function(e, t) {
		"use strict";

		function i(i, a, s) {
			function l(e, t, n) {
				var o, a = "$()." + i + '("' + t + '")';
				return e.each(function(e, l) {
					var c = s.data(l, i);
					if (c) {
						var u = c[t];
						if (u && "_" != t.charAt(0)) {
							var h = u.apply(c, n);
							o = void 0 === o ? h : o
						}
						else r(a + " is not a valid method")
					}
					else r(i + " not initialized. Cannot call methods, i.e. " + a)
				}), void 0 !== o ? o : e
			}

			function c(e, t) {
				e.each(function(e, n) {
					var o = s.data(n, i);
					o ? (o.option(t), o._init()) : (o = new a(n, t), s.data(n, i, o))
				})
			}(s = s || t || e.jQuery) && (a.prototype.option || (a.prototype.option = function(e) {
				s.isPlainObject(e) && (this.options = s.extend(!0, this.options, e))
			}), s.fn[i] = function(e) {
				return "string" == typeof e ? l(this, e, o.call(arguments, 1)) : (c(this, e), this)
			}, n(s))
		}

		function n(e) {
			!e || e && e.bridget || (e.bridget = i)
		}
		var o = Array.prototype.slice,
			r = void 0 === e.console ? function() {} : function(e) {};
		return n(t || e.jQuery), i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t()
	}("undefined" != typeof window ? window : this, function() {
		function e() {}
		var t = e.prototype;
		return t.on = function(e, t) {
			if (e && t) {
				var i = this._events = this._events || {},
					n = i[e] = i[e] || [];
				return -1 == n.indexOf(t) && n.push(t), this
			}
		}, t.once = function(e, t) {
			if (e && t) {
				this.on(e, t);
				var i = this._onceEvents = this._onceEvents || {};
				return (i[e] = i[e] || {})[t] = !0, this
			}
		}, t.off = function(e, t) {
			var i = this._events && this._events[e];
			if (i && i.length) {
				var n = i.indexOf(t);
				return -1 != n && i.splice(n, 1), this
			}
		}, t.emitEvent = function(e, t) {
			var i = this._events && this._events[e];
			if (i && i.length) {
				i = i.slice(0), t = t || [];
				for (var n = this._onceEvents && this._onceEvents[e], o = 0; o < i.length; o++) {
					var r = i[o];
					n && n[r] && (this.off(e, r), delete n[r]), r.apply(this, t)
				}
				return this
			}
		}, t.allOff = function() {
			delete this._events, delete this._onceEvents
		}, e
	}),
	function(e, t) {
		"use strict";
		"function" == typeof define && define.amd ? define("get-size/get-size", [], function() {
			return t()
		}) : "object" == typeof module && module.exports ? module.exports = t() : e.getSize = t()
	}(window, function() {
		"use strict";

		function e(e) {
			var t = parseFloat(e);
			return -1 == e.indexOf("%") && !isNaN(t) && t
		}

		function t() {
			for (var e = {
					width: 0,
					height: 0,
					innerWidth: 0,
					innerHeight: 0,
					outerWidth: 0,
					outerHeight: 0
				}, t = 0; t < l; t++) e[s[t]] = 0;
			return e
		}

		function i(e) {
			var t = getComputedStyle(e);
			return t || a("Style returned " + t + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), t
		}

		function n() {
			if (!c) {
				c = !0;
				var t = document.createElement("div");
				t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style.boxSizing = "border-box";
				var n = document.body || document.documentElement;
				n.appendChild(t);
				var a = i(t);
				o.isBoxSizeOuter = r = 200 == e(a.width), n.removeChild(t)
			}
		}

		function o(o) {
			if (n(), "string" == typeof o && (o = document.querySelector(o)), o && "object" == typeof o && o.nodeType) {
				var a = i(o);
				if ("none" == a.display) return t();
				var c = {};
				c.width = o.offsetWidth, c.height = o.offsetHeight;
				for (var u = c.isBorderBox = "border-box" == a.boxSizing, h = 0; h < l; h++) {
					var d = s[h],
						p = a[d],
						f = parseFloat(p);
					c[d] = isNaN(f) ? 0 : f
				}
				var m = c.paddingLeft + c.paddingRight,
					g = c.paddingTop + c.paddingBottom,
					v = c.marginLeft + c.marginRight,
					y = c.marginTop + c.marginBottom,
					_ = c.borderLeftWidth + c.borderRightWidth,
					b = c.borderTopWidth + c.borderBottomWidth,
					w = u && r,
					x = e(a.width);
				!1 !== x && (c.width = x + (w ? 0 : m + _));
				var T = e(a.height);
				return !1 !== T && (c.height = T + (w ? 0 : g + b)), c.innerWidth = c.width - (m + _), c.innerHeight = c.height - (g + b), c.outerWidth = c.width + v, c.outerHeight = c.height + y, c
			}
		}
		var r, a = "undefined" == typeof console ? function() {} : function(e) {},
			s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
			l = s.length,
			c = !1;
		return o
	}),
	function(e, t) {
		"use strict";
		"function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", t) : "object" == typeof module && module.exports ? module.exports = t() : e.matchesSelector = t()
	}(window, function() {
		"use strict";
		var e = function() {
			var e = window.Element.prototype;
			if (e.matches) return "matches";
			if (e.matchesSelector) return "matchesSelector";
			for (var t = ["webkit", "moz", "ms", "o"], i = 0; i < t.length; i++) {
				var n = t[i] + "MatchesSelector";
				if (e[n]) return n
			}
		}();
		return function(t, i) {
			return t[e](i)
		}
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("desandro-matches-selector")) : e.fizzyUIUtils = t(e, e.matchesSelector)
	}(window, function(e, t) {
		var i = {};
		i.extend = function(e, t) {
			for (var i in t) e[i] = t[i];
			return e
		}, i.modulo = function(e, t) {
			return (e % t + t) % t
		};
		var n = Array.prototype.slice;
		return i.makeArray = function(e) {
			return Array.isArray(e) ? e : null === e || void 0 === e ? [] : "object" == typeof e && "number" == typeof e.length ? n.call(e) : [e]
		}, i.removeFrom = function(e, t) {
			var i = e.indexOf(t); - 1 != i && e.splice(i, 1)
		}, i.getParent = function(e, i) {
			for (; e.parentNode && e != document.body;)
				if (e = e.parentNode, t(e, i)) return e
		}, i.getQueryElement = function(e) {
			return "string" == typeof e ? document.querySelector(e) : e
		}, i.handleEvent = function(e) {
			var t = "on" + e.type;
			this[t] && this[t](e)
		}, i.filterFindElements = function(e, n) {
			var o = [];
			return (e = i.makeArray(e)).forEach(function(e) {
				if (e instanceof HTMLElement)
					if (n) {
						t(e, n) && o.push(e);
						for (var i = e.querySelectorAll(n), r = 0; r < i.length; r++) o.push(i[r])
					}
				else o.push(e)
			}), o
		}, i.debounceMethod = function(e, t, i) {
			i = i || 100;
			var n = e.prototype[t],
				o = t + "Timeout";
			e.prototype[t] = function() {
				var e = this[o];
				clearTimeout(e);
				var t = arguments,
					r = this;
				this[o] = setTimeout(function() {
					n.apply(r, t), delete r[o]
				}, i)
			}
		}, i.docReady = function(e) {
			var t = document.readyState;
			"complete" == t || "interactive" == t ? setTimeout(e) : document.addEventListener("DOMContentLoaded", e)
		}, i.toDashed = function(e) {
			return e.replace(/(.)([A-Z])/g, function(e, t, i) {
				return t + "-" + i
			}).toLowerCase()
		}, e.console, i.htmlInit = function(t, n) {
			i.docReady(function() {
				var o = i.toDashed(n),
					r = "data-" + o,
					a = document.querySelectorAll("[" + r + "]"),
					s = document.querySelectorAll(".js-" + o),
					l = i.makeArray(a).concat(i.makeArray(s)),
					c = r + "-options",
					u = e.jQuery;
				l.forEach(function(e) {
					var i, o = e.getAttribute(r) || e.getAttribute(c);
					try {
						i = o && JSON.parse(o)
					}
					catch (e) {
						return
					}
					var a = new t(e, i);
					u && u.data(e, n, a)
				})
			})
		}, i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/cell", ["get-size/get-size"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("get-size")) : (e.Flickity = e.Flickity || {}, e.Flickity.Cell = t(e, e.getSize))
	}(window, function(e, t) {
		function i(e, t) {
			this.element = e, this.parent = t, this.create()
		}
		var n = i.prototype;
		return n.create = function() {
			this.element.style.position = "absolute", this.element.setAttribute("aria-selected", "false"), this.x = 0, this.shift = 0
		}, n.destroy = function() {
			this.element.style.position = "";
			var e = this.parent.originSide;
			this.element.removeAttribute("aria-selected"), this.element.style[e] = ""
		}, n.getSize = function() {
			this.size = t(this.element)
		}, n.setPosition = function(e) {
			this.x = e, this.updateTarget(), this.renderPosition(e)
		}, n.updateTarget = n.setDefaultTarget = function() {
			var e = "left" == this.parent.originSide ? "marginLeft" : "marginRight";
			this.target = this.x + this.size[e] + this.size.width * this.parent.cellAlign
		}, n.renderPosition = function(e) {
			var t = this.parent.originSide;
			this.element.style[t] = this.parent.getPositionValue(e)
		}, n.wrapShift = function(e) {
			this.shift = e, this.renderPosition(this.x + this.parent.slideableWidth * e)
		}, n.remove = function() {
			this.element.parentNode.removeChild(this.element)
		}, i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/slide", t) : "object" == typeof module && module.exports ? module.exports = t() : (e.Flickity = e.Flickity || {}, e.Flickity.Slide = t())
	}(window, function() {
		"use strict";

		function e(e) {
			this.parent = e, this.isOriginLeft = "left" == e.originSide, this.cells = [], this.outerWidth = 0, this.height = 0
		}
		var t = e.prototype;
		return t.addCell = function(e) {
			if (this.cells.push(e), this.outerWidth += e.size.outerWidth, this.height = Math.max(e.size.outerHeight, this.height), 1 == this.cells.length) {
				this.x = e.x;
				var t = this.isOriginLeft ? "marginLeft" : "marginRight";
				this.firstMargin = e.size[t]
			}
		}, t.updateTarget = function() {
			var e = this.isOriginLeft ? "marginRight" : "marginLeft",
				t = this.getLastCell(),
				i = t ? t.size[e] : 0,
				n = this.outerWidth - (this.firstMargin + i);
			this.target = this.x + this.firstMargin + n * this.parent.cellAlign
		}, t.getLastCell = function() {
			return this.cells[this.cells.length - 1]
		}, t.select = function() {
			this.changeSelected(!0)
		}, t.unselect = function() {
			this.changeSelected(!1)
		}, t.changeSelected = function(e) {
			var t = e ? "add" : "remove";
			this.cells.forEach(function(i) {
				i.element.classList[t]("is-selected"), i.element.setAttribute("aria-selected", e.toString())
			})
		}, t.getCellElements = function() {
			return this.cells.map(function(e) {
				return e.element
			})
		}, e
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/animate", ["fizzy-ui-utils/utils"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("fizzy-ui-utils")) : (e.Flickity = e.Flickity || {}, e.Flickity.animatePrototype = t(e, e.fizzyUIUtils))
	}(window, function(e, t) {
		var i = {};
		return i.startAnimation = function() {
			this.isAnimating || (this.isAnimating = !0, this.restingFrames = 0, this.animate())
		}, i.animate = function() {
			this.applyDragForce(), this.applySelectedAttraction();
			var e = this.x;
			if (this.integratePhysics(), this.positionSlider(), this.settle(e), this.isAnimating) {
				var t = this;
				requestAnimationFrame(function() {
					t.animate()
				})
			}
		}, i.positionSlider = function() {
			var e = this.x;
			this.options.wrapAround && this.cells.length > 1 && (e = t.modulo(e, this.slideableWidth), e -= this.slideableWidth, this.shiftWrapCells(e)), e += this.cursorPosition, e = this.options.rightToLeft ? -e : e;
			var i = this.getPositionValue(e);
			this.slider.style.transform = this.isAnimating ? "translate3d(" + i + ",0,0)" : "translateX(" + i + ")";
			var n = this.slides[0];
			if (n) {
				var o = -this.x - n.target,
					r = o / this.slidesWidth;
				this.dispatchEvent("scroll", null, [r, o])
			}
		}, i.positionSliderAtSelected = function() {
			this.cells.length && (this.x = -this.selectedSlide.target, this.velocity = 0, this.positionSlider())
		}, i.getPositionValue = function(e) {
			return this.options.percentPosition ? .01 * Math.round(e / this.size.innerWidth * 1e4) + "%" : Math.round(e) + "px"
		}, i.settle = function(e) {
			this.isPointerDown || Math.round(100 * this.x) != Math.round(100 * e) || this.restingFrames++, this.restingFrames > 2 && (this.isAnimating = !1, delete this.isFreeScrolling, this.positionSlider(), this.dispatchEvent("settle", null, [this.selectedIndex]))
		}, i.shiftWrapCells = function(e) {
			var t = this.cursorPosition + e;
			this._shiftCells(this.beforeShiftCells, t, -1);
			var i = this.size.innerWidth - (e + this.slideableWidth + this.cursorPosition);
			this._shiftCells(this.afterShiftCells, i, 1)
		}, i._shiftCells = function(e, t, i) {
			for (var n = 0; n < e.length; n++) {
				var o = e[n],
					r = t > 0 ? i : 0;
				o.wrapShift(r), t -= o.size.outerWidth
			}
		}, i._unshiftCells = function(e) {
			if (e && e.length)
				for (var t = 0; t < e.length; t++) e[t].wrapShift(0)
		}, i.integratePhysics = function() {
			this.x += this.velocity, this.velocity *= this.getFrictionFactor()
		}, i.applyForce = function(e) {
			this.velocity += e
		}, i.getFrictionFactor = function() {
			return 1 - this.options[this.isFreeScrolling ? "freeScrollFriction" : "friction"]
		}, i.getRestingPosition = function() {
			return this.x + this.velocity / (1 - this.getFrictionFactor())
		}, i.applyDragForce = function() {
			if (this.isDraggable && this.isPointerDown) {
				var e = this.dragX - this.x - this.velocity;
				this.applyForce(e)
			}
		}, i.applySelectedAttraction = function() {
			if ((!this.isDraggable || !this.isPointerDown) && !this.isFreeScrolling && this.slides.length) {
				var e = (-1 * this.selectedSlide.target - this.x) * this.options.selectedAttraction;
				this.applyForce(e)
			}
		}, i
	}),
	function(e, t) {
		if ("function" == typeof define && define.amd) define("flickity/js/flickity", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./cell", "./slide", "./animate"], function(i, n, o, r, a, s) {
			return t(e, i, n, o, r, a, s)
		});
		else if ("object" == typeof module && module.exports) module.exports = t(e, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./cell"), require("./slide"), require("./animate"));
		else {
			var i = e.Flickity;
			e.Flickity = t(e, e.EvEmitter, e.getSize, e.fizzyUIUtils, i.Cell, i.Slide, i.animatePrototype)
		}
	}(window, function(e, t, i, n, o, r, a) {
		function s(e, t) {
			for (e = n.makeArray(e); e.length;) t.appendChild(e.shift())
		}

		function l(e, t) {
			var i = n.getQueryElement(e);
			if (i) {
				if (this.element = i, this.element.flickityGUID) {
					var o = d[this.element.flickityGUID];
					return o.option(t), o
				}
				c && (this.$element = c(this.element)), this.options = n.extend({}, this.constructor.defaults), this.option(t), this._create()
			}
		}
		var c = e.jQuery,
			u = e.getComputedStyle,
			h = (e.console, 0),
			d = {};
		l.defaults = {
			accessibility: !0,
			cellAlign: "center",
			freeScrollFriction: .075,
			friction: .28,
			namespaceJQueryEvents: !0,
			percentPosition: !0,
			resize: !0,
			selectedAttraction: .025,
			setGallerySize: !0
		}, l.createMethods = [];
		var p = l.prototype;
		n.extend(p, t.prototype), p._create = function() {
			var t = this.guid = ++h;
			this.element.flickityGUID = t, d[t] = this, this.selectedIndex = 0, this.restingFrames = 0, this.x = 0, this.velocity = 0, this.originSide = this.options.rightToLeft ? "right" : "left", this.viewport = document.createElement("div"), this.viewport.className = "flickity-viewport", this._createSlider(), (this.options.resize || this.options.watchCSS) && e.addEventListener("resize", this);
			for (var i in this.options.on) {
				var n = this.options.on[i];
				this.on(i, n)
			}
			l.createMethods.forEach(function(e) {
				this[e]()
			}, this), this.options.watchCSS ? this.watchCSS() : this.activate()
		}, p.option = function(e) {
			n.extend(this.options, e)
		}, p.activate = function() {
			if (!this.isActive) {
				this.isActive = !0, this.element.classList.add("flickity-enabled"), this.options.rightToLeft && this.element.classList.add("flickity-rtl"), this.getSize(), s(this._filterFindCellElements(this.element.children), this.slider), this.viewport.appendChild(this.slider), this.element.appendChild(this.viewport), this.reloadCells(), this.options.accessibility && (this.element.tabIndex = 0, this.element.addEventListener("keydown", this)), this.emitEvent("activate");
				var e, t = this.options.initialIndex;
				e = this.isInitActivated ? this.selectedIndex : void 0 !== t && this.cells[t] ? t : 0, this.select(e, !1, !0), this.isInitActivated = !0, this.dispatchEvent("ready")
			}
		}, p._createSlider = function() {
			var e = document.createElement("div");
			e.className = "flickity-slider", e.style[this.originSide] = 0, this.slider = e
		}, p._filterFindCellElements = function(e) {
			return n.filterFindElements(e, this.options.cellSelector)
		}, p.reloadCells = function() {
			this.cells = this._makeCells(this.slider.children), this.positionCells(), this._getWrapShiftCells(), this.setGallerySize()
		}, p._makeCells = function(e) {
			return this._filterFindCellElements(e).map(function(e) {
				return new o(e, this)
			}, this)
		}, p.getLastCell = function() {
			return this.cells[this.cells.length - 1]
		}, p.getLastSlide = function() {
			return this.slides[this.slides.length - 1]
		}, p.positionCells = function() {
			this._sizeCells(this.cells), this._positionCells(0)
		}, p._positionCells = function(e) {
			e = e || 0, this.maxCellHeight = e ? this.maxCellHeight || 0 : 0;
			var t = 0;
			if (e > 0) {
				var i = this.cells[e - 1];
				t = i.x + i.size.outerWidth
			}
			for (var n = this.cells.length, o = e; o < n; o++) {
				var r = this.cells[o];
				r.setPosition(t), t += r.size.outerWidth, this.maxCellHeight = Math.max(r.size.outerHeight, this.maxCellHeight)
			}
			this.slideableWidth = t, this.updateSlides(), this._containSlides(), this.slidesWidth = n ? this.getLastSlide().target - this.slides[0].target : 0
		}, p._sizeCells = function(e) {
			e.forEach(function(e) {
				e.getSize()
			})
		}, p.updateSlides = function() {
			if (this.slides = [], this.cells.length) {
				var e = new r(this);
				this.slides.push(e);
				var t = "left" == this.originSide ? "marginRight" : "marginLeft",
					i = this._getCanCellFit();
				this.cells.forEach(function(n, o) {
					if (e.cells.length) {
						var a = e.outerWidth - e.firstMargin + (n.size.outerWidth - n.size[t]);
						i.call(this, o, a) ? e.addCell(n) : (e.updateTarget(), e = new r(this), this.slides.push(e), e.addCell(n))
					}
					else e.addCell(n)
				}, this), e.updateTarget(), this.updateSelectedSlide()
			}
		}, p._getCanCellFit = function() {
			var e = this.options.groupCells;
			if (!e) return function() {
				return !1
			};
			if ("number" == typeof e) {
				var t = parseInt(e, 10);
				return function(e) {
					return e % t != 0
				}
			}
			var i = "string" == typeof e && e.match(/^(\d+)%$/),
				n = i ? parseInt(i[1], 10) / 100 : 1;
			return function(e, t) {
				return t <= (this.size.innerWidth + 1) * n
			}
		}, p._init = p.reposition = function() {
			this.positionCells(), this.positionSliderAtSelected()
		}, p.getSize = function() {
			this.size = i(this.element), this.setCellAlign(), this.cursorPosition = this.size.innerWidth * this.cellAlign
		};
		var f = {
			center: {
				left: .5,
				right: .5
			},
			left: {
				left: 0,
				right: 1
			},
			right: {
				right: 0,
				left: 1
			}
		};
		return p.setCellAlign = function() {
			var e = f[this.options.cellAlign];
			this.cellAlign = e ? e[this.originSide] : this.options.cellAlign
		}, p.setGallerySize = function() {
			if (this.options.setGallerySize) {
				var e = this.options.adaptiveHeight && this.selectedSlide ? this.selectedSlide.height : this.maxCellHeight;
				this.viewport.style.height = e + "px"
			}
		}, p._getWrapShiftCells = function() {
			if (this.options.wrapAround) {
				this._unshiftCells(this.beforeShiftCells), this._unshiftCells(this.afterShiftCells);
				var e = this.cursorPosition,
					t = this.cells.length - 1;
				this.beforeShiftCells = this._getGapCells(e, t, -1), e = this.size.innerWidth - this.cursorPosition, this.afterShiftCells = this._getGapCells(e, 0, 1)
			}
		}, p._getGapCells = function(e, t, i) {
			for (var n = []; e > 0;) {
				var o = this.cells[t];
				if (!o) break;
				n.push(o), t += i, e -= o.size.outerWidth
			}
			return n
		}, p._containSlides = function() {
			if (this.options.contain && !this.options.wrapAround && this.cells.length) {
				var e = this.options.rightToLeft,
					t = e ? "marginRight" : "marginLeft",
					i = e ? "marginLeft" : "marginRight",
					n = this.slideableWidth - this.getLastCell().size[i],
					o = n < this.size.innerWidth,
					r = this.cursorPosition + this.cells[0].size[t],
					a = n - this.size.innerWidth * (1 - this.cellAlign);
				this.slides.forEach(function(e) {
					o ? e.target = n * this.cellAlign : (e.target = Math.max(e.target, r), e.target = Math.min(e.target, a))
				}, this)
			}
		}, p.dispatchEvent = function(e, t, i) {
			var n = t ? [t].concat(i) : i;
			if (this.emitEvent(e, n), c && this.$element) {
				var o = e += this.options.namespaceJQueryEvents ? ".flickity" : "";
				if (t) {
					var r = c.Event(t);
					r.type = e, o = r
				}
				this.$element.trigger(o, i)
			}
		}, p.select = function(e, t, i) {
			if (this.isActive && (e = parseInt(e, 10), this._wrapSelect(e), (this.options.wrapAround || t) && (e = n.modulo(e, this.slides.length)), this.slides[e])) {
				var o = this.selectedIndex;
				this.selectedIndex = e, this.updateSelectedSlide(), i ? this.positionSliderAtSelected() : this.startAnimation(), this.options.adaptiveHeight && this.setGallerySize(), this.dispatchEvent("select", null, [e]), e != o && this.dispatchEvent("change", null, [e]), this.dispatchEvent("cellSelect")
			}
		}, p._wrapSelect = function(e) {
			var t = this.slides.length;
			if (!(this.options.wrapAround && t > 1)) return e;
			var i = n.modulo(e, t),
				o = Math.abs(i - this.selectedIndex),
				r = Math.abs(i + t - this.selectedIndex),
				a = Math.abs(i - t - this.selectedIndex);
			!this.isDragSelect && r < o ? e += t : !this.isDragSelect && a < o && (e -= t), e < 0 ? this.x -= this.slideableWidth : e >= t && (this.x += this.slideableWidth)
		}, p.previous = function(e, t) {
			this.select(this.selectedIndex - 1, e, t)
		}, p.next = function(e, t) {
			this.select(this.selectedIndex + 1, e, t)
		}, p.updateSelectedSlide = function() {
			var e = this.slides[this.selectedIndex];
			e && (this.unselectSelectedSlide(), this.selectedSlide = e, e.select(), this.selectedCells = e.cells, this.selectedElements = e.getCellElements(), this.selectedCell = e.cells[0], this.selectedElement = this.selectedElements[0])
		}, p.unselectSelectedSlide = function() {
			this.selectedSlide && this.selectedSlide.unselect()
		}, p.selectCell = function(e, t, i) {
			var n = this.queryCell(e);
			if (n) {
				var o = this.getCellSlideIndex(n);
				this.select(o, t, i)
			}
		}, p.getCellSlideIndex = function(e) {
			for (var t = 0; t < this.slides.length; t++)
				if (-1 != this.slides[t].cells.indexOf(e)) return t
		}, p.getCell = function(e) {
			for (var t = 0; t < this.cells.length; t++) {
				var i = this.cells[t];
				if (i.element == e) return i
			}
		}, p.getCells = function(e) {
			var t = [];
			return (e = n.makeArray(e)).forEach(function(e) {
				var i = this.getCell(e);
				i && t.push(i)
			}, this), t
		}, p.getCellElements = function() {
			return this.cells.map(function(e) {
				return e.element
			})
		}, p.getParentCell = function(e) {
			return this.getCell(e) || (e = n.getParent(e, ".flickity-slider > *"), this.getCell(e))
		}, p.getAdjacentCellElements = function(e, t) {
			if (!e) return this.selectedSlide.getCellElements();
			t = void 0 === t ? this.selectedIndex : t;
			var i = this.slides.length;
			if (1 + 2 * e >= i) return this.getCellElements();
			for (var o = [], r = t - e; r <= t + e; r++) {
				var a = this.options.wrapAround ? n.modulo(r, i) : r,
					s = this.slides[a];
				s && (o = o.concat(s.getCellElements()))
			}
			return o
		}, p.queryCell = function(e) {
			return "number" == typeof e ? this.cells[e] : ("string" == typeof e && (e = this.element.querySelector(e)), this.getCell(e))
		}, p.uiChange = function() {
			this.emitEvent("uiChange")
		}, p.childUIPointerDown = function(e) {
			this.emitEvent("childUIPointerDown", [e])
		}, p.onresize = function() {
			this.watchCSS(), this.resize()
		}, n.debounceMethod(l, "onresize", 150), p.resize = function() {
			if (this.isActive) {
				this.getSize(), this.options.wrapAround && (this.x = n.modulo(this.x, this.slideableWidth)), this.positionCells(), this._getWrapShiftCells(), this.setGallerySize(), this.emitEvent("resize");
				var e = this.selectedElements && this.selectedElements[0];
				this.selectCell(e, !1, !0)
			}
		}, p.watchCSS = function() {
			this.options.watchCSS && (-1 != u(this.element, ":after").content.indexOf("flickity") ? this.activate() : this.deactivate())
		}, p.onkeydown = function(e) {
			var t = document.activeElement && document.activeElement != this.element;
			if (this.options.accessibility && !t) {
				var i = l.keyboardHandlers[e.keyCode];
				i && i.call(this)
			}
		}, l.keyboardHandlers = {
			37: function() {
				var e = this.options.rightToLeft ? "next" : "previous";
				this.uiChange(), this[e]()
			},
			39: function() {
				var e = this.options.rightToLeft ? "previous" : "next";
				this.uiChange(), this[e]()
			}
		}, p.focus = function() {
			var t = e.pageYOffset;
			this.element.focus(), e.pageYOffset != t && e.scrollTo(e.pageXOffset, t)
		}, p.deactivate = function() {
			this.isActive && (this.element.classList.remove("flickity-enabled"), this.element.classList.remove("flickity-rtl"), this.unselectSelectedSlide(), this.cells.forEach(function(e) {
				e.destroy()
			}), this.element.removeChild(this.viewport), s(this.slider.children, this.element), this.options.accessibility && (this.element.removeAttribute("tabIndex"), this.element.removeEventListener("keydown", this)), this.isActive = !1, this.emitEvent("deactivate"))
		}, p.destroy = function() {
			this.deactivate(), e.removeEventListener("resize", this), this.emitEvent("destroy"), c && this.$element && c.removeData(this.element, "flickity"), delete this.element.flickityGUID, delete d[this.guid]
		}, n.extend(p, a), l.data = function(e) {
			var t = (e = n.getQueryElement(e)) && e.flickityGUID;
			return t && d[t]
		}, n.htmlInit(l, "flickity"), c && c.bridget && c.bridget("flickity", l), l.setJQuery = function(e) {
			c = e
		}, l.Cell = o, l
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("unipointer/unipointer", ["ev-emitter/ev-emitter"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.Unipointer = t(e, e.EvEmitter)
	}(window, function(e, t) {
		function i() {}
		var n = i.prototype = Object.create(t.prototype);
		n.bindStartEvent = function(e) {
			this._bindStartEvent(e, !0)
		}, n.unbindStartEvent = function(e) {
			this._bindStartEvent(e, !1)
		}, n._bindStartEvent = function(t, i) {
			var n = (i = void 0 === i || i) ? "addEventListener" : "removeEventListener",
				o = "mousedown";
			e.PointerEvent ? o = "pointerdown" : "ontouchstart" in e && (o = "touchstart"), t[n](o, this)
		}, n.handleEvent = function(e) {
			var t = "on" + e.type;
			this[t] && this[t](e)
		}, n.getTouch = function(e) {
			for (var t = 0; t < e.length; t++) {
				var i = e[t];
				if (i.identifier == this.pointerIdentifier) return i
			}
		}, n.onmousedown = function(e) {
			var t = e.button;
			t && 0 !== t && 1 !== t || this._pointerDown(e, e)
		}, n.ontouchstart = function(e) {
			this._pointerDown(e, e.changedTouches[0])
		}, n.onpointerdown = function(e) {
			this._pointerDown(e, e)
		}, n._pointerDown = function(e, t) {
			e.button || this.isPointerDown || (this.isPointerDown = !0, this.pointerIdentifier = void 0 !== t.pointerId ? t.pointerId : t.identifier, this.pointerDown(e, t))
		}, n.pointerDown = function(e, t) {
			this._bindPostStartEvents(e), this.emitEvent("pointerDown", [e, t])
		};
		var o = {
			mousedown: ["mousemove", "mouseup"],
			touchstart: ["touchmove", "touchend", "touchcancel"],
			pointerdown: ["pointermove", "pointerup", "pointercancel"]
		};
		return n._bindPostStartEvents = function(t) {
			if (t) {
				var i = o[t.type];
				i.forEach(function(t) {
					e.addEventListener(t, this)
				}, this), this._boundPointerEvents = i
			}
		}, n._unbindPostStartEvents = function() {
			this._boundPointerEvents && (this._boundPointerEvents.forEach(function(t) {
				e.removeEventListener(t, this)
			}, this), delete this._boundPointerEvents)
		}, n.onmousemove = function(e) {
			this._pointerMove(e, e)
		}, n.onpointermove = function(e) {
			e.pointerId == this.pointerIdentifier && this._pointerMove(e, e)
		}, n.ontouchmove = function(e) {
			var t = this.getTouch(e.changedTouches);
			t && this._pointerMove(e, t)
		}, n._pointerMove = function(e, t) {
			this.pointerMove(e, t)
		}, n.pointerMove = function(e, t) {
			this.emitEvent("pointerMove", [e, t])
		}, n.onmouseup = function(e) {
			this._pointerUp(e, e)
		}, n.onpointerup = function(e) {
			e.pointerId == this.pointerIdentifier && this._pointerUp(e, e)
		}, n.ontouchend = function(e) {
			var t = this.getTouch(e.changedTouches);
			t && this._pointerUp(e, t)
		}, n._pointerUp = function(e, t) {
			this._pointerDone(), this.pointerUp(e, t)
		}, n.pointerUp = function(e, t) {
			this.emitEvent("pointerUp", [e, t])
		}, n._pointerDone = function() {
			this._pointerReset(), this._unbindPostStartEvents(), this.pointerDone()
		}, n._pointerReset = function() {
			this.isPointerDown = !1, delete this.pointerIdentifier
		}, n.pointerDone = function() {}, n.onpointercancel = function(e) {
			e.pointerId == this.pointerIdentifier && this._pointerCancel(e, e)
		}, n.ontouchcancel = function(e) {
			var t = this.getTouch(e.changedTouches);
			t && this._pointerCancel(e, t)
		}, n._pointerCancel = function(e, t) {
			this._pointerDone(), this.pointerCancel(e, t)
		}, n.pointerCancel = function(e, t) {
			this.emitEvent("pointerCancel", [e, t])
		}, i.getPointerPoint = function(e) {
			return {
				x: e.pageX,
				y: e.pageY
			}
		}, i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("unidragger/unidragger", ["unipointer/unipointer"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("unipointer")) : e.Unidragger = t(e, e.Unipointer)
	}(window, function(e, t) {
		function i() {}
		var n = i.prototype = Object.create(t.prototype);
		n.bindHandles = function() {
			this._bindHandles(!0)
		}, n.unbindHandles = function() {
			this._bindHandles(!1)
		}, n._bindHandles = function(t) {
			for (var i = (t = void 0 === t || t) ? "addEventListener" : "removeEventListener", n = t ? this._touchActionValue : "", o = 0; o < this.handles.length; o++) {
				var r = this.handles[o];
				this._bindStartEvent(r, t), r[i]("click", this), e.PointerEvent && (r.style.touchAction = n)
			}
		}, n._touchActionValue = "none", n.pointerDown = function(e, t) {
			this.okayPointerDown(e) && (this.pointerDownPointer = t, e.preventDefault(), this.pointerDownBlur(), this._bindPostStartEvents(e), this.emitEvent("pointerDown", [e, t]))
		};
		var o = {
				TEXTAREA: !0,
				INPUT: !0,
				SELECT: !0,
				OPTION: !0
			},
			r = {
				radio: !0,
				checkbox: !0,
				button: !0,
				submit: !0,
				image: !0,
				file: !0
			};
		return n.okayPointerDown = function(e) {
			var t = o[e.target.nodeName],
				i = r[e.target.type],
				n = !t || i;
			return n || this._pointerReset(), n
		}, n.pointerDownBlur = function() {
			var e = document.activeElement;
			e && e.blur && e != document.body && e.blur()
		}, n.pointerMove = function(e, t) {
			var i = this._dragPointerMove(e, t);
			this.emitEvent("pointerMove", [e, t, i]), this._dragMove(e, t, i)
		}, n._dragPointerMove = function(e, t) {
			var i = {
				x: t.pageX - this.pointerDownPointer.pageX,
				y: t.pageY - this.pointerDownPointer.pageY
			};
			return !this.isDragging && this.hasDragStarted(i) && this._dragStart(e, t), i
		}, n.hasDragStarted = function(e) {
			return Math.abs(e.x) > 3 || Math.abs(e.y) > 3
		}, n.pointerUp = function(e, t) {
			this.emitEvent("pointerUp", [e, t]), this._dragPointerUp(e, t)
		}, n._dragPointerUp = function(e, t) {
			this.isDragging ? this._dragEnd(e, t) : this._staticClick(e, t)
		}, n._dragStart = function(e, t) {
			this.isDragging = !0, this.isPreventingClicks = !0, this.dragStart(e, t)
		}, n.dragStart = function(e, t) {
			this.emitEvent("dragStart", [e, t])
		}, n._dragMove = function(e, t, i) {
			this.isDragging && this.dragMove(e, t, i)
		}, n.dragMove = function(e, t, i) {
			e.preventDefault(), this.emitEvent("dragMove", [e, t, i])
		}, n._dragEnd = function(e, t) {
			this.isDragging = !1, setTimeout(function() {
				delete this.isPreventingClicks
			}.bind(this)), this.dragEnd(e, t)
		}, n.dragEnd = function(e, t) {
			this.emitEvent("dragEnd", [e, t])
		}, n.onclick = function(e) {
			this.isPreventingClicks && e.preventDefault()
		}, n._staticClick = function(e, t) {
			this.isIgnoringMouseUp && "mouseup" == e.type || (this.staticClick(e, t), "mouseup" != e.type && (this.isIgnoringMouseUp = !0, setTimeout(function() {
				delete this.isIgnoringMouseUp
			}.bind(this), 400)))
		}, n.staticClick = function(e, t) {
			this.emitEvent("staticClick", [e, t])
		}, i.getPointerPoint = t.getPointerPoint, i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/drag", ["./flickity", "unidragger/unidragger", "fizzy-ui-utils/utils"], function(i, n, o) {
			return t(e, i, n, o)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("./flickity"), require("unidragger"), require("fizzy-ui-utils")) : e.Flickity = t(e, e.Flickity, e.Unidragger, e.fizzyUIUtils)
	}(window, function(e, t, i, n) {
		function o() {
			return {
				x: e.pageXOffset,
				y: e.pageYOffset
			}
		}
		n.extend(t.defaults, {
			draggable: ">1",
			dragThreshold: 3
		}), t.createMethods.push("_createDrag");
		var r = t.prototype;
		n.extend(r, i.prototype), r._touchActionValue = "pan-y";
		var a = "createTouch" in document,
			s = !1;
		r._createDrag = function() {
			this.on("activate", this.onActivateDrag), this.on("uiChange", this._uiChangeDrag), this.on("childUIPointerDown", this._childUIPointerDownDrag), this.on("deactivate", this.unbindDrag), this.on("cellChange", this.updateDraggable), a && !s && (e.addEventListener("touchmove", function() {}), s = !0)
		}, r.onActivateDrag = function() {
			this.handles = [this.viewport], this.bindHandles(), this.updateDraggable()
		}, r.onDeactivateDrag = function() {
			this.unbindHandles(), this.element.classList.remove("is-draggable")
		}, r.updateDraggable = function() {
			">1" == this.options.draggable ? this.isDraggable = this.slides.length > 1 : this.isDraggable = this.options.draggable, this.isDraggable ? this.element.classList.add("is-draggable") : this.element.classList.remove("is-draggable")
		}, r.bindDrag = function() {
			this.options.draggable = !0, this.updateDraggable()
		}, r.unbindDrag = function() {
			this.options.draggable = !1, this.updateDraggable()
		}, r._uiChangeDrag = function() {
			delete this.isFreeScrolling
		}, r._childUIPointerDownDrag = function(e) {
			e.preventDefault(), this.pointerDownFocus(e)
		}, r.pointerDown = function(t, i) {
			this.isDraggable ? this.okayPointerDown(t) && (this._pointerDownPreventDefault(t), this.pointerDownFocus(t), document.activeElement != this.element && this.pointerDownBlur(), this.dragX = this.x, this.viewport.classList.add("is-pointer-down"), this.pointerDownScroll = o(), e.addEventListener("scroll", this), this._pointerDownDefault(t, i)) : this._pointerDownDefault(t, i)
		}, r._pointerDownDefault = function(e, t) {
			this.pointerDownPointer = t, this._bindPostStartEvents(e), this.dispatchEvent("pointerDown", e, [t])
		};
		var l = {
			INPUT: !0,
			TEXTAREA: !0,
			SELECT: !0
		};
		return r.pointerDownFocus = function(e) {
			l[e.target.nodeName] || this.focus()
		}, r._pointerDownPreventDefault = function(e) {
			var t = "touchstart" == e.type,
				i = "touch" == e.pointerType,
				n = l[e.target.nodeName];
			t || i || n || e.preventDefault()
		}, r.hasDragStarted = function(e) {
			return Math.abs(e.x) > this.options.dragThreshold
		}, r.pointerUp = function(e, t) {
			delete this.isTouchScrolling, this.viewport.classList.remove("is-pointer-down"), this.dispatchEvent("pointerUp", e, [t]), this._dragPointerUp(e, t)
		}, r.pointerDone = function() {
			e.removeEventListener("scroll", this), delete this.pointerDownScroll
		}, r.dragStart = function(t, i) {
			this.isDraggable && (this.dragStartPosition = this.x, this.startAnimation(), e.removeEventListener("scroll", this), this.dispatchEvent("dragStart", t, [i]))
		}, r.pointerMove = function(e, t) {
			var i = this._dragPointerMove(e, t);
			this.dispatchEvent("pointerMove", e, [t, i]), this._dragMove(e, t, i)
		}, r.dragMove = function(e, t, i) {
			if (this.isDraggable) {
				e.preventDefault(), this.previousDragX = this.dragX;
				var n = this.options.rightToLeft ? -1 : 1;
				this.options.wrapAround && (i.x = i.x % this.slideableWidth);
				var o = this.dragStartPosition + i.x * n;
				if (!this.options.wrapAround && this.slides.length) {
					var r = Math.max(-this.slides[0].target, this.dragStartPosition);
					o = o > r ? .5 * (o + r) : o;
					var a = Math.min(-this.getLastSlide().target, this.dragStartPosition);
					o = o < a ? .5 * (o + a) : o
				}
				this.dragX = o, this.dragMoveTime = new Date, this.dispatchEvent("dragMove", e, [t, i])
			}
		}, r.dragEnd = function(e, t) {
			if (this.isDraggable) {
				this.options.freeScroll && (this.isFreeScrolling = !0);
				var i = this.dragEndRestingSelect();
				if (this.options.freeScroll && !this.options.wrapAround) {
					var n = this.getRestingPosition();
					this.isFreeScrolling = -n > this.slides[0].target && -n < this.getLastSlide().target
				}
				else this.options.freeScroll || i != this.selectedIndex || (i += this.dragEndBoostSelect());
				delete this.previousDragX, this.isDragSelect = this.options.wrapAround, this.select(i), delete this.isDragSelect, this.dispatchEvent("dragEnd", e, [t])
			}
		}, r.dragEndRestingSelect = function() {
			var e = this.getRestingPosition(),
				t = Math.abs(this.getSlideDistance(-e, this.selectedIndex)),
				i = this._getClosestResting(e, t, 1),
				n = this._getClosestResting(e, t, -1);
			return i.distance < n.distance ? i.index : n.index
		}, r._getClosestResting = function(e, t, i) {
			for (var n = this.selectedIndex, o = 1 / 0, r = this.options.contain && !this.options.wrapAround ? function(e, t) {
					return e <= t
				} : function(e, t) {
					return e < t
				}; r(t, o) && (n += i, o = t, null !== (t = this.getSlideDistance(-e, n)));) t = Math.abs(t);
			return {
				distance: o,
				index: n - i
			}
		}, r.getSlideDistance = function(e, t) {
			var i = this.slides.length,
				o = this.options.wrapAround && i > 1,
				r = o ? n.modulo(t, i) : t,
				a = this.slides[r];
			if (!a) return null;
			var s = o ? this.slideableWidth * Math.floor(t / i) : 0;
			return e - (a.target + s)
		}, r.dragEndBoostSelect = function() {
			if (void 0 === this.previousDragX || !this.dragMoveTime || new Date - this.dragMoveTime > 100) return 0;
			var e = this.getSlideDistance(-this.dragX, this.selectedIndex),
				t = this.previousDragX - this.dragX;
			return e > 0 && t > 0 ? 1 : e < 0 && t < 0 ? -1 : 0
		}, r.staticClick = function(e, t) {
			var i = this.getParentCell(e.target),
				n = i && i.element,
				o = i && this.cells.indexOf(i);
			this.dispatchEvent("staticClick", e, [t, n, o])
		}, r.onscroll = function() {
			var e = o(),
				t = this.pointerDownScroll.x - e.x,
				i = this.pointerDownScroll.y - e.y;
			(Math.abs(t) > 3 || Math.abs(i) > 3) && this._pointerDone()
		}, t
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("tap-listener/tap-listener", ["unipointer/unipointer"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("unipointer")) : e.TapListener = t(e, e.Unipointer)
	}(window, function(e, t) {
		function i(e) {
			this.bindTap(e)
		}
		var n = i.prototype = Object.create(t.prototype);
		return n.bindTap = function(e) {
			e && (this.unbindTap(), this.tapElement = e, this._bindStartEvent(e, !0))
		}, n.unbindTap = function() {
			this.tapElement && (this._bindStartEvent(this.tapElement, !0), delete this.tapElement)
		}, n.pointerUp = function(i, n) {
			if (!this.isIgnoringMouseUp || "mouseup" != i.type) {
				var o = t.getPointerPoint(n),
					r = this.tapElement.getBoundingClientRect(),
					a = e.pageXOffset,
					s = e.pageYOffset;
				if (o.x >= r.left + a && o.x <= r.right + a && o.y >= r.top + s && o.y <= r.bottom + s && this.emitEvent("tap", [i, n]), "mouseup" != i.type) {
					this.isIgnoringMouseUp = !0;
					var l = this;
					setTimeout(function() {
						delete l.isIgnoringMouseUp
					}, 400)
				}
			}
		}, n.destroy = function() {
			this.pointerDone(), this.unbindTap()
		}, i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/prev-next-button", ["./flickity", "tap-listener/tap-listener", "fizzy-ui-utils/utils"], function(i, n, o) {
			return t(e, i, n, o)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("./flickity"), require("tap-listener"), require("fizzy-ui-utils")) : t(e, e.Flickity, e.TapListener, e.fizzyUIUtils)
	}(window, function(e, t, i, n) {
		"use strict";

		function o(e, t) {
			this.direction = e, this.parent = t, this._create()
		}

		function r(e) {
			return "string" == typeof e ? e : "M " + e.x0 + ",50 L " + e.x1 + "," + (e.y1 + 50) + " L " + e.x2 + "," + (e.y2 + 50) + " L " + e.x3 + ",50  L " + e.x2 + "," + (50 - e.y2) + " L " + e.x1 + "," + (50 - e.y1) + " Z"
		}
		var a = "http://www.w3.org/2000/svg";
		(o.prototype = Object.create(i.prototype))._create = function() {
			this.isEnabled = !0, this.isPrevious = -1 == this.direction;
			var e = this.parent.options.rightToLeft ? 1 : -1;
			this.isLeft = this.direction == e;
			var t = this.element = document.createElement("button");
			t.className = "flickity-button flickity-prev-next-button", t.className += this.isPrevious ? " previous" : " next", t.setAttribute("type", "button"), this.disable(), t.setAttribute("aria-label", this.isPrevious ? "Previous" : "Next");
			var i = this.createSVG();
			t.appendChild(i), this.on("tap", this.onTap), this.parent.on("select", this.update.bind(this)), this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent))
		}, o.prototype.activate = function() {
			this.bindTap(this.element), this.element.addEventListener("click", this), this.parent.element.appendChild(this.element)
		}, o.prototype.deactivate = function() {
			this.parent.element.removeChild(this.element), i.prototype.destroy.call(this), this.element.removeEventListener("click", this)
		}, o.prototype.createSVG = function() {
			var e = document.createElementNS(a, "svg");
			e.setAttribute("class", "flickity-button-icon"), e.setAttribute("viewBox", "0 0 100 100");
			var t = document.createElementNS(a, "path"),
				i = r(this.parent.options.arrowShape);
			return t.setAttribute("d", i), t.setAttribute("class", "arrow"), this.isLeft || t.setAttribute("transform", "translate(100, 100) rotate(180) "), e.appendChild(t), e
		}, o.prototype.onTap = function() {
			if (this.isEnabled) {
				this.parent.uiChange();
				var e = this.isPrevious ? "previous" : "next";
				this.parent[e]()
			}
		}, o.prototype.handleEvent = n.handleEvent, o.prototype.onclick = function(e) {
			var t = document.activeElement;
			t && t == this.element && this.onTap(e, e)
		}, o.prototype.enable = function() {
			this.isEnabled || (this.element.disabled = !1, this.isEnabled = !0)
		}, o.prototype.disable = function() {
			this.isEnabled && (this.element.disabled = !0, this.isEnabled = !1)
		}, o.prototype.update = function() {
			var e = this.parent.slides;
			if (this.parent.options.wrapAround && e.length > 1) this.enable();
			else {
				var t = e.length ? e.length - 1 : 0,
					i = this.isPrevious ? 0 : t;
				this[this.parent.selectedIndex == i ? "disable" : "enable"]()
			}
		}, o.prototype.destroy = function() {
			this.deactivate()
		}, n.extend(t.defaults, {
			prevNextButtons: !0,
			arrowShape: {
				x0: 10,
				x1: 60,
				y1: 50,
				x2: 70,
				y2: 40,
				x3: 30
			}
		}), t.createMethods.push("_createPrevNextButtons");
		var s = t.prototype;
		return s._createPrevNextButtons = function() {
			this.options.prevNextButtons && (this.prevButton = new o(-1, this), this.nextButton = new o(1, this), this.on("activate", this.activatePrevNextButtons))
		}, s.activatePrevNextButtons = function() {
			this.prevButton.activate(), this.nextButton.activate(), this.on("deactivate", this.deactivatePrevNextButtons)
		}, s.deactivatePrevNextButtons = function() {
			this.prevButton.deactivate(), this.nextButton.deactivate(), this.off("deactivate", this.deactivatePrevNextButtons)
		}, t.PrevNextButton = o, t
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/page-dots", ["./flickity", "tap-listener/tap-listener", "fizzy-ui-utils/utils"], function(i, n, o) {
			return t(e, i, n, o)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("./flickity"), require("tap-listener"), require("fizzy-ui-utils")) : t(e, e.Flickity, e.TapListener, e.fizzyUIUtils)
	}(window, function(e, t, i, n) {
		function o(e) {
			this.parent = e, this._create()
		}(o.prototype = new i)._create = function() {
			this.holder = document.createElement("ol"), this.holder.className = "flickity-page-dots", this.dots = [], this.on("tap", this.onTap), this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent))
		}, o.prototype.activate = function() {
			this.setDots(), this.bindTap(this.holder), this.parent.element.appendChild(this.holder)
		}, o.prototype.deactivate = function() {
			this.parent.element.removeChild(this.holder), i.prototype.destroy.call(this)
		}, o.prototype.setDots = function() {
			var e = this.parent.slides.length - this.dots.length;
			e > 0 ? this.addDots(e) : e < 0 && this.removeDots(-e)
		}, o.prototype.addDots = function(e) {
			for (var t = document.createDocumentFragment(), i = [], n = this.dots.length, o = n + e, r = n; r < o; r++) {
				var a = document.createElement("li");
				a.className = "dot", a.setAttribute("aria-label", "Page dot " + (r + 1)), t.appendChild(a), i.push(a)
			}
			this.holder.appendChild(t), this.dots = this.dots.concat(i)
		}, o.prototype.removeDots = function(e) {
			this.dots.splice(this.dots.length - e, e).forEach(function(e) {
				this.holder.removeChild(e)
			}, this)
		}, o.prototype.updateSelected = function() {
			this.selectedDot && (this.selectedDot.className = "dot", this.selectedDot.removeAttribute("aria-current")), this.dots.length && (this.selectedDot = this.dots[this.parent.selectedIndex], this.selectedDot.className = "dot is-selected", this.selectedDot.setAttribute("aria-current", "step"))
		}, o.prototype.onTap = function(e) {
			var t = e.target;
			if ("LI" == t.nodeName) {
				this.parent.uiChange();
				var i = this.dots.indexOf(t);
				this.parent.select(i)
			}
		}, o.prototype.destroy = function() {
			this.deactivate()
		}, t.PageDots = o, n.extend(t.defaults, {
			pageDots: !0
		}), t.createMethods.push("_createPageDots");
		var r = t.prototype;
		return r._createPageDots = function() {
			this.options.pageDots && (this.pageDots = new o(this), this.on("activate", this.activatePageDots), this.on("select", this.updateSelectedPageDots), this.on("cellChange", this.updatePageDots), this.on("resize", this.updatePageDots), this.on("deactivate", this.deactivatePageDots))
		}, r.activatePageDots = function() {
			this.pageDots.activate()
		}, r.updateSelectedPageDots = function() {
			this.pageDots.updateSelected()
		}, r.updatePageDots = function() {
			this.pageDots.setDots()
		}, r.deactivatePageDots = function() {
			this.pageDots.deactivate()
		}, t.PageDots = o, t
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/player", ["ev-emitter/ev-emitter", "fizzy-ui-utils/utils", "./flickity"], function(e, i, n) {
			return t(e, i, n)
		}) : "object" == typeof module && module.exports ? module.exports = t(require("ev-emitter"), require("fizzy-ui-utils"), require("./flickity")) : t(e.EvEmitter, e.fizzyUIUtils, e.Flickity)
	}(window, function(e, t, i) {
		function n(e) {
			this.parent = e, this.state = "stopped", this.onVisibilityChange = this.visibilityChange.bind(this), this.onVisibilityPlay = this.visibilityPlay.bind(this)
		}(n.prototype = Object.create(e.prototype)).play = function() {
			"playing" != this.state && (document.hidden ? document.addEventListener("visibilitychange", this.onVisibilityPlay) : (this.state = "playing", document.addEventListener("visibilitychange", this.onVisibilityChange), this.tick()))
		}, n.prototype.tick = function() {
			if ("playing" == this.state) {
				var e = this.parent.options.autoPlay;
				e = "number" == typeof e ? e : 3e3;
				var t = this;
				this.clear(), this.timeout = setTimeout(function() {
					t.parent.next(!0), t.tick()
				}, e)
			}
		}, n.prototype.stop = function() {
			this.state = "stopped", this.clear(), document.removeEventListener("visibilitychange", this.onVisibilityChange)
		}, n.prototype.clear = function() {
			clearTimeout(this.timeout)
		}, n.prototype.pause = function() {
			"playing" == this.state && (this.state = "paused", this.clear())
		}, n.prototype.unpause = function() {
			"paused" == this.state && this.play()
		}, n.prototype.visibilityChange = function() {
			this[document.hidden ? "pause" : "unpause"]()
		}, n.prototype.visibilityPlay = function() {
			this.play(), document.removeEventListener("visibilitychange", this.onVisibilityPlay)
		}, t.extend(i.defaults, {
			pauseAutoPlayOnHover: !0
		}), i.createMethods.push("_createPlayer");
		var o = i.prototype;
		return o._createPlayer = function() {
			this.player = new n(this), this.on("activate", this.activatePlayer), this.on("uiChange", this.stopPlayer), this.on("pointerDown", this.stopPlayer), this.on("deactivate", this.deactivatePlayer)
		}, o.activatePlayer = function() {
			this.options.autoPlay && (this.player.play(), this.element.addEventListener("mouseenter", this))
		}, o.playPlayer = function() {
			this.player.play()
		}, o.stopPlayer = function() {
			this.player.stop()
		}, o.pausePlayer = function() {
			this.player.pause()
		}, o.unpausePlayer = function() {
			this.player.unpause()
		}, o.deactivatePlayer = function() {
			this.player.stop(), this.element.removeEventListener("mouseenter", this)
		}, o.onmouseenter = function() {
			this.options.pauseAutoPlayOnHover && (this.player.pause(), this.element.addEventListener("mouseleave", this))
		}, o.onmouseleave = function() {
			this.player.unpause(), this.element.removeEventListener("mouseleave", this)
		}, i.Player = n, i
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/add-remove-cell", ["./flickity", "fizzy-ui-utils/utils"], function(i, n) {
			return t(e, i, n)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("./flickity"), require("fizzy-ui-utils")) : t(e, e.Flickity, e.fizzyUIUtils)
	}(window, function(e, t, i) {
		function n(e) {
			var t = document.createDocumentFragment();
			return e.forEach(function(e) {
				t.appendChild(e.element)
			}), t
		}
		var o = t.prototype;
		return o.insert = function(e, t) {
			var i = this._makeCells(e);
			if (i && i.length) {
				var o = this.cells.length;
				t = void 0 === t ? o : t;
				var r = n(i),
					a = t == o;
				if (a) this.slider.appendChild(r);
				else {
					var s = this.cells[t].element;
					this.slider.insertBefore(r, s)
				}
				if (0 === t) this.cells = i.concat(this.cells);
				else if (a) this.cells = this.cells.concat(i);
				else {
					var l = this.cells.splice(t, o - t);
					this.cells = this.cells.concat(i).concat(l)
				}
				this._sizeCells(i), this.cellChange(t, !0)
			}
		}, o.append = function(e) {
			this.insert(e, this.cells.length)
		}, o.prepend = function(e) {
			this.insert(e, 0)
		}, o.remove = function(e) {
			var t = this.getCells(e);
			if (t && t.length) {
				var n = this.cells.length - 1;
				t.forEach(function(e) {
					e.remove();
					var t = this.cells.indexOf(e);
					n = Math.min(t, n), i.removeFrom(this.cells, e)
				}, this), this.cellChange(n, !0)
			}
		}, o.cellSizeChange = function(e) {
			var t = this.getCell(e);
			if (t) {
				t.getSize();
				var i = this.cells.indexOf(t);
				this.cellChange(i)
			}
		}, o.cellChange = function(e, t) {
			var i = this.selectedElement;
			this._positionCells(e), this._getWrapShiftCells(), this.setGallerySize();
			var n = this.getCell(i);
			n && (this.selectedIndex = this.getCellSlideIndex(n)), this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex), this.emitEvent("cellChange", [e]), this.select(this.selectedIndex), t && this.positionSliderAtSelected()
		}, t
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/lazyload", ["./flickity", "fizzy-ui-utils/utils"], function(i, n) {
			return t(e, i, n)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("./flickity"), require("fizzy-ui-utils")) : t(e, e.Flickity, e.fizzyUIUtils)
	}(window, function(e, t, i) {
		"use strict";

		function n(e) {
			if ("IMG" == e.nodeName) {
				var t = e.getAttribute("data-flickity-lazyload"),
					n = e.getAttribute("data-flickity-lazyload-src"),
					o = e.getAttribute("data-flickity-lazyload-srcset");
				if (t || n || o) return [e]
			}
			var r = e.querySelectorAll("img[data-flickity-lazyload], img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]");
			return i.makeArray(r)
		}

		function o(e, t) {
			this.img = e, this.flickity = t, this.load()
		}
		t.createMethods.push("_createLazyload");
		var r = t.prototype;
		return r._createLazyload = function() {
			this.on("select", this.lazyLoad)
		}, r.lazyLoad = function() {
			var e = this.options.lazyLoad;
			if (e) {
				var t = "number" == typeof e ? e : 0,
					i = [];
				this.getAdjacentCellElements(t).forEach(function(e) {
					var t = n(e);
					i = i.concat(t)
				}), i.forEach(function(e) {
					new o(e, this)
				}, this)
			}
		}, o.prototype.handleEvent = i.handleEvent, o.prototype.load = function() {
			this.img.addEventListener("load", this), this.img.addEventListener("error", this);
			var e = this.img.getAttribute("data-flickity-lazyload") || this.img.getAttribute("data-flickity-lazyload-src"),
				t = this.img.getAttribute("data-flickity-lazyload-srcset");
			this.img.src = e, t && this.img.setAttribute("srcset", t), this.img.removeAttribute("data-flickity-lazyload"), this.img.removeAttribute("data-flickity-lazyload-src"), this.img.removeAttribute("data-flickity-lazyload-srcset")
		}, o.prototype.onload = function(e) {
			this.complete(e, "flickity-lazyloaded")
		}, o.prototype.onerror = function(e) {
			this.complete(e, "flickity-lazyerror")
		}, o.prototype.complete = function(e, t) {
			this.img.removeEventListener("load", this), this.img.removeEventListener("error", this);
			var i = this.flickity.getParentCell(this.img),
				n = i && i.element;
			this.flickity.cellSizeChange(n), this.img.classList.add(t), this.flickity.dispatchEvent("lazyLoad", e, n)
		}, t.LazyLoader = o, t
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity/js/index", ["./flickity", "./drag", "./prev-next-button", "./page-dots", "./player", "./add-remove-cell", "./lazyload"], t) : "object" == typeof module && module.exports && (module.exports = t(require("./flickity"), require("./drag"), require("./prev-next-button"), require("./page-dots"), require("./player"), require("./add-remove-cell"), require("./lazyload")))
	}(window, function(e) {
		return e
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("flickity-as-nav-for/as-nav-for", ["flickity/js/index", "fizzy-ui-utils/utils"], t) : "object" == typeof module && module.exports ? module.exports = t(require("flickity"), require("fizzy-ui-utils")) : e.Flickity = t(e.Flickity, e.fizzyUIUtils)
	}(window, function(e, t) {
		function i(e, t, i) {
			return (t - e) * i + e
		}
		e.createMethods.push("_createAsNavFor");
		var n = e.prototype;
		return n._createAsNavFor = function() {
			this.on("activate", this.activateAsNavFor), this.on("deactivate", this.deactivateAsNavFor), this.on("destroy", this.destroyAsNavFor);
			var e = this.options.asNavFor;
			if (e) {
				var t = this;
				setTimeout(function() {
					t.setNavCompanion(e)
				})
			}
		}, n.setNavCompanion = function(i) {
			i = t.getQueryElement(i);
			var n = e.data(i);
			if (n && n != this) {
				this.navCompanion = n;
				var o = this;
				this.onNavCompanionSelect = function() {
					o.navCompanionSelect()
				}, n.on("select", this.onNavCompanionSelect), this.on("staticClick", this.onNavStaticClick), this.navCompanionSelect(!0)
			}
		}, n.navCompanionSelect = function(e) {
			if (this.navCompanion) {
				var t = this.navCompanion.selectedCells[0],
					n = this.navCompanion.cells.indexOf(t),
					o = n + this.navCompanion.selectedCells.length - 1,
					r = Math.floor(i(n, o, this.navCompanion.cellAlign));
				if (this.selectCell(r, !1, e), this.removeNavSelectedElements(), !(r >= this.cells.length)) {
					var a = this.cells.slice(n, o + 1);
					this.navSelectedElements = a.map(function(e) {
						return e.element
					}), this.changeNavSelectedClass("add")
				}
			}
		}, n.changeNavSelectedClass = function(e) {
			this.navSelectedElements.forEach(function(t) {
				t.classList[e]("is-nav-selected")
			})
		}, n.activateAsNavFor = function() {
			this.navCompanionSelect(!0)
		}, n.removeNavSelectedElements = function() {
			this.navSelectedElements && (this.changeNavSelectedClass("remove"), delete this.navSelectedElements)
		}, n.onNavStaticClick = function(e, t, i, n) {
			"number" == typeof n && this.navCompanion.selectCell(n)
		}, n.deactivateAsNavFor = function() {
			this.removeNavSelectedElements()
		}, n.destroyAsNavFor = function() {
			this.navCompanion && (this.navCompanion.off("select", this.onNavCompanionSelect), this.off("staticClick", this.onNavStaticClick), delete this.navCompanion)
		}, e
	}),
	function(e, t) {
		"use strict";
		"function" == typeof define && define.amd ? define("imagesloaded/imagesloaded", ["ev-emitter/ev-emitter"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.imagesLoaded = t(e, e.EvEmitter)
	}("undefined" != typeof window ? window : this, function(e, t) {
		function i(e, t) {
			for (var i in t) e[i] = t[i];
			return e
		}

		function n(e) {
			return Array.isArray(e) ? e : "object" == typeof e && "number" == typeof e.length ? l.call(e) : [e]
		}

		function o(e, t, r) {
			if (!(this instanceof o)) return new o(e, t, r);
			var a = e;
			"string" == typeof e && (a = document.querySelectorAll(e)), a && (this.elements = n(a), this.options = i({}, this.options), "function" == typeof t ? r = t : i(this.options, t), r && this.on("always", r), this.getImages(), s && (this.jqDeferred = new s.Deferred), setTimeout(this.check.bind(this)))
		}

		function r(e) {
			this.img = e
		}

		function a(e, t) {
			this.url = e, this.element = t, this.img = new Image
		}
		var s = e.jQuery,
			l = (e.console, Array.prototype.slice);
		o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function() {
			this.images = [], this.elements.forEach(this.addElementImages, this)
		}, o.prototype.addElementImages = function(e) {
			"IMG" == e.nodeName && this.addImage(e), !0 === this.options.background && this.addElementBackgroundImages(e);
			var t = e.nodeType;
			if (t && c[t]) {
				for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) {
					var o = i[n];
					this.addImage(o)
				}
				if ("string" == typeof this.options.background) {
					var r = e.querySelectorAll(this.options.background);
					for (n = 0; n < r.length; n++) {
						var a = r[n];
						this.addElementBackgroundImages(a)
					}
				}
			}
		};
		var c = {
			1: !0,
			9: !0,
			11: !0
		};
		return o.prototype.addElementBackgroundImages = function(e) {
			var t = getComputedStyle(e);
			if (t)
				for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) {
					var o = n && n[2];
					o && this.addBackground(o, e), n = i.exec(t.backgroundImage)
				}
		}, o.prototype.addImage = function(e) {
			var t = new r(e);
			this.images.push(t)
		}, o.prototype.addBackground = function(e, t) {
			var i = new a(e, t);
			this.images.push(i)
		}, o.prototype.check = function() {
			function e(e, i, n) {
				setTimeout(function() {
					t.progress(e, i, n)
				})
			}
			var t = this;
			this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? this.images.forEach(function(t) {
				t.once("progress", e), t.check()
			}) : this.complete()
		}, o.prototype.progress = function(e, t, i) {
			this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [this, e, t]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount == this.images.length && this.complete(), this.options.debug
		}, o.prototype.complete = function() {
			var e = this.hasAnyBroken ? "fail" : "done";
			if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
				var t = this.hasAnyBroken ? "reject" : "resolve";
				this.jqDeferred[t](this)
			}
		}, r.prototype = Object.create(t.prototype), r.prototype.check = function() {
			this.getIsImageComplete() ? this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.proxyImage.src = this.img.src)
		}, r.prototype.getIsImageComplete = function() {
			return this.img.complete && this.img.naturalWidth
		}, r.prototype.confirm = function(e, t) {
			this.isLoaded = e, this.emitEvent("progress", [this, this.img, t])
		}, r.prototype.handleEvent = function(e) {
			var t = "on" + e.type;
			this[t] && this[t](e)
		}, r.prototype.onload = function() {
			this.confirm(!0, "onload"), this.unbindEvents()
		}, r.prototype.onerror = function() {
			this.confirm(!1, "onerror"), this.unbindEvents()
		}, r.prototype.unbindEvents = function() {
			this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
		}, a.prototype = Object.create(r.prototype), a.prototype.check = function() {
			this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url, this.getIsImageComplete() && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
		}, a.prototype.unbindEvents = function() {
			this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
		}, a.prototype.confirm = function(e, t) {
			this.isLoaded = e, this.emitEvent("progress", [this, this.element, t])
		}, o.makeJQueryPlugin = function(t) {
			(t = t || e.jQuery) && ((s = t).fn.imagesLoaded = function(e, t) {
				return new o(this, e, t).jqDeferred.promise(s(this))
			})
		}, o.makeJQueryPlugin(), o
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define(["flickity/js/index", "imagesloaded/imagesloaded"], function(i, n) {
			return t(e, i, n)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("flickity"), require("imagesloaded")) : e.Flickity = t(e, e.Flickity, e.imagesLoaded)
	}(window, function(e, t, i) {
		"use strict";
		t.createMethods.push("_createImagesLoaded");
		var n = t.prototype;
		return n._createImagesLoaded = function() {
			this.on("activate", this.imagesLoaded)
		}, n.imagesLoaded = function() {
			if (this.options.imagesLoaded) {
				var e = this;
				i(this.slider).on("progress", function(t, i) {
					var n = e.getParentCell(i.img);
					e.cellSizeChange(n && n.element), e.options.freeScroll || e.positionSliderAtSelected()
				})
			}
		}, t
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t()
	}("undefined" != typeof window ? window : this, function() {
		function e() {}
		var t = e.prototype;
		return t.on = function(e, t) {
			if (e && t) {
				var i = this._events = this._events || {},
					n = i[e] = i[e] || [];
				return -1 == n.indexOf(t) && n.push(t), this
			}
		}, t.once = function(e, t) {
			if (e && t) {
				this.on(e, t);
				var i = this._onceEvents = this._onceEvents || {};
				return (i[e] = i[e] || {})[t] = !0, this
			}
		}, t.off = function(e, t) {
			var i = this._events && this._events[e];
			if (i && i.length) {
				var n = i.indexOf(t);
				return -1 != n && i.splice(n, 1), this
			}
		}, t.emitEvent = function(e, t) {
			var i = this._events && this._events[e];
			if (i && i.length) {
				i = i.slice(0), t = t || [];
				for (var n = this._onceEvents && this._onceEvents[e], o = 0; o < i.length; o++) {
					var r = i[o];
					n && n[r] && (this.off(e, r), delete n[r]), r.apply(this, t)
				}
				return this
			}
		}, t.allOff = function() {
			delete this._events, delete this._onceEvents
		}, e
	}),
	function(e, t) {
		"use strict";
		"function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(i) {
			return t(e, i)
		}) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.imagesLoaded = t(e, e.EvEmitter)
	}("undefined" != typeof window ? window : this, function(e, t) {
		function i(e, t) {
			for (var i in t) e[i] = t[i];
			return e
		}

		function n(e) {
			return Array.isArray(e) ? e : "object" == typeof e && "number" == typeof e.length ? l.call(e) : [e]
		}

		function o(e, t, r) {
			if (!(this instanceof o)) return new o(e, t, r);
			var a = e;
			"string" == typeof e && (a = document.querySelectorAll(e)), a && (this.elements = n(a), this.options = i({}, this.options), "function" == typeof t ? r = t : i(this.options, t), r && this.on("always", r), this.getImages(), s && (this.jqDeferred = new s.Deferred), setTimeout(this.check.bind(this)))
		}

		function r(e) {
			this.img = e
		}

		function a(e, t) {
			this.url = e, this.element = t, this.img = new Image
		}
		var s = e.jQuery,
			l = (e.console, Array.prototype.slice);
		o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function() {
			this.images = [], this.elements.forEach(this.addElementImages, this)
		}, o.prototype.addElementImages = function(e) {
			"IMG" == e.nodeName && this.addImage(e), !0 === this.options.background && this.addElementBackgroundImages(e);
			var t = e.nodeType;
			if (t && c[t]) {
				for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) {
					var o = i[n];
					this.addImage(o)
				}
				if ("string" == typeof this.options.background) {
					var r = e.querySelectorAll(this.options.background);
					for (n = 0; n < r.length; n++) {
						var a = r[n];
						this.addElementBackgroundImages(a)
					}
				}
			}
		};
		var c = {
			1: !0,
			9: !0,
			11: !0
		};
		return o.prototype.addElementBackgroundImages = function(e) {
			var t = getComputedStyle(e);
			if (t)
				for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) {
					var o = n && n[2];
					o && this.addBackground(o, e), n = i.exec(t.backgroundImage)
				}
		}, o.prototype.addImage = function(e) {
			var t = new r(e);
			this.images.push(t)
		}, o.prototype.addBackground = function(e, t) {
			var i = new a(e, t);
			this.images.push(i)
		}, o.prototype.check = function() {
			function e(e, i, n) {
				setTimeout(function() {
					t.progress(e, i, n)
				})
			}
			var t = this;
			this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? this.images.forEach(function(t) {
				t.once("progress", e), t.check()
			}) : this.complete()
		}, o.prototype.progress = function(e, t, i) {
			this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [this, e, t]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount == this.images.length && this.complete(), this.options.debug
		}, o.prototype.complete = function() {
			var e = this.hasAnyBroken ? "fail" : "done";
			if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
				var t = this.hasAnyBroken ? "reject" : "resolve";
				this.jqDeferred[t](this)
			}
		}, r.prototype = Object.create(t.prototype), r.prototype.check = function() {
			this.getIsImageComplete() ? this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.proxyImage.src = this.img.src)
		}, r.prototype.getIsImageComplete = function() {
			return this.img.complete && this.img.naturalWidth
		}, r.prototype.confirm = function(e, t) {
			this.isLoaded = e, this.emitEvent("progress", [this, this.img, t])
		}, r.prototype.handleEvent = function(e) {
			var t = "on" + e.type;
			this[t] && this[t](e)
		}, r.prototype.onload = function() {
			this.confirm(!0, "onload"), this.unbindEvents()
		}, r.prototype.onerror = function() {
			this.confirm(!1, "onerror"), this.unbindEvents()
		}, r.prototype.unbindEvents = function() {
			this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
		}, a.prototype = Object.create(r.prototype), a.prototype.check = function() {
			this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url, this.getIsImageComplete() && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
		}, a.prototype.unbindEvents = function() {
			this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
		}, a.prototype.confirm = function(e, t) {
			this.isLoaded = e, this.emitEvent("progress", [this, this.element, t])
		}, o.makeJQueryPlugin = function(t) {
			(t = t || e.jQuery) && ((s = t).fn.imagesLoaded = function(e, t) {
				return new o(this, e, t).jqDeferred.promise(s(this))
			})
		}, o.makeJQueryPlugin(), o
	}),
	function(e, t) {
		"function" == typeof define && define.amd ? define(["flickity/js/index", "fizzy-ui-utils/utils"], t) : "object" == typeof module && module.exports ? module.exports = t(require("flickity"), require("fizzy-ui-utils")) : t(e.Flickity, e.fizzyUIUtils)
	}(window, function(e, t) {
		"use strict";

		function i(e, t, i) {
			this.element = e, this.url = t, this.img = new Image, this.flickity = i, this.load()
		}
		e.createMethods.push("_createBgLazyLoad");
		var n = e.prototype;
		return n._createBgLazyLoad = function() {
			this.on("select", this.bgLazyLoad)
		}, n.bgLazyLoad = function() {
			var e = this.options.bgLazyLoad;
			if (e)
				for (var t = "number" == typeof e ? e : 0, i = this.getAdjacentCellElements(t), n = 0; n < i.length; n++) {
					var o = i[n];
					this.bgLazyLoadElem(o);
					for (var r = o.querySelectorAll("[data-flickity-bg-lazyload]"), a = 0; a < r.length; a++) this.bgLazyLoadElem(r[a])
				}
		}, n.bgLazyLoadElem = function(e) {
			var t = e.getAttribute("data-flickity-bg-lazyload");
			t && new i(e, t, this)
		}, i.prototype.handleEvent = t.handleEvent, i.prototype.load = function() {
			this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url, this.element.removeAttribute("data-flickity-bg-lazyload")
		}, i.prototype.onload = function(e) {
			this.element.style.backgroundImage = "url(" + this.url + ")", this.complete(e, "flickity-bg-lazyloaded")
		}, i.prototype.onerror = function(e) {
			this.complete(e, "flickity-bg-lazyerror")
		}, i.prototype.complete = function(e, t) {
			this.img.removeEventListener("load", this), this.img.removeEventListener("error", this), this.element.classList.add(t), this.flickity.dispatchEvent("bgLazyLoad", e, this.element)
		}, e.BgLazyLoader = i, e
	}),
	function(e) {
		function t(n) {
			if (i[n]) return i[n].exports;
			var o = i[n] = {
				i: n,
				l: !1,
				exports: {}
			};
			return e[n].call(o.exports, o, o.exports, t), o.l = !0, o.exports
		}
		var i = {};
		t.m = e, t.c = i, t.i = function(e) {
			return e
		}, t.d = function(e, i, n) {
			t.o(e, i) || Object.defineProperty(e, i, {
				configurable: !1,
				enumerable: !0,
				get: n
			})
		}, t.n = function(e) {
			var i = e && e.__esModule ? function() {
				return e.default
			} : function() {
				return e
			};
			return t.d(i, "a", i), i
		}, t.o = function(e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}, t.p = "", t(t.s = 21)
	}([function(e, t) {
		e.exports = jQuery
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e) {
			return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
		}

		function r(e) {
			return o(void 0 !== e.constructor.name ? e.constructor.name : e.className)
		}
		i.d(t, "a", function() {
			return c
		});
		var a = i(0),
			s = (i.n(a), i(2)),
			l = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			c = function() {
				function e(t, o) {
					n(this, e), this._setup(t, o);
					var a = r(this);
					this.uuid = i.i(s.a)(6, a), this.$element.attr("data-" + a) || this.$element.attr("data-" + a, this.uuid), this.$element.data("zfPlugin") || this.$element.data("zfPlugin", this), this.$element.trigger("init.zf." + a)
				}
				return l(e, [{
					key: "destroy",
					value: function() {
						this._destroy();
						var e = r(this);
						this.$element.removeAttr("data-" + e).removeData("zfPlugin").trigger("destroyed.zf." + e);
						for (var t in this) this[t] = null
					}
				}]), e
			}()
	}, function(e, t, i) {
		"use strict";

		function n() {
			return "rtl" === s()("html").attr("dir")
		}

		function o(e, t) {
			return e = e || 6, Math.round(Math.pow(36, e + 1) - Math.random() * Math.pow(36, e)).toString(36).slice(1) + (t ? "-" + t : "")
		}

		function r(e) {
			var t, i = {
					transition: "transitionend",
					WebkitTransition: "webkitTransitionEnd",
					MozTransition: "transitionend",
					OTransition: "otransitionend"
				},
				n = document.createElement("div");
			for (var o in i) void 0 !== n.style[o] && (t = i[o]);
			return t || (t = setTimeout(function() {
				e.triggerHandler("transitionend", [e])
			}, 1), "transitionend")
		}
		i.d(t, "c", function() {
			return n
		}), i.d(t, "a", function() {
			return o
		}), i.d(t, "b", function() {
			return r
		});
		var a = i(0),
			s = i.n(a)
	}, function(e, t, i) {
		"use strict";

		function n(e) {
			var t = {};
			return "string" != typeof e ? t : (e = e.trim().slice(1, -1)) ? t = e.split("&").reduce(function(e, t) {
				var i = t.replace(/\+/g, " ").split("="),
					n = i[0],
					o = i[1];
				return n = decodeURIComponent(n), o = void 0 === o ? null : decodeURIComponent(o), e.hasOwnProperty(n) ? Array.isArray(e[n]) ? e[n].push(o) : e[n] = [e[n], o] : e[n] = o, e
			}, {}) : t
		}
		i.d(t, "a", function() {
			return s
		});
		var o = i(0),
			r = i.n(o),
			a = window.matchMedia || function() {
				var e = window.styleMedia || window.media;
				if (!e) {
					var t = document.createElement("style"),
						i = document.getElementsByTagName("script")[0],
						n = null;
					t.type = "text/css", t.id = "matchmediajs-test", i && i.parentNode && i.parentNode.insertBefore(t, i), n = "getComputedStyle" in window && window.getComputedStyle(t, null) || t.currentStyle, e = {
						matchMedium: function(e) {
							var i = "@media " + e + "{ #matchmediajs-test { width: 1px; } }";
							return t.styleSheet ? t.styleSheet.cssText = i : t.textContent = i, "1px" === n.width
						}
					}
				}
				return function(t) {
					return {
						matches: e.matchMedium(t || "all"),
						media: t || "all"
					}
				}
			}(),
			s = {
				queries: [],
				current: "",
				_init: function() {
					var e = this;
					r()("meta.foundation-mq").length || r()('<meta class="foundation-mq">').appendTo(document.head);
					var t;
					t = n(r()(".foundation-mq").css("font-family"));
					for (var i in t) t.hasOwnProperty(i) && e.queries.push({
						name: i,
						value: "only screen and (min-width: " + t[i] + ")"
					});
					this.current = this._getCurrentSize(), this._watcher()
				},
				atLeast: function(e) {
					var t = this.get(e);
					return !!t && a(t).matches
				},
				is: function(e) {
					return (e = e.trim().split(" ")).length > 1 && "only" === e[1] ? e[0] === this._getCurrentSize() : this.atLeast(e[0])
				},
				get: function(e) {
					for (var t in this.queries)
						if (this.queries.hasOwnProperty(t)) {
							var i = this.queries[t];
							if (e === i.name) return i.value
						}
					return null
				},
				_getCurrentSize: function() {
					for (var e, t = 0; t < this.queries.length; t++) {
						var i = this.queries[t];
						a(i.value).matches && (e = i)
					}
					return "object" == typeof e ? e.name : e
				},
				_watcher: function() {
					var e = this;
					r()(window).off("resize.zf.mediaquery").on("resize.zf.mediaquery", function() {
						var t = e._getCurrentSize(),
							i = e.current;
						t !== i && (e.current = t, r()(window).trigger("changed.zf.mediaquery", [t, i]))
					})
				}
			}
	}, function(e, t, i) {
		"use strict";

		function n(e, t, i) {
			var n = void 0,
				o = Array.prototype.slice.call(arguments, 3);
			r()(window).off(t).on(t, function(t) {
				n && clearTimeout(n), n = setTimeout(function() {
					i.apply(null, o)
				}, e || 10)
			})
		}
		i.d(t, "a", function() {
			return c
		});
		var o = i(0),
			r = i.n(o),
			a = i(6),
			s = function() {
				for (var e = ["WebKit", "Moz", "O", "Ms", ""], t = 0; t < e.length; t++)
					if (e[t] + "MutationObserver" in window) return window[e[t] + "MutationObserver"];
				return !1
			}(),
			l = function(e, t) {
				e.data(t).split(" ").forEach(function(i) {
					r()("#" + i)["close" === t ? "trigger" : "triggerHandler"](t + ".zf.trigger", [e])
				})
			},
			c = {
				Listeners: {
					Basic: {},
					Global: {}
				},
				Initializers: {}
			};
		c.Listeners.Basic = {
			openListener: function() {
				l(r()(this), "open")
			},
			closeListener: function() {
				r()(this).data("close") ? l(r()(this), "close") : r()(this).trigger("close.zf.trigger")
			},
			toggleListener: function() {
				r()(this).data("toggle") ? l(r()(this), "toggle") : r()(this).trigger("toggle.zf.trigger")
			},
			closeableListener: function(e) {
				e.stopPropagation();
				var t = r()(this).data("closable");
				"" !== t ? a.a.animateOut(r()(this), t, function() {
					r()(this).trigger("closed.zf")
				}) : r()(this).fadeOut().trigger("closed.zf")
			},
			toggleFocusListener: function() {
				var e = r()(this).data("toggle-focus");
				r()("#" + e).triggerHandler("toggle.zf.trigger", [r()(this)])
			}
		}, c.Initializers.addOpenListener = function(e) {
			e.off("click.zf.trigger", c.Listeners.Basic.openListener), e.on("click.zf.trigger", "[data-open]", c.Listeners.Basic.openListener)
		}, c.Initializers.addCloseListener = function(e) {
			e.off("click.zf.trigger", c.Listeners.Basic.closeListener), e.on("click.zf.trigger", "[data-close]", c.Listeners.Basic.closeListener)
		}, c.Initializers.addToggleListener = function(e) {
			e.off("click.zf.trigger", c.Listeners.Basic.toggleListener), e.on("click.zf.trigger", "[data-toggle]", c.Listeners.Basic.toggleListener)
		}, c.Initializers.addCloseableListener = function(e) {
			e.off("close.zf.trigger", c.Listeners.Basic.closeableListener), e.on("close.zf.trigger", "[data-closeable], [data-closable]", c.Listeners.Basic.closeableListener)
		}, c.Initializers.addToggleFocusListener = function(e) {
			e.off("focus.zf.trigger blur.zf.trigger", c.Listeners.Basic.toggleFocusListener), e.on("focus.zf.trigger blur.zf.trigger", "[data-toggle-focus]", c.Listeners.Basic.toggleFocusListener)
		}, c.Listeners.Global = {
			resizeListener: function(e) {
				s || e.each(function() {
					r()(this).triggerHandler("resizeme.zf.trigger")
				}), e.attr("data-events", "resize")
			},
			scrollListener: function(e) {
				s || e.each(function() {
					r()(this).triggerHandler("scrollme.zf.trigger")
				}), e.attr("data-events", "scroll")
			},
			closeMeListener: function(e, t) {
				var i = e.namespace.split(".")[0];
				r()("[data-" + i + "]").not('[data-yeti-box="' + t + '"]').each(function() {
					var e = r()(this);
					e.triggerHandler("close.zf.trigger", [e])
				})
			}
		}, c.Initializers.addClosemeListener = function(e) {
			var t = r()("[data-yeti-box]"),
				i = ["dropdown", "tooltip", "reveal"];
			if (e && ("string" == typeof e ? i.push(e) : "object" == typeof e && "string" == typeof e[0] && i.concat(e)), t.length) {
				var n = i.map(function(e) {
					return "closeme.zf." + e
				}).join(" ");
				r()(window).off(n).on(n, c.Listeners.Global.closeMeListener)
			}
		}, c.Initializers.addResizeListener = function(e) {
			var t = r()("[data-resize]");
			t.length && n(e, "resize.zf.trigger", c.Listeners.Global.resizeListener, t)
		}, c.Initializers.addScrollListener = function(e) {
			var t = r()("[data-scroll]");
			t.length && n(e, "scroll.zf.trigger", c.Listeners.Global.scrollListener, t)
		}, c.Initializers.addMutationEventsListener = function(e) {
			if (!s) return !1;
			var t = e.find("[data-resize], [data-scroll], [data-mutate]");
			if (t.length)
				for (var i = 0; i <= t.length - 1; i++) new s(function(e) {
					var t = r()(e[0].target);
					switch (e[0].type) {
						case "attributes":
							"scroll" === t.attr("data-events") && "data-events" === e[0].attributeName && t.triggerHandler("scrollme.zf.trigger", [t, window.pageYOffset]), "resize" === t.attr("data-events") && "data-events" === e[0].attributeName && t.triggerHandler("resizeme.zf.trigger", [t]), "style" === e[0].attributeName && (t.closest("[data-mutate]").attr("data-events", "mutate"), t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger", [t.closest("[data-mutate]")]));
							break;
						case "childList":
							t.closest("[data-mutate]").attr("data-events", "mutate"), t.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger", [t.closest("[data-mutate]")]);
							break;
						default:
							return !1
					}
				}).observe(t[i], {
					attributes: !0,
					childList: !0,
					characterData: !1,
					subtree: !0,
					attributeFilter: ["data-events", "style"]
				})
		}, c.Initializers.addSimpleListeners = function() {
			var e = r()(document);
			c.Initializers.addOpenListener(e), c.Initializers.addCloseListener(e), c.Initializers.addToggleListener(e), c.Initializers.addCloseableListener(e), c.Initializers.addToggleFocusListener(e)
		}, c.Initializers.addGlobalListeners = function() {
			var e = r()(document);
			c.Initializers.addMutationEventsListener(e), c.Initializers.addResizeListener(), c.Initializers.addScrollListener(), c.Initializers.addClosemeListener()
		}, c.init = function(e, t) {
			void 0 === e.triggersInitialized && (e(document), "complete" === document.readyState ? (c.Initializers.addSimpleListeners(), c.Initializers.addGlobalListeners()) : e(window).on("load", function() {
				c.Initializers.addSimpleListeners(), c.Initializers.addGlobalListeners()
			}), e.triggersInitialized = !0), t && (t.Triggers = c, t.IHearYou = c.Initializers.addGlobalListeners)
		}
	}, function(e, t, i) {
		"use strict";

		function n(e) {
			return !!e && e.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter(function() {
				return !(!a()(this).is(":visible") || a()(this).attr("tabindex") < 0)
			})
		}

		function o(e) {
			var t = l[e.which || e.keyCode] || String.fromCharCode(e.which).toUpperCase();
			return t = t.replace(/\W+/, ""), e.shiftKey && (t = "SHIFT_" + t), e.ctrlKey && (t = "CTRL_" + t), e.altKey && (t = "ALT_" + t), t = t.replace(/_$/, "")
		}
		i.d(t, "a", function() {
			return u
		});
		var r = i(0),
			a = i.n(r),
			s = i(2),
			l = {
				9: "TAB",
				13: "ENTER",
				27: "ESCAPE",
				32: "SPACE",
				35: "END",
				36: "HOME",
				37: "ARROW_LEFT",
				38: "ARROW_UP",
				39: "ARROW_RIGHT",
				40: "ARROW_DOWN"
			},
			c = {},
			u = {
				keys: function(e) {
					var t = {};
					for (var i in e) t[e[i]] = e[i];
					return t
				}(l),
				parseKey: o,
				handleKey: function(e, t, n) {
					var o, r, l, u = c[t],
						h = this.parseKey(e);
					if (u)
						if (o = void 0 === u.ltr ? u : i.i(s.c)() ? a.a.extend({}, u.ltr, u.rtl) : a.a.extend({}, u.rtl, u.ltr), r = o[h], (l = n[r]) && "function" == typeof l) {
							var d = l.apply();
							(n.handled || "function" == typeof n.handled) && n.handled(d)
						}
					else(n.unhandled || "function" == typeof n.unhandled) && n.unhandled()
				},
				findFocusable: n,
				register: function(e, t) {
					c[e] = t
				},
				trapFocus: function(e) {
					var t = n(e),
						i = t.eq(0),
						r = t.eq(-1);
					e.on("keydown.zf.trapfocus", function(e) {
						e.target === r[0] && "TAB" === o(e) ? (e.preventDefault(), i.focus()) : e.target === i[0] && "SHIFT_TAB" === o(e) && (e.preventDefault(), r.focus())
					})
				},
				releaseFocus: function(e) {
					e.off("keydown.zf.trapfocus")
				}
			}
	}, function(e, t, i) {
		"use strict";

		function n(e, t, n, o) {
			function c() {
				t[0].style.transitionDuration = 0, t.removeClass(u + " " + h + " " + n)
			}
			if ((t = r()(t).eq(0)).length) {
				var u = e ? s[0] : s[1],
					h = e ? l[0] : l[1];
				c(), t.addClass(n).css("transition", "none"), requestAnimationFrame(function() {
					t.addClass(u), e && t.show()
				}), requestAnimationFrame(function() {
					t[0].offsetWidth, t.css("transition", "").addClass(h)
				}), t.one(i.i(a.b)(t), function() {
					e || t.hide(), c(), o && o.apply(t)
				})
			}
		}
		i.d(t, "a", function() {
			return c
		});
		var o = i(0),
			r = i.n(o),
			a = i(2),
			s = ["mui-enter", "mui-leave"],
			l = ["mui-enter-active", "mui-leave-active"],
			c = {
				animateIn: function(e, t, i) {
					n(!0, e, t, i)
				},
				animateOut: function(e, t, i) {
					n(!1, e, t, i)
				}
			}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return d
		});
		var a = i(0),
			s = i.n(a),
			l = i(5),
			c = i(2),
			u = i(1),
			h = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			d = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, u.a), h(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = s.a.extend({}, t.defaults, this.$element.data(), i), this.className = "Accordion", this._init(), l.a.register("Accordion", {
							ENTER: "toggle",
							SPACE: "toggle",
							ARROW_DOWN: "next",
							ARROW_UP: "previous"
						})
					}
				}, {
					key: "_init",
					value: function() {
						var e = this;
						this.$element.attr("role", "tablist"), this.$tabs = this.$element.children("[data-accordion-item]"), this.$tabs.each(function(e, t) {
							var n = s()(t),
								o = n.children("[data-tab-content]"),
								r = o[0].id || i.i(c.a)(6, "accordion"),
								a = t.id || r + "-label";
							n.find("a:first").attr({
								"aria-controls": r,
								role: "tab",
								id: a,
								"aria-expanded": !1,
								"aria-selected": !1
							}), o.attr({
								role: "tabpanel",
								"aria-labelledby": a,
								"aria-hidden": !0,
								id: r
							})
						});
						var t = this.$element.find(".is-active").children("[data-tab-content]");
						this.firstTimeInit = !0, t.length && (this.down(t, this.firstTimeInit), this.firstTimeInit = !1), this._checkDeepLink = function() {
							var t = window.location.hash;
							if (t.length) {
								var i = e.$element.find('[href$="' + t + '"]'),
									n = s()(t);
								if (i.length && n) {
									if (i.parent("[data-accordion-item]").hasClass("is-active") || (e.down(n, e.firstTimeInit), e.firstTimeInit = !1), e.options.deepLinkSmudge) {
										var o = e;
										s()(window).load(function() {
											var e = o.$element.offset();
											s()("html, body").animate({
												scrollTop: e.top
											}, o.options.deepLinkSmudgeDelay)
										})
									}
									e.$element.trigger("deeplink.zf.accordion", [i, n])
								}
							}
						}, this.options.deepLink && this._checkDeepLink(), this._events()
					}
				}, {
					key: "_events",
					value: function() {
						var e = this;
						this.$tabs.each(function() {
							var t = s()(this),
								i = t.children("[data-tab-content]");
							i.length && t.children("a").off("click.zf.accordion keydown.zf.accordion").on("click.zf.accordion", function(t) {
								t.preventDefault(), e.toggle(i)
							}).on("keydown.zf.accordion", function(n) {
								l.a.handleKey(n, "Accordion", {
									toggle: function() {
										e.toggle(i)
									},
									next: function() {
										var i = t.next().find("a").focus();
										e.options.multiExpand || i.trigger("click.zf.accordion")
									},
									previous: function() {
										var i = t.prev().find("a").focus();
										e.options.multiExpand || i.trigger("click.zf.accordion")
									},
									handled: function() {
										n.preventDefault(), n.stopPropagation()
									}
								})
							})
						}), this.options.deepLink && s()(window).on("popstate", this._checkDeepLink)
					}
				}, {
					key: "toggle",
					value: function(e) {
						if (!e.closest("[data-accordion]").is("[disabled]") && (e.parent().hasClass("is-active") ? this.up(e) : this.down(e), this.options.deepLink)) {
							var t = e.prev("a").attr("href");
							this.options.updateHistory ? history.pushState({}, "", t) : history.replaceState({}, "", t)
						}
					}
				}, {
					key: "down",
					value: function(e, t) {
						var i = this;
						if (!e.closest("[data-accordion]").is("[disabled]") || t) {
							if (e.attr("aria-hidden", !1).parent("[data-tab-content]").addBack().parent().addClass("is-active"), !this.options.multiExpand && !t) {
								var n = this.$element.children(".is-active").children("[data-tab-content]");
								n.length && this.up(n.not(e))
							}
							e.slideDown(this.options.slideSpeed, function() {
								i.$element.trigger("down.zf.accordion", [e])
							}), s()("#" + e.attr("aria-labelledby")).attr({
								"aria-expanded": !0,
								"aria-selected": !0
							})
						}
					}
				}, {
					key: "up",
					value: function(e) {
						if (!e.closest("[data-accordion]").is("[disabled]")) {
							var t = e.parent().siblings(),
								i = this;
							(this.options.allowAllClosed || t.hasClass("is-active")) && e.parent().hasClass("is-active") && (e.slideUp(i.options.slideSpeed, function() {
								i.$element.trigger("up.zf.accordion", [e])
							}), e.attr("aria-hidden", !0).parent().removeClass("is-active"), s()("#" + e.attr("aria-labelledby")).attr({
								"aria-expanded": !1,
								"aria-selected": !1
							}))
						}
					}
				}, {
					key: "_destroy",
					value: function() {
						this.$element.find("[data-tab-content]").stop(!0).slideUp(0).css("display", ""), this.$element.find("a").off(".zf.accordion"), this.options.deepLink && s()(window).off("popstate", this._checkDeepLink)
					}
				}]), t
			}();
		d.defaults = {
			slideSpeed: 250,
			multiExpand: !1,
			allowAllClosed: !1,
			deepLink: !1,
			deepLinkSmudge: !1,
			deepLinkSmudgeDelay: 300,
			updateHistory: !1
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return d
		});
		var a = i(0),
			s = i.n(a),
			l = i(5),
			c = i(9),
			u = i(1),
			h = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			d = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, u.a), h(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = s.a.extend({}, t.defaults, this.$element.data(), i), this.className = "Tabs", this._init(), l.a.register("Tabs", {
							ENTER: "open",
							SPACE: "open",
							ARROW_RIGHT: "next",
							ARROW_UP: "previous",
							ARROW_DOWN: "next",
							ARROW_LEFT: "previous"
						})
					}
				}, {
					key: "_init",
					value: function() {
						var e = this,
							t = this;
						if (this.$element.attr({
								role: "tablist"
							}), this.$tabTitles = this.$element.find("." + this.options.linkClass), this.$tabContent = s()('[data-tabs-content="' + this.$element[0].id + '"]'), this.$tabTitles.each(function() {
								var e = s()(this),
									i = e.find("a"),
									n = e.hasClass("" + t.options.linkActiveClass),
									o = i.attr("data-tabs-target") || i[0].hash.slice(1),
									r = i[0].id ? i[0].id : o + "-label",
									a = s()("#" + o);
								e.attr({
									role: "presentation"
								}), i.attr({
									role: "tab",
									"aria-controls": o,
									"aria-selected": n,
									id: r,
									tabindex: n ? "0" : "-1"
								}), a.attr({
									role: "tabpanel",
									"aria-labelledby": r
								}), n || a.attr("aria-hidden", "true"), n && t.options.autoFocus && s()(window).load(function() {
									s()("html, body").animate({
										scrollTop: e.offset().top
									}, t.options.deepLinkSmudgeDelay, function() {
										i.focus()
									})
								})
							}), this.options.matchHeight) {
							var n = this.$tabContent.find("img");
							n.length ? i.i(c.a)(n, this._setHeight.bind(this)) : this._setHeight()
						}
						this._checkDeepLink = function() {
							var t = window.location.hash;
							if (t.length) {
								var i = e.$element.find('[href$="' + t + '"]');
								if (i.length) {
									if (e.selectTab(s()(t), !0), e.options.deepLinkSmudge) {
										var n = e.$element.offset();
										s()("html, body").animate({
											scrollTop: n.top
										}, e.options.deepLinkSmudgeDelay)
									}
									e.$element.trigger("deeplink.zf.tabs", [i, s()(t)])
								}
							}
						}, this.options.deepLink && this._checkDeepLink(), this._events()
					}
				}, {
					key: "_events",
					value: function() {
						this._addKeyHandler(), this._addClickHandler(), this._setHeightMqHandler = null, this.options.matchHeight && (this._setHeightMqHandler = this._setHeight.bind(this), s()(window).on("changed.zf.mediaquery", this._setHeightMqHandler)), this.options.deepLink && s()(window).on("popstate", this._checkDeepLink)
					}
				}, {
					key: "_addClickHandler",
					value: function() {
						var e = this;
						this.$element.off("click.zf.tabs").on("click.zf.tabs", "." + this.options.linkClass, function(t) {
							t.preventDefault(), t.stopPropagation(), e._handleTabChange(s()(this))
						})
					}
				}, {
					key: "_addKeyHandler",
					value: function() {
						var e = this;
						this.$tabTitles.off("keydown.zf.tabs").on("keydown.zf.tabs", function(t) {
							if (9 !== t.which) {
								var i, n, o = s()(this),
									r = o.parent("ul").children("li");
								r.each(function(t) {
									s()(this).is(o) && (e.options.wrapOnKeys ? (i = 0 === t ? r.last() : r.eq(t - 1), n = t === r.length - 1 ? r.first() : r.eq(t + 1)) : (i = r.eq(Math.max(0, t - 1)), n = r.eq(Math.min(t + 1, r.length - 1))))
								}), l.a.handleKey(t, "Tabs", {
									open: function() {
										o.find('[role="tab"]').focus(), e._handleTabChange(o)
									},
									previous: function() {
										i.find('[role="tab"]').focus(), e._handleTabChange(i)
									},
									next: function() {
										n.find('[role="tab"]').focus(), e._handleTabChange(n)
									},
									handled: function() {
										t.stopPropagation(), t.preventDefault()
									}
								})
							}
						})
					}
				}, {
					key: "_handleTabChange",
					value: function(e, t) {
						if (e.hasClass("" + this.options.linkActiveClass)) this.options.activeCollapse && (this._collapseTab(e), this.$element.trigger("collapse.zf.tabs", [e]));
						else {
							var i = this.$element.find("." + this.options.linkClass + "." + this.options.linkActiveClass),
								n = e.find('[role="tab"]'),
								o = n.attr("data-tabs-target") || n[0].hash.slice(1),
								r = this.$tabContent.find("#" + o);
							if (this._collapseTab(i), this._openTab(e), this.options.deepLink && !t) {
								var a = e.find("a").attr("href");
								this.options.updateHistory ? history.pushState({}, "", a) : history.replaceState({}, "", a)
							}
							this.$element.trigger("change.zf.tabs", [e, r]), r.find("[data-mutate]").trigger("mutateme.zf.trigger")
						}
					}
				}, {
					key: "_openTab",
					value: function(e) {
						var t = e.find('[role="tab"]'),
							i = t.attr("data-tabs-target") || t[0].hash.slice(1),
							n = this.$tabContent.find("#" + i);
						e.addClass("" + this.options.linkActiveClass), t.attr({
							"aria-selected": "true",
							tabindex: "0"
						}), n.addClass("" + this.options.panelActiveClass).removeAttr("aria-hidden")
					}
				}, {
					key: "_collapseTab",
					value: function(e) {
						var t = e.removeClass("" + this.options.linkActiveClass).find('[role="tab"]').attr({
							"aria-selected": "false",
							tabindex: -1
						});
						s()("#" + t.attr("aria-controls")).removeClass("" + this.options.panelActiveClass).attr({
							"aria-hidden": "true"
						})
					}
				}, {
					key: "selectTab",
					value: function(e, t) {
						var i;
						(i = "object" == typeof e ? e[0].id : e).indexOf("#") < 0 && (i = "#" + i);
						var n = this.$tabTitles.find('[href$="' + i + '"]').parent("." + this.options.linkClass);
						this._handleTabChange(n, t)
					}
				}, {
					key: "_setHeight",
					value: function() {
						var e = 0,
							t = this;
						this.$tabContent.find("." + this.options.panelClass).css("height", "").each(function() {
							var i = s()(this),
								n = i.hasClass("" + t.options.panelActiveClass);
							n || i.css({
								visibility: "hidden",
								display: "block"
							});
							var o = this.getBoundingClientRect().height;
							n || i.css({
								visibility: "",
								display: ""
							}), e = o > e ? o : e
						}).css("height", e + "px")
					}
				}, {
					key: "_destroy",
					value: function() {
						this.$element.find("." + this.options.linkClass).off(".zf.tabs").hide().end().find("." + this.options.panelClass).hide(), this.options.matchHeight && null != this._setHeightMqHandler && s()(window).off("changed.zf.mediaquery", this._setHeightMqHandler), this.options.deepLink && s()(window).off("popstate", this._checkDeepLink)
					}
				}]), t
			}();
		d.defaults = {
			deepLink: !1,
			deepLinkSmudge: !1,
			deepLinkSmudgeDelay: 300,
			updateHistory: !1,
			autoFocus: !1,
			wrapOnKeys: !0,
			matchHeight: !1,
			activeCollapse: !1,
			linkClass: "tabs-title",
			linkActiveClass: "is-active",
			panelClass: "tabs-panel",
			panelActiveClass: "is-active"
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			function i() {
				0 == --n && t()
			}
			var n = e.length;
			0 === n && t(), e.each(function() {
				if (this.complete && void 0 !== this.naturalWidth) i();
				else {
					var e = new Image,
						t = "load.zf.images error.zf.images";
					r()(e).one(t, function e(n) {
						r()(this).off(t, e), i()
					}), e.src = r()(this).attr("src")
				}
			})
		}
		i.d(t, "a", function() {
			return n
		});
		var o = i(0),
			r = i.n(o)
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return u
		});
		var a = i(0),
			s = i.n(a),
			l = i(1),
			c = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			u = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, l.a), c(t, [{
					key: "_setup",
					value: function(e) {
						var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
						this.$element = e, this.options = s.a.extend(!0, {}, t.defaults, this.$element.data(), i), this.className = "Abide", this._init()
					}
				}, {
					key: "_init",
					value: function() {
						this.$inputs = this.$element.find("input, textarea, select"), this._events()
					}
				}, {
					key: "_events",
					value: function() {
						var e = this;
						this.$element.off(".abide").on("reset.zf.abide", function() {
							e.resetForm()
						}).on("submit.zf.abide", function() {
							return e.validateForm()
						}), "fieldChange" === this.options.validateOn && this.$inputs.off("change.zf.abide").on("change.zf.abide", function(t) {
							e.validateInput(s()(t.target))
						}), this.options.liveValidate && this.$inputs.off("input.zf.abide").on("input.zf.abide", function(t) {
							e.validateInput(s()(t.target))
						}), this.options.validateOnBlur && this.$inputs.off("blur.zf.abide").on("blur.zf.abide", function(t) {
							e.validateInput(s()(t.target))
						})
					}
				}, {
					key: "_reflow",
					value: function() {
						this._init()
					}
				}, {
					key: "requiredCheck",
					value: function(e) {
						if (!e.attr("required")) return !0;
						var t = !0;
						switch (e[0].type) {
							case "checkbox":
								t = e[0].checked;
								break;
							case "select":
							case "select-one":
							case "select-multiple":
								var i = e.find("option:selected");
								i.length && i.val() || (t = !1);
								break;
							default:
								e.val() && e.val().length || (t = !1)
						}
						return t
					}
				}, {
					key: "findFormError",
					value: function(e) {
						var t = e[0].id,
							i = e.siblings(this.options.formErrorSelector);
						return i.length || (i = e.parent().find(this.options.formErrorSelector)), i = i.add(this.$element.find('[data-form-error-for="' + t + '"]'))
					}
				}, {
					key: "findLabel",
					value: function(e) {
						var t = e[0].id,
							i = this.$element.find('label[for="' + t + '"]');
						return i.length ? i : e.closest("label")
					}
				}, {
					key: "findRadioLabels",
					value: function(e) {
						var t = this,
							i = e.map(function(e, i) {
								var n = i.id,
									o = t.$element.find('label[for="' + n + '"]');
								return o.length || (o = s()(i).closest("label")), o[0]
							});
						return s()(i)
					}
				}, {
					key: "addErrorClasses",
					value: function(e) {
						var t = this.findLabel(e),
							i = this.findFormError(e);
						t.length && t.addClass(this.options.labelErrorClass), i.length && i.addClass(this.options.formErrorClass), e.addClass(this.options.inputErrorClass).attr("data-invalid", "")
					}
				}, {
					key: "removeRadioErrorClasses",
					value: function(e) {
						var t = this.$element.find(':radio[name="' + e + '"]'),
							i = this.findRadioLabels(t),
							n = this.findFormError(t);
						i.length && i.removeClass(this.options.labelErrorClass), n.length && n.removeClass(this.options.formErrorClass), t.removeClass(this.options.inputErrorClass).removeAttr("data-invalid")
					}
				}, {
					key: "removeErrorClasses",
					value: function(e) {
						if ("radio" == e[0].type) return this.removeRadioErrorClasses(e.attr("name"));
						var t = this.findLabel(e),
							i = this.findFormError(e);
						t.length && t.removeClass(this.options.labelErrorClass), i.length && i.removeClass(this.options.formErrorClass), e.removeClass(this.options.inputErrorClass).removeAttr("data-invalid")
					}
				}, {
					key: "validateInput",
					value: function(e) {
						var t = this,
							i = this.requiredCheck(e),
							n = !1,
							o = !0,
							r = e.attr("data-validator"),
							a = !0;
						if (e.is("[data-abide-ignore]") || e.is('[type="hidden"]') || e.is("[disabled]")) return !0;
						switch (e[0].type) {
							case "radio":
								n = this.validateRadio(e.attr("name"));
								break;
							case "checkbox":
								n = i;
								break;
							case "select":
							case "select-one":
							case "select-multiple":
								n = i;
								break;
							default:
								n = this.validateText(e)
						}
						r && (o = this.matchValidation(e, r, e.attr("required"))), e.attr("data-equalto") && (a = this.options.validators.equalTo(e));
						var l = -1 === [i, n, o, a].indexOf(!1),
							c = (l ? "valid" : "invalid") + ".zf.abide";
						if (l) {
							var u = this.$element.find('[data-equalto="' + e.attr("id") + '"]');
							u.length && function() {
								var e = t;
								u.each(function() {
									s()(this).val() && e.validateInput(s()(this))
								})
							}()
						}
						return this[l ? "removeErrorClasses" : "addErrorClasses"](e), e.trigger(c, [e]), l
					}
				}, {
					key: "validateForm",
					value: function() {
						var e = [],
							t = this;
						this.$inputs.each(function() {
							e.push(t.validateInput(s()(this)))
						});
						var i = -1 === e.indexOf(!1);
						return this.$element.find("[data-abide-error]").css("display", i ? "none" : "block"), this.$element.trigger((i ? "formvalid" : "forminvalid") + ".zf.abide", [this.$element]), i
					}
				}, {
					key: "validateText",
					value: function(e, t) {
						t = t || e.attr("pattern") || e.attr("type");
						var i = e.val(),
							n = !1;
						return i.length ? n = this.options.patterns.hasOwnProperty(t) ? this.options.patterns[t].test(i) : t === e.attr("type") || new RegExp(t).test(i) : e.prop("required") || (n = !0), n
					}
				}, {
					key: "validateRadio",
					value: function(e) {
						var t = this.$element.find(':radio[name="' + e + '"]'),
							i = !1,
							n = !1;
						return t.each(function(e, t) {
							s()(t).attr("required") && (n = !0)
						}), n || (i = !0), i || t.each(function(e, t) {
							s()(t).prop("checked") && (i = !0)
						}), i
					}
				}, {
					key: "matchValidation",
					value: function(e, t, i) {
						var n = this;
						return i = !!i, -1 === t.split(" ").map(function(t) {
							return n.options.validators[t](e, i, e.parent())
						}).indexOf(!1)
					}
				}, {
					key: "resetForm",
					value: function() {
						var e = this.$element,
							t = this.options;
						s()("." + t.labelErrorClass, e).not("small").removeClass(t.labelErrorClass), s()("." + t.inputErrorClass, e).not("small").removeClass(t.inputErrorClass), s()(t.formErrorSelector + "." + t.formErrorClass).removeClass(t.formErrorClass), e.find("[data-abide-error]").css("display", "none"), s()(":input", e).not(":button, :submit, :reset, :hidden, :radio, :checkbox, [data-abide-ignore]").val("").removeAttr("data-invalid"), s()(":input:radio", e).not("[data-abide-ignore]").prop("checked", !1).removeAttr("data-invalid"), s()(":input:checkbox", e).not("[data-abide-ignore]").prop("checked", !1).removeAttr("data-invalid"), e.trigger("formreset.zf.abide", [e])
					}
				}, {
					key: "_destroy",
					value: function() {
						var e = this;
						this.$element.off(".abide").find("[data-abide-error]").css("display", "none"), this.$inputs.off(".abide").each(function() {
							e.removeErrorClasses(s()(this))
						})
					}
				}]), t
			}();
		u.defaults = {
			validateOn: "fieldChange",
			labelErrorClass: "is-invalid-label",
			inputErrorClass: "is-invalid-input",
			formErrorSelector: ".form-error",
			formErrorClass: "is-visible",
			liveValidate: !1,
			validateOnBlur: !1,
			patterns: {
				alpha: /^[a-zA-Z]+$/,
				alpha_numeric: /^[a-zA-Z0-9]+$/,
				integer: /^[-+]?\d+$/,
				number: /^[-+]?\d*(?:[\.\,]\d+)?$/,
				card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(?:222[1-9]|2[3-6][0-9]{2}|27[0-1][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
				cvv: /^([0-9]){3,4}$/,
				email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
				url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
				domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,
				datetime: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
				date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
				time: /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
				dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
				month_day_year: /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
				day_month_year: /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,
				color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
				website: {
					test: function(e) {
						return u.defaults.patterns.domain.test(e) || u.defaults.patterns.url.test(e)
					}
				}
			},
			validators: {
				equalTo: function(e, t, i) {
					return s()("#" + e.attr("data-equalto")).val() === e.val()
				}
			}
		}
	}, function(e, t, i) {
		"use strict";

		function n(e) {
			if (void 0 === Function.prototype.name) {
				var t = /function\s([^(]{1,})\(/.exec(e.toString());
				return t && t.length > 1 ? t[1].trim() : ""
			}
			return void 0 === e.prototype ? e.constructor.name : e.prototype.constructor.name
		}

		function o(e) {
			return "true" === e || "false" !== e && (isNaN(1 * e) ? e : parseFloat(e))
		}

		function r(e) {
			return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
		}
		i.d(t, "a", function() {
			return u
		});
		var a = i(0),
			s = i.n(a),
			l = i(2),
			c = i(3),
			u = {
				version: "6.4.2",
				_plugins: {},
				_uuids: [],
				plugin: function(e, t) {
					var i = t || n(e),
						o = r(i);
					this._plugins[o] = this[i] = e
				},
				registerPlugin: function(e, t) {
					var o = t ? r(t) : n(e.constructor).toLowerCase();
					e.uuid = i.i(l.a)(6, o), e.$element.attr("data-" + o) || e.$element.attr("data-" + o, e.uuid), e.$element.data("zfPlugin") || e.$element.data("zfPlugin", e), e.$element.trigger("init.zf." + o), this._uuids.push(e.uuid)
				},
				unregisterPlugin: function(e) {
					var t = r(n(e.$element.data("zfPlugin").constructor));
					this._uuids.splice(this._uuids.indexOf(e.uuid), 1), e.$element.removeAttr("data-" + t).removeData("zfPlugin").trigger("destroyed.zf." + t);
					for (var i in e) e[i] = null
				},
				reInit: function(e) {
					var t = e instanceof s.a;
					try {
						if (t) e.each(function() {
							s()(this).data("zfPlugin")._init()
						});
						else {
							var i = this;
							({
								object: function(e) {
									e.forEach(function(e) {
										e = r(e), s()("[data-" + e + "]").foundation("_init")
									})
								},
								string: function() {
									e = r(e), s()("[data-" + e + "]").foundation("_init")
								},
								undefined: function() {
									this.object(Object.keys(i._plugins))
								}
							})[typeof e](e)
						}
					}
					catch (e) {}
					finally {
						return e
					}
				},
				reflow: function(e, t) {
					void 0 === t ? t = Object.keys(this._plugins) : "string" == typeof t && (t = [t]);
					var i = this;
					s.a.each(t, function(t, n) {
						var r = i._plugins[n];
						s()(e).find("[data-" + n + "]").addBack("[data-" + n + "]").each(function() {
							var e = s()(this),
								t = {};
							if (!e.data("zfPlugin")) {
								e.attr("data-options") && e.attr("data-options").split(";").forEach(function(e, i) {
									var n = e.split(":").map(function(e) {
										return e.trim()
									});
									n[0] && (t[n[0]] = o(n[1]))
								});
								try {
									e.data("zfPlugin", new r(s()(this), t))
								}
								catch (e) {}
								finally {
									return
								}
							}
						})
					})
				},
				getFnName: n,
				addToJquery: function(e) {
					return e.fn.foundation = function(t) {
						var i = typeof t,
							o = e(".no-js");
						if (o.length && o.removeClass("no-js"), "undefined" === i) c.a._init(), u.reflow(this);
						else {
							if ("string" !== i) throw new TypeError("We're sorry, " + i + " is not a valid parameter. You must use a string representing the method you wish to invoke.");
							var r = Array.prototype.slice.call(arguments, 1),
								a = this.data("zfPlugin");
							if (void 0 === a || void 0 === a[t]) throw new ReferenceError("We're sorry, '" + t + "' is not an available method for " + (a ? n(a) : "this element") + ".");
							1 === this.length ? a[t].apply(a, r) : this.each(function(i, n) {
								a[t].apply(e(n).data("zfPlugin"), r)
							})
						}
						return this
					}, e
				}
			};
		u.util = {
				throttle: function(e, t) {
					var i = null;
					return function() {
						var n = this,
							o = arguments;
						null === i && (i = setTimeout(function() {
							e.apply(n, o), i = null
						}, t))
					}
				}
			}, window.Foundation = u,
			function() {
				Date.now && window.Date.now || (window.Date.now = Date.now = function() {
					return (new Date).getTime()
				});
				for (var e = ["webkit", "moz"], t = 0; t < e.length && !window.requestAnimationFrame; ++t) {
					var i = e[t];
					window.requestAnimationFrame = window[i + "RequestAnimationFrame"], window.cancelAnimationFrame = window[i + "CancelAnimationFrame"] || window[i + "CancelRequestAnimationFrame"]
				}
				if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
					var n = 0;
					window.requestAnimationFrame = function(e) {
						var t = Date.now(),
							i = Math.max(n + 16, t);
						return setTimeout(function() {
							e(n = i)
						}, i - t)
					}, window.cancelAnimationFrame = clearTimeout
				}
				window.performance && window.performance.now || (window.performance = {
					start: Date.now(),
					now: function() {
						return Date.now() - this.start
					}
				})
			}(), Function.prototype.bind || (Function.prototype.bind = function(e) {
				if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
				var t = Array.prototype.slice.call(arguments, 1),
					i = this,
					n = function() {},
					o = function() {
						return i.apply(this instanceof n ? this : e, t.concat(Array.prototype.slice.call(arguments)))
					};
				return this.prototype && (n.prototype = this.prototype), o.prototype = new n, o
			})
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return p
		});
		var a = i(0),
			s = i.n(a),
			l = i(3),
			c = i(9),
			u = i(2),
			h = i(1),
			d = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			p = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, h.a), d(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = s.a.extend({}, t.defaults, this.$element.data(), i), this.className = "Equalizer", this._init()
					}
				}, {
					key: "_init",
					value: function() {
						var e = this.$element.attr("data-equalizer") || "",
							t = this.$element.find('[data-equalizer-watch="' + e + '"]');
						l.a._init(), this.$watched = t.length ? t : this.$element.find("[data-equalizer-watch]"), this.$element.attr("data-resize", e || i.i(u.a)(6, "eq")), this.$element.attr("data-mutate", e || i.i(u.a)(6, "eq")), this.hasNested = this.$element.find("[data-equalizer]").length > 0, this.isNested = this.$element.parentsUntil(document.body, "[data-equalizer]").length > 0, this.isOn = !1, this._bindHandler = {
							onResizeMeBound: this._onResizeMe.bind(this),
							onPostEqualizedBound: this._onPostEqualized.bind(this)
						};
						var n, o = this.$element.find("img");
						this.options.equalizeOn ? (n = this._checkMQ(), s()(window).on("changed.zf.mediaquery", this._checkMQ.bind(this))) : this._events(), (void 0 !== n && !1 === n || void 0 === n) && (o.length ? i.i(c.a)(o, this._reflow.bind(this)) : this._reflow())
					}
				}, {
					key: "_pauseEvents",
					value: function() {
						this.isOn = !1, this.$element.off({
							".zf.equalizer": this._bindHandler.onPostEqualizedBound,
							"resizeme.zf.trigger": this._bindHandler.onResizeMeBound,
							"mutateme.zf.trigger": this._bindHandler.onResizeMeBound
						})
					}
				}, {
					key: "_onResizeMe",
					value: function(e) {
						this._reflow()
					}
				}, {
					key: "_onPostEqualized",
					value: function(e) {
						e.target !== this.$element[0] && this._reflow()
					}
				}, {
					key: "_events",
					value: function() {
						this._pauseEvents(), this.hasNested ? this.$element.on("postequalized.zf.equalizer", this._bindHandler.onPostEqualizedBound) : (this.$element.on("resizeme.zf.trigger", this._bindHandler.onResizeMeBound), this.$element.on("mutateme.zf.trigger", this._bindHandler.onResizeMeBound)), this.isOn = !0
					}
				}, {
					key: "_checkMQ",
					value: function() {
						var e = !l.a.is(this.options.equalizeOn);
						return e ? this.isOn && (this._pauseEvents(), this.$watched.css("height", "auto")) : this.isOn || this._events(), e
					}
				}, {
					key: "_killswitch",
					value: function() {}
				}, {
					key: "_reflow",
					value: function() {
						if (!this.options.equalizeOnStack && this._isStacked()) return this.$watched.css("height", "auto"), !1;
						this.options.equalizeByRow ? this.getHeightsByRow(this.applyHeightByRow.bind(this)) : this.getHeights(this.applyHeight.bind(this))
					}
				}, {
					key: "_isStacked",
					value: function() {
						return !this.$watched[0] || !this.$watched[1] || this.$watched[0].getBoundingClientRect().top !== this.$watched[1].getBoundingClientRect().top
					}
				}, {
					key: "getHeights",
					value: function(e) {
						for (var t = [], i = 0, n = this.$watched.length; i < n; i++) this.$watched[i].style.height = "auto", t.push(this.$watched[i].offsetHeight);
						e(t)
					}
				}, {
					key: "getHeightsByRow",
					value: function(e) {
						var t = this.$watched.length ? this.$watched.first().offset().top : 0,
							i = [],
							n = 0;
						i[n] = [];
						for (var o = 0, r = this.$watched.length; o < r; o++) {
							this.$watched[o].style.height = "auto";
							var a = s()(this.$watched[o]).offset().top;
							a != t && (i[++n] = [], t = a), i[n].push([this.$watched[o], this.$watched[o].offsetHeight])
						}
						for (var l = 0, c = i.length; l < c; l++) {
							var u = s()(i[l]).map(function() {
									return this[1]
								}).get(),
								h = Math.max.apply(null, u);
							i[l].push(h)
						}
						e(i)
					}
				}, {
					key: "applyHeight",
					value: function(e) {
						var t = Math.max.apply(null, e);
						this.$element.trigger("preequalized.zf.equalizer"), this.$watched.css("height", t), this.$element.trigger("postequalized.zf.equalizer")
					}
				}, {
					key: "applyHeightByRow",
					value: function(e) {
						this.$element.trigger("preequalized.zf.equalizer");
						for (var t = 0, i = e.length; t < i; t++) {
							var n = e[t].length,
								o = e[t][n - 1];
							if (n <= 2) s()(e[t][0][0]).css({
								height: "auto"
							});
							else {
								this.$element.trigger("preequalizedrow.zf.equalizer");
								for (var r = 0, a = n - 1; r < a; r++) s()(e[t][r][0]).css({
									height: o
								});
								this.$element.trigger("postequalizedrow.zf.equalizer")
							}
						}
						this.$element.trigger("postequalized.zf.equalizer")
					}
				}, {
					key: "_destroy",
					value: function() {
						this._pauseEvents(), this.$watched.css("height", "auto")
					}
				}]), t
			}();
		p.defaults = {
			equalizeOnStack: !1,
			equalizeByRow: !1,
			equalizeOn: ""
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return d
		});
		var a = i(0),
			s = i.n(a),
			l = i(3),
			c = i(1),
			u = i(2),
			h = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			d = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, c.a), h(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = s.a.extend({}, t.defaults, i), this.rules = [], this.currentPath = "", this.className = "Interchange", this._init(), this._events()
					}
				}, {
					key: "_init",
					value: function() {
						l.a._init();
						var e = this.$element[0].id || i.i(u.a)(6, "interchange");
						this.$element.attr({
							"data-resize": e,
							id: e
						}), this._addBreakpoints(), this._generateRules(), this._reflow()
					}
				}, {
					key: "_events",
					value: function() {
						var e = this;
						this.$element.off("resizeme.zf.trigger").on("resizeme.zf.trigger", function() {
							return e._reflow()
						})
					}
				}, {
					key: "_reflow",
					value: function() {
						var e;
						for (var t in this.rules)
							if (this.rules.hasOwnProperty(t)) {
								var i = this.rules[t];
								window.matchMedia(i.query).matches && (e = i)
							}
						e && this.replace(e.path)
					}
				}, {
					key: "_addBreakpoints",
					value: function() {
						for (var e in l.a.queries)
							if (l.a.queries.hasOwnProperty(e)) {
								var i = l.a.queries[e];
								t.SPECIAL_QUERIES[i.name] = i.value
							}
					}
				}, {
					key: "_generateRules",
					value: function(e) {
						var i, n = [];
						i = "string" == typeof(i = this.options.rules ? this.options.rules : this.$element.data("interchange")) ? i.match(/\[.*?\]/g) : i;
						for (var o in i)
							if (i.hasOwnProperty(o)) {
								var r = i[o].slice(1, -1).split(", "),
									a = r.slice(0, -1).join(""),
									s = r[r.length - 1];
								t.SPECIAL_QUERIES[s] && (s = t.SPECIAL_QUERIES[s]), n.push({
									path: a,
									query: s
								})
							}
						this.rules = n
					}
				}, {
					key: "replace",
					value: function(e) {
						if (this.currentPath !== e) {
							var t = this,
								i = "replaced.zf.interchange";
							"IMG" === this.$element[0].nodeName ? this.$element.attr("src", e).on("load", function() {
								t.currentPath = e
							}).trigger(i) : e.match(/\.(gif|jpg|jpeg|png|svg|tiff)([?#].*)?/i) ? (e = e.replace(/\(/g, "%28").replace(/\)/g, "%29"), this.$element.css({
								"background-image": "url(" + e + ")"
							}).trigger(i)) : s.a.get(e, function(n) {
								t.$element.html(n).trigger(i), s()(n).foundation(), t.currentPath = e
							})
						}
					}
				}, {
					key: "_destroy",
					value: function() {
						this.$element.off("resizeme.zf.trigger")
					}
				}]), t
			}();
		d.defaults = {
			rules: null
		}, d.SPECIAL_QUERIES = {
			landscape: "screen and (orientation: landscape)",
			portrait: "screen and (orientation: portrait)",
			retina: "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)"
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return d
		});
		var a = i(0),
			s = i.n(a),
			l = i(2),
			c = i(1),
			u = i(20),
			h = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			d = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, c.a), h(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = s.a.extend({}, t.defaults, this.$element.data(), i), this.className = "Magellan", this._init(), this.calcPoints()
					}
				}, {
					key: "_init",
					value: function() {
						var e = this.$element[0].id || i.i(l.a)(6, "magellan");
						this.$targets = s()("[data-magellan-target]"), this.$links = this.$element.find("a"), this.$element.attr({
							"data-resize": e,
							"data-scroll": e,
							id: e
						}), this.$active = s()(), this.scrollPos = parseInt(window.pageYOffset, 10), this._events()
					}
				}, {
					key: "calcPoints",
					value: function() {
						var e = this,
							t = document.body,
							i = document.documentElement;
						this.points = [], this.winHeight = Math.round(Math.max(window.innerHeight, i.clientHeight)), this.docHeight = Math.round(Math.max(t.scrollHeight, t.offsetHeight, i.clientHeight, i.scrollHeight, i.offsetHeight)), this.$targets.each(function() {
							var t = s()(this),
								i = Math.round(t.offset().top - e.options.threshold);
							t.targetPoint = i, e.points.push(i)
						})
					}
				}, {
					key: "_events",
					value: function() {
						var e = this;
						s()("html, body"), e.options.animationDuration, e.options.animationEasing, s()(window).one("load", function() {
							e.options.deepLinking && location.hash && e.scrollToLoc(location.hash), e.calcPoints(), e._updateActive()
						}), this.$element.on({
							"resizeme.zf.trigger": this.reflow.bind(this),
							"scrollme.zf.trigger": this._updateActive.bind(this)
						}).on("click.zf.magellan", 'a[href^="#"]', function(t) {
							t.preventDefault();
							var i = this.getAttribute("href");
							e.scrollToLoc(i)
						}), this._deepLinkScroll = function(t) {
							e.options.deepLinking && e.scrollToLoc(window.location.hash)
						}, s()(window).on("popstate", this._deepLinkScroll)
					}
				}, {
					key: "scrollToLoc",
					value: function(e) {
						this._inTransition = !0;
						var t = this,
							i = {
								animationEasing: this.options.animationEasing,
								animationDuration: this.options.animationDuration,
								threshold: this.options.threshold,
								offset: this.options.offset
							};
						u.a.scrollToLoc(e, i, function() {
							t._inTransition = !1, t._updateActive()
						})
					}
				}, {
					key: "reflow",
					value: function() {
						this.calcPoints(), this._updateActive()
					}
				}, {
					key: "_updateActive",
					value: function() {
						if (!this._inTransition) {
							var e, t = parseInt(window.pageYOffset, 10);
							if (t + this.winHeight === this.docHeight) e = this.points.length - 1;
							else if (t < this.points[0]) e = void 0;
							else {
								var i = this.scrollPos < t,
									n = this,
									o = this.points.filter(function(e, o) {
										return i ? e - n.options.offset <= t : e - n.options.offset - n.options.threshold <= t
									});
								e = o.length ? o.length - 1 : 0
							}
							if (this.$active.removeClass(this.options.activeClass), this.$active = this.$links.filter('[href="#' + this.$targets.eq(e).data("magellan-target") + '"]').addClass(this.options.activeClass), this.options.deepLinking) {
								var r = "";
								void 0 != e && (r = this.$active[0].getAttribute("href")), r !== window.location.hash && (window.history.pushState ? window.history.pushState(null, null, r) : window.location.hash = r)
							}
							this.scrollPos = t, this.$element.trigger("update.zf.magellan", [this.$active])
						}
					}
				}, {
					key: "_destroy",
					value: function() {
						if (this.$element.off(".zf.trigger .zf.magellan").find("." + this.options.activeClass).removeClass(this.options.activeClass), this.options.deepLinking) {
							var e = this.$active[0].getAttribute("href");
							window.location.hash.replace(e, "")
						}
						s()(window).off("popstate", this._deepLinkScroll)
					}
				}]), t
			}();
		d.defaults = {
			animationDuration: 500,
			animationEasing: "linear",
			threshold: 50,
			activeClass: "is-active",
			deepLinking: !1,
			offset: 0
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return f
		});
		var a = i(0),
			s = i.n(a),
			l = i(5),
			c = i(3),
			u = i(2),
			h = i(1),
			d = i(4),
			p = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			f = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, h.a), p(t, [{
					key: "_setup",
					value: function(e, i) {
						var n = this;
						this.className = "OffCanvas", this.$element = e, this.options = s.a.extend({}, t.defaults, this.$element.data(), i), this.contentClasses = {
							base: [],
							reveal: []
						}, this.$lastTrigger = s()(), this.$triggers = s()(), this.position = "left", this.$content = s()(), this.nested = !!this.options.nested, s()(["push", "overlap"]).each(function(e, t) {
							n.contentClasses.base.push("has-transition-" + t)
						}), s()(["left", "right", "top", "bottom"]).each(function(e, t) {
							n.contentClasses.base.push("has-position-" + t), n.contentClasses.reveal.push("has-reveal-" + t)
						}), d.a.init(s.a), c.a._init(), this._init(), this._events(), l.a.register("OffCanvas", {
							ESCAPE: "close"
						})
					}
				}, {
					key: "_init",
					value: function() {
						var e = this.$element.attr("id");
						if (this.$element.attr("aria-hidden", "true"), this.options.contentId ? this.$content = s()("#" + this.options.contentId) : this.$element.siblings("[data-off-canvas-content]").length ? this.$content = this.$element.siblings("[data-off-canvas-content]").first() : this.$content = this.$element.closest("[data-off-canvas-content]").first(), this.options.contentId ? this.options.contentId && this.options.nested : this.nested = 0 === this.$element.siblings("[data-off-canvas-content]").length, !0 === this.nested && (this.options.transition = "overlap", this.$element.removeClass("is-transition-push")), this.$element.addClass("is-transition-" + this.options.transition + " is-closed"), this.$triggers = s()(document).find('[data-open="' + e + '"], [data-close="' + e + '"], [data-toggle="' + e + '"]').attr("aria-expanded", "false").attr("aria-controls", e), this.position = this.$element.is(".position-left, .position-top, .position-right, .position-bottom") ? this.$element.attr("class").match(/position\-(left|top|right|bottom)/)[1] : this.position, !0 === this.options.contentOverlay) {
							var t = document.createElement("div"),
								i = "fixed" === s()(this.$element).css("position") ? "is-overlay-fixed" : "is-overlay-absolute";
							t.setAttribute("class", "js-off-canvas-overlay " + i), this.$overlay = s()(t), "is-overlay-fixed" === i ? s()(this.$overlay).insertAfter(this.$element) : this.$content.append(this.$overlay)
						}
						this.options.isRevealed = this.options.isRevealed || new RegExp(this.options.revealClass, "g").test(this.$element[0].className), !0 === this.options.isRevealed && (this.options.revealOn = this.options.revealOn || this.$element[0].className.match(/(reveal-for-medium|reveal-for-large)/g)[0].split("-")[2], this._setMQChecker()), this.options.transitionTime && this.$element.css("transition-duration", this.options.transitionTime), this._removeContentClasses()
					}
				}, {
					key: "_events",
					value: function() {
						this.$element.off(".zf.trigger .zf.offcanvas").on({
							"open.zf.trigger": this.open.bind(this),
							"close.zf.trigger": this.close.bind(this),
							"toggle.zf.trigger": this.toggle.bind(this),
							"keydown.zf.offcanvas": this._handleKeyboard.bind(this)
						}), !0 === this.options.closeOnClick && (this.options.contentOverlay ? this.$overlay : this.$content).on({
							"click.zf.offcanvas": this.close.bind(this)
						})
					}
				}, {
					key: "_setMQChecker",
					value: function() {
						var e = this;
						s()(window).on("changed.zf.mediaquery", function() {
							c.a.atLeast(e.options.revealOn) ? e.reveal(!0) : e.reveal(!1)
						}).one("load.zf.offcanvas", function() {
							c.a.atLeast(e.options.revealOn) && e.reveal(!0)
						})
					}
				}, {
					key: "_removeContentClasses",
					value: function(e) {
						"boolean" != typeof e ? this.$content.removeClass(this.contentClasses.base.join(" ")) : !1 === e && this.$content.removeClass("has-reveal-" + this.position)
					}
				}, {
					key: "_addContentClasses",
					value: function(e) {
						this._removeContentClasses(e), "boolean" != typeof e ? this.$content.addClass("has-transition-" + this.options.transition + " has-position-" + this.position) : !0 === e && this.$content.addClass("has-reveal-" + this.position)
					}
				}, {
					key: "reveal",
					value: function(e) {
						e ? (this.close(), this.isRevealed = !0, this.$element.attr("aria-hidden", "false"), this.$element.off("open.zf.trigger toggle.zf.trigger"), this.$element.removeClass("is-closed")) : (this.isRevealed = !1, this.$element.attr("aria-hidden", "true"), this.$element.off("open.zf.trigger toggle.zf.trigger").on({
							"open.zf.trigger": this.open.bind(this),
							"toggle.zf.trigger": this.toggle.bind(this)
						}), this.$element.addClass("is-closed")), this._addContentClasses(e)
					}
				}, {
					key: "_stopScrolling",
					value: function(e) {
						return !1
					}
				}, {
					key: "_recordScrollable",
					value: function(e) {
						var t = this;
						t.scrollHeight !== t.clientHeight && (0 === t.scrollTop && (t.scrollTop = 1), t.scrollTop === t.scrollHeight - t.clientHeight && (t.scrollTop = t.scrollHeight - t.clientHeight - 1)), t.allowUp = t.scrollTop > 0, t.allowDown = t.scrollTop < t.scrollHeight - t.clientHeight, t.lastY = e.originalEvent.pageY
					}
				}, {
					key: "_stopScrollPropagation",
					value: function(e) {
						var t = this,
							i = e.pageY < t.lastY,
							n = !i;
						t.lastY = e.pageY, i && t.allowUp || n && t.allowDown ? e.stopPropagation() : e.preventDefault()
					}
				}, {
					key: "open",
					value: function(e, t) {
						if (!this.$element.hasClass("is-open") && !this.isRevealed) {
							var n = this;
							t && (this.$lastTrigger = t), "top" === this.options.forceTo ? window.scrollTo(0, 0) : "bottom" === this.options.forceTo && window.scrollTo(0, document.body.scrollHeight), this.options.transitionTime && "overlap" !== this.options.transition ? this.$element.siblings("[data-off-canvas-content]").css("transition-duration", this.options.transitionTime) : this.$element.siblings("[data-off-canvas-content]").css("transition-duration", ""), this.$element.addClass("is-open").removeClass("is-closed"), this.$triggers.attr("aria-expanded", "true"), this.$element.attr("aria-hidden", "false").trigger("opened.zf.offcanvas"), this.$content.addClass("is-open-" + this.position), !1 === this.options.contentScroll && (s()("body").addClass("is-off-canvas-open").on("touchmove", this._stopScrolling), this.$element.on("touchstart", this._recordScrollable), this.$element.on("touchmove", this._stopScrollPropagation)), !0 === this.options.contentOverlay && this.$overlay.addClass("is-visible"), !0 === this.options.closeOnClick && !0 === this.options.contentOverlay && this.$overlay.addClass("is-closable"), !0 === this.options.autoFocus && this.$element.one(i.i(u.b)(this.$element), function() {
								if (n.$element.hasClass("is-open")) {
									var e = n.$element.find("[data-autofocus]");
									e.length ? e.eq(0).focus() : n.$element.find("a, button").eq(0).focus()
								}
							}), !0 === this.options.trapFocus && (this.$content.attr("tabindex", "-1"), l.a.trapFocus(this.$element)), this._addContentClasses()
						}
					}
				}, {
					key: "close",
					value: function(e) {
						if (this.$element.hasClass("is-open") && !this.isRevealed) {
							var t = this;
							this.$element.removeClass("is-open"), this.$element.attr("aria-hidden", "true").trigger("closed.zf.offcanvas"), this.$content.removeClass("is-open-left is-open-top is-open-right is-open-bottom"), !1 === this.options.contentScroll && (s()("body").removeClass("is-off-canvas-open").off("touchmove", this._stopScrolling), this.$element.off("touchstart", this._recordScrollable), this.$element.off("touchmove", this._stopScrollPropagation)), !0 === this.options.contentOverlay && this.$overlay.removeClass("is-visible"), !0 === this.options.closeOnClick && !0 === this.options.contentOverlay && this.$overlay.removeClass("is-closable"), this.$triggers.attr("aria-expanded", "false"), !0 === this.options.trapFocus && (this.$content.removeAttr("tabindex"), l.a.releaseFocus(this.$element)), this.$element.one(i.i(u.b)(this.$element), function(e) {
								t.$element.addClass("is-closed"), t._removeContentClasses()
							})
						}
					}
				}, {
					key: "toggle",
					value: function(e, t) {
						this.$element.hasClass("is-open") ? this.close(e, t) : this.open(e, t)
					}
				}, {
					key: "_handleKeyboard",
					value: function(e) {
						var t = this;
						l.a.handleKey(e, "OffCanvas", {
							close: function() {
								return t.close(), t.$lastTrigger.focus(), !0
							},
							handled: function() {
								e.stopPropagation(), e.preventDefault()
							}
						})
					}
				}, {
					key: "_destroy",
					value: function() {
						this.close(), this.$element.off(".zf.trigger .zf.offcanvas"), this.$overlay.off(".zf.offcanvas")
					}
				}]), t
			}();
		f.defaults = {
			closeOnClick: !0,
			contentOverlay: !0,
			contentId: null,
			nested: null,
			contentScroll: !0,
			transitionTime: null,
			transition: "push",
			forceTo: null,
			isRevealed: !1,
			revealOn: null,
			autoFocus: !0,
			revealClass: "reveal-for-",
			trapFocus: !1
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return m
		});
		var a = i(0),
			s = i.n(a),
			l = i(3),
			c = i(2),
			u = i(1),
			h = i(7),
			d = i(8),
			p = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			f = {
				tabs: {
					cssClass: "tabs",
					plugin: d.a
				},
				accordion: {
					cssClass: "accordion",
					plugin: h.a
				}
			},
			m = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, u.a), p(t, [{
					key: "_setup",
					value: function(e, t) {
						this.$element = s()(e), this.options = s.a.extend({}, this.$element.data(), t), this.rules = this.$element.data("responsive-accordion-tabs"), this.currentMq = null, this.currentPlugin = null, this.className = "ResponsiveAccordionTabs", this.$element.attr("id") || this.$element.attr("id", i.i(c.a)(6, "responsiveaccordiontabs")), this._init(), this._events()
					}
				}, {
					key: "_init",
					value: function() {
						if (l.a._init(), "string" == typeof this.rules) {
							for (var e = {}, t = this.rules.split(" "), i = 0; i < t.length; i++) {
								var n = t[i].split("-"),
									o = n.length > 1 ? n[0] : "small",
									r = n.length > 1 ? n[1] : n[0];
								null !== f[r] && (e[o] = f[r])
							}
							this.rules = e
						}
						this._getAllOptions(), s.a.isEmptyObject(this.rules) || this._checkMediaQueries()
					}
				}, {
					key: "_getAllOptions",
					value: function() {
						var e = this;
						e.allOptions = {};
						for (var t in f)
							if (f.hasOwnProperty(t)) {
								var i = f[t];
								try {
									var n = s()("<ul></ul>"),
										o = new i.plugin(n, e.options);
									for (var r in o.options)
										if (o.options.hasOwnProperty(r) && "zfPlugin" !== r) {
											var a = o.options[r];
											e.allOptions[r] = a
										}
									o.destroy()
								}
								catch (e) {}
							}
					}
				}, {
					key: "_events",
					value: function() {
						var e = this;
						s()(window).on("changed.zf.mediaquery", function() {
							e._checkMediaQueries()
						})
					}
				}, {
					key: "_checkMediaQueries",
					value: function() {
						var e, t = this;
						s.a.each(this.rules, function(t) {
							l.a.atLeast(t) && (e = t)
						}), e && (this.currentPlugin instanceof this.rules[e].plugin || (s.a.each(f, function(e, i) {
							t.$element.removeClass(i.cssClass)
						}), this.$element.addClass(this.rules[e].cssClass), this.currentPlugin && (!this.currentPlugin.$element.data("zfPlugin") && this.storezfData && this.currentPlugin.$element.data("zfPlugin", this.storezfData), this.currentPlugin.destroy()), this._handleMarkup(this.rules[e].cssClass), this.currentPlugin = new this.rules[e].plugin(this.$element, {}), this.storezfData = this.currentPlugin.$element.data("zfPlugin")))
					}
				}, {
					key: "_handleMarkup",
					value: function(e) {
						var t = this,
							n = "accordion",
							o = s()("[data-tabs-content=" + this.$element.attr("id") + "]");
						if (o.length && (n = "tabs"), n !== e) {
							var r = t.allOptions.linkClass ? t.allOptions.linkClass : "tabs-title",
								a = t.allOptions.panelClass ? t.allOptions.panelClass : "tabs-panel";
							this.$element.removeAttr("role");
							var l = this.$element.children("." + r + ",[data-accordion-item]").removeClass(r).removeClass("accordion-item").removeAttr("data-accordion-item"),
								u = l.children("a").removeClass("accordion-title");
							if ("tabs" === n ? (o = o.children("." + a).removeClass(a).removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby")).children("a").removeAttr("role").removeAttr("aria-controls").removeAttr("aria-selected") : o = l.children("[data-tab-content]").removeClass("accordion-content"), o.css({
									display: "",
									visibility: ""
								}), l.css({
									display: "",
									visibility: ""
								}), "accordion" === e) o.each(function(e, i) {
								s()(i).appendTo(l.get(e)).addClass("accordion-content").attr("data-tab-content", "").removeClass("is-active").css({
									height: ""
								}), s()("[data-tabs-content=" + t.$element.attr("id") + "]").after('<div id="tabs-placeholder-' + t.$element.attr("id") + '"></div>').detach(), l.addClass("accordion-item").attr("data-accordion-item", ""), u.addClass("accordion-title")
							});
							else if ("tabs" === e) {
								var h = s()("[data-tabs-content=" + t.$element.attr("id") + "]"),
									d = s()("#tabs-placeholder-" + t.$element.attr("id"));
								d.length ? (h = s()('<div class="tabs-content"></div>').insertAfter(d).attr("data-tabs-content", t.$element.attr("id")), d.remove()) : h = s()('<div class="tabs-content"></div>').insertAfter(t.$element).attr("data-tabs-content", t.$element.attr("id")), o.each(function(e, t) {
									var n = s()(t).appendTo(h).addClass(a),
										o = u.get(e).hash.slice(1),
										r = s()(t).attr("id") || i.i(c.a)(6, "accordion");
									o !== r && ("" !== o ? s()(t).attr("id", o) : (o = r, s()(t).attr("id", o), s()(u.get(e)).attr("href", s()(u.get(e)).attr("href").replace("#", "") + "#" + o))), s()(l.get(e)).hasClass("is-active") && n.addClass("is-active")
								}), l.addClass(r)
							}
						}
					}
				}, {
					key: "_destroy",
					value: function() {
						this.currentPlugin && this.currentPlugin.destroy(), s()(window).off(".zf.ResponsiveAccordionTabs")
					}
				}]), t
			}();
		m.defaults = {}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return d
		});
		var a = i(0),
			s = i.n(a),
			l = i(3),
			c = i(6),
			u = i(1),
			h = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			d = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, u.a), h(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = s()(e), this.options = s.a.extend({}, t.defaults, this.$element.data(), i), this.className = "ResponsiveToggle", this._init(), this._events()
					}
				}, {
					key: "_init",
					value: function() {
						l.a._init();
						var e = this.$element.data("responsive-toggle");
						if (this.$targetMenu = s()("#" + e), this.$toggler = this.$element.find("[data-toggle]").filter(function() {
								var t = s()(this).data("toggle");
								return t === e || "" === t
							}), this.options = s.a.extend({}, this.options, this.$targetMenu.data()), this.options.animate) {
							var t = this.options.animate.split(" ");
							this.animationIn = t[0], this.animationOut = t[1] || null
						}
						this._update()
					}
				}, {
					key: "_events",
					value: function() {
						this._updateMqHandler = this._update.bind(this), s()(window).on("changed.zf.mediaquery", this._updateMqHandler), this.$toggler.on("click.zf.responsiveToggle", this.toggleMenu.bind(this))
					}
				}, {
					key: "_update",
					value: function() {
						l.a.atLeast(this.options.hideFor) ? (this.$element.hide(), this.$targetMenu.show()) : (this.$element.show(), this.$targetMenu.hide())
					}
				}, {
					key: "toggleMenu",
					value: function() {
						var e = this;
						l.a.atLeast(this.options.hideFor) || (this.options.animate ? this.$targetMenu.is(":hidden") ? c.a.animateIn(this.$targetMenu, this.animationIn, function() {
							e.$element.trigger("toggled.zf.responsiveToggle"), e.$targetMenu.find("[data-mutate]").triggerHandler("mutateme.zf.trigger")
						}) : c.a.animateOut(this.$targetMenu, this.animationOut, function() {
							e.$element.trigger("toggled.zf.responsiveToggle")
						}) : (this.$targetMenu.toggle(0), this.$targetMenu.find("[data-mutate]").trigger("mutateme.zf.trigger"), this.$element.trigger("toggled.zf.responsiveToggle")))
					}
				}, {
					key: "_destroy",
					value: function() {
						this.$element.off(".zf.responsiveToggle"), this.$toggler.off(".zf.responsiveToggle"), s()(window).off("changed.zf.mediaquery", this._updateMqHandler)
					}
				}]), t
			}();
		d.defaults = {
			hideFor: "medium",
			animate: !1
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}

		function a() {
			return /iP(ad|hone|od).*OS/.test(window.navigator.userAgent)
		}

		function s() {
			return /Android/.test(window.navigator.userAgent)
		}

		function l() {
			return a() || s()
		}
		i.d(t, "a", function() {
			return v
		});
		var c = i(0),
			u = i.n(c),
			h = i(5),
			d = i(3),
			p = i(6),
			f = i(1),
			m = i(4),
			g = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			v = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, f.a), g(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = u.a.extend({}, t.defaults, this.$element.data(), i), this.className = "Reveal", this._init(), m.a.init(u.a), h.a.register("Reveal", {
							ESCAPE: "close"
						})
					}
				}, {
					key: "_init",
					value: function() {
						d.a._init(), this.id = this.$element.attr("id"), this.isActive = !1, this.cached = {
							mq: d.a.current
						}, this.isMobile = l(), this.$anchor = u()('[data-open="' + this.id + '"]').length ? u()('[data-open="' + this.id + '"]') : u()('[data-toggle="' + this.id + '"]'), this.$anchor.attr({
							"aria-controls": this.id,
							"aria-haspopup": !0,
							tabindex: 0
						}), (this.options.fullScreen || this.$element.hasClass("full")) && (this.options.fullScreen = !0, this.options.overlay = !1), this.options.overlay && !this.$overlay && (this.$overlay = this._makeOverlay(this.id)), this.$element.attr({
							role: "dialog",
							"aria-hidden": !0,
							"data-yeti-box": this.id,
							"data-resize": this.id
						}), this.$overlay ? this.$element.detach().appendTo(this.$overlay) : (this.$element.detach().appendTo(u()(this.options.appendTo)), this.$element.addClass("without-overlay")), this._events(), this.options.deepLink && window.location.hash === "#" + this.id && u()(window).one("load.zf.reveal", this.open.bind(this))
					}
				}, {
					key: "_makeOverlay",
					value: function() {
						var e = "";
						return this.options.additionalOverlayClasses && (e = " " + this.options.additionalOverlayClasses), u()("<div></div>").addClass("reveal-overlay" + e).appendTo(this.options.appendTo)
					}
				}, {
					key: "_updatePosition",
					value: function() {
						var e, t, i = this.$element.outerWidth(),
							n = u()(window).width(),
							o = this.$element.outerHeight(),
							r = u()(window).height();
						e = "auto" === this.options.hOffset ? parseInt((n - i) / 2, 10) : parseInt(this.options.hOffset, 10), t = "auto" === this.options.vOffset ? o > r ? parseInt(Math.min(100, r / 10), 10) : parseInt((r - o) / 4, 10) : parseInt(this.options.vOffset, 10), this.$element.css({
							top: t + "px"
						}), this.$overlay && "auto" === this.options.hOffset || (this.$element.css({
							left: e + "px"
						}), this.$element.css({
							margin: "0px"
						}))
					}
				}, {
					key: "_events",
					value: function() {
						var e = this,
							t = this;
						this.$element.on({
							"open.zf.trigger": this.open.bind(this),
							"close.zf.trigger": function(i, n) {
								if (i.target === t.$element[0] || u()(i.target).parents("[data-closable]")[0] === n) return e.close.apply(e)
							},
							"toggle.zf.trigger": this.toggle.bind(this),
							"resizeme.zf.trigger": function() {
								t._updatePosition()
							}
						}), this.options.closeOnClick && this.options.overlay && this.$overlay.off(".zf.reveal").on("click.zf.reveal", function(e) {
							e.target !== t.$element[0] && !u.a.contains(t.$element[0], e.target) && u.a.contains(document, e.target) && t.close()
						}), this.options.deepLink && u()(window).on("popstate.zf.reveal:" + this.id, this._handleState.bind(this))
					}
				}, {
					key: "_handleState",
					value: function(e) {
						window.location.hash !== "#" + this.id || this.isActive ? this.close() : this.open()
					}
				}, {
					key: "open",
					value: function() {
						function e() {
							n.isMobile ? (n.originalScrollPos || (n.originalScrollPos = window.pageYOffset), u()("html, body").addClass("is-reveal-open")) : u()("body").addClass("is-reveal-open")
						}
						var t = this;
						if (this.options.deepLink) {
							var i = "#" + this.id;
							window.history.pushState ? this.options.updateHistory ? window.history.pushState({}, "", i) : window.history.replaceState({}, "", i) : window.location.hash = i
						}
						this.isActive = !0, this.$element.css({
							visibility: "hidden"
						}).show().scrollTop(0), this.options.overlay && this.$overlay.css({
							visibility: "hidden"
						}).show(), this._updatePosition(), this.$element.hide().css({
							visibility: ""
						}), this.$overlay && (this.$overlay.css({
							visibility: ""
						}).hide(), this.$element.hasClass("fast") ? this.$overlay.addClass("fast") : this.$element.hasClass("slow") && this.$overlay.addClass("slow")), this.options.multipleOpened || this.$element.trigger("closeme.zf.reveal", this.id);
						var n = this;
						this.options.animationIn ? function() {
							var i = function() {
								n.$element.attr({
									"aria-hidden": !1,
									tabindex: -1
								}).focus(), e(), h.a.trapFocus(n.$element)
							};
							t.options.overlay && p.a.animateIn(t.$overlay, "fade-in"), p.a.animateIn(t.$element, t.options.animationIn, function() {
								t.$element && (t.focusableElements = h.a.findFocusable(t.$element), i())
							})
						}() : (this.options.overlay && this.$overlay.show(0), this.$element.show(this.options.showDelay)), this.$element.attr({
							"aria-hidden": !1,
							tabindex: -1
						}).focus(), h.a.trapFocus(this.$element), e(), this._extraHandlers(), this.$element.trigger("open.zf.reveal")
					}
				}, {
					key: "_extraHandlers",
					value: function() {
						var e = this;
						this.$element && (this.focusableElements = h.a.findFocusable(this.$element), this.options.overlay || !this.options.closeOnClick || this.options.fullScreen || u()("body").on("click.zf.reveal", function(t) {
							t.target !== e.$element[0] && !u.a.contains(e.$element[0], t.target) && u.a.contains(document, t.target) && e.close()
						}), this.options.closeOnEsc && u()(window).on("keydown.zf.reveal", function(t) {
							h.a.handleKey(t, "Reveal", {
								close: function() {
									e.options.closeOnEsc && e.close()
								}
							})
						}))
					}
				}, {
					key: "close",
					value: function() {
						function e() {
							t.isMobile ? (0 === u()(".reveal:visible").length && u()("html, body").removeClass("is-reveal-open"), t.originalScrollPos && (u()("body").scrollTop(t.originalScrollPos), t.originalScrollPos = null)) : 0 === u()(".reveal:visible").length && u()("body").removeClass("is-reveal-open"), h.a.releaseFocus(t.$element), t.$element.attr("aria-hidden", !0), t.$element.trigger("closed.zf.reveal")
						}
						if (!this.isActive || !this.$element.is(":visible")) return !1;
						var t = this;
						this.options.animationOut ? (this.options.overlay && p.a.animateOut(this.$overlay, "fade-out"), p.a.animateOut(this.$element, this.options.animationOut, e)) : (this.$element.hide(this.options.hideDelay), this.options.overlay ? this.$overlay.hide(0, e) : e()), this.options.closeOnEsc && u()(window).off("keydown.zf.reveal"), !this.options.overlay && this.options.closeOnClick && u()("body").off("click.zf.reveal"), this.$element.off("keydown.zf.reveal"), this.options.resetOnClose && this.$element.html(this.$element.html()), this.isActive = !1, t.options.deepLink && (window.history.replaceState ? window.history.replaceState("", document.title, window.location.href.replace("#" + this.id, "")) : window.location.hash = ""), this.$anchor.focus()
					}
				}, {
					key: "toggle",
					value: function() {
						this.isActive ? this.close() : this.open()
					}
				}, {
					key: "_destroy",
					value: function() {
						this.options.overlay && (this.$element.appendTo(u()(this.options.appendTo)), this.$overlay.hide().off().remove()), this.$element.hide().off(), this.$anchor.off(".zf"), u()(window).off(".zf.reveal:" + this.id)
					}
				}]), t
			}();
		v.defaults = {
			animationIn: "",
			animationOut: "",
			showDelay: 0,
			hideDelay: 0,
			closeOnClick: !0,
			closeOnEsc: !0,
			multipleOpened: !1,
			vOffset: "auto",
			hOffset: "auto",
			fullScreen: !1,
			btmOffsetPct: 10,
			overlay: !0,
			resetOnClose: !1,
			deepLink: !1,
			updateHistory: !1,
			appendTo: "body",
			additionalOverlayClasses: ""
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return d
		});
		var a = i(0),
			s = i.n(a),
			l = i(6),
			c = i(1),
			u = i(4),
			h = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			d = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, c.a), h(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = s.a.extend({}, t.defaults, e.data(), i), this.className = "", this.className = "Toggler", u.a.init(s.a), this._init(), this._events()
					}
				}, {
					key: "_init",
					value: function() {
						var e;
						this.options.animate ? (e = this.options.animate.split(" "), this.animationIn = e[0], this.animationOut = e[1] || null) : (e = this.$element.data("toggler"), this.className = "." === e[0] ? e.slice(1) : e);
						var t = this.$element[0].id;
						s()('[data-open="' + t + '"], [data-close="' + t + '"], [data-toggle="' + t + '"]').attr("aria-controls", t), this.$element.attr("aria-expanded", !this.$element.is(":hidden"))
					}
				}, {
					key: "_events",
					value: function() {
						this.$element.off("toggle.zf.trigger").on("toggle.zf.trigger", this.toggle.bind(this))
					}
				}, {
					key: "toggle",
					value: function() {
						this[this.options.animate ? "_toggleAnimate" : "_toggleClass"]()
					}
				}, {
					key: "_toggleClass",
					value: function() {
						this.$element.toggleClass(this.className);
						var e = this.$element.hasClass(this.className);
						e ? this.$element.trigger("on.zf.toggler") : this.$element.trigger("off.zf.toggler"), this._updateARIA(e), this.$element.find("[data-mutate]").trigger("mutateme.zf.trigger")
					}
				}, {
					key: "_toggleAnimate",
					value: function() {
						var e = this;
						this.$element.is(":hidden") ? l.a.animateIn(this.$element, this.animationIn, function() {
							e._updateARIA(!0), this.trigger("on.zf.toggler"), this.find("[data-mutate]").trigger("mutateme.zf.trigger")
						}) : l.a.animateOut(this.$element, this.animationOut, function() {
							e._updateARIA(!1), this.trigger("off.zf.toggler"), this.find("[data-mutate]").trigger("mutateme.zf.trigger")
						})
					}
				}, {
					key: "_updateARIA",
					value: function(e) {
						this.$element.attr("aria-expanded", !!e)
					}
				}, {
					key: "_destroy",
					value: function() {
						this.$element.off(".zf.toggler")
					}
				}]), t
			}();
		d.defaults = {
			animate: !1
		}
	}, function(e, t, i) {
		"use strict";

		function n(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function o(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function r(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		i.d(t, "a", function() {
			return h
		});
		var a = i(0),
			s = i.n(a),
			l = i(2),
			c = i(1),
			u = function() {
				function e(e, t) {
					for (var i = 0; i < t.length; i++) {
						var n = t[i];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
					}
				}
				return function(t, i, n) {
					return i && e(t.prototype, i), n && e(t, n), t
				}
			}(),
			h = function(e) {
				function t() {
					return n(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
				}
				return r(t, c.a), u(t, [{
					key: "_setup",
					value: function(e, i) {
						this.$element = e, this.options = s.a.extend({}, t.defaults, this.$element.data(), i), this.className = "SmoothScroll", this._init()
					}
				}, {
					key: "_init",
					value: function() {
						var e = this.$element[0].id || i.i(l.a)(6, "smooth-scroll");
						this.$element.attr({
							id: e
						}), this._events()
					}
				}, {
					key: "_events",
					value: function() {
						var e = this,
							i = function(i) {
								if (!s()(this).is('a[href^="#"]')) return !1;
								var n = this.getAttribute("href");
								e._inTransition = !0, t.scrollToLoc(n, e.options, function() {
									e._inTransition = !1
								}), i.preventDefault()
							};
						this.$element.on("click.zf.smoothScroll", i), this.$element.on("click.zf.smoothScroll", 'a[href^="#"]', i)
					}
				}], [{
					key: "scrollToLoc",
					value: function(e) {
						var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t.defaults,
							n = arguments[2];
						if (!s()(e).length) return !1;
						var o = Math.round(s()(e).offset().top - i.threshold / 2 - i.offset);
						s()("html, body").stop(!0).animate({
							scrollTop: o
						}, i.animationDuration, i.animationEasing, function() {
							n && "function" == typeof n && n()
						})
					}
				}]), t
			}();
		h.defaults = {
			animationDuration: 500,
			animationEasing: "linear",
			threshold: 50,
			offset: 0
		}
	}, function(e, t, i) {
		"use strict";
		Object.defineProperty(t, "__esModule", {
			value: !0
		});
		var n = i(0),
			o = i.n(n),
			r = i(11),
			a = i(3),
			s = i(4),
			l = i(14),
			c = i(7),
			u = i(15),
			h = i(8),
			d = i(18),
			p = i(16),
			f = i(13),
			m = i(17),
			g = i(19),
			v = i(10),
			y = i(12);
		r.a.addToJquery(o.a), r.a.MediaQuery = a.a, s.a.init(o.a, r.a), r.a.plugin(l.a, "Magellan"), r.a.plugin(c.a, "Accordion"), r.a.plugin(u.a, "OffCanvas"), r.a.plugin(h.a, "Tabs"), r.a.plugin(d.a, "Reveal"), r.a.plugin(p.a, "ResponsiveAccordionTabs"), r.a.plugin(f.a, "Interchange"), r.a.plugin(m.a, "ResponsiveToggle"), r.a.plugin(g.a, "Toggler"), r.a.plugin(v.a, "Abide"), r.a.plugin(y.a, "Equalizer")
	}]),
	function(e, t) {
		"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("whatInput", [], t) : "object" == typeof exports ? exports.whatInput = t() : e.whatInput = t()
	}(this, function() {
		return function(e) {
			function t(n) {
				if (i[n]) return i[n].exports;
				var o = i[n] = {
					exports: {},
					id: n,
					loaded: !1
				};
				return e[n].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
			}
			var i = {};
			return t.m = e, t.c = i, t.p = "", t(0)
		}([function(e, t) {
			"use strict";
			e.exports = function() {
				var e = "initial",
					t = null,
					i = document.documentElement,
					n = ["input", "select", "textarea"],
					o = [],
					r = [16, 17, 18, 91, 93],
					a = [9],
					s = {
						keydown: "keyboard",
						mousedown: "mouse",
						mousemove: "mouse",
						MSPointerDown: "pointer",
						MSPointerMove: "pointer",
						pointerdown: "pointer",
						pointermove: "pointer",
						touchstart: "touch"
					},
					l = [],
					c = !1,
					u = !1,
					h = {
						x: null,
						y: null
					},
					d = {
						2: "touch",
						3: "touch",
						4: "mouse"
					},
					p = !1;
				try {
					var f = Object.defineProperty({}, "passive", {
						get: function() {
							p = !0
						}
					});
					window.addEventListener("test", null, f)
				}
				catch (e) {}
				var m = function() {
						window.PointerEvent ? (i.addEventListener("pointerdown", g), i.addEventListener("pointermove", y)) : window.MSPointerEvent ? (i.addEventListener("MSPointerDown", g), i.addEventListener("MSPointerMove", y)) : (i.addEventListener("mousedown", g), i.addEventListener("mousemove", y), "ontouchstart" in window && (i.addEventListener("touchstart", _), i.addEventListener("touchend", _))), i.addEventListener(x(), y, !!p && {
							passive: !0
						}), i.addEventListener("keydown", g)
					},
					g = function(i) {
						if (!c) {
							var o = i.which,
								l = s[i.type];
							if ("pointer" === l && (l = w(i)), e !== l || t !== l) {
								var u = document.activeElement,
									h = !1;
								(u && u.nodeName && -1 === n.indexOf(u.nodeName.toLowerCase()) || -1 !== a.indexOf(o)) && (h = !0), ("touch" === l || "mouse" === l || "keyboard" === l && o && h && -1 === r.indexOf(o)) && (e = t = l, v())
							}
						}
					},
					v = function() {
						i.setAttribute("data-whatinput", e), i.setAttribute("data-whatintent", e), -1 === l.indexOf(e) && (l.push(e), i.className += " whatinput-types-" + e), b("input")
					},
					y = function(e) {
						if (h.x !== e.screenX || h.y !== e.screenY ? (u = !1, h.x = e.screenX, h.y = e.screenY) : u = !0, !c && !u) {
							var n = s[e.type];
							"pointer" === n && (n = w(e)), t !== n && (t = n, i.setAttribute("data-whatintent", t), b("intent"))
						}
					},
					_ = function(e) {
						"touchstart" === e.type ? (c = !1, g(e)) : c = !0
					},
					b = function(e) {
						for (var i = 0, n = o.length; i < n; i++) o[i].type === e && o[i].function.call(void 0, t)
					},
					w = function(e) {
						return "number" == typeof e.pointerType ? d[e.pointerType] : "pen" === e.pointerType ? "touch" : e.pointerType
					},
					x = function() {
						return "onwheel" in document.createElement("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll"
					};
				return "addEventListener" in window && Array.prototype.indexOf && (s[x()] = "mouse", m(), v()), {
					ask: function(i) {
						return "loose" === i ? t : e
					},
					types: function() {
						return l
					},
					ignoreKeys: function(e) {
						r = e
					},
					onChange: function(e, t) {
						o.push({
							function: e,
							type: t
						})
					}
				}
			}()
		}])
	});
var logging = !0,
	showDebugPanel = !1,
	anyElement = "*",
	pageContent = window,
	document = document,
	html = "html",
	body = "body",
	container = "#container",
	main = "#content",
	section = "section",
	article = "article",
	block = "section",
	footer = "#footer",
	hero = ".hero",
	navbarToggle = "#navbar-toggle",
	navPanelToggle = "#nav-panel-toggle",
	navToggle = ".nav-toggle",
	navbar = "#navbar",
	navbarMenubar = "#navbar .menubar",
	navbarContents = "#navbar-contents",
	navbarItems = "#navbar-items > ul > li",
	navbarLogo = "#navbar-logo",
	navbarLabel = "#navbar-label",
	navbarCallout = "#navbar-callout",
	navPanelCallout = "#nav-panel-callout",
	navItems = ".nav-items",
	toolbar = "#toolbar",
	toolbarMenubar = "#toolbar .menubar",
	toolbarContents = "#toolbar-contents",
	toolbarItems = "#toolbar-items nav > ul > li",
	navPanel = "#nav-panel",
	navPanelContents = "#nav-panel-contents",
	navPanelItems = "#nav-panel-items > ul > li",
	panelOverlay = ".js-off-canvas-overlay",
	usePreloader = !1,
	mainWidth = "100%",
	navbarWidth = "100%",
	navbarHeight = "75px",
	toolbarWidth = "100%",
	toolbarHeight = "75px",
	alignCenterHeaderTextPhone = !1,
	alignLeftHeaderTextPhone = !1,
	alignCenterParagraphTextPhone = !1,
	navbarItemsPosition = "right",
	showNavbarLogo = !0,
	showNavbarLogoOnSticky = !0,
	showNav = !0,
	showNavbarLabel = !0,
	showNavbarCallout = !0,
	showNavPanelCallout = !0,
	persistentMenuToggle = !1,
	navbarBreakpoint = "1048px",
	toolbarBreakpoint = "1048px",
	toolbarMobileBreakpoint = "1048px",
	updateScrollToHash = !0,
	allowScrollTo = !0,
	scrollToSpeed = 1,
	scrollToOffsetY = 0,
	scrollToEase = Expo.easeInOut,
	disableNavPanelMomentumScrolling = !1,
	updateScrollInterval = 250,
	updateResizeInterval = 250,
	updateDelayInterval = 1,
	useButtonWavesEffect = !0,
	useButtonTouchFeedback = !0,
	stickyAnchor = "",
	stickyAnchorTolerance = 0,
	navbarAllowSticky = !0,
	navbarStickyClass = "sticky",
	useContentMargin = !1,
	stickyOffset = 0,
	stickyScrollToleranceUp = 0,
	stickyScrollToleranceDown = 0,
	showNavbar = !0,
	navbarShrinkHeight = "50px",
	navbarShrinkSpeed = .5,
	navbarShrinkEase = Expo.easeOut,
	navbarHideOnScrollUp = !1,
	navbarHideOnScrollDown = !1,
	navbarShowOnPageEnd = !0,
	navbarShowOnPageEndHeight = "75px",
	navbarHideSpeed = .25,
	navbarHideEase = Expo.easeOut,
	showToolbar = !1,
	toolbarShowOnMobileOnly = !0,
	toolbarShrinkHeight = "50px",
	toolbarShrinkSpeed = .5,
	toolbarShrinkEase = Expo.easeOut,
	toolbarHideOnScrollUp = !0,
	toolbarHideOnScrollDown = !0,
	toolbarShowOnPageStart = !1,
	toolbarShowOnPageEnd = !0,
	toolbarShowOnPageEndHeight = "75px",
	toolbarHideSpeed = .25,
	toolbarHideEase = Expo.easeOut,
	hideNavPanelScrollbar = !0,
	showNavPanel = !0,
	useNavPanelAnimation = !0,
	navPanelPosition = "top",
	navPanelScrollReset = !0,
	navPanelTransitionSpeed = "0.5s",
	navPanelTransitionEase = "InOut",
	navPanelCloseOnLinkClick = !0,
	navPanelItemsClass = "",
	panelOverlayTransitionSpeed = 1,
	panelOverlayDelay = .35,
	showFooterNav = !0,
	useEmergence = !0,
	animateContentOnNavPanelOpen = !1,
	contentOpacity = 1,
	contentScale = 1,
	contentSpeed = .2,
	contentEase = Expo.easeOut,
	useEmailIcon = !1,
	useEmailLabel = !1,
	emailLabel = "Contact Us",
	linkToEmail = "aries@ariesdatuin.com",
	linkToEmailSubject = "Hello",
	usePhoneIcon = !1,
	usePhoneLabel = !1,
	phoneNumberLabel = "Phone",
	linkToPhoneNumber = "+17025557777",
	contactInfoClass = "p7 font-header text-white text-secondary-hover",
	socialIconsPosition = "right",
	showSocialIconsInNavPanel = !0,
	showSocialIconsInNavbar = !1,
	showSocialIconsInFooter = !0,
	socialIconsLightClass = "p9 round-full button button-width-xxs button-height-xxs text-secondary text-white-hover background-white background-primary-hover button-anim-top transition-ease-in-out",
	socialIconsDarkClass = "p9 round-full button button-width-xxs button-height-xxs text-white text-white-hover background-secondary background-primary-hover button-anim-top transition-ease-in-out",
	socialIconsNavbarClass = "p9 round-full button button-width-xxs button-height-xxs text-white background-transparent-hover transition-ease-in-out",
	socialIconsFooterClass = "p9 round-full button button-width-xxs button-height-xxs text-white background-transparent-hover transition-ease-in-out",
	linkToBehance = "",
	linkToCodepen = "",
	linkToDribble = "",
	linkToEtsy = "",
	linkToFacebook = "https://www.facebook.com/stoamigo",
	linkToGithub = "",
	linkToGooglePlus = "",
	linkToInstagram = "",
	linkToLinkedIn = "https://www.linkedin.com/company/stoamigo",
	linkToMedium = "https://medium.com/@AxelApp",
	linkToPinterest = "",
	linkToReddit = "",
	linkToSkype = "",
	linkToSlack = "",
	linkToSnapchat = "",
	linkToTelegram = "",
	linkToTumblr = "",
	linkToTwitch = "",
	linkToTwitter = "https://www.twitter.com/stoamigo",
	linkToVimeo = "",
	linkToWhatsApp = "",
	linkToYelp = "",
	linkToYoutube = "",
	linkAttributionLabel = "",
	linkAttributionURL = "https://www.flaticon.com/packs/3?license=selection&order_by=1&color=2";
!0 === logging || (console.log = function() {});
var hasTouch = Modernizr.touchevents,
	$isiOS = $(".is-ios"),
	$isAndroid = $(".is-android"),
	$isMobile = $(".is-mobile"),
	$isDesktop = $(".is-desktop"),
	isSmallScreen = Modernizr.mq("(min-width: 0px) and (max-width: 414px)"),
	isMediumScreen = Modernizr.mq("(min-width: 0px) and (max-width: 768px)"),
	isLargeScreen = Modernizr.mq("(min-width: 0px)"),
	isPhone = Modernizr.mq("(min-device-width: 0px) and (max-device-width: 414px)"),
	isTablet = Modernizr.mq("(min-device-width: 415px) and (max-device-width: 768px)"),
	isAndroid = navigator.userAgent.toLowerCase().indexOf("android"),
	isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone"),
	isiPad = navigator.userAgent.toLowerCase().indexOf("ipad"),
	isiPod = navigator.userAgent.toLowerCase().indexOf("ipod"),
	isMobile = navigator.userAgent.toLowerCase().indexOf("android") > -1 || navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipad") > -1 || navigator.userAgent.toLowerCase().indexOf("ipod") > -1,
	isDesktop = !isMobile && !hasTouch,
	isTouchScreen = !isMobile && hasTouch;
if (isAndroid > -1 && ($isiOS.remove(), $isDesktop.remove()), (isiPhone > -1 || isiPad > -1 || isiPod > -1) && ($isAndroid.remove(), $isDesktop.remove()), isMobile ? $isDesktop.remove() : $isMobile.remove(), isDesktop ? $isMobile.remove() : $isDesktop.remove(), hasTouch) try {
	for (var si in document.styleSheets) {
		var styleSheet = document.styleSheets[si];
		if (styleSheet.rules)
			for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) styleSheet.rules[ri].selectorText && styleSheet.rules[ri].selectorText.match(":hover") && styleSheet.deleteRule(ri)
	}
}
catch (e) {}
var browserDetect = {
	init: function() {
		"use strict";
		this.browser = this.searchString(this.dataBrowser) || "Other", this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown"
	},
	searchString: function(e) {
		"use strict";
		for (var t = 0; t < e.length; t++) {
			var i = e[t].string;
			if (this.versionSearchString = e[t].subString, -1 !== i.indexOf(e[t].subString)) return e[t].identity
		}
	},
	searchVersion: function(e) {
		"use strict";
		var t = e.indexOf(this.versionSearchString);
		if (-1 !== t) {
			var i = e.indexOf("rv:");
			return "Trident" === this.versionSearchString && -1 !== i ? parseFloat(e.substring(i + 3)) : parseFloat(e.substring(t + this.versionSearchString.length + 1))
		}
	},
	dataBrowser: [{
		string: navigator.userAgent,
		subString: "Edge",
		identity: "MS Edge"
	}, {
		string: navigator.userAgent,
		subString: "MSIE",
		identity: "Explorer"
	}, {
		string: navigator.userAgent,
		subString: "Trident",
		identity: "Explorer"
	}, {
		string: navigator.userAgent,
		subString: "Firefox",
		identity: "Firefox"
	}, {
		string: navigator.userAgent,
		subString: "Opera",
		identity: "Opera"
	}, {
		string: navigator.userAgent,
		subString: "OPR",
		identity: "Opera"
	}, {
		string: navigator.userAgent,
		subString: "Chrome",
		identity: "Chrome"
	}, {
		string: navigator.userAgent,
		subString: "Safari",
		identity: "Safari"
	}]
};
browserDetect.init();
var isChrome = "Chrome" === browserDetect.browser,
	isExplorer = "Explorer" === browserDetect.browser,
	isEdge = "MS Edge" === browserDetect.browser,
	isFirefox = "Fireforx" === browserDetect.browser,
	isOpera = "Opera" === browserDetect.browser,
	isSafari = "Safari" === browserDetect.browser;
(isExplorer || isEdge) && (document.createElement("header"), document.createElement("nav"), document.createElement("main"), document.createElement("footer"), document.createElement("section"), document.createElement("article"), document.createElement("figure"), document.createElement("figcaption"), document.createElement("aside"), $("[class*='drop-shadow-']").addClass("box-shadow-xl")), isExplorer && ($("#navbar .menubar #navbar-logo a.logo-desktop svg").addClass("ie"), $("#nav-panel .menubar #nav-panel-logo a.logo-desktop svg").addClass("ie"));
var $anim = $(".anim"),
	$animAppear = $(".anim-appear"),
	$animBeat = $(".anim-beat"),
	$animBounce = $(".anim-bounce"),
	$animCrowdWave = $("ul.anim-crowd-wave"),
	$animFade = $(".anim-fade"),
	$animFloat = $(".anim-float"),
	$animHorizontal = $(".anim-horizontal"),
	$animPop = $("ul.anim-pop"),
	$animPulse = $(".anim-pulse"),
	$animShake = $(".anim-shake"),
	$animStarWars = $(".anim-perspective-scroll"),
	tlAppear = new TimelineMax({
		paused: !0,
		delay: 0,
		repeatDelay: 0,
		yoyo: !1,
		repeat: 0
	});
tlAppear.staggerFrom($animAppear.children(), 1, {
	autoAlpha: 0,
	scale: .98,
	ease: Expo.easeInOut
}, .12);
var tlBeat = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: 2,
	yoyo: !1,
	repeat: -1
});
tlBeat.from($animBeat, 1.25, {
	autoAlpha: .5,
	scale: 1.12,
	ease: Elastic.easeOut
});
var tlBounce = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: 2,
	yoyo: !1,
	repeat: -1
});
tlBounce.to($animBounce, .25, {
	y: -8,
	ease: Back.easeOut
}).to($animBounce, .75, {
	y: 0,
	ease: Bounce.easeOut
}), TweenMax.set($animCrowdWave.children(), {
	y: 0,
	transformOrigin: "bottom center"
});
var tlCrowdWave = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: 1,
	yoyo: !0,
	repeat: -1
});
tlCrowdWave.staggerTo($animCrowdWave.children(), .75, {
	y: -5,
	ease: Back.easeOut
}, .12).staggerTo($animCrowdWave.children(), .5, {
	y: 0,
	ease: Back.easeIn
}, -.12);
var tlFade = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: .5,
	yoyo: !0,
	repeat: -1
});
tlFade.to($animFade, 1, {
	autoAlpha: 0,
	ease: Power2.easeOut
}), $animFloat.each(function(e) {
	var t = getRandomNum(1, 5);
	new TimelineMax({
		paused: !1,
		delay: t,
		repeatDelay: 0,
		yoyo: !0,
		repeat: -1
	}).to($(this), t, {
		y: 10,
		ease: Power2.easeInOut,
		onComplete: getRandomNum,
		onCompleteParams: [1, 5]
	})
}), $animHorizontal.children().clone().insertBefore($animHorizontal.children());
var tlScrollHorizontal = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: 0,
	yoyo: !1,
	repeat: -1
});
tlScrollHorizontal.to($animHorizontal.children(), 75, {
	x: "-100%",
	ease: Linear.easeNone,
	onComplete: function() {
		TweenMax.set($animHorizontal.children(), {
			x: 0
		})
	}
});
var animHorizontalResize = function() {
	$animHorizontal.children().css({
		width: pageContent.innerWidth + "px"
	}), $animHorizontal.css({
		width: 2 * pageContent.innerWidth + "px"
	})
};
animHorizontalResize(), $(pageContent).on("resize", _.debounce(animHorizontalResize, updateResizeInterval)), $animPop.children().addClass("position-absolute center-element"), TweenMax.set($animPop.children().not(":first"), {
	autoAlpha: 1,
	y: 0,
	scaleY: 0,
	rotationX: 100,
	perspective: 400,
	transformOrigin: "bottom center"
});
var tlPop = new TimelineMax({
	paused: !0,
	delay: 2,
	repeatDelay: 5,
	yoyo: !0,
	repeat: -1
});
tlPop.staggerTo($animPop.children().not(":first"), .5, {
	autoAlpha: 1,
	y: 0,
	scaleY: 1,
	rotationX: 0,
	ease: Back.easeOut
}, .2);
var tlPulse = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: 0,
	yoyo: !0,
	repeat: -1
});
tlPulse.to($animPulse, .5, {
	autoAlpha: .5,
	ease: Power2.easeInOut
});
var tlShake = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: 2,
	yoyo: !1,
	repeat: -1
});
tlShake.to($animShake, .75, {
	x: -8,
	ease: Elastic.easeOut
}), TweenMax.set($animStarWars, {
	scale: 1.5,
	force3D: !0,
	perspective: 500
}), TweenMax.set($animStarWars.children(), {
	y: 0,
	rotationX: 25,
	force3D: !0,
	autoRound: !1
});
var tlStarWars = new TimelineMax({
	paused: !0,
	delay: 0,
	repeatDelay: 0,
	yoyo: !0,
	repeat: -1
});
tlStarWars.to($animStarWars.children(), 50, {
	backgroundPosition: "0 -700px",
	ease: Linear.easeNone
});
var animController = function() {
		"use strict";
		$animAppear.hasClass("anim-play") ? tlAppear.resume() : $animBeat.hasClass("anim-play") ? tlBeat.resume() : $animBounce.hasClass("anim-play") ? tlBounce.resume() : $animCrowdWave.hasClass("anim-play") ? tlCrowdWave.resume() : $animFade.hasClass("anim-play") ? tlFade.resume() : $animHorizontal.hasClass("anim-play") ? tlScrollHorizontal.resume() : $animPop.hasClass("anim-play") ? tlPop.resume() : $animPulse.hasClass("anim-play") ? tlPulse.resume() : $animShake.hasClass("anim-play") ? tlShake.resume() : $animStarWars.hasClass("anim-play") ? tlStarWars.resume() : (tlAppear.pause(), tlBeat.pause(), tlBounce.pause(), tlCrowdWave.pause(), tlFade.pause(), tlScrollHorizontal.pause(), tlPop.pause(), tlPulse.pause(), tlShake.pause(), tlStarWars.pause()), $(navPanel).hasClass("is-open") && (tlAppear.pause(), tlBeat.pause(), tlBounce.pause(), tlCrowdWave.pause(), tlFade.pause(), tlScrollHorizontal.pause(), tlPop.pause(), tlPulse.pause(), tlShake.pause(), tlStarWars.pause())
	},
	animPauseAll = function() {
		"use strict";
		tlBeat.pause(), tlBounce.pause(), tlCrowdWave.pause(), tlFade.pause(), tlScrollHorizontal.pause(), tlPop.pause(), tlPulse.pause(), tlShake.pause(), tlStarWars.pause()
	};
$(pageContent).on("scrollstart", animPauseAll), $(pageContent).on("scrollstop", animController), TweenMax.delayedCall(3, animController);
var components = function() {
		"use strict";
		var e = $(".img-preload"),
			t = $(".img-bg-resize"),
			i = $(".img-preload-wait");
		t.parent().addClass("background-pattern"), t.css({
			width: "100%",
			height: "100%",
			"min-height": "400px",
			"background-repeat": "repeat",
			"transition-property": "background-position"
		});
		var n = function() {
			t.each(function() {
				var e = $(this),
					t = e.css("background-image");
				if ("none" !== t) {
					t = t.replace('url("', "").replace('")', "");
					var i = new Image;
					i.src = t, i.onload = function() {
						e.css({
							width: "100%",
							height: i.height,
							"background-repeat": "no-repeat"
						}), isMediumScreen ? e.parent().css({
							height: i.height / 1.45
						}) : isMediumScreen || e.parent().css({
							height: .5 * i.height
						})
					}
				}
			})
		};
		TweenMax.delayedCall(updateDelayInterval, n), $(pageContent).on("resize", _.debounce(n, updateResizeInterval)), TweenMax.set(e, {
			autoAlpha: 0
		}), TweenMax.set(i.children(), {
			autoAlpha: 0,
			y: 50
		}), e.before('<div class="img-preloader"><span class="fa fa-spinner fa-pulse" aria-hidden="true"></span></div>'), e.imagesLoaded({
			background: !0
		}).always(function(t, i) {
			TweenMax.staggerTo(e, .5, {
				autoAlpha: 1,
				delay: 3,
				ease: Expo.easeInOut,
				onComplete: function() {
					$(".img-preloader").remove(), e.parent().addClass("anim-page-visibility")
				}
			})
		}).done(function(e) {
			n()
		}).fail(function() {}).progress(function(e, t) {});
		var o = $("[data-emergence]"),
			r = $(".emergence-ignore"),
			a = $(".emergence-ignore-child"),
			s = $(".hide-on-scroll");
		useEmergence && (isMobile || hasTouch || TweenMax.set(o.not(r).children().not(a).children(), {
			autoAlpha: 0,
			y: 50
		}), emergence.init({
			container: pageContent,
			reset: !0,
			handheld: !0,
			throttle: updateScrollInterval,
			elemCushion: 0,
			offsetTop: 0,
			offsetRight: 0,
			offsetBottom: 0,
			offsetLeft: 0,
			callback: function(e, t) {
				"visible" === t ? (isMobile || hasTouch || TweenMax.staggerTo($(e).not(r).children().not(a).children(), .25, {
					autoAlpha: 1,
					y: 0,
					ease: Back.easeOut
				}, .12), $(e).addClass("emergence-visible"), $(e).find($anim).addClass("anim-play"), TweenMax.to($(e).find(s), 1, {
					autoAlpha: 1,
					y: 0,
					delay: 1,
					ease: Expo.easeOut
				}, .12)) : "reset" === t && ($(e).removeClass("emergence-visible"), $(e).find($anim).removeClass("anim-play"), isMobile || hasTouch || TweenMax.set($(e).find(s), {
					autoAlpha: 0,
					y: 10
				}))
			}
		}), emergence.engage(), TweenMax.delayedCall(2, emergence.engage));
		var l = $(".fx-3d-text-xs"),
			c = $(".fx-3d-text-sm"),
			u = $(".fx-3d-text-md"),
			h = $(".fx-3d-text-lg"),
			d = $(".fx-3d-text-xl");
		l.text3d({
			depth: 1,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 2,
			shadowAngle: 120,
			shadowOpacity: .2
		}), c.text3d({
			depth: 2,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 4,
			shadowAngle: 120,
			shadowOpacity: .2
		}), u.text3d({
			depth: 4,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 6,
			shadowAngle: 120,
			shadowOpacity: .2
		}), h.text3d({
			depth: 6,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 8,
			shadowAngle: 120,
			shadowOpacity: .2
		}), d.text3d({
			depth: 8,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 8,
			shadowAngle: 120,
			shadowOpacity: .2
		}), (isExplorer || isEdge) && (l.text3d({
			depth: 1,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 0,
			shadowAngle: 0,
			shadowOpacity: 0
		}), c.text3d({
			depth: 2,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 0,
			shadowAngle: 0,
			shadowOpacity: 0
		}), u.text3d({
			depth: 4,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 0,
			shadowAngle: 0,
			shadowOpacity: 0
		}), h.text3d({
			depth: 6,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 0,
			shadowAngle: 0,
			shadowOpacity: 0
		}), d.text3d({
			depth: 8,
			angle: 120,
			color: "#c8c8c8",
			lighten: -.1,
			shadowDepth: 0,
			shadowAngle: 0,
			shadowOpacity: 0
		})), $("li.accordion-item").find("a.accordion-title").on("click", function(e) {
			e.preventDefault(), TweenMax.delayedCall(.25, p)
		});
		var p = function() {
				$("li.accordion-item").hasClass("is-active") ? ($("li.accordion-item:not(.is-active)").find("a.accordion-title").css({
					"background-color": "#f4f4f4"
				}), $("li.accordion-item.is-active").find("a.accordion-title").css({
					"background-color": "#6400fa"
				})) : $("li.accordion-item").find("a.accordion-title").css({
					"background-color": "#fff"
				})
			},
			f = $(".slider-default");
		TweenMax.delayedCall(2, function() {
			f.flickity("resize")
		});
		var m = $(".slider-default.adapt").flickity({});
		f.has(".adapt").each(function() {
			var e = $(this);
			e.find("ol.flickity-page-dots").prependTo($(this).find(".flickity-viewport")), e.find(".flickity-viewport").css("height", $(this).find(".flickity-viewport .slider-item.is-selected .cell").height() + "px")
		}), $(".slider-item a").on("click touchdown", function(e) {
			return e.preventDefault(), !1
		}), m.on("select.flickity", function() {
			var e = $(this);
			e.each(function() {
				e.find(".flickity-viewport").css("height", $(this).find(".flickity-viewport .slider-item.is-selected .cell").height() + "px")
			})
		});
		var g = $(".slider-video").flickity({});
		if (g.on("settle.flickity", function() {
				g.has(".yt-player").each(function() {
					$(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
				})
			}), TweenMax.set("#slider-testimonials .slider-item:not(.is-selected)", {
				scale: .75,
				transformOrigin: "bottom center"
			}), $("#slider-testimonials").on("select.flickity", function() {
				TweenMax.to("#slider-testimonials .slider-item.is-selected", .75, {
					scale: 1,
					ease: Back.easeInOut
				}), TweenMax.to("#slider-testimonials .slider-item:not(.is-selected)", .5, {
					scale: .75,
					ease: Back.easeOut
				})
			}).on("settle.flickity", function() {}), "about" === $(".page").data("page") || "team" === $(".page").data("page")) {
			var v = $("#team"),
				y = $(".profiles"),
				b = ".profile-user",
				w = $("ul.profile-info"),
				x = ".profile-bio",
				T = [];
			$.getJSON("https://stoamigointernational.github.io/stoamigo.app/pages/team/profiles.json", function(e) {
				$.each(e.person, function(e, t) {
					T.push([t.name, t.position, t.smallimage, t.largeimage, t.bio]), y.append("<a id=" + t.name.replace(/\s+/g, "-").toLowerCase() + ' class="cell profile-user padding-none pointer-disabled ' + t.position.replace(/\s+/g, "-").toLowerCase() + '" data-name="' + t.name + '" data-position="' + t.position + '" data-bio="' + t.bio + '" data-photo="' + t.largeimage + '"> <ul class="profile-info img-preload-wait"> <li class="name">' + t.name + '</li> <li class="position">' + t.position + '</li> </ul> <img src="' + t.smallimage + '" alt="' + t.name + '" class="profile-small-photo duotone-process img-clone img-preload"/> </a>'), $(b).find(".profile-small-photo").before('<div class="profile-img-preloader position-absolute top left padding-xxs width-full height-full p5 text-white background-black-25 z-03"><span class="fa fa-spinner fa-pulse center-vh" aria-hidden="true"></span></div>'), y.before('<p class="status-data position-absolute margin-sm padding-xs round-sm p10 text-charcoal background-white bring-to-front"><span class="fa fa-spinner fa-pulse margin-lr-xs" aria-hidden="true"></span></p>'), TweenMax.set(y, {
						autoAlpha: 0
					}), TweenMax.set(y.children(), {
						autoAlpha: 0
					}), TweenMax.set(w.children(), {
						autoAlpha: 0,
						y: 25
					})
				})
			}).done(function(e) {}).fail(function(e) {
				y.replaceWith('<p class="status-error position-absolute margin-sm padding-xs round-sm p10 text-charcoal background-white bring-to-front"><span class="fa fa-exclamation-circle margin-right-xs" aria-hidden="true"></span><strong>Error:</strong> Unable to fetch team member data.</p>')
			}).always(function(e) {
				$(".profile-small-photo").imagesLoaded({
					background: !1
				}).always(function(e, t) {}).done(function(e) {
					TweenMax.delayedCall(2, function() {
						$(b).css({
							height: $(".profile-small-photo").height()
						}), new TimelineMax({
							paused: !1,
							delay: 0,
							repeatDelay: 0,
							yoyo: !0,
							repeat: !1
						}).to(y, .5, {
							autoAlpha: 1,
							ease: Expo.easeInOut
						}).staggerTo(y.children(), .75, {
							autoAlpha: 1,
							ease: Expo.easeOut
						}, .12).staggerTo(w.children(), .75, {
							autoAlpha: 1,
							y: 0,
							delay: .5,
							ease: Expo.easeOut
						}, .12).staggerTo(".profile-img-preloader", .5, {
							autoAlpha: 0,
							ease: Expo.easeOut
						}, .05).to(".status-data", .5, {
							autoAlpha: 0,
							x: -10,
							ease: Expo.easeInOut
						}).add(function() {
							$(".profile-img-preloader").remove(), $(".status-data").remove(), y.children().removeClass("pointer-disabled")
						}), $(".profile-small-photo").each(function() {
							var e = $(this);
							(new Image).src = Image, e.parent().css({
								height: e.height()
							}), e.clone().insertAfter(this).removeClass("duotone-process").addClass("duotone-reset").css({
								opacity: "1",
								visibility: "visible",
								position: "absolute",
								top: "0",
								left: "0",
								"z-index": "0"
							}), e.duotone({
								gradientMap: "#6400fa, #32e14b"
							})
						}), $(b).on("mouseover touchstart", function() {
							TweenMax.to($(this).find(".duotone-process"), .5, {
								autoAlpha: 0,
								scale: 1.35,
								ease: Back.easeOut
							}), TweenMax.to($(this).find(".duotone-reset"), .75, {
								scale: 1.05,
								ease: Back.easeOut
							})
						}).on("mouseout touchend touchmove touchleave", function() {
							TweenMax.to($(this).find(".duotone-process"), 1, {
								autoAlpha: 1,
								scale: 1,
								ease: Expo.easeOut
							}), TweenMax.to($(this).find(".duotone-reset"), .75, {
								scale: 1,
								ease: Expo.easeOut
							})
						})
					});
					var t = !1,
						i = function() {
							isEdge ? TweenMax.to(body, scrollToSpeed, {
								scrollTo: {
									y: $("#profile").offset().top - $(navbar).height(),
									offsetY: 0,
									autoKill: !0
								},
								ease: scrollToEase
							}) : hasTouch ? $(pageContent).scrollTop($("#profile").offset().top - $(navbar).height()) : TweenMax.to(html, scrollToSpeed, {
								scrollTo: {
									y: $("#profile").offset().top - $(navbar).height(),
									offsetY: 0,
									autoKill: !0
								},
								ease: scrollToEase
							})
						},
						n = function() {
							TweenMax.to($(x).find(".close"), .25, {
								autoAlpha: 0,
								ease: Expo.easeOut
							}), TweenMax.to($(b + ".active").find(".duotone-process"), 1.25, {
								autoAlpha: 0,
								scale: 1,
								delay: .25,
								ease: Back.easeOut
							}), TweenMax.to($(b + ".active").find(".duotone-reset"), .25, {
								scale: 1,
								delay: .25,
								ease: Back.easeOut
							}), TweenMax.to($(b).not(".active").find(".duotone-process"), 1.25, {
								autoAlpha: 1,
								scale: 1,
								delay: .25,
								ease: Back.easeOut
							}), TweenMax.to($(b).not(".active").find(".duotone-reset"), .25, {
								scale: 1,
								delay: .25,
								ease: Back.easeOut
							})
						},
						o = function() {
							$(x).remove()
						},
						r = function() {
							t = !0, n(), TweenMax.to($(x).find(".close"), 1, {
								autoAlpha: 1,
								delay: .25,
								ease: Expo.easeOut
							}), v.find(x).length && (hasTouch && isPhone ? (i(), TweenMax.to(x, .75, {
								height: $(x).find(".text-container").innerHeight() + $(".profile-large-photo").innerHeight(),
								delay: .25,
								ease: Expo.easeOut,
								autoRound: !1
							})) : TweenMax.to(x, .75, {
								height: $(x).find(".text-container").outerHeight() + 400,
								delay: .25,
								ease: Back.easeOut,
								onComplete: i,
								autoRound: !1
							}), $(x).find(".close").on("click", function() {
								a()
							}))
						},
						a = function() {
							t = !1, $(b).removeClass("active"), n(), TweenMax.to(x, .75, {
								height: 0,
								ease: Expo.easeOut,
								onComplete: o
							})
						};
					$(b).not(".active").on("click", function(e) {
						e.preventDefault();
						var i = $(this),
							n = '<section id="profile" class="profile-bio grid-x align-center align-middle padding-none small-up-1 medium-up-2">     <div class="close z-10"><span></span><span></span></div>      <div class="cell profile-large-photo" style="background-image: url(' + i.data("photo") + ')">   </div></div>           <div class="cell text-container padding-md"> <h2 class="p8 font-paragraph text-secondary header-accent header-accent-secondary">' + i.data("name") + '</h2> <h3 class="p10 font-paragraph text-dark-grey">' + i.data("position") + "</h3> <p>" + i.data("bio") + "</p> </div>      </section>";
						i.addClass("active"), $(b).not(i).removeClass("active"), v.find(x).length || (y.before(n), r()), t && (TweenMax.to($(x).find(".close"), .25, {
							autoAlpha: 0,
							ease: Expo.easeOut
						}), TweenMax.to(x, .5, {
							height: 0,
							ease: Expo.easeOut,
							onComplete: function() {
								$(x).replaceWith(n), r()
							}
						}))
					}), $(pageContent).on("resize", _.debounce(function() {
						TweenMax.delayedCall(.25, function() {
							$(".profile-small-photo").parent().css({
								height: $(".profile-small-photo").height()
							}), $(".profile-small-photo").not(".duotone-reset").duotone("process")
						})
					}, updateResizeInterval))
				}).fail(function() {}).progress(function(e, t) {})
			})
		}
		if ("about" === $(".page").data("page") || "team" === $(".page").data("page") || "careers" === $(".page").data("page")) {
			$("#blog");
			var k = $("#blog-content"),
				C = {
					rss_url: "https://medium.com/feed/@axelapp"
				};
			$.getJSON("https://api.rss2json.com/v1/api.json", C, function(e) {
				if ("ok" === e.status) {
					var t = "";
					$.each(e.items, function(e, i) {
						t += '<div class="cell padding-none' + (e < 3 ? "" : " visible-sm") + '"><header>', t += '<span class="date">' + $.format.date(i.pubDate, "dd<br>MMM") + "</span>";
						var n = i.description.indexOf("<img"),
							o = i.description.substring(n).indexOf("src=") + n + 5,
							r = i.description.substring(o).indexOf('"') + o,
							a = i.description.substring(o, r);
						t += '<figure><div class="post-image" style="background-image: url(' + a + ')"></div></figure></header>', t += '<div class="post-content" data-equalizer-watch><h4><a href="' + i.link + '" target="_blank" class="external">' + i.title + "</a></h4>", t += '<div class="post-meta"><span class="post-author">By ' + i.author + "</span></div>";
						var s = i.description.toString().replace(/<img[^>]*>/, "").substr(0, 120),
							l = i.link;
						return s = s.substr(0, Math.min(s.length, s.lastIndexOf(" "))), t += '<a class="center-element p11 text-dar text-dark-grey text-accent-hover text-uppercase border-thin border-solid border-top border-light-grey button button-width-full background-transparent background-transparent-hover external" href="' + l + '" target="_blank"><i class="fa fa-external-link margin-right-xs"></i>Read more</a>', t += "</div></div></div>", e < 3
					}), k.html(t)
				}
			}).done(function(e) {}).fail(function(e) {}).always(function(e) {})
		}
	},
	uiInit = function() {
		"use strict";
		var e = $('a[target="_blank"]'),
			t = $(".stack-order-auto"),
			i = $(".hero-margin"),
			n = $(".button"),
			o = $(".no-touch-feedback"),
			r = $(".button.background-dark-grey"),
			a = $(".button.background-charcoal"),
			s = $(".button.background-black"),
			l = $(".button.background-primary"),
			c = $(".button.background-secondary"),
			u = $(".button.background-accent"),
			h = $(".button.background-light-grey"),
			d = $(".button.background-white"),
			p = $(".button.button-fx-waves-button"),
			f = $(".button.button-fx-waves-circle"),
			m = $(".button.button-fx-waves-light"),
			g = $(".button.button-fx-float"),
			v = $(".button.button-fx-waves-block"),
			y = $(".button.no-waves");
		if ($(document).foundation(), TweenMax.delayedCall(1, Foundation.reInit, ["equalizer"]), $(container).before('<div id="error"><p>Please resize your window or rotate <span class="fa fa-repeat margin-lr-xs" aria-hidden="true"></span> your phone to portrait mode.</p></div>'), window.opener = null, e.attr("rel", "noopener noreferrer"), showNav || ($(navbarToggle).remove(), $(navbarLabel).remove(), $(navbarItems).remove(), $(footer).find(navItems).remove()), "left" === navbarItemsPosition ? $(navbarItems).parent().parent().css({
				float: "left"
			}) : "center" === navbarItemsPosition ? $(navbarItems).parent().parent().css({
				float: "none"
			}).addClass("text-center") : "right" === navbarItemsPosition && $(navbarItems).parent().parent().css({
				float: "right"
			}), $(navbarMenubar).css({
				width: "100%",
				"max-width": navbarWidth
			}), $(toolbarMenubar).css({
				width: "100%",
				"max-width": toolbarWidth
			}), $(navPanel).find(".menubar").css({
				height: navbarHeight
			}), $(main).css({
				width: "100%",
				"max-width": mainWidth
			}), i.each(function() {
				var e = $(this);
				isPhone ? e.css({
					"margin-top": $(".hero").height() / 2 + "px"
				}) : e.css({
					"margin-top": .75 * $(".hero").height() + "px"
				})
			}), t.children().not(".stack-order-ignore").each(function(e) {
				$(this).css({
					"z-index": 1 + e,
					position: "relative"
				})
			}), hasTouch && useButtonTouchFeedback && n.not(o).on("mousedown touchstart", function() {
				var e = $(this);
				TweenMax.set(e, {
					x: 1,
					y: 1,
					scale: .95,
					boxShadow: "0 8px 10px 1px rgba(0,0,0,0.06), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.08)"
				})
			}).on("mouseup mouseleave touchend touchleave touchmove", function() {
				var e = $(this);
				TweenMax.set(e, {
					clearProps: "all"
				})
			}), disableNavPanelMomentumScrolling ? $(navPanel).addClass("touch-scroll-disabled") : $(navPanel).removeClass("touch-scroll-disabled"), navbarAllowSticky || $("#scroll-progress").length) {
			var b = function() {
				var e = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100;
				$("#scroll-progress").css({
					width: e + "%"
				})
			};
			b(), $(pageContent).on("scroll", _.throttle(b, updateScrollInterval))
		}
		showNavPanel ? new Foundation.OffCanvas($(navPanel), {
			closeOnClick: !0,
			contentOverlay: !0,
			contentId: "content",
			nested: !1,
			contentScroll: !1,
			transitionTime: null,
			transition: "overlap",
			forceTo: !1,
			isRevealed: !1,
			revealOn: null,
			autoFocus: !1,
			revealClass: "reveal-for-",
			trapFocus: !1
		}) : ($(navPanel).remove(), $(navToggle).remove(), $(navbarLabel).remove()), hideNavPanelScrollbar && $(navPanel).addClass("no-scrollbar"), hasTouch ? $(navPanel).addClass("off-canvas-width-full") : $(navPanel).removeClass("off-canvas-width-full"), "top" === navPanelPosition ? $(navPanel).addClass("position-top") : "bottom" === navPanelPosition ? $(navPanel).addClass("position-bottom") : "left" === navPanelPosition ? $(navPanel).addClass("position-left") : "right" === navPanelPosition ? $(navPanel).addClass("position-right") : $(navPanel).addClass("position-left"), $(navPanel).css({
			"transition-duration": "" + navPanelTransitionSpeed
		}), $.inArray(navPanelTransitionEase, ["Type 1", "Quad"]) >= 0 ? $(navPanel).css({
			"transition-timing-function": "cubic-bezier(.25, .46, .45, .94)"
		}) : $.inArray(navPanelTransitionEase, ["Type 2", "Cubic"]) >= 0 ? $(navPanel).css({
			"transition-timing-function": "cubic-bezier(.215, .61, .355, 1)"
		}) : $.inArray(navPanelTransitionEase, ["Type 3", "Quart"]) >= 0 ? $(navPanel).css({
			"transition-timing-function": "cubic-bezier(.165, .84, .44, 1)"
		}) : $.inArray(navPanelTransitionEase, ["Type 4", "Quint"]) >= 0 ? $(navPanel).css({
			"transition-timing-function": "cubic-bezier(.23, 1, .32, 1)"
		}) : $.inArray(navPanelTransitionEase, ["Type 5", "Expo"]) >= 0 ? $(navPanel).css({
			"transition-timing-function": "cubic-bezier(.19, 1, .22, 1)"
		}) : $.inArray(navPanelTransitionEase, ["Type 6", "Circ"]) >= 0 ? $(navPanel).css({
			"transition-timing-function": "cubic-bezier(.075, .82, .165, 1)"
		}) : $.inArray(navPanelTransitionEase, ["Type 7", "InOut"]) >= 0 ? $(navPanel).css({
			"transition-timing-function": "cubic-bezier(1, 0, 0, 1)"
		}) : $(navPanel).css({
			"transition-timing-function": "ease"
		}), showNavbar || $(navbar).remove(), showToolbar || $(toolbar).remove(), showFooterNav || ($(footer).find(navItems).remove(), $(footer).children().last().css({
			"margin-top": "3rem"
		})), useButtonWavesEffect && !isExplorer && (Waves.attach(n, ["waves-effect"]), Waves.attach(r, ["waves-light"]), Waves.attach(a, ["waves-light"]), Waves.attach(s, ["waves-light"]), Waves.attach(l, ["waves-button"]), Waves.attach(c, ["waves-button"]), Waves.attach(u, ["waves-button"]), Waves.attach(h, ["waves-button"]), Waves.attach(d, ["waves-button"]), Waves.attach(p, ["waves-button"]), Waves.attach(f, ["waves-circle"]), Waves.attach(m, ["waves-light"]), Waves.attach(g, ["waves-float"]), Waves.attach(v, ["waves-block"]), Waves.init(), y.removeClass("waves-effect"))
	},
	uiSocialLinks = function() {
		"use strict";
		var e = $("ul.social-icons"),
			t = $("ul.social-icons.light"),
			i = $("ul.social-icons.dark"),
			n = $("ul#nav-panel-social-icons"),
			o = $("ul#navbar-social-icons"),
			r = $("ul#footer-social-icons"),
			a = $("ul#footer-social-icons, ul#navbar-social-icons"),
			s = $("ul#nav-contact-info"),
			l = $(".link-attribution");
		linkToPhoneNumber && usePhoneIcon && e.not(".standalone").append('<li><a href="tel:' + linkToPhoneNumber + '" class="go-phone social-icon-brand-phone-hover" aria-label="Phone: ' + linkToPhoneNumber + '"><span class="fa fa-phone" aria-hidden="true"></span></a></li>'), linkToPhoneNumber && usePhoneLabel && (s.append('<li><a href="tel:' + linkToPhoneNumber + '" class="go-phone"></a></li>'), s.find("a.go-phone").text(phoneNumberLabel).addClass(contactInfoClass)), linkToPhoneNumber && usePhoneLabel || s.find("li:nth-child(1)").remove(), linkToEmail && useEmailIcon && (linkToEmail.indexOf("@") > -1 ? e.not(".standalone").append('<li><a href="mailto:' + linkToEmail + "?subject=" + linkToEmailSubject + '" class="go-email social-icon-brand-email-hover" aria-label="Email: ' + linkToEmail + '"><span class="fa fa-envelope" aria-hidden="true"></span></a></li>') : e.not(".standalone").append('<li><a href="' + linkToEmail + '" target="_parent" class="go-email social-icon-brand-email-hover" aria-label="Email: ' + linkToEmail + '"><span class="fa fa-envelope" aria-hidden="true"></span></a></li>')), linkToEmail && useEmailLabel && linkToEmail.indexOf("@") > -1 ? (s.append('<li><a href="mailto:' + linkToEmail + "?subject=" + linkToEmailSubject + '" class="go-email"></a></li>'), s.find("a.go-email").text(emailLabel).addClass(contactInfoClass)) : linkToEmail && useEmailLabel && !linkToEmail.indexOf("@") && (s.append('<li><a href="' + linkToEmail + '" target="_parent" class="go-email"></a></li>'), s.find("a.go-email").text(emailLabel).addClass(contactInfoClass)), linkToEmail && useEmailLabel || s.find("li:nth-child(2)").remove(), (useEmailLabel || usePhoneLabel) && (linkToEmail || linkToPhoneNumber) || s.remove(), linkToBehance && e.not(".standalone").append('<li><a href="' + linkToBehance + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-behance-hover go-behance" aria-label="Behance"><span class="fa fa-behance" aria-hidden="true"></span></a></li>'), linkToCodepen && e.not(".standalone").append('<li><a href="' + linkToCodepen + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-codepen-hover" aria-label="CodePen"><span class="fa fa-codepen" aria-hidden="true"></span></a></li>'), linkToDribble && e.not(".standalone").append('<li><a href="' + linkToDribble + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-dribble-hover" aria-label="Dribble"><span class="fa fa-dribble" aria-hidden="true"></span></a></li>'), linkToEtsy && e.not(".standalone").append('<li><a href="' + linkToEtsy + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-etsy-hover" aria-label="Etsy"><span class="fa fa-etsy" aria-hidden="true"></span></a></li>'), linkToFacebook && e.not(".standalone").append('<li><a href="' + linkToFacebook + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-facebook-hover" aria-label="Facebook"><span class="fa fa-facebook" aria-hidden="true"></span></a></li>'), linkToGithub && e.not(".standalone").append('<li><a href="' + linkToGithub + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-github-hover" aria-label="GitHub"><span class="fa fa-github" aria-hidden="true"></span></a></li>'), linkToGooglePlus && e.not(".standalone").append('<li><a href="' + linkToGooglePlus + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-google-plus-hover" aria-label="Google+"><span class="fa fa-google-plus" aria-hidden="true"></span></a></li>'), linkToInstagram && e.not(".standalone").append('<li><a href="' + linkToInstagram + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-instagram-hover" aria-label="Instagram"><span class="fa fa-instagram" aria-hidden="true"></span></a></li>'), linkToLinkedIn && e.not(".standalone").append('<li><a href="' + linkToLinkedIn + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-linkedin-hover" aria-label="LinkedIn"><span class="fa fa-linkedin" aria-hidden="true"></span></a></li>'), linkToMedium && e.not(".standalone").append('<li><a href="' + linkToMedium + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-medium-hover" aria-label="Medium"><span class="fa fa-medium" aria-hidden="true"></span></a></li>'), linkToPinterest && e.not(".standalone").append('<li><a href="' + linkToPinterest + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-pinterest-hover" aria-label="Pinterest"><span class="fa fa-pinterest" aria-hidden="true"></span></a></li>'), linkToReddit && e.not(".standalone").append('<li><a href="' + linkToReddit + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-reddit-hover" aria-label="Reddit"><span class="fa fa-reddit" aria-hidden="true"></span></a></li>'), linkToSkype && e.not(".standalone").append('<li><a href="' + linkToSkype + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-skype-hover" aria-label="Skype"><span class="fa fa-skype" aria-hidden="true"></span></a></li>'), linkToSlack && e.not(".standalone").append('<li><a href="' + linkToSlack + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-slack-hover" aria-label="Slack"><span class="fa fa-slack" aria-hidden="true"></span></a></li>'), linkToSnapchat && e.not(".standalone").append('<li><a href="' + linkToSnapchat + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-snapchat-hover" aria-label="Snapchat"><span class="fa fa-snapchat" aria-hidden="true"></span></a></li>'), linkToTelegram && e.not(".standalone").append('<li><a href="' + linkToTelegram + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-telegram-hover" aria-label="Telegram"><span class="fa fa-telegram" aria-hidden="true"></span></a></li>'), linkToTumblr && e.not(".standalone").append('<li><a href="' + linkToTumblr + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-tumblr-hover" aria-label="Tumblr"><span class="fa fa-tumblr" aria-hidden="true"></span></a></li>'), linkToTwitch && e.not(".standalone").append('<li><a href="' + linkToTwitch + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-twitch-hover" aria-label="Twitch"><span class="fa fa-twitch" aria-hidden="true"></span></a></li>'), linkToTwitter && e.not(".standalone").append('<li><a href="' + linkToTwitter + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-twitter-hover" aria-label="Twitter"><span class="fa fa-twitter" aria-hidden="true"></span></a></li>'), linkToVimeo && e.not(".standalone").append('<li><a href="' + linkToVimeo + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-vimeo-hover" aria-label="Vimeo"><span class="fa fa-vimeo" aria-hidden="true"></span></a></li>'), linkToWhatsApp && e.not(".standalone").append('<li><a href="' + linkToWhatsApp + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-whatsapp-hover" aria-label="WhatsApp"><span class="fa fa-whatsapp" aria-hidden="true"></span></a></li>'), linkToYelp && e.not(".standalone").append('<li><a href="' + linkToYelp + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-yelp-hover" aria-label="Yelp"><span class="fa fa-yelp" aria-hidden="true"></span></a></li>'), linkToYoutube && e.not(".standalone").append('<li><a href="' + linkToYoutube + '" target="_blank" rel="noopener noreferrer" class="social-icon-brand-youtube-hover" aria-label="Youtube"><span class="fa fa-youtube-play" aria-hidden="true"></span></a></li>'), "top" === socialIconsPosition || e.hasClass("top") ? e.not(a).addClass("top") : "left" === socialIconsPosition || e.hasClass("left") ? e.not(a).addClass("left") : "bottom" === socialIconsPosition || e.hasClass("bottom") ? e.not(a).addClass("bottom") : "right" === socialIconsPosition || e.hasClass("right") ? e.not(a).addClass("right") : e.not(a).addClass("bottom"), e.hasClass("light") && t.not(a).find("li a").addClass(socialIconsLightClass), e.hasClass("dark") && i.not(a).find("li a").addClass(socialIconsDarkClass), showSocialIconsInNavPanel || n.remove(), showSocialIconsInNavbar ? o.find("li a").addClass(socialIconsNavbarClass) : o.remove(), showSocialIconsInFooter ? r.find("li a").addClass(socialIconsFooterClass) : r.remove(), e.find("li a.button").addClass("padding-none").addClass("external"), linkAttributionLabel && linkAttributionURL ? l.append('<a href="' + linkAttributionURL + '" target="_blank" rel="noopener noreferrer" aria-label="' + linkAttributionLabel + '">' + linkAttributionLabel + "</a>") : l.remove(), (linkToCodepen || linkToBehance || linkToDribble || linkToEtsy || linkToFacebook || linkToGithub || linkToGooglePlus || linkToInstagram || linkToLinkedIn || linkToMedium || linkToPinterest || linkToReddit || linkToSkype || linkToSnapchat || linkToSlack || linkToTumblr || linkToTwitch || linkToTwitter || linkToVimeo || linkToWhatsApp || linkToYelp || linkToYoutube) && (showSocialIconsInNavPanel || showSocialIconsInFooter) || e.remove()
	},
	uiScrollEvents = function() {
		"use strict";
		$(navbar).headroom({
			scroller: pageContent,
			offset: stickyOffset,
			tolerance: {
				up: stickyScrollToleranceUp,
				down: stickyScrollToleranceDown
			},
			classes: {
				initial: "",
				pinned: "is-scrolling-up",
				unpinned: "is-scrolling-down",
				top: "is-top",
				notTop: "is-not-top",
				bottom: "is-bottom",
				notBottom: "is-not-bottom"
			},
			onPin: function() {
				navbarHideOnScrollUp ? TweenMax.to(navbar, navbarHideSpeed, {
					y: -parseFloat(navbarHeight, 10),
					ease: navbarHideEase
				}) : (TweenMax.to(navbar, navbarHideSpeed, {
					y: 0,
					ease: navbarHideEase
				}), TweenMax.to(navbarMenubar, navbarShrinkSpeed, {
					height: navbarShrinkHeight,
					ease: navbarShrinkEase
				}), TweenMax.set($(navPanel).find(".menubar"), {
					height: navbarShrinkHeight
				})), toolbarHideOnScrollUp || $(toolbar).hasClass("hide-on-scroll-up") ? TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: -parseFloat(toolbarHeight, 10),
					ease: toolbarHideEase
				}) : (TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: 0,
					ease: toolbarHideEase
				}), TweenMax.to(toolbarMenubar, toolbarShrinkSpeed, {
					height: toolbarShrinkHeight,
					ease: toolbarShrinkEase
				}))
			},
			onUnpin: function() {
				navbarHideOnScrollDown ? (TweenMax.to(navbar, navbarHideSpeed, {
					y: -parseFloat(navbarHeight, 10),
					ease: navbarHideEase
				}), $("a.dropdown").removeClass("active"), $("ul.subnav").addClass("pointer-disabled"), TweenMax.to("ul.subnav", .5, {
					autoAlpha: 0,
					x: 25,
					ease: Expo.easeOut
				})) : TweenMax.to(navbar, navbarHideSpeed, {
					y: 0,
					ease: navbarHideEase
				}), toolbarHideOnScrollDown ? TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: -parseFloat(toolbarHeight, 10),
					ease: toolbarHideEase
				}) : TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: 0,
					ease: toolbarHideEase
				})
			},
			onTop: function() {
				$(navbar).css({
					position: "absolute"
				}), $(navbar).removeClass(navbarStickyClass), $(navPanel).removeClass(navbarStickyClass), $(hero).removeClass(navbarStickyClass), TweenMax.to(navbarMenubar, navbarShrinkSpeed, {
					height: navbarHeight,
					ease: navbarShrinkEase
				}), TweenMax.set($(navPanel).find(".menubar"), {
					height: navbarHeight
				}), showNavbarLogo || TweenMax.set(navbarLogo, {
					autoAlpha: 0
				}), toolbarShowOnPageStart ? TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: 0,
					ease: toolbarHideEase
				}) : TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: -parseFloat(toolbarHeight, 10),
					ease: toolbarHideEase
				})
			},
			onNotTop: function() {
				navbarAllowSticky && ($(navbar).css({
					position: "fixed",
					top: "0"
				}), $(navbar).addClass(navbarStickyClass), $(navPanel).addClass(navbarStickyClass), $(hero).addClass(navbarStickyClass)), useContentMargin ? $(main).not(".content-margin-ignore").css({
					"margin-top": parseFloat(navbarShrinkHeight.replace(/px/, "")) / 16 + "rem"
				}) : $(main).not(".content-margin-ignore").css({
					"margin-top": "0"
				}), TweenMax.to(navbarMenubar, navbarShrinkSpeed, {
					height: navbarShrinkHeight,
					ease: navbarShrinkEase
				}), TweenMax.set($(navPanel).find(".menubar"), {
					height: navbarShrinkHeight
				}), TweenMax.to(toolbarMenubar, toolbarShrinkSpeed, {
					height: toolbarShrinkHeight,
					ease: toolbarShrinkEase
				}), !showNavbarLogo && showNavbarLogoOnSticky && navbarAllowSticky && TweenMax.set(navbarLogo, {
					autoAlpha: 1
				})
			},
			onBottom: function() {
				navbarShowOnPageEnd ? (TweenMax.to(navbar, navbarHideSpeed, {
					y: 0,
					ease: navbarHideEase
				}), TweenMax.to(navbarMenubar, navbarHideSpeed, {
					height: navbarShowOnPageEndHeight,
					ease: navbarHideEase
				}), TweenMax.set($(navPanel).find(".menubar"), {
					height: navbarShowOnPageEndHeight
				})) : (TweenMax.to(navbar, navbarHideSpeed, {
					y: -parseFloat(navbarHeight, 10),
					ease: navbarHideEase
				}), TweenMax.to(navbarMenubar, navbarHideSpeed, {
					height: navbarShowOnPageEndHeight,
					ease: navbarHideEase
				}), TweenMax.set($(navPanel).find(".menubar"), {
					height: navbarShowOnPageEndHeight
				})), toolbarShowOnPageEnd ? (TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: 0,
					ease: toolbarHideEase
				}), TweenMax.to(toolbarMenubar, toolbarShrinkSpeed, {
					height: toolbarShowOnPageEndHeight,
					ease: toolbarShrinkEase
				})) : (TweenMax.to(toolbar, toolbarHideSpeed, {
					bottom: -parseFloat(toolbarHeight, 10),
					ease: toolbarHideEase
				}), TweenMax.to(toolbarMenubar, toolbarShrinkSpeed, {
					height: toolbarShowOnPageEndHeight,
					ease: toolbarShrinkEase
				}))
			},
			onNotBottom: function() {
				TweenMax.to(toolbarMenubar, toolbarShrinkSpeed, {
					height: toolbarShrinkHeight,
					ease: toolbarShrinkEase
				})
			}
		})
	},
	uiSmoothScroll = function() {
		"use strict";

		function e(e) {
			return e = "" !== e && (e = e.split("?"))[0]
		}
		var t = $(".scroll-to"),
			i = $('a.scroll-to[href$="#top"]');
		navPanelCloseOnLinkClick || $(navPanelItems).find(t).removeAttr("data-toggle", "" + navPanel.substring(1)), e(location.hash), window.scrollTo(0, 0), !hasTouch && allowScrollTo && t.not(i).on("click", function(t) {
			t.preventDefault();
			var i = e($(this).attr("href"));
			return isEdge ? TweenMax.to(body, scrollToSpeed, {
				scrollTo: {
					y: i,
					offsetY: scrollToOffsetY,
					autoKill: !0
				},
				ease: scrollToEase
			}) : TweenMax.to(html, scrollToSpeed, {
				scrollTo: {
					y: i,
					offsetY: scrollToOffsetY,
					autoKill: !0
				},
				ease: scrollToEase
			}), window.history && window.history.pushState && updateScrollToHash && history.pushState("", document.title, i), !1
		}), i.on("click", function(e) {
			return e.preventDefault(), isMobile ? window.scrollTo(0, 0) : TweenMax.to([html, body], scrollToSpeed, {
				scrollTo: {
					y: 0,
					offsetY: 0,
					autoKill: !0
				},
				ease: scrollToEase
			}), !1
		})
	},
	uiNav = function() {
		"use strict";
		if (useNavPanelAnimation) {
			TweenMax.set(navPanel + ".is-closed", {
				autoAlpha: 0
			}), TweenMax.set(panelOverlay, {
				autoAlpha: 0,
				lazy: !0
			});
			var e = new TimelineMax({
					paused: !0,
					delay: 0,
					repeat: 0,
					repeatDelay: 0,
					yoyo: !1,
					onStart: function() {
						disableContent(), $(navbar).addClass("pointer-disabled"), $(toolbar).addClass("pointer-disabled"), $(navbarToggle).find(navToggle).addClass("active"), TweenMax.set(navPanel + ".is-open", {
							autoAlpha: 1
						}), TweenMax.to(panelOverlay, panelOverlayTransitionSpeed, {
							autoAlpha: 1,
							delay: 0,
							ease: Expo.easeOut
						}), animateContentOnNavPanelOpen && !hasTouch && (TweenMax.to([navbar, toolbar], contentSpeed, {
							autoAlpha: contentOpacity,
							delay: 0,
							ease: contentEase
						}), TweenMax.to(main, contentSpeed, {
							autoAlpha: contentOpacity,
							scale: contentScale,
							delay: 0,
							ease: contentEase,
							transformOrigin: "center center"
						}))
					},
					onComplete: function() {
						t.play().timeScale(1)
					},
					onReverseComplete: function() {
						enableContent(), $(navbar).removeClass("pointer-disabled"), $(toolbar).removeClass("pointer-disabled"), $(navbarToggle).find(navToggle).removeClass("active"), t.reverse(0).timeScale(1).delay(0), TweenMax.to(panelOverlay, panelOverlayTransitionSpeed, {
							autoAlpha: 0,
							delay: parseFloat(navPanelTransitionSpeed.replace(/ms/, "").replace(/s/, "")) + panelOverlayDelay,
							ease: Expo.easeOut,
							onComplete: function() {
								TweenMax.set(navPanel + ".is-closed", {
									autoAlpha: 0
								})
							}
						}), animateContentOnNavPanelOpen && !hasTouch && (TweenMax.to([navbar, toolbar], contentSpeed, {
							autoAlpha: 1,
							delay: 0,
							ease: contentEase
						}), TweenMax.to(main, contentSpeed, {
							autoAlpha: 1,
							scale: 1,
							delay: 0,
							ease: contentEase,
							clearProps: "transform"
						})), navPanelScrollReset && TweenMax.to(navPanel, 0, {
							scrollTo: {
								y: 0,
								offsetY: 0,
								autoKill: !0,
								ease: Linear.easeNone
							}
						})
					}
				}),
				t = new TimelineMax({
					paused: !0,
					delay: 0,
					repeat: 0,
					repeatDelay: 0,
					yoyo: !1
				});
			t.staggerFrom($(navPanel).find(navPanelContents).children().children(), 1, {
				autoAlpha: 0,
				x: -20,
				delay: .5,
				ease: Expo.easeInOut
			}, .12)
		}
		$(navPanel).on("opened.zf.offcanvas", function() {
			animController(), useNavPanelAnimation ? e.play() : disableContent()
		}), $(navPanel).on("closed.zf.offcanvas", function() {
			animController(), TweenMax.delayedCall(e.duration() + 1, animController), useNavPanelAnimation ? e.reverse(0) : enableContent()
		})
	},
	uiCustom = function() {
		"use strict";

		function e(e) {
			var t = $(e).width() / 2,
				i = $(e).find("ul.subnav").width() / 2,
				n = $(e).find("ul.subnav");
			n.css({
				width: $(e).width() + 150 + "px"
			}), $(e).find("a.dropdown").addClass("active"), $("ul.subnav").removeClass("pointer-disabled"), TweenMax.to(n, .5, {
				autoAlpha: 1,
				x: -(i - t) + "px",
				ease: Expo.easeInOut,
				overwrite: "all"
			})
		}
		var t = $("#navbar-items > ul.nav"),
			i = ($(".dropdown"), $("ul.subnav")),
			n = $("ul.features.subnav").children(),
			o = $("ul.industries.subnav").children(),
			r = $("ul.company.subnav").children(),
			a = $("ul.resources.subnav").children(),
			s = $("ul.features.nav"),
			l = $("ul.industries.nav"),
			c = $("ul.company.nav"),
			u = $("ul.resources.nav"),
			h = $("ul.quick-links.nav"),
			d = $("li.move-to-end"),
			p = $("#footer .nav-items div ul.features.nav"),
			f = $("#footer .nav-items div ul.industries.nav"),
			m = $("#footer .nav-items div ul.company.nav"),
			g = $("#footer .nav-items div ul.resources.nav"),
			v = $("#footer .nav-items div ul.quick-links.nav"),
			y = $("a.external");
		n.clone().appendTo(s).children().attr("data-toggle", "" + navPanel.substring(1)), o.clone().appendTo(l).children().attr("data-toggle", "" + navPanel.substring(1)), r.clone().appendTo(c).children().attr("data-toggle", "" + navPanel.substring(1)), a.clone().appendTo(u).children().attr("data-toggle", "" + navPanel.substring(1)), $(navbarItems).clone().appendTo(h).removeClass("hide").children().attr("data-toggle", "" + navPanel.substring(1)), y.removeAttr("data-toggle", "" + navPanel.substring(1)).attr("rel", "noopener noreferrer"), $(footer).find(navItems).children().find("ul > li a").removeAttr("data-toggle", "" + navPanel.substring(1)), $(navItems).children().find(".nav").find(".no-clone").remove(), s.find(d).appendTo(p), l.find(d).appendTo(f), c.find(d).appendTo(m), u.find(d).appendTo(g), h.find(d).appendTo(v), TweenMax.set(i, {
			autoAlpha: 0,
			x: 25
		}), t.menuAim({
			activateCallback: e,
			deactivateCallback: function(e) {
				var t = $(e).find("ul.subnav");
				$(e).find("a.dropdown").removeClass("active"), TweenMax.to(t, .25, {
					autoAlpha: 0,
					x: 25,
					ease: Expo.easeIn
				})
			},
			enterCallback: e,
			exitCallback: $.noop,
			exitMenuCallback: $.noop,
			triggerEvent: "both",
			rowSelector: "> li",
			handle: "> a",
			submenuSelector: ".no-dropdown",
			submenuDirection: "below",
			openClassName: null,
			tolerance: 5,
			activationDelay: 0,
			mouseLocsTracked: 3,
			defaultDelay: 500
		})
	},
	uiRelayout = function() {
		"use strict";
		$(".stripe");
		var e = $(".stripe.stripe-top"),
			t = $(".stripe.stripe-bottom");
		$(".stripe.stripe-center"), TweenMax.delayedCall(2, Foundation.reInit, ["equalizer"]), e.css({
			height: pageContent.innerHeight / 2 + "px",
			top: -pageContent.innerHeight / 3 + "px"
		}), t.css({
			height: pageContent.innerHeight / 2 + "px",
			bottom: -pageContent.innerHeight / 3 + "px"
		}), isPhone && (e.css({
			height: pageContent.innerHeight / 2 + "px",
			top: -pageContent.innerHeight / 3 + "px"
		}), t.css({
			height: pageContent.innerHeight / 2 + "px",
			bottom: -pageContent.innerHeight / 3 + "px"
		})), hasTouch ? $("#nav-panel-contents").addClass("is-touch") : $("#nav-panel-contents").removeClass("is-touch"), isPhone || $(main).find(block + ":first").css({
			"padding-top": $(navbarShrinkHeight).height + "px"
		}), isPhone && $(main).find(block + ":first").css({
			"padding-top": $(navbarShrinkHeight).height + "px"
		}), isPhone && alignCenterHeaderTextPhone && $(main).find(block).find("h1, h2, h3, h4, h5, h6").css({
			"text-align": ""
		}).addClass("text-center"), isPhone && alignLeftHeaderTextPhone && $(main).find(block).find("h1, h2, h3, h4, h5, h6").css({
			"text-align": ""
		}).addClass("text-left"), isPhone && alignCenterParagraphTextPhone && $(main).find(block).find("p").css({
			"text-align": ""
		}).addClass("text-center"), hasTouch || !persistentMenuToggle && Modernizr.mq("(min-width: 0) and (max-width: " + navbarBreakpoint + " )") ? ($(navbarLogo).removeClass("button-width-md"), $(navbarContents).addClass("hide"), $(navbarCallout).addClass("hide"), $(navbarLabel).removeClass("hide"), $(navbarToggle).removeClass("hide")) : persistentMenuToggle ? ($(navbarLogo).removeClass("button-width-md"), $(navbarContents).addClass("hide"), $(navbarLabel).removeClass("hide"), $(navbarToggle).removeClass("hide")) : ($(navbarLogo).addClass("button-width-md"), $(navbarContents).removeClass("hide"), $(navbarCallout).removeClass("hide"), $(navbarLabel).addClass("hide"), $(navbarToggle).addClass("hide")), (showToolbar && toolbarHideOnScrollDown || showToolbar && toolbarShowOnPageEnd) && ($(main).css({
			"margin-bottom": "0",
			"padding-bottom": "0"
		}), $(main).children(block + ":last-child").css({
			"padding-bottom": parseFloat(toolbarShowOnPageEndHeight.replace(/px/, "")) / 16 + 0 + "rem"
		}), toolbarShowOnMobileOnly && hasTouch && isTablet ? $(footer).css({
			"padding-bottom": parseFloat(toolbarShowOnPageEndHeight.replace(/px/, "")) / 16 + 4 + "rem"
		}) : $(footer).css({
			"padding-bottom": "1rem"
		})), !toolbarShowOnMobileOnly && Modernizr.mq("(min-width: 0) and (max-width: " + toolbarBreakpoint + " )") ? $(toolbar).removeClass("hide") : hasTouch && toolbarShowOnMobileOnly && Modernizr.mq("(min-width: 0) and (max-width: " + toolbarMobileBreakpoint + ")") ? $(toolbar).removeClass("hide") : $(toolbar).addClass("hide"), Modernizr.mq("(min-width: 0) and (max-width: 600px)") && ($(toolbarMenubar).find(".cell a div span").css({
			display: "none"
		}), $(toolbarMenubar).find(".cell a div .fa").css({
			display: "block",
			margin: "0 0 0 0"
		})), Modernizr.mq("(min-width: 0) and (max-width: 620px)"), showNavbarLabel || $(navbarLabel).remove(), showNavbarCallout && navbarCallout || $(navbarCallout).remove(), showNavPanelCallout && navPanelCallout || $(navPanelCallout).remove()
	};
$(pageContent).on("resize", _.debounce(uiRelayout, updateResizeInterval)), TweenMax.delayedCall(2, uiRelayout), window.onhashchange = function() {
	"use strict";
	hashNav()
};
var hashNav = function() {
		"use strict";
		window.location.href.indexOf("index") && window.location.hash
	},
	pages = function() {
		"use strict";
		var e = $(".link-home"),
			t = $(".link-sharing"),
			i = $(".link-access"),
			n = $(".link-security"),
			o = $(".link-transfer"),
			r = $(".link-streaming"),
			a = $(".link-integration"),
			s = $(".link-plans"),
			l = $(".link-download"),
			c = $(".link-about"),
			u = $(".link-team"),
			h = $(".link-careers"),
			d = $(".link-contact"),
			p = $(".link-faq"),
			f = $(".link-help-center"),
			m = $(".link-quick-start"),
			g = $(".link-user-guide"),
			v = $(".link-terms"),
			y = $(".link-eula");
		if ("home" === $(".page").data("page")) {
			e.addClass("active");
			var _ = $("#welcome.hero header h1"),
				b = $("#welcome.hero header h2"),
				w = $("#welcome.hero header p");
			TweenMax.set([_, b, w], {
				transformOrigin: "center center"
			});
			var x = new SplitText(_, {
					type: "words, chars, lines",
					charsClass: "font-header"
				}).chars,
				T = new SplitText(b, {
					type: "words, chars, lines",
					charsClass: "font-header"
				}).words,
				k = new SplitText(w, {
					type: "words, chars, lines",
					charsClass: "font-header"
				}).words,
				C = new TimelineMax({
					paused: !0
				});
			C.staggerFrom(x, .75, {
				autoAlpha: 0,
				y: 10,
				ease: Expo.easeInOut
			}, .04, "start-=0").staggerFrom(T, .75, {
				autoAlpha: 0,
				y: 10,
				ease: Expo.easeOut
			}, .04, "-=0.5").staggerFrom(k, .75, {
				autoAlpha: 0,
				y: 10,
				ease: Expo.easeInOut
			}, .12, "-=1").from("#welcome.hero header a.button", .75, {
				autoAlpha: 0,
				ease: Expo.easeOut
			}, "-=1").fromTo("#welcome.hero header form", .75, {
				autoAlpha: 0,
				ease: Expo.easeOut
			}, {
				autoAlpha: 1,
				ease: Expo.easeOut
			}, "-=0.75").fromTo("#welcome.hero .anim-perspective-scroll", 1, {
				autoAlpha: 0,
				ease: Expo.easeOut
			}, {
				autoAlpha: .5,
				ease: Expo.easeOut
			}, "end-=0"), $(hero).hasClass("sticky") ? C.seek("end", !1) : C.play().timeScale(1).delay(1)
		}
		else "sharing" === $(".page").data("page") ? t.addClass("active") : "access" === $(".page").data("page") ? i.addClass("active") : "security" === $(".page").data("page") ? n.addClass("active") : "transfer" === $(".page").data("page") ? o.addClass("active") : "streaming" === $(".page").data("page") ? r.addClass("active") : "integration" === $(".page").data("page") ? a.addClass("active") : "plans" === $(".page").data("page") ? s.addClass("active") : "download" === $(".page").data("page") ? (l.addClass("active"), isPhone && ($(".stripe-cap").removeClass("hide"), $("#mobile-apps").find(".grid-x").css({
			"padding-bottom": "6rem"
		})), hasTouch && !isPhone && ($("#mobile-apps").removeClass("padding-none").css({
			"padding-bottom": "0"
		}), $("#mobile-apps").find(".grid-x").css({
			padding: "1rem 0 0 0"
		}), $(".stripe-cap").removeClass("hide")), isMobile && ($("#mobile-apps").append('<div class="device-preloader position-absolute center-vh padding-xs round-sm width-xxxs p10 text-charcoal background-white bring-to-front"><span class="fa fa-spinner fa-pulse margin-right-xs" aria-hidden="true"></span>Checking device...</div>'), TweenMax.set($("#mobile-apps").find(".grid-x"), {
			opacity: 0
		}), TweenMax.to($("#mobile-apps").find(".grid-x"), .5, {
			opacity: 1,
			ease: Expo.easeOut,
			delay: 2,
			onStart: function() {
				$(".device-preloader").addClass("send-to-back")
			},
			onComplete: function() {
				$(".device-preloader").remove()
			}
		}))) : "about" === $(".page").data("page") ? (c.addClass("active"), $(pageContent).on("scrollstop", function() {
			$("#team").hasClass("emergence-visible") ? (c.removeClass("active"), u.addClass("active")) : (c.addClass("active"), u.removeClass("active"))
		})) : "team" === $(".page").data("page") ? u.addClass("active") : "careers" === $(".page").data("page") ? h.addClass("active") : "contact" === $(".page").data("page") ? (d.addClass("active"), $(navbar).addClass("dark")) : "faq" === $(".page").data("page") ? (p.addClass("active"), $(navbar).addClass("dark")) : "help-center" === $(".page").data("page") ? f.addClass("active") : "quick-start" === $(".page").data("page") ? m.addClass("active") : "user-guide" === $(".page").data("page") ? g.addClass("active") : "terms" === $(".page").data("page") ? (v.addClass("active"), $(navbar).addClass("dark"), $(body).addClass("background-white"), $(body).addClass("background-image-none"), $(navbar).children().before('<div id="scroll-progress" class="background-secondary-gradient"></div>')) : "eula" === $(".page").data("page") ? (y.addClass("active"), $(navbar).addClass("dark"), $(body).addClass("background-white"), $(body).addClass("background-image-none"), $(navbar).children().before('<div id="scroll-progress" class="background-secondary-gradient"></div>')) : $(navbar).addClass("dark")
	},
	utilities = function() {
		"use strict";
		for (var e = document.querySelectorAll("[data-color]"), t = 0; t < e.length; t++) {
			var i = e[t].getAttribute("data-color");
			e[t].style.backgroundColor = i
		}
		for (var n = document.querySelectorAll("[data-page]"), o = 0; o < n.length; o++) n[o].getAttribute("data-page");
		for (var r = document.querySelectorAll("[data-image]"), a = 0; a < r.length; a++) {
			var s = r[a].getAttribute("data-image");
			r[a].style.backgroundImage = "url('" + s + "')"
		}
		$(".anim-page-visibility"), $(".anim-page-visibility-ignore-child"), new Visibility({
			onHidden: function() {
				animPauseAll(), TweenMax.set($(".anim-page-visibility").children(), {
					autoAlpha: 0
				}), TweenMax.set($(".profile-user").not(".active").find(".duotone-reset"), {
					autoAlpha: 0,
					y: 0,
					scale: 1.1
				}), TweenMax.set($(".profile-user").not(".active").find(".duotone-process"), {
					autoAlpha: 0,
					y: 0
				}), TweenMax.set($(".profile-info").children(), {
					autoAlpha: 0,
					y: 50
				})
			},
			onVisible: function() {
				animController(), TweenMax.staggerTo($(".anim-page-visibility").children().not(".anim-page-visibility-ignore-child"), 1, {
					autoAlpha: 1,
					delay: 0,
					ease: Expo.easeInOut
				}, .12), TweenMax.staggerTo($(".profile-user").not(".active").find(".duotone-reset"), 1, {
					autoAlpha: 1,
					y: 0,
					scale: 1,
					delay: 0,
					ease: Expo.easeInOut
				}, .12), TweenMax.staggerTo($(".profile-user").not(".active").find(".duotone-process"), 1, {
					autoAlpha: 1,
					y: 0,
					delay: .25,
					ease: Expo.easeInOut
				}, .12), TweenMax.staggerTo($(".profile-info").children(), .5, {
					autoAlpha: 1,
					y: 0,
					delay: .5,
					ease: Expo.easeInOut
				}, .12)
			}
		}), $(".print").click(function() {
			$(pageContent).print({
				addGlobalStyles: !1,
				mediaPrint: !1,
				stylesheet: null,
				rejectWindow: !0,
				noPrintSelector: ".no-print",
				iframe: !0,
				append: null,
				prepend: "<div class='display-block position-absolute left p1 font-header text-primary'>StoAmigo</div> <div class='display-block position-absolute right p10 font-paragraph text-dark-grey' style='top: 1em;'>Last Updated: 02.22.18</div>"
			})
		}), $(navbar).addClass("no-print"), $(toolbar).addClass("no-print"), $(footer).addClass("no-print"), $(hero).addClass("no-print"), new SmartBanner({
			daysHidden: 15,
			daysReminder: 90,
			appStoreLanguage: "us",
			title: "StoAmigo",
			author: "StoAmigo",
			button: "VIEW",
			store: {
				ios: "On the App Store",
				android: "In Google Play",
				windows: "In Windows store"
			},
			price: {
				ios: "FREE",
				android: "FREE",
				windows: "FREE"
			},
			icon: "apple-touch-icon.png"
		})
	},
	$preloaderParent = $("#preloader-parent"),
	$preloader = $("#preloader-parent ul#preloader li"),
	$navPreviousPage = $("a.previous-page"),
	$navLink = $("a").not('[target="_blank"]').not(".prevent-default").not(".external").not($navPreviousPage).not(".scroll-to"),
	$preventDefault = $(".prevent-default"),
	disableContent = function() {
		"use strict";
		$(html).css("overflow-x", "hidden"), $(html).css("overflow-y", "hidden")
	},
	enableContent = function() {
		"use strict";
		$(html).css("overflow-x", "hidden"), $(html).css("overflow-y", "scroll")
	};
if (usePreloader) var tlPreloader = new TweenMax.to($preloaderParent, 1, {
		opacity: 1,
		delay: 0,
		ease: Expo.easeOut,
		onStart: function() {
			disableContent(), $(body).removeClass("ready"), $preloaderParent.removeClass("hide"), TweenMax.set(body, {
				opacity: 1
			}), TweenMax.to($preloaderParent, .25, {
				display: "block",
				opacity: 1,
				ease: Expo.easeInOut
			}), TweenMax.to($preloader.has(":nth-child(1)"), 1, {
				opacity: 1,
				scale: 1,
				ease: Back.easeInOut
			}), TweenMax.to($preloader.has(":nth-child(2)"), 1, {
				scale: 1,
				transformOrigin: "center center",
				ease: Expo.easeInOut
			}), TweenMax.to($preloader.has(":nth-child(3)"), 1, {
				opacity: 1,
				scale: 1,
				ease: Back.easeInOut
			}), TweenMax.to(container, 1, {
				opacity: 0,
				ease: Expo.easeOut
			})
		},
		onReverseComplete: function() {
			enableContent(), $(body).addClass("ready"), TweenMax.to($preloaderParent, .5, {
				opacity: 0,
				delay: .5,
				ease: Expo.easeInOut,
				onComplete: function() {
					$preloaderParent.css({
						display: "none"
					})
				}
			}), TweenMax.to($preloader.has(":nth-child(1)"), 1, {
				opacity: 0,
				scale: .9,
				ease: Back.easeInOut
			}), TweenMax.to($preloader.has(":nth-child(2)"), 1, {
				scale: 0,
				transformOrigin: "center center",
				ease: Expo.easeInOut
			}), TweenMax.to($preloader.has(":nth-child(3)"), 1, {
				opacity: 0,
				scale: .9,
				ease: Back.easeInOut
			}), TweenMax.set(body, {
				opacity: 1
			}), TweenMax.to(container, .25, {
				opacity: 1,
				ease: Expo.easeOut
			})
		}
	}),
	preloaderStart = function() {
		"use strict";
		tlPreloader.play(0).timeScale(1).delay(0)
	},
	preloaderEnd = function() {
		"use strict";
		tlPreloader.reverse(0).timeScale(1).delay(1)
	};
$navPreviousPage.on("click", function(e) {
	"use strict";
	e.preventDefault();
	var t = function() {
		isFirefox ? window.location.href = "index" : parent.history.back()
	};
	return usePreloader ? (preloaderStart(), TweenMax.delayedCall(tlPreloader.duration() + 2, t)) : t(), !1
}), $navLink.on("click", function(e) {
	"use strict";
	e.preventDefault();
	var t = $(this).attr("href"),
		i = function() {
			window.location = t
		};
	return usePreloader ? (preloaderStart(), TweenMax.delayedCall(tlPreloader.duration() + 2, i)) : i(), !1
});
var checkHash = function() {
	"use strict";
	var e = location.hash;
	window.opener = null, location.hash && TweenMax.delayedCall(updateDelayInterval, function() {
		if (isEdge && $(main).find(e).length) TweenMax.to(body, scrollToSpeed, {
			scrollTo: {
				y: e,
				offsetY: scrollToOffsetY,
				autoKill: !0
			},
			ease: scrollToEase
		});
		else if (isEdge || hasTouch || !$(main).find(e).length) {
			if (hasTouch) return location.hash = e, window.opener = null, !1;
			if (!$(main).find(e).length) return location.hash = "#", window.opener = null, !1
		}
		else TweenMax.to(pageContent, scrollToSpeed, {
			scrollTo: {
				y: e,
				offsetY: scrollToOffsetY,
				autoKill: !0
			},
			ease: scrollToEase
		})
	})
};
$preventDefault.on("click", function(e) {
	"use strict";
	e.preventDefault()
}), onLoad(function() {
	"use strict";
	usePreloader && preloaderStart()
}, function() {
	"use strict";
	usePreloader ? preloaderEnd() : (enableContent(), $(body).addClass("ready"), $preloaderParent.addClass("hide"), TweenMax.set([body, container], {
		opacity: 1,
		delay: 1
	})), components(), utilities(), uiInit(), uiSocialLinks(), uiScrollEvents(), uiSmoothScroll(), uiNav(), uiCustom(), uiRelayout(), pages(), checkHash()
});
