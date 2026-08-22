# Marketing messages and the Do Not Call registers

Sources:

- **Advisory Guidelines on the Do Not Call Provisions**, issued 26 Dec 2013, **revised 1 February 2021** — cited `DNC §x.x`.
- **Advisory Guidelines for the Real Estate Agency Sector**, **16 May 2014** — cited `RE §x.x`. ⚠️ Pre-dates the 2020 amendments: use it for **sector examples**, never as a statement of consent law (see `sources.md` §1.2).
- **PDPA Eighth Schedule**, quoted from Singapore Statutes Online, `Current version as at 21 Aug 2026`.
- **Advisory Guidelines on Enforcement of the Data Protection Provisions**, rev. 1 Oct 2022 — for the DNC penalty band.

DNC paragraph numbers are the document's own Word auto-numbering, recovered by OCR of the left margin and spot-verified against rendered pages and the document's own internal cross-references. Numbering runs §1–§22 continuously across Parts I–VII.

---

## 1. What is a "specified message"

**DNC §3.1, verbatim — the operative definition:**

> "Section 37 of the PDPA defines what constitutes a 'specified message' for the purposes of the DNC Provisions. In brief, under **section 37(6) and the Tenth Schedule**, a message is a specified message if the purpose of the message, **or one of its purposes**, is –
>
> a) to advertise, promote, or offer to supply or provide any of the following:
>   i. goods or services;
>   ii. land or an interest in land; or
>   iii. a business opportunity or an investment opportunity;
>
> b) to advertise or promote a supplier/provider (or a prospective supplier/provider) of the items listed in sub-paragraphs (i) to (iii) above; or
>
> c) any other prescribed purpose related to obtaining or providing information."

Footnote 7: "**There are presently no such other prescribed purposes.**"

**Footnote 6 defines the s 36(1) terms — and both limbs expressly reach real estate:**

> "'goods' means any personal property, whether tangible or intangible, and shall be deemed to include (a) chattels that are attached or intended to be attached to real property on or after delivery; (b) financial products and credit, including credit extended solely on the security of land; (c) **any residential property**; or (d) a voucher.
>
> 'services' includes (a) a service offered or provided that involves the addition to or maintenance, repair or alteration of goods or **any residential property**; (b) a membership in any club or organisation if the club or organisation is a business formed to make a profit for its owners; (c) the right to use time share accommodation…; and (d) financial services…"

**"or one of its purposes" is the load-bearing phrase.** A single marketing sentence appended to an otherwise operational message converts the whole message.

**How purpose is assessed** (DNC §3.4, s 37(1)):

> "a) the content and presentation aspects of the message; and
> b) **the content that may be obtained through the message, that is, by using the numbers, URLs or contact information (if any) included in the message or by calling the telephone number from which the message was sent.**"

A neutral SMS that links to a marketing landing page is assessed **on the landing page too**. A short link in a "transactional" message can convert it.

**Irrelevant factors** (DNC §3.5): quality, terms, or "**whether the items are offered to the recipient at an attractive price or free of charge**". **Non-existent offers still count** (DNC §3.6, s 37(2)): it is immaterial whether the goods exist or are lawful to acquire.

**Consent-seeking messages are themselves specified messages** (DNC §3.8, §3.12, §3.13; restated at RE §5.17):

> "a message sent to a Singapore telephone number where the purpose, or one of the purposes, is **to obtain clear and unambiguous consent for the sending of specified messages, would be considered a specified message**." (DNC §3.12)

> "Persons who wish to contact individuals to obtain clear and unambiguous consent … **should do so in a manner which does not involve the sending of a specified message to a Singapore telephone number**, unless such persons comply with the DNC Provisions." (DNC §3.13)

The same text sent to an **email address** is not a specified message (DNC §3.14–§3.15), and a "Y" reply by email "would likely be considered to have obtained clear and unambiguous consent … **if they are able to reproduce the consent given when required to do so subsequently**."

**Practical route: seek DNC consent over email or in-app, never over SMS/WhatsApp/voice to a Singapore number.**

**Event and seminar invitations** (DNC §3.21–§3.22): "an invitation to an event that is a sale would likely fall within the definition … as an offer to supply goods. Similarly, an invitation to a course or seminar which purports to impart certain skills … could also fall within the definition." **A "new launch preview" or "investor seminar" invite is a specified message.**

**Responding to a request for information** is not (DNC §3.16) — but only "**for the sole purpose** of responding to a request from an individual for information about a good or service". Where the request came via a third party, DNC §3.17 requires due diligence to confirm the individual actually made it: "**If the person is unable to confirm whether the individual had indeed made a request for information and does not have clear and unambiguous consent … the person must comply with the DNC Registry provisions.**"

**What to check in code:** a **written classification of every outbound message template** as specified / not-specified, reviewed when the template text changes — classification cannot be a runtime guess. Then check whether any template interpolates **dynamic content** (listing blocks, recommendation carousels, banner slots) that could inject a marketing purpose at send time, and whether short links in "transactional" templates resolve to marketing landing pages.

---

## 2. The three registers

**DNC §1.8, verbatim:**

> "There are three (3) DNC Registers which individuals may choose to opt out of receiving specified messages:
>
> a) **No Voice Call Register**, to opt out of receiving specified messages via voice calls (i.e. voice or video calls sent by a telephone service, data service or any other electronic means);
>
> b) **No Text Message Register**, to opt out of receiving specified text messages (including **any text, sound or visual message that is not a specified call or fax**, e.g. SMS/MMS); and
>
> c) **No Fax Message Register**, to opt out of receiving specified fax messages."

**The registers are per-channel. Clearance on one is not clearance on another.**

**"Singapore telephone number"** (DNC §1.7 fn 3, s 36(1)): "(a) a telephone number, with **eight (8) digits beginning with the digit 3, 6, 8 or 9**, that is in accordance with the National Numbering Plan … or (b) any other telephone numbers as may be prescribed. **There are no other numbers prescribed at the moment.**"

---

## 3. The 21-day check, and the 21-day opt-out — two different clocks

### 3.1 Check validity — 21 days

**The duty** (DNC §6.1, s 43(1)–(2)): a person must not send a specified message to a Singapore telephone number unless they had valid confirmation the number is not listed. Either:

