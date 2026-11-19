/* Thesis generator engine (thesis-helper pages only). Builds draft thesis options from the
   student's own words, using the per-course catalog in tools/thesis-catalog.js.
   No backend, no AI calls. Student words are never cut short. */
(function (global) {
  "use strict";

  var FUNCTION_WORDS = ["a", "an", "the", "this", "that", "these", "those", "my", "our", "your", "its", "their",
    "his", "her", "and", "or", "but", "of", "in", "on", "for", "to", "with", "how", "why", "what", "when", "where",
    "although", "while", "because", "both", "each", "every", "some", "most", "many", "once", "after", "before"];
  var I_WORDS = /^(I|I'm|I’m|I've|I’ve|I'd|I’d|I'll|I’ll)$/;
  var LONG_WORDS = 45;

  var STATUS = {
    made1: "Made 1 thesis option. Saved in this browser.",
    madeN: "Made {n} thesis options. Saved in this browser.",
    missing: "Fill in these boxes first: ",
    missingCriteria: "all three comparison points",
    long: "This one is long. Try cutting it to one main point.",
    vagueComparison: "Say what the two share, in your own words.",
    csVerb: "Start your answer with a verb so it finishes 'The {name} study ...'. For example: only partly supports its loyalty story.",
    csLenses: "Add one short point for each lens to get the full five lens options. Missing: "
  };

  function collapse(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }
  function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function joinAnd(list) {
    list = (list || []).filter(Boolean);
    if (!list.length) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + " and " + list[1];
    return list.slice(0, -1).join(", ") + ", and " + list[list.length - 1];
  }
  function wordCount(s) { return collapse(s).split(" ").filter(Boolean).length; }

  /* Step 2: strip one leading stem (case-insensitive), then a leading "that " and a leading comma. */
  function stripStem(text, stems) {
    var t = text;
    var list = (stems || []).slice().sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < list.length; i++) {
      var st = list[i];
      var re = st instanceof RegExp ? st : new RegExp("^" + escRe(st) + "(?=$|[\\s,:;])", "i");
      if (re.test(t)) {
        t = t.replace(re, "").replace(/^[\s,:;]+/, "");
        break;
      }
    }
    t = t.replace(/^that\s+/i, "").replace(/^,\s*/, "");
    return t.trim();
  }

  /* Step 3: trailing punctuation. */
  function stripTrail(text, keepQuestion) {
    var t = text.replace(/[\s.!,:;]+$/, "");
    if (keepQuestion) {
      t = t.replace(/[\s.!,:;?]+$/, "");
      if (t) t += "?";
    }
    return t;
  }

  /* Words that should keep their capital letter anywhere: capitalized words in the subject field
     (not small words), and capitalized words that appear mid-sentence in any field. */
  function properWords(fields) {
    var set = {};
    (fields || []).forEach(function (f, idx) {
      var s = collapse(f);
      if (!s) return;
      var re = /[A-Za-z][A-Za-z'’-]*/g, m;
      while ((m = re.exec(s))) {
        var w = m[0];
        if (!/^[A-Z]/.test(w)) continue;
        var before = s.slice(0, m.index).replace(/[\s“"‘(]+$/, "");
        var sentenceStart = !before || /[.?!:]$/.test(before);
        var base = w.replace(/['’]s$/, "");
        if (FUNCTION_WORDS.indexOf(base.toLowerCase()) >= 0) continue;
        if (idx === 0 && !sentenceStart) { set[base] = true; continue; }
        if (!sentenceStart) set[base] = true;
      }
      if (idx === 0) {
        var fw = firstWord(s);
        if (fw && /^[A-Z]/.test(fw) && midCase(s, {}, true) === s) set[fw.replace(/['’]s$/, "")] = true;
      }
    });
    return set;
  }

  function firstWord(text) {
    var m = String(text).match(/^[“"‘(]*([A-Za-z][A-Za-z'’-]*)/);
    return m ? m[1] : "";
  }

  /* Step 4: mid-sentence case rule. */
  function midCase(text, proper, isSubject) {
    var t = String(text || "");
    if (!t) return t;
    if (/^[“"‘(]/.test(t)) return t;
    var w = firstWord(t);
    if (!w || !/^[A-Z]/.test(w)) return t;
    var base = w.replace(/['’]s$/, "");
    if (I_WORDS.test(w)) return t;
    if (/[A-Z]/.test(w.slice(1))) return t;
    if (FUNCTION_WORDS.indexOf(base.toLowerCase()) >= 0) return t.charAt(0).toLowerCase() + t.slice(1);
    if (/['’]s$/.test(w)) return t;
    if (proper && proper[base]) return t;
    if (isSubject) {
      var rest = t.slice(w.length);
      if (/\b[A-Z][a-z]/.test(rest)) return t; /* a list of names, such as "Godzilla and King Kong" */
      if (!/[A-Za-z]/.test(rest)) return t; /* a one-word name, such as "Vecna" or "BarkBox" */
    }
    return t.charAt(0).toLowerCase() + t.slice(1);
  }
  function startCase(text) {
    var t = String(text || "");
    var i = t.search(/[A-Za-z]/);
    if (i < 0) return t;
    return t.slice(0, i) + t.charAt(i).toUpperCase() + t.slice(i + 1);
  }

  function clean(raw, stems, opts) {
    opts = opts || {};
    var t = collapse(raw);
    if (!t) return "";
    t = stripStem(t, stems);
    t = stripTrail(t, !!opts.question);
    return t;
  }

  /* Render a template. Each ${name} slot gets start case (template start or after ". " / "? "),
     question case, or the mid-sentence rule. */
  function render(tpl, vars, roles, proper) {
    var out = "";
    var re = /\$\{(\w+)\}/g, last = 0, m;
    while ((m = re.exec(tpl))) {
      var lead = tpl.slice(last, m.index);
      out += lead;
      var name = m[1];
      var val = vars[name] == null ? "" : String(vars[name]);
      var role = roles[name] || "mid";
      var prev = out.replace(/\s+$/, "");
      var atStart = !prev || /[.?!]$/.test(prev);
      if (role === "question") val = startCase(val);
      else if (role === "raw") { /* keep as typed after cleaning */ }
      else if (atStart) val = startCase(val);
      else val = midCase(val, proper, name === "caseName" || name === "pairLabel" || name === "caseTitle");
      var next = tpl.charAt(m.index + m[0].length);
      if (/[,.]/.test(next) && /”$/.test(val)) {
        val = val.slice(0, -1) + next + "”";
        last = m.index + m[0].length + 1;
        out += val;
        continue;
      }
      if (next === "." && /[?!]$/.test(val)) {
        out += val;
        last = m.index + m[0].length + 1;
        continue;
      }
      out += val;
      last = m.index + m[0].length;
    }
    out += tpl.slice(last);
    return out.replace(/\s{2,}/g, " ").trim();
  }

  function splitAt(text, markers) {
    var t = String(text || "");
    for (var i = 0; i < markers.length; i++) {
      var re = markers[i] instanceof RegExp ? markers[i] : new RegExp(escRe(markers[i]), "i");
      var m = t.match(re);
      if (m) return [t.slice(0, m.index), t.slice(m.index + m[0].length)];
    }
    return null;
  }

  function caseTitleOf(name) {
    var m = String(name || "").match(/^(.+?),\s*([“"][^”"]+[”"])\s*$/);
    if (!m) return name;
    var author = m[1].trim();
    return author + (/s$/.test(author) ? "'" : "'s") + " " + m[2];
  }

  function derive(mode, v) {
    var d = {};
    var t = v.tension || "";
    if (mode.split === "because") {
      var p = splitAt(t, [/\s+because\s+/i]);
      if (p && p[0].trim() && p[1].trim()) { d.stance = stripTrail(p[0].trim()); d.reason = stripTrail(p[1].trim()); }
    } else if (mode.split === "counter") {
      var c = splitAt(t, [/,\s*while a fair counter says\s*/i, /[,;]?\s*a fair counter says\s*/i, /[,;]?\s*a fair counter is\s*/i]);
      if (c && c[0].trim() && c[1].trim()) {
        d.stance = c[0].replace(/[\s,;]+$/, "").trim();
        d.counterView = stripTrail(c[1].trim());
      } else {
        d.stance = t;
      }
    } else if (mode.split === "remix") {
      var r = splitAt(t, [/\bmy remix\b\s*/i]);
      if (r && r[1].trim()) {
        d.judgment = r[0].replace(/[\s,;]+$/, "").replace(/\s+and$/i, "").replace(/[\s,;]+$/, "").trim();
        d.remixRest = stripTrail(r[1].trim());
        if (!d.judgment) d.judgment = t;
      } else {
        d.judgment = t;
      }
    } else if (mode.split === "growth") {
      var g = splitAt(t, [/,\s*but I still need to\s+/i, /\s+but I still need to\s+/i, /\bI still need to\s+/i]);
      if (g && g[0].trim() && g[1].trim()) {
        d.growth = g[0].replace(/[\s,;]+$/, "").trim();
        d.goal = stripTrail(g[1].trim());
      }
    }
    if (mode.pair) {
      var on = String(v.caseName || "").match(/^(.+?)\s+on\s+(.+)$/i);
      if (on) { d.pairLabel = on[1].trim(); d.theme = on[2].trim(); }
      else { d.pairLabel = v.caseName; d.theme = ""; }
    }
    d.caseTitle = caseTitleOf(v.caseName);
    return d;
  }

  function predicate(name, ctx) {
    switch (name) {
      case "criteriaShort": return ctx.criteriaWords > 0 && ctx.criteriaWords <= 12;
      case "tensionIsQuestion": return /\?$/.test(ctx.vars.tension || "");
      case "tensionNotQuestion": return !/\?$/.test(ctx.vars.tension || "");
      case "hasTheme": return !!ctx.vars.theme;
      case "noTheme": return !ctx.vars.theme;
      case "hasGrowth": return !!ctx.vars.growth;
      case "noGrowth": return !ctx.vars.growth;
      default: return true;
    }
  }

  function pickTemplate(entry, ctx) {
    if (!entry) return null;
    if (entry.skipIf && predicate(entry.skipIf, ctx)) return null;
    if (entry.variants) {
      for (var i = 0; i < entry.variants.length; i++) {
        var vt = entry.variants[i];
        if (!vt.if || predicate(vt.if, ctx)) return vt;
      }
      return null;
    }
    return entry;
  }

  function modeFor(catalog, essay) {
    var id = (essay && essay.id) || "";
    var modes = (catalog && catalog.modes) || {};
    return modes[id] || modes[""] || null;
  }

  function fieldLabels(mode, essay) {
    var c = (mode && mode.copy) || {};
    var e = essay || {};
    return {
      caseName: c.subjectLabel || e.subjectLabel || "Subject or focus",
      packetArgues: c.presentsLabel || e.presentsLabel || "What sources or people usually say",
      tension: c.tensionLabel || e.tensionLabel || "Your main point"
    };
  }

  function caseStudyBuild(mode, v, raw, proper, catalog, out) {
    var lensIds = ["framing", "stakeholders", "evidence", "assumptions", "limits"];
    var lensNames = { framing: "Framing", stakeholders: "Stakeholders", evidence: "Evidence", assumptions: "Assumptions", limits: "Limits" };
    var lens = {};
    lensIds.forEach(function (id) {
      var stems = ["Its " + id, "The " + id, lensNames[id]];
      var val = clean((raw.lens || {})[id] || "", stems);
      val = val.replace(/^:\s*/, "");
      lens[id] = val ? midCase(val, proper) : "";
    });
    var all = lensIds.every(function (id) { return !!lens[id]; });
    var vars = Object.assign({}, v, {
      lensFraming: lens.framing, lensStakeholders: lens.stakeholders, lensEvidence: lens.evidence,
      lensAssumptions: lens.assumptions, lensLimits: lens.limits
    });
    var T = mode.caseStudy;
    var roles = { question: "question", caseName: "raw", tension: "mid", argues: "mid" };
    var opts = [];
    var generalTail = function () {
      var parts = {
        framing: lens.framing ? "the way its framing " + lens.framing : "its framing of the case",
        stakeholders: lens.stakeholders ? "the way its stakeholders " + lens.stakeholders : "the stakeholders it centers",
        evidence: lens.evidence ? "the way its evidence " + lens.evidence : "the evidence it offers",
        assumptions: lens.assumptions ? "the way its assumptions " + lens.assumptions : "the assumptions it makes",
        limits: lens.limits ? "the way its limits " + lens.limits : "the limits of what it can show"
      };
      return joinAnd(lensIds.map(function (id) { return parts[id]; }));
    };
    if (all) {
      opts.push({ angle: "five-lenses", label: T.five.label, text: render(T.five.text, vars, roles, proper), why: T.five.why });
      if (v.argues) opts.push({ angle: "presents", label: T.presents.label, text: render(T.presents.text, vars, roles, proper), why: T.presents.why });
    } else {
      var general = render(T.general.text, Object.assign({}, vars, { generalLenses: generalTail() }), Object.assign({ generalLenses: "raw" }, roles), proper);
      opts.push({ angle: "five-general", label: T.general.label, text: general, why: T.general.why });
      if (raw.lensFieldsOn) {
        var missing = lensIds.filter(function (id) { return !lens[id]; }).map(function (id) { return lensNames[id]; });
        out.notes.push(STATUS.csLenses + joinAnd(missing) + ".");
      }
    }
    if (v.question) {
      var qTpl = all ? T.question.text : T.questionGeneral.text;
      opts.push({ angle: "question", label: T.question.label,
        text: render(qTpl, Object.assign({}, vars, { generalLenses: generalTail() }), Object.assign({ generalLenses: "raw" }, roles), proper),
        why: T.question.why });
    }
    var fw = (v.tension.match(/^[A-Za-z’']+/) || [""])[0].toLowerCase();
    var verbs = mode.verbList || [];
    if (fw && verbs.indexOf(fw) < 0 && !/(s|ed)$/.test(fw)) {
      out.notes.push(STATUS.csVerb.replace("{name}", v.caseName || "[study name]"));
    }
    return opts;
  }

  function build(raw, essay, catalog) {
    var out = { options: [], notes: [] };
    var mode = modeFor(catalog, essay);
    if (!mode) return out;
    var stems = mode.stems || {};
    var isQSubject = !!mode.subjectIsQuestion;
    var caseName = clean(raw.caseName, stems.caseName, { question: isQSubject });
    if (mode.caseStudy) {
      caseName = caseName.replace(/^(the|a|an)\s+/i, "");
      var prevName;
      do {
        prevName = caseName;
        caseName = caseName.replace(/\s+(case study|packet|study|case)$/i, "").trim();
      } while (caseName !== prevName);
    }
    var tensionStems = (stems.tension || []).slice();
    if (mode.caseStudy && caseName) {
      tensionStems = ["The " + caseName + " study", "The " + caseName + " packet", "The " + caseName + " case study"].concat(tensionStems);
    }
    var v = {
      caseName: caseName,
      argues: clean(raw.packetArgues, stems.argues),
      tension: clean(raw.tension, tensionStems, {}),
      question: clean(raw.question, [], { question: true })
    };
    if (mode.tensionQuestionOK && /\?\s*$/.test(collapse(raw.tension))) {
      v.tension = stripStem(collapse(raw.tension), tensionStems).replace(/[\s.!,:;]+$/, "");
    }
    var criteria = (raw.criteria || []).map(function (c) { return clean(c, []); }).filter(Boolean);
    var proper = properWords([raw.caseName, raw.packetArgues, raw.tension, raw.question].concat(criteria)
      .concat(raw.lens ? Object.keys(raw.lens).map(function (k) { return raw.lens[k]; }) : []));
    Object.assign(v, derive(mode, v));

    if (mode.caseStudy) {
      out.options = caseStudyBuild(mode, v, raw, proper, catalog, out);
      return finish(out);
    }

    var critMid = criteria.map(function (c) { return midCase(c, proper); });
    v.criteriaList = joinAnd(critMid);
    var ctx = { vars: v, criteriaWords: critMid.length === 3 ? wordCount(critMid.join(" ")) : 0 };

    if (mode.comparison && global.DWSThesisVague) {
      if (global.DWSThesisVague(raw.packetArgues) || global.DWSThesisVague(raw.tension)) out.notes.push(STATUS.vagueComparison);
    }
    if (mode.tensionQuestionOK && /\?$/.test(v.tension) && mode.tensionQuestionNote) out.notes.push(mode.tensionQuestionNote);

    var chips = (raw.angles && raw.angles.length) ? raw.angles.slice() : ((essay && essay.defaultAngles) || Object.keys(mode.templates)).slice();
    var chipLabels = {};
    ((essay && essay.angles) || []).forEach(function (a) { if (a && a.id) chipLabels[a.id] = a.label; });
    Object.assign(chipLabels, (mode.copy && mode.copy.chips) || {});
    var roles = { question: "question" };
    if (isQSubject) roles.caseName = "question";
    if (mode.tensionQuestionOK && /\?$/.test(v.tension)) roles.tension = "raw";
    var seen = {};
    var skipNotes = {};
    chips.forEach(function (chip) {
      var key = (mode.chipMap && mode.chipMap[chip]) || chip;
      var entry = mode.templates[key];
      var tpl = pickTemplate(entry, ctx);
      if (!tpl) return;
      var needs = tpl.needs || entry.needs || [];
      var ok = needs.every(function (n) { return !!v[n]; });
      if (!ok) {
        var note = tpl.skipNote || entry.skipNote;
        if (note) skipNotes[note] = true;
        return;
      }
      var text = render(tpl.text, v, roles, proper);
      if (seen[text]) return;
      seen[text] = true;
      out.options.push({ angle: chip, label: chipLabels[chip] || entry.label || chip, text: text, why: tpl.why || entry.why });
    });
    Object.keys(skipNotes).forEach(function (n) { out.notes.push(n); });
    out.options = out.options.slice(0, 4);

    var qt = mode.question === "none" ? null : (mode.question === "literary" ? catalog.questionLiterary : catalog.questionTemplate);
    if (v.question && qt) {
      var qtext = render(qt.text, v, roles, proper);
      if (!seen[qtext]) out.options.push({ angle: "question", label: "Question", text: qtext, why: qt.why });
    }
    return finish(out);
  }

  function finish(out) {
    out.options.forEach(function (o) { if (wordCount(o.text) > LONG_WORDS) o.long = true; });
    return out;
  }

  function missingMessage(labels) {
    return STATUS.missing + joinAnd(labels) + ".";
  }
  function madeMessage(n) {
    return n === 1 ? STATUS.made1 : STATUS.madeN.replace("{n}", String(n));
  }

  function copyFor(catalog, essayId) {
    var modes = (catalog && catalog.modes) || {};
    var m = modes[essayId || ""];
    return m ? (m.copy || null) : null;
  }

  global.DWSThesisEngine = {
    build: build,
    clean: clean,
    midCase: midCase,
    startCase: startCase,
    properWords: properWords,
    fieldLabels: function (catalog, essay) { return fieldLabels(modeFor(catalog, essay), essay); },
    modeFor: modeFor,
    copyFor: copyFor,
    missingMessage: missingMessage,
    madeMessage: madeMessage,
    joinAnd: joinAnd,
    STATUS: STATUS
  };
})(window);
