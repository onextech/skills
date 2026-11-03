---
description: "Diagnose and fix B2B SaaS growth — Meta ads, unit economics (max cost per booked call, LTV:CAC, payback), demo and free-trial funnels, show-rate systems, VSLs, lifecycle email and churn, offers, positioning and pricing. Works like an operator: gets the numbers first, finds the funnel step furthest from its benchmark, checks channel and funnel fit for the price point, then prescribes exact settings, scripts and steps. Use when the user says \"/onex:b2b-saas-marketing\", \"audit my ads\", \"plan a Meta campaign\", \"why aren't demos booking\", \"low show rate\", \"fix my trial conversion\", \"write a VSL\", \"churn emails\", \"price my SaaS\", \"build an offer\", or is auditing or planning ads, funnels, offers or conversion for a B2B SaaS company."
---

# /onex:b2b-saas-marketing — B2B SaaS growth playbooks

A working playbook for founders and marketing leads trying to grow a B2B SaaS company with paid acquisition, funnels, email and offers. Most of it is Meta-centric, but the economics, funnel, offer and email sections apply to any channel.

## How to use this skill

Work like an operator, not a commentator. For every request:

1. **Intake.** Get the numbers before giving advice (see Intake below). If they are missing, ask for the 3 to 5 that matter most, and state assumptions out loud while you wait.
2. **Economics first.** Compute the max cost per booked call (or per trial) and LTV:CAC. Every later judgment is relative to these numbers.
3. **Find the biggest button.** Compare each funnel step to its benchmark and to the company's own best month. Fix the step furthest from its best, not the one the founder understands best.
4. **Check fit.** Confirm the channel and funnel type match the price point and market size (section 3). Say so plainly when Meta or a free trial is the wrong tool.
5. **Prescribe.** Use the matching playbook. Give exact settings, numbers, scripts and a sequence of steps. Say what to stop doing, too.
6. **Caveat.** Benchmarks here are starting points. Replace them with the company's measured numbers as soon as there are 30+ data points per step.

Output style: lead with the diagnosis and the number that proves it, then the fix, then the order of operations. Use tables for comparisons and calculators. Never recommend "more ads" when the offer, the form or the show rate is the broken step.

### Intake questions

- Business model: demo-led sales, free trial, freemium/self serve, or a hybrid? Price per month or year, and contract length.
- Gross margin, sales commission, and monthly sales and marketing cost all in (salaries, tools, agencies).
- Funnel counts for this month and the best month ever: ad clicks, page visitors, applications/signups, bookings, shows, qualified, closed, average deal size.
- Monthly churn or average customer lifetime.
- Monthly ad spend by channel, ad account age, number of active ads and ad sets.
- What events are sent back to Meta today (pixel only, Conversions API, CRM stages)?
- Sales cycle length and who signs (one person or a committee).
- Size of the addressable market (hundreds of possible buyers, or thousands+?).

---

## 0. Triage: symptom to cause to fix

Start here. Match what the founder says to the most likely cause before going deeper.

| What they say | Most likely cause | First fix (section) |
|---|---|---|
| "Meta leads get worse every week" | Algorithm starved: under ~50 conversions a week, split across many ad sets, optimizing on cheap form fills | Consolidate ad sets, optimize a more frequent buyer event, send qualified leads back via CAPI (4.3) |
| "Sales says all the leads are garbage" | Meta was only asked for leads, never told who qualified or bought | CRM stage feedback to Meta, Conversion Leads goal (4.3) |
| "Our best ad has the cheapest demos but pipeline is flat" | Ad is reaching existing customers and pipeline, high frequency, view-through credit | 7 day click, exclude customer and pipeline lists, judge on new qualified pipeline in CRM (4.5) |
| "We tripled budget on our winner and it died in 4 days" | Burned through the ad's pool of fresh people | Scale 10 to 30% every few days, keep backup winners (4.7) |
| "Our one winning ad died and pipeline died with it" | Single point of failure, iteration started too late | Iterate from the day an ad wins, target 5 to 10 live winners (4.8) |
| "Meta spent everything on 2 of 20 ads" | Normal. Meta predicted the other 18 would lose | Don't force spend. Make more like the winners (4.6) |
| "Leads suddenly look completely different" | One word in the ad changed the pocket, or the pocket ran dry | Word check, new situations, rotate ad sets (4.2) |
| "We rewrote ads 40 times, cost per call is still terrible" | Offer problem dressed up as an ad problem | Offer pyramid and offer builder (10.1, 10.2) |
| "Prospects always pick the cheapest option" | Wrong shelf: compared feature by feature with cheap tools | "So what?" ladder, test shelves as ads (10.3) |
| "A competitor shipped our feature in 3 weeks" | Competing on features, which AI makes cheap to copy | Compete on the deal: result, timeframe, risk reversal, small first step (10.2) |
| "Half our booked demos never show" | Leaks between booking and call | Show rate system, confirmation specialist, secret shop (6.4) |
| "Prospects ask 'so what do you do again?' or 'let me loop in my boss'" | All education happens live, one prospect at a time | VSL on the landing page, retarget booked prospects (7, 4.9) |
| "Every comment on our ads says 'what is this?'" | New category; market doesn't understand the product yet | Venus flytrap sequence (4.11) |
| "400 trial signups, 11 pay" | Users never reach the aha moment | Two-part onboarding flow (8.2) |
| "We signed 20 customers and revenue still went down" | Churn | No login, low usage and cancel page flows (9.3) |
| "$300 per demo is too expensive, we paused" | No ceiling calculated; decision made on feel | Max cost per call calculator (1.1) |
| "The board says we lose money on every customer" | CAC counted as ad spend only; no LTV or payback view | Fully loaded CAC, LTV:CAC, payback (1.2) |
| "Our 9 question form keeps out time wasters" | It also starves Meta (7 signals a week instead of 50) | One question form plus routing (6.3) |
| "300 webinar signups, 12 showed" | Promoted too early; no show up system | Webinar funnel (11.2) |
| "I post every day and get 6 likes" | Posting is only level 1 of 5 | Organic content funnel (11.1) |
| "We copied a B2C brand's funnel and got 2 signups" | B2B buyers need a conversation, not a checkout | B2B vs B2C funnel rules (3.1) |
| "We have 400 dead leads in the CRM" | Nobody restarted the conversation | 9 word email (9.4) |
| "Black Friday: 30% off annual" | Percent framing on a high price, and it trains buyers to wait | Rule of 100 and credit framing (9.5) |
| "$99 a month, 20% monthly churn, $500 CAC" | Customers leave before paying back | High ticket offer on top (10.4) |
| "Our co-founder and I can't agree on positioning" | Positioning by opinion | Let the market vote with ads (10.3) |
| "Landing page crashed the day we scaled" | Never tested under load | Load test before budget jumps (12) |
| "Enterprise deal frozen on 'can it handle 2,000 users?'" | No proof of scale | Load test results as a sales asset (12) |
| "Users of our AI agent push back on buying it" | Selling to the person the agent replaces | Sell to the CEO or CFO in money terms (10.7) |

