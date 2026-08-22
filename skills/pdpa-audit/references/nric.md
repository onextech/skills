# NRIC, FIN and national identification numbers

Two documents govern, both still operative and both self-declared pending update:

- **Advisory Guidelines on the PDPA for NRIC and other National Identification Numbers**, issued **31 August 2018**, 14 pages — cited `AG <para>`.
- **Technical Guide to Advisory Guidelines on the PDPA for NRIC and other National Identification Numbers** — no printed issue or revision date anywhere in 28 pages; only `Copyright 2019`. PDPC's live listing dates it **14 Dec 2024**. No paragraph numbering — cited `TG p.<printed page>, "<SECTION HEADING>"`.

---

## 1. Lead with the deadline: NRIC must stop being an authentication factor

### 1.1 The hard date

PDPC publishes a live page titled:

> **"Organisations to cease the use of NRIC numbers for authentication by 31 December 2026"**
> https://www.pdpc.gov.sg/media-events/organisations-to-cease-the-use-of-nric-numbers-for-authentication-by-31-december-2026

This converts advisory language into a **dated compliance obligation inside the current year**. It is separate from the question of whether NRIC may be *stored* — the deadline is about **using it to authenticate**.

### 1.2 The standing cover notice on BOTH PDFs, verbatim

> "In light of the MDDI statement on 13 Dec 2024 outlining the appropriate use and mis-use of NRIC numbers, these Advisory Guidelines will be updated. In the meantime, these guidelines remain valid.
> **The PDPC advises against the use of NRIC numbers by individuals as passwords and the use of NRIC numbers by organisations to authenticate an individual's identity or set default passwords.** For more information, please refer to PDPC's statement of 14 Dec 2024."

The Technical Guide carries the same banner with dates written out in full ("13 December 2024" / "14 December 2024").

Two consequences:
1. Both PDFs **remain the operative text** ("these guidelines remain valid").
2. A separately-sourced rule now rides on top: **NRIC must never be a password, a default password, or an authentication factor.**

> **Outside the corpus:** the MDDI statement of 13 Dec 2024 and the PDPC statement of 14 Dec 2024 are **not held**. Only the cover banners' quotation of them is available. Do not attribute further detail to those statements.

### 1.3 Grep targets — the authentication surface

Look for NRIC (**and FIN, work permit, birth certificate and passport numbers**) used as:

| Use | Where it hides |
|---|---|
| A **login factor** | auth flow, SSO bridge, legacy login, admin back-door |
| An **OTP or identity challenge** | "confirm your NRIC to continue", step-up auth, phone-change flow |
| A **password or default-password seed** | user provisioning, bulk import, account-reset scripts, seed/fixture files |
| A **"verify it's you" support check** | support console, impersonation entry, call-centre script, in-app help flow |
| A **record key** | see §5 below — a key is a de-facto authenticator whenever knowing it grants access |

Concretely, grep for any code path where an NRIC value is **compared against user input**, written into a password field, used as an answer to a security question, or accepted as proof of identity. The likely sites in a property platform are the AML/KYC flow, form-assist prefills, and any client-identity confirmation step.

**This is also the document most likely to change under you.** PDPC states on the cover that the guidelines will be updated; no reissue has happened as at 21 Aug 2026.

---

## 2. Scope — which identifiers are covered

**AG 1.4, verbatim:**

> "These Guidelines clarify how the Personal Data Protection Act 2012 ('PDPA') applies to organisations' collection, use and disclosure of NRIC numbers (or copies of NRIC), and retention of physical NRICs by organisations. Under the updated Guidelines, organisations are generally not allowed to collect, use or disclose NRIC numbers (or copies of NRIC). **The treatment for NRIC numbers also applies to Birth Certificate numbers, Foreign Identification Numbers ('FIN') and Work Permit numbers, collectively referred to in these Guidelines as 'other national identification numbers'.**"

AG 1.4 footnote 2: "To be clear, 'NRIC' refers to both **pink and blue** NRIC."

**The four covered types are: NRIC number, Birth Certificate number, FIN, Work Permit number.**

**Passport numbers are handled separately and are NOT inside that collective definition.** AG 1.5, verbatim:

> "While passport numbers are periodically replaced, they too are important identification numbers that can serve the same purposes as the NRIC, FIN, Work Permit and Birth Certification numbers. Therefore, organisations should accord passports **similar treatment** as that for NRICs, i.e. refrain from collecting passport numbers. If there is a need to collect passport numbers, organisations should **limit their collection to partial passport numbers** and ensure an appropriate level of security to protect the passport numbers collected."

**The physical-document rule reaches wider than the number rule.** AG 1.6: "The treatment for retention of physical NRIC applies to other identification documents containing the NRIC numbers or other national identification numbers (e.g. **driver's licence, passport and work pass**)."

**Public agencies are out of scope** (AG 1.7), including organisations acting on behalf of a public agency.

The Technical Guide's scope note (TG p.4) covers the same four types and **does not mention passports** — a remit difference, not a contradiction. **Cite AG 1.5 for passport fields, not the TG.**

**Why NRIC gets special treatment** (AG 1.3): "As the NRIC number is a **permanent and irreplaceable identifier** which can potentially be used to unlock large amounts of information relating to the individual, the collection, use and disclosure of an individual's NRIC number is of special concern."

