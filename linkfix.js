/*
 * Fix JS-free Google Search link mangling.
 */

let i = -1
const
	pathToParam = {
		__proto__: null,
		url: "q",
		imgres: "imgurl"
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

			const pathname = links[i].pathname.slice(1)
			switch (pathname) {
				case "url":
				case "imgres":
					// Extract the search without the leading '?'.
					const param = new URLSearchParams(links[i].search.slice(1)).get(pathToParam[pathname])
					// note to self: must change href attribute, not the entire
					// thing. Doh. Read the docs, sort of.
					if (param === null)
						continue

					if (!(links[i].href = decodeURIComponent(param)).startsWith("https://www.google.com/"))
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
		if (mutation.type === "childList" && mutation.addedNodes[1].id === "main")
			fixLinks()
}).observe(document.body, { __proto__: null, childList: true, subtree: true })
