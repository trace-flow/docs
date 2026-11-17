// Builds the TraceFlow docs site into dist/ from the pages in content/.
//
// The pages are written here, in this repo, and nowhere else: this build reads nothing from the other TraceFlow
// repositories. A page is a Markdown file with a short header (title, label, order, tone, tagline, summary and
// optional chips); the landing page and the navigation are made from those headers, so adding a file adds a page.
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const root = path.dirname(fileURLToPath(import.meta.url));
const content = path.join(root, "content");
const dist = path.join(root, "dist");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const TONES = new Set(["ink", "coral", "amber", "teal", "paper", "quiet"]);

/** Splits the `---` header off a page. Only `key: value` lines are understood. */
function parsePage(file, text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) throw new Error(`${file}: missing the --- header`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ["title", "label", "order", "tone", "tagline", "summary"]) if (!meta[key]) throw new Error(`${file}: header needs "${key}"`);
  if (!TONES.has(meta.tone)) throw new Error(`${file}: tone must be one of ${[...TONES].join(", ")}`);
  return { slug: path.basename(file, ".md"), ...meta, order: Number(meta.order), chips: meta.chips ? meta.chips.split(",").map((c) => c.trim()) : [], body: text.slice(m[0].length) };
}

/** Renders Markdown, collecting the second-level headings for the page's own contents list. */
function render(src) {
  const toc = [];
  const seen = new Map();
  const md = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }) {
        let id = slugify(text) || "section";
        const n = seen.get(id) ?? 0;
        seen.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        if (depth === 2) toc.push({ id, text: esc(text) });
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
    },
  });
  return { toc, html: md.parse(src) };
}

