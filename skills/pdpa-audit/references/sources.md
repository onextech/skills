# Source register

Every rule this skill applies traces to one of the documents below. Cite the paragraph, not the document. If a rule cannot be traced to a row here, it is not a PDPA rule and must be labelled `> **Outside the corpus:**`.

All rows verified against pdpc.gov.sg and sso.agc.gov.sg on **21 August 2026**.

---

## 1. The three rules that govern how you read this table

### 1.1 Filenames are not evidence of edition. The cover page is.

PDPC **replaces PDFs in place at the same URL** without changing the filename or the slug.

The proof case: the Advisory Guidelines on Key Concepts in the PDPA are served from a URL containing `...-17-may-2022.pdf`. The PDF at that URL is the **29 April 2026** revision. Its cover page reads `Issued 23 September 2013 / Revised 29 April 2026`, and **all 164 page headers** read `ADVISORY GUIDELINES ON KEY CONCEPTS IN THE PDPA (Revised 29 April 2026)`. Anything downstream that treats "Key Concepts" as the 2022 edition is working from a wrong assumption.

Only three documents in this corpus stamp the revision date into every page header (Key Concepts, DNC Provisions, Introduction to the Guidelines). For the rest, **the cover page is the single point of evidence** — if PDPC swapped the file and updated only the cover, nothing in the body would contradict it. Treat "consistent" for those as *nothing internally contradicts the cover*, not *independently corroborated*.

### 1.2 A document can be simultaneously "current" and wrong.

"Current" means only that no newer edition exists. It does not mean the document states the law correctly.

The **Advisory Guidelines for the Real Estate Agency Sector (16 May 2014)** are the clearest case. They are current — PDPC has never reissued them — and they **predate the 2020 PDPA amendments** (in force 1 February 2021) which introduced:

- the mandatory Data Breach Notification Obligation (Part 6A of the Act),
- deemed consent by contractual necessity and deemed consent by notification,
- the legitimate interests exception, and
- the business improvement exception.

**Consequence: do not rely on the Real Estate guidelines for breach notification, consent, consent exceptions, or transfer rules.** Those parts are superseded by the Act itself regardless of whether the PDF was ever reissued. Its **sector-specific worked examples** — showroom guestbooks, co-broking disclosure, the two-years-later re-engagement call, the salesperson-as-data-intermediary test — remain the only real-estate illustrations PDPC has published and are still useful. Cite them for facts, not for law.

Two further documents are current-but-caveated:

- **Selected Topics (23 May 2024)** is current but incomplete. It has no AI chapter, and the absence is not a gap in PDPC's guidance — it is a gap in any corpus that stops at Selected Topics (see 1.3).
- **NRIC Advisory Guidelines / Technical Guide** are current but **self-declared pending**. Both PDFs open with a banner stating they "will be updated" following the MDDI statement of 13 Dec 2024, and no reissue has happened. The banner, not the 2018/2019 body text, is the operative position on authentication.

### 1.3 PDPC ships new advisories rather than revising old ones. Enumerate the full listing.

Checking whether *held* documents changed will systematically miss new instruments.

Worked example: Selected Topics was reviewed in May 2024 with no AI chapter. A currency check restricted to held documents would conclude "no AI guidance exists". In fact PDPC had issued the **AI Recommendation and Decision Systems advisory on 1 Mar 2024** and issued the **Generative AI advisory on 20 Jul 2026**. Only enumerating the complete listing surfaced them.

**Therefore the currency procedure is: enumerate the listing, diff against the register, then open every candidate's cover page.** See §4.

### 1.4 The statute governs over the guidelines.

Introduction to the Guidelines, para 3.1, verbatim:

> "The Guidelines are **advisory in nature and do not constitute legal advice. They are not legally binding** on the Commission or any other party. Direct reference should be made to the PDPA and other legislation for the complete and definitive statement of the provisions of any such legislation… **The provisions of the PDPA and any regulations or rules issued thereunder will prevail over the Guidelines in the event of any inconsistency.**"

And para 3.2:

> "The Commission reserves the right to change its policies and to amend, update, delete, and/or supplement any of the information in the Guidelines **at any time** in its sole and absolute discretion."

Two operational consequences:

