# Website maintenance

## Structure

The site uses Jekyll and al-folio, adapted from Mingi Jeong's installation.
See [THIRD_PARTY.md](../THIRD_PARTY.md) and [LICENSE-al-folio](../LICENSE-al-folio)
for provenance and licensing.

- `index.html`: biography and section content with Jekyll front matter.
- `_layouts/`, `_includes/`: single-page layouts and shared markup.
- `_sass/`, `assets/css/main.scss`: al-folio styles.
- `stylesheet.css`: local styling and responsive layout.
- `script/site.js`: publication filters and other section rendering.
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
- `abstract` supplies the visible description. Keep it brief for the current
  layout; a full abstract will be displayed in full.
- `category` accepts `trajectory` (Trajectory Modeling) or `operations`
  (Air Transportation). Without it, the paper appears only under Recent and All.
- `image` is a repository-relative image path. When omitted, a placeholder is shown.
- `award` is optional. Separate multiple awards with semicolons.
- Optional `volume` and `pages` are displayed after the venue.
- Papers are sorted by descending year, retaining file order within a year.
  Recent shows the first five papers.
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
across all papers. Unregistered authors appear as plain text. `me: true` displays
the name in bold. Only HTTP and HTTPS author links are accepted.

## Other content

Edit biography text in `index.html` and other lists in `data/*.json`.
News is currently commented out. Navigation links to sections of the same page.

## Build and deployment

GitHub Pages builds Jekyll from the root of `main`. No custom plugins are required.
With Jekyll installed, run `jekyll serve` for a local preview. Keep `.nojekyll`
absent so Sass and Liquid are compiled.

Run publication checks with:

```sh
node --test tests/publications.test.cjs
```

The `docs/` directory is excluded from the published website.

## Blog

See [blog.md](blog.md) for posting instructions. Published Markdown posts live in
`_posts/`, unpublished examples in `_drafts/`, and post images in `images/blog/`.