---

## 1. Unit economics

### 1.1 Max cost per booked call (the ceiling)

The ceiling is the most you can pay for one booked call and still hit your payback target. It is a ceiling, not a target. Calculate it before launching anything and before pausing anything.

**Formula (margin version):**

max cost per booked call = customer value after margin × show rate × qualified rate × close rate

Worked examples:

| Inputs | Calculation | Ceiling |
|---|---|---|
| $10k/yr deal, 70% margin, 70% show, 70% qualified, 25% close | $7,000 × 0.7 × 0.7 × 0.25 | ~$850 per booked call |
| $10k/yr deal, revenue view (no margin), same rates | $10,000 × 0.7 × 0.7 × 0.25 | ~$1,200 first year revenue per booked call |
| $2k/month, 70 of 100 show, 60% qualified, 25% close; ~$17k allowable to win a customer after margin and commission with 12 month payback | ~1 customer per 10 booked calls, so $17,000 ÷ 10 | ~$1,700 per booked call |

**Payback version:** allowable CAC = monthly gross profit per customer (after commission) × payback target in months. Ceiling = allowable CAC ÷ booked calls needed per customer (1 ÷ (show × qualified × close)).

The common mistake: pausing at $300 to $400 per call because it "felt expensive" when the ceiling was $850 to $1,700. Meanwhile a competitor pays $50 per call and closes nobody.

### 1.2 Fully loaded CAC, LTV and payback

- **CAC is fully loaded:** ad spend + sales salaries + commissions + tools + agencies. Example: $20k ad spend and 4 customers looks like $5k CAC. With $80k all in, it is $20k.
- **LTV in gross profit, not revenue:** $24k/yr × 80% margin × ~4 years retained ≈ $77k.
- **LTV:CAC:** $77k ÷ $20k ≈ 3.8. Most boards want 3 or more.
- **Payback:** monthly gross profit $1,600 means ~12.5 months to earn back $20k. In year one the company really does lose money on each customer, which is fine if cash allows.
- Cheap products ($70/month, $200 CAC) only work on paid channels if judged on lifetime value and the company has cash to wait a few months.

### 1.3 When to judge, scale, hold or fix

| Situation | Rule |
|---|---|
| New ad account or new offer | Spend 7 to 10× the ceiling before judging anything |
| Account with history | 5 to 7× the ceiling |
| Simpler heuristic | Let it spend about what one new customer is worth to acquire; if lead quality looks good, run to double that |
| Two days of data | A mood, not a verdict. Most founders kill the thing that was about to work on day 3 |
| Cost per call within ~30% of target | Scale: raise budget 10 to 30% every 1 to 3 days, only if sales can handle the extra calls |
| Cost jumps after an increase | Hold at that level |
| Not working after enough spend | Walk down the funnel and fix the first number that is off (section 2) |
| Fatigue | Cost per call up and volume down for 3 to 5 days in a row **after** you have scaled. Before that, the ad never worked; it didn't get tired |

---

## 2. Funnel diagnosis

### 2.1 Benchmarks for a demo funnel from paid social

| Step | Benchmark | If this is the first number that's off |
|---|---|---|
| Ad click through rate | ~1.3% | Make new ads |
| Page visitors who apply | ~3% | Landing page, VSL or offer |
| Applicants who book | ~90% | Calendar has no open slots, or booking is a separate page |
| Booked who show | ~70% (60 to 70% with a real follow up system; a third to half without) | Show up system (6.4) |
| Shows who qualify | ~70% | Ads attract the wrong people: fix words, form, offer |
| Qualified who close | ~30% | Sales problem. Leave the ads alone |

Rule: walk down the funnel and fix only the first number that's off. Don't launch new ads to fix a calendar, and don't fire ads for a sales team's mistakes.

### 2.2 The three buttons exercise (find the biggest gap)

List visitors, bookings, show rate, close rate and deal size, with this month next to the best month. Ask which one could realistically double.

Example: 10,000 visitors → 1% book (100) → 40% show (40) → 20% close = 8 customers.

| Button | Change | Customers |
|---|---|---|
| Sales coaching | Close 20% → 22% | ~9 |
| Show rate | 40% → 70% | 14 |
| Booking rate | 100 → 200 bookings | 16 |

Founders press the button they understand (sales) instead of the one furthest from its best. Two points of close rate is noise; half of your best booking rate is a goldmine. Re-run the list after every fix, because a new button appears.

### 2.3 Lead level tracking

Every lead in the CRM gets three answers: Did they confirm? Did they show? Were they actually qualified? Plus closed and revenue. Without these, "forecasting" is guessing, and the AI feedback loop (6.6) has nothing to learn from.

---

## 3. Choose the right funnel and channel

### 3.1 B2B is not B2C

| | B2C (e.g. a $40 skincare product) | B2B SaaS |
|---|---|---|
| Where the ad sends people | Product page, buy in the same visit | Something that starts a conversation: video + application, instant form, deck |
| Who decides | One person | A committee (ops lead, head of marketing, CEO, IT, CFO) |
| What you measure | Same day sales and ROAS | Qualified calls booked; revenue lands days to 90 days later |
| Human speed | Page and emails run alone | Call back form fills in under 5 minutes; 5 hours later they've moved on |
| Filtering | Want every buyer | Qualify on purpose so the wrong people never reach the calendar and Meta learns only from the right ones |

Sales cycle guide: plans under ~$500/month should close in one call or a few days; over ~$10k/month can take up to 90 days.

### 3.2 Funnel by price point