> "a) Have made an application to the Commission **within 21 days**, before sending the specified message, under section 40(2) … and received confirmation from the Commission that the Singapore telephone number is not listed in the relevant register; or
> b) have obtained from a checker information that the Singapore telephone number is not listed … and has no reason to believe that – i. **the relevant information was obtained more than 21 days ago**; or ii. the relevant information is false or inaccurate."

**DNC §6.2, verbatim:**

> "The '**prescribed duration**' within which a person must check with the DNC Registry before sending a specified message to a Singapore telephone number **has been prescribed as 21 days**."

**DNC §6.3 — the worked arithmetic. Implement exactly this:**

| Receipt of results | Validity period | Remark as printed |
|---|---|---|
| From 1 February 2021 onwards | **21 days from receipt of results** | *"E.g., If an organisation submits telephone numbers for checking against the DNC Registry and receives the results on **2 February 2021**, the results will be valid until **23 February 2021**."* |

**Received 2 Feb → valid until 23 Feb.** That is 21 days counted from, and exclusive of, the receipt date. **Do not implement "valid through day 21 inclusive of receipt."**

**Withdrawal re-arms the duty** (DNC §6.3, continuation): "If consent obtained by a person for the purposes of the DNC Provisions is withdrawn, the person will need to check with the DNC Registry as noted above."

**Third-party checkers** (DNC §6.5, s 43A(1)): "a 'checker' is a person who checks the DNC Register for a sender and provides the sender information on whether a Singapore telephone number is listed… **A checker does not include an individual who is an employee of the sender, or an employee or a contractor of the checker.**"

**The checker's duties** (DNC §6.6, s 43A(2)): ensure accuracy, and "When communicating the applicable information to the sender, **provide him with the date the checker received the results from the DNC Registry, and the validity period of the applicable information.**"

**What to check in code:** the send path must verify a DNC result **at most 21 days old** or an evidenced consent record, with **no third path**. If results come from a vendor, persist the **vendor's receipt date** and **stated validity period** as first-class fields, not a boolean — without the receipt date, DNC §6.1(b)(i) is unauditable. Check the register **matches the channel** of the send, and that a voice-register clearance is never reused for an SMS or WhatsApp send.

### 3.2 Opt-out effecting period — 21 days

**DNC §8.13, verbatim:**

> "Any consent given by the subscriber or user of a Singapore telephone number to a person for the purposes of the DNC Provisions may be withdrawn by the user or subscriber by providing notice to the person. **The 'prescribed period' (as set out in section 47(3)) within which persons must effect a withdrawal of consent is 21 days.**"

Stated identically a second time in the continuation of DNC §6.3.

**The mechanism** (DNC §8.14, s 47(1), (3)): a subscriber or user may withdraw "by giving notice to the person", and the person "**must cease (and cause its agents to cease) sending any specified messages to that number after the expiry of the prescribed period**."

**No prescribed form of notice** (DNC §8.15). The Commission considers "a) the actual content of the notice of withdrawal; b) whether the intent to withdraw consent was clearly expressed; and c) the channel through which the notice was sent." Organisations must "act reasonably and in good faith."

**Withdrawal may not be blocked** (DNC §10.3, s 47(2)).

**Scope is per-channel by default** (DNC §8.17–§8.18):

> "Where the persons state the availability of a facility for notifying a withdrawal of consent (e.g. 'send "UNSUB" to [Singapore telephone number]'), **the persons should clearly indicate the scope of withdrawal**." (§8.17)

> "Where the withdrawal notice contains a general withdrawal message, without indicating clearly the scope of the withdrawal, **the Commission will consider any withdrawal of consent via a particular channel to only apply to all specified messages sent via that channel.**" (§8.18)

Worked (DNC §8.19–§8.21): replying UNSUB to an SMS withdraws consent for **all** specified messages by SMS — not merely the campaign that carried the link, and not limited to that subject matter. A later **email** saying "withdraw everything" then withdraws across **phone, fax and SMS**. In a group deployment, unsubscribing from one group entity's SMS withdraws for **that entity only**.

**Registering on a DNC Register is NOT a withdrawal of consent** (DNC §8.22–§8.24, s 47(5)): "the addition of the number **shall not be regarded as a withdrawal of consent** for the purposes of the DNC Provisions." Individuals wishing to withdraw "should withdraw consent by giving reasonable notice to the organisation **under section 16 of the PDPA**."

**What to check in code:** a hard stop on all in-scope sends **no later than 21 days** after a withdrawal notice is received, with the clock measured from **receipt**; propagation to **agents and downstream processors** ("and cause its agents to cease"); withdrawal accepted through **any** channel — reply SMS, email, phone call, in-person to an agent — all reaching the same suppression store; a channel-specific unsubscribe applied to **all** specified messages on that channel; and a system that does **not** treat DNC-Register registration as withdrawal of a direct consent, while still honouring the register for non-consented sends.

---

## 4. The Eighth Schedule exclusions — and the structural correction

### 4.1 It is an exclusion from the DEFINITION, not an exemption from a duty

The Eighth Schedule is made under **section 37(5)** and is titled **"Exclusion from meaning of 'specified message'"**.

- It removes the message from the *definition* of "specified message" altogether, so **no Part 9 obligation attaches at all** — including s 43 (duty to check) and s 44 (identification/contact).
- The older framing as the **"Exemption Order" (S.817/2013)**, used by the 2014 Real Estate guidelines (RE §5.3(b), §5.4), describes a **different mechanism**: an exemption from the duty to check, limited to **fax and text** messages. The 2021 DNC Guidelines do not use that framing — "Exemption", "S.817" and "817/2013" appear **zero times** in them.

**Cite the Eighth Schedule, not the Exemption Order.** Treat RE §5.13 as the sector-specific *application examples* only.

### 4.2 Paragraph 1(1), verbatim from the statute

