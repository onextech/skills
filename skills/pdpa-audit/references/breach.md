# Data breach assessment and notification

Sources:

- **Guide on Managing and Notifying Data Breaches under the PDPA**, `Revised on 15 March 2021` — cited **Breach Guide**. It has **no numbered paragraphs**; cited by section heading + printed page, e.g. `Breach Guide, "Significant Scale", p.24`.
- **Advisory Guidelines on Key Concepts in the PDPA**, `Revised 29 April 2026` — cited **[KC] ¶x.x**. This is the only source in the corpus that **enumerates the prescribed personal-data categories** and the **exceptions to notifying individuals**; the Breach Guide only points at the Regulations.
- **Advisory Guidelines on the PDPA for Selected Topics**, `Revised 23 May 2024` — cited **[ST] ¶x.x**, for the minors branch.

**Statutory basis:** Part 6A of the PDPA (ss 26A–26E); **Personal Data Protection (Notification of Data Breaches) Regulations 2021** — *not held; verify the Schedule directly before any live notification decision.*

---

## 0. The numbers, in one place

| Test / deadline | Value | Calendar or business? | Source |
|---|---|---|---|
| Assess whether a breach is notifiable | **30 days** from credible grounds to believe | **calendar** (stated) | Breach Guide p.22 |
| Notify the Commission | **3 days** — "as soon as practicable, but in any case, no later than" | **calendar** (stated) | Breach Guide p.25 |
| — how the 3 days are counted | first day = **the day after** the determination | calendar | Breach Guide p.25 fn 6 |
| Notify affected individuals | **as soon as practicable**, at the same time as or **after** the Commission | **no fixed day-count** | Breach Guide p.25 |
| Significant scale threshold | **500 or more individuals** | — | Breach Guide p.24; [KC] ¶¶20.20–20.21 |
| Significant harm | deemed, where the breach involves any **prescribed** personal data | — | Breach Guide p.23; [KC] ¶20.15 |
| Data intermediary → the organisation | **without undue delay** from credible grounds to believe | — | [KC] ¶20.7; Breach Guide Annex D p.38 |
| Preserve a withheld copy after refusing an **access** request | at least **30 calendar days** | calendar (stated) | [KC] ¶15.42 — see `obligations.md` |

### ✅ Cross-check: the 2021 Guide and the 2026 Key Concepts agree on every threshold and deadline

Where the Breach Guide (15 Mar 2021) and Key Concepts (29 Apr 2026) overlap they agree on **all** of it — 30 calendar days to assess, 3 calendar days to notify the Commission, the same day-counting footnote, 500 or more individuals, and data-intermediary notification "without undue delay". **That concordance across a five-year gap is good evidence the 2021 Guide's operative numbers have not moved.**

Key Concepts remains the better citation for the **prescribed categories** and the **exceptions**; the Breach Guide is the better citation for **process** (C.A.R.E., notification content, containment actions).

---

## 1. What is a data breach

**Breach Guide, Part I, "Defining and Monitoring for Data Breaches", p.8, verbatim:**

> "A data breach, in relation to personal data, refers to **any unauthorised access, collection, use, disclosure, copying, modification or disposal of personal data**. It also includes **the loss of any storage medium or device on which personal data is stored in circumstances where the unauthorised access, collection, use, disclosure, copying, modification or disposal of the personal data is likely to occur**."

Note the second limb: **loss of a device or medium is itself a breach** where unauthorised access is merely *likely*. There is no need to prove access occurred.

The definition is broad enough that an **internal misconfiguration counts** — an over-broad DB grant, a public object-storage file, a server action that returns another user's rows, a log line containing an NRIC, a stale presigned URL.

---

## 2. What is a *notifiable* data breach

The Breach Guide gives no one-line definition; it defines notifiability **by the two criteria** in §3 and §4 below.

**Breach Guide, Part III, "Requirements for Organisations and Data Intermediaries", p.21:**

> "Part 6A of the PDPA sets out the requirements for organisations to assess whether a data breach is notifiable, and to notify the affected individuals and/or the Commission where it is assessed to be notifiable."

**The one carve-out, stated only in Key Concepts — [KC] ¶20.6, verbatim:**

> "A data breach that relates to the unauthorised access, collection, use, disclosure, copying or modification of personal data **within an organisation** is not a notifiable data breach."

