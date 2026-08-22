# The data protection obligations

Paragraph numbers are the guidelines' own. `s 21(1)` style references are PDPA sections the paragraph interprets. Unless prefixed otherwise, `¶` means **Key Concepts (Revised 29 April 2026)**.

The ten obligations, per Key Concepts ¶10.2: Consent (ss 13–17); Purpose Limitation (s 18); Notification (s 20); Access & Correction (ss 21, 22, 22A); Accuracy (s 23); Protection (s 24); Retention Limitation (s 25); Transfer Limitation (s 26); Data Breach Notification (ss 26A–26E); Accountability (ss 11 and 12).

---

## Who owes these obligations

Read this before applying any section below — it decides *whose* finding a defect is.

**"Organisation" is defined broadly** (¶6.1, s 2(1)): "any individual, company, association or body of persons, corporate or unincorporated whether or not formed or recognised under the law of Singapore; or resident, or having an office or a place of business, in Singapore".

**Excluded categories** (¶6.5): an individual acting in a personal or domestic capacity; an employee acting in the course of employment; a public agency. But ¶6.12:

> "Notwithstanding this exclusion for employees, organisations remain primarily responsible for the actions of the employees (including volunteers) which result in a contravention of the Data Protection Provisions."

Selected Topics ¶6.29 puts it harder:

> "any act done or conduct engaged in by an employee in the course of his employment shall be treated as done or engaged in by his employer, **whether or not it was done or engaged in with the employer's knowledge or approval**."

### The data-intermediary partial exclusion requires a WRITTEN contract — ¶6.16

> "The PDPA provides that a data intermediary that processes personal data on behalf of and for the purposes of another organisation **pursuant to a contract which is evidenced or made in writing** will only be subject to the Data Protection Provisions relating to (a) protection of personal data…; (b) retention of personal data…; and (c) notifying the organisation of data breaches…, and not any of the other Data Protection Provisions."

No written contract → **no partial exclusion**. The vendor carries *all* obligations, and you have a contracting gap. The controller keeps full liability regardless (¶6.20, s 4(3)):

> "Section 4(3) provides that an organisation has the same obligations under the PDPA in respect of personal data processed on its behalf by a data intermediary as if the personal data were processed by the organisation itself."

### The exclusion evaporates on scope creep — ¶6.25

> "It is important to note that if B uses or discloses personal data in a manner which goes beyond the processing required by A under the contract, then B will not be considered a data intermediary in respect of such use or disclosure. Since B has exercised its own judgement in determining the purpose and manner of such use and disclosure, **B will be required to comply with all Data Protection Provisions.**"

A vendor that reuses your data for **model training, its own product analytics, or resale** has stepped outside data-intermediary status. It becomes a full organisation in its own right, and your handing it the data becomes a consent-requiring disclosure rather than processing-on-your-behalf.

Related: the DI label need not appear in the contract (¶6.24); one processor can serve two controllers (¶6.26); the controller is liable for data that never reaches it (¶6.27 — "Organisation A is responsible for the personal data collected, used and disclosed by B regardless of whether such personal data was actually transmitted to A"); an entity can be a DI for one dataset and a controller for another (¶6.29).

**Agents get no special treatment** (¶6.33): "there is no difference in how an agent or any other organisation is treated under the PDPA in relation to whether they qualify as a data intermediary." Whether someone is an "agent" turns on whether they act on behalf of another in a matter, not on their job title (¶6.32).

**Sector application — Real Estate.** RE §3.10: salespersons who are not employees "may instead be considered separate organisations". RE §3.14: whether a salesperson is a data intermediary "depends largely on the working arrangements". RE §3.17 (the sharp one, and an architectural finding — see `marketing-dnc.md`): an agent who builds a prospect profile *for his own use* falls outside the shield entirely.

**What to check in code:** a vendor/processor register enumerating every third party that touches personal data (hosting, DB, email/SMS/WhatsApp senders, object storage, analytics, AI gateway *and* each underlying model provider, PDF/report generators, e-signature, geocoding, scrapers, APM). Per row: (a) is there a **written** contract — not click-through consumer ToS; (b) does the vendor process only to the documented scope, or does its default tier permit training/analytics on your data; (c) processing regions. Separately: per-agent access scoping and audit logging of employee-initiated exports/disclosures, because ¶6.12 makes agent misuse an org-level failure.

---

## Consent

**The rule** (¶12.1, s 13): an organisation may collect, use or disclose personal data if the individual consents. ¶12.2: the obligation does not apply where the activity "is required or authorised under the PDPA or any other written law."

**Consent has two limbs — notice AND agreement** (¶12.3, s 14(1)):

> "Section 14(1) of the PDPA states how an individual gives consent under the PDPA. An individual has not given consent unless the individual has been notified of the purposes for which his personal data will be collected, used or disclosed **and** the individual has provided his consent for those purposes. If an organisation fails to do so, any consent obtained from the individual would be invalid."

**What to check in code:** a `consent` boolean with no accompanying purpose, notice/policy version, or `notice_shown_at` timestamp is a ¶12.3 failure by construction. The consent row must bind *which purposes* and *which notice text version* the individual saw.

### Form of consent

- **Express** (¶12.4) — written or "recorded in a manner that is accessible".
- **Verbal** (¶12.5) — good practice is to confirm in writing or make a written note of the fact.
- **Implied from conduct** (¶12.6) — may be inferred from circumstances.
- **Specified messages to Singapore telephone numbers — verbal is NOT enough** (¶12.7):

> "Organisations that wish to rely on the individual's consent to send specified messages to Singapore telephone numbers should ensure that the individual has given clear and unambiguous consent beforehand. Consent for the sending of specified messages to Singapore telephone numbers should be evidenced in written or other accessible form. **For this purpose, verbal consent alone would be insufficient.**"

Consent given by a proxy is valid (¶12.8, s 14(4)) but ¶12.9 requires the **proxy** to have been notified of the purposes too.

**What to check in code:** for any SMS/WhatsApp/voice campaign to an SG number, a stored, retrievable written-form consent artefact per recipient. A call note saying "client agreed" fails ¶12.7. For "agent added client on behalf of" flows, evidence the proxy saw the purposes.

### When consent is NOT valid — s 14(2), s 14(3)

¶12.10: an organisation "must not, as a condition of providing the product or service, require the individual to consent to the collection, use or disclosure of his personal data beyond what is reasonable to provide the product or service", and must not obtain consent "by providing false or misleading information or using deceptive or misleading practices." ¶12.11: such consent "is not valid."

**What counts as a deceptive practice** (¶12.17):

> "Such practices may include situations where the purposes are stated in vague or inaccurate terms, in an illegible font or placed in an obscure area of a document or a location that is difficult to access."

**The bundled-consent worked example (p.41), verbatim:**

> "even if Sarah consents to the disclosure of her data to third party marketing agencies, the consent would not be considered valid since it is beyond what is reasonable for the provision of the spa's services to its customers, and the spa had required Sarah's consent as a condition for providing its services. Instead of requiring Sarah to consent … **the spa should separately request Sarah's consent** to do so. That is, Sarah should be able to sign up for the spa package without having to consent to the disclosure and sale of her personal data to third parties."

Lawful conditioning does exist (¶12.15, ¶12.16, and the telecom counter-example at p.42): data "reasonably required in order to provide the product or service" may be a condition. ¶12.14 (good practice): mark which form fields are compulsory and which optional.

**What to check in code:** every sign-up/onboarding form for a **single** "I agree to the Terms and Privacy Policy" checkbox that silently carries marketing or third-party-sharing consent. Concretely — separate columns per purpose (`consent_service`, `consent_marketing`, `consent_third_party_share`) rather than one flag; a registration path that **succeeds with the optional ones false**; no pre-checked optional boxes. Then audit the notice presentation for ¶12.17 tells: purposes buried behind a link, low-contrast or small text, or a catch-all like "valid business purposes".

### Deemed consent — three kinds (¶12.18, ss 15 and 15A)

¶12.19: where an individual consents (or is deemed to consent) to disclosure by A to B for a purpose, the individual is deemed to consent to **collection by B** for that purpose.

**(a) By conduct** (¶12.20, s 15(1)):

> "Deemed consent by conduct applies to situations where the individual voluntarily provides his personal data to the organisation. The purposes are limited to those that are **objectively obvious and reasonably appropriate from the surrounding circumstances**."

The taxi worked example (p.43) draws the boundary: Tina gives her number to book a taxi and is deemed to consent to being contacted about *that taxi*. "**But:** if the taxi operator runs a limousine service and wants to use Tina's information to market this service to her, Tina would not be deemed to have consented … This is because Tina is providing her personal data for booking a taxi for a single trip, and not for receiving marketing information about the limousine service."

**What to check in code:** the direct analogue is a property enquiry. A viewing-request form gives deemed consent to be contacted about *that viewing*, not to be enrolled into a newsletter, a launch-outreach list, or another agent's pipeline. Trace the enquiry-ingestion code path: does it also insert into any broadcast/segment table?

**(b) By contractual necessity** (¶12.22, s 15(3)) — covers A→B and B→C where the disclosure "is reasonably necessary to fulfil the contract between the individual and A". Correct basis for payment processors, delivery/logistics and fulfilment sub-processors.

**What to check in code:** does the same disclosure path also push to parties outside the fulfilment chain — analytics vendors, marketing partners, affiliated companies? Those fall outside s 15(3).

**(c) By notification** (¶12.23, s 15A) — three mandatory conditions:

