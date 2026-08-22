# AI systems and cross-border transfers

Sources:

- **Advisory Guidelines on Use of Personal Data in Generative AI**, `Issued 20 July 2026`, 18 pages — cited **GenAI ¶x.x**. The newest item in PDPC's regulatory-guidance listing.
- **Advisory Guidelines on use of Personal Data in AI Recommendation and Decision Systems**, `Issued 1 Mar 2024`, 21 pages — cited **AI RDS ¶x.x**. GenAI ¶1.4 says the two "should be read in conjunction".
- **Advisory Guidelines on Key Concepts in the PDPA**, `Revised 29 April 2026` — cited **[KC] ¶x.x**, for Chapter 19 (Transfer Limitation).
- **Advisory Guidelines on the PDPA for Selected Topics**, `Revised 23 May 2024` — cited **[ST] ¶x.x**, for §9 Cloud Services.

⚠️ **Selected Topics has no AI chapter at all.** A full-text search of it for *artificial intelligence*, *machine learning*, *model training*, *LLM* and *generative* returns **zero hits**. The two advisories above are PDPC's AI guidance. Do not fall back on Selected Topics §2 "Analytics and Research" as the governing rule for an AI feature.

---

## PART A — Generative AI

### A1. The role taxonomy — GenAI ¶6.2

> "The Commission identifies relevant stakeholders to include:
> a) '**Model Providers**' who develop and make available Generative AI Models for distribution and use;
> b) '**System Providers**' who develop and make available Generative AI Systems for distribution and use; and
> c) '**System Deployers**' who **use and/or enable the use of Generative AI Systems under their authority**.
> There are also organisations that specialise in collecting, curating and supplying datasets for Generative AI development and/or deployment. Where such datasets include personal data, these organisations are subject to the PDPA."

**An application that calls a hosted model API is a System Deployer.** Part III section 9 is the governing section.

**Roles are per-context** (GenAI ¶6.3):

> "Some organisations may perform different roles in different contexts. For example, an organisation may be a Model Provider when developing a Generative AI Model, and a System Provider when developing systems that integrate their model into end-user products. It follows that **they may be an organisation in some contexts, and a data intermediary in another**. Organisations should be clear about their role and the applicable PDPA obligations in each context, and develop and implement policies and practices as necessary…"

If the product also **fine-tunes** a model on user data, it additionally becomes a **Model Provider** and Part II section 4 applies.

**What to check in code:** whether any internal governance document states the role at all. ¶6.3 expects the organisation to be explicit about which role it occupies in each context. An unwritten role determination is the first finding.

### A2. System Deployers bear primary responsibility — GenAI ¶9.1

> "System Deployers may develop and deploy Generative AI Systems in-house, in which case they take on the roles of Model and/or System Providers, or **procure and use systems as a service (e.g. through SaaS platforms, API-based offerings)**. Regardless, **System Deployers bear primary responsibility for ensuring that the Generative AI Systems they have chosen to use can meet their obligations under the PDPA**. When procuring systems, they must therefore ensure that they have **sufficient information on upstream safeguards to conduct a holistic assessment**."

**"API-based offerings" is named explicitly. You cannot discharge the obligation by pointing at the vendor.**

**What to check in code / repo:** whether any vendor due-diligence artefact exists at all — a security review, a completed questionnaire, a recorded decision. ¶9.1 requires "sufficient information on upstream safeguards" **before** procurement.

### A3. The model provider running inference is a data intermediary — GenAI ¶7.4

> "Model Providers may process personal data on behalf of downstream users, as part of service(s) provided to users by System Deployers. For example, Model Providers may **run inference** to deliver real-time outputs to user inputs or **host data on their infrastructure**. In this context, **they are data intermediaries under the Act** and must comply with applicable PDPA provisions. This includes protecting personal data in their possession or under their control by making reasonable security arrangements ('Protection Obligation')."

Footnote 18: "**Inference** is the process where a trained Generative AI Model generates new outputs by reasoning and making predictions on new data."
Footnote 20: "See S. 24 of the PDPA. **Data intermediaries are also subject to the Retention Limitation Obligation.**"

**The open-weight carve-out** — footnote 19:

> "Open-weight Model Providers release their model weights or other technical artefacts to enable independent development and deployment by other downstream System Providers and Deployers. **In such instances where Model Providers do not have access to personal data in downstream systems built on their models, they are not subject to PDPA obligations in respect of that data.**"

**What the provider should publish, and why you need it** (GenAI ¶7.5):

> "In demonstrating compliance with their Protection Obligation, it is good practice for Model Providers to document and make available the measures they have taken to safeguard personal data from downstream sources. For example, a Model Provider may document their **data access controls, data residency and retention policies and incident response and data breach procedures**. This information will also support System Providers and Deployers in meeting their PDPA obligations by helping them assess (i) the adequacy of their system-level security arrangements; (ii) whether there has been unauthorised access and modification; and (iii) **whether such access and modification is a notifiable data breach**."

**Two consequences.** First, a **written processing contract** is required for the data-intermediary regime to attach at all ([KC] ¶6.16; [ST] ¶9.2) — and a hosted LLM is almost certainly overseas, so Part B applies too. Second, the vendor's incident-response terms feed **your** breach-assessment path (see `breach.md` §6).

**What to check in code / contracts:** is the vendor agreement a **DPA**, or click-through consumer ToS? Is the vendor's breach-notification timeline recorded somewhere the incident runbook can reach? Are self-hosted or open-weight models in use — footnote 19 changes the analysis entirely, because there is then **no third-party intermediary**.

### A4. Training and fine-tuning need AI-Specific Notifications — GenAI ¶4.4