**"Within the organisation" is a narrow escape hatch and it does not survive a third-party processor.** Anything that leaves the tenancy — an LLM provider, an SMS/voice gateway, an email provider, an error tracker, an analytics vendor, a hosted vector DB — is outside the organisation and cannot use ¶20.6.

**Multi-party breaches** ([KC] ¶20.10): "where a data breach involves personal data in the possession or under the control of **more than one organisation**, the organisations involved are **individually responsible** for complying with the DBN Obligation in respect of that data breach."

**Other regulators do not substitute** (Breach Guide p.29): "An organisation is **not** regarded to have fulfilled the DBN Obligation under the PDPA just by fulfilling any other breach notification requirements set out under other written laws."

**What to check in code:** row-level ownership checks in every server action (identity derived server-side, never client-supplied); object-storage ACL defaults; presigned-URL TTLs; and whether any personal data reaches `console.log` or error-tracker payloads. Each of these is a ¶20.6 boundary question as much as a Protection question — a leak into a third-party log sink has already left the organisation.

---

## 3. Limb 1 — significant harm

**Breach Guide, "Criteria for Data Breach Notification — Significant Harm to Affected Individuals", p.23:**

> "Organisations are required to assess whether a data breach is notifiable as it is likely to result in significant harm to the affected individuals."

> "To provide certainty to organisations on the data breaches that are notifiable, the PDP (DBN) Regulations 2021 provides the personal data (or classes of personal data) that is **deemed** to result in significant harm to affected individuals if compromised in a data breach. **Where a data breach involves any of the prescribed personal data, the organisation will be required to notify the affected individuals AND the Commission of the data breach.**"

**Definition of "significant harm"** — Breach Guide p.23, footnote 5:

> "Significant harm could include physical, psychological, emotional, economic and financial harm, as well as harm to reputation and other forms of harms that a reasonable person would identify as a possible outcome of a data breach."

**Assessment considerations** — Breach Guide, "ASSESS", pp.17–18, three named factors:

> "**Context of the data breach** — In considering the context of a data breach, the organisation should take into account factors such as the types of personal data involved, the individuals whose personal data have been compromised (e.g., **minors, vulnerable individuals** etc.), and other contextual factors such as whether the personal data was publicly available before the data breach."

> "**Ease of identifying individuals from the compromised data** — The ease with which an affected individual can be identified from the compromised data increases the likelihood of harm to the individual. In general, the ease of identifying individuals from the compromised dataset increases with the **number and uniqueness of identifiers** in the dataset."

> "**Circumstances of the data breach** — The organisation should consider the circumstances surrounding the data breach, such as whether the data was **illegally accessed and stolen by those with malicious intent**, which is more likely to result in significant harm … as compared to situations where the data was wrongly sent to recipients who have no malicious intent or use for the data."

### 3.1 ⚠️ The Breach Guide does NOT enumerate the prescribed categories

It only points at the PDP (DBN) Regulations 2021 (p.23). **Verified, not assumed:** searching the Breach Guide for eleven distinctive category terms — *creditworthiness, net worth, vulnerable adult, Vulnerable Adults Act, Women's Charter, life policy, private key, capital markets, biometric, charge card, sexually* — returns **zero hits for all eleven**. (The single "adoption" hit is the p.28 sentence telling organisations to seek PDPC guidance first, not a category list.) The same search against Key Concepts hits every term.

**If your only source is the Breach Guide, you cannot determine notifiability on the significant-harm limb at all.** The enumeration below is from **[KC] ¶¶20.15–20.16**, which reproduces the Schedule. For a live notification decision, verify against the Regulations themselves.

### 3.2 The prescribed categories — FULL LIST

**Limb (a) chapeau — [KC] ¶20.15:**

> "The personal data (or classes of personal data) prescribed include:
> a) Individual's **full name or alias or full national identification number** in combination with any of the following personal data in sub-paragraphs (i) to (xxv):"

Two footnoted definitions attach ([KC] p.133):

> **fn 60** — "**Full name** refers to the full name of the individual from official sources (e.g. NRIC/passport) that includes the individual's first and last name. **It does not apply to the individual's initials.** **Alias** refers to an alternate name an individual habitually uses to identify himself/herself and provided to/used by the organisation."