| Price | Funnel |
|---|---|
| Under ~$100/month | Self serve trial or freemium; paid ads only if judged on LTV with cash to wait |
| ~$150/month and up | Meta instant form plus very fast callbacks |
| ~$350/month and up | Video page (VSL) + application + calendar |
| ~$20k/year and up | Webinars start to make sense |
| Cheap first product (low ticket) | Only when the market is huge |
| Free trial with a "buy now" button for a company buyer | Usually a B2C funnel wearing a suit |

### 3.3 When Meta is the wrong bet

1. **Huge deals, tiny market.** ~$300k/yr deals with a few hundred possible buyers: there's nobody left for Meta to find. Go after the named accounts (outreach, events, warm intros), or sell something smaller first (paid pilot, short project) so the first decision is small.
2. **Under $100/month with month one payback expectations.** Judge on lifetime value or don't use paid.
3. **No testing discipline.** Changing targeting Monday, budget Wednesday and the page Friday means nobody knows what worked. Junk leads counted as wins teach Meta to find more junk.

Sweet spot: a few hundred to a few thousand dollars a month, thousands of possible buyers, one change at a time, enough time and money per test, and only wanted leads reported to Meta.

---

## 4. Meta ads operating system

### 4.1 Account structure basics

- Campaign (goal) → ad sets (who and what to optimize for) → ads (what people see). Think company → departments → employees.
- **ABO** puts budget on each ad set: control. Use it to test new ads so they get a fair shot.
- **CBO** puts one budget on the campaign and Meta moves money to what it thinks works: efficiency. Use it to squeeze proven winners. Risks: new ads never get a dollar, and at low conversion volume CBO chases clicks (usually the funniest meme with the worst leads).
- **Under a few hundred dollars a day:** put everything in one ad set; ABO vs CBO barely matters.
- **Default build:** one campaign, broad targeting, 20 to 30 genuinely different ads, at least ~$150/day per ad set. Below that you're running $50 experiments that fail. If you can afford only one ad set at that level, run one.
- **Exception, positioning tests:** each idea gets its own ad set (ABO), ~$50/day per idea for 5 to 7 days, so Meta can't pick a favorite on day one (10.3).

### 4.2 Creative is the targeting (Andromeda)

Meta reads every word, visual and person on screen, then finds people who react to those signals. Detailed targeting is mostly decoration.

- **Pockets:** the market is small pockets (finance leaders, agency owners, HubSpot admins). The words in the ad decide which pocket Meta digs into. When a pocket runs dry, lead quality suddenly shifts; nothing broke.
- **Word check:** read every word and ask: would my buyer say this, or someone who works under them? A founder doesn't say "integrates with HubSpot"; a founder says "my sales team finally updates the pipeline." Adding one feature word can flood you with admins with no budget.
- **Committee map:** list every buyer (CFO: cost; VP Sales: pipeline; CEO: the board; ops lead: no more copying data at midnight). For each, 3 angles: current pain, desired result, the alternative they compare you to (hiring more people, building in house, a spreadsheet). 4 buyers × 3 angles = 12 genuinely different ads.
- **Genuinely different** = different person on screen, different message, different look. The same ad with 12 headlines counts as one ad.
- **Worksheet:** write down the real buyer's problems, situations (closing the books at midnight, board meeting on Friday) and outcomes, then turn them into 25 to 30 different ads.
- **Rotation:** 1 to 3 ads usually take almost all the money. When they slow down, duplicate the ad set, switch off the winners, and let the other ads get a turn; each one is a door into a different pocket.

### 4.3 Feed the algorithm buyer signals

- An ad set needs ~50 conversions a week to exit learning. At 2 a week split across 12 ad sets, Meta is guessing ("Learning Limited"), and a starving algorithm eats whatever it finds.
- If you can't afford 50 of your real event (e.g. $150 per qualified lead × 50 = ~$1,000/day in one ad set), optimize for a cheaper event that still means buyer: a qualified form submit or an opt-in to a strong offer.
- **Conversions API (CAPI):** the pixel lives in the browser, so ad blockers, privacy settings and device switching hide conversions and Meta thinks your ads are failing. Send events from your own systems:
    1. Booking tool (e.g. Calendly) → automation (e.g. Zapier) → Meta "Schedule" event with email, phone and name.
    2. When a rep marks a lead qualified in the CRM (e.g. HubSpot), send that as its own event. Meta then learns from people your sales team called real.
- **Which stage to send:** the earliest signal that still means buyer. With ~3 month sales cycles, closed won is too slow; qualified call is usually the sweet spot. Add closed deals later.
- **Matching:** people book with work email but use personal email on Facebook. Always send phone and the ad click ID. Aim for event match quality of 8+ out of 10.
- **Test it:** book a fake demo yourself and watch the event arrive in Events Manager.
- **Conversion Leads / CRM integration:** your CRM tells Meta what happened to each lead after the form. Requirements per Meta's guidance: roughly 200+ leads a month, data uploaded at least daily, the chosen stage reached within 28 days of the lead, and 3 to 4 weeks to kick in. Under 200 leads, still send qualified demos as an event so Meta builds a picture of your buyer.

### 4.4 Launch checklist (defaults that spend your money elsewhere)

Before publishing, turn off:

- [ ] Creative enhancements (added music, rewritten text, auto crops). Your ad should look exactly as made.
- [ ] Site links, promotions and website highlights (extra links to random pages).
- [ ] Multi advertiser ads (your ad in a row next to competitors).
- [ ] Placements: Audience Network, Messenger, Threads, plus the setting that still lets Meta spend a slice on excluded placements.
- [ ] Account level advertiser settings that can switch enhancements back on over time.
- [ ] Re-check every duplicated ad; enhancements can come back on.
- [ ] URL parameters so each lead in the CRM carries the ad ID.
- [ ] Exclusion audiences: customers and open pipeline.
- [ ] Open the landing page on a phone. Nine out of ten visitors will.

### 4.5 Reading results honestly

Before crowning a "best ad":

1. **Frequency:** if it keeps climbing, Meta is showing it to the same small group.
2. **New vs existing:** break results down; a big chunk often goes to current customers, trial users and open pipeline who were going to book anyway.
3. **View through:** by default Meta counts conversions from people who only saw the ad. Someone books two days later because your rep emailed them, and the ad takes credit.

