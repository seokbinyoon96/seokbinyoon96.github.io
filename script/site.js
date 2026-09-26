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
      return el(`<article class="publication" data-publication-id="${escapeHtml(p.id)}">
        <div class="publication-visual">${visual}</div>
        <div class="publication-content">
          <h3><a href="${escapeHtml(href)}">${escapeHtml(p.title)}</a></h3>
          <div>${authorLine(p.authors)}</div>
          <div class="publication-venue">${escapeHtml(p.venue)}, ${escapeHtml(p.year)}</div>
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

/* --------------------- awards, talks and service --------------------- */

function renderEntries(entries, mount) {
  mount.replaceChildren(el(`<ul class="timeline-list">
    ${entries.map((entry) => `<li class="timeline-entry">
      <span class="timeline-year">${escapeHtml(entry.year)}</span>
      <div class="timeline-body">${entry.lines.map((line) => {
        const text = escapeHtml(line.text);
        const content = line.url ? `<a href="${escapeHtml(line.url)}">${text}</a>` : text;
        return `<div${line.bold ? ' class="timeline-title"' : ''}>${content}</div>`;
      }).join("")}</div>
    </li>`).join("")}
  </ul>`));
}

/* ---------------------------- wiring ---------------------------- */

const SECTIONS = [
  ["news", "data/news.json", renderNews],
  ["publications", "data/publications.json?v=centroid-image-1", renderPublications],
  ["awards", "data/awards.json?v=session-names-1", renderEntries],
  ["talks", "data/talks.json?v=concise-copy-1", renderEntries],
  ["misc", "data/misc.json?v=concise-copy-1", renderEntries],
];

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const updateNavigation = () => {
    let current = navLinks[0];
    for (const link of navLinks) {
      const section = document.querySelector(link.getAttribute("href"));
      if (section && section.getBoundingClientRect().top <= 120) current = link;
    }
    navLinks.forEach((link) => {
      if (link === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  let navPending = false;
  window.addEventListener("scroll", () => {
    if (navPending) return;
    navPending = true;
    requestAnimationFrame(() => { updateNavigation(); navPending = false; });
  }, { passive: true });
  updateNavigation();
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
