/* Gothic Body Paragraph Builder for ENGL 1302 Project 3 practice.
   Progress is stored only in this browser. */
(function () {
  var STORAGE = "dws-1302-body-paragraph-v1";
  var CHOSEN_KEY = "engl1302.tools.thesis.chosenClaim";
  var OUTLINE_KEY = "engl1302.tools.outline.inputs";
  var DRAFTS_KEY = "engl1302.tools.thesis.drafts";
  var INPUTS_KEY = "engl1302.tools.thesis.inputs";

  var TYPE_OPTS = [
    "Historical/cultural",
    "Psychological",
    "Sociological",
    "Philosophical/ethical",
    "Feminist/gender",
    "Formalist/narratological",
    "Gothic studies",
    "Other / custom"
  ];

  var MOVES = [
    {
      id: "claim",
      num: "1",
      title: "Claim",
      hint: "Write a topic sentence that makes a claim for this section and ties it to your thesis.",
      starters: [
        "This section of the story shows that ",
        "Read against the thesis, this moment suggests that ",
        "The story supports the claim that "
      ]
    },
    {
      id: "evidence",
      num: "2",
      title: "Story evidence",
      hint: "Use a quote from the story and include an MLA in-text citation.",
      starters: [
        "In the story, \"\" ( ). ",
        "The speaker says, \"\" ( ). ",
        "One telling moment comes when \"\" ( ). "
      ],
      integrate: true
    },
    {
      id: "analysis",
      num: "3",
      title: "Analysis",
      hint: "Explain what the story evidence means for your claim. Do not only repeat the quotation.",
      starters: [
        "This wording matters because ",
        "What this moment reveals is ",
        "The detail does not only report an event; it "
      ]
    },
    {
      id: "critic",
      num: "4",
      title: "Critic",
      hint: "Bring in one peer-reviewed critic on the same story, with a signal phrase and a citation. Do not invent a critic or treat an example critic as a real source.",
      starters: [
        "According to , \"\" ( ). ",
        "A peer-reviewed critic writing on this story argues that ",
        "As  observes, \"\" ( ). "
      ],
      integrate: true
    },
    {
      id: "connection",
      num: "5",
      title: "Critic connection",
      hint: "Say whether the critic agrees with, extends, or pushes back against your reading, and link that move to the story evidence.",
      starters: [
        "This critic agrees with the story evidence because ",
        "This critic extends the story evidence by ",
        "This critic pushes back against a first reading of the story evidence because "
      ],
      integrate: true
    },
    {
      id: "tie",
      num: "6",
      title: "Thesis tie",
      hint: "End by showing how this section supports or complicates your thesis.",
      starters: [
        "This section therefore supports the claim that ",
        "For the thesis, the story and the critic show ",
        "Taken together, this evidence keeps the argument on "
      ]
    }
  ];

  var CHECKS = [
    "Does the topic sentence make a claim tied to the thesis?",
    "Did you include story evidence with a quote and an MLA in-text citation?",
    "Does the analysis explain what the evidence means, not only repeat it?",
    "Did you introduce a peer-reviewed critic with a signal phrase and a citation?",
    "Do you agree with, extend, or push back against the critic, and link that move to the story evidence?",
    "Does the ending tie this paragraph back to the thesis?"
  ];

  function $(id) { return document.getElementById(id); }

  function emptyState() {
    return {
      thesis: "",
      thesisFromHelper: false,
      story: "",
      criticName: "",
      criticType: "",
      typeFromHelper: false,
      currentMove: 0,
      moves: { claim: "", evidence: "", analysis: "", critic: "", connection: "", tie: "" },
      checks: [null, null, null, null, null, null],
      mla: { name: "", instructor: "", course: "ENGL 1302", date: "" },
      cited: [
        { label: "story", author: "", title: "", where: "" },
        { label: "critic1", author: "", title: "", where: "" },
        { label: "critic2", author: "", title: "", where: "" }
      ]
    };
  }

  function readState() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE) || "null");
      if (!raw || typeof raw !== "object") return emptyState();
      var base = emptyState();
      base.thesis = String(raw.thesis || "");
      base.thesisFromHelper = !!raw.thesisFromHelper;
      base.story = String(raw.story || "");
      base.criticName = String(raw.criticName || "");
      base.criticType = String(raw.criticType || "");
      base.typeFromHelper = !!raw.typeFromHelper;
      base.currentMove = Math.min(MOVES.length - 1, Math.max(0, Number(raw.currentMove) || 0));
      MOVES.forEach(function (m) {
        base.moves[m.id] = (raw.moves && typeof raw.moves[m.id] === "string") ? raw.moves[m.id] : "";
      });
      base.checks = CHECKS.map(function (_, i) {
        var v = raw.checks && raw.checks[i];
        return v === "yes" || v === "no" ? v : (v === true ? "yes" : (v === false ? "no" : null));
      });
      var m = raw.mla || {};
      base.mla = {
        name: typeof m.name === "string" ? m.name : "",
        instructor: typeof m.instructor === "string" ? m.instructor : "",
        course: typeof m.course === "string" && m.course.trim() ? m.course : "ENGL 1302",
        date: typeof m.date === "string" ? m.date : ""
      };
      var rawCited = Array.isArray(raw.cited) ? raw.cited : [];
      base.cited = base.cited.map(function (slot, i) {
        var s = rawCited[i] || {};
        return {
          label: slot.label,
          author: typeof s.author === "string" ? s.author : "",
          title: typeof s.title === "string" ? s.title : "",
          where: typeof s.where === "string" ? s.where : ""
        };
      });
      return base;
    } catch (err) {
      return emptyState();
    }
  }

  function writeState(state) {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }

  function claimFrom(key) {
    try {
      var data = JSON.parse(localStorage.getItem(key) || "null");
      if (!data) return "";
      if (typeof data.claim === "string" && data.claim.trim()) return data.claim.trim();
      if (typeof data.text === "string" && data.text.trim()) return data.text.trim();
      if (Array.isArray(data) && data[0] && typeof data[0].text === "string") return data[0].text.trim();
      if (Array.isArray(data) && data[0] && typeof data[0].claim === "string") return data[0].claim.trim();
      return "";
    } catch (err) {
      return "";
    }
  }

  function readSavedThesis() {
    return claimFrom(CHOSEN_KEY) || claimFrom(OUTLINE_KEY) || claimFrom(INPUTS_KEY) || claimFrom(DRAFTS_KEY) || "";
  }

  function readSavedTypes() {
    if (window.DWSP3CriticTypes && typeof DWSP3CriticTypes.get === "function") {
      try { return DWSP3CriticTypes.get() || {}; } catch (err) { return {}; }
    }
    try {
      var raw = JSON.parse(localStorage.getItem("dws1302.tools.p3CriticTypes") || "null") || {};
      var mode = raw.mode === "different" ? "different" : "same";
      function resolve(value, custom) {
        var v = String(value || "").trim();
        if (!v) return "";
        if (/^other/i.test(v)) return String(custom || "").trim();
        return v;
      }
      var typeSame = resolve(raw.typeSame, raw.customSame);
      var type1 = resolve(raw.type1, raw.custom1);
      var type2 = resolve(raw.type2, raw.custom2);
      return {
        mode: mode,
        typeSame: typeSame,
        type1: type1,
        type2: type2,
        summary: mode === "different"
          ? [type1, type2].filter(Boolean).join(" and ")
          : typeSame
      };
    } catch (err) {
      return {};
    }
  }

  function savedTypeChoices() {
    var info = readSavedTypes();
    var list = [];
    if (info.mode === "different") {
      if (info.type1) list.push(info.type1);
      if (info.type2 && info.type2 !== info.type1) list.push(info.type2);
    } else if (info.typeSame) {
      list.push(info.typeSame);
    }
    return { info: info, list: list };
  }

  function typeOptions(state) {
    var saved = savedTypeChoices().list;
    var all = [];
    saved.concat(TYPE_OPTS).forEach(function (name) {
      if (name && all.indexOf(name) === -1 && name !== "Other / custom") all.push(name);
    });
    if (state.criticType && all.indexOf(state.criticType) === -1) all.push(state.criticType);
    return all;
  }

  function assemble(state) {
    return MOVES.map(function (m) { return String(state.moves[m.id] || "").trim(); })
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function missingMoves(state) {
    return MOVES.filter(function (m) { return !String(state.moves[m.id] || "").trim(); })
      .map(function (m) { return m.num + ". " + m.title; });
  }

  function setStatus(msg, ok) {
    var el = $("bpSaveStatus");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("ok", !!ok);
  }

  function renderTypes(state) {
    var host = $("bpTypePicker");
    if (!host) return;
    host.innerHTML = "";
    typeOptions(state).forEach(function (name) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "idea-chip";
      btn.setAttribute("aria-pressed", state.criticType === name ? "true" : "false");
      btn.textContent = name;
      btn.addEventListener("click", function () {
        state.criticType = state.criticType === name ? "" : name;
        state.typeFromHelper = false;
        writeState(state);
        render(state);
        setStatus("Criticism type saved locally.", true);
      });
      host.appendChild(btn);
    });
    var note = $("bpTypeNote");
    if (note) {
      var saved = savedTypeChoices();
      if (state.typeFromHelper && state.criticType) {
        note.hidden = false;
        note.textContent = "Filled from your saved Project 3 criticism type. Edit if you have revised the choice.";
      } else if (saved.info && saved.info.summary) {
        note.hidden = false;
        note.textContent = "Saved in the thesis or outline helper: " + saved.info.summary + ".";
      } else {
        note.hidden = true;
        note.textContent = "";
      }
    }
  }

  function renderNav(state) {
    var nav = $("bpMoveNav");
    if (!nav) return;
    nav.innerHTML = "";
    MOVES.forEach(function (m, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bp-step" + (i === state.currentMove ? " is-current" : "") + (String(state.moves[m.id] || "").trim() ? " is-filled" : "");
      btn.setAttribute("aria-current", i === state.currentMove ? "step" : "false");
      btn.innerHTML = "<span class=\"bp-step-num\">" + m.num + "</span><span class=\"bp-step-label\">" + m.title + "</span>";
      btn.addEventListener("click", function () {
        state.currentMove = i;
        writeState(state);
        renderMove(state);
        renderNav(state);
        $("bpMoveBox") && $("bpMoveBox").focus({ preventScroll: false });
        $("bpMoveBox") && $("bpMoveBox").scrollIntoView({ block: "nearest" });
      });
      nav.appendChild(btn);
    });
  }

  function fillStarter(text) {
    return String(text || "");
  }

  function renderMove(state) {
    var move = MOVES[state.currentMove] || MOVES[0];
    $("bpMoveEyebrow").textContent = "Move " + move.num + " of 6";
    $("bpMoveTitle").textContent = move.title;
    $("bpMoveHint").textContent = move.hint;
    var tip = $("bpIntegrateTip");
    if (tip) tip.hidden = !move.integrate;
    var starters = $("bpStarters");
    starters.innerHTML = "";
    move.starters.forEach(function (s) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "idea-chip";
      btn.textContent = fillStarter(s).trim();
      btn.addEventListener("click", function () {
        var field = $("bpMoveText");
        var insert = fillStarter(s);
        var cur = field.value;
        if (!cur.trim()) field.value = insert;
        else if (/\s$/.test(cur)) field.value = cur + insert;
        else field.value = cur + " " + insert;
        state.moves[move.id] = field.value;
        writeState(state);
        renderNav(state);
        renderPreview(state);
        field.focus();
        setStatus("Starter added. Edit it in your own words.", true);
      });
      starters.appendChild(btn);
    });
    var field = $("bpMoveText");
    field.value = state.moves[move.id] || "";
    field.setAttribute("aria-label", move.title);
    $("bpPrevMove").disabled = state.currentMove === 0;
    $("bpNextMove").disabled = state.currentMove === MOVES.length - 1;
  }

  function renderPreview(state) {
    var text = assemble(state);
    var preview = $("bpPreview");
    var missing = missingMoves(state);
    var miss = $("bpPreviewMissing");
    if (text) preview.textContent = text;
    else preview.textContent = "Your paragraph will appear here as you complete the six moves.";
    if (missing.length && text) {
      miss.hidden = false;
      miss.textContent = "Still to add: " + missing.join("; ") + ".";
    } else if (missing.length) {
      miss.hidden = false;
      miss.textContent = "Start with any move. A complete paragraph uses all six.";
    } else {
      miss.hidden = true;
      miss.textContent = "";
    }
    var lensLine = $("bpPreviewLens");
    var bits = [];
    if (state.story && state.story.trim()) bits.push("Story: " + state.story.trim());
    if (state.criticType) bits.push("Criticism type: " + state.criticType);
    else bits.push("Criticism type: choose one above, or leave blank.");
    if (state.criticName && state.criticName.trim()) bits.push("Critic: " + state.criticName.trim());
    lensLine.hidden = false;
    lensLine.textContent = bits.join(" · ");
  }

  function renderChecks(state) {
    var host = $("bpChecks");
    if (!host) return;
    host.innerHTML = "";
    CHECKS.forEach(function (q, i) {
      var row = document.createElement("div");
      row.className = "bp-check";
      var p = document.createElement("p");
      p.className = "bp-check-q";
      p.id = "bpCheckQ" + i;
      p.textContent = q;
      var group = document.createElement("div");
      group.className = "bp-check-actions";
      group.setAttribute("role", "group");
      group.setAttribute("aria-labelledby", p.id);
      ["yes", "no"].forEach(function (val) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "button small ghost";
        btn.textContent = val === "yes" ? "Yes" : "No";
        btn.setAttribute("aria-pressed", state.checks[i] === val ? "true" : "false");
        btn.addEventListener("click", function () {
          state.checks[i] = state.checks[i] === val ? null : val;
          writeState(state);
          renderChecks(state);
          setStatus("Self-check saved locally.", true);
        });
        group.appendChild(btn);
      });
      row.appendChild(p);
      row.appendChild(group);
      host.appendChild(row);
    });
  }

  function renderMla(state) {
    function set(id, val) { var el = $(id); if (el) el.value = val || ""; }
    set("bpMlaName", state.mla.name);
    set("bpMlaInstructor", state.mla.instructor);
    set("bpMlaCourse", state.mla.course || "ENGL 1302");
    set("bpMlaDate", state.mla.date);
    set("bpStory", state.story);
    set("bpCriticName", state.criticName);
    [["bpCiteAuthor0","bpCiteTitle0","bpCiteWhere0"],
     ["bpCiteAuthor1","bpCiteTitle1","bpCiteWhere1"],
     ["bpCiteAuthor2","bpCiteTitle2","bpCiteWhere2"]].forEach(function (ids, i) {
      set(ids[0], state.cited[i].author);
      set(ids[1], state.cited[i].title);
      set(ids[2], state.cited[i].where);
    });
  }

  function render(state) {
    renderTypes(state);
    if ($("bpThesis")) $("bpThesis").value = state.thesis || "";
    var note = $("bpThesisNote");
    if (note) {
      if (state.thesisFromHelper && state.thesis) {
        note.hidden = false;
        note.textContent = "Filled from your thesis helper. Edit if you have revised the claim.";
      } else {
        note.hidden = true;
        note.textContent = "";
      }
    }
    renderNav(state);
    renderMove(state);
    renderPreview(state);
    renderChecks(state);
    renderMla(state);
  }

  function citationEntry(s) {
    if (!s) return "";
    var author = (s.author || "").replace(/\s+/g, " ").trim();
    var title = (s.title || "").replace(/\s+/g, " ").trim();
    var where = (s.where || "").replace(/\s+/g, " ").trim();
    var parts = [];
    if (author) parts.push(/[.?!]$/.test(author) ? author : author + ".");
    if (title) {
      var bare = title.replace(/^["']|["']$/g, "");
      if (/[.?!]$/.test(bare)) parts.push('"' + bare + '"');
      else parts.push('"' + bare + '."');
    }
    if (where) {
      if (/^https?:\/\//i.test(where)) parts.push(where);
      else parts.push("*" + where.replace(/^\*|\*$/g, "") + "*.");
    }
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  function sortKey(entry) {
    return String(entry || "")
      .replace(/\*/g, "")
      .replace(/^["']/, "")
      .replace(/^(the|a|an)\s+/i, "")
      .toLowerCase();
  }

  function copyParagraph(state) {
    var text = assemble(state);
    if (!text) {
      setStatus("Add at least one move before copying.", false);
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { setStatus("Paragraph copied.", true); },
        function () { setStatus("Select the preview and copy manually.", false); }
      );
    } else {
      setStatus("Select the preview and copy manually.", false);
    }
  }

  function downloadDraft(state) {
    if (!window.DWSDocxWriter || !DWSDocxWriter.buildMlaPlanDocx) {
      setStatus("The download tool did not load. Try refreshing the page.", false);
      return;
    }
    var paragraph = assemble(state);
    var lines = [];
    lines.push({ text: "Body paragraph draft", center: true });
    lines.push("");
    if (state.story && state.story.trim()) lines.push("Story: " + state.story.trim());
    if (state.criticType) lines.push("Criticism type: " + state.criticType);
    if (state.criticName && state.criticName.trim()) lines.push("Critic: " + state.criticName.trim());
    if (state.thesis && state.thesis.trim()) lines.push("Working thesis: " + state.thesis.trim());
    lines.push("");
    if (paragraph) lines.push(paragraph);
    else lines.push("Add your six moves in the Gothic Body Paragraph Builder, then download again.");
    var missing = missingMoves(state);
    if (missing.length && paragraph) {
      lines.push("");
      lines.push("Still to add: " + missing.join("; ") + ".");
    }
    var cited = (state.cited || []).map(citationEntry).filter(Boolean);
    cited.sort(function (a, b) { return sortKey(a).localeCompare(sortKey(b)); });
    var last = (DWSDocxWriter.lastNameFrom(state.mla.name) || "paragraph").replace(/[^A-Za-z0-9-]+/g, "") || "paragraph";
    var blob = DWSDocxWriter.buildMlaPlanDocx({
      name: state.mla.name,
      instructor: state.mla.instructor,
      course: state.mla.course || "ENGL 1302",
      date: state.mla.date,
      lastName: DWSDocxWriter.lastNameFrom(state.mla.name),
      outlineLines: lines,
      worksCited: cited,
      worksCitedPrompt: "Add your story and peer-reviewed critic entries above, then download again."
    });
    DWSDocxWriter.downloadBlob(blob, last + "-gothic-body-paragraph.docx");
    setStatus("Draft downloaded. It stays on your device.", true);
  }

  function applySavedThesis(state, force) {
    if (!force && String(state.thesis || "").trim()) return false;
    var saved = readSavedThesis();
    if (!saved) return false;
    state.thesis = saved;
    state.thesisFromHelper = true;
    return true;
  }

  function applySavedTypes(state, force) {
    var saved = savedTypeChoices();
    if (!saved.list.length) return false;
    if (!force && String(state.criticType || "").trim()) return false;
    state.criticType = saved.list[0];
    state.typeFromHelper = true;
    return true;
  }

  function clearAll() {
    localStorage.removeItem(STORAGE);
    var state = emptyState();
    applySavedThesis(state, true);
    applySavedTypes(state, true);
    writeState(state);
    render(state);
    setStatus("Cleared.", false);
  }

  function bind() {
    if (!$("bpMoveText")) return;
    var state = readState();
    var changed = applySavedThesis(state, false);
    changed = applySavedTypes(state, false) || changed;
    if (changed) writeState(state);
    render(state);

    $("bpThesis").addEventListener("input", function () {
      state.thesis = $("bpThesis").value;
      state.thesisFromHelper = false;
      writeState(state);
    });
    $("bpThesis").addEventListener("blur", function () {
      writeState(state);
      setStatus("Thesis saved locally.", true);
    });
    ["bpStory", "bpCriticName"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", function () {
        if (id === "bpStory") state.story = el.value;
        else state.criticName = el.value;
        writeState(state);
        renderPreview(state);
      });
    });
    var pull = $("bpPullThesis");
    if (pull) {
      pull.addEventListener("click", function () {
        var saved = readSavedThesis();
        if (!saved) {
          setStatus("No thesis was found in the thesis helper yet.", false);
          return;
        }
        state.thesis = saved;
        state.thesisFromHelper = true;
        writeState(state);
        render(state);
        setStatus("Thesis filled from the thesis helper.", true);
      });
    }
    var pullTypes = $("bpPullTypes");
    if (pullTypes) {
      pullTypes.addEventListener("click", function () {
        var saved = savedTypeChoices();
        if (!saved.list.length) {
          setStatus("No criticism type was found in the thesis or outline helper yet.", false);
          return;
        }
        state.criticType = saved.list[0];
        state.typeFromHelper = true;
        writeState(state);
        render(state);
        setStatus("Criticism type filled from your saved Project 3 choice.", true);
      });
    }
    $("bpMoveText").addEventListener("input", function () {
      var move = MOVES[state.currentMove];
      state.moves[move.id] = $("bpMoveText").value;
      writeState(state);
      renderNav(state);
      renderPreview(state);
    });
    $("bpPrevMove").addEventListener("click", function () {
      if (state.currentMove > 0) {
        state.currentMove -= 1;
        writeState(state);
        renderNav(state);
        renderMove(state);
        renderPreview(state);
      }
    });
    $("bpNextMove").addEventListener("click", function () {
      if (state.currentMove < MOVES.length - 1) {
        state.currentMove += 1;
        writeState(state);
        renderNav(state);
        renderMove(state);
        renderPreview(state);
      }
    });
    function hookMla(id, key) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", function () {
        state.mla[key] = el.value;
        writeState(state);
      });
    }
    hookMla("bpMlaName", "name");
    hookMla("bpMlaInstructor", "instructor");
    hookMla("bpMlaCourse", "course");
    hookMla("bpMlaDate", "date");
    [["bpCiteAuthor0","bpCiteTitle0","bpCiteWhere0"],
     ["bpCiteAuthor1","bpCiteTitle1","bpCiteWhere1"],
     ["bpCiteAuthor2","bpCiteTitle2","bpCiteWhere2"]].forEach(function (ids, i) {
      ["author","title","where"].forEach(function (key, ki) {
        var el = $(ids[ki]);
        if (!el) return;
        el.addEventListener("input", function () {
          state.cited[i][key] = el.value;
          writeState(state);
        });
      });
    });
    $("bpCopy").addEventListener("click", function () { copyParagraph(state); });
    $("bpDownload").addEventListener("click", function () { downloadDraft(state); });
    $("bpClear").addEventListener("click", function () { clearAll(); state = readState(); render(state); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