> "1.— (1) For the purposes of Part 9, a specified message does not include any of the following:
>
> **(a)** any message sent by a public agency under, or to promote, any programme carried out by any public agency which is not for a commercial purpose;
>
> **(b)** any message sent by an individual acting in a personal or domestic capacity;
>
> **(c)** any message which is necessary to respond to an emergency that threatens the life, health or safety of any individual;
>
> **(d)** any message **the sole purpose of which** is —
> (i) to facilitate, complete or confirm a transaction that the recipient of the message has previously agreed to enter into with the sender;
> (ii) to provide warranty information, product recall information or safety or security information with respect to a product or service purchased or used by the recipient of the message; or
> (iii) to deliver goods or services, including product updates or upgrades, that the recipient of the message is entitled to receive under the terms of a transaction that the recipient has previously agreed to enter into with the sender;
>
> **(e)** any message, **other than a message mentioned in sub-paragraph (d)** —
> (i) that is sent **while** the sender is in an ongoing relationship with the recipient of the message; and
> (ii) **the sole purpose of which relates to the subject matter of the ongoing relationship**;
>
> **(f)** any message the sole purpose of which is to conduct market research or market survey;
>
> **(g)** any message sent to an organisation other than an individual acting in a personal or domestic capacity, for any purpose of the receiving organisation."

**Paragraph 1(2) — definition of "ongoing relationship", verbatim:**

> "(2) In sub-paragraph (1)(e), 'ongoing relationship' means a relationship, on an ongoing basis, between the sender and the recipient of the message, arising from the carrying on or conduct of a business or an activity (commercial or otherwise) by the sender."

Amendment annotation on the Schedule: `[22/2016; 40/2020]` — **not touched by Act 19 of 2025**, so the text above is current as at 21 Aug 2026.

### 4.3 Paragraph 1(e): two cumulative conditions, and NO opt-out condition attaches

**Finding, resolved against the statute: there is no opt-out, unsubscribe, or withdrawal requirement in paragraph 1(e).** The provision imposes exactly **two cumulative conditions**, both in 1(e) itself:

1. sent **while** the sender is in an ongoing relationship with the recipient; **and**
2. the **sole purpose** relates to the **subject matter** of that ongoing relationship.

Plus one negative condition in the opening words: the message must be "other than a message mentioned in sub-paragraph (d)".

Nothing more. **No unsubscribe facility, no opt-out honouring period, and no sender-identification duty appears in the Schedule.**

*(Provenance: the DNC Guidelines are silent on this — neither DNC §4.1(e), §4.2, §4.3, §4.4, §4.5 nor §4.14 imposes any opt-out mechanism as a condition. The 2014 Real Estate guidelines say the Exemption Order applies "if certain conditions are met" without enumerating them. The absence was resolved by reading the Schedule itself.)*

### ⚠️ Do not overstate this

The absence is only from the **Eighth Schedule**. It does **not** mean an organisation relying on 1(e) is free of all obligation:

- The **Data Protection Provisions (Parts 3–6B) still apply** to the underlying personal data. The Eighth Schedule only excludes the message from **Part 9**.
- **Withdrawal of consent under s 16** is a separate right under the DP Provisions and is unaffected.
- If the message carries **any** additional purpose beyond the subject matter of the relationship, the "sole purpose" condition fails and the whole message becomes a specified message again.

### 4.4 What "ongoing relationship" actually requires

**DNC §4.2** extends the definition to messages whose sole purpose is to provide:

> "a) notification concerning a change in the terms or features of;
> b) notification of a change in the standing or status of the recipient of the message with respect to; or
> c) at regular periodic intervals, account balance information or other type of account statement with respect to,
> a **subscription, membership, account, loan or comparable ongoing commercial relationship** involving the ongoing purchase or use by the recipient of goods or services offered by the sender."

**DNC §4.5 — the test and the hard floor:**

> "In determining whether an ongoing relationship with the individual exists, the Commission considers factors including **continuity, regularity and frequency**, for instance repeated visits/transactions and whether the individual has signed up for a package… It should be noted that **once-off transactions are insufficient to establish an ongoing relationship**."

**DNC §4.14 — the anti-piggyback rule:**

> "A person sending a message that falls within one of the excluded purposes specified in the Eighth Schedule … **must not use that message for any of the purposes listed in section 37(1)** … **Otherwise, the message will still be a specified message** and the sender will be required to comply with the DNC Provisions in relation to the sending of that message."

Worked failure (DNC §4.15): *"Members enjoy additional 5% on top of membership privileges in the month of June. **Visit our stores to check out our new Summer arrivals.**"* — "This message does not fall within paragraph 1(e) as its purpose is **not solely** to provide notification on a change in the terms or features of an ongoing commercial relationship."

But an upsell **of the same ongoing relationship** stays within it (DNC §4.16–§4.23): *"Your service contract / subscription will cease on 24th July 2014. **Renew now and get 10% off.**"* ✅ ; *"Your account balance is low. **Top up now to enjoy $5 free credits for every top up of $20.**"* ✅.

**Audit implication.** A system relying on 1(e) needs **two provable artefacts per send**: (a) evidence the relationship was **live at send time** — not merely that it once existed; and (b) a purpose bound to the relationship's subject matter, with no additional marketing rider. **A `last_transaction_at` timestamp alone proves neither.** The "sole purpose" condition means a template that appends a second offer voids the exclusion for the entire message.

### 4.5 The two adjacent exclusions a CRM will reach for

**Para 1(d) — the transactional carve-out.** The correct basis for genuinely transactional sends: appointment confirmations, document-ready notices, completion reminders. Also gated on **"sole purpose"**. Bundling "and here are three new launches you might like" into a viewing confirmation **destroys the 1(d) exclusion** and makes the message a specified message. Worked passes (DNC §4.16–§4.17): *"The [transaction] you requested has been completed."* (1(d)(i)); *"We are upgrading Service ABC to Service ABC Plus… Please sign in to your account to find out about the new benefits and accept the upgrade."* (1(d)(iii)).

**Para 1(g) — B2B.** Messages sent to an *organisation* (rather than an individual acting in a personal or domestic capacity) for any purpose of the receiving organisation. Relevant to co-broking messages to another agency — but the recipient's **capacity** governs, and a salesperson's personal mobile is not obviously "an organisation". **Treat as fact-sensitive.** DNC §4.30 marks the limit: John may promote a product to Mary at her childcare centre on her business number, but "while talking to Mary, **John asks her if she has children and whether she would be interested to buy another product for her personal use. In such a situation, John would not be able to rely on this exception.**"