**What to check in code:** an audit that greps only for `nric` misses the scope. Sweep the schema and codebase for `nric`, `fin`, `work_permit`, `workpermit`, `birth_cert`, `birthcert`, `bc_no`, `passport`, `id_no`, `identity_no`, `ic_no`, `identification_number`, and any single `identity` / `id_document` column storing a mixed-type identifier. **A column named `id_number` holding "whatever ID the client gave us" is in scope for the strictest of the types it can hold.**

---

## 3. The core prohibition and the two permitted bases

**AG 3.1, verbatim — this is the operative rule:**

> "Organisations are **generally not allowed** to collect, use or disclose NRIC numbers (or copies of NRIC). They may do so only in the following specified circumstances:
>
> a) Collection, use or disclosure of NRIC numbers (or copies of NRIC) is **required under the law** (or an exception under the PDPA applies); or
>
> b) Collection, use or disclosure of NRIC numbers (or copies of NRIC) is **necessary to accurately establish or verify the identities of the individuals to a high degree of fidelity**."

Restated at AG 2.1: "Where organisations are permitted to collect NRIC numbers of individuals, they will nevertheless have to comply with the Data Protection Provisions under the PDPA."

### 3.1 Basis (a) — required under the law

AG 3.2: an organisation may collect/use/disclose without consent if required under the law; "As good practice, organisations should still notify the individual of the purpose."

AG 3.10 adds the PDPA-exception limb: "there could be situations where there is an applicable exception under the Second, Third or Fourth Schedule of the PDPA such that the consent of the individual … is not required. Nonetheless, organisations must still ensure that its conduct is reasonable in the circumstances."

**PDPC's own acceptable examples all cite an instrument by number:**

| Para | Scenario | The legal hook PDPC names |
|---|---|---|
| AG 3.4 | GP clinic registration | "regulations 12(1) and (1A)(a) of the Private Hospitals and Medical Clinics Regulations" |
| AG 3.5 | Hotel check-in | "regulation 27(1) of the Hotels Licensing Regulations … Regulation 27(3)" |
| AG 3.6 | Mobile line subscription | licences under "S(5) of the Telecommunications Act" |
| AG 3.7 | Massage establishment client register | "R14 of the Massage Establishments Rules 2018" |
| AG 3.8 | Private education institution enrolment | "regulation 21(1)(c)(ii) of the Private Education Regulations" |
| AG 3.9 | New employee onboarding | "section 95 of the Employment Act" |
| AG 3.11 | Emergency disclosure of an unconscious patient's data | "Paragraph 1(b) of the Fourth Schedule of the PDPA" |

**None of the seven is estate agency work.** The document nowhere names a statute requiring a property agent or agency to collect NRIC.

**AG 3.9 is the structural template worth copying.** The job application form does **not** ask for NRIC; NRIC is collected only once the organisation decides to hire. PDPC's verdict: "**There is no requirement under the law to ask for NRIC numbers for the purpose of job applications.**" Same identity, same relationship — but collected only after it crosses from *applicant* to *engaged*.

**What to check in code:** for every NRIC-collecting surface, a **named written law or licence condition** recorded somewhere a reviewer can see — code comment, config, policy doc. Grep the collection points (form field, API body, `INSERT`) and ask *which statute?* "The client's lawyer asked for it" and "the developer's form template has always had it" are not basis (a).

### 3.2 Basis (b) — high degree of fidelity

AG 3.12: "Where an organisation finds it necessary to accurately establish or verify the identity of the individual to a high degree of fidelity, it may collect, use or disclose his or her NRIC number **with notification and consent**."

**AG 3.13, verbatim, both limbs:**

> "PDPC would generally consider it necessary to accurately establish or verify the identity of individual to a high degree of fidelity in the following situations —
>
> a) Where the failure to accurately identify the individual to a high degree of fidelity may **pose a significant safety or security risk**. For example, visitor entry to preschools where ensuring the safety and security of young children is an overriding concern; or
>
> b) Where the inability to accurately identify an individual to a high degree of fidelity may **pose a risk of significant impact or harm to an individual and/or the organisation (e.g. fraudulent claims)**. Such transactions typically relate to healthcare, financial or **real estate matters, such as property transactions**, insurance applications and claims, applications and disbursements of substantial financial aid, background credit checks with credit bureau, and medical check-ups and reports."

Footnote 14 to AG 3.13 defines the harm: "For example, reputational, financial, personal or proprietary damage."

**The limit, and the justification duty** (AG 3.14):

> "The above are illustrative and not intended to be exhaustive… Organisations should assess whether their specific situation meets the above considerations before collecting the individual's NRIC number (or copy of NRIC). In collecting the NRIC number (or copy of NRIC), organisations **should be able to provide justification on request of either the individual or the PDPC** as to why the collection, use or disclosure … is necessary to accurately establish or verify the identity of the individual to a high degree of fidelity."

AG 3.16 confirms consent is then generally reasonable to require — subject to footnote 16, which quotes **s 14(2)(a)**: organisations must not, as a condition of providing the product or service, require consent "beyond what is reasonable to provide the product or service."

**Basis (b) attaches to a TRANSACTION, not to a CONTACT RECORD.**

---

## 4. The real-estate line-drawing