> **fn 61** — "**National identification number** refers to any government-issued identification number, including the **NRIC number, birth certificate number, FIN, work permit number, passport number, and any foreign national identification number**."

#### (a) The 25 combination items, under their Schedule sub-headings

**Financial information which is not publicly disclosed**

- **(i)** "The amount of any wages, salary, fee, commission, bonus, gratuity, allowance or other remuneration paid or payable to the individual by any person, whether under a contract of service or a contract for services."
- **(ii)** "The income of the individual from the sale of any goods or property."
- **(iii)** "The number of any credit card, charge card or debit card issued to or in the name of the individual."
- **(iv)** "The number assigned to any account the individual has with any organisation that is a bank or finance company."
- **(v)** "The net worth of the individual."
- **(vi)** "The deposit of moneys by the individual with any organisation."
- **(vii)** "The withdrawal by the individual of moneys deposited with any organisation."
- **(viii)** "The granting by an organisation of advances, loans and other facilities by which the individual, being a customer of the organisation, has access to funds or financial guarantees."
- **(ix)** "The incurring by the organisation of any liabilities other than those mentioned in paragraph (viii) on behalf of the individual."
- **(x)** "The payment of any moneys, or transfer of any property, by any person to the individual, including the amount of the moneys paid or the value of the property transferred, as the case may be."
- **(xi)** "The **creditworthiness** of the individual. This includes the individual's loan/credit history, repayment/default history and credit rating/status, and includes credit reports prepared by a credit bureau (whether or not the credit bureau is licensed under other written law)."
- **(xii)** "The individual's investment in any **capital markets products**."
- **(xiii)** "The existence, and amount due or outstanding, of any **debt** – a. owed by the individual to an organisation; or b. owed by an organisation to the individual."

**Identification of vulnerable individuals**

- **(xiv)** "Any information that identifies, or is likely to lead to the identification of, the individual as a **child or young person** who —" is/was the subject of a Children and Young Persons Act investigation; was arrested on or after 1 July 2020 for an offence under any written law; is/was taken into care or custody under the CYPA; is/was attending a family programme under s 50 CYPA; is/was the subject of a court order under the CYPA; or is/was concerned in any court proceedings (as party or witness). *(fn 71: "child or young person means a person below the age of 18 years".)*
- **(xv)** "Any information that identifies, or is likely to lead to the identification of —" an individual investigated, examined, assessed or treated under the **Vulnerable Adults Act** as a vulnerable adult experiencing or at risk of abuse, neglect or self-neglect; a vulnerable adult committed to a place of temporary care and protection or place of safety, or to the care of a fit person; a vulnerable adult subject to a VAA court order; **the location of** such a place; or the fit person and their premises' location.
- **(xvi)** The name or address of any **woman or girl in respect of whom a specified offence is alleged**; particulars in court proceedings identifying her; the name/address of any witness that may lead to her identification; particulars of any witness's evidence that may lead to her identification; and "any picture of, or any picture including a picture of (i) any woman or girl in respect of whom a specified offence is alleged to have been committed; or (ii) any witness in any proceedings in any court relating to a specified offence." *(fn 73: "specified offence" = ss 354, 354A, 375, 376, 376A–376G or 377B Penal Code, including attempts, or an offence under Part XI of the Women's Charter.)*
- **(xvii)** "Any information that identifies, or is likely to lead to the identification of – a. the individual as a **resident of a place of safety established under section 177 of the Women's Charter**…; or b. the location of a place of safety established under section 177 of the Women's Charter at which the individual is residing."

**Life, accident and health insurance information which is not publicly disclosed**

- **(xviii)** The terms and conditions of any accident and health policy or life policy the individual owns or benefits under; the premium payable; the benefits payable to any beneficiary; "any information relating to any claim on, or payment under, the applicable policy, including the condition of the health of any individual and the diagnosis, treatment, prevention or alleviation of any ailment, condition, disability, disease, disorder or injury that individual has suffered or is suffering from"; and any other information that the individual is a policy owner or beneficiary.

**Specified medical information**

