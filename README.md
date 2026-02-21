# Marketing Intelligence Skill

A Claude skill for weekly marketing intelligence reports. Collects signals from Reddit discussions, newsletters, and industry blogs — then synthesizes them into structured analysis with transparent reasoning.

**Core philosophy:** Reddit discussions are the primary signal source. Deep articles provide the logical context. The goal is understanding *why* the market is moving, not just *that* it is.

---

## What It Produces

Three files every week:

| File | Contents |
|------|---------|
| `Marketing_Intelligence_EN_[date].md` | Full English report |
| `Marketing_Intelligence_ZH_A_[date].md` | Chinese report — same content, natural Chinese expression |
| `Marketing_Intelligence_ZH_B_[date].md` | Chinese report — adds China/global market relevance notes for each signal |

Each report contains:

- **Strong Signals** — Patterns confirmed across multiple independent sources, with Reddit voice distribution analysis, deep article logical chains, and clearly labeled inference
- **Emerging Signals** — Patterns appearing in one source type, not yet confirmed
- **Fading Signals** — What was hot, why it's cooling
- **Raw Material** — Full source analyses as an evidence base

Every analytical claim is labeled `[DATA]`, `[SYNTHESIS]`, `[INFERENCE]`, or `[SIGNAL]` so you always know what's sourced and what's reasoned.

---

## Phase 1: Manual (Start Here)

No setup required. Run reports directly in Claude.ai.

**Step 1:** Copy `SKILL.md` into your Claude conversation, or upload this repo to a Claude project.

**Step 2:** Say: `Run weekly marketing report`

**Step 3:** Claude executes the full analysis and produces the three report files.

This is how to start. Run it for a few weeks, adjust the sources and config to your needs, then move to Phase 2 when you're ready.

---

## Phase 2: Automated (Coming)

Full automation via Anthropic API + GitHub Actions or a lightweight server. Scripts are planned in the `scripts/` directory. See `scripts/README.md` for what's coming.

---

## Customization

### Change your topic focus

Edit `config.yaml`:

```yaml
topics:
  focus_areas:
    - B2B marketing
    - content strategy
    - your topic here
```

### Add or remove Reddit communities

Edit `sources/reddit_sources.yaml`. Each entry looks like:

```yaml
- name: marketing
  url: https://reddit.com/r/marketing
  focus: General marketing strategy
  signal_quality: medium-high
  enabled: true
```

Set `enabled: false` to disable a source without deleting it.

### Add newsletters or blogs

Edit `sources/rss_sources.yaml`. Each entry looks like:

```yaml
- name: Lenny's Newsletter
  author: Lenny Rachitsky
  rss: https://www.lennysnewsletter.com/feed
  focus: Product growth, PLG, B2B SaaS
  why_included: Writes mechanism-level explanations with real operator data.
  tier: 1
  enabled: true
```

Tier 1 sources are checked every run. Tier 2 are checked every run but weighted lower. Tier 3 are supplementary.

### Turn off Chinese reports

Edit `config.yaml`:

```yaml
report:
  language: en
```

### Change the rolling window

Edit `config.yaml`:

```yaml
report:
  window_days: 7  # change to 14 for two-week window
```

---

## Repository Structure

```
marketing-intelligence-skill/
│
├── SKILL.md                    # The skill itself — instructions for Claude
├── README.md                   # This file
├── config.yaml                 # Your settings
│
├── sources/
│   ├── reddit_sources.yaml     # Which subreddits to monitor
│   └── rss_sources.yaml        # Which newsletters and blogs to follow
│
├── templates/
│   ├── report_en.md            # English report template
│   └── report_zh.md            # Chinese report template (both variants)
│
├── scripts/                    # Phase 2 automation (planned)
│   └── README.md
│
└── outputs/                    # Generated reports are saved here
    └── .gitkeep
```

---

## Design Decisions

**Why Reddit first?**
Reddit is where practitioners speak honestly. LinkedIn is for positioning. Newsletters are for thinking out loud. Reddit is where people say "I tried this and it failed, here's why." That's the most valuable signal for understanding what's actually working.

**Why transparency labels?**
Marketing content is full of confident claims with no basis. Labeling `[DATA]` vs `[INFERENCE]` forces honest distinction between what the sources actually say and what Claude is reasoning. You should always know which is which.

**Why logical chains over summaries?**
A summary tells you what happened. A logical chain tells you why — what structural shift is driving the pattern, what would reverse it, what it means for your specific situation. The latter is what makes a report worth reading twice.

**Why two Chinese variants?**
Chinese marketing professionals have different contexts. Some work in the China market, some are doing global or overseas expansion, some just prefer Chinese. Variant A serves the language preference. Variant B adds the market-specific framing for those who need it.

---

## Contributing

To improve the skill:

- **Better subreddits:** Open a PR editing `reddit_sources.yaml` with a `why_included` justification
- **Better sources:** Open a PR editing `rss_sources.yaml` with `why_included` and tier reasoning
- **Better analysis formats:** Edit the format definitions in `SKILL.md` Steps 1 and 2
- **Do not remove** the transparency label system — it's the integrity mechanism

---

## License

MIT. Use freely, modify freely, attribution appreciated but not required.