1. **Assessment** (¶12.23(a), s 15A(4)(a)) — a prior assessment "to determine that the proposed collection, use or disclosure of personal data is not likely to have an adverse effect on the individual", taking into account the notification method and opt-out period, and identifying mitigations.
2. **Adequate notification** (¶12.23(b), s 15A(4)(b)) — reasonable steps to bring to the individual's attention: the intention; the purpose; and "a reasonable period within which, and a reasonable manner by which, an individual can opt out".
3. **Opt-out period must lapse first** (¶12.23(c)):

> "The organisation must provide a reasonable period for the individual to opt out before it proceeds to collect, use or disclose the personal data. **Consent … is deemed to be given only after the opt-out period has lapsed. Any collection, use or disclosure of personal data for the purposes that have been notified should commence only after the expiry of the opt-out period.** Deemed consent by notification should not be relied on where individuals would not have a reasonable opportunity and period to opt out (e.g. security monitoring of premises using video cameras). The Commission does not prescribe a specific opt-out period…"

The assessment must be **retained** for the whole processing period (¶12.25, PDP Regulations 2021) and produced to the Commission on request; it need not be given to individuals.

Worked opt-out periods actually accepted: **10 days** (hotel sharing with a travel website, p.47) and **14 days** (bank voiceprint authentication, p.48). The negative case (event sensors, p.49): an association could **not** rely on venue notices for facial-image capture "as it would not be able to provide a reasonable period for them to opt out".

**Hard bar: never for direct marketing** (¶12.27, per PDP Regulations 2021). ¶12.28:

> "Organisations should generally obtain express consent for the purpose of sending direct marketing messages to individuals. Such consent should be obtained through the **opt-in** method (e.g. requiring action to check an unchecked box in order to give consent); the Commission does not consider the opt-out method (e.g. providing a pre-checked box…) as appropriate…"

**What to check in code:** four artefacts, all pointable-at — (1) a dated written adverse-effect assessment, retained as long as the processing runs; (2) the notification actually sent, per individual, with timestamp and channel; (3) a stored opt-out deadline; (4) an **enforcement gate so the new processing cannot start before that deadline**. The classic smell is a migration or backfill that flips a feature on for all users the same day the announcement email goes out.

### Personal data from third-party sources — the due-diligence artefact

¶12.32: an organisation collecting from a third-party source "is required to notify the source of the purposes". ¶12.33 requires due diligence that the source could validly give, or had obtained, consent. **¶12.34 gives the four acceptable forms:**

> "a) Seek an undertaking from B through a term of contract between A and B that the disclosure to A for A's purposes is within the scope of the consent given by the individual to B;
> b) Obtain confirmation in writing from B;
> c) Obtain, and document in an appropriate form, verbal confirmation from B; or
> d) Obtain a copy of the document(s) containing or evidencing the consent given by the individuals' concerned to B to disclose the personal data."

**What to check in code:** any referral, lead-purchase, partner-feed or scraped-source ingestion needs a per-batch or per-record artefact matching one of those four. In schema terms a `consent_evidence` / `source_assurance` column recording *which* form was obtained and when — not just `source = 'referral'`. The Sarah/Jane example (p.53) also makes it good practice to tell the referred person, **on first contact**, who disclosed their data: check the first-touch message template.

### Withdrawal of consent — s 16

**The right** (¶12.38): individuals "may at any time withdraw any consent given or deemed to have been given".

**The four statutory requirements** (¶12.39): reasonable notice from the individual (s 16(1)); the organisation must inform the individual of the likely consequences (s 16(2)); the organisation must not prohibit withdrawal (s 16(3)); and on withdrawal the organisation "must cease (and cause its data intermediaries and agents to cease) collecting, using or disclosing the personal data" unless otherwise required or authorised by law (s 16(4)).

**Ten business days is the benchmark** (¶12.41):

> "as a general rule of thumb, the Commission would consider a withdrawal notice of at least ten (10) business days from the day the organisation receives the withdrawal notice, to be reasonable."

**¶12.42(c) — per-purpose withdrawal is mandatory:**

> "distinguish between purposes necessary and optional to the provision of the products/services (that may include the service of the existing business relationship). **Individuals must be allowed to withdraw consent for optional purposes without concurrently withdrawing consent for the necessary purposes.**"

**A single global consent flag fails by construction.** If withdrawing marketing force-cancels the account, or if the only way to stop marketing is account deletion, that is a direct ¶12.42(c) defect.

**Scope of an unsubscribe is set by its own wording** (¶12.47–¶12.48):

> "In cases where an organisation provides a facility for individuals to withdraw consent (e.g. by clicking on an 'unsubscribe' link within an e-mail), the organisation should clearly indicate the scope of such withdrawal." (¶12.47)

> "Typically, where the withdrawal notice for marketing contains a general withdrawal message, i.e. it is not clear as to the channel of receiving marketing messages for which consent is withdrawn, the Commission will consider any withdrawal of consent for marketing sent via a particular channel to only apply to all messages relating to the withdrawal sent via that channel." (¶12.48)

The compliant pattern (the Joan example, p.57): name the channel in the link text *and* on the confirmation page, and point elsewhere for other channels.

**¶12.50 — the consequences notice must actually fire:**

> "Once an organisation has received from an individual a notice to withdraw consent, the organisation should inform the individual concerned of the likely consequences of withdrawing his consent, **even if these consequences are set out somewhere else, e.g. in the service contract.**"

**¶12.52 — withdrawal must fan out to processors and agents:**

> "Upon receipt of a notice of withdrawal of consent, the organisation must cease to collect, use or disclose the individual's personal data, and **inform its data intermediaries and agents about the withdrawal and ensure that they cease** collecting, using or disclosing the personal data for the various purposes."

But **not** further (¶12.53): an organisation "is not required to inform other organisations to which it has disclosed an individual's personal data". The individual approaches those directly — which is exactly why the Access Obligation's disclosure history matters.

**¶12.54 — withdrawal is NOT deletion:**

> "Although an individual may withdraw consent for the collection, use, or disclosure of his personal data, the PDPA does not require an organisation to delete or destroy the individual's personal data upon request. Organisations may retain personal data in their documents and records in accordance with the Data Protection Provisions."

**What to check in code:**
- A **per-purpose** withdrawal mechanism, not one flag (¶12.42(c)).
- An actual **fan-out code path** at every data intermediary: the email/SMS/WhatsApp provider's audience list, the CRM sync, the analytics tool, cached exports, the vector store. A DB flag with no downstream propagation is the failure mode (¶12.52).
- A confirmation email/dialog that states the consequences **on receipt**, not a policy page (¶12.50).
- The actual unsubscribe link text and confirmation-page copy — they are legally operative (¶12.47–12.48).
- That withdrawal is **not** implemented as a hard delete (¶12.54) — and conversely that "we may retain it" is not being used as cover for continued processing.
- A 10-business-day SLA to test the pipeline against (¶12.41).

### Exceptions to consent — s 17, First and Second Schedules

¶12.55: the exceptions "do not affect rights or obligations arising under any other law."

#### Legitimate interests — First Schedule Part 3 para 1

**Three mandatory requirements** (¶12.57):

> "a) **Identify and articulate the legitimate interests**…
> b) **Conduct an assessment**… to (i) identify any adverse effect that the proposed collection, use or disclosure is likely to have on the individual; and (ii) identify and implement reasonable measures to eliminate, reduce the likelihood of or mitigate the adverse effect… Where it is assessed that there is likely residual adverse effect to the individual after implementing the measures, organisations are required to conduct a **balancing test**…
> c) **Disclose reliance on the legitimate interests exception**… organisations … must take reasonable steps to provide the individual with reasonable access to information that they are relying on the exception."

**Mandatory public disclosure + named contact** (¶12.60, ¶12.61): organisations "**must** make it known to individuals that they are relying on this exception", e.g. in the public data protection policy — and "must also provide the business contact information of a person who is able to address individuals' queries about the organisations' reliance", through **external-facing** channels. Assessments themselves need not be published.

**Retention of the assessment** (¶12.62): "the organisation must retain a copy of its assessment throughout the period that the organisation collects, uses or discloses personal data based on the legitimate interests exception."

**Qualifying examples** (¶12.63): "detecting or preventing illegal activities (e.g. fraud, money laundering) or threats to physical safety and security, IT and network security; preventing misuse of services; and carrying out other necessary corporate due diligence." Footnote 15 extends this to consolidating official watch lists.

**Hard bar: never for direct marketing** (¶12.59).

**What to check in code:** three greppable artefacts per reliance — (1) a retained, dated written assessment **including the balancing test**; (2) a **published** statement in the live public privacy policy naming the exception and the purpose; (3) external-facing DPO/query contact details. Natural candidates in a property platform: AML/fraud screening, duplicate-account and misuse detection, watch-list consolidation, security logging, DLP on company devices. Each needs its own assessment, not one blanket document. The DLP worked example (p.66) also requires notice in the **employee handbook**, not only the privacy policy.

#### Business improvement — First Schedule Part 5 / Second Schedule Part 2 Div 2

**Scope is USE only, of data already lawfully collected** (¶12.71). The four purposes:

> "a) Improving, enhancing or developing new goods or services;
> b) Improving, enhancing or developing new methods or processes for business operations in relation to the organisations' goods and services;
> c) Learning or understanding behaviour and preferences of individuals (including groups of individuals segmented by profile); or
> d) Identifying goods or services that may be suitable for individuals (including groups of individuals segmented by profile) or personalising or customising any such goods or services for individuals."

**Two conditions for own-use** (¶12.72):

> "a) The business improvement purpose cannot reasonably be achieved without using the personal data in an individually identifiable form; and
> b) The organisation's use of personal data for the business improvement purpose is one that a reasonable person would consider appropriate in the circumstances."

