/* Shared essay context for ENGL 2328 practice tools.
   Student picks which essay; tools adapt labels/templates. No default essay. */
(function (global) {
  const STORAGE_KEY = "dws2328-essay";

  const ESSAYS = [
    {
      id: "major-essay-1",
      studioHref: "../major-essay-1-studio.html",
      studioLabel: "Essay 1 studio",
      label: "Essay 1",
      purpose:
        "Write a 1,500 to 2,000 word essay on reality versus illusion in one or two early-arc stories. Engage themes, narrative techniques, and character with a clear thesis; apply relevant theory; situate the text historically or culturally; revise with peer feedback.",
      subjectLabel: "Primary text(s) / focus",
      subjectHint: "Required. Name the work(s) you will analyze.",
      subjectPlaceholder: "e.g. Chesnutt’s conjure tales and Hurston’s “Spunk”",
      topicLabel: "Optional theme tag",
      topicOptions: [
        "Reality vs illusion",
        "Folklore / supernatural",
        "Unreliable narration",
        "Identity",
        "Race / culture",
        "Horror tradition",
        "Other / custom"
      ],
      presentsLabel: "What the text(s) seem to show",
      presentsHint: "Required. A careful reader’s first account of theme or technique.",
      presentsPlaceholder: "The text presents… through…",
      tensionLabel: "Interpretive tension / working thesis",
      tensionHint: "Required. What your analysis will argue or reveal.",
      tensionPlaceholder: "A careful reading shows that… because…",
      questionLabel: "Optional critical question",
      questionPlaceholder: "How does folklore shape identity in…?",
      angles: [
        { id: "theme", label: "Theme" },
        { id: "technique", label: "Technique" },
        { id: "context", label: "Context" },
        { id: "theory", label: "Theory" }
      ],
      defaultAngles: ["theme", "technique", "context"],
      claimKind: "argument",
      ideaSeeds: {
        topics: [
          "Folklore and the supernatural in African American literary traditions",
          "Unreliable narration in early American horror",
          "Reality vs illusion in Bierce and Poe",
          "Time and memory in Fitzgerald or Faulkner",
          "Community and outsiders in Chesnutt or Freeman",
          "A focused reading of one assigned short work"
        ],
        questions: [
          "How does {topic} shape a reader’s judgment of character?",
          "Which narrative technique most changes the meaning of the theme?",
          "What historical or cultural context should a careful reader keep in view?",
          "Where does a familiar reading of the text fall short?",
          "What theory lens clarifies without flattening the work?"
        ],
        ideas: [
          "The text uses the supernatural to negotiate a real social tension",
          "Unreliability is not only a trick; it frames who holds interpretive power",
          "Context changes what a “monster” or outsider figure means",
          "A theme becomes sharp when tied to a specific technique, not a plot summary",
          "Peer feedback should push thesis clarity and evidence, not only polish"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction & thesis", topic: "Open with the text(s) and one interpretive claim.", cues: ["Text + context hook", "Working thesis", "Map of sections"] },
        { title: "II. Textual evidence 1", topic: "Develop the first body claim with close reading.", cues: ["Quote / paraphrase", "Technique", "Link to thesis"] },
        { title: "III. Textual evidence 2", topic: "Deepen analysis with a second focused claim.", cues: ["Distinct claim", "Evidence", "Avoid plot dump"] },
        { title: "IV. Context or theory", topic: "Situate the reading historically, culturally, or theoretically.", cues: ["Relevant context", "How it changes meaning", "Still tied to thesis"] },
        { title: "V. Complication", topic: "Address a counter-reading or limit of your claim.", cues: ["Fair alternative", "Reply", "Protect thesis"] },
        { title: "VI. Conclusion", topic: "Restate the insight and name its stakes for readers of American literature.", cues: ["Fresh restatement", "So-what", "No new plot"] }
      ],
      sourceAim: "Log primary texts plus any criticism or theory you cite. MLA throughout.",
      sourcePacketLabel: "Course reading / criticism",
      peerItems: [
        { id: "claim", title: "Thesis clarity", prompt: "Is the thesis interpretive and specific (not only a theme label)?", placeholder: "Thesis is clear about… / Still summary because…" },
        { id: "evidence", title: "Close reading", prompt: "Do body sections use concrete textual evidence?", placeholder: "Strongest evidence… / Needs a passage at…" },
        { id: "context", title: "Context / theory", prompt: "Is context or theory used to illuminate (not decorate)?", placeholder: "Helps when… / Dropped in at…" },
        { id: "org", title: "Organization", prompt: "Do topic sentences guide the analysis?", placeholder: "Clearest section… / Drifts at…" },
        { id: "mla", title: "MLA", prompt: "Do in-text citations match Works Cited?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the interpretation?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Draft one interpretive thesis tied to theme, technique, and context.",
      outlineCue: "Order close reading before (or beside) context; keep thesis visible.",
      mlaCue: "Cite primary texts and any criticism in MLA."
    },
    {
      id: "major-essay-2",
      studioHref: "../major-essay-2-studio.html",
      studioLabel: "Essay 2 studio",
      label: "Essay 2",
      purpose:
        "Write a 1,500 to 2,000 word MLA thematic comparison on 20th-century American literature (at least three scholarly sources). Choose a theme (identity, alienation, the American Dream, or confrontation with norms) across works by two authors from the course list (Jackson, Matheson, Bradbury, Plath, O’Connor, or Capote).",
      subjectLabel: "Author pair + theme",
      subjectHint: "Required. Name both authors/works and the shared theme.",
      subjectPlaceholder: "e.g. Jackson and Bradbury on alienation",
      topicLabel: "Theme (optional selector)",
      topicOptions: [
        "Identity",
        "Alienation",
        "American Dream",
        "Confrontation with norms",
        "Horror / anxiety",
        "Gender / power",
        "Other / custom"
      ],
      presentsLabel: "Shared thematic ground",
      presentsHint: "Required. Why these two belong in one comparison.",
      presentsPlaceholder: "Both texts treat… as…",
      tensionLabel: "Key difference / insight",
      tensionHint: "Required. What the contrast reveals.",
      tensionPlaceholder: "They diverge most in… which shows…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "How does each author turn postwar anxiety into narrative form?",
      angles: [
        { id: "theme", label: "Theme" },
        { id: "technique", label: "Technique" },
        { id: "context", label: "Context" },
        { id: "comparison", label: "Comparison" }
      ],
      defaultAngles: ["theme", "comparison", "context"],
      claimKind: "comparison",
      comparisonCriteria: [
        "how each text develops the shared theme",
        "which narrative techniques shape the reader’s judgment",
        "how historical or cultural context changes the theme’s meaning"
      ],
      comparisonCriteriaBank: [
        "how each text develops the shared theme",
        "which narrative techniques shape the reader’s judgment",
        "how historical or cultural context changes the theme’s meaning",
        "how setting works as pressure on characters",
        "how each text defines outsiders or monsters",
        "how gender or race intersects with the theme",
        "what ending each text asks readers to accept"
      ],
      ideaSeeds: {
        topics: [
          "Jackson and Bradbury on domestic or suburban dread",
          "Matheson and Capote on isolation",
          "Plath and O’Connor on violence and morality",
          "Bradbury and Matheson on technology and fear",
          "Jackson and Capote on the uncanny stranger",
          "O’Connor and Plath on judgment and grace or its absence"
        ],
        questions: [
          "What clear difference between these two approaches to {topic} matters most?",
          "Which shared criterion shows the sharpest contrast?",
          "How do postwar contexts shape each author’s version of the theme?",
          "Where does a simple “both authors show fear” thesis fall short?",
          "What contemporary resonance does the comparison earn?"
        ],
        ideas: [
          "Both texts stage alienation, but one locates the threat inside the home and the other in the crowd or the system",
          "Technique (not plot summary) is where the theme becomes visible",
          "Context explains why the same theme feels different after World War II",
          "A comparative insight should go past listing similarities",
          "Contemporary relevance grows from the analysis, not a bolted-on moral"
        ]
      },
      outlineLenses: [
        { title: "I. Introduction", topic: "Name both texts, the shared theme, and one comparative insight.", cues: ["Pair + theme", "Insight thesis", "Preview criteria"] },
        { title: "II. Criterion 1", topic: "Apply criterion 1 to both texts in parallel.", cues: ["Same criterion", "Evidence for each", "Link to insight"] },
        { title: "III. Criterion 2", topic: "Apply criterion 2 to both texts in parallel.", cues: ["Technique focus", "Evidence", "Deepen contrast"] },
        { title: "IV. Criterion 3 / context", topic: "Use context or a third criterion to refine the comparison.", cues: ["Historical or cultural note", "Keep parallel", "Return to thesis"] },
        { title: "V. Synthesis", topic: "State what the comparison shows about American literature and culture.", cues: ["Broader significance", "Not only summary", "Contemporary resonance if earned"] },
        { title: "VI. Conclusion", topic: "Close on the insight without new works.", cues: ["Fresh restatement", "So-what", "No new authors"] }
      ],
      sourceAim: "Log both primary texts plus any criticism. MLA throughout.",
      sourcePacketLabel: "Course reading / criticism",
      peerItems: [
        { id: "claim", title: "Comparative insight", prompt: "Does the thesis go past “both authors write about X”?", placeholder: "Insight is… / Still a list because…" },
        { id: "criteria", title: "Shared criteria", prompt: "Are the same criteria applied to both texts?", placeholder: "Parallel works… / Criteria shift at…" },
        { id: "evidence", title: "Evidence", prompt: "Is each claim backed with concrete textual detail?", placeholder: "Strongest evidence… / Needs detail for…" },
        { id: "org", title: "Organization", prompt: "Is structure point-by-point or clear block comparison?", placeholder: "Organization helps… / Confusing at…" },
        { id: "mla", title: "MLA", prompt: "Are citations complete and matched?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the comparison?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "Name both authors/works, the shared theme, and one insight beyond a trait list.",
      outlineCue: "Keep criteria parallel across both texts.",
      mlaCue: "Cite both primary texts and any criticism in MLA."
    },
    {
      id: "final-project",
      studioHref: "../final-project-studio.html",
      studioLabel: "Final Project studio",
      label: "Final Project",
      purpose:
        "Complete the semester’s major project as a refined final draft (creative horror writing or multimedia, per the project prompt). Integrate proposal work, peer feedback, and course insights into a polished piece with a clear focus and careful documentation where sources appear.",
      subjectLabel: "Project focus / form",
      subjectHint: "Required. Name the form (creative, multimedia, or analysis track) and central focus.",
      subjectPlaceholder: "e.g. a short horror narrative exploring unreliable memory",
      topicLabel: "Optional tradition tag",
      topicOptions: [
        "Gothic / Southern Gothic",
        "Cosmic / weird",
        "Psychological horror",
        "Race / gender in horror",
        "Multimedia adaptation",
        "Other / custom"
      ],
      presentsLabel: "Influences / course texts in conversation",
      presentsHint: "Required. Which course readings or techniques the project answers.",
      presentsPlaceholder: "This project answers… by borrowing / revising…",
      tensionLabel: "Central effect or claim",
      tensionHint: "Required. What the finished project should make a reader feel or understand.",
      tensionPlaceholder: "The project aims to… by…",
      questionLabel: "Optional focusing question",
      questionPlaceholder: "What revision from peer workshop most changes the effect?",
      angles: [
        { id: "focus", label: "Focus" },
        { id: "craft", label: "Craft" },
        { id: "influence", label: "Influence" },
        { id: "revision", label: "Revision" }
      ],
      defaultAngles: ["focus", "craft", "revision"],
      claimKind: "reflection",
      ideaSeeds: {
        topics: [
          "A short horror story in conversation with Jackson",
          "A multimedia adaptation of a course tale",
          "A creative piece on postwar suburban dread",
          "A project on gender and horror after Plath or Machado-adjacent themes",
          "A psychological profile-style multimedia case",
          "A refined analytical project if that is your approved track"
        ],
        questions: [
          "What course technique are you deliberately practicing in {topic}?",
          "Where does influence end and your own craft begin?",
          "What feedback from workshop should change the next draft?",
          "How will a reader know the project’s central effect?",
          "What sources need MLA credit if you quote or adapt?"
        ],
        ideas: [
          "The final draft should show revision, not only a longer first draft",
          "Course influences work best when named as craft choices, not pasted epigraphs",
          "A clear central effect guides cutting and expansion",
          "Multimedia needs the same focus discipline as prose",
          "Documentation still matters when you quote, adapt, or research"
        ]
      },
      outlineLenses: [
        { title: "I. Project statement", topic: "State form, focus, and intended effect.", cues: ["Form", "Focus", "Effect"] },
        { title: "II. Influence map", topic: "Name course texts/techniques you are answering.", cues: ["Specific influences", "What you borrow", "What you change"] },
        { title: "III. Structure / beats", topic: "Outline scenes, sections, or multimedia beats.", cues: ["Order", "Turning point", "Ending aim"] },
        { title: "IV. Craft plan", topic: "Plan voice, point of view, pacing, or design choices.", cues: ["POV", "Imagery", "Pacing"] },
        { title: "V. Workshop revisions", topic: "List feedback you will act on.", cues: ["Thesis/focus notes", "Clarity", "Cut or expand"] },
        { title: "VI. Polish & documentation", topic: "Proof, format, and cite sources if used.", cues: ["Proof", "MLA if needed", "Submission readiness"] }
      ],
      sourceAim: "Log course texts and any outside sources you adapt or cite.",
      sourcePacketLabel: "Proposal / workshop notes",
      peerItems: [
        { id: "claim", title: "Focus / effect", prompt: "Is the project’s central effect clear?", placeholder: "Effect is… / Scattered because…" },
        { id: "craft", title: "Craft", prompt: "Do craft choices serve the focus (not only decorate)?", placeholder: "Strongest craft move… / Needs work at…" },
        { id: "influence", title: "Course conversation", prompt: "Does the project show thoughtful contact with course readings?", placeholder: "Influence works… / Thin or pasted…" },
        { id: "revision", title: "Revision evidence", prompt: "Does this draft show response to feedback?", placeholder: "Changed… / Still first-draft at…" },
        { id: "mla", title: "MLA (if used)", prompt: "If sources appear, are citations present?", placeholder: "MLA looks… / Check…" },
        { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the creative or analytical work?", placeholder: "Ownership looks… / Ask about…" }
      ],
      thesisCue: "State the project’s form and the one effect or insight it aims for.",
      outlineCue: "Plan beats/sections, then revise from workshop notes.",
      mlaCue: "Cite course texts or outside sources you quote or closely adapt."
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
