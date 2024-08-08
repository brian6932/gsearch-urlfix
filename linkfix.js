/*
 * Fix JS-free Google Search link mangling.
 */

let i = -1
const
	links = document.links,
	fixLinks = () => {
		while (++i < links.length) {
			if (links[i].pathname !== "/url" || links[i].search === "")
				continue
			// Extract the search without the leading '?'.
			const q = new URLSearchParams(links[i].search.slice(1)).get("q")
			// note to self: must change href attribute, not the entire
			// thing. Doh. Read the docs, sort of.
			if (q !== null)
				links[i].href = decodeURIComponent(q)
		}
	}

// Invoke on load.
fixLinks()

// Reinvoke on body change.
new MutationObserver(mutations => {
	for (const mutation of mutations)
		if (mutation.type === "childList" && mutation.addedNodes[1].id === "main")
			fixLinks()
}).observe(document.body, { __proto__: null, childList: true, subtree: true })
