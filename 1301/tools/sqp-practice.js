/* ENGL 1301 summary, paraphrase, and quote practice: page behavior.
   Nothing is stored and nothing is sent. No localStorage, no cookies, no fetch. */
(function () {
  var D = window.SQP_DATA;
  var S = window.SQP;
  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  function getPath(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /* Show CO2 with a subscript two. The text content stays CO2. */
  function withSub(s) {
    return esc(s).replace(/CO2/g, "CO<sub>2</sub>");
  }

  /* Fill every handout string from the one data file. */
  $$("[data-fill]").forEach(function (el) {
    var v = getPath(el.getAttribute("data-fill"));
    if (typeof v === "string") el.innerHTML = withSub(v);
  });
  $("#sqpPassage").innerHTML = withSub(D.passage);
  $("#sqpSourceNote").innerHTML =
    "Source: " + esc(D.sourceLine) +
    " If you name the authors in the sentence, put only the page number in parentheses, like this: (2). If you do not name the authors in the sentence, put the name and the page in parentheses, like this: (Siddik et al. 2). MLA 9 uses et al. after the first author when a source has three or more authors.";
  var wc = $("#sqpWorksCited");
  var i = D.worksCited.indexOf(D.worksCitedItalic);
  wc.innerHTML = esc(D.worksCited.slice(0, i)) + "<i>" + esc(D.worksCitedItalic) + "</i>" + esc(D.worksCited.slice(i + D.worksCitedItalic.length));

  /* Mobile nav */
  var toggle = $("#sqpNavToggle");
  var mobile = $("#mobileNav");
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Results */
  var DOTS = { Strong: "\u25CF\u25CF\u25CF", Medium: "\u25CF\u25CF\u25CB", Weak: "\u25CF\u25CB\u25CB" };
  function badge(label) {
    return '<span class="sqp-badge ' + label.toLowerCase() + '"><span aria-hidden="true">' + DOTS[label] + "</span> " + label + "</span>";
  }
  function fixList(r) {
    if (!r.fix.length) return "";
    return '<p class="sqp-fixhead">Fix next</p><ul class="sqp-fix">' + r.fix.map(function (f) {
      return "<li><strong>" + (f.level === "core" ? "Must fix:" : "Polish:") + "</strong> " + esc(f.text) + "</li>";
    }).join("") + "</ul>";
  }
  function goodList(r) {
    if (!r.good.length) return "";
    return '<details class="sqp-details sqp-good"><summary>What is working</summary><ul class="sqp-list">' + r.good.map(function (g) {
      return "<li>" + esc(g) + "</li>";
    }).join("") + "</ul></details>";
  }
  function renderSingle(slot, r) {
    slot.innerHTML =
      '<div class="sqp-result ' + r.label.toLowerCase() + '"><p class="sqp-resulthead">' + badge(r.label) + " <span>" + esc(r.headline) + "</span></p>" +
      fixList(r) + goodList(r) + "</div>";
  }
  function renderSandwich(slot, r) {
    var names = { introduce: "1 Introduce", quote: "2 Quote", explain: "3 Explain" };
    var html = '<div class="sqp-result ' + r.label.toLowerCase() + '"><p class="sqp-resulthead">' + badge(r.label) + " <span>" + esc(r.headline) + "</span></p>";
    ["introduce", "quote", "explain"].forEach(function (k) {
      var p = r.parts[k];
      html += '<div class="sqp-part"><p class="sqp-parthead"><strong>' + names[k] + "</strong> " + badge(p.label) + "</p>" + fixList(p) + goodList(p) + "</div>";
    });
    slot.innerHTML = html + "</div>";
  }

  function val(id) { return $("#" + id).value; }

  function run(kind) {
    var slot, r;
    if (kind === "summary") { r = S.checkSummary(val("sqpSummary")); renderSingle($("#resSummary"), r); }
    else if (kind === "paraphrase") { r = S.checkParaphrase(val("sqpParaphrase")); renderSingle($("#resParaphrase"), r); }
    else if (kind === "quote") { r = S.checkQuote(val("sqpQuote")); renderSingle($("#resQuote"), r); }
    else if (kind === "sandwich") {
      r = S.checkSandwich({ introduce: val("sqpIntro"), quote: val("sqpSandQuote"), explain: val("sqpExplain") });
      renderSandwich($("#resSandwich"), r);
    }
  }

  function updateCounts() {
    $("#sqpSummaryCount").textContent = val("sqpSummary").trim() ? S.wordCount(val("sqpSummary")) + " words. The passage has " + S.passageWords + " words." : "The passage has " + S.passageWords + " words.";
    $("#sqpParaphraseCount").textContent = val("sqpParaphrase").trim() ? S.wordCount(val("sqpParaphrase")) + " words. The passage has " + S.passageWords + " words." : "";
  }
  function updatePreview() {
    var parts = [val("sqpIntro"), val("sqpSandQuote"), val("sqpExplain")].map(function (s) { return S.norm(s); }).filter(Boolean);
    $("#sqpPreview").textContent = parts.length ? parts.join(" ") : "Nothing yet.";
  }
  ["sqpSummary", "sqpParaphrase", "sqpQuote", "sqpIntro", "sqpSandQuote", "sqpExplain"].forEach(function (id) {
    $("#" + id).addEventListener("input", function () { updateCounts(); updatePreview(); });
  });
  updateCounts();

  $$("[data-check]").forEach(function (btn) {
    if (btn.hasAttribute("data-load")) return;
    btn.addEventListener("click", function () { run(btn.getAttribute("data-check")); });
  });
  $$("[data-load]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $("#" + btn.getAttribute("data-load")).value = getPath(btn.getAttribute("data-text"));
      updateCounts();
      run(btn.getAttribute("data-check"));
      var slotId = { summary: "resSummary", paraphrase: "resParaphrase", quote: "resQuote" }[btn.getAttribute("data-check")];
      if (slotId) $("#" + slotId).scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  });
  $$("[data-clear]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.getAttribute("data-clear").split(",").forEach(function (id) { $("#" + id).value = ""; });
      var card = btn.closest(".sqp-card");
      var slot = card && $(".sqp-result-slot", card);
      if (slot) slot.innerHTML = "";
      updateCounts();
      updatePreview();
    });
  });
  $("#sqpLoadSandwich").addEventListener("click", function () {
    $("#sqpIntro").value = D.models.introduce;
    $("#sqpSandQuote").value = D.models.sandwichQuote;
    $("#sqpExplain").value = D.models.explain;
    updatePreview();
    run("sandwich");
  });

  /* Download */
  $("#sqpDownload").addEventListener("click", function () {
    var status = $("#sqpDlStatus");
    var fields = { name: val("dlName").trim(), instructor: val("dlInstructor").trim(), course: val("dlCourse").trim(), date: val("dlDate").trim() };
    var missing = [];
    if (!fields.name) missing.push("your name");
    if (!fields.instructor) missing.push("your instructor");
    if (!fields.course) missing.push("the course");
    if (!fields.date) missing.push("the date");
    if (missing.length) {
      status.className = "sqp-status warn";
      status.textContent = "Fill in " + missing.join(", ") + " so the MLA heading is complete.";
      return;
    }
    var paras = [];
    if ($("#incSummary").checked && val("sqpSummary").trim()) paras.push(S.norm(val("sqpSummary")));
    if ($("#incParaphrase").checked && val("sqpParaphrase").trim()) paras.push(S.norm(val("sqpParaphrase")));
    if ($("#incQuote").checked && val("sqpQuote").trim()) paras.push(S.norm(val("sqpQuote")));
    if ($("#incSandwich").checked) {
      var sw = [val("sqpIntro"), val("sqpSandQuote"), val("sqpExplain")].map(function (s) { return S.norm(s); }).filter(Boolean);
      if (sw.length) paras.push(sw.join(" "));
    }
    if (!paras.length) {
      status.className = "sqp-status warn";
      status.textContent = "Write something in Steps 1 to 4 first, then download.";
      return;
    }
    var blob = window.SQPDocx.buildMlaDocx({
      name: fields.name,
      instructor: fields.instructor,
      course: fields.course,
      date: fields.date,
      title: val("dlTitle"),
      paragraphs: paras,
      worksCited: D.worksCited,
      worksCitedItalic: D.worksCitedItalic
    });
    var last = window.SQPDocx.lastNameFrom(fields.name).replace(/[^A-Za-z0-9]+/g, "");
    window.SQPDocx.downloadBlob(blob, "MLA-practice" + (last ? "-" + last : "") + ".docx");
    status.className = "sqp-status ok";
    status.textContent = "Your file is downloading. The header will read " + (window.SQPDocx.lastNameFrom(fields.name) || "your last name") + " 1.";
  });
})();