**Intra-group sharing** (¶12.73–¶12.76) narrows (c) and (d) to **existing or prospective customers** and adds a third condition (¶12.76(c)): the organisations must be "bound by any contract or other agreement or binding corporate rules requiring the recipient(s) … to implement and maintain appropriate safeguards". The supermarket/seafood-restaurant example (p.72) makes the overlap filter a code-level requirement: "**The supermarket should not disclose the shopping propensity of all its customers without first doing the check on overlaps of customers between itself and the seafood restaurant.**"

**Hard bar: never for direct marketing** (¶12.77) — but preparatory analytics **are** covered (¶12.79):

> "organisations may rely on the business improvement exception to use existing customers' personal data for **data analytics and market research to derive insights and understand their existing customers prior to their business marketing activities**. The Commission considers these to be **preparatory activities for marketing purposes** and are to be distinguished from the sending of direct marketing messages to individuals."

**What to check in code:** for every analytics/ML pipeline, whether it could run on anonymised or aggregated input — the wearables example (p.72) and the healthcare→insurer **negative** example (p.73) both turn on exactly that. For cross-entity flows inside a group: a documented necessity finding, a **customer-overlap filter in the query**, and a contract/BCR imposing safeguards. Note the observed absence: ¶¶12.71–12.79 impose **no** explicit duty to retain or publish an assessment for this exception (unlike ¶12.25 and ¶12.62) — record that as observed, not as permission to skip the analysis.

#### Research — Second Schedule

**Conditions for use** (¶12.80): "a) The research purpose cannot reasonably be accomplished unless the personal data is provided in an individually identifiable form; b) There is a clear public benefit…; **c) The results of the research will not be used to make any decision that affects the individual;** and d) … publish the results in the form that does not identify the individual." Disclosure adds impracticability of seeking consent (¶12.81–12.83); "mere inconvenience … would not amount to 'impracticability'" (¶12.83).

**What to check in code:** condition (c) rules out most product analytics. Anything that scores, ranks, matches, prioritises or prices an individual cannot use the research exception — the correct basis is business improvement or consent. If a document claims "research" for a shipped feature, that is a finding.

#### Publicly available data — First Schedule Part 2 para 1

Definition (¶12.84, s 2(1)); "generally available to the public" means "any member of the public could obtain or access the data with few or no restrictions" (¶12.85). A login-gated or invite-only source fails that test (¶12.86, the Bob profile example).

**The time-of-collection rule** (¶12.88):

> "**so long as the personal data in question was publicly available at the point of collection**, organisations will be able to use and disclose personal data without consent under the corresponding exceptions, notwithstanding that the personal data may no longer be publicly available at the point in time when it is used or disclosed."

Private spaces inside public spaces are excluded (¶12.93 — a booked restaurant room, the interior of a hired taxi): those "may not" attract the exception and typically need notification and consent.

**What to check in code:** for every scraper or public-data ingestion (property portals, agent directories, social profiles, registries) a `collected_at` + `source_url` + `public_at_collection` triple, captured at ingest. That triple is what keeps later use lawful after the source goes private.

### Adverse-effect assessment methodology — shared by deemed-consent-by-notification and legitimate interests

¶12.64: assessments are **required** for both routes.

**"Adverse effect"** (¶12.65) generally includes "any physical harm, harassment, serious alarm or distress"; not all differential treatment counts (differential pricing, higher premiums for pre-existing conditions, loan refusal on poor credit are given as things that may **not** be adverse effect).

**Mitigations the Commission names** (¶12.66):

> "Examples of reasonable measures and safeguards include **minimising the amount of personal data collected, encrypting or immediate deletion of personal data after use, functional separation, access controls, and other technical or organisational measures**…"

**The fork at the residual-effect stage — ¶12.67. This is the single most important operational distinction in the chapter:**

> "Where it is assessed that there are likely **residual adverse** effects to the individual after implementing the measures, **organisations will not be able to rely on deemed consent by notification** to collect, use or disclose personal data for the purpose. Whereas for the legitimate interests exception, organisations are required to conduct a **balancing test** as an additional step… **Organisations may rely on the legitimate interests exception if the legitimate interests outweigh any likely residual adverse effect** to the individual."

**The five assessment factors** (¶12.69): (a) severity **and** likelihood of adverse effect, across "all reasonably foreseeable risks"; (b) nature/sensitivity of the data and whether the individuals are **vulnerable** — "minors, individuals with physical or mental disabilities, or other special needs"; (c) extent of collection and how the data is processed and protected — "**Organisations shall ensure that they do not collect, use or disclose more personal data than is reasonably necessary in order to achieve the purpose**"; (d) reasonableness and proportionality of the purpose, especially for secondary purposes; (e) whether resulting predictions or decisions are "likely to result in **unfair discrimination**, physical harm, harassment, alarm or distress".

Joint assessments by disclosing and receiving organisations are permitted (¶12.68).

**What to check in code:** ¶12.66 names the mitigations an auditor can look for directly — data minimisation (does the query select more columns than the purpose needs?), encryption at rest, deletion immediately after use, **functional separation** (is the analytics/ML store separated from the operational store?), and access controls. ¶12.69(b) makes **minors** an escalation factor — check whether any flow can capture under-18 data (a co-occupant, a beneficiary, a DOB field). ¶12.69(e) makes automated decision-making an assessment factor — relevant to any scoring, ranking, pricing or eligibility logic.

### Assessment checklists — Annex B and Annex C

Both annexes are dated **1 February 2021** and are published as standalone PDFs, not inside the Key Concepts document. Where they disagree with the 29 April 2026 body, **the body governs**.

Both say the *form* is optional but the *four areas* are not, and both require justifications:

> "It is not mandatory for organisations to use this checklist… The assessment should minimally cover the 4 main areas of (1) purpose, (2) [notification/reasonableness], (3) assess any likely adverse effect on the individual, and (4) the final decision outcome."

> "**Justifications should be provided for each answer**, with an evaluation documented in the decision outcome."

**A stored assessment record holding only Y/N values with no free-text justification does not satisfy this.** Look for a justification field per item, not a boolean.

#### Annex B — Assessment Checklist for Deemed Consent by Notification (1 Feb 2021)

Five-step flow: (1) define context/purpose → (2) assess appropriateness of notification and reasonableness of opt-out period/approach → (3) assess likely adverse effect → (4) assess residual adverse effects → (5) decision outcome.

| Step | # | Item | Guidance printed on the form |
|---|---|---|---|
| 1 | 1 | What is the purpose? | *"Note: deemed consent by notification cannot be relied on for sending direct marketing messages."* |
| 1 | 2 | Types of personal data collected, used and/or disclosed | |
| 1 | 3 | How the personal data will be collected, used and/or disclosed | |
| 1 | 4 | Objectives of the collection/use/disclosure | |
| 1 | 5 | One-off or continuous basis | *[If continuous, please state occurrence.]* |
| 2 | 6 | How are individuals notified of the purpose? | *"By default, organisations should consider employing direct forms of notification to minimise the risk that individuals do not see the notification."* |
| 2 | 7 | What is the opt-out period? | *"…consider the purpose for which and the manner in which the organisation intends to collect, use or disclose the personal data, and whether it is time-sensitive. This may also depend on the communications channels and the opt-out method used."* |
| 2 | 8 | Are the mode and period for opt-out reasonable? (Y/N) | *"Please justify. Organisations should consider whether individuals are likely to have seen the notification."* |
| 3 | 9 | Is the personal data of a sensitive nature? | |
| 3 | 10 | How extensive is the collection? | *"factoring in both the volume of data collected and number of types of data fields collected"* |
| 3 | 11 | How reasonable is the purpose? | |
| 3 | 12 | Reasonably foreseeable adverse effects | *"(e.g., financial, social, physical, psychological effect)"* |
| 3 | 13 | Will you use other information from other datasets to make predictions or decisions? (Y/N) | *"describe the datasets used for merger and whether the individual is aware that you are in possession of the dataset"* |
| 3 | 14 | Will the predictions or decisions *"exclude, discriminate against, defame, or harm the individual?"* (Y/N) | |
| 3 | 15 | Likelihood and severity of impact | *"relative to prevailing social norms. Refer to paragraph 12.69 of the main Advisory Guidelines for a list of considerations."* |
| 3 | 16 | How did you provide details of a contact who can give the individual more details? | |
| 3 | 17 | Mitigating measures available? (Y/N) | |
| 4 | 18 | Likely residual adverse effects after mitigation | |
| 5 | **19** | **Can you rely on deemed consent by notification for this purpose? (Y/N)** | *"**Organisations should only proceed if there is no residual adverse effect** arising from relying on deemed consent by notification."* |
| 5 | 20 | Any further actions to be taken? (Y/N) | |
| 5 | 21 | Outcome date | |
| — | 22–24 | Completed by · Endorsed by · Agreed by | *"In line with the Accountability principle, the assessment should be reviewed by the appropriate members of management with sufficient authority."* |

**Item 19 is absolute, not a balance: any residual adverse effect kills this basis.** A system relying on deemed consent by notification despite a recorded residual effect is a clear defect.

Note: **no fixed opt-out duration is prescribed anywhere in Annex B.** Do not assert a number.

#### Annex C — Assessment Checklist for Legitimate Interests Exception (1 Feb 2021)

> "'Legitimate interests' generally refer to any interests of the organisation or any third party."

> "Organisations should document their assessments justifying their reliance on the legitimate interests exception."

> "If an organisation is required by PDPC to provide justification of its reliance on the legitimate interests exception, the outcome of this checklist may be provided to PDPC as a documentation of its assessment."

**The balancing test is not arithmetic — quote this whenever a scoring rubric appears:**

> "the **balancing test should not be a mere count** of whether the number of responses in the affirmative in Step 2 exceed that in Step 3. Justifications should be provided for each response, with an evaluation documented in the balancing test leading to whether the organisation may rely on the legitimate interests exception."