Three paragraphs, read together, draw the only line the corpus supports.

| Paragraph | Scenario | Which side |
|---|---|---|
| **AG 3.13(b)** | "real estate matters, such as **property transactions**" named as a *typical* high-fidelity transaction | ✅ Supports NRIC on a **transaction file** |
| **AG 5.9** | Establishing the identity of **visitors to a private condominium** (MCST, resident security) | ❌ Unacceptable to collect **full** NRIC. PDPC's recommended design: "checking a visitor's NRIC or other photo identification to record the visitor's **full name, partial NRIC number (i.e. last 3 numerical digits and checksum), contact details (e.g. mobile number) and/or vehicle registration number**." Plus: adopt "a visitor management system that stores such information electronically and is **protected by passwords** instead of an open visitor log book." Plus a retention duty: "The MCST must also **cease to retain the NRIC number, or to remove the means by which the NRIC number can be associated with a particular individual, as soon as the purpose … is no longer served** by its retention, and retention is no longer necessary for business or legal purposes." |
| **AG 5.10** | Visitor badges at a **secured data centre** — what it takes to flip to full NRIC | ✅ but only with "a **specific, articulable** significant security risk" (critical information infrastructure) **and** a documented justification available to PDPC on request. Even then: "As the retention of physical NRIC for entry into Data Centre DEF is not required under any law, Data Centre DEF **should not retain visitors' physical NRICs as collateral** for the visitor badges." |
| **AG 3.9** | NRIC collected only on hire, never on application | ✅ **The structural template.** Collect at the point the relationship changes, not before. |

### The net rule

**The transaction can justify NRIC. The enquiry, the viewing sign-in and the prospect record cannot.**

- ✅ **OTP / S&P / lease execution / AML check** → AG 3.13(b) territory, with a recorded justification per AG 3.14.
- ❌ **Enquiry form, registration, showflat/viewing sign-in, mailing list, prospect record** → AG 5.5–5.9 territory. PDPC has pointed at **partial NRIC** for exactly this class of use, and "it's a nice condo" does not reach AG 5.10's bar.

Other unacceptable examples worth recognising by shape: capping free-parking redemptions (AG 5.5 — use "name, partial NRIC number, vehicle number or mobile phone number"); verifying a movie-ticket collector (AG 5.6 — use "a booking reference number or an SMS confirmation"); retail membership sign-up and lucky draws (AG 5.7 — "mobile numbers, email address, user-generated identifier or partial NRIC number"); registering interest in an upcoming product or submitting feedback (AG 5.8 — "names and contact details"); holding a physical NRIC as rental collateral (AG 5.11 — use "a monetary deposit of a reasonable amount … tracking devices or mobile apps").

**Tenancy and lease NRIC collection: NOT ADDRESSED IN EITHER DOCUMENT.** There is no tenancy/lease example and no named statute for landlord or tenant NRIC. **Do not represent tenancy as covered either way.** (The sector guidelines are no help here either — Real Estate §§2.3, 3.6, 3.16 mention NRIC only incidentally as an item the sector happens to hold.)

**What to check in code:** map every NRIC **write site** onto the two columns above. The audit question is not "does this app store NRIC?" but "**at what point in the lifecycle does the NRIC row get written, and is a real transaction underway at that point?**" A nullable `nric` column on a generic `client` table that any agent can fill in at first contact is the failure mode. Check `NOT NULL` and required-field validation too: making NRIC mandatory to create a *contact* runs straight into s 14(2)(a) via AG 3.16 fn 16.

---

## 5. Partial NRIC — the exact permitted form

**AG 5.2, verbatim (emphasis as printed):**

> "PDPC recognises that organisations may wish to collect partial NRIC number when other alternatives are not satisfactory. PDPC considers that organisations that collect partial NRIC number **up to the last 3 numerical digits and checksum** of the NRIC number (e.g. '**567A**' from the full NRIC number of '**S1234567A**') in this manner would not be considered to be collecting the full NRIC number, and therefore not subject to the treatment for NRIC numbers set out in these guidelines."

Note "**up to**": 3 digits + checksum is the *maximum*, not a mandated fixed length. AG 5.7 and AG 5.9 restate it as "(i.e. last 3 numerical digits and checksum)".

**Partial NRIC is still personal data** (AG 5.3):

> "To be clear, partial NRIC numbers **are considered personal data** under the PDPA to the extent that an individual can be identified from the partial NRIC number, or from the number and other information to which the organisation has or is likely to have access. The risks associated with the permanent and irreplaceable nature of the NRIC and the potential to unlock large amounts of information relating to the individual are diminished but still exist… Organisations that collect partial NRIC numbers **must still comply with the Data Protection Provisions** of the PDPA, such as making reasonable security arrangements to protect the data…"

### 5.1 The AG / TG wording tension

| | Wording | Worked example |
|---|---|---|
| **AG 5.2** | "**up to** the last 3 numerical digits and checksum" | `567A` from `S1234567A` |
| **TG p.13 / p.23** | "the **last 3 digits + last alphabet**" | `567A` if the NRIC is `S1234567A` |

The worked example is byte-identical, so "checksum" (AG) and "last alphabet" (TG) denote the same character. **Substance agrees; the AG's "up to" is looser** — it permits *less* than 3 + checksum, while the TG describes the maximum as the norm. **Where they differ in strictness, the AG governs**: the Technical Guide is subordinate by its own title ("Technical Guide **to** Advisory Guidelines").