Fix: optimize on 7 day click, upload customer and pipeline lists and exclude them from cold campaigns, and judge every ad on new qualified pipeline in the CRM. A fake winner hogs budget and gets copied by the team.

### 4.6 Don't force spend; expect few winners

- When Meta stops spending on an ad, it predicts that ad will lose, based on far more than you can see (who saw it, how fast they scrolled, who clicked, how similar people behaved before).
- Forcing equal budgets to "test fairly" pays full price to check its prediction, money not spent finding the next winner.
- Rule of thumb: 1 to 2 real winners per 20 ads. That is how ads work, not a broken account.
- Three rules: launch 10 to 30 genuinely different ads in one ad set; when Meta picks a winner, make more like it (new hooks and formats on the same angle); let ignored ads go. Your job is feeding the account new ideas, not grading every ad.

### 4.7 Scaling and fatigue

- Every ad can absorb a rough amount of money before its audience tires. Spend it in a week and it dies in a week; spread it over a month and it lasts a month.
- Raise budget 10 to 30% every few days, watching cost per call after each increase. Never double overnight.
- Keep testing new ads every week in the background so several proven winners are always ready. With 5 winners, one dying is just a Tuesday.
- **Refresh when fatigued:** make ~30 new ads: 70% close remakes of the winner, 20% same message in a new style, 10% completely new ideas. Duplicate the winning ad set, put the new ads in the copy, turn the tired one off. Never break what works while testing.

### 4.8 Turn one winner into twenty (iteration ladder)

1. Take the winner apart: situation, hook, format, proof, visual. (Example: field service software; "Your tech just drove 40 minutes to a job that got cancelled"; plain static; app screenshot.)
2. Keep the situation, write 5 new hooks ("Paying overtime for a job that never happened?").
3. Put the best hooks in new formats: selfie video, screen share of the fix, a customer saying it.
4. Swap proof and visual: a number, a review, a version that looks like an organic post.
5. Winners move to the scaling campaign with ~80% of budget; ~20% keeps testing new situations.
6. Start iterating the day an ad wins, not the day it dies. Goal: 5 to 10 winners across different situations.

### 4.9 Retarget booked prospects ("hammer them")

The moment someone books, show ads only to them. Put the pixel on the booking confirmation page, build an audience of recent visitors, and run 15 to 20 pieces of content to it so they arrive knowing, trusting and half sold. Tiny audience, cheap.

- Content: short founder videos answering the questions reps hear weekly (how onboarding works, how pricing works, why you beat the spreadsheet), customer stories, plus a few long pieces (webinar, podcast).
- For long cycles, keep it running until they sign or say no. Add assets for the people your contact must convince: a security video for IT, a cost breakdown for the CFO.

### 4.10 Swarm strategy (one campaign, three kinds of ads)

Buyers pass through three moments: feel the pain, learn the fix, choose a vendor. Put all three ad types in one campaign; Meta shows each person the one they're ready for, and the same buyer meets all three over a week.

| Type | For | Examples |
|---|---|---|
| Attention | People who feel the pain | Meme about a rep updating the CRM at 11pm; skit about a board meeting where pipeline looks healthy; a bold offer |
| Teaching | People who know the fix but haven't picked who | Founder at a whiteboard or a Loom breaking down how the problem works. Goal: "this person knows their stuff." Often saved but not booked alone |
| Closing | People ready to buy | Paid pilot with results in writing; you vs hiring two more SDRs; you vs building it in house |

### 4.11 Venus flytrap (for new categories only)

When the market doesn't understand what you sell: run 3 short educational video ads in sequence, each shown only to people who watched most of the previous one.

1. The problem.
2. The new way of solving it (what you sell).
3. How it works in real life, with proof.

Only after video 3 do people see the direct offer (book a call). Fewer people reach the offer, on purpose; leads arrive warm, closer to webinar leads. If buyers already know what you sell, skip this and pitch directly.

---

## 5. Creative playbook

### 5.1 Four rules for SaaS ads

1. **Specific beats vague.** "Streamline your workflows with AI" speaks to everyone, so Meta can't tell who to show it to. Start with the top few percent who already want what you sell: "We help accounting firms with 10 to 50 people close the month in 3 days instead of 10." Companies can pass $1M/yr selling only to that slice; broaden later.
2. **Variety of ideas, not colors.** Like fishing: different lakes, different bait. Customer result, before and after, a belief you prove wrong, a different outcome, a different moment of need.
3. **Show the mechanism in 3 steps.** Technical founders say "huge benefit, book a call" and nobody believes it. Squeeze 40 features into 3 steps: "We connect your systems. We clean your data. You get the report every Monday."
4. **Reasonable claims bring the best buyers.** "Make a million with our HR tool" attracts people who demand the million. "Pay 100 employees worldwide without hidden fees" attracts people who want what you sell. Calls may cost more but close faster and stay.

### 5.2 Five hooks that keep working

| Hook | What it does | Fill in the blank |
|---|---|---|
| Circumstance | Describes their situation so exactly it feels like mind reading | "It's [specific moment], you're still [painful manual task], and [boss] just asked [awkward question]." |
| Real reason | Explains the hidden mechanism first, sells second | "The real reason [problem] takes [time] isn't [obvious blame]. It's [mechanism]." |
| Price tag | States the price up front to filter; use for warm audiences, not cold | "Our software costs [$X/yr]. Here's what you get for it." |
| Receipt | Screen share of real work just delivered | "Just finished setting this up for a [customer type]. Here's the [dashboard/workflow]." |
| Proof drop | One specific, true, provable result | "[Customer] went from [before] to [after] in [time]." |

Run all five; each reaches a different person. Put **different** words on screen than the spoken first line (spoken: "The real reason your close takes 10 days"; on screen: "It's not your team"). Captions repeat; on screen text adds. Two hooks in the same 3 seconds, for muted and sound-on viewers.

### 5.3 Format tier list

| Tier | Formats | Notes |
|---|---|---|
| S | Founder talking to camera; static reels (background footage with bold text that changes every few seconds) | Look native, cheap to make, absorb budget |
| A | Static images, carousels (a sharp tweet thread turned into slides is underused), AI made ads | Cheap and stable; image leads in a demo funnel may know less about you |
| B | Customer testimonials, organic posts run as ads, paid creators | A great captioned customer story can jump to S. Paid creators pretending to love compliance software rarely sound real |
| C | Memes, long webinar or podcast recordings, the expensive brand video | Memes bring curious clicks; long recordings only work cut to the best 2 to 5 minutes |
| F | Anything with no captions and no editing | |

