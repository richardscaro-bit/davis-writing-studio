/* ENGL 2328 thesis generator catalog (thesis-helper.html only). Course is paused on live.
   Templates, why labels, and field labels from Poe's rewrite (Nov 19, 2026). */
(function (global) {
  "use strict";

  var GENERIC = {
    copy: {
      subjectLabel: "Subject or focus",
      subjectHint: "A short name for your topic, for example: school phone bans.",
      presentsLabel: "What sources or people usually say",
      presentsHint: "One sentence in your words about the usual view.",
      presentsPlaceholder: "Most people see it as...",
      tensionLabel: "Your main point",
      tensionHint: "One sentence. What you will argue, explain, or show.",
      tensionPlaceholder: "A closer look shows...",
      chips: { framing: "Framing", evidence: "Evidence", stakeholders: "Audience or stakes", limits: "Limits or insight" }
    },
    stems: {
      argues: ["Readers or sources present", "Sources present", "Readers present", "Most people see it as", "Many people say that"],
      tension: ["The key tension or insight is", "A closer look shows", "My point is"]
    },
    question: "standard",
    templates: {
      framing: { text: "On the surface, a reading of ${caseName} shows this: ${argues}. A careful reading shows more: ${tension}.", why: "Two sentences. States the usual reading, then your point." },
      evidence: { text: "The evidence in ${caseName} points to this reading: ${tension}.", why: "One sentence. States your point and ties it to evidence. Use it only if your sources support that point." },
      stakeholders: { text: "For readers of ${caseName}, one point matters most: ${tension}.", why: "One sentence. Names the people affected, then states your point." },
      limits: { text: "The usual reading of ${caseName} is this: ${argues}. It leaves out one thing: ${tension}.", why: "Two sentences. States the usual reading, then what it leaves out." }
    }
  };

  var STAGES_1_3 = {
    copy: {
      subjectLabel: "Primary texts",
      presentsLabel: "What the texts seem to show",
      tensionLabel: "Your interpretive thesis"
    },
    stems: { argues: [], tension: ["A careful reading shows that", "A careful reading shows"] },
    question: "literary",
    templates: {
      theme: { text: "On the surface, a reading of ${caseTitle} shows this: ${argues}. A careful reading shows more: ${tension}.", why: "Two sentences. States the surface reading, then your interpretation." },
      technique: { text: "A close look at technique in ${caseTitle} shows this: ${tension}.", why: "One sentence. Ties your interpretation to technique." },
      context: { text: "In historical and cultural context, a reading of ${caseTitle} shows this: ${tension}.", why: "One sentence. Ties your interpretation to context." },
      theory: { text: "Through a critical lens, a reading of ${caseTitle} shows this: ${tension}.", why: "One sentence. States your interpretation through a critical lens. Name the lens in your essay." }
    }
  };

  var STAGES_4_6 = {
    copy: {
      subjectLabel: "Authors and theme",
      presentsLabel: "Shared theme",
      tensionLabel: "Key difference"
    },
    stems: { argues: [], tension: ["They diverge most in", "They differ most in"] },
    pair: true,
    comparison: true,
    question: "literary",
    templates: {
      theme: { why: "Two sentences. States the shared theme, then the key difference.", variants: [
        { if: "hasTheme", text: "${pairLabel} both write about ${theme}: ${argues}. They differ in one important way: ${tension}." },
        { text: "${pairLabel} share a theme: ${argues}. They differ in one important way: ${tension}." }
      ] },
      technique: { text: "Compared by technique, ${pairLabel} show one key difference: ${tension}.", why: "One sentence. States the key difference." },
      context: { text: "Compared in historical and cultural context, ${pairLabel} show one key difference: ${tension}.", why: "One sentence. States the key difference." },
      comparison: { text: "Read side by side, ${pairLabel} show one key difference: ${tension}.", why: "One sentence. States the key difference." }
    }
  };

  var STAGE7 = {
    copy: {
      subjectLabel: "Project focus and form",
      presentsLabel: "Course texts your project answers",
      tensionLabel: "Central effect",
      tensionPlaceholder: "The project aims to ... by ..."
    },
    stems: { argues: [], tension: [] },
    question: "standard",
    templates: {
      focus: { text: "My project is ${caseName}. Its central effect is this: ${tension}.", why: "Two sentences. Names your project and its central effect." },
      craft: { text: "In ${caseName}, one craft choice does the main work: ${tension}.", why: "One sentence. Names the craft choice behind the effect." },
      influence: { text: "My project answers course texts in a specific way: ${argues}.", why: "One sentence. Names the course texts your project answers." },
      revision: { text: "Revision on ${caseName} focused on one effect: ${tension}.", why: "One sentence. Ties your revision to the effect." }
    }
  };

  global.DWSThesisCatalog = {
    course: "2328",
    questionTemplate: { text: "${question} A close look at ${caseName} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    questionLiterary: { text: "${question} A close reading of ${caseTitle} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    modes: {
      "": GENERIC,
      "stage-1-literature-inquiry-proposal": STAGES_1_3,
      "stage-2-evidence-lens-note": STAGES_1_3,
      "stage-3-close-reading": STAGES_1_3,
      "stage-4-source-conversation-map": STAGES_4_6,
      "stage-5-thematic-comparison-draft": STAGES_4_6,
      "stage-6-revision-memo-showcase-plan": STAGES_4_6,
      "stage-7-final-packet": STAGE7
    }
  };
})(window);