**The TG adds a requirement the AG does not.** TG p.13 says the partial NRIC is used "**in combination with other strings of data**" — "the first part of email address, partial mobile number of an individual, etc." — and requires a uniqueness check on the **combination**. So "replace the NRIC column with a 4-character partial" is not, on its own, the TG's design; the identifier is the combination. The AG's own examples (5.7, 5.9) likewise pair partial NRIC with name and a contact or vehicle number.

**What to check in code:** verify the **stored data**, not the column comment. Run a length/shape query — does the "partial" column hold `567A`-shaped values, or full `S1234567A` values because a validator was never added? That is the common real-world failure. Then confirm it is the **tail**: storing the prefix (`S123`) is **not** what AG 5.2 permits. And do not let "we only store partial" be treated as "we store nothing sensitive" — AG 5.3 keeps access control, protection, retention limits and breach obligations attached.

### 5.2 Alternatives PDPC names

AG 5.1: "PDPC does not prescribe the types of identifiers that organisations should adopt in place of NRIC numbers… Some alternatives that have been adopted by organisations include **organisation or user-generated ID, tracking number, organisation-issued QR code, or monetary deposit**. Organisations should also consider whether the alternatives provided are reasonable, and **avoid collecting excessive personal data as an alternative** to the individual's NRIC number."

The TG catalogues six, each with New Systems / Existing Systems checklists (TG pp.8–13): **user-selected identifier**; **organisation-selected identifier** — "**Ideal for organisations that use the NRIC number internally**"; **email address** (double entry without cut-and-paste, uniqueness, confirmation link); **mobile number** (OTP validation, uniqueness, and "**Provide functions/processes to handle cases where a new user has the mobile number of an existing user**" after telco reassignment); **combination of identifiers** ("Combination should not contain sensitive personal information"); and **partial NRIC**.

**Criteria for the replacement identifier** (TG p.6), verbatim:

> "• Be easily remembered by the individual
> • Be unique to each individual
> • Does not contain sensitive information
> • Cannot be easily guessed by others"

For a CRM where the **agent** is the user and the **client** is the record, the TG points at option 2 (organisation-selected identifier) — "ideal for organisations that use the NRIC number internally". If the client record already has a stable surrogate key, the NRIC column becomes pure payload that can then be scoped, minimised, or deleted.

---

## 6. Copies, scans and sightings

**A copy of the NRIC is legally worse than an NRIC string.** AG 3.15, verbatim:

> "Organisations should note that when they collect a copy of the NRIC, they are considered to have collected **all the personal data on the NRIC**, and will be subject to the Data Protection Provisions of the PDPA for that collection. Organisations should assess whether they are collecting **excessive personal data** contained in the copy of the NRIC for the intended purpose, and if they could adopt alternatives…"

AG 1.3 says what that means concretely: the physical NRIC contains "the individual's full name, photograph, thumbprint and residential address."

**Physical NRIC retention** (AG 4.1 — the entire content of section 4):

> "Given the importance of the NRIC as a national identification document … and the impact to the individual should the physical NRIC be misplaced, stolen or used for illegal activities such as identity theft and fraud, organisations should **generally not retain an individual's physical NRIC** unless the retention of the physical NRIC is required under the law."

**A sighting is not a collection** (AG 5.12):

> "In certain circumstances, an organisation may merely have sight of an individual's physical NRIC and the information on it for verification purposes. Where there was **no intention to obtain control or possession** of the physical NRIC … and **no personal data will be retained** once the NRIC is returned immediately to the individual, PDPC does not consider it a collection of personal data on the physical NRIC."

AG 5.13 applies it: a cashier asking to see an identification document to verify age is a sighting, "As there are no other viable alternatives".

Scanning is endorsed as a **security** measure (AG 2.4, last sentence): "Organisations may wish to consider employing technological solutions, such as scanning of physical NRICs into software systems to capture NRIC numbers and store the data in a secure manner."

**What to check in code:** grep the storage layer for upload paths whose category, folder name, or document-type enum includes identity documents — `nric`, `ic_copy`, `identity_doc`, `kyc`, `aml`, `id_front`, `id_back`. Then: are those objects in the same bucket and ACL as marketing collateral? Do they get a signed URL with a long TTL? Are they ever attached to an outbound email or WhatsApp message? And ask whether the workflow could have been a **sighting** instead — a "tick to confirm agent sighted NRIC" checkbox is a compliant design that stores **no personal data at all**.

---

## 7. NRIC as a database key

**The general rule** (TG p.6, "INTRODUCTION"):

> "The NRIC number of an individual is considered personal data as it can be used to identify the individual, and can be used to access large amounts of information relating to the individual … **Organisations should thus avoid the use of NRIC numbers as user names or unique identifiers in their applications, websites or public-facing systems.**"

**The primary-key section** (TG p.21, "REPLACING THE PRIMARY KEY"), verbatim:

> "The primary key is a unique identifier for each record in a database, and is used by the database to link records together… Although most systems use a database-generated unique value as the primary key, **some organisations have been using the NRIC number as a primary key instead**."
>
> "Some suggestions and considerations for organisations who are replacing the NRIC number as the primary key in their databases include:
> • **Use a database-generated primary key value.** The database will automatically ensure that all primary key values are unique.
> • If the organisation wishes to use values other than the database-generated value, then the new primary key should ideally be a value that will not change over time.
> • Prior to changing the primary key, organisations should **identify all records that use the primary key** and plan carefully for these records to be updated with the new primary key. An update to the primary key can lead to the update of potentially a lot of database tables.
> • Organisations should also make the necessary enhancements to the systems and applications that use the database, **e.g. CRM system**, to ensure that the new primary key does not affect the functionalities of these systems and applications.
> • When changing the primary key, organisations should utilise built-in database functions wherever possible."

**The Technical Guide names "CRM system" explicitly** as the class of downstream application that must be updated when the NRIC primary key is replaced.

**What to check in code:** inspect the schema for NRIC in a **key position**, not just as a data column — `PRIMARY KEY`, `UNIQUE` constraints, `REFERENCES` targets, composite `ON CONFLICT` targets, index definitions, and join predicates. In Postgres:

```sql
-- any constraint whose definition mentions an NRIC-ish column
SELECT conrelid::regclass AS tbl, conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE pg_get_constraintdef(oid) ~* '(nric|\yfin\y|passport|work_?permit|ic_no|identity)';

-- any index on an NRIC-ish column
SELECT tablename, indexname, indexdef FROM pg_indexes
WHERE indexdef ~* '(nric|\yfin\y|passport|work_?permit|ic_no|identity)';
```

Then grep the query layer for the same thing: `WHERE nric =`, `ON CONFLICT (nric)`, `findBy…Nric`, upsert targets, dedup logic, external-system correlation IDs, and cache / React Query keys built from an NRIC value. **A surrogate `id` column does not clear the check if an NRIC `UNIQUE` constraint is still the de-facto join or dedup key.**

---

## 8. Barcodes, scanning and SG-Verify

**TG p.23, "SCANNING OF NRIC NUMBERS"**, verbatim:

> "While using barcode scanners to scan NRIC numbers is more efficient than manual input, organisations should take care to ensure that **complete NRIC numbers are not stored permanently**."
>
> "This section describes some considerations for organisations when building systems that scan NRIC/FIN barcodes from physical documents containing NRIC/FIN barcodes (e.g. identity card, work permit, driver's licence, etc). Examples of such systems include **visitor access or building management systems**."
>
> "• When a barcode scanner scans the barcode on an NRIC card, it will typically send the complete NRIC number to the system. Organisations should thus ensure that the system does **not permanently store** (e.g. in a database) the scanned NRIC number.
> • **Convert the scanned NRIC number to a final format, immediately after scanning.** The NRIC number can be stored permanently after conversion.
> • **Final formats may include partial NRIC number (last three digits + last alphabet), masked NRIC number (only showing last three digits + last alphabet) or hashed NRIC number. The complete NRIC number should not be stored.**"

**Encoding an NRIC into an organisation-generated QR code: NOT ADDRESSED IN EITHER DOCUMENT.** The TG mentions QR codes only in the SG-Verify context (an individual scanning a GovTech QR with SingPass). AG 5.1 separately lists "organisation-issued QR code" as an NRIC *alternative*.

**SG-Verify** (TG p.25) is the endorsed collection channel — but note the conditional:

> "**SG-Verify provides an alternative means for organisations permitted to collect NRIC numbers to do so safely. For organisations that are not permitted to collect NRIC numbers but choose to use partial NRIC numbers as identifiers, they should ensure that their systems only store the partial NRIC numbers provided by SG-Verify.** The use of SG-Verify removes the need for the handling and sighting of physical identification documents such as physical NRICs."

**SG-Verify does not grant permission to collect.** If the codebase integrates SingPass / MyInfo / SG-Verify, check **what the integration persists** from the response payload versus what it merely displays.

---

## 9. Masking, truncation, and the hashing point

Four distinct states — check them separately, because "masked" is frequently a **display-layer transform over a full plaintext column**:

| State | Source | Note |
|---|---|---|
| **Plaintext** | — | The default failure state. |
| **Truncated / partial** | AG 5.2; TG p.13 | Tail only: last 3 digits + checksum. |
| **Masked for display** | TG p.15; TG p.23 | Defined as "only showing last three digits + last alphabet". **Display-layer only — says nothing about what is at rest.** |
| **Hashed** | TG p.23 | See below. |
| **Encrypted** | — | **NOT ADDRESSED IN EITHER DOCUMENT.** See §11. |

**On-screen display** (TG p.15, "Preparation"): "Look for screens or online forms where the NRIC number is displayed, and **consider whether it is required**. For cases where the display is absolutely necessary, organisations should consider **displaying masked NRIC numbers** instead."

### 9.1 What the Technical Guide says about hashing — the complete treatment

**TG p.23, verbatim:**

> "• Hashing refers to converting the NRIC number to another string of text, by applying a cryptographic hashing algorithm. **Hashed NRIC numbers will be unique, and cannot be converted back to actual NRIC numbers.**
> • When a visitor's NRIC barcode is scanned, the system can create a hash of the NRIC number, and then compare the hashed NRIC number against the existing hashed NRIC numbers in the database. The visitor's record can then be retrieved this way."