Five-step flow: (1) define context/purpose → (2) identify expected benefits → (3) assess likely adverse effect → (4) assess residual adverse effects → (5) balancing test.

| Step | # | Item | Guidance printed on the form |
|---|---|---|---|
| 1 | 1 | Purpose of relying on the exception | *"Describe the legitimate interests of the organisation or another person and explain what are the objectives"* |
| 1 | 2 | Types of personal data involved | |
| 1 | 3 | How the data will be collected, used, disclosed | |
| 1 | 4 | One-off or continuous | *[If continuous, state occurrence]* |
| 2 | 5 | How does the legitimate interest benefit the organisation or another person? | *"This should focus on direct benefits… This may also include negative impact on organisation/individuals/groups of individuals if the legitimate interests cannot be carried out."* |
| 2 | 6 | Who does this benefit? | *"Beneficiaries may include the wider public or segment of the public or organisation such as customers, employees, sector or industries of the economy."* |
| 3 | 7 | Is the personal data of a sensitive nature? | |
| 3 | 8 | How extensive is the collection? | |
| 3 | 9 | How reasonable is the purpose? | |
| 3 | 10 | Reasonably foreseeable adverse effects | |
| 3 | 11 | Dataset merging for predictions/decisions (Y/N) | |
| 3 | 12 | Will the predictions or decisions exclude/discriminate against/defame/harm the individual? (Y/N) | |
| 3 | 13 | Likelihood and severity of impact | *cites paragraph 12.69 of the main guidelines* |
| 3 | 14 | Contact details provided for more information | |
| 3 | 15 | Mitigating measures available? (Y/N) | |
| 4 | 16 | Likely residual adverse effects after mitigation | |
| 5 | **17** | ***"Do the identified legitimate interests outweigh the residual adverse effects?"*** (Y/N) | *[explain and justify]* |
| 5 | 18 | *"Can you rely on the legitimate interests exception to collect, use and/or disclose personal data for this purpose?"* (Y/N) | *[explain and justify]* |
| 5 | 19 | Any further actions to be taken? (Y/N) | |
| — | 20–23 | Outcome date · Completed by · Endorsed by · Agreed by | *"In line with the Accountability principle, the assessment should be reviewed by the appropriate members of management with sufficient authority."* |

#### The distinction to teach

| | Annex B item 19 — deemed consent by notification | Annex C item 17 — legitimate interests |
|---|---|---|
| Decision rule | Proceed **only if there is no residual adverse effect** | Proceed if the legitimate interests **outweigh** the residual adverse effects |
| Nature | Absolute bar | **Balancing** test |
| Corresponding body text | ¶12.67 | ¶12.67 |

This matches the ¶12.67 fork exactly: **where residual adverse effect remains, deemed consent by notification is dead and only legitimate interests can carry the processing.**

Both annexes require **named human sign-off at three levels** (completed / endorsed / agreed) with management review. An assessment stored as a row with no accountable person named fails the Accountability principle the annexes invoke.

Direct marketing is barred from deemed consent by notification on the face of Annex B item 1. Annex C prints no equivalent note — but per body text ¶12.59 legitimate interests cannot carry direct marketing either. **Rely on the body text for that, not on the annex's silence.**

Neither annex prescribes **any** duration — not the opt-out period, not assessment retention, not review frequency. Do not invent one; the retention duty comes from ¶12.25 / ¶12.62 and the PDP Regulations 2021.

**What to check in code:** an assessment record (table, doc, or repo file) per reliance, containing all four areas, a free-text justification per item, a residual-effect field, a decision, and three named sign-offs. For deemed consent by notification specifically, a stored opt-out deadline and a gate that blocks the processing until it lapses. Any automated pass/fail that reduces the Annex C balancing test to a weighted tally is non-compliant on its face.

### The three independent bars on direct marketing

Three separate paragraphs independently bar the three main non-consent routes from carrying a marketing send:

| Route | Bar |
|---|---|
| Deemed consent by notification | **¶12.27** — "The Personal Data Protection Regulations 2021 prescribes that deemed consent by notification does not apply to the purpose of sending **direct marketing messages**." |
| Legitimate interests | **¶12.59** — "Organisations **cannot rely on the legitimate interests exception to send direct marketing messages**. In general, organisations must obtain express consent… In addition, where direct marketing messages are sent to Singapore telephone numbers via voice call, text or fax, the organisation must comply with the Do Not Call Provisions of the PDPA." |
| Business improvement | **¶12.77** — identical wording to ¶12.59, substituting "business improvement exception". |

Restated jointly at ¶12.78: "**organisations cannot rely on the exceptions for legitimate interests or business improvement for the purpose of sending direct marketing messages.**"

The only permitted adjacent activity is **preparatory** analytics under ¶12.79. Direct marketing needs express **opt-in** consent (¶12.28), evidenced in written or other accessible form for Singapore telephone numbers (¶12.7), **plus** the DNC gate (see `marketing-dnc.md`).

**What to check in code:** draw the line in the codebase between the **segmentation/insight job** (permitted under business improvement) and the **send job** (requires express opt-in consent + a DNC check). If one pipeline does both, there is no enforceable boundary. Confirm the marketing-consent column is written only by an explicitly-unchecked-by-default control.

---

## Purpose Limitation

**The rule** (¶13.1, s 18): an organisation may collect, use or disclose personal data only for purposes:

> "a) that a reasonable person would consider appropriate in the circumstances; and
> b) where applicable, that the individual has been informed of by the organisation (pursuant to the Notification Obligation)."

¶13.3: the objective is "to ensure that organisations collect, use and disclose personal data that are **relevant** for the purposes, and only for purposes that are reasonable."

**The reasonable-person test applied** (¶13.4): "a purpose that is in violation of a law or which would be harmful to the individual concerned is unlikely to be considered appropriate by a reasonable person."

**The catch-all worked example (p.81), verbatim:** a fashion retailer states its purposes as "providing them with updates on new products and promotions **and any other purpose that it deems fit**."

> "In this case, providing updates on new products and promotions may be a reasonable purpose but the fashion retailer's unqualified reference to 'any other purpose that it deems fit' would not be considered reasonable."

**"Purpose" means objective, not activity** (¶8.2): "an organisation is not required to specify every activity which it may undertake, but its objectives or reasons relating to personal data."

**What to check in code:** grep the privacy policy, consent copy and T&Cs for catch-all purpose language — "and any other purpose", "for such purposes as we deem fit", "for our business purposes", "and related purposes". Each is a direct hit on the ¶13.4 example **and** a Notification failure. Second check: **field-level relevance** — for each collected column, does a stated purpose actually require it? A registration form collecting NRIC, DOB and income for a "receive product updates" purpose fails the relevance limb of ¶13.3.

---

## Notification

**The rule** (¶14.2, s 20(1)) — inform the individual of:

> "a) the purposes for the collection, use and disclosure of his personal data, **on or before** collecting the personal data; or
> b) any purpose for use or disclosure of personal data which has not been informed under sub-paragraph (a), **before** such use or disclosure of personal data for that purpose."

**Timing for recurring collection** (¶14.8): "**Where an organisation needs to collect, use and/or disclose personal data on a periodic basis, it must inform the individual before the first collection of the data.**"

**When notification is not required** (¶14.4, s 20(3)): deemed consent under s 15 or 15A, or an exception under s 17. But note the interaction — s 15A(4)(b) imposes its **own** notification requirement for deemed consent by notification, and legitimate interests carries its own disclosure duty (¶12.60). And s 20(4)–(5) means the s 20(3) carve-out does **not** apply to employment purposes.

**Specificity — the sharpest test in the chapter (p.86), verbatim:**

> "An electronics store … informs individuals … that the contact details provided by the customers will be **disclosed to other companies in the electronics store's corporate group and outsourced marketing company for the purposes of marketing the products of the various companies in its corporate group** from time to time. In this case, the electronics store would be considered to have stated a **sufficiently specific** purpose.
> In another case, the electronics store informs individuals … that the personal data provided may be used and disclosed **for valid business purposes**. In this case, the electronics store would **not** be considered to have stated a sufficiently specific purpose."

**Specificity factors** (¶14.16) include "(c) **if the personal data will be disclosed to other organisations, how the organisations should be made known to the individuals**".

**A single global policy is not enough** (¶14.13(b)): "If an organisation's Data Protection Policy sets out its purposes in very general terms … it may need to provide a more specific description of its purposes to a particular individual who will be providing his personal data in a particular situation."

**Good practice** (¶14.18): plain language, "**avoiding legalistic language or terminology that would confuse or mislead**"; a **layered notice**; highlighting purposes that would be unexpected in context; and "(e) Developing processes to **regularly review the effectiveness of and relevance of the notification policies and practices**."

**The new-purpose decision tree** (¶14.21) — run this before shipping any new use of existing data:

> "a) whether the purpose is within the scope of the purposes for which the individual concerned had originally been informed…;
> b) whether consent can be deemed to have been given … in accordance with Section 15 or 15A…; and
> c) whether the purpose falls within the exceptions from consent in the First and Second Schedules…"

¶14.22: "If the purpose does not fall within sub-paragraphs (a) to (c) above, then the organisation must obtain the individual's **fresh consent**." The spa example (p.89) draws the line: servicing your own existing relationship is within (a); promoting an **affiliate's** services is not.

The sector-specific positive example (p.88) is a **show-flat guest book**: name/address/income collected, with the receptionist explaining verbally that the data is for the agency's market research and product planning "and that it would not be used to contact individuals after they leave the show flat". That is appropriate notification — and note how narrow the notified purpose is.

