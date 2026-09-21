# seokbinyoon96.github.io

Personal academic homepage, served at <https://seokbinyoon96.github.io>.

Static site — no build step. The whole page is `index.html` plus `stylesheet.css`.

```
index.html        the entire page
stylesheet.css    fonts and styles
images/           profile photo and paper thumbnails
data/             CV PDF
```

To edit, open `index.html` and change the text directly. To preview locally:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Template adapted from [Jon Barron](https://github.com/jonbarron/jonbarron_website).
