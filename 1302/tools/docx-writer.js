/* Shared minimal docx writer.
   zipStore / crc32 / xmlEsc follow the tutor's stored-zip writer.
   Tutor behavior is not changed; this file is a copy used by the outline helper. */
(function (global) {
  function xmlEsc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  }

  const CRC_TABLE = (function () {
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
      const data = typeof content === "string" ? enc.encode(content) : content;
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

  function rPr(extra) {
    return (
      "<w:rPr>" +
      '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>' +
      '<w:sz w:val="24"/><w:szCs w:val="24"/>' +
      (extra || "") +
      "</w:rPr>"
    );
  }

  function pPr(opts) {
    opts = opts || {};
    var bits = '<w:spacing w:before="0" w:after="0" w:line="480" w:lineRule="auto"/>';
    if (opts.hanging) bits += '<w:ind w:left="720" w:hanging="720"/>';
    if (opts.center) bits += '<w:jc w:val="center"/>';
    if (opts.right) bits += '<w:jc w:val="right"/>';
    return "<w:pPr>" + bits + "</w:pPr>";
  }

  function tRun(text, italic, bold) {
    var extra = (italic ? "<w:i/><w:iCs/>" : "") + (bold ? "<w:b/><w:bCs/>" : "");
    return "<w:r>" + rPr(extra) + '<w:t xml:space="preserve">' + xmlEsc(text) + "</w:t></w:r>";
  }

  /* Markup: *italic* segments. No other styling. */
  function runsFromMarkup(text) {
    var s = String(text == null ? "" : text);
    var out = "";
    var re = /\*([^*]+)\*/g;
    var last = 0;
    var m;
    while ((m = re.exec(s))) {
      if (m.index > last) out += tRun(s.slice(last, m.index), false, false);
      out += tRun(m[1], true, false);
      last = m.index + m[0].length;
    }
    if (last < s.length) out += tRun(s.slice(last), false, false);
    if (!out) out = tRun("", false, false);
    return out;
  }

  function paraMarkup(text, opts) {
    return "<w:p>" + pPr(opts) + runsFromMarkup(text) + "</w:p>";
  }

  function paraPlain(text, opts) {
    return "<w:p>" + pPr(opts) + tRun(text, false, false) + "</w:p>";
  }

  function pageBreak() {
    return '<w:p><w:r>' + rPr() + '<w:br w:type="page"/></w:r></w:p>';
  }

  function lastNameFrom(full) {
    var a = String(full || "").replace(/\s+/g, " ").trim();
    if (!a) return "";
    if (a.indexOf(",") >= 0) return a.split(",")[0].trim();
    var parts = a.split(" ");
    return parts[parts.length - 1];
  }

  function buildMlaPlanDocx(opts) {
    opts = opts || {};
    var name = (opts.name || "").trim() || " ";
    var instructor = (opts.instructor || "").trim() || " ";
    var course = (opts.course || "").trim() || " ";
    var date = (opts.date || "").trim() || " ";
    var last = (opts.lastName || lastNameFrom(opts.name) || "").trim();
    var lines = Array.isArray(opts.outlineLines) ? opts.outlineLines : [];
    var cited = Array.isArray(opts.worksCited) ? opts.worksCited.filter(Boolean) : [];
    var citedPrompt = opts.worksCitedPrompt || "Add your primary source and critic entries in the outline helper, then download again.";

    var headerXml =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      "<w:p>" +
      pPr({ right: true }) +
      tRun(last ? last + " " : "", false, false) +
      "<w:r>" + rPr() + '<w:fldChar w:fldCharType="begin"/></w:r>' +
      "<w:r>" + rPr() + '<w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>' +
      "<w:r>" + rPr() + '<w:fldChar w:fldCharType="end"/></w:r>' +
      "</w:p></w:hdr>";

    var body = "";
    body += paraPlain(name);
    body += paraPlain(instructor);
    body += paraPlain(course);
    body += paraPlain(date);
    if (!lines.length) {
      body += paraPlain("");
      body += paraPlain("Generate an outline in the outline helper, then download again.");
    } else {
      lines.forEach(function (line) {
        if (line == null) return;
        if (typeof line === "string") body += paraMarkup(line);
        else body += paraMarkup(line.text || "", line);
      });
    }
    body += pageBreak();
    body += paraPlain("Works Cited", { center: true });
    if (!cited.length) {
      body += paraPlain(citedPrompt);
    } else {
      cited.forEach(function (entry) {
        var text = typeof entry === "string" ? entry : entry.text || "";
        body += paraMarkup(text, { hanging: true });
      });
    }

    var sect =
      "<w:sectPr>" +
      '<w:headerReference w:type="default" r:id="rId2"/>' +
      '<w:pgSz w:w="12240" w:h="15840"/>' +
      '<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>' +
      "</w:sectPr>";

    var files = {
      "[Content_Types].xml":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>' +
        "</Types>",
      "_rels/.rels":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>",
      "word/_rels/document.xml.rels":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>' +
        "</Relationships>",
      "word/header1.xml": headerXml,
      "word/document.xml":
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        "<w:body>" + body + sect + "</w:body></w:document>"
    };

    return new Blob([zipStore(files)], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  global.DWSDocxWriter = {
    xmlEsc: xmlEsc,
    zipStore: zipStore,
    crc32: crc32,
    lastNameFrom: lastNameFrom,
    buildMlaPlanDocx: buildMlaPlanDocx,
    downloadBlob: downloadBlob
  };
})(window);
