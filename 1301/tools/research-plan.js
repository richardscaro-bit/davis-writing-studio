/* Research Plan helper for ENGL 1301 Case Study practice.
   Student-facing wording comes from builder-tool-wording.md (18 Nov 2026).
   Progress is stored only in this browser. */
(function () {
  var STORAGE = "dws-1301-research-plan-v1";

  var LENSES = ["Framing", "Stakeholders", "Evidence", "Assumptions", "Limits"];

  var ETHICS_Q = [
    "Who could be harmed or left out?",
    "Is the message honest, or does it hide something important?",
    "Did people give consent, and is their privacy protected?",
    "Who profits, and who pays the cost?",
    "What do I owe my readers as a fair and accurate writer?"
  ];

  var PURPOSE_CHECKS = [
    "Does my purpose line name one lens section?",
    "Does it say whether the source confirms, complicates, or contradicts a specific packet detail?",
    "Does it connect back to my thesis?"
  ];

  var VERBS = ["confirms", "complicates", "contradicts"];

  var DB_URLS = {
    "ProQuest One Community College": "https://go.openathens.net/redirector/alamo.edu?url=https%3A%2F%2Fsearch.proquest.com%2Fpq1ccnew%3Faccountid%3D7151",
    "JSTOR": "https://www.jstor.org/search",
    "PsycARTICLES": "https://go.openathens.net/redirector/alamo.edu?url=https%3A%2F%2Fsearch.ebscohost.com%2Flogin.aspx%3Fauthtype%3Dsso%26custid%3Ds9008406%26groupid%3Dmain%26profile%3Dehost%26defaultdb%3Dpdh",
    "Nexis Uni": "https://www.nexisuni.com",
    "CQ Researcher": "https://cqpress.sagepub.com/cqresearcher/",
    "Access Science": "https://go.openathens.net/redirector/alamo.edu?url=https://www.accessscience.com/?implicit-login=true",
    "CINAHL Ultimate": "https://go.openathens.net/redirector/alamo.edu?url=https%3A%2F%2Fsearch.ebscohost.com%2Flogin.aspx%3Fauthtype%3Dip%2Csso%26groupid%3Dmain%26custid%3Ds9008406%26profile%3Dehost%26defaultdb%3Dcul",
    "Education Research Complete": "https://go.openathens.net/redirector/alamo.edu?url=https%3A%2F%2Fsearch.ebscohost.com%2Flogin.aspx%3Fauthtype%3Dsso%26custid%3Ds9008406%26groupid%3Dmain%26profile%3Dehost%26defaultdb%3Dehh",
    "Credo Reference": "https://go.openathens.net/redirector/alamo.edu?url=https%3A%2F%2Faccess.infobase.com%2F",
    "Films on Demand: Master Academic Collection": "https://go.openathens.net/redirector/alamo.edu?url=https://access.infobase.com/fod?aid=18502",
    "Access World News Research Collection": "https://infoweb.newsbank.com/apps/news/easy-search?p=WORLDNEWS",
    "Access World News Research Collection (NewsBank, includes the San Antonio Express-News)": "https://infoweb.newsbank.com/apps/news/easy-search?p=WORLDNEWS",
    "Opposing Viewpoints In Context": "https://infotrac.galegroup.com/itweb/txshracd2904?db=OVIC",
    "Academic OneFile": "https://link.gale.com/apps/AONE?u=txshracd2904",
    "GreenFILE": "https://go.openathens.net/redirector/alamo.edu?url=https%3A%2F%2Fsearch.ebscohost.com%2Flogin.aspx%3Fauthtype%3Dsso%26custid%3Ds9008406%26groupid%3Dmain%26profile%3Dehost%26defaultdb%3D8gh",
    "Pop Culture Studies": "https://link.gale.com/apps/PPOP?u=txshracd2904",
    "Google Scholar": "https://scholar.google.com"
  };

  var LINK_GROUPS = {
    general: [
      { name: "SAC Library A to Z list", url: "https://alamo.libguides.com/az/SAC" },
      { name: "SAC How to Cite guide", url: "https://alamo.libguides.com/sac-guides/citation/overview" },
      { name: "Google Scholar", url: "https://scholar.google.com" },
      { name: "SAC Discovery (catalog and more)", url: "https://sactx.aspendiscovery.org/" }
    ],
    first: [
      "ProQuest One Community College",
      "JSTOR",
      "PsycARTICLES",
      "Nexis Uni",
      "CQ Researcher",
      "Access Science",
      "CINAHL Ultimate",
      "Education Research Complete",
      "Credo Reference",
      "Films on Demand: Master Academic Collection",
      "Access World News Research Collection (NewsBank, includes the San Antonio Express-News)"
    ],
    also: [
      "Opposing Viewpoints In Context",
      "Academic OneFile",
      "GreenFILE",
      "Pop Culture Studies"
    ]
  };

  var FAMILIES = [
    {
      name: "Gaming and in-game purchases",
      blurb: "How free games make money from skins, passes, and other extras.",
      strings: ["\"in-game purchases\" AND motivation", "\"free-to-play\" AND revenue", "\"loot boxes\" OR microtransactions AND players", "\"battle pass\" AND engagement"],
      databases: ["ProQuest One Community College", "Pop Culture Studies", "Google Scholar"]
    },
    {
      name: "Social media and body image",
      blurb: "How posts, influencers, and algorithms shape the way people see their bodies.",
      strings: ["\"body image\" AND Instagram", "\"social comparison\" AND \"social media\"", "\"body positivity\" AND influencers", "algorithms AND \"beauty standards\""],
      databases: ["PsycARTICLES", "Opposing Viewpoints In Context", "Google Scholar"]
    },
    {
      name: "Sports business",
      blurb: "How teams weigh the cost of star players against the goal of winning.",
      strings: ["\"salary cap\" AND NBA", "\"superstar\" AND \"team performance\"", "\"sports economics\" AND contracts"],
      databases: ["ProQuest One Community College", "Academic OneFile", "Nexis Uni"]
    },
    {
      name: "Streaming and influencer marketing",
      blurb: "How brands use streamers and influencers, and whether viewers can trust it.",
      strings: ["\"influencer marketing\" AND trust", "\"sponsorship disclosure\" AND streamers", "Twitch AND advertising", "\"parasocial relationships\" AND brands"],
      databases: ["Academic OneFile", "Pop Culture Studies", "Nexis Uni"]
    },
    {
      name: "Film, TV, and nostalgia marketing",
      blurb: "How studios and networks sell reboots, remakes, and changing shows to audiences.",
      strings: ["nostalgia AND \"film marketing\"", "reboots OR remakes AND audiences", "\"television production\" AND network", "\"fan reception\" AND franchise"],
      databases: ["JSTOR", "Pop Culture Studies", "Films on Demand: Master Academic Collection"]
    },
    {
      name: "Technology and the environment",
      blurb: "What new technology costs in water, energy, and land, and who pays.",
      strings: ["\"data centers\" AND water", "\"water use\" AND \"artificial intelligence\"", "drought AND infrastructure AND Texas"],
      databases: ["GreenFILE", "Access Science", "CQ Researcher"]
    },
    {
      name: "True crime, forensics, and media ethics",
      blurb: "How real crimes are investigated and turned into entertainment.",
      strings: ["\"true crime\" AND ethics", "\"true crime\" AND documentaries AND audiences", "\"forensic evidence\" AND investigation", "victims AND privacy AND media"],
      databases: ["JSTOR", "Pop Culture Studies", "ProQuest One Community College"]
    },
    {
      name: "Public health and drug policy",
      blurb: "How states, pharmacists, and communities respond to crises like the opioid epidemic.",
      strings: ["\"opioid epidemic\" AND policy", "pharmacists AND \"opioid safety\"", "naloxone OR \"harm reduction\"", "addiction AND treatment AND access"],
      databases: ["CINAHL Ultimate", "CQ Researcher", "Opposing Viewpoints In Context"]
    },
    {
      name: "Education and student support",
      blurb: "How schools support students with learning disabilities and mental health needs.",
      strings: ["\"learning disabilities\" AND support", "\"mental health\" AND schools", "\"special education\" AND outcomes", "accommodations AND students"],
      databases: ["Education Research Complete", "PsycARTICLES"]
    },
    {
      name: "Culture, traditions, and change",
      blurb: "How rituals and customs like funerals change after events like COVID-19.",
      strings: ["funerals AND COVID-19", "ritual AND tradition AND change", "\"virtual funerals\" OR \"online memorials\"", "grief AND customs"],
      databases: ["JSTOR", "Credo Reference", "ProQuest One Community College"]
    },
    {
      name: "Housing and neighborhoods",
      blurb: "How revitalization and gentrification affect long-time residents.",
      strings: ["gentrification AND displacement", "\"affordable housing\" AND policy", "\"neighborhood revitalization\" AND residents", "gentrification AND \"San Antonio\""],
      databases: ["Opposing Viewpoints In Context", "CQ Researcher", "Access World News Research Collection"]
    }
  ];

  function $(id) { return document.getElementById(id); }

  function emptySource() {
    return {
      author: "",
      title: "",
      where: "",
      section: "",
      verb: "",
      packet: "",
      thesis: "",
      checks: [null, null, null]
    };
  }

  function emptyState() {
    return {
      topic: "",
      ethics: ["", "", "", "", ""],
      ethicsLens: "Limits",
      sources: [emptySource(), emptySource()],
      mla: { name: "", instructor: "", course: "ENGL 1301", date: "" }
    };
  }

  function readState() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE) || "null");
      if (!raw || typeof raw !== "object") return emptyState();
      var base = emptyState();
      var names = FAMILIES.map(function (f) { return f.name; });
      base.topic = names.indexOf(raw.topic) >= 0 ? raw.topic : "";
      base.ethics = ETHICS_Q.map(function (_, i) {
        return (raw.ethics && typeof raw.ethics[i] === "string") ? raw.ethics[i] : "";
      });
      base.ethicsLens = LENSES.indexOf(raw.ethicsLens) >= 0 ? raw.ethicsLens : "Limits";
      base.sources = [0, 1].map(function (i) {
        var s = (raw.sources && raw.sources[i]) || {};
        var out = emptySource();
        ["author", "title", "where", "section", "verb", "packet", "thesis"].forEach(function (k) {
          out[k] = typeof s[k] === "string" ? s[k] : "";
        });
        if (LENSES.indexOf(out.section) < 0) out.section = "";
        if (VERBS.indexOf(out.verb) < 0) out.verb = "";
        out.checks = PURPOSE_CHECKS.map(function (_, ci) {
          var v = s.checks && s.checks[ci];
          return v === "yes" || v === "no" ? v : null;
        });
        return out;
      });
      var m = raw.mla || {};
      base.mla = {
        name: typeof m.name === "string" ? m.name : "",
        instructor: typeof m.instructor === "string" ? m.instructor : "",
        course: typeof m.course === "string" && m.course.trim() ? m.course : "ENGL 1301",
        date: typeof m.date === "string" ? m.date : ""
      };
      return base;
    } catch (err) {
      return emptyState();
    }
  }

  function writeState(state) {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }

  function familyByName(name) {
    for (var i = 0; i < FAMILIES.length; i++) {
      if (FAMILIES[i].name === name) return FAMILIES[i];
    }
    return null;
  }

  function dbHref(name) {
    return DB_URLS[name] || "";
  }

  function purposeLine(s) {
    if (!s) return "";
    var section = (s.section || "").trim();
    var verb = (s.verb || "").trim();
    var packet = (s.packet || "").trim();
    var thesis = (s.thesis || "").trim();
    if (!section && !verb && !packet && !thesis) return "";
    return "This source helps my " +
      (section || "______") + " section because it " +
      (verb || "______") +
      " the packet's point that " +
      (packet || "______") +
      ", which supports my thesis that " +
      (thesis || "______") + ".";
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

  function setStatus(msg, ok) {
    var el = $("rpSaveStatus");
    if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("ok", !!ok);
  }

  function renderTopics(state) {
    var host = $("rpTopicList");
    if (!host) return;
    host.innerHTML = "";
    FAMILIES.forEach(function (fam) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rp-topic" + (state.topic === fam.name ? " is-current" : "");
      btn.setAttribute("aria-pressed", state.topic === fam.name ? "true" : "false");
      btn.innerHTML = "<strong></strong><span></span>";
      btn.querySelector("strong").textContent = fam.name;
      btn.querySelector("span").textContent = fam.blurb;
      btn.addEventListener("click", function () {
        state.topic = fam.name;
        writeState(state);
        renderTopics(state);
        renderSearch(state);
        setStatus("Topic family saved locally.", true);
      });
      host.appendChild(btn);
    });
  }

  function renderSearch(state) {
    var box = $("rpSearchBox");
    var empty = $("rpSearchEmpty");
    var fam = familyByName(state.topic);
    if (!fam) {
      if (box) box.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    if (box) box.hidden = false;
    $("rpSearchFamily").textContent = fam.name;
    var strHost = $("rpSearchStrings");
    strHost.innerHTML = "";
    fam.strings.forEach(function (str) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "idea-chip";
      btn.textContent = str;
      btn.title = "Copy this search string";
      btn.addEventListener("click", function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(str).then(
            function () { setStatus("Search string copied.", true); },
            function () { setStatus("Select the search string and copy it.", false); }
          );
        }
      });
      strHost.appendChild(btn);
    });
    var dbHost = $("rpSearchDbs");
    dbHost.innerHTML = "";
    fam.databases.forEach(function (name) {
      var href = dbHref(name);
      var a = document.createElement("a");
      a.className = "button ghost";
      a.href = href || "https://alamo.libguides.com/az/SAC";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = name;
      dbHost.appendChild(a);
    });
  }

  function renderEthics(state) {
    var host = $("rpEthicsQs");
    if (host && !host.dataset.ready) {
      host.innerHTML = "";
      ETHICS_Q.forEach(function (q, i) {
        var lab = document.createElement("label");
        lab.className = "field";
        lab.appendChild(document.createTextNode(q));
        var ta = document.createElement("textarea");
        ta.id = "rpEthics" + i;
        ta.style.minHeight = "4.2rem";
        lab.appendChild(ta);
        host.appendChild(lab);
      });
      host.dataset.ready = "1";
    }
    ETHICS_Q.forEach(function (_, i) {
      var ta = $("rpEthics" + i);
      if (ta) ta.value = state.ethics[i] || "";
    });
    var lensHost = $("rpEthicsLenses");
    if (!lensHost) return;
    lensHost.innerHTML = "";
    LENSES.forEach(function (name) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "idea-chip";
      btn.setAttribute("aria-pressed", state.ethicsLens === name ? "true" : "false");
      btn.textContent = name + (name === "Limits" ? " (suggested)" : "");
      btn.addEventListener("click", function () {
        state.ethicsLens = name;
        writeState(state);
        renderEthics(state);
        setStatus("Lens choice saved locally.", true);
      });
      lensHost.appendChild(btn);
    });
  }

  function renderPurposePreview(i, state) {
    var el = $("rpPurposePreview" + i);
    if (!el) return;
    var line = purposeLine(state.sources[i]);
    el.textContent = line || "This source helps my ______ section because it ______ (confirms, complicates, or contradicts) the packet's point that ______, which supports my thesis that ______.";
  }

  function renderSource(i, state) {
    var s = state.sources[i];
    function set(id, val) { var el = $(id); if (el) el.value = val || ""; }
    set("rpSrcAuthor" + i, s.author);
    set("rpSrcTitle" + i, s.title);
    set("rpSrcWhere" + i, s.where);
    set("rpSrcPacket" + i, s.packet);
    set("rpSrcThesis" + i, s.thesis);
    var sec = $("rpSrcSection" + i);
    if (sec && !sec.dataset.ready) {
      sec.innerHTML = "";
      var blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "Choose a section";
      sec.appendChild(blank);
      LENSES.forEach(function (name) {
        var o = document.createElement("option");
        o.value = name;
        o.textContent = name;
        sec.appendChild(o);
      });
      sec.dataset.ready = "1";
    }
    if (sec) sec.value = s.section || "";
    var verbHost = $("rpSrcVerb" + i);
    if (verbHost) {
      verbHost.innerHTML = "";
      VERBS.forEach(function (v) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "idea-chip";
        btn.setAttribute("aria-pressed", s.verb === v ? "true" : "false");
        btn.textContent = v;
        btn.addEventListener("click", function () {
          state.sources[i].verb = state.sources[i].verb === v ? "" : v;
          writeState(state);
          renderSource(i, state);
          setStatus("Purpose line updated.", true);
        });
        verbHost.appendChild(btn);
      });
    }
    renderPurposePreview(i, state);
    var ch = $("rpSrcChecks" + i);
    if (ch) {
      ch.innerHTML = "";
      PURPOSE_CHECKS.forEach(function (q, ci) {
        var row = document.createElement("div");
        row.className = "bp-check";
        var p = document.createElement("p");
        p.className = "bp-check-q";
        p.id = "rpChk" + i + "_" + ci;
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
          btn.setAttribute("aria-pressed", s.checks[ci] === val ? "true" : "false");
          btn.addEventListener("click", function () {
            state.sources[i].checks[ci] = state.sources[i].checks[ci] === val ? null : val;
            writeState(state);
            renderSource(i, state);
            setStatus("Self-check saved locally.", true);
          });
          group.appendChild(btn);
        });
        row.appendChild(p);
        row.appendChild(group);
        ch.appendChild(row);
      });
    }
  }

  function renderMla(state) {
    function set(id, val) { var el = $(id); if (el) el.value = val || ""; }
    set("rpMlaName", state.mla.name);
    set("rpMlaInstructor", state.mla.instructor);
    set("rpMlaCourse", state.mla.course || "ENGL 1301");
    set("rpMlaDate", state.mla.date);
  }

  function render(state) {
    renderTopics(state);
    renderSearch(state);
    renderEthics(state);
    renderSource(0, state);
    renderSource(1, state);
    renderMla(state);
  }

  function bindFields(state) {
    ETHICS_Q.forEach(function (_, i) {
      var ta = $("rpEthics" + i);
      if (!ta) return;
      ta.addEventListener("input", function () {
        state.ethics[i] = ta.value;
        writeState(state);
      });
    });
    [0, 1].forEach(function (i) {
      function hook(id, key) {
        var el = $(id);
        if (!el) return;
        el.addEventListener("input", function () {
          state.sources[i][key] = el.value;
          writeState(state);
          if (key === "section" || key === "packet" || key === "thesis") renderPurposePreview(i, state);
        });
        el.addEventListener("change", function () {
          state.sources[i][key] = el.value;
          writeState(state);
          renderPurposePreview(i, state);
        });
      }
      hook("rpSrcAuthor" + i, "author");
      hook("rpSrcTitle" + i, "title");
      hook("rpSrcWhere" + i, "where");
      hook("rpSrcSection" + i, "section");
      hook("rpSrcPacket" + i, "packet");
      hook("rpSrcThesis" + i, "thesis");
    });
    ["Name", "Instructor", "Course", "Date"].forEach(function (part) {
      var id = "rpMla" + part;
      var key = part.toLowerCase();
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", function () {
        state.mla[key] = el.value;
        writeState(state);
      });
    });
  }

  function plainPlan(state) {
    var lines = [];
    lines.push("Research Plan");
    lines.push("ENGL 1301 · Outline and Research Plan assignment · 100 points");
    lines.push("Due: Sun Nov 22 at 11:59 PM CT (Outline and Research Plan assignment, file name Lastname_CaseStudy_Outline).");
    lines.push("");
    lines.push("Step 1: Pick a topic family");
    lines.push(state.topic || "(not chosen yet)");
    var fam = familyByName(state.topic);
    if (fam) {
      lines.push("");
      lines.push("Step 2: Search strings and databases");
      fam.strings.forEach(function (s) { lines.push("- " + s); });
      lines.push("Try first: " + fam.databases.join(", "));
    }
    lines.push("");
    lines.push("Step 3: Ethics questions and lens choice");
    ETHICS_Q.forEach(function (q, i) {
      lines.push(q);
      lines.push(state.ethics[i] ? state.ethics[i] : "(not filled in yet)");
    });
    lines.push("Where it goes: " + (state.ethicsLens || "Limits"));
    lines.push("Put your ethics point in the Limits section, or inside any other lens where the ethical problem shows up, and back it with cited evidence.");
    [0, 1].forEach(function (i) {
      var s = state.sources[i];
      lines.push("");
      lines.push("Library or Google Scholar source " + (i + 1));
      lines.push("Author: " + (s.author || "(not filled in yet)"));
      lines.push("Title: " + (s.title || "(not filled in yet)"));
      lines.push("Link or database: " + (s.where || "(not filled in yet)"));
      var line = purposeLine(s);
      lines.push("Purpose line: " + (line || "(not filled in yet)"));
    });
    return lines.join("\n");
  }

  function worksCited(state) {
    var list = state.sources.map(citationEntry).filter(Boolean);
    list.sort(function (a, b) { return sortKey(a).localeCompare(sortKey(b)); });
    return list;
  }

  function outlineLines(state) {
    var lines = [];
    if (state.topic) {
      lines.push("Topic family: " + state.topic + ".");
      var fam = familyByName(state.topic);
      if (fam) {
        lines.push("Search strings: " + fam.strings.join("; ") + ".");
        lines.push("Try first: " + fam.databases.join(", ") + ".");
      }
    }
    lines.push("");
    lines.push("Ethics questions");
    ETHICS_Q.forEach(function (q, i) {
      lines.push(q);
      lines.push(state.ethics[i] || "(not filled in yet)");
    });
    lines.push("Put your ethics point in the " + (state.ethicsLens || "Limits") + " section, or inside any other lens where the ethical problem shows up, and back it with cited evidence.");
    [0, 1].forEach(function (i) {
      lines.push("");
      lines.push("Library or Google Scholar source " + (i + 1));
      var s = state.sources[i];
      if (s.author) lines.push("Author: " + s.author);
      if (s.title) lines.push("Title: " + s.title);
      if (s.where) lines.push("Link or database: " + s.where);
      var line = purposeLine(s);
      if (line) lines.push(line);
      if (!s.author && !s.title && !s.where && !line) lines.push("(not filled in yet)");
    });
    return lines;
  }

  function copyPlan(state) {
    var text = plainPlan(state);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { setStatus("Plan copied.", true); },
        function () { setStatus("Select the plan and copy it manually.", false); }
      );
    } else {
      setStatus("Select the plan and copy it manually.", false);
    }
  }

  function downloadPlan(state) {
    if (!window.DWSDocxWriter || !DWSDocxWriter.buildMlaPlanDocx) {
      setStatus("The download tool did not load. Try refreshing the page.", false);
      return;
    }
    var cited = worksCited(state);
    var titleLines = [{ text: "Research Plan", center: true }, ""];
    var blob = DWSDocxWriter.buildMlaPlanDocx({
      name: state.mla.name,
      instructor: state.mla.instructor,
      course: state.mla.course || "ENGL 1301",
      date: state.mla.date,
      lastName: DWSDocxWriter.lastNameFrom(state.mla.name),
      outlineLines: titleLines.concat(outlineLines(state)),
      worksCited: cited,
      worksCitedPrompt: "Add your two library or Google Scholar sources above, then download again."
    });
    var last = (DWSDocxWriter.lastNameFrom(state.mla.name) || "research").replace(/[^A-Za-z0-9-]+/g, "") || "research";
    DWSDocxWriter.downloadBlob(blob, last + "-research-plan.docx");
    setStatus("Plan downloaded. It stays on your device.", true);
  }

  function clearAll(state) {
    localStorage.removeItem(STORAGE);
    var next = emptyState();
    Object.keys(next).forEach(function (k) { state[k] = next[k]; });
    state.sources = [emptySource(), emptySource()];
    state.ethics = ["", "", "", "", ""];
    state.mla = { name: "", instructor: "", course: "ENGL 1301", date: "" };
    writeState(state);
    render(state);
    setStatus("Cleared.", false);
  }

  function bind() {
    if (!$("rpTopicList")) return;
    var state = readState();
    render(state);
    bindFields(state);
    $("rpCopy").addEventListener("click", function () { copyPlan(state); });
    $("rpDownload").addEventListener("click", function () { downloadPlan(state); });
    $("rpClear").addEventListener("click", function () { clearAll(state); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
