/* ENGL 1302 thesis generator catalog (thesis-helper.html only).
   Templates, why labels, field copy, and chip labels from Poe's rewrite (Nov 19, 2026). */
(function (global) {
  "use strict";

  var COUNTER_HINT = "One sentence. Your position, then 'while a fair counter says' and the other side's best point.";

  global.DWSThesisCatalog = {
    course: "1302",
    questionTemplate: { text: "${question} A close look at ${caseName} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    questionLiterary: { text: "${question} A close reading of ${caseTitle} gives this answer: ${tension}.", why: "Two sentences. Your question, then your answer. You can use this pair at the end of your introduction." },
    modes: {
      "": {
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
      },
      "project1-rhetorical-remix": {
        copy: {
          subjectLabel: "Public text you will analyze",
          subjectHint: "Name the ad, PSA, editorial, campaign page, or similar. For example: a city recycling PSA poster.",
          presentsLabel: "What the original text tries to do",
          presentsHint: "One sentence about its purpose, audience, and main choices.",
          presentsPlaceholder: "The text aims to ... for ... by ...",
          tensionLabel: "Your judgment and your remix",
          tensionHint: "One sentence. Say how well the original works, then 'my remix' and what it changes.",
          tensionPlaceholder: "The original works ... because ..., and my remix changes it into ...",
          chips: { situation: "Situation", judgment: "Judgment", remix: "Remix", test: "Audience test" }
        },
        stems: { argues: [], tension: [] },
        split: "remix",
        question: "standard",
        templates: {
          situation: { text: "In ${caseName}, the rhetorical situation is this: ${argues}. A close look at its choices leads to one judgment: ${judgment}.", why: "Two sentences. Names the rhetorical situation, then your judgment of the original." },
          judgment: { text: "A close look at the choices in ${caseName} leads to one judgment: ${judgment}.", why: "One sentence. States your judgment of the original." },
          remix: { text: "A close look at ${caseName} leads to one judgment: ${judgment}. My remix ${remixRest}.", why: "Two sentences. States your judgment, then what your remix changes.", needs: ["remixRest"], skipNote: "Add 'my remix' and what it changes to get remix options." },
          test: { text: "For a new audience, my remix of ${caseName} ${remixRest}.", why: "One sentence. Names the new audience focus of your remix.", needs: ["remixRest"], skipNote: "Add 'my remix' and what it changes to get remix options." }
        }
      },
      "project2-source-conversation": {
        copy: {
          subjectLabel: "Research question",
          subjectHint: "One focused question the exhibit answers.",
          presentsLabel: "Where the sources agree",
          presentsHint: "One sentence about what most early sources say.",
          presentsPlaceholder: "Most sources treat ... as ...",
          tensionLabel: "Where the sources differ",
          tensionHint: "One sentence about where sources disagree or leave a gap.",
          tensionPlaceholder: "They differ on ..., which leaves ...",
          chips: { question: "Question", roles: "Source roles", boundaries: "Boundaries", exhibit: "Exhibit" }
        },
        stems: { argues: [], tension: [] },
        subjectIsQuestion: true,
        question: "none",
        templates: {
          question: { text: "${caseName} On this question, the research shows a pattern: ${argues}. It also shows where sources differ: ${tension}.", why: "Your research question, then two sentences on where sources agree and differ." },
          roles: { text: "Most sources on this question agree on one point: ${argues}. They differ on another: ${tension}.", why: "Two sentences. States where most sources agree, then where they differ." },
          boundaries: { text: "The research on this question reaches a boundary: ${tension}.", why: "One sentence. States where the research stops or splits." },
          exhibit: { text: "${caseName} The sources agree on this: ${argues}. They split on this: ${tension}.", why: "Your research question, then where the sources agree and split." }
        }
      },
      "project3-gothic-criticism": {
        copy: {
          subjectLabel: "Primary Gothic text",
          subjectHint: "For example: Shirley Jackson, “The Lottery.”",
          presentsLabel: "What a first reading notices",
          presentsHint: "One sentence about the plot or theme on the surface. Your thesis goes past this.",
          presentsPlaceholder: "A first reading notices ...",
          tensionLabel: "Your interpretive thesis",
          tensionHint: "One sentence. How or why a device or moment works, and what it shows. It can start with what Critic A and Critic B say.",
          tensionPlaceholder: "Although Critic A argues ... and Critic B ..., the text also ...",
          chips: { thesis: "Thesis", close: "Close reading", criticA: "Critic A", criticB: "Critic B" }
        },
        stems: {
          argues: ["Readers often notice", "A first reading notices", "A first reading shows", "Readers notice"],
          tension: ["A closer reading shows", "My thesis is that"]
        },
        question: "literary",
        criticismLine: true,
        templates: {
          thesis: { text: "A first reading of ${caseTitle} notices ${argues}. A closer reading shows more: ${tension}.", why: "Two sentences. States what a first reading notices, then your interpretation." },
          close: { text: "In ${caseTitle}, a close reading of key passages shows this: ${tension}.", why: "One sentence. Ties your interpretation to close reading." },
          criticA: { text: "Critics read ${caseTitle} in more than one way, and a close reading adds this: ${tension}.", why: "One sentence. Says critics differ, then states what your reading adds." },
          criticB: { text: "Read alongside two critics, ${caseTitle} shows something more: ${tension}.", why: "One sentence. Places your interpretation next to your two critics." }
        }
      },
      "project4-public-argument": {
        copy: {
          subjectLabel: "Public issue and audience",
          subjectHint: "Name the issue and who will read it. For example: heat safety for apartment renters in San Antonio.",
          presentsLabel: "What the public usually hears",
          presentsHint: "One sentence about the usual public message.",
          presentsPlaceholder: "Most public talk treats ... as ...",
          tensionLabel: "Your position and a fair counter",
          tensionHint: COUNTER_HINT,
          tensionPlaceholder: "Landlords should ..., while a fair counter says ...",
          chips: { claim: "Thesis", sources: "Sources", design: "Design", counter: "Counter" }
        },
        stems: {
          argues: ["Public talk often frames", "Public talk often treats", "Public talk often says that", "People often hear that"],
          tension: ["I argue that", "I argue"]
        },
        split: "counter",
        question: "standard",
        templates: {
          claim: { text: "On ${caseName}, the public usually hears one message: ${argues}. A stronger position is this: ${stance}.", why: "Two sentences. States the usual public message, then your position." },
          sources: { text: "Research on ${caseName} supports a careful position: ${stance}.", why: "One sentence. States your position. Use it only if your research supports it." },
          design: { text: "For its audience, a public piece on ${caseName} should make one point clear: ${stance}.", why: "One sentence. States the one point your public piece must make clear." },
          counter: { text: "On ${caseName}, a fair counter says this: ${counterView}. Even so, the stronger position is this: ${stance}.", why: "Two sentences. States a fair counter, then your position.", needs: ["counterView"] }
        }
      },
      "sp26-essay1-evaluation": {
        copy: {
          subjectLabel: "Monster or figure to evaluate",
          subjectHint: "One monster. Do not use Stranger Things for this essay.",
          presentsLabel: "Common view of this monster",
          presentsHint: "One sentence about what people usually say.",
          presentsPlaceholder: "People often see ... as ...",
          tensionLabel: "Your evaluation",
          tensionHint: "One sentence. Your judgment, the criteria you use, and why.",
          tensionPlaceholder: "By the criteria of ..., this figure ... because ...",
          chips: { criteria: "Criteria", judgment: "Judgment", evidence: "Evidence" }
        },
        stems: { argues: ["People often treat", "People often see", "Many people see"], tension: [] },
        question: "standard",
        templates: {
          criteria: { text: "Judged by clear criteria, ${caseName} earns this evaluation: ${tension}.", why: "One sentence. States your evaluation and the criteria behind it." },
          judgment: { text: "People often see ${caseName} one way: ${argues}. A fair evaluation reaches a different judgment: ${tension}.", why: "Two sentences. States the common view, then your evaluation." },
          evidence: { text: "The evidence in the text supports this evaluation of ${caseName}: ${tension}.", why: "One sentence. Ties your evaluation to the text. Use it only if your evidence supports it." }
        }
      },
      "sp26-essay2-critical-analysis": {
        copy: {
          subjectLabel: "Focus",
          subjectHint: "A symbol, character, or theme, plus the season, episode, or graphic text. For example: the Upside Down in season 4.",
          presentsLabel: "What the show seems to present",
          presentsHint: "One sentence about the surface reading you will go past.",
          presentsPlaceholder: "The series presents ... as ...",
          tensionLabel: "Your analytical thesis",
          tensionHint: "One sentence. What the focus shows beyond the plot, and why.",
          tensionPlaceholder: "It works as ... because ...",
          chips: { focus: "Focus", evidence: "Episode or panel", theory: "Theory", insight: "Insight" }
        },
        stems: { argues: ["The series presents", "The show presents"], tension: ["A closer look shows that", "A closer look shows"] },
        question: "literary",
        templates: {
          focus: { text: "On the surface, the series offers this: ${argues}. A closer look at ${caseName} shows more: ${tension}.", why: "Two sentences. States the surface reading, then your analysis." },
          evidence: { text: "Specific scenes show more about ${caseName}: ${tension}.", why: "One sentence. Ties your analysis to specific scenes or panels. Name them in your essay." },
          theory: { text: "Read through a critical theory, ${caseName} shows this: ${tension}.", why: "One sentence. States your analysis through a theory. Put the name of your theory in place of 'a critical theory.'" },
          insight: { text: "${caseName} shows something beyond the plot: ${tension}.", why: "One sentence. States what your focus shows beyond the plot." }
        }
      },
      "sp26-essay3-argument": {
        copy: {
          subjectLabel: "The real monster",
          subjectHint: "Name the institution, panic, figure, or system you will argue is the real monster.",
          presentsLabel: "The familiar monster story",
          presentsHint: "One sentence about the surface monster or myth.",
          presentsPlaceholder: "People point to ... as the monster.",
          tensionLabel: "Your position and a fair counter",
          tensionHint: COUNTER_HINT,
          tensionPlaceholder: "The real monster is ..., while a fair counter says ...",
          chips: { claim: "Thesis", research: "Research", counter: "Counter", stakes: "Stakes" }
        },
        stems: { argues: [], tension: ["I argue that", "I argue"] },
        split: "counter",
        question: "standard",
        templates: {
          claim: { text: "The familiar monster story goes like this: ${argues}. The real monster is something else: ${caseName}.", why: "Two sentences. States the familiar monster, then names the real one." },
          research: { text: "Research on ${caseName} supports this position: ${stance}.", why: "One sentence. States your position. Use it only if your research supports it." },
          counter: { text: "A fair counter says this: ${counterView}. Even so, the stronger position is this: ${stance}.", why: "Two sentences. States a fair counter, then your position.", needs: ["counterView"] },
          stakes: { text: "For the people most affected by ${caseName}, the stronger position is this: ${stance}.", why: "One sentence. Names the people affected, then states your position." }
        }
      },
      "sp26-essay4-research": {
        copy: {
          subjectLabel: "Issue",
          subjectHint: "For example: how communities talk about institutional betrayal.",
          presentsLabel: "Main view in the research",
          presentsHint: "One sentence about what most of your sources say.",
          presentsPlaceholder: "Most researchers treat ... as ...",
          tensionLabel: "Your evaluation of the research",
          tensionHint: "One sentence. What the sources show together, and what they miss.",
          tensionPlaceholder: "The research shows ..., but it underplays ...",
          chips: { synthesize: "Synthesize", evaluate: "Evaluate", gap: "Gap", "case": "Case" }
        },
        stems: {
          argues: ["Researchers tend to frame", "Researchers frame", "Researchers tend to treat", "Most researchers treat"],
          tension: ["Taken together"]
        },
        question: "standard",
        templates: {
          synthesize: { text: "Read as a set, the sources on ${caseName} lead to one evaluation: ${tension}.", why: "One sentence. States what the sources show together." },
          evaluate: { text: "Most research on ${caseName} treats it one way: ${argues}. A closer evaluation shows more: ${tension}.", why: "Two sentences. States the main view, then your evaluation." },
          gap: { text: "The research on ${caseName} leaves one thing open: ${tension}.", why: "One sentence. States what the research leaves open." },
          "case": { text: "One case shows what the research on ${caseName} adds up to: ${tension}.", why: "One sentence. Ties your evaluation to one case. Name the case in your essay." }
        }
      }
    }
  };
})(window);
