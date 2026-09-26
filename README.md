# Seokbin Yoon

A single-page academic homepage built with Jekyll and al-folio, adapted from Mingi Jeong's installation. See THIRD_PARTY.md and LICENSE-al-folio for source provenance and licensing.

## Structure

- `index.html`: biography and all sections, with Jekyll front matter.
- `_layouts/`, `_includes/`: al-folio layouts adapted to one page. Navigation uses section anchors; CV links to the existing PDF.
- `_sass/`, `assets/css/main.scss`: vendored al-folio styles.
- `stylesheet.css`: local single-page and responsive presentation.
- `script/site.js`: publication filters and dated lists.
- `data/`: existing publication, award, talk, service and hidden news JSON, CV and BibTeX.
- `images/`: existing portrait and publication figures.

## Editing

Edit biography text in `index.html` and lists in `data/*.json`. Publication titles link to the first URL in each paper's `links` array. `me: true` bolds an author; `notes` adds award text.

Recent shows the five newest papers across topics; the other filters are Trajectory Modeling, Air Transportation and All. News remains commented out. There are no separate CV, research, blog or publication pages.

## Build and publish

GitHub Pages builds Jekyll from `main` at the repository root. No custom plugins are required. For local preview with Jekyll installed, run `jekyll serve` and visit the printed localhost URL. Keep `.nojekyll` absent so Sass and Liquid are compiled.
