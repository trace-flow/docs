---
title: Database
label: Component
order: 2
tone: amber
tagline: Where the work lives.
summary: The system of record behind every requirement, task, test and release.
chips: Postgres, Supabase
---

The database is TraceFlow's system of record. Everything a team creates ends up here, and every other part of TraceFlow reads and writes through it. People never connect to it directly; the API does.

<div class="facts">
<div class="fact tone-coral"><b>One</b><span>source of truth for every client</span></div>
<div class="fact tone-teal"><b>Every</b><span>change kept, before and after</span></div>
<div class="fact tone-ink"><b>Zero</b><span>records deleted on a downgrade</span></div>
<div class="fact"><b style="font-size:1.55rem;white-space:nowrap;padding:.3em 0">REQ-00021</b><span>readable codes, one meaning each</span></div>
</div>

## What it holds

<div class="cards chip-amber">
<div class="card" data-icon="users"><b>Organisations and people</b><p>Roles and invitations.</p></div>
<div class="card" data-icon="folder"><b>Projects and modules</b><p>The structure work is organised in.</p></div>
<div class="card" data-icon="list"><b>Requirements</b><p>With hierarchies, status and owners.</p></div>
<div class="card" data-icon="check"><b>Tasks, sprints and releases</b><p>The work, and how it is planned.</p></div>
<div class="card" data-icon="flask"><b>Tests</b><p>Plans, cycles, cases, runs and results.</p></div>
<div class="card" data-icon="alert"><b>Risks</b><p>Severity, likelihood and mitigation.</p></div>
<div class="card" data-icon="file"><b>Documents and comments</b><p>With their attachments.</p></div>
<div class="card" data-icon="link"><b>Links between records</b><p>The graph that makes tracing possible.</p></div>
<div class="card" data-icon="clock"><b>Time and notifications</b><p>Time entries and what people follow.</p></div>
</div>

Every requirement, task, risk and test case gets a short, readable code, so a conversation or a commit message can say "REQ-00021" and mean exactly one thing.

## What it guarantees

<div class="pair">
<div class="demo"><b>The same rules for everyone</b><p>Roles, plan limits and who may change what are decided here, so every client meets them.</p><div class="mock"><div class="tagline-chips"><span>Web app</span><span>Android app</span><span>Automation</span></div><div class="mrow"><span>Same role checks</span><span class="new">Yes</span></div><div class="mrow"><span>Same plan limits</span><span class="new">Yes</span></div></div></div>
<div class="demo"><b>Nothing is silently overwritten</b><p>If two people edit the same record, the second save is refused and says the record has changed.</p><div class="mock"><div class="mrow"><span>Priya saved</span><span class="st"><span class="sd done"></span>10:42</span></div><div class="mrow"><span>Sam saved</span><span class="st"><span class="sd blocked"></span>10:43</span></div><div class="refused">Refused: this task has changed since you opened it.</div></div></div>
<div class="demo"><b>A readable history</b><p>Changes are kept as before and after, so the feed says what changed, not only that something did.</p><div class="mock"><div class="mrow"><span>Status</span><span><span class="old">Draft</span> → <span class="new">Approved</span></span></div><div class="mrow"><span>Priority</span><span><span class="old">Medium</span> → <span class="new">High</span></span></div></div></div>
<div class="demo"><b>Smaller plans keep data</b><p>Moving to a smaller plan hides what no longer fits. Upgrading brings it all back.</p><div class="pills"><span>Project A</span><span>Project B</span><span class="hid">Project C</span><span class="hid">Project D</span><span class="hid">Project E</span></div></div>
</div>

## Sample data

For trying the product, the database can be filled with three sample organisations, one on each plan, with realistic projects, requirements, tasks, sprints, tests and risks. Every plan limit can be seen at its edge without building a team first.

<div class="facts">
<div class="fact tone-teal"><b>Free</b><span>sample organisation</span></div>
<div class="fact tone-amber"><b>Pro</b><span>sample organisation</span></div>
<div class="fact tone-ink"><b>Enterprise</b><span>sample organisation</span></div>
</div>

## Where it fits

<div data-fit></div>