- **(xix)** "The assessment, diagnosis, treatment, prevention or alleviation by a health professional of any of the following affecting an individual – a. any **sexually-transmitted disease**…; b. **Human Immunodeficiency Virus ('HIV') Infection**; c. **schizophrenia or delusional disorder**; d. **substance abuse and addiction**, including drug addiction and alcoholism."
- **(xx)** "The provision of treatment to an individual for or in respect of – a. the donation or receipt of a human egg or human sperm; or b. any contraceptive operation or procedure or abortion."
- **(xxi)** Organ donation, removal or transplantation — the individual as deceased donor, living donor, or recipient.
- **(xxii)** "…the **suicide or attempted suicide** of the individual."
- **(xxiii)** "**Domestic abuse, child abuse or sexual abuse** involving or alleged to involve the individual."

**Information related to adoption matters**

- **(xxiv)** That the individual is or was **adopted** under the Adoption of Children Act or is/was the subject of an application; the identity of the natural father or mother; the identity of the adoptive father or mother; the identity of any applicant for an adoption order; the identity of any person whose consent is necessary; and "any other information that the individual is or had been an adopted child or relating to the adoption of the individual."

**Private key used to authenticate or sign an electronic record or transaction**

- **(xxv)** "Any **private key** that is used or may be used – a. to create a secure electronic record or secure electronic signature; b. to verify the integrity of a secure electronic record; or c. to verify the authenticity or integrity of a secure electronic signature."

#### (b) Account credentials — these stand ALONE, with no name attached

**[KC] ¶20.15(b)**, under the heading *"Individual's account identifier and data for access into the account (without individual's name, alias or full identification number)"*, verbatim:

> "b) Personal data relating to an individual's account (**both active and dormant**) with an organisation, including –
> (i) the individual's **account identifier**, such as an account name or number or a username; and
> (ii) any **password, security code, access code, response to a security question, biometric data** or other data that is used or required to allow access to or use of the individual's account."

**This is the limb engineers miss.** A leak of username + credential material is notifiable **on its own**, fully de-named. That reaches session tables, OTP stores, password-reset tokens, API keys tied to a user, share-link bearer codes, and biometric templates.

#### The exclusion — [KC] ¶20.16

> "The prescribed personal data or classes of personal data, or other prescribed circumstances **excludes any personal data that is publicly available** and any personal data that is **disclosed under any written law** (e.g. pay information issued by employers under the Employment Act)."

This materially shrinks the notifiable surface for anything built on already-public data (e.g. published transaction records).

**What to check in code:** map each prescribed category onto real tables and columns, and confirm what is encrypted, what is logged, and what leaves the tenancy.

- **Chapeau + (iii)/(iv)/(xi)/(xiii)** — any table holding `full_name` **plus** a bank, card, loan or debt field is one leak away from a **mandatory individual notification**. Check CRM client tables, transaction party tables, calculator/affordability inputs, and any loan field.
- **fn 61** — NRIC **and FIN, work permit, passport, birth certificate, and foreign IDs** all count. If only NRIC is encrypted, the others are a gap. Confirm none of them is written to logs, error-tracker `extra` payloads, chat transcripts, or LLM prompt payloads.
- **¶20.15(b)** — enumerate every store holding an account identifier plus credential material: session rows, OTP codes at rest, password-reset tokens, impersonation cookies, share-link short codes, beta/activation tokens, presigned-URL keys in logs. **De-naming does not help here.**
- **(xviii)–(xxiii)** — insurance and medical fields are probably absent by design from a property CRM. Confirm no **free-text** column is being used to store them de facto. A `notes` column is a category-(xix) leak waiting to happen.
- **(xxv)** — private keys. Check for signing keys committed to the repo or held in the database.
- **¶20.16** — record which datasets are genuinely public, because that exclusion is worth claiming.

---

## 4. Limb 2 — significant scale

**Breach Guide, "Criteria for Data Breach Notification — Significant Scale", p.24, verbatim:**

> "Data breaches that meet the criteria of significant scale are those that involve the personal data of **500 or more individuals**. Where a data breach affects 500 or more individuals, the organisation is required to **notify the Commission**, even if the data breach does not involve any prescribed personal data in the PDP (DBN) Regulations 2021."

**Where the count is unknown** — same section, p.24:

> "If an organisation is unable to determine the actual number of affected individuals in a data breach, the organisation should notify the Commission **when it has reason to believe that the number of affected individuals is at least 500**. This may be based on the estimated number from an initial appraisal of the data breach. The organisation may subsequently update the Commission of the actual number of affected individuals when it is established."

Identical threshold at [KC] ¶¶20.20–20.21.