1. Where an audit finding turns on a **precise statutory test** (an Eighth Schedule exclusion, a Schedule of prescribed data categories, a penalty ceiling), verify it on Singapore Statutes Online rather than relying on a guideline's paraphrase.
2. **⚠️ OPEN ITEM — Act 19 of 2025.** The SSO timeline for the PDPA 2012 shows the Act was **amended by Act 19 of 2025, in force 5 December 2025**. We did **not** determine what that amendment changed. The Eighth Schedule itself carries only the annotation `[22/2016; 40/2020]`, so that Schedule was not touched — but every other provision is unverified against it. Every guideline in this corpus except the Generative AI advisory (20 Jul 2026) and Key Concepts (29 Apr 2026) predates it. **Before asserting anything about a provision Act 19 of 2025 may have touched, check `https://sso.agc.gov.sg/Act/PDPA2012` directly.**

---

## 2. The register

### 2.1 Advisory guidelines and guides (held and read)

| # | Document | Cover-page date **as printed** | URL | Currency verdict |
|---|---|---|---|---|
| 1 | Advisory Guidelines on Key Concepts in the PDPA | `Issued 23 September 2013 / Revised 29 April 2026` | https://www.pdpc.gov.sg/assets/34058be5-ae13-4c40-89e6-1c945d19f65c | ✅ **Current.** Newest general guidance in the set. Served at a `...-17-may-2022.pdf` URL — **the filename is wrong, the cover is right.** Corroborated by 164 page headers. |
| 2 | Key Concepts **Annex A** — Framework for the Collection, Use and Disclosure of Personal Data | `1 February 2021` | published as a standalone PDF | ⚠️ Current, but **5 years older than the body it annexes**. |
| 3 | Key Concepts **Annex B** — Assessment Checklist for Deemed Consent by Notification | `1 February 2021` | published as a standalone PDF | ⚠️ Same. Listed in the Key Concepts TOC but **absent from the Key Concepts PDF**. |
| 4 | Key Concepts **Annex C** — Assessment Checklist for Legitimate Interests Exception | `1 February 2021` | published as a standalone PDF | ⚠️ Same. |
| 5 | Advisory Guidelines on the PDPA for Selected Topics | `Issued 24 September 2013 / Revised 23 May 2024` | https://www.pdpc.gov.sg/assets/d1fbaa47-1471-4208-bfad-9f4bf33453ad | ✅ Current — **but has no AI chapter.** AI guidance lives in rows 9 and 10. |
| 6 | Advisory Guidelines on the Do Not Call Provisions | `Issued 26 December 2013 / Revised 1 February 2021` | https://www.pdpc.gov.sg/assets/8440dd4d-973b-4b1b-bbb9-2c42c5dec81b | ✅ **Current**, strongly corroborated (57 page headers read `(revised 1 February 2021)`). |
| 7 | Guide on Managing and Notifying Data Breaches under the PDPA | `Revised on 15 March 2021` | https://www.pdpc.gov.sg/assets/1faa5d75-f3b2-485a-bfc4-85394c0079df | ✅ **Current.** The live PDF is **byte-identical (382,879 bytes)** to the held copy. Replaces "Guide to Managing Data Breaches 2.0". |
| 8 | Advisory Guidelines for the Real Estate Agency Sector | `16 MAY 2014` | https://www.pdpc.gov.sg/-/media/Files/PDPC/PDF-Files/Sector-Specific-Advisory/real-estate.pdf | ⚠️ **Current but pre-2020 — see §1.2.** Detail page on the new site has an **empty body**; the PDF survives only on the legacy `-/media` path. Fragile link. |
| 9 | Advisory Guidelines on Use of Personal Data in Generative AI | `Issued 20 July 2026` | https://www.pdpc.gov.sg/assets/143cb9d4-532e-4cca-9a77-bcc0415ca294 | ✅ **Current.** Newest item in PDPC's regulatory-guidance listing. 18 pages. |
| 10 | Advisory Guidelines on use of Personal Data in AI Recommendation and Decision Systems | `Issued 1 Mar 2024` | https://www.pdpc.gov.sg/assets/f97f8ecc-3ced-4406-a36f-4783505d64f7 | ✅ Current, unchanged since issue. 21 pages. Read **in conjunction with** row 9 (GenAI advisory ¶1.4). |
| 11 | Advisory Guidelines on Enforcement of the Data Protection Provisions | `Issued 21 April 2016 / Revised 1 February 2021 / Revised 1 October 2022` | https://www.pdpc.gov.sg/assets/95a3adea-1b5d-474f-b683-6f0a4b65bca5 | ✅ **Current — and the only authoritative source for penalty ceilings.** The listing shows `20 Apr 2016`; **the cover says 21 April 2016 — trust the cover.** |
| 12 | Advisory Guidelines on the PDPA for NRIC and other National Identification Numbers | MDDI banner, then `Issued 31 August 2018`. **No "Revised" line.** | https://www.pdpc.gov.sg/assets/cc9c647a-465f-4fbb-8bc2-5efa0bbe7ed2 | ⚠️ Current, **self-declared pending update** (Dec 2024 banner). Confirmed not reissued; no open consultation (the only NRIC consultation on the site is from 07 Nov 2017). |
| 13 | Technical Guide to Advisory Guidelines … for NRIC and other National Identification Numbers | **No printed issue or revision date anywhere in 28 pages.** Only date: `Copyright 2019 – Personal Data Protection Commission Singapore (PDPC)`. PDF metadata CreationDate `Dec 15 2024`. **PDPC's live listing dates it `14 Dec 2024`.** | https://www.pdpc.gov.sg/assets/79d1f1f4-4fc4-467e-8cdd-488ff3f92a7b | ⚠️ Current in substance; **date discrepancy**. Record it as **"14 Dec 2024 (re-stamped 2019 guide)"**, not "26 Aug 2019". |
| 14 | Introduction to the Guidelines | `Revised 20 October 2023` | pdpc.gov.sg | ✅ Current. **4 pages** — §1 Introduction, §2 Overview, §3 Disclaimers. Contains **no index of guidelines and no revision dates**; do not treat it as a currency source. |