> "The Commission is of the view that **General Notifications are an insufficient means of obtaining consent to use User Data for Generative AI development**, specifically, for large-scale Generative AI Model training and/or fine-tuning. **Organisations must provide AI-Specific Notifications for this purpose.** The key purpose of the Consent and Notification Obligations is to enable individuals to provide meaningful consent. While notifications need not be overly technical or detailed, individuals must be able to understand the type(s) of personal data affected and how it will be used to train and/or fine-tune AI models, as well as the function(s) of these models."

**Footnote 11 — the scope limiter, important for not over-reading this:**

> "This refers only to activities that **develop or modify a model's parameters or underlying capabilities**."

GenAI ¶4.3 defines the two species: a **General Notification** is a generic purpose statement that "may cite the use of personal data for 'new product development' **without specifying AI or Generative AI Model development**"; an **AI-Specific Notification** is "an **explicit statement** that the purpose of processing includes AI and/or Generative AI Model development".

**Footnote 11 draws the line at modifying model parameters.** Ordinary inference — sending a prompt to a frozen hosted model — is **not** training and does not trigger ¶4.4. Building a RAG embeddings index is retrieval, not parameter modification; it does not trigger ¶4.4 either, but it is squarely governed by ¶9.3 and ¶10.5(b) below.

**What to check in code / vendor settings:** the provider account's **data-usage setting** — a zero-retention / no-training tier versus the default. If the default API tier permits the vendor to train on submitted data, the organisation has effectively enrolled its clients in model training **without** an AI-Specific Notification. Then look for any fine-tuning job or embedding-*training* job in the codebase.

### A5. What an AI-Specific Notification must carry — GenAI ¶4.6

> "Thus, while organisations retain discretion to determine the appropriate manner and form of notification, which may include existing policies, terms of use etc., they are encouraged to provide the following information, to the extent practicable, in their AI-Specific Notifications:
> a) The **function(s)** of the Generative AI Model that require the use of personal data (e.g. text-to-speech function that converts written text into spoken audio);
> b) A clear description of the **type(s) of personal data** that will be used to develop the Generative AI Model (e.g. voice data, corresponding transcripts that identify individuals);
> c) **How** personal data will be used to train and/or fine-tune the Generative AI Model (e.g. data will be used to train the model to recognise speech patterns); and
> d) **How individuals can decline or withdraw consent** to the use of personal data for AI training (e.g. by providing step-by-step instructions or an easily accessible opt-out mechanism)."

¶4.7 permits layering: "organisations can 'layer' their notifications to display the most relevant information prominently with details provided elsewhere. They may also consider providing a single AI-Specific Notification for consent to train multiple models".

**What to check in code:** ¶4.6(d) is the one with a code path behind it. **An opt-out that exists only as prose in a privacy policy does not satisfy it.** Look for a persisted per-individual opt-out flag; whether the training/fine-tuning job **filters on it**; and whether withdrawal **propagates to data already exported to the vendor**.

### A6. Consent may not be a condition of service — GenAI ¶4.8

> "Organisations are reminded that they **must not, as a condition of providing a product or service, require individuals to consent** to the collection, use or disclosure of personal data, such as the use of User Data for Generative AI Model development, **beyond what is reasonable to provide the product or service** to that individual."

**What to check in code:** the sign-up / onboarding flow, for a bundled "I agree to the Terms (which include AI training)" checkbox that **gates account creation**. That pattern contravenes ¶4.8. AI-training consent must be **separable** from service consent. (This is the ¶12.10/¶14(2) spa example applied to AI — see `obligations.md` § Consent.)

### A7. Business Improvement and Research do NOT automatically cover model training — GenAI ¶4.2

> "As a starting point, organisations may consider relying on exceptions to the 'Consent Obligation' or deemed consent to use User Data to develop Generative AI Models. However, **in cases where organisations determine that such alternatives are not applicable, they must obtain consent.** The Consent Obligation is complemented by the 'Notification Obligation', which requires individuals to be notified of the purpose of the intended use of their personal data when their consent is sought for such use."

Footnote 7 points at the exceptions: "For example, the business improvement and research exceptions. See paragraphs 4.1 to 6.4 of the Advisory Guidelines on Use of Personal Data in AI Recommendation and Decision Systems."

**The worked example under ¶4.2 has the organisation REJECT the exception. Quote this whenever someone claims Business Improvement covers everything:**

> "An apparel company rebrands itself as a developer of Generative AI Models and intends to use its User Data for training, to gain a commercial advantage. The data includes customers' names, transaction histories and longitudinal behavioural data. The company considers if it can rely on the business improvement exception on the basis that it is developing new goods or services. **It determines that using personal data from its User Data for Generative AI development is so significant a departure from past commercial activities that a reasonable person would not consider the use to be appropriate.**
> **In this case, the appropriate course of action is to obtain fresh consent.**"

**The test is whether the AI use is a significant departure from past commercial activities.** A CRM bolting on a general-purpose assistant trained on client transaction history is close to the example's facts.

**What to check in repo / policy docs:** any written reliance on the Business Improvement Exception for AI features. It needs a **documented reasonable-person assessment**, not an assertion.

### A8. Purpose limitation on what enters the model — GenAI ¶9.2

> "Another responsibility is ensuring that the personal data processed by their chosen system is for relevant purposes. Section 18 of the PDPA limits the collection, use or disclosure of personal data about an individual only for purposes and to the extent that a reasonable person would consider appropriate in the circumstances ('Purpose Limitation Obligation'). While Generative AI Systems can perform a variety of tasks, **System Deployers should be disciplined about specifying the intended purpose of processing and amount of personal data required for this purpose.** They are also reminded that personal data should not be processed for illegal and/or harmful purposes."

**The worked example is an access-control pattern:**

> "Organisation A wants to deploy a document triaging system in its medical records department. Pre-deployment, it **clearly defines the system's purpose** … and identifies **essential personal data required**. Organisation A also **configures access controls so that the system cannot query or retrieve data outside its purpose** (e.g. it has no access to other databases such as billing systems or patient contact lists)."