**Note the asymmetry: significant scale triggers notification to the Commission ONLY, not to individuals.**

**What to check in code:** 500 is trivially exceeded by any table-level exposure. The practical consequence is that **you must be able to count affected individuals fast**. Check that ownership joins let you scope "whose rows did this query or route touch" — access logged with a subject identifier and a row count, not just a route name. If the answer to "how many individuals?" is unknowable, the Guide's default is to assume ≥500 and notify.

---

## 5. Deadlines, quoted verbatim

### 5.1 Assessment — 30 CALENDAR days from credible grounds to believe

**Breach Guide, "Duty to Conduct Assessment of Data Breach", p.22, verbatim:**

> "Once an organisation has **credible grounds to believe** that a data breach has occurred (whether through self-discovery, alert from the public or notification by its data intermediary), the organisation is required to take reasonable and expeditious steps to assess whether the data breach is notifiable under the PDPA **within 30 calendar days**. Any unreasonable delay in assessing a data breach will be a breach of the DBN Obligation and the Commission can take enforcement action. If an organisation is unable to complete its assessment within 30 days, it would be prudent for the organisation to be prepared to provide the Commission with an explanation for the time taken/required to carry out the assessment."

**The clock starts at "credible grounds to believe", not at confirmation.** Annex D (p.38) puts "**Without delay**" between *data incident suspected* and *data breach confirmed*, and "**Within 30 calendar days**" from confirmation to *determined to be notifiable*.

**Documentation duty** — same section, p.22:

> "To demonstrate that it has taken reasonable and expeditious steps to assess whether the data breach is notifiable, the organisation **must document all steps taken** in assessing the data breach."

…with p.22 footnote 4: "The organisation may be required to produce supporting documentation on the steps taken for its assessment of the data breach as part of its notification to the Commission, or for any investigation by the Commission of a suspected breach."

### 5.2 Notification to the Commission — 3 CALENDAR days

**Breach Guide, "Timeframes for Notification", p.25, verbatim:**

> "Upon determining that a data breach is notifiable, the organisation must notify:
> a. **the Commission as soon as practicable, but in any case, no later than three (3) calendar days**; and
> b. where required, affected individuals as soon as practicable, at the same time or after notifying the Commission."

**Explicitly calendar days, not business days.**

**How the three days are counted** — Breach Guide p.25, footnote 6, verbatim:

> "The first day of the three days starts **on the day after** the organisation makes the determination that there is a notifiable breach. To illustrate, **if an organisation determines on 1st January that a data breach is notifiable, it must notify the Commission by 4th January.**"

**Clock start** — same section, p.25: "These timeframes for notifying the Commission and/or the affected individuals **commences from the time the organisation determines that the data breach is notifiable**."

[KC] ¶20.24 adds: "Prescribing a cap of three (3) calendar days provides clarity for organisations as to the definitive time by which they will have to notify the Commission by."

**Late notification is not a free option** — Breach Guide, "Notification to the Commission", p.27:

> "Where the data breach notification to the Commission is not made within three (3) calendar days of ascertaining that it is a notifiable breach, the organisation **must also specify the reasons for the late notification and include any supporting evidence**. The reasons for the late notification will go toward the gravity of the organisation's contravention of the DBN Obligation and consequently the nature and severity of the penalties imposed on the organisation, if any."

**Channel** — Breach Guide p.26 and Annex D p.38:

> "Submit the notification at **https://eservice.pdpc.gov.sg/case/db**. For urgent notification of major cases, organisations may also contact the PDPC at **+65 6377 3131** during working hours."

**Three calendar days spans a weekend or a public holiday.** An on-call rotation and a named authorised representative must exist **before** the incident. The Guide requires "Contact details of at least one **authorised representative** of the organisation" (p.27), who "need not be the organisation's DPO".

### 5.3 Notification to affected individuals — as soon as practicable, never before the Commission

**Breach Guide, "Timeframes for Notification", p.25:**

> "where required, affected individuals **as soon as practicable, at the same time or after notifying the Commission**."

**There is no fixed day-count for individuals.** The rule is *as soon as practicable*, and *never before* the Commission.

**Breach Guide, "REPORT", p.19:**

