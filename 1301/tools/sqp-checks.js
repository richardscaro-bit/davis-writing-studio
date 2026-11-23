/* ENGL 1301 summary, paraphrase, and quote practice: checking rules.
   Everything runs in the browser. No network calls, no storage, no AI.
   Each check is either "core" (a must-have) or "polish" (a finishing step).
   Weak   = at least one core check fails.
   Medium = every core check passes, at least one polish check fails.
   Strong = every check passes. */
(function (root) {
  var DATA = typeof module !== "undefined" && module.exports ? require("./sqp-data.js") : root.SQP_DATA;

  var CITE_EXAMPLE = "(2) or (Siddik et al. 2)";

  /* ---------- text helpers ---------- */
  function norm(s) {
    return String(s == null ? "" : s)
      .replace(/[\u2018\u2019\u02bc]/g, "'")
      .replace(/[\u201c\u201d\u201e]/g, '"')
      .replace(/\u2082/g, "2")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  var PASSAGE = norm(DATA.passage);

  /* Technical terms with no fair substitute. They are ignored when we
     measure how close a rewrite is to the source (the handout allows them). */
  var TERM_RE = new RegExp(
    [
      "global warming potential",
      "equivalent (?:co2|carbon dioxide)",
      "carbon dioxide",
      "co2",
      "water footprints?",
      "carbon footprints?",
      "footprints?",
      "blue water",
      "surface water and groundwater",
      "surface water",
      "groundwater",
      "data centers?",
      "sub-?national"
    ].join("|"),
    "gi"
  );

  function tokens(s, maskTerms) {
    var t = norm(s).replace(/#/g, " ");
    if (maskTerms) t = t.replace(TERM_RE, " # ");
    t = t.toLowerCase().replace(/-/g, " ").replace(/[^a-z0-9#' ]+/g, " ");
    return t.split(/\s+/).filter(Boolean);
  }

  function wordCount(s) {
    return norm(s).split(" ").filter(function (w) { return /[A-Za-z0-9]/.test(w); }).length;
  }

  function longestRun(a, b) {
    var best = 0;
    var prev = new Array(b.length + 1).fill(0);
    for (var i = 1; i <= a.length; i++) {
      var cur = new Array(b.length + 1).fill(0);
      for (var j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1] && a[i - 1] !== "#") {
          cur[j] = prev[j - 1] + 1;
          if (cur[j] > best) best = cur[j];
        }
      }
      prev = cur;
    }
    return best;
  }

  function gramSet(t, n) {
    var set = {};
    for (var i = 0; i + n <= t.length; i++) {
      var g = t.slice(i, i + n);
      if (g.indexOf("#") >= 0) continue;
      set[g.join(" ")] = true;
    }
    return set;
  }

  /* Returns the longest copied run of words and the share of 4-word
     groups that also appear in the source. */
  function overlap(text, source) {
    var a = tokens(text, true);
    var b = tokens(source, true);
    var run = longestRun(a, b);
    var src = gramSet(b, 4);
    var total = 0;
    var hit = 0;
    for (var i = 0; i + 4 <= a.length; i++) {
      var g = a.slice(i, i + 4);
      if (g.indexOf("#") >= 0) continue;
      total++;
      if (src[g.join(" ")]) hit++;
    }
    return { run: run, share: total ? hit / total : 0, total: total };
  }

  var PASSAGE_WORDS = wordCount(PASSAGE);

  /* ---------- quotes and citations ---------- */
  function splitQuotes(text) {
    var t = norm(text);
    var quotes = [];
    var masked = "";
    var last = 0;
    var re = /"([^"]*)"/g;
    var m;
    while ((m = re.exec(t))) {
      masked += t.slice(last, m.index) + "QQQ";
      quotes.push({ inner: m[1], start: m.index, end: m.index + m[0].length });
      last = m.index + m[0].length;
    }
    masked += t.slice(last);
    var unpaired = ((t.match(/"/g) || []).length % 2) === 1;
    return { text: t, masked: masked, quotes: quotes, unpaired: unpaired };
  }

  function inPassage(part) {
    var p = norm(part);
    if (!p) return false;
    var idx = PASSAGE.indexOf(p);
    while (idx >= 0) {
      var before = idx === 0 ? " " : PASSAGE.charAt(idx - 1);
      var after = idx + p.length >= PASSAGE.length ? " " : PASSAGE.charAt(idx + p.length);
      var startOk = !/[A-Za-z0-9]/.test(before) || !/[A-Za-z0-9]/.test(p.charAt(0));
      var endOk = !/[A-Za-z0-9]/.test(after) || !/[A-Za-z0-9]/.test(p.charAt(p.length - 1));
      if (startOk && endOk) return true;
      idx = PASSAGE.indexOf(p, idx + 1);
    }
    return false;
  }

  function looseInPassage(part) {
    var a = tokens(part, false);
    var b = tokens(PASSAGE, false);
    if (!a.length) return false;
    for (var i = 0; i + a.length <= b.length; i++) {
      var ok = true;
      for (var j = 0; j < a.length; j++) {
        if (b[i + j] !== a[j]) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }

  /* Judge every quoted string. */
  function judgeQuotes(parsed) {
    var out = { exact: true, loose: true, count: parsed.quotes.length, insidePunct: false, longest: 0, brackets: false, wholePassage: false, badParts: [] };
    parsed.quotes.forEach(function (q) {
      var inner = norm(q.inner);
      if (/[.,;:!?]$/.test(inner) && /[.,]$/.test(inner)) out.insidePunct = true;
      var core = inner.replace(/[.,;:!?]+$/, "");
      if (/\[[^\]]*\]/.test(core)) out.brackets = true;
      var parts = core
        .replace(/\[[^\]]*\]/g, " ... ")
        .split(/\s*(?:\.\.\.|\u2026|\. \. \.)\s*/)
        .map(function (p) { return p.trim(); })
        .filter(Boolean);
      var wc = wordCount(core);
      if (wc > out.longest) out.longest = wc;
      if (wc >= PASSAGE_WORDS - 2) out.wholePassage = true;
      if (!parts.length) { out.exact = false; out.loose = false; out.badParts.push(inner); return; }
      parts.forEach(function (p) {
        if (!inPassage(p)) {
          out.exact = false;
          if (!looseInPassage(p)) { out.loose = false; out.badParts.push(p); }
        }
      });
    });
    return out;
  }

  var AUTHOR_RE = /siddik|shehabi|marston/i;

  /* Find in-text citations in text that has the quotes masked out. */
  function findCitations(masked) {
    var list = [];
    var re = /\(([^()]*)\)/g;
    var m;
    while ((m = re.exec(masked))) {
      var inner = m[1].trim();
      if (!/\d|siddik|shehabi|marston|et al|^\s*(?:p|pp|pg|page)\b/i.test(inner)) continue;
      list.push({ raw: m[0], inner: inner, start: m.index, end: m.index + m[0].length });
    }
    return list;
  }

  /* Say what is wrong with one citation, in plain words. Returns null if it is correct. */
  function diagnose(inner) {
    var i = norm(inner);
    if (/^\d+$/.test(i)) {
      return i === DATA.page ? null : { kind: "page", msg: "The passage is on page " + DATA.page + ". Use (" + DATA.page + ") or (Siddik et al. " + DATA.page + ")." };
    }
    var m = /^Siddik et al\. (\d+)$/.exec(i);
    if (m) {
      return m[1] === DATA.page ? null : { kind: "page", msg: "The passage is on page " + DATA.page + ". Use (Siddik et al. " + DATA.page + ")." };
    }
    if (/^Siddik et al\.?,\s*\d/i.test(i)) return { kind: "comma", msg: "Take out the comma. MLA 9 puts the author and page together with no comma: (Siddik et al. 2)." };
    if (/^Siddik et al\s*\d/i.test(i) || /^Siddik et al,\s*\d/i.test(i)) return { kind: "etal", msg: "Add the period after al in et al. so it reads (Siddik et al. 2)." };
    if (/(?:\bp\.|\bpp\.|\bpg\.?|\bpage\b)\s*\d/i.test(i)) return { kind: "p", msg: "MLA 9 uses the number alone. Take out p., pg., or page so it reads (2) or (Siddik et al. 2)." };
    if (/^Siddik,?\s*Shehabi/i.test(i)) return { kind: "names", msg: "For three or more authors, MLA 9 uses Siddik et al. in the parentheses: (Siddik et al. 2). You can name all three authors in your own sentence instead." };
    if (/^Siddik,?\s*\d/i.test(i) && !/et al/i.test(i)) return { kind: "etal", msg: "This source has three authors. Use Siddik et al. in the parentheses: (Siddik et al. 2)." };
    if (/^Siddik et al\.?$/i.test(i)) return { kind: "nopage", msg: "Add the page number after the author: (Siddik et al. 2)." };
    if (/20\d\d/.test(i)) return { kind: "year", msg: "MLA 9 uses the page number, not the year. Use (2) or (Siddik et al. 2)." };
    if (!/\d/.test(i)) return { kind: "nopage", msg: "Add the page number. Use (2) or (Siddik et al. 2)." };
    return { kind: "other", msg: "This citation does not look like (2) or (Siddik et al. 2). Check its form." };
  }

  /* Check every citation for one piece of student writing. */
  function citationReport(text, contextText) {
    var parsed = splitQuotes(text);
    var cites = findCitations(parsed.masked);
    var outside = parsed.masked.replace(/\(([^()]*)\)/g, function (all, inner) {
      return /\d|siddik|shehabi|marston|et al/i.test(inner) ? " " : all;
    });
    var ctxParsed = contextText ? splitQuotes(contextText) : null;
    var authorInText = AUTHOR_RE.test(outside.replace(/QQQ/g, " ")) || (ctxParsed ? AUTHOR_RE.test(ctxParsed.masked) : false);
    var authorInParens = cites.some(function (c) { return AUTHOR_RE.test(c.inner); });
    var rep = {
      cites: cites,
      present: cites.length > 0,
      hasPage: cites.some(function (c) { return /\d/.test(c.inner); }),
      authorNamed: authorInText || authorInParens,
      authorInText: authorInText,
      authorInParens: authorInParens,
      problems: [],
      pageProblems: [],
      periodProblems: [],
      doubled: false,
      doubledAuthor: false,
      bare: false
    };
    cites.forEach(function (c, i) {
      var d = diagnose(c.inner);
      if (d) {
        if (d.kind === "page") rep.pageProblems.push(d.msg);
        else if (d.kind === "nopage") rep.pageProblems.push(d.msg);
        else rep.problems.push(d.msg);
      }
      // Narrative or parenthetical match
      if (!d && AUTHOR_RE.test(c.inner) && authorInText) rep.doubledAuthor = true;
      // Period placement
      var before = parsed.masked.slice(0, c.start).replace(/\s+$/, "");
      var prevCh = before.charAt(before.length - 1);
      var endsQuote = /QQQ$/.test(before);
      if (/[.!?]$/.test(before) && !/\bal\.$/.test(before) && !endsQuote) rep.periodProblems.push("The period comes after the closing parenthesis of the citation, not before it.");
      if (endsQuote) {
        var q = parsed.quotes[(before.match(/QQQ/g) || []).length - 1];
        if (q && /[.,]$/.test(norm(q.inner))) rep.periodProblems.push("Move the period out of the quotation marks. In MLA 9 the period comes after the citation: ... groundwater)\" (2).");
      }
      var after = parsed.masked.slice(c.end).replace(/^\s+/, "");
      var next = cites[i + 1];
      if (next) {
        var between = parsed.masked.slice(c.end, next.start).trim();
        if (!between || /^[.,;:]*$/.test(between)) rep.doubled = true;
      }
      if (after === "" && !/[.!?]$/.test(parsed.masked.trim())) rep.periodProblems.push("End the sentence with a period after the closing parenthesis.");
    });
    // citation written without parentheses
    var stripped = outside.replace(/\([^()]*\)/g, " ");
    if (/Siddik et al\.?,?\s+\d+\b/i.test(stripped) || /\bp\.\s*\d+\b/.test(stripped) && !cites.length) rep.bare = true;
    // de-duplicate messages
    ["problems", "pageProblems", "periodProblems"].forEach(function (k) {
      rep[k] = rep[k].filter(function (v, i, a) { return a.indexOf(v) === i; });
    });
    return rep;
  }

  /* ---------- result building ---------- */
  function Builder() {
    this.items = [];
  }
  Builder.prototype.add = function (level, ok, bad, good) {
    this.items.push({ level: level, ok: !!ok, bad: bad, good: good });
  };
  Builder.prototype.finish = function () {
    var coreFail = this.items.filter(function (x) { return x.level === "core" && !x.ok; });
    var polishFail = this.items.filter(function (x) { return x.level === "polish" && !x.ok; });
    var label = coreFail.length ? "Weak" : polishFail.length ? "Medium" : "Strong";
    var headline =
      label === "Strong"
        ? "Every check passed."
        : label === "Medium"
        ? "The main parts are here. Fix the items below to reach Strong."
        : "A must-have is missing or wrong. Fix the first items below, then check again.";
    return {
      label: label,
      headline: headline,
      fix: coreFail.concat(polishFail).map(function (x) { return { level: x.level, text: x.bad }; }),
      good: this.items.filter(function (x) { return x.ok && x.good; }).map(function (x) { return x.good; }),
      items: this.items
    };
  };

  function citationChecks(b, rep, opts) {
    opts = opts || {};
    b.add("core", rep.present, "Add an in-text citation with the page number, like " + CITE_EXAMPLE + ".", "An in-text citation is present.");
    if (rep.present) {
      b.add("core", rep.hasPage && !rep.pageProblems.length, rep.pageProblems[0] || "Add the page number to your citation.", "The page number is correct.");
    }
    b.add("core", rep.authorNamed, "Name the author. Write Siddik et al. in your sentence, or put (Siddik et al. 2) in the parentheses.", "The author is named.");
    if (rep.present && rep.authorNamed && !rep.authorInText && !rep.authorInParens) {
      /* unreachable, kept for clarity */
    }
    // Form checks (polish)
    var formBad = [];
    rep.problems.forEach(function (p) { formBad.push(p); });
    if (rep.doubledAuthor) formBad.push("You already name Siddik et al. in your sentence, so the parentheses hold only the page number: (2). Use (Siddik et al. 2) only when you do not name the authors in your sentence.");
    if (rep.doubled) formBad.push("This looks like a doubled citation. Use one citation after each idea.");
    if (rep.bare) formBad.push("Put the citation inside parentheses: (2) or (Siddik et al. 2).");
    if (rep.present && !rep.authorInText && rep.cites.every(function (c) { return /^\d+$/.test(c.inner); }) && !opts.contextHasAuthor) {
      /* a bare (2) with no author anywhere is already caught by the author check */
    }
    b.add("polish", !formBad.length, formBad[0], "The citation form is correct for MLA 9.");
    rep.periodProblems.forEach(function () {});
    b.add("polish", !rep.periodProblems.length, rep.periodProblems[0], rep.present ? "The period is in the right place." : "");
  }

  var KEY = {
    water: /\bwater\b/i,
    carbon: /\bcarbon\b|\bco2\b|\bemissions?\b/i,
    centers: /\bdata cent(?:er|re)s?\b|\bdata-cent(?:er|re)s?\b/i
  };

  function ideaCoverage(text) {
    var t = norm(text).toLowerCase();
    var hasBlue = /blue water|consum/.test(t);
    var hasSG = /surface water/.test(t) && /groundwater/.test(t);
    var a = /\bfirst\b|sub-?national/.test(t) || /smaller than (?:the )?(?:whole |entire )?(?:nation|country)/.test(t);
    var bAny = hasBlue || hasSG;
    var cHas = /carbon dioxide|co2/.test(t);
    var warm = /warming/.test(t);
    return {
      a: a,
      b: bAny,
      bFull: hasBlue && hasSG,
      c: cHas || warm,
      cFull: cHas && warm,
      count: (a ? 1 : 0) + (bAny ? 1 : 0) + (cHas || warm ? 1 : 0),
      fullCount: (a ? 1 : 0) + (hasBlue && hasSG ? 1 : 0) + (cHas && warm ? 1 : 0)
    };
  }

  /* ---------- the checkers ---------- */
  function checkSummary(text) {
    var b = new Builder();
    var t = norm(text);
    var wc = wordCount(t);
    b.add("core", wc >= 12, "Write a summary of at least one or two full sentences.", "");
    if (wc < 12) return b.finish();
    var parsed = splitQuotes(t);
    b.add("core", wc < PASSAGE_WORDS, "A summary must be shorter than the passage. The passage has " + PASSAGE_WORDS + " words and yours has " + wc + ".", "It is shorter than the passage (" + wc + " words, passage " + PASSAGE_WORDS + ").");
    b.add("polish", wc <= Math.round(PASSAGE_WORDS * 0.9), "Make it much shorter. Aim for about " + Math.round(PASSAGE_WORDS * 0.9) + " words or fewer, and keep only the main idea.", "");
    var rep = citationReport(t);
    citationChecks(b, rep);
    var cover = [KEY.water, KEY.carbon, KEY.centers].filter(function (r) { return r.test(t); }).length + (/footprint|estimate|measure/i.test(t) ? 1 : 0);
    b.add("core", cover >= 2, "Your summary does not seem to be about this passage. State the main idea: the study estimates the water and carbon footprints of data centers.", "");
    b.add("polish", KEY.water.test(t) && KEY.carbon.test(t) && KEY.centers.test(t), "Name the main idea: the water and carbon footprints of data centers.", "It names the main idea.");
    var ov = overlap(t, PASSAGE);
    b.add("core", ov.run < 9 && ov.share < 0.5, "Too many of your words are copied from the passage. Rewrite the idea in a new sentence structure.", "");
    b.add("polish", ov.run < 7 && ov.share < 0.25, "Some phrases are close to the source. Change the wording and sentence structure more.", "It is in your own words.");
    b.add("polish", parsed.quotes.length === 0, "A summary uses your own words. Take out the quotation marks, or use the Quote box for exact words.", "");
    b.add("polish", !/\bI (?:think|believe|feel|agree|disagree)\b|in my opinion/i.test(t), "Leave your opinion out of a summary. Only state the author's main idea.", "");
    return b.finish();
  }

  function checkParaphrase(text) {
    var b = new Builder();
    var t = norm(text);
    var wc = wordCount(t);
    b.add("core", wc >= 25, "A paraphrase keeps about the same detail as the passage. Write all three ideas in your own words.", "");
    if (wc < 25) return b.finish();
    var parsed = splitQuotes(t);
    var rep = citationReport(t);
    citationChecks(b, rep);
    var ideas = ideaCoverage(t);
    b.add("core", ideas.count >= 2, "Your paraphrase leaves out most of the passage. Restate the aim (first sub-national estimates), the water definition, and the carbon definition.", "");
    b.add("polish", ideas.fullCount === 3, missingIdeas(ideas), "It keeps all three ideas.");
    var ov = overlap(t, PASSAGE);
    var patch = ov.run >= 7 || ov.share >= 0.3;
    b.add("core", !patch, "This is patchwriting. It keeps the source's sentence structure and many of its phrases, with only a few words swapped. A citation does not fix it. Set the source aside and rewrite it with new wording and a new sentence structure.", "");
    b.add("polish", ov.run < 5 && ov.share < 0.15, "A few phrases are still close to the source. Change them. Technical terms such as water footprint may stay.", "Your wording and sentence structure are new.");
    b.add("polish", parsed.quotes.length === 0, "A paraphrase uses your own words. Take out the quotation marks, or use the Quote box for exact words.", "");
    return b.finish();
  }

  function missingIdeas(ideas) {
    var miss = [];
    if (!ideas.a) miss.push("that these are the first sub-national estimates");
    if (!ideas.bFull) miss.push("that water footprint means consumed blue water, meaning surface water and groundwater");
    if (!ideas.cFull) miss.push("that carbon is stated as equivalent carbon dioxide to represent global warming potential");
    return miss.length ? "Add " + miss.join(", and ") + "." : "";
  }

  var SIGNAL_RE = /\b(?:state[sd]?|write[s]?|wrote|explain(?:s|ed)?|note[sd]?|argue[sd]?|find[s]?|found|report(?:s|ed)?|define[sd]?|say[s]?|said|observe[sd]?|show(?:s|ed)?|claim(?:s|ed)?|describe[sd]?|specif(?:y|ies|ied)|emphasize[sd]?|suggest(?:s|ed)?|according to|point(?:s|ed)? out|put[s]?|offer[s]?)\b/i;

  function quoteChecks(b, t, ctx, withSignal) {
    var parsed = splitQuotes(t);
    b.add("core", parsed.quotes.length > 0 && !parsed.unpaired, parsed.unpaired ? "Your quotation marks are not paired. Put a quotation mark at the start and the end of the borrowed words." : "Put quotation marks around the exact words from the passage.", "Quotation marks are in place.");
    var qj = null;
    if (parsed.quotes.length && !parsed.unpaired) {
      qj = judgeQuotes(parsed);
      b.add("core", qj.exact || qj.loose, "These words are not in the passage: \"" + (qj.badParts[0] || "") + "\". Copy the words exactly from the passage.", "");
      if (qj.exact || qj.loose) {
        b.add("polish", qj.exact, "Your quote almost matches. Copy the capitalization, spelling, and punctuation exactly, such as (i.e. surface water and groundwater).", "The quote matches the passage exactly.");
      }
      b.add("polish", qj.longest <= 35 && !qj.wholePassage, "Shorten the quote. Use only the words you need, then explain them.", "The quote is a good length.");
      b.add("polish", !qj.brackets, "You changed the quote with brackets. Only do that when you must, and keep every other word exact.", "");
    }
    var rep = citationReport(t, ctx);
    citationChecks(b, rep);
    if (withSignal) {
      var lead = parsed.masked.split("QQQ")[0] || "";
      var leadWords = wordCount(lead);
      b.add("polish", leadWords >= 3 && SIGNAL_RE.test(lead), "Start with a signal phrase, such as Siddik et al. state that \"...\"", "A signal phrase introduces the quote.");
    }
    return { parsed: parsed, qj: qj, rep: rep };
  }

  function checkQuote(text) {
    var b = new Builder();
    var t = norm(text);
    b.add("core", wordCount(t) >= 4, "Write a sentence with a signal phrase, a quote in quotation marks, and a citation.", "");
    if (wordCount(t) < 4) return b.finish();
    quoteChecks(b, t, "", true);
    return b.finish();
  }

  function checkIntroduce(text, quoteText) {
    var b = new Builder();
    var t = norm(text);
    var wc = wordCount(t);
    b.add("core", wc >= 6, "Write a sentence that names the author and sets up the idea the quote will support.", "");
    if (wc < 6) return b.finish();
    var parsed = splitQuotes(t);
    var qAuthor = quoteText ? AUTHOR_RE.test(splitQuotes(quoteText).masked) : false;
    b.add("core", AUTHOR_RE.test(parsed.masked) || qAuthor, "Name the author, such as Siddik et al. or Siddik, Shehabi, and Marston.", "The author is named.");
    b.add("polish", parsed.quotes.length === 0, "Keep the quote for the Quote part. The introduction only sets it up.", "");
    b.add("polish", findCitations(parsed.masked).length === 0, "Put the citation after the quote, not in the introduction.", "");
    b.add("polish", wc >= 8, "Add a little more. Say what idea the quote will support.", "It sets up the idea.");
    return b.finish();
  }

  function checkQuotePart(text, introText) {
    var b = new Builder();
    var t = norm(text);
    b.add("core", wordCount(t) >= 3, "Give the exact words in quotation marks, with an MLA citation.", "");
    if (wordCount(t) < 3) return b.finish();
    quoteChecks(b, t, introText, false);
    return b.finish();
  }

  function checkExplain(text, quoteText) {
    var b = new Builder();
    var t = norm(text);
    var wc = wordCount(t);
    b.add("core", wc >= 12, "Explain in your own words what the quote shows and how it relates to your point. Write at least one full sentence.", "");
    if (wc < 12) return b.finish();
    var qparsed = splitQuotes(quoteText || "");
    var qInner = qparsed.quotes.map(function (q) { return q.inner; }).join(" ");
    var ovQ = qInner ? overlap(t, qInner) : { run: 0 };
    var ovP = overlap(t, PASSAGE);
    b.add("core", ovQ.run < 8 && ovP.run < 8 && ovP.share < 0.4, "Your explanation repeats the quote or the passage. Say in your own words what the quote shows.", "");
    b.add("polish", /\b(?:this|these|that|shows?|means?|limits?|suggests?|because|which|so|therefore|reveals?|helps?|matters?|explains?|tells?|indicates?|demonstrates?)\b/i.test(t), "Say what the quote shows, for example with this shows, this means, or this limits.", "It says what the quote shows.");
    b.add("polish", /evidence|assumption|limit|framing|stakeholder|argument|claim|point|essay/i.test(t), "Connect the quote to your point, such as Evidence, Assumptions, or Limits.", "It connects the quote to a point.");
    b.add("polish", wc >= 20, "Add a bit more. Explain what the quote shows and how it relates to your point.", "");
    b.add("polish", splitQuotes(t).quotes.length === 0, "Keep the exact words in the Quote part. The explanation uses your own words.", "");
    return b.finish();
  }

  var RANK = { Weak: 0, Medium: 1, Strong: 2 };
  function checkSandwich(parts) {
    var intro = checkIntroduce(parts.introduce || "", parts.quote || "");
    var quote = checkQuotePart(parts.quote || "", parts.introduce || "");
    var expl = checkExplain(parts.explain || "", parts.quote || "");
    var all = [intro, quote, expl];
    var worst = all.reduce(function (w, r) { return RANK[r.label] < RANK[w] ? r.label : w; }, "Strong");
    var headline =
      worst === "Strong"
        ? "All three parts passed. This is a Strong quote sandwich."
        : worst === "Medium"
        ? "All three parts are present. Polish the parts marked below to reach Strong."
        : "One part is missing something essential. Fix the Weak part first.";
    return { label: worst, headline: headline, parts: { introduce: intro, quote: quote, explain: expl } };
  }

  var API = {
    checkSummary: checkSummary,
    checkParaphrase: checkParaphrase,
    checkQuote: checkQuote,
    checkSandwich: checkSandwich,
    checkIntroduce: checkIntroduce,
    checkQuotePart: checkQuotePart,
    checkExplain: checkExplain,
    overlap: overlap,
    wordCount: wordCount,
    passageWords: PASSAGE_WORDS,
    norm: norm,
    citationReport: citationReport
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.SQP = API;
})(typeof window !== "undefined" ? window : this);