**That is the entirety of it.** The Technical Guide contains **no** caution about the NRIC's search space, no mention of brute-force or rainbow-table attack, no mention of salting, peppering, key-stretching, HMAC, or slow KDFs, and no guidance on algorithm choice beyond "a cryptographic hashing algorithm".

### 9.2 The engineering caveat

> **Outside the corpus — this critique does NOT come from the PDPC documents and must be labelled as such in any audit output.**
>
> The NRIC keyspace is small and fully enumerable, so an **unsalted, unkeyed hash of an NRIC is reversible by exhaustive search in practice**. TG p.23's claim holds for a general-purpose secret; it does not hold for a short, structured identifier. Note further that the TG's own design at p.23 **requires determinism** — it hashes a scanned NRIC and looks the hash up in the database — which rules out per-record random salts for that lookup pattern, and that determinism is precisely the property that makes the plain-hash approach enumerable.
>
> **Recommendation (outside the corpus):** a keyed construction — HMAC with a secret held outside the database — or encryption with the key held outside the database.

**How to report it.** Where a codebase relies on "we only store the hash", record it as **conforming to the letter of TG p.23 but inadequate as a security control**, quote TG p.23 so the reader can see what PDPC actually wrote, and attach the caveat under an explicit `> **Outside the corpus:**` marker. Do not present the caveat as PDPC's position. Do not silently omit the quote.

**What to check in code:** determine which of the states above the codebase is actually in. Grep for the display transform (`slice(-4)`, `substring`, `replace(/.../, '*')`, `maskNric`) and confirm whether the **stored** value is full or partial. If hashing is present, check for a salt or key, the algorithm, and whether lookup is by hash equality (which implies determinism).

---

## 10. Migrating away from NRIC — the Technical Guide checklists

The TG's largest contribution, and a remediation plan you can lift directly. Framing (TG p.15): the replacement process "can be divided into three separate phases: 1. Preparation 2. Implementation 3. Post-Implementation… **The steps are not exhaustive and may not apply to all organisations.**"

### Preparation (TG pp.15–16), verbatim

> "Choose the NRIC number replacement, and ensure that it meets the key considerations mentioned in the Introduction."
> "Plan the implementation timeline, e.g. design changes to the system, system testing, notifying users, changeover period."
> "Plan the steps that users will take when they replace their NRIC number with the new user name…"
> "Look for screens or online forms where the NRIC number is displayed, and consider whether it is required. For cases where the display is absolutely necessary, organisations should consider displaying masked NRIC numbers instead."
> "Plan and design the changes to the system, e.g. new database fields for the identifier, new forms for users to enter their username, updated forms with the NRIC number removed. **Plan and design the changes required for other systems and processes that rely on the NRIC number as a unique identifier.**"
> "Perform thorough system and user testing…"
> "**Make a backup of all affected data.**"
> "Notify and educate affected parties within the organisation, e.g. customer service…"
> "Plan when and how to notify users e.g. by announcement after they log in."
> "Ensure that the system has sufficient capacity to handle any increase in usage."

### Implementation (TG p.16), verbatim

> "Ensure that all user queries are answered promptly and clearly. Provide processes to assist those users who have difficulties, including procedures to verify the identity of users."
> "Address feedback provided by users."
> "Check that users' alternate identifiers are recorded and assigned correctly."
> "Monitor the number of users who have replaced their NRIC number and remind those who have not."
> "Plan the processes for handling users who could not be contacted, or who could not provide their alternate identifiers during the implementation period."
> "**Ensure that related systems that depend on the NRIC number have also been enhanced to handle the alternate identifier.**"

### Post-Implementation (TG p.17), verbatim

> "Remind users of the new identifier, and that their NRIC numbers are no longer used as the identifier."
> "**Conduct a review to determine whether the NRIC numbers are still required in the system as well as in the organisation.**"
> "**If not required, remove the NRIC numbers from the system.**"
> "Disable user accounts that do not have replacement identifiers."
> "Put up a notice on the website/system, to notify users who did not change their identifiers that their accounts have been disabled…"

### Database-level migration (TG p.19), verbatim

> "• Create test databases for testing of scripts, functions and processes.
> • **Identify all the database locations where NRIC numbers are stored.**
> • Consider whether to create new database fields for the replacement identifier, or to replace existing NRIC numbers in their current fields.
> • Create database scripts, or programs, to perform the replacement.
> • Test these scripts on the test database to ensure that the replacement identifiers are assigned to the correct user.
> • **Create backups of the database before running the actual replacement.**
> • Consider when to delete the backups, after the actual replacement is completed…
> • **When deleting backups, perform the deletion securely.** Please refer to Section 8 of PDPC's 'Guide to Securing Personal Data in Electronic Medium' for more information."

**What to check in code:** "**Identify all the database locations where NRIC numbers are stored**" is the step teams skip. Sweep beyond the obvious column: denormalised copies, JSON/JSONB payloads, snapshot and audit tables, generated PDFs and exports, form-draft payloads, message and notification payloads, analytics events, prompt/response logs, embedding indexes, seed and fixture files, and **database backups** — TG p.19 makes the backup an explicit deletion target. Note the reverse risk too: "remove the NRIC numbers from the system" is a destructive migration; verify a backup step exists and that the backup is itself scheduled for secure deletion.