**What to check in code:**
- Notice presented **before or at** form submit, and **before the first** collection for any recurring sync or scrape — a background job needs its notice at enrolment, not per run (¶14.7–14.8).
- The **live privacy policy text** compared against the actual vendor list from *Who owes these obligations*: it must name the **categories of recipients** (corporate group companies, outsourced marketing company). "Valid business purposes" or an unnamed "our partners" fails (¶14.16(c), p.86 example).
- Per-form / per-flow notices, not only a global policy page (¶14.13(b)).
- A policy `last_reviewed` date **and an owner**, not just a `last_updated` string (¶14.18(e)).
- Any new-feature PR that uses existing data for a new purpose: does it carry a ¶14.21 determination?

---

## Access

**The rule** (¶15.3, s 21(1)) — on request, provide **as soon as reasonably possible**:

> "a) personal data about the individual that is in the possession or under the control of the organisation; and
> b) information about the ways in which that personal data has been or may have been used or disclosed by the organisation **within a year before the date of the individual's request**."

**The window is one year, computed inclusively of the request date.** Worked example (¶15.17): a request made 5 December 2015 covers "the period from **6 December 2014** to the date of the request, **5 December 2015**."

**Third parties must be named individually** (¶15.15):

> "Generally, in responding to a request for information on third parties to which personal data has been disclosed, the organisation should **individually identify each possible third party** (e.g. 'pharmaceutical company ABC'), instead of simply providing general categories of organisations (e.g. 'pharmaceutical companies')…"

¶15.15 permits a maintained **standard list** of all possible recipients instead, kept accurate and updated. ¶15.16 permits describing **purposes** rather than every individual event.

**Scope points:**
- Data in the organisation's **possession *or* control**, including data physically held by a data intermediary (¶15.2). A DI under a written contract is not itself subject to Access/Correction (s 4(2)) and "may (but is not obligated…) forward the individual's access or correction request".
- Access is to the **personal data**, not the document (¶15.6) — provide the data or relevant sections, not the whole file where feasible.
- **Unstructured data is in scope** (¶15.9): "the obligation to provide access applies equally to personal data captured in unstructured forms, such as personal data embedded in emails. Organisations are generally required to implement processes to keep track of the collection, use, and disclosure of all personal data under their control, including unstructured data."
- **Source of the data is NOT required** (¶15.7). Do not report a missing provenance column as an Access gap.
- Identity verification is expected before responding (¶15.12).

**Response time — 30 days** (¶15.18):

> "an organisation is required to comply with section 21(1) … and must respond to an access request **as soon as reasonably possible** from the time the access request is received. If an organisation is unable to respond to an access request within **30 days** after receiving the request, the organisation shall inform the individual **in writing within 30 days** of the time by which it will be able to respond to the request."

Footnote 34: "Generally, this refers to **30 calendar days**." May extend where the last day falls on a Sunday or public holiday.

**Permissive refusal grounds** (¶15.30, Fifth Schedule, s 21(2)) — the organisation *may* refuse, and *may* also choose to provide anyway. Ten matters, ending with:

> "j) any request — i. that would unreasonably interfere with the operations of the organisation because of the repetitive or systematic nature of the requests…; ii. if the burden or expense of providing access would be unreasonable to the organisation or disproportionate to the individual's interests; iii. for information that does not exist or cannot be found; iv. for information that is trivial; or v. that is otherwise frivolous or vexatious."

**Mandatory refusal grounds** (¶15.31, s 21(3)) — the organisation *must not* provide where doing so could reasonably be expected to: threaten another individual's safety or physical/mental health; cause immediate or grave harm to the requester; **reveal personal data about another individual**; reveal the identity of someone who provided data about another and does not consent; or be contrary to the national interest.

**The user-activity-data carve-out** (footnote 41, ¶15.34): "Paragraphs (c) and (d) do not apply to any **user activity data** about, or any user-provided data from, the individual who made the request despite such data containing personal data about another individual." User activity data = "personal data about an individual that is created in the course or as a result of the individual's use of any product or service provided by the organization."

**Redaction first is mandatory** (¶15.33, s 21(5)):

> "if an organisation is able to provide the individual with his personal data and other information requested under section 21(1) **without** the personal data or other information excluded under sections 21(2), 21(3) and 21(4), the organisation **must** provide the individual access to the requested personal data and other information without the personal data or other information excluded."

**Law-enforcement gag** (¶15.35, s 21(4)): where personal data was disclosed to a prescribed law enforcement agency without consent, "the organisation **must not inform the individual** that personal data has been disclosed." ¶15.21 adds that the organisation may refuse to confirm or deny existence.

**A reply is owed even on refusal** (¶15.38), with the reasons stated.

**Fees** (¶15.25–¶15.27): a reasonable fee may be charged to recover **incremental** costs; capital purchases may not be passed on. A **written estimate is mandatory** before charging, and a written notice if the final fee exceeds it. No fee schedule is prescribed (¶15.26). The two illustrations: **$50,000** to recover a machine purchase — not reasonable; **$50 for 50 printed pages** — reasonable.

### The legal hold — ¶15.40–¶15.42, s 22A

**An access request suppresses your TTL and purge jobs.**

¶15.39: "Section 22A of the PDPA and the Personal Data Protection Regulations 2021 requires organisations to preserve a complete and accurate copy of the personal data if they refused to provide that personal data."

¶15.40, verbatim:

> "**If an organisation has scheduled periodic disposal or deletion of personal data (e.g. the CCTV system deletes the footage every X days, or physical documents containing personal data are shredded every X days), the organisation is to identify the requested personal data, as soon as reasonably possible after receiving the access request, and ensure the personal data requested is preserved while the organisation is processing the access request.**"

¶15.42, verbatim:

> "the organisation must preserve a complete and accurate copy of the withheld personal data for a period of **at least 30 calendar days after rejecting the access request** – as the individual may seek a review of the organisation's decision. In the event the individual submits an application for review to the Commission and the Commission determines that it will take up the review application, as soon as the organisation receives a Notice of Review Application from the Commission, it must preserve a complete and accurate copy of the withheld personal data **until the review by Commission is concluded and any right of the individual to apply for reconsideration and appeal is exhausted.**"

The counterweight (¶15.41): "organisations should generally be mindful not to unnecessarily preserve personal data 'just in case' to meet possible access requests".

**What to check in code:**
- An endpoint or server action that returns a subject's personal data across **all** stores including unstructured ones — email bodies, file blobs, CRM notes, chat transcripts, uploaded media (¶15.9).
- A **disclosure/use audit log** queryable by subject over a rolling 1-year window with a **named** third-party recipient per row — or a maintained standard list artefact (¶15.15).
- An identity-verification step in the request handler (¶15.12); an access-request register recording request date, outcome and reason (¶15.44).
- A **refusal-reason enum** mapping to the Fifth Schedule / s 21(3) grounds, and a **redaction code path that runs before refusal** (s 21(5) makes partial disclosure mandatory where feasible).
- A **user-activity-data flag** distinguishing data created by the requester's own use of the product — that data must **not** be withheld merely because it names a third party.
- A **law-enforcement-disclosure flag** that suppresses notification and suppresses even confirming existence. A naive "always show the user everything we disclosed" export would breach s 21(4).
- **A legal-hold flag that suppresses the scheduled purge** — cron deletes, S3/R2 lifecycle rules, CCTV overwrite, `deleted_at` hard-delete sweeps — for records subject to an open access request; a `withheld_copy` artefact with `preserve_until = rejected_at + 30 days`; and an escalation that extends the hold indefinitely on a Commission Notice of Review Application. **A TTL rule with no hold override is a concrete finding.**
- If access is charged for: a stored written estimate sent before processing, a re-notification path when the final fee exceeds it, and a formula recovering only incremental cost. And **no fee code path on the correction endpoint**.

---

## Correction

**The rule** (¶15.45, s 22(1)–(2)) — unless satisfied on reasonable grounds that the correction should not be made, the organisation must:

> "a) correct the personal data as soon as practicable; and
> b) send the corrected personal data to every other organisation to which the personal data was disclosed by the organisation **within a year before the date the correction request was made**, unless that other organisation does not need the corrected personal data for any legal or business purpose."

Note both anchors as printed: ¶15.45 says *within a year before the date the correction **request was made***; ¶15.48 (interpreting s 22(3)) says *within a year before the date the **correction was made***. Record both; do not silently pick one.

**No charge** (¶15.46): "An organisation is not entitled to impose a charge for the correction of personal data required under section 22."

**Downstream recipients must correct too** (¶15.49, s 22(4)) unless satisfied on reasonable grounds they should not.

**Annotation duty when a correction is refused** (¶15.50, s 22(5)):

> "If an organisation is satisfied upon reasonable grounds that a correction should not be made … section 22(5) requires the organisation to **annotate** (i.e. make a note to) the personal data in its possession or under its control indicating the correction that was requested but not made."

**Exceptions** (¶15.51, s 22(6)–(7), Sixth Schedule): opinions, including professional or expert opinions; opinion data kept solely for an evaluative purpose; examination material; private-trust beneficiary data; arbitration/mediation data; prosecution documents where proceedings are incomplete; and **(f) derived personal data**.

"Derived personal data" is defined at ¶5.21 as "new data elements created through the processing of personal data (e.g. through mathematical, logical, statistical, computational, algorithmic, or analytical methods based on the application of business-specific rules)".

**Response time — 30 days** (¶15.52): correct "as soon as practicable"; if unable within 30 days, inform the individual in writing within 30 days of when it will be done. Footnote 49 repeats the **calendar-day** definition.

**Form of request** (¶15.53): organisations "should accept all requests made in writing and sent to the business contact information of its DPO or … left at or sent by pre-paid post to the registered office…". A standard in-app form may be offered but cannot be the only accepted channel.