Most ads fail, so the formats you can make fast win over time. Buy the founder a tripod.

### 5.4 Mine buyer language

Run sales call recordings through AI. Pull why people actually bought, the exact words they used, the problems they named and their objections. Those become the next batch of ad angles; buyers end up writing the ads.

---

## 6. Demo funnel blueprint

### 6.1 Six levels, one story

The ad, page, form, nurture and demo must tell the same story. If the ad promises one thing and the rep demos another, the buyer stops trusting both.

1. **Traffic:** static and video ads bringing the right people, not your homepage visitors.
2. **Landing page built for one thing:** headline matching the ad's promise, short video on the problem and how you solve it, one button or a short form on the page. No menu, no blog, no careers link.
3. **Qualification:** a few questions from the same story (company size, industry, problem). Not a fit means no booking. Only qualified leads are reported to Meta.
4. **Booking:** straight onto the calendar with no back and forth emails. The calendar is the last question of the form, not a separate page.
5. **Before the call (where most demos die):** short videos on the confirmation page answering their worries, useful emails, and a call within minutes of booking to confirm and send case studies plus the offer.
6. **Sales and feedback:** track show, qualified, closed and revenue; run recordings through AI for the next ad angles.

### 6.2 The Meta call funnel with two confirmation pages

- Ad: video beats image; 1 to 2 minutes of the founder talking means they arrive knowing your face.
- Page: headline, short video, one button.
- Application: monthly revenue, team size, tools used. If they pick the lowest revenue option, one more question appears: "We start at $5,000. Does that work for you?" No means out.
- **Two identical confirmation pages:** qualified bookers land on one, unqualified on a copy. Same words, same video. The Meta pixel sits only on the qualified page, so Meta learns only from your best leads.
- Partial form fills: you already have name and number; someone calls them.

### 6.3 Form design without starving Meta

- A 9 question form (revenue, team size, budget, timeline, tech stack) can drop you to 7 demos a week. Meta needs ~50 signals, so it jumps between audience groups and lead quality swings every few days.
- At low spend, ask the one question that matters most (often role or industry). Everyone who passes counts as a conversion.
- **Route after that question:** big companies go to a sales rep's calendar; small ones to a free trial or recorded demo. Both count as conversions to Meta. SaaS can do this because people can start on their own; a coaching business can't.
- Add questions back as demo volume grows, then send what happened after the call (pipeline, deals).

### 6.4 Show rate system

Without follow up, only a third to half of booked people show. With a system, 60 to 70%.

- Never book more than ~4 days out.
- Confirmation page: who they're meeting, what they'll get from the call, a short video.
- Two genuinely useful emails a day until the call, a text that sounds like a person, and a quick confirmation call.
- Text the morning of the call with link and time.
- Someone reaches out to every no show.

**Confirmation specialist** (one person whose only job is making booked calls happen; not a setter):

1. Alerted on every booking, calls within 5 minutes.
2. Confirms link, time and calendar entry.
3. Asks a few natural questions about the business and why they booked.
4. Cancels poor fits politely so closers stop wasting afternoons.
5. For fits, acts as an advisor: sends a case study from their industry (a logistics booking gets a logistics case study).
6. Texts the morning of the call; can open a group chat with the closer so the prospect knows the team before the call.

**Secret shop your own funnel every quarter** (personal email and phone, book like a buyer, then skip the call). Typical leaks:

- [ ] Thank you page says only "you're booked": no reason to show, no idea who they're meeting.
- [ ] Confirmation email lands in the promotions tab.
- [ ] Reminder text reads like spam ("Reply C to confirm"); newer iPhones can filter unknown senders into a silent folder.
- [ ] No show gets one automated "sorry we missed you" and no call.

### 6.5 B2B quiz funnel for cold traffic

When short forms bring junk and long forms bring nobody:

- Quiz-style application; collect name, email and phone early (even if they quit, call them).
- 2 to 5 qualifying questions (team size, current tool, when they want to switch). Report only qualified completions to Meta.
- Book a call.
- **Trust gallery** after booking: one page with a 3 minute walkthrough, a customer story from a similar company, and answers to the questions every buyer asks ("Does it work with NetSuite?").
- They arrive having done their research, so the rep talks about a start date instead of explaining the product.

### 6.6 Close the loop

Track confirmed, showed, qualified, closed and revenue per lead. Send qualified and closed stages back to Meta. Feed call recordings to AI for angles. Re-run the three buttons exercise monthly.

---

## 7. Video sales letters (VSL)

A VSL is a sales call where the buyer can't interrupt, so it answers their questions in the order they'd ask them. It does the explaining before the call so reps only close.

### 7.1 B2B VSL in five parts

1. **Summary (first 60 to 90 seconds):** who it's for, the problem, the result, the price or what happens next. Most people stop early; busy decision makers decide fast.
2. **The problem in detail:** what it costs them each month and why the usual fixes (hiring, another tool) don't work.
3. **The new way, with a demo:** your approach, then the product doing the one job the buyer cares most about, start to finish, with realistic data and a clear before and after. Not a feature tour; save the full demo for the call.
4. **Proof:** real customers and results, ideally from companies like the viewer's.
5. **Offer:** exactly what they get, risk taken off (e.g. a pilot), what happens on the call, one clear step.

### 7.2 SaaS VSL in seven levels (demo inside)

1. No logo intro. Cut the 10 second brand opener.
2. Who it's for and who it's not (company size, team size, use case). List chapters on screen so the right people skip ahead.
3. The problem in money: e.g. 6 hours saved per rep per week × 10 reps = 60 hours × $50 = $3,000 every week they don't switch.
4. Demo only the 2 to 3 jobs people buy it for (ask sales what makes prospects lean in). Each demo moment starts with the old way and ends with a result on screen. Nobody buys 40 toggles.
5. The math on screen: what customers pay, what they get back, time to pay back; your own funnel numbers if you have them.
6. Objections your reps hear weekly, in the order they hear them: CRM integration, setup time, data safety, team adoption.
7. Price, said out loud: compare to the alternative (hiring, building in house), then plans, then risk reversal (paid pilot, billing starts after setup), then one button: demo or trial, never both.

### 7.3 Script order for a pitch VSL

