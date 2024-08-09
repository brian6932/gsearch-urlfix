# Google Search URL Fixup Fork

## AMO & CWS
[Firefox](https://addons.mozilla.org/firefox/addon/google-search-url-fixup-fork/)

Chromium(Todo, you can sideload with developer mode enabled for now, `web-ext build`)

## Explanation

Google Search has two forms of search pages, one that's normally served to people with JavaScript, and one that's served to people who have it off, also known as Google Basic Variant (GBV) mode, to enable GBV mode, and not disable JS browser-wide (`javascript.enabled` `false`), you can make domains rules with [uBlock Origin](https://github.com/gorhill/uBlock) or [uMatrix](https://github.com/gorhill/uMatrix).

To be able to swap between the default and GBV mode, you can paste the line below into `My filters` in the uBlock Origin settings. For uMatrix, more details about this in this blog article [Reverse engineering some settings for Google Search](https://utcc.utoronto.ca/~cks/space/blog/web/GoogleSearchSettings).
```
/^https?:\/{2}w{3}\.google\.(?:a[delmstz]|b[aefgijsty]|c(?:o(?:m(?:\.(?:a[fgru]|b[dhnorz]|c[ouy]|do|e[cgt]|fj|g[hit]|hk|jm|k[hw]|l[by]|m[mtxy]|n[agip]|om|p[aeghkry]|qa|s[abglv]|t[jrw]|u[ay]|v[cn]))?|\.(?:ao|bw|c[kr]|i[dln]|jp|k[er]|ls|m[az]|nz|t[hz]|u[gkz]|v[ei]|z[amw]))|[adfghilmnvz])|d[ejkmz]|e[es]|f[imr]|g[aeglmry]|h[nrtu]|i[emqst]|j[eo]|k[giz]|l[aiktuv]|m[degklnuvw]|n[eloru]|p[lnst]|r[osuw]|s[cehikmnort]|t[dglmnot]|vu|ws)\/search\?(?:[^/]+&)?gbv=1(?:$|[&/])/$csp=script-src 'none'
```
This way you can see both https://www.google.com/search?gbv=1&q=foo and https://www.google.com/search?gbv=2&q=foo side by side.

Since Google wants to track outbound domain traffic, and the Basic Variant mode lacks the JavaScript necessary to do more dynamic tracking, Google instead literally URL encodes your destination domain, and sets it as a query parameter on their own domain, which then redirects you to your destination. This Web-Extension aims to solve this, and at the same time strips tracking query parameters on search results on both GBV (gbv=1), and default (gbv=2) Google modes.

## Fork benefits

1. Reroutes Google's `/imgres` links for inline images.
1. Strips off query parameter tracking for Google domains throughout the UI.
1. Listens to body changes to work with inline pagination (e.g. the [Super-preloader](https://github.com/machsix/Super-preloader) UserScript, and the [AutoPagerize](https://github.com/tophf/autopagerize) Web-Extension). You can add the following rule to either (I made this for Super-preloader, but should work with AutoPagerize as long as you set the corresponding properties)
    ```json
    {
    	"name": "Google Basic Variant",
    	"url": "^https?://w{3}\\.google\\.(?:a[delmstz]|b[aefgijsty]|c(?:o(?:m(?:\\.(?:a[fgru]|b[dhnorz]|c[ouy]|do|e[cgt]|fj|g[hit]|hk|jm|k[hw]|l[by]|m[mtxy]|n[agip]|om|p[aeghkry]|qa|s[abglv]|t[jrw]|u[ay]|v[cn]))?|\\.(?:ao|bw|c[kr]|i[dln]|jp|k[er]|ls|m[az]|nz|t[hz]|u[gkz]|v[ei]|z[amw]))|[adfghilmnvz])|d[ejkmz]|e[es]|f[imr]|g[aeglmry]|h[nrtu]|i[emqst]|j[eo]|k[giz]|l[aiktuv]|m[degklnuvw]|n[eloru]|p[lnst]|r[osuw]|s[cehikmnort]|t[dglmnot]|vu|ws)/search\\?(?:[^/]+&)?gbv=1(?:$|[&/])",
    	"pageElement": "//div[@id=\"main\"]",
    	"exampleUrl": "https://www.google.com/search?q=foo&gbv=1",
    	"nextLink": "//a[@aria-label=\"Next page\"]"
    }
    ```

## Known limitations

* It currently only works on www.google.com, www.google.ca, www.google.co.uk, www.google.se, and www.google.de because those are the only Google search domains that I use, or that people have requested.
* There's no icon. I've looked through the [Google Material Design iconset](http://google.github.io/material-design-icons/), which is where Mozilla took their icon for [Your first extension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension), but nothing jumped out at me as particularly compellingly right. I'm open to any PRs to make one.
