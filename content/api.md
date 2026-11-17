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

## What it does

- **Checks every request.** Each request is validated before anything is stored, and a clear error comes back when it is not valid.
- **Applies the workflows.** Which status a requirement, task or test may move to, who may do it, and what the plan allows.
- **Creates accounts and sends email.** Sign-up and password-reset codes, invitations and due-date reminders all go out from here, through one mailer.
- **Connects Git hosts.** Commits and pull requests from GitHub and GitLab are matched to the tasks and requirements they mention.
- **Handles document files.** Uploaded files go to Supabase Storage by default, or to S3-compatible storage; the browser sends the file directly and the API only decides who may.
- **Runs the interactive tour.** It hands each visitor a sandbox and clears it away afterwards.

## Who calls it

| Caller | How |
|---|---|
| Web app | Signed in as the person using it |
| Android app | Signed in as the person using it |
| Automation | With a service token, on plans that include the AI add-on |

## Shape

A JSON API over HTTPS. Every route lives under `/api/`, so a single address can serve the web app and the API side by side.

## Where it fits

[Web app](web.html) and [Android app](android.html) → API → [database](database.html).
