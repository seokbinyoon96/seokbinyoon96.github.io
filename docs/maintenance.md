# Website maintenance

## Structure

The homepage is static HTML with a responsive profile sidebar and publication list.
GitHub Pages still runs Jekyll for the retained blog layouts and Sass assets.
See [THIRD_PARTY.md](../THIRD_PARTY.md) and [LICENSE-al-folio](../LICENSE-al-folio)
for provenance and licensing.

- `index.html`: standalone homepage, biography, education, and navigation.
- `assets/css/portfolio.css`: homepage styling, responsive layout, and theme colors.
- `_layouts/`, `_includes/`: single-page layouts and shared markup.
- `_sass/`, `assets/css/main.scss`: al-folio styles.
- `stylesheet.css`: local styling and responsive layout.
- `script/site.js`: navigation, Recent/All publication filters, and other section rendering.
- `data/publications.bib`: publication source.
- `data/authors.json`: shared author profiles and links.
- Other `data/*.json` files: awards, talks, service, and hidden news.
- `images/`: portrait and publication figures.
- `data/seokbinyoon_CV.pdf`: downloadable CV.

## Updating publications

Edit `data/publications.bib` and commit to `main`. The next deployment reads it
without a JSON conversion, dependency installation, or JavaScript change.
No manual cache-version update is needed for bibliography or author-profile edits.

```bibtex
@article{unique-paper-key,
  title = {Your Paper Title},
  author = {Yoon, Seokbin and Lee, Keumjin},
  journal = {Journal Name},
  year = {2027},
  doi = {10.1234/example},
  abstract = {A short description displayed below the venue.},
  image = {images/your-figure.png},
  category = {trajectory},
  award = {Best Paper Award; Another Award}
}
```

Replace the example DOI with the actual DOI, or omit it if none exists.

- Use `@inproceedings` and `booktitle` for conference papers.
- `title`, `author`, and a four-digit `year` are required. Citation keys must be unique.
- Separate authors with `and`. Both `Seokbin Yoon` and `Yoon, Seokbin` are supported.
- Title links use `https://doi.org/` followed by `doi`. If no DOI is provided,
  `url` is used. Without either field, the title is displayed without a link.
- `abstract` retains the paper summary in the data. The compact homepage cards
  show titles, full author lists, venue, awards, and links.
- `category` retains research-topic metadata. The homepage offers Recent and All filters only.
- `image` is a repository-relative image path. When omitted, a placeholder is shown.
- `award` is optional. Separate multiple awards with semicolons.
- `venue_short` controls the image badge (e.g. T-ITS, DASC, ATRS, ATRDS). The full journal or conference name in the standard BibTeX field appears beneath the author list.
- Optional `arxiv` takes a full arXiv URL and adds an arXiv button after Paper. Keep the published DOI in `doi` (or publisher link in `url`) and put the preprint link in `arxiv`.
- Optional `project` and `code` HTTP(S) URLs add publication buttons.
- Authors are displayed in full, in BibTeX order, without truncation.
- Optional `volume` and `pages` remain available in the parsed metadata.
- Papers are sorted by descending year, retaining file order within a year.
  Recent is the default filter and shows the first five papers; All shows every paper.
- Use UTF-8 text. Protective braces and common escapes such as `\&`, `\%`, and
  `\_` are supported. Arbitrary LaTeX commands, math rendering, `@string`
  expansion, and `crossref` inheritance are not supported; use literal values.
- `data/bib/*.bib` contains legacy individual citation files. These files do not
  control the homepage publication list.

## Author links

Register each author once in `data/authors.json`, keyed by their displayed name:

```json
{
  "Seokbin Yoon": { "me": true },
  "Keumjin Lee": {
    "url": "https://scholar.google.com/citations?user=GO7fwgEAAAAJ"
  }
}
```

Names and spacing must match the formatted BibTeX author names. Profiles apply
across all papers. Unregistered authors link to Google Scholar author search until a verified profile is added. `me: true` displays
the name in bold. Only HTTP and HTTPS author links are accepted.

## Other content

Edit biography text in `index.html` and other lists in `data/*.json`.
News is not rendered or loaded. Navigation links to sections of the same page.
Education logo assets live in `images/logos/` and `images/`. The profile sidebar has no organization logos.

## Build and deployment

GitHub Pages builds Jekyll from the root of `main`. No custom plugins are required.
Run `python3 -m http.server` for a homepage preview.
With Jekyll installed, run `jekyll serve` to also preview blog layouts. Keep `.nojekyll`
absent so Sass and Liquid are compiled.

Run publication checks with:

```sh
node --test tests/publications.test.cjs
```

The `docs/` directory is excluded from the published website.

## Blog

See [blog.md](blog.md) for posting instructions. Published Markdown posts live in
`_posts/`, unpublished examples in `_drafts/`, and post images in `images/blog/`.