What you do, who it's for, what it costs and what happens next (first 90 seconds) → why you (how many companies like theirs you've helped and what happened; not "as seen in Forbes") → why people buy, starting with the most common reason → the offer and price (fewer calls, but every call knows the number) → real objections → who it's for and not for → one call to action.

### 7.4 Page layout

Headline → video with chapters → booking form → case studies → FAQs. Nothing else (no logo wall, feature grid or careers link competing with the video).

### 7.5 Three numbers to read

| Metric | Reading |
|---|---|
| Play rate | Under about half: fix the thumbnail, headline, or a page easier to skim than watch |
| Drop off graph | A cliff in the first 30 seconds = the opener. A cliff where the demo starts = it's a feature tour. A slow steady decline is normal (people leaving to book) |
| Engagement | Watching almost everything but not booking = confused, not hooked. Say it in fewer words |

---

## 8. Free trials and product led conversion

### 8.1 Six level free trial funnel

Every level exists to get people to the aha moment, when the product solves their problem.

1. **Traffic:** ads naming the buyer's exact situation. Cold traffic goes to a dedicated landing page; warm audiences can go straight to signup.
2. **Landing page:** one clear promise, a short video of the product reaching the aha moment, a bit of proof, one "Start free trial" button. No menu, blog or careers link.
3. **Signup:** painless. Google sign-in, as few fields as possible, one question about what they want to get done; the answer decides what they see next. Report **activated** users to Meta, not every signup.
4. **In app onboarding** (where trials are won or lost): a welcome tied to why they signed up, a 3 step checklist to the aha moment with a progress bar, templates or sample data so they never face an empty screen. Optional tour; small tips at the moment of need; get them into their first real workflow fast.
5. **Onboarding emails:** triggered by what they did or didn't do, walking the same 3 steps.
6. **Conversion:** upgrade prompts right after a moment of value, a sequence before the trial ends, sales outreach to high value accounts using the product heavily. Non payers go to a no activity flow, then a win back flow.

### 8.2 Two part onboarding email flow

**Part 1, activation:** map the 3 steps to the aha moment (e.g. scheduling software: connect calendar, add team, send first booking link). About 3 emails per step, ~9 total, each user only gets the ones matching where they are.

- Did step 1 but not step 2 → email about step 2.
- Still stuck → email tying the step back to the pain they signed up to fix, with a short how-to video and a way to get help.
- Completed a step → congratulations plus a push to the next step while momentum lasts.

**Part 2, conversion:** only after all 3 steps. Now send offers, incentives or discounts until they upgrade or the trial ends. Asking for money before they've seen it work is proposing on the first date. Users who never activate go into an after trial flow that brings them back to step 1.

**Email anatomy:** one big clear headline, a progress bar showing where they are, a short video of the current step, a few lines of text for non watchers, one button. One email, one job. Long letters about your mission or roadmap don't get read.

Reported result from the source: about +8.5% trial conversion, with some emails converting at ~21%.

### 8.3 Consumer and prosumer SaaS

**Web quiz funnel (instead of sending ad traffic to a homepage):**

- Questions that personalize (name, goal, a spending habit), with value screens slipped between them (a stat about people like them, a short user story).
- The last screen is their result ("Your plan to save for a house is ready"); they enter email to see it.
- Paywall: lead with the daily price next to the monthly price; one tap Apple Pay or Google Pay; show intro pricing clearly (e.g. $29 first month, then $59). If ads cost about $29 per buyer, month one pays for the ad.
- Never hide the price; hidden prices become chargebacks and processors shut down accounts for it.

**App paywall in four moments:**

1. **Before they see a price:** onboarding is the sales page (RevenueCat reports ~82% of trial starts happen on install day). Ask their goal, give a quick win, then show the paywall with their goal in the headline. Show it again when they hit a locked feature. Show how the trial works (full access today, reminder 2 days before charging); Blinkist reported a 23% lift from this.
2. **How much to lock:** RevenueCat data: hard paywalls convert ~10.7% of downloads vs ~2% for freemium, with similar yearly retention after a year. Lock it if people find you by name; let them try first if they're browsing.
3. **When they close the paywall:** show a different offer, not just a cheaper one (lead with yearly first, then show monthly), or ask why they're leaving and respond to the answer. Don't discount every exit.
4. **Abandoned payment sheet:** they were one tap from paying. Catch them with a follow up offer. Paywall tools (e.g. Superwall) let you change all four without an app update.

---

## 9. Lifecycle email and retention

Ecommerce brands make a large share of revenue (often cited around 40%) from email to customers they already paid for; SaaS is far behind. Plug the bucket before doubling ad spend.

### 9.1 System rules

- Map flows to every stage: welcome and onboarding, conversion, churn risk (no logins, dropping activity, cancel page visits), cancellation, win back. A welcome email plus a newsletter is not a system.
- Trigger on what users did, not just when they signed up. Don't send the welcome flow before they can use the product (e.g. unverified email); once they can, send within ~15 minutes.
- Split by behavior and plan: used feature A but not B gets the feature B email; everyone else doesn't.
- Content: one job per email (move them to the next stage), their pain in their words, proof from customers like them, one clear button, a headline that hooks. Simple plain emails often beat designed ones.
- Testing: monthly A/B tests with a clear goal (e.g. more trial users paying), only trusting results with enough data. Track past the click, give each flow a goal, and reconcile with billing data, not just the email tool.

### 9.2 Churn math

Losing ~6% of customers a month means roughly half are gone within a year. Hope and a quarterly "we miss you" email are not strategies.

### 9.3 Three churn prevention flows

1. **No login flow:** find the longest normal gap between logins for an active user and double it; past that, trigger. Remind them of results they were getting, show what similar customers are winning now, and answer the excuse keeping them away (e.g. "doesn't work in my industry" gets a customer story from their industry).
2. **Low usage flow:** map which features create results, how often they need to be used, and which work best together. When someone drifts off that path (skips a key feature, uses it too rarely, leans on one thing), send the email that fixes that exact gap.
3. **Cancellation page flow:** three visits to the cancel page in a week means they're writing the breakup text. Never say "we saw you on the cancel page." Send a friendly "answers to common questions" email addressing the top 3 cancellation reasons.

### 9.4 Cancellation and win back