**What to check in code:** a correction endpoint with **no fee**; a corrections/audit table recording request date and corrected values; a **fan-out job pushing the corrected record to every downstream recipient in the preceding year**, driven off the same disclosure log the Access Obligation needs; a `correction_requested_not_made` annotation column for the s 22(5) case; a 30-calendar-day timer with a written-notification path; and a check that **derived/computed fields (scores, segments, rankings, model outputs) and opinion fields are excluded from the correctable set**. Confirm the DPO mailbox is monitored as a request intake channel, not just the in-app form.

---

## Accuracy

**The rule** (¶16.1, s 23) — reasonable effort to ensure personal data is accurate and complete **if** the data:

> "a) is likely to be used by the organisation to make a decision that affects the individual to whom the personal data relates; or
> b) is likely to be disclosed by the organisation to another organisation."

**The obligation does not bite on data that is neither decision-driving nor disclosed onward.**

**What "accurate and complete" requires** (¶16.3): accurate recording; all relevant parts included; appropriate steps taken to ensure accuracy; and "d) it has considered whether it is necessary to **update** the information."

**Reasonable-effort factors** (¶16.4): nature and significance of the data to the individual; the purpose; the reliability of the source; the **currency** of the data; and the impact if it is wrong.

**Limits** (¶16.5): no requirement to re-check every time a decision is made, or to review everything held. "Organisations should perform their own risk assessment and use reasonable effort."

**Data from the individual** (¶16.6) may generally be presumed accurate; where currency matters, "the organisation should take steps to verify that the personal data provided by the individual is up to date (for example, by requesting a more updated copy … before making a decision that will significantly impact the individual)."

**Data from a third-party source** (¶16.7) requires more care — obtain confirmation from the source that it verified accuracy, or verify independently.

**Derived personal data** (¶16.9):

> "organisations should ensure that the raw personal data is materially accurate before further processing takes place, as well as the accuracy of processing… Where the derived data involves grouping or labelling individuals based on pre-defined categories and profiles, organisations should ensure that the **categorisation and selection criteria (i.e. business rules) are applied accurately** at the data processing stage."

Staleness illustrations: a bank re-declares and re-collects payslips at **two years** (p.112); an adventure camp should ask for a fresher record than one **eight years** old (p.112).

**What to check in code:** every path that (i) makes an automated or assisted **decision about a user** — eligibility, scoring, ranking, matching, pricing, approval — or (ii) **exports/discloses user records to another organisation** — partner API, downstream CRM, enrichment push, report generation for a counterparty. For each, look for a freshness gate on the inputs (`verified_at` / `updated_at` check, re-declaration prompt, re-fetch before decision), and for derived columns, a test that the categorisation business rules are applied correctly. Note also ¶5.11: inaccurate, stale, scraped or model-inferred data **is still personal data** and cannot be excluded from consent/retention/access handling on the grounds that it is "not confirmed".

---

## Protection

**The rule** (¶17.1, s 24): reasonable security arrangements to prevent

> "(a) unauthorised access, collection, use, disclosure, copying, modification or disposal, or similar risks; and (b) the loss of any storage medium or device on which personal data is stored."

**No fixed standard** (¶17.2): "There is no 'one size fits all' solution… taking into consideration the nature of the personal data, the form in which the personal data has been collected … and the possible impact to the individual concerned…"

**The four practice requirements** (¶17.3):

> "a) design and organise its security arrangements to fit the nature of the personal data held … and the possible harm that might result from a security breach;
> b) identify reliable and well-trained personnel responsible for ensuring information security;
> c) implement robust policies and procedures for ensuring appropriate levels of security for personal data of varying levels of sensitivity; and
> d) be prepared and able to respond to information security breaches promptly and effectively."

**The technical measures list** (¶17.5) — this is what an engineering audit maps to, verbatim:

> "• Ensuring computer networks are secure;
> • Adopting appropriate access controls (e.g. considering stronger authentication measures where appropriate);
> • **Encrypting personal data to prevent unauthorised access;**
> • Activating self-locking mechanisms for the computer screen if the computer is left unattended for a certain period;
> • Installing appropriate computer security software and using suitable computer security settings;
> • **Disposing of personal data in IT devices that are to be recycled, sold or disposed;**
> • Using the right level of email security settings when sending and/or receiving highly confidential emails;
> • Updating computer security and IT equipment regularly; and
> • **Ensuring that IT service providers are able to provide the requisite standard of IT security.**"

The **administrative** list (¶17.5) makes data minimisation a *security* measure: "Ensuring that only the appropriate amount of personal data is held, as holding excessive data will also increase the efforts required to protect personal data." It also requires confidentiality obligations in employment agreements, policies with disciplinary consequences, and regular staff training.

**Penetration testing is NOT named as a Protection Obligation measure.** Chapter 17's list does not include penetration testing, vulnerability scanning or periodic security testing. The nearest material is ¶17.4's risk-assessment exercise and ¶21.15's DPIA guidance. Security *testing* appears elsewhere only as a **defence to the re-identification offence** (¶¶23.5–23.6). **Do not cite this document for a "you must pen-test" rule.**

**What to check in code:** map each technical bullet to an artefact — encryption at rest and in transit on the personal-data tables and object storage; an access-control layer with per-role/need-to-know scoping and a stronger-authentication option; a **disposal** path for decommissioned devices *and* for deleted rows; dependency/patch cadence; and a due-diligence record per IT/cloud sub-processor. Also treat an over-broad `SELECT *` export or a table of unused PII columns as a **Protection** finding, not merely a Retention one.

---

## Retention Limitation

**The rule** (¶18.1, s 25):

> "Section 25 of the PDPA requires an organisation to cease to retain its documents containing personal data, or remove the means by which the personal data can be associated with particular individuals, **as soon as it is reasonable to assume that the purpose for which that personal data was collected is no longer being served by retention of the personal data, and retention is no longer necessary for legal or business purposes.**"

**Both limbs must fail before the duty bites**: purpose no longer served **AND** retention no longer necessary for legal or business purposes.

**No prescribed period** (¶18.2–¶18.3): "the Retention Limitation Obligation does not specify a fixed duration of time… assessed on a standard of reasonableness". Organisations must still comply with any other legal or industry retention requirements.

**What counts as still-necessary** (¶18.4): personal data "must not be kept by an organisation '**just in case**' it may be needed for other purposes that have not been notified to the individual concerned"; legitimate reasons include ongoing legal action, other statutory retention duties, business operations (annual reports, forecasts), business improvement purposes, and research/archival/historical purposes benefiting the public.

The only number in the chapter is illustrative (p.119): the Limitation Act's **6-year** contract limitation period → "an organisation may wish to retain records relating to its contracts for **7 years** from the date of termination of the contract".

**What "ceasing to retain" means** (¶18.10): "when it, its agents and its data intermediaries **no longer have access** to those documents and the personal data they contain" — by return, transfer on instruction, destruction, or **anonymisation**.

### ¶18.11 — archiving is NOT ceasing to retain

> "An organisation would not have ceased to retain documents containing personal data where it has merely filed the documents in a locked cabinet, warehoused the documents or transferred them to a party who is subject to the organisation's control in relation to the documents. In such circumstances, the organisation would be considered to be retaining the documents. **Like physical documents, personal data in electronic form(s) which are archived or to which access is limited will still be considered to be retained for the purposes of the Retention Limitation Obligation.**"

**A soft delete does not discharge s 25.** `deleted_at IS NOT NULL`, an archive table, a cold-storage bucket, a limited-access read replica, and a "hidden from the UI" flag **all still count as retained**. ¶18.12 adds that the standard is "completely irretrievable or inaccessible", while acknowledging edge cases (shredded documents in a bin, deleted files in an un-emptied recycle bin).

**Factors the Commission weighs** (¶18.13): intention to use or access the data; effort and resources needed to access it again; whether third parties were given access; and whether a reasonable attempt was made to destroy it "in a permanent and complete manner".

**Anonymisation as the alternative** (¶18.14): "An organisation will be considered to have ceased to retain personal data when it no longer has the means to associate the personal data with particular individuals." The methodology lives in Selected Topics §3, where ¶3.2 is decisive: "**PDPC views 'de-identification' as referring to only the removal of direct identifiers and does not equate it with 'anonymisation'.**" ¶3.4: data is not anonymised "if there is a **serious possibility** that an individual could be re-identified". ¶3.7(d) requires stringent internal safeguards on **identity mapping tables**, and ¶3.5/¶3.35 require **periodic re-review** because anonymisation degrades.

**Review and policy duties** (¶18.5, ¶18.8): review holdings regularly; implement **varying** retention periods per data type; prepare a retention policy that sets out the rationale where data is kept a long time.

**What to check in code:**
- A documented, **per-data-type** retention policy with rationale — not one global TTL.
- A scheduled purge job that **hard-deletes**. Per ¶18.11, a soft-delete-only implementation is a direct finding.
- Backups and recycle-bin equivalents in the "completely irretrievable" test: object-storage versioning, WAL/PITR windows, trash folders, replica lag, export files.
- An **anonymisation/pseudonym-strip** path as an alternative to deletion — and check that dropping the FK to the identity table actually severs the link (if the join key is recoverable, or an identity mapping table sits in the same database under the same credentials, the anonymisation claim fails).
- That the purge job **respects the access-request legal hold** (¶15.40–15.42).
- Derived stores that deletion usually misses: prompt/response logs, embedding indexes, analytics fact tables, snapshot tables, generated PDFs, message payloads.

---

## Transfer Limitation

**The rule** (¶19.3, s 26(1)): an organisation "must not transfer any personal data to a country or territory outside Singapore except in accordance with requirements prescribed under the PDPA, i.e. to ensure that organisations provide a standard of protection to transferred personal data that is comparable to the protection under the PDPA."

