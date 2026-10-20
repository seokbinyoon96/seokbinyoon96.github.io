/*
 * Renders publications from BibTeX and other sections from JSON in data/.
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
    ["all", "All"],
    ["recent", "Recent"],
    ["trajectory", "Trajectory Modeling"],
    ["operations", "Air Transportation"],
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
        `<span class="publication-note">${escapeHtml(n)}</span>`).join("");
      const href = p.links?.[0]?.url;
      const visual = p.image
        ? `<img src="${escapeHtml(p.image)}" alt="Figure from ${escapeHtml(p.title)}" loading="lazy">`
        : `<div class="publication-placeholder" aria-hidden="true"><span>${p.year}</span>${p.category === "trajectory" ? "Trajectory modeling" : "Air transportation"}</div>`;
      return el(`<article class="publication" data-publication-id="${escapeHtml(p.id)}">
        <div class="publication-visual">
          <span class="venue-tag">${escapeHtml(p.shortVenue)}</span>
          ${p.image ? `<a href="${escapeHtml(p.image)}" aria-label="View figure for ${escapeHtml(p.title)}">${visual}</a>` : visual}
        </div>
        <div class="publication-content">
          <h3>${href ? `<a href="${escapeHtml(href)}">${escapeHtml(p.title)}</a>` : escapeHtml(p.title)}</h3>
          <div class="publication-authors">${authorLine(p.authors)}</div>
          <div class="publication-venue">${escapeHtml(p.shortVenue)}, ${escapeHtml(p.year)}</div>
          ${notes ? `<div class="publication-notes">${notes}</div>` : ""}
          ${p.links.length ? `<div class="publication-links">${p.links.map((link) =>
            `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`).join("")}</div>` : ""}
        </div>
      </article>`);
    }));
  }
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (button) selectFilter(button.dataset.filter);
  });
  selectFilter("all");
}

/* --------------------- awards, talks and service --------------------- */

function renderEntries(entries, mount) {
  mount.replaceChildren(el(`<ul class="timeline-list">
    ${entries.map((entry) => `<li class="timeline-entry${entry.year ? "" : " timeline-entry-undated"}">
      ${entry.year ? `<span class="timeline-year">${escapeHtml(entry.year)}</span>` : ""}
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
  ["publications", "data/publications.bib", renderPublications, PublicationData.load],
  ["awards", "data/awards.json?v=session-names-1", renderEntries],
  ["talks", "data/talks.json?v=concise-copy-1", renderEntries],
  ["misc", "data/misc.json?v=iot-xplore-1", renderEntries],
];

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu-toggle");
  const navigation = document.getElementById("site-nav");
  const closeMenu = () => {
    navigation?.classList.remove("is-open");
    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", "Open navigation");
  };
  menu?.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  navigation?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeMenu(); menu.focus(); }
  });
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
  for (const [id, path, render, load = loadJSON] of SECTIONS) {
    const mount = document.getElementById(id);
    if (!mount) continue;
    load(path)
      .then((data) => render(data, mount))
      .catch((err) => {
        console.error(err);
        mount.appendChild(
          el(`<p style="font-family:sans-serif;color:${ACCENT}">
                This section could not be loaded. Please refresh the page or view my
                <a href="data/seokbinyoon_CV.pdf">CV</a>.
              </p>`)
        );
      });
  }
});