**This is the strongest argument against "just pass the whole client record into the context window".**

**What to check in code:** the **prompt-construction code path** — does it select named fields, or serialise an entire row or join? Does the assistant's tool surface have read access to tables irrelevant to its purpose? For a RAG store, does the retriever scope by tenant/owner, and does the indexed document set **exclude fields the assistant has no purpose for** (identity numbers, financials, date of birth)?

### A9. 🔑 Prompts, inputs, outputs, tool activity and internal data — GenAI ¶9.3

**This is the load-bearing paragraph for any product with an in-app assistant. Verbatim:**

> "Pursuant to the Protection Obligation, System Deployers must also safeguard personal data in their possession or under their control. This includes **new categories of data sources that are collected through their systems (e.g. end-user prompts, inputs and generated outputs, agent or tool activity data, internal enterprise data)**. System Deployers must **track and designate responsibilities over new data sources** and implement corresponding safeguards. This includes **educating their end users, whether internal or external, on the specific types of personal data that should be input into their systems** (e.g. only pre-defined categories of personal data) and how personal data will be processed following collection."

**GenAI ¶9.4:**

> "System Deployers are further encouraged to develop **clear written policies and document processes** in relation to the safeguards undertaken. **Pre-emptively making such policies available (e.g. on their website)** will also demonstrate accountability in compliance with the PDPA."

**The worked example under ¶9.3 reads as an implementation checklist — verbatim:**

> "Organisation B deploys a human resources ('HR') system to manage its employee engagement, training and performance reviews. In addition, employees can query how organisational HR policies apply to them using an in-system chatbot. The system is overseen by Organisation B's HR unit. Organisation B adopts the following measures to safeguard personal data processed by the system:
> - **Designates its HR unit as responsible** for safeguarding the prompts and outputs generated through the system's chatbot;
> - **Develops guidelines on the types of personal data that can be included in prompts**;
> - **Implements measures to scan prompts for common personal identifiers and limit access to prompt logs to authorised maintenance personnel**; and
> - **Documents these arrangements in internal AI governance guidelines, which are also disseminated to all employees.**"

**PDPC treats prompt logs, model outputs, and agent/tool activity data as personal-data stores in their own right.**

**What to check in code — the four measures, mapped:**

| ¶9.3 measure | Concrete check |
|---|---|
| **Designate an owner** | Is any team or role named as responsible for prompts and outputs? ¶9.3 requires responsibilities to be *designated*, not implied. |
| **Publish guidelines on what may go in prompts** | Is there in-product guidance telling users what may be typed into the assistant? Is there an internal AI governance document, disseminated? |
| **Scan prompts for identifiers** | Is there any redaction or detection **before the prompt leaves the process**? For Singapore that means NRIC/FIN/passport at minimum. |
| **Restrict access to prompt logs** | Does a prompt/response log table or log sink exist? Who can read it? Is access role-gated? Is it in the **same backup and retention regime** as the client table? |

Two further surfaces ¶9.3 names explicitly and teams routinely miss:

- **Agent or tool activity data.** An agentic assistant logging **tool arguments** will have personal data in the trace even if the prompt itself was scrubbed. Check the tracing/observability destination — a third-party APM is **another transfer** (Part B).
- **Internal enterprise data.** Whatever the assistant is given access to internally is in scope, not only what the end user types.

### A10. Agentic systems — GenAI ¶9.5

> "Lastly, as AI risks continue to evolve, System Deployers should **regularly review the sufficiency of their safeguards**. This is especially relevant where their Generative AI Systems have **agentic functionalities**. While the definition of AI agents remains unsettled, common features include **independent planning and action taking across multiple steps, often involving access to external tools and systems**, to achieve user-defined objectives. These enhanced capabilities can **exacerbate data protection risks and complicate responsibility allocation**. System Deployers should carefully consider and be transparent about the **privacy-utility trade-offs** when scoping their agentic use cases. For further guidance on managing agentic risks, organisations may wish to refer to IMDA's Model AI Governance Framework for Agentic AI."

The worked example's three measures: **role-based controls** restricting the assistant's file and network access; **data classification** tagging sensitive personal data for stricter handling; and "**escalating protocols to humans for complex or high-risk tasks**".

**What to check in code:** the **tool authorisation model**. Does each tool re-check the *caller's* permissions, or does the agent run with **ambient service-level credentials**? An agent that can read any client row regardless of which user is asking is exactly the failure mode ¶9.5 describes. Also check whether any tool can *act* — send a message, share a file, write a record — and what gates that.

> **Note:** IMDA's *Model AI Governance Framework for Agentic AI* is **NOT HELD** and is not a PDPC instrument. Do not attribute content to it.

### A11. Retention of training and inference data — GenAI ¶¶7.2–7.3

**¶7.2** restates s 25 for Model Providers: cease to retain, or remove the means of association, when the purpose is no longer served and retention is no longer necessary for legal or business purposes.

**¶7.3 — and note the final sentence:**

> "The Commission accepts that it may be necessary for Model Providers to preserve their training data to develop or enhance future models. Where such data includes identifiable personal data, it is good practice for Model Providers develop and make available a **data retention policy that includes the rationale for retaining data for a longer period of time**. Model Providers should also **regularly review** the personal data in their possession to determine if such data is still needed. **This guidance similarly applies to System Providers and Deployers who retain personal data to develop and deploy Generative AI Systems.**"

**What to check in code:** is there any TTL or purge job on the prompt/response log table? On the vector store? **When a client is deleted from the CRM, are their embeddings and chat history deleted too**, or does deletion only cascade over the relational tables? A soft delete on `clients` that leaves vectors and prompt logs intact is a Retention Limitation finding — and per [KC] ¶18.11, archiving or limiting access to those stores does not discharge s 25 either (see `obligations.md` § Retention Limitation).

### A12. Minimisation and anonymisation — GenAI ¶5.1