**Why it exists** (¶19.2): the overseas recipient is not subject to the PDPA, so accountability must be carried across contractually. "This is the *raison d'etre* for the Transfer Limitation Obligation."

**Scope boundary — data still under your control is not a transfer problem, it is a full-PDPA problem** (¶19.1):

> "Section 26 … limits the ability of organisations to transfer personal data to another organisation outside Singapore **in circumstances where it relinquishes possession or direct control** over the personal data… In situations where personal data transferred or situated overseas **remains in the possession or control of an organisation, the organisation has to comply with all the Data Protection Provisions**. Such situations include where an employee travels overseas with customer lists on his notebook; an organisation owns or leases and operates a warehouse overseas…; or an organisation stores personal data in an overseas data centre on servers that it owns and directly maintains. In these examples, the organisation has direct primary obligations … to, *inter alia*, protect the personal data, give effect to access and correction requests, and **include these overseas data repositories in its data retention policy**."

**The core condition** (¶19.4): transfer is permitted "if it has taken appropriate steps to ensure that the overseas recipient is bound by **legally enforceable obligations or specified certifications** to provide the transferred personal data a standard of protection that is comparable to that under the PDPA."

### Route 1 — legally enforceable obligations (¶19.5)

> "a) any law;
> b) any contract that imposes a standard of protection that is comparable to that under the PDPA, and **which specifies the countries and territories to which the personal data may be transferred under the contract**;
> c) any binding corporate rules that require every recipient … to provide a standard of protection … comparable to that of the PDPA, and which specify (i) the recipients of the transferred personal data to which the binding corporate rules apply; **(ii) the countries and territories to which the personal data may be transferred under the binding corporate rules**; and (iii) the rights and obligations provided by the binding corporate rules; or
> d) any other legally binding instrument."

**The country-naming requirement appears twice — ¶19.5(b) for contracts and ¶19.5(c)(ii) for BCRs. It is routinely missed.** A generic vendor DPA that says "we protect your data" but never names countries does **not** satisfy ¶19.5(b). "We may process in any region" is the opposite of what ¶19.5(b) requires.

BCRs are available only where the recipient is **related** to the transferring organisation (footnote 50): one controls the other, directly or indirectly, or both are under common control.

### Route 2 — specified certifications (¶19.6), and the asymmetry

> "'specified certification' refers to certifications under (i) the Global Cross-Border Privacy Rules ('Global CBPR') System, (ii) the Global Privacy Recognition for Processors ('Global PRP') System, (iii) the … APEC CBPR System, and (iv) the … APEC PRP System. The recipient is taken to satisfy the requirements … if:
> a) it is receiving the personal data **as an organisation** and it holds any of the **Global CBPR or APEC CBPR** certifications; or
> b) it is receiving the personal data **as a data intermediary** and it holds any of the **Global CBPR, APEC CBPR, Global PRP, or APEC PRP** certifications."

**Rule: PRP only works if the recipient is your data intermediary. CBPR works either way.** PDPC gives a worked example of getting this wrong (Resort Delta, p.128): the recipient held only APEC PRP and was not a data intermediary, so the transfer could not rely on it.

### Due diligence must be performed, not assumed (¶19.8)

Every certification example uses the same verb — the recipient's assertion is not enough:

> "Air Bravo **informs** Alpha.com that it is certified under the Global CBPR System in Japan. Alpha.com **carries out due diligence and determines** that Air Bravo is indeed certified under the Global CBPR System **by referring to the list of certified organisations on the Global CBPR Forum website (www.globalcbpr.org)**."

The APEC parallel names **www.cbprs.org**. The closest analogue in the guidelines to a CRM vendor (Organisation MNO / Company PQR, a US CRM data intermediary) follows the identical pattern.

### Fallback circumstances (¶19.7) — last resort only

> "**As good practice, organisations are encouraged to rely on these circumstances only if they are unable to rely on legally enforceable obligations or specified certifications:**
> a) the individual … gives his consent to the transfer …, after he has been informed about how his personal data will be protected in the destination country;
> b) the individual is deemed to have consented … where the transfer is reasonably necessary for the conclusion or performance of a contract between the organisation and the individual…;
> c) the transfer is necessary … in the vital interests of individuals or in the national interest…;
> d) the personal data is data in transit; or
> e) the personal data is publicly available in Singapore."

Footnote 52 conditions the consent route: the organisation "should … provide the individual with a **reasonable summary in writing** of the extent to which the personal data transferred to those countries and territories will be protected to a standard comparable to the protection under the PDPA."

**Data in transit** (¶19.11) is narrow: data merely routed *through* Singapore en route elsewhere, "without the personal data being accessed or used by, or disclosed to, any organisation" while in Singapore. It does not cover data originating in an SG database and sent abroad.

### Minimum contract scope (¶19.9)

| S/N | Area of protection | Recipient is a **Data Intermediary** | Recipient is an **Organisation** (except DI) |
|---|---|---|---|
| 1 | Purpose of collection, use and disclosure by recipient | — | ✓ |
| 2 | Accuracy | — | ✓ |
| 3 | Protection | ✓ | ✓ |
| 4 | Retention limitation | ✓ | ✓ |
| 5 | Policies on personal data protection | — | ✓ |
| 6 | Access | — | ✓ |
| 7 | Correction | — | ✓ |
| 8 | Data Breach Notification | ✓ — "To notify organisation of data breaches without undue delay" | ✓ — "To assess and notify the Commission/affected individuals of data breaches, where relevant" |

Footnote 54: the data-intermediary column applies only to a DI "processing the personal data on behalf of and for the purposes of the transferring organisation **pursuant to a contract evidenced or made in writing**." Accepting click-through consumer ToS with no written processing terms means you **do not get the reduced column** and the fuller organisation-column list applies.

¶19.10 notes the Commission "recognises and encourages the use of the **ASEAN Model Contract Clauses ('MCCs')**".

**What to check in code:** enumerate every outbound destination for personal data — cloud regions, sub-processors, analytics/CRM/email/AI vendors, APM/tracing, group affiliates. For each, a stored artefact proving one of: (i) a DPA that both imposes comparable protection **and names the permitted countries/territories**; (ii) BCRs naming recipients, territories and rights; or (iii) a current CBPR/PRP certification **matched to the recipient's role**, verified against globalcbpr.org or cbprs.org **with a dated record**. Then compare **region configuration in code and infra** — a vendor SDK defaulting to a US region, a gateway that can fail over across providers — against the territories the contract names. See `ai-and-transfers.md` for the LLM-specific analysis.

---

## Data Breach Notification

**The obligation** lives in Part 6A of the PDPA (ss 26A–26E). Thresholds, deadlines, the prescribed data categories, the exceptions, and the data-intermediary duty are all in **`breach.md` — go there for anything operative.** What follows is the minimum needed to route a finding.

**A breach that stays inside the organisation is not notifiable** (¶20.6):

> "A data breach that relates to the unauthorised access, collection, use, disclosure, copying or modification of personal data **within an organisation** is not a notifiable data breach."

That carve-out does **not** survive a third-party processor. Anything that leaves the tenancy — an LLM provider, an SMS gateway, an email provider, an error tracker, an analytics vendor — is outside the organisation.

**The two notifiability limbs** (see `breach.md` for the full tests): **significant harm** — deemed where the breach involves any of the prescribed personal data (¶20.15, reproducing the PDP (DBN) Regulations 2021 Schedule); and **significant scale** — **500 or more individuals**, which triggers notification **to the Commission only**.

**The deadlines**, all quoted verbatim with citations in `breach.md`: **30 calendar days** to assess from credible grounds to believe; **3 calendar days** to notify the Commission from determining notifiability, counted from the day *after* the determination; affected individuals "as soon as practicable, at the same time or after notifying the Commission" with **no fixed day-count**; data intermediary → organisation "**without undue delay**" (¶20.7).

**The data intermediary's duty stops at telling you** (¶20.8): "The DBN Obligation does not impose a requirement on the data intermediary to assess whether the data breach is notifiable, or to notify affected individuals and/or the Commission. **The organisation that engaged the data intermediary remains responsible for doing so.**"

**What to check in code:** an incident runbook naming a real authorised representative; a data inventory mapping tables/columns to the prescribed categories; access/audit logging with **row-level scope** (`profile_id` + resource + row count) so "how many individuals, which data classes" is answerable; log retention **longer than the 30-day assessment window**; and a per-processor record of the contractual breach-notification clause and its stated period. Full checklist in `breach.md`.

---

## Accountability

**The principle** (¶21.1, s 11(2)): "An organisation is responsible for personal data in its possession or under its control." ¶21.2: accountability requires organisations "to undertake measures in order to ensure that they meet their obligations under the PDPA and, importantly, **demonstrate that they can do so when required**."

¶6.3 puts the evidential burden plainly: "An organisation should ensure that it is able to adduce evidence to establish and demonstrate that it complied with the obligations under the PDPA in the event of an investigation."

**The DPO** (¶21.3, ss 11(3), 11(4), 11(6)): designate one or more individuals responsible for compliance; the designation may be delegated; and it "**does not relieve the organisation of any of its obligations**".

¶21.5: the individual should be "sufficiently skilled and knowledgeable" and "amply empowered", **need not be an employee**, should be trained and certified, and "should ideally be a member of the organisation's senior management team or have a direct reporting line to the senior management". ¶21.4 lists the duties: personal data inventory, DPIAs, monitoring and reporting risks, internal training, stakeholder engagement.

**Publishing the DPO's business contact information** (¶21.6, s 11(5), s 20(1)(c), s 20(5)(b)) is mandatory. Footnote 85:

> "For the purpose of responding to access and correction requests in writing, **at least one of the business contact information of this designated individual should be a mailing address (e.g. the office address) or an electronic mailing address.**"

