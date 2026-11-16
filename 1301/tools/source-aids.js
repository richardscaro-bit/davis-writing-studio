/* ENGL 1301 Case Study Source Search Guide + simple Source Log (preview staging). */
(function () {
  const KEY = "engl1301.caseStudySourceLog";
  const CRITERIA = [
    ["framing", "1. Framing"],
    ["stakeholders", "2. Stakeholders"],
    ["evidence", "3. Evidence"],
    ["assumptions", "4. Assumptions"],
    ["limits", "5. Limits"]
  ];

  function toolBase() {
    return /\/tools\/?/.test(location.pathname) ? "" : "tools/";
  }

  function emptyState() {
    const packetDetails = {};
    CRITERIA.forEach(([id]) => {
      packetDetails[id] = { d1: "", d2: "" };
    });
    return {
      packetTitle: "",
      packetMla: "",
      packetDetails,
      outside: [
        { title: "", author: "", date: "", found: "", link: "", section: "", sections: [], packetDetail: "", relation: "", evidence: "", credibility: "", purpose: "", mla: "" },
        { title: "", author: "", date: "", found: "", link: "", section: "", sections: [], packetDetail: "", relation: "", evidence: "", credibility: "", purpose: "", mla: "" }
      ],
      unused: [
        { title: "", found: "", why: "" },
        { title: "", found: "", why: "" }
      ]
    };
  }


  function normOutside(baseRow, saved) {
    const row = Object.assign({}, baseRow, saved || {});
    let sections = Array.isArray(row.sections) ? row.sections.filter(Boolean) : [];
    if (!sections.length && row.section) sections = [row.section];
    row.sections = sections;
    row.section = sections[0] || "";
    return row;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptyState();
      const data = JSON.parse(raw);
      const base = emptyState();
      return Object.assign(base, data, {
        packetDetails: Object.assign(base.packetDetails, data.packetDetails || {}),
        outside: [normOutside(base.outside[0], (data.outside || [])[0]), normOutside(base.outside[1], (data.outside || [])[1])],
        unused: [Object.assign(base.unused[0], (data.unused || [])[0] || {}), Object.assign(base.unused[1], (data.unused || [])[1] || {})]
      });
    } catch (err) {
      return emptyState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {}
  }

  function val(v) {
    return String(v || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function guideHtml() {
    const sl = toolBase() + "source-log.html";
    return `
      <details class="studio-drop" id="dwsSourceGuideDrop">
        <summary>Case Study Source Search Guide</summary>
        <div class="studio-drop-body">
          <p><strong>Your goal:</strong> find 2 outside sources that check what your case study packet claims.</p>
          <p><a class="button small ghost" href="https://docs.google.com/document/d/19SFFZfuGU0w9PyLGf_Quca1Bxl7jVAWJztn9qdhoZbE/copy" target="_blank" rel="noopener">Make your own copy of the Source Search Guide</a></p>
          <p>Every outside source gets a purpose line: <strong>Use this to ___, not to ___.</strong> Give each one a signal phrase and an MLA in-text citation. Check your topic folder Research subfolder first, and use it when it fits.</p>

          <p><strong>Step 1. Pick the packet details to check.</strong> Use one section for each of the five lenses, in the listed order. Write packet details in the Source Log below. Circle the two details that most need outside proof (a number, a big claim, or a claim made only by the company or group itself).</p>
          <p>Fill in: <em>The packet says ___ (page or slide ___). I want to check whether ___.</em></p>

          <p><strong>Step 2. Turn the detail into search words.</strong> Pull out 2 or 3 key words: the name, the topic, and the claim. Add a support word or a contradict word.</p>
          <div class="dws-table-wrap">
            <table>
              <thead><tr><th>To find support, add</th><th>To find a contradiction, add</th></tr></thead>
              <tbody>
                <tr><td>study, data, survey, results, effect</td><td>criticism, problems, lawsuit, complaint, decline</td></tr>
                <tr><td>report, success, growth</td><td>risks, limits, cancel, fails</td></tr>
              </tbody>
            </table>
          </div>
          <ul class="cue-list">
            <li><strong>[company or topic] + [criterion word] + study OR data</strong></li>
            <li><strong>[company or topic] + [claim] + criticism OR lawsuit OR report</strong></li>
            <li><strong>"[exact phrase]" + [topic]</strong></li>
          </ul>
          <p>Use quotation marks for an exact phrase. Use OR between words that mean the same thing.</p>

          <p><strong>Route A. Google Scholar.</strong> Open <a href="https://scholar.google.com" target="_blank" rel="noopener">scholar.google.com</a>. Type a fill-in pattern from Step 2. Use quotation marks around a phrase. Set the date in the left sidebar (Since [year] or a custom range). Click a PDF link for full text, or All versions. Under a good result, use Cited by or Related articles. If it is still locked, search the title in the SAC Library (Route B) or ask a librarian.</p>

          <p><strong>Route B. SAC Library databases.</strong> Open the <a href="https://www.alamo.edu/sac/library/" target="_blank" rel="noopener">SAC Library</a>, then Find articles and databases, or go to the <a href="https://alamo.libguides.com/az/SAC" target="_blank" rel="noopener">A to Z list</a>. Off campus, log in with ACES.</p>
          <p>Good databases to start with: Opposing Viewpoints In Context, Academic OneFile, JSTOR, Nexis Uni, and CQ Researcher.</p>
          <p>Type a fill-in pattern from Step 2. Put AND between ideas and OR between words that mean the same thing. Narrow with peer reviewed or scholarly, date, source type, or subject terms. Need help? Ask a Librarian. Call 210-486-0554, text 210-714-1649, or email ask@sac.libanswers.com.</p>

          <p><strong>Step 3. Sort it.</strong> Read the abstract or first paragraph, then the conclusion or last paragraph. Hold it next to your packet detail.</p>
          <div class="dws-table-wrap">
            <table>
              <thead><tr><th>If the source...</th><th>Sort it as</th></tr></thead>
              <tbody>
                <tr><td>shows the same thing your packet claims</td><td>Supports</td></tr>
                <tr><td>shows something different or the opposite</td><td>Contradicts</td></tr>
                <tr><td>explains the background but does not prove or disprove the claim</td><td>Adds context</td></tr>
              </tbody>
            </table>
          </div>
          <p>Fill in: <em>This source ___ (supports, contradicts, adds context) the packet detail that ___.</em> A source that contradicts your packet is useful. It helps you judge where the packet is strong or weak.</p>

          <p><strong>Step 4. Quick credibility check.</strong> In your Source Log, answer: Who is behind it (researcher, news outlet, government agency, or the company itself)? What do other sources say about the claim? Is it current enough for your topic?</p>
          <p>Fill in: <em>___ is a ___ (researcher, news outlet, agency, company). Other sources ___. It was published in ___.</em></p>

          <p><strong>Step 5. Purpose line and MLA citation.</strong> Write: Use this to ___, not to ___. Model: Use this to show how many subscribers cancel, not to explain why they cancel. Many databases and Google Scholar have a Cite button. Choose MLA, copy it into your Source Log, then check it. Cite buttons make mistakes. SAC How to Cite: <a href="https://alamo.libguides.com/sac-guides/citation/overview" target="_blank" rel="noopener">alamo.libguides.com/sac-guides/citation/overview</a>.</p>

          <p><strong>Step 6. Fit it into a body section.</strong> In every body section, use this order: packet detail, then one or both outside sources, then your analysis. Make your analysis at least as long as your evidence.</p>
          <ul class="cue-list">
            <li>Packet detail: The packet states that ___ (Packet Author page).</li>
            <li>Outside source: According to [author or group], ___ (Author page).</li>
            <li>Analysis: This shows that the packet ___ because ___.</li>
          </ul>

          <p><strong>Worked example (BarkBox practice case, not a graded packet).</strong> The source result below is a pattern, not a real article. Do not cite it. Packet detail (Evidence): the BarkBox materials claim that social content and community identity drive subscription success. Support search: "subscription box" "brand community" loyalty study. Contradict search: "pet subscription" churn OR cancel data. If a university study shows many subscribers cancel within months, that contradicts the success story. Purpose line: Use this to show how many subscribers cancel, not to explain why they cancel.</p>

          <p><strong>Checklist before you turn in your outline.</strong> Exactly 2 outside sources. Every body section uses your packet plus one or both of them. Each source has a purpose line, a credibility note, and an MLA citation. Your packet is still the primary source in all five sections.</p>
          <p><a class="button small primary" href="${sl}">Open the Source Log tool</a></p>
        </div>
      </details>
    `;
  }

  function logHtml(state) {
    const sl = toolBase() + "source-log.html";
    const criteriaRows = CRITERIA.map(([id, label]) => {
      const row = state.packetDetails[id] || { d1: "", d2: "" };
      return `<tr>
        <th scope="row">${label}</th>
        <td><textarea data-cs="packet.${id}.d1" placeholder="Packet detail 1 (quote or paraphrase, with page or slide)">${val(row.d1)}</textarea></td>
        <td><textarea data-cs="packet.${id}.d2" placeholder="Packet detail 2 (quote or paraphrase, with page or slide)">${val(row.d2)}</textarea></td>
      </tr>`;
    }).join("");

    function outsideBlock(i, src) {
      const n = i + 1;
      return `
        <h3 class="eyebrow" style="margin:1rem 0 0.5rem;">Outside Source ${n}</h3>
        <div class="field-grid">
          <label class="field">Title
            <input type="text" data-cs="out.${i}.title" value="${val(src.title)}" autocomplete="off">
          </label>
          <label class="field">Author
            <input type="text" data-cs="out.${i}.author" value="${val(src.author)}" autocomplete="off">
          </label>
          <label class="field">Date
            <input type="text" data-cs="out.${i}.date" value="${val(src.date)}" placeholder="2024" autocomplete="off">
          </label>
          <label class="field">Where I found it
            <input type="text" data-cs="out.${i}.found" value="${val(src.found)}" placeholder="Google Scholar or SAC Library database" autocomplete="off">
          </label>
          <label class="field">Link
            <input type="text" data-cs="out.${i}.link" value="${val(src.link)}" autocomplete="off">
          </label>
          <fieldset class="field span-2">
            <legend>Which body sections use this source? You can check more than one.</legend>
            <div class="cue-list" style="list-style:none;padding-left:0;margin:0.35rem 0 0;">
              ${CRITERIA.map(([id, label]) => {
                const chosen = (src.sections && src.sections.length ? src.sections : (src.section ? [src.section] : []));
                const on = chosen.indexOf(id) !== -1;
                return `<label style="display:inline-flex;align-items:center;gap:0.35rem;margin:0 1rem 0.35rem 0;"><input type="checkbox" data-cs="out.${i}.sections" value="${id}"${on ? " checked" : ""}> ${label}</label>`;
              }).join("")}
            </div>
          </fieldset>
          <label class="field span-2">Which packet detail does it check?
            <textarea data-cs="out.${i}.packetDetail" style="min-height:3rem;">${val(src.packetDetail)}</textarea>
          </label>
          <label class="field">Does it support, contradict, or add context?
            <select data-cs="out.${i}.relation">
              <option value="">Choose one</option>
              <option value="supports"${src.relation === "supports" ? " selected" : ""}>Supports</option>
              <option value="contradicts"${src.relation === "contradicts" ? " selected" : ""}>Contradicts</option>
              <option value="context"${src.relation === "context" ? " selected" : ""}>Adds context</option>
            </select>
          </label>
          <label class="field span-2">Key evidence (quote or paraphrase, with page or paragraph)
            <textarea data-cs="out.${i}.evidence" style="min-height:3rem;">${val(src.evidence)}</textarea>
          </label>
          <label class="field span-2">Credibility note (who is behind it, what other sources say, how current)
            <textarea data-cs="out.${i}.credibility" style="min-height:3rem;">${val(src.credibility)}</textarea>
          </label>
          <label class="field span-2">Purpose line
            <input type="text" data-cs="out.${i}.purpose" value="${val(src.purpose)}" placeholder="Use this to ___, not to ___.">
          </label>
          <label class="field span-2">MLA citation
            <textarea data-cs="out.${i}.mla" style="min-height:3rem;" placeholder="Check Cite-button drafts against an MLA guide.">${val(src.mla)}</textarea>
          </label>
        </div>`;
    }

    const unusedRows = state.unused.map((row, i) => `
      <tr>
        <td><input type="text" data-cs="unused.${i}.title" value="${val(row.title)}" placeholder="Title or link"></td>
        <td><input type="text" data-cs="unused.${i}.found" value="${val(row.found)}" placeholder="Where I found it"></td>
        <td><input type="text" data-cs="unused.${i}.why" value="${val(row.why)}" placeholder="Why I did not use it"></td>
      </tr>`).join("");

    return `
      <details class="studio-drop" id="dwsSourceLogDrop">
        <summary>Case Study Source Log</summary>
        <div class="studio-drop-body">
                    <div data-cs-rule-copy></div>
          <p>This log saves in this browser. You can also keep working in the <a href="${sl}">Source Log tool</a>. The two stay in sync on this device.</p>
          <p><a class="button small ghost" href="https://docs.google.com/document/d/1k5gqe177BPq79ybjit5ZJjlVF7vRxkqKXfV4D8K3iEM/copy" target="_blank" rel="noopener">Make your own copy of the Source Log</a></p>

          <h3 class="eyebrow">Part 1. My case study (used in every body section)</h3>
          <label class="field">Packet title
            <input type="text" data-cs="packetTitle" value="${val(state.packetTitle)}" autocomplete="off">
          </label>
          <label class="field">MLA citation for my packet
            <textarea data-cs="packetMla" style="min-height:3rem;">${val(state.packetMla)}</textarea>
          </label>
          <p>Packet details I will use, two per criterion:</p>
          <div class="dws-table-wrap">
            <table>
              <thead><tr><th>Criterion (body section)</th><th>Packet detail 1</th><th>Packet detail 2</th></tr></thead>
              <tbody>${criteriaRows}</tbody>
            </table>
          </div>

          <h3 class="eyebrow" style="margin-top:1.1rem;">Part 2 and 3. Exactly 2 outside sources</h3>
          ${outsideBlock(0, state.outside[0])}
          ${outsideBlock(1, state.outside[1])}

          <h3 class="eyebrow" style="margin-top:1.1rem;">Part 4. Sources I looked at but did not use (optional)</h3>
          <div class="dws-table-wrap">
            <table>
              <thead><tr><th>Title or link</th><th>Where I found it</th><th>Why I did not use it</th></tr></thead>
              <tbody>${unusedRows}</tbody>
            </table>
          </div>

          <p><strong>Check before you turn in your outline.</strong> Exactly 2 outside sources. Every body section uses your packet plus one or both of them. Each source has a purpose line and an MLA citation. Your packet is still the primary source in all five sections.</p>
          <p class="save-status" data-cs-status></p>
        </div>
      </details>
    `;
  }

  function readFrom(root) {
    const state = emptyState();
    const get = (sel) => root.querySelector('[data-cs="' + sel + '"]');
    if (get("packetTitle")) state.packetTitle = get("packetTitle").value;
    if (get("packetMla")) state.packetMla = get("packetMla").value;
    CRITERIA.forEach(([id]) => {
      state.packetDetails[id] = {
        d1: (get("packet." + id + ".d1") || { value: "" }).value,
        d2: (get("packet." + id + ".d2") || { value: "" }).value
      };
    });
    state.outside.forEach((row, i) => {
      Object.keys(row).forEach((k) => {
        if (k === "section" || k === "sections") return;
        const el = get("out." + i + "." + k);
        if (el) row[k] = el.value;
      });
      const boxes = root.querySelectorAll('[data-cs="out.' + i + '.sections"]');
      const sections = [];
      boxes.forEach((box) => { if (box.checked) sections.push(box.value); });
      row.sections = sections;
      row.section = sections[0] || "";
    });
    state.unused.forEach((row, i) => {
      Object.keys(row).forEach((k) => {
        const el = get("unused." + i + "." + k);
        if (el) row[k] = el.value;
      });
    });
    return state;
  }

  function bind(root) {
    const persist = () => {
      saveState(readFrom(root));
      const status = root.querySelector("[data-cs-status]");
      if (status) status.textContent = "Source Log saved in this browser.";
    };
    root.addEventListener("change", persist);
    root.addEventListener("blur", persist, true);
  }

  function alwaysShowOnThisPage() {
    const path = location.pathname || "";
    return /case-study-studio\.html/.test(path)
      || /case-study-research-guide\.html/.test(path)
      || /source-log\.html/.test(path);
  }

  function selectedIsCaseStudy() {
    const ctx = window.DWSEssayContext;
    if (ctx && typeof ctx.getActive === "function") {
      const essay = ctx.getActive();
      if (essay && essay.id) return essay.id === "case-study";
    }
    const sel = document.getElementById("dwsEssaySelect");
    if (sel) return sel.value === "case-study";
    return false;
  }

  function shouldShowAids() {
    return alwaysShowOnThisPage() || selectedIsCaseStudy();
  }

  function fillHost(host) {
    const state = loadState();
    const path = location.pathname || "";
    const pageHasOwnRule = /case-study-studio\.html/.test(path) || /case-study-research-guide\.html/.test(path);
    const ruleDrop = pageHasOwnRule ? "" : `
      <details class="studio-drop" id="dwsCsRuleDrop">
        <summary>The rule for this essay</summary>
        <div class="studio-drop-body">
          <div data-cs-rule-copy></div>
        </div>
      </details>`;
    host.innerHTML = `
      <div class="dws-source-aids-inner">
        ${ruleDrop}
        ${guideHtml()}
        ${logHtml(state)}
      </div>
    `;
    bind(host);
    host.dataset.csMounted = "true";
    if (window.DWSCaseStudyLenses && typeof window.DWSCaseStudyLenses.fillRuleHosts === "function") {
      window.DWSCaseStudyLenses.fillRuleHosts();
    }
  }

  function syncAidsVisibility(host) {
    const show = shouldShowAids();
    host.hidden = !show;
    if (show && host.dataset.csMounted !== "true") fillHost(host);
  }

  function mount() {
    const host = document.getElementById("dwsSourceAids");
    if (!host) return;
    syncAidsVisibility(host);
    if (alwaysShowOnThisPage()) return;
    const ctx = window.DWSEssayContext;
    if (ctx && typeof ctx.onChange === "function") {
      ctx.onChange(function () { syncAidsVisibility(host); });
    }
    const sel = document.getElementById("dwsEssaySelect");
    if (sel) sel.addEventListener("change", function () { syncAidsVisibility(host); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