> "Notwithstanding the above, organisations are encouraged to **anonymise their datasets as much as possible and/or practice data minimisation** when developing Generative AI Models, to minimise unnecessary risks. Where personal data is necessary for Generative AI development, organisations are reminded to implement appropriate **physical, technical, process and legal controls** for data protection."

Footnote 14: "**Anonymised data is not considered personal data and thus, is not governed by the PDPA.** See Guide to Basic Anonymisation."

**Footnote 14 is the escape hatch worth engineering toward** — but hold it to [ST] ¶3.2's standard: "**PDPC views 'de-identification' as referring to only the removal of direct identifiers and does not equate it with 'anonymisation'**", and [ST] ¶3.4's "serious possibility" of re-identification test. Note also that **embeddings of identifying text are not anonymised**.

**What to check in code:** whether the RAG index could be built over **de-identified property and transaction facts** rather than named client records.

### A13. Access and correction over AI systems — GenAI section 10

**¶10.3:**

> "In the Generative AI context, the Access and Correction Obligations apply to personal data which has been collected, used or disclosed for model or system development or deployment. Organisations **must accede to individual requests unless an exception under the PDPA applies**."

**¶10.2 — control extends to intermediaries:**

> "Personal data under an organisation's control is **not limited to data in its possession; it also includes data transferred to a data intermediary**. Organisations must take such data into account when responding to access and correction requests. While data intermediaries may facilitate requests or forward them to controlling organisations, **they are not obliged to do so under the PDPA**."

¶10.4 acknowledges the practical difficulty — "training data is not stored in a traditional repository but as embeddings, User Data is temporarily held in context windows".

**¶10.5 best practices, with the RAG carve-out at (b):**

> "a) Adopt **upstream data handling measures** such as (i) verifying data accuracy at the point of collection; (ii) implementing data cleaning techniques like de-duplication and outlier detection; and (iii) **maintaining data provenance records** to document the lineage of training data;
> b) Review access and correction requests **on a case-by-case basis and accede where reasonable (e.g. where the request refers to personal data stored in a Retrieval-Augmented Generation database)**. Organisations are also encouraged to ensure that personal data, including inaccurate data, is **removed from training datasets before they undertake future AI training runs**; and
> c) Track the maturity of and progressively adopt appropriate technical measures to remove inaccurate personal data from models and systems. In the interim, organisations can consider **output filters** and other safeguards to minimise the likelihood of models or systems producing inaccurate data as outputs."

**¶10.5(b) names RAG databases explicitly as a place where correction requests SHOULD be honoured. PDPC does not accept "it's in the index, we can't change it".**

**What to check in code:** is there a code path to **update or delete a single individual's vectors**? Does a correction in the CRM trigger **re-embedding**? Does the access-request extractor cover the vector store and the prompt logs? ¶10.2 also means an access request must account for data sitting **with the LLM vendor** — check whether vendor-side retention is known and reachable.

---

## PART B — AI Recommendation and Decision Systems (1 Mar 2024)

This advisory supplies the **exception-to-consent machinery** that the GenAI advisory only cross-references.

### B1. Consent is the default at deployment — AI RDS ¶9.1

> "Unless deemed consent or exceptions to the Consent Obligation apply, e.g., Legitimate Interests Exception, pursuant to Section 13 of the PDPA, **consent will be required for the collection and use of personal data to provide recommendations, predictions, or decisions.** This is referred to as the Consent Obligation."

**What to check in code:** anything that **scores leads, ranks clients, matches clients to properties, or recommends properties to specific named individuals** is producing "recommendations, predictions, or decisions" about them. What consent or exception is recorded **for that use**? It is a separate question from consent for the underlying CRM record.

### B2. The four permitted Business Improvement purposes — AI RDS ¶5.1

> "The Business Improvement Exception enables organisations to **use, without consent, personal data that they had collected in accordance with the PDPA**, where such use falls within the scope of the following relevant purposes:
> a) Improving, enhancing existing goods and services or **developing new goods or services**;
> b) Improving, enhancing existing methods or processes or developing new methods or processes for business operations in relation to the organisations' goods and services;
> c) **Learning or understanding the behaviour and preferences of individuals** (including groups of individuals segmented by profile); or
> d) **Identifying goods and services that may be suitable for individuals** (including groups of individuals segmented by profile) or **personalising or customising** any such goods or services for individuals."

Note the precondition in the opening line: the data must have been "**collected in accordance with the PDPA**" in the first place. An unlawfully collected dataset cannot be laundered through this exception.

### B3. The two cumulative conditions — AI RDS ¶5.2

> "In addition, organisations will need to ensure the following:
> a) **The business improvement purposes cannot reasonably be achieved without using the personal data in an individually identifiable form**; and
> b) The organisation's use of personal data for business improvement purpose(s) is that which a **reasonable person would consider appropriate in the circumstances**."

**Condition (a) is a necessity test on identifiability, and it is the one most often failed.** If the AI feature would work on de-identified or aggregated data, the exception is not available.

**What to check in repo:** a written assessment showing identifiable data was **necessary**. For a property-recommendation feature, could it run on anonymised preference vectors? Pair with GenAI ¶5.1 / fn 14 — properly anonymised data leaves PDPA scope entirely.

### B4. Business Improvement vs Research — AI RDS ¶4.2

> "a) The **Business Improvement Exception** is relevant when the organisation has developed a product or has an existing product that it is enhancing. It is also relevant when an AI System is intended to improve operational efficiency by supporting decision-making, or to offer more or new personalised products and/or services such as through offering recommendations to users. The Business Improvement Exception caters for sharing with related companies within a group of companies, as wells interdepartmental sharing within a company.
> b) The **Research Exception** is relevant when the organisation is conducting commercial research to advance the science and engineering **without a product development roadmap**. It also caters for sharing data between unrelated companies for jointly conducted commercial research to develop new AI Systems."

