# Seokbin Yoon

A single-page academic homepage built with Jekyll and al-folio, adapted from Mingi Jeong's installation. See THIRD_PARTY.md and LICENSE-al-folio for source provenance and licensing.

## Structure

- `index.html`: biography and all sections, with Jekyll front matter.
- `_layouts/`, `_includes/`: al-folio layouts adapted to one page. Navigation uses section anchors; CV links to the existing PDF.
- `_sass/`, `assets/css/main.scss`: vendored al-folio styles.
- `stylesheet.css`: local single-page and responsive presentation.
- `script/site.js`: publication filters and dated lists.
- `data/publications.bib`: editable publication source; `data/authors.json`: shared author links.
- `data/`: award, talk, service and hidden news JSON, CV and legacy citation files.
- `images/`: existing portrait and publication figures.

## Editing

Edit biography text in `index.html`, publications in `data/publications.bib`, author profiles in `data/authors.json`, and other lists in `data/*.json`. Publication title links prefer DOI. See the editing guide below.

Recent shows the five newest papers across topics; the other filters are Trajectory Modeling, Air Transportation and All. News remains commented out. There are no separate CV, research, blog or publication pages.

## Build and publish

GitHub Pages builds Jekyll from `main` at the repository root. No custom plugins are required. For local preview with Jekyll installed, run `jekyll serve` and visit the printed localhost URL. Keep `.nojekyll` absent so Sass and Liquid are compiled.

## 논문 추가·수정 (BibTeX)

**논문 목록의 원본은 `data/publications.bib` 하나입니다.** GitHub에서 이 파일을
편집하고 커밋하면 다음 배포부터 자동으로 반영됩니다. JSON 변환, npm 설치,
JavaScript 수정, 캐시 버전 변경은 필요하지 않습니다.

```bibtex
@article{unique-paper-key,
  title = {Your Paper Title},
  author = {Yoon, Seokbin and Lee, Keumjin},
  journal = {Journal Name},
  year = {2027},
  doi = {10.1234/example},
  abstract = {A short description shown below the venue on the homepage.},
  image = {images/your-figure.png},
  category = {trajectory},
  award = {Best Paper Award; Another Award}
}
```

- 학회 논문은 `@inproceedings`와 `booktitle = {Conference Name}`을 사용합니다.
- `title`, `author`, 네 자리 `year`는 필수입니다. 각 항목의 키는 중복되지 않아야 합니다.
- `author`는 `and`로 구분합니다. `Seokbin Yoon`과 `Yoon, Seokbin` 모두 가능합니다.
- 제목 링크는 `doi`를 `https://doi.org/…`로 연결합니다. DOI가 없으면 `url`을
  사용할 수 있습니다. 둘 다 없으면 제목을 링크 없이 표시합니다.
- `abstract`는 홈페이지에 보여줄 요약입니다. 현재의 짧은 설명을 그대로 옮겼으며,
  원문 전체 초록으로 바꾸면 그 전체 내용이 표시됩니다.
- `category`는 `trajectory` 또는 `operations`. 각각 Trajectory Modeling,
  Air Transportation 필터에 대응합니다. 생략하면 Recent/All에만 표시됩니다.
- `image`는 업로드한 이미지의 경로입니다. 생략하면 기본 대체 카드가 표시됩니다.
- `award`는 선택사항이며 여러 수상 문구는 세미콜론(`;`)으로 구분합니다.
- `volume`, `pages`는 선택사항입니다. 저널명 뒤에 표시됩니다.
- 최신 연도순으로 정렬하고, 같은 연도는 파일에 적힌 순서를 유지합니다.
  Recent에는 정렬 후 첫 5편이 표시됩니다.
- UTF-8 문자를 그대로 사용하세요. 보호용 중괄호와 `\&`, `\%`, `\_` 등의
  일반적인 이스케이프를 처리합니다. 임의의 LaTeX 명령·수학 수식 렌더링,
  `@string` 매크로 확장, `crossref` 상속은 지원하지 않으므로 값을 직접 적어주세요.
- 기존 `data/bib/*.bib`는 예전 개별 인용 파일이며 홈페이지 목록의 원본이 아닙니다.

### 공저자 링크

`data/authors.json`에 **화면에 표시되는 이름**으로 한 번만 등록하면 됩니다.
모든 논문에 자동 적용됩니다. 등록하지 않은 저자는 이름만 표시됩니다.

```json
{
  "Seokbin Yoon": { "me": true },
  "Keumjin Lee": { "url": "https://scholar.google.com/citations?user=GO7fwgEAAAAJ" }
}
```

이름 철자와 띄어쓰기는 BibTeX 저자명과 맞춰주세요. `me: true`는 본인 이름을
굵게 표시합니다. 저자 링크는 `http`/`https` 주소만 허용합니다.

개발 검증: `node --test tests/publications.test.cjs`.
