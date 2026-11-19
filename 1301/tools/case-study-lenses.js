/* Case Study lens config (PREVIEW).
 * This is the single swappable list used by the Lens revision guide
 * (case-study-research-guide.html) and the thesis-helper picker.
 * Every 1301 Case Study student uses all five lenses as body sections.
 * Settled lens names, in this order: Framing, Stakeholders, Evidence, Assumptions, Limits.
 * To swap names or card content, edit DWS_CASE_STUDY_LENSES only.
 * Always call them "lenses" in student-facing copy.
 * Client-side only. Nothing is sent to a server until the student clicks a link.
 */
(function (global) {
  "use strict";

  var DWS_CASE_STUDY_LENSES = [
    {
      id: "framing",
      label: "Framing",
      angles: [
        "How the packet defines the problem or the win",
        "What that definition leaves out or treats as settled",
        "What would change if the problem were defined another way"
      ],
      sourceTypes: "Policy briefs, industry or program reports, and studies that define the same kind of problem in another setting",
      termSeeds: ["problem definition", "success story", "program framing"]
    },
    {
      id: "stakeholders",
      label: "Stakeholders",
      angles: [
        "Who the packet treats as the main audience or beneficiary",
        "Whose voices appear, and whose are missing",
        "Who bears a cost the packet does not linger on"
      ],
      sourceTypes: "Community or labor reporting, equity or access studies, and first-person accounts from groups the packet mentions only in passing",
      termSeeds: ["who is affected", "access equity", "missing voices"]
    },
    {
      id: "evidence",
      label: "Evidence",
      angles: [
        "What is presented as data, and what is branding or a single example",
        "Whether the numbers or anecdotes actually support the packet's story",
        "What a reader would still need in order to test a key statement"
      ],
      sourceTypes: "Studies with a clear method, official statistics, and reporting that checks or complicates the packet's figures",
      termSeeds: ["program evidence", "data versus marketing", "program evaluation"]
    },
    {
      id: "assumptions",
      label: "Assumptions",
      angles: [
        "What the packet treats as obvious or shared",
        "What has to be true for the success story to hold",
        "Where an unstated premise leaves the evidence thin"
      ],
      sourceTypes: "Critical or theoretical pieces on the same kind of program, and studies that test a common premise the packet relies on",
      termSeeds: ["taken for granted", "unstated premise", "program assumptions"]
    },
    {
      id: "limits",
      label: "Limits",
      angles: [
        "What the packet can show, and what it cannot, including its limitations",
        "Gaps, biases, or ethical tensions in the case as presented",
        "How far a careful reader should take the conclusion"
      ],
      sourceTypes: "Ethics or limitation discussions, comparison cases that show a boundary, and sources that name what one packet cannot prove",
      termSeeds: ["limitations", "ethical tensions", "what the case cannot show"]
    }
  ];

  var STOP = {
    a:1, an:1, the:1, and:1, or:1, but:1, if:1, then:1, than:1, that:1, this:1, these:1, those:1,
    to:1, of:1, in:1, on:1, for:1, from:1, with:1, without:1, by:1, at:1, as:1, into:1, about:1,
    is:1, are:1, was:1, were:1, be:1, been:1, being:1, do:1, does:1, did:1, doing:1,
    have:1, has:1, had:1, how:1, why:1, what:1, when:1, where:1, which:1, who:1, whom:1, whose:1,
    well:1, once:1, we:1, our:1, their:1, its:1, it:1, they:1, them:1, you:1, your:1,
    not:1, no:1, yes:1, can:1, could:1, should:1, would:1, will:1, may:1, might:1,
    ask:1, asks:1, through:1, over:1, after:1, before:1, also:1, just:1, only:1,
    own:1, my:1, me:1, i:1, does:1, packet:1, case:1, study:1, essay:1, question:1
  };

  function lensById(id) {
    for (var i = 0; i < DWS_CASE_STUDY_LENSES.length; i++) {
      if (DWS_CASE_STUDY_LENSES[i].id === id) return DWS_CASE_STUDY_LENSES[i];
    }
    return null;
  }

  function lensPhrase(lens) {
    return "its " + String(lens && lens.label ? lens.label : "").toLowerCase();
  }

  function topicTokens(raw) {
    var text = String(raw || "").replace(/[“”"']/g, " ");
    var words = text.split(/[^A-Za-z0-9]+/).filter(Boolean);
    var out = [];
    var seen = {};
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      var key = w.toLowerCase();
      if (key.length < 4 || STOP[key] || seen[key]) continue;
      seen[key] = 1;
      out.push(w);
    }
    return out;
  }

  function resolveTopicWords(topicField, questionField) {
    var direct = String(topicField || "").trim();
    if (direct) return direct;
    var tokens = topicTokens(questionField);
    return tokens.slice(0, 6).join(" ");
  }

  function searchTerms(lens, topicWords) {
    var seeds = (lens && lens.termSeeds) ? lens.termSeeds.slice(0, 3) : [];
    var topic = String(topicWords || "").trim();
    if (!topic) {
      return seeds;
    }
    var terms = [];
    for (var i = 0; i < seeds.length; i++) {
      terms.push(topic + " " + seeds[i]);
    }
    return terms.slice(0, 3);
  }

  /* Search-link base for prefilled example terms.
     Google Scholar is the current choice. To switch to regular Google, change
     DWS_SEARCH_LINK_BASE to "https://www.google.com/search?q=" and DWS_SEARCH_LINK_LABEL to "Google". */
  var DWS_SEARCH_LINK_BASE = "https://scholar.google.com/scholar?q=";
  var DWS_SEARCH_LINK_LABEL = "Google Scholar";
  function scholarUrl(term) {
    return DWS_SEARCH_LINK_BASE + encodeURIComponent(term);
  }

  var SAC_AZ = "https://alamo.libguides.com/az/SAC";
  var SAC_HOME = "https://www.alamo.edu/sac/library/";

  function tutorLensUrl(lens, opts) {
    opts = opts || {};
    var url = "../tutor/?course=1301&stage=" + encodeURIComponent("Research and sources") + "&lens=" + encodeURIComponent(lens.id);
    if (opts.includeTopic && opts.topicWords) {
      url += "&withtopic=1&topic=" + encodeURIComponent(String(opts.topicWords).slice(0, 200));
    }
    return url;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function lookCardHtml(lens, topicWords) {
    var terms = searchTerms(lens, topicWords);
    var angles = (lens.angles || []).slice(0, 3);
    var angleList = angles.map(function (a) { return "<li>" + escapeHtml(a) + "</li>"; }).join("");
    var termList = terms.map(function (t, i) {
      if (!t) return "";
      return "<li><a href=\"" + escapeHtml(scholarUrl(t)) + "\" target=\"_blank\" rel=\"noopener\">" + escapeHtml(t) + "</a>" + (i === 0 ? " " + " (" + DWS_SEARCH_LINK_LABEL + ", opens on click)" + "" : "") + "</li>";
    }).join("");
    var tutorPlain = tutorLensUrl(lens, {});
    var tutorWith = topicWords ? tutorLensUrl(lens, { includeTopic: true, topicWords: topicWords }) : "";
    var topicNote = topicWords
      ? "<p class=\"cs-look-note\">Example terms use the topic words you entered. They stay in this browser until you click a link.</p>"
      : "<p class=\"cs-look-note\">Add your topic words above to build example search terms from your own case. Until then, the seeds below are generic.</p>";
    var withLink = tutorWith
      ? "<p class=\"cs-look-tutor\"><a href=\"" + escapeHtml(tutorWith) + "\">Open the tutor with my topic words included</a>. This sends the words you typed, not a full draft, and only after you click.</p>"
      : "";
    return (
      "<details class=\"studio-drop\" data-look-lens=\"" + escapeHtml(lens.id) + "\">" +
        "<summary>" + escapeHtml(lens.label) + "</summary>" +
        "<div class=\"studio-drop-body\">" +
      "<article class=\"cs-look-card\">" +
        "<h3 class=\"cs-look-title\">Where you might look</h3>" +
        "<p class=\"cs-look-kicker\">" + escapeHtml(lens.label) + " lens</p>" +
        "<p class=\"cs-look-label\">Angles you might try</p>" +
        "<ul class=\"cs-look-list\">" + angleList + "</ul>" +
        "<p class=\"cs-look-label\">Source types that often fit</p>" +
        "<p>" + escapeHtml(lens.sourceTypes || "") + "</p>" +
        "<p class=\"cs-look-label\">Example search terms</p>" +
        topicNote +
        "<ul class=\"cs-look-list\">" + termList + "</ul>" +
        "<p class=\"cs-look-links\">Library starting points (open on click): " +
          "<a href=\"" + SAC_AZ + "\" target=\"_blank\" rel=\"noopener\">SAC Library A to Z databases</a>" +
          " and " +
          "<a href=\"https://scholar.google.com\" target=\"_blank\" rel=\"noopener\">Google Scholar</a>." +
        "</p>" +
        "<p class=\"cs-look-tutor\"><a href=\"" + escapeHtml(tutorPlain) + "\">Ask the tutor for help with this lens</a>. This link does not send your topic words. You can paste them after you click if you want.</p>" +
        withLink +
        "<p class=\"cs-look-end\">Use one if it helps. Skip the rest.</p>" +
      "</article>" +
        "</div>" +
      "</details>"
    );
  }

  /* Optional tutor-generated "Where you might look" card.
   * DISABLED. Do not call this. No network code is active.
   * A later, approved version could ask the tutor for card copy,
   * but this stub must stay inert until Caroline asks to turn it on.
   */
  function requestTutorLookCard(/* lensId, topicWords */) {
    return null;
  }


  try { localStorage.removeItem("dws1301-cs-section-v1"); } catch (e) {}

  var RULE_TEXT = "Start with your own critical analysis question about your case study. You can find example critical questions in your Case Brief file. Next, use the five lenses to answer your question. In order, they are Framing, Stakeholders, Evidence, Assumptions, and Limits. Your outline has five body sections, one for each lens, in that order. Put 2 cited case study details in each section. Your thesis answers your question and previews all five lenses, in order. Your case study packet is your primary source. Use it in every body section. Use exactly 2 outside sources from Google Scholar or the SAC Library. Every body section uses your packet plus one or both outside sources. You can use either outside source in any section, and as often as you need. Put your limitations or ethics idea in the Limits section. Do not add a separate limitations section outside of Limits. The Outline / Research Plan assignment in Canvas is the graded turn-in.";
  var RULE_LENGTH = "Aim for a 1,000 to 1,500 word MLA critical analysis (AI Level 2: support, not composition).";

  function ruleHtml(opts) {
    opts = opts || {};
    return (
      '<div class="dws-rule" data-cs-rule-boxes>' +
        '<div class="dws-twobox dws-rule-boxes">' +
          '<div class="dws-box">' +
            "<h3>Your question and thesis</h3>" +
            "<ul>" +
              "<li>Start with your own <strong>critical analysis question</strong> about your case study.</li>" +
              "<li>You can find example critical questions in your <strong>Case Brief</strong> file.</li>" +
              "<li>Your <strong>thesis</strong> answers your question and previews all five lenses, in order.</li>" +
            "</ul>" +
          "</div>" +
          '<div class="dws-box sage">' +
            "<h3>Five body sections</h3>" +
            "<ul>" +
              "<li>In order, they are <strong>Framing</strong>, <strong>Stakeholders</strong>, <strong>Evidence</strong>, <strong>Assumptions</strong>, and <strong>Limits</strong>.</li>" +
              "<li>Your outline has <strong>five body sections</strong>, one for each lens, in that order.</li>" +
              "<li>Put <strong>2 cited case study details</strong> in each section.</li>" +
              "<li>Put your limitations or ethics idea in the <strong>Limits</strong> section.</li>" +
              "<li>Do not add a separate limitations section outside of Limits.</li>" +
            "</ul>" +
          "</div>" +
          '<div class="dws-box">' +
            "<h3>Your sources</h3>" +
            "<ul>" +
              "<li>Your case study packet is your <strong>primary source</strong>. Use it in every body section.</li>" +
              "<li>Use exactly <strong>2 outside sources</strong> from Google Scholar or the SAC Library.</li>" +
              "<li>Every body section uses your packet plus one or both outside sources.</li>" +
              "<li>You can use either outside source in any section, and as often as you need.</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
        '<p class="dws-rule-meta">Length: 1,000 to 1,500 words, MLA (AI Level 2: support, not composition). Turn in: the Outline / Research Plan assignment in Canvas.</p>' +
      "</div>"
    );
  }

  function pageWantsRuleBlock() {
    return !!(document.body && document.body.hasAttribute("data-cs-rule-block"));
  }

  function fillRuleHosts() {
    if (!pageWantsRuleBlock()) return;
    var html = ruleHtml();
    document.querySelectorAll("[data-cs-rule-copy]").forEach(function (el) {
      el.innerHTML = html;
    });
  }

  var GUIDE_STORE = "dws1301-lens-guide-v1";

  function loadGuideState() {
    try {
      var raw = localStorage.getItem(GUIDE_STORE);
      if (!raw) return { topic: "", question: "" };
      var data = JSON.parse(raw);
      return {
        topic: data.topic || "",
        question: data.question || ""
      };
    } catch (e) {
      return { topic: "", question: "" };
    }
  }

  function saveGuideState(state) {
    try {
      localStorage.setItem(GUIDE_STORE, JSON.stringify({
        topic: state.topic || "",
        question: state.question || "",
        savedAt: Date.now()
      }));
    } catch (e) {}
  }

  function renderGuide() {
    var marksHost = document.getElementById("csLensMarks");
    var cardsHost = document.getElementById("csLensCards");
    if (!marksHost || !cardsHost) return;
    var topicEl = document.getElementById("csLensTopic");
    var qEl = document.getElementById("csLensQuestion");
    var saved = loadGuideState();
    if (topicEl && !topicEl.value) topicEl.value = saved.topic || "";
    if (qEl && !qEl.value) qEl.value = saved.question || "";

    function currentTopic() {
      return resolveTopicWords(topicEl && topicEl.value, qEl && qEl.value);
    }

    function persist() {
      saveGuideState({
        topic: (topicEl && topicEl.value) || "",
        question: (qEl && qEl.value) || ""
      });
    }

    function drawMarks() {
      marksHost.innerHTML = "";
      DWS_CASE_STUDY_LENSES.forEach(function (lens) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "idea-chip active";
        btn.setAttribute("data-cs-lens", lens.id);
        btn.setAttribute("aria-pressed", "true");
        btn.disabled = true;
        btn.setAttribute("aria-disabled", "true");
        btn.textContent = lens.label;
        marksHost.appendChild(btn);
      });
    }

    function drawCards() {
      var topic = currentTopic();
      var html = "";
      DWS_CASE_STUDY_LENSES.forEach(function (lens) {
        html += lookCardHtml(lens, topic);
      });
      cardsHost.innerHTML = html;
    }

    function refresh() {
      drawMarks();
      drawCards();
      persist();
    }

    function onFields() {
      persist();
      drawCards();
    }
    if (topicEl) {
      topicEl.addEventListener("input", onFields);
      topicEl.addEventListener("change", onFields);
    }
    if (qEl) {
      qEl.addEventListener("input", onFields);
      qEl.addEventListener("change", onFields);
      qEl.addEventListener("blur", function () {
        if (topicEl && !String(topicEl.value || "").trim()) {
          var pulled = resolveTopicWords("", qEl.value);
          if (pulled) topicEl.placeholder = pulled;
        }
        onFields();
      });
    }

    refresh();
  }

  function renderPickerChips(host) {
    if (!host) return;
    var allBtn = host.querySelector("[data-cs-all]");
    if (allBtn) allBtn.remove();
    host.querySelectorAll("[data-cs-criterion]").forEach(function (btn) { btn.remove(); });
    DWS_CASE_STUDY_LENSES.forEach(function (lens) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "idea-chip active";
      btn.setAttribute("data-cs-criterion", lens.id);
      btn.setAttribute("aria-pressed", "true");
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
      btn.textContent = lens.label;
      host.appendChild(btn);
    });
  }

  function renderSkipWhy(host) {
    if (!host) return;
    host.innerHTML = "";
    host.hidden = true;
  }

  global.DWS_CASE_STUDY_LENSES = DWS_CASE_STUDY_LENSES;
  global.DWSCaseStudyLenses = {
    list: DWS_CASE_STUDY_LENSES,
    lensById: lensById,
    lensPhrase: lensPhrase,
    resolveTopicWords: resolveTopicWords,
    searchTerms: searchTerms,
    scholarUrl: scholarUrl,
    tutorLensUrl: tutorLensUrl,
    lookCardHtml: lookCardHtml,
    requestTutorLookCard: requestTutorLookCard,
    renderGuide: renderGuide,
    renderPickerChips: renderPickerChips,
    renderSkipWhy: renderSkipWhy,
    ruleHtml: ruleHtml,
    ruleText: RULE_TEXT,
    fillRuleHosts: fillRuleHosts,
    SEARCH_LINK_BASE: DWS_SEARCH_LINK_BASE,
    SEARCH_LINK_LABEL: DWS_SEARCH_LINK_LABEL,
    SAC_AZ: SAC_AZ,
    SAC_HOME: SAC_HOME
  };

  function boot() {
    fillRuleHosts();
    if (document.getElementById("csLensMarks")) renderGuide();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  function openStudioDropFromHash() {
    var raw = (location.hash || "").replace(/^#/, "");
    if (!raw) return;
    var el = document.getElementById(raw);
    if (!el) return;
    if (el.matches("details.studio-drop")) {
      el.open = true;
      return;
    }
    var parent = el.closest("details.studio-drop");
    if (parent) parent.open = true;
    var child = el.querySelector(":scope > details.studio-drop");
    if (child) child.open = true;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", openStudioDropFromHash);
  } else {
    openStudioDropFromHash();
  }
  window.addEventListener("hashchange", openStudioDropFromHash);

})(window);
