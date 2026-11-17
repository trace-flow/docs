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

## What it holds

- Organisations, people, roles and invitations.
- Projects and their modules.
- Requirements, tasks, sprints and releases.
- Test plans, cycles, cases, runs and results.
- Risks, documents, comments and their attachments.
- Links between records, and the history of every change.
- Time entries and notifications.

Every requirement, task, risk and test case gets a short, readable code, so people can refer to "REQ-00021" in a conversation or a commit message and mean exactly one thing.

## What it guarantees

- **The same rules for everyone.** Roles, plan limits and which records may be changed are decided here, so the web app, the Android app and any automation all meet the same rules.
- **Nothing is silently overwritten.** If two people edit the same task or requirement, the second save is refused and tells them the record has changed.
- **A readable history.** Changes are recorded as before and after, so the activity feed can say what changed rather than only that something did.
- **Smaller plans keep data.** Moving to a smaller plan hides what no longer fits. Nothing is deleted, and upgrading brings it all back.

## Sample data

For trying the product, the database can be filled with three sample organisations, one on each plan, with realistic projects, requirements, tasks, sprints, tests and risks. Every plan limit can be seen at its edge without building a team first.

## Where it fits

[Web app](web.html) and [Android app](android.html) → [API](api.html) → database.