**Para 1(f) — market research.** DNC §4.24–§4.26: a gift as a reward for participation does not itself constitute an offer to supply — "**However, persons should act in good faith and not attempt to disguise a specified message in the form of the provision of a 'gift'.**" Contrast DNC §4.28: a survey call ending with a product recommendation **is** a specified message.

**Employment / charity / political** (DNC §4.31): a message sent solely to promote an employment opportunity, solicit charitable donations, or promote a political cause, "**and without any marketing elements** (such as an offer to supply a good or service)", is not a specified message.

**What to check in code:** for every template classified as **not** specified, is the exclusion it relies on **named** (Eighth Schedule 1(a)–(g)), and does the template satisfy that paragraph's **"sole purpose"** wording? Does any "transactional" template contain even one promotional clause, cross-sell line, or "while you're here" nudge?

---

## 5. Real-estate specifics

### 5.1 WhatsApp is in scope; an in-app push keyed to a user ID is not

**DNC §15.3, verbatim:**

> "the DNC Provisions apply equally to **all means by which a sender may send a specified message to a Singapore telephone number**. These include, for example, **voice calls, SMS, or any data applications (such as 'Whatsapp', 'iMessage' or 'Viber') which use a Singapore telephone number.**"

**DNC §15.4, verbatim — the boundary:**

> "However, the DNC Provisions **do not apply** to specified messages which are **not sent to a Singapore telephone number**, e.g. location-based broadcasts that are pushed to mobile phones through data-enabled smart phone applications or data applications that do not use a Singapore telephone number to send messages. For the avoidance of doubt, **the DP Provisions may still apply** to such specified messages which are not sent to a Singapore telephone number."

WhatsApp Business API sends to a Singapore MSISDN hit the **No Text Message Register** — DNC §1.8(b) covers "any text, sound or visual message that is not a specified call or fax". An in-app push notification keyed to a **user ID** rather than a phone number is outside Part 9 but still inside the Data Protection Provisions.

### 5.2 A signed OTP is not an ongoing relationship

**RE §5.13, the four worked scenarios:**

| | Scenario | Treatment |
|---|---|---|
| (a) | Sarah enquires about a property; Jack responds with details. | Jack **can** respond, but "**he cannot rely on the [carve-out] to subsequently send specified messages** to Sarah's telephone number as **her enquiry is a one-off interaction**." |
| **(b)** | **Sarah signs an option to purchase** a property marketed by Jack. | "Jack **cannot** rely on the [carve-out] to send specified messages to Sarah's telephone number as **the option does not establish an ongoing relationship** between Sarah and Jack." |
| (c) | Sarah previously engaged Jack to sell her property; Jack sends regular email updates she never requested or replied to. | "the sale of Sarah's property is a **one-off transaction** and **unilateral action on the part of Jack does not cause an ongoing relationship** … to be formed." |
| (d) | Sarah signs up as ABC's **VIP member**; VIP members get regular market updates; **at sign-up Sarah selects the property types she wants updates on** (price, size, location, bedrooms). | "**This constitutes an ongoing relationship** … ABC may rely on the [carve-out] to send text or fax messages containing updates about newly listed properties **within the specified criteria** to Sarah's telephone number." |

**Only (d) qualifies — a subscription-style relationship with recipient-selected criteria — and even then the exclusion covers only messages within those criteria.**

RE §5.5 says the same thing prospectively: "the fact that an individual previously contacted the sender to enquire about a particular property on sale, the fact that the individual previously engaged the sender to market a property for the individual, or **the fact that the individual left his telephone number at a showroom**, in themselves, would be insufficient to establish an ongoing relationship."

### 5.3 The re-engagement call to a past buyer is a specified message

**RE §5.7, verbatim:**

> "Jack manages to successfully find an apartment for Susan. **Two years later, the property market appreciates and Jack calls Susan to ask if she would be interested to sell her apartment with him as her agent. Jack is sending a specified message to Susan (as he is offering his agency services to Susan) and the Do Not Call Provisions apply.**"

**This is the classic CRM "re-engage past client" nudge, and PDPC has classified it directly.**

Related sector classifications:

| Source | Scenario | Specified message? |
|---|---|---|
| RE §5.6(a) | Jack calls his own seller-client to discuss an offer received. | ❌ No |
| RE §5.6(b) | Jack calls another **estate agent** to market his seller's apartment. | ❌ No — "a 'business-to-business' marketing call, which is excluded." |
| RE §5.6(c) | Jack buys a database of numbers and calls one to ask about buying. | ✅ Yes — and see §7 on how the list was built |
| RE §5.6(d) | Jack calls Tom, who once enquired about a **different** property, about this property. | ✅ Yes |
| RE §5.8(a) | Mark asked Jack to call him back with his decision; Jack calls for the decision. | ❌ No |
| RE §5.8(b) | Jack calls to confirm Mark is returning with the cheque. | ❌ No |
| RE §5.8(c) | Jack takes Mark's details from the **showroom guestbook** and calls to ask if he'd like to buy a unit. | ✅ Yes |
| **RE §5.8(d)** | Jack has Mark's number (given directly **or** from the guestbook) and calls to market **other** properties. | ✅ **Yes — even a directly-given number, used to pitch a different listing, is a specified message.** |
| RE §5.9(a) | Jack calls Sarah, who advertised her own apartment, to offer his services. | ✅ Yes |
| RE §5.9(b) | Tom calls Sarah to enquire about her apartment on behalf of a buyer, promoting nothing. | ❌ No |
| RE §5.10 | Estate agent ABC SMSes its own salesperson about a launch and commission structure. | ❌ No — business purpose |

### 5.4 Agencies are deemed senders of their agents' messages

**"Send"** (DNC §15.1, s 36(1)) means "(a) the sending of the message; (b) **causing or authorising** the sending of the message; or (c) the making of a voice call containing the message, or causing or authorising the making of such a voice call."

**"Sender"** (DNC §16.2): "(a) the person who actually sends the message…; (b) the person who **causes** the message to be sent…; and (c) the person who **authorises** the sending of the message…"

**DNC §16.4, quoting s 37(3)–(4):**

