# seokbinyoon96.github.io

Personal academic homepage, served at <https://seokbinyoon96.github.io>.

Static site — no build step, no dependencies.

## Layout

```
index.html              page shell: profile, section headings, footer
stylesheet.css          fonts and styles
script/site.js          renders the sections below from data/
data/
  news.json             news list ("recent": true shows above the fold)
  publications.json     papers shown on the page
  awards.json           honors and awards
  talks.json            talks
  misc.json             reviewing, licenses, and the like
  bib/*.bib             one BibTeX entry per paper
  seokbinyoon_CV.pdf
images/                 profile photo, paper thumbnails, logos
```

## Editing

Almost everything lives in `data/`. To add a paper, append an entry to
`data/publications.json` and drop its BibTeX in `data/bib/`:

```json
{
  "id": "short-name",
  "title": "Paper Title",
  "authors": [
    { "name": "Seokbin Yoon", "me": true },
    { "name": "Coauthor", "url": "https://..." }
  ],
  "venue": "Conference or Journal",
  "year": 2026,
  "image": "images/thumbnail.png",
  "notes": ["Best Paper Award"],
  "links": [{ "label": "paper", "url": "https://..." }],
  "bibtex": "data/bib/key.bib",
  "summary": "One or two sentences."
}
```

`me: true` bolds the name, `notes` render in orange, and a `bibtex` link is
appended to the link row automatically. Only the bio, the research blurb and
the section headings live in `index.html`.

## Previewing

The page reads `data/` with `fetch`, so it needs to be served over HTTP —
opening `index.html` from disk will leave the sections empty.

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Template adapted from [Jon Barron](https://github.com/jonbarron/jonbarron_website).

## Publication filters

The default **Recent** view shows the latest publication year and the preceding
year. **All** shows every paper, sorted newest first. Each publication has a
`category`: `trajectory` (Trajectory Modeling) or `operations`
(Air Transportation). Images and summaries are optional.

News is preserved in `data/news.json`; its section in `index.html` is commented
out. Remove the surrounding HTML comment to show it again.
