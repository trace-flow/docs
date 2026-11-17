---
title: Product
label: Product
order: 1
tone: ink
tagline: Plan, build, verify and track from one graph.
summary: What TraceFlow does, who can do what, and what each plan includes.
---

TraceFlow is a workspace for engineering teams building complex products. Requirements, tasks, tests, risks, documents and releases live in one linked graph, so you can follow any requirement to the work that built it, the tests that check it and the release that ships it.

<div class="facts">
<div class="fact tone-coral"><b>{{modules}}</b><span>modules on one set of records</span></div>
<div class="fact tone-amber"><b>4</b><span>groups: Plan, Execute, Verify, Track</span></div>
<div class="fact tone-teal"><b>8</b><span>roles, at organisation and project level</span></div>
<div class="fact tone-ink"><b>3</b><span>plans: Free, Pro and Enterprise</span></div>
</div>

<figure class="graph">
<svg viewBox="0 0 720 215" role="img" aria-label="A requirement linked to a task, a test case and a release, with a risk, a commit, a run result and a document attached">
<path class="ln on" d="M150 69H190"/><path class="ln on" d="M330 69H370"/><path class="ln" d="M510 69H550"/>
<path class="ln" d="M80 98V152"/><path class="ln" d="M260 98V152"/><path class="ln" d="M440 98V152"/><path class="ln" d="M620 98V152"/>
<rect class="n-coral" x="10" y="40" width="140" height="58" rx="16"/><text class="t t-coral" x="80" y="75">Requirement</text>
<rect class="n-amber" x="190" y="40" width="140" height="58" rx="16"/><text class="t t-amber" x="260" y="75">Task</text>
<rect class="n-teal" x="370" y="40" width="140" height="58" rx="16"/><text class="t t-teal" x="440" y="75">Test case</text>
<rect class="n-ink" x="550" y="40" width="140" height="58" rx="16"/><text class="t t-ink" x="620" y="75">Release</text>
<rect class="sat" x="25" y="152" width="110" height="38" rx="12"/><text class="t-sat" x="80" y="176">Risk</text>
<rect class="sat" x="205" y="152" width="110" height="38" rx="12"/><text class="t-sat" x="260" y="176">Commit</text>
<rect class="sat" x="385" y="152" width="110" height="38" rx="12"/><text class="t-sat" x="440" y="176">Run result</text>
<rect class="sat" x="565" y="152" width="110" height="38" rx="12"/><text class="t-sat" x="620" y="176">Document</text>
</svg>
<figcaption>Every record can link to the others, so "is this requirement built, tested and shipped?" has one answer.</figcaption>
</figure>

## Who it is for

Teams that have to show their work.

<ul class="tags">
<li>Embedded and IoT</li>
<li>Automotive</li>
<li>Medical devices</li>
<li>Aerospace</li>
<li>Robotics</li>
<li>Industrial equipment</li>
</ul>

## Modules

Each module works on its own and shares the same records, so nothing is synced by hand. <em class="pro">Pro</em> marks what the Pro plan adds.

### Plan

<div class="cards chip-coral">
<div class="card module" data-icon="list"><b>Requirements</b><p>Types, priority, status, owners and parent and child hierarchies, by project and module.</p></div>
<div class="card module" data-icon="loop"><b>Sprints</b><p>Plan sprints per module and follow progress from the tasks inside them.</p></div>
<div class="card module" data-icon="flag"><em class="pro">Pro</em><b>Releases</b><p>Scope a release, with progress rolled up from every requirement in it.</p></div>
</div>

### Execute

<div class="cards chip-amber">
<div class="card module" data-icon="check"><b>Tasks, bugs and to-dos</b><p>Epics, features, stories, bugs and quick items, each traceable to a requirement.</p></div>
<div class="card module" data-icon="branch"><em class="pro">Pro</em><b>Git linking</b><p>Commits and pull requests that mention a code link back on their own.</p></div>
<div class="card module" data-icon="clock"><b>Time tracking</b><p>Log time against a task and see it next to the estimate.</p></div>
<div class="card module" data-icon="chat"><b>Comments and attachments</b><p>Discuss any record, and attach files to the discussion.</p></div>
<div class="card module" data-icon="bell"><b>Notifications</b><p>Due-date reminders and updates on the work you follow.</p></div>
</div>

### Verify

<div class="cards chip-teal">
<div class="card module" data-icon="flask"><em class="pro">Pro</em><b>Test management</b><p>Plans, cycles, cases, runs and results, linked to requirements so coverage shows.</p></div>
<div class="card module" data-icon="alert"><b>Risks</b><p>Severity and likelihood, with a mitigation note and an owner on every risk.</p></div>
<div class="card module" data-icon="link"><em class="pro">Pro</em><b>Traceability</b><p>A coverage matrix, a mind map and export across requirements, tasks, tests and risks.</p></div>
</div>

### Track

<div class="cards chip-ink">
<div class="card module" data-icon="file"><b>Documents</b><p>Specs, designs and reports linked to the requirements they describe.</p></div>
<div class="card module" data-icon="history"><b>Activity and history</b><p>A readable record of what changed on a project, and who changed it.</p></div>
<div class="card module" data-icon="grid"><b>Dashboard</b><p>Your tasks, sprint progress and what needs attention, the moment you sign in.</p></div>
<div class="card module" data-icon="chart"><em class="pro">Pro</em><b>Reports</b><p>Programme health, coverage and velocity, rolled up across a project.</p></div>
</div>

## Roles and access

Work is organised as organisation, then project, then module. People hold a role in the organisation and, separately, on each project.

<div class="pair">
<div class="demo"><b>Organisation</b><p>Highest first. An Admin can manage every project.</p><ol class="ladder"><li>Admin</li><li>Manager</li><li>Developer</li><li>Viewer</li></ol></div>
<div class="demo"><b>Project</b><p>Highest first, set per project.</p><ol class="ladder"><li>Project Owner</li><li>Maintainer</li><li>Contributor</li><li>Viewer</li></ol></div>
</div>

<div class="callout" data-icon="shield"><p>People join by invitation. The apps hide what a role cannot do, and the data layer enforces it as well, so a hidden button is never the only safeguard.</p></div>

## Plans

<div class="plans">
<div class="plan"><h4>Free</h4><p class="lim"><b>5</b>people</p><p class="lim"><b>2</b>projects</p><p class="lim"><b>5</b>modules per project</p><ul class="ticks"><li>Requirements, tasks, sprints</li><li>CSV import and export</li><li class="no">Releases, tests, reports</li><li class="no">Traceability and Git linking</li><li>Email support</li></ul></div>
<div class="plan tone-amber"><h4>Pro</h4><p class="lim"><b>∞</b>people, projects, modules</p><ul class="ticks"><li>Everything in Free</li><li>Releases, test management, reports</li><li>Traceability, with export</li><li>Git linking</li><li>AI add-on available</li><li>Priority support</li></ul></div>
<div class="plan tone-ink"><h4>Enterprise</h4><p class="lim"><b>∞</b>people, projects, modules</p><ul class="ticks"><li>Everything in Pro</li><li>AI add-on included</li><li>Dedicated support, with custom onboarding</li></ul></div>
</div>

<div class="callout teal" data-icon="shield"><p>A team that moves to a smaller plan keeps its data. What no longer fits is hidden until the plan allows it again. Nothing is deleted.</p></div>

## Try it

The website's interactive tour gives every visitor a private sandbox filled with sample data. Nothing done there reaches anyone else.