/** Line icons on a 24px grid. Any element written with data-icon="name" gets its icon as the first child. */
const ICONS = {
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.4"/><path d="M17 14.2c2.4.2 4 2.1 4 4.8"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  loop: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v4.5h-4.5"/>',
  flag: '<path d="M5 21V4"/><path d="M5 5h12l-2 4 2 4H5"/>',
  check: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="m8 12.5 3 3 5-6"/>',
  branch: '<circle cx="6" cy="5.5" r="2.2"/><circle cx="6" cy="18.5" r="2.2"/><circle cx="18" cy="9" r="2.2"/><path d="M6 7.7v8.6M18 11.2c0 3.5-4 3-10.5 5.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  chat: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-4.5 3.5V17H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  flask: '<path d="M9.5 3.5h5M10.5 3.5v6L5 19a1.5 1.5 0 0 0 1.3 2.2h11.4A1.5 1.5 0 0 0 19 19l-5.5-9.5v-6"/><path d="M8 15h8"/>',
  alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
  history: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5M12 8v4.5l3 1.5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
  chart: '<path d="M5 20v-7M12 20V5M19 20v-10"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  upload: '<path d="M12 16V5M7.5 9.5 12 5l4.5 4.5"/><path d="M4 16v3h16v-3"/>',
  play: '<circle cx="12" cy="12" r="8.5"/><path d="m10 8.5 5 3.5-5 3.5z"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
  layers: '<path d="m12 3.5 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  shield: '<path d="M12 3 5 6v5.5c0 4.5 3 7.7 7 9.5 4-1.8 7-5 7-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  zap: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  tag: '<path d="M3.5 12.5v-8h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.2"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  sparkle: '<path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5-6.5-2 6.5-2z"/>',
};
const withIcons = (html) => html.replace(/(<[a-z]+\b[^>]*?\sdata-icon="([a-z-]+)"[^>]*>)/g, (_, open, name) => {
  if (!ICONS[name]) throw new Error(`unknown icon "${name}"`);
  return `${open}<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
});

/** "Where it fits": the same strip on every component page, with the current component ringed. */
function fit(slug, pages) {
  const tone = (s) => pages.find((p) => p.slug === s)?.tone ?? "quiet";
  const node = (s, small, label) => `<a class="step tone-${tone(s)}${s === slug ? " here" : ""}" href="${s}.html"><small>${small}</small>${label}</a>`;
  if (slug === "website") return `<div class="flow fit">${node("website", "Public site", "Website")}${node("web", "Sign up and sign in", "Web app")}</div>`;
  return `<div class="flow fit"><div class="col">${node("web", "Browser", "Web app")}${node("android", "Phone", "Android app")}</div>${node("api", "/api", "API")}${node("database", "Supabase", "Database")}</div>`;
}

const wrapTables = (html) => html.replace(/<table\b/g, '<div class="table-wrap"><table').replace(/<\/table>/g, "</table></div>");

/** Each second-level section becomes a stop on the thread that runs down the page. */
function intoStops(html) {
  const [intro, ...stops] = html.split(/(?=<h2 )/);
  return `${intro}${stops.map((s) => `<section class="stop">${s}</section>`).join("\n")}`;
}

function layout({ slug, title, body, nav, toc = [], description = "" }) {
  const links = nav.map((n) => `<a href="${n.slug}.html"${n.slug === slug ? ' aria-current="page"' : ""}>${esc(n.nav)}</a>`).join("");
  const aside = toc.length >= 3
    ? `<aside class="page-toc" aria-label="On this page"><p>On this page</p><ul>${toc.map((t) => `<li><a href="#${t.id}">${t.text}</a></li>`).join("")}</ul></aside>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · TraceFlow docs</title>
${description ? `<meta name="description" content="${esc(description)}">` : ""}
<link rel="icon" type="image/png" href="assets/favicon-32.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="stylesheet" href="assets/style.css">
<script src="assets/site.js" defer></script>
</head>
<body data-page="${slug}">
<header class="top">
  <a class="brand" href="index.html"><img src="assets/brandmark-color.svg" alt="" width="30" height="30"><span>TraceFlow</span><em>docs</em></a>
  <nav aria-label="Site"><a href="index.html"${slug === "index" ? ' aria-current="page"' : ""}>Overview</a>${links}</nav>
</header>
<main class="${aside ? "with-toc" : ""}">
${aside}
<div class="main-col">
${body}
</div>
</main>
<footer class="foot">TraceFlow documentation · last built ${new Date().toISOString().slice(0, 10)}</footer>
</body>
</html>
`;
}

function contentPage(page, nav, pages) {
  const { toc, html: rendered } = render(page.body);
  // {{modules}} is the number of module cards on the page, so a figure in the text can never drift from the cards.
  const modules = (rendered.match(/class="card module/g) ?? []).length;
  const html = withIcons(rendered.replaceAll("{{modules}}", String(modules)).replace("<div data-fit></div>", fit(page.slug, pages)));
  const chips = page.chips.length ? `<ul class="chips" aria-label="Built with">${page.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : "";
  const body = `<section class="head tone-${page.tone}">
  <p class="eyebrow">${esc(page.label)}</p>
  <h1>${esc(page.tagline)}</h1>
  <p class="lede">${esc(page.summary)}</p>
  ${chips}
</section>
<article class="doc surface">${intoStops(wrapTables(html))}</article>`;
  return { html: layout({ slug: page.slug, title: page.title, body, nav, toc, description: page.summary }), modules };
}

/** What traceability is, drawn with the app's own status colours. */
const THREAD = `<ol class="thread" aria-label="A requirement traced through a task and a test to a release">
  <li class="node done"><span class="dot"></span><b>Requirement</b><small>Approved</small></li>
  <li class="node done"><span class="dot"></span><b>Task</b><small>Done</small></li>
  <li class="node active"><span class="dot"></span><b>Test case</b><small>Running</small></li>
  <li class="node"><span class="dot"></span><b>Release</b><small>Waiting on the test</small></li>
</ol>`;

function landing(pages, nav, moduleCount) {
  const product = pages.find((p) => p.slug === "product");
  const components = pages.filter((p) => p.label === "Component");
  const find = (slug) => pages.find((p) => p.slug === slug);
  const tiles = components
    .map((p) => `<a class="tile tone-${p.tone}" href="${p.slug}.html"><span class="tag">${esc(p.title)}</span><strong>${esc(p.tagline)}</strong><span class="sub">${esc(p.summary)}</span><span class="go" aria-hidden="true">→</span></a>`)
    .join("");
  const box = (slug, small, wide = "") => {
    const p = find(slug);
    return p ? `<a href="${slug}.html" class="box tone-${p.tone}${wide}"><small>${esc(small)}</small>${esc(p.title)}</a>` : "";
  };
  const body = `<div class="landing">
<section class="hero">
  <p class="eyebrow">Documentation</p>
  <h1>From requirement to release, <span class="mark">on one thread.</span></h1>
  <p class="lede">TraceFlow keeps requirements, tasks, sprints, tests, risks and releases linked, on the web and on Android. These pages describe what it does and what it is made of.</p>
  <p class="actions"><a class="btn primary" href="product.html">What TraceFlow does</a><a class="btn" href="#components">The components</a></p>
  ${THREAD}
</section>

<section class="bento" id="components" aria-label="The product and its components">
  <a class="tile tone-${product.tone} t-product" href="product.html">
    <span class="tag">${esc(product.title)}</span>
    <span class="big">${moduleCount}</span>
    <strong>modules on one graph</strong>
    <span class="sub">${esc(product.summary)}</span>
    <span class="go" aria-hidden="true">→</span>
  </a>
  ${tiles}
</section>

<section class="fit">
  <h2>How the pieces fit</h2>
  <div class="stack">
    ${box("web", "Browser")}${box("android", "Phone")}
    <span class="wire" aria-hidden="true"></span>
    ${box("api", "/api", " wide")}
    <span class="wire" aria-hidden="true"></span>
    ${box("database", "Supabase", " wide")}
  </div>
  <p class="note">People use the web app or the Android app. Both talk to the API, which applies the rules and keeps everything in the database.</p>
</section>
</div>`;
  return layout({ slug: "index", title: "Overview", body, nav, description: "What TraceFlow does and the components it is made of." });
}

const files = (await readdir(content)).filter((f) => f.endsWith(".md"));
const pages = (await Promise.all(files.map(async (f) => parsePage(f, await readFile(path.join(content, f), "utf8"))))).sort((a, b) => a.order - b.order);
const nav = pages.map((p) => ({ slug: p.slug, nav: p.title }));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });

let moduleCount = 0;
for (const page of pages) {
  const { html, modules } = contentPage(page, nav, pages);
  if (page.slug === "product") moduleCount = modules;
  await writeFile(path.join(dist, `${page.slug}.html`), html);
}
await writeFile(path.join(dist, "index.html"), landing(pages, nav, moduleCount));
console.log(`Built ${pages.length + 1} pages into ${path.relative(process.cwd(), dist) || "dist"}`);
