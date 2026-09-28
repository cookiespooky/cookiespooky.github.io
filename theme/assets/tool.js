(function () {
  "use strict";

  // Разбор речи: одна фраза → пять переводов разной жёсткости и разбор агентности.
  // Хуки data-aa-* живут в tool.html; при правке сверять списки diff'ом из CLAUDE.md.
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
    var filterOptions = Array.prototype.slice.call(root.querySelectorAll("[data-aa-filter-option]"));
    var currentFilterLabel = root.querySelector("[data-aa-current-filter-label]");
    var examples = Array.prototype.slice.call(root.querySelectorAll("[data-aa-example]"));

    if (!form || !textArea || !inputShell || !output || !loader || !result || !retryBtn || !filterWrap) return;

    var state = { selectedFilter: "neutral", results: null, sourceText: "", loading: false };

    var toneLabels = {
      neutral: "нейтральный",
      direct: "прямолинейный",
      radical: "радикальный",
      aggressive: "агрессивный",
      toxic: "токсичный"
    };

    function setError(message) {
      if (!errorBox) return;
      errorBox.hidden = !message;
      errorBox.textContent = message || "";
    }

    function updateCounter() {
      if (counter) counter.textContent = String((textArea.value || "").length);
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

    function selectFilter(key) {
      state.selectedFilter = key;
      filterOptions.forEach(function (btn) {
        var on = btn.getAttribute("data-filter-key") === key;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-checked", on ? "true" : "false");
      });
      if (currentFilterLabel) currentFilterLabel.textContent = toneLabels[key] || toneLabels.neutral;
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

    // Три состояния виджета: ввод, ожидание, результат. Ввод и результат не показываются
    // вместе — результат сам повторяет исходную фразу первой строкой.
    function setMode(mode) {
      state.loading = mode === "loading";
      root.classList.toggle("is-loading", mode === "loading");
      root.classList.toggle("is-result-mode", mode === "result");
      inputShell.hidden = mode !== "input";
      if (submitRow) submitRow.hidden = mode !== "input";
      output.hidden = mode === "input";
      loader.hidden = mode !== "loading";
      result.hidden = mode !== "result";
      retryBtn.hidden = mode !== "result";
      if (retryWrap) retryWrap.hidden = mode !== "result";
    }

    function showInputMode() {
      state.results = null;
      state.sourceText = "";
      setMode("input");
      updateCreatorLink("");
      setError("");
      autoGrowTextArea();
      updateCounter();
      textArea.focus();
    }

    async function submitOnce(text) {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });
      var data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        throw new Error((data && (data.details || data.error)) || "Что-то пошло не так. Попробуйте ещё раз.");
      }
      if (!data || !data.results) throw new Error("Сервис ответил пустым результатом. Попробуйте ещё раз.");
      return data.results;
    }

    filterOptions.forEach(function (option) {
      option.addEventListener("click", function () {
        var key = option.getAttribute("data-filter-key");
        if (key) selectFilter(key);
      });
    });

    examples.forEach(function (btn) {
      btn.addEventListener("click", function () {
        textArea.value = btn.textContent.trim();
        autoGrowTextArea();
        updateCounter();
        updateCreatorLink("");
        setError("");
        textArea.focus();
      });
    });

    textArea.addEventListener("input", function () {
      autoGrowTextArea();
      updateCounter();
      if (!state.sourceText) updateCreatorLink("");
    });

    textArea.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
      event.preventDefault();
      if (state.loading) return;
      if (typeof form.requestSubmit === "function") form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    });

    retryBtn.addEventListener("click", showInputMode);

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (state.loading) return;

      var text = (textArea.value || "").trim();
      if (!text) { setError("Введите фразу для анализа."); return; }
      if (text.length > 500) { setError("Лимит — 500 символов."); return; }
      if (!endpoint) { setError("Не задан адрес сервиса."); return; }

      setError("");
      state.sourceText = text;
      updateCreatorLink(text);
      setMode("loading");

      try {
        state.results = await submitOnce(text);
        setMode("result");
        renderResult();
      } catch (err) {
        state.results = null;
        setMode("input");
        setError(err && err.message ? err.message : "Что-то пошло не так. Попробуйте ещё раз.");
      }
    });

    setMode("input");
    updateCounter();
    autoGrowTextArea();
    selectFilter("neutral");
    updateCreatorLink("");
  }

  initAgencyAnalyzer();
})();
