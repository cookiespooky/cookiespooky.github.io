#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
loadLocalEnv(path.join(rootDir, ".env.graph-runtime.local"));
const graphPath = path.join(rootDir, "theme", "assets", "site-graph.json");
const outputSchemaPath = path.join(rootDir, "scripts", "graph-runtime-schema.json");
const systemPromptPath = path.join(rootDir, "site_atoms_v12_research_principles", "prompts", "system-prompt.md");
const host = process.env.GRAPH_RUNTIME_HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const port = Number(process.env.PORT || process.env.GRAPH_RUNTIME_PORT || 8787);
const provider = process.env.GRAPH_RUNTIME_PROVIDER || (process.env.DEEPSEEK_API_KEY ? "deepseek" : "codex");
const model = process.env.GRAPH_RUNTIME_MODEL || (provider === "deepseek" ? "deepseek-v4-flash" : "");
const codexBin = resolveCodexCommand();
const deepSeekBaseUrl = (process.env.DEEPSEEK_API_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
const deepSeekApiKey = process.env.DEEPSEEK_API_KEY || "";
const deepSeekResolvedIp = resolveDeepSeekIp();
const siteSystemPrompt = loadSystemPrompt();
const remoteGraphRuntimeBaseUrl = (process.env.GRAPH_REMOTE_ENDPOINT_BASE_URL || "").replace(/\/+$/, "");

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const source = fs.readFileSync(filePath, "utf8");
  source.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separator = trimmed.indexOf("=");
    if (separator === -1) return;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
}

function loadGraph() {
  return JSON.parse(fs.readFileSync(graphPath, "utf8"));
}

