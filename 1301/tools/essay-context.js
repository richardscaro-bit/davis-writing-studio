/* Shared essay context for ENGL 1301 practice tools.
   Student picks which essay; tools adapt labels/templates. No default essay. */
(function (global) {
  const STORAGE_KEY = "dws1301-essay";

  const ESSAYS = [
    {
      id: "narrative-quest",
      label: "Narrative Quest Essay",
      purpose:
        "Tell a focused personal narrative about a change or quest (often tied to a monster, hero, or world). Show scene and reflection; end with one clear insight.",
      subjectLabel: "Story focus / subject",
      subjectHint: "Required. What the narrative centers on.",
      subjectPlaceholder: "e.g. first night shift at the hospital",
      topicLabel: "Optional theme tag",
      topicOptions: [
        "Belonging / identity",
        "Work or school",
        "Family",
        "Fear / courage",
        "Monster or hero figure",
        "Place / home",
        "Other / custom"
      ],
      presentsLabel: "What happens or what you noticed",
      presentsHint: "Required. Key events or moments in your words.",
      presentsPlaceholder: "I expected X, but Y happened when…",
      tensionLabel: "Insight / change / tension",
      tensionHint: "Required. What shifted for you or the reader.",
      tensionPlaceholder: "I learned that courage looked like…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "What does this quest reveal about…?",
      angles: [
        { id: "scene", label: "Scene & detail" },
        { id: "change", label: "Change" },
        { id: "insight", label: "Insight" },
        { id: "audience", label: "Audience" }
      ],
      defaultAngles: ["scene", "change", "insight"],
      claimKind: "narrative",
      ideaSeeds: {
        topics: [
          "First night on a new job or shift",
          "Moving to a new city or campus",
          "Standing up to a fear in public",
          "A family ritual that changed meaning",
          "Meeting a mentor, rival, or unexpected ally",
          "A failure that redirected a plan",
          "Trying to belong in a group that felt closed",
          "A place that no longer felt like home"
        ],
        questions: [
          "What did this quest reveal about courage or belonging?",
          "Where did expectation and reality split in {topic}?",
          "What changed in how I see myself after this experience?",
          "Which moment should a reader feel most clearly?",
          "What insight is more than a plot summary?"
        ],
        ideas: [
          "Courage showed up as a small, ordinary action, not a dramatic speech",
          "Belonging required a cost I had not named",
          "The obstacle was partly my own assumption",
          "Change started before the climax, in a quiet choice",
          "Home meant something different after {topic}",
          "The insight is something I nearly ignored at the time"
        ]
      },
      outlineLenses: [
        { title: "I. Opening scene", topic: "Open in a concrete moment that puts the reader in the story.", cues: ["Sensory detail", "Who / where / when", "Why this moment matters"] },
        { title: "II. Background", topic: "Give only the background a reader needs to follow the quest.", cues: ["Context before the change", "Stakes for you", "Avoid full biography"] },
        { title: "III. Rising action", topic: "Show the middle of the quest through scenes, not summary alone.", cues: ["Turning points", "Dialogue or action", "What you wanted vs. what happened"] },
        { title: "IV. Climax / shift", topic: "Name the moment that changes understanding or direction.", cues: ["The shift", "What you did or realized", "Evidence from the scene"] },
        { title: "V. Reflection", topic: "Explain the insight without announcing “the moral.”", cues: ["What changed", "Why it matters beyond you", "Tie back to opening"] },
        { title: "VI. Closing", topic: "End on a concrete image or line that holds the insight.", cues: ["No new plot dump", "Echo opening if useful", "Leave the insight clear"] }
      ],
      sourceAim: "Sources are optional unless your prompt asks for them. Log any readings you cite.",
      sourcePacketLabel: "Course reading / handout",
      peerItems: [
        { id: "claim", title: "Insight clarity", prompt: "Is there a clear insight (not only a plot summary)?", placeholder: "The insight lands when… / Still mostly summary because…" },
        { id: "scene", title: "Scene & detail", prompt: "Do key moments use concrete scene detail (not only abstract telling)?", placeholder: "Strongest scene… / Needs more detail at…" },
        { id: "structure", title: "Structure", prompt: "Does the order of scenes help a reader follow the quest and the change?", placeholder: "Clearest section… / Place that drifts…" },
        { id: "reflection", title: "Reflection", prompt: "Does reflection grow from the events instead of feeling pasted on?", placeholder: "Reflection works when… / Feels bolted on at…" },
        { id: "mla", title: "MLA (if used)", prompt: "If sources appear, are in-text citations and Works Cited present and matched?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the scenes and insight? If AI helped brainstorm, is that support-only?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Draft a thesis-like insight sentence you can return to while revising scenes.",
      outlineCue: "Use the outline to order scenes and reflection. Edit every topic sentence in your voice.",
      mlaCue: "Cite only what you actually use. Many Narrative Quest drafts use few or no outside sources."
    },
    {
      id: "classical-argument",
      label: "Classical Argument Essay",
      purpose:
        "Take a clear stand on a debatable issue (On Trial theme in Flex). Support the claim with reasons and evidence; address at least one opposing view.",
      subjectLabel: "Issue / case under debate",
      subjectHint: "Required. Name the issue or “defendant.”",
      subjectPlaceholder: "e.g. school phone bans / a public figure or policy “on trial”",
      topicLabel: "Optional topic area",
      topicOptions: [
        "Education",
        "Technology & media",
        "Public policy",
        "Campus life",
        "Health",
        "Criminal justice",
        "Other / custom"
      ],
      presentsLabel: "Common view or opposing claim",
      presentsHint: "Required. What others often argue.",
      presentsPlaceholder: "Many people argue that…",
      tensionLabel: "Your stance / strongest reason cluster",
      tensionHint: "Required. Your side and why it matters.",
      tensionPlaceholder: "I argue that… because…",
      questionLabel: "Optional research or focusing question",
      questionPlaceholder: "What evidence would change a careful reader’s mind?",
      angles: [
        { id: "claim", label: "Claim" },
        { id: "reasons", label: "Reasons" },
        { id: "evidence", label: "Evidence" },
        { id: "counter", label: "Counterargument" },
        { id: "stakes", label: "Stakes" }
      ],
      defaultAngles: ["claim", "reasons", "counter"],
      claimKind: "argument",
      ideaSeeds: {
        topics: [
          "School or workplace phone bans",
          "Campus free-speech rules",
          "Social media age restrictions",
          "Public camera / surveillance policies",
          "Standardized testing requirements",
          "Gig-work classification debates",
          "Public health mandates in shared spaces",
          "Local housing or zoning disputes"
        ],
        questions: [
          "What evidence would change a careful reader’s mind about {topic}?",
          "Who benefits if the common view stays unchallenged?",
          "What is the strongest fair opposing argument?",
          "Which stake matters most for the people closest to the issue?",
          "What judgment should a reader reach, and why?"
        ],
        ideas: [
          "The stronger position is X because the costs of the common view fall unevenly",
          "Even granting the other side’s best point, the evidence still favors a different judgment",
          "Treating {topic} as settled hides who pays the price",
          "Policy convenience is not the same as a fair outcome",
          "A careful reader should reject the familiar position once the stakes are clear",
          "The debate turns on which definition of harm we accept"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction & claim", topic: "Open with context, then state one clear arguable claim.", cues: ["Issue in one line", "Working claim", "Why the issue matters now"] },
        { title: "II. Background", topic: "Give definitions and facts a reader needs before the reasons.", cues: ["Key terms", "Relevant history or rules", "What is not in dispute"] },
        { title: "III. Reason 1 + evidence", topic: "Develop your strongest reason with concrete evidence.", cues: ["Topic sentence = reason", "Evidence", "Warrant: how evidence supports the claim"] },
        { title: "IV. Reason 2 + evidence", topic: "Add a second reason that does not merely repeat Reason 1.", cues: ["Distinct reason", "Evidence", "Link back to claim"] },
        { title: "V. Counterargument & reply", topic: "State a fair opposing view, then answer it.", cues: ["Steel-man the other side", "Concession if honest", "Reply that protects your claim"] },
        { title: "VI. Conclusion", topic: "Restate the claim in fresh words and name the stakes.", cues: ["No new major reasons", "So-what for the audience", "Call to judgment, not fluff"] }
      ],
      sourceAim: "Aim for the source count your prompt requires. Log each source and how it supports or challenges the claim.",
      sourcePacketLabel: "Course reading / handout",
      peerItems: [
        { id: "claim", title: "Claim clarity", prompt: "Is the claim arguable, specific, and free of announcement openings (“This paper will…”)?", placeholder: "Claim is clear about… / Still vague because…" },
        { id: "reasons", title: "Reasons & evidence", prompt: "Do body sections offer distinct reasons with evidence (not only opinions)?", placeholder: "Strongest reason… / Needs evidence at…" },
        { id: "counter", title: "Counterargument", prompt: "Is an opposing view stated fairly and answered?", placeholder: "Counter works… / Missing or straw-manned…" },
        { id: "org", title: "Organization", prompt: "Do topic sentences guide the reader through claim, reasons, and reply?", placeholder: "Clearest topic sentence… / Section that drifts…" },
        { id: "mla", title: "MLA", prompt: "Do in-text citations match a Works Cited list for sources used?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the claim and evidence? AI support only, not composition?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Build one arguable claim. Reasons and counterargument come next in the outline.",
      outlineCue: "Generate a classical-argument skeleton, then revise every topic sentence.",
      mlaCue: "Cite every outside source you use. Match in-text citations to Works Cited."
    },
    {
      id: "monster-comparison",
      label: "Monster Comparison",
      purpose:
        "Compare two iconic monsters from the same meaningful category using the same criteria for both. End with one insight beyond a list of traits. Aim for a short MLA comparison (often 500 to 750 words).",
      subjectLabel: "Pair of monsters (A vs B)",
      subjectHint: "Required. Name both figures.",
      subjectPlaceholder: "e.g. Godzilla and King Kong",
      topicLabel: "Shared category (optional)",
      topicOptions: [
        "Kaiju / giant creatures",
        "Vampires",
        "Werewolves / shapeshifters",
        "Zombies / undead",
        "Folk / cryptid",
        "Film / TV monsters",
        "Literary monsters",
        "Other / custom"
      ],
      presentsLabel: "Shared ground / category",
      presentsHint: "Required. Why these two belong in one comparison.",
      presentsPlaceholder: "Both belong to one category because…",
      tensionLabel: "Key difference or insight",
      tensionHint: "Required. What the split reveals.",
      tensionPlaceholder: "They differ most in… because…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "What does the contrast show about audience fear or power?",
      angles: [
        { id: "criteria", label: "Criteria" },
        { id: "similarity", label: "Similarity" },
        { id: "difference", label: "Difference" },
        { id: "insight", label: "Insight" }
      ],
      defaultAngles: ["criteria", "difference", "insight"],
      claimKind: "comparison",
      comparisonCriteria: [
        "how each figure is created or changed",
        "what each figure wants",
        "who readers are asked to judge or sympathize with"
      ],
      comparisonCriteriaBank: [
        "how each figure is created or changed",
        "what each figure wants",
        "who readers are asked to judge or sympathize with",
        "how each figure uses power",
        "how each figure is seen in public versus in private",
        "what harm each figure causes",
        "how each story explains responsibility",
        "what readers are asked to fear"
      ],
      ideaSeeds: {
        topics: [
          "Frankenstein’s creature and Dorian Gray",
          "Godzilla and King Kong",
          "Dracula and a modern vampire figure",
          "Two werewolf or shapeshifter stories",
          "Two zombie or undead portrayals",
          "A folk monster and a screen cryptid",
          "Two literary monsters from the same tradition",
          "A classic film monster and its remake"
        ],
        questions: [
          "What clear difference between these two figures matters most for readers?",
          "Which shared criterion shows the sharpest contrast?",
          "Why do these two belong in one category, and where does that category fail?",
          "What insight about {topic} goes past a list of traits?",
          "Who are readers asked to judge, and why does that matter?"
        ],
        ideas: [
          "One figure is rejected after being created and seeks recognition; the other hides wrongdoing behind a public image",
          "Both are labeled monstrous, but readers are asked to judge them in different ways",
          "One figure’s threat is public and large-scale; the other’s threat is private and moral",
          "A shared category still leaves a clear difference in sympathy and power",
          "The comparison shows how a story assigns blame, not only how a figure looks",
          "Side by side, the figures in {topic} differ most in who they protect or punish"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction", topic: "Name both figures, the shared category, and one insight thesis.", cues: ["Pair + category", "One insight", "Preview three criteria"] },
        { title: "II. Criterion 1", topic: "Apply criterion 1 to both figures in the same way.", cues: ["Same criterion for A and B", "Evidence for each", "Link to the insight"] },
        { title: "III. Criterion 2", topic: "Apply criterion 2 to both figures in the same way.", cues: ["Parallel structure", "Evidence", "Deepen the insight"] },
        { title: "IV. Criterion 3", topic: "Apply criterion 3 to both figures in the same way.", cues: ["Keep the criterion consistent", "Avoid trait lists", "Return to the insight"] },
        { title: "V. Conclusion", topic: "State what the comparison shows beyond a trait list.", cues: ["Insight, not summary only", "So-what for readers", "No new figures"] }
      ],
      sourceAim: "Log any course samples or outside sources you cite. Many drafts rely mainly on the two figures plus class materials.",
      sourcePacketLabel: "Course sample / handout",
      peerItems: [
        { id: "claim", title: "Insight thesis", prompt: "Does the thesis go past a list of traits to one clear insight?", placeholder: "Insight is… / Still a catalog because…" },
        { id: "criteria", title: "Shared criteria", prompt: "Are the same 3–4 criteria applied to both figures?", placeholder: "Parallel works in… / Criteria shift at…" },
        { id: "evidence", title: "Evidence", prompt: "Are claims about each figure backed with concrete detail?", placeholder: "Strongest evidence… / Needs detail for…" },
        { id: "org", title: "Organization", prompt: "Is structure point-by-point or clear block comparison without drift?", placeholder: "Organization helps… / Confusing at…" },
        { id: "mla", title: "MLA", prompt: "If sources appear, are citations complete and matched?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the comparison and insight?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Name both figures. Choose three criteria you will apply to both. State one clear insight (not a trait list). Generate thesis options, then open the outline.",
      outlineCue: "Each body section uses one of your three criteria on both figures. Edit every topic sentence in your voice.",
      mlaCue: "Cite films, shows, or readings you quote or paraphrase."
    },
    {
      id: "facing-unknown",
      label: "Facing the Unknown (Exposition)",
      purpose:
        "Explain an unknown, strange, or frightening topic objectively with research. Inform; do not argue which side is right.",
      subjectLabel: "Topic to explain",
      subjectHint: "Required. Narrow topic or focused how/why question.",
      subjectPlaceholder: "e.g. how deep-sea pressure affects the human body",
      topicLabel: "Optional subject area",
      topicOptions: [
        "Deep ocean / extreme environments",
        "Space / cosmos",
        "The body under stress",
        "Disease / public health unknowns",
        "Technology / AI unknowns",
        "Natural disasters",
        "Unexplained phenomena (explain, don’t argue)",
        "Historical mysteries",
        "Other / custom"
      ],
      presentsLabel: "What readers often misunderstand",
      presentsHint: "Required. The confusion or unknown you will clarify.",
      presentsPlaceholder: "Readers often think… but the process actually…",
      tensionLabel: "How / why focus (controlling idea)",
      tensionHint: "Required. What the essay will explain.",
      tensionPlaceholder: "This essay explains how/why…",
      questionLabel: "Research question",
      questionPlaceholder: "How does…? Why does…?",
      angles: [
        { id: "define", label: "Define" },
        { id: "process", label: "Process" },
        { id: "cause", label: "Cause / effect" },
        { id: "clarify", label: "Clarify myth" }
      ],
      defaultAngles: ["define", "process", "clarify"],
      claimKind: "exposition",
      ideaSeeds: {
        topics: [
          "How deep-sea pressure affects the human body",
          "Why black holes bend light and time",
          "How the body responds to extreme heat or cold",
          "How a specific disease spreads in a population",
          "How AI models produce confident wrong answers",
          "How hurricanes intensify over warm water",
          "What science can and cannot explain about a named phenomenon",
          "How archaeologists test a historical mystery"
        ],
        questions: [
          "How does {topic} actually work, step by step?",
          "Why do readers often misunderstand this unknown?",
          "What causes or mechanisms matter most?",
          "Which terms must be defined before the explanation makes sense?",
          "What would a careful explanation change in a reader’s mental model?",
          "Where does current research still leave an open question?"
        ],
        ideas: [
          "Readers often treat this as mystery or myth; the process is more concrete once terms are clear",
          "The job is to explain how X leads to Y, without taking a policy side",
          "A common oversimplification hides the mechanism that matters",
          "Understanding {topic} means tracing cause and effect, not arguing which side is right",
          "The unknown becomes teachable when scoped to one how/why question",
          "Credible sources correct a familiar misconception about this topic"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction", topic: "Hook with the unknown, then state the how/why controlling idea.", cues: ["Topic narrow enough", "Controlling idea", "Preview subtopics"] },
        { title: "II. Definitions / context", topic: "Define terms and give context a college reader needs.", cues: ["Key terms", "Scope", "What you will not cover"] },
        { title: "III. How it works / main explanation", topic: "Explain the process, system, or phenomenon step by step.", cues: ["Logical order", "Source support", "Stay objective"] },
        { title: "IV. Causes, effects, or deeper mechanism", topic: "Deepen the explanation with causes, effects, or mechanisms.", cues: ["Link to controlling idea", "Evidence", "No side-taking"] },
        { title: "V. Common misunderstanding", topic: "Correct a frequent myth or oversimplification with evidence.", cues: ["Name the myth", "Evidence-based correction", "Neutral tone"] },
        { title: "VI. Conclusion", topic: "Close by restating what a reader now understands.", cues: ["No new major topic", "So-what for understanding", "Point to further questions if useful"] }
      ],
      sourceAim: "Log credible sources your prompt requires (often including library or Scholar sources).",
      sourcePacketLabel: "Course reading / handout",
      peerItems: [
        { id: "claim", title: "Controlling idea", prompt: "Is there a clear how/why controlling idea (not a persuasive claim)?", placeholder: "Controlling idea is… / Still sounds like argument because…" },
        { id: "objectivity", title: "Objectivity", prompt: "Does the draft explain without taking a side?", placeholder: "Stays neutral in… / Side-taking at…" },
        { id: "sources", title: "Sources", prompt: "Do sources explain (not decorate), with clear jobs in the paragraphs?", placeholder: "Sources help… / Dumping or missing at…" },
        { id: "org", title: "Organization", prompt: "Do subtopics follow a clear explanatory order?", placeholder: "Order works… / Confusing at…" },
        { id: "mla", title: "MLA", prompt: "Are in-text citations and Works Cited matched and complete?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own explanations and source choices?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Draft a two-part controlling idea that previews what you will explain.",
      outlineCue: "Order definitions, process, and clarifications. Keep tone informative.",
      mlaCue: "Plan citations for every source you summarize or quote."
    },
    {
      id: "field-guide",
      label: "Cultural Place Field Guide (Exposition)",
      purpose:
        "Explain a place, practice, or local system for a named audience. Build one Field Guide plate plus a how/why essay that match each other. You explain; you do not take a side.",
      subjectLabel: "Place / practice / system",
      subjectHint: "Required. One focused subject.",
      subjectPlaceholder: "e.g. a neighborhood mercado / a campus ritual",
      topicLabel: "Audience (optional here)",
      topicOptions: [
        "Local visitors",
        "Campus community",
        "Newcomers to the city",
        "Classmates / peers",
        "Online readers",
        "Other / custom"
      ],
      presentsLabel: "Named audience & what they need explained",
      presentsHint: "Required. Who the guide is for and what they need.",
      presentsPlaceholder: "For new students who need to understand how…",
      tensionLabel: "How / why question",
      tensionHint: "Required. One focused explanatory question.",
      tensionPlaceholder: "How does this place work for…? Why does the practice…?",
      questionLabel: "Optional narrowing question",
      questionPlaceholder: "What should a newcomer notice first?",
      angles: [
        { id: "place", label: "Place" },
        { id: "audience", label: "Audience" },
        { id: "how", label: "How it works" },
        { id: "why", label: "Why it matters" }
      ],
      defaultAngles: ["place", "audience", "how"],
      claimKind: "exposition",
      ideaSeeds: {
        topics: [
          "A neighborhood mercado or plaza",
          "A campus ritual new students miss",
          "A local transit hub and how it works",
          "A community garden or mutual-aid space",
          "A workplace break-room culture",
          "A library or tutoring center as a system",
          "A festival route and its unwritten rules",
          "A clinic waiting-room practice"
        ],
        questions: [
          "How does this place work for a named newcomer audience?",
          "Why does this practice matter to the people who use it?",
          "What does a newcomer notice first about {topic}?",
          "Which 2–3 working parts must the plate and essay both cover?",
          "What caution or tip is useful without preaching?"
        ],
        ideas: [
          "For newcomers, the place makes sense once daily routines are explained",
          "The guide’s job is how the place works, not whether the place ought to exist",
          "Audience need + concrete parts of the system are the controlling focus",
          "Plate labels and essay subtopics must name the same place and audience",
          "Significance for this audience comes from use and access, not policy debate",
          "A practical caution grows out of how {topic} actually operates"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction", topic: "Name the place, audience, and how/why controlling idea.", cues: ["Place + audience", "How/why question", "Preview plate/essay match"] },
        { title: "II. Plate labels in prose", topic: "Cover name, location, audience, and first impressions in clear order.", cues: ["Match the plate", "Concrete detail", "No side-taking"] },
        { title: "III. How it works", topic: "Explain 2–3 working parts of the place or practice.", cues: ["Subtopics match plate", "Process clarity", "Source if needed"] },
        { title: "IV. Why it matters to this audience", topic: "Explain significance for the named audience without arguing policy.", cues: ["Audience needs", "Evidence or observation", "Stay explanatory"] },
        { title: "V. Caution / newcomer tip", topic: "Add one practical caution or tip grounded in the guide.", cues: ["Useful, not preachy", "Tied to how it works", "Checkable if sourced"] },
        { title: "VI. Closing", topic: "Return to audience + place; confirm plate and essay still match.", cues: ["No new topic", "Plate/essay consistency", "Clear takeaway"] }
      ],
      sourceAim: "Log 1 to 3 credible sources when your prompt asks for them, plus any field notes you cite.",
      sourcePacketLabel: "Course handout / plate guide",
      peerItems: [
        { id: "claim", title: "How/why focus", prompt: "Is there one focused how/why question (no should/policy argument)?", placeholder: "Focus is… / Sounds like argument at…" },
        { id: "plate", title: "Plate + essay match", prompt: "Do plate labels and essay describe the same place and audience?", placeholder: "Match works… / Drift at…" },
        { id: "audience", title: "Audience", prompt: "Is the audience named and served throughout?", placeholder: "Audience clear… / Lost at…" },
        { id: "sources", title: "Sources", prompt: "If sources are required, do 1–3 sources have clear jobs?", placeholder: "Sources help… / Missing or dumped…" },
        { id: "mla", title: "MLA", prompt: "Are citations present and matched when sources are used?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the plate content and sentences?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "State a how/why controlling idea that matches your plate and audience.",
      outlineCue: "Keep plate labels and essay subtopics aligned.",
      mlaCue: "Cite field or secondary sources you use in the essay."
    },
    {
      id: "case-study",
      label: "Case Study Critical Analysis",
      purpose:
        "Write a critical analysis with one clear claim, evidence from a Source Packet / Case Brief, and 3 to 4 credible outside sources. Aim for about 1,000 to 1,500 words MLA (AI Level 2: support, not composition).",
      subjectLabel: "Case / packet name",
      subjectHint: "Required. e.g. BarkBox Subscription Box",
      subjectPlaceholder: "BarkBox",
      topicLabel: "Topic folder",
      topicOptions: [
        "Business & Marketing",
        "Climate",
        "Education",
        "Environmental",
        "Film / TV",
        "Forensics & Psychology",
        "Government",
        "Health Science",
        "Mortuary Science",
        "Public Health",
        "Social Media",
        "Technology & Media",
        "Urban Studies",
        "Other / custom"
      ],
      presentsLabel: "What the packet seems to argue or present",
      presentsHint: "Required. 1–2 sentences in your words.",
      presentsPlaceholder: "The packet presents BarkBox as a customer-loyalty success…",
      tensionLabel: "Tension / limit / stakeholder conflict / assumption",
      tensionHint: "Required. What a careful reader could push back on.",
      tensionPlaceholder: "It underplays how subscription fatigue…",
      questionLabel: "Your critical question",
      questionPlaceholder: "Does the packet’s success story hold once we ask who the model excludes?",
      angles: [
        { id: "framing", label: "Framing" },
        { id: "stakeholders", label: "Stakeholders" },
        { id: "evidence", label: "Evidence quality" },
        { id: "assumptions", label: "Assumptions" },
        { id: "limits", label: "Limits" }
      ],
      defaultAngles: ["framing", "evidence", "limits", "stakeholders"],
      claimKind: "case-study",
      ideaSeeds: {
        topics: [
          "BarkBox subscription model",
          "A campus wellness campaign packet",
          "A local business “success story” brief",
          "A public-health case brief",
          "A social-media brand case",
          "An environmental cleanup case packet",
          "A tech-product launch brief",
          "An education-program case study"
        ],
        questions: [
          "Does the packet’s success story hold once we ask who the model excludes?",
          "How does the packet frame the problem, and what does that frame leave out or downplay?",
          "Whose interests count as evidence in {topic}?",
          "What assumption does the packet treat as obvious?",
          "Where is the packet persuasive, and where does the evidence thin out?",
          "What would outside sources need to challenge or test?"
        ],
        ideas: [
          "The packet frames a clean success while underplaying a stakeholder cost",
          "Evidence that looks settled still leaves a key tension unresolved",
          "The packet assumes readers will accept its definition of success",
          "Limits around {topic} weaken the overall claim even when parts persuade",
          "Stakeholders at the margins change how the win should be read",
          "Outside research should complicate the packet, not decorate it"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction", topic: "Context plus a clear claim about how the packet frames the case.", cues: ["Brief context", "Working claim", "Map of lenses"] },
        { title: "II. Framing / problem definition", topic: "How the packet frames the problem or opportunity.", cues: ["Packet’s definition of success", "What it soft-pedals", "Packet evidence"] },
        { title: "III. Stakeholders", topic: "Who the packet centers — and who is left at the margins.", cues: ["Who benefits", "Who bears cost", "Packet + inference"] },
        { title: "IV. Evidence quality", topic: "What the packet’s evidence actually proves once tension is visible.", cues: ["Strongest packet evidence", "Limits of that evidence", "Outside pressure-test"] },
        { title: "V. Assumptions", topic: "Name a hidden premise the packet treats as obvious.", cues: ["Assumption", "Where it shows", "Why it matters"] },
        { title: "VI. Limits", topic: "Where the packet is persuasive and where it falls short.", cues: ["Credit what works", "Clear limit", "Tie to claim"] },
        { title: "VII. Outside sources (3–4)", topic: "Outside research should pressure-test the packet, not decorate it.", cues: ["Source jobs", "Complicate or corroborate", "Lead into conclusion"] },
        { title: "VIII. Conclusion", topic: "Return to the claim; state what a careful reader should take away.", cues: ["Fresh restatement", "So-what", "No new case"] }
      ],
      sourceAim: "Aim for packet + 3 to 4 outside sources.",
      sourcePacketLabel: "Packet / Case Brief",
      peerItems: [
        { id: "claim", title: "Claim clarity", prompt: "Is the working claim arguable, specific to this packet/case, and free of announcement openings?", placeholder: "The claim is clear about… / Still sounds like a summary because…" },
        { id: "packet", title: "Packet evidence", prompt: "Does the draft use the Source Packet / Case Brief with concrete moments (not vague summary only)?", placeholder: "Strongest packet moment… / Needs a tighter paraphrase on…" },
        { id: "outside", title: "Outside sources (3–4)", prompt: "Are there 3–4 outside sources beyond the packet that pressure-test or deepen the claim?", placeholder: "Outside sources that help… / Still missing…" },
        { id: "mlaWorks", title: "MLA Works Cited", prompt: "Is there a Works Cited with the packet + each outside source?", placeholder: "Entries look complete for… / Double-check…" },
        { id: "mlaIntext", title: "MLA in-text citations", prompt: "Do body paragraphs credit sources in-text where evidence appears?", placeholder: "In-text works in… / Missing near…" },
        { id: "org", title: "Organization / topic sentences", prompt: "Do topic sentences guide framing, stakeholders, evidence, assumptions, and/or limits?", placeholder: "Clearest topic sentence… / Section that drifts…" },
        { id: "analysis", title: "Analysis over summary", prompt: "Does the draft judge the packet’s framing/evidence (not only retell it)?", placeholder: "Best analytical move… / Still summarizing…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the claim and evidence? AI support only, not composition?", placeholder: "Disclosure / ownership looks… / Ask to clarify…" }
      ],
      thesisCue: "One clear claim tied to the packet plus a real tension. Outside sources come after.",
      outlineCue: "Use Case Study lenses, then revise topic sentences before drafting.",
      mlaCue: "Cite the packet once, then each of your 3–4 outside sources."
    },
    {
      id: "final-reflection",
      label: "Final Reflection",
      purpose:
        "Look back on your writing this term. Use specific earlier work as evidence of growth, habits, and remaining goals.",
      subjectLabel: "Focus of the reflection",
      subjectHint: "Required. Skill, habit, or essay arc you will examine.",
      subjectPlaceholder: "e.g. how my thesis statements changed from Essay 1 to now",
      topicLabel: "Optional course theme",
      topicOptions: [
        "Thesis / claims",
        "Research / sources",
        "Organization",
        "Revision habits",
        "AI Level 2 use",
        "MLA / citation",
        "Other / custom"
      ],
      presentsLabel: "Where you started",
      presentsHint: "Required. Early habit, draft, or belief.",
      presentsPlaceholder: "At first I usually…",
      tensionLabel: "What changed / what still needs work",
      tensionHint: "Required. Growth and remaining goal.",
      tensionPlaceholder: "Now I… but I still need to…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which draft best shows the change?",
      angles: [
        { id: "growth", label: "Growth" },
        { id: "evidence", label: "Draft evidence" },
        { id: "process", label: "Process" },
        { id: "goals", label: "Goals" }
      ],
      defaultAngles: ["growth", "evidence", "goals"],
      claimKind: "reflection",
      ideaSeeds: {
        topics: [
          "How my thesis statements changed from Essay 1 to now",
          "My research and source habits across the term",
          "Organization and topic sentences over time",
          "Revision habits after feedback",
          "How I used AI Level 2 support honestly",
          "MLA and citation confidence",
          "Moving from summary toward analysis",
          "Time management in drafting"
        ],
        questions: [
          "Which earlier draft best shows the change in {topic}?",
          "What habit limited me at the start of the term?",
          "What turning point (feedback, practice, or failure) shifted my process?",
          "What still needs work next course?",
          "How do I prove growth with concrete draft evidence?"
        ],
        ideas: [
          "I moved from announcement theses toward specific, contestable theses",
          "I used to summarize; now I test evidence closely, but I still rush warrants",
          "Feedback became useful when I revised structure, not only sentences",
          "AI stayed support-only once I owned the thesis and outline",
          "Growth shows in named drafts, not in vague “I got better”",
          "My next goal is concrete: one habit tied to evidence from this term"
        ]
      },
      outlineLenses: [
        { title: "I. Opening claim", topic: "State what changed in your writing this term.", cues: ["One clear growth claim", "Time span", "Preview evidence"] },
        { title: "II. Early evidence", topic: "Point to a specific early draft or habit.", cues: ["Name the assignment", "Quote or describe a move", "What limited you then"] },
        { title: "III. Turning point", topic: "Show a moment, feedback, or practice that shifted your process.", cues: ["What changed", "Why it mattered", "Link to claim"] },
        { title: "IV. Later evidence", topic: "Point to a later draft that shows the new habit.", cues: ["Concrete comparison", "Not just “I got better”", "Still-honest limits"] },
        { title: "V. Remaining goals", topic: "Name one or two goals for the next course or writing task.", cues: ["Specific", "Actionable", "Tied to evidence above"] },
        { title: "VI. Closing", topic: "Return to the growth claim without new autobiography.", cues: ["Fresh restatement", "Reader takeaway", "No grade talk"] }
      ],
      sourceAim: "Log earlier essays or course readings you cite as evidence of growth.",
      sourcePacketLabel: "Earlier draft / course text",
      peerItems: [
        { id: "claim", title: "Growth claim", prompt: "Is there a clear claim about what changed (not only a diary)?", placeholder: "Claim is… / Still vague because…" },
        { id: "evidence", title: "Draft evidence", prompt: "Does the reflection point to specific earlier work?", placeholder: "Best evidence… / Needs a concrete example at…" },
        { id: "honesty", title: "Honest limits", prompt: "Does the writer name remaining goals without empty praise?", placeholder: "Honest about… / Sounds generic at…" },
        { id: "org", title: "Organization", prompt: "Is the reflection easy to follow from then → now → next?", placeholder: "Order works… / Confusing at…" },
        { id: "mla", title: "MLA (if used)", prompt: "If course texts are cited, are citations present?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the reflection?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Draft one growth claim you can support with earlier work.",
      outlineCue: "Order then → turning point → now → goals.",
      mlaCue: "Cite course readings or quote your own earlier titles only as your prompt allows."
    }
  ];

  const GENERIC = {
    id: "",
    label: "Any essay (generic)",
    purpose:
      "Pick an essay above if you want labels and templates matched to that assignment. Or leave this on generic mode and fill the fields in your own words.",
    subjectLabel: "Subject / focus",
    subjectHint: "Required. Name the topic, case, pair, or focus.",
    subjectPlaceholder: "Your subject",
    topicLabel: "Optional topic tag",
    topicOptions: [
      "Business & Marketing",
      "Climate",
      "Education",
      "Environmental",
      "Film / TV",
      "Government",
      "Health",
      "Social Media",
      "Technology & Media",
      "Other / custom"
    ],
    presentsLabel: "What sources or experience present",
    presentsHint: "Required. 1–2 sentences in your words.",
    presentsPlaceholder: "Readers or sources present…",
    tensionLabel: "Tension, insight, or controlling idea",
    tensionHint: "Required. What you will argue, explain, or reveal.",
    tensionPlaceholder: "The key tension or insight is…",
    questionLabel: "Optional focusing question",
    questionPlaceholder: "What question guides this draft?",
    angles: [
      { id: "framing", label: "Framing" },
      { id: "evidence", label: "Evidence" },
      { id: "stakeholders", label: "Audience / stakes" },
      { id: "limits", label: "Limits / insight" }
    ],
    defaultAngles: ["framing", "evidence", "limits"],
    claimKind: "generic",
    ideaSeeds: {
      topics: [
        "A focused local or campus issue",
        "A process or system that confuses newcomers",
        "A comparison of two related figures or cases",
        "A personal turning point with a clear insight",
        "A packet or source set that frames a “success”",
        "A research how/why question about an unknown",
        "A reflection on one writing habit this term",
        "A debate where stakes fall unevenly"
      ],
      questions: [
        "What question guides a careful draft about {topic}?",
        "What do sources or experience present that a reader might contest?",
        "What tension, insight, or how/why focus should stay visible?",
        "Who is the audience, and what do they need explained or judged?",
        "What evidence would a careful reader ask for next?"
      ],
      ideas: [
        "Although the familiar story says X, a closer look shows Y",
        "The controlling idea is how or why this works, not which side wins",
        "The thesis names a limit, stakeholder cost, or insight worth earning",
        "Comparison or contrast reveals more than a list of traits",
        "Growth or change needs concrete evidence, not vague summary",
        "Readers need definitions and scope before the main points"
      ]
    },
    outlineLenses: [
      { title: "I. Introduction", topic: "Context plus a clear working thesis or controlling idea.", cues: ["Hook or context", "Thesis / controlling idea", "Preview"] },
      { title: "II. Background", topic: "Give readers what they need before the main points.", cues: ["Definitions", "Scope", "Shared facts"] },
      { title: "III. Main point 1", topic: "Develop the first main point with evidence.", cues: ["Topic sentence", "Evidence", "Analysis"] },
      { title: "IV. Main point 2", topic: "Develop the second main point without repeating point 1.", cues: ["Distinct point", "Evidence", "Link to thesis"] },
      { title: "V. Main point 3 / complication", topic: "Add depth, a complication, or a contrasting view.", cues: ["Complication", "Evidence", "Return to thesis"] },
      { title: "VI. Conclusion", topic: "Restate the thesis in fresh words and name the so-what.", cues: ["Fresh restatement", "So-what", "No new major claim"] }
    ],
    sourceAim: "Log every source you plan to cite. Match the count your essay prompt requires.",
    sourcePacketLabel: "Course packet / handout",
    peerItems: [
      { id: "claim", title: "Thesis / controlling idea", prompt: "Is the main idea clear, specific, and free of announcement openings?", placeholder: "Clear about… / Still vague because…" },
      { id: "evidence", title: "Evidence", prompt: "Do body sections use concrete evidence tied to the main idea?", placeholder: "Strongest evidence… / Needs support at…" },
      { id: "org", title: "Organization", prompt: "Do topic sentences guide the reader through a clear order?", placeholder: "Clearest section… / Drifts at…" },
      { id: "analysis", title: "Analysis", prompt: "Does the draft explain or argue (not only summarize)?", placeholder: "Best analytical move… / Still summary at…" },
      { id: "mla", title: "MLA", prompt: "If sources are used, are in-text citations and Works Cited matched?", placeholder: "MLA looks… / Check…" },
      { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the ideas and sentences? AI support only?", placeholder: "Ownership looks… / Ask about…" }
    ],
    thesisCue: "Fill the fields, then generate draft thesis options. Edit in your voice.",
    outlineCue: "Generate a neutral outline skeleton, then revise every topic sentence.",
    mlaCue: "Pick a source type and practice Works Cited + in-text. Verify every entry."
  };

  function byId(id) {
    if (!id) return null;
    return ESSAYS.find((e) => e.id === id) || null;
  }

  function getSelectedId() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }

  function setSelectedId(id) {
    const next = id || "";
    try {
      if (next) localStorage.setItem(STORAGE_KEY, next);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return next;
  }

  function getActive() {
    const id = getSelectedId();
    return byId(id) || GENERIC;
  }

  const listeners = [];
  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }
  function emit(essay) {
    listeners.forEach((fn) => {
      try {
        fn(essay);
      } catch (err) {
        console.error(err);
      }
    });
  }

  function mountPicker(target) {
    const host =
      typeof target === "string" ? document.querySelector(target) : target || document.getElementById("essayPicker");
    if (!host) return null;

    const activeId = getSelectedId();
    const active = getActive();

    host.classList.add("essay-picker");
    host.innerHTML = `
      <label class="field essay-picker-field" for="dwsEssaySelect">
        <span class="essay-picker-label">Which essay are you practicing?</span>
        <select id="dwsEssaySelect" autocomplete="off">
          <option value="">Generic (any essay)</option>
          ${ESSAYS.map(
            (e) =>
              `<option value="${e.id}"${e.id === activeId ? " selected" : ""}>${escapeHtml(e.label)}</option>`
          ).join("")}
        </select>
      </label>
      <div class="callout essay-picker-purpose" id="dwsEssayPurpose">
        <strong>Purpose</strong>
        <p style="margin:0.35rem 0 0;" id="dwsEssayPurposeText">${escapeHtml(active.purpose)}</p>
      </div>
    `;

    const select = host.querySelector("#dwsEssaySelect");
    const purposeText = host.querySelector("#dwsEssayPurposeText");
    select.addEventListener("change", () => {
      const id = setSelectedId(select.value);
      const essay = byId(id) || GENERIC;
      if (purposeText) purposeText.textContent = essay.purpose;
      applyThesisLabels();
      emit(essay);
    });

    applyThesisLabels();
    return { select, getActive, host };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function applyThesisLabels() {
    const essay = getActive();
    const map = [
      ["label[for='caseName'], #caseNameLabel, .js-subject-label", "subjectLabel", "subjectHint"],
      ["#topicFolderLabel, .js-topic-label", "topicLabel", null],
      ["#packetArguesLabel, .js-presents-label", "presentsLabel", "presentsHint"],
      ["#tensionInputLabel, .js-tension-label", "tensionLabel", "tensionHint"],
      ["#criticalQuestionLabel, .js-question-label", "questionLabel", null]
    ];
    // Prefer data-essay-field attributes when present
    document.querySelectorAll("[data-essay-field]").forEach((el) => {
      const key = el.getAttribute("data-essay-field");
      const hintKey = el.getAttribute("data-essay-hint");
      const phKey = el.getAttribute("data-essay-placeholder");
      const titleEl = el.querySelector("[data-essay-title]") || el.childNodes[0];
      const hintEl = el.querySelector(".hint");
      const input = el.querySelector("input, textarea, select");
      if (essay[key]) {
        if (el.matches("label.field")) {
          // rebuild label text node carefully
          const hint = hintEl ? hintEl.outerHTML : "";
          const inputHtml = input ? "" : "";
          // set via dedicated spans if present
          const titleSpan = el.querySelector("[data-essay-title]");
          if (titleSpan) titleSpan.textContent = essay[key];
          else {
            // replace first text-ish content before .hint / input
            const first = Array.from(el.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
            if (first) first.textContent = essay[key] + " ";
          }
        }
      }
      if (hintEl && hintKey && essay[hintKey]) hintEl.textContent = essay[hintKey];
      if (input && phKey && essay[phKey]) input.setAttribute("placeholder", essay[phKey]);
    });

    const chips = document.getElementById("angleChips");
    if (chips && essay.angles) {
      const pressed = new Set(
        Array.from(chips.querySelectorAll(".angle-chip[aria-pressed='true']")).map((b) => b.dataset.angle)
      );
      chips.innerHTML = essay.angles
        .map((a) => {
          const on = pressed.has(a.id) || (!pressed.size && (essay.defaultAngles || []).includes(a.id));
          return `<button type="button" class="angle-chip${on ? " active" : ""}" data-angle="${a.id}" aria-pressed="${on ? "true" : "false"}">${escapeHtml(a.label)}</button>`;
        })
        .join("");
    }

    // Direct id fallbacks (thesis / outline / source / keyword fields)
    const setPh = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.setAttribute("placeholder", val);
    };
    setPh("caseName", essay.subjectPlaceholder);
    setPh("outlineCase", essay.subjectPlaceholder);
    setPh("slCase", essay.subjectPlaceholder);
    setPh("kwCase", essay.subjectPlaceholder);
    setPh("packetArgues", essay.presentsPlaceholder);
    setPh("tensionInput", essay.tensionPlaceholder);
    setPh("criticalQuestion", essay.questionPlaceholder);
    setPh("outlineTension", essay.tensionPlaceholder);

    const topicSelect = document.getElementById("topicFolder");
    if (topicSelect && topicSelect.tagName === "SELECT") {
      const prev = topicSelect.value;
      const opts = Array.isArray(essay.topicOptions) ? essay.topicOptions.slice() : [];
      while (topicSelect.firstChild) topicSelect.removeChild(topicSelect.firstChild);
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "— select or leave blank —";
      topicSelect.appendChild(blank);
      opts.forEach((opt) => {
        const v = String(opt);
        const o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        if (v === prev) o.selected = true;
        topicSelect.appendChild(o);
      });
      if (prev && opts.indexOf(prev) === -1) topicSelect.value = "";
    }

    const cue = document.getElementById("essayToolCue");
    if (cue) cue.textContent = essay.thesisCue || essay.outlineCue || essay.purpose;

    const eyebrow = document.querySelector("[data-essay-eyebrow]");
    if (eyebrow) {
      eyebrow.textContent = essay.id
        ? `Practice tool · ${essay.label}`
        : "Practice tool · any essay";
    }

    const critBox = document.getElementById("comparisonCriteriaBox");
    if (critBox) {
      const isComp = essay.claimKind === "comparison";
      critBox.hidden = !isComp;
      if (isComp) {
        const defaults = Array.isArray(essay.comparisonCriteria) ? essay.comparisonCriteria.slice(0, 3) : [];
        ["criterion1", "criterion2", "criterion3"].forEach((id, i) => {
          const el = document.getElementById(id);
          if (el && !el.value.trim() && defaults[i]) el.value = defaults[i];
        });
        const bank = document.getElementById("criteriaPresets");
        if (bank) {
          const presets = Array.isArray(essay.comparisonCriteriaBank) && essay.comparisonCriteriaBank.length
            ? essay.comparisonCriteriaBank
            : defaults;
          bank.innerHTML = presets
            .map((p) => `<button type="button" class="angle-chip criteria-preset" data-criterion="${escapeHtml(p)}">${escapeHtml(p)}</button>`)
            .join("");
        }
      }
    }
  }

  global.DWSEssayContext = {
    STORAGE_KEY,
    ESSAYS,
    GENERIC,
    byId,
    getSelectedId,
    setSelectedId,
    getActive,
    onChange,
    mountPicker,
    applyThesisLabels,
    escapeHtml
  };
})(window);
