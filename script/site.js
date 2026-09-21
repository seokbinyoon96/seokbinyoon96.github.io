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
  const rows = pubs.map((p) => {
    const links = (p.links || []).map(
      (l) => `<a href="${escapeHtml(l.url)}">${escapeHtml(l.label)}</a>`
    );
    if (p.bibtex) links.push(`<a href="${escapeHtml(p.bibtex)}">bibtex</a>`);

    const notes = (p.notes || [])
      .map((n) => `<span style="color:${ACCENT}"><strong>${escapeHtml(n)}</strong></span>`)
      .join(" &nbsp;&middot;&nbsp; ");

    const href = (p.links && p.links[0] && p.links[0].url) || p.bibtex || "#";

    return `
      <tr>
        <td style="padding:20px;width:25%;vertical-align:middle">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}"
               style="width:160px;max-width:100%;border-style:none">
        </td>
        <td style="padding:20px;width:75%;vertical-align:middle">
          <a href="${escapeHtml(href)}"><papertitle>${escapeHtml(p.title)}</papertitle></a>
          <br>
          ${authorLine(p.authors)}
          <br>
          <em>${escapeHtml(p.venue)}</em>, ${escapeHtml(p.year)}
          ${notes ? `<br>${notes}` : ""}
          <br>
          ${links.join(" / ")}
          <p></p>
          <p>${escapeHtml(p.summary)}</p>
        </td>
      </tr>`;
  });

  mount.appendChild(el(`
    <table style="width:100%;border:0px;border-spacing:0px;border-collapse:separate;
                  margin-right:auto;margin-left:auto">
      <tbody>${rows.join("")}</tbody>
    </table>
  `));
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
        <td style="padding:20px 16px;width:30%;vertical-align:middle;text-align:center">${logo}</td>
        <td style="padding:20px 10px;width:70%;vertical-align:middle">${body}</td>
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
        <td style="padding:20px 16px;width:30%;vertical-align:middle;text-align:center">
          <img src="${escapeHtml(e.logo)}" alt="${escapeHtml(e.alt)}"
               style="max-width:100%;max-height:${e.height || 80}px;object-fit:contain">
        </td>
        <td style="padding:20px 10px;width:70%;vertical-align:middle;font-family:sans-serif">
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