### 2.2 Statute, regulations and instruments (authoritative over everything above)

| Instrument | Version / status | URL | Notes |
|---|---|---|---|
| **Personal Data Protection Act 2012** | `Current version as at 21 Aug 2026`; SSO footer `Last updated 20 Aug 2026` | https://sso.agc.gov.sg/Act/PDPA2012 | **⚠️ Amended by Act 19 of 2025, in force 5 December 2025 — scope of that amendment NOT determined. Open item.** |
| PDPA **Eighth Schedule** (made under s 37(5)) — "Exclusion from meaning of 'specified message'" | Amendment annotation `[22/2016; 40/2020]` — **not touched by Act 19 of 2025** | https://sso.agc.gov.sg/Act/PDPA2012?ProvIds=Sc8- | Quoted verbatim in `marketing-dnc.md`. |
| Personal Data Protection Regulations 2021 | **NOT HELD** | — | Referenced repeatedly by Key Concepts (opt-out/assessment retention, access-request timeframes, Part 3 = cross-border transfer conditions, Part 4A = consent defences). Verify Part 3 directly for any transfer finding. |
| Personal Data Protection (Notification of Data Breaches) Regulations 2021 | **NOT HELD** | — | Contains the **Schedule of prescribed personal data** for the significant-harm limb. Key Concepts ¶¶20.15–20.16 reproduces it; `breach.md` quotes that reproduction. **Verify against the Regulations for any live notification decision.** |
| Personal Data Protection (Exemption from Section 43) Order, S.817/2013 | **NOT HELD; and superseded in framing** | — | The 2014 Real Estate guidelines use this framing. The 2021 DNC guidelines never mention it (zero occurrences of "Exemption", "S.817", "817/2013"). **Cite the Eighth Schedule, not the Exemption Order.** See `marketing-dnc.md`. |

### 2.3 Pages, not documents — do not go looking for a PDF

| Item | Date shown | URL | What it actually is |
|---|---|---|---|
| **Guide to Cross-Border Data Transfers** | `Published on 14 Apr 2026 / Last updated 14 Apr 2026` | https://www.pdpc.gov.sg/organisations/resources/guidance-by-topic/guide-to-cross-border-data-transfers | **A navigation hub page. There is no guide PDF.** Three scroll sections; defers to **PDP Regulations 2021 Part 3** and **Key Concepts Ch. 19** as the actual authorities. Links the ASEAN MCCs and sample clauses. |
| Meeting the Transfer Limitation Obligation (TLO) — decision flowchart | linked from the 14 Apr 2026 hub page | https://www.pdpc.gov.sg/assets/3c79b265-7f1b-458a-9ff5-a94c343a5df5 | A 5-question flowchart, reproduced in `ai-and-transfers.md`. |
| Media release: *Amendments to Enforcement under the PDPA* | `Published on 30 Sep 2022` | https://www.pdpc.gov.sg/media-events/amendments-to-enforcement-under-the-personal-data-protection-act-in-updated-advisory-guidelines-and-guide | Rendered page body is **empty**; the text lives in the RSC payload. Confirms the enhanced penalty ceiling **took effect 1 October 2022**. |
| *Organisations to cease the use of NRIC numbers for authentication by 31 December 2026* | live page | https://www.pdpc.gov.sg/media-events/organisations-to-cease-the-use-of-nric-numbers-for-authentication-by-31-december-2026 | Converts the NRIC cover-banner advice into a **dated compliance deadline**. See `nric.md`. |

