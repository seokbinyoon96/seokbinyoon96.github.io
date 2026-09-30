# Theme provenance

This site uses al-folio, copyright (c) 2022 Maruan Al-Shedivat, under the MIT license (see LICENSE-al-folio).

The Sass sources in `_sass/` and `assets/css/main.scss` are vendored from MingiJeong/MingiJeong.github.io at commit 234a4f84232c8749b7d3950e0acce1a6c55459db. The default/about layouts and includes are adapted from that al-folio installation for a single-page site. No personal content or images from the reference site are included.

The existing publication data and renderer are retained. Local presentation overrides live in `stylesheet.css`. Bootstrap 4.6.1 (MIT) and Roboto (Apache 2.0) are loaded from their public CDNs.

## BibTeX parser

`script/vendor/bibtexParse.js` is vendored from the npm package
`@orcid/bibtex-parse-js@0.0.25` (its source header says 0.0.24).
Source: https://github.com/ORCID/bibtexParseJs
License: MIT; see `script/vendor/LICENSE-bibtexParse`.
No external CDN is needed at runtime.
