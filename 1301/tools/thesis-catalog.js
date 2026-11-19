/* ENGL 1301 thesis generator catalog (thesis-helper.html only).
   Templates, why labels, field copy, and chip labels from Poe's rewrite (Nov 19, 2026).
   Student-facing copy on this page says "study" for the Case Study. Other pages keep their own copy. */
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

  /* Case Study lens fields (lensFraming to lensLimits) are optional and not yet approved.
     To remove them: delete the #csLensFields block in thesis-helper.html. The generator then
     uses the general five lens version only. */
  var CASE_STUDY = {
    copy: {
      subjectLabel: "Study name",
      subjectHint: "Just the name, for example: BarkBox.",
      presentsLabel: "What the study presents",
      presentsHint: "Finish this: The study presents ... For example: BarkBox as a customer-loyalty success built on surprise and personalization.",
      presentsPlaceholder: "BarkBox as a customer-loyalty success...",
      tensionLabel: "Your answer",
      tensionHint: "Answer your critical question. Finish this: The [study name] study ... For example: only partly supports its loyalty story.",
      tensionPlaceholder: "only partly supports its loyalty story",
      questionLabel: "Your critical question",
      questionHint: "Start with your own critical analysis question. Example questions are in your Case Brief file.",
      questionPlaceholder: "How well does the study support its idea that ...?"
    },
    stems: {
      caseName: [],
      argues: ["The packet presents", "The study presents", "The case study presents", "This study presents", "It presents", "The packet argues that", "The study argues that", "The study shows"],
      tension: ["The study", "The packet", "This study", "It"]
    },
    verbList: ["shows", "supports", "proves", "makes", "treats", "overlooks", "underplays", "ignores", "leaves", "gives", "offers", "relies", "depends", "only", "mostly", "partly", "largely", "fully", "does", "fails", "succeeds", "holds"],
    caseStudy: {
      five: { label: "Five lenses", text: "The ${caseName} study ${tension} because its framing ${lensFraming}, its stakeholders ${lensStakeholders}, its evidence ${lensEvidence}, its assumptions ${lensAssumptions}, and its limits ${lensLimits}.", why: "One sentence. States your answer, then previews all five lenses in order with your own points." },
      presents: { label: "What the study presents", text: "Although the ${caseName} study presents ${argues}, it ${tension} because its framing ${lensFraming}, its stakeholders ${lensStakeholders}, its evidence ${lensEvidence}, its assumptions ${lensAssumptions}, and its limits ${lensLimits}.", why: "One sentence. Names what the study presents, gives your answer, then previews all five lenses in order. This one is long." },
      /* With every lens field empty, ${generalLenses} is: its framing of the case, the stakeholders it centers,
         the evidence it offers, the assumptions it makes, and the limits of what it can show. */
      general: { label: "Five lenses, general", text: "The ${caseName} study ${tension}, as seen in ${generalLenses}.", why: "One sentence. States your answer and names all five lenses in order. The lens parts are general. Replace each one with your own point." },
      question: { label: "Question", text: "${question} The ${caseName} study ${tension} because its framing ${lensFraming}, its stakeholders ${lensStakeholders}, its evidence ${lensEvidence}, its assumptions ${lensAssumptions}, and its limits ${lensLimits}.", why: "Your question, then your thesis. This is how your introduction ends." },
      questionGeneral: { text: "${question} The ${caseName} study ${tension}, as seen in ${generalLenses}." }
    },
    templates: {}
  };

  global.DWSThesisCatalog = {
    course: "1301",
    patternBox: "Thesis pattern: The [study name] study [your answer] because its framing [your point], its stakeholders [your point], its evidence [your point], its assumptions [your point], and its limits [your point]. Your thesis answers your question and previews all five lenses, in this order. Example questions are in your Case Brief file.",
    questionTemplate: { text: "${question} A close look at ${caseName} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    questionLiterary: { text: "${question} A close reading of ${caseTitle} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    modes: {
      "": GENERIC,
      "narrative-quest": {
        copy: {
          subjectLabel: "Story focus",
          subjectHint: "A short name for the experience, for example: my first night shift at a hospital.",
          presentsLabel: "What happened",
          presentsHint: "One or two sentences about the key moment.",
          presentsPlaceholder: "I expected ..., but ...",
          tensionLabel: "What you learned or what changed",
          tensionHint: "One sentence about what shifted for you.",
          tensionPlaceholder: "Courage looked like...",
          chips: { scene: "Scene and detail", change: "Change", insight: "Insight", audience: "Audience" }
        },
        stems: { argues: [], tension: ["I learned that", "I realized that", "I learned", "I realized", "The insight is that", "The insight is"] },
        question: "standard",
        templates: {
          scene: { text: "The story of ${caseName} centers on this: ${argues}. It shows what I learned: ${tension}.", why: "Two sentences. Names the key moment, then what you learned." },
          change: { text: "At the start of ${caseName}, this is where I began: ${argues}. By the end, this is what I understood: ${tension}.", why: "Two sentences. Shows where you started and what you understood by the end." },
          insight: { text: "Looking back on ${caseName}, I see one insight: ${tension}.", why: "One sentence. States your insight." },
          audience: { text: "A reader can learn one thing from ${caseName}: ${tension}.", why: "One sentence. States what a reader can take from your story." }
        }
      },
      "classical-argument": {
        copy: {
          subjectLabel: "Issue",
          subjectHint: "Name the issue, for example: school phone bans.",
          presentsLabel: "The opposing view",
          presentsHint: "One sentence about what others often argue.",
          presentsPlaceholder: "Many people argue that...",
          tensionLabel: "Your thesis and reason",
          tensionHint: "One sentence. Your position, then 'because' and your main reason.",
          tensionPlaceholder: "Schools should ... because ...",
          chips: { claim: "Thesis", reasons: "Reasons", evidence: "Evidence", counter: "Counterargument", stakes: "Stakes" }
        },
        stems: {
          argues: ["Many people argue that", "Many people argue", "People argue that", "Many argue that", "Some people say that", "Many people think that"],
          tension: ["I argue that", "I argue", "I believe that", "I think that"]
        },
        split: "because",
        question: "standard",
        templates: {
          claim: { text: "Many people hold one view of ${caseName}: ${argues}. A stronger position is this: ${tension}.", why: "Two sentences. States the opposing view, then your position." },
          reasons: { text: "On ${caseName}, the stronger position is this: ${stance}, because ${reason}.", why: "One sentence. States your position and your main reason.", needs: ["stance", "reason"], skipNote: "Add 'because' and your main reason to get a reasons option." },
          evidence: { text: "Once the evidence on ${caseName} is clear, the stronger position is this: ${tension}.", why: "One sentence. Ties your position to evidence. Use it only if your sources support it." },
          counter: { text: "Some readers will raise a fair point about ${caseName}: ${argues}. Even so, the stronger position is this: ${tension}.", why: "Two sentences. Grants the other side's point, then states your position." },
          stakes: { text: "For the people most affected by ${caseName}, the stronger position is this: ${tension}.", why: "One sentence. Names the people affected, then states your position." }
        }
      },
      "monster-comparison": {
        copy: {
          subjectLabel: "Pair of monsters",
          subjectHint: "Name both figures, for example: Godzilla and King Kong.",
          presentsLabel: "What the two share",
          presentsHint: "One sentence about why these two belong in one comparison.",
          presentsPlaceholder: "Both are...",
          tensionLabel: "Key difference",
          tensionHint: "One sentence about the most important difference and what it shows.",
          tensionPlaceholder: "Kong is shown as ..., while Godzilla ...",
          chips: { criteria: "Criteria", similarity: "Similarity", difference: "Difference", insight: "Insight" }
        },
        stems: { argues: [], tension: ["They differ most in", "They differ most because", "The key difference is that", "The key difference is"] },
        comparison: true,
        question: "standard",
        templates: {
          criteria: {
            why: "One sentence. Says you compare both figures on the same points, then states the main difference.",
            variants: [
              { if: "criteriaShort", text: "Compared on ${criteriaList}, ${caseName} show one clear difference: ${tension}." },
              { text: "Compared on the same three points, ${caseName} show one clear difference: ${tension}." }
            ]
          },
          similarity: { text: "${caseName} have something in common: ${argues}. But they differ in one important way: ${tension}.", why: "Two sentences. States what the two share, then the main difference." },
          difference: { text: "Read side by side, ${caseName} differ most in one way: ${tension}.", why: "One sentence. States the main difference." },
          insight: { text: "Comparing ${caseName} leads to one insight: ${tension}.", why: "One sentence. States what the comparison shows." }
        }
      },
      "facing-unknown": {
        copy: {
          subjectLabel: "Topic to explain",
          subjectHint: "For example: how deep-sea pressure affects the human body.",
          presentsLabel: "What readers often get wrong",
          presentsHint: "One sentence about the common misunderstanding only. Save the correct answer for the next field.",
          presentsPlaceholder: "Readers often think...",
          tensionLabel: "What you will explain",
          tensionHint: "One sentence about how or why it works.",
          tensionPlaceholder: "Pressure changes...",
          chips: { define: "Define", process: "Process", cause: "Cause and effect", clarify: "Clarify myth" }
        },
        stems: {
          argues: ["Readers often think that", "Readers often think", "People often think that", "People often think", "Many readers believe that", "Many readers believe"],
          tension: ["This essay explains", "This essay will explain", "This paper explains", "I will explain", "The essay explains"]
        },
        question: "standard",
        templates: {
          define: { text: "To understand ${caseName}, readers need one thing explained: ${tension}.", why: "One sentence. Names your topic and the main thing you will explain." },
          process: { text: "${caseName} makes sense once the steps are clear: ${tension}.", why: "One sentence. Treats your topic as a set of steps and names them." },
          cause: { text: "Cause and effect explain ${caseName}: ${tension}.", why: "One sentence. Treats your topic as cause and effect." },
          clarify: { text: "Many readers believe one thing about ${caseName}: ${argues}. A careful explanation shows more: ${tension}.", why: "Two sentences. Names a common misunderstanding, then what you will explain instead." }
        }
      },
      "field-guide": {
        copy: {
          subjectLabel: "Place, practice, or system",
          subjectHint: "For example: a neighborhood mercado.",
          presentsLabel: "Audience",
          presentsHint: "Who the guide is for and what they need. For example: new students who shop on a budget.",
          presentsPlaceholder: "new students who...",
          tensionLabel: "How or why focus",
          tensionHint: "Answer your how or why question in one sentence.",
          tensionPlaceholder: "The mercado works as...",
          chips: { place: "Place", audience: "Audience", how: "How it works", why: "Why it matters" }
        },
        stems: { argues: ["For"], tension: ["This guide explains", "This essay explains"] },
        tensionQuestionOK: true,
        tensionQuestionNote: "Try answering your question in one sentence for stronger options.",
        question: "standard",
        templates: {
          place: { variants: [
            { if: "tensionIsQuestion", text: "A guide to ${caseName} should answer one question: ${tension}", why: "One sentence. Names your question. Your thesis is stronger once you answer it." },
            { text: "A guide to ${caseName} should make one thing clear: ${tension}.", why: "One sentence. Names the place and the main thing your guide explains." }
          ] },
          audience: { variants: [
            { if: "tensionIsQuestion", text: "For ${argues}, a guide to ${caseName} should answer one question: ${tension}", why: "One sentence. Names your question. Your thesis is stronger once you answer it." },
            { text: "For ${argues}, ${caseName} makes the most sense once one thing is clear: ${tension}.", why: "One sentence. Names your audience and what they need to know." }
          ] },
          how: { skipIf: "tensionIsQuestion", text: "A newcomer to ${caseName} needs to know how it works: ${tension}.", why: "One sentence. States how the place or practice works." },
          why: { skipIf: "tensionIsQuestion", text: "${caseName} matters to the people who use it for one reason: ${tension}.", why: "One sentence. States why it matters to the people who use it." }
        }
      },
      "case-study": CASE_STUDY,
      "final-reflection": {
        copy: {
          subjectLabel: "Focus of the reflection",
          subjectHint: "One skill or habit, for example: my thesis statements.",
          presentsLabel: "Where you started",
          presentsHint: "One sentence about an early habit or draft.",
          presentsPlaceholder: "At first I...",
          tensionLabel: "What changed and what still needs work",
          tensionHint: "One sentence. What you do now, then 'but I still need to' and one goal.",
          tensionPlaceholder: "Now I ..., but I still need to ...",
          chips: { growth: "Growth", evidence: "Draft evidence", process: "Process", goals: "Goals" }
        },
        stems: { argues: ["At first", "In the beginning", "Early in the term", "At the start"], tension: ["Now,", /^now\s+(?=I\b)/i] },
        split: "growth",
        question: "standard",
        templates: {
          growth: { text: "My work on ${caseName} started with one habit: ${argues}. By the end of the course, it had changed: ${tension}.", why: "Two sentences. States where you started and how you changed." },
          evidence: { text: "Early drafts of ${caseName} show one habit: ${argues}. Later drafts show a new one: ${tension}.", why: "Two sentences. Points to early and later drafts. Name the drafts in your essay." },
          process: { text: "My process for ${caseName} moved away from one habit: ${argues}. It moved toward another: ${tension}.", why: "Two sentences. Names the habit you left and the one you use now." },
          goals: { why: "Two sentences. States your clearest change and one goal.", variants: [
            { if: "hasGrowth", text: "The clearest change in ${caseName} is this: ${growth}. I still need to ${goal}." },
            { text: "The clearest change in ${caseName} is this: ${tension}." }
          ] }
        }
      }
    }
  };
})(window);