> "Subject to subsection (4), a person who **authorises another person to offer, advertise or promote the first person's goods, services, land, interest or opportunity** shall be **deemed to have authorised the sending of any message** sent by the second person that offers, advertises or promotes that first person's goods, services, land, interest or opportunity.
>
> For the purposes of subsection (3), a person who **takes reasonable steps to stop the sending** of any message referred to in that subsection shall be deemed **not** to have authorised the sending of the message."

**DNC §16.5 — what "reasonable steps" looks like:**

> "reasonable steps may include **requiring, as a condition of the authorisation given, that Person B shall not promote Person A's goods by sending specified messages addressed to Singapore telephone numbers**."

**This is the agency↔salesperson liability rule.** An agency that authorises salespersons to market its listings is **deemed a sender of every marketing message they send about those listings**, unless it takes reasonable steps to stop it. **A platform that hands agents a bulk-send button has taken the opposite of reasonable steps.**

DNC §16.6: a person is subject to the DNC Provisions if he falls within the definition of a sender "**even if the message was sent on behalf of or for another person's purposes**." Worked (DNC §16.7–§16.9): an organisation **and** its call centre are both senders; an organisation, its marketing agency **and** the call centre are all three senders.

**Employee defence** (DNC §18.1, s 48): an employee has a defence if he acted "in good faith in the course of his employment or in accordance with instructions given to him by or on behalf of his employer". "**This defence is not available to an 'officer' of an organisation.**" It does not protect the organisation either.

**What to check in code:** does the platform recognise that **it** is a sender when it causes or authorises sends on agents' behalf, not only the agent whose name is on the message? Where the agency authorises agents to market its listings, is there a **real technical gate** — not a policy PDF — that blocks a non-compliant send? In co-broking or joint-marketing sends, is it recorded **which party performed the DNC check** and whose identification/contact information is in the message (DNC §19.3: s 44 is satisfied "if **either** person A or B's identification and contact information was provided", and the Commission expects "**either** person A or B to check the DNC Register before sending")?

---

## 6. DP consent and DNC consent are separate gates

**RE §4.2 states it plainly** (the example concerns a legacy client database):

> "**While ABC may not need to obtain consent under the Data Protection Provisions to use the personal data of its clients in the database to call them for its new launches, the Do Not Call Provisions separately apply.**"

Restated at DNC §22.2: "even if the sending of specified messages to a Singapore telephone number is considered a reasonable existing use under section 19, **the DNC Provisions apply concurrently. In particular, section 19 does not in any way affect the requirement that persons must check the DNC Register or obtain clear and unambiguous consent before the sending of any specified messages.**"

RE §4.1 also: "the Do Not Call Provisions will apply to the sending of specified messages to Singapore telephone numbers, **even if the Singapore telephone numbers are collected before the appointed day**."

**Clearing one gate does not clear the other.**

### 6.1 DNC consent must name the channel and the number — DNC §7.6

**The two-limb test** (DNC §7.3):

> "a) **whether the person had notified the user or subscriber clearly and specifically that specified messages would be sent to his or her Singapore telephone number**; and
> b) **whether the user or subscriber gave consent to receive specified messages through some form of positive action.** Clear and unambiguous consent is unlikely to be construed to have been obtained from a mere failure to opt out through inaction on the part of the user or subscriber."

**The two clauses PDPC contrasts:**

| | Clause | Verdict |
|---|---|---|
| **DNC §7.5 — Clause A** | *"you consent to receive information about special offers we may have from time to time, **by SMS**"* | ✅ "clearly and specifically notifies the user or subscriber that specified messages would be sent to his or her Singapore telephone number." |
| **DNC §7.6 — Clause B** | *"you consent to the use of your personal data for **marketing purposes**"* | ❌ "**is not sufficiently specific as 'marketing purposes' may or may not include the sending of specified messages**." |

**Clause B would very likely satisfy an ordinary DP-Provisions marketing consent. It fails the DNC test.** A generic marketing-consent line on a signup form is not DNC consent.

**Four ways DNC consent differs from PDPA consent generally:**

1. **Channel specificity** — §7.5 vs §7.6 above.
2. **Mandatory evidential form** — s 43(4) requires consent "evidenced in written or other form so as to be accessible for subsequent reference" (DNC §8.1). PDPC does not prescribe the manner of consent under the DP Provisions.
3. **No deemed consent.** Nothing permits DNC consent to be deemed from voluntary provision of a number. The path is either actual evidenced consent or a register check.
4. **Positive action required** — inaction is expressly insufficient (§7.3(b)).

**Sufficient** (DNC §7.7–§7.13): a ticked checkbox next to Clause A; ticked "SMS"/"Email" boxes under "I would like to receive information about promotions and offers by:", placed directly above Submit; a ticked box directly above a signature line, signed; an explicit "I agree to receive such information (regardless of any current or future registration on any DNC Register)" option selected; a signed-and-returned acknowledgement form; an SMS asking if the recipient wants offers with a "yes" reply — "**if Retailer C retains and can produce (if subsequently required) the record of the SMS they sent … and Joan's reply.**"

**Insufficient** (DNC §7.11–§7.12): an email saying that **unless they reply** they will be taken to have consented, with no reply; a T&C amendment claiming a right to send **unless the customer opts out**, with no response — "It is not known whether Susan received or read the letter or is aware of the amendment."

**The sector version** (RE §5.15) — **not** clear and unambiguous consent on their own:

> "(a) **'Unverified claims' by third party**: Jack buys a database of telephone numbers from a third party. The third party makes unverified claims that consent has been obtained…;
> (b) **Publicly available information**: Jack obtained the telephone number from a publicly available source like a telephone directory or a publicly available social network profile;
> (c) **Failure to opt out**: There is a sign at a showroom that states 'ABC or its salespersons may contact you for marketing and promotions';
> (d) **Prior business relationship**: Jack was previously in touch with Tom to source for or sell a property for Tom."

**Likely sufficient** (RE §5.16), "**if evidence is retained to demonstrate that the individual has indeed given such consent**": a showroom guestbook that "clearly indicates for every individual to '**tick here** if you wish to be contacted by phone or SMS for this development and other new launches by ABC Development Pte Ltd'"; or an emailed question answered "Yes".

