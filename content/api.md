---
title: API
label: Component
order: 3
tone: coral
tagline: One API for every client.
summary: The service the web app, the Android app and automation all talk to.
chips: Node.js, Fastify
---

The API is the one place TraceFlow's rules are applied. The web app and the Android app are both clients of it, and so is any automation that holds a service token.

<div class="facts">
<div class="fact tone-ink"><b>One</b><span>place where the rules are applied</span></div>
<div class="fact tone-amber"><b>3</b><span>kinds of caller</span></div>
<div class="fact tone-teal"><b>JSON</b><span>over HTTPS</span></div>
<div class="fact"><b>/api</b><span>the prefix on every route</span></div>
</div>

## What it does

<div class="cards chip-coral">
<div class="card" data-icon="shield"><b>Checks every request</b><p>Each request is validated before anything is stored, and a clear error comes back when it is not valid.</p></div>
<div class="card" data-icon="flag"><b>Applies the workflows</b><p>Which status a record may move to, who may do it, and what the plan allows.</p></div>
<div class="card" data-icon="mail"><b>Sends email</b><p>Sign-up and reset codes, invitations and due-date reminders, through one mailer.</p></div>
<div class="card" data-icon="branch"><b>Connects Git hosts</b><p>Commits and pull requests from GitHub and GitLab are matched to the work they mention.</p></div>
<div class="card" data-icon="upload"><b>Handles document files</b><p>The browser sends a file straight to storage. The API only decides who may.</p></div>
<div class="card" data-icon="play"><b>Runs the interactive tour</b><p>Hands each visitor a sandbox, and clears it away afterwards.</p></div>
</div>

## How a request travels

<div class="flow">
<div class="step"><small>1</small>Request arrives</div>
<div class="step"><small>2</small>Checked</div>
<div class="step"><small>3</small>Rules applied</div>
<div class="step"><small>4</small>Stored</div>
<div class="step tone-coral"><small>5</small>Answer sent</div>
</div>

## Who calls it

<div class="cards chip-coral">
<div class="card" data-icon="globe"><b>Web app</b><p>Signed in as the person using it.</p></div>
<div class="card" data-icon="phone"><b>Android app</b><p>Signed in as the person using it.</p></div>
<div class="card" data-icon="zap"><b>Automation</b><p>With a service token, on plans that include the AI add-on.</p></div>
</div>

## Where it fits

<div data-fit></div>