function loadSystemPrompt() {
  try {
    return fs.readFileSync(systemPromptPath, "utf8").trim();
  } catch {
    return "";
  }
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function humanizeRuntimeError(error) {
  const raw = String(error && error.message ? error.message : error || "").trim();
  if (!raw) return "Генератор сейчас недоступен. Попробуйте еще раз чуть позже.";

  if (/api key/i.test(raw) || /unauthorized/i.test(raw) || /forbidden/i.test(raw) || /\b401\b|\b403\b/.test(raw)) {
    return "Генератор недоступен из-за ошибки доступа к модели.";
  }
  if (/timed? out|timeout|aborted/i.test(raw) || /\b504\b/.test(raw)) {
    return "Генерация заняла слишком много времени. Попробуйте еще раз или выберите более узкую тему.";
  }
  if (/too many requests|\b429\b/i.test(raw)) {
    return "Генератор временно перегружен. Повторите запрос через несколько секунд.";
  }
  if (/not found|\b404\b/i.test(raw)) {
    return "Runtime endpoint не найден. Проверьте, что выбран правильный генератор.";
  }
  if (/ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|Failed to fetch/i.test(raw)) {
    return "Не удалось соединиться с генератором. Проверьте endpoint и доступность сервиса.";
  }
  if (/invalid json|empty response/i.test(raw)) {
    return "Генератор ответил в неожиданном формате. Попробуйте еще раз.";
  }

  return raw;
}

function writeStreamHeaders(res) {
  res.writeHead(200, {
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
}

function writeStreamEvent(res, payload) {
  res.write(`${JSON.stringify(payload)}\n`);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body is too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function buildAtomMap(graph) {
  return new Map((graph.atoms || []).map((atom) => [atom.id, atom]));
}

function collectContext(atomMap, atomId, trail) {
  const rootAtom = atomMap.get(atomId);
  if (!rootAtom) {
    throw new Error(`Unknown atom: ${atomId}`);
  }

  const queue = [{ id: atomId, depth: 0 }];
  const seen = new Set([atomId]);
  const context = [];

  while (queue.length && context.length < 12) {
    const current = queue.shift();
    const atom = atomMap.get(current.id);
    if (!atom) continue;

    context.push({
      id: atom.id,
      title: atom.title,
      kind: atom.kind,
      hub: atom.hub,
      summary: atom.summary,
      links: atom.links || [],
      actions: atom.actions || []
    });

    if (current.depth >= 2) continue;

    const nextIds = []
      .concat((atom.links || []).map((item) => item.id))
      .concat((atom.actions || []).map((item) => item.target))
      .filter(Boolean);

    nextIds.forEach((nextId) => {
      if (seen.has(nextId) || !atomMap.has(nextId)) return;
      seen.add(nextId);
      queue.push({ id: nextId, depth: current.depth + 1 });
    });
  }

  return {
    rootAtom,
    trail: (trail || []).map((id) => atomMap.get(id)).filter(Boolean).map((atom) => ({
      id: atom.id,
      title: atom.title,
      kind: atom.kind,
      summary: atom.summary
    })),
    context
  };
}

function buildPrompt(graphContext) {
  const rootAtom = graphContext.rootAtom;
  const trailText = graphContext.trail.length
    ? graphContext.trail.map((atom) => `${atom.title} (${atom.id})`).join(" -> ")
    : "стартовый переход без предыдущего маршрута";

  return [
    "Ты пишешь статью для главной страницы сайта, который работает как интерфейс к графу знаний.",
    "Нужен полноценный, но компактный материал на русском языке длиной примерно 1000-2000 знаков.",
    "Пиши без рекламной воды, без общих рассуждений и без списков-пустышек.",
    "Статья должна быть полезной сама по себе и вести пользователя глубже по связанным понятиям.",
    "Внутри текста используй только ссылки вида [[atom_id|Текст ссылки]].",
    "Используй только atom_id, которые реально есть в переданном контексте.",
    "Не вставляй HTML и не используй markdown кроме абзацев, опциональных заголовков уровня ## и ссылок [[...]].",
    "В конце верни 3-5 следующих действий. Каждый action.target тоже должен ссылаться только на atom_id из контекста.",
    "Ответь строго JSON-объектом по схеме.",
    "",
    `Текущий атом: ${rootAtom.title} (${rootAtom.id})`,
    `Тип: ${rootAtom.kind}`,
    `Хаб: ${rootAtom.hub}`,
    `Краткое описание: ${rootAtom.summary}`,
    `Текущий маршрут пользователя: ${trailText}`,
    "",
    "Подграф для статьи:",
    JSON.stringify(graphContext.context, null, 2)
  ].join("\n");
}

function buildBodyPrompt(graphContext) {
  const rootAtom = graphContext.rootAtom;
  const trailText = graphContext.trail.length
    ? graphContext.trail.map((atom) => `${atom.title} (${atom.id})`).join(" -> ")
    : "стартовый переход без предыдущего маршрута";

  return [
    "Ты пишешь основную статью для главной страницы сайта-интерфейса к графу знаний.",
    "Пиши на русском языке.",
    "Нужен цельный материал длиной примерно 1000-2000 знаков.",
    "Пиши живо, плотно, без рекламной воды, без вводных про то, что это статья.",
    "Используй только абзацы и при необходимости подзаголовки вида ##.",
    "Внутри текста используй только ссылки вида [[atom_id|Текст ссылки]].",
    "Используй только atom_id, которые реально есть в переданном контексте.",
    "Не добавляй списки в конце и не добавляй JSON.",
    "",
    `Текущий атом: ${rootAtom.title} (${rootAtom.id})`,
    `Тип: ${rootAtom.kind}`,
    `Хаб: ${rootAtom.hub}`,
    `Краткое описание: ${rootAtom.summary}`,
    `Маршрут пользователя: ${trailText}`,
    "",
    "Подграф для статьи:",
    JSON.stringify(graphContext.context, null, 2)
  ].join("\n");
}

function buildMetadataPrompt(graphContext, articleBody) {
  return [
    "Ниже готовая статья для главной страницы сайта-графа знаний.",
    "Нужно вернуть только JSON-объект с полями title, summary, next_actions.",
    "summary: 1-2 предложения на русском, без воды.",
    "next_actions: массив из 3-4 объектов {label, target}.",
    "target должен использовать только atom_id из контекста.",
    "label должен быть конкретным и человеческим.",
    "",
    `Текущий атом: ${graphContext.rootAtom.title} (${graphContext.rootAtom.id})`,
    "Доступные atom_id для next_actions:",
    graphContext.context.map((atom) => `${atom.id}: ${atom.title}`).join("\n"),
    "",
    "Готовая статья:",
    articleBody
  ].join("\n");
}

async function postJson(url, payload, headers) {
  const response = await fetch(url, {
    method: "POST",
    headers: Object.assign({
      "Content-Type": "application/json"
    }, headers || {}),
    body: JSON.stringify(payload)
  });

  const rawText = await response.text();
  let parsed;

  try {
    parsed = rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    parsed = { raw: rawText };
  }

  if (!response.ok) {
    const message = parsed && parsed.error && parsed.error.message
      ? parsed.error.message
      : parsed && parsed.error
        ? parsed.error
        : `HTTP ${response.status}`;
    throw new Error(`DeepSeek API error: ${message}`);
  }

  return parsed;
}

async function postStream(url, payload, headers) {
  const response = await fetch(url, {
    method: "POST",
    headers: Object.assign({
      "Content-Type": "application/json"
    }, headers || {}),
    body: JSON.stringify(payload)
  });

  if (!response.ok || !response.body) {
    const rawText = await response.text();
    let parsed;
    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch (error) {
      parsed = { raw: rawText };
    }

    const message = parsed && parsed.error && parsed.error.message
      ? parsed.error.message
      : parsed && parsed.error
        ? parsed.error
        : `HTTP ${response.status}`;
    throw new Error(`DeepSeek API error: ${message}`);
  }

  return response;
}

function streamWithCurl(url, payload, headers, onLine) {
  return new Promise((resolve, reject) => {
    const args = [
      "-N",
      "-sS",
      "-X", "POST",
      url,
      "-H", "Content-Type: application/json"
    ];

    appendDeepSeekResolve(args, url);

    Object.entries(headers || {}).forEach(([key, value]) => {
      args.push("-H", `${key}: ${value}`);
    });

    args.push("--data-binary", "@-");

    const child = spawn("curl.exe", args, {
      cwd: rootDir,
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdoutBuffer = "";
    let stderrBuffer = "";

    child.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk.toString("utf8");
      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() || "";
      for (const line of lines) {
        onLine(line);
      }
    });

    child.stderr.on("data", (chunk) => {
      stderrBuffer += chunk.toString("utf8");
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (stdoutBuffer.trim()) {
        onLine(stdoutBuffer.trim());
      }
      if (code !== 0) {
        reject(new Error((stderrBuffer || `curl exited with code ${code}`).trim()));
        return;
      }
      resolve();
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

function appendDeepSeekResolve(args, url) {
  if (!deepSeekResolvedIp) return;
  if (!/^https:\/\/api\.deepseek\.com(?:\/|$)/i.test(url)) return;
  args.push("--resolve", `api.deepseek.com:443:${deepSeekResolvedIp}`);
}

function resolveDeepSeekIp() {
  if (process.env.DEEPSEEK_RESOLVE_IP) {
    return process.env.DEEPSEEK_RESOLVE_IP;
  }

  if (process.platform !== "win32") {
    return "";
  }

  const candidates = [
    "api.deepseek.com",
    "d3bbv8sr76az5s.cloudfront.net"
  ];

  for (const hostname of candidates) {
    const result = spawnSync("powershell", [
      "-NoProfile",
      "-Command",
      `try { (Resolve-DnsName '${hostname}' -Type A -Server 8.8.8.8 | Select-Object -First 1 -ExpandProperty IPAddress) } catch { '' }`
    ], {
      cwd: rootDir,
      encoding: "utf8",
      stdio: "pipe",
      timeout: 15000
    });

    const ip = String(result.stdout || "").trim();
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
      return ip;
    }
  }

  return "";
}

function postJsonWithCurl(url, payload, headers) {
  return new Promise((resolve, reject) => {
    const args = [
      "-sS",
      "-X", "POST",
      url,
      "-H", "Content-Type: application/json"
    ];

    appendDeepSeekResolve(args, url);

    Object.entries(headers || {}).forEach(([key, value]) => {
      args.push("-H", `${key}: ${value}`);
    });

    args.push("--data-binary", "@-");

    const child = spawn("curl.exe", args, {
      cwd: rootDir,
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error((stderr || `curl exited with code ${code}`).trim()));
        return;
      }

      try {
        resolve(stdout ? JSON.parse(stdout) : {});
      } catch (error) {
        reject(new Error("DeepSeek returned invalid JSON"));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

function resolveCodexCommand() {
  if (process.env.GRAPH_RUNTIME_CODEX_BIN) {
    return process.env.GRAPH_RUNTIME_CODEX_BIN;
  }

  if (process.platform === "win32") {
    const candidates = [
      "codex.exe",
      path.join(process.env.APPDATA || "", "npm", "codex.cmd"),
      path.join(process.env.APPDATA || "", "npm", "codex"),
      "codex"
    ].filter(Boolean);

    for (const candidate of candidates) {
      try {
        const probe = spawnSync(candidate, ["--version"], {
          cwd: rootDir,
          encoding: "utf8",
          stdio: "pipe",
          timeout: 15000,
          shell: candidate.toLowerCase().endsWith(".cmd")
        });
        if (probe.status === 0) {
          return candidate;
        }
      } catch (error) {
        // Try the next candidate.
      }
    }
  }

  return "codex";
}

function buildFallbackArticle(graphContext, reason) {
  const rootAtom = graphContext.rootAtom;
  const relatedAtoms = graphContext.context.filter((atom) => atom.id !== rootAtom.id).slice(0, 5);
  const relatedText = relatedAtoms.length
    ? relatedAtoms.map((atom) => `[[${atom.id}|${atom.title}]]`).join(", ")
    : "соседних атомов в текущем контексте пока нет";
  const actionTargets = relatedAtoms.slice(0, 4);

  const body = [
    `## ${rootAtom.title}`,
    rootAtom.summary || `${rootAtom.title} пока описан кратко, поэтому статья собрана из доступного графового контекста.`,
    "",
    `Этот материал открыт из графа знаний, где текущий атом связан с направлениями и шагами, которые помогают раскрыть тему глубже. Прямо сейчас runtime-генератор недоступен, поэтому страница собрана из атомов и их связей, без полной модели поверх графа.`,
    "",
    `Чтобы продолжить маршрут осмысленно, имеет смысл перейти к связанным понятиям: ${relatedText}. Обычно они уточняют либо прикладной сценарий, либо метод, через который тема превращается в рабочий процесс и в полноценный материал для чтения.`,
    "",
    `Когда runtime-модель снова сможет выполнить запрос, этот же переход будет возвращать уже не шаблон, а цельную статью на 1000-2000 знаков, собранную по тому же подграфу.`
  ].join("\n");

  return {
    title: rootAtom.title,
    summary: rootAtom.summary || "Черновой режим по графу атомов.",
    body,
    next_actions: actionTargets.map((atom) => ({
      label: `Перейти к ${atom.title}`,
      target: atom.id
    })),
    source: "fallback",
    warning: humanizeRuntimeError(reason)
  };
}

function buildSuggestedActions(graphContext) {
  return graphContext.context
    .filter((atom) => atom.id !== graphContext.rootAtom.id)
    .slice(0, 4)
    .map((atom) => ({
      label: `Перейти к ${atom.title}`,
      target: atom.id
    }));
}

async function streamLocalArticle(article, res) {
  const sourceBody = String(article.body || "");
  const chunks = sourceBody.match(/.{1,80}/gs) || [];
  let body = "";

  for (const chunk of chunks) {
    body += chunk;
    writeStreamEvent(res, {
      type: "delta",
      delta: chunk,
      body
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

async function requestRemoteGraphRuntime(pathname, payload) {
  if (!remoteGraphRuntimeBaseUrl) {
    throw new Error("GRAPH_REMOTE_ENDPOINT_BASE_URL is not configured");
  }

  return postJson(`${remoteGraphRuntimeBaseUrl}${pathname}`, payload, {});
}

async function streamRemoteArticle(graphContext, payload, res) {
  const article = await requestRemoteGraphRuntime("/v1/graph/article", payload);
  const nextActions = Array.isArray(article.next_actions) ? article.next_actions : buildSuggestedActions(graphContext);

  writeStreamHeaders(res);
  writeStreamEvent(res, {
    type: "start",
    title: article.title || graphContext.rootAtom.title,
    summary: article.summary || graphContext.rootAtom.summary || "",
    next_actions: nextActions,
    status: "Строю статью из облачного генератора..."
  });
  await streamLocalArticle(article, res);
  writeStreamEvent(res, {
    type: "meta",
    title: article.title || graphContext.rootAtom.title,
    summary: article.summary || graphContext.rootAtom.summary || "",
    next_actions: nextActions,
    warning: article.warning ? humanizeRuntimeError(article.warning) : undefined
  });
  writeStreamEvent(res, {
    type: "done",
    title: article.title || graphContext.rootAtom.title,
    summary: article.summary || graphContext.rootAtom.summary || "",
    body: article.body || "",
    next_actions: nextActions,
    warning: article.warning ? humanizeRuntimeError(article.warning) : undefined,
    source: article.source || "remote-json"
  });
  res.end();
}

async function runDeepSeek(prompt) {
  if (!deepSeekApiKey) {
    throw new Error("DeepSeek API key is not configured");
  }

  const payload = {
    model,
    messages: [
      {
        role: "system",
        content: [
          siteSystemPrompt,
          "Верни только JSON-объект.",
          "Объект должен содержать поля title, summary, body и next_actions.",
          "next_actions должен быть массивом объектов с label, target и при возможности help."
        ].filter(Boolean).join("\n\n")
      },
      {
        role: "user",
        content: `${prompt}\n\nВерни ответ в JSON.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 1800,
    stream: false
  };

  const response = await postJsonWithCurl(`${deepSeekBaseUrl}/chat/completions`, payload, {
    Authorization: `Bearer ${deepSeekApiKey}`
  });

  const content = response
    && Array.isArray(response.choices)
    && response.choices[0]
    && response.choices[0].message
    ? response.choices[0].message.content
    : "";

  if (!content) {
    throw new Error("DeepSeek returned an empty response");
  }

  const parsed = JSON.parse(content);
  parsed.next_actions = Array.isArray(parsed.next_actions) ? parsed.next_actions : [];
  return parsed;
}

async function runDeepSeekMetadata(graphContext, articleBody) {
  if (!deepSeekApiKey) {
    throw new Error("DeepSeek API key is not configured");
  }

  const response = await postJsonWithCurl(`${deepSeekBaseUrl}/chat/completions`, {
    model,
    messages: [
      {
        role: "system",
        content: [
          siteSystemPrompt,
          "Верни только JSON-объект.",
          "Объект должен содержать title, summary и next_actions.",
          "next_actions должен быть массивом объектов с label, target и при возможности help."
        ].filter(Boolean).join("\n\n")
      },
      {
        role: "user",
        content: `${buildMetadataPrompt(graphContext, articleBody)}\n\nВерни ответ в JSON.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 500,
    stream: false
  }, {
    Authorization: `Bearer ${deepSeekApiKey}`
  });

  const content = response
    && Array.isArray(response.choices)
    && response.choices[0]
    && response.choices[0].message
    ? response.choices[0].message.content
    : "";

  if (!content) {
    throw new Error("DeepSeek returned empty metadata");
  }

  const parsed = JSON.parse(content);
  parsed.next_actions = Array.isArray(parsed.next_actions) ? parsed.next_actions : [];
  return parsed;
}

async function streamDeepSeekArticle(graphContext, res) {
  if (!deepSeekApiKey) {
    throw new Error("DeepSeek API key is not configured");
  }

  const prompt = buildBodyPrompt(graphContext);
  const requestPayload = {
    model,
    messages: [
      {
        role: "system",
        content: [
          siteSystemPrompt,
          "Сейчас нужен только текст статьи без JSON.",
          "Не добавляй кодовые блоки, служебные комментарии и пояснения о процессе."
        ].filter(Boolean).join("\n\n")
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1800,
    stream: true
  };
  let articleBody = "";

  writeStreamHeaders(res);
  writeStreamEvent(res, {
    type: "start",
    title: graphContext.rootAtom.title,
    summary: graphContext.rootAtom.summary || "",
    next_actions: buildSuggestedActions(graphContext),
    status: "Запрашиваю статью у модели..."
  });

  await streamWithCurl(
    `${deepSeekBaseUrl}/chat/completions`,
    requestPayload,
    {
      Authorization: `Bearer ${deepSeekApiKey}`
    },
    (line) => {
      const trimmed = String(line || "").trim();
      if (!trimmed || !trimmed.startsWith("data:")) return;

      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") return;

      let payload;
      try {
        payload = JSON.parse(data);
      } catch (error) {
        return;
      }

      const delta = payload
        && Array.isArray(payload.choices)
        && payload.choices[0]
        && payload.choices[0].delta
        && typeof payload.choices[0].delta.content === "string"
        ? payload.choices[0].delta.content
        : "";

      if (!delta) return;

      articleBody += delta;
      writeStreamEvent(res, {
        type: "delta",
        delta,
        body: articleBody
      });
    }
  );

  writeStreamEvent(res, {
    type: "phase",
    status: "Дошлифовываю заголовок и следующие шаги..."
  });

  let metadata = {
    title: graphContext.rootAtom.title,
    summary: graphContext.rootAtom.summary || "",
    next_actions: buildSuggestedActions(graphContext)
  };

  try {
    const generated = await runDeepSeekMetadata(graphContext, articleBody);
    metadata = {
      title: generated.title || metadata.title,
      summary: generated.summary || metadata.summary,
      next_actions: generated.next_actions && generated.next_actions.length
        ? generated.next_actions
        : metadata.next_actions
    };
    writeStreamEvent(res, Object.assign({ type: "meta" }, metadata));
  } catch (error) {
    writeStreamEvent(res, {
      type: "meta",
      title: metadata.title,
      summary: metadata.summary,
      next_actions: metadata.next_actions,
      warning: error && error.message ? error.message : "Metadata refinement unavailable"
    });
  }

  writeStreamEvent(res, {
    type: "done",
    title: metadata.title,
    summary: metadata.summary,
    body: articleBody,
    next_actions: metadata.next_actions,
    status: "Статья готова"
  });
  res.end();
}

function runCodex(prompt) {
  const outputPath = path.join(rootDir, ".codex-graph-runtime-last.json");
  const args = [
    "exec",
    "--skip-git-repo-check",
    "--output-schema", outputSchemaPath,
    "--output-last-message", outputPath
  ];

  if (model) {
    args.push("--model", model);
  }

  args.push(prompt);

  const result = spawnSync(codexBin, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: "pipe",
    timeout: 240000,
    shell: typeof codexBin === "string" && codexBin.toLowerCase().endsWith(".cmd")
  });

  if (result.status !== 0) {
    const rawMessage = (result.stderr || result.stdout || "codex exec failed").trim();
    const message = rawMessage
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(-8)
      .join(" | ");
    throw new Error(message || "codex exec failed");
  }

  return JSON.parse(fs.readFileSync(outputPath, "utf8"));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    writeJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    writeJson(res, 200, {
      ok: true,
      provider,
      model: model || "codex-cli-default",
      codex_bin: codexBin,
      deepseek_base_url: provider === "deepseek" ? deepSeekBaseUrl : undefined,
      remote_endpoint_base_url: provider === "remote_json" ? remoteGraphRuntimeBaseUrl : undefined
    });
    return;
  }

  if (req.method === "POST" && req.url === "/v1/graph/article") {
    try {
      const body = await readJson(req);
      const graph = loadGraph();
      const atomMap = buildAtomMap(graph);
      const graphContext = collectContext(atomMap, body.atomId, body.trail);
      let article;
      try {
        const prompt = buildPrompt(graphContext);
        if (provider === "deepseek") {
          article = await runDeepSeek(prompt);
        } else if (provider === "remote_json") {
          article = await requestRemoteGraphRuntime(req.url, body);
        } else {
          article = runCodex(prompt);
        }
      } catch (error) {
        console.warn(`[graph-runtime] ${provider} article fallback:`, error && error.stack ? error.stack : error);
        console.warn(`[graph-runtime] ${provider} fallback:`, error && error.message ? error.message : error);
        article = buildFallbackArticle(
          graphContext,
          error && error.message ? error.message : "Runtime model unavailable"
        );
      }
      writeJson(res, 200, article);
    } catch (error) {
      console.error("[graph-runtime] article route failed:", error && error.stack ? error.stack : error);
      writeJson(res, 500, {
        error: error && error.message ? error.message : "Runtime article generation failed"
      });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/v1/graph/article/stream") {
    try {
      const body = await readJson(req);
      const graph = loadGraph();
      const atomMap = buildAtomMap(graph);
      const graphContext = collectContext(atomMap, body.atomId, body.trail);

      try {
        if (provider === "deepseek") {
          await streamDeepSeekArticle(graphContext, res);
        } else if (provider === "remote_json") {
          await streamRemoteArticle(graphContext, body, res);
        } else {
          writeStreamHeaders(res);
          writeStreamEvent(res, {
            type: "start",
            title: graphContext.rootAtom.title,
            summary: graphContext.rootAtom.summary || "",
            next_actions: buildSuggestedActions(graphContext),
            status: "Локальный генератор не поддерживает токен-стрим. Отдаю статью по готовности..."
          });
          const article = runCodex(buildPrompt(graphContext));
          await streamLocalArticle(article, res);
          writeStreamEvent(res, {
            type: "done",
            title: article.title || graphContext.rootAtom.title,
            summary: article.summary || graphContext.rootAtom.summary || "",
            body: article.body || "",
            next_actions: Array.isArray(article.next_actions) ? article.next_actions : buildSuggestedActions(graphContext)
          });
          res.end();
        }
      } catch (error) {
        console.warn("[graph-runtime] deepseek stream fallback:", error && error.message ? error.message : error);
        const fallbackArticle = buildFallbackArticle(
          graphContext,
          error && error.message ? error.message : "Runtime streaming unavailable"
        );
        if (!res.headersSent) {
          writeStreamHeaders(res);
          writeStreamEvent(res, {
            type: "start",
            title: fallbackArticle.title,
            summary: fallbackArticle.summary,
            next_actions: fallbackArticle.next_actions,
            status: "Внешняя модель недоступна, показываю графовый режим..."
          });
          await streamLocalArticle(fallbackArticle, res);
          writeStreamEvent(res, {
            type: "done",
            article: fallbackArticle
          });
          res.end();
          return;
        }

        await streamLocalArticle(fallbackArticle, res);
        writeStreamEvent(res, {
          type: "done",
          article: fallbackArticle
        });
        res.end();
      }
    } catch (error) {
      if (res.headersSent) {
        try {
          writeStreamEvent(res, {
            type: "done",
            article: buildFallbackArticle(
              { rootAtom: { title: "Статья", summary: "" }, context: [] },
              error && error.message ? error.message : "Runtime article streaming failed"
            )
          });
        } catch (streamError) {
          // Ignore secondary write failures on an already-started stream.
        }
        res.end();
        return;
      }
      writeJson(res, 500, {
        error: error && error.message ? error.message : "Runtime article streaming failed"
      });
    }
    return;
  }

  writeJson(res, 404, { error: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Graph runtime server listening on http://${host}:${port}`);
  if (deepSeekResolvedIp) {
    console.log(`DeepSeek forced resolve: api.deepseek.com -> ${deepSeekResolvedIp}`);
  }
});