**Consent must run to the specific sender** (DNC §7.15): person A "is still required to comply with the DNC provisions … **unless person A has obtained clear and unambiguous consent from C for person A to send specified messages to that number**." A referrer's own consent is worthless; you need **transferable documentary evidence naming you**.

**Consent may not be a condition of service** (DNC §9.1, §9.4, §9.5, s 46(1)): "**Generally, consent for the sending of any type of specified messages would not appear to be something that is considered to be reasonably required for the provision of most types of goods, services, land, interest or opportunity**", and organisations "should not deny the individual the goods, services, land, interest or opportunity simply because he does not consent to the receiving of marketing messages."

**Scope is per-number and per-subject-matter** (RE §5.11): where Sarah "gives clear and unambiguous consent in writing to the sending of specified messages regarding **any and all** property developments marketed by ABC to **any and all** of her telephone number(s) that she has provided to ABC", then "**based on the scope of consent**, ABC may contact Sarah using either her home or mobile number." Broad scope must be captured **explicitly at collection**; a CRM cannot infer that consent for number A extends to number B.

### 6.2 The four-field consent record — DNC §8.7

**Verbatim. This is a literal database schema requirement:**

> "Where consent was obtained through electronic means, persons should retain documentation or system logs capturing the following information:
>
> a) **the individual's choice** (i.e. whether the individual provided consent or not);
>
> b) **date and time when the individual expressed his choice**;
>
> c) **the webpage / pop-up / online form (or equivalent) which the relevant individual was looking at when providing consent**; and
>
> d) **the clauses which the individual consented to** (including the terms and conditions applicable to the consent which the individual provided)."

**Field (d) means storing an immutable snapshot of the consent text version, not a foreign key to a mutable current-copy string.** If the marketing team edits the consent clause, every historical consent record pointing at the live string silently becomes evidence of a clause the individual never saw.

Related storage rules: DNC §8.2 — written form includes physical or electronic records, and the requirement "applies to both online and offline situations". DNC §8.3 — if not in written form it "must be **captured in a manner or form which can be retrieved and reproduced at a later time**", e.g. an audio or video recording. DNC §8.5 lists acceptable capture mechanisms: web pop-up, in-app notification, web form, physical form, tick against a check box on a letter or service agreement, or a call/SMS. DNC §8.6 — where consent was on a physical document, "persons should **retain the original document**."

**How long** (DNC §8.8–§8.10): retain evidence "**for as long as they intend to rely on such consent**", subject to the s 25 Retention Limitation Obligation. And §8.10: "**Where a complaint … arises and the sender has ceased to retain documentary evidence of the consent, the Commission would assess the strength of the remaining evidence**… in investigating the complaint."

### 6.3 A mis-typed or edited number voids the consent bound to it — DNC §7.22–§7.23

John consents for `12345678`; the organisation mis-records it as `12345679` and sends without checking:

> "XYZ would not be considered to have obtained clear and unambiguous consent to send specified messages to 12345679. Since XYZ did not check the DNC Register before sending the message, **it is likely that XYZ would be in breach of section 43(1) of the PDPA**."

**Consent is bound to the number as consented, not to the contact record.** An edit to the phone field must invalidate both the consent and any DNC check attached to it.

**Recycled numbers** (DNC §7.19–§7.21): reallocation "does not automatically or on its own invalidate the consent provided by the original subscriber" — but "**persons cannot rely on the consent obtained from the original subscriber or original user … once they are aware** that the subscriber or user who consented … is no longer the subscriber or user of that telephone number." There is no duty to verify proactively; there is a duty to stop once you know.

**What to check in code:** a consent record carrying all four DNC §8.7 fields, with (d) as an **immutable snapshot**; consent scoped **per telephone number** so adding a second number does not silently inherit consent from the first; a trigger or constraint that **voids consent and any DNC check when the phone number is edited**; a path to stop relying on consent once a number is known to have changed hands; and no flow anywhere that makes telemarketing consent a **required field** to complete a signup, booking, or form submission.

---

## 7. Number acquisition — s 48B, and why a DNC check does not save you

**The prohibition** (DNC §20.1, s 48B):

> "Under section 48B, a person **must not send, cause to be sent, or authorise the sending of any message, insofar as the recipient telephone number is obtained by dictionary attack or address-harvesting**."

**Note the breadth: "any message", not "any specified message."**

**Definitions** (DNC §20.2–§20.3, s 48A(1)):

> "'**dictionary attack**' means the method by which the telephone number of a recipient is obtained using an automated means that generates possible telephone numbers by combining numbers into numerous permutations. For instance, this would include **randomly generating strings of 8-digit numbers, in running sequence or otherwise**. This can happen even if the recipients have never published their telephone numbers."

> "'**address-harvesting software**' [is] software that is **specifically designed or marketed for use for searching the Internet for telephone numbers and collecting, compiling, capturing or otherwise harvesting those telephone numbers**. This happens where the recipients have published their telephone numbers."

**The two worked examples that matter — DNC §20.4 and §20.5:**

| Scenario | Treatment |
|---|---|
| DEF takes an existing customer's number `12345678` and calls `12345679` (adding "1"). **DEF checks the DNC register first.** | "The random generation of numbers by adding 1 to the end of existing numbers constitutes dictionary attack. DEF is in contravention of section 48B of the PDPA, **even though it has checked the relevant DNC Register**." |
| DEF uses address-harvesting software to trawl the web for publicly-available numbers **to promote an employment opportunity without any marketing elements**. | "The use of the address-harvesting software is in contravention of section 48B of the PDPA." The message "does not fall within the definition of a 'specified message'" but "**falls under the definition of an 'applicable message' under section 48A(1)**." |

**A passing DNC check does not cure a s 48B breach, and s 48B bites even on non-marketing messages.**

**Liability** (DNC §20.7): "The primary responsibility lies with the organisation that sends the messages and **employees are not liable if they are merely acting in the course of their employment**. However, **directors, partners or other officers of similar level of seniority may also be held liable**." Worked (§20.8): the unaware employee is excluded by s 48B(2); "**However, his director B will not be excluded … as he falls under the meaning of an 'officer' under section 48B(3)(b) read with section 52(7).**"