---

## 11. Supporting obligations, and the "greater level of security" standard

- **AG 2.2** — "the PDPA requires organisations to develop, implement and **regularly review** their policies and practices that are necessary to meet their obligations under the PDPA."
- **AG 2.4 — Protection**, the key sentence: "Given the risks and potential impact of any unauthorised use or disclosure of personal data associated with the individual's NRIC number, organisations are expected to provide a **greater level of security** to protect NRIC numbers (or copies of NRIC) in the possession or under the control of the organisations."
- **AG 2.5 — Retention**: "organisations must cease to retain documents containing personal data, or to remove the means by which the personal data can be associated with particular individuals, as soon as the purpose … is no longer served … The PDPA does not prescribe a specific retention period… Organisations should **regularly review** the NRIC numbers (or copies of NRIC) in their possession … and **should not keep the data 'just in case'** when it is no longer necessary."
- **AG 2.7** — "Organisations that collect, use or disclose NRIC numbers (or copies of NRIC) should ensure that their **policies specifically address the need to do so** and that their processes are designed to ensure that these NRIC numbers (or copies of NRIC) are sufficiently protected."

**AG 2.4's standard is comparative.** NRIC must be protected **more strongly than the app's ordinary personal data**, not merely the same. If `nric` sits in the same table, with the same column type, the same role grants, and the same log verbosity as `email`, the codebase has **no evidence** of meeting AG 2.4.

**Where the technical detail lives.** The TG deliberately delegates encryption, access control and logging to *Guide to Securing Personal Data in Electronic Medium* (TG p.19, p.27) and Key Concepts Ch. 17–19 (TG p.27). Neither of those detailed sources is in this corpus — **do not invent their contents.**

---

## 12. Recorded as NOT ADDRESSED

Carry these forward as-is. Absence of a finding in the PDFs is not absence of risk — report them as *"not specified by PDPC; assessed under AG 2.4's greater-level-of-security standard"*, never as *"PDPC requires…"*.