1. On cancel: one email with a short feedback form. Why did you cancel? What frustrated you? Would anything have changed your mind? Would you stay for a discount or more time?
2. Same time: thank you email with a real incentive (discount or free month) and one reactivate button.
3. Next day: what they lose by leaving, with a clear path back.
4. If they don't return: win back flow ~90 days later.
5. If they return: send them through onboarding again; otherwise you're booking their next cancellation.

**Dead lead revival, the 9 word email:** plain text, sent from a real person, no logo, images or links; subject line is just their first name. One question about the problem they came with, not your offer: "Are you still looking to fill your sales calendar?" Send to no shows, stalled deals, unsigned proposals and "maybe next quarter" leads, after a few months of silence. "No" cleans the list; many reply "yes, actually" or explain what changed. Reply like a human (what's changed, what have you tried, would a quick call help), never with a deck.

### 9.5 Promotions and discount framing

- **Rule of 100** (Jonah Berger, Wharton): under $100, a percent sounds bigger; over $100, the dollar amount sounds bigger. 30% off a $3,000 plan reads like every coupon; $900 off sounds like money.
- **Credit beats discount:** "We've added $900 to your account; it applies the day you upgrade." Same cost, but a credit feels like something they already own and would lose. It also keeps list price intact, so procurement doesn't expect 30% off at every renewal.
- Precedents: Google Cloud gives new customers a $300 credit; Slack's fair billing policy turns inactive seats into account credit rather than refunds.
- Churned list: "We put a credit on your account, and your workspace is exactly how you left it," not "come back for 30% off."
- Under $100/month plans: test percent, or give time ("two months free" is a credit in months).
- Only use real credits and real deadlines.

### 9.6 Ecommerce note (for SaaS with a store)

Add to cart abandonment and started checkout abandonment are different flows. Cart abandoners may need convincing (reviews, benefits, objections, shipping info); checkout abandoners may already be sold (distracted, shipping surprise). Follow up over several days; save discounts for later emails.

---

## 10. Offer, positioning and pricing

### 10.1 The offer pyramid

From bottom (easy to change, small impact) to top (hard to change, big impact): budget → campaign setup → ads → offer → brand and product. Most teams tweak budgets and headlines because it's easy, while the offer above quietly kills everything. "Book a call" is a next step, not an offer.

### 10.2 Offer builder

An offer is everything the buyer gets and why they should say yes now. Build it from these parts:

1. **Positioning:** the problem, who it's for, why now. "Marketing services for businesses" is nothing; "We fill your sales calendar with qualified calls in 60 days" is an offer.
2. **The result in plain words:** "Every invoice chased automatically," not "AI powered workflows."
3. **Timeframe:** "Live in 7 days." If they can't picture when, they wait.
4. **Price structure:** same money, different decisions: big annual upfront vs paid pilot vs monthly vs setup fee plus smaller monthly.
5. **Extra value:** things worth a lot to them that cost you little (done for you setup, onboarding, training, templates).
6. **Risk reversal:** pay per result (Intercom's Fin AI agent charges $0.99 per resolution; no resolution, no charge), billing that starts at go live, or money back if an agreed number isn't hit. Only what you can stand behind.
7. **Small first step:** a paid pilot, a setup call, one team first, not a 12 month contract on call one.

Why this matters now: code is cheap. Y Combinator said about a quarter of its Winter 2025 batch had codebases ~95% written by AI. A competitor can copy the feature in weeks; copying a pay-per-result deal requires confidence their product works and willingness to eat the cost when it doesn't. Features are how you deliver the result, not why anyone picks you.

### 10.3 Positioning

**Pick your shelf.** Positioning is what you get compared to, not your slogan. Liquid Death sold plain water in a tall can like beer, in bars and tattoo shops; it was compared to bar drinks, not other water, and was valued at $1.4B by 2024.

The "so what?" ladder: "We record your sales calls." So what? "Managers don't have to sit in." So what? "They can see why deals stall." So what? "They know why every lost deal was lost." Now you're compared to a sales consultant or a manager listening all week, a far more expensive shelf, not to cheap call recorders. Run each shelf as a different ad and listen on demos; when the right one hits, prospects repeat it back ("I need to know why we're losing deals," not "how much is it?").

**Let the market vote** (before an $80k website rebuild):

1. Write down every positioning and offer version being debated (free pipeline audit, competitor benchmark, paid pilot, "built for RevOps" vs "replaces three tools").
2. For each: a selfie video and a static ad with that headline, plus a basic landing page with the same headline, a few lines and a form. Ugly is fine.
3. One campaign, each idea its own ad set with its own budget (ABO), ~$50/day per idea for 5 to 7 days.
4. Judge cost per lead **and** lead quality in the CRM. A cheap lead who is a student is the most expensive lead you'll buy.
5. The winner goes on the website, ads, deck and sales calls.

### 10.4 High ticket on top of a cheap plan

At $99/month with 10% trial conversion, $500 ad cost per customer and ~20% monthly churn, customers must stay ~5 months before profit, and most don't. The ones who leave never got results, so they never become case studies.

Add a $5k to $10k upfront offer sold on a call: you set them up, train the team and get them to the result in weeks (speed, not a prepaid year). Example: 20 booked calls → 16 show → 14 qualified → close a quarter (3 to 4) × $7,000 ≈ $20,000 cash in month one. Then they roll into the normal subscription and stay longer because they already got results. Keep the cheap plan; the high ticket offer funds the ads, creates real case studies, and makes the cheap plan cheaper to acquire.

### 10.5 Low ticket to high ticket

Strangers don't hand $10,000 to someone they met this morning. Sell a small offer first, upgrade the best buyers.

1. **The cheap offer:** one small piece of the main offer, so buyers are already ideal clients. Don't price too low; $7 to $30 attracts people who never buy bigger (a steakhouse selling $7 hot dogs sells few $70 steaks).
2. **Order bump:** a checkbox on the order form (e.g. a template pack for ~$20). Plenty say yes.
3. **Upsells:** right after purchase, 3 to 4 offers that make the first purchase work better, ~$100 to $300 each. Only 5 to 20% take them, often enough to cover ad spend.
4. **Fast win:** make it quick to use with a result in days. Build fixes for whatever stops people using it into the product.
5. **The upgrade:** track who opened it, used it and got a result. Setters reach out as accountability coaches, not salespeople; after a win, a call about the main offer is the obvious next step.

### 10.6 Done for you tier (software margins, service prices)

Y Combinator has been asking for full stack AI companies that do the work for customers. You don't have to choose: keep the software, add the service on top.

- **Examples:** ListKit sells self serve software (~$600/month) and a done for you service from ~$18,000/quarter that builds lists, writes emails, runs campaigns and cold calling, using its own product; the customer never logs in. Smartlead (plans from $39/month) added a pricing tab with no price, only "Book a strategy call."
- **Why buyers pay ~10× more:** they compare it to hiring, not to software. ListKit cites in house costs of $12,000+/month. Companies spend roughly $1 trillion a year on sales and marketing salaries vs ~$35B for the largest sales software company; that's the gap.
- **Margins:** your product does most of the work and one person checks what used to take five.
- **Who should do it:** customers clearly want the result but hate doing the work; they'd happily pay someone to use your product for them.
- **Page:** keep self serve plans, add one tab leading with the result (what gets done, who does it, how fast it starts) and one button to a call.
- **Pricing call:** don't pitch software. Ask what it costs them today to get this result (salaries, tools, time), then quote below that number. Now you're the cheap option.

### 10.7 Selling AI agents

Normal software helps a person do the job; agents do the job, so they're paid from the people budget (much bigger), and the buyer is the boss (CEO, CFO, COO), not the person whose work is replaced, who often pushes back.

- **Who sees the ad:** the boss.
- **What it says:** money, not hours. "You pay three people to process invoices, around $200,000 a year. Our agent does the same work for a fraction." Frame as growth without hiring, not firing: "Handle twice the invoices with the team you already have."
- **What the demo shows:** the job getting done. 50 real invoices, the agent handling them, and the one odd invoice it routes to a person to check. That answers "can I trust it with our money?"

---

## 11. Organic and webinar funnels

### 11.1 Organic content funnel (slowest, strongest leads)

1. **Content:** teaches the buyer something useful about the exact problem you solve. Short videos to be discovered, longer pieces to build trust. Not the office dog or your opinion on crypto.
2. **Capture:** every post has a next step: comment a word for a free guide, DM, or book via bio link. Likes don't pay bills; conversations do.
3. **Follow up:** deliver what you promised, then keep adding value in DMs. Not pitching yet; becoming the obvious person to call.
4. **Retarget:** everyone who watched, saved, visited your profile, DMed or visited your site can be shown ads for up to a year. Mix more content with your offer.
5. **Speed:** put spend behind your best performing posts so strangers see them. Organic is the engine; paid is the nitrous.

### 11.2 Webinar funnel

1. **Ads:** promote 3 to 4 days before, not a week ahead; the further out people register, the fewer show.
2. **Registration page:** clear headline, short video, form.
3. **Show up system (where webinars die):** after registering, a page of short trust videos; emails packed with real value, not "don't forget"; texts the morning of and at start; someone answering replies (half can't find the link); setters calling registrants ("do you have the link? anything you want covered?"). On cold traffic, 30%+ show rate is strong.
4. **The webinar:** straight into value, no 10 minute wait. Teach what to do and why, not every step of how; people stuck following tutorials don't buy. Answer the questions everyone in the room is thinking.
5. **Numbers:** track attendance when you pitch vs peak attendance, separately.
6. **Follow up:** setters reach out to everyone who didn't book. Much of the return comes from here; don't judge the webinar too early.

---

## 12. Scaling infrastructure and enterprise proof

- **Before every budget jump, launch or big webinar, load test the real funnel.** A site tested by one person can slow under thousands of visitors; each extra second of load time loses people before they see the headline, and the form or booking widget (the step that talks to your servers and calendar tool) usually chokes first. Use a browser based load testing tool that clicks through the page, fills the form and books like a real person, and shows which step slows down and when.
- **Enterprise deals:** "Probably" is the most expensive word in enterprise sales. When IT asks whether you can handle 2,000 people logging in at 9am Monday, test three things: the Monday morning login rush, the heaviest page (usually dashboards or reports), and the actions people actually take (upload, search, save). Fix what breaks, then send IT the results. A load test is a sales asset that can unfreeze a deal.

---

## Appendix: templates

**Onboarding email (one per step):**

Subject: [Step name] takes 2 minutes
Headline: Step 2 of 3: [action] so you can [result they signed up for]
[Progress bar: step 2 of 3]
[Short video: how to do it]
3 lines of text for people who won't watch.
[One button: Do step 2]
Need help? Reply to this email.

**Cancellation page flow email:**

Subject: Answers to a few common questions
Three short Q&As addressing your top 3 cancellation reasons, a customer example for each, and a reply-to-talk line. Never mention that they visited the cancel page.

**Credit offer (annual plan over $100):**

Subject: [First name], $[amount] is waiting in your account
We've added a $[amount] credit to your account. It applies the day you upgrade to annual, until [real deadline].

**Confirmation call outline (within 5 minutes of booking):**

1. Confirm time, link and that it's in their calendar.
2. "What made you book today?" plus 2 to 3 questions about their business.
3. Not a fit: cancel kindly and point to a better resource.
4. Fit: promise a relevant case study and send it immediately.
5. Morning of the call: text with link and time.

**Intake summary table to produce for any audit:**

| Metric | This month | Best month | Benchmark | Gap |
|---|---|---|---|---|
| CTR | | | ~1.3% | |
| Visitor to application | | | ~3% | |
| Application to booking | | | ~90% | |
| Show | | | ~70% | |
| Qualified | | | ~70% | |
| Close | | | ~30% | |
| Cost per booked call | | | Ceiling: | |

---

## Caveats

- These rules are distilled from a B2B SaaS growth creator's short-form content (about 45 distinct lessons from 70 reels, Apr to Oct 2026). Benchmarks, case results (e.g. +8.5% trial conversion, 21% email conversion) and third party stats (RevenueCat, Blinkist, YC, ListKit, Intercom pricing) are the creator's claims and were not independently verified. Check current figures before quoting them to clients or investors.
- Meta changes defaults, placements and optimization options often. Verify setting names in Ads Manager before giving click-by-click instructions.
- Replace benchmarks with the company's own measured rates as soon as there's enough data, and recompute the ceiling whenever price, margin or funnel rates change.
- The source creator promoted specific tools (e.g. a load testing product); recommend tools on fit, not because they were named.