*(sic — "as wells" appears in the original.)*

Footnote 2 attaches a condition to intra-group sharing: "where related companies are transferring data to each other, these companies **should be bound by a contract or agreement or binding corporate rules** requiring the recipient of personal data to implement and maintain appropriate safeguards for that data."

**The Research Exception requires no product development roadmap — so it is not available for shipping features.** If any document claims Research Exception cover for a shipped assistant, that is a finding. (Key Concepts ¶12.80(c) reinforces it: research results "will not be used to make any decision that affects the individual".)

### B5. Testing, evals and bias assessment — AI RDS ¶¶5.6, 5.8, 5.10

**¶5.6:**

> "Organisations could rely on the Business Improvement Exception to use personal data to **test AI Systems**, taking into consideration the requirements as set out in paragraphs 5.1 to 5.3 above. Organisations may need to use personal data to test an AI System to improve or assess model performance e.g., to assess its accuracy in a live environment with personal data; ensure that de-biasing of the model is effective; or to check if privacy enhancing measures have compromised the accuracy of the AI System."

**¶5.8:** "The Business Improvement Exception could apply to the use of personal data for **bias assessments**… personal data may need to be used to check if protected characteristics, such as race or religion, are well represented in datasets…"

**¶5.10:** "The Commission understands that generally, industry best practice is to use personal data to debias datasets used for model training."

This legitimises using real personal data in **eval and test environments** — but ¶5.7 notes that **different standards for securing and protecting those datasets apply**.

**What to check in code / infra:** do staging and eval environments hold **production client data**, and are they protected to the **same standard as production**? Copying the client table into a dev database for prompt evals is the classic failure. Check eval fixtures and golden datasets committed to the repo.

### B6. Bespoke AI developers are data intermediaries — AI RDS ¶1.4

> "Third-party developers of bespoke AI Systems ('Service Providers') are **data intermediaries** who have obligations under the PDPA i.e., **Protection and Retention Obligations**. When developing AI Systems, such Service Providers will handle personal data provided by their client organisations. As required under their Protection Obligation, Service Providers should **guard against unauthorised modification** of the personal data they are processing. Good practices that Service Providers could undertake include **data mapping and labelling, as well as the maintenance of provenance records**."

¶11.2 restates the good practices: at pre-processing, "use techniques such as data mapping and labelling to keep track of data that was used to form the training dataset"; and "maintain a **provenance record** to document the lineage of the training data that identifies the source of training data and tracks how it has been transformed during data preparation."

### B7. ⚠️ Scope limit on Part V — AI RDS ¶11.1

> "This section is relevant for **Service Providers (e.g., systems integrators) who are engaged by organisations to provide professional services for the development and deployment of bespoke or fully customisable AI Systems**. It is **not relevant to organisations that develop AI Systems in-house or who retail commercial off-the-shelf solutions** that make use of AI for their product features and functions."

**This is a scope trap.** If the product is built in-house or is an off-the-shelf SaaS, **Part V does not apply to it — do not cite section 11 against an in-house build.** It **does** apply to any contracted agency or systems integrator building bespoke AI features on your data: check whether such a contractor exists and whether a written processing contract is in place.

---

## PART C — 🚩 THE NEGATIVE FINDING: neither AI advisory addresses overseas transfer

**This is load-bearing. Do not let a generated report imply the AI guidelines settle the cross-border question. They are silent on it.**

### C1. The grep evidence

Over the full extracted text of both PDFs:

```
# Generative AI advisory (20 Jul 2026) — 2 incidental hits, no operative rule
$ grep -inE 'transfer|overseas|cross-border|data residency' genai.txt
569:  may document their data access controls, data residency and retention policies and
      -> ¶7.5, a Model Provider *disclosure practice*, not a transfer rule
760:  it also includes data transferred to a data intermediary. Organisations must take such
      -> ¶10.2, about ACCESS requests, not transfer

# AI RDS advisory (1 Mar 2024) — ZERO hits
$ grep -icE 'overseas|transfer limitation|cross-border' airds.txt
0
```

**Neither document contains the phrase "Transfer Limitation Obligation". Neither mentions section 26 of the PDPA. Neither discusses data residency as a compliance requirement.**

The GenAI advisory's Part III allocates **Protection**, **Retention Limitation**, **Purpose Limitation** and **Accountability** across the three roles (¶2.2) — **but not Transfer Limitation.**

### C2. The consequence

**Sending client personal data to an overseas LLM API is governed by [KC] Chapter 19 plus Part 3 of the Personal Data Protection Regulations 2021. The AI advisories add nothing to that analysis and provide no exemption from it.**

Anyone arguing "the new AI guidelines cover our LLM usage" has to be shown this grep. The AI advisories tell you *who is responsible* and *what safeguards to apply*; they do not tell you whether you may send the data abroad.

### C3. And the "Guide to Cross-Border Data Transfers" is a hub page, not a document

- **Date shown:** `Published on 14 Apr 2026 / Last updated 14 Apr 2026`
- **URL:** https://www.pdpc.gov.sg/organisations/resources/guidance-by-topic/guide-to-cross-border-data-transfers

**Do not go looking for a guide PDF — there isn't one.** The page is a navigation hub with three scroll sections (`Meeting the Transfer Limitation Obligation (TLO)`, `Contracts for Cross-Border Data Transfers`, `Specified Certifications for Cross-Border Data Transfers`), and it points at the actual authorities:

> clipboard-pen **Personal Data Protection Regulation 2021** — Reference: **Part 3** for the relevant legislation
> book-open-check **Advisory Guidelines on Key Concepts in the PDPA**

