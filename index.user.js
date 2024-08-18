// ==UserScript==
// @name        Google Search URL Fixup Fork
// @namespace   https://greasyfork.org/users/581142
// @namespace   https://github.com/brian6932/gsearch-urlfix
// @license		MPL-2.0
// @include     /^https?:\/{2}w{3}\.google\.(?:a[delmstz]|b[aefgijsty]|c(?:o(?:m(?:\.(?:a[fgru]|b[dhnorz]|c[ouy]|do|e[cgt]|fj|g[hit]|hk|jm|k[hw]|l[by]|m[mtxy]|n[agip]|om|p[aeghkry]|qa|s[abglv]|t[jrw]|u[ay]|v[cn]))?|\.(?:ao|bw|c[kr]|i[dln]|jp|k[er]|ls|m[az]|nz|t[hz]|u[gkz]|v[ei]|z[amw]))|[adfghilmnvz])|d[ejkmz]|e[es]|f[imr]|g[aeglmry]|h[nrtu]|i[emqst]|j[eo]|k[giz]|l[aiktuv]|m[degklnuvw]|n[eloru]|p[lnst]|r[osuw]|s[cehikmnort]|t[dglmnot]|vu|ws)\/search\?/
// @grant       none
// @version     0.88
// @author      brian6932
// @description Sets the links in the JavaScript-free Google Basic Variant (gbv=1) search results to their original domains, which circumvents click routing through Google's query parameters, fixes browser history mismatch, and strips tracking query parameters.
// @downloadURL https://raw.githubusercontent.com/brian6932/gsearch-urlfix/master/index.user.js
// @updateURL   https://raw.githubusercontent.com/brian6932/gsearch-urlfix/master/index.user.js
// ==/UserScript==
// jshint esversion: 11

let i = -1
const
	pathToParam = {
		__proto__: null,
		"/url": "q",
		"/imgres": "imgurl"
	},
	strippableParams = [
		"ei",
		"fbs",
		"sa",
		"sca_esv",
		"sca_upv",
		"source",
		"sxsrf",
		"ved",
	],
	links = document.links,
	fixLinks = () => {
		while (++i < links.length) {
			if (links[i].search === "" && links[i].host !== "www.google.com")
				continue

			const mappedParam = pathToParam[links[i].pathname]
			if (mappedParam !== undefined) {
				const encodedLink = new URLSearchParams(links[i].search).get(mappedParam)
				// note to self: must change href attribute, not the entire
				// thing. Doh. Read the docs, sort of.
				if (encodedLink === null)
					continue

				if (!(links[i].href = decodeURIComponent(encodedLink)).startsWith("https://www.google.com/"))
					continue
			}

			/*
			 * Should hit the following paths
				  /
				  /maps
				  /preferences
				  /search
				  /setprefs
				  /travel
				  /webhp
			 */
			const link = new URL(links[i].href)

			for (const param of strippableParams)
				link.searchParams.delete(param)

			links[i].href = link.toString()
		}
	}

// Invoke on load.
fixLinks()

// Reinvoke on body change.
new MutationObserver(mutations => {
	for (const mutation of mutations)
		if (mutation.type === "childList")
			return fixLinks()
}).observe(document.body, { __proto__: null, childList: true, subtree: true })