> "Section 26D(2) of the PDPA prescribes that organisations must notify affected individuals as soon as practicable, at the same time or after notifying the Commission. However, for data breaches which are likely to **attract widespread public attention and/or interest**, or those which organisations require guidance on notifying the affected individuals, organisations are **strongly encouraged to notify and seek advice from the PDPC first** before notifying the affected individuals."

**Breach Guide, "Notification to Affected Individuals", p.28:**

> "Where the data breach involves **information related to adoption matters or the identification of vulnerable individuals**, organisations should **first notify the Commission for guidance** on notifying affected individuals."

**Minors** — [ST] ¶8.16:

> "In the case of a data breach resulting in significant harm to individuals who are minors, the organisation's obligation to inform the affected data subject **remains, even though the data subject is a minor**. If an organisation proactively informs the minor's parent or guardian of the data breach (if the organisation has the contact details of the parent / guardian), the minor's parent or guardian would be able to take steps to mitigate the harm."

[ST] ¶8.17 flags the sensitive-category cases where the Commission (and the relevant sector regulator) should be asked first — "information laid out in **Parts 1(5), (6) and (23) of the Schedule**" of the PDP (DBN) Regulations 2021.

### 5.4 The exceptions to notifying individuals

**[KC] ¶20.27 — the exceptions excuse ONLY the individual notification, verbatim:**

> "Where an exception applies to a data breach that is likely to have significant harm to the affected individuals, the organisation **need not notify the affected individuals, but it is still required to notify the Commission** of the data breach. In the event that the Commission determines that the exception does not apply, the organisation would be required to notify the affected individuals of the data breach."

**(a) Remedial action** — [KC] ¶20.28:

> "An organisation may rely on the remedial action exception if **timely remedial actions have been taken** by the organisation or its data intermediary, in accordance with any prescribed requirements, that renders it **unlikely that the data breach will result in significant harm** to the affected individual."

¶20.29: "Such remedial actions need not necessarily be taken before notifying the Commission. Remedial actions (or further remedial actions) may also be taken after notifying the Commission and receiving guidance from the Commission."

**(b) Technological protection** — [KC] ¶20.30, verbatim:

> "Where there are appropriate technological measures applied to the personal data (e.g. **encryption, password-protection**, etc) **before the data breach** which renders the personal data inaccessible or unintelligible to an unauthorised party, the exception for technological protection applies. In such cases, the organisation need not notify the affected individuals of the data breach."

**The standard for "appropriate"** — [KC] ¶20.31:

> "In assessing whether the technological protection measures taken are sufficient …, organisations should take into consideration whether the technological protection is of a **commercially reasonable standard and the prevailing industry practices in the sector**. Organisations can also consider the availability and affordability of the options in determining what are reasonable technological protection measures."

The worked example at ¶20.31 treats **AES 256-bit** full-disk encryption on a lost drive as sufficient — "the encryption standard (AES 256-bit) in the storage drive is of a reasonable standard when the loss occurred" — **but the same example still required notification to the Commission** because the data included financial information.

**(c) Prohibition or waiver** — [KC] ¶¶20.32–20.33:

> "Organisations are **prohibited** from notifying the affected individuals if a prescribed law enforcement agency so instructs them… Organisations are also prohibited from notifying the affected individuals if the Commission so directs them."

> "…the Commission may, on the written application of an organisation, **waive** the requirement … in exceptional circumstances where notification to affected individuals may not be desirable."

**If you do not intend to notify individuals, you must say so and say why** — Breach Guide p.27:

> "Where the organisation does not intend to notify any affected individual, the notification to the Commission must **additionally specify the grounds** (whether under the PDPA or other written law) for not notifying the affected individual."

**⚠️ This is the single highest-leverage control in the whole regime.** Encryption **applied before the breach** converts a mandatory mass individual-notification into a Commission-only notification. Encrypting after the fact is **remedial action** (¶20.28) — a different and weaker exception.

**What to check in code:** column-level encryption on identity and financial fields; **whether the key lives outside the database** (a key stored next to the ciphertext defeats the exception); TLS and at-rest encryption on every datastore and bucket; and — critically — **whether the same field exists in plaintext anywhere else**: chat transcripts, prompt/response logs, LLM provider payloads, error-tracker breadcrumbs, CSV exports, generated PDFs, cached client-side query payloads, backups. **Encryption in one table does not earn the exception if a plaintext copy sits in a log.**

---

## 6. Data intermediary obligations

**Breach Guide, Part III, p.21:**

