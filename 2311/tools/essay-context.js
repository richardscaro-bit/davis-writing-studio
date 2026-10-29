/* Shared essay context for ENGL 2311 practice tools.
   Student picks which project; tools adapt labels/templates. No default project. */
(function (global) {
  const STORAGE_KEY = "dws2311-essay";

  const ESSAYS = [
    {
      id: "audience-analysis",
      studioHref: "../audience-analysis-studio.html",
      studioLabel: "Audience Analysis studio",
      label: "Audience Analysis",
      purpose:
        "Characterize a specific audience for a technical document (demographics, expertise, purpose, attitudes, design preferences), then present the analysis. Draft a clear audience profile report in APA style and a short presentation that summarizes what readers need.",
      subjectLabel: "Audience / document focus",
      subjectHint: "Required. Name the audience and the technical document it serves.",
      subjectPlaceholder: "e.g. new nurses using a medication pump quick-start guide",
      topicLabel: "Optional field tag",
      topicOptions: [
        "Health / nursing",
        "IT / software",
        "Business / operations",
        "Engineering",
        "Education",
        "Public service",
        "Other / custom"
      ],
      presentsLabel: "What this audience needs from the document",
      presentsHint: "Required. Goals, expertise level, and what success looks like for them.",
      presentsPlaceholder: "Readers need a clear how-to because…",
      tensionLabel: "Attitudes, constraints, or design risks",
      tensionHint: "Required. Resistance, cultural variables, or design preferences that shape the document.",
      tensionPlaceholder: "They may resist dense text; prefer diagrams because…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "What must this document do for this audience first?",
      angles: [
        { id: "demographics", label: "Demographics" },
        { id: "expertise", label: "Expertise" },
        { id: "purpose", label: "Purpose" },
        { id: "attitudes", label: "Attitudes" },
        { id: "design", label: "Design" }
      ],
      defaultAngles: ["demographics", "purpose", "design"],
      claimKind: "exposition",
      ideaSeeds: {
        topics: [
          "New hires using a workplace safety guide",
          "Patients reading a clinic discharge instruction sheet",
          "Customers installing a product for the first time",
          "Managers reviewing a short process update memo",
          "Students using a lab equipment quick-start",
          "Field techs following a troubleshooting flowchart"
        ],
        questions: [
          "What does this audience need explained first about {topic}?",
          "Where might expertise or attitude block clear reading?",
          "Which graphics would help this audience without clutter?",
          "What cultural or language variables matter here?",
          "How will you verify the audience profile (interview, reading, observation)?"
        ],
        ideas: [
          "The document succeeds when this audience can act without calling for help",
          "Expertise level, not age alone, drives how much jargon is safe",
          "Attitude toward the topic shapes tone as much as layout does",
          "Design choices should match how this audience already reads at work",
          "A clear primary goal and one secondary goal keep the profile focused"
        ]
      },
      outlineLenses: [
        { title: "I. Audience selection", topic: "Name the audience and the technical document it serves.", cues: ["Specific audience", "Document type", "Why this pairing"] },
        { title: "II. Demographics & expertise", topic: "Describe demographics and topic familiarity.", cues: ["Background", "Knowledge level", "Profile sheet notes"] },
        { title: "III. Purpose of engagement", topic: "Explain why they read and what they need to accomplish.", cues: ["Primary goals", "Secondary goals", "Use context"] },
        { title: "IV. Attitudes & expectations", topic: "Assess receptiveness and what they expect from content and clarity.", cues: ["Attitude", "Depth expected", "Utility"] },
        { title: "V. Graphics & design", topic: "Recommend visuals and design that fit this audience.", cues: ["Graphics types", "Layout / typography", "Cultural sensitivity"] },
        { title: "VI. Learning methods & closing", topic: "Note how you learned about the audience; preview the presentation takeaway.", cues: ["Interview / reading / search", "Social or cultural notes", "Presentation focus"] }
      ],
      sourceAim: "Log interviews, articles, forums, or social insights you use to characterize the audience. APA for the report.",
      sourcePacketLabel: "Audience Profile sheet / sample",
      peerItems: [
        { id: "claim", title: "Audience specificity", prompt: "Is the audience specific enough to design for (not “everyone”)?", placeholder: "Audience is clear as… / Still too broad because…" },
        { id: "evidence", title: "Profile depth", prompt: "Do demographics, purpose, attitudes, and design get concrete detail?", placeholder: "Strongest section… / Thin at…" },
        { id: "org", title: "Report structure", prompt: "Can a reader navigate the report section by section?", placeholder: "Order works… / Confusing at…" },
        { id: "design", title: "Design recommendations", prompt: "Are graphics and design tied to audience needs?", placeholder: "Design advice helps… / Generic at…" },
        { id: "mla", title: "APA / citation", prompt: "If sources appear, are they credited in APA style?", placeholder: "Citations look… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the audience analysis?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Draft a purpose statement: who the audience is and what the document must do for them.",
      outlineCue: "Order profile sections the way a reader of the report will need them.",
      mlaCue: "Practice citation form here; use APA conventions in the Audience Analysis report."
    },
    {
      id: "research-proposal",
      studioHref: "../research-proposal-studio.html",
      studioLabel: "Research Proposal studio",
      label: "Research Proposal",
      purpose:
        "Draft a 5 to 7 page APA research proposal for a problem or need in your field. Include purpose, summary, introduction, proposed program, qualifications, budget, task schedule, evaluation, and references.",
      subjectLabel: "Problem / need",
      subjectHint: "Required. Name the workplace or field problem you will address.",
      subjectPlaceholder: "e.g. high error rate in shift-handoff documentation",
      topicLabel: "Optional field tag",
      topicOptions: [
        "Health / nursing",
        "IT / software",
        "Business / operations",
        "Engineering",
        "Education",
        "Public service",
        "Other / custom"
      ],
      presentsLabel: "Current situation / stakeholder need",
      presentsHint: "Required. What is happening now and who feels the cost.",
      presentsPlaceholder: "Currently, teams struggle with… which costs…",
      tensionLabel: "Proposed program focus",
      tensionHint: "Required. The solution direction you will propose.",
      tensionPlaceholder: "I propose a program that… so that…",
      questionLabel: "Optional research question",
      questionPlaceholder: "What would show this proposal is worth funding?",
      angles: [
        { id: "problem", label: "Problem" },
        { id: "program", label: "Program" },
        { id: "budget", label: "Budget" },
        { id: "stakeholders", label: "Stakeholders" },
        { id: "eval", label: "Evaluation" }
      ],
      defaultAngles: ["problem", "program", "stakeholders"],
      claimKind: "argument",
      ideaSeeds: {
        topics: [
          "Improving documentation quality on a team",
          "Reducing onboarding time for new hires",
          "A usability fix for a confusing internal tool",
          "A training program for safer procedures",
          "A customer-support knowledge base redesign",
          "A campus or clinic process that wastes time"
        ],
        questions: [
          "What problem does {topic} create for internal vs external stakeholders?",
          "What resources and timeline would a careful proposal need?",
          "How will success be measured after the program runs?",
          "What evidence would a skeptical reader ask for?",
          "Why are you or your team qualified to lead this?"
        ],
        ideas: [
          "The proposal earns trust when problem, program, and budget line up",
          "Internal and external readers need different framing of the same need",
          "A clear evaluation plan separates a real proposal from a wish list",
          "Qualifications should match the program, not pad a resume",
          "Appendix visuals should clarify cost, timeline, or process"
        ]
      },
      outlineLenses: [
        { title: "I. Purpose & summary", topic: "State why you are writing and give a short overview.", cues: ["Problem in one line", "Snapshot of the program", "Ask"] },
        { title: "II. Introduction", topic: "Give context and significance of the problem or need.", cues: ["Background", "Why now", "Stakeholders"] },
        { title: "III. Proposed program", topic: "Detail logistics, resources, and challenges.", cues: ["How it operates", "Resources", "Risks"] },
        { title: "IV. Qualifications & budget", topic: "Show fitness to lead and a transparent cost picture.", cues: ["Expertise", "Line items", "Assumptions"] },
        { title: "V. Schedule & evaluation", topic: "Map milestones and how you will measure success.", cues: ["Milestones", "Metrics", "Methods"] },
        { title: "VI. Appendixes & references", topic: "Point to supporting visuals and APA sources.", cues: ["Charts / data", "APA list", "No orphan claims"] }
      ],
      sourceAim: "Log research that substantiates the problem, program, and budget. APA references required.",
      sourcePacketLabel: "Proposal sample / guide",
      peerItems: [
        { id: "claim", title: "Purpose clarity", prompt: "Is the problem and ask clear in the opening?", placeholder: "Purpose is clear… / Vague because…" },
        { id: "program", title: "Program feasibility", prompt: "Is the proposed program concrete enough to run?", placeholder: "Program works when… / Needs detail at…" },
        { id: "budget", title: "Budget & schedule", prompt: "Do budget and timeline look transparent and complete?", placeholder: "Budget helps… / Missing…" },
        { id: "org", title: "Structure", prompt: "Does the proposal follow a professional section order?", placeholder: "Order works… / Confusing at…" },
        { id: "mla", title: "APA", prompt: "Are references present and matched to claims?", placeholder: "APA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the proposal ideas?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Draft a purpose statement that names the problem and the program you will propose.",
      outlineCue: "Follow proposal sections: purpose through evaluation and references.",
      mlaCue: "Use APA for proposal references; this tool still practices citation form."
    },
    {
      id: "recommendation-report",
      studioHref: "../recommendation-report-studio.html",
      studioLabel: "Recommendation Report studio",
      label: "Recommendation Report",
      purpose:
        "Build on your proposal into a recommendation report: identify the problem or opportunity, evaluate options against clear criteria, and recommend a course of action with research depth and clarity.",
      subjectLabel: "Problem / opportunity",
      subjectHint: "Required. Carry forward (or refine) the proposal focus.",
      subjectPlaceholder: "e.g. choosing among three onboarding documentation options",
      topicLabel: "Optional field tag",
      topicOptions: [
        "Health / nursing",
        "IT / software",
        "Business / operations",
        "Engineering",
        "Education",
        "Public service",
        "Other / custom"
      ],
      presentsLabel: "Options under consideration",
      presentsHint: "Required. Name the options you will evaluate.",
      presentsPlaceholder: "Option A… Option B… Option C…",
      tensionLabel: "Criteria + working recommendation",
      tensionHint: "Required. Criteria that matter and which option you lean toward.",
      tensionPlaceholder: "Using cost, usability, and risk, I recommend… because…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which criterion should decide the recommendation if options trade off?",
      angles: [
        { id: "criteria", label: "Criteria" },
        { id: "options", label: "Options" },
        { id: "results", label: "Results" },
        { id: "recommend", label: "Recommendation" }
      ],
      defaultAngles: ["criteria", "options", "recommend"],
      claimKind: "argument",
      ideaSeeds: {
        topics: [
          "Choosing among documentation platforms",
          "Selecting a training delivery method",
          "Comparing process redesign options",
          "Evaluating a tool upgrade vs status quo",
          "Picking a safer workflow for a team",
          "Deciding whether to pilot a new report format"
        ],
        questions: [
          "What criteria make a fair comparison for {topic}?",
          "How does each option perform against the same criteria?",
          "Where did the recommendation shift from the proposal?",
          "What research depth would a skeptical reader demand?",
          "What implementation step should follow the recommendation?"
        ],
        ideas: [
          "A recommendation earns trust when every option faces the same criteria",
          "Results should show tradeoffs, not only praise the favorite",
          "The report should show how the proposal research grew or changed",
          "Objectivity means naming limits of the data honestly",
          "A clear next step turns analysis into action"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction", topic: "Identify the problem or opportunity and state evaluation criteria.", cues: ["Problem", "Criteria", "Link to proposal"] },
        { title: "II. Methods", topic: "Explain how options were identified and studied.", cues: ["Option list", "Sources / methods", "What is new since the proposal"] },
        { title: "III. Results", topic: "Evaluate each option against the same criteria.", cues: ["Parallel evaluation", "Evidence", "Tradeoffs"] },
        { title: "IV. Conclusions", topic: "Synthesize what the results show about feasibility and impact.", cues: ["Efficacy", "Feasibility", "Impact"] },
        { title: "V. Recommendations", topic: "Champion a course of action tied to the conclusions.", cues: ["Clear recommend", "Implementation note", "Align or revise vs proposal"] },
        { title: "VI. Closing support", topic: "Point to research depth and any needed appendix visuals.", cues: ["Sources", "Visuals", "Limits"] }
      ],
      sourceAim: "Expand proposal research with new findings. Keep sources tied to criteria and options.",
      sourcePacketLabel: "Proposal / progress notes",
      peerItems: [
        { id: "claim", title: "Recommendation clarity", prompt: "Is there one clear recommended course of action?", placeholder: "Recommendation is… / Still hedging because…" },
        { id: "criteria", title: "Shared criteria", prompt: "Are the same criteria applied to every option?", placeholder: "Criteria work… / Shift at…" },
        { id: "evidence", title: "Research depth", prompt: "Do results rest on evidence, not preference alone?", placeholder: "Strongest evidence… / Thin at…" },
        { id: "org", title: "Report structure", prompt: "Do intro → methods → results → conclusions → recommend read cleanly?", placeholder: "Order works… / Confusing at…" },
        { id: "mla", title: "Citation", prompt: "Are sources credited consistently (APA or course style)?", placeholder: "Citations look… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the analysis?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Name the recommendation and the criteria that justify it.",
      outlineCue: "Keep option evaluations parallel under shared criteria.",
      mlaCue: "Cite research that supports criteria, results, and the recommendation."
    },
    {
      id: "job-application",
      studioHref: "../job-application-studio.html",
      studioLabel: "Job Application studio",
      label: "Job Application",
      purpose:
        "Assemble a job application package: professional resume, tailored cover letter, employer expectations research, LinkedIn brand work, then place the package on your portfolio site.",
      subjectLabel: "Target role / employer",
      subjectHint: "Required. Name the role (or hypothetical technical writing role) you are aiming at.",
      subjectPlaceholder: "e.g. junior technical writer at a healthcare software company",
      topicLabel: "Optional industry tag",
      topicOptions: [
        "Health / nursing",
        "IT / software",
        "Business / operations",
        "Engineering",
        "Education",
        "Public service",
        "Other / custom"
      ],
      presentsLabel: "Employer expectations you researched",
      presentsHint: "Required. What employers in this lane say they want.",
      presentsPlaceholder: "Employers emphasize… according to…",
      tensionLabel: "Your fit / brand focus",
      tensionHint: "Required. Skills and proof points you will foreground.",
      tensionPlaceholder: "I will emphasize… with evidence from…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which proof point belongs in the cover letter vs the resume?",
      angles: [
        { id: "resume", label: "Resume" },
        { id: "letter", label: "Cover letter" },
        { id: "research", label: "Employer research" },
        { id: "linkedin", label: "LinkedIn" }
      ],
      defaultAngles: ["resume", "letter", "linkedin"],
      claimKind: "reflection",
      ideaSeeds: {
        topics: [
          "Junior technical writer role",
          "Documentation specialist internship",
          "Content designer adjacent role",
          "Healthcare communications support role",
          "IT help-desk to docs transition",
          "Campus or nonprofit writing role"
        ],
        questions: [
          "What do employers in {topic} expect that your materials must show?",
          "Which experience belongs on the resume vs the letter?",
          "How will LinkedIn reinforce the same brand without repeating the resume?",
          "What proof of technical writing skill can you show?",
          "Who can give useful feedback on the letter draft?"
        ],
        ideas: [
          "The package works when resume, letter, and LinkedIn tell one coherent story",
          "Employer research should change what you emphasize, not only what you claim",
          "A cover letter is a fit argument, not a resume in paragraph form",
          "LinkedIn summary and skills should match the role language carefully",
          "Portfolio placement makes the packet easy for a reader to open"
        ]
      },
      outlineLenses: [
        { title: "I. Role & research", topic: "Name the role and summarize employer expectations.", cues: ["Role", "Research methods", "Key expectations"] },
        { title: "II. Resume plan", topic: "Map sections and proof points for the resume.", cues: ["Education", "Experience", "Tech writing skills"] },
        { title: "III. Cover letter plan", topic: "Outline a tailored letter that argues fit.", cues: ["Hook", "2–3 proof points", "Close"] },
        { title: "IV. LinkedIn brand", topic: "Plan photo, summary, experience, skills, and networking moves.", cues: ["Summary", "Skills", "Groups / posts"] },
        { title: "V. Portfolio placement", topic: "Decide how the packet appears on your site.", cues: ["Page sections", "Links", "Polish pass"] },
        { title: "VI. Feedback & revise", topic: "Note who will review the letter and what you will revise.", cues: ["Reviewer", "Revision focus", "Consistency check"] }
      ],
      sourceAim: "Log employer sites, LinkedIn research, interviews, or guides you used.",
      sourcePacketLabel: "Job packet samples",
      peerItems: [
        { id: "claim", title: "Fit clarity", prompt: "Do materials make a clear fit case for one role?", placeholder: "Fit is clear… / Scattered because…" },
        { id: "resume", title: "Resume focus", prompt: "Does the resume foreground relevant skills and proof?", placeholder: "Strongest proof… / Needs focus at…" },
        { id: "letter", title: "Cover letter", prompt: "Is the letter tailored (not a generic template)?", placeholder: "Letter works… / Generic at…" },
        { id: "linkedin", title: "LinkedIn consistency", prompt: "Does LinkedIn match the resume/letter brand?", placeholder: "Consistent… / Drift at…" },
        { id: "mla", title: "Research notes", prompt: "Is employer research summarized with clear sources?", placeholder: "Research helps… / Vague…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the voice and claims?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "State the role and the one-sentence fit claim your package will prove.",
      outlineCue: "Plan resume, letter, research summary, and LinkedIn as one package.",
      mlaCue: "Credit employer research sources in your notes even if the packet itself is not an MLA essay."
    },
    {
      id: "digital-portfolio",
      studioHref: "../digital-portfolio-studio.html",
      studioLabel: "Digital Portfolio studio",
      label: "Digital Portfolio",
      purpose:
        "Curate a digital portfolio website of your technical writing from the course, include the job application packet, and write an 800 to 1,000 word progress report on your development.",
      subjectLabel: "Portfolio focus / brand",
      subjectHint: "Required. Name the professional story the site will tell.",
      subjectPlaceholder: "e.g. technical writer focused on clear healthcare instructions",
      topicLabel: "Optional platform tag",
      topicOptions: [
        "Canva site",
        "Wix",
        "Squarespace",
        "Weebly",
        "Other / custom"
      ],
      presentsLabel: "Pieces you will curate",
      presentsHint: "Required. Which course documents best show skill and growth.",
      presentsPlaceholder: "I will include… because they show…",
      tensionLabel: "Progress report focus",
      tensionHint: "Required. Growth claim: starting point, challenges, learnings, next goals.",
      tensionPlaceholder: "I started…; I grew in…; next I will…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "Which before/after revision best shows learning?",
      angles: [
        { id: "curate", label: "Curation" },
        { id: "progress", label: "Progress report" },
        { id: "design", label: "Site design" },
        { id: "brand", label: "Brand" }
      ],
      defaultAngles: ["curate", "progress", "design"],
      claimKind: "reflection",
      ideaSeeds: {
        topics: [
          "A portfolio centered on instructions and procedures",
          "A portfolio centered on reports and proposals",
          "A brand story about clarity for non-experts",
          "A site that features revision before/after",
          "A healthcare or IT niche brand",
          "A generalist technical writing starter portfolio"
        ],
        questions: [
          "Which documents best prove growth in {topic}?",
          "What should a visitor understand in the first 30 seconds?",
          "How will the progress report use concrete draft evidence?",
          "Where do interactive elements help without clutter?",
          "How does the job application packet sit inside the site?"
        ],
        ideas: [
          "Curation beats dumping every file: choose pieces that prove range and growth",
          "The progress report needs concrete before/after evidence",
          "Site navigation is part of the technical writing skill you are showing",
          "Personal brand should stay professional and consistent across pages",
          "Job application materials belong in a clear, findable section"
        ]
      },
      outlineLenses: [
        { title: "I. Brand & bio", topic: "Plan the introduction visitors see first.", cues: ["One-line brand", "Short bio", "Contact"] },
        { title: "II. Curated work", topic: "Select documents that show skill and range.", cues: ["Why each piece", "Order", "Job packet included"] },
        { title: "III. Progress report", topic: "Draft the 800–1000 word growth narrative.", cues: ["Starting skills", "Challenges", "Learnings", "Feedback impact", "Next goals"] },
        { title: "IV. Design & navigation", topic: "Choose template, colors, fonts, and sections.", cues: ["Clean template", "Sections", "Mobile check"] },
        { title: "V. Interactive elements", topic: "Add working links, embeds, or before/after notes.", cues: ["PDFs / video", "Function check", "Accessibility"] },
        { title: "VI. Final review", topic: "Proof, test links, and confirm the site is viewable.", cues: ["Proofread", "Links", "Public access"] }
      ],
      sourceAim: "Log course documents and any outside models you cite in the progress report.",
      sourcePacketLabel: "Course documents / job packet",
      peerItems: [
        { id: "claim", title: "Brand clarity", prompt: "Can a visitor state the writer’s focus after a quick look?", placeholder: "Brand is… / Unclear because…" },
        { id: "curate", title: "Curation", prompt: "Do selected pieces show skill and growth (not every file)?", placeholder: "Best pieces… / Dumping at…" },
        { id: "progress", title: "Progress report", prompt: "Does the report use concrete evidence of change?", placeholder: "Strongest evidence… / Vague at…" },
        { id: "design", title: "Usability", prompt: "Is navigation clear on desktop and phone?", placeholder: "Navigation works… / Stuck at…" },
        { id: "mla", title: "Attribution", prompt: "If models or readings are cited, are they credited?", placeholder: "Credits look… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the portfolio voice?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Draft one growth claim the progress report will prove with curated work.",
      outlineCue: "Align site sections with bio, work, progress report, job packet, and contact.",
      mlaCue: "Credit any outside models; the progress report can use APA or your brand formatting consistently."
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
      { title: "VI. Conclusion", topic: "Restate the thesis in fresh words and name the so-what.", cues: ["Fresh restatement", "So-what", "No new project claim"] }
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
        <span class="essay-picker-label">Which project are you practicing?</span>
        <select id="dwsEssaySelect" autocomplete="off">
          <option value="">Generic (any project)</option>
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
        : "Practice tool · any project";
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
