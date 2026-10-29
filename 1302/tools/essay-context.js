/* Shared essay context for ENGL 1302 practice tools.
   Student picks which essay; tools adapt labels/templates. No default essay. */
(function (global) {
  const STORAGE_KEY = "dws1302-essay";

  const ESSAYS = [
    {
      id: "project1-rhetorical-remix",
      studioHref: "../project1-studio.html",
      studioLabel: "Rhetorical Analysis and Remix studio",
      label: "Project 1 · Rhetorical Analysis and Remix",
      purpose: "Analyze how one public-facing text works on readers (exigence, purpose, audience, genre, setting), then remix that argument into a new mode, genre, audience, or circulation setting. Submit a multimodal artifact plus a companion essay (~1,000 words MLA).",
      subjectLabel: "Public text you will analyze",
      subjectHint: "Required. Name the ad, PSA, editorial, campaign page, or similar.",
      subjectPlaceholder: "e.g. a city recycling PSA poster",
      topicLabel: "Optional topic tag",
      topicOptions: ["Public health","Campus life","City / civic","Nonprofit appeal","Media / advertising","Other / custom"],
      presentsLabel: "What the original text seems to do",
      presentsHint: "Required. Rhetorical situation in your words.",
      presentsPlaceholder: "The text aims to… for… by…",
      tensionLabel: "Remix judgment / working thesis",
      tensionHint: "Required. Which choices do the real work, and how will the remix change the situation?",
      tensionPlaceholder: "The original succeeds/fails by…; my remix changes…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "What must change for a new audience to act?",
      angles: [{id:"situation",label:"Situation"},{id:"judgment",label:"Judgment"},{id:"remix",label:"Remix"},{id:"test",label:"Audience test"}],
      defaultAngles: ["situation","judgment","remix"],
      claimKind: "argument",
      ideaSeeds: {topics:["Campus PSA","City notice","Nonprofit appeal","Short documentary clip","Brand campaign page","Editorial cartoon or ad"],questions:["Which rhetorical choices do the real work in {topic}?","How will the remix change audience or circulation on purpose?","What access needs (alt text, captions, transcript) apply?"],ideas:["A remix must transform mode, genre, audience, or circulation","Companion essay ties artifact evidence to a contestable judgment","Access and media credits are part of the rhetorical work"]},
      outlineLenses: [
        {title:"I. Original situation",topic:"Map exigence, purpose, audience, genre, setting.",cues:["Situation","Key choices","Evidence"]},
        {title:"II. Judgment",topic:"State which choices do the real work.",cues:["Contestable claim","Support","Limits"]},
        {title:"III. Remix concept",topic:"Explain the intentional situation change.",cues:["What changes","Why","Constraints"]},
        {title:"IV. Artifact evidence",topic:"Point to concrete moves in the remix.",cues:["Mode/genre","Audience cues","Access"]},
        {title:"V. Audience test + revision",topic:"Report a test and what you changed.",cues:["Who tested","Feedback","Revision"]},
        {title:"VI. Closing",topic:"Return to the judgment without new claims.",cues:["Fresh restatement","So-what","MLA plan"]}
      ],
      sourceAim: "Log the original public text plus any borrowed media you credit in MLA.",
      sourcePacketLabel: "Public text / media credit",
      peerItems: [
        {id:"claim",title:"Judgment clarity",prompt:"Is there a contestable claim about how the original works?",placeholder:"Claim is… / Still summary because…"},
        {id:"remix",title:"Real remix",prompt:"Does the artifact change mode, genre, audience, or circulation (not only polish)?",placeholder:"Transforms… / Still same situation…"},
        {id:"evidence",title:"Companion evidence",prompt:"Does the essay point to concrete artifact evidence?",placeholder:"Strongest evidence… / Needs…"},
        {id:"access",title:"Access",prompt:"Are alt text, captions, or transcript present as needed?",placeholder:"Access works… / Missing…"},
        {id:"mla",title:"MLA",prompt:"Are the original and borrowed media cited?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own the analysis and remix?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "Draft a judgment about the original plus how the remix changes the rhetorical situation.",
      outlineCue: "Order situation → judgment → remix → test.",
      mlaCue: "Cite the original public text and any borrowed media."
    },
    {
      id: "project2-source-conversation",
      studioHref: "../project2-studio.html",
      studioLabel: "Source Conversation Exhibit studio",
      label: "Project 2 · Source Conversation Exhibit",
      purpose: "Document consensus, variation, contradiction, scope, and boundaries across research on one question. Build a multimodal exhibit of 4–6 sources plus a companion essay (~1,000 words MLA) that names the research question, audience, each source role, and set boundaries.",
      subjectLabel: "Research question",
      subjectHint: "Required. One focused question the exhibit answers.",
      subjectPlaceholder: "e.g. How do city heat plans define vulnerable residents?",
      topicLabel: "Optional topic tag",
      topicOptions: ["Public health","Environment","Education","Technology","Local policy","Other / custom"],
      presentsLabel: "What early sources seem to agree on",
      presentsHint: "Required. Emerging consensus or dominant frame.",
      presentsPlaceholder: "Sources often treat… as…",
      tensionLabel: "Variation / boundary you will show",
      tensionHint: "Required. Where sources disagree or leave a gap.",
      tensionPlaceholder: "They diverge on… which leaves…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which two sources should be paired first in a body paragraph?",
      angles: [{id:"question",label:"Question"},{id:"roles",label:"Source roles"},{id:"boundaries",label:"Boundaries"},{id:"exhibit",label:"Exhibit"}],
      defaultAngles: ["question","roles","boundaries"],
      claimKind: "exposition",
      ideaSeeds: {topics:["Heat / climate vulnerability","Campus mental health resources","Policing and data","Housing affordability metrics","AI in classrooms"],questions:["Where do sources on {topic} agree, vary, or contradict?","Which categories must the exhibit include?","What boundary should the companion name?"],ideas:["Pair two sources in every body paragraph","Exhibit must show alignment and discrepancy, not only summaries","Lateral reading checks who published what"]},
      outlineLenses: [
        {title:"I. Research question + audience",topic:"State the question and who the exhibit serves.",cues:["Question","Audience","Why it matters"]},
        {title:"II. Source map overview",topic:"Preview categories and roles.",cues:["4–6 sources","Two categories min","Roles"]},
        {title:"III. Pair conversation 1",topic:"Put two sources in dialogue.",cues:["Introduced quotation","Agreement/variation","Analysis"]},
        {title:"IV. Pair conversation 2",topic:"Second pairing that deepens the map.",cues:["Distinct pair","Contradiction or scope","Link to Q"]},
        {title:"V. Boundaries",topic:"Name what the set cannot yet answer.",cues:["Gaps","Limits","Next research"]},
        {title:"VI. Closing",topic:"Return to the question without a premature stance.",cues:["Reality check", "So-what for later projects","MLA"]}
      ],
      sourceAim: "Log 4–6 research sources across at least two categories (peer-reviewed, institutional, dataset, trade).",
      sourcePacketLabel: "Exhibit source",
      peerItems: [
        {id:"claim",title:"Question clarity",prompt:"Is the research question focused and researchable?",placeholder:"Question is… / Too broad…"},
        {id:"exhibit",title:"Exhibit elements",prompt:"Does the exhibit show consensus, variation, contradiction, scope, and boundaries?",placeholder:"Shows… / Missing…"},
        {id:"pairs",title:"Paired sources",prompt:"Do body paragraphs pair two sources with an introduced quotation?",placeholder:"Pairs work… / Solo summary at…"},
        {id:"categories",title:"Source categories",prompt:"Are there 4–6 sources and at least two distinct categories?",placeholder:"Categories… / Tertiary-only risk…"},
        {id:"mla",title:"MLA",prompt:"Do citations match Works Cited?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own the map and roles?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "Turn the research question into a working thesis about how the source set maps the issue.",
      outlineCue: "Pair sources; name roles and boundaries.",
      mlaCue: "Cite every exhibit source in MLA."
    },
    {
      id: "project3-gothic-criticism",
      studioHref: "../project3-studio.html",
      studioLabel: "Gothic Literary Criticism studio",
      label: "Project 3 · Gothic Literary Criticism",
      purpose: "Write a 1,500–2,000 word MLA literary criticism essay on one Gothic primary text. State a contestable interpretive thesis, support it with close reading, and engage at least two peer-reviewed critics from two different criticism types.",
      subjectLabel: "Primary Gothic text",
      subjectHint: "Required. Poe “The Raven,” Jackson “The Lottery,” Faulkner “A Rose for Emily,” or approved comparison.",
      subjectPlaceholder: "e.g. Shirley Jackson, “The Lottery”",
      topicLabel: "Criticism types (plan)",
      topicOptions: ["Historical/cultural","Psychological","Sociological","Philosophical/ethical","Feminist/gender","Formalist/narratological","Gothic studies","Other / custom"],
      presentsLabel: "What a first reading notices",
      presentsHint: "Required. Plot/theme surface that analysis will go past.",
      presentsPlaceholder: "Readers often notice…",
      tensionLabel: "Interpretive thesis / critical gap",
      tensionHint: "Required. What Critic A and Critic B leave open that your thesis fills.",
      tensionPlaceholder: "Although Critic A argues… and Critic B…, the text also…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Where does resistant evidence complicate the dominant reading?",
      angles: [{id:"thesis",label:"Thesis"},{id:"close",label:"Close reading"},{id:"criticA",label:"Critic A"},{id:"criticB",label:"Critic B"}],
      defaultAngles: ["thesis","close","criticA"],
      claimKind: "argument",
      ideaSeeds: {topics:["Poe, “The Raven”","Jackson, “The Lottery”","Faulkner, “A Rose for Emily”"],questions:["How do two critic types disagree about {topic}?","What resistant evidence must your thesis face?","Which passages earn the interpretive claim?"],ideas:["Naming an approach without citing a critic does not count","Plot summary alone does not count","Map how Critic A and Critic B agree, differ, or leave a gap"]},
      outlineLenses: [
        {title:"I. Introduction & thesis",topic:"Name the text and contestable interpretive claim.",cues:["Hook","Thesis","Critic roadmap"]},
        {title:"II. Close reading 1",topic:"Develop the first textual claim.",cues:["Passage","Technique","Link to thesis"]},
        {title:"III. Critic A",topic:"Engage one peer-reviewed critic and type.",cues:["Name + type","Agree/differ","Use for thesis"]},
        {title:"IV. Critic B",topic:"Engage a second critic of a different type.",cues:["Different type","Gap or conflict","Your reply"]},
        {title:"V. Resistant evidence",topic:"Face an alternative reading honestly.",cues:["Counter-evidence","Reply","Protect thesis"]},
        {title:"VI. Conclusion",topic:"Restate the insight for Gothic studies readers.",cues:["Fresh restatement","So-what","No new plot"]}
      ],
      sourceAim: "Primary text + at least two named peer-reviewed critics from two different criticism types.",
      sourcePacketLabel: "Primary / criticism",
      peerItems: [
        {id:"claim",title:"Interpretive thesis",prompt:"Is the thesis contestable and specific to this text?",placeholder:"Thesis is… / Still summary…"},
        {id:"critics",title:"Two critic types",prompt:"Are two peer-reviewed critics from two different types named and used?",placeholder:"Types… / Missing…"},
        {id:"close",title:"Close reading",prompt:"Do body sections use concrete passages?",placeholder:"Strongest passage… / Needs…"},
        {id:"resistant",title:"Resistant evidence",prompt:"Is an alternative reading faced?",placeholder:"Faces… / Missing…"},
        {id:"mla",title:"MLA",prompt:"Do in-text citations match Works Cited?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own the interpretation?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "Draft an interpretive thesis that needs two critics to stay honest.",
      outlineCue: "Interleave close reading with Critic A and Critic B.",
      mlaCue: "Cite the primary text and both critics in MLA."
    },
    {
      id: "project4-public-argument",
      studioHref: "../project4-studio.html",
      studioLabel: "Public-Facing Researched Argument studio",
      label: "Project 4 · Public-Facing Researched Argument",
      purpose: "Create a multimodal researched argument for a real public audience and circulation setting; pair with a ~1,000-word research-and-design reflection. Use at least seven sources including at least three scholarly sources in differentiated roles. Confirm with your instructor whether this major is active in your section.",
      subjectLabel: "Public issue + audience",
      subjectHint: "Required. Name the issue and the real audience/circulation setting.",
      subjectPlaceholder: "e.g. heat-safety toolkit for apartment renters in San Antonio",
      topicLabel: "Optional genre tag",
      topicOptions: ["Policy brief","Website","Podcast / video essay","Advocacy toolkit","Interactive feature","Campaign package","Other / custom"],
      presentsLabel: "Dominant public frame you will answer",
      presentsHint: "Required. What audiences usually hear.",
      presentsPlaceholder: "Public talk often frames… as…",
      tensionLabel: "Qualified claim + counterargument focus",
      tensionHint: "Required. Your stance and the strongest fair opposition.",
      tensionPlaceholder: "I argue…, while a fair counter says…",
      questionLabel: "Optional research question",
      questionPlaceholder: "What would a usability test need to show?",
      angles: [{id:"claim",label:"Claim"},{id:"sources",label:"Sources"},{id:"design",label:"Design"},{id:"counter",label:"Counter"}],
      defaultAngles: ["claim","sources","counter"],
      claimKind: "argument",
      ideaSeeds: {topics:["Local heat safety","Campus access issue","Public health messaging","Housing / renters","Digital literacy campaign"],questions:["Who is the real audience for {topic}?","Which three scholarly sources earn distinct roles?","How will multimodal design support understanding, not decorate?"],ideas:["Multimodal choices must reason","Document an audience/usability test and revision","Seven sources need differentiated jobs"]},
      outlineLenses: [
        {title:"I. Audience + claim",topic:"Name audience, setting, and qualified claim.",cues:["Audience","Claim","Stakes"]},
        {title:"II. Evidence cluster",topic:"Deploy scholarly and public sources in roles.",cues:["Roles","Warrants","MLA"]},
        {title:"III. Counterargument",topic:"Steel-man and reply.",cues:["Fair opposition","Concession","Reply"]},
        {title:"IV. Design rationale",topic:"Explain multimodal choices for this audience.",cues:["Mode","Access","Not decoration"]},
        {title:"V. Usability test",topic:"Report test and revision.",cues:["Who","Findings","Change"]},
        {title:"VI. Reflection close",topic:"Tie research and design decisions together.",cues:["What worked","What you would revise","Credits"]}
      ],
      sourceAim: "At least seven sources, including at least three scholarly, in differentiated roles.",
      sourcePacketLabel: "Research source",
      peerItems: [
        {id:"claim",title:"Qualified claim",prompt:"Is the claim clear, qualified, and public-facing?",placeholder:"Claim is… / Vague…"},
        {id:"sources",title:"Source roles",prompt:"Do ≥7 sources (≥3 scholarly) have distinct jobs?",placeholder:"Roles… / Dumping…"},
        {id:"design",title:"Design that reasons",prompt:"Do multimodal choices support understanding/action?",placeholder:"Design helps… / Decorates…"},
        {id:"test",title:"Audience test",prompt:"Is a usability/audience test documented with revision?",placeholder:"Test shows… / Missing…"},
        {id:"mla",title:"MLA",prompt:"Are citations and media credits complete?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own claim and design?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "Draft a qualified public claim aimed at a named audience.",
      outlineCue: "Plan artifact + reflection together.",
      mlaCue: "Cite research sources and credit media."
    },
    {
      id: "sp26-essay1-evaluation",
      studioHref: "../sp26-essay1-evaluation-studio.html",
      studioLabel: "Evaluation Essay studio",
      label: "Essay 1 · Evaluation (monster)",
      purpose: "Evaluate one cultural or literary monster using explicit criteria (effectiveness, cultural function, or impact). Judgment + criteria + evidence; not plot summary or unsupported opinion. Exact Sp26 word count still to confirm from Course Text Guidelines.",
      subjectLabel: "Monster / figure to evaluate",
      subjectHint: "Required. One monster (do not use Stranger Things for this essay).",
      subjectPlaceholder: "e.g. La Llorona / Frankenstein’s creature",
      topicLabel: "Criteria focus",
      topicOptions: ["Cultural fear / anxiety","Folkloric relevance today","Social critique","Effectiveness as horror","Impact on audiences","Other / custom"],
      presentsLabel: "Common view of this monster",
      presentsHint: "Required. What people usually say.",
      presentsPlaceholder: "People often treat… as…",
      tensionLabel: "Judgment + criteria",
      tensionHint: "Required. Your evaluation tied to named criteria.",
      tensionPlaceholder: "By criteria of…, this figure succeeds/fails because…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which criterion should decide the judgment if they trade off?",
      angles: [{id:"criteria",label:"Criteria"},{id:"judgment",label:"Judgment"},{id:"evidence",label:"Evidence"}],
      defaultAngles: ["criteria","judgment","evidence"],
      claimKind: "argument",
      ideaSeeds: {topics:["Jackson, “The Lottery”","Shelley, Frankenstein","Gilman, “The Yellow Wallpaper”","King, “The Boogeyman”","La Llorona","El Cucuy","Donkey Lady","Chupacabra"],questions:["What criteria make a fair evaluation of {topic}?","Which evidence earns the judgment?","How does Cohen or King help without taking over?"],ideas:["Criteria must be explicit before the judgment","Plot summary is not evaluation","Secondary readings can sharpen criteria"]},
      outlineLenses: [
        {title:"I. Introduction + judgment",topic:"Name the monster and state the evaluative thesis.",cues:["Monster","Judgment","Criteria preview"]},
        {title:"II. Criterion 1",topic:"Apply criterion 1 with evidence.",cues:["Criterion","Evidence","Warrant"]},
        {title:"III. Criterion 2",topic:"Apply criterion 2 with evidence.",cues:["Distinct criterion","Evidence","Link"]},
        {title:"IV. Criterion 3 / complication",topic:"Add depth or face a tradeoff.",cues:["Tradeoff","Secondary source","Reply"]},
        {title:"V. Conclusion",topic:"Restate the judgment and stakes.",cues:["Fresh restatement","So-what","No new monster"]}
      ],
      sourceAim: "Primary monster text/figure plus any secondary readings you cite (King, Cohen, NPR Code Switch, etc.).",
      sourcePacketLabel: "Primary / secondary",
      peerItems: [
        {id:"claim",title:"Judgment",prompt:"Is there a clear evaluative judgment (not only description)?",placeholder:"Judgment is… / Still description…"},
        {id:"criteria",title:"Criteria",prompt:"Are criteria explicit and applied consistently?",placeholder:"Criteria… / Implied only…"},
        {id:"evidence",title:"Evidence",prompt:"Is the judgment backed with concrete evidence?",placeholder:"Strongest evidence… / Needs…"},
        {id:"st",title:"Stranger Things rule",prompt:"Does the draft avoid using Stranger Things as the evaluated text?",placeholder:"OK… / Needs change…"},
        {id:"mla",title:"MLA",prompt:"Are citations present when sources are used?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own the judgment?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "State a judgment tied to named criteria.",
      outlineCue: "One criterion per body section when possible.",
      mlaCue: "Cite literary and secondary sources in MLA."
    },
    {
      id: "sp26-essay2-critical-analysis",
      studioHref: "../sp26-essay2-critical-analysis-studio.html",
      studioLabel: "Critical Analysis studio",
      label: "Essay 2 · Critical Analysis (Stranger Things)",
      purpose: "Analyze a symbol, character, or theme in Stranger Things (rhetorical, literary, visual, or cultural). Optional companion graphic novel/webcomic for visual rhetoric. Exact Sp26 word count still to confirm.",
      subjectLabel: "Focus (symbol / character / theme)",
      subjectHint: "Required. Name the angle and season/episode or graphic text.",
      subjectPlaceholder: "e.g. the Upside Down as trauma space in S4",
      topicLabel: "Optional focus tag",
      topicOptions: ["Upside Down","Hawkins Lab","Will","Eleven","Vecna","1980s nostalgia","Coded readings","Graphic companion","Other / custom"],
      presentsLabel: "What the show seems to present",
      presentsHint: "Required. Surface reading you will go past.",
      presentsPlaceholder: "The series presents… as…",
      tensionLabel: "Analytical thesis",
      tensionHint: "Required. What the focus reveals beyond plot.",
      tensionPlaceholder: "A closer look shows that… because…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which episode or panel evidence is essential?",
      angles: [{id:"focus",label:"Focus"},{id:"evidence",label:"Episode/panel"},{id:"theory",label:"Theory"},{id:"insight",label:"Insight"}],
      defaultAngles: ["focus","evidence","insight"],
      claimKind: "argument",
      ideaSeeds: {topics:["Upside Down","Hawkins Lab","Will","Eleven","Vecna","1980s nostalgia"],questions:["How does {topic} work as symbol or structure?","What theory lens helps without flattening the show?","Where must episode/panel evidence appear?"],ideas:["Go beyond plot","Optional graphic comparison needs shared criteria","Secondary/theory should illuminate"]},
      outlineLenses: [
        {title:"I. Introduction + thesis",topic:"Name focus and analytical claim.",cues:["Focus","Thesis","Roadmap"]},
        {title:"II. Evidence cluster 1",topic:"Close-read episode or panel evidence.",cues:["Specific moment","Analysis","Link"]},
        {title:"III. Evidence cluster 2",topic:"Deepen with a second cluster.",cues:["Distinct angle","Evidence","Avoid plot dump"]},
        {title:"IV. Theory / secondary",topic:"Use theory carefully if included.",cues:["Named theory","Illuminate","Not decorate"]},
        {title:"V. Conclusion",topic:"Restate insight beyond plot.",cues:["Fresh restatement","So-what","MLA"]}
      ],
      sourceAim: "Stranger Things (and optional graphic text) plus any theory/secondary you cite.",
      sourcePacketLabel: "Show / graphic / theory",
      peerItems: [
        {id:"claim",title:"Analytical thesis",prompt:"Does the thesis go beyond plot summary?",placeholder:"Thesis is… / Still plot…"},
        {id:"evidence",title:"Episode/panel evidence",prompt:"Are claims tied to specific moments?",placeholder:"Strongest moment… / Needs…"},
        {id:"theory",title:"Theory use",prompt:"If theory appears, does it illuminate?",placeholder:"Helps… / Dropped in…"},
        {id:"org",title:"Organization",prompt:"Do sections follow a clear analytical order?",placeholder:"Order works… / Confusing…"},
        {id:"mla",title:"MLA",prompt:"Are citations present?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own the analysis?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "Draft an analytical thesis about a symbol, character, or theme.",
      outlineCue: "Lead with evidence; add theory only when it earns a job.",
      mlaCue: "Cite episodes, graphic texts, and theory in MLA."
    },
    {
      id: "sp26-essay3-argument",
      studioHref: "../sp26-essay3-argument-studio.html",
      studioLabel: "Argument Essay studio",
      label: "Essay 3 · Real Monster Argument",
      purpose: "Identify/argue who or what the “real monster” is in a literary, cultural, or social context. Claim + research + counterargument. Stranger Things may be a short reference only, not the main text. Exact Sp26 word count still to confirm.",
      subjectLabel: "Real monster claim focus",
      subjectHint: "Required. Name the institution, panic, figure, or system you will argue is the real monster.",
      subjectPlaceholder: "e.g. institutional secrecy in Cold War experiments",
      topicLabel: "Optional argument type",
      topicOptions: ["Definitional","Causal","Ethical","Evaluation-based","Other / custom"],
      presentsLabel: "Familiar monster story you will displace",
      presentsHint: "Required. The surface monster or myth.",
      presentsPlaceholder: "People point to… as the monster, but…",
      tensionLabel: "Claim + counterargument",
      tensionHint: "Required. Your argument and the strongest fair opposition.",
      tensionPlaceholder: "I argue the real monster is…; a fair counter says…",
      questionLabel: "Optional research question",
      questionPlaceholder: "Which scholarly source best pressure-tests the claim?",
      angles: [{id:"claim",label:"Claim"},{id:"research",label:"Research"},{id:"counter",label:"Counter"},{id:"stakes",label:"Stakes"}],
      defaultAngles: ["claim","research","counter"],
      claimKind: "argument",
      ideaSeeds: {topics:["MK-Ultra secrecy","Satanic Panic","Institutions as monsters","Frankenstein / Lottery reframed","Moral panic and rumor"],questions:["Who benefits if the familiar monster story stays unchallenged?","What scholarly material must appear?","Where does Stranger Things stay optional and short?"],ideas:["Counterargument is required","Scholarly integration matters","ST is optional short reference only"]},
      outlineLenses: [
        {title:"I. Claim",topic:"State the real-monster argument.",cues:["Claim","Stakes","Map"]},
        {title:"II. Research support",topic:"Integrate scholarly and cultural evidence.",cues:["Sources","Warrants","Roles"]},
        {title:"III. Literary/cultural case",topic:"Use a focused case without plot dump.",cues:["Case","Link to claim","Limits"]},
        {title:"IV. Counterargument",topic:"Face a fair opposition.",cues:["Steel-man","Reply","Protect claim"]},
        {title:"V. Conclusion",topic:"Restate stakes for readers.",cues:["Fresh restatement","So-what","MLA"]}
      ],
      sourceAim: "Research set with scholarly integration; literary/cultural options as cases.",
      sourcePacketLabel: "Research / case text",
      peerItems: [
        {id:"claim",title:"Claim",prompt:"Is the real-monster claim clear and arguable?",placeholder:"Claim is… / Vague…"},
        {id:"research",title:"Research",prompt:"Is scholarly material integrated (not dumped)?",placeholder:"Sources help… / Missing…"},
        {id:"counter",title:"Counterargument",prompt:"Is a fair opposition answered?",placeholder:"Counter works… / Missing…"},
        {id:"st",title:"ST boundary",prompt:"If Stranger Things appears, is it only a short reference?",placeholder:"OK… / Too central…"},
        {id:"mla",title:"MLA",prompt:"Are citations matched?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own the argument?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "Draft a real-monster claim that needs research and a counterargument.",
      outlineCue: "Claim → evidence → counter → stakes.",
      mlaCue: "Cite research and any literary cases in MLA."
    },
    {
      id: "sp26-essay4-research",
      studioHref: "../sp26-essay4-research-studio.html",
      studioLabel: "Research Synthesis studio",
      label: "Essay 4 · Research Synthesis + Evaluation",
      purpose: "Evaluate and synthesize research on a cultural, social, or psychological issue connected to monsters, fear, or community. Research-driven final (not a zine). Aim for at least 5–7 credible sources including ≥1 scholarly article and ≥1 cultural/literary text (MLA 9). Exact Sp26 word count still to confirm.",
      subjectLabel: "Issue under synthesis",
      subjectHint: "Required. Name the issue (monsters, fear, community, institutions, folklore/trauma, etc.).",
      subjectPlaceholder: "e.g. how communities narrate institutional betrayal",
      topicLabel: "Optional issue tag",
      topicOptions: ["Community fear","Cultural monsters","Trauma in media","Institutional panics","Nostalgia / identity","Folklore and trauma","Other / custom"],
      presentsLabel: "Main perspectives in the research set",
      presentsHint: "Required. What the sources collectively map.",
      presentsPlaceholder: "Researchers tend to frame… as…",
      tensionLabel: "Synthesis / evaluation claim",
      tensionHint: "Required. How you evaluate the set (not only summarize).",
      tensionPlaceholder: "Taken together, the research shows… but underplays…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which perspective should readers trust more, and why?",
      angles: [{id:"synthesize",label:"Synthesize"},{id:"evaluate",label:"Evaluate"},{id:"gap",label:"Gap"},{id:"case",label:"Case"}],
      defaultAngles: ["synthesize","evaluate","gap"],
      claimKind: "argument",
      ideaSeeds: {topics:["Community fear","Institutional panics","Folklore and trauma","Nostalgia and identity","Trauma in media"],questions:["How do sources on {topic} align or conflict?","What is summary vs synthesis vs evaluation here?","Which literary/cultural text earns a case role?"],ideas:["Synthesis is not a list of summaries","Evaluate perspectives; do not only report them","Meet the 5–7 source bar with roles"]},
      outlineLenses: [
        {title:"I. Issue + claim",topic:"Frame the issue and synthesis thesis.",cues:["Issue","Claim","Source map"]},
        {title:"II. Perspective thread A",topic:"Synthesize one cluster of sources.",cues:["Agreement","Variation","Evaluation"]},
        {title:"III. Perspective thread B",topic:"Synthesize a contrasting cluster.",cues:["Conflict","Evidence","Link"]},
        {title:"IV. Literary/cultural case",topic:"Use ≥1 cultural/literary text as a case.",cues:["Case","Not whole essay","Link to claim"]},
        {title:"V. Evaluation + gap",topic:"Judge the set and name what remains open.",cues:["Evaluation","Gap","Reader takeaway"]},
        {title:"VI. Conclusion",topic:"Close without new topics.",cues:["Fresh restatement","So-what","MLA"]}
      ],
      sourceAim: "At least 5–7 credible sources; ≥1 scholarly; ≥1 cultural/literary text.",
      sourcePacketLabel: "Research / case text",
      peerItems: [
        {id:"claim",title:"Synthesis thesis",prompt:"Does the thesis evaluate/synthesize (not only summarize)?",placeholder:"Thesis is… / Still summary…"},
        {id:"sources",title:"Source bar",prompt:"Are there 5–7 sources with ≥1 scholarly and ≥1 cultural/literary?",placeholder:"Meets… / Missing…"},
        {id:"synth",title:"Synthesis moves",prompt:"Do paragraphs put sources in conversation?",placeholder:"Conversation works… / List at…"},
        {id:"eval",title:"Evaluation",prompt:"Does the draft judge perspectives?",placeholder:"Evaluates… / Reports only…"},
        {id:"mla",title:"MLA 9",prompt:"Are citations complete?",placeholder:"MLA looks… / Check…"},
        {id:"ai",title:"AI Level 2 honesty",prompt:"Does the writer own the synthesis?",placeholder:"Ownership looks… / Ask…"}
      ],
      thesisCue: "Draft a synthesis/evaluation claim about the research set.",
      outlineCue: "Thread perspectives; evaluate; name gaps.",
      mlaCue: "Cite all sources in MLA 9."
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

    const topicOpts = Array.isArray(essay.topicOptions) ? essay.topicOptions.slice() : [];
    ["topicFolder", "kwTopic"].forEach((selectId) => {
      const topicSelect = document.getElementById(selectId);
      if (!topicSelect || topicSelect.tagName !== "SELECT") return;
      const prev = topicSelect.value;
      while (topicSelect.firstChild) topicSelect.removeChild(topicSelect.firstChild);
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "— select or leave blank —";
      topicSelect.appendChild(blank);
      topicOpts.forEach((opt) => {
        const v = String(opt);
        const o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        if (v === prev) o.selected = true;
        topicSelect.appendChild(o);
      });
      if (prev && topicOpts.indexOf(prev) === -1) topicSelect.value = "";
    });

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

  function getStudioHref(essay) {
    const e = essay || getActive();
    if (e && e.studioHref) return e.studioHref;
    return "index.html#essays";
  }

  function getStudioLabel(essay) {
    const e = essay || getActive();
    if (e && e.studioLabel) return e.studioLabel;
    return "Essays on Home";
  }

  global.DWSEssayContext = {
    STORAGE_KEY,
    ESSAYS,
    GENERIC,
    byId,
    getSelectedId,
    setSelectedId,
    getActive,
    getStudioHref,
    getStudioLabel,
    onChange,
    mountPicker,
    applyThesisLabels,
    escapeHtml
  };
})(window);