### 2.4 Referenced but not held — do not invent their contents

| Item | Where it is referenced | Status |
|---|---|---|
| MDDI statement, **13 Dec 2024** | quoted on the cover of both NRIC PDFs | **NOT HELD.** Only the cover banner's quotation of it is available. |
| PDPC statement, **14 Dec 2024** | quoted on the cover of both NRIC PDFs | **NOT HELD.** Same. |
| *Guide to Securing Personal Data in Electronic Medium* | NRIC Technical Guide p.19 (Section 8, secure deletion of backups); Technical Guide p.27 | **NOT HELD.** The technical detail on encryption/access control/logging is deliberately delegated here. |
| *Guide to Basic Anonymisation* | Generative AI advisory ¶5.1 fn 14 | **NOT HELD.** |
| IMDA *Model AI Governance Framework for Agentic AI* | Generative AI advisory ¶9.5 | **NOT HELD.** Not a PDPC instrument. |
| ASEAN Model Contractual Clauses (MCCs) + the joint guides to EU SCCs and RIPD MCCs | Key Concepts ¶19.10; the cross-border hub page | **NOT HELD.** Encouraged by the Commission, not mandated. |

---

## 3. Where the corpus disagrees with itself

Record these; do not silently harmonise them.

| Tension | Resolution |
|---|---|
| **Penalty ceiling.** Key Concepts ¶21.14(e) (revised 29 Apr 2026) still says "up to $1 million (or **in due course**, up to $1 million or 10% of the organisation's annual turnover in Singapore, whichever is higher)". The Enforcement AG ¶27.1 (revised 1 Oct 2022) states the higher-of formula as **operative**, and the 30 Sep 2022 media release confirms commencement on **1 October 2022**. | **Cite Enforcement AG ¶27.1 + fn 53 + ¶27.3. NEVER cite Key Concepts ¶21.14(e).** ¶21.14(e) is stale drafting carried forward — a full-text search of Key Concepts for `turnover`, `10% of` and `in due course` hits **exactly one place**, that paragraph. If a generated report contains the words "in due course", that is a bug. |
| **Annex vintage.** Annexes B and C are dated 1 Feb 2021; the body they belong to is dated 29 Apr 2026. | **Where the two disagree, the body governs.** Flag the divergence; do not merge. |
| **Ongoing-relationship carve-out.** Real Estate §5.3(b)/§5.4 frames it as the *Exemption from Section 43 Order* (an exemption from a duty, limited to **fax and text**). DNC (2021) frames it as **Eighth Schedule para 1(e)** — an **exclusion from the definition** of "specified message", with no channel restriction. | **Use the Eighth Schedule framing.** Confirmed against the statute. Treat RE §5.13 as sector-specific *application examples* only. |
| **Partial NRIC wording.** AG 5.2 says "**up to** the last 3 numerical digits and checksum"; TG p.13/p.23 says "the last 3 digits + last alphabet". | Same worked example (`567A` from `S1234567A`), so the same characters. The AG's "up to" is looser. **Where they differ in strictness, the AG governs** — the Technical Guide is subordinate by its own title. |
| **NRIC hashing.** TG p.23 states hashed NRICs "cannot be converted back to actual NRIC numbers", unqualified. | Quote it, then attach the engineering caveat **explicitly labelled as originating outside the PDPC corpus**. See `nric.md`. Never present the caveat as PDPC's position; never omit the quote. |
| **Real Estate vs the amended Act.** RE §3.1–§3.3, §3.7, §4.1–§4.4 and every consent worked example reflect the **pre-2020 consent framework**; RE §4.1 relies on s 19 (transitional, keyed to 2 July 2014). | Tag any such citation `[2014 — CONSENT FRAMEWORK MAY BE SUPERSEDED]`. Do not use them as a statement of current consent law. |

---

## 4. How to re-verify — the procedure

