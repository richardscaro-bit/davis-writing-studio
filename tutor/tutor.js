// Davis Writing Studio Tutor (browser side).
// The chat is kept only in this browser (localStorage). No sign in. The xAI key lives in the proxy, never here.
(function () {
  "use strict";

  const CONFIG = window.TUTOR_CONFIG || {};
  const PROXY_URL = (CONFIG.PROXY_URL || "").trim();
  const TEST_MODE = !PROXY_URL;
  const STORE_KEY = "dws-tutor-chat-v1";
  const COURSE_NAMES = {
    "1301": "ENGL 1301", "1302": "ENGL 1302", "2311": "ENGL 2311", "2328": "ENGL 2328",
  };
  const STAGES = [
    "Getting started / choosing a topic",
    "Question or thesis",
    "Research and sources",
    "Outline",
    "Drafting",
    "Revision",
    "Grammar and punctuation",
    "Citations",
    "Final check",
  ];

  const FERPA_NOTE =
    "Please don't paste your name, student ID, grades, or anyone else's personal information. " +
    "Your messages are sent to an AI service to get a reply. Nothing is saved on our side. " +
    "Your copy stays only in this browser on this device, and you can download it.";
  const AI_USE_NOTE =
    "Using this tutor counts as AI use. Note what you asked and what you kept or rejected.";
  const NO_WRITE_REPLY =
    "I can't write, rewrite, or polish your text for you. " +
    "Paste the sentence or part you want to work on, and tell me what you want your reader to understand from it.";

  // Manual site-wide flag. When true, the resting note appears at the top of
  // the tutor with no request to the AI service. Leave this false unless the
  // tutor needs to rest before a student tries a message.
  const TUTOR_RESTING = false;

  const RESTING_PLAIN =
    "The tutor is taking a short rest right now. Your work is still here! Try again later. " +
    "In the meantime, the lens guide, thesis helper, and outline tools on this site still work, " +
    "and you can reach Professor Davis in Canvas. " +
    "Open 1301 Resources or 1301 Tools from this site.";

  const RESTING_NOTE_INNER =
    '<div class="dws-box">' +
      "<h3>The tutor is resting</h3>" +
      "<p>The tutor is taking a short rest right now. Your work is still here! Try again later.</p>" +
    "</div>" +
    '<div class="dws-box sage">' +
      "<h3>What still works</h3>" +
      "<p>In the meantime, the lens guide, thesis helper, and outline tools on this site still work, and you can reach Professor Davis in Canvas.</p>" +
      "<ul>" +
        '<li><a href="../1301/resources.html">1301 Resources</a></li>' +
        '<li><a href="../1301/tools/">1301 Tools</a></li>' +
      "</ul>" +
    "</div>";

  function isTutorUnavailable(res, data, err) {
    if (res && (res.status === 502 || res.status === 503)) return true;
    var msg = "";
    if (data && data.error) msg += " " + data.error;
    if (err && err.message) msg += " " + err.message;
    return /ai service is unavailable|the ai service is unavailable|service is unavailable/i.test(msg);
  }

  function restingNoteEl() {
    var wrap = document.createElement("div");
    wrap.className = "dws-twobox tutor-resting-note";
    wrap.setAttribute("role", "status");
    wrap.innerHTML = RESTING_NOTE_INNER;
    return wrap;
  }

  function showRestingBanner() {
    if (document.getElementById("tutorRestingBanner")) return;
    var banner = document.createElement("div");
    banner.id = "tutorRestingBanner";
    banner.className = "section tutor-resting-banner";
    banner.appendChild(restingNoteEl());
    var main = document.getElementById("main");
    if (main) main.insertBefore(banner, main.firstChild);
  }

  const $ = (id) => document.getElementById(id);
  const stageSel = $("stageSelect");
  const log = $("chatLog");
  const input = $("chatInput");
  const status = $("chatStatus");
  const sendBtn = $("sendBtn");
  const attachBtn = $("attachBtn");
  const attachInput = $("attachInput");
  const attachList = $("attachList");
  const chatPanel = document.querySelector(".tutor-chat");
  const MAX_FILES = 6;  // per message
  let pending = [];     // files read and waiting to be sent: { id, name, kind, text, dataUrl, truncated, error, reading }
  const photoData = {}; // message id -> photo data URLs, kept in memory only (never saved to localStorage)

  // ---------- mobile nav (same as the course pages) ----------
  document.querySelector(".nav-toggle")?.addEventListener("click", () => {
    const m = $("mobileNav");
    const open = m.classList.toggle("open");
    document.querySelector(".nav-toggle").setAttribute("aria-expanded", open ? "true" : "false");
  });

  // ---------- state ----------
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (s && Array.isArray(s.messages)) return s;
    } catch (e) { /* ignore */ }
    return { course: "", stage: "", messages: [] };
  }
  let state = load();
  function save() {
    try {
      // Photos stay in memory only. File text is kept so a later question can still use the draft.
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      status.textContent = "Saved only in this browser.";
    } catch (e) {
      status.textContent = "This browser would not save the chat. Download it before you leave.";
    }
  }

  // ---------- process stage (step 1) ----------
  // There is no course picker. Students name the class and assignment in the chat.
  // A course page may still pass ?course=1301; that is sent as a hint, not shown as a picker.
  const params = new URLSearchParams(location.search);
  const hintCourse = COURSE_NAMES[params.get("course")] ? params.get("course") : "";
  state.course = hintCourse;
  if (state.stage && STAGES.includes(state.stage)) stageSel.value = state.stage;
  else { state.stage = ""; stageSel.value = ""; }

  stageSel.addEventListener("change", () => { state.stage = stageSel.value; save(); });

  // Process stage sent in the assignment field (the worker treats it as optional).
  function contextLabel() {
    return stageSel.value ? "stage: " + stageSel.value : "";
  }

  // ---------- mode badge ----------
  const mode = $("tutorMode");
  mode.hidden = false;
  mode.innerHTML = TEST_MODE
    ? "<strong>Live test.</strong> Replies are samples so the page can be tried. The live tutor is not connected yet."
    : "<strong>Live test.</strong> Replies come from the tutor. Check anything important with Professor Davis.";

  // ---------- render ----------
  function render() {
    log.innerHTML = "";
    if (!state.messages.length) {
      const p = document.createElement("p");
      p.className = "tutor-empty";
      p.textContent = "Choose where you are in the writing process, then tell the tutor your class and assignment. Example: \"I'm in ENGL 1301, working on a Monster Comparison thesis.\"";
      log.appendChild(p);
      return;
    }
    state.messages.forEach((m) => {
      if (m.resting) {
        const wrap = document.createElement("div");
        wrap.className = "tutor-resting-wrap";
        wrap.appendChild(restingNoteEl());
        log.appendChild(wrap);
        return;
      }
      const div = document.createElement("div");
      div.className = "msg " + m.role + (m.error ? " error" : "");
      const who = document.createElement("span");
      who.className = "who";
      who.textContent = m.role === "user" ? "You" : "Tutor";
      div.appendChild(who);
      div.appendChild(document.createTextNode(m.content));
      if (Array.isArray(m.attachments) && m.attachments.length) {
        const f = document.createElement("span");
        f.className = "msg-files";
        f.textContent = "Attached: " + m.attachments.map((a) => a.name + (a.kind === "image" ? " (photo)" : "") + (a.truncated ? " (first part only)" : "")).join(", ");
        div.appendChild(f);
      }
      if (m.demo) {
        const tag = document.createElement("span");
        tag.className = "demo-tag";
        tag.textContent = "Sample reply (Test mode)";
        div.appendChild(tag);
      }
      log.appendChild(div);
    });
    log.scrollTop = log.scrollHeight;
  }
  render();
  if (TUTOR_RESTING) showRestingBanner();

  // ---------- Test mode replies ----------
  // Same checks the proxy runs (see _tutor_proxy/worker.js).
  const WRITE_FOR_ME = [
    /(^|\b(can|could|would|will) you( just| please)?|\bplease|\bi (want|need) you to|\bjust)\s*(help me\s+)?(write|draft|compose|generate|create|re-?write|re-?word|paraphrase|polish|fix|improve|edit|proofread|finish|complete)\b[^.?!\n]{0,40}\b(essay|paper|paragraphs?|intro(duction)?|conclusion|thesis|outline|report|proposal|memo|letter|resume|sentences?|process record|ai use statement|reflection|story|poem|draft|it|this|question)\b/i,
    /\b(write|re-?write|draft|fix|polish|paraphrase|re-?word)\b[^.?!\n]{0,40}\bfor me\b/i,
    /\bdo (my|the) (assignment|homework|essay|paper)\b/i,
    /\bsound (more )?human\b|\bbypass\b[^.?!\n]{0,20}\b(detector|turnitin)\b/i,
  ];
  const GRADE_ASK = [
    /\bwhat (grade|score|letter)\b/i,
    /\b(grade|score|rate|mark)\b[^.?!\n]{0,20}\b(this|my|it)\b/i,
    /\bwill (this|it|my \w+) pass\b/i,
    /\bhow many points\b/i,
    /\bout of (10|100)\b/i,
  ];
  function demoReply(text, firstTurn, files) {
    const named = (text.match(/\b(?:ENGL\s*)?(1301|1302|2311|2328)\b/i) || [])[1];
    const course = named ? "ENGL " + named : (COURSE_NAMES[hintCourse] || "");
    const what = stageSel.value || "your work";
    const where = course ? (what + " in " + course) : what;
    let body;
    if (WRITE_FOR_ME.some((r) => r.test(text))) {
      body = NO_WRITE_REPLY;
    } else if (GRADE_ASK.some((r) => r.test(text))) {
      body = "I don't grade, and I can't predict a grade. Professor Davis grades in Canvas. " +
        "I can tell you what the assignment asks for and whether I can find each part in your draft. " +
        "Which requirement do you want to check first?";
    } else if (files && files.length) {
      body = "What I see: you attached " + files.map((a) => a.name).join(", ") + " for " + where + ". In the live tutor, I would read it and point to one specific spot.\n\n" +
        "One next move: tell me which part you want me to look at first, such as your thesis or one body paragraph.\n\n" +
        "You've got this!";
    } else {
      body = "What I see: you are working on " + where + ". I don't have your text yet, so I can't point to a specific spot.\n\n" +
        "Why it matters: feedback is most useful when it is tied to your own words and to what the assignment asks for.\n\n" +
        "One next move: paste one short part of your own work (a question, a thesis, or one paragraph). If you have not named your class and assignment, add those too.\n\n" +
        "One question: what is the single thing you most want your reader to understand from this part?\n\n" +
        "You've got this!";
    }
    const prefix = firstTurn ? FERPA_NOTE + "\n\n" : "";
    const suffix = firstTurn ? "\n\n" + AI_USE_NOTE : "";
    return prefix + body + suffix;
  }

  // ---------- send ----------
  function scrub(text) {
    return text
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removed]")
      .replace(/\b[A-Z]\d{8}\b/g, "[ID removed]")
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[number removed]")
      .replace(/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g, "[phone removed]");
  }

  let busy = false;
  $("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (busy) return;
    if (pending.some((a) => a.reading)) { status.textContent = "Still reading your file. Try Send again in a moment."; return; }
    const ready = pending.filter((a) => a.kind === "text" || a.kind === "image");
    const raw = input.value.trim();
    if (!raw && !ready.length) {
      if (pending.length) status.textContent = "None of the attached files could be read. Remove them, or type a message.";
      return;
    }
    const text = raw ? scrub(raw) : "I attached " + ready.map((a) => a.name).join(", ") + ".";
    const firstTurn = !state.messages.some((m) => m.role === "assistant" && !m.error);
    state.course = hintCourse;
    const msg = { role: "user", content: text };
    if (ready.length) {
      msg.id = "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      msg.attachments = ready.map((a) => a.kind === "text"
        ? { name: a.name, kind: "text", text: scrub(a.text), truncated: Boolean(a.truncated) }
        : { name: a.name, kind: "image" });
      const photos = ready.filter((a) => a.kind === "image").map((a) => ({ name: a.name, dataUrl: a.dataUrl }));
      if (photos.length) photoData[msg.id] = photos;
    }
    state.messages.push(msg);
    input.value = "";
    pending = [];
    renderPending();
    render();
    save();

    busy = true;
    sendBtn.disabled = true;
    status.textContent = "The tutor is thinking...";

    try {
      if (TEST_MODE) {
        await new Promise((r) => setTimeout(r, 450));
        state.messages.push({ role: "assistant", content: demoReply(text, firstTurn, msg.attachments), demo: true });
      } else {
        const res = await fetch(PROXY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(hintCourse ? { course: hintCourse } : {}),
            assignment: contextLabel(),
            messages: state.messages.filter((m) => !m.error).map(toWire),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (isTutorUnavailable(res, data)) {
          state.messages.push({ role: "assistant", content: RESTING_PLAIN, error: true, resting: true });
        } else if (!res.ok || !data.reply) {
          throw new Error(data.error || "The tutor could not answer right now.");
        } else {
          state.messages.push({ role: "assistant", content: data.reply });
        }
      }
    } catch (err) {
      if (isTutorUnavailable(null, null, err)) {
        state.messages.push({ role: "assistant", content: RESTING_PLAIN, error: true, resting: true });
      } else {
        state.messages.push({ role: "assistant", content: (err && err.message) || "The tutor could not answer right now. Try again in a minute.", error: true });
      }
    } finally {
      busy = false;
      sendBtn.disabled = false;
      render();
      save();
    }
  });

  // One chat message as sent to the proxy. File text goes every turn (the proxy trims old text first).
  // Photos go only while this page is open, because they are not saved in the browser.
  function toWire(m) {
    const out = { role: m.role, content: m.content };
    if (m.role === "user" && Array.isArray(m.attachments) && m.attachments.length) {
      const photos = (m.id && photoData[m.id]) || [];
      out.attachments = m.attachments.map((a) => {
        if (a.kind === "text") return { name: a.name, kind: "text", text: a.text, truncated: Boolean(a.truncated) };
        const p = photos.find((x) => x.name === a.name);
        return p ? { name: a.name, kind: "image", dataUrl: p.dataUrl } : null;
      }).filter(Boolean);
      const gone = m.attachments.filter((a) => a.kind === "image" && !photos.some((x) => x.name === a.name));
      if (gone.length) out.content += "\n\n(I shared a photo earlier in this chat: " + gone.map((a) => a.name).join(", ") + ". It is not attached anymore.)";
    }
    return out;
  }

  // ---------- attachments ----------
  function sizeLabel(n) {
    return n >= 1000 ? Math.round(n / 1000) + "k characters" : n + " characters";
  }
  function renderPending() {
    attachList.innerHTML = "";
    attachList.hidden = !pending.length;
    pending.forEach((a) => {
      const li = document.createElement("li");
      li.className = "attach-chip" + (a.kind === "error" ? " error" : "");
      if (a.kind === "image" && a.preview) {
        const img = document.createElement("img");
        img.src = a.preview; img.alt = "";
        li.appendChild(img);
      }
      const box = document.createElement("span");
      box.className = "chip-text";
      const nm = document.createElement("span");
      nm.className = "chip-name";
      nm.textContent = a.name;
      const meta = document.createElement("span");
      meta.className = "chip-meta";
      meta.textContent = a.reading ? "Reading..."
        : a.kind === "error" ? a.error
        : a.kind === "image" ? "Photo, ready to send"
        : a.truncated ? "Long file: only the first " + sizeLabel(a.text.length) + " will be sent"
        : "Text read, " + sizeLabel(a.text.length);
      box.append(nm, meta);
      li.appendChild(box);
      const x = document.createElement("button");
      x.type = "button";
      x.className = "chip-remove";
      x.setAttribute("aria-label", "Remove " + a.name);
      x.textContent = "\u00d7";
      x.addEventListener("click", () => {
        pending = pending.filter((p) => p.id !== a.id);
        renderPending();
        status.textContent = a.name + " removed.";
        attachBtn.focus();
      });
      li.appendChild(x);
      attachList.appendChild(li);
    });
  }
  async function addFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const room = MAX_FILES - pending.length;
    if (room <= 0) { status.textContent = "You can attach up to " + MAX_FILES + " files at a time."; return; }
    if (files.length > room) status.textContent = "Only the first " + room + " files were added. You can attach up to " + MAX_FILES + " at a time.";
    const reader = window.TutorAttach;
    const items = files.slice(0, room).map((f) => ({ id: Math.random().toString(36).slice(2), name: f.name || "file", reading: true, file: f }));
    pending.push(...items);
    renderPending();
    await Promise.all(items.map(async (it) => {
      const r = reader ? await reader.readFile(it.file) : { kind: "error", error: "Files can't be read right now. Paste the text instead." };
      Object.assign(it, r, { reading: false, name: it.name });
      delete it.file;
      renderPending();
    }));
    const ok = items.filter((a) => a.kind !== "error").length;
    const bad = items.length - ok;
    status.textContent = (ok ? ok + (ok === 1 ? " file ready to send." : " files ready to send.") : "") +
      (bad ? (ok ? " " : "") + bad + (bad === 1 ? " file could not be read." : " files could not be read.") : "");
  }
  attachBtn.addEventListener("click", () => attachInput.click());
  attachInput.addEventListener("change", () => { addFiles(attachInput.files); attachInput.value = ""; });
  let dragDepth = 0;
  const hasFiles = (e) => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes("Files");
  chatPanel.addEventListener("dragenter", (e) => { if (!hasFiles(e)) return; e.preventDefault(); dragDepth++; chatPanel.classList.add("dragging"); });
  chatPanel.addEventListener("dragover", (e) => { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
  chatPanel.addEventListener("dragleave", () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) chatPanel.classList.remove("dragging"); });
  chatPanel.addEventListener("drop", (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth = 0;
    chatPanel.classList.remove("dragging");
    addFiles(e.dataTransfer.files);
  });
  // Dropping a file anywhere else should not open it in place of the page.
  window.addEventListener("dragover", (e) => { if (hasFiles(e)) e.preventDefault(); });
  window.addEventListener("drop", (e) => { if (hasFiles(e)) e.preventDefault(); });
  // Pasting a screenshot into the message box attaches it.
  input.addEventListener("paste", (e) => {
    const files = Array.from((e.clipboardData && e.clipboardData.files) || []);
    if (files.length) { e.preventDefault(); addFiles(files); }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) $("chatForm").requestSubmit();
  });

  // ---------- clear ----------
  $("clearChat").addEventListener("click", () => {
    if (state.messages.length && !confirm("Clear this chat from this browser? Download it first if you want a copy.")) return;
    state.messages = [];
    pending = [];
    renderPending();
    Object.keys(photoData).forEach((k) => delete photoData[k]);
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    save();
    render();
    status.textContent = "Chat cleared from this browser.";
  });

  // ---------- downloads ----------
  function heading() {
    const ctx = contextLabel();
    const courseLine = COURSE_NAMES[hintCourse] || "Course named in the chat";
    return "Davis Writing Studio Tutor chat\n" + courseLine + (ctx ? ", " + ctx : "") +
      "\nDownloaded " + new Date().toLocaleString() + (TEST_MODE ? "\nTest mode: replies are samples." : "");
  }
  function asText() {
    return heading() + "\n\n" + state.messages.map((m) => (m.role === "user" ? "You" : "Tutor") + ":\n" + m.content + filesLine(m)).join("\n\n") + "\n";
  }
  function filesLine(m) {
    return Array.isArray(m.attachments) && m.attachments.length
      ? "\n(Attached: " + m.attachments.map((a) => a.name).join(", ") + ")" : "";
  }
  function fileName(ext) {
    return "writing-studio-tutor-" + (hintCourse || "chat") + "-" + new Date().toISOString().slice(0, 10) + "." + ext;
  }
  function download(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  $("downloadTxt").addEventListener("click", () => {
    download(new Blob([asText()], { type: "text/plain;charset=utf-8" }), fileName("txt"));
  });
  $("downloadDocx").addEventListener("click", () => {
    download(buildDocx(), fileName("docx"));
  });
  window.addEventListener("beforeprint", () => { $("printHeader").textContent = heading(); });
  $("printChat").addEventListener("click", () => {
    $("printHeader").textContent = heading();
    window.print();
  });

  // Minimal .docx writer: a stored (uncompressed) zip with the four required parts.
  function xmlEsc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  }
  function para(text, bold) {
    const lines = text.split("\n");
    const runs = lines.map((l, i) =>
      (i ? "<w:r><w:br/></w:r>" : "") +
      "<w:r>" + (bold ? "<w:rPr><w:b/></w:rPr>" : "") + '<w:t xml:space="preserve">' + xmlEsc(l) + "</w:t></w:r>").join("");
    return "<w:p>" + runs + "</w:p>";
  }
  function buildDocx() {
    let body = para(heading(), true);
    state.messages.forEach((m) => {
      body += para(m.role === "user" ? "You" : "Tutor", true) + para(m.content + filesLine(m), false);
    });
    const files = {
      "[Content_Types].xml":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        "</Types>",
      "_rels/.rels":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>",
      "word/_rels/document.xml.rels":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>',
      "word/document.xml":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
        body + "</w:body></w:document>",
    };
    return new Blob([zipStore(files)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  function zipStore(files) {
    const enc = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    for (const [name, content] of Object.entries(files)) {
      const nameB = enc.encode(name);
      const data = enc.encode(content);
      const crc = crc32(data);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true);
      local.setUint16(8, 0, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, data.length, true);
      local.setUint32(22, data.length, true);
      local.setUint16(26, nameB.length, true);
      chunks.push(new Uint8Array(local.buffer), nameB, data);
      const cen = new DataView(new ArrayBuffer(46));
      cen.setUint32(0, 0x02014b50, true);
      cen.setUint16(4, 20, true);
      cen.setUint16(6, 20, true);
      cen.setUint16(8, 0x0800, true);
      cen.setUint32(16, crc, true);
      cen.setUint32(20, data.length, true);
      cen.setUint32(24, data.length, true);
      cen.setUint16(28, nameB.length, true);
      cen.setUint32(42, offset, true);
      central.push(new Uint8Array(cen.buffer), nameB);
      offset += 30 + nameB.length + data.length;
    }
    const cenSize = central.reduce((n, c) => n + c.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, Object.keys(files).length, true);
    end.setUint16(10, Object.keys(files).length, true);
    end.setUint32(12, cenSize, true);
    end.setUint32(16, offset, true);
    return new Blob([...chunks, ...central, new Uint8Array(end.buffer)]);
  }
})();
