# BRIEF — Mobile Experience

**Author:** Rohan Jasani

> **Read `DOMAIN.md` first.** It describes the business, its people, its workflows, and its data. This brief covers only what's being built, and cites the domain by section (e.g. `DOMAIN.md §D3`).

---

## Assignment

> **P303 — Mobile experience**
>
> Build a mobile-first web experience for someone doing a specific task on their phone.
>
> Note: This is a responsive web app, not a native mobile app. React Native, Flutter, Kotlin, and Swift are out of scope, although you're welcome to attempt a native app.
>
> **What you're building**
>
> Designing for mobile isn't just about making things smaller. It's a completely different context. One hand. Glancing at a screen between tasks. Maybe outside, maybe on a job site. Your build should do one thing well for someone who's probably not sitting at a desk.
>
> Pick any industry and any mobile scenario. The table below includes examples across Slalom's industries as a starting point.

---

## Experience focus

**Order tracking for the client** — from the moment Priya walks out of her appointment to the moment she walks out of Groundwork Apothecary with her formula in hand.

One task, done well: *where is my formula, and is anything needed from me?*

## Primary persona
**Priya Raman, Client** — `DOMAIN.md §D3`.
This is journey **J1** seen from the outside — `DOMAIN.md §D4`. Every stage below maps to a step in that loop.

## The context

Priya leaves Rohan's office knowing only that "a formula has been sent over." Then: silence. She doesn't know how long compounding takes, whether it's started, whether something's out of stock, or when to drive over. Today that gap gets filled by phoning Nora and asking — friction for Priya, interruption for Groundwork Apothecary.

This is a **glance-and-go** experience. Priya checks it standing in a parking lot, waiting for a bus, between meetings. She is never at a desk. Most visits are three seconds long and answer one question: *is it ready?*

---

## Fulfillment stages to track

Mapped directly from **J1** (`DOMAIN.md §D4`):

| # | Stage | J1 step | What Priya sees |
|---|---|---|---|
| 1 | **Formula received** | 2–3 | Rohan's order has arrived at Groundwork Apothecary |
| 2 | **Under review** | 4 | Safety and stock checks in progress |
| 3 | **In preparation** | 5 | Being compounded at the bench |
| 4 | **Ready for pickup** | 6 | Location, hours, what to bring |
| 5 | **Picked up** | 7 | Complete — dosing instructions retained for reference |

Plus the exception states, which matter more than the happy path:

- **Needs your input** — a question only Priya can answer (allergy confirmation, preference between forms)
- **Waiting on your practitioner** — a safety flag or substitution Rohan must confirm; *no action needed from Priya, but she should know why it's paused*
- **Delayed — ingredient on backorder** — with a revised estimate
- **Payment required** — pay now, or auto-pay from a saved method
- **Ready, awaiting pickup** — with a gentle nudge if it's been sitting

---

## Functional requirements

- **M1 — One-glance status.** Current stage, plain-language explanation, and estimated ready time, visible without scrolling or tapping.
- **M2 — Timeline.** The stages with timestamps for what's done and an estimate for what's ahead. Progressive, not a wall of detail.
- **M3 — Action surfacing.** If something is needed from Priya, it is the first and most prominent thing on the screen. If nothing is needed, the screen says so explicitly — *"nothing needed from you"* is a real answer worth stating.
- **M4 — Payment.** Pay in-app, or enable auto-pay so pickup is a pure handoff. Must handle a saved method and a failed charge gracefully.
- **M5 — Notifications.** Push or SMS on stage changes and blockers, so Priya doesn't have to keep checking. The best version of this app is one she rarely needs to open.
- **M6 — Pickup details.** Address, hours, map link, and what to bring — one tap from ready status.
- **M7 — Formula reference.** After pickup, retain dosing instructions, preparation method, and safety warnings. **This is the screen she'll actually reopen** — at home, at 9pm, wondering how long to steep it.
- **M8 — Get help.** Contact Groundwork Apothecary, or report a reaction (journey **J3**), without hunting for a phone number.
- **M9 — History.** Past formulas, since Priya is a quarterly regular. Reorder context and continuity across visits.

## Design constraints

- **Responsive web, not native.** No app install — a link from a confirmation text. Must work on a mid-range Android in a bad-signal parking lot.
- **One hand, thumb zone.** Primary actions in the bottom half of the screen.
- **Plain language, no jargon.** Priya is not a clinician. "Under review" not "safety-flag adjudication."
- **Calm by default.** A health-adjacent app that pings anxiously is a bad app. Alarming states are reserved for things that are genuinely blocking.
- **Privacy-aware.** Health information on a lock screen; notifications must not leak formula contents or conditions into a preview.

## Implementation

Built as a Vue 3 + Vite single-page app (no backend) in [`app/`](app/) — plain SFCs, hand-rolled CSS from `DESIGN.md`'s tokens, no router or state library (a handful of screens and one reactive store didn't need either).

**Screens:** order status (home), formula history, formula reference, help/contact.

| Requirement | Where it lives |
|---|---|
| M1 One-glance status | Status card at the top of the home screen — stage, plain-language line, ETA |
| M2 Timeline | Collapsed to current ± one stage by default; "See full timeline" expands all five |
| M3 Action surfacing | A single banner slot above the status card — an exception, a payment prompt, or an explicit "Nothing needed from you right now" |
| M4 Payment | Pay now / auto-pay toggle / retry-on-decline, via a bottom sheet; auto-pay charges at "ready for pickup" (see Open decisions) |
| M5 Notifications | In-app toast on every stage change and exception, standing in for push/SMS since there's no backend to send either. Text is deliberately generic — never names herbs or conditions, per the privacy-aware constraint |
| M6 Pickup details | Address, hours, map link, call, what to bring — shown once "ready for pickup" |
| M7 Formula reference | Ingredients (Latin binomial, part, form), dosing, prep, safety notes — reachable from the status screen once picked up, and from History |
| M8 Get help | Call / directions, plus a report-a-reaction form (J3) |
| M9 History | Past formulas, each reopening into the same formula reference screen |

**Known gap:** the "Ready, awaiting pickup — gentle nudge if it's been sitting" exception state (see "Fulfillment stages to track" above) wasn't built. The other four exception states were.

**Since there's no backend**, an order can't progress on its own. A **Scenarios panel** (top-right, dev-only, not part of the client experience) lets you jump directly to any stage or trigger any exception state to see the app respond to it.

Run it: `cd app && npm install && npm run dev`.

## Success criteria

1. Does **one thing well** rather than shrinking a dashboard onto a phone.
2. The **three-second visit** works — status is legible before the page finishes settling.
3. Exception states are designed as carefully as the happy path; a blocked order is the moment this app either earns its place or fails.
4. The mobile context is visible in the design decisions, not just in the breakpoint.

## Open decisions

| # | Decision | Status |
|---|---|---|
| 1 | Persona and scenario | **Resolved** — Priya, client-facing order tracking |
| 2 | Does auto-pay charge at "ready for pickup" or at physical handoff? | **Resolved** — at "ready for pickup," so physical handoff is a pure handoff per M4 |
| 3 | Authentication: magic link from SMS, or account with login? | **Resolved** — magic link only; the link from the confirmation text *is* the auth, so there's no separate login screen |
