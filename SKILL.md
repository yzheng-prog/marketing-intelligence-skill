# Marketing Intelligence Skill

## What This Skill Does

This skill produces a weekly marketing intelligence report by:
1. Collecting signals from Reddit discussions, newsletters, and industry blogs
2. Analyzing the real sentiment, pain points, and opinions behind the data
3. Synthesizing deep articles into logical chains (why something is happening, not just that it is)
4. Outputting two reports: one in English, one in Chinese

The core philosophy: **Reddit discussions are the primary source.** Deep articles provide context and logic. The goal is to understand what the market is actually thinking, not what it's publishing.

---

## Transparency Labels

Every analytical statement in the report must be labeled with one of four markers:

- **[DATA]** — Directly stated in a source. Always include the source link or name.
- **[SYNTHESIS]** — Drawn from combining multiple sources. State which sources.
- **[INFERENCE]** — Claude's own reasoning that goes beyond the data. Must begin with "Based on the above..." or similar framing.
- **[SIGNAL]** — An early or weak pattern that hasn't reached critical mass yet. Flag as worth watching, not yet confirmed.

Never mix these. If a paragraph contains both data and inference, split it into two labeled sections.

---

## Data Collection Window

**7-day rolling window.** Collect all material published or active in the past 7 days.

For each piece of content, record:
- Date published or last active
- Whether it is **NEW this week** (first appeared in the window) or **CONTINUING** (was active last week, still generating discussion)

This distinction matters. A continuing discussion that is accelerating is a stronger signal than a new discussion with low engagement.

---

## Step 1 — Reddit Collection

### Which Communities to Search

Use the subreddit list in `sources/reddit_sources.yaml`. For each subreddit:

1. Sort by **Hot** and **Top (this week)**
2. Look for posts with **high comment-to-upvote ratio** — this indicates genuine debate, not just agreement
3. Prioritize posts where people are **sharing strategies or asking about tactics** — these generate the most useful comment-layer data

### What to Collect from Each Post

Do not summarize the post. Go into the comments. Collect:

- The core question or claim being debated
- The range of positions people are taking
- Specific pain points people mention
- Any data, numbers, or case studies shared in comments
- The emotional tone (frustrated, excited, skeptical, confused)
- Any strategies people recommend and the reactions those recommendations receive

### Comment Layer Analysis Format

For each significant Reddit thread, produce this structure:

```
THREAD: [Title]
SUBREDDIT: r/[name] | ENGAGEMENT: [upvotes] upvotes, [X] comments
STATUS: NEW THIS WEEK / CONTINUING (trending up / trending flat)
URL: [link]

DISCUSSION STRUCTURE:
  [X%] — [Position A] — core reasoning: [why they think this]
  [X%] — [Position B] — core reasoning: [why they think this]
  [X%] — [Position C] — core reasoning: [why they think this]
  [X%] — Off-topic or low-signal noise

DOMINANT PAIN POINT: [The underlying frustration or need driving the discussion]
EMOTIONAL TONE: [One of: Frustrated / Skeptical / Excited / Confused / Pragmatic / Divided]
NOTABLE DATA POINT: [Any specific number, case study, or result shared in comments — with username context]
MOST CONTESTED CLAIM: [The specific thing people most disagree about]
```

### Signal Strength Rating for Reddit Threads

After analysis, rate each thread:
- **Strong Signal** — High engagement, clear dominant pain point, multiple independent people reporting similar experiences
- **Medium Signal** — Moderate engagement, interesting but limited data points
- **Weak Signal / Watch** — Low engagement but touches something new or underreported

---

## Step 2 — Newsletter and Blog Collection

### Which Sources to Use

Use the RSS source list in `sources/rss_sources.yaml`.

For each article collected:
- Read the full argument, not just the headline
- Identify the logical chain: **Observation → Reasoning → Conclusion**
- Note whether the author provides evidence or is primarily opinionating
- Flag if the article is sponsored or product-led (this affects weight)

### Deep Article Analysis Format

```
ARTICLE: [Title]
SOURCE: [Publication / Author name]
TYPE: [Newsletter / Blog / Industry Media]
DATE: [Published date]
URL: [link]
CREDIBILITY NOTE: [Sponsored? Personal opinion? Data-backed?]

LOGICAL CHAIN:
  Observation: [What the author says they are seeing]
  Reasoning:   [Why they think this is happening]
  Conclusion:  [What they say should follow]

EVIDENCE QUALITY: [Strong — cites data/research | Medium — anecdotal but experienced author | Weak — assertion only]
CONNECTS TO REDDIT: [Yes/No — if yes, does Reddit confirm, contradict, or add nuance?]
```

### What Makes a Deep Article Worth Including

Include an article if it does at least one of:
- Provides a logical explanation for something Reddit users are experiencing but can't articulate
- Contradicts conventional wisdom with evidence
- Describes a mechanism (not just a trend) — explains *how* something works, not just *that* it's happening
- Is written by someone with direct operational experience, not just commentary

Do not include articles that are: listicles without reasoning, vendor-produced trend reports without methodology, or recycled predictions without new data.

---

## Step 3 — Signal Identification