**The penalty band is the higher-risk one.** Enforcement AG ¶27.2 + fn 56: DNC contraventions involving dictionary attacks or address-harvesting software attract up to **S$1 million or 5% of Singapore annual turnover, whichever is higher**, where turnover **exceeds S$20 million** — plus S$200,000 for an individual. Other DNC contraventions are capped at a flat S$1m. **These figures differ from the Data Protection Provisions band (10% / S$10m) — see `obligations.md` § Financial penalties. Do not conflate them.**

**What to check in code:** any path that **generates, permutes, increments, or sequences** telephone numbers — including "try +1 on this number" enrichment and fuzzy-match number repair; any scraper, enrichment job, or import pipeline that **harvests telephone numbers from the web**; and any **purchased contact database** used as a source, with or without vendor consent claims. Also treat **showroom / showflat guestbook** entries as leads with no DNC basis unless there is an explicit opt-in tick (RE §5.8(c), §5.15(c), §5.16(a)).

---

## 8. Offshore routing is irrelevant — DNC §21.1–§21.3

**DNC §21.1, verbatim (s 38):**

> "Section 38 of the PDPA provides that the DNC Provisions apply where:
> a) the sender of the specified message is in Singapore when the message is sent; **or**
> b) the recipient of the specified message is in Singapore when the message is accessed."

**DNC §21.2:**

> "the DNC Provisions **do not apply if both the sender and the recipient are not in Singapore** when the specified message is sent and accessed respectively. … However, **the DNC Provisions would apply if the recipient is travelling in another country and the sender is in Singapore.** The DNC Provisions also apply **where one of the senders is located overseas while another is located in Singapore**."

**DNC §21.3 worked:** a message from an **overseas number**, sent by an **overseas call centre**, **on behalf of and authorised by a Singapore bank** → **subject to the DNC Provisions**.

**Routing sends through an offshore messaging provider does not take them out of scope.** The Singapore-based organisation that authorised the send is a sender under DNC §16.2(c).

The sector version is the same (RE §5.2): the provisions apply "if the sender … is present in Singapore when the specified message is sent **or** the recipient … is present in Singapore when the specified message is accessed."

---

## 9. What must be inside the message — s 44 and s 45

**The obligation** (DNC §11.1, s 44): a specified message to a Singapore telephone number must include clear and accurate:

> "a) information identifying the person who sent or authorised the sending of the specified message (the 'sender'); and
> b) information about how the recipient can readily contact the sender."

**30-day validity** (DNC §11.2): "**The above information must be reasonably likely to be valid for at least 30 days after the message is sent.**"

**Caller line identity** (DNC §11.4, s 45): a person making a voice call containing a specified message must not **conceal or withhold the calling line identity** of the sender.

**Identification.** A website address works only "if the recipient can identify the sender using the information provided within the text of the website address itself, or within the contents of the landing page" (DNC §12.2–§12.4). Related names — brands, outlets, buildings, developments — may be used, but "**Persons should not attempt to obscure or conceal their identity by using related names as identification information**" (DNC §12.5).

**The directly applicable row (DNC §12.11):**

> "**'123 company', a marketing agency for property development XYZ, sends: 'Units in XYZ condominium going fast!'** — Yes, **if this message is being sent on behalf or with the authority of the owner, developer or manager of property development XYZ. However, if 123 is marketing the development on its own, it must identify itself as the sender.**"

**Naming only the development is sufficient identification ONLY when sending with the developer's authority. An agency marketing a project off its own bat must name itself.**

Generic pronouns fail (DNC §12.12): identification "would **not** be considered to have [been] provided … if that information is provided solely in the form of **generic pronouns, e.g. 'me' or 'us', informal nicknames, or fictitious names**."

**Contact information** must "enable the recipient to **directly contact the sender in a reasonably convenient manner**" (DNC §13.1). The straightforward forms: "an **operational Singapore telephone number** which can receive incoming calls or text messages, or a **valid email address** which can receive incoming emails" (§13.2).

**Hard exclusions** (DNC §13.3):

> "Persons should note that **short codes and 'No-Reply' email addresses would not be considered contact information**, as they do not allow the recipient to readily contact the sender."

A **physical address alone fails** (DNC §13.12–§13.15). Both pieces of information may sit **outside the message body**, e.g. in the `From` field (§13.8) — but they must be **within the message**: "Click **here** to contact ABC" fails, and so does `From: ABC` + "Reply 'Y' for contact details" (§13.24–§13.26). Where the contact point doubles as the unsubscribe handle, it must also be usable "on matters unrelated to unsubscribing" (§13.20–§13.23). As good practice, contact information should be "**readily accessible from Singapore and operational during Singapore business hours**", and "the Commission will take into account **the actual outcome when the contact information is used**" (§13.4).

**What to check in code:** every specified-message template carries **both** sender identification and a means to readily contact the sender; both **reasonably likely to remain valid for 30 days** after the send (departing-agent phone numbers and expiring campaign links are the failure mode); both **within the body or the From field**, never behind a bare "click here" or "reply Y"; no **short code** or **no-reply address** as the contact point; the calling line identity never suppressed on voice; and, where a project name is the identifier, a recorded authority from the developer or owner.

---

## 10. 🚩 RE §3.17 — the architectural finding for the data-model owner

This is not a message-template issue. It is a question about how the CRM's data model allocates compliance liability, and it should be raised with whoever owns the schema.

### The two worked examples, side by side

**RE §3.16 — the salesperson IS a data intermediary:**

> "Pursuant to her agreement signed with estate agent ABC, Sarah provides Jack a copy of the estate agency agreement and delivers the completed agreement (which includes personal data such as Jack's full name, NRIC and address) to estate agent ABC.
>
> In this scenario, Sarah is considered to be a data intermediary processing personal data on behalf of and for the purposes of ABC pursuant to a contract made in writing and **will not be subject to the other Data Protection Provisions other than the Protection Obligation and Retention Limitation Obligation**. ABC will have the same obligations under the PDPA in respect of the personal data processed on its behalf by Sarah, as if the personal data were processed by ABC itself."

**RE §3.17 — the salesperson is NOT a data intermediary, verbatim:**

> "**Boris, a salesperson with estate agent DEF, uses personal data of his clients who purchased property in a particular neighbourhood to create a profile of prospective clients that may be interested in properties in that neighbourhood for his own use. Such activities fall outside the scope of the activities that Boris is to carry out on behalf of DEF.**
>
> **In this case, Boris is not considered to be a data intermediary processing personal data on behalf of and for the purposes of DEF pursuant to a contract made in writing.**"

