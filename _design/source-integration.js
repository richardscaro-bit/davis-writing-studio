/* Shared source-integration practice for ENGL 1301 and 1302.
   Progress is stored only in this browser. */
(function () {
  var course = (document.body && document.body.getAttribute("data-course")) || "1301";
  var STORAGE = course === "1302" ? "dws-1302-source-integration-v1" : "dws-1301-source-integration-v1";

  var PASSAGES = {
    "1301": {
      label: "Invented practice passage (not a student paper)",
      sourceLine: "From an invented campus newsletter, \"Fall Compost Pickup Pilot.\"",
      cite: "(Elmhurst)",
      author: "Elmhurst",
      text: "Households that join the weekly compost pickup will cut landfill waste in half by the end of the year. Signup is offered only in English, and pickup is limited to single-family homes on the north loop."
    },
    "1302": {
      label: "Public domain passage (Poe)",
      sourceLine: "From Edgar Allan Poe, \"The Raven,\" which is in the public domain.",
      cite: "(Poe)",
      author: "Poe",
      text: "Once upon a midnight dreary, while I pondered, weak and weary, over many a quaint and curious volume of forgotten lore, while I nodded, nearly napping, suddenly there came a tapping, as of some one gently rapping, rapping at my chamber door. \"'Tis some visiter,\" I muttered, \"tapping at my chamber door; only this and nothing more.\""
    }
  };

  var CHECKS = [
    "Did you write the gist or summary with the passage hidden?",
    "Is your paraphrase in your own sentence shape, not the source's wording copied with a few swaps?",
    "Does your quote sandwich have a signal phrase, quotation marks, a citation, and an explanation?",
    "Did you add your own point after the source, not only repeat what it says?"
  ];

  function $(id) { return document.getElementById(id); }

  function emptyState() {
    return {
      passageHidden: false,
      gist: "",
      paraphrase: "",
      sandwich: "",
      checks: [null, null, null, null]
    };
  }

  function readState() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE) || "null");
      if (!raw || typeof raw !== "object") return emptyState();
      var base = emptyState();
      base.passageHidden = !!raw.passageHidden;
      ["gist", "paraphrase", "sandwich"].forEach(function (k) {
        base[k] = typeof raw[k] === "string" ? raw[k] : "";
      });
      base.checks = CHECKS.map(function (_, i) {
        var v = raw.checks && raw.checks[i];
        return v === "yes" || v === "no" ? v : null;
      });
      return base;
    } catch (err) {
      return emptyState();
    }
  }

  function writeState(state) {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }

  function setStatus(msg, ok) {
    var el = $("siSaveStatus");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("ok", !!ok);
  }

  function renderPassage(state) {
    var passage = PASSAGES[course] || PASSAGES["1301"];
    var textEl = $("siPassageText");
    var labelEl = $("siPassageLabel");
    var sourceEl = $("siPassageSource");
    var btn = $("siHidePassage");
    if (labelEl) labelEl.textContent = passage.label;
    if (sourceEl) sourceEl.textContent = passage.sourceLine;
    if (textEl) {
      textEl.hidden = !!state.passageHidden;
      textEl.textContent = passage.text;
    }
    var hiddenNote = $("siPassageHiddenNote");
    if (hiddenNote) hiddenNote.hidden = !state.passageHidden;
    if (btn) btn.textContent = state.passageHidden ? "Show the passage" : "Hide the passage";
  }

  function renderFields(state) {
    ["gist", "paraphrase", "sandwich"].forEach(function (k) {
      var id = "si" + k.charAt(0).toUpperCase() + k.slice(1);
      var el = $(id);
      if (el) el.value = state[k] || "";
    });
  }

  function renderChecks(state) {
    var host = $("siChecks");
    if (!host) return;
    host.innerHTML = "";
    CHECKS.forEach(function (q, i) {
      var row = document.createElement("div");
      row.className = "bp-check";
      var p = document.createElement("p");
      p.className = "bp-check-q";
      p.id = "siCheckQ" + i;
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
    renderPassage(state);
    renderFields(state);
    renderChecks(state);
  }

  function bind() {
    if (!$("siGist")) return;
    var state = readState();
    render(state);

    var hideBtn = $("siHidePassage");
    if (hideBtn) {
      hideBtn.addEventListener("click", function () {
        state.passageHidden = !state.passageHidden;
        writeState(state);
        renderPassage(state);
        setStatus(state.passageHidden ? "Passage hidden. Write from memory, then show it to check." : "Passage shown. Check your work against it.", true);
      });
    }
    [["siGist", "gist"], ["siParaphrase", "paraphrase"], ["siSandwich", "sandwich"]].forEach(function (pair) {
      var el = $(pair[0]);
      if (!el) return;
      el.addEventListener("input", function () {
        state[pair[1]] = el.value;
        writeState(state);
      });
    });
    var clearBtn = $("siClear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        localStorage.removeItem(STORAGE);
        state = emptyState();
        writeState(state);
        render(state);
        setStatus("Cleared.", false);
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
