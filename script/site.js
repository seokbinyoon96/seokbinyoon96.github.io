/*
 * Renders each section of the homepage from the JSON files in data/.
 * To change the content of the site, edit those files - not this script.
 */

const ACCENT = "#d55e00";

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

/* ----------------------------- news ----------------------------- */

function renderNews(items, mount) {
  const recent = items.filter((n) => n.recent);
  const older = items.filter((n) => !n.recent);

  const li = (n) => `<li><strong>${escapeHtml(n.date)}</strong> ${n.html}</li>`;

  mount.appendChild(el(`
    <ul style="font-family:sans-serif">
      ${recent.map(li).join("")}
      ${older.length ? `
        <a href="javascript:void(0)" id="news-toggle">---- show more ----</a>
        <div id="news-older" style="display:none">${older.map(li).join("")}</div>
      ` : ""}
    </ul>
  `));

  const toggle = mount.querySelector("#news-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const box = mount.querySelector("#news-older");
    const open = box.style.display !== "none";
    box.style.display = open ? "none" : "block";
    toggle.textContent = open ? "---- show more ----" : "---- show less ----";
  });
}

/* ------------------------- publications ------------------------- */

function authorLine(authors) {
  return authors
    .map((a) => {
      const name = escapeHtml(a.name);
      if (a.me) return `<strong>${name}</strong>`;
      if (a.url) return `<a href="${escapeHtml(a.url)}">${name}</a>`;
      return name;
    })
    .join(", ");
}

function renderPublications(pubs, mount) {
  const sorted = [...pubs].sort((a, b) => b.year - a.year);
  const filters = [
    ["recent", "Recent"],
    ["trajectory", "Trajectory Modeling"],
    ["operations", "Air Transportation"],
    ["all", "All"],
  ];
  const controls = el(`<div class="publication-filters" role="group" aria-label="Filter publications">
    ${filters.map(([id, label]) => `<button type="button" data-filter="${id}"
      aria-controls="publication-list" aria-pressed="false">${escapeHtml(label)}</button>`).join("")}
  </div>`);
  const list = el('<div id="publication-list"></div>');
  mount.replaceChildren(controls, list);

  function selectFilter(filter) {
    controls.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
    const visible = filter === "recent" ? sorted.slice(0, 5)
      : sorted.filter((p) => filter === "all" || p.category === filter);
    list.replaceChildren(...visible.map((p) => {
      const notes = (p.notes || []).map((n) =>
        `<span class="publication-note">${escapeHtml(n)}</span>`).join(" · ");
      const href = p.links?.[0]?.url || p.bibtex || "#";
      const visual = p.image
        ? `<img src="${escapeHtml(p.image)}" alt="Figure from ${escapeHtml(p.title)}" loading="lazy">`
        : `<div class="publication-placeholder" aria-hidden="true"><span>${p.year}</span>${p.category === "trajectory" ? "Trajectory modeling" : "Air transportation"}</div>`;
      return el(`<article class="publication">
        <div class="publication-visual">${visual}</div>
        <div class="publication-content">
          <h3><a href="${escapeHtml(href)}">${escapeHtml(p.title)}</a></h3>
          <div>${authorLine(p.authors)}</div>
          <div class="publication-venue"><em>${escapeHtml(p.venue)}</em>, ${escapeHtml(p.year)}</div>
          ${notes ? `<div>${notes}</div>` : ""}
          ${p.summary ? `<p>${escapeHtml(p.summary)}</p>` : ""}
        </div>
      </article>`);
    }));
  }
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (button) selectFilter(button.dataset.filter);
  });
  selectFilter("recent");
}

/* ---------------------------- awards ---------------------------- */

function renderAwards(groups, mount) {
  const rows = groups.map((g) => {
    const img = `<img src="${escapeHtml(g.logo)}" alt="${escapeHtml(g.alt)}"
                      style="max-width:100%;max-height:${g.height || 66}px;object-fit:contain">`;
    const logo = g.url ? `<a href="${escapeHtml(g.url)}">${img}</a>` : img;
    const body = g.items
      .map((i) => {
        const subtitle = i.subtitle ? `<br><em>${escapeHtml(i.subtitle)}</em>` : "";
        return `<strong>${escapeHtml(i.name)}</strong>${subtitle}<br>${escapeHtml(i.venue)}`;
      })
      .join("<br><br>");

    return `
      <tr>
        <td style="padding:20px 16px;width:34%;vertical-align:middle;text-align:center">${logo}</td>
        <td style="padding:20px 10px;width:66%;vertical-align:middle">${body}</td>
      </tr>`;
  });

  mount.appendChild(el(`
    <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0">
      <tbody>${rows.join("")}</tbody>
    </table>
  `));
}

/* ----------------------- talks and misc ------------------------- */

function renderEntries(entries, mount) {
  const rows = entries.map((e) => {
    const lines = e.lines
      .map((l) => {
        const text = l.bold
          ? `<strong>${escapeHtml(l.text)}</strong>`
          : escapeHtml(l.text);
    
        return l.url
          ? `<a href="${escapeHtml(l.url)}">${text}</a>`
          : `<span class="entryline">${text}</span>`;
      })
      .join("<br>");

    return `
      <tr>
        <td style="padding:20px 16px;width:34%;vertical-align:middle;text-align:center">
          <img src="${escapeHtml(e.logo)}" alt="${escapeHtml(e.alt)}"
               style="max-width:100%;max-height:${e.height || 80}px;object-fit:contain">
        </td>
        <td style="padding:20px 10px;width:66%;vertical-align:middle;font-family:sans-serif">
          ${lines}
        </td>
      </tr>`;
  });

  mount.appendChild(el(`
    <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0">
      <tbody>${rows.join("")}</tbody>
    </table>
  `));
}

/* ---------------------------- wiring ---------------------------- */

const SECTIONS = [
  ["news", "data/news.json", renderNews],
  ["publications", "data/publications.json", renderPublications],
  ["awards", "data/awards.json", renderAwards],
  ["talks", "data/talks.json", renderEntries],
  ["misc", "data/misc.json", renderEntries],
];

document.addEventListener("DOMContentLoaded", () => {
  for (const [id, path, render] of SECTIONS) {
    const mount = document.getElementById(id);
    if (!mount) continue;
    loadJSON(path)
      .then((data) => render(data, mount))
      .catch((err) => {
        console.error(err);
        mount.appendChild(
          el(`<p style="font-family:sans-serif;color:${ACCENT}">
                Could not load ${escapeHtml(path)}. If you are previewing locally,
                serve the folder over HTTP (python3 -m http.server) rather than
                opening index.html directly.
              </p>`)
        );
      });
  }
});