Resources it links: `Guide for Using the ASEAN MCCs`, `ASEAN Model Contractual Clauses (MCCs)`, `Using ASEAN MCCs for Cross Border Data Flows in Singapore`, `Joint Guide to ASEAN MCCs and EU Standard Contractual Clauses (SCCs)`, `Joint Guide to ASEAN MCCs and RIPD MCCs`, and sample clauses `For Data Transfers to Certified Recipients`. For non-ASEAN counterparties: "you can refer to relevant contract templates from other jurisdictions as a guide … These include: China Standard Contract for Cross-Border Transfer of Personal Information / EU Standard Contractual Clauses (SCCs) / The Ibero-American Data Protection Network's Model Contractual Clauses."

**So the operative text is Key Concepts Chapter 19.**

### C4. The TLO decision flowchart

`Meeting The Transfer Limitation Obligation (TLO)` — https://www.pdpc.gov.sg/assets/3c79b265-7f1b-458a-9ff5-a94c343a5df5

Verbatim decision sequence:

```
Q1. Are you transferring personal data to an overseas recipient?   No  -> TLO does not apply
Q2. Is the recipient your own organisation or employee?            No  -> continue
Q3. Does the recipient hold a specified certification?             Yes -> Proceed on this basis, or go to Q4
Q4. Will the recipient have legally enforceable obligations
    comparable to the PDPA?                                        Yes -> satisfied
Q5. Do any of the special circumstances apply?                     No  -> TLO is not satisfied
```

Side panels, verbatim:

> "Specified certifications refers to: Global Cross-Border Privacy Rules (CBPR) / Global Privacy Recognition for Processors (PRP) / APEC CBPR / APEC PRP. **The PRP is suitable for cases where the recipient is a data intermediary, while the CBPR suits any types of cases.**"

> "You can ensure that the recipient has legally enforceable obligations by either one of the following: **Contracts** – Having the right terms in your contract with them / **Laws** – Reviewing what national laws apply to them / **Binding Corporate Rules** – Having binding corporate rules (where your organisation and the recipient are related)"

> "Special circumstances include: Where the individual has consented / Vital interests of the individual / National interests / Personal data is in transit / Personal data is publicly available in Singapore"

**Q2 is the branch most often missed.** For an LLM API the answer to Q2 is **No**, and you land on Q3.

---

## PART D — Cross-border transfers under Key Concepts Chapter 19

Full treatment is in `obligations.md` § Transfer Limitation. What follows is the analysis specific to AI and SaaS vendors.

### D1. Two cases to distinguish in the codebase — [KC] ¶19.1

> "Section 26 of the PDPA limits the ability of organisations to transfer personal data to another organisation outside Singapore **in circumstances where it relinquishes possession or direct control** over the personal data… In situations where personal data transferred or situated overseas **remains in the possession or control of an organisation, the organisation has to comply with all the Data Protection Provisions**. Such situations include … where an organisation **stores personal data in an overseas data centre on servers that it owns and directly maintains**. In these examples, the organisation has direct primary obligations … to, *inter alia*, protect the personal data, give effect to access and correction requests, and **include these overseas data repositories in its data retention policy**."

| Case | Is it a s 26 transfer? | What applies |
|---|---|---|
| **Own infrastructure overseas** — a DB or object store in a non-SG region that you control | **No** | All other Data Protection Provisions apply directly, and ¶19.1 explicitly requires you to include those repositories in your **retention policy** |
| **Third-party overseas processor** — an LLM API, an APM/tracing vendor, an email/SMS gateway, a hosted vector DB, a managed search service | **Yes** | Needs a ¶19.4 basis |

**What to check in code / infra:** the **deployment region of every datastore** AND the **jurisdiction of every third-party SDK that receives request payloads**. The second list is the one that gets missed — front-end tags and error trackers ship payloads abroad without appearing in any architecture diagram.

### D2. The core condition — [KC] ¶19.4

> "The Personal Data Protection Regulations 2021 specify the conditions under which an organisation may transfer personal data overseas. In essence, an organisation may transfer personal data overseas if it has taken appropriate steps to ensure that the overseas recipient is **bound by legally enforceable obligations or specified certifications** to provide the transferred personal data a standard of protection that is **comparable to that under the PDPA**."

### D3. 🔑 Country-naming, and its tension with multi-region model routing — [KC] ¶19.5

> "Legally enforceable obligations may be imposed in two ways. First, it may be imposed on the recipient organisation under:
> a) any law;
> b) any contract that imposes a standard of protection that is comparable to that under the PDPA, and **which specifies the countries and territories to which the personal data may be transferred under the contract**;
> c) any binding corporate rules that require every recipient … to provide a standard of protection … comparable to that of the PDPA, and which specify (i) the recipients of the transferred personal data to which the binding corporate rules apply; **(ii) the countries and territories to which the personal data may be transferred** under the binding corporate rules; and (iii) the rights and obligations provided by the binding corporate rules; or
> d) any other legally binding instrument."

**The country-specification requirement appears twice — ¶19.5(b) for contracts and ¶19.5(c)(ii) for binding corporate rules.**

**The tension, stated plainly:** a generic vendor DPA that says "we protect your data" but never names countries **does not satisfy ¶19.5(b)**. "We may process in any region" is the **opposite** of what ¶19.5(b) requires. **Multi-region model routing** — a gateway that dispatches to whichever provider or region has capacity — makes the country list **indeterminate**, and is therefore hard to reconcile with ¶19.5(b). **Pin the region if you can.**

The consent route does not escape it either. The cloud worked example under ¶19.8 requires the written summary to cover "**the countries and territories that it will be transferred to**" — and note the example's data types, which are almost exactly a property CRM client record: "clients' identification details, address, contact details and income range".

**Where the vendor genuinely will not name regions**, [ST] ¶9.9 gives the fallback:

