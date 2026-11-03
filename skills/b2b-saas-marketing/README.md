# b2b-saas-marketing

A Claude Code skill that diagnoses and fixes **B2B SaaS growth**: paid acquisition (mostly Meta), unit economics, demo and free-trial funnels, show rates, video sales letters, lifecycle email and churn, and offers, positioning and pricing.

Ships in the [`onex`](../../README.md) plugin and is invoked as **`/onex:b2b-saas-marketing`**.

## What it does

Trigger it (`/onex:b2b-saas-marketing`, or say "audit my ads", "why aren't demos booking", "low show rate", "fix my trial conversion", "price my SaaS"). Claude works like an operator, not a commentator:

1. **Intake.** It asks for the 3 to 5 numbers that matter most: business model, price, margin, funnel counts for this month and the best month, churn, ad spend, and which events reach Meta. Assumptions are stated out loud while it waits.
2. **Economics first.** It computes the max cost per booked call (or per trial) and LTV:CAC. Every later judgment is relative to those two numbers.
3. **Find the biggest button.** It compares each funnel step to its benchmark and to the company's own best month, then fixes the step furthest from its best.
4. **Check fit.** It confirms the channel and funnel type match the price point and market size, and says plainly when Meta or a free trial is the wrong tool.
5. **Prescribe.** It uses the matching playbook to give exact settings, numbers, scripts and an ordered sequence of steps, plus what to stop doing.
6. **Caveat.** Benchmarks are starting points. They get replaced with measured rates once a step has 30+ data points.

## What's inside

`SKILL.md` is a single playbook in twelve sections plus templates:

- **0. Triage:** symptom to likely cause to first fix
- **1. Unit economics:** max cost per booked call, fully loaded CAC, LTV, payback, when to scale or hold
- **2. Funnel diagnosis:** demo-funnel benchmarks, the three-buttons exercise, lead-level tracking
- **3. Funnel and channel choice:** funnel type by price point, when Meta is the wrong bet
- **4. Meta ads operating system:** account structure, creative as targeting, buyer signals, launch checklist, scaling, iteration, retargeting
- **5. Creative playbook:** hooks, format tier list, mining buyer language
- **6. Demo funnel blueprint:** two confirmation pages, form design, show-rate system, quiz funnels
- **7. VSLs:** B2B and SaaS VSL structures, script order, page layout, the three numbers to read
- **8. Free trials and PLG:** six-level trial funnel, onboarding emails
- **9. Lifecycle email and retention:** churn math, prevention flows, cancellation and win-back, discount framing
- **10. Offer, positioning and pricing:** offer pyramid and builder, high-ticket tiers, done-for-you tiers, selling AI agents
- **11. Organic and webinar funnels**
- **12. Scaling infrastructure and enterprise proof**
- **Appendix:** templates for onboarding emails, the cancellation flow email, a credit offer, the confirmation call outline, and the audit intake table

## Caveats

The benchmarks and case results come from a B2B SaaS growth creator's short-form content and were not independently verified. Check current figures before quoting them to clients or investors. Meta setting names change often, so verify them in Ads Manager before giving click-by-click instructions.

## Install

This skill ships in the **`onex`** Claude Code plugin:

```bash
/plugin marketplace add onextech/skills
/plugin install onex@skills
```

Then trigger it with `/onex:b2b-saas-marketing` or any of the phrases listed in `SKILL.md`'s description.

## License

MIT
