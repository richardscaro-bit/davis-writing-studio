/* Theme toggle for Writing Studio tool pages.
   Default is light. Choice is stored in this browser only. */
(function () {
  var KEY = "dws-tool-theme";

  function current() {
    var theme = document.documentElement.getAttribute("data-theme");
    return theme === "dark" ? "dark" : "light";
  }

  function apply(theme) {
    var next = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch (err) {}
    syncButtons();
  }

  function makeButton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.addEventListener("click", function () {
      apply(current() === "light" ? "dark" : "light");
    });
    return btn;
  }

  function syncButtons() {
    var theme = current();
    var pressed = theme === "dark";
    var text = theme === "dark" ? "Light mode" : "Dark mode";
    var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
      btn.setAttribute("aria-label", label);
      btn.textContent = text;
    });
  }

  function place() {
    var headerBtn = makeButton();
    headerBtn.classList.add("theme-toggle-header");
    var header = document.querySelector("header.topbar");
    var navToggle = header && header.querySelector(".nav-toggle");
    if (header) {
      if (navToggle) header.insertBefore(headerBtn, navToggle);
      else header.appendChild(headerBtn);
    }

    var embedBtn = makeButton();
    embedBtn.classList.add("theme-toggle-embed");
    var main = document.querySelector("main") || document.body;
    main.insertBefore(embedBtn, main.firstChild);
    syncButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", place);
  } else {
    place();
  }
})();