| Topic | Status |
|---|---|
| **Tenancy / lease NRIC collection** | **NOT ADDRESSED IN EITHER DOCUMENT.** No tenancy example, no named statute for landlord or tenant NRIC. Do not represent it as covered either way. (Real Estate sector guidelines are silent too.) |
| **Encryption of NRIC fields** (at rest, in transit, key management) | **NOT ADDRESSED IN EITHER DOCUMENT.** The TG never uses the words encrypt/encryption/at-rest/in-transit/key management. AG 2.4 supplies only the general comparative duty. No cipher, key length, or at-rest requirement is specified anywhere. |
| **Access control / RBAC / least privilege / row-level security on NRIC fields** | **NOT ADDRESSED IN EITHER DOCUMENT.** Nearest adjacent items are TG p.8/p.9 (verify the user's identity before an identifier change), TG p.16 (identity-verification procedures), TG p.17 (disable accounts without replacement identifiers), and AG 5.9's "protected by passwords instead of an open visitor log book". |
| **Audit logging of NRIC reads** | **NOT ADDRESSED IN EITHER DOCUMENT.** |
| **NRIC in URLs, query strings, path parameters or route segments** | **NOT ADDRESSED IN EITHER DOCUMENT.** The TG's "websites and public-facing systems" framing is about *the identifier a user is known by*, not transport surfaces. |
| **NRIC in application/server logs, telemetry, or error payloads** | **NOT ADDRESSED IN EITHER DOCUMENT.** No mention of logging or log redaction. |
| **NRIC in filenames, object keys, or generated document names** | **NOT ADDRESSED IN EITHER DOCUMENT.** |
| **Organisation-generated QR codes encoding an NRIC** | **NOT ADDRESSED IN EITHER DOCUMENT.** |
| **Concrete retention periods for NRIC** | **NOT PRESCRIBED — AG 2.5 expressly declines to set one.** Do not invent a number. |
| **Breach-notification specifics for NRIC** | **NOT ADDRESSED IN EITHER DOCUMENT.** See `breach.md` — note that national identification number is part of the prescribed-data chapeau, and Key Concepts p.133 fn 61 defines it to include NRIC, birth certificate number, FIN, work permit number, **passport number**, and any foreign national identification number. |
| **Cautions about hashing** | **NOT ADDRESSED IN THIS DOCUMENT** — see §9.2. The TG states the irreversibility claim without qualification. |

The two documents give **no cover** for NRIC in a URL, a log line, or a filename — but they also give **no permission**. Treat these as gaps to be closed under AG 2.4, not as sanctioned.

**Concrete greps for the unaddressed surfaces:** routes/paths carrying an identity parameter; `console.log` / logger calls, error-tracker `extra`/`tags`, and analytics `track()` payloads that pass a whole client object (an NRIC field rides along silently); object-storage keys and generated PDF/export filenames built from client identity; CSV/Excel export column lists; and LLM prompt payloads (see `ai-and-transfers.md` §on prompt scanning).

---

## 13. Consolidated checklist

Each item is tagged with the paragraph that justifies it.

**A. Discovery — what is actually stored**

1. Does any column, JSON key, or document field store a full NRIC, FIN, Work Permit number, or Birth Certificate number? Sweep every name variant. — *AG 1.4; AG 1.5 (passport); TG p.4*
2. Have **all** storage locations been enumerated — denormalised copies, JSONB payloads, snapshot/audit tables, generated PDFs and exports, message payloads, prompt logs, embeddings, analytics events, seed/fixture data, and **database backups**? — *TG p.19*
3. For any column labelled "partial" or "masked", does the **stored data** actually conform? Run a length/shape query. — *AG 5.2; TG p.13*
4. Is the stored partial the **tail** (last 3 numerical digits + checksum letter), not a prefix or middle slice? — *AG 5.2*
5. Are NRIC **images/scans/photocopies** stored? Collecting a copy means collecting name, photograph, thumbprint and address as well. — *AG 3.15; AG 1.3*

**B. Justification — is the collection permitted at all**

6. For each NRIC write site, which basis applies — (a) required under law / PDPA exception, or (b) high degree of fidelity? If neither, the collection is prohibited. — *AG 3.1*
7. If basis (a), is a **specific statute, regulation, or licence condition** named and recorded? — *AG 3.2; AG 3.4–3.9*
8. If basis (b), is the write gated on an actual **transaction** — OTP/S&P/lease execution/AML — rather than firing at enquiry, registration, viewing sign-in, or marketing capture? — *AG 3.13(b) read against AG 5.5–5.9*
9. Could the justification be **produced on request** to the individual or PDPC, from something in the repo or policy docs? — *AG 3.14*
10. Is NRIC a **required / `NOT NULL`** field on any form that creates a mere contact or prospect? — *AG 3.16 fn 16 (s 14(2)(a)); AG 3.9*
11. Are consent and purpose notification captured at the collection point for basis-(b) collections? — *AG 3.12; AG 2.3*
12. Is any **physical NRIC** or identification document retained, held as collateral, or kept at a counter? — *AG 4.1; AG 5.10; AG 5.11; AG 1.6*
13. Could the flow be redesigned as a **sighting** — verify and return, retain nothing? — *AG 5.12; AG 5.13*

**C. Identifier role**

14. Is NRIC a `PRIMARY KEY`, in a `UNIQUE` constraint, an FK target, an `ON CONFLICT` target, or an index? — *TG p.6; TG p.21*
15. Is NRIC a de-facto key in application code — `WHERE nric =`, dedup logic, cache/query keys, external correlation IDs? — *TG p.6; TG p.21*
16. If the key is being replaced, have **all downstream systems — the TG names CRM systems explicitly — been enhanced**? — *TG p.21; TG p.16*
17. Does the replacement identifier meet the four criteria: easily remembered, unique, no sensitive information, not easily guessable? — *TG p.6*
18. If a combination identifier is used, does it exclude sensitive personal information and pass a uniqueness check? — *TG p.12; TG p.13*

**D. Protection**

19. Is NRIC protected **more strongly than ordinary personal data in the same system**? — *AG 2.4*
20. If hashed, is the construction keyed/salted — and is the codebase relying on "hashes cannot be reversed"? Record that reliance as inadequate, **explicitly noting the critique comes from outside the PDFs**. — *TG p.23 (verbatim claim); critique NOT sourced from these documents*
21. Is NRIC rendered in full anywhere it is not "absolutely necessary", and is masking applied (last 3 digits + last alphabet)? — *TG p.15; TG p.23*
22. Does an NRIC value ever reach a URL, an application log, an error payload, an analytics event, a filename, an object key, an LLM prompt, or an outbound message? — *Not directly addressed; assess under AG 2.4*
23. Is there access control specific to NRIC-bearing endpoints, or does every authenticated user see every client's NRIC via `SELECT *`, list endpoints, or exports? — *NOT ADDRESSED; assess under AG 2.4 and AG 5.9*
24. If a scanner or SingPass/MyInfo/SG-Verify integration exists, is the complete NRIC converted to its final format **immediately after scanning** and never persisted in full — and does the integration persist only what the organisation is permitted to hold? — *TG p.23; TG p.25*

**E. Retention and deletion**

25. Is there any scheduled job, migration, or process that ceases retention — deletes, nulls, or de-associates NRIC — once the transaction purpose is served? — *AG 2.5; AG 5.9*
26. Is NRIC being kept "just in case"? PDPC names this pattern. — *AG 2.5*
27. Has a review determined whether NRIC numbers are **still required**, with removal if not? — *TG p.17*
28. Do **backups** containing NRIC have a deletion plan, performed securely? — *TG p.19*
29. Do written policies "specifically address the need" to collect NRIC, and are they reviewed? — *AG 2.7; AG 2.2*

**F. Post-2024 overlay — the deadline**

30. Is an NRIC (or FIN/passport) ever used as a **password, default/seed password, security answer, OTP, or any authentication factor**? — *cover notice of both documents, citing MDDI 13 Dec 2024 and PDPC 14 Dec 2024*
31. Is there a dated plan to reach compliance by **31 December 2026**? — *PDPC media page, §1.1*

**G. Timing note**

AG 6.1: "To allow organisations time to review and implement any necessary changes … the PDPC will apply the interpretation of the PDPA in Part II of these Guidelines **from 1 September 2019**." **There is no grandfathering argument for a system built or modified after that date.** Use `git log` on the migration that introduced NRIC storage to characterise risk, not to excuse it.