After collecting Reddit threads and articles, identify the **signals** for this week's report.

A signal is not a topic. A signal is a specific pattern with evidence behind it.

**Bad signal definition:** "AI in marketing is growing"
**Good signal definition:** "Marketers are reporting that AI-generated content is hurting their organic reach because readers are disengaging faster — Reddit shows frustration, and two newsletter authors this week independently made the same observation"

### Signal Classification

**Strong Signal** — Multiple independent sources (Reddit + at least one article) pointing to the same pattern. Actionable now.

**Emerging Signal** — Appearing in Reddit OR articles, not yet both. Worth watching. May become strong next week.

**Fading Signal** — Was strong in previous weeks, engagement dropping. Still worth noting as context.

Aim for: 2-3 Strong Signals, 3-5 Emerging Signals, any relevant Fading Signals.

---

## Step 4 — Report Assembly

### Report Structure

```
HEADER
  Report title, date range, week number

EDITOR'S NOTE (2-3 sentences)
  What made this week distinctive. What theme cuts across multiple signals.
  [INFERENCE] label required here — this is editorial judgment.

─────────────────────────────────────────
PART 1: STRONG SIGNALS
─────────────────────────────────────────

For each strong signal:

  SIGNAL [N]: [Signal name — specific, not generic]
  
  WHAT THE MARKET IS SAYING
  [Reddit thread analysis using the format from Step 1]
  
  WHAT THE DEEP READING SAYS
  [Article logical chain using the format from Step 2]
  [Label every claim: DATA / SYNTHESIS / INFERENCE]
  
  THE LOGICAL CHAIN
  [INFERENCE] Why is this happening now? What underlying shift is driving it?
  What does this mean for someone running marketing today?
  What would need to be true for this signal to reverse?

─────────────────────────────────────────
PART 2: EMERGING SIGNALS
─────────────────────────────────────────

  For each emerging signal — shorter format:
  
  SIGNAL [N]: [Name]
  Source: [Reddit only / Article only / Both]
  Status: NEW THIS WEEK / CONTINUING
  
  [2-3 paragraphs: what's being said, why it might matter, what to watch for]
  [Label every claim]

─────────────────────────────────────────
PART 3: FADING SIGNALS
─────────────────────────────────────────

  Brief list format. What was hot, why it's cooling, whether it resolved or just lost attention.

─────────────────────────────────────────
PART 4: RAW MATERIAL
─────────────────────────────────────────

  Full Reddit thread analyses (Step 1 format)
  Full article analyses (Step 2 format)
  
  This section is the evidence base. Readers who want to verify
  the signal analysis can check it here.

─────────────────────────────────────────
APPENDIX
─────────────────────────────────────────

  Sources this week — all URLs
  Subreddits checked
  Newsletters/blogs checked
```

---

## Step 5 — Chinese Report

The Chinese report is NOT a translation.

Write it fresh in Chinese, with these differences:

**Audience framing:** The reader is a Chinese marketer. Some of them work for companies marketing in China. Some are working on global or overseas expansion. Frame signals with this context.

**Add a "China/Global Relevance" note for each strong signal:**
- Is this pattern already visible in China?
- Is this a leading indicator of what might happen in China?
- Does the Chinese market context make this signal more or less relevant?
- Is there a Chinese-market equivalent worth comparing?

**Tone:** More direct and practical. Chinese marketing professionals generally prefer concrete implications over theoretical framing.

**Two variants to produce:**

*Variant A — Pure Chinese expression:* Same content as English, rewritten naturally in Chinese. No added China-market framing.

*Variant B — China/Global lens:* Adds the "China/Global Relevance" note for each strong signal. Slightly longer.

Label both clearly at the top so the reader knows which they are reading.

---

## Step 6 — Quality Check

Before finalizing the report, verify:

- [ ] Every analytical claim has a transparency label
- [ ] Every [DATA] claim has a source attached
- [ ] Every [INFERENCE] is clearly framed as reasoning, not fact
- [ ] Reddit thread analyses include voice distribution percentages
- [ ] Signal classification is justified (why Strong vs Emerging?)
- [ ] The Editor's Note identifies a cross-cutting theme, not just lists topics
- [ ] Chinese report is written fresh, not translated
- [ ] Variant A and Variant B are clearly labeled

---

## How to Run This Skill

Say one of the following to trigger this skill:

- `Run weekly marketing report`
- `Generate this week's marketing intelligence`
- `Weekly report`

Claude will execute Steps 1–6 in order and produce:
- `Marketing_Intelligence_EN_[YYYY-MM-DD].md`
- `Marketing_Intelligence_ZH_A_[YYYY-MM-DD].md`
- `Marketing_Intelligence_ZH_B_[YYYY-MM-DD].md`

---

## Notes for Contributors

If you are forking this skill and want to modify it:

- To change data sources: edit `sources/reddit_sources.yaml` and `sources/rss_sources.yaml`
- To change report structure: edit the templates in `templates/`
- To change analysis depth: modify the format definitions in Steps 1 and 2 above
- The transparency label system ([DATA]/[SYNTHESIS]/[INFERENCE]/[SIGNAL]) should not be removed — it is the core integrity mechanism of this skill