> "Data intermediaries that process the personal data on behalf and for the purposes of another organisation (including a public agency) are also required to notify that other organisation or public agency of a data breach detected."

**The timeframe** — the Breach Guide gives none in text; Annex D (p.38) labels the DI→organisation arrow "**Without delay**". The operative wording is **[KC] ¶20.7, verbatim**:

> "Where a data breach is discovered by a data intermediary that is processing personal data on behalf and for the purposes of another organisation or public agency, the data intermediary is required to notify the organisation or public agency **without undue delay from the time it has credible grounds to believe that the data breach has occurred**. This ensures the organisation is (a) informed of data breaches in a timely way; (b) able to decide on the immediate actions to take to contain the data breach; and (c) able to assess whether the data breach is a notifiable data breach."

**The DI's duty stops there** — [KC] ¶20.8, verbatim:

> "The DBN Obligation **does not impose a requirement on the data intermediary to assess** whether the data breach is notifiable, or to notify affected individuals and/or the Commission. **The organisation that engaged the data intermediary remains responsible for doing so**, even if it enlists the help of a data intermediary to conduct the assessment of the data breach or to notify the affected individuals and/or the Commission on its behalf."

**Contracting duty** — [KC] ¶20.9: "As a good practice, organisations should establish clear procedures for complying with the DBN Obligation when entering into service agreements or contractual arrangements with their data intermediaries."

The minimum transfer-contract clause for an overseas DI is set out at [KC] ¶19.9: "**To notify organisation of data breaches without undue delay**" (see `obligations.md` § Transfer Limitation).

**"Without undue delay" is shorter and vaguer than your own 30 days.** A processor that notifies you on day 20 has probably already breached — and **your own 30-day clock only starts when they tell you**.

**What to check in code / contracts:** for every processor, confirm (1) a **written** processing contract exists — the DI regime only applies "pursuant to a contract which is evidenced or made in writing" ([KC] ¶6.16; [ST] ¶9.2) — and (2) it carries an explicit breach-notification-to-us clause **with a stated period**. Then confirm the notification actually has somewhere to land: a monitored address or webhook your incident runbook can reach. **The vendor never notifies PDPC on your behalf** (¶20.8); a vendor's own regulatory filing does not discharge your obligation.

---

## 7. The C.A.R.E. framework

**Breach Guide, Part II, "Contain, Assess, Report, Evaluate (C.A.R.E)", p.13, verbatim:**

> "Each data breach response needs to be tailored to the circumstances of the incident. Generally, the actions taken in the event of a data breach should follow four key steps (using the acronym of C.A.R.E):
>
> **C**ontain the data breach to prevent further compromise of data and implement mitigating action(s) to minimise potential harms from the breach.
>
> **A**ssess the data breach by gathering the facts and assessing the effectiveness of containment action(s) taken thus far before proceeding to implement full remedial actions. Where necessary, continuing efforts should be made to prevent further harm from the data breach.
>
> **R**eport the data breach to: • The PDPC (mandatory if the breach is a notifiable data breach under the PDPA. Organisations may inform PDPC of the breach voluntarily); and/or • The affected individuals (if required under the DBN Obligation).
>
> **E**valuate response to the data breach and consider the actions which can be taken to prevent future data breaches."

**CONTAIN — the required initial appraisal** (Breach Guide p.14), verbatim:

> "Cause of the data breach and whether the breach is still ongoing / Number of affected individuals / Type(s) of personal data involved / The affected systems, servers, databases, platforms, services etc. / Whether help is required to contain the breach / The remediation action(s) that the organisation has taken or needs to take to reduce any harm to affected individuals resulting from the breach"

**Named containment actions** (Breach Guide p.15): isolate the compromised system from the Internet/network; re-route or filter network traffic, firewall filtering, closing particular ports or mail servers; "Prevent further unauthorised access to the system. **Disable or reset the passwords of compromised user accounts**"; isolate the causes and change access rights; stop the identified practices; establish whether lost data can be recovered.

**Incident Record Log** (Breach Guide, "CONTAIN", p.15):

> "The details of the data breach (such as summary of the incident and chain of events) and post-breach response(s) should be recorded in an **Incident Record Log**. Organisations may also wish to obtain **forensic copies and logs** of the affected IT systems for follow-up investigations, incident resolution and legal proceedings purposes."

