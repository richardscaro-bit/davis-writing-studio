/* Project 3 only: criticism type or types choice for thesis-helper and outline-helper.
   Other essay modes are left unchanged. */
(function (global) {
  var GOTHIC_ID = "project3-gothic-criticism";
  var STORAGE = "dws1302.tools.p3CriticTypes";
  var CANVAS_SENTENCE =
    "Both critics write on the same story. Most students use one criticism type for both critics. If you want, you can use two different types instead.";
  var DEFAULT_OPTS = [
    "Historical/cultural",
    "Psychological",
    "Sociological",
    "Philosophical/ethical",
    "Feminist/gender",
    "Formalist/narratological",
    "Gothic studies",
    "Other / custom"
  ];

  function getActive() {
    return global.DWSEssayContext && DWSEssayContext.getActive && DWSEssayContext.getActive();
  }

  function isP3(essay) {
    var e = essay || getActive();
    return !!(e && e.id === GOTHIC_ID);
  }

  function read() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE) || "null") || {};
    } catch (err) {
      return {};
    }
  }

  function write(data) {
    localStorage.setItem(STORAGE, JSON.stringify(data));
    syncLegacy(data);
  }

  function resolveType(value, custom) {
    var v = String(value || "").trim();
    if (!v) return "";
    if (/^other/i.test(v)) return String(custom || "").trim();
    return v;
  }

  function collect(data) {
    data = data || read();
    var mode = data.mode === "different" ? "different" : "same";
    var typeSame = resolveType(data.typeSame, data.customSame);
    var type1 = resolveType(data.type1, data.custom1);
    var type2 = resolveType(data.type2, data.custom2);
    var phrase = "";
    var summary = "";
    if (mode === "different") {
      if (type1 && type2) {
        phrase = "Critic 1 uses a " + type1 + " approach, and Critic 2 uses a " + type2 + " approach";
        summary = type1 + " (Critic 1) and " + type2 + " (Critic 2)";
      } else if (type1 || type2) {
        phrase = "two different criticism types: " + (type1 || "Critic 1 type still needed") + " and " + (type2 || "Critic 2 type still needed");
        summary = (type1 || "Critic 1 type still needed") + " and " + (type2 || "Critic 2 type still needed");
      }
    } else if (typeSame) {
      phrase = "both critics use a " + typeSame + " approach";
      summary = typeSame + " (same type for both critics)";
    }
    return {
      mode: mode,
      typeSameRaw: data.typeSame || "",
      type1Raw: data.type1 || "",
      type2Raw: data.type2 || "",
      customSame: data.customSame || "",
      custom1: data.custom1 || "",
      custom2: data.custom2 || "",
      typeSame: typeSame,
      type1: type1,
      type2: type2,
      phrase: phrase,
      summary: summary,
      topicFolder: mode === "different"
        ? [type1, type2].filter(Boolean).join(" / ")
        : typeSame
    };
  }

  function syncLegacy(data) {
    var info = collect(data);
    if (!info.topicFolder) return;
    try {
      var rawT = localStorage.getItem("engl1301.tools.thesis.inputs");
      var t = rawT ? JSON.parse(rawT) : {};
      t.topicFolder = info.topicFolder;
      t.criticTypeMode = info.mode;
      localStorage.setItem("engl1301.tools.thesis.inputs", JSON.stringify(t));
    } catch (err) {}
    try {
      var rawO = localStorage.getItem("engl1301.tools.outline.inputs");
      var o = rawO ? JSON.parse(rawO) : {};
      o.topicFolder = info.topicFolder;
      o.criticTypeMode = info.mode;
      localStorage.setItem("engl1301.tools.outline.inputs", JSON.stringify(o));
    } catch (err) {}
    try {
      var rawC = localStorage.getItem("engl1301.tools.chosen");
      var c = rawC ? JSON.parse(rawC) : null;
      if (c && typeof c === "object") {
        c.topicFolder = info.topicFolder;
        localStorage.setItem("engl1301.tools.chosen", JSON.stringify(c));
      }
    } catch (err) {}
  }

  function optionsFromEssay(essay) {
    var list = (essay && Array.isArray(essay.topicOptions) && essay.topicOptions.length)
      ? essay.topicOptions
      : DEFAULT_OPTS;
    return list.slice();
  }

  function fillSelect(sel, opts, value) {
    if (!sel) return;
    var current = value || sel.value || "";
    sel.innerHTML = "";
    var blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Choose a type";
    sel.appendChild(blank);
    opts.forEach(function (opt) {
      var o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      sel.appendChild(o);
    });
    if (current) {
      var has = opts.indexOf(current) >= 0;
      if (!has && current) {
        var extra = document.createElement("option");
        extra.value = current;
        extra.textContent = current;
        sel.appendChild(extra);
      }
      sel.value = current;
    }
  }

  function typeRow(idPrefix, labelText, opts, value, customValue) {
    var wrap = document.createElement("label");
    wrap.className = "p3-type-row";
    wrap.setAttribute("for", idPrefix);
    wrap.appendChild(document.createTextNode(labelText));
    var sel = document.createElement("select");
    sel.id = idPrefix;
    fillSelect(sel, opts, value);
    wrap.appendChild(sel);
    var custom = document.createElement("input");
    custom.type = "text";
    custom.id = idPrefix + "Custom";
    custom.className = "p3-type-custom";
    custom.setAttribute("placeholder", "Name the custom type");
    custom.value = customValue || "";
    custom.hidden = !/^other/i.test(value || "");
    wrap.appendChild(custom);
    return wrap;
  }

  function readFromHost(host) {
    if (!host) return read();
    var modeEl = host.querySelector('input[name="p3CriticTypeMode"]:checked');
    var mode = modeEl && modeEl.value === "different" ? "different" : "same";
    function val(id) {
      var el = host.querySelector("#" + id);
      return el ? el.value : "";
    }
    return {
      mode: mode,
      typeSame: val("p3TypeSame"),
      type1: val("p3Type1"),
      type2: val("p3Type2"),
      customSame: val("p3TypeSameCustom"),
      custom1: val("p3Type1Custom"),
      custom2: val("p3Type2Custom")
    };
  }

  function applyVisibility(host) {
    if (!host) return;
    var data = readFromHost(host);
    var sameWrap = host.querySelector("[data-p3-same]");
    var diffWrap = host.querySelector("[data-p3-different]");
    if (sameWrap) sameWrap.hidden = data.mode !== "same";
    if (diffWrap) diffWrap.hidden = data.mode !== "different";
    ["p3TypeSame", "p3Type1", "p3Type2"].forEach(function (id) {
      var sel = host.querySelector("#" + id);
      var custom = host.querySelector("#" + id + "Custom");
      if (custom) custom.hidden = !(sel && /^other/i.test(sel.value || ""));
    });
  }

  function persistFromHost(host) {
    var data = readFromHost(host);
    write(data);
    applyVisibility(host);
    if (typeof global.dispatchEvent === "function") {
      global.dispatchEvent(new CustomEvent("dws-p3-critic-types", { detail: collect(data) }));
    }
  }

  function mountHost(host, essay) {
    if (!host) return;
    var opts = optionsFromEssay(essay);
    var saved = read();
    host.innerHTML = "";
    host.classList.add("p3-critic-types");
    host.removeAttribute("hidden");
    host.hidden = false;

    var legend = document.createElement("p");
    legend.className = "p3-critic-legend";
    legend.innerHTML = "<strong>Criticism type or types</strong>";
    host.appendChild(legend);

    var modeField = document.createElement("fieldset");
    modeField.className = "p3-critic-mode";
    var sameLab = document.createElement("label");
    var sameRadio = document.createElement("input");
    sameRadio.type = "radio";
    sameRadio.name = "p3CriticTypeMode";
    sameRadio.value = "same";
    sameRadio.checked = saved.mode !== "different";
    sameLab.appendChild(sameRadio);
    sameLab.appendChild(document.createTextNode(" Same type for both critics (most students)"));
    var diffLab = document.createElement("label");
    var diffRadio = document.createElement("input");
    diffRadio.type = "radio";
    diffRadio.name = "p3CriticTypeMode";
    diffRadio.value = "different";
    diffRadio.checked = saved.mode === "different";
    diffLab.appendChild(diffRadio);
    diffLab.appendChild(document.createTextNode(" Two different types"));
    modeField.appendChild(sameLab);
    modeField.appendChild(diffLab);
    host.appendChild(modeField);

    var sameWrap = document.createElement("div");
    sameWrap.setAttribute("data-p3-same", "");
    sameWrap.appendChild(typeRow("p3TypeSame", "Criticism type", opts, saved.typeSame || "", saved.customSame || ""));
    host.appendChild(sameWrap);

    var diffWrap = document.createElement("div");
    diffWrap.setAttribute("data-p3-different", "");
    diffWrap.appendChild(typeRow("p3Type1", "Critic 1 type", opts, saved.type1 || "", saved.custom1 || ""));
    diffWrap.appendChild(typeRow("p3Type2", "Critic 2 type", opts, saved.type2 || "", saved.custom2 || ""));
    host.appendChild(diffWrap);

    var note = document.createElement("p");
    note.className = "p3-canvas-rule";
    note.textContent = CANVAS_SENTENCE;
    host.appendChild(note);

    applyVisibility(host);
    host.addEventListener("change", function () { persistFromHost(host); });
    host.addEventListener("input", function () { persistFromHost(host); });
  }

  function setTopicFolderVisibility(on) {
    var tf = document.getElementById("topicFolder");
    if (!tf) return;
    var label = tf.closest("label");
    if (label) label.hidden = !!on;
    else tf.hidden = !!on;
  }

  function syncHosts() {
    var essay = getActive();
    var p3 = isP3(essay);
    var hosts = document.querySelectorAll("#p3CriticTypes, .p3-critic-types-host");
    hosts.forEach(function (host) {
      if (p3) mountHost(host, essay);
      else {
        host.innerHTML = "";
        host.hidden = true;
      }
    });
    setTopicFolderVisibility(p3 && document.getElementById("p3CriticTypes"));
  }

  function start() {
    syncHosts();
    if (global.DWSEssayContext && DWSEssayContext.onChange) {
      DWSEssayContext.onChange(function () { syncHosts(); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  global.DWSP3CriticTypes = {
    id: GOTHIC_ID,
    sentence: CANVAS_SENTENCE,
    isP3: isP3,
    get: function () { return collect(); },
    read: read,
    write: write,
    sync: syncHosts
  };
})(window);