> "Where the contract between an organisation and its CSP **does not specify the locations** to which a CSP may transfer the personal data processed and **leaves it to the discretion of the CSP**, the organisation may be considered to have taken appropriate steps to comply with the Transfer Limitation Obligation by ensuring that (a) the CSP based in Singapore is **certified or accredited as meeting relevant industry standards**, and (b) the CSP **provides assurances that all the data centres or sub-processors in overseas locations** that the personal data is transferred to comply with these standards. For example, the organisation could consider engaging a CSP that is certified as compliant with the **ISO27001** standard and **can produce technical audit reports such as the SOC-2 upon request**."

**A gateway that falls back across providers is exactly the "leaves it to the discretion of the CSP" case — which then obliges you to hold assurances covering *every* possible destination.**

### D4. The CBPR / PRP asymmetry — [KC] ¶19.6

> "'specified certification' refers to certifications under (i) the **Global CBPR** System, (ii) the **Global PRP** System, (iii) the **APEC CBPR** System, and (iv) the **APEC PRP** System. The recipient is taken to satisfy the requirements under the Transfer Limitation Obligation if:
> a) it is receiving the personal data **as an organisation** and it holds any of the **Global CBPR or APEC CBPR** certifications; or
> b) it is receiving the personal data **as a data intermediary** and it holds any of the **Global CBPR, APEC CBPR, Global PRP, or APEC PRP** certifications."

**Rule: PRP only works if the recipient is your data intermediary. CBPR works either way.**

PDPC's worked example of getting it wrong (Resort Delta, p.128): the recipient held only APEC PRP and was **not** receiving the data as a data intermediary, so the transfer could not rely on it — "Company Charlie should consider whether it can rely on any other avenue as set out at paragraph 19.5 above."

### D5. Due diligence must be performed and recorded — [KC] ¶19.8

Every certification example uses the same verb pair. **The recipient's assertion is not enough:**

> "Air Bravo **informs** Alpha.com that it is certified under the Global CBPR System in Japan. Alpha.com **carries out due diligence and determines** that Air Bravo is indeed certified under the Global CBPR System **by referring to the list of certified organisations on the Global CBPR Forum website (www.globalcbpr.org)**."

The closest analogue to a CRM in the guidelines, verbatim:

> "Organisation MNO engages a firm based in the US, Company PQR, as a **data intermediary to use its CRM system** to process and store customers' information… Company PQR informs MNO that it is certified under the APEC CBPR System but not under the APEC PRP System. MNO **carries out due diligence and determines** that Company PQR is indeed certified under the APEC CBPR System **by referring to the list of certified organisations on the APEC website (www.cbprs.org)**."

And for a US analytics data intermediary under Global PRP, the same pattern via globalcbpr.org.

**Required due diligence = verify the certification against the official registry (globalcbpr.org / cbprs.org) and record that you did, with the date.**

**What to check:** is there **any** vendor-verification record for the LLM provider? **Most LLM vendors hold no CBPR/PRP certification** — in which case route 2 is unavailable and you fall back to ¶19.5(b) contract terms, which must then **name countries**.

### D6. Fallbacks are a last resort — [KC] ¶19.7

> "Organisations are encouraged to rely on legally enforceable obligations or specified certifications outlined in paragraphs 19.5 and 19.6, **especially when they have an ongoing relationship with the recipient organisation**. Legally enforceable obligations provide better accountability… **As good practice, organisations are encouraged to rely on these circumstances only if they are unable to rely on legally enforceable obligations or specified certifications:**
> a) the individual … gives his consent to the transfer …, **after he has been informed about how his personal data will be protected in the destination country**;
> b) the individual is deemed to have consented … where the transfer is reasonably necessary for the conclusion or performance of a contract between the organisation and the individual…;
> c) the transfer is necessary … in the vital interests of individuals or in the national interest…;
> d) the personal data is **data in transit**; or
> e) the personal data is **publicly available in Singapore**."

Footnote 52: the organisation "should … provide the individual with a **reasonable summary in writing** of the extent to which the personal data transferred to those countries and territories will be protected to a standard comparable to the protection under the PDPA."

**An LLM API is an ongoing relationship**, so leaning on consent rather than contract terms is **against the grain of ¶19.7**.

**Data in transit does not help** ([KC] ¶19.11): it covers personal data merely routed *through* Singapore en route elsewhere, "**without the personal data being accessed or used by, or disclosed to, any organisation** … while the personal data is in Singapore". An LLM API call is excluded by definition — the data is accessed and used by the recipient.

### D7. What the transfer contract must minimally cover — [KC] ¶19.9

| S/N | Area of protection | Recipient is **Data Intermediary** | Recipient is **Organisation** (except DI) |
|---|---|---|---|
| 1 | Purpose of collection, use and disclosure by recipient | — | ✓ |
| 2 | Accuracy | — | ✓ |
| 3 | Protection | ✓ | ✓ |
| 4 | Retention limitation | ✓ | ✓ |
| 5 | Policies on personal data protection | — | ✓ |
| 6 | Access | — | ✓ |
| 7 | Correction | — | ✓ |
| 8 | Data Breach Notification | ✓ — "To notify organisation of data breaches without undue delay" | ✓ — "To assess and notify the Commission/affected individuals of data breaches, where relevant" |

**Footnote 54** qualifies the left column: it applies only to a data intermediary processing "**pursuant to a contract evidenced or made in writing**". **Accepting click-through consumer ToS with no written processing terms means you do not get the reduced column, and the fuller organisation-column list applies.**

¶19.10 encourages the **ASEAN Model Contract Clauses**.

**For an overseas LLM provider acting as a data intermediary, the contract must minimally cover Protection, Retention limitation, and Data Breach Notification (notify us without undue delay) — plus, per ¶19.5(b), the countries and territories.**

### D8. Cloud and SaaS treatment — Selected Topics §9

**[ST] ¶9.1 — the organisation stays liable for everything:**

> "When using cloud services, the organisation is responsible for complying with **all** obligations under the PDPA in respect of personal data processed by the cloud service provider ('CSP') on its behalf and for its purposes."

