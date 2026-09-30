const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const context = vm.createContext({ URL });
for (const path of ['script/vendor/bibtexParse.js', 'script/publications.js']) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), context);
}
const parse = (bib, profiles) => JSON.parse(JSON.stringify(context.PublicationData.parse(bib, profiles)));
const entry = (extra = '') => `@article{sample, title={{ATC}: A Study}, author={Yoon, Seokbin and Keumjin Lee}, year={2026}, ${extra}}`;
test('nested title braces, comma-style names, links, abstract and awards', () => {
  const [p] = parse(entry('journal={Research \\& Development}, doi={https://doi.org/10.1234/test}, url={https://example.org/ignored}, abstract={A {nested} summary, with \\& and Unicode α.}, award={First award; Second award}'),
    { 'Seokbin Yoon': { me: true }, 'Keumjin Lee': { url: 'https://example.org/lee' } });
  assert.equal(p.title, 'ATC: A Study');
  assert.equal(p.authors[0].name, 'Seokbin Yoon');
  assert.equal(p.authors[0].me, true);
  assert.equal(p.authors[1].url, 'https://example.org/lee');
  assert.equal(p.venue, 'Research & Development');
  assert.equal(p.links[0].url, 'https://doi.org/10.1234/test');
  assert.equal(p.summary, 'A nested summary, with & and Unicode α.');
  assert.deepEqual(p.notes, ['First award', 'Second award']);
});
test('quoted fields, organization author and URL fallback', () => {
  const [p] = parse('@misc{x, title="A title", author={{Research and Development Group} and Doe, Jane}, year=2025, url={https://example.org/paper}}');
  assert.deepEqual(p.authors.map(a => a.name), ['Research and Development Group', 'Jane Doe']);
  assert.equal(p.links[0].url, 'https://example.org/paper');
});
test('missing metadata, duplicates and unsafe URLs', () => {
  assert.throws(() => parse('@article{x, title={Missing fields}}'));
  assert.throws(() => parse(entry() + entry()));
  assert.throws(() => parse(entry('doi={invalid}')));
  assert.deepEqual(parse(entry('url={javascript:alert(1)}'))[0].links, []);
});
test('real bibliography: ten papers, existing filters, images and DOI links', () => {
  const papers = parse(fs.readFileSync('data/publications.bib', 'utf8'), JSON.parse(fs.readFileSync('data/authors.json', 'utf8')));
  assert.equal(papers.length, 10);
  assert.equal(papers.filter(p => p.category === 'trajectory').length, 5);
  assert.equal(papers.filter(p => p.category === 'operations').length, 5);
  assert.deepEqual([...papers].sort((a,b) => b.year-a.year).slice(0,5).map(p => p.id),
    ['airport-queue','maiformer','landing-time','latent-augmentation','radar-vision']);
  for (const p of papers) {
    assert.ok(fs.existsSync(p.image), p.image);
    assert.ok(p.summary.length > 0);
    assert.ok(p.links[0].url.startsWith('https://doi.org/'));
    assert.equal(p.authors.filter(a => a.me).length, 1);
  }
});