¶21.7, on where and how:

> "The business contact information … may be provided on BizFile+ for companies that are registered with ACRA, or provided in a **readily accessible part of the organisation's official website such that it can be easily found**. It should be **readily accessible from Singapore, operational during Singapore business hours** and in the case of telephone numbers, be **Singapore telephone numbers**."

**The four s 12 requirements** (¶¶21.8–21.12):

| s 12 | Requirement | Paragraph |
|---|---|---|
| (a) | Develop and implement data protection **policies and practices**, accessible to the intended reader, with "monitoring mechanisms and process controls to ensure the effective implementation" | ¶21.9 |
| (b) | Develop a process to **receive and respond to complaints** | ¶21.10 |
| (c) | **Inform and train staff** — "provide staff training and communicate to its staff information about its policies and practices" | ¶21.11 |
| (d) | **Make information available on request** about its policies, practices and complaint process | ¶21.12 |

**Voluntary measures with teeth** (¶21.15):

> "organisations may wish to consider demonstrating organisational accountability through measures such as conducting **Data Protection Impact Assessments ('DPIA')** …, adopting a **Data Protection by Design ('DPbD')** approach, or implementing a **Data Protection Management Programme ('DPMP')**… **Although failing to undertake such measures is not itself a breach of the PDPA, it could, in certain circumstances, result in the organisation failing to meet other obligations under the PDPA.** For example, an organisation that does not conduct a DPIA may not fully recognise risks to the personal data it is handling within its IT infrastructure. This, in turn, may result in the organisation failing to implement reasonable security measures to protect such data and hence committing a breach of section 24 of the PDPA."

**Private right of action** (¶21.14(f)): "individuals who suffer loss or damage directly as a result of a contravention of Parts 4, 5, 6 or 6A of the PDPA by an organisation may commence civil proceedings against the organisation."

**Individual criminal offences** (Part 9B, ¶22.1): knowing or reckless unauthorised **disclosure**; unauthorised **use** for gain or to cause harm/loss; and unauthorised **re-identification** of anonymised information. ¶23.1: these criminalise "egregious misconduct by individuals whose actions had **not been authorised by the organisation**." ¶23.2 is the flip side worth engineering toward: employees "should be assured that if they adhere to their employer's policies and practices, they will not run the risk of criminal sanctions for these offences." Defences include publicly available information, other laws, court orders, and reasonable belief in a legal right (which "covers situations such as journalistic reporting and whistleblowing"). Security-testing defences to the re-identification offence (¶¶23.5–23.6) cover data professionals, engaged service providers, researchers, and "**White-hat hackers** … either in their personal capacity or as part of bug bounty programmes."

**No fine or imprisonment figure for the Part 9B offences appears anywhere in Key Concepts.** Do not supply one.

**What to check in code / repo:** a named DPO with published business contact information — specifically an **email or postal address** — in a readily accessible part of the live website, reachable from Singapore during Singapore business hours (a privacy-policy footer link qualifies; a contact form with no address arguably does not; a DPO listed only in an internal wiki fails). Cross-check the ACRA BizFile+ record. Then: a complaints intake path distinct from generic support; an accessible internal data-protection policy; a staff training record or attestation; a DPIA artefact for any feature touching personal data at scale; and — for Part 9B — a documented **authorisation record** listing who may run production data exports, impersonation, or de-anonymisation scripts, plus an authorisation clause in any sub-processor agreement covering re-identification or security testing on anonymised datasets. Because the published DPO address is itself a statutory intake channel for access and correction requests (¶15.53), confirm someone monitors it.

---

## Data Portability

**Status: legislated but NOT IN FORCE. Verified August 2026.**

> **Outside the corpus:** the not-in-force determination is a commencement check made in August 2026, not a statement any document in this corpus makes. None of the held guidelines states a commencement date for the Data Portability Obligation, and none states that it is pending. Re-verify on `https://sso.agc.gov.sg/Act/PDPA2012` before relying on it — and note the Act 19 of 2025 open item in `sources.md` §1.4.

**What the corpus does say:**

- **Key Concepts ¶10.2 enumerates the obligations and Data Portability is not among them.** The list is: Consent (ss 13–17); Purpose Limitation (s 18); Notification (s 20); Access & Correction (ss 21, 22, 22A); Accuracy (s 23); Protection (s 24); Retention Limitation (s 25); Transfer Limitation (s 26); Data Breach Notification (ss 26A–26E); Accountability (ss 11 and 12). Ten obligations. No eleventh.
- The only substantive reference is in the **definition of derived personal data**, ¶5.21:

> "Derived data is a general term but **in the context of data portability**, it does not include personal data derived by the organisation using any prescribed means or methods which are commonly known and used by the industry (e.g. simple mathematical averaging or summation)."

  *(Ambiguity, recorded as observed: the carve-out for "commonly known and used" methods is expressed as applying "in the context of data portability" only. The guidelines do not say whether the same carve-out applies elsewhere.)*

**How to treat it in an audit — the rule:**

1. **Never report a Data Portability defect as a live breach.** There is no obligation in force to breach.
2. Raise it only as a **forward-looking design note**, clearly labelled as not-yet-in-force, where the codebase would obviously struggle: no machine-readable export path, personal data spread across stores with no single subject-scoped extractor, or an export that cannot distinguish user-supplied fields from derived ones.
3. Any Access Obligation work (a subject-scoped extractor across all stores, including unstructured ones) is the natural substrate for portability later. Say that, rather than inventing a portability requirement now.
4. **Re-check commencement** at each audit. If it comes into force, the ¶5.21 derived-data carve-out becomes operative and the distinction between user-supplied and model-derived columns becomes load-bearing.

**What to check in code (forward-looking only):** whether columns are classifiable as user-supplied vs derived (scores, segments, propensity flags, embeddings, AI-generated insights are **derived personal data** per ¶5.21); and whether the Access extractor could emit a structured, machine-readable format rather than a rendered PDF.

---

## Financial penalties

**Cite the Enforcement AG. Never cite Key Concepts ¶21.14(e).**

### The current general ceiling — Enforcement AG ¶27.1

> "Under Section 48J of the PDPA, the Commission may require an organisation to pay a financial penalty of up to **S$1 million or 10% of the organisation's annual turnover in Singapore[53], whichever is higher**, for any intentional or negligent contravention of the Data Protection Provisions."

**Footnote 53:** "Where the organisation's annual turnover in Singapore **exceeds S$10 million**."

**Footnote 54** scopes "Data Protection Provisions": "Any provision in Part 3, 4, 5, 6, or 6A of the PDPA."

**Enforcement AG ¶27.3 — how turnover is measured:**

> "An organisation's annual turnover in Singapore will be ascertained from the **most recent audited accounts** of the organisation available at the time the financial penalty is imposed."

Footnote 58 cites `PDPA, Section 48J(5A)`.

**In force since 1 October 2022.** The 30 Sep 2022 media release, verbatim:

> "As part of the update to the PDPA, the amendments to enforcement of the PDPA take effect on **1 October 2022**… the financial penalty cap which may be imposed on organisations for breaches under the PDPA has increased from the previously fixed S$ 1 million, to 10% of the organisation's annual turnover in Singapore for organisations with annual local turnover exceeding S$10 million, whichever is higher."

### 🚩 Key Concepts ¶21.14(e) is stale drafting — do NOT cite it as current

Verbatim, from the **29 April 2026** revision, p.154:

> "the Commission may, if satisfied that an organisation has contravened the Data Protection Provisions, give directions to the organisation to ensure compliance including (amongst others) imposing a financial penalty of up to $1 million (**or in due course**, up to $1 million or 10% of the organisation's annual turnover in Singapore, whichever is higher); and"

A full-text search of Key Concepts for `turnover`, `10% of` and `in due course` hits **exactly one place** — that paragraph. The document has no other discussion of the cap, and the "in due course" wording predates the 1 Oct 2022 commencement. It was carried forward unrevised.

**If a generated report contains the phrase "in due course" in a penalty statement, that is a bug.**

### The DNC band is different — Enforcement AG ¶27.2

> "For any intentional or negligent contravention of the DNC Provisions involving the use of **dictionary attacks and address-harvesting software**, the Commission may require payment of a financial penalty of up to **S$200,000 in the case of an individual** and in the case of an organisation, a financial penalty of up to **S$1 million or 5% of the organisation's annual turnover in Singapore[56], whichever is higher**. Contraventions of **other DNC provisions**, the Commission may require payment of a financial penalty of up to S$200,000 in the case of an individual and in other cases, a financial penalty of up to **S$1 million**."

**Footnote 56:** "Where the organisation's annual turnover in Singapore **exceeds S$20 million**." **Footnote 57:** "Any provision in Part 9 of the PDPA."

| Contravention | Percentage | Turnover threshold | Individual cap |
|---|---|---|---|
| Data Protection Provisions (Parts 3, 4, 5, 6, 6A) | **10%** | exceeds **S$10 million** | — |
| DNC + dictionary attack / address-harvesting software | **5%** | exceeds **S$20 million** | S$200,000 |
| Other DNC contraventions (Part 9) | flat **S$1m**, no percentage | n/a | S$200,000 |

**Do not conflate the two bands.** The percentage and the threshold both differ.

**What to check in code:** this is a **finding-ranking** input, not a code path. For any Singapore entity with local turnover over S$10m, protection and retention defects on the client table, the prompt/response log store and the embeddings store are material financial risk, not housekeeping. Separately, any recipient-list construction path that generates, permutes, enumerates, or harvests telephone numbers sits in the **5% / S$20m** dictionary-attack band — see `marketing-dnc.md` on s 48B, and note that a passing DNC check does **not** cure it.
