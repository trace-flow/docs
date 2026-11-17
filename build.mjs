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

function contentPage(page, nav) {
  const { toc, html } = render(page.body);
  const chips = page.chips.length ? `<ul class="chips" aria-label="Built with">${page.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : "";
  const body = `<section class="head tone-${page.tone}">
  <p class="eyebrow">${esc(page.label)}</p>
  <h1>${esc(page.tagline)}</h1>
  <p class="lede">${esc(page.summary)}</p>
  ${chips}
</section>
<article class="doc surface">${intoStops(wrapTables(html))}</article>`;
  return { html: layout({ slug: page.slug, title: page.title, body, nav, toc, description: page.summary }), rendered: html };
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
  const { html, rendered } = contentPage(page, nav);
  if (page.slug === "product") moduleCount = [...rendered.matchAll(/<div class="module-list">([\s\S]*?)<\/div>/g)].reduce((n, m) => n + (m[1].match(/<li>/g) ?? []).length, 0);
  await writeFile(path.join(dist, `${page.slug}.html`), html);
}
await writeFile(path.join(dist, "index.html"), landing(pages, nav, moduleCount));
console.log(`Built ${pages.length + 1} pages into ${path.relative(process.cwd(), dist) || "dist"}`);
