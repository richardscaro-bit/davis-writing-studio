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
    keywordGen: "engl1301.tools.keywordGen"
  };

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

  function trimSnippet(text, max) {
    const t = (text || "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    if (t.length <= max) return t.replace(/[.?!]+$/, "");
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[.?!,:;]+$/, "");
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
      angles: selectedAngles()
    };
  }

  function writeThesisInputs(data) {
    if (!data) return;
    if ($("#caseName")) $("#caseName").value = data.caseName || "";
    if ($("#topicFolder")) $("#topicFolder").value = data.topicFolder || "";
    if ($("#packetArgues")) $("#packetArgues").value = data.packetArgues || "";
    if ($("#tensionInput")) $("#tensionInput").value = data.tension || "";
    if ($("#criticalQuestion")) $("#criticalQuestion").value = data.question || "";
    const set = new Set(data.angles || []);
    $$(".angle-chip").forEach((btn) => {
      const on = set.has(btn.dataset.angle);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("active", on);
    });
  }

  function buildClaimOptions(inputs) {
    const caseName = inputs.caseName;
    const argues = trimSnippet(inputs.packetArgues, 110);
    const tension = trimSnippet(inputs.tension, 110);
    const question = trimSnippet(inputs.question, 100);
    const angles = inputs.angles.length ? inputs.angles : ["framing", "evidence", "limits", "stakeholders"];

    const catalog = {
      framing: {
        text: `Although the ${caseName} packet presents ${argues}, it frames the case as a clean success story while overlooking ${tension}.`,
        why: "Names the packet’s frame and the gap a reader can contest."
      },
      stakeholders: {
        text: `The ${caseName} materials underplay how ${tension} affects outcomes for stakeholders the packet treats as secondary.`,
        why: "Centers who is affected — a stance a reader could push back on."
      },
      evidence: {
        text: `While the ${caseName} packet pushes ${argues} as settled fact, its evidence overstates that conclusion and leaves ${tension} unresolved.`,
        why: "Judges evidence quality without announcing the essay’s plan."
      },
      assumptions: {
        text: `The ${caseName} packet assumes readers will accept ${argues} without asking how ${tension} unsettles that story.`,
        why: "Targets a hidden premise rather than summarizing the packet."
      },
      limits: {
        text: `The ${caseName} packet makes a persuasive case for ${argues}, yet its limits around ${tension} weaken the overall claim.`,
        why: "Keeps credit for the packet while staking a clear limit."
      },
      question: question
        ? {
            text: `Responding to the question “${question},” the ${caseName} packet’s portrayal of ${argues} fails to account for ${tension}.`,
            why: "Turns your critical question into an arguable judgment."
          }
        : null
    };

    const picked = [];
    const seen = new Set();
    function push(key) {
      const item = catalog[key];
      if (!item || !item.text || seen.has(item.text)) return;
      seen.add(item.text);
      picked.push({ angle: key, text: item.text, why: item.why });
    }

    angles.forEach(push);
    if (question) push("question");
    ["framing", "evidence", "limits", "stakeholders", "assumptions"].forEach((k) => {
      if (picked.length >= 4) return;
      push(k);
    });

    return picked.slice(0, 4);
  }

  function renderClaimOptions(options) {
    const wrap = $("#claimOptions");
    const results = $("#claimResults");
    if (!wrap || !results) return;
    if (!options.length) {
      results.hidden = true;
      wrap.innerHTML = "";
      return;
    }
    wrap.innerHTML = options
      .map((opt, i) => {
        const label = (opt.angle || "claim").replace(/^\w/, (c) => c.toUpperCase());
        return `<article class="claim-option" data-idx="${i}">
          <header class="claim-option-head">
            <span class="pill">${escapeHtml(label)}</span>
            <div class="claim-option-actions">
              <button type="button" class="button small ghost" data-copy="${i}">Copy</button>
              <button type="button" class="button small primary" data-use="${i}">Use this claim</button>
            </div>
          </header>
          <p class="claim-option-text">${escapeHtml(opt.text)}</p>
          <p class="claim-option-why"><strong>Why this works:</strong> ${escapeHtml(opt.why)}</p>
        </article>`;
      })
      .join("");
    results.hidden = false;
  }

  function bindAngleChips() {
    $$(".angle-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.classList.toggle("active", on);
        persistThesisInputs();
      });
    });
  }

  function persistThesisInputs() {
    if (!$("#caseName")) return;
    saveJSON(KEYS.thesisInputs, readThesisInputs());
    setStatus($("#claimSaveStatus"), "Draft fields saved locally.", true);
  }

  function bindClaimGenerator() {
    if (!$("#claimGenerate")) return;
    bindAngleChips();

    const saved = loadJSON(KEYS.thesisInputs, null);
    if (saved) writeThesisInputs(saved);
    const drafts = loadJSON(KEYS.thesisDrafts, []);
    if (drafts.length) renderClaimOptions(drafts);

    ["caseName", "topicFolder", "packetArgues", "tensionInput", "criticalQuestion"].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", persistThesisInputs);
      el?.addEventListener("blur", persistThesisInputs);
    });

    $("#claimGenerate").addEventListener("click", () => {
      const inputs = readThesisInputs();
      const missing = [];
      if (!inputs.caseName) missing.push("case / packet name");
      if (!inputs.packetArgues) missing.push("what the packet argues");
      if (!inputs.tension) missing.push("tension / limit / conflict");
      if (missing.length) {
        setStatus($("#claimSaveStatus"), "Add required fields first: " + missing.join(", ") + ".", false);
        $("#claimResults").hidden = true;
        return;
      }
      const options = buildClaimOptions(inputs);
      saveJSON(KEYS.thesisInputs, inputs);
      saveJSON(KEYS.thesisDrafts, options);
      renderClaimOptions(options);
      setStatus($("#claimSaveStatus"), "Generated " + options.length + " claim options · saved locally.", true);
    });

    $("#claimClear")?.addEventListener("click", () => {
      writeThesisInputs({ caseName: "", topicFolder: "", packetArgues: "", tension: "", question: "", angles: [] });
      saveJSON(KEYS.thesisInputs, readThesisInputs());
      saveJSON(KEYS.thesisDrafts, []);
      localStorage.removeItem(KEYS.chosenClaim);
      renderClaimOptions([]);
      setStatus($("#claimSaveStatus"), "Cleared.", false);
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
          () => setStatus($("#claimSaveStatus"), "Select the sentence and copy manually.", false)
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
          angle: opt.angle,
          savedAt: Date.now()
        };
        saveJSON(KEYS.chosenClaim, payload);
        setStatus($("#claimSaveStatus"), "Claim saved for the outline helper — opening it…", true);
        window.location.href = "outline-helper.html";
      }
    });
  }

  /* ---------- Outline / topic sentences ---------- */

  function readOutlineInputs() {
    return {
      claim: ($("#outlineClaim")?.value || "").trim(),
      caseName: ($("#outlineCase")?.value || "").trim(),
      tension: ($("#outlineTension")?.value || "").trim(),
      sourcesNote: ($("#outlineSourcesNote")?.value || "").trim()
    };
  }

  function writeOutlineInputs(data) {
    if (!data) return;
    if ($("#outlineClaim")) $("#outlineClaim").value = data.claim || "";
    if ($("#outlineCase")) $("#outlineCase").value = data.caseName || "";
    if ($("#outlineTension")) $("#outlineTension").value = data.tension || "";
    if ($("#outlineSourcesNote")) $("#outlineSourcesNote").value = data.sourcesNote || "";
  }

  function buildOutline(inputs) {
    const claim = inputs.claim;
    const caseName = inputs.caseName || "this case";
    const tension = trimSnippet(inputs.tension, 100) || "the packet’s unresolved tension";
    const sourcesNote = inputs.sourcesNote;

    const sections = [
      {
        title: "I. Introduction + working claim",
        topic: `Open by situating ${caseName} and lead to this working claim: ${claim}`,
        bullets: [
          "Brief context: what the Source Packet / Case Brief is asking readers to believe",
          "Working claim (revise in your own words): " + claim,
          "Map: the body will test framing, stakeholders, evidence, assumptions, and limits"
        ]
      },
      {
        title: "II. Problem / framing",
        topic: `The ${caseName} packet frames the problem in a way that privileges one reading of success while soft-pedaling ${tension}.`,
        bullets: [
          "How the packet defines the “problem” or opportunity",
          "What that framing makes visible — and what it hides",
          "Packet evidence: cite 1–2 moments from the Source Packet / Case Brief"
        ]
      },
      {
        title: "III. Stakeholders",
        topic: `Stakeholders the packet centers are not the only ones affected by ${tension}; those left at the margins complicate the packet’s story.`,
        bullets: [
          "Who benefits / who bears cost according to the packet",
          "Who is missing or minimized",
          "Packet evidence + one careful inference"
        ]
      },
      {
        title: "IV. Evidence quality",
        topic: `The evidence the ${caseName} packet offers only partly supports its presentation once ${tension} is taken seriously.`,
        bullets: [
          "Strongest piece of packet evidence — and what it actually proves",
          "Weak, selective, or overstated evidence",
          "What a skeptical reader would still need to see"
        ]
      },
      {
        title: "V. Assumptions / biases",
        topic: `The ${caseName} materials rely on assumptions that ${tension} puts under pressure.`,
        bullets: [
          "Name one clear assumption or bias in the packet",
          "Show where the packet treats that assumption as obvious",
          "Explain why a reader could reject it"
        ]
      },
      {
        title: "VI. Limits",
        topic: `Even where the ${caseName} packet is persuasive, its limits around ${tension} weaken the overall claim it advances.`,
        bullets: [
          "Acknowledge what the packet does well",
          "State the limit that matters most for your claim",
          "Tie the limit back to the working claim"
        ]
      },
      {
        title: "VII. Outside sources (3–4 beyond the packet)",
        topic: `Outside research should pressure-test the packet’s story about ${caseName}, not merely decorate it.`,
        bullets: [
          "Source 1 slot — purpose: corroborate / complicate / historicize",
          "Source 2 slot — purpose: corroborate / complicate / historicize",
          "Source 3 slot — purpose: corroborate / complicate / historicize",
          "Source 4 slot (optional) — purpose: corroborate / complicate / historicize",
          sourcesNote
            ? "Your reminder: " + sourcesNote
            : "Add 3–4 credible sources beyond the packet before you call the draft done."
        ]
      },
      {
        title: "VIII. Closing",
        topic: `Return to the claim without repeating it word-for-word: what should a careful reader conclude about ${caseName} after weighing framing, stakeholders, evidence, assumptions, and limits?`,
        bullets: [
          "Restate the judgment in fresher language",
          "One implication or remaining question (not a brand-new argument)"
        ]
      }
    ];

    return { claim, caseName, tension, sections };
  }

  function renderOutline(skeleton) {
    const body = $("#outlineBody");
    const results = $("#outlineResults");
    if (!body || !results) return;
    if (!skeleton || !skeleton.sections) {
      results.hidden = true;
      body.innerHTML = "";
      return;
    }
    body.innerHTML = skeleton.sections
      .map((sec, i) => {
        return `<article class="outline-section" data-sec="${i}">
          <header class="outline-section-head">
            <h3>${escapeHtml(sec.title)}</h3>
            <button type="button" class="button small ghost" data-copy-topic="${i}">Copy topic sentence</button>
          </header>
          <p class="topic-sentence"><span class="topic-label">Topic sentence</span>${escapeHtml(sec.topic)}</p>
          <ul>${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
        </article>`;
      })
      .join("");
    results.hidden = false;
  }

  function outlinePlainText(skeleton) {
    if (!skeleton) return "";
    const lines = ["Working claim: " + skeleton.claim, ""];
    skeleton.sections.forEach((sec) => {
      lines.push(sec.title);
      lines.push("Topic sentence: " + sec.topic);
      sec.bullets.forEach((b) => lines.push("  - " + b));
      lines.push("");
    });
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
      setStatus($("#outlineSaveStatus"), "Loaded claim from thesis generator.", true);
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
        setStatus($("#outlineSaveStatus"), "Add a working claim first (or generate one in the thesis tool).", false);
        return;
      }
      const skeleton = buildOutline(inputs);
      saveJSON(KEYS.outlineInputs, inputs);
      saveJSON(KEYS.outlineSkeleton, skeleton);
      saveJSON(KEYS.chosenClaim, {
        claim: inputs.claim,
        caseName: inputs.caseName,
        tension: inputs.tension,
        savedAt: Date.now()
      });
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
    packet: "Your Case Study Source Packet / Case Brief (often a Drive/Docs container). Treat like a web document: title, organization/collection, date if known, URL."
  };

  const MLA_TITLE_HINTS = {
    website: "Title of the page or document",
    article: "Article headline",
    journal: "Article title",
    book: "Book title",
    film: "Film or episode / series title",
    packet: "Packet or Case Brief title (e.g. BarkBox Subscription Box)"
  };

  const MLA_CONTAINER_HINTS = {
    website: "Website name",
    article: "Newspaper or magazine name",
    journal: "Journal name",
    packet: "Collection / course folder (e.g. ENGL 1301 Source Packets)"
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
        packet: "BarkBox Subscription Box"
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
      missing.push(type === "packet" ? "packet title (or author)" : "author or title");
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
    el.textContent =
      sources.length +
      " source" +
      (sources.length === 1 ? "" : "s") +
      " · " +
      packet +
      " packet · " +
      outside +
      " outside (aim for packet + 3–4 outside)";
  }

  function sourceSummaryText(state) {
    const lines = [];
    lines.push("ENGL 1301 Case Study · Source log (practice)");
    if (state.caseName) lines.push("Case / packet: " + state.caseName);
    if (state.claim) lines.push("Working claim: " + state.claim);
    lines.push("");
    if (!state.sources.length) {
      lines.push("(No sources yet.)");
      return lines.join("\n");
    }
    state.sources.forEach((s, i) => {
      lines.push((i + 1) + ". [" + (s.kind === "packet" ? "PACKET" : "OUTSIDE") + "] " + (s.title || "(untitled)"));
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
    const label = kind === "packet" ? "Packet" : "Outside";
    return `<article class="source-row" data-id="${escapeHtml(source.id)}">
      <header class="source-row-head">
        <h3><span class="pill">${label}</span> Source</h3>
        <div class="claim-option-actions">
          <button type="button" class="button small ghost" data-remove="${escapeHtml(source.id)}">Remove</button>
        </div>
      </header>
      <div class="field-grid">
        <label class="field">Type
          <select data-field="kind">
            <option value="packet"${kind === "packet" ? " selected" : ""}>Packet / Case Brief</option>
            <option value="outside"${kind === "outside" ? " selected" : ""}>Outside source</option>
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
      list.innerHTML =
        '<p class="hint-block">No sources yet. Add a packet row, then 3–4 outside sources. Fields save automatically on this device.</p>';
    } else {
      list.innerHTML = state.sources.map(renderSourceRow).join("");
    }
    updateSourceCount(state.sources);
    renderSourceSummary(state);
  }

  function bindSourceLog() {
    if (!$("#slList")) return;

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

  const PEER_ITEMS = [
    {
      id: "claim",
      title: "Claim clarity",
      prompt: "Is the working claim arguable, specific to this packet/case, and free of announcement openings (“This paper will…”)?",
      placeholder: "The claim is clear about… / Still sounds like a summary because…"
    },
    {
      id: "packet",
      title: "Packet evidence",
      prompt: "Does the draft use the Source Packet / Case Brief with concrete moments (not vague summary only)?",
      placeholder: "Strongest packet moment I noticed… / Needs a tighter quote or paraphrase on…"
    },
    {
      id: "outside",
      title: "Outside sources (3–4)",
      prompt: "Are there 3–4 outside sources beyond the packet, and do they pressure-test or deepen the claim (not decorate)?",
      placeholder: "Outside sources that help… / Still missing a source that complicates…"
    },
    {
      id: "mlaWorks",
      title: "MLA Works Cited",
      prompt: "Is there a practice Works Cited with the packet + each outside source, hanging-indent ready?",
      placeholder: "Entries look complete for… / Double-check container / date on…"
    },
    {
      id: "mlaIntext",
      title: "MLA in-text citations",
      prompt: "Do body paragraphs credit sources in-text (author or short title) where evidence appears?",
      placeholder: "In-text works in… / Missing attribution near…"
    },
    {
      id: "org",
      title: "Organization / topic sentences",
      prompt: "Do topic sentences guide framing, stakeholders, evidence, assumptions, and/or limits toward the claim?",
      placeholder: "Clearest topic sentence… / Section that still drifts…"
    },
    {
      id: "analysis",
      title: "Analysis over summary",
      prompt: "Does the draft judge the packet’s framing/evidence (not only retell it)?",
      placeholder: "Best analytical move… / Still summarizing when it could argue…"
    },
    {
      id: "ai",
      title: "AI Level 2 honesty",
      prompt: "Does the writer own the claim and evidence? If AI helped (brainstorm, outline cues, citation practice), is that disclosed appropriately for Level 2 (support, not composition)?",
      placeholder: "Disclosure / ownership looks… / Ask the writer to clarify…"
    }
  ];

  function defaultPeerState() {
    const checks = {};
    const notes = {};
    PEER_ITEMS.forEach((item) => {
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
    PEER_ITEMS.forEach((item) => {
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
    const total = PEER_ITEMS.length;
    const done = PEER_ITEMS.filter((item) => state.checks[item.id]).length;
    el.textContent = done + " / " + total + " checked";
  }

  function peerSummaryText(state) {
    const lines = [];
    lines.push("ENGL 1301 Case Study · Peer-review checklist (practice)");
    if (state.reviewer) lines.push("Reviewer: " + state.reviewer);
    if (state.writer) lines.push("Writer / draft: " + state.writer);
    if (state.claim) lines.push("Working claim (as read): " + state.claim);
    lines.push("");
    PEER_ITEMS.forEach((item) => {
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
    list.innerHTML = PEER_ITEMS.map((item) => {
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
    PEER_ITEMS.forEach((item) => {
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
    "Urban Studies": ["urban planning", "housing", "public space", "gentrification"]
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
    policy: ["regulation", "governance", "legislation", "institutional policy"]
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

  function buildKeywordPacket(inputs) {
    const caseName = (inputs.caseName || "").trim();
    const claim = (inputs.claim || "").trim();
    const topic = (inputs.topic || "").trim();
    const tensionList = splitCommaList(inputs.tension);
    const extraList = splitCommaList(inputs.extra);

    const claimTokens = tokenizeKeywords(claim);
    // Prefer multi-word tension/extra as phrases; single tokens from claim
    const core = uniqueKeepOrder([
      caseName,
      ...tensionList,
      ...extraList,
      ...claimTokens.slice(0, 12)
    ]).slice(0, 16);

    const syn = [];
    const lowerCore = core.map((c) => c.toLowerCase());
    for (const [stem, alts] of Object.entries(GENERIC_SYNONYMS)) {
      if (lowerCore.some((c) => c === stem || c.includes(stem) || stem.includes(c))) {
        syn.push(...alts);
      }
    }
    // also scan claim text for synonym stems
    const claimLower = claim.toLowerCase();
    for (const [stem, alts] of Object.entries(GENERIC_SYNONYMS)) {
      if (claimLower.includes(stem)) syn.push(...alts);
    }
    if (topic && TOPIC_RELATED[topic]) syn.push(...TOPIC_RELATED[topic]);
    const synonyms = uniqueKeepOrder(syn.filter((s) => !lowerCore.includes(s.toLowerCase()))).slice(
      0,
      18
    );

    const a = phraseQuotes(caseName || core[0] || "your case");
    const b = phraseQuotes(tensionList[0] || core[1] || synonyms[0] || "key concept");
    const c = phraseQuotes(tensionList[1] || core[2] || synonyms[1] || "related concept");
    const synOr =
      synonyms.slice(0, 3).map(phraseQuotes).join(" OR ") || phraseQuotes("synonym");

    const booleanTips = uniqueKeepOrder([
      `${a} AND ${b}`,
      `${a} AND (${b} OR ${c})`,
      `(${a}) AND (${synOr})`,
      `${a} AND ${b} NOT review`,
      `${phraseQuotes(caseName || "case")} AND (stakeholder* OR consumer* OR customer*)`
    ]);

    const scholar = uniqueKeepOrder([
      `${a} ${b}`,
      `${a} AND ${b}`,
      `author: — leave blank — try: ${a} "${(tensionList[0] || core[1] || "analysis").replace(/"/g, "")}"`,
      `${a} (ethics OR equity OR "consumer protection")`,
      `intitle:${a.replace(/"/g, "")} ${b}`
    ]);

    const library = uniqueKeepOrder([
      `${a} AND ${b}`,
      `SU ${a} AND ${b}`,
      `TX ${caseName || "case name"} AND (${(tensionList[0] || "tension").replace(/"/g, "")} OR ${(synonyms[0] || "related").replace(/"/g, "")})`,
      `${a} AND (peer-reviewed OR scholarly) — use database filters after search`,
      `AB ${b} AND ${c}`
    ]);

    return { core, synonyms, booleanTips, scholar, library, inputs };
  }

  function renderKwChips(el, items) {
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<span class="hint-block">None yet — add a case name or claim.</span>';
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
    lines.push("ENGL 1301 · Keyword packet (practice)");
    if (packet.inputs?.caseName) lines.push("Case: " + packet.inputs.caseName);
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
    if (saved?.inputs) {
      writeKwInputs(saved.inputs);
      if (saved.packet) {
        lastPacket = saved.packet;
        showKeywordResults(saved.packet);
        setStatus($("#kwSaveStatus"), "Restored keyword packet from this device.", true);
      }
    } else {
      const chosen = loadJSON(KEYS.chosenClaim, null);
      if (chosen) {
        if ($("#kwCase") && chosen.caseName) $("#kwCase").value = chosen.caseName;
        if ($("#kwClaim") && chosen.claim) $("#kwClaim").value = chosen.claim;
        if ($("#kwTopic") && chosen.topicFolder) $("#kwTopic").value = chosen.topicFolder;
      }
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
        setStatus($("#kwSaveStatus"), "Add a case name, claim, or tension words first.", false);
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


  bindClaimGenerator();
  bindOutlineHelper();
  bindMla();
  bindSourceLog();
  bindPeerChecklist();
  bindKeywordGenerator();
})();