### What this means

The moment an agent builds a **private prospect list, segment, or lead score "for his own use"**, the data-intermediary shield drops and **the agent personally becomes an organisation carrying the full set of Data Protection Provisions** — consent, notification, purpose limitation, access, correction, accuracy, protection, retention, transfer, breach notification, accountability. Individually. As a natural person.

This is reinforced by RE §3.10 (salespersons who are not employees "may instead be considered separate organisations from estate agents") and RE §3.14 ("whether a salesperson may be considered a data intermediary of an estate agent depends largely on the **working arrangements** between the salesperson and the estate agent"). Footnote 14 notes the usual "associate agreement" may make a salesperson "an associate under a contract for service, and not an employee" — so the §3.10 trigger is the **normal case, not the edge case**. The Estate Agents Act definition of "salesperson" itself contemplates contractors: "an individual who in the course of his employment or engagement (**whether under a contract of service or contract for service**) by, or as a director or limited liability partner of, an estate agent does estate agency work."

### The finding to write

> **A CRM that lets agents build personal segments is manufacturing RE §3.17 fact patterns at scale.**

Every per-agent saved segment, personal prospect list, private tag, agent-scoped lead score, or "my clients in District 10 who might want a bigger unit" filter is, on PDPC's own analysis, an activity **outside** the scope of what the agent does on the agency's behalf. Multiply by the agent count and the platform has converted each agent into an independent organisation with unmet obligations — while the agency retains its own liability under s 4(3) and ¶6.12 for whatever *is* done on its behalf.

**What to check in code / schema:**
- Enumerate features that create **agent-owned derived data about clients**: saved segments, personal lists, per-agent tags, private notes used for targeting, agent-scoped scores or rankings, "my pipeline" views built by filtering the client table.
- For each, determine whether the activity is defined in the associate agreement as work done **on the agency's behalf**. If it is not, RE §3.17 applies.
- Two remediation directions, both for the data-model owner rather than the marketing team: **(i)** bring the activity inside the agency's documented scope — segments are agency artefacts, governed by agency policy, visible to agency compliance, retained and purged under agency rules; or **(ii)** accept the split and give agents the machinery to meet their own obligations, which is materially harder.
- Record, per agent, whether they are an **employee**, a **data intermediary**, or a **separate organisation** — RE §3.10, §3.11, §3.14 make compliance ownership follow from that determination, and it is fact-specific. If the answer is not recorded anywhere, that is itself the first finding.

### Adjacent sector points worth carrying

- **Counterparty data is in scope.** RE §2.3 refers throughout to "client(s) **and/or other parties to the transaction**". RE §3.6: where a co-broking agent wishes to disclose the buyer's "name, NRIC and contact details" to the other side, "**Tommy would be required to obtain consent from the buyer**". `[2014 — CONSENT FRAMEWORK MAY BE SUPERSEDED: the requirement to have a lawful basis survives; whether consent is the only route post-2020 is not settled by this document.]`
- **Co-purchaser records captured from the primary client are scope-limited.** RE §3.7: relying on the Second Schedule para 1(m) exception (data provided by another individual to enable a service for that other individual's personal or domestic purposes), "**Jack can only use her details for the purposes of the services that he is providing for the personal or domestic purposes of John**". Such a record may not be marketed to, segmented, or re-used beyond that transaction.
- **Seller circumstances are personal data.** RE §3.4: "the seller says the afternoon sun does not reach the bedroom" is not personal data; telling a buyer that the seller and her husband have two children at a nearby school and are relocating to country XYZ **is**, and needs consent.
- **Business contact information is out of scope, but only to its own edge.** RE §3.8: "the Data Protection Provisions would apply if Andy collects, uses or discloses Jim's or Lisa's personal data, **beyond the business contact information** provided to Andy." BCI is a *provenance* attribute, not a field type.
- **Generic flyers are not personal data use** (RE §2.6 — flyers to all mailboxes addressed to "The Resident"); **mailing former clients by name and address is** (RE §2.7).
- **OTP and Tenancy Agreement forms are lawyer-drafted per transaction** (RE §2.3 fn 1): "These agreements are typically drafted by lawyers according to the requirements of the sale/lease." Unlike the eight CEA-prescribed Estate Agency Agreements, there is **no PDPC-blessed consent wording baked into them** and the agency cannot assume one exists. Substantive guidance on handling personal data in an OTP or TA is **NOT ADDRESSED IN THAT DOCUMENT**.

---

## 11. Known gaps — do not source these from the DNC or Real Estate documents

| Topic | Status |
|---|---|
| NRIC collection rules in real estate (when it may be collected, physical retention, minimisation) | **NOT ADDRESSED** in the Real Estate guidelines — NRIC appears only incidentally at RE §2.3, §3.6, §3.16. Use `nric.md`. |
| Retention periods for real-estate transaction records | **NOT ADDRESSED** — RE mentions the Retention Limitation Obligation only at §3.11 and §3.16 to delimit data-intermediary liability. |
| Enumerated conditions of the Exemption from Section 43 Order (S.817/2013) | **NOT ADDRESSED IN EITHER DOCUMENT** — RE §5.4 says "if certain conditions are met" without listing them; the DNC Guidelines never mention the Order. **Superseded in framing anyway — use the Eighth Schedule (§4 above).** |
| Opt-out requirement attached to the ongoing-relationship carve-out | **Resolved against the statute — there is none in para 1(e).** See §4.3, including the caution about what that does *not* mean. |
| The prescribed period as a number, in the Real Estate document | **NOT STATED** — RE §4.2 and §5.3 say "the prescribed period" without a figure. The 21-day figure comes from DNC §6.2/§6.3 and §8.13. |
| Post-2020 deemed consent / legitimate interests as applied to real estate | **NOT ADDRESSED** — the Real Estate document predates the amendments; the DNC document does not cover the DP Provisions. Use `obligations.md`. |
| Other laws bearing on commercial, charitable or political messaging | Expressly out of scope — DNC §4.37: "other relevant laws may apply … and these Guidelines do not address them." |