**[ST] ¶9.2 — the written-contract condition, and the offshore sting:**

> "Where the CSP is processing personal data on behalf and for the purposes of another organisation **pursuant to a contract which is evidenced or made in writing**, the CSP is considered a data intermediary and subject to the **Protection, Retention Limitation and Data Breach Notification Obligations**… Its … Obligations **extend to personal data that it processes or hosts for the organisation in data centres outside Singapore**. The CSP, as an organisation in its own right, remains responsible for complying with all Data Protection Provisions in respect of its own activities which do not constitute processing of personal data under the contract."

**[ST] ¶9.3 — transfer liability is yours wherever the CSP sits:**

> "An organisation that engages a CSP as a data intermediary to provide cloud services is **responsible for complying with the Transfer Limitation Obligation** in respect of any overseas transfer of personal data in using the CSP's cloud services. **This is regardless of whether the CSP is located in Singapore or overseas.**"

**[ST] ¶9.4 — the two routes, and the contract must cover both halves:**

> "the organisation could ensure that the CSP it uses **only transfers data to locations with comparable data protection regimes**, or **has legally enforceable obligations to ensure a comparable standard of protection**… **The contract should deal with both the standard of protection and the overseas locations.**"

**[ST] ¶9.5 reaches sub-processors explicitly:** "the recipients (e.g., data centres or **sub-processors**) in these locations are legally bound by similar contractual standards." **For an AI gateway, the underlying model provider IS a sub-processor.**

**[ST] ¶9.8 — certifications as evidence:** "Industry standards like **ISO27001** and **Tier 3 of the Multi-Tiered Cloud Security ('MTCS') Certification Scheme** could provide assurance of the CSP's ability to comply with the Protection Obligation of the PDPA."

**Due diligence is a mitigating factor, not a defence.** The worked examples at ¶¶9.6, 9.7 and 9.10 all end the same way: "[the organisation]'s due diligence in engaging [the CSP] **would be taken into consideration in the Commission's assessment of liability** when determining whether [it] has breached its obligations under the PDPA. [The CSP] may also be liable for breach of its Protection Obligation."

---

## PART E — Quick reference: what to inspect

| Codebase surface | Governing rule | What to look for |
|---|---|---|
| Role determination (who are we?) | GenAI ¶6.2, ¶6.3 | Any written statement that the org is a System Deployer (and a Model Provider if it fine-tunes) |
| Prompt-construction code path | GenAI ¶9.2 | Named-field selection vs whole-row serialisation; tool read-scope; access controls preventing retrieval outside purpose |
| Prompt / response log store | GenAI ¶9.3, ¶¶7.2–7.3 | Existence; **named owner**; access role-gating; TTL/purge; same backup regime as the client table |
| Tool-call traces / APM | GenAI ¶9.3, ¶9.5 | Personal data in tool arguments; third-party APM = **another transfer** |
| Identifier scanning before egress | GenAI ¶9.3 | Redaction/detection of NRIC/FIN/passport before the prompt leaves the process |
| End-user guidance | GenAI ¶9.3, ¶9.4 | In-product guidance on what may be typed in; internal AI governance doc, disseminated; published externally (¶9.4) |
| RAG / embeddings store | GenAI ¶10.5(b), ¶7.3 | Per-individual delete + re-embed path; tenant scoping; cascade on client delete; coverage by the access-request extractor |
| Agentic tool authorisation | GenAI ¶9.5 | Per-call permission re-check vs ambient service credentials; human escalation for high-risk actions; data classification |
| Fine-tuning / training jobs | GenAI ¶4.4 + fn 11, ¶4.6(d), ¶4.8 | AI-Specific Notification; persisted opt-out flag **honoured by the job**; consent not bundled into ToS |
| Vendor training setting | GenAI ¶4.4 | Zero-retention / no-training tier vs default; does the ToS permit training on submitted data? |
| Lead scoring / recommendations | AI RDS ¶9.1, ¶5.1, ¶5.2 | Consent or a documented exception; identifiability-necessity assessment |
| Reliance on Business Improvement for AI | GenAI ¶4.2 worked example; AI RDS ¶5.2 | A documented reasonable-person assessment, not an assertion |
| "Research exception" claims | AI RDS ¶4.2(b) | Not available for a shipped feature — a claim here is a finding |
| Staging / eval environments | AI RDS ¶5.6, ¶5.7 | Production client data in dev; protected to the same standard? Eval fixtures in the repo |
| Bespoke AI contractor | AI RDS ¶1.4, ¶11.1, ¶11.2 | Written processing contract; provenance records. **¶11.1: does not apply to in-house or off-the-shelf builds** |
| LLM vendor agreement | GenAI ¶7.4; [KC] ¶19.5(b), ¶19.9; [ST] ¶9.2 | Written DPA (not consumer ToS); **named countries**; breach-notice clause with a period; retention/deletion term |
| LLM vendor certification | [KC] ¶19.6, ¶19.8 | CBPR/PRP **matched to role**, verified on globalcbpr.org or cbprs.org, with a dated record |
| Model routing configuration | [KC] ¶19.5(b); [ST] ¶9.9 | Region pinning vs multi-region failover; if discretionary, ISO27001 / SOC-2 assurances covering **every** possible destination |
| Datastore regions | [KC] ¶19.1 | Own-infra overseas (not a transfer, but **must be in the retention policy**) vs third-party (is a transfer) |
| Sub-processor list | [ST] ¶9.5 | Does the register include the model providers behind the gateway, the APM, and front-end tags? |
| Access / correction over AI stores | GenAI ¶10.2, ¶10.3, ¶10.5(b) | Extractor covers vectors + prompt logs + vendor-side data; single-record vector delete/update path |
| Any penalty figure in output | Enforcement AG ¶27.1 + fn 53 | Must be 10% / S$10m — **never** Key Concepts ¶21.14(e) "in due course" |
