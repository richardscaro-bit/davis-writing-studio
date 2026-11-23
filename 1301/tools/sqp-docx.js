/* MLA 9 paper builder for the summary, paraphrase, and quote practice.
   Makes a .docx in the browser. No network calls and nothing is stored.
   The zip writer follows the one in docx-writer.js (stored, no compression). */
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


  var NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  var XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

  function rPr(extra) {
    return "<w:rPr>" + extra + "</w:rPr>";
  }

  function run(text, italic) {
    return "<w:r>" + rPr(italic ? "<w:i/><w:iCs/>" : "") + '<w:t xml:space="preserve">' + xmlEsc(text) + "</w:t></w:r>";
  }

  /* Text with one italic phrase (used for the journal title in the Works Cited entry). */
  function runsWithItalic(text, italicPhrase) {
    var idx = italicPhrase ? text.indexOf(italicPhrase) : -1;
    if (idx < 0) return run(text, false);
    return run(text.slice(0, idx), false) + run(italicPhrase, true) + run(text.slice(idx + italicPhrase.length), false);
  }

  function para(inner, opts) {
    opts = opts || {};
    var p = "";
    if (opts.pageBreakBefore) p += "<w:pageBreakBefore/>";
    if (opts.single) p += '<w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>';
    if (opts.hanging) p += '<w:ind w:left="720" w:hanging="720"/>';
    else if (opts.firstLine) p += '<w:ind w:firstLine="720"/>';
    if (opts.center) p += '<w:jc w:val="center"/>';
    if (opts.right) p += '<w:jc w:val="right"/>';
    return "<w:p>" + (p ? "<w:pPr>" + p + "</w:pPr>" : "") + inner + "</w:p>";
  }

  function lastNameFrom(full) {
    var a = String(full || "").replace(/\s+/g, " ").trim();
    if (!a) return "";
    if (a.indexOf(",") >= 0) return a.split(",")[0].trim();
    var parts = a.split(" ");
    return parts[parts.length - 1];
  }

  /* opts: name, instructor, course, date, title, paragraphs[], worksCited, worksCitedItalic */
  function buildMlaDocx(opts) {
    opts = opts || {};
    var name = (opts.name || "").trim();
    var last = (opts.lastName || lastNameFrom(name)).trim();
    var body = "";
    [name, (opts.instructor || "").trim(), (opts.course || "").trim(), (opts.date || "").trim()].forEach(function (line) {
      body += para(run(line, false));
    });
    body += para(run((opts.title || "").trim() || "Summary, Paraphrase, and Quote Practice", false), { center: true });
    (opts.paragraphs || []).forEach(function (text) {
      var t = String(text || "").trim();
      if (t) body += para(run(t, false), { firstLine: true });
    });
    body += para(run("Works Cited", false), { center: true, pageBreakBefore: true });
    body += para(runsWithItalic(opts.worksCited || "", opts.worksCitedItalic || ""), { hanging: true });

    var headerXml =
      XML + "<w:hdr " + NS + ">" +
      para(
        (last ? run(last + " ", false) : "") +
          "<w:r>" + rPr("") + '<w:fldChar w:fldCharType="begin"/></w:r>' +
          "<w:r>" + rPr("") + '<w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>' +
          "<w:r>" + rPr("") + '<w:fldChar w:fldCharType="separate"/></w:r>' +
          "<w:r>" + rPr("") + "<w:t>1</w:t></w:r>" +
          "<w:r>" + rPr("") + '<w:fldChar w:fldCharType="end"/></w:r>',
        { right: true, single: true }
      ) +
      "</w:hdr>";

    var stylesXml =
      XML + "<w:styles " + NS + ">" +
      "<w:docDefaults><w:rPrDefault><w:rPr>" +
      '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>' +
      '<w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US"/>' +
      "</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>" +
      '<w:spacing w:before="0" w:after="0" w:line="480" w:lineRule="auto"/>' +
      "</w:pPr></w:pPrDefault></w:docDefaults>" +
      '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
      "</w:styles>";

    var sect =
      "<w:sectPr>" +
      '<w:headerReference w:type="default" r:id="rId2"/>' +
      '<w:pgSz w:w="12240" w:h="15840"/>' +
      '<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>' +
      "</w:sectPr>";

    var files = {
      "[Content_Types].xml":
        XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
        '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>' +
        "</Types>",
      "_rels/.rels":
        XML + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>",
      "word/_rels/document.xml.rels":
        XML + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>' +
        "</Relationships>",
      "word/styles.xml": stylesXml,
      "word/header1.xml": headerXml,
      "word/document.xml": XML + "<w:document " + NS + "><w:body>" + body + sect + "</w:body></w:document>"
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

  global.SQPDocx = { buildMlaDocx: buildMlaDocx, downloadBlob: downloadBlob, lastNameFrom: lastNameFrom, zipStore: zipStore };
})(typeof window !== "undefined" ? window : this);
