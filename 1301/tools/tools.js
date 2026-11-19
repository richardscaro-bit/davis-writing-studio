/* Practice-only client helpers for ENGL 1301 tools. No backend / no LLM API. */
(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const KEYS = {
    thesisInputs: "engl1301.tools.thesis.inputs",
    thesisDrafts: "engl1301.tools.thesis.drafts",
    chosenClaim: "engl1301.tools.thesis.chosenClaim",
    outlineInputs: "engl1301.tools.outline.inputs",
    outlineSkeleton: "engl1301.tools.outline.skeleton",
    mlaLast: "engl1301.tools.mla.last",
    sourceLog: "engl1301.tools.sourceLog",
    peerChecklist: "engl1301.tools.peerChecklist",
    keywordGen: "engl1301.tools.keywordGen",
    ideaPicks: "engl1301.tools.thesis.ideaPicks"
  };

  function essayCtx() {
    return window.DWSEssayContext || null;
  }
  function activeEssay() {
    const ctx = essayCtx();
    return ctx ? ctx.getActive() : null;
  }
  function essayLabel() {
    const e = activeEssay();
    return e && e.id ? e.label : "Any essay";
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota */
    }
  }


  function splitPair(name) {
    const raw = String(name || "").trim();
    if (!raw) return { a: "Figure A", b: "Figure B", paired: false };
    const parts = raw.split(/\s+(?:and|vs\.?|versus|\/|&)\s+/i);
    if (parts.length >= 2) {
      return { a: parts[0].trim(), b: parts.slice(1).join(" and ").trim(), paired: true };
    }
    return { a: raw, b: "the other figure", paired: false };
  }

  function lowerFirst(text) {
    const s = String(text || "").trim();
    if (!s) return s;
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  function isVagueComparisonBit(text) {
    const t = String(text || "").trim().toLowerCase();
    if (!t) return true;
    if (t.length < 12) return true;
    if (/same category for similar/.test(t)) return true;
    if (/belonging to the same category/.test(t)) return true;
    if (/grouped (together|in one category)/.test(t) && /trait list|shared traits|similar reasons/.test(t)) return true;
    if (/readers often lump both figures/.test(t)) return true;
    if (/both figures are often/.test(t)) return true;
    return /^(similarit(y|ies)|differences?|alike|the same|they are (similar|different)|both are monsters|compare|comparison)\b/.test(t)
      || /^(they )?(share|have) (many |some )?(similarit(y|ies)|things in common)\b/.test(t)
      || t === "similarities and differences"
      || t === "similarities & differences";
  }


  window.DWSThesisVague = isVagueComparisonBit;

  function comparisonDefaults(inputs, essay) {
    const pair = splitPair(inputs.caseName);
    const folder = (inputs.topicFolder || "").trim();
    const category = folder
      || (essay && essay.id === "monster-comparison" ? "related literary or screen figures in one category" : "the same category");
    let argues = (inputs.packetArgues || "").trim();
    let tension = (inputs.tension || "").trim();
    if (isVagueComparisonBit(argues)) {
      argues = `both belong to ${category}`;
    }
    const fromInputs = Array.isArray(inputs.criteria)
      ? inputs.criteria.map((c) => String(c || "").trim()).filter(Boolean).slice(0, 3)
      : [];
    const fromEssay = (essay && Array.isArray(essay.comparisonCriteria) && essay.comparisonCriteria.length)
      ? essay.comparisonCriteria.slice(0, 3)
      : [
          "how each figure is created or changed",
          "what each figure wants",
          "who readers are asked to judge or sympathize with"
        ];
    const criteria = (fromInputs.length ? fromInputs : fromEssay).slice(0, 3);
    while (criteria.length < 3) criteria.push(fromEssay[criteria.length] || `criterion ${criteria.length + 1}`);
    if (isVagueComparisonBit(tension)) {
      tension = `${pair.a} and ${pair.b} differ most under “${criteria[2]}” and “${criteria[1]}”`;
    }
    return { pair, category, argues, tension, criteria };
  }

  /* Student words are never cut short. The max argument stays for older callers. */
  function trimSnippet(text, max) {
    const t = (text || "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    return t.replace(/[.?!]+$/, "");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setStatus(el, msg, saved) {
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("saved", !!saved);
  }

  /* ---------- Thesis / claim generator ---------- */

  function selectedAngles() {
    return $$(".angle-chip[aria-pressed='true']").map((b) => b.dataset.angle);
  }

  function readThesisInputs() {
    return {
      caseName: ($("#caseName")?.value || "").trim(),
      topicFolder: ($("#topicFolder")?.value || "").trim(),
      packetArgues: ($("#packetArgues")?.value || "").trim(),
      tension: ($("#tensionInput")?.value || "").trim(),
      question: ($("#criticalQuestion")?.value || "").trim(),
      criteria: [
        ($("#criterion1")?.value || "").trim(),
        ($("#criterion2")?.value || "").trim(),
        ($("#criterion3")?.value || "").trim()
      ].filter(Boolean),
      csCriteria: $("#csCriteriaChips") ? readCsCriteria() : [],
      csSkipWhy: $("#csSkipWhy") ? readCsSkipWhy() : {},
      lens: readLensFields(),
      lensFieldsOn: lensFieldsOn(),
      angles: selectedAngles()
    };
  }

  /* Optional Case Study lens fields (not yet approved). Remove the #csLensFields block in
     thesis-helper.html to turn them off. Everything here then reads as empty. */
  const LENS_FIELDS = { framing: "lensFraming", stakeholders: "lensStakeholders", evidence: "lensEvidence", assumptions: "lensAssumptions", limits: "lensLimits" };
  function lensFieldsOn() {
    const box = document.getElementById("csLensFields");
    return !!(box && !box.hidden);
  }
  function readLensFields() {
    const out = {};
    Object.keys(LENS_FIELDS).forEach((k) => {
      const el = document.getElementById(LENS_FIELDS[k]);
      out[k] = el ? el.value.trim() : "";
    });
    return out;
  }
  function writeLensFields(lens) {
    Object.keys(LENS_FIELDS).forEach((k) => {
      const el = document.getElementById(LENS_FIELDS[k]);
      if (el) el.value = (lens && lens[k]) || "";
    });
  }

  function writeThesisInputs(data) {
    if (!data) return;
    if ($("#caseName")) $("#caseName").value = data.caseName || "";
    if ($("#topicFolder")) $("#topicFolder").value = data.topicFolder || "";
    if ($("#packetArgues")) $("#packetArgues").value = data.packetArgues || "";
    if ($("#tensionInput")) $("#tensionInput").value = data.tension || "";
    if ($("#criticalQuestion")) $("#criticalQuestion").value = data.question || "";
    const crits = Array.isArray(data.criteria) ? data.criteria : [];
    if ($("#criterion1")) $("#criterion1").value = crits[0] || "";
    if ($("#criterion2")) $("#criterion2").value = crits[1] || "";
    if ($("#criterion3")) $("#criterion3").value = crits[2] || "";
    const set = new Set(data.angles || []);
    $$(".angle-chip").forEach((btn) => {
      const on = set.has(btn.dataset.angle);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("active", on);
    });
    if ($("#csCriteriaChips") && Array.isArray(data.csCriteria)) {
      setCsCriteria(data.csCriteria, false);
    }
    if ($("#csSkipWhy") && data.csSkipWhy) writeCsSkipWhy(data.csSkipWhy);
    writeLensFields(data.lens || {});
  }


  /* Labels and order come from the swappable config in case-study-lenses.js.
     Do not hardcode lens names here. Phrase is built from the current label. */
  const CS_CRITERIA = (window.DWS_CASE_STUDY_LENSES || []).map((lens) => ({
    id: lens.id,
    label: lens.label,
    phrase: (window.DWSCaseStudyLenses && window.DWSCaseStudyLenses.lensPhrase)
      ? window.DWSCaseStudyLenses.lensPhrase(lens)
      : ("its " + String(lens.label || "").toLowerCase())
  }));

  function csAllIds() { return CS_CRITERIA.map((c) => c.id); }
  function lockCsChips(locked) {
    const host = $("#csCriteriaChips");
    if (!host) return;
    host.querySelectorAll("[data-cs-criterion], [data-cs-all]").forEach((btn) => {
      btn.disabled = !!locked;
      if (locked) btn.setAttribute("aria-disabled", "true");
      else btn.removeAttribute("aria-disabled");
    });
  }
  function applyCsFiveLock(persist) {
    const box = $("#csSectionBox");
    const essay = (typeof activeEssay === "function") ? activeEssay() : null;
    if (box) box.hidden = !(essay && essay.id === "case-study");
    setCsCriteria(csAllIds(), persist === true);
    const api = window.DWSCaseStudyLenses;
    if (api && typeof api.fillRuleHosts === "function") api.fillRuleHosts();
  }

  function joinNatural(items) {
    const list = (items || []).filter(Boolean);
    if (!list.length) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + " and " + list[1];
    return list.slice(0, -1).join(", ") + ", and " + list[list.length - 1];
  }

  function readCsCriteria() {
    return csAllIds();
  }

  function setCsCriteria(ids, persist) {
    const host = $("#csCriteriaChips");
    if (!host) return;
    if (window.DWSCaseStudyLenses && typeof window.DWSCaseStudyLenses.renderPickerChips === "function") {
      if (!host.querySelector("[data-cs-criterion]")) window.DWSCaseStudyLenses.renderPickerChips(host);
    }
    ids = csAllIds();
    const want = new Set(ids);
    host.querySelectorAll("[data-cs-criterion]").forEach((btn) => {
      const on = want.has(btn.getAttribute("data-cs-criterion"));
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("active", on);
    });
    lockCsChips(true);
    const allBtn = $("#csCriteriaAll");
    if (allBtn) allBtn.remove();
    updateCsSkipWhy();
    if (persist !== false) persistThesisInputs();
    updateCaseStudyThesisPattern();
  }

  function readCsSkipWhy() { return {}; }
  function writeCsSkipWhy() { updateCsSkipWhy(); }
  function updateCsSkipWhy() {
    const host = document.getElementById("csSkipWhy");
    if (!host) return;
    host.innerHTML = "";
    host.hidden = true;
  }





  function updateCaseStudyThesisPattern() {
    const pat = document.getElementById("caseStudyThesisPattern");
    const essay = activeEssay();
    const isCs = $("#claimGenerate") && essay && essay.id === "case-study";
    if (pat) pat.hidden = true;
    updateCaseStudyAnswerLead();
    return;
    if (!isCs) {
      if (pat) pat.hidden = true;
      return;
    }
    let box = pat;
    if (!box) {
      box = document.createElement("p");
      box.id = "caseStudyThesisPattern";
      box.className = "hint-block";
      const cueEl = document.getElementById("essayToolCue");
      const host = document.getElementById("claimGenerate") && document.getElementById("claimGenerate").closest("section");
      (cueEl && cueEl.parentElement ? cueEl.parentElement : host || document.getElementById("claimGenerate").parentElement).appendChild(box);
    }
    box.hidden = false;
    const text = (window.DWSThesisCatalog && window.DWSThesisCatalog.patternBox) || "";
    const head = "Thesis pattern:";
    box.innerHTML = text.indexOf(head) === 0
      ? "<strong>" + head + "</strong>" + escapeHtml(text.slice(head.length))
      : escapeHtml(text);
    updateCaseStudyAnswerLead();
  }

  /* Case Study: show the lens fields and the gray "The [study name] study" lead-in before Your answer. */
  function updateCaseStudyAnswerLead() {
    const essay = activeEssay();
    const isCs = !!($("#claimGenerate") && essay && essay.id === "case-study");
    const lensBox = document.getElementById("csLensFields");
    if (lensBox) lensBox.hidden = !isCs;
    const field = $("#tensionInput");
    if (!field) return;
    let lead = document.getElementById("csAnswerLead");
    if (!lead && isCs) {
      lead = document.createElement("span");
      lead.id = "csAnswerLead";
      lead.className = "hint cs-answer-lead";
      field.insertAdjacentElement("beforebegin", lead);
      $("#caseName")?.addEventListener("input", updateCaseStudyAnswerLead);
    }
    if (!lead) return;
    lead.hidden = !isCs;
    if (!isCs) return;
    let name = ($("#caseName")?.value || "").trim().replace(/^(the|a|an)\s+/i, "");
    let prev;
    do { prev = name; name = name.replace(/\s+(case study|packet|study|case)$/i, "").trim(); } while (name !== prev);
    lead.textContent = "The " + (name || "[study name]") + " study";
  }

  /* Thesis options come from the shared engine (../../_design/thesis-engine.js) and this
     course's catalog (thesis-catalog.js). One catalog per essay, keyed to its chips. */
  let lastThesisNotes = [];
  function buildClaimOptions(inputs) {
    const engine = window.DWSThesisEngine;
    const catalog = window.DWSThesisCatalog;
    lastThesisNotes = [];
    if (!engine || !catalog) return [];
    const result = engine.build(inputs, activeEssay(), catalog);
    lastThesisNotes = result.notes || [];
    return result.options || [];
  }

  function renderClaimOptions(options, notes) {
    const wrap = $("#claimOptions");
    const results = $("#claimResults");
    if (!wrap || !results) return;
    if (!options.length) {
      results.hidden = true;
      wrap.innerHTML = "";
      return;
    }
    const engine = window.DWSThesisEngine;
    const longNote = engine ? engine.STATUS.long : "This one is long. Try cutting it to one main point.";
    const noteLines = (notes || []).filter(Boolean);
    const extraLines = thesisExtraLines();
    const notesHtml = noteLines.length
      ? `<div class="claim-notes" id="claimNotes">${noteLines.map((n) => `<p class="hint-block">${escapeHtml(n)}</p>`).join("")}</div>`
      : "";
    const extraHtml = extraLines.length
      ? `<div class="claim-notes" id="claimExtra">${extraLines.map((n) => `<p class="hint-block"><strong>${escapeHtml(n.label)}</strong> ${escapeHtml(n.text)}</p>`).join("")}</div>`
      : "";
    wrap.innerHTML = notesHtml + options
      .map((opt, i) => {
        const label = opt.label || (opt.angle || "thesis").replace(/^\w/, (c) => c.toUpperCase());
        return `<article class="claim-option" data-idx="${i}">
          <header class="claim-option-head">
            <span class="pill">${escapeHtml(label)}</span>
            <div class="claim-option-actions">
              <button type="button" class="button small ghost" data-copy="${i}">Copy</button>
              <button type="button" class="button small primary" data-use="${i}">Use this thesis</button>
            </div>
          </header>
          <p class="claim-option-text">${escapeHtml(opt.text)}</p>
          ${opt.long ? `<p class="claim-option-why claim-option-long">${escapeHtml(longNote)}</p>` : ""}
          <p class="claim-option-why"><strong>What this option does:</strong> ${escapeHtml(opt.why || "")}</p>
        </article>`;
      })
      .join("") + extraHtml;
    results.hidden = false;
  }
  /* Extra lines shown under the options, kept out of Copy and Use this thesis. */
  function thesisExtraLines() {
    return [];
  }

  let angleChipsBound = false;
  function bindAngleChips() {
    const host = $("#angleChips");
    if (!host || angleChipsBound) return;
    angleChipsBound = true;
    host.addEventListener("click", (e) => {
      const btn = e.target.closest(".angle-chip");
      if (!btn || !host.contains(btn)) return;
      const on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("active", on);
      persistThesisInputs();
    });
  }

  function persistThesisInputs() {
    const hasAny = $("#caseName") || $("#criticalQuestion") || $("#packetArgues") || $("#tensionInput");
    if (!hasAny) return;
    const prev = loadJSON(KEYS.thesisInputs, {}) || {};
    const current = readThesisInputs();
    const merged = {
      caseName: $("#caseName") ? current.caseName : (prev.caseName || ""),
      topicFolder: $("#topicFolder") ? current.topicFolder : (prev.topicFolder || ""),
      packetArgues: $("#packetArgues") ? current.packetArgues : (prev.packetArgues || ""),
      tension: $("#tensionInput") ? current.tension : (prev.tension || ""),
      question: $("#criticalQuestion") ? current.question : (prev.question || ""),
      criteria: ($("#criterion1") || $("#criterion2") || $("#criterion3")) ? current.criteria : (prev.criteria || []),
      csCriteria: $("#csCriteriaChips") ? current.csCriteria : (prev.csCriteria || []),
      lens: $("#csLensFields") ? current.lens : (prev.lens || {}),
      angles: $("#angleChips") ? current.angles : (prev.angles || [])
    };
    saveJSON(KEYS.thesisInputs, merged);
    setStatus($("#claimSaveStatus") || $("#cqSaveStatus"), "Your entries are saved in this browser.", true);
  }


  let csCriteriaBound = false;
  function bindCaseStudyCriteriaChips() {
    const host = $("#csCriteriaChips");
    if (!host || csCriteriaBound) return;
    csCriteriaBound = true;
    // All five lenses are required. Clicks do not change the selection.
    host.addEventListener("click", (e) => { e.preventDefault(); });
  }

    function bindClaimGenerator() {
    if (!$("#claimGenerate")) return;
    bindAngleChips();
    bindIdeaGenerator();

    bindCaseStudyCriteriaChips();

    $("#criteriaPresets")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-criterion]");
      if (!btn) return;
      const val = btn.getAttribute("data-criterion") || "";
      const slots = ["criterion1", "criterion2", "criterion3"].map((id) => document.getElementById(id));
      const empty = slots.find((el) => el && !el.value.trim());
      const target = empty || slots[2];
      if (target) {
        target.value = val;
        persistThesisInputs();
      }
    });

    // One-time scrub of drafts that glued the old shared-category starter into theses
    const COPY_VER = "compare-scrub-4";
    if (localStorage.getItem("dws1301-thesis-copy-ver") !== COPY_VER) {
      try {
        const raw = loadJSON(KEYS.thesisInputs, null);
        if (raw) {
          const pa = String(raw.packetArgues || "");
          if (isVagueComparisonBit(pa) || /same category for similar|Both figures are often/i.test(pa)) {
            raw.packetArgues = "";
          }
          if (isVagueComparisonBit(raw.tension)) raw.tension = "";
          saveJSON(KEYS.thesisInputs, raw);
        }
        localStorage.removeItem(KEYS.thesisDrafts);
      } catch (e) {}
      localStorage.setItem("dws1301-thesis-copy-ver", COPY_VER);
    }

    const saved = loadJSON(KEYS.thesisInputs, null);
    if (saved) writeThesisInputs(saved);
    const drafts = loadJSON(KEYS.thesisDrafts, []);
    if (drafts.length) renderClaimOptions(drafts);

    ["caseName", "topicFolder", "packetArgues", "tensionInput", "criticalQuestion", "criterion1", "criterion2", "criterion3"].concat(Object.values(LENS_FIELDS)).forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", persistThesisInputs);
      el?.addEventListener("blur", persistThesisInputs);
    });

    $("#claimGenerate").addEventListener("click", () => {
      const inputs = readThesisInputs();
      const essay = activeEssay();
      const engine = window.DWSThesisEngine;
      const catalog = window.DWSThesisCatalog;
      const labels = engine && catalog
        ? engine.fieldLabels(catalog, essay)
        : { caseName: "Subject or focus", packetArgues: "What sources or people usually say", tension: "Your main point" };
      const missing = [];
      if (!inputs.caseName) missing.push(labels.caseName);
      if (!inputs.packetArgues) missing.push(labels.packetArgues);
      if (!inputs.tension) missing.push(labels.tension);
      if (essay && essay.claimKind === "comparison" && (inputs.criteria || []).length < 3) {
        missing.push(engine ? engine.STATUS.missingCriteria : "all three comparison points");
      }
      if (missing.length) {
        setStatus($("#claimSaveStatus"), engine ? engine.missingMessage(missing) : "Fill in these boxes first: " + missing.join(", ") + ".", false);
        $("#claimResults").hidden = true;
        return;
      }
      const options = buildClaimOptions(inputs);
      saveJSON(KEYS.thesisInputs, inputs);
      saveJSON(KEYS.thesisDrafts, options);
      renderClaimOptions(options, lastThesisNotes);
      setStatus($("#claimSaveStatus"), engine ? engine.madeMessage(options.length) : "Made " + options.length + " thesis options. Saved in this browser.", true);
    });

    $("#claimClear")?.addEventListener("click", () => {
      writeThesisInputs({ caseName: "", topicFolder: "", packetArgues: "", tension: "", question: "", criteria: [], csCriteria: CS_CRITERIA.map((c) => c.id), angles: [] });
      setCsCriteria(CS_CRITERIA.map((c) => c.id), false);
      saveJSON(KEYS.thesisInputs, readThesisInputs());
      saveJSON(KEYS.thesisDrafts, []);
      localStorage.removeItem(KEYS.chosenClaim);
      localStorage.removeItem(KEYS.ideaPicks);
      renderClaimOptions([]);
      showIdeaToAdapt("");
      if ($("#ideaResults")) {
        $("#ideaResults").hidden = true;
        ["ideaTopics", "ideaQuestions", "ideaIdeas"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = "";
        });
      }
      setStatus($("#claimSaveStatus"), "All boxes cleared.", false);
    });

    $("#claimOptions")?.addEventListener("click", (e) => {
      const copyBtn = e.target.closest("[data-copy]");
      const useBtn = e.target.closest("[data-use]");
      const drafts = loadJSON(KEYS.thesisDrafts, []);
      if (copyBtn) {
        const opt = drafts[Number(copyBtn.getAttribute("data-copy"))];
        if (!opt) return;
        navigator.clipboard?.writeText(opt.text).then(
          () => setStatus($("#claimSaveStatus"), "Copied to clipboard.", true),
          () => setStatus($("#claimSaveStatus"), "Copy did not work. Select the sentence and copy it yourself.", false)
        );
      }
      if (useBtn) {
        const opt = drafts[Number(useBtn.getAttribute("data-use"))];
        if (!opt) return;
        const inputs = readThesisInputs();
        const payload = {
          claim: opt.text,
          caseName: inputs.caseName,
          tension: inputs.tension,
          topicFolder: inputs.topicFolder,
          criteria: inputs.criteria || [],
          angle: opt.angle,
          savedAt: Date.now()
        };
        saveJSON(KEYS.chosenClaim, payload);
        setStatus($("#claimSaveStatus"), "Thesis saved. Opening the outline helper.", true);
        window.location.href = "outline-helper.html";
      }
    });
  }


  /* ---------- Idea packs: topics / questions / ideas (AI Level 2) ---------- */

  function expandIdeaText(str, topic) {
    const t = (topic || "this topic").trim() || "this topic";
    return String(str || "").replace(/\{topic\}/g, t);
  }

  function rotateList(list, salt) {
    const arr = (list || []).slice();
    if (arr.length < 2) return arr;
    const n = Math.abs(salt | 0) % arr.length;
    return arr.slice(n).concat(arr.slice(0, n));
  }




  function buildIdeaSuggestions(essay, inputs) {
    const seeds = (essay && essay.ideaSeeds) || (essayCtx() && essayCtx().GENERIC && essayCtx().GENERIC.ideaSeeds) || {
      topics: ["A focused subject for this draft"],
      questions: ["What question guides this draft about {topic}?"],
      ideas: []
    };
    const typed = (inputs && inputs.caseName) || "";
    const topicHint = typed || ((inputs && inputs.topicFolder) || "") || "this topic";
    const salt = Date.now();
    const topics = rotateList(seeds.topics || [], salt).slice(0, 8).map((t) => expandIdeaText(t, topicHint));
    // Prefer concrete topics; if student already typed a subject, keep it first as a pickable option
    const topicList = typed && !topics.some((t) => t.toLowerCase() === typed.toLowerCase())
      ? [typed].concat(topics).slice(0, 8)
      : topics;
    const questions = rotateList(seeds.questions || [], salt + 1).slice(0, 6).map((q) => expandIdeaText(q, topicHint));
    const ideas = rotateList(seeds.ideas || [], salt + 2).slice(0, 6).map((idea) => expandIdeaText(idea, topicHint));
    /* Thesis generator only: student-facing copy says "study", not "packet". */
    const studyWords = (s) => String(s).replace(/\bpacket\b/g, "study").replace(/\bPacket\b/g, "Study");
    return { topics: topicList.map(studyWords), questions: questions.map(studyWords), ideas: ideas.map(studyWords), essayId: (essay && essay.id) || "", generatedAt: salt };
  }

  function readIdeaPicks() {
    const host = $("#ideaResults");
    if (!host) return { topic: "", question: "", idea: "" };
    const topic = host.querySelector("#ideaTopics .idea-chip[aria-pressed='true']")?.dataset?.value || "";
    const question = host.querySelector("#ideaQuestions .idea-chip[aria-pressed='true']")?.dataset?.value || "";
    const idea = host.querySelector("#ideaIdeas .idea-chip[aria-pressed='true']")?.dataset?.value || "";
    return { topic, question, idea };
  }

  function renderIdeaChipGroup(container, items, selectedValue) {
    if (!container) return;
    container.innerHTML = (items || [])
      .map((text) => {
        const on = selectedValue && selectedValue === text;
        return `<button type="button" class="idea-chip${on ? " active" : ""}" data-value="${escapeHtml(text)}" aria-pressed="${on ? "true" : "false"}">${escapeHtml(text)}</button>`;
      })
      .join("");
  }

  function renderIdeaSuggestions(packet, picks) {
    const results = $("#ideaResults");
    if (!results || !packet) return;
    const p = picks || loadJSON(KEYS.ideaPicks, {}) || {};
    renderIdeaChipGroup($("#ideaTopics"), packet.topics, p.topic);
    renderIdeaChipGroup($("#ideaQuestions"), packet.questions, p.question);
    renderIdeaChipGroup($("#ideaIdeas"), packet.ideas, p.idea);
    results.hidden = false;
  }

  function applyIdeaPicksToForm(picks) {
    const topic = (picks && picks.topic) || "";
    const question = (picks && picks.question) || "";
    const idea = (picks && picks.idea) || "";
    showIdeaToAdapt(idea);
    if (!topic && !question) return false;
    const engine = window.DWSThesisEngine;

    if (topic && $("#caseName")) $("#caseName").value = engine ? engine.midCase(topic, {}, true) : topic;

    // Match topicFolder option when possible (exact or includes)
    const sel = $("#topicFolder");
    if (sel && topic) {
      const opts = Array.from(sel.options || []).map((o) => o.value).filter(Boolean);
      let match = opts.find((o) => o.toLowerCase() === topic.toLowerCase());
      if (!match) match = opts.find((o) => topic.toLowerCase().includes(o.toLowerCase()) || o.toLowerCase().includes(topic.toLowerCase().slice(0, 18)));
      // Facing the Unknown: map concrete topics into subject areas
      if (!match && opts.length) {
        const tl = topic.toLowerCase();
        const heuristics = [
          [/ocean|sea|deep|pressure|extreme env/i, "Deep ocean / extreme environments"],
          [/space|cosmos|black hole|planet/i, "Space / cosmos"],
          [/body|heat|cold|stress/i, "The body under stress"],
          [/disease|health|spread|population/i, "Disease / public health unknowns"],
          [/\bai\b|model|technology/i, "Technology / AI unknowns"],
          [/hurricane|disaster|storm/i, "Natural disasters"],
          [/mystery|phenomenon|unexplained/i, "Unexplained phenomena (explain, don’t argue)"],
          [/archaeolog|historical/i, "Historical mysteries"]
        ];
        for (const [re, label] of heuristics) {
          if (re.test(tl) && opts.includes(label)) {
            match = label;
            break;
          }
        }
      }
      if (match) sel.value = match;
    }

    if (question && $("#criticalQuestion")) $("#criticalQuestion").value = question;

    persistThesisInputs();
    return true;
  }

  /* The picked idea is shown under the third box as something to adapt. It is never written into a field. */
  function showIdeaToAdapt(idea) {
    const field = $("#tensionInput");
    if (!field) return;
    let host = document.getElementById("ideaToAdapt");
    if (!host) {
      host = document.createElement("p");
      host.id = "ideaToAdapt";
      host.className = "hint-block";
      const label = field.closest("label") || field;
      label.insertAdjacentElement("afterend", host);
    }
    host.textContent = idea ? "Idea to adapt: " + idea : "";
    host.hidden = !idea;
  }

  function claimFromIdeaPicks(picks, inputs) {
    const options = buildClaimOptions(inputs);
    return options.length ? options[0] : null;
  }

  let ideaGeneratorBound = false;
  function bindIdeaGenerator() {
    if (!$("#ideaGenerate")) return;
    if (ideaGeneratorBound) return;
    ideaGeneratorBound = true;

    const savedPacket = loadJSON(KEYS.ideaPicks, null);
    // ideaPicks stores {topic, question, idea, packet?}
    if (savedPacket && savedPacket.packet) {
      renderIdeaSuggestions(savedPacket.packet, savedPacket);
    }

    $("#ideaGenerate").addEventListener("click", () => {
      const essay = activeEssay();
      const inputs = readThesisInputs();
      const packet = buildIdeaSuggestions(essay, inputs);
      const prev = loadJSON(KEYS.ideaPicks, {}) || {};
      renderIdeaSuggestions(packet, prev);
      saveJSON(KEYS.ideaPicks, Object.assign({}, prev, { packet, generatedAt: packet.generatedAt }));
      setStatus($("#claimSaveStatus"), "Here are some topics, questions, and ideas. Pick what fits, then write in your own words.", true);
    });

    $("#ideaResults")?.addEventListener("click", onIdeaChipClick);

    $("#ideaApply")?.addEventListener("click", () => {
      const picks = readIdeaPicks();
      if (!picks.topic && !picks.question) {
        showIdeaToAdapt(picks.idea);
        setStatus($("#claimSaveStatus"), "Pick a topic or a question first.", false);
        return;
      }
      applyIdeaPicksToForm(picks);
      const packet = loadJSON(KEYS.ideaPicks, {})?.packet;
      saveJSON(KEYS.ideaPicks, Object.assign({}, picks, { packet, savedAt: Date.now() }));
      setStatus($("#claimSaveStatus"), "Your picks are in the form. Now write your own point in the third box.", true);
    });

    $("#ideaToOutline")?.addEventListener("click", () => {
      const picks = readIdeaPicks();
      applyIdeaPicksToForm(picks);
      const inputs = readThesisInputs();
      if (!inputs.tension) {
        setStatus($("#claimSaveStatus"), "Write your own point in the third box before you build an outline.", false);
        return;
      }
      const engine = window.DWSThesisEngine;
      const catalog = window.DWSThesisCatalog;
      if (engine && catalog && (!inputs.caseName || !inputs.packetArgues)) {
        const labels = engine.fieldLabels(catalog, activeEssay());
        const missing = [];
        if (!inputs.caseName) missing.push(labels.caseName);
        if (!inputs.packetArgues) missing.push(labels.packetArgues);
        setStatus($("#claimSaveStatus"), engine.missingMessage(missing), false);
        return;
      }
      const opt = claimFromIdeaPicks(picks, inputs);
      if (!opt) {
        setStatus($("#claimSaveStatus"), "Write your own point in the third field, then generate thesis options.", false);
        return;
      }
      const payload = {
        claim: opt.text,
        caseName: inputs.caseName,
        tension: inputs.tension,
        topicFolder: inputs.topicFolder,
        question: inputs.question,
        angle: opt.angle || "idea",
        fromIdeas: true,
        savedAt: Date.now()
      };
      saveJSON(KEYS.chosenClaim, payload);
      saveJSON(KEYS.thesisInputs, inputs);
      saveJSON(KEYS.thesisDrafts, [opt]);
      const packet = loadJSON(KEYS.ideaPicks, {})?.packet;
      saveJSON(KEYS.ideaPicks, Object.assign({}, picks, { packet, savedAt: Date.now() }));

      const outlineInputs = {
        claim: opt.text,
        caseName: inputs.caseName,
        tension: inputs.tension,
        question: inputs.question,
        topicFolder: inputs.topicFolder,
        sourcesNote: ""
      };
      const skeleton = buildOutline(outlineInputs);
      saveJSON(KEYS.outlineInputs, outlineInputs);
      saveJSON(KEYS.outlineSkeleton, skeleton);
      setStatus($("#claimSaveStatus"), "Your outline and topic sentences are ready. Opening the outline helper.", true);
      window.location.href = "outline-helper.html";
    });
  }

  function onIdeaChipClick(e) {
    const chip = e.target.closest(".idea-chip");
    const host = $("#ideaResults");
    if (!chip || !host || !host.contains(chip)) return;
    const group = chip.parentElement;
    const wasOn = chip.getAttribute("aria-pressed") === "true";
    group.querySelectorAll(".idea-chip").forEach((b) => {
      b.setAttribute("aria-pressed", "false");
      b.classList.remove("active");
    });
    if (!wasOn) {
      chip.setAttribute("aria-pressed", "true");
      chip.classList.add("active");
    }
    const picks = readIdeaPicks();
    const prev = loadJSON(KEYS.ideaPicks, {}) || {};
    saveJSON(KEYS.ideaPicks, Object.assign({}, prev, picks, { savedAt: Date.now() }));
  }


  /* ---------- Critical question developer (reuses idea generator) ---------- */

  function questionStarter(essay) {
    if (essay && essay.id === "case-study") {
      return {
        topic: "LumenBox, a made-up subscription packet that presents the company as a community-loyalty success",
        yesNo: "Does LumenBox treat its subscribers well?",
        fact: "How many subscribers does LumenBox have?",
        strong: "How well does the LumenBox packet support its community-loyalty story once we ask who is left out?"
      };
    }
    if (essay && (essay.id === "monster-comparison" || essay.claimKind === "comparison")) {
      return {
        topic: "two made-up figures, Shadow Maw and the Glass Warden, both framed as protectors",
        yesNo: "Are Shadow Maw and the Glass Warden similar?",
        fact: "When was each figure first introduced?",
        strong: "Why do Shadow Maw and the Glass Warden invite different reader judgments even when both are framed as protectors?"
      };
    }
    return {
      topic: "a campus night market called Pecan Street Nights that advertises itself as zero waste, while most stalls still use disposable trays",
      yesNo: "Is Pecan Street Nights wasteful?",
      fact: "How many disposable trays does the market use on a Saturday?",
      strong: "To what extent does the market's zero-waste message hold up once everyday stall practice is in view?"
    };
  }

  function renderQuestionExample(essay) {
    const box = $("#cqExampleBody");
    if (!box) return;
    const ex = questionStarter(essay);
    box.innerHTML = `<p style="margin:0 0 0.55rem;">Topic: ${escapeHtml(ex.topic)}.</p>
            <ul class="cue-list">
              <li><strong>Weaker, yes/no:</strong> ${escapeHtml(ex.yesNo)}</li>
              <li><strong>Weaker, fact-only:</strong> ${escapeHtml(ex.fact)}</li>
              <li><strong>Stronger:</strong> ${escapeHtml(ex.strong)}</li>
            </ul>`;
  }

  function assessCriticalQuestion(raw) {
    const text = String(raw || "").replace(/\s+/g, " ").trim();
    const flags = [];
    const notes = [];
    if (!text) {
      return { empty: true, ok: false, flags, notes, rewrite: "", text };
    }
    const body = text.replace(/[?]+$/g, "").trim();
    const wordCount = body.split(/\s+/).filter(Boolean).length;

    const yesNo = /^(is|are|was|were|do|does|did|can|could|should|would|will|has|have|had|may|might)\b/i.test(body);
    const factOnly = /^(how many|how much|how often|how long|how old|when\b|where\b|in what year|what year|who is|who was|what is the (name|date|title|number|population|score|rate|total))\b/i.test(body);
    const openStart = /^(how|why|to what extent|in what ways|under what conditions|under what)\b/i.test(body) && !/^(how many|how much|how often|how long|how old)\b/i.test(body);

    if (yesNo) {
      flags.push("This reads as a yes/no question. A reader can stop at yes or no. Try opening with how, why, or to what extent so the answer has to be argued.");
    }
    if (factOnly) {
      flags.push("This looks like a fact-only question. A single looked-up fact could finish it. A critical question asks how or why that information matters.");
    }
    if (wordCount < 6) {
      flags.push("This is quite short. Add the topic and the tension you want to judge so a reader can see what is at issue.");
    }
    if (openStart) {
      notes.push("This opens in a way that usually needs an argued answer, not just a fact.");
    }
    if (!yesNo && !factOnly && !openStart && !/\?$/.test(text)) {
      notes.push("If this is your question, add a question mark and check that a careful reader would have to argue an answer, not only report a fact.");
    }

    let rewrite = "";
    if (yesNo) {
      const m = body.match(/^(does|do|did|is|are|was|were|can|could|should|would|will|has|have|had|may|might)\s+(.+)$/i);
      if (m) rewrite = `To what extent ${m[1].toLowerCase()} ${m[2].replace(/[.]+$/g, "")}?`;
    } else if (factOnly) {
      rewrite = "Why does this information matter for how a careful reader should understand the topic?";
    }
    const ok = flags.length === 0;
    if (ok && !notes.length) {
      notes.push("This looks open enough to argue. Edit it in your own words, then send it to the thesis generator if you want to keep it.");
    }
    return { empty: false, ok, flags, notes, rewrite, text };
  }

  function renderQuestionFeedback(result) {
    const box = $("#cqFeedback");
    const title = $("#cqFeedbackTitle");
    const body = $("#cqFeedbackBody");
    const useBtn = $("#cqUseRewrite");
    if (!box || !body) return;
    if (!result || result.empty) {
      box.hidden = true;
      if (useBtn) useBtn.hidden = true;
      return;
    }
    box.hidden = false;
    box.classList.toggle("warn", !result.ok);
    if (title) title.textContent = result.ok ? "This question looks open enough to argue" : "This question needs a stronger opening";
    const parts = [];
    (result.flags || []).forEach((f) => parts.push(`<p style="margin:0.45rem 0 0;">${escapeHtml(f)}</p>`));
    (result.notes || []).forEach((n) => parts.push(`<p style="margin:0.45rem 0 0;">${escapeHtml(n)}</p>`));
    if (result.rewrite) {
      parts.push(`<p style="margin:0.45rem 0 0;"><strong>Suggested wording to edit:</strong> ${escapeHtml(result.rewrite)}</p>`);
    }
    body.innerHTML = parts.join("");
    if (useBtn) {
      useBtn.hidden = !result.rewrite;
      useBtn.dataset.rewrite = result.rewrite || "";
    }
  }

  function bindCriticalQuestionDeveloper() {
    if (!$("#cqCheck")) return;
    const saved = loadJSON(KEYS.thesisInputs, null);
    if (saved) {
      if ($("#caseName") && saved.caseName) $("#caseName").value = saved.caseName;
      if ($("#topicFolder") && saved.topicFolder) $("#topicFolder").value = saved.topicFolder;
      if ($("#criticalQuestion") && saved.question) $("#criticalQuestion").value = saved.question;
    }
    const picks = loadJSON(KEYS.ideaPicks, null);
    if (picks && picks.question && $("#criticalQuestion") && !$("#criticalQuestion").value.trim()) {
      $("#criticalQuestion").value = picks.question;
    }
    if (picks && picks.topic && $("#caseName") && !$("#caseName").value.trim()) {
      $("#caseName").value = picks.topic;
    }
    renderQuestionExample(activeEssay());

    ["caseName", "topicFolder", "criticalQuestion"].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", persistThesisInputs);
      el?.addEventListener("blur", persistThesisInputs);
    });

    $("#cqCheck").addEventListener("click", () => {
      const result = assessCriticalQuestion($("#criticalQuestion")?.value || "");
      if (result.empty) {
        setStatus($("#cqSaveStatus"), "Type or pick a question first, then check it.", false);
        renderQuestionFeedback(null);
        return;
      }
      persistThesisInputs();
      renderQuestionFeedback(result);
      setStatus($("#cqSaveStatus"), result.ok ? "Question checked and saved on this device." : "Question checked. Consider the suggested wording, then edit in your voice.", result.ok);
    });

    $("#cqUseRewrite")?.addEventListener("click", () => {
      const rewrite = $("#cqUseRewrite").dataset.rewrite || "";
      if (!rewrite || !$("#criticalQuestion")) return;
      $("#criticalQuestion").value = rewrite;
      persistThesisInputs();
      const result = assessCriticalQuestion(rewrite);
      renderQuestionFeedback(result);
      setStatus($("#cqSaveStatus"), "Suggested wording is in the box. Edit it so it sounds like you, then send it if you want to keep it.", true);
    });

    $("#cqSend").addEventListener("click", () => {
      const question = ($("#criticalQuestion")?.value || "").trim();
      if (!question) {
        setStatus($("#cqSaveStatus"), "Add a critical question before sending it to the thesis generator.", false);
        return;
      }
      const result = assessCriticalQuestion(question);
      renderQuestionFeedback(result);
      persistThesisInputs();
      const picksNow = loadJSON(KEYS.ideaPicks, {}) || {};
      saveJSON(KEYS.ideaPicks, Object.assign({}, picksNow, {
        topic: ($("#caseName")?.value || "").trim() || picksNow.topic || "",
        question,
        savedAt: Date.now()
      }));
      setStatus($("#cqSaveStatus"), "Question saved. Opening the thesis generator…", true);
      window.location.href = "thesis-helper.html";
    });

    $("#ideaResults")?.addEventListener("click", () => {
      const picksNow = readIdeaPicks();
      if (picksNow.question && $("#criticalQuestion") && !$("#criticalQuestion").value.trim()) {
        $("#criticalQuestion").value = picksNow.question;
      }
    });
  }


    /* ---------- Outline / topic sentences ---------- */

  function readOutlineInputs() {
    const thesis = loadJSON(KEYS.thesisInputs, null) || {};
    const chosen = loadJSON(KEYS.chosenClaim, null) || {};
    const prior = loadJSON(KEYS.outlineInputs, null) || {};
    const criteria = (chosen.criteria && chosen.criteria.length)
      ? chosen.criteria
      : ((prior.criteria && prior.criteria.length) ? prior.criteria : (thesis.criteria || []));
    return {
      claim: ($("#outlineClaim")?.value || "").trim(),
      caseName: ($("#outlineCase")?.value || "").trim(),
      tension: ($("#outlineTension")?.value || "").trim(),
      sourcesNote: ($("#outlineSourcesNote")?.value || "").trim(),
      criteria: Array.isArray(criteria) ? criteria : [],
      packetArgues: thesis.packetArgues || prior.packetArgues || "",
      topicFolder: chosen.topicFolder || prior.topicFolder || thesis.topicFolder || "",
      question: chosen.question || prior.question || thesis.question || ""
    };
  }

  function writeOutlineInputs(data) {
    if (!data) return;
    if ($("#outlineClaim")) $("#outlineClaim").value = data.claim || "";
    if ($("#outlineCase")) $("#outlineCase").value = data.caseName || "";
    if ($("#outlineTension")) $("#outlineTension").value = data.tension || "";
    if ($("#outlineSourcesNote")) $("#outlineSourcesNote").value = data.sourcesNote || "";
  }


  function scholarUrl(q) {
    return "https://scholar.google.com/scholar?q=" + encodeURIComponent(q);
  }

  function detectPairResearchKey(caseName) {
    const s = String(caseName || "").toLowerCase();
    if (/frankenstein/.test(s) && /dorian/.test(s)) return "frankenstein-dorian";
    if (/godzilla/.test(s) && /kong/.test(s)) return "godzilla-kong";
    if (/dracula/.test(s) && /vampire/.test(s)) return "dracula-vampire";
    return "";
  }

  const PAIR_RESEARCH_BANK = {
    "frankenstein-dorian": [
      {
        title: "The Making of Monsters: Creativity and Morality in Gothic Novels Frankenstein and The Picture of Dorian Gray",
        note: "Open-access thesis comparing creation, creativity, and morality in both novels.",
        url: "https://huskiecommons.lib.niu.edu/cgi/viewcontent.cgi?article=8256&context=allgraduate-thesesdissertations"
      },
      {
        title: "What Makes a Monster and What Makes a Man? Exploring the Relationship between the Creator and the Creation in Three Gothic Novels",
        note: "Open-access essay on creator-creation responsibility in Frankenstein, Jekyll and Hyde, and Dorian Gray.",
        url: "https://cupola.gettysburg.edu/cgi/viewcontent.cgi?article=1074&context=student_scholarship"
      },
      {
        title: "The 'Art' of Shaping Identities: Frankenstein and The Picture of Dorian Gray",
        note: "Open-access thesis on creators, creations, rejection, and identity in both novels.",
        url: "https://hdl.handle.net/10953.1/8274"
      },
      {
        title: "The Concepts of Beauty and Love in The Picture of Dorian Gray and Frankenstein",
        note: "Open-access thesis on beauty, love, prejudice, and reader response across both texts.",
        url: "https://repozitorij.ffos.hr/islandora/object/ffos:5104"
      }
    ],
    "godzilla-kong": [],
    "dracula-vampire": []
  };

  function buildResearchNextSteps(inputs, essay) {
    const pair = splitPair(inputs.caseName || "");
    const a = pair.a;
    const b = pair.b;
    const key = detectPairResearchKey(inputs.caseName || "");
    const criteria = Array.isArray(inputs.criteria) ? inputs.criteria.filter(Boolean).slice(0, 3) : [];
    const articles = (PAIR_RESEARCH_BANK[key] || []).slice();
    const searches = [
      {
        label: "Google Scholar: " + a + " AND " + b,
        url: scholarUrl('"' + a + '" AND "' + b + '"')
      },
      {
        label: "Google Scholar: " + a + " " + b + " comparison OR monstrosity",
        url: scholarUrl(a + " " + b + " (comparison OR monstrosity OR creator OR creation)")
      }
    ];
    if (criteria[0]) {
      searches.push({
        label: "Google Scholar: " + a + " " + b + " " + criteria[0],
        url: scholarUrl(a + " AND " + b + " AND (" + criteria[0] + ")")
      });
    }
    if (criteria[2]) {
      searches.push({
        label: "Google Scholar: " + a + " " + b + " " + criteria[2],
        url: scholarUrl(a + " AND " + b + " AND (" + criteria[2] + ")")
      });
    }
    return {
      pairLabel: pair.paired ? a + " and " + b : (inputs.caseName || "your figures"),
      articles,
      searches,
      libraryUrl: "https://www.alamo.edu/sac/library/",
      databasesUrl: "https://alamo.libguides.com/az/SAC",
      keywordToolUrl: "keyword-generator.html",
      hint: articles.length
        ? "Start with the linked readings below, then use Scholar and the SAC library to confirm peer-reviewed sources that fit your criteria."
        : "Use the Scholar searches below, then open the SAC library databases to locate peer-reviewed articles on your pair and criteria."
    };
  }

  function renderResearchNextSteps(host, research, opts) {
    if (!host) return;
    opts = opts || {};
    if (!research) {
      host.innerHTML = "";
      host.hidden = true;
      return;
    }
    const articles = (research.articles || [])
      .map((art) => {
        return `<li><a href="${escapeHtml(art.url)}" target="_blank" rel="noopener">${escapeHtml(art.title)}</a>
          <span class="hint-block" style="display:block;margin:0.15rem 0 0.55rem;">${escapeHtml(art.note || "")}</span></li>`;
      })
      .join("");
    const searches = (research.searches || [])
      .map((s) => `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a></li>`)
      .join("");
    const keywordBtn = opts.omitKeywordLink
      ? ""
      : `<a class="button small ghost" href="${escapeHtml(research.keywordToolUrl)}">Keyword generator</a>`;
    const tip = opts.omitKeywordLink
      ? `<p class="hint-block" style="margin-top:0.65rem;">Use the keyword chips and Boolean tips above with Scholar and A to Z databases.</p>`
      : "";
    host.innerHTML = `
      <h2 class="eyebrow" style="margin-top:1.5rem;">Research for ${escapeHtml(research.pairLabel || "your pair")}</h2>
      <p class="hint-block">${escapeHtml(research.hint || "")}</p>
      ${articles ? `<h3 class="idea-column-title">Starter readings (open access)</h3><ul class="research-article-list">${articles}</ul>` : ""}
      <h3 class="idea-column-title">Search these next</h3>
      <ul class="research-search-list">${searches}</ul>
      <div class="hero-actions" style="margin-top:0.75rem;">
        <a class="button small primary" href="${escapeHtml(research.libraryUrl)}" target="_blank" rel="noopener">SAC Library</a>
        <a class="button small ghost" href="${escapeHtml(research.databasesUrl)}" target="_blank" rel="noopener">A to Z databases</a>
        ${keywordBtn}
      </div>
      ${tip}`;
    host.hidden = false;
  }

  function shouldShowPairResearch(inputs, essay) {
    const id = (essay && essay.id) || "";
    const kind = (essay && essay.claimKind) || "";
    if (id === "monster-comparison" || kind === "comparison") return true;
    const caseName = (inputs && inputs.caseName) || "";
    if (detectPairResearchKey(caseName)) return true;
    return !!splitPair(caseName).paired;
  }

  function gatherResearchInputs(base) {
    const chosen = loadJSON(KEYS.chosenClaim, null) || {};
    const thesis = loadJSON(KEYS.thesisInputs, null) || {};
    const outline = loadJSON(KEYS.outlineInputs, null) || {};
    const caseName = (base && base.caseName) || chosen.caseName || outline.caseName || thesis.caseName || "";
    let criteria = [];
    if (base && Array.isArray(base.criteria) && base.criteria.length) criteria = base.criteria;
    else if (Array.isArray(chosen.criteria) && chosen.criteria.length) criteria = chosen.criteria;
    else if (Array.isArray(thesis.criteria) && thesis.criteria.length) criteria = thesis.criteria;
    else if (Array.isArray(outline.criteria) && outline.criteria.length) criteria = outline.criteria;
    const essay = activeEssay();
    if ((!criteria || !criteria.length) && essay && essay.claimKind === "comparison") {
      criteria = comparisonDefaults({ caseName, criteria: [] }, essay).criteria;
    }
    return {
      caseName,
      criteria: Array.isArray(criteria) ? criteria.filter(Boolean).slice(0, 3) : [],
      tension: (base && base.tension) || chosen.tension || outline.tension || "",
      claim: (base && base.claim) || chosen.claim || outline.claim || ""
    };
  }


  function caseStudyOutlineLenses() {
    const romans = ["II", "III", "IV", "V", "VI"];
    const preview = joinNatural(CS_CRITERIA.map((c) => c.label));
    const bodyCues = ["Topic sentence", "Packet detail 1, cited", "Packet detail 2, cited", "Outside source, cited (one or both of your 2 outside sources)", "Your analysis, at least as long as the evidence"];
    const list = [{
      title: "I. Introduction",
      topic: "Name your packet and topic folder, give brief context, state your critical question, and end with a thesis that previews all five lenses, in order (" + preview + ").",
      cues: ["Packet and topic folder", "Context in 3 to 4 bullets", "Critical question", "Thesis that previews all five lenses"]
    }];
    CS_CRITERIA.forEach((c, i) => {
      list.push({
        title: romans[i] + ". " + c.label,
        topic: c.id === "limits"
          ? "What can the packet tell us, and what can it not? Fold limitations and ethical tensions into this lens, not a separate section."
          : "How this lens applies to the packet.",
        cues: bodyCues.slice(),
        roleHint: c.id
      });
    });
    list.push({
      title: "VII. Conclusion",
      topic: "State what a careful reader can now understand about the case. Do not add a new thesis.",
      cues: ["What a careful reader now understands", "No new thesis"]
    });
    return list;
  }

  function buildOutline(inputs) {
    const essay = activeEssay();
    const kind = (essay && essay.claimKind) || "generic";
    const caseName = inputs.caseName || "this subject";
    const tension = trimSnippet(inputs.tension, 110) || "the central tension or insight";
    const claim = trimSnippet(inputs.claim, 200) || "Working thesis / controlling idea";
    const question = trimSnippet(inputs.question || "", 120);
    const topicFolder = trimSnippet(inputs.topicFolder || "", 80);
    const sourcesNote = trimSnippet(inputs.sourcesNote, 160);
    const lenses = (essay && essay.outlineLenses && essay.outlineLenses.length)
      ? essay.outlineLenses
      : null;

    const defaultLenses = [
      { title: "I. Introduction", topic: "Open with context, then state the working thesis or controlling idea.", cues: ["Context", "Thesis / controlling idea", "Preview"] },
      { title: "II. Background", topic: "Give readers what they need before the main points.", cues: ["Definitions", "Scope", "Shared facts"] },
      { title: "III. Main point 1", topic: "Develop the first main point with evidence.", cues: ["Topic sentence", "Evidence", "Analysis"] },
      { title: "IV. Main point 2", topic: "Develop the second main point without repeating point 1.", cues: ["Distinct point", "Evidence", "Link to thesis"] },
      { title: "V. Complication or deeper point", topic: "Address the central tension or insight so the thesis earns complexity.", cues: ["Complication", "Evidence", "Return to thesis"] },
      { title: "VI. Conclusion", topic: "Restate the thesis in fresh words and name the so-what.", cues: ["Fresh restatement", "So-what", "No new major claim"] }
    ];

    let list = (lenses || defaultLenses).map((lens) => ({ ...lens, cues: (lens.cues || []).slice() }));
    if (kind === "case-study") {
      list = caseStudyOutlineLenses();
    }
    if (kind === "comparison") {
      const dCrit = comparisonDefaults(inputs, essay).criteria;
      list = list.map((lens, idx) => {
        const title = String(lens.title || "");
        if (/criterion 1/i.test(title) && dCrit[0]) return { ...lens, title: `II. Criterion 1: ${dCrit[0]}` };
        if (/criterion 2/i.test(title) && dCrit[1]) return { ...lens, title: `III. Criterion 2: ${dCrit[1]}` };
        if (/criterion 3/i.test(title) && dCrit[2]) return { ...lens, title: `IV. Criterion 3: ${dCrit[2]}` };
        return lens;
      });
    }
    const total = list.length;

    function roleOf(title, i) {
      const t = String(title || "").toLowerCase();
      if (i === 0 || /intro|opening|opening scene|opening claim/.test(t)) return "intro";
      if (i === total - 1 || /conclu|closing/.test(t)) return "conclusion";
      if (/background|context|definition|plate label/.test(t)) return "background";
      if (/counter|opposing|reply/.test(t)) return "counter";
      if (/stakeholder/.test(t)) return "stakeholders";
      if (/limitations and ethics|ethical/.test(t)) return "limits";
      if (/outside sources plan|sources plan/.test(t)) return "sources-plan";
      if (/evidence quality/.test(t) || /(^|\.\s)evidence\b/.test(t) || /^iv\.\s*evidence\b/.test(t)) return "evidence";
      if (/assumption/.test(t)) return "assumptions";
      if (/limit/.test(t) && !/limited/.test(t)) return "limits";
      if (/misunderstand|myth|caution|newcomer tip/.test(t)) return "clarify";
      if (/reflect|remaining goal|turning point|early evidence|later evidence|climax|rising|criterion/.test(t)) return "body";
      if (/reason|main point|how it works|cause|process|framing|problem/.test(t)) return "body";
      if (i === 1) return "background";
      return "body";
    }

    function topicSentence(lens, i) {
      const role = roleOf(lens.title, i);
      const focus = topicFolder ? `${caseName} (${topicFolder})` : caseName;
      const qBit = question ? ` Guided by “${question},”` : "";

      if (kind === "argument") {
        if (role === "intro") return `On ${focus}, this draft argues that ${claim}`;
        if (role === "background") return `Before the reasons, readers need shared facts and terms about ${focus}.`;
        if (role === "counter") return `A fair opposing view says the common stance on ${focus} should hold; the reply is that ${tension}.`;
        if (role === "conclusion") return `In short, ${claim} — and the stake for readers is that ${tension}.`;
        if (i === 2) return `The strongest reason supporting the claim about ${focus} is that ${tension}.`;
        if (i === 3) return `A second, distinct reason is that evidence about ${focus} still points toward ${tension}.`;
        return `This section advances the claim on ${focus} by showing how ${tension}.`;
      }

      if (kind === "exposition") {
        if (role === "intro") {
          const lead = question ? `Guided by “${question},” this essay explains ${focus}: ${claim}` : `This essay explains ${focus}: ${claim}`;
          return lead;
        }
        if (role === "background") return `To follow the explanation of ${focus}, readers need clear definitions and a limited scope.`;
        if (role === "clarify") return `A common misunderstanding about ${focus} is worth correcting with evidence: ${tension}.`;
        if (role === "conclusion") return `A careful reader should now understand ${focus} as ${tension}, without needing a side to take.`;
        if (/how it works|main explanation|process/i.test(lens.title || "")) {
          return /^how\b/i.test(String(caseName))
            ? `Explaining ${focus} shows why ${tension}.`
            : `Explaining how ${focus} works shows why ${tension}.`;
        }
        if (/cause|effect|mechanism|why it matters/i.test(lens.title || "")) {
          return `Tracing causes and effects in ${focus} deepens the controlling idea that ${tension}.`;
        }
        if (/plate/i.test(lens.title || "")) {
          return `In clear order, the guide names ${focus} for its audience and matches the plate labels in prose.`;
        }
        return `This explanatory section on ${focus} develops the how/why focus: ${tension}.`;
      }

      if (kind === "comparison") {
        const d = comparisonDefaults(
          {
            caseName,
            tension: inputs.tension,
            packetArgues: inputs.packetArgues || "",
            topicFolder,
            criteria: inputs.criteria || []
          },
          essay
        );
        const { a, b } = d.pair;
        const crit = d.criteria;
        const insight = trimSnippet(d.tension, 120);
        const category = d.category;

        function similarityUnder(criterion) {
          const c = String(criterion || "").toLowerCase();
          if (/creat|origin|chang|made|born|becom/.test(c)) {
            return `${a} and ${b} are alike in that both are reshaped by a force outside ordinary life`;
          }
          if (/want|desire|ambition|goal/.test(c)) {
            return `${a} and ${b} are alike in that both pursue something they treat as necessary`;
          }
          if (/judge|sympath|fear|blame|reader|audience|pity/.test(c)) {
            return `${a} and ${b} are alike in that both invite a strong response from readers`;
          }
          if (/power|control|domin/.test(c)) {
            return `${a} and ${b} are alike in that both hold or seek power over others`;
          }
          if (/public|private|image|face|secret/.test(c)) {
            return `${a} and ${b} are alike in that both maintain a public face and a private reality`;
          }
          if (/harm|violence|damage|threat/.test(c)) {
            return `${a} and ${b} are alike in that both cause harm that the story must explain`;
          }
          if (/responsib|guilt|blame/.test(c)) {
            return `${a} and ${b} are alike in that both raise a question of who is responsible`;
          }
          return `${a} and ${b} are alike in that both can be judged under “${criterion}”`;
        }

        function differenceUnder(criterion, idx) {
          const c = String(criterion || "").toLowerCase();
          const raw = String(inputs.tension || insight || "").trim();
          const split = raw.split(/\s*;\s*|\s+while\s+|\s+whereas\s+/i);
          if (split.length >= 2) {
            const left = trimSnippet(split[0], 70);
            const right = trimSnippet(split[1], 70);
            if (idx === 0) return `${left}, unlike ${right}`;
            if (idx === 1) return `${a} and ${b} part ways here: ${left}; ${right}`;
            return `the contrast under this lens is that ${lowerFirst(left)}, while ${lowerFirst(right)}`;
          }
          if (/creat|origin|chang|made|born|becom/.test(c)) {
            return `${a} is shaped mainly by another person's act, while ${b} is shaped mainly by chosen self-fashioning`;
          }
          if (/want|desire|ambition|goal/.test(c)) {
            return `${a} seeks recognition or belonging, while ${b} seeks pleasure, beauty, or escape from consequence`;
          }
          if (/judge|sympath|fear|blame|reader|audience|pity/.test(c)) {
            return `readers are pushed to sympathize with ${a} more readily than with ${b}, or to assign blame differently`;
          }
          if (/power|control|domin/.test(c)) {
            return `${a} and ${b} use power for different ends and with different visibility`;
          }
          if (/public|private|image|face|secret/.test(c)) {
            return `${a}'s private truth is forced into the open, while ${b} works to keep private truth hidden`;
          }
          if (/harm|violence|damage|threat/.test(c)) {
            return `the harm around ${a} is explained differently from the harm around ${b}`;
          }
          return `${a} and ${b} do not end in the same place under “${criterion}”`;
        }

        if (role === "intro") {
          return `This essay compares ${a} and ${b} as figures in ${category}, using three shared criteria to support one insight: ${insight}.`;
        }
        if (role === "conclusion") {
          return `After the same three criteria, the useful takeaway is not a trait list; it is that ${lowerFirst(insight)}.`;
        }

        let cIdx = 0;
        if (/criterion 2/i.test(lens.title || "") || i === 2) cIdx = 1;
        else if (/criterion 3/i.test(lens.title || "") || i === 3) cIdx = 2;
        else if (/criterion 1/i.test(lens.title || "") || i === 1) cIdx = 0;
        else cIdx = Math.min(Math.max(i - 1, 0), crit.length - 1);
        const criterion = crit[cIdx] || crit[0];
        const sim = similarityUnder(criterion);
        const diff = differenceUnder(criterion, cIdx);
        return `${sim}, but they differ in that ${lowerFirst(diff)}.`;
      }

      if (kind === "narrative") {
        if (role === "intro") return `The narrative of ${focus} opens in a concrete moment that already points toward ${tension}.`;
        if (/background/i.test(lens.title || "")) return `Only the background a reader needs about ${focus} belongs here — enough to follow the quest.`;
        if (/rising/i.test(lens.title || "")) return `In the middle of the quest around ${focus}, scenes show what I wanted versus what happened.`;
        if (/climax|shift/i.test(lens.title || "")) return `The shift in ${focus} comes when ${tension}.`;
        if (/reflect/i.test(lens.title || "")) return `Reflection on ${focus} earns the insight that ${tension} without announcing a moral.`;
        if (role === "conclusion") return `The closing image returns to ${focus} and holds the insight: ${tension}.`;
        return `This section of the quest narrative keeps ${focus} in scene while moving toward ${tension}.`;
      }

      if (kind === "case-study") {
        if (role === "intro") return `This critical analysis of ${focus} answers the critical question with a thesis that previews all five lenses, in order: ${claim}`;
        if (role === "background" || /framing/i.test(lens.title || "")) {
          return `The packet frames ${focus} in a way that soft-pedals ${tension}.`;
        }
        if (role === "stakeholders") return `Who the ${focus} materials center, and whose voices are missing, matters once ${tension} is visible.`;
        if (role === "evidence") return `The packet's evidence about ${focus} looks settled until ${tension} tests whether it is data or branding.`;
        if (role === "assumptions") return `The ${focus} packet treats an assumption as obvious. Naming it shows how ${tension} unsettles the story.`;
        if (role === "limits") return `The packet is persuasive in places about ${focus}, yet its limits around ${tension}, including gaps, biases, or ethical tensions, weaken the overall thesis.`;
        if (role === "conclusion") return `A careful reader should take away that ${claim}, especially given ${tension}. Do not add a new thesis.`;
        return `This section on ${focus} advances the claim by keeping ${tension} in view. Use two cited packet details and one or both of your 2 outside sources.`;
      }

      if (kind === "reflection") {
        if (role === "intro") return `Across this term, my work on ${focus} supports this growth claim: ${claim}`;
        if (/early/i.test(lens.title || "")) return `Early evidence from ${focus} shows where I started and what limited me then.`;
        if (/turning/i.test(lens.title || "")) return `A turning point in my process for ${focus} came when ${tension}.`;
        if (/later/i.test(lens.title || "")) return `Later drafts connected to ${focus} show the new habit without pretending the work is finished.`;
        if (/goal/i.test(lens.title || "")) return `Remaining goals grow from the evidence above: I still need to keep working on ${tension}.`;
        if (role === "conclusion") return `Looking back on ${focus}, the takeaway is ${claim} — with honest next steps still attached.`;
        return `This part of the reflection uses concrete work on ${focus} to support ${tension}.`;
      }

      // generic
      if (role === "intro") return `This draft centers ${focus} with a working thesis: ${claim}`;
      if (role === "background") return `Readers need brief context and scope on ${focus} before the main points.`;
      if (role === "conclusion") return `In fresh words, ${claim} — so what remains is why ${tension} matters for the reader.`;
      if (i === 2) return `The first main point about ${focus} is that ${tension}.`;
      if (i === 3) return `A second point develops ${focus} without repeating the first: evidence still leads toward ${tension}.`;
      return `This section complicates or deepens the thesis on ${focus} by staying with ${tension}.`;
    }

    const sections = list.map((lens, i) => {
      let cues = (lens.cues || []).slice();
      const topic = topicSentence(lens, i);
      if (kind === "comparison") {
        const d = comparisonDefaults(inputs, essay);
        const { a, b } = d.pair;
        const crit = d.criteria;
        let cIdx = -1;
        if (/criterion 1/i.test(lens.title || "") || i === 1) cIdx = 0;
        else if (/criterion 2/i.test(lens.title || "") || i === 2) cIdx = 1;
        else if (/criterion 3/i.test(lens.title || "") || i === 3) cIdx = 2;
        if (i === 0) {
          cues = [
            "Working thesis: " + claim,
            "Name both figures and the shared category in one or two sentences",
            "Preview the three criteria without listing every trait",
            question ? "Focusing question: " + question : ""
          ].filter(Boolean);
        } else if (cIdx >= 0) {
          cues = [
            "Shared point under this criterion (what is alike about " + a + " and " + b + ")",
            "Difference under this criterion (where " + a + " and " + b + " part ways)",
            "Evidence for " + a,
            "Evidence for " + b,
            "One sentence linking this criterion to the insight (do not only restate the full thesis)"
          ];
        } else if (i === list.length - 1) {
          cues = [
            "Restate the insight in fresh words",
            "Say what the comparison shows beyond a trait list",
            "No new figures or new criteria"
          ];
        }
      } else {
        if (i === 0 && claim) cues.unshift("Working thesis: " + claim);
        if (question && i === 0) cues.push("Focusing question: " + question);
        if (sourcesNote && /source/i.test(lens.title || "")) cues.push(sourcesNote);
        if (!cues.length) cues.push("Evidence", "Analysis", "Link to thesis");
      }
      const role = roleOf(lens.title, i);
      const isTopic = role !== "intro" && role !== "conclusion";
      return {
        title: lens.title,
        topic,
        cues,
        bullets: cues.slice(),
        role,
        isTopicSentence: isTopic,
        sentenceLabel: isTopic ? "Topic sentence" : (role === "intro" ? "Opening plan" : "Closing plan")
      };
    });

    return {
      claim,
      caseName,
      tension,
      question: question || "",
      topicFolder: topicFolder || "",
      essayId: (essay && essay.id) || "",
      essayLabel: essayLabel(),
      sections
    };
  }

  function renderOutline(skeleton) {
    const body = $("#outlineBody");
    const results = $("#outlineResults");
    if (!body || !results) return;
    if (!skeleton || !skeleton.sections) {
      results.hidden = true;
      body.innerHTML = "";
      const oldResearch = document.getElementById("outlineResearch");
      if (oldResearch) oldResearch.remove();
      return;
    }
    body.innerHTML = skeleton.sections
      .map((sec, i) => {
        const label = sec.sentenceLabel || (sec.isTopicSentence === false ? "Section plan" : "Topic sentence");
        const isTopic = sec.isTopicSentence !== false && label === "Topic sentence";
        const copyLabel = isTopic ? "Copy topic sentence" : "Copy section plan";
        return `<article class="outline-section" data-sec="${i}" data-role="${escapeHtml(sec.role || "")}">
          <header class="outline-section-head">
            <h3>${escapeHtml(sec.title)}</h3>
            <button type="button" class="button small ghost" data-copy-topic="${i}">${copyLabel}</button>
          </header>
          <p class="topic-sentence"><span class="topic-label">${escapeHtml(label)}</span>${escapeHtml(sec.topic)}</p>
          <ul>${(sec.bullets || sec.cues || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
        </article>`;
      })
      .join("");

    let researchHost = document.getElementById("outlineResearch");
    if (!researchHost) {
      researchHost = document.createElement("div");
      researchHost.id = "outlineResearch";
      researchHost.className = "outline-research";
      results.appendChild(researchHost);
    }
    const essay = activeEssay();
    const showPush = essay && (essay.id === "monster-comparison" || essay.claimKind === "comparison");
    const pairLabel = skeleton.caseName
      ? (splitPair(skeleton.caseName).paired
          ? splitPair(skeleton.caseName).a + " and " + splitPair(skeleton.caseName).b
          : skeleton.caseName)
      : "your pair";
    if (showPush) {
      researchHost.innerHTML = `
        <h2 class="eyebrow" style="margin-top:1.5rem;">Next: research</h2>
        <p class="hint-block">Open Keyword generator for research next steps for ${escapeHtml(pairLabel)}. It uses your essay and pair when saved on this device.</p>
        <div class="hero-actions" style="margin-top:0.75rem;">
          <a class="button small primary" href="keyword-generator.html?from=outline">Keyword generator / research</a>
        </div>`;
      researchHost.hidden = false;
    } else {
      researchHost.innerHTML = `
        <p class="hint-block" style="margin-top:1rem;">For search keywords and library queries next, open the Keyword generator.</p>
        <div class="hero-actions" style="margin-top:0.5rem;">
          <a class="button small ghost" href="keyword-generator.html?from=outline">Keyword generator</a>
        </div>`;
      researchHost.hidden = false;
    }
    results.hidden = false;
  }

  function outlinePlainText(skeleton) {
    if (!skeleton) return "";
    const lines = ["Working thesis: " + skeleton.claim, ""];
    skeleton.sections.forEach((sec) => {
      lines.push(sec.title);
      lines.push((sec.sentenceLabel || (sec.isTopicSentence === false ? "Section plan" : "Topic sentence")) + ": " + sec.topic);
      (sec.bullets || sec.cues || []).forEach((b) => lines.push("  - " + b));
      lines.push("");
    });
    lines.push("Next: Keyword generator / research for search tips, starter readings, and library links.");
    lines.push("");
    return lines.join("\n");
  }

  function bindOutlineHelper() {
    if (!$("#outlineGenerate")) return;

    const chosen = loadJSON(KEYS.chosenClaim, null);
    const saved = loadJSON(KEYS.outlineInputs, null);
    if (chosen && (!saved || !saved.claim)) {
      writeOutlineInputs({
        claim: chosen.claim || "",
        caseName: chosen.caseName || "",
        tension: chosen.tension || "",
        sourcesNote: ""
      });
      setStatus($("#outlineSaveStatus"), "Loaded thesis from thesis generator.", true);
    } else if (saved) {
      writeOutlineInputs(saved);
    } else if (chosen) {
      writeOutlineInputs({
        claim: chosen.claim || "",
        caseName: chosen.caseName || "",
        tension: chosen.tension || "",
        sourcesNote: (saved && saved.sourcesNote) || ""
      });
    }

    const skeleton = loadJSON(KEYS.outlineSkeleton, null);
    if (skeleton) renderOutline(skeleton);

    ["outlineClaim", "outlineCase", "outlineTension", "outlineSourcesNote"].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", () => {
        saveJSON(KEYS.outlineInputs, readOutlineInputs());
        setStatus($("#outlineSaveStatus"), "Outline fields saved locally.", true);
      });
      el?.addEventListener("blur", () => {
        saveJSON(KEYS.outlineInputs, readOutlineInputs());
      });
    });

    $("#outlineGenerate").addEventListener("click", () => {
      const inputs = readOutlineInputs();
      if (!inputs.claim) {
        setStatus($("#outlineSaveStatus"), "Add a working thesis first (or generate one in the thesis tool).", false);
        return;
      }
      const chosenNow = loadJSON(KEYS.chosenClaim, null) || {};
      const thesisIn = loadJSON(KEYS.thesisInputs, null) || {};
      inputs.question = inputs.question || chosenNow.question || thesisIn.question || "";
      inputs.topicFolder = inputs.topicFolder || chosenNow.topicFolder || thesisIn.topicFolder || "";
      inputs.criteria = inputs.criteria || chosenNow.criteria || thesisIn.criteria || [];
      const skeleton = buildOutline(inputs);
      saveJSON(KEYS.outlineInputs, inputs);
      saveJSON(KEYS.outlineSkeleton, skeleton);
      saveJSON(KEYS.chosenClaim, Object.assign({}, chosenNow, {
        claim: inputs.claim,
        caseName: inputs.caseName,
        tension: inputs.tension,
        topicFolder: inputs.topicFolder || chosenNow.topicFolder || "",
        question: inputs.question || chosenNow.question || "",
        criteria: inputs.criteria || chosenNow.criteria || [],
        savedAt: Date.now()
      }));
      renderOutline(skeleton);
      setStatus($("#outlineSaveStatus"), "Outline + topic sentences generated · saved locally.", true);
    });

    $("#outlineClear")?.addEventListener("click", () => {
      writeOutlineInputs({ claim: "", caseName: "", tension: "", sourcesNote: "" });
      saveJSON(KEYS.outlineInputs, readOutlineInputs());
      saveJSON(KEYS.outlineSkeleton, null);
      renderOutline(null);
      setStatus($("#outlineSaveStatus"), "Cleared.", false);
    });

    $("#outlineCopyAll")?.addEventListener("click", () => {
      const skeleton = loadJSON(KEYS.outlineSkeleton, null);
      const text = outlinePlainText(skeleton);
      if (!text) return;
      navigator.clipboard?.writeText(text).then(
        () => setStatus($("#outlineSaveStatus"), "Full outline copied.", true),
        () => setStatus($("#outlineSaveStatus"), "Select the outline and copy manually.", false)
      );
    });

    $("#outlineBody")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy-topic]");
      if (!btn) return;
      const skeleton = loadJSON(KEYS.outlineSkeleton, null);
      const sec = skeleton?.sections?.[Number(btn.getAttribute("data-copy-topic"))];
      if (!sec) return;
      navigator.clipboard?.writeText(sec.topic).then(
        () => setStatus($("#outlineSaveStatus"), "Topic sentence copied.", true),
        () => setStatus($("#outlineSaveStatus"), "Copy manually from the topic sentence.", false)
      );
    });
  }

  /* ---------- MLA citation practice generator ---------- */

  const MLA_TYPE_HINTS = {
    website: "Web page on a site. Title of the page in quotation marks; site name italicized.",
    article: "Online news or magazine article. Article title in quotes; newspaper/magazine italicized.",
    journal: "Scholarly journal article. Include volume, issue, pages, and DOI when you have them.",
    book: "Print or ebook. Book title italicized; publisher + year.",
    film: "Film or TV episode/series. Title italicized; director or key contributor; studio/year; optional platform.",
    packet: "Course packet, case brief, or handout (often a Drive/Docs container). Treat like a web document: title, organization/collection, date if known, URL."
  };

  const MLA_TITLE_HINTS = {
    website: "Title of the page or document",
    article: "Article headline",
    journal: "Article title",
    book: "Book title",
    film: "Film or episode / series title",
    packet: "Packet, case brief, or handout title"
  };

  const MLA_CONTAINER_HINTS = {
    website: "Website name",
    article: "Newspaper or magazine name",
    journal: "Journal name",
    packet: "Collection / course folder name"
  };

  const MLA_PUBLISHER_HINTS = {
    website: "Publisher or sponsoring org (skip if identical to site name)",
    book: "Publisher",
    packet: "Hosting org (e.g. Google Drive, your college, instructor materials)",
    film: "Studio or distributor"
  };

  const MLA_FIELD_IDS = [
    "mlaAuthor",
    "mlaDirector",
    "mlaContributorRole",
    "mlaTitleField",
    "mlaContainer",
    "mlaPublisher",
    "mlaVolume",
    "mlaIssue",
    "mlaPages",
    "mlaDate",
    "mlaUrl",
    "mlaPlatform",
    "mlaAccess"
  ];

  function currentMlaType() {
    const active = document.querySelector(".mla-type-chip[aria-pressed='true']");
    return (active && active.dataset.type) || "website";
  }

  function endDot(s) {
    const t = (s || "").trim();
    if (!t) return "";
    return /[.!?]$/.test(t) ? t : t + ".";
  }

  function stripUrlProtocol(url) {
    return (url || "").trim().replace(/^https?:\/\//i, "");
  }

  function shortTitle(title, max) {
    const t = (title || "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 12 ? cut.slice(0, lastSpace) : cut).replace(/[,:;]+$/, "");
  }

  function authorLastName(author) {
    const a = (author || "").trim();
    if (!a) return "";
    if (a.includes(",")) return a.split(",")[0].trim();
    const parts = a.split(/\s+/);
    return parts[parts.length - 1];
  }

  function joinParts(parts) {
    return parts
      .filter(Boolean)
      .join(" ")
      .replace(/\s+,/g, ",")
      .replace(/,\./g, ".")
      .replace(/\s+\./g, ".")
      .replace(/\.\./g, ".")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function readMlaInputs() {
    const data = { type: currentMlaType() };
    MLA_FIELD_IDS.forEach((id) => {
      const el = document.getElementById(id);
      data[id] = el ? el.value.trim() : "";
    });
    return data;
  }

  function writeMlaInputs(data) {
    if (!data) return;
    MLA_FIELD_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = data[id] || "";
    });
    if (data.type) setMlaType(data.type, { skipPersist: true });
  }

  function setMlaType(type, opts) {
    const skipPersist = opts && opts.skipPersist;
    $$(".mla-type-chip").forEach((btn) => {
      const on = btn.dataset.type === type;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.classList.toggle("active", on);
    });
    $$("#mlaFields .mla-f").forEach((lab) => {
      const forTypes = (lab.getAttribute("data-for") || "").split(/\s+/);
      lab.hidden = !forTypes.includes(type);
    });
    const hint = $("#mlaTypeHint");
    if (hint) hint.textContent = MLA_TYPE_HINTS[type] || "";
    const titleHint = $("#mlaTitleHint");
    if (titleHint) titleHint.textContent = MLA_TITLE_HINTS[type] || "Title";
    const containerHint = $("#mlaContainerHint");
    if (containerHint && MLA_CONTAINER_HINTS[type]) containerHint.textContent = MLA_CONTAINER_HINTS[type];
    const pubHint = $("#mlaPublisherHint");
    if (pubHint && MLA_PUBLISHER_HINTS[type]) pubHint.textContent = MLA_PUBLISHER_HINTS[type];
    const authorHint = $("#mlaAuthorHint");
    if (authorHint) {
      authorHint.textContent =
        type === "packet"
          ? "Last, First if a named author/editor; leave blank for org-only packets"
          : "Last, First — leave blank if no named author";
    }
    const titleEl = $("#mlaTitleField");
    if (titleEl) {
      const placeholders = {
        website: "Title of the Page",
        article: "Headline of the Article",
        journal: "Title of the Article",
        book: "Title of the Book",
        film: "Title of the Film or Episode",
        packet: "Title of the Packet or Handout"
      };
      titleEl.placeholder = placeholders[type] || "Title";
    }
    if (!skipPersist) persistMlaDraft(false);
  }

  function quotedTitleHtml(t) {
    if (!t) return "";
    const esc = escapeHtml(t);
    if (/[.!?]$/.test(t)) return "\u201C" + esc.slice(0, -1) + esc.slice(-1) + "\u201D";
    return "\u201C" + esc + ".\u201D";
  }

  function quotedTitlePlain(t) {
    if (!t) return "";
    if (/[.!?]$/.test(t)) return "\u201C" + t.slice(0, -1) + t.slice(-1) + "\u201D";
    return "\u201C" + t + ".\u201D";
  }

  function emHtml(t) {
    return t ? "<em>" + escapeHtml(t) + "</em>" : "";
  }

  function buildMlaCitationSafe(data) {
    const type = data.type || "website";
    const author = (data.mlaAuthor || "").trim();
    const director = (data.mlaDirector || "").trim();
    const role = ((data.mlaContributorRole || "director").trim() || "director");
    const title = (data.mlaTitleField || "").trim();
    const container = (data.mlaContainer || "").trim();
    const publisher = (data.mlaPublisher || "").trim();
    const volume = (data.mlaVolume || "").trim();
    const issue = (data.mlaIssue || "").trim();
    const pages = (data.mlaPages || "").trim();
    const date = (data.mlaDate || "").trim();
    const url = (data.mlaUrl || "").trim();
    const platform = (data.mlaPlatform || "").trim();
    const access = (data.mlaAccess || "").trim();
    const urlDisp = stripUrlProtocol(url);

    const missing = [];
    if (type === "film") {
      if (!title) missing.push("film / episode title");
    } else if (!title && !author) {
      missing.push(type === "packet" ? "packet / handout title (or author)" : "author or title");
    }

    const htmlParts = [];
    const plainParts = [];
    let inText = "\u2014";
    let inTextPlain = "\u2014";

    if (type === "website" || type === "article" || type === "packet") {
      if (author) {
        htmlParts.push(escapeHtml(endDot(author)));
        plainParts.push(endDot(author));
      }
      if (title) {
        htmlParts.push(quotedTitleHtml(title));
        plainParts.push(quotedTitlePlain(title));
      }
      if (container) {
        htmlParts.push(emHtml(container) + ",");
        plainParts.push(container + ",");
      }
      if (type !== "article" && publisher && publisher.toLowerCase() !== container.toLowerCase()) {
        htmlParts.push(escapeHtml(publisher) + ",");
        plainParts.push(publisher + ",");
      }
      if (date) {
        htmlParts.push(escapeHtml(date) + (urlDisp || access ? "," : "."));
        plainParts.push(date + (urlDisp || access ? "," : "."));
      }
      if (urlDisp) {
        htmlParts.push(escapeHtml(urlDisp) + (access ? "," : "."));
        plainParts.push(urlDisp + (access ? "," : "."));
      }
      if (access) {
        htmlParts.push("Accessed " + escapeHtml(access) + ".");
        plainParts.push("Accessed " + access + ".");
      }
      if (author) {
        inText = "(" + escapeHtml(authorLastName(author)) + ")";
        inTextPlain = "(" + authorLastName(author) + ")";
      } else if (title) {
        inText = "(\u201C" + escapeHtml(shortTitle(title, 40)) + "\u201D)";
        inTextPlain = "(\u201C" + shortTitle(title, 40) + "\u201D)";
      }
    } else if (type === "journal") {
      if (author) {
        htmlParts.push(escapeHtml(endDot(author)));
        plainParts.push(endDot(author));
      }
      if (title) {
        htmlParts.push(quotedTitleHtml(title));
        plainParts.push(quotedTitlePlain(title));
      }
      if (container) {
        htmlParts.push(emHtml(container) + ",");
        plainParts.push(container + ",");
      }
      let volIssue = "";
      if (volume) volIssue += "vol. " + volume;
      if (issue) volIssue += (volIssue ? ", " : "") + "no. " + issue;
      if (volIssue) {
        htmlParts.push(escapeHtml(volIssue) + ",");
        plainParts.push(volIssue + ",");
      }
      if (date) {
        htmlParts.push(escapeHtml(date) + ",");
        plainParts.push(date + ",");
      }
      if (pages) {
        htmlParts.push("pp. " + escapeHtml(pages) + (urlDisp ? "," : "."));
        plainParts.push("pp. " + pages + (urlDisp ? "," : "."));
      } else if (!urlDisp && plainParts.length) {
        const last = plainParts[plainParts.length - 1];
        if (last && last.endsWith(",")) {
          plainParts[plainParts.length - 1] = last.slice(0, -1) + ".";
          htmlParts[htmlParts.length - 1] = htmlParts[htmlParts.length - 1].replace(/,$/, ".");
        }
      }
      if (urlDisp) {
        htmlParts.push(escapeHtml(urlDisp) + ".");
        plainParts.push(urlDisp + ".");
      }
      if (author) {
        const loc = pages ? " " + pages.split(/[-–]/)[0].trim() : "";
        inText = "(" + escapeHtml(authorLastName(author)) + escapeHtml(loc) + ")";
        inTextPlain = "(" + authorLastName(author) + loc + ")";
      } else if (title) {
        inText = "(\u201C" + escapeHtml(shortTitle(title, 40)) + "\u201D)";
        inTextPlain = "(\u201C" + shortTitle(title, 40) + "\u201D)";
      }
    } else if (type === "book") {
      if (author) {
        htmlParts.push(escapeHtml(endDot(author)));
        plainParts.push(endDot(author));
      }
      if (title) {
        htmlParts.push(emHtml(title) + ".");
        plainParts.push(title + ".");
      }
      if (publisher) {
        htmlParts.push(escapeHtml(publisher) + (date ? "," : "."));
        plainParts.push(publisher + (date ? "," : "."));
      }
      if (date) {
        htmlParts.push(escapeHtml(date) + ".");
        plainParts.push(date + ".");
      }
      if (author) {
        inText = "(" + escapeHtml(authorLastName(author)) + ")";
        inTextPlain = "(" + authorLastName(author) + ")";
      } else if (title) {
        inText = "(" + emHtml(shortTitle(title, 40)) + ")";
        inTextPlain = "(" + shortTitle(title, 40) + ")";
      }
    } else if (type === "film") {
      if (title) {
        htmlParts.push(emHtml(title) + ".");
        plainParts.push(title + ".");
      }
      if (director) {
        if (director.includes(",")) {
          htmlParts.push(escapeHtml(director) + ", " + escapeHtml(role) + ".");
          plainParts.push(director + ", " + role + ".");
        } else {
          const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
          htmlParts.push(escapeHtml(roleLabel) + " by " + escapeHtml(director) + ".");
          plainParts.push(roleLabel + " by " + director + ".");
        }
      }
      if (publisher) {
        htmlParts.push(escapeHtml(publisher) + (date || platform ? "," : "."));
        plainParts.push(publisher + (date || platform ? "," : "."));
      }
      if (date) {
        htmlParts.push(escapeHtml(date) + (platform ? "," : "."));
        plainParts.push(date + (platform ? "," : "."));
      }
      if (platform) {
        htmlParts.push(emHtml(platform) + ".");
        plainParts.push(platform + ".");
      }
      if (title) {
        inText = "(" + emHtml(shortTitle(title, 40)) + ")";
        inTextPlain = "(" + shortTitle(title, 40) + ")";
      } else if (director) {
        inText = "(" + escapeHtml(authorLastName(director)) + ")";
        inTextPlain = "(" + authorLastName(director) + ")";
      }
    }

    let worksHtml = joinParts(htmlParts);
    let worksPlain = joinParts(plainParts);
    if (!worksHtml || worksHtml === ".") {
      worksHtml = "Add at least a title or author, then build again.";
      worksPlain = worksHtml;
    }

    return {
      worksHtml,
      worksPlain,
      inText,
      inTextPlain,
      missing,
      type
    };
  }

  function persistMlaDraft(built) {
    if (!$("#mlaBuild")) return;
    const payload = readMlaInputs();
    if (built) {
      payload.worksPlain = built.worksPlain;
      payload.worksHtml = built.worksHtml;
      payload.inTextPlain = built.inTextPlain;
      payload.inText = built.inText;
      payload.savedAt = Date.now();
    }
    saveJSON(KEYS.mlaLast, payload);
  }

  function renderMlaResult(result) {
    const results = $("#mlaResults");
    const works = $("#mlaWorksCited");
    const inTextEl = $("#mlaInText");
    if (!works || !inTextEl) return;
    works.innerHTML = result.worksHtml;
    inTextEl.innerHTML = result.inText;
    if (results) results.hidden = false;
  }

  function bindMla() {
    if (!$("#mlaBuild")) return;

    const saved = loadJSON(KEYS.mlaLast, null);
    if (saved) {
      writeMlaInputs(saved);
      if (saved.worksHtml) {
        renderMlaResult({
          worksHtml: saved.worksHtml,
          worksPlain: saved.worksPlain || "",
          inText: saved.inText || "\u2014",
          inTextPlain: saved.inTextPlain || "\u2014"
        });
        setStatus($("#mlaSaveStatus"), "Restored last practice citation.", true);
      } else {
        setMlaType(saved.type || "website", { skipPersist: true });
      }
    } else {
      setMlaType("website", { skipPersist: true });
    }

    $$(".mla-type-chip").forEach((btn) => {
      btn.addEventListener("click", () => setMlaType(btn.dataset.type));
    });

    MLA_FIELD_IDS.forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", () => {
        persistMlaDraft(false);
        setStatus($("#mlaSaveStatus"), "Fields saved locally.", true);
      });
      el?.addEventListener("blur", () => persistMlaDraft(false));
    });

    $("#mlaBuild").addEventListener("click", () => {
      const inputs = readMlaInputs();
      const result = buildMlaCitationSafe(inputs);
      if (result.missing.length) {
        setStatus($("#mlaSaveStatus"), "Add required fields first: " + result.missing.join(", ") + ".", false);
        renderMlaResult(result);
        return;
      }
      renderMlaResult(result);
      persistMlaDraft(result);
      setStatus($("#mlaSaveStatus"), "Practice citation built · saved locally. Verify against the source.", true);
    });

    $("#mlaClear")?.addEventListener("click", () => {
      MLA_FIELD_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      localStorage.removeItem(KEYS.mlaLast);
      setMlaType(currentMlaType(), { skipPersist: true });
      if ($("#mlaWorksCited")) $("#mlaWorksCited").textContent = "Fill the fields, then build.";
      if ($("#mlaInText")) $("#mlaInText").textContent = "\u2014";
      if ($("#mlaResults")) $("#mlaResults").hidden = true;
      setStatus($("#mlaSaveStatus"), "Cleared.", false);
    });

    function copyFromResult(kind) {
      const last = loadJSON(KEYS.mlaLast, null);
      if (!last) return;
      const text = kind === "works" ? last.worksPlain : last.inTextPlain;
      if (!text) return;
      navigator.clipboard?.writeText(text).then(
        () =>
          setStatus(
            $("#mlaSaveStatus"),
            kind === "works" ? "Works Cited line copied." : "In-text citation copied.",
            true
          ),
        () => setStatus($("#mlaSaveStatus"), "Select the text and copy manually.", false)
      );
    }

    $("#mlaCopyWorks")?.addEventListener("click", () => copyFromResult("works"));
    $("#mlaCopyInText")?.addEventListener("click", () => copyFromResult("intext"));
  }


  /* ---------- Source log ---------- */

  function uid() {
    return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function emptySource(kind) {
    return {
      id: uid(),
      kind: kind || "outside",
      author: "",
      title: "",
      container: "",
      date: "",
      location: "",
      note: "",
      helps: "",
      mlaDraft: ""
    };
  }

  function readSourceLog() {
    return {
      claim: ($("#slClaim")?.value || "").trim(),
      caseName: ($("#slCase")?.value || "").trim(),
      sources: loadJSON(KEYS.sourceLog, { sources: [] }).sources || []
    };
  }

  function currentSourceLogState() {
    const rows = $$(".source-row");
    const sources = rows.map((row) => {
      const id = row.dataset.id;
      const get = (name) => row.querySelector(`[data-field="${name}"]`)?.value || "";
      return {
        id,
        kind: get("kind") || "outside",
        author: get("author").trim(),
        title: get("title").trim(),
        container: get("container").trim(),
        date: get("date").trim(),
        location: get("location").trim(),
        note: get("note").trim(),
        helps: get("helps").trim(),
        mlaDraft: get("mlaDraft").trim()
      };
    });
    return {
      claim: ($("#slClaim")?.value || "").trim(),
      caseName: ($("#slCase")?.value || "").trim(),
      sources,
      savedAt: Date.now()
    };
  }

  function persistSourceLog(showStatus) {
    if (!$("#slList")) return;
    const state = currentSourceLogState();
    saveJSON(KEYS.sourceLog, state);
    updateSourceCount(state.sources);
    renderSourceSummary(state);
    if (showStatus) setStatus($("#slSaveStatus"), "Source log saved locally.", true);
  }

  function updateSourceCount(sources) {
    const el = $("#slCount");
    if (!el) return;
    const packet = sources.filter((s) => s.kind === "packet").length;
    const outside = sources.filter((s) => s.kind === "outside").length;
    const aim = (activeEssay() && activeEssay().sourceAim) || "Match the source count your essay prompt requires.";
    el.textContent =
      sources.length +
      " source" +
      (sources.length === 1 ? "" : "s") +
      " · " +
      packet +
      " packet/handout · " +
      outside +
      " other · " +
      aim;
  }

  function sourceSummaryText(state) {
    const lines = [];
    lines.push("ENGL 1301 · " + essayLabel() + " · Source log (practice)");
    if (state.caseName) lines.push("Subject / focus: " + state.caseName);
    if (state.claim) lines.push("Working thesis: " + state.claim);
    lines.push("");
    if (!state.sources.length) {
      lines.push("(No sources yet.)");
      return lines.join("\n");
    }
    state.sources.forEach((s, i) => {
      lines.push((i + 1) + ". [" + (s.kind === "packet" ? "PACKET/HANDOUT" : "SOURCE") + "] " + (s.title || "(untitled)"));
      if (s.author) lines.push("   Author: " + s.author);
      if (s.container) lines.push("   Container / site: " + s.container);
      if (s.date) lines.push("   Date: " + s.date);
      if (s.location) lines.push("   URL / location: " + s.location);
      if (s.note) lines.push("   Paraphrase / quote note: " + s.note);
      if (s.helps) lines.push("   How it helps the claim: " + s.helps);
      if (s.mlaDraft) lines.push("   MLA draft: " + s.mlaDraft);
      else lines.push("   MLA draft: (build in MLA citation tool)");
      lines.push("");
    });
    lines.push("Reminder: polish Works Cited + in-text in the MLA tool; verify every entry against the source.");
    return lines.join("\n");
  }

  function renderSourceSummary(state) {
    const wrap = $("#slSummaryWrap");
    const pre = $("#slSummary");
    if (!wrap || !pre) return;
    if (!state.sources.length && !state.claim && !state.caseName) {
      wrap.hidden = true;
      pre.textContent = "";
      return;
    }
    pre.textContent = sourceSummaryText(state);
    wrap.hidden = false;
  }

  function renderSourceRow(source) {
    const kind = source.kind === "packet" ? "packet" : "outside";
    const packetLabel = (activeEssay() && activeEssay().sourcePacketLabel) || "Course packet / handout";
    const label = kind === "packet" ? packetLabel : "Source";
    return `<article class="source-row" data-id="${escapeHtml(source.id)}">
      <header class="source-row-head">
        <h3><span class="pill">${escapeHtml(label)}</span></h3>
        <div class="claim-option-actions">
          <button type="button" class="button small ghost" data-remove="${escapeHtml(source.id)}">Remove</button>
        </div>
      </header>
      <div class="field-grid">
        <label class="field">Type
          <select data-field="kind">
            <option value="packet"${kind === "packet" ? " selected" : ""}>${escapeHtml(packetLabel)}</option>
            <option value="outside"${kind === "outside" ? " selected" : ""}>Other / outside source</option>
          </select>
        </label>
        <label class="field">Author <span class="hint">Last, First if you have it</span>
          <input type="text" data-field="author" value="${escapeHtml(source.author || "")}" placeholder="Garcia, Maria" autocomplete="off">
        </label>
        <label class="field">Title <span class="hint">Article, page, or packet title</span>
          <input type="text" data-field="title" value="${escapeHtml(source.title || "")}" placeholder="Title of the Source" autocomplete="off">
        </label>
        <label class="field">Container / site <span class="hint">Journal, site, newspaper, collection</span>
          <input type="text" data-field="container" value="${escapeHtml(source.container || "")}" placeholder="Website or Journal Name" autocomplete="off">
        </label>
        <label class="field">Date
          <input type="text" data-field="date" value="${escapeHtml(source.date || "")}" placeholder="15 Mar. 2024" autocomplete="off">
        </label>
        <label class="field">URL or location <span class="hint">Link, DOI, Drive path, page range</span>
          <input type="text" data-field="location" value="${escapeHtml(source.location || "")}" placeholder="https://… or packet p. 3" autocomplete="off">
        </label>
        <label class="field span-2">One-line paraphrase or quote note <span class="hint">Your words or a short quoted cue</span>
          <textarea data-field="note" style="min-height:3.2rem;" placeholder="Packet frames monthly boxes as loyalty engines…">${escapeHtml(source.note || "")}</textarea>
        </label>
        <label class="field span-2">How it helps the claim <span class="hint">Corroborate / complicate / historicize / evidence gap</span>
          <textarea data-field="helps" style="min-height:3.2rem;" placeholder="Complicates the packet’s success story with churn data…">${escapeHtml(source.helps || "")}</textarea>
        </label>
        <label class="field span-2">MLA-ish citation draft <span class="hint">Rough entry — polish in <a href="mla-citation.html">MLA citation</a></span>
          <textarea data-field="mlaDraft" style="min-height:3.2rem;" placeholder="Garcia, Maria. “Title.” Site, 15 Mar. 2024, https://…">${escapeHtml(source.mlaDraft || "")}</textarea>
        </label>
      </div>
    </article>`;
  }

  function renderSourceList(state) {
    const list = $("#slList");
    if (!list) return;
    if (!state.sources.length) {
      const aimEmpty = (activeEssay() && activeEssay().sourceAim) || "Add the sources your essay prompt requires.";
      list.innerHTML =
        '<p class="hint-block">No sources yet. ' + aimEmpty + ' Fields save automatically on this device.</p>';
    } else {
      list.innerHTML = state.sources.map(renderSourceRow).join("");
    }
    updateSourceCount(state.sources);
    renderSourceSummary(state);
  }

  function bindSourceLog() {
    if (!$("#slList")) return;
    const pktBtn = $("#slAddPacket");
    if (pktBtn) {
      const lab = (activeEssay() && activeEssay().sourcePacketLabel) || "course packet / handout";
      pktBtn.textContent = "Add " + lab + " row";
    }

    let state = loadJSON(KEYS.sourceLog, null);
    if (!state || !Array.isArray(state.sources)) {
      state = { claim: "", caseName: "", sources: [] };
    }

    const chosen = loadJSON(KEYS.chosenClaim, null);
    if (chosen) {
      if (!state.claim && chosen.claim) state.claim = chosen.claim;
      if (!state.caseName && chosen.caseName) state.caseName = chosen.caseName;
    }

    if ($("#slClaim")) $("#slClaim").value = state.claim || "";
    if ($("#slCase")) $("#slCase").value = state.caseName || "";
    renderSourceList(state);
    if (state.sources.length || state.claim) {
      setStatus($("#slSaveStatus"), "Restored source log from this device.", true);
    }

    function addSource(kind) {
      const next = currentSourceLogState();
      next.sources.push(emptySource(kind));
      saveJSON(KEYS.sourceLog, next);
      renderSourceList(next);
      setStatus($("#slSaveStatus"), "Source row added · saved locally.", true);
    }

    $("#slAdd")?.addEventListener("click", () => addSource("outside"));
    $("#slAddPacket")?.addEventListener("click", () => addSource("packet"));

    ["slClaim", "slCase"].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", () => persistSourceLog(true));
      el?.addEventListener("blur", () => persistSourceLog(false));
    });

    $("#slList").addEventListener("change", (e) => {
      if (!e.target.closest("[data-field]")) return;
      if (e.target.getAttribute("data-field") === "kind") {
        const next = currentSourceLogState();
        saveJSON(KEYS.sourceLog, next);
        renderSourceList(next);
        setStatus($("#slSaveStatus"), "Source type updated · saved locally.", true);
        return;
      }
      persistSourceLog(true);
    });
    $("#slList").addEventListener("blur", (e) => {
      if (e.target.closest("[data-field]")) persistSourceLog(false);
    }, true);

    $("#slList").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove]");
      if (!btn) return;
      const id = btn.getAttribute("data-remove");
      const next = currentSourceLogState();
      next.sources = next.sources.filter((s) => s.id !== id);
      saveJSON(KEYS.sourceLog, next);
      renderSourceList(next);
      setStatus($("#slSaveStatus"), "Source removed · saved locally.", true);
    });

    $("#slClear")?.addEventListener("click", () => {
      const blank = { claim: "", caseName: "", sources: [], savedAt: Date.now() };
      if ($("#slClaim")) $("#slClaim").value = "";
      if ($("#slCase")) $("#slCase").value = "";
      saveJSON(KEYS.sourceLog, blank);
      renderSourceList(blank);
      setStatus($("#slSaveStatus"), "Cleared.", false);
    });

    $("#slCopy")?.addEventListener("click", () => {
      const state = currentSourceLogState();
      renderSourceSummary(state);
      const text = sourceSummaryText(state);
      navigator.clipboard?.writeText(text).then(
        () => setStatus($("#slSaveStatus"), "Summary copied.", true),
        () => setStatus($("#slSaveStatus"), "Select the summary and copy manually.", false)
      );
    });
  }

  /* ---------- Peer-review checklist ---------- */

  function getPeerItems() {
    const essay = activeEssay();
    if (essay && essay.peerItems && essay.peerItems.length) return essay.peerItems;
    return [
      { id: "claim", title: "Thesis / controlling idea", prompt: "Is the main idea clear, specific, and free of announcement openings?", placeholder: "Clear about… / Still vague because…" },
      { id: "evidence", title: "Evidence", prompt: "Do body sections use concrete evidence tied to the main idea?", placeholder: "Strongest evidence… / Needs support at…" },
      { id: "org", title: "Organization", prompt: "Do topic sentences guide the reader through a clear order?", placeholder: "Clearest section… / Drifts at…" },
      { id: "analysis", title: "Analysis", prompt: "Does the draft explain or argue (not only summarize)?", placeholder: "Best analytical move… / Still summary at…" },
      { id: "mla", title: "MLA", prompt: "If sources are used, are in-text citations and Works Cited matched?", placeholder: "MLA looks… / Check…" },
      { id: "ai", title: "AI Level 2 honesty", prompt: "Does the writer own the ideas and sentences? AI support only?", placeholder: "Ownership looks… / Ask about…" }
    ];
  }

  function defaultPeerState() {
    const checks = {};
    const notes = {};
    getPeerItems().forEach((item) => {
      checks[item.id] = false;
      notes[item.id] = "";
    });
    return {
      reviewer: "",
      writer: "",
      claim: "",
      overall: "",
      checks,
      notes,
      savedAt: Date.now()
    };
  }

  function readPeerStateFromDom() {
    const checks = {};
    const notes = {};
    getPeerItems().forEach((item) => {
      checks[item.id] = !!document.getElementById("prCheck-" + item.id)?.checked;
      notes[item.id] = (document.getElementById("prNote-" + item.id)?.value || "").trim();
    });
    return {
      reviewer: ($("#prReviewer")?.value || "").trim(),
      writer: ($("#prWriter")?.value || "").trim(),
      claim: ($("#prClaim")?.value || "").trim(),
      overall: ($("#prOverall")?.value || "").trim(),
      checks,
      notes,
      savedAt: Date.now()
    };
  }

  function updatePeerProgress(state) {
    const el = $("#prProgress");
    if (!el) return;
    const items = getPeerItems();
    const total = items.length;
    const done = items.filter((item) => state.checks[item.id]).length;
    el.textContent = done + " / " + total + " checked";
  }

  function peerSummaryText(state) {
    const lines = [];
    lines.push("ENGL 1301 · " + essayLabel() + " · Peer-review checklist (practice)");
    if (state.reviewer) lines.push("Reviewer: " + state.reviewer);
    if (state.writer) lines.push("Writer / draft: " + state.writer);
    if (state.claim) lines.push("Working claim (as read): " + state.claim);
    lines.push("");
    getPeerItems().forEach((item) => {
      const mark = state.checks[item.id] ? "[x]" : "[ ]";
      lines.push(mark + " " + item.title);
      lines.push("    " + item.prompt);
      if (state.notes[item.id]) lines.push("    Note: " + state.notes[item.id]);
      lines.push("");
    });
    if (state.overall) {
      lines.push("Overall note:");
      lines.push(state.overall);
      lines.push("");
    }
    lines.push("Peer-review rehearsal summary — share with your partner as practice feedback.");
    return lines.join("\n");
  }

  function renderPeerSummary(state) {
    const wrap = $("#prSummaryWrap");
    const pre = $("#prSummary");
    if (!wrap || !pre) return;
    pre.textContent = peerSummaryText(state);
    wrap.hidden = false;
  }

  function renderPeerList(state) {
    const list = $("#prList");
    if (!list) return;
    list.innerHTML = getPeerItems().map((item) => {
      const checked = !!state.checks[item.id];
      const note = state.notes[item.id] || "";
      return `<li class="peer-check-item${checked ? " is-checked" : ""}" data-peer="${item.id}">
        <div class="peer-check-main">
          <input type="checkbox" id="prCheck-${item.id}" ${checked ? "checked" : ""}>
          <label for="prCheck-${item.id}"><strong>${escapeHtml(item.title)}</strong>${escapeHtml(item.prompt)}</label>
        </div>
        <label class="field">Short note <span class="hint">Optional · point to a sentence if you can</span>
          <textarea id="prNote-${item.id}" style="min-height:2.8rem;" placeholder="${escapeHtml(item.placeholder)}">${escapeHtml(note)}</textarea>
        </label>
      </li>`;
    }).join("");
    updatePeerProgress(state);
    renderPeerSummary(state);
  }

  function persistPeer(showStatus) {
    if (!$("#prList")) return;
    const state = readPeerStateFromDom();
    saveJSON(KEYS.peerChecklist, state);
    updatePeerProgress(state);
    $$(".peer-check-item").forEach((li) => {
      const id = li.dataset.peer;
      li.classList.toggle("is-checked", !!state.checks[id]);
    });
    renderPeerSummary(state);
    if (showStatus) setStatus($("#prSaveStatus"), "Checklist saved locally.", true);
  }

  function bindPeerChecklist() {
    if (!$("#prList")) return;

    let state = loadJSON(KEYS.peerChecklist, null);
    if (!state || !state.checks) state = defaultPeerState();
    getPeerItems().forEach((item) => {
      if (typeof state.checks[item.id] !== "boolean") state.checks[item.id] = false;
      if (typeof state.notes[item.id] !== "string") state.notes[item.id] = "";
    });

    const chosen = loadJSON(KEYS.chosenClaim, null);
    if (chosen && !state.claim && chosen.claim) state.claim = chosen.claim;

    if ($("#prReviewer")) $("#prReviewer").value = state.reviewer || "";
    if ($("#prWriter")) $("#prWriter").value = state.writer || "";
    if ($("#prClaim")) $("#prClaim").value = state.claim || "";
    if ($("#prOverall")) $("#prOverall").value = state.overall || "";
    renderPeerList(state);
    setStatus($("#prSaveStatus"), "Restored checklist from this device.", true);

    ["prReviewer", "prWriter", "prClaim", "prOverall"].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", () => persistPeer(true));
      el?.addEventListener("blur", () => persistPeer(false));
    });

    $("#prList").addEventListener("change", (e) => {
      if (e.target.matches('input[type="checkbox"]') || e.target.tagName === "TEXTAREA") {
        persistPeer(true);
      }
    });
    $("#prList").addEventListener(
      "blur",
      (e) => {
        if (e.target.tagName === "TEXTAREA") persistPeer(false);
      },
      true
    );

    $("#prClear")?.addEventListener("click", () => {
      const blank = defaultPeerState();
      if ($("#prReviewer")) $("#prReviewer").value = "";
      if ($("#prWriter")) $("#prWriter").value = "";
      if ($("#prClaim")) $("#prClaim").value = "";
      if ($("#prOverall")) $("#prOverall").value = "";
      saveJSON(KEYS.peerChecklist, blank);
      renderPeerList(blank);
      setStatus($("#prSaveStatus"), "Cleared.", false);
    });

    $("#prCopy")?.addEventListener("click", () => {
      const state = readPeerStateFromDom();
      renderPeerSummary(state);
      navigator.clipboard?.writeText(peerSummaryText(state)).then(
        () => setStatus($("#prSaveStatus"), "Summary copied.", true),
        () => setStatus($("#prSaveStatus"), "Select the summary and copy manually.", false)
      );
    });

    $("#prPrint")?.addEventListener("click", () => {
      persistPeer(false);
      window.print();
    });
  }



  /* ---------- Keyword generator ---------- */

  const STOPWORDS = new Set(
    "a an the and or but if then else when at by for with about against between into through during before after above below from up down in out on off over under again further once here there all any both each few more most other some such no nor not only own same so than too very can will just should now this that these those it its it's they them their we our you your he she his her is are was were be been being do does did having have has had of to as".split(
      /\s+/
    )
  );

  const TOPIC_RELATED = {
    "Business & Marketing": [
      "brand loyalty",
      "customer retention",
      "subscription economy",
      "consumer behavior",
      "marketing ethics",
      "pricing strategy"
    ],
    Climate: ["climate policy", "carbon emissions", "adaptation", "mitigation", "environmental justice"],
    Education: ["student success", "higher education", "equity", "curriculum", "access"],
    Environmental: ["sustainability", "conservation", "pollution", "environmental policy"],
    "Film / TV": ["media representation", "audience reception", "adaptation", "narrative framing"],
    "Forensics & Psychology": ["forensic evidence", "cognitive bias", "criminal justice", "expert testimony"],
    Government: ["public policy", "regulation", "civic participation", "governance"],
    "Health Science": ["patient outcomes", "clinical practice", "healthcare access", "medical ethics"],
    "Mortuary Science": ["funeral industry", "grief", "death care", "professional ethics"],
    "Public Health": ["health equity", "prevention", "community health", "epidemiology"],
    "Social Media": ["platform design", "algorithmic amplification", "online community", "digital labor"],
    "Technology & Media": ["platform economy", "digital privacy", "media literacy", "surveillance"],
    "Urban Studies": ["urban planning", "housing", "public space", "gentrification"],
    "Kaiju / giant creatures": [
      "kaiju cinema",
      "giant monster",
      "city destruction",
      "spectacle and scale",
      "nuclear allegory",
      "monster as metaphor",
      "Godzilla",
      "King Kong"
    ],
    Vampires: [
      "vampire lore",
      "gothic horror",
      "blood and desire",
      "immortality",
      "predator and prey",
      "Dracula",
      "sympathy for the monster",
      "adaptation"
    ],
    "Werewolves / shapeshifters": [
      "lycanthropy",
      "shapeshifter",
      "human and animal",
      "transformation",
      "dual nature",
      "body horror",
      "curse narrative",
      "monstrosity"
    ],
    "Zombies / undead": [
      "zombie narrative",
      "undead",
      "contagion",
      "apocalypse fiction",
      "living dead",
      "crowd and fear",
      "survival narrative",
      "monstrosity"
    ],
    "Folk / cryptid figures": [
      "folklore monster",
      "cryptid",
      "urban legend",
      "oral tradition",
      "local myth",
      "folk horror",
      "belief and fear",
      "monstrosity"
    ],
    "Film / TV monsters": [
      "film monster",
      "screen horror",
      "audience fear",
      "adaptation",
      "special effects spectacle",
      "media representation",
      "monster as metaphor",
      "gothic cinema"
    ],
    "Literary monsters": [
      "literary monster",
      "gothic novel",
      "monstrosity",
      "creator and creation",
      "sympathy and blame",
      "beauty and monstrosity",
      "moral responsibility",
      "double and doubling"
    ],
    "Belonging / identity": [
      "belonging",
      "identity",
      "community",
      "outsider",
      "self and other",
      "personal narrative",
      "recognition"
    ],
    "Work or school": [
      "workplace",
      "campus life",
      "first job",
      "student experience",
      "labor",
      "learning curve",
      "professional identity"
    ],
    Family: [
      "family ritual",
      "kinship",
      "intergenerational",
      "home",
      "caregiving",
      "family conflict",
      "belonging"
    ],
    "Fear / courage": [
      "fear",
      "courage",
      "risk",
      "bravery",
      "anxiety",
      "facing danger",
      "personal growth"
    ],
    "Monster or hero figure": [
      "monster figure",
      "hero figure",
      "role model",
      "villain",
      "archetype",
      "identification",
      "story and self"
    ],
    "Place / home": [
      "place",
      "home",
      "displacement",
      "sense of place",
      "migration",
      "local community",
      "belonging"
    ],
    "Deep ocean / extreme environments": [
      "deep ocean",
      "extreme environment",
      "pressure physiology",
      "exploration",
      "human limits",
      "deep-sea research",
      "adaptation"
    ],
    "Space / cosmos": [
      "space exploration",
      "astronomy",
      "cosmology",
      "black hole",
      "outer space",
      "human in space",
      "scientific explanation"
    ],
    "The body under stress": [
      "physiological stress",
      "human body",
      "heat stress",
      "cold exposure",
      "endurance",
      "homeostasis",
      "medical science"
    ],
    "Disease / public health unknowns": [
      "disease transmission",
      "public health",
      "epidemiology",
      "outbreak",
      "prevention",
      "health literacy",
      "scientific uncertainty"
    ],
    "Technology / AI unknowns": [
      "artificial intelligence",
      "machine learning",
      "algorithm",
      "automation",
      "AI error",
      "technology ethics",
      "explainable AI"
    ],
    "Natural disasters": [
      "natural disaster",
      "hurricane",
      "earthquake",
      "risk reduction",
      "emergency response",
      "climate hazard",
      "preparedness"
    ],
    "Unexplained phenomena (explain, don’t argue)": [
      "scientific explanation",
      "anomaly",
      "evidence evaluation",
      "misconception",
      "critical thinking",
      "research methods",
      "uncertainty"
    ],
    "Historical mysteries": [
      "historical mystery",
      "archaeology",
      "primary source",
      "historiography",
      "evidence",
      "interpretation",
      "unsolved history"
    ],
    "Local visitors": [
      "local tourism",
      "visitor guide",
      "place explanation",
      "cultural practice",
      "newcomer",
      "public space"
    ],
    "Campus community": [
      "campus culture",
      "student life",
      "college community",
      "orientation",
      "shared space",
      "campus ritual"
    ],
    "Newcomers to the city": [
      "newcomer",
      "city orientation",
      "urban navigation",
      "local knowledge",
      "access",
      "cultural practice"
    ],
    "Classmates / peers": [
      "peer audience",
      "classroom community",
      "shared knowledge",
      "student guide",
      "how it works"
    ],
    "Online readers": [
      "online audience",
      "digital guide",
      "public writing",
      "clear explanation",
      "accessible language"
    ],
    "Technology & media": [
      "media literacy",
      "digital media",
      "public debate",
      "platform power",
      "communication policy"
    ],
    "Public policy": [
      "public policy",
      "regulation",
      "civic debate",
      "policy evidence",
      "governance"
    ],
    "Campus life": [
      "campus policy",
      "student rights",
      "college community",
      "institutional rules",
      "access"
    ],
    Health: [
      "public health",
      "healthcare access",
      "wellbeing",
      "medical ethics",
      "health policy"
    ],
    "Criminal justice": [
      "criminal justice",
      "policing",
      "courts",
      "incarceration",
      "due process",
      "reform"
    ],
    "Thesis / claims": [
      "thesis statement",
      "arguable claim",
      "controlling idea",
      "specificity",
      "revision"
    ],
    "Research / sources": [
      "source evaluation",
      "research process",
      "citation",
      "evidence use",
      "library research"
    ],
    Organization: [
      "organization",
      "topic sentence",
      "paragraph structure",
      "coherence",
      "outline"
    ],
    "Revision habits": [
      "revision",
      "drafting process",
      "feedback",
      "rewriting",
      "writing habits"
    ],
    "AI Level 2 use": [
      "AI literacy",
      "responsible AI use",
      "brainstorming support",
      "writer ownership",
      "academic integrity"
    ],
    "MLA / citation": [
      "MLA style",
      "Works Cited",
      "in-text citation",
      "source credit",
      "documentation"
    ]
  };

  const GENERIC_SYNONYMS = {
    loyalty: ["retention", "engagement", "brand devotion", "repeat purchase"],
    subscription: ["recurring billing", "membership model", "subscription box", "subscription economy"],
    cost: ["price", "affordability", "expense", "financial burden"],
    fatigue: ["churn", "cancellation", "burnout", "attrition"],
    equity: ["fairness", "access", "inclusion", "disparity"],
    framing: ["narrative", "portrayal", "rhetoric", "representation"],
    stakeholder: ["stakeholder", "consumer", "customer", "worker", "community"],
    evidence: ["data", "research", "empirical", "case study"],
    assumption: ["premise", "taken-for-granted", "unexamined claim"],
    success: ["performance", "growth", "profitability", "outcomes"],
    marketing: ["branding", "advertising", "promotion", "consumer marketing"],
    health: ["wellbeing", "public health", "healthcare", "medical"],
    student: ["learner", "undergraduate", "first-year student"],
    policy: ["regulation", "governance", "legislation", "institutional policy"],
    monster: ["monstrosity", "creature", "figure", "horror figure"],
    monstrosity: ["the monstrous", "abjection", "otherness", "monster as metaphor"],
    gothic: ["gothic novel", "gothic horror", "gothic literature", "dark romanticism"],
    creator: ["maker", "author figure", "scientist-creator", "creator and creation"],
    creation: ["creature", "created being", "invention", "creator and creation"],
    sympathy: ["pity", "compassion", "reader sympathy", "identification"],
    blame: ["guilt", "responsibility", "moral judgment", "culpability"],
    fear: ["terror", "dread", "anxiety", "audience fear"],
    beauty: ["aestheticism", "appearance", "the beautiful", "beauty and monstrosity"],
    adaptation: ["film adaptation", "retelling", "screen version", "remake"],
    double: ["doubling", "doppelganger", "double life", "split self"],
    doubling: ["double", "doppelganger", "mirror figure", "split identity"],
    desire: ["want", "ambition", "appetite", "longing"],
    power: ["control", "authority", "domination", "influence"],
    responsibility: ["moral responsibility", "duty", "accountability", "obligation"]
  };

  function tokenizeKeywords(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[“”"']/g, "")
      .split(/[^a-z0-9+/#.-]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
  }

  function uniqueKeepOrder(items) {
    const seen = new Set();
    const out = [];
    for (const raw of items) {
      const t = (raw || "").replace(/\s+/g, " ").trim();
      if (!t) continue;
      const key = t.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
    }
    return out;
  }

  function splitCommaList(text) {
    return (text || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function phraseQuotes(term) {
    const t = term.trim();
    if (!t) return "";
    return /\s/.test(t) ? `"${t}"` : t;
  }

  function essayBoostTerms(essay, caseName) {
    const id = (essay && essay.id) || "";
    const kind = (essay && essay.claimKind) || "";
    const boost = [];
    const s = String(caseName || "").toLowerCase();
    if (id === "monster-comparison" || kind === "comparison") {
      boost.push(
        "monstrosity",
        "gothic",
        "creator and creation",
        "sympathy",
        "blame",
        "adaptation"
      );
      if (/frankenstein/.test(s) && /dorian/.test(s)) {
        boost.push(
          "Frankenstein",
          "The Picture of Dorian Gray",
          "creature",
          "Victor Frankenstein",
          "aestheticism",
          "moral responsibility",
          "beauty and monstrosity",
          "creator and creation",
          "sympathy",
          "blame"
        );
      }
      if (/godzilla/.test(s) && /kong/.test(s)) {
        boost.push("Godzilla", "King Kong", "kaiju", "spectacle", "monster as metaphor");
      }
      if (/dracula/.test(s)) {
        boost.push("Dracula", "vampire lore", "gothic horror", "desire");
      }
    }
    return boost;
  }

  function essaySearchCluster(essay) {
    const id = (essay && essay.id) || "";
    const kind = (essay && essay.claimKind) || "";
    if (id === "case-study" || kind === "case-study") {
      return {
        bool: '(stakeholder* OR consumer* OR customer*)',
        scholar: '(ethics OR equity OR "consumer protection")',
        label: "stakeholder OR consumer OR customer"
      };
    }
    if (id === "monster-comparison" || kind === "comparison") {
      return {
        bool: '(monstrosity OR gothic OR "creator and creation" OR sympathy OR blame OR adaptation)',
        scholar: '(monstrosity OR gothic OR sympathy OR blame OR adaptation)',
        label: "monstrosity OR gothic OR sympathy"
      };
    }
    if (kind === "exposition" || id === "facing-unknown" || id === "field-guide") {
      return {
        bool: "(explain OR process OR cause OR mechanism)",
        scholar: "(explain OR process OR cause OR definition)",
        label: "explain OR process OR cause"
      };
    }
    if (kind === "argument" || id === "classical-argument") {
      return {
        bool: "(claim OR evidence OR counterargument OR stake*)",
        scholar: "(claim OR evidence OR counterargument OR policy)",
        label: "claim OR evidence OR counterargument"
      };
    }
    if (kind === "narrative" || id === "narrative-quest") {
      return {
        bool: "(narrative OR scene OR insight OR belonging)",
        scholar: "(personal narrative OR memoir OR insight OR identity)",
        label: "narrative OR insight OR identity"
      };
    }
    if (kind === "reflection" || id === "final-reflection") {
      return {
        bool: "(reflection OR revision OR growth OR writing process)",
        scholar: "(writing process OR revision OR metacognition)",
        label: "reflection OR revision OR growth"
      };
    }
    return {
      bool: "(analysis OR interpretation OR evidence)",
      scholar: "(analysis OR interpretation OR criticism)",
      label: "analysis OR interpretation"
    };
  }

  function buildKeywordPacket(inputs) {
    const essay = activeEssay();
    const caseName = (inputs.caseName || "").trim();
    const claim = (inputs.claim || "").trim();
    const topic = (inputs.topic || "").trim();
    const tensionList = splitCommaList(inputs.tension);
    const extraList = splitCommaList(inputs.extra);
    const boost = essayBoostTerms(essay, caseName);
    const cluster = essaySearchCluster(essay);

    const claimTokens = tokenizeKeywords(claim);
    // Preserve caseName and typed tension/extra casing; claim tokens stay lowercase from tokenizer
    const core = uniqueKeepOrder([
      caseName,
      ...boost.filter((t) => /[A-Z]/.test(t[0]) || /\s/.test(t)),
      ...tensionList,
      ...extraList,
      ...boost,
      ...claimTokens.slice(0, 12)
    ]).slice(0, 18);

    const syn = [];
    const lowerCore = core.map((c) => c.toLowerCase());
    // Topic-folder phrases first so essay categories shape related terms
    if (topic && TOPIC_RELATED[topic]) syn.push(...TOPIC_RELATED[topic]);
    for (const [stem, alts] of Object.entries(GENERIC_SYNONYMS)) {
      if (lowerCore.some((c) => c === stem || c.includes(stem) || stem.includes(c))) {
        syn.push(...alts);
      }
    }
    const claimLower = claim.toLowerCase();
    const caseLower = caseName.toLowerCase();
    for (const [stem, alts] of Object.entries(GENERIC_SYNONYMS)) {
      if (claimLower.includes(stem) || caseLower.includes(stem)) syn.push(...alts);
    }
    const synonyms = uniqueKeepOrder(syn.filter((s) => !lowerCore.includes(s.toLowerCase()))).slice(
      0,
      18
    );

    const a = phraseQuotes(caseName || core[0] || "your subject");
    const b = phraseQuotes(tensionList[0] || core[1] || synonyms[0] || "key concept");
    const c = phraseQuotes(tensionList[1] || core[2] || synonyms[1] || "related concept");
    const synOr =
      synonyms.slice(0, 3).map(phraseQuotes).join(" OR ") || phraseQuotes("synonym");

    const booleanTips = uniqueKeepOrder([
      `${a} AND ${b}`,
      `${a} AND (${b} OR ${c})`,
      `(${a}) AND (${synOr})`,
      `${a} AND ${b} NOT review`,
      `${phraseQuotes(caseName || "subject")} AND ${cluster.bool}`
    ]);

    const scholarFocus = (tensionList[0] || core[1] || "analysis").replace(/"/g, "");
    const scholar = uniqueKeepOrder([
      `${a} ${b}`,
      `${a} AND ${b}`,
      `try: ${a} "${scholarFocus}"`,
      `${a} ${cluster.scholar}`,
      `intitle:${a.replace(/"/g, "")} ${b}`
    ]);

    const tensionWord = (tensionList[0] || "focus").replace(/"/g, "");
    const synWord = (synonyms[0] || "related").replace(/"/g, "");
    const library = uniqueKeepOrder([
      `${a} AND ${b}`,
      `SU ${a} AND ${b}`,
      `TX ${caseName || "subject"} AND (${tensionWord} OR ${synWord})`,
      `${a} AND (peer-reviewed OR scholarly); use database filters after search`,
      `AB ${b} AND ${c}`
    ]);

    return { core, synonyms, booleanTips, scholar, library, inputs };
  }

  function renderKwChips(el, items) {
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<span class="hint-block">None yet — add a subject or claim.</span>';
      return;
    }
    el.innerHTML = items
      .map(
        (t) =>
          `<button type="button" class="kw-chip" data-kw-term="${escapeHtml(t)}" title="Click to copy">${escapeHtml(t)}</button>`
      )
      .join("");
  }

  function renderKwQueries(el, items) {
    if (!el) return;
    el.innerHTML = items
      .map(
        (q, i) =>
          `<li><code class="kw-query">${escapeHtml(q)}</code> <button type="button" class="button small ghost" data-kw-one="${i}">Copy</button></li>`
      )
      .join("");
    el.querySelectorAll("[data-kw-one]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-kw-one"));
        const q = items[idx];
        navigator.clipboard?.writeText(q).then(
          () => setStatus($("#kwSaveStatus"), "Query copied.", true),
          () => setStatus($("#kwSaveStatus"), "Select and copy manually.", false)
        );
      });
    });
  }

  function kwPacketText(packet) {
    const lines = [];
    lines.push("ENGL 1301 · " + essayLabel() + " · Keyword packet (practice)");
    if (packet.inputs?.caseName) lines.push("Subject / focus: " + packet.inputs.caseName);
    if (packet.inputs?.topic) lines.push("Topic: " + packet.inputs.topic);
    if (packet.inputs?.claim) lines.push("Focus: " + packet.inputs.claim);
    lines.push("");
    lines.push("Core keywords:");
    packet.core.forEach((k) => lines.push("  - " + k));
    lines.push("");
    lines.push("Synonyms / related:");
    packet.synonyms.forEach((k) => lines.push("  - " + k));
    lines.push("");
    lines.push("Boolean tips:");
    packet.booleanTips.forEach((k) => lines.push("  - " + k));
    lines.push("");
    lines.push("Google Scholar drafts:");
    packet.scholar.forEach((k) => lines.push("  - " + k));
    lines.push("");
    lines.push("Library / database drafts:");
    packet.library.forEach((k) => lines.push("  - " + k));
    lines.push("");
    lines.push("Next: test in Scholar + SAC Library · log keepers in Source log · verify MLA against each source.");
    return lines.join("\n");
  }

  function showKeywordResults(packet) {
    const wrap = $("#kwResults");
    if (!wrap) return;
    wrap.hidden = false;
    renderKwChips($("#kwCore"), packet.core);
    renderKwChips($("#kwSyn"), packet.synonyms);
    renderKwQueries($("#kwBool"), packet.booleanTips);
    renderKwQueries($("#kwScholar"), packet.scholar);
    renderKwQueries($("#kwLibrary"), packet.library);
    const summary = $("#kwSummary");
    const sumWrap = $("#kwSummaryWrap");
    if (summary) summary.textContent = kwPacketText(packet);
    if (sumWrap) sumWrap.hidden = false;
    const researchHost = $("#kwResearch");
    if (researchHost) {
      const essay = activeEssay();
      const base = packet.inputs || readKwInputs();
      const rInputs = gatherResearchInputs(base);
      if (shouldShowPairResearch(rInputs, essay)) {
        renderResearchNextSteps(researchHost, buildResearchNextSteps(rInputs, essay), { omitKeywordLink: true });
      } else {
        renderResearchNextSteps(researchHost, null);
      }
    }
  }

  function readKwInputs() {
    return {
      caseName: ($("#kwCase")?.value || "").trim(),
      topic: ($("#kwTopic")?.value || "").trim(),
      claim: ($("#kwClaim")?.value || "").trim(),
      tension: ($("#kwTension")?.value || "").trim(),
      extra: ($("#kwExtra")?.value || "").trim()
    };
  }

  function writeKwInputs(data) {
    if (!data) return;
    if ($("#kwCase")) $("#kwCase").value = data.caseName || "";
    if ($("#kwTopic")) $("#kwTopic").value = data.topic || "";
    if ($("#kwClaim")) $("#kwClaim").value = data.claim || "";
    if ($("#kwTension")) $("#kwTension").value = data.tension || "";
    if ($("#kwExtra")) $("#kwExtra").value = data.extra || "";
  }

  function bindKeywordGenerator() {
    if (!$("#kwGenerate")) return;

    let lastPacket = null;
    const saved = loadJSON(KEYS.keywordGen, null);
    const chosen = loadJSON(KEYS.chosenClaim, null) || {};
    const outlineSaved = loadJSON(KEYS.outlineInputs, null) || {};
    const thesisSaved = loadJSON(KEYS.thesisInputs, null) || {};
    const fromOutline = new URLSearchParams(location.search).get("from") === "outline";

    function sourceStamp(obj) {
      const n = Number(obj && obj.savedAt);
      return Number.isFinite(n) ? n : 0;
    }

    function outlinePrefill() {
      return {
        caseName: outlineSaved.caseName || chosen.caseName || thesisSaved.caseName || "",
        claim: outlineSaved.claim || chosen.claim || "",
        topic: outlineSaved.topicFolder || chosen.topicFolder || thesisSaved.topicFolder || "",
        tension: outlineSaved.tension || chosen.tension || thesisSaved.tension || "",
        extra: ""
      };
    }

    function mergeKwPrefill(base, forceOutline) {
      const next = Object.assign({ caseName: "", topic: "", claim: "", tension: "", extra: "" }, base || {});
      const from = outlinePrefill();
      const outlineNewer =
        Math.max(sourceStamp(outlineSaved), sourceStamp(chosen), sourceStamp(thesisSaved)) >=
        sourceStamp(saved);
      const prefer = forceOutline || outlineNewer || !(next.caseName || next.claim || next.tension);
      if (prefer) {
        if (from.caseName) next.caseName = from.caseName;
        if (from.claim) next.claim = from.claim;
        if (from.topic) next.topic = from.topic;
        if (from.tension) next.tension = from.tension;
      } else {
        if (!next.caseName && from.caseName) next.caseName = from.caseName;
        if (!next.claim && from.claim) next.claim = from.claim;
        if (!next.topic && from.topic) next.topic = from.topic;
        if (!next.tension && from.tension) next.tension = from.tension;
      }
      return next;
    }

    const prefilled = mergeKwPrefill(saved?.inputs || {}, fromOutline);
    writeKwInputs(prefilled);
    // Re-apply topic after essay picker rebuilds options
    const applyTopic = () => {
      if ($("#kwTopic") && prefilled.topic) $("#kwTopic").value = prefilled.topic;
    };
    applyTopic();
    setTimeout(applyTopic, 0);

    const outlineHas =
      !!(prefilled.caseName || prefilled.claim || prefilled.tension);
    const shouldRegen =
      fromOutline ||
      (outlineHas &&
        (!saved?.packet ||
          Math.max(sourceStamp(outlineSaved), sourceStamp(chosen)) > sourceStamp(saved)));

    if (shouldRegen && outlineHas) {
      lastPacket = buildKeywordPacket(readKwInputs());
      showKeywordResults(lastPacket);
      saveJSON(KEYS.keywordGen, {
        inputs: readKwInputs(),
        packet: lastPacket,
        savedAt: Date.now(),
        fromOutline: fromOutline || undefined
      });
      setStatus(
        $("#kwSaveStatus"),
        fromOutline
          ? "Loaded subject, thesis, and tension from your outline."
          : "Updated keywords from your latest outline / thesis.",
        true
      );
    } else if (saved?.packet) {
      lastPacket = saved.packet;
      showKeywordResults(saved.packet);
      setStatus($("#kwSaveStatus"), "Restored keyword packet from this device.", true);
    } else if (outlineHas) {
      setStatus($("#kwSaveStatus"), "Loaded fields from your outline / thesis. Generate to build keywords.", true);
    }

    function persist(packet, announce) {
      saveJSON(KEYS.keywordGen, {
        inputs: readKwInputs(),
        packet,
        savedAt: Date.now()
      });
      if (announce) setStatus($("#kwSaveStatus"), "Saved locally on this device.", true);
    }

    if (new URLSearchParams(location.search).get("demo") === "barkbox" && !saved?.packet) {
      writeKwInputs({
        caseName: "BarkBox",
        topic: "Business & Marketing",
        claim:
          "Although the BarkBox packet presents subscription loyalty as pure success, it underplays how subscription fatigue and rising costs squeeze less-affluent pet owners.",
        tension: "subscription fatigue, equity, customer retention",
        extra: "pet industry, loyalty program"
      });
      lastPacket = buildKeywordPacket(readKwInputs());
      showKeywordResults(lastPacket);
      persist(lastPacket, true);
      setStatus($("#kwSaveStatus"), "Demo BarkBox packet loaded (practice).", true);
    }

    $("#kwGenerate")?.addEventListener("click", () => {
      const inputs = readKwInputs();
      if (!inputs.caseName && !inputs.claim && !inputs.tension && !inputs.extra) {
        setStatus($("#kwSaveStatus"), "Add a subject, claim, or tension words first.", false);
        return;
      }
      lastPacket = buildKeywordPacket(inputs);
      showKeywordResults(lastPacket);
      persist(lastPacket, true);
    });

    $("#kwClear")?.addEventListener("click", () => {
      writeKwInputs({ caseName: "", topic: "", claim: "", tension: "", extra: "" });
      lastPacket = null;
      saveJSON(KEYS.keywordGen, { inputs: readKwInputs(), packet: null, savedAt: Date.now() });
      if ($("#kwResults")) $("#kwResults").hidden = true;
      if ($("#kwSummaryWrap")) $("#kwSummaryWrap").hidden = true;
      renderResearchNextSteps($("#kwResearch"), null);
      setStatus($("#kwSaveStatus"), "Cleared.", false);
    });

    ["kwCase", "kwTopic", "kwClaim", "kwTension", "kwExtra"].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", () => {
        if (lastPacket) persist(lastPacket, false);
        else saveJSON(KEYS.keywordGen, { inputs: readKwInputs(), packet: null, savedAt: Date.now() });
      });
    });

    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".kw-chip[data-kw-term]");
      if (chip && $("#kwGenerate")) {
        const term = chip.getAttribute("data-kw-term");
        navigator.clipboard?.writeText(term).then(
          () => setStatus($("#kwSaveStatus"), "Keyword copied.", true),
          () => setStatus($("#kwSaveStatus"), "Select and copy manually.", false)
        );
        return;
      }
      const copyBtn = e.target.closest("[data-kw-copy]");
      if (!copyBtn || !lastPacket) return;
      const which = copyBtn.getAttribute("data-kw-copy");
      const map = {
        kwCore: lastPacket.core.join(", "),
        kwSyn: lastPacket.synonyms.join(", "),
        kwBool: lastPacket.booleanTips.join("\n"),
        kwScholar: lastPacket.scholar.join("\n"),
        kwLibrary: lastPacket.library.join("\n")
      };
      const text = map[which] || "";
      navigator.clipboard?.writeText(text).then(
        () => setStatus($("#kwSaveStatus"), "Copied.", true),
        () => setStatus($("#kwSaveStatus"), "Select and copy manually.", false)
      );
    });

    $("#kwCopyAll")?.addEventListener("click", () => {
      if (!lastPacket) {
        setStatus($("#kwSaveStatus"), "Generate keywords first.", false);
        return;
      }
      const text = kwPacketText(lastPacket);
      if ($("#kwSummary")) $("#kwSummary").textContent = text;
      if ($("#kwSummaryWrap")) $("#kwSummaryWrap").hidden = false;
      navigator.clipboard?.writeText(text).then(
        () => setStatus($("#kwSaveStatus"), "Full keyword packet copied.", true),
        () => setStatus($("#kwSaveStatus"), "Select the packet and copy manually.", false)
      );
    });
  }


  function refreshEssayBoundUi() {
    const ctx = essayCtx();
    if (ctx && typeof ctx.applyThesisLabels === "function") ctx.applyThesisLabels();
    if ($("#claimGenerate") && typeof bindAngleChips === "function") bindAngleChips();
    const essay = activeEssay();
    const cue = $("#essayToolCue");
    if (cue && essay) {
      if ($("#claimGenerate")) cue.textContent = essay.thesisCue || cue.textContent;
      else if ($("#cqCheck")) {
        const hint = essay.questionHint ? " " + essay.questionHint : "";
        cue.textContent = "Turn your topic into one open, arguable question (how, why, or to what extent)." + hint;
      }
      else if ($("#outlineGenerate")) cue.textContent = essay.outlineCue || cue.textContent;
      else if ($("#mlaBuild")) cue.textContent = essay.mlaCue || cue.textContent;
      else if ($("#slList")) cue.textContent = essay.sourceAim || cue.textContent;
    }
    if ($("#cqExampleBody")) renderQuestionExample(essay);
    const csBox = $("#caseStudyCriteriaBox");
    const angleBox = document.querySelector("fieldset.angle-fieldset");
    if (csBox) {
      const isCs = !!(essay && essay.id === "case-study" && $("#claimGenerate"));
      csBox.hidden = !isCs;
      if (angleBox) angleBox.hidden = isCs;
      if (isCs) {
        const host = $("#csCriteriaChips");
        if (host && window.DWSCaseStudyLenses && typeof window.DWSCaseStudyLenses.renderPickerChips === "function") {
          window.DWSCaseStudyLenses.renderPickerChips(host);
        }
        setCsCriteria(csAllIds(), false);
      }
    }
    if (essay && essay.id === "case-study") {
      applyCsFiveLock(false);
    } else {
      const secBox = $("#csSectionBox");
      if (secBox) secBox.hidden = true;
    }
    if ($("#claimGenerate") && essay && essay.id === "case-study") {
      updateCaseStudyThesisPattern();
    } else {
      const pat = document.getElementById("caseStudyThesisPattern");
      if (pat) pat.hidden = true;
      updateCaseStudyAnswerLead();
    }
    const pktBtn = $("#slAddPacket");
    if (pktBtn && essay) {
      pktBtn.textContent = "Add " + (essay.sourcePacketLabel || "course packet / handout") + " row";
    }
    const outlineHint = $("#outlineHint");
    if (outlineHint) {
      if (essay && (essay.id === "monster-comparison" || essay.claimKind === "comparison")) {
        outlineHint.textContent = "Topic sentences appear on body sections only. Intro and conclusion use opening and closing plans. For research next steps for your pair, open Keyword generator.";
      } else if (essay && essay.outlineCue) {
        outlineHint.textContent = essay.outlineCue;
      }
    }
    if ($("#kwGenerate")) {
      const kwSaved = loadJSON(KEYS.keywordGen, null);
      const topic = (kwSaved && kwSaved.inputs && kwSaved.inputs.topic) || "";
      if ($("#kwTopic") && topic) $("#kwTopic").value = topic;
    }
    if ($("#kwResults") && !$("#kwResults").hidden) {
      const packet = loadJSON(KEYS.keywordGen, null)?.packet;
      if (packet) showKeywordResults(packet);
    }
    if ($("#prList")) {
      let state = loadJSON(KEYS.peerChecklist, null);
      if (!state) state = { checks: {}, notes: {}, reviewer: "", writer: "", claim: "", overall: "" };
      state.checks = state.checks || {};
      state.notes = state.notes || {};
      getPeerItems().forEach((item) => {
        if (typeof state.checks[item.id] !== "boolean") state.checks[item.id] = false;
        if (typeof state.notes[item.id] !== "string") state.notes[item.id] = "";
      });
      if ($("#prReviewer")) $("#prReviewer").value = state.reviewer || "";
      if ($("#prWriter")) $("#prWriter").value = state.writer || "";
      if ($("#prClaim")) $("#prClaim").value = state.claim || "";
      if ($("#prOverall")) $("#prOverall").value = state.overall || "";
      renderPeerList(state);
    }
  }


  /* ---------- Download my plan (browser-only .docx; no upload) ---------- */
  /* Zip/docx writer follows the Tutor chat download in tutor/tutor.js. */
  const PLAN_CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function planCrc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = PLAN_CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function planZipStore(files) {
    const enc = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    for (const [name, content] of Object.entries(files)) {
      const nameB = enc.encode(name);
      const data = enc.encode(content);
      const crc = planCrc32(data);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true);
      local.setUint16(8, 0, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, data.length, true);
      local.setUint32(22, data.length, true);
      local.setUint16(26, nameB.length, true);
      chunks.push(new Uint8Array(local.buffer), nameB, data);
      const cen = new DataView(new ArrayBuffer(46));
      cen.setUint32(0, 0x02014b50, true);
      cen.setUint16(4, 20, true);
      cen.setUint16(6, 20, true);
      cen.setUint16(8, 0x0800, true);
      cen.setUint32(16, crc, true);
      cen.setUint32(20, data.length, true);
      cen.setUint32(24, data.length, true);
      cen.setUint16(28, nameB.length, true);
      cen.setUint32(42, offset, true);
      central.push(new Uint8Array(cen.buffer), nameB);
      offset += 30 + nameB.length + data.length;
    }
    const cenSize = central.reduce((n, c) => n + c.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, Object.keys(files).length, true);
    end.setUint16(10, Object.keys(files).length, true);
    end.setUint32(12, cenSize, true);
    end.setUint32(16, offset, true);
    return new Blob([...chunks, ...central, new Uint8Array(end.buffer)]);
  }

  function planXmlEsc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  }

  function planPara(text, opts) {
    opts = opts || {};
    const bold = opts.bold ? "<w:b/>" : "";
    const sz = opts.size ? '<w:sz w:val="' + opts.size + '"/><w:szCs w:val="' + opts.size + '"/>' : "";
    const rPr = (bold || sz) ? "<w:rPr>" + bold + sz + "</w:rPr>" : "";
    const lines = String(text || "").split("\n");
    const runs = lines.map((l, i) =>
      (i ? "<w:r><w:br/></w:r>" : "") +
      "<w:r>" + rPr + '<w:t xml:space="preserve">' + planXmlEsc(l) + "</w:t></w:r>").join("");
    const after = opts.spaceAfter ? "<w:pPr><w:spacing w:after=\"" + opts.spaceAfter + "\"/></w:pPr>" : "";
    return "<w:p>" + after + runs + "</w:p>";
  }

  function planBlank(val) {
    const s = String(val || "").trim();
    return s ? s : "(not filled in yet)\n________________________________";
  }

  function planCsMeta(id) {
    return CS_CRITERIA.find((c) => c.id === id) || { id: id, label: id, phrase: id };
  }

  function planReadCsCriteria(thesis) {
    return csAllIds();
  }

  function collectPlanData() {
    const thesis = loadJSON(KEYS.thesisInputs, {}) || {};
    const chosen = loadJSON(KEYS.chosenClaim, {}) || {};
    const outlineIn = loadJSON(KEYS.outlineInputs, {}) || {};
    const savedSkeleton = loadJSON(KEYS.outlineSkeleton, null);
    const essay = activeEssay();
    const kind = (essay && essay.claimKind) || (savedSkeleton && savedSkeleton.essayId === "case-study" ? "case-study" : "");
    const label = (essay && essay.label)
      || (savedSkeleton && savedSkeleton.essayLabel)
      || "";
    const caseName = ($("#caseName")?.value || $("#outlineCase")?.value || thesis.caseName || chosen.caseName || outlineIn.caseName || "").trim();
    const question = ($("#criticalQuestion")?.value || thesis.question || chosen.question || outlineIn.question || "").trim();
    const thesisText = ($("#outlineClaim")?.value || chosen.claim || outlineIn.claim || "").trim();
    const tension = ($("#tensionInput")?.value || $("#outlineTension")?.value || thesis.tension || chosen.tension || outlineIn.tension || "").trim();
    const topicFolder = ($("#topicFolder")?.value || thesis.topicFolder || chosen.topicFolder || outlineIn.topicFolder || "").trim();
    const sourcesNote = ($("#outlineSourcesNote")?.value || outlineIn.sourcesNote || "").trim();
    const csCriteria = (kind === "case-study") ? planReadCsCriteria(thesis) : [];
    let sections = (savedSkeleton && Array.isArray(savedSkeleton.sections) && savedSkeleton.sections.length)
      ? savedSkeleton.sections
      : null;
    if (!sections) {
      if (kind === "case-study") {
        const ids = csCriteria.length ? csCriteria : CS_CRITERIA.map((c) => c.id);
        const romans = ["II", "III", "IV", "V", "VI", "VII", "VIII"];
        sections = [
          { title: "I. Introduction", topic: "", sentenceLabel: "Opening plan", role: "intro", isTopicSentence: false }
        ].concat(ids.map((id, i) => ({
          title: romans[i] + ". " + planCsMeta(id).label,
          topic: "",
          sentenceLabel: "Topic sentence",
          role: id,
          isTopicSentence: true,
          criterionId: id
        })), [{
          title: "Closing",
          topic: "",
          sentenceLabel: "Closing plan",
          role: "conclusion",
          isTopicSentence: false
        }]);
      } else {
        const lenses = (essay && essay.outlineLenses) ? essay.outlineLenses : [];
        if (lenses.length) {
          sections = lenses.map((lens, i) => {
            const isFirst = i === 0;
            const isLast = i === lenses.length - 1;
            return {
              title: lens.title,
              topic: "",
              sentenceLabel: isFirst ? "Opening plan" : (isLast ? "Closing plan" : "Topic sentence"),
              role: isFirst ? "intro" : (isLast ? "conclusion" : "body"),
              isTopicSentence: !isFirst && !isLast
            };
          });
        } else {
          sections = [
            { title: "I. Introduction", topic: "", sentenceLabel: "Opening plan", role: "intro", isTopicSentence: false },
            { title: "II. Body point 1", topic: "", sentenceLabel: "Topic sentence", role: "body", isTopicSentence: true },
            { title: "III. Body point 2", topic: "", sentenceLabel: "Topic sentence", role: "body", isTopicSentence: true },
            { title: "IV. Body point 3", topic: "", sentenceLabel: "Topic sentence", role: "body", isTopicSentence: true },
            { title: "V. Conclusion", topic: "", sentenceLabel: "Closing plan", role: "conclusion", isTopicSentence: false }
          ];
        }
      }
    }
    return {
      label,
      kind,
      caseName,
      question,
      thesisText,
      tension,
      topicFolder,
      sourcesNote,
      csCriteria,
      sections
    };
  }

  function planEvidenceItems(data) {
    const secs = data.sections || [];
    if (data.kind === "case-study") {
      const ids = (data.csCriteria && data.csCriteria.length) ? data.csCriteria : CS_CRITERIA.map((c) => c.id);
      return ids.map((id) => {
        const meta = planCsMeta(id);
        const match = secs.find((s) => {
          const t = String(s.title || "").toLowerCase();
          const role = String(s.role || "").toLowerCase();
          const lab = meta.label.toLowerCase();
          return role === id || s.criterionId === id || t.indexOf(lab) !== -1;
        });
        return {
          title: match && match.title ? match.title : meta.label,
          topic: match && match.topic ? match.topic : "",
          sentenceLabel: (match && match.sentenceLabel) || "Topic sentence",
          caseStudy: true,
          criterionLabel: meta.label
        };
      });
    }
    return secs
      .filter((s) => s.role !== "intro" && s.role !== "conclusion")
      .map((s) => ({
        title: s.title,
        topic: s.topic || "",
        sentenceLabel: s.sentenceLabel || "Topic sentence",
        caseStudy: false
      }));
  }

  function planFileName(data) {
    const day = new Date().toISOString().slice(0, 10);
    const raw = String(data.caseName || data.label || "plan").toLowerCase();
    const slug = raw.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "plan";
    return "writing-studio-1301-" + slug + "-" + day + ".docx";
  }

  function planLines(data) {
    const lines = [];
    const push = (t, opts) => lines.push({ text: t, opts: opts || {} });
    push("My writing plan", { bold: true, size: "32", spaceAfter: "80" });
    push("Davis Writing Studio  ENGL 1301", { bold: true, size: "22" });
    push("Built in this browser on " + new Date().toLocaleString() + ". Nothing was sent to the Writing Studio.", { size: "20", spaceAfter: "200" });

    push("Essay", { bold: true, size: "28", spaceAfter: "60" });
    push(planBlank(data.label), { spaceAfter: "80" });
    push("Subject", { bold: true, size: "24" });
    push(planBlank(data.caseName), { spaceAfter: "80" });
    if (data.topicFolder || data.kind === "case-study") {
      push("Topic folder", { bold: true, size: "24" });
      push(planBlank(data.topicFolder), { spaceAfter: "80" });
    }
    push("Critical question", { bold: true, size: "24" });
    push(planBlank(data.question), { spaceAfter: "80" });
    push("Thesis", { bold: true, size: "24" });
    push(planBlank(data.thesisText), { spaceAfter: "80" });
    push("Tension or insight", { bold: true, size: "24" });
    push(planBlank(data.tension), { spaceAfter: "200" });

    if (data.kind === "case-study") {
      const labels = csAllIds().map((id) => planCsMeta(id).label);
      push("Case Study lenses in this plan: " + joinNatural(labels) + ". All five sections are required. The thesis previews all five, in that order.", { spaceAfter: "200" });
    }

    push("Outline", { bold: true, size: "28", spaceAfter: "80" });
    (data.sections || []).forEach((sec) => {
      push(sec.title || "Section", { bold: true, size: "24", spaceAfter: "40" });
      const label = sec.sentenceLabel || (sec.isTopicSentence === false ? "Section plan" : "Topic sentence");
      push(label + ": " + planBlank(sec.topic), { spaceAfter: "80" });
    });

    push("Evidence needed", { bold: true, size: "28", spaceAfter: "80" });
    if (data.kind === "case-study") {
      push("Use two cited packet details in each of the five lens sections. Use exactly 2 outside sources total. Every body section uses your packet plus one or both outside sources. You can use either outside source in any section, and as often as you need.", { spaceAfter: "160" });
    } else if (data.sourcesNote) {
      push("Sources note: " + data.sourcesNote, { spaceAfter: "160" });
    }

    const evidence = planEvidenceItems(data);
    if (!evidence.length) {
      push("No body sections are in this plan yet. Add an outline, then download again.", { spaceAfter: "160" });
    }
    evidence.forEach((item) => {
      push(item.title, { bold: true, size: "24", spaceAfter: "40" });
      push((item.sentenceLabel || "Topic sentence") + ": " + planBlank(item.topic), { spaceAfter: "60" });
      if (item.caseStudy) {
        push("[ ] Packet detail 1: ____________________    Page or paragraph: __________", {});
        push("[ ] Packet detail 2: ____________________    Page or paragraph: __________", {});
        push("[ ] Outside source (one or both of your 2 outside sources): ____________________    Page or paragraph: __________", { spaceAfter: "160" });
      } else {
        push("[ ] Evidence 1: ____________________    Page or paragraph: __________", {});
        push("[ ] Evidence 2: ____________________    Page or paragraph: __________", { spaceAfter: "160" });
      }
    });

    push("This is a planning sheet, not a draft of the essay. Keep your own copy. Your notes stay only in this browser unless you download or copy them.", { size: "20", spaceAfter: "80" });
    return lines;
  }

  function buildPlanDocx(data) {
    const body = planLines(data).map((row) => planPara(row.text, row.opts)).join("");
    const files = {
      "[Content_Types].xml":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        "</Types>",
      "_rels/.rels":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>",
      "word/_rels/document.xml.rels":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>',
      "word/document.xml":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
        body + "</w:body></w:document>"
    };
    return new Blob([planZipStore(files)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  function planStatusEl() {
    return $("#planDownloadStatus") || $("#claimSaveStatus") || $("#outlineSaveStatus") || $("#cqSaveStatus");
  }

  function downloadPlanFile(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function bindPlanDownload() {
    const buttons = $$("#planDownload");
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      if (btn.dataset.planBound === "true") return;
      btn.dataset.planBound = "true";
      btn.addEventListener("click", () => {
        const data = collectPlanData();
        downloadPlanFile(buildPlanDocx(data), planFileName(data));
        setStatus(planStatusEl(), "Plan downloaded. It was built in this browser and was not sent to the Writing Studio.", true);
      });
    });
  }

  function bootTools() {
    const ctx = essayCtx();
    if (ctx) {
      ctx.mountPicker("#essayPicker");
      ctx.onChange(() => refreshEssayBoundUi());
      refreshEssayBoundUi();
    }
    bindClaimGenerator();
    bindIdeaGenerator();
    bindCriticalQuestionDeveloper();
    bindOutlineHelper();
    bindMla();
    bindSourceLog();
    bindPeerChecklist();
    bindKeywordGenerator();
    bindPlanDownload();
  }

  bootTools();
})();
