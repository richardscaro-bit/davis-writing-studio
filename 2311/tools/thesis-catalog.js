/* ENGL 2311 thesis generator catalog (thesis-helper.html only). Course is paused on live.
   Templates, why labels, and field labels from Poe's rewrite (Nov 19, 2026). Chip labels stay as they are. */
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
      framing: { text: "Many people see ${caseName} one way: ${argues}. A closer look shows something more: ${tension}.", why: "Two sentences. States the usual view, then your point." },
      evidence: { text: "The evidence on ${caseName} points to this: ${tension}.", why: "One sentence. States your point and ties it to evidence. Use it only if your sources support that point." },
      stakeholders: { text: "For the people most affected by ${caseName}, one point matters most: ${tension}.", why: "One sentence. Names the people affected, then states your point." },
      limits: { text: "The usual view of ${caseName} is this: ${argues}. It leaves out one thing: ${tension}.", why: "Two sentences. States the usual view, then what it leaves out." }
    }
  };

  var STAGE1 = {
    copy: {
      subjectLabel: "Audience and document",
      presentsLabel: "What this audience needs",
      tensionLabel: "Attitudes, limits, or design needs",
      tensionPlaceholder: "They prefer diagrams because ..."
    },
    stems: { argues: [], tension: [] },
    question: "standard",
    chipMap: { demographics: "purpose", expertise: "purpose", attitudes: "design" },
    templates: {
      purpose: { text: "For ${caseName}, the document has one main job: ${argues}.", why: "One sentence. Names the audience and the document's main job." },
      design: { text: "For ${caseName}, the design has to fit the readers: ${tension}.", why: "One sentence. Names what the design must do for these readers." }
    }
  };

  var STAGES_2_3 = {
    copy: {
      subjectLabel: "Problem or need",
      presentsLabel: "Current situation",
      tensionLabel: "Proposed program"
    },
    stems: { argues: [], tension: ["I propose"] },
    question: "standard",
    chipMap: { stakeholders: "problem", budget: "program", eval: "program" },
    templates: {
      problem: { text: "The current situation with ${caseName} is this: ${argues}.", why: "One sentence. States the current situation." },
      program: { text: "To address ${caseName}, this proposal recommends the following: ${tension}.", why: "One sentence. Names the program you propose." }
    }
  };

  var STAGES_4_7 = {
    copy: {
      subjectLabel: "Problem or opportunity",
      presentsLabel: "Options",
      tensionLabel: "Criteria and recommendation",
      tensionPlaceholder: "Using cost, ease of use, and risk, I recommend ... because ..."
    },
    stems: { argues: [], tension: [] },
    question: "standard",
    templates: {
      options: { text: "This report compares the options for ${caseName}: ${argues}.", why: "One sentence. Lists the options you compare." },
      criteria: { text: "Judged by clear criteria, one option for ${caseName} comes out ahead: ${tension}.", why: "One sentence. States which option meets your criteria best." },
      recommend: { text: "After comparing the options for ${caseName}, the recommendation is this: ${tension}.", why: "One sentence. States your recommendation and its reasons." },
      results: { text: "The test results for ${caseName} point to one choice: ${tension}.", why: "One sentence. Ties your recommendation to test results." }
    }
  };

  global.DWSThesisCatalog = {
    course: "2311",
    questionTemplate: { text: "${question} A close look at ${caseName} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    questionLiterary: { text: "${question} A close reading of ${caseTitle} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    modes: {
      "": GENERIC,
      "stage-1-problem-memo": STAGE1,
      "stage-2-research-proposal": STAGES_2_3,
      "stage-3-annotated-sources": STAGES_2_3,
      "stage-4-options-criteria-memo": STAGES_4_7,
      "stage-5-recommendation-report-draft": STAGES_4_7,
      "stage-6-usability-test": STAGES_4_7,
      "stage-7-final-packet": STAGES_4_7
    }
  };
})(window);
