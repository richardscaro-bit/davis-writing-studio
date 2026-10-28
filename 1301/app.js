/* Davis Writing Studio — ENGL 1301
   Lean Case Study studio (five-step practice path). Thin HTML shells fill #studioPanel.
   Architecture matches Aug Writing Studio: data-studio + renderStudio + localStorage.
   Student UI uses Case Study critical analysis language only.
*/

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const storageKey = "davis-writing-studio-1301";
const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
})();

function persist(patch = {}) {
  Object.assign(saved, patch);
  localStorage.setItem(storageKey, JSON.stringify(saved));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

const PRACTICE_ROOT = "https://drive.google.com/drive/folders/13MPwivWWfzbmbsoQD1h7k76_FNSnyM3Z";
const WHOLE_CLASS = "https://drive.google.com/drive/folders/16qfglKurOHhKzRJXfWF83T9sVVScObBY";
const TOPIC_OPTIONS = "https://docs.google.com/document/d/1ZwLMkJWxth29GjSXzV_kMbn2m2Mvmbt80JkUpEYCBZs/edit";
const STUDENT_PROMPTS = "https://docs.google.com/document/d/1NcDPeGBEsFEJ-kWS6C4HMY26BGNP47UqFC5SQqFQSGQ/edit";
const RESEARCH_MAP = "https://docs.google.com/document/d/1x909FqATevneN3KvUjXRlWugmzjm9Vm7-OkYXucwcgU/edit";

const topics = [
  { id: "business", name: "Business & Marketing", folder: "1jyu1wyrtcNuqoiwiBsJGkZzhlDXCkgRP", cls: "topic-business" },
  { id: "climate", name: "Climate", folder: "1GVa0dkw3K8nl2kH_W2OVoicqGFzYgHdf", cls: "topic-climate" },
  { id: "education", name: "Education", folder: "1EuQCRzuAg2lMfgJPT4BDWLm3Ru7xCm7n", cls: "topic-education" },
  { id: "environmental", name: "Environmental", folder: "1legcgkwkPX5wrb65yMyN4EIC8DTbwijd", cls: "topic-environmental" },
  { id: "film", name: "Film / TV", folder: "1SpyIysnLdQXlTeAVwUJzb36kTsjFWTwU", cls: "topic-film" },
  { id: "forensics", name: "Forensics & Psychology", folder: "1vLa1uFGjghpWEB-L-qflG6qhUhuAGBPm", cls: "topic-forensics" },
  { id: "government", name: "Government", folder: "1bW8jM5BbNeobncAfleUlfHOb7UrC-D3L", cls: "topic-government" },
  { id: "health", name: "Health Science", folder: "1rWb_ZbZKxZxyz_cT5mXNed9laQSqs780", cls: "topic-health" },
  { id: "mortuary", name: "Mortuary Science", folder: "1Tn6XKVu6mE9mUHzVN4aPK2nkLlLhi5Qs", cls: "topic-mortuary" },
  { id: "public-health", name: "Public Health", folder: "1Q5PO06WH2JNUzPjFLReYftnAoqYhb_c5", cls: "topic-public-health" },
  { id: "social", name: "Social Media", folder: "1e9IK9jGZ6u7PCumFMqhR-b4KMgE74Nzh", cls: "topic-social" },
  { id: "technology", name: "Technology & Media", folder: "1DY0DBUu-cTMLdP5n-Bx_Brr1jo2IlVal", cls: "topic-technology" },
  { id: "urban", name: "Urban Studies", folder: "1OJZSSqMdeAk0WZG0XXwd9u7E5IBB4GLs", cls: "topic-urban" }
];

function driveFolder(id) {
  return `https://drive.google.com/drive/folders/${id}`;
}

const studios = {
  "case-study": {
    key: "case-study",
    label: "Case Study Critical Analysis",
    due: "Five-step practice path",
    length: "1,000–1,500 words MLA",
    format: "Clear claim · critical analysis · 3–4 outside sources beyond the packet",
    prompt:
      "Choose one case from your topic folder (or an approved case). Write a critical analysis built around one clear claim—a stance a reader could disagree with—supported by evidence from your case Source Packet and Case Brief, plus 3–4 credible outside sources beyond the packet. In class you will see a BarkBox or Crumbl model demo; brainstorm ideas before you lock a working thesis later. Whole-Class Examples in Drive are practice models only.",
    aiPolicy: {
      level: "Level 2 · AI for Support, Not Composition",
      allowed:
        "AI may help you brainstorm questions, check organization, or get reader-style feedback on work you already drafted. You remain the author of every analytical move.",
      notAllowed:
        "AI may not write your thesis, body paragraphs, source paraphrases, or final essay prose. Do not treat AI output as evidence.",
      evidence:
        "If you use AI, keep a short disclosure: what you asked, what you kept or rejected, and how you verified source claims yourself."
    }
  },
  comparison: {
    key: "comparison",
    label: "Comparison Essay",
    due: "Coming later",
    length: "Coming later",
    format: "Compare two related subjects and explain the insight",
    prompt: "Comparison studio workspace will expand here. For now, use the Case Study studio for the live essay practice workspace.",
    aiPolicy: {
      level: "Level 2 · AI for Support, Not Composition",
      allowed: "Brainstorming and reader-style feedback on work you already drafted.",
      notAllowed: "AI may not compose your essay.",
      evidence: "If you use AI, keep a short note of what you asked and what you kept or rejected."
    },
    stub: true
  },
  exposition: {
    key: "exposition",
    label: "Exposition Essay",
    due: "Coming later",
    length: "Coming later",
    format: "Research a focused question and explain what the evidence shows",
    prompt: "Exposition studio workspace will expand here. For now, use the Case Study studio for the live essay practice workspace.",
    aiPolicy: {
      level: "Level 2 · AI for Support, Not Composition",
      allowed: "Brainstorming and reader-style feedback on work you already drafted.",
      notAllowed: "AI may not compose your essay.",
      evidence: "If you use AI, keep a short note of what you asked and what you kept or rejected."
    },
    stub: true
  }
};

const caseStudyWeeks = [
  {
    week: "Step 1",
    due: "Focus · topic + brainstorm",
    assignment: "Topic selection + Case Study preview",
    focus: "see one case demo in class (BarkBox / Crumbl models), pick a topic, and brainstorm early ideas. Your case Source Packet and Case Brief are the required unit readings. Do not lock a thesis yet; start with idea generation.",
    also: ["In-class focus: Critical Question Workshop"]
  },
  {
    week: "Step 2",
    due: "Focus · packet notes",
    assignment: "Critical analysis reading notes",
    focus: "active reading of your Source Packet / Case Brief for the problem, stakeholders, evidence, assumptions or biases, and limits. Keep notes you can reuse in the outline and draft.",
    also: ["In-class focus: Evidence Quality"]
  },
  {
    week: "Step 3",
    due: "Focus · claim + outline",
    assignment: "Outline + research plan",
    focus: "shape a 1 to 2 page outline and research plan with a working thesis, and identify 3 to 4 outside sources beyond the packet. This is when the thesis locks after the demo and brainstorm.",
    also: ["In-class focus: Outline / Thesis / Outside Source"]
  },
  {
    week: "Step 4",
    due: "Focus · draft + peer",
    assignment: "Working draft + peer review",
    focus: "build a working draft toward full essay length, integrate or placeholder the 3 to 4 outside sources, and rehearse one peer review.",
    also: []
  },
  {
    week: "Step 5",
    due: "Focus · polished essay",
    assignment: "Polished critical analysis essay",
    focus: "finish a 1,000 to 1,500 word MLA critical analysis (Works Cited not in the word count) with packet evidence primary and 3 to 4 outside sources beyond the packet.",
    also: ["In-class focus: Limits / Ethics"]
  }
];

function getWorkspace(key) {
  if (!saved.workspaces) saved.workspaces = {};
  if (!saved.workspaces[key]) {
    saved.workspaces[key] = {
      topicId: "",
      previewNotes: "",
      brainstorm: "",
      readingNotes: "",
      outline: "",
      draft: "",
      peerReview: "",
      checklist: {}
    };
  }
  const workspace = saved.workspaces[key];
  if (typeof workspace.brainstorm !== "string") workspace.brainstorm = "";
  return workspace;
}

function bindNavToggle() {
  const toggle = $(".nav-toggle");
  const mobile = $("#mobileNav");
  if (!toggle || !mobile) return;
  toggle.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function renderStudioAiPolicy(key) {
  const policy = studios[key].aiPolicy;
  return `
    <section class="studio-canvas-panel" aria-labelledby="${key}AiPolicyTitle">
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">AI use for this essay</p>
          <h4 id="${key}AiPolicyTitle">${escapeHtml(policy.level)}</h4>
        </div>
        <a class="button small ghost" href="guides/ai.html">AI Level 2 guide</a>
      </div>
      <div class="policy-columns">
        <div><strong>Allowed</strong><p>${escapeHtml(policy.allowed)}</p></div>
        <div><strong>Not allowed</strong><p>${escapeHtml(policy.notAllowed)}</p></div>
        <div><strong>If used</strong><p>${escapeHtml(policy.evidence)}</p></div>
      </div>
      <p class="callout ai"><strong>You own the analysis.</strong> Do not treat AI summaries as evidence. Keep a short note if you used AI for brainstorming or feedback.</p>
    </section>
  `;
}

function renderWritingProcessMap(key) {
  const steps = [
    ["1", "Overview", "Know the unit task.", `#${key}Overview`],
    ["2", "Practice path", "See what each step is for.", `#${key}Schedule`],
    ["3", "Topic", "Open packet + folder links.", `#${key}Topics`],
    ["4", "Practice", "Brainstorm → notes → outline → draft.", `#${key}Workspace`],
    ["5", "Peer", "One peer review (Step 4).", `#${key}Peer`],
    ["6", "Check", "Run the practice checklist.", `#${key}Checklist`]
  ];
  return `
    <nav class="writing-process-map" aria-label="${escapeAttr(studios[key].label)} writing process">
      ${steps
        .map(
          ([number, title, detail, href]) => `
        <a href="${href}">
          <span>${escapeHtml(number)}</span>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(detail)}</small>
        </a>`
        )
        .join("")}
    </nav>
  `;
}

function renderWeekStepper(key) {
  return `
    <section class="studio-week-plan" id="${key}Schedule" aria-labelledby="${key}WeeklyPlanTitle">
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">Case Study · five steps</p>
          <h4 id="${key}WeeklyPlanTitle">Practice path · what each step is for</h4>
        </div>
      </div>
      <div class="week-stepper">
        ${caseStudyWeeks
          .map(
            (item, index) => `
          <article class="week-card${index === caseStudyWeeks.length - 1 ? " active" : ""}">
            <header>
              <h5>${escapeHtml(item.week)}</h5>
              <span class="pill">${escapeHtml(item.due)}</span>
            </header>
            <p><strong>${escapeHtml(item.assignment)}</strong></p>
            <p>${escapeHtml(item.focus)}</p>
            ${
              item.also.length
                ? `<ul>${item.also.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`
                : ""
            }
          </article>`
          )
          .join("")}
      </div>
      <p class="callout"><strong>Course Final Reflection</strong> has its own essay block on the 1301 home — this studio covers the Case Study steps only.</p>
    </section>
  `;
}

function renderTopicPicker(key, workspace) {
  const selected = workspace.topicId;
  return `
    <section class="topic-picker" id="${key}Topics" aria-labelledby="${key}TopicsTitle">
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">Practice Drive · packet folders</p>
          <h4 id="${key}TopicsTitle">Choose a topic folder</h4>
        </div>
        <a class="button small primary" href="${PRACTICE_ROOT}" target="_blank" rel="noopener">Open practice root</a>
      </div>
      <p><strong>Unit readings:</strong> after you pick a topic, open that folder and read your case <strong>Source Packet</strong> and <strong>Case Brief</strong> (plus Case Options). Those packet materials are the primary readings for this unit. Models: BarkBox + Crumbl in class; Tesla alternate; Whole-Class Examples in Drive are practice only.</p>
      <div class="resource-links">
        <a class="button small ghost" href="${TOPIC_OPTIONS}" target="_blank" rel="noopener">Topic Options doc</a>
        <a class="button small ghost" href="${STUDENT_PROMPTS}" target="_blank" rel="noopener">Student Prompts</a>
        <a class="button small ghost" href="${RESEARCH_MAP}" target="_blank" rel="noopener">Research Folders Map</a>
        <a class="button small ghost topic-card topic-examples" href="${WHOLE_CLASS}" target="_blank" rel="noopener" style="padding:0.4rem 0.8rem;min-height:auto;display:inline-flex;align-items:center;border-top-width:3px;">Whole-Class Examples</a>
      </div>
      <div class="topic-grid" style="margin-top:1rem;" role="list">
        ${topics
          .map((topic) => {
            const href = driveFolder(topic.folder);
            const isSelected = selected === topic.id;
            return `
              <a class="topic-card ${topic.cls}${isSelected ? " selected" : ""}"
                 href="${href}"
                 target="_blank"
                 rel="noopener"
                 role="listitem"
                 data-select-topic="${escapeAttr(topic.id)}"
                 aria-pressed="${isSelected ? "true" : "false"}">
                <strong>${escapeHtml(topic.name)}</strong>
                <small>${isSelected ? "Selected · open folder" : "Open Drive folder"}</small>
              </a>`;
          })
          .join("")}
      </div>
      <p class="save-status" data-save-status>${selected ? `Selected topic saved locally: ${escapeHtml((topics.find((t) => t.id === selected) || {}).name || selected)}` : "Click a topic to mark it as your current choice (saved in this browser). Folder links still open Drive."}</p>
    </section>
  `;
}

function renderWorkspaceFields(key, workspace) {
  return `
    <section class="workspace-block" id="${key}Workspace" aria-labelledby="${key}WorkspaceTitle" data-essay-workspace="${escapeAttr(key)}">
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">Practice workspace · saves in this browser</p>
          <h4 id="${key}WorkspaceTitle">Brainstorm → Notes → Outline → Draft</h4>
        </div>
        <button type="button" class="button small ghost" data-clear-workspace="${escapeAttr(key)}">Clear local draft</button>
      </div>
      <div class="callout warn">
        <strong>Practice framing.</strong>
        Aim for a 1,000–1,500 word MLA critical analysis.
        Use 3–4 credible outside sources beyond the packet (packet stays primary).
        Outline is 1–2 pages. One clear claim. One peer review rehearsal (Step 4).
      </div>
      <div class="field-grid">
        <label class="field">Topic / case preview notes
          <span class="hint">Topic Selection and Case Study Preview — what case are you analyzing, and why does it matter?</span>
          <textarea data-field="previewNotes" placeholder="Case name, topic folder, first critical question…">${escapeHtml(workspace.previewNotes)}</textarea>
        </label>
        <label class="field">Brainstorming (before a working thesis)
          <span class="hint">Early idea generation after the in-class demo — questions, angles, stakeholders, tensions. Do this before you lock a thesis in Step 3.</span>
          <textarea data-field="brainstorm" placeholder="Freewrite: possible claims, surprising evidence, who is affected, what still confuses you…">${escapeHtml(workspace.brainstorm)}</textarea>
        </label>
        <label class="field">Critical analysis reading notes
          <span class="hint">Critical Analysis Reading Notes — problem · stakeholders · evidence · assumptions/biases · limits (from your Source Packet / Case Brief)</span>
          <textarea data-field="readingNotes" placeholder="Reading notes keyed to the five analysis questions…">${escapeHtml(workspace.readingNotes)}</textarea>
        </label>
        <label class="field">Outline / research plan (1–2 pages)
          <span class="hint">Outline / Research Plan — working claim/thesis + plan for 3–4 outside sources beyond the packet</span>
          <textarea data-field="outline" placeholder="Working claim / thesis…&#10;Section outline…&#10;Outside sources 1–4 (beyond packet)…">${escapeHtml(workspace.outline)}</textarea>
        </label>
        <label class="field">Working draft
          <span class="hint">Working Draft — aim toward full essay length; integrate or placeholder 3–4 outside sources</span>
          <textarea data-field="draft" style="min-height:14rem" placeholder="Draft body…">${escapeHtml(workspace.draft)}</textarea>
        </label>
      </div>
      <p class="save-status" data-save-status aria-live="polite"></p>
    </section>

    <section class="workspace-block" id="${key}Peer" aria-labelledby="${key}PeerTitle">
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">Step 4 · one peer review only</p>
          <h4 id="${key}PeerTitle">Peer Review Notes</h4>
        </div>
      </div>
      <p>Use this space to capture peer feedback notes. The peer-review checklist tool can help you rehearse a structured response.</p>
      <label class="field">Peer feedback notes
        <textarea data-field="peerReview" placeholder="What is strong in the claim/thesis? Where does evidence need work? Limits or ethics to flag?">${escapeHtml(workspace.peerReview)}</textarea>
      </label>
    </section>
  `;
}

function renderFinalChecklist(key, workspace) {
  const items = [
    ["thesis", "I have one clear claim—a stance a reader could disagree with."],
    ["length", "Essay body is about 1,000–1,500 words (Works Cited not counted)."],
    ["mla", "MLA format: heading, in-text citations, Works Cited."],
    ["sources", "I used 3–4 credible outside sources beyond the packet."],
    ["packet", "Packet evidence remains primary and is integrated fairly."],
    ["analysis", "I address problem, stakeholders, evidence, assumptions/biases, and limits."],
    ["peer", "I completed one Step 4 peer-review rehearsal."],
    ["ai", "Any AI use followed Level 2 rules (support, not composition)."]
  ];
  const checks = workspace.checklist || {};
  return `
    <section class="final-checklist" id="${key}Checklist" aria-labelledby="${key}ChecklistTitle">
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">Before you call the draft done</p>
          <h4 id="${key}ChecklistTitle">Final Checklist</h4>
        </div>
      </div>
      <ul class="checklist">
        ${items
          .map(
            ([id, label]) => `
          <li>
            <input type="checkbox" id="${key}-check-${id}" data-check="${escapeAttr(id)}" ${checks[id] ? "checked" : ""}>
            <label for="${key}-check-${id}">${escapeHtml(label)}</label>
          </li>`
          )
          .join("")}
      </ul>
      <p class="callout"><strong>Practice checklist</strong> — use this list to spot gaps in claim, sources, MLA, and analysis before you leave the studio.</p>
    </section>
  `;
}

function renderCaseStudyStudio(key) {
  const studio = studios[key];
  const workspace = getWorkspace(key);
  return `
    <div class="studio-content">
      <section class="studio-summary" id="${key}Overview" aria-labelledby="${key}SummaryTitle">
        <div class="studio-summary-copy">
          <p class="eyebrow">Overview · what this studio is for</p>
          <span class="pill">${escapeHtml(studio.due)}</span>
          <h3 id="${key}SummaryTitle">What you practice here</h3>
          <p>${escapeHtml(studio.prompt)}</p>
          <div class="studio-meta">
            <span class="pill">${escapeHtml(studio.length)}</span>
            <span class="pill">${escapeHtml(studio.format)}</span>
          </div>
        </div>
        <aside class="studio-launch-card" aria-label="Jump to a studio block">
          <strong>Jump to a block</strong>
          <span>Topic picker → brainstorm / notes / outline / draft → peer notes → practice checklist. Practice path, Tools, and Resources stay linked from the top of the page.</span>
          <div class="studio-launch-actions">
            <a class="button small primary" href="#${key}Topics">Topic picker</a>
            <a class="button small ghost" href="weeks.html">Practice path</a>
            <a class="button small ghost" href="#${key}Workspace">Practice workspace</a>
            <a class="button small ghost" href="tools/">Tools</a>
            <a class="button small ghost" href="guides/ai.html">AI Level 2</a>
          </div>
        </aside>
      </section>
      ${renderWritingProcessMap(key)}
      ${renderStudioAiPolicy(key)}
      ${renderWeekStepper(key)}
      ${renderTopicPicker(key, workspace)}
      ${renderWorkspaceFields(key, workspace)}
      ${renderFinalChecklist(key, workspace)}
    </div>
  `;
}

function renderStubStudio(key) {
  const studio = studios[key];
  return `
    <div class="studio-content">
      <section class="studio-summary" aria-labelledby="${key}SummaryTitle">
        <div class="studio-summary-copy">
          <p class="eyebrow">Essay workspace · stub</p>
          <span class="pill">${escapeHtml(studio.due)}</span>
          <h3 id="${key}SummaryTitle">${escapeHtml(studio.label)}</h3>
          <p>${escapeHtml(studio.prompt)}</p>
        </div>
        <aside class="studio-launch-card">
          <strong>Coming later</strong>
          <span>Comparison and Exposition studios will be added later so all essay types can live here. Case Study (Essay 3) is the live workspace now.</span>
          <div class="studio-launch-actions">
            <a class="button small primary" href="case-study-studio.html">Open Case Study Studio</a>
            <a class="button small ghost" href="index.html">1301 dashboard</a>
          </div>
        </aside>
      </section>
      ${renderStudioAiPolicy(key)}
    </div>
  `;
}

function renderStudio(key) {
  const panel = $("#studioPanel");
  if (!panel) return;
  const studio = studios[key];
  if (!studio) {
    panel.innerHTML = `<p class="callout warn">Unknown studio.</p>`;
    return;
  }
  panel.innerHTML = studio.stub ? renderStubStudio(key) : renderCaseStudyStudio(key);
  flashSaved("");
}

function flashSaved(message) {
  $$("[data-save-status]").forEach((el) => {
    if (!message) return;
    el.textContent = message;
    el.classList.add("saved");
    window.setTimeout(() => el.classList.remove("saved"), 1200);
  });
}

function handleStudioPanelInput(event) {
  const field = event.target.dataset.field;
  if (!field) return;
  const key = document.body.dataset.studio || "case-study";
  const workspace = getWorkspace(key);
  workspace[field] = event.target.value;
  persist({ workspaces: saved.workspaces });
  flashSaved("Saved in this browser");
  const statuses = event.target.closest("section")?.querySelectorAll("[data-save-status]");
  statuses?.forEach((el) => {
    el.textContent = "Saved in this browser";
    el.classList.add("saved");
  });
}

function handleStudioPanelChange(event) {
  const check = event.target.dataset.check;
  if (!check) return;
  const key = document.body.dataset.studio || "case-study";
  const workspace = getWorkspace(key);
  workspace.checklist = workspace.checklist || {};
  workspace.checklist[check] = event.target.checked;
  persist({ workspaces: saved.workspaces });
}

function handleStudioPanelClick(event) {
  const topicBtn = event.target.closest("[data-select-topic]");
  if (topicBtn) {
    // Allow default (open Drive) but also persist selection
    const key = document.body.dataset.studio || "case-study";
    const workspace = getWorkspace(key);
    workspace.topicId = topicBtn.dataset.selectTopic;
    persist({ workspaces: saved.workspaces });
    // Update selected styling without full re-render (keeps Drive navigation)
    $$(".topic-card[data-select-topic]").forEach((card) => {
      const on = card.dataset.selectTopic === workspace.topicId;
      card.classList.toggle("selected", on);
      card.setAttribute("aria-pressed", on ? "true" : "false");
      const small = card.querySelector("small");
      if (small) small.textContent = on ? "Selected · open folder" : "Open Drive folder";
    });
    const status = $("[data-save-status]", topicBtn.closest("section") || document);
    const name = (topics.find((t) => t.id === workspace.topicId) || {}).name || workspace.topicId;
    if (status) status.textContent = `Selected topic saved locally: ${name}`;
    return;
  }

  const clear = event.target.closest("[data-clear-workspace]");
  if (clear) {
    const key = clear.dataset.clearWorkspace;
    if (!window.confirm("Clear local practice notes for this studio on this browser?")) return;
    saved.workspaces = saved.workspaces || {};
    saved.workspaces[key] = {
      topicId: "",
      previewNotes: "",
      brainstorm: "",
      readingNotes: "",
      outline: "",
      draft: "",
      peerReview: "",
      checklist: {}
    };
    persist({ workspaces: saved.workspaces });
    renderStudio(key);
  }
}

function init() {
  bindNavToggle();
  const key = document.body.dataset.studio;
  if ($("#studioPanel") && key) {
    renderStudio(key);
    const panel = $("#studioPanel");
    panel.addEventListener("input", handleStudioPanelInput);
    panel.addEventListener("change", handleStudioPanelChange);
    panel.addEventListener("click", handleStudioPanelClick);
  }
}

document.addEventListener("DOMContentLoaded", init);
