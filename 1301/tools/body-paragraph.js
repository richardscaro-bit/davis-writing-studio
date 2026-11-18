/* Body Paragraph Builder for ENGL 1301 Case Study practice.
   Progress is stored only in this browser. */
(function () {
  var STORAGE = "dws-1301-body-paragraph-v1";
  var CHOSEN_KEY = "engl1301.tools.thesis.chosenClaim";
  var OUTLINE_KEY = "engl1301.tools.outline.inputs";
  var DRAFTS_KEY = "engl1301.tools.thesis.drafts";

  var LENSES = ["Framing", "Stakeholders", "Evidence", "Assumptions", "Limits"];

  var MOVES = [
    {
      id: "topic",
      num: "1",
      title: "Topic sentence",
      hint: "Name which lens this paragraph uses. The five lenses are Framing, Stakeholders, Evidence, Assumptions, and Limits.",
      starters: [
        "When this case is read through the {lens} lens, ",
        "The {lens} lens shows that ",
        "Read through the {lens} lens, the case presents "
      ]
    },
    {
      id: "evidence",
      num: "2",
      title: "Primary case evidence",
      hint: "Use a detail from the packet or case brief, and include a citation.",
      starters: [
        "In the case, the packet states that \"\" ( ). ",
        "One cited detail from the primary case is that ",
        "The case brief reports that \"\" ( ). "
      ]
    },
    {
      id: "analysis",
      num: "3",
      title: "Analysis",
      hint: "Explain what the evidence means for your claim. Do not only repeat the quotation.",
      starters: [
        "This detail matters because ",
        "Read this way, the evidence suggests ",
        "What this shows is not only the fact itself, but "
      ]
    },
    {
      id: "source",
      num: "4",
      title: "Library or Google Scholar source",
      hint: "Bring in one outside source from the library or Google Scholar. You may use either outside source in any paragraph.",
      starters: [
        "A library or Google Scholar source complicates this picture: ",
        "According to , \"\" ( ). ",
        "Outside research on this issue finds that "
      ]
    },
    {
      id: "connection",
      num: "5",
      title: "Connection back to the primary case",
      hint: "Show how that outside source returns us to a detail in the packet or case brief.",
      starters: [
        "That finding returns us to the case, where ",
        "Set beside the packet, this source shows ",
        "In the primary case, the same pattern appears when "
      ]
    },
    {
      id: "tie",
      num: "6",
      title: "Tie back to the thesis",
      hint: "End by showing how this lens supports or complicates your thesis.",
      starters: [
        "This lens therefore supports the claim that ",
        "For the thesis, the {lens} lens shows ",
        "Taken together, this evidence keeps the argument on "
      ]
    }
  ];

  var CHECKS = [
    "Does the topic sentence name which lens this paragraph uses?",
    "Did you include primary case evidence with a citation?",
    "Does the analysis explain what the evidence means, not only repeat it?",
    "Did you bring in a library or Google Scholar source?",
    "Do you connect that source back to the primary case?",
    "Does the ending tie this paragraph back to the thesis?"
  ];

  function $(id) { return document.getElementById(id); }

  function emptyState() {
    return {
      lens: "",
      thesis: "",
      thesisFromHelper: false,
      currentMove: 0,
      moves: { topic: "", evidence: "", analysis: "", source: "", connection: "", tie: "" },
      checks: [null, null, null, null, null, null],
      mla: { name: "", instructor: "", course: "ENGL 1301", date: "" },
      cited: [
        { label: "primary", author: "", title: "", where: "" },
        { label: "outside1", author: "", title: "", where: "" },
        { label: "outside2", author: "", title: "", where: "" }
      ]
    };
  }

  function readState() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE) || "null");
      if (!raw || typeof raw !== "object") return emptyState();
      var base = emptyState();
      base.lens = LENSES.indexOf(raw.lens) >= 0 ? raw.lens : "";
      base.thesis = String(raw.thesis || "");
      base.thesisFromHelper = !!raw.thesisFromHelper;
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
        course: typeof m.course === "string" && m.course.trim() ? m.course : "ENGL 1301",
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

  function readSavedThesis() {
    function claimFrom(key) {
      try {
        var data = JSON.parse(localStorage.getItem(key) || "null");
        if (!data) return "";
        if (typeof data.claim === "string" && data.claim.trim()) return data.claim.trim();
        if (Array.isArray(data) && data[0] && typeof data[0].text === "string") return data[0].text.trim();
        return "";
      } catch (err) {
        return "";
      }
    }
    return claimFrom(CHOSEN_KEY) || claimFrom(OUTLINE_KEY) || claimFrom(DRAFTS_KEY) || "";
  }

  function lensToken(state) {
    return state.lens || "[lens]";
  }

  function fillStarter(text, state) {
    return String(text || "").replace(/\{lens\}/g, lensToken(state));
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

  function renderLens(state) {
    var host = $("bpLensPicker");
    if (!host) return;
    host.innerHTML = "";
    LENSES.forEach(function (name) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "idea-chip";
      btn.setAttribute("aria-pressed", state.lens === name ? "true" : "false");
      btn.textContent = name;
      btn.addEventListener("click", function () {
        state.lens = name;
        writeState(state);
        render(state);
        setStatus("Lens saved locally.", true);
      });
      host.appendChild(btn);
    });
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

  function renderMove(state) {
    var move = MOVES[state.currentMove] || MOVES[0];
    $("bpMoveEyebrow").textContent = "Move " + move.num + " of 6";
    $("bpMoveTitle").textContent = move.title;
    $("bpMoveHint").textContent = move.hint;
    var starters = $("bpStarters");
    starters.innerHTML = "";
    move.starters.forEach(function (s) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "idea-chip";
      btn.textContent = fillStarter(s, state).trim();
      btn.addEventListener("click", function () {
        var field = $("bpMoveText");
        var insert = fillStarter(s, state);
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
    if (text) {
      preview.textContent = text;
    } else {
      preview.textContent = "Your paragraph will appear here as you complete the six moves.";
    }
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
    if (state.lens) {
      lensLine.hidden = false;
      lensLine.textContent = "Lens: " + state.lens;
    } else {
      lensLine.hidden = false;
      lensLine.textContent = "Lens: choose one above.";
    }
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

  function render(state) {
    renderLens(state);
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

  function renderMla(state) {
    function set(id, val) { var el = $(id); if (el) el.value = val || ""; }
    set("bpMlaName", state.mla.name);
    set("bpMlaInstructor", state.mla.instructor);
    set("bpMlaCourse", state.mla.course || "ENGL 1301");
    set("bpMlaDate", state.mla.date);
    [["bpCiteAuthor0","bpCiteTitle0","bpCiteWhere0"],
     ["bpCiteAuthor1","bpCiteTitle1","bpCiteWhere1"],
     ["bpCiteAuthor2","bpCiteTitle2","bpCiteWhere2"]].forEach(function (ids, i) {
      set(ids[0], state.cited[i].author);
      set(ids[1], state.cited[i].title);
      set(ids[2], state.cited[i].where);
    });
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
    var payload = text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(
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
    lines.push("Lens: " + (state.lens || "(not chosen yet)"));
    if (state.thesis && state.thesis.trim()) {
      lines.push("Working thesis: " + state.thesis.trim());
    }
    lines.push("");
    if (paragraph) lines.push(paragraph);
    else lines.push("Add your six moves in the Body Paragraph Builder, then download again.");
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
      course: state.mla.course || "ENGL 1301",
      date: state.mla.date,
      lastName: DWSDocxWriter.lastNameFrom(state.mla.name),
      outlineLines: lines,
      worksCited: cited,
      worksCitedPrompt: "Add your primary case source and library or Google Scholar source entries above, then download again."
    });
    DWSDocxWriter.downloadBlob(blob, last + "-body-paragraph.docx");
    setStatus("Draft downloaded. It stays on your device.", true);
  }

  function clearAll() {
    localStorage.removeItem(STORAGE);
    var state = emptyState();
    var saved = readSavedThesis();
    if (saved) {
      state.thesis = saved;
      state.thesisFromHelper = true;
    }
    writeState(state);
    render(state);
    setStatus("Cleared.", false);
  }

  function bind() {
    if (!$("bpMoveText")) return;
    var state = readState();
    if (!String(state.thesis || "").trim()) {
      var saved = readSavedThesis();
      if (saved) {
        state.thesis = saved;
        state.thesisFromHelper = true;
        writeState(state);
      }
    }
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
