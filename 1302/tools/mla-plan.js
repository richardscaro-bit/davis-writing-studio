/* Outline helper only: primary-source form, Works Cited box, and Download plan (MLA). */
(function (global) {
  var STORAGE = "dws1302.tools.outline.mlaPlan";
  var SKELETON_KEY = "engl1301.tools.outline.skeleton";
  var CHOSEN_KEY = "engl1301.tools.chosen";
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var SHORT_MONTHS = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."];

  function $(id) { return document.getElementById(id); }

  function readPlan() {
    try { return JSON.parse(localStorage.getItem(STORAGE) || "null") || {}; }
    catch (err) { return {}; }
  }

  function writePlan(data) {
    localStorage.setItem(STORAGE, JSON.stringify(data));
  }

  function todayMla() {
    var d = new Date();
    return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  function invertName(name) {
    var a = String(name || "").replace(/\s+/g, " ").trim();
    if (!a) return "";
    if (a.indexOf(",") >= 0) return a.replace(/\s+/g, " ").trim();
    var parts = a.split(" ");
    if (parts.length === 1) return parts[0];
    return parts[parts.length - 1] + ", " + parts.slice(0, -1).join(" ");
  }

  function cleanTitle(t) {
    return String(t || "").replace(/\s+/g, " ").trim();
  }

  function hyphenPages(p) {
    return String(p || "").replace(/[\u2013\u2014\u2212]/g, "-").replace(/\s+/g, " ").trim();
  }

  function pagesPhrase(p) {
    var v = hyphenPages(p);
    if (!v) return "";
    if (/^p+\.?\s/i.test(v) || /^pp\./i.test(v)) return v.replace(/^p+\.?\s*/i, function (m) {
      return /-/ .test(v) || /pp/i.test(m) ? "pp. " : "p. ";
    });
    return /[-,]/.test(v) ? "pp. " + v : "p. " + v;
  }

  function formatAccess(d) {
    var v = String(d || "").trim();
    if (!v) return "";
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      var day = String(parseInt(m[3], 10));
      var mon = SHORT_MONTHS[parseInt(m[2], 10) - 1] || m[2];
      return day + " " + mon + " " + m[1];
    }
    return v;
  }

  function buildPrimary(plan) {
    plan = plan || {};
    var missing = [];
    var author = invertName(plan.author);
    var title = cleanTitle(plan.storyTitle);
    var kind = plan.sourceKind === "website" ? "website" : "anthology";
    if (!title) missing.push("the story title");
    var parts = [];
    if (author) parts.push(author + ".");
    if (title) parts.push('"' + title.replace(/^["']|["']$/g, "") + '."');

    if (kind === "anthology") {
      var anth = cleanTitle(plan.anthologyTitle);
      var editor = String(plan.editor || "").replace(/\s+/g, " ").trim();
      var publisher = cleanTitle(plan.publisher);
      var year = cleanTitle(plan.year);
      var pages = pagesPhrase(plan.pages);
      if (!anth) missing.push("the anthology title");
      if (!editor) missing.push("the editor");
      if (!publisher) missing.push("the publisher");
      if (!year) missing.push("the year");
      if (!pages) missing.push("the page range");
      if (anth) parts.push("*" + anth + "*,");
      if (editor) {
        var ed = editor.indexOf(",") >= 0 || editor.indexOf(" and ") >= 0 ? editor : invertName(editor).split(", ").reverse().join(" ").replace(/^([^ ]+) (.+)$/, function (_, last, rest) {
          return rest + " " + last;
        });
        // Keep "First Last" for "edited by"
        var edFirstLast = editor.indexOf(",") >= 0
          ? editor.split(",").slice(1).join(",").trim() + " " + editor.split(",")[0].trim()
          : editor;
        parts.push("edited by " + edFirstLast + ",");
      }
      if (publisher) parts.push(publisher + ",");
      if (year) parts.push(year + (pages ? "," : "."));
      if (pages) parts.push(pages + ".");
    } else {
      var site = cleanTitle(plan.websiteName);
      var url = cleanTitle(plan.url);
      var access = formatAccess(plan.accessDate);
      if (!site) missing.push("the website name");
      if (!url) missing.push("the URL");
      if (site) parts.push("*" + site + "*,");
      if (url) parts.push(url + (access ? "," : "."));
      if (access) parts.push("Accessed " + access + ".");
    }

    var text = parts.join(" ").replace(/\s+,/g, ",").replace(/\s+\./g, ".").replace(/,\s*\./g, ".").replace(/\s+/g, " ").trim();
    var flag = "";
    if (missing.length) {
      if (missing.length === 1) flag = "Add " + missing[0] + " to finish this entry.";
      else if (missing.length === 2) flag = "Add " + missing[0] + " and " + missing[1] + " to finish this entry.";
      else flag = "Add " + missing.slice(0, -1).join(", ") + ", and " + missing[missing.length - 1] + " to finish this entry.";
    }
    return { text: text, missing: missing, flag: flag, complete: missing.length === 0 && !!text };
  }

  function sortKey(entry) {
    return String(entry || "")
      .replace(/\*/g, "")
      .replace(/^["']/, "")
      .replace(/^(the|a|an)\s+/i, "")
      .toLowerCase();
  }

  function criticLines(text) {
    return String(text || "")
      .split(/\r?\n/)
      .map(function (line) { return line.trim(); })
      .filter(Boolean)
      .map(function (line) { return line.replace(/[\u2013\u2014\u2212]/g, "-"); });
  }

  function gatherWorksCited(plan) {
    var list = [];
    var primary = buildPrimary(plan);
    if (primary.text) list.push(primary.text);
    criticLines(plan.entries).forEach(function (line) { list.push(line); });
    list.sort(function (a, b) { return sortKey(a).localeCompare(sortKey(b)); });
    return { entries: list, primary: primary };
  }

  function readSkeleton() {
    try { return JSON.parse(localStorage.getItem(SKELETON_KEY) || "null"); }
    catch (err) { return null; }
  }

  function readChosen() {
    try { return JSON.parse(localStorage.getItem(CHOSEN_KEY) || "null"); }
    catch (err) { return null; }
  }

  function typeLine() {
    var types = global.DWSP3CriticTypes && DWSP3CriticTypes.isP3() && DWSP3CriticTypes.get();
    if (!types || !types.summary) return "";
    return "Criticism type or types: " + types.summary + ".";
  }

  function outlineLines() {
    var sk = readSkeleton();
    var chosen = readChosen() || {};
    var lines = [];
    var claim = (sk && sk.claim) || chosen.claim || "";
    if (claim) {
      lines.push("Working thesis");
      lines.push(claim);
    }
    var types = typeLine();
    if (types) lines.push(types);
    if (!sk || !Array.isArray(sk.sections)) return lines;
    sk.sections.forEach(function (sec) {
      if (!sec) return;
      lines.push("");
      if (sec.title) lines.push(sec.title);
      if (sec.topic) lines.push(sec.topic);
      (sec.cues || []).forEach(function (cue) {
        if (cue) lines.push("- " + cue);
      });
    });
    if (sk.note) {
      lines.push("");
      lines.push("Source reminder: " + sk.note);
    }
    return lines;
  }

  function collectForm() {
    function val(id) { var el = $(id); return el ? el.value : ""; }
    function checked(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : "";
    }
    return {
      name: val("mlaPlanName"),
      instructor: val("mlaPlanInstructor"),
      course: val("mlaPlanCourse"),
      date: val("mlaPlanDate"),
      author: val("mlaPlanAuthor"),
      storyTitle: val("mlaPlanStory"),
      sourceKind: checked("mlaPlanKind") || "anthology",
      anthologyTitle: val("mlaPlanAnthology"),
      editor: val("mlaPlanEditor"),
      publisher: val("mlaPlanPublisher"),
      year: val("mlaPlanYear"),
      pages: val("mlaPlanPages"),
      websiteName: val("mlaPlanWebsite"),
      url: val("mlaPlanUrl"),
      accessDate: val("mlaPlanAccess"),
      entries: val("mlaPlanEntries")
    };
  }

  function fillForm(plan) {
    function set(id, v) { var el = $(id); if (el && v != null) el.value = v; }
    plan = plan || {};
    set("mlaPlanName", plan.name || "");
    set("mlaPlanInstructor", plan.instructor || "");
    set("mlaPlanCourse", plan.course || "ENGL 1302");
    set("mlaPlanDate", plan.date || todayMla());
    set("mlaPlanAuthor", plan.author || "");
    set("mlaPlanStory", plan.storyTitle || "");
    var kind = plan.sourceKind === "website" ? "website" : "anthology";
    var radio = document.querySelector('input[name="mlaPlanKind"][value="' + kind + '"]');
    if (radio) radio.checked = true;
    set("mlaPlanAnthology", plan.anthologyTitle || "");
    set("mlaPlanEditor", plan.editor || "");
    set("mlaPlanPublisher", plan.publisher || "");
    set("mlaPlanYear", plan.year || "");
    set("mlaPlanPages", plan.pages || "");
    set("mlaPlanWebsite", plan.websiteName || "");
    set("mlaPlanUrl", plan.url || "");
    set("mlaPlanAccess", plan.accessDate || "");
    set("mlaPlanEntries", plan.entries || "");
    applyKind();
    updatePreview();
  }

  function applyKind() {
    var plan = collectForm();
    var anth = $("mlaPlanAnthologyFields");
    var web = $("mlaPlanWebsiteFields");
    if (anth) anth.hidden = plan.sourceKind !== "anthology";
    if (web) web.hidden = plan.sourceKind !== "website";
  }

  function updatePreview() {
    var plan = collectForm();
    writePlan(plan);
    var built = buildPrimary(plan);
    var preview = $("mlaPlanPrimaryPreview");
    var flag = $("mlaPlanPrimaryFlag");
    if (preview) {
      preview.textContent = built.text || "The story entry will appear here as you fill in the form.";
    }
    if (flag) {
      flag.hidden = !built.flag;
      flag.textContent = built.flag;
    }
  }

  function fileName(plan) {
    var last = (global.DWSDocxWriter && DWSDocxWriter.lastNameFrom(plan.name)) || "outline";
    last = last.replace(/[^A-Za-z0-9-]+/g, "") || "outline";
    return last + "-outline-plan.docx";
  }

  function downloadPlan() {
    if (!global.DWSDocxWriter || !DWSDocxWriter.buildMlaPlanDocx) return;
    var plan = collectForm();
    writePlan(plan);
    var cited = gatherWorksCited(plan);
    var blob = DWSDocxWriter.buildMlaPlanDocx({
      name: plan.name,
      instructor: plan.instructor,
      course: plan.course,
      date: plan.date,
      lastName: DWSDocxWriter.lastNameFrom(plan.name),
      outlineLines: outlineLines(),
      worksCited: cited.entries,
      worksCitedPrompt: "Add your primary source and critic entries above, then download again."
    });
    DWSDocxWriter.downloadBlob(blob, fileName(plan));
  }

  function bind() {
    if (!$("mlaDownloadPlan")) return;
    fillForm(readPlan());
    var host = $("mlaDownloadPlan");
    host.addEventListener("input", updatePreview);
    host.addEventListener("change", function () {
      applyKind();
      updatePreview();
    });
    var btn = $("outlineDownloadPlan");
    var btnBar = $("outlineDownloadPlanBar");
    [btn, btnBar].forEach(function (el) {
      if (el) el.addEventListener("click", function (e) {
        e.preventDefault();
        downloadPlan();
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  global.DWSMlaPlan = {
    buildPrimary: buildPrimary,
    gatherWorksCited: gatherWorksCited,
    outlineLines: outlineLines,
    collectForm: collectForm,
    downloadPlan: downloadPlan,
    invertName: invertName
  };
})(window);
