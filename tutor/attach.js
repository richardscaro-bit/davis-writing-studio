// Davis Writing Studio Tutor: reading attached files in the browser.
// Text is pulled out here, on the student's device. Photos are shrunk to a JPEG.
// Nothing is uploaded until the student presses Send, and nothing is saved on our side.
(function () {
  "use strict";

  const MAX_BYTES = 10 * 1024 * 1024;  // 10 MB per file
  const MAX_TEXT = 30000;              // characters kept per file
  const MAX_SIDE = 1600;               // longest side of a photo, in pixels
  const BASE = (document.currentScript && document.currentScript.src) ? new URL(".", document.currentScript.src).href : "";

  const TEXT_EXT = ["txt", "md", "markdown", "text", "csv", "tsv", "html", "htm", "rtf", "json", "xml"];
  const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "bmp", "avif"];

  const MSG = {
    tooBig: "This file is over 10 MB, so it is too big to send. Try a smaller file, a PDF, or paste the part you want help with.",
    empty: "I could not find any text in this file. If it is a scan or a photo of pages, upload it as a photo instead, or paste the text.",
    pdfScan: "This PDF looks like a scan, so there is no text to read. Try uploading a photo of the page, or paste the text.",
    heic: "This photo type did not open in this browser. Try taking a screenshot of the photo and attaching that, or attach it from a phone browser.",
    image: "This photo did not open. Try a JPG or PNG, or take a screenshot and attach that.",
    doc: "Older Word files (.doc) can't be read here. In Word or Google Docs, save it as .docx or PDF and attach that, or paste the text.",
    office: "I can't read this kind of file here. Save it as a PDF or .docx and attach that, or paste the text you want help with.",
    unknown: "I can't read this kind of file. Try a .docx, PDF, .txt, or a photo, or paste the text you want help with.",
    failed: "Something went wrong reading this file. Try saving it as a PDF or .docx, or paste the text.",
  };

  function ext(name) { const m = /\.([a-z0-9]+)$/i.exec(name || ""); return m ? m[1].toLowerCase() : ""; }

  function tidy(text) {
    return String(text || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function finishText(name, text) {
    const t = tidy(text);
    if (!t) return { name, kind: "error", error: MSG.empty };
    const truncated = t.length > MAX_TEXT;
    return { name, kind: "text", text: truncated ? t.slice(0, MAX_TEXT) : t, truncated, chars: t.length };
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = resolve; s.onerror = () => reject(new Error("load"));
      document.head.appendChild(s);
    });
  }

  let mammothP = null;
  function getMammoth() {
    if (window.mammoth) return Promise.resolve(window.mammoth);
    if (!mammothP) mammothP = loadScript(BASE + "vendor/mammoth.browser.min.js").then(() => window.mammoth);
    return mammothP;
  }
  let pdfP = null;
  function getPdf() {
    if (!pdfP) {
      pdfP = import(BASE + "vendor/pdf.min.mjs").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = BASE + "vendor/pdf.worker.min.mjs";
        return lib;
      });
    }
    return pdfP;
  }

  // ---------- readers ----------
  function rtfToText(rtf) {
    return rtf
      .replace(/\\par[d]?/g, "\n")
      .replace(/\\'([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\u(-?\d+)\??/g, (_, n) => String.fromCharCode((Number(n) + 65536) % 65536))
      .replace(/\{\\\*[^{}]*\}/g, "")
      .replace(/\\[a-z]+-?\d* ?/gi, "")
      .replace(/[{}]/g, "");
  }

  async function readDocx(file) {
    const mammoth = await getMammoth();
    const r = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return r.value;
  }

  async function readPdf(file) {
    const lib = await getPdf();
    const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise;
    const pages = [];
    let total = 0;
    for (let i = 1; i <= pdf.numPages && total < MAX_TEXT + 2000; i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      let line = "";
      for (const it of tc.items) { line += it.str; if (it.hasEOL) line += "\n"; else if (it.str && !/\s$/.test(it.str)) line += " "; }
      pages.push(line);
      total += line.length;
    }
    return pages.join("\n\n");
  }

  // Small zip reader for .pptx and .odt (stored or deflated parts).
  async function unzipText(buf, wanted) {
    const dv = new DataView(buf);
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error("zip");
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const dec = new TextDecoder();
    const out = {};
    for (let n = 0; n < count; n++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true);
      const csize = dv.getUint32(p + 20, true);
      const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
      const lho = dv.getUint32(p + 42, true);
      const name = dec.decode(new Uint8Array(buf, p + 46, nlen));
      p += 46 + nlen + xlen + clen;
      if (!wanted(name)) continue;
      const start = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true);
      const data = new Uint8Array(buf, start, csize);
      if (method === 0) out[name] = dec.decode(data);
      else if (method === 8 && typeof DecompressionStream === "function") {
        const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        out[name] = await new Response(stream).text();
      }
    }
    return out;
  }
  function xmlText(xml, paraTag) {
    return xml
      .replace(new RegExp("</" + paraTag + ">", "g"), "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
  }
  async function readPptx(file) {
    const parts = await unzipText(await file.arrayBuffer(), (n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
    const names = Object.keys(parts).sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));
    return names.map((n, i) => "Slide " + (i + 1) + ":\n" + xmlText(parts[n], "a:p")).join("\n\n");
  }
  async function readOdf(file) {
    const parts = await unzipText(await file.arrayBuffer(), (n) => n === "content.xml");
    return parts["content.xml"] ? xmlText(parts["content.xml"], "text:p") : "";
  }

  function readImage(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
          const w = Math.max(1, Math.round(img.naturalWidth * scale));
          const h = Math.max(1, Math.round(img.naturalHeight * scale));
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);  // transparent PNGs get a white page
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = c.toDataURL("image/jpeg", 0.85);
          resolve({ name: file.name, kind: "image", dataUrl, preview: c.toDataURL("image/jpeg", 0.5) });
        } catch (e) {
          resolve({ name: file.name, kind: "error", error: MSG.image });
        } finally { URL.revokeObjectURL(url); }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        const e = ext(file.name);
        resolve({ name: file.name, kind: "error", error: (e === "heic" || e === "heif" || /hei[cf]/i.test(file.type)) ? MSG.heic : MSG.image });
      };
      img.src = url;
    });
  }

  // Main entry: always resolves, never throws.
  async function readFile(file) {
    const name = (file && file.name) || "file";
    try {
      if (!file) return { name, kind: "error", error: MSG.failed };
      if (file.size > MAX_BYTES) return { name, kind: "error", error: MSG.tooBig };
      const e = ext(name);
      const type = (file.type || "").toLowerCase();
      if (type.startsWith("image/") || IMAGE_EXT.includes(e)) return await readImage(file);
      if (e === "docx" || type.includes("wordprocessingml")) return finishText(name, await readDocx(file));
      if (e === "pdf" || type === "application/pdf") {
        const r = finishText(name, await readPdf(file));
        return r.kind === "error" ? { name, kind: "error", error: MSG.pdfScan } : r;
      }
      if (e === "pptx" || type.includes("presentationml")) return finishText(name, await readPptx(file));
      if (["odt", "odp"].includes(e)) return finishText(name, await readOdf(file));
      if (e === "doc") return { name, kind: "error", error: MSG.doc };
      if (["xls", "xlsx", "ppt", "pages", "key", "numbers", "odp", "ods"].includes(e)) return { name, kind: "error", error: MSG.office };
      if (TEXT_EXT.includes(e) || type.startsWith("text/")) {
        let t = await file.text();
        if (e === "rtf" || type.includes("rtf")) t = rtfToText(t);
        else if (e === "html" || e === "htm" || type === "text/html") t = new DOMParser().parseFromString(t, "text/html").body.innerText || new DOMParser().parseFromString(t, "text/html").body.textContent;
        return finishText(name, t);
      }
      return { name, kind: "error", error: MSG.unknown };
    } catch (err) {
      return { name, kind: "error", error: MSG.failed };
    }
  }

  window.TutorAttach = { readFile, MAX_BYTES, MAX_TEXT };
})();
