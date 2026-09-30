/* BibTeX -> the existing publication card data. No generated JSON to maintain. */
(function (root) {
  function text(value = "") {
    return String(value)
      .replace(/\\(?:textit|textbf|emph|textrm|textnormal)\s*\{([^{}]*)\}/g, "$1")
      .replace(/\\([&%_#$])/g, "$1")
      .replace(/\\(?:LaTeX|TeX)\b/g, (s) => s.slice(1))
      .replace(/[{}]/g, "")
      .replace(/\s+/g, " ").trim();
  }

  // Split only outside braces, so a braced organization name remains one author.
  function splitAuthors(value) {
    const result = [];
    let depth = 0, start = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === "\\") { i++; continue; }
      if (value[i] === "{") depth++;
      if (value[i] === "}") depth--;
      const separator = depth === 0 && value.slice(i).match(/^\s+and\s+/i);
      if (separator) {
        result.push(value.slice(start, i));
        i += separator[0].length - 1;
        start = i + 1;
      }
    }
    result.push(value.slice(start));
    return result.filter((name) => name.trim()).map((name) => {
      const trimmed = name.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) return text(trimmed);
      const parts = trimmed.split(",").map(text);
      return parts.length === 1 ? parts[0]
        : parts.length === 2 ? `${parts[1]} ${parts[0]}`
        : `${parts[2]} ${parts[0]}, ${parts[1]}`;
    });
  }

  function httpURL(value) {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }

  function parse(source, authorProfiles = {}) {
    const keys = new Set();
    return root.bibtexParse.toJSON(source).filter((entry) => entry.entryTags).map((entry) => {
      const f = Object.fromEntries(Object.entries(entry.entryTags).map(([k, v]) => [k.toLowerCase(), v]));
      const id = entry.citationKey;
      if (!id || keys.has(id)) throw new Error(`Missing or duplicate BibTeX key: ${id}`);
      keys.add(id);
      if (!f.title || !f.author || !/^\d{4}$/.test(text(f.year))) {
        throw new Error(`${id}: title, author and a four-digit year are required`);
      }
      const doi = text(f.doi).replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, "");
      if (doi && !/^10\.\d{4,9}\/\S+$/i.test(doi)) throw new Error(`${id}: invalid DOI`);
      const href = doi ? `https://doi.org/${doi}` : httpURL(text(f.url));
      const venue = [text(f.journal || f.booktitle), text(f.volume), text(f.pages).replace(/--/g, "–")]
        .filter(Boolean).join(", ");
      return {
        id, title: text(f.title), year: Number(text(f.year)), venue,
        authors: splitAuthors(f.author).map((name) => {
          const profile = Object.hasOwn(authorProfiles, name) ? authorProfiles[name] : {};
          return { name, ...(profile.me ? { me: true } : {}),
            ...(httpURL(profile.url) ? { url: httpURL(profile.url) } : {}) };
        }),
        image: text(f.image), category: text(f.category), summary: text(f.abstract),
        notes: f.award ? text(f.award).split(/\s*;\s*/).filter(Boolean) : [],
        links: href ? [{ label: doi ? "doi" : "paper", url: href }] : [],
      };
    });
  }

  async function load(path) {
    const [bib, authors] = await Promise.all([
      fetch(path, { cache: "no-cache" }), fetch("data/authors.json", { cache: "no-cache" }),
    ]);
    if (!bib.ok || !authors.ok) throw new Error("Could not load publication data");
    return parse(await bib.text(), await authors.json());
  }
  root.PublicationData = { parse, load };
})(globalThis);