**Record the cover-page date, the asset UUID, and the retrieval date. Never the filename.** §1.1 proves the filename is unreliable.

### 4.1 Enumerate the listing (do not scrape the HTML)

The regulatory-guidance index is JavaScript-rendered and returns `Loading . . .`. Its data source is a plain JSON API:

```
# 42 regulatory-guidance items (advisory guidelines, sector-specific, practical guidance)
https://www.pdpc.gov.sg/api/listing-api?listingtype=regulatory_guidance&itemsperpage=200&slug=organisations/regulations-decisions/regulatory-guidance&pathname=/organisations/regulations-decisions/regulatory-guidance&sort=latest&page=1

# 80 guidance-by-topic items (guides, publications, templates, tools)
https://www.pdpc.gov.sg/api/listing-api?listingtype=guidance_by_topic&itemsperpage=300&slug=organisations/resources/guidance-by-topic&pathname=/organisations/resources/guidance-by-topic&sort=latest&page=1

# 189 media-events items (announcements, commencement notices)
https://www.pdpc.gov.sg/api/listing-api?listingtype=media_events&itemsperpage=400&slug=media-events&pathname=/media-events&sort=latest&page=1
```

### 4.2 Fetch and read the cover of every candidate

Four traps, all encountered:

1. **Listing dates are ISSUE dates, not revision dates.** Always open the PDF and read the cover.
2. **`/assets/<uuid>` URLs return HTTP 403 without a browser User-Agent.** Send one, plus `Referer: https://www.pdpc.gov.sg/`. Assets have **no `.pdf` extension**.
3. **Some detail pages render an empty body** after PDPC's Next.js re-platform (Real Estate sector guidelines, the data-breach guide, the 1 Oct 2022 media release). The text is still in the RSC payload — grep the raw HTML for `self.__next_f.push` / `"content":`.
4. Legacy `-/media/Files/PDPC/PDF-Files/...` paths still serve some documents the new site lost. Working today; fragile.

### 4.3 Diff against this register

For each listing item: is it in §2? If **not**, it is a new instrument — obtain and read it before relying on any conclusion in its subject area (§1.3). For each item **in** §2: does its cover date match the register? If not, the document was replaced in place.

### 4.4 Check the statute for anything load-bearing

`https://sso.agc.gov.sg/Act/PDPA2012` — read the **"Current version as at"** banner and the amendment annotations on the specific provision. Resolve the Act 19 of 2025 open item (§1.4) before asserting anything about a provision it may have touched.

### 4.5 Record the verification

Per document, store: **title · cover-page date as printed · asset UUID (or legacy path) · retrieval date · verifier**. Pin that record into whatever compliance artefact the audit feeds. Re-run on a schedule — Introduction ¶3.2 reserves PDPC's right to change the guidance "at any time", and this corpus already drifts unevenly (one document twelve years old, another one month old, two self-declared pending).

---

## 5. One-line currency summary

| Document | Verdict |
|---|---|
| Key Concepts | **Current** (29 Apr 2026) — served at a 2022 filename; content is newest in the set |
| Key Concepts Annexes A/B/C | **Current** (1 Feb 2021) — 5 years older than the body; body governs on conflict |
| Selected Topics | **Current** (23 May 2024) — no AI chapter; AI guidance lives elsewhere |
| DNC Provisions | **Current** (1 Feb 2021) |
| Data Breach Guide | **Current** (15 Mar 2021) — byte-identical to the live copy |
| Real Estate Agency Sector | **Current** (16 May 2014) — **pre-2020 amendments; examples only, not law** |
| Generative AI advisory | **Current** (20 Jul 2026) |
| AI Recommendation & Decision Systems | **Current** (1 Mar 2024) |
| Enforcement of the Data Protection Provisions | **Current** (rev. 1 Oct 2022) — **the penalty authority** |
| NRIC Advisory Guidelines | **Current** (31 Aug 2018 + Dec 2024 banner) — self-declared pending |
| NRIC Technical Guide | **Current** — PDPC now dates it **14 Dec 2024**, not 2019 |
| Introduction to the Guidelines | **Current** (20 Oct 2023) — 4 pages, no index |
| PDPA 2012 (SSO) | **Current as at 21 Aug 2026** — ⚠️ **Act 19 of 2025 (i.f. 5 Dec 2025) scope UNVERIFIED** |
| Data Portability commencement | ⚠️ Legislated, **not in force** (checked Aug 2026) — see `obligations.md` |
