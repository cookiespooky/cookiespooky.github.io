(function () {
  "use strict";

  function initAgencyAnalyzer() {
    var root = document.querySelector("[data-agency-analyzer]");
    if (!root) return;

    var endpoint = root.getAttribute("data-endpoint") || "";
    var form = root.querySelector("[data-aa-form]");
    var textArea = root.querySelector("[data-aa-text]");
    var inputShell = root.querySelector("[data-aa-input-shell]");
    var counter = root.querySelector("[data-aa-char-count]");
    var submitRow = root.querySelector("[data-aa-submit-row]");
    var output = root.querySelector("[data-aa-output]");
    var loader = root.querySelector("[data-aa-loader]");
    var result = root.querySelector("[data-aa-result]");
    var sourceTextEl = root.querySelector("[data-aa-source-text]");
    var resultText = root.querySelector("[data-aa-result-text]");
    var resultAnalysis = root.querySelector("[data-aa-result-analysis]");
    var retryBtn = root.querySelector("[data-aa-retry]");
    var retryWrap = root.querySelector("[data-aa-retry-wrap]");
    var errorBox = root.querySelector("[data-aa-error]");
    var creatorLink = root.querySelector("[data-aa-creator-link]");

    var filterWrap = root.querySelector("[data-aa-filter-wrap]");
    var filterToggle = root.querySelector("[data-aa-filter-toggle]");
    var filterMenu = root.querySelector("[data-aa-filter-menu]");
    var filterOptions = Array.prototype.slice.call(root.querySelectorAll("[data-aa-filter-option]"));
    var currentFilterLabel = root.querySelector("[data-aa-current-filter-label]");

    if (!form || !textArea || !inputShell || !output || !loader || !result || !retryBtn || !filterToggle || !filterMenu) return;

    var state = {
      selectedFilter: "neutral",
      results: null,
      sourceText: "",
      loading: false
    };

    var filterToneMap = {
      neutral: { label: "нейтральный", color: "#1ea971" },
      direct: { label: "прямолинейный", color: "#6ccf5a" },
      radical: { label: "радикальный", color: "#d8a437" },
      aggressive: { label: "агрессивный", color: "#d57431" },
      toxic: { label: "токсичный", color: "#c2463b" }
    };

    function setError(message) {
      if (!errorBox) return;
      if (!message) {
        errorBox.hidden = true;
        errorBox.textContent = "";
        return;
      }
      errorBox.hidden = false;
      errorBox.textContent = message;
    }

    function updateCounter() {
      if (!counter) return;
      counter.textContent = String((textArea.value || "").length);
    }

    function updateCreatorLink(sourceText) {
      if (!creatorLink) return;
      var text = (sourceText || textArea.value || "").trim();
      var message = text ? ("Привет, Антон! " + text) : "Привет, Антон!";
      creatorLink.href = "https://t.me/cookiespooky?text=" + encodeURIComponent(message);
    }

    function autoGrowTextArea() {
      textArea.style.height = "auto";
      textArea.style.height = textArea.scrollHeight + "px";
    }

    function closeFilterMenu() {
      filterMenu.hidden = true;
      filterToggle.setAttribute("aria-expanded", "false");
    }

    function openFilterMenu() {
      filterMenu.hidden = false;
      filterToggle.setAttribute("aria-expanded", "true");
    }

    function updateFilterToggle() {
      var tone = filterToneMap[state.selectedFilter] || filterToneMap.neutral;
      if (currentFilterLabel) {
        currentFilterLabel.textContent = tone.label;
        currentFilterLabel.style.color = tone.color;
      }
    }

    function selectFilter(key) {
      state.selectedFilter = key;
      filterOptions.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-filter-key") === key);
      });
      updateFilterToggle();
      closeFilterMenu();
      if (state.results) renderResult();
    }

    function renderResult() {
      if (!state.results) return;
      var data = state.results[state.selectedFilter];
      if (!data) return;
      if (sourceTextEl) sourceTextEl.textContent = state.sourceText || "";
      resultText.textContent = data.objective_text || "";
      resultAnalysis.textContent = data.agency_analysis || "";
      result.hidden = false;
    }

    function setLoading(loading) {
      state.loading = loading;
      root.classList.toggle("is-loading", loading);
      output.hidden = false;
      loader.hidden = !loading;
      if (loading) {
        retryBtn.hidden = true;
      }
      if (retryWrap) retryWrap.hidden = loading || !state.results || retryBtn.hidden;
      if (loading) {
        result.hidden = true;
      }
    }

    function showInputMode() {
      root.classList.remove("is-result-mode");
      inputShell.hidden = false;
      if (submitRow) submitRow.hidden = false;
      output.hidden = true;
      loader.hidden = true;
      result.hidden = true;
      retryBtn.hidden = true;
      if (retryWrap) retryWrap.hidden = true;
      state.results = null;
      state.sourceText = "";
      updateCreatorLink("");
      setError("");
      autoGrowTextArea();
      textArea.focus();
      updateCounter();
    }

    async function submitOnce(text) {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });

      var data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        throw new Error((data && (data.details || data.error)) || "Что-то пошло не так. Попробуйте еще раз");
      }
      if (!data || !data.results) {
        throw new Error("Пустой ответ от сервиса");
      }
      return data.results;
    }

    filterToggle.addEventListener("click", function () {
      if (filterMenu.hidden) openFilterMenu();
      else closeFilterMenu();
    });

    filterOptions.forEach(function (option) {
      option.addEventListener("click", function () {
        var key = option.getAttribute("data-filter-key");
        if (!key) return;
        selectFilter(key);
      });
    });

    document.addEventListener("click", function (event) {
      if (!filterWrap.contains(event.target)) closeFilterMenu();
    });

    textArea.addEventListener("input", function () {
      autoGrowTextArea();
      updateCounter();
      if (!state.sourceText) updateCreatorLink("");
    });

    textArea.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      if (state.loading) return;
      if (typeof form.requestSubmit === "function") {
        form.requestSubmit();
      } else {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    });

    retryBtn.addEventListener("click", function () {
      showInputMode();
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (state.loading) return;

      var text = (textArea.value || "").trim();
      if (!text) {
        setError("Введите фразу для анализа.");
        return;
      }
      if (text.length > 500) {
        setError("Лимит: 500 символов.");
        return;
      }
      if (!endpoint) {
        setError("Не задан endpoint API.");
        return;
      }

      setError("");
      closeFilterMenu();
      state.sourceText = text;
      updateCreatorLink(text);
      inputShell.hidden = true;
      if (submitRow) submitRow.hidden = true;
      retryBtn.hidden = true;
      setLoading(true);

      try {
        state.results = await submitOnce(text);
        setLoading(false);
        inputShell.hidden = false;
        root.classList.add("is-result-mode");
        renderResult();
        retryBtn.hidden = false;
        if (retryWrap) retryWrap.hidden = false;
      } catch (err) {
        setLoading(false);
        output.hidden = true;
        inputShell.hidden = false;
        if (submitRow) submitRow.hidden = false;
        setError(err && err.message ? err.message : "Что-то пошло не так. Попробуйте еще раз");
      }
    });

    updateCounter();
    autoGrowTextArea();
    updateFilterToggle();
    updateCreatorLink("");
  }
  initAgencyAnalyzer();
})();