**EVALUATE** (Breach Guide p.19) includes root-cause analysis, a prevention plan, audits to ensure the prevention plan is implemented, policy review, changes to employee selection and training, and "**A review of data intermediaries involved in the data breach**".

**Voluntary notification is a mitigating factor** (Breach Guide, "REPORT", p.18):

> "Organisations may choose to voluntarily notify the PDPC even if they assess that the data breach is not a mandatorily notifiable one under the PDPA… As such, the PDPC may consider **voluntary notifications as a mitigating factor** when considering the appropriate enforcement actions to undertake."

**What to check in code:** C.A.R.E. maps to concrete engineering capabilities.

- **Contain** requires a **kill switch**. Can you, *without a deploy*: revoke all sessions, force a password/OTP reset, rotate an API key, disable a share link, and revoke a presigned URL? Check every bearer-token surface — impersonation cookies, chat/share short codes, drive share links, activation tokens.
- **Assess** requires the six appraisal facts above to be answerable from telemetry.
- **Report** requires a pre-templated notification (see §8) and a named authorised representative.
- **Evaluate** mandates a **documented vendor review** — so the processor register must exist before the incident, not after.

---

## 8. What logging must exist for a breach to be assessable at all

This is the strictest engineering requirement in the entire Guide, and it is imposed indirectly — through the facts you are **required to supply** in the notification.

**Mandatory notification content** — Breach Guide, "Notification to the Commission", p.26, verbatim:

> "The date on which and the circumstances in which the organisation first became aware that a data breach has occurred; Information on **how** the notifiable data breach occurred; **The number of affected individuals** affected by the notifiable data breach; **The personal data or classes of personal data** affected; and The potential harm to the affected individuals…"

…and, also mandatory (p.26):

> "**A chronological account of the steps taken by the organisation** after the organisation became aware that the data breach had occurred, including the organisation's assessment under section 26C(2) or (3)(b) of the PDPA that the data breach is a notifiable data breach"

**Monitoring** — Breach Guide, "Monitoring by Organisations", p.8:

> "Monitoring should be done by both regular management oversight and using of monitoring tools. **Logs from operating systems, applications and network devices should be regularly reviewed for anomalies** and can help to identify malicious attacks on systems."

**Named tooling** (Breach Guide p.9): "Monitoring of inbound and outbound traffic for abnormal network activities of websites and databases. / Usage of real-time intrusion detection software designed to detect unauthorised user activities, attacks and network compromises. / Usage of security cameras for monitoring of internal and external perimeters of secure areas such as data centres and server rooms."

### The requirement, restated as an engineering checklist

To answer *"which personal data classes, for how many individuals"* you need **both**:

1. **A data inventory** mapping tables and columns to the prescribed categories in §3.2. Without it, the second mandatory field is unanswerable.
2. **Access and audit logging with row-level scope.**

**What to check in code:**

| Requirement | Concrete check |
|---|---|
| Answerable "how many individuals" | Do server actions / API routes record **subject identifier + resource + row count**, or only a route name? Do ownership joins let you scope which rows a query touched? |
| Answerable "which data classes" | Does a data inventory exist, mapped to §3.2? Is it maintained, or a one-off spreadsheet? |
| PII **reads**, not just writes | Is there a polymorphic audit table covering reads of personal data? Most audit implementations log mutations only. |
| Object storage | Are object reads logged? A downloaded identity document is a read, not a write. |
| Database | Are statement or audit logs on? |
| **Retention ≥ the assessment window** | **30 calendar days is generous only if you can reconstruct history.** If application, DB, or access logs roll at 7 or 14 days you **cannot complete a lawful assessment**. Check hosting log-drain retention, Postgres/managed-DB audit or statement logging, object-storage access logging, and error-tracker retention. Realistically you want longer than 30 days, because the clock starts at *credible grounds to believe*, which may be well after the event. |
| Tamper-evidence | Are logs immutable enough to support a "chronological account" the Commission will accept? |
| **Logs are themselves in scope** | A log containing an NRIC, a full name + financial field, or a session token is a **category-(a)/(b) store in its own right** — breaching *it* is notifiable. Check log access control and log retention as you would a database table. |
| Pre-templated notification | Are the p.26 fields captured somewhere a responder can fill in fast, with a named authorised representative and the eservice URL? |
