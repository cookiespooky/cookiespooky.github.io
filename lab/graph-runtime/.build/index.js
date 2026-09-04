"use strict";

const fs = require("node:fs");
const path = require("node:path");

const graphPath = resolveReadablePath(
  path.join(__dirname, "data", "site-graph.json"),
  path.join(__dirname, "..", "..", "theme", "assets", "site-graph.json")
);
const systemPromptPath = resolveReadablePath(
  path.join(__dirname, "prompts", "system-prompt.md"),
  path.join(__dirname, "..", "..", "atom_site_v5", "prompts", "system-prompt.md"),
  path.join(__dirname, "..", "..", "site_atoms_v12_research_principles", "prompts", "system-prompt.md")
);

const provider = process.env.GRAPH_RUNTIME_PROVIDER || "deepseek";
const model = process.env.GRAPH_RUNTIME_MODEL || "deepseek-v4-flash";
const deepSeekBaseUrl = (process.env.DEEPSEEK_API_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
const deepSeekApiKey = process.env.DEEPSEEK_API_KEY || "";
const requestTimeoutMs = Number(process.env.GRAPH_RUNTIME_REQUEST_TIMEOUT_MS || 20000);
const websocketSendBaseUrl = process.env.GRAPH_RUNTIME_WS_SEND_BASE_URL || "https://apigateway-connections.api.cloud.yandex.net/apigateways/websocket/v1";
const metadataTokenUrl = "http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token";

const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
const siteSystemPrompt = fs.readFileSync(systemPromptPath, "utf8").trim();
const atomMap = buildAtomMap(graph);

function resolveReadablePath(...candidatePaths) {
  for (const candidatePath of candidatePaths) {
    if (candidatePath && fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }
  return candidatePaths[candidatePaths.length - 1];
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "600",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function jsonResponse(statusCode, payload, origin) {
  return {
    statusCode,
    headers: corsHeaders(origin),
    isBase64Encoded: false,
    body: JSON.stringify(payload)
  };
}

function emptyTextResponse(statusCode) {
  return {
    statusCode,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    },
    isBase64Encoded: false,
    body: ""
  };
}

function parseEventBody(event) {
  if (!event || !event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  return raw ? JSON.parse(raw) : {};
}

function parseRawEventBody(event) {
  if (!event || !event.body) return "";
  return event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : String(event.body || "");
}

function buildAtomMap(graphObject) {
  return new Map((graphObject.atoms || []).map((atom) => [atom.id, atom]));
}

function collectContext(atomLookup, atomId, trail) {
  const rootAtom = atomLookup.get(atomId);
  if (!rootAtom) {
    throw new Error(`Unknown atom: ${atomId}`);
  }

  const queue = [{ id: atomId, depth: 0 }];
  const seen = new Set([atomId]);
  const context = [];

  while (queue.length && context.length < 12) {
    const current = queue.shift();
    const atom = atomLookup.get(current.id);
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
      if (seen.has(nextId) || !atomLookup.has(nextId)) return;
      seen.add(nextId);
      queue.push({ id: nextId, depth: current.depth + 1 });
    });
  }

  return {
    rootAtom,
    trail: (trail || [])
      .map((id) => atomLookup.get(id))
      .filter(Boolean)
      .map((atom) => ({
        id: atom.id,
        title: atom.title,
        kind: atom.kind,
        summary: atom.summary
      })),
    context
  };
}

function buildBodyPrompt(graphContext) {
  const rootAtom = graphContext.rootAtom;
  const isLeadAtom = rootAtom.id.startsWith("lead-") || rootAtom.kind === "action" || rootAtom.kind === "lead_action";
  const trailText = graphContext.trail.length
    ? graphContext.trail.map((atom) => `${atom.title} (${atom.id})`).join(" -> ")
    : "стартовый переход без предыдущего маршрута";

  const promptLines = [
    "Ты пишешь основную статью для главной страницы сайта-интерфейса к графу знаний.",
    "Пиши на русском языке.",
    "Нужен цельный материал длиной примерно 1000-2000 знаков.",
    "Пиши живо, плотно, без рекламной воды, без вводных про то, что это статья.",
    "Используй только абзацы и при необходимости подзаголовки вида ##.",
    "Внутри текста используй только ссылки вида [[atom_id|Текст ссылки]].",
    "Используй только atom_id, которые реально есть в переданном контексте.",
    "Не добавляй списки в конце и не добавляй JSON.",
    "В конце статьи обязательно добавь короткое приглашение написать в личку Telegram со ссылкой [Написать в Telegram](https://t.me/cookiespooky).",
    "Приглашение должно продолжать смысл статьи и объяснять, с чем именно можно прийти в личку по этой теме.",
    "",
    `Текущий атом: ${rootAtom.title} (${rootAtom.id})`,
    `Тип: ${rootAtom.kind}`,
    `Хаб: ${rootAtom.hub}`,
    `Краткое описание: ${rootAtom.summary}`,
    `Маршрут пользователя: ${trailText}`,
    "",
    "Подграф для статьи:",
    JSON.stringify(graphContext.context, null, 2)
  ];

  if (isLeadAtom) {
    promptLines.splice(8, 0,
      "Это лидовый атом.",
      "Не пиши обзорную статью про тему; пиши материал, который ведет к личной консультации с автором.",
      "Объясни, кому подходит этот разбор, что именно будет разобрано и какая ясность появится после консультации.",
      "В финальном абзаце обязательно дай явный CTA с markdown-ссылкой [Написать в Telegram](https://t.me/cookiespooky).",
      "Тон спокойный, точный, без давления и без рекламного шума."
    );
  }

  return promptLines.join("\n");
}

function buildTelegramInvite(graphContext) {
  const rootAtom = graphContext.rootAtom || {};
  const title = rootAtom.title || "эту тему";
  const lowerTitle = String(title).toLowerCase();
  const isLeadAtom = String(rootAtom.id || "").startsWith("lead-") || rootAtom.kind === "action" || rootAtom.kind === "lead_action";

  if (isLeadAtom) {
    return `Если хотите разобрать именно вашу ситуацию по теме «${title}» и превратить ее в понятный следующий шаг, напишите в [личку Telegram](https://t.me/cookiespooky).`;
  }

  switch (rootAtom.hub) {
    case "products":
      return `Если хотите понять, подходит ли вам ${lowerTitle} и как применить это к вашему проекту без лишней сборки, напишите в [личку Telegram](https://t.me/cookiespooky).`;
    case "methods":
      return `Если хотите применить ${lowerTitle} к своей ситуации и собрать из этого рабочий разбор, напишите в [личку Telegram](https://t.me/cookiespooky).`;
    case "tools":
      return `Если хотите встроить ${lowerTitle} в свою систему заметок, публикации или AI-работы без лишней сложности, напишите в [личку Telegram](https://t.me/cookiespooky).`;
    case "research":
      return `Если хотите связать идею «${title}» со своей задачей, продуктом или исследованием и понять, куда двигаться дальше, напишите в [личку Telegram](https://t.me/cookiespooky).`;
    case "topics":
    default:
      return `Если хотите разобрать, как тема «${title}» проявляется именно в вашем проекте, продукте или текущей ситуации, напишите в [личку Telegram](https://t.me/cookiespooky).`;
  }
}

function ensureTelegramInvite(graphContext, articleBody) {
  const body = String(articleBody || "").trim();
  if (!body) {
    return buildTelegramInvite(graphContext);
  }
  if (/t\.me\/cookiespooky/i.test(body) || /\[Написать в Telegram\]\(https:\/\/t\.me\/cookiespooky\)/i.test(body)) {
    return body;
  }
  return `${body}\n\n${buildTelegramInvite(graphContext)}`;
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

function buildSuggestedActions(graphContext) {
  return graphContext.context
    .filter((atom) => atom.id !== graphContext.rootAtom.id)
    .slice(0, 4)
    .map((atom) => ({
      label: `Перейти к ${atom.title}`,
      target: atom.id
    }));
}

function buildFallbackArticle(graphContext, reason) {
  const rootAtom = graphContext.rootAtom;
  const relatedAtoms = graphContext.context.filter((atom) => atom.id !== rootAtom.id).slice(0, 5);
  const relatedText = relatedAtoms.length
    ? relatedAtoms.map((atom) => `[[${atom.id}|${atom.title}]]`).join(", ")
    : "соседних атомов в текущем контексте пока нет";

  return {
    title: rootAtom.title,
    summary: rootAtom.summary || "Черновой режим по графу атомов.",
    body: ensureTelegramInvite(graphContext, [
      `## ${rootAtom.title}`,
      rootAtom.summary || `${rootAtom.title} пока описан кратко, поэтому статья собрана из доступного графового контекста.`,
      "",
      "Внешняя модель сейчас недоступна, поэтому этот материал собран напрямую из локального подграфа.",
      "",
      `Чтобы продолжить маршрут осмысленно, имеет смысл перейти к связанным понятиям: ${relatedText}.`
    ].join("\n")),
    next_actions: buildSuggestedActions(graphContext),
    source: "fallback",
    warning: reason
  };
}

function extractJsonObject(raw) {
  if (!raw || typeof raw !== "string") return null;
  const fenced = raw.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = candidate.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch (_error) {
    return null;
  }
}

async function postJson(url, payload, headers) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: Object.assign({
        "Content-Type": "application/json"
      }, headers || {}),
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const rawText = await response.text();
    let parsed;

    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch (_error) {
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
  } finally {
    clearTimeout(timeout);
  }
}

async function postStream(url, payload, headers) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: Object.assign({
        "Content-Type": "application/json"
      }, headers || {}),
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok || !response.body) {
      const rawText = await response.text();
      let parsed;
      try {
        parsed = rawText ? JSON.parse(rawText) : {};
      } catch (_error) {
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
  } finally {
    clearTimeout(timeout);
  }
}

async function streamResponseLines(response, onLine) {
  if (!response.body) {
    throw new Error("Streaming response body is missing");
  }

  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  if (typeof response.body.getReader === "function") {
    const reader = response.body.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";
      for (const line of lines) {
        onLine(line);
      }
    }
    buffer += decoder.decode();
  } else {
    for await (const chunk of response.body) {
      buffer += typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";
      for (const line of lines) {
        onLine(line);
      }
    }
    buffer += decoder.decode();
  }

  if (buffer.trim()) {
    onLine(buffer.trim());
  }
}

async function runDeepSeekBody(prompt) {
  if (!deepSeekApiKey) {
    throw new Error("DeepSeek API key is not configured");
  }

  const response = await postJson(`${deepSeekBaseUrl}/chat/completions`, {
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
    thinking: { type: "disabled" },
    temperature: 0.6,
    max_tokens: 1800,
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
    throw new Error("DeepSeek returned an empty response");
  }

  return String(content).trim();
}

async function runDeepSeekMetadata(graphContext, articleBody) {
  if (!deepSeekApiKey) {
    throw new Error("DeepSeek API key is not configured");
  }

  const response = await postJson(`${deepSeekBaseUrl}/chat/completions`, {
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
    thinking: { type: "disabled" },
    response_format: { type: "json_object" },
    temperature: 0.3,
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

  const parsed = extractJsonObject(content);
  if (!parsed) {
    throw new Error("DeepSeek metadata JSON is invalid");
  }
  parsed.next_actions = Array.isArray(parsed.next_actions) ? parsed.next_actions : [];
  return parsed;
}

async function getIamToken(context) {
  if (context && typeof context.access_token === "string" && context.access_token) {
    return context.access_token;
  }

  const response = await fetch(metadataTokenUrl, {
    headers: {
      "Metadata-Flavor": "Google"
    }
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch IAM token: HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!payload || !payload.access_token) {
    throw new Error("Metadata service returned no access token");
  }

  return payload.access_token;
}

function websocketHeader(event, name) {
  const headers = event && event.headers ? event.headers : {};
  const target = String(name || "").toLowerCase();
  for (const key of Object.keys(headers)) {
    if (String(key).toLowerCase() === target) {
      return headers[key];
    }
  }
  return "";
}

function websocketEventType(event) {
  const fromRequestContext = event && event.requestContext && event.requestContext.eventType
    ? event.requestContext.eventType
    : "";
  return String(fromRequestContext || websocketHeader(event, "X-Yc-Apigateway-Websocket-Event-Type") || "").toUpperCase();
}

function websocketConnectionId(event) {
  const fromRequestContext = event && event.requestContext && event.requestContext.connectionId
    ? event.requestContext.connectionId
    : "";
  return String(fromRequestContext || websocketHeader(event, "X-Yc-Apigateway-Websocket-Connection-Id") || "");
}

async function sendWsPayload(connectionId, payload, context) {
  if (!connectionId) {
    throw new Error("Missing websocket connection id");
  }

  const token = await getIamToken(context);
  const response = await fetch(`${websocketSendBaseUrl}/connections/${encodeURIComponent(connectionId)}:send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "TEXT",
      data: Buffer.from(JSON.stringify(payload), "utf8").toString("base64")
    })
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(`WebSocket send failed: HTTP ${response.status}${raw ? ` ${raw}` : ""}`);
  }
}

async function streamDeepSeekArticleWs(graphContext, connectionId, context, requestId) {
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
    thinking: { type: "disabled" },
    temperature: 0.7,
    max_tokens: 1800,
    stream: true
  };

  let articleBody = "";
  let sendQueue = Promise.resolve();
  function queueWsPayload(payload) {
    sendQueue = sendQueue.then(() => sendWsPayload(connectionId, payload, context));
    return sendQueue;
  }

  await queueWsPayload({
    type: "start",
    request_id: requestId || "",
    title: graphContext.rootAtom.title,
    summary: graphContext.rootAtom.summary || "",
    next_actions: buildSuggestedActions(graphContext),
    status: "Запрашиваю статью у модели..."
  });

  const response = await postStream(`${deepSeekBaseUrl}/chat/completions`, requestPayload, {
    Authorization: `Bearer ${deepSeekApiKey}`
  });

  await streamResponseLines(response, (line) => {
    const trimmed = String(line || "").trim();
    if (!trimmed || !trimmed.startsWith("data:")) return;

    const data = trimmed.slice(5).trim();
    if (!data || data === "[DONE]") return;

    let payload;
    try {
      payload = JSON.parse(data);
    } catch (_error) {
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
    queueWsPayload({
      type: "delta",
      request_id: requestId || "",
      delta,
      body: articleBody
    });
  });

  await sendQueue;
  const articleBodyWithInvite = ensureTelegramInvite(graphContext, articleBody);
  if (articleBodyWithInvite !== articleBody) {
    await queueWsPayload({
      type: "delta",
      request_id: requestId || "",
      delta: articleBodyWithInvite.slice(articleBody.length),
      body: articleBodyWithInvite
    });
    articleBody = articleBodyWithInvite;
  }
  await queueWsPayload({
    type: "phase",
    request_id: requestId || "",
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
    await queueWsPayload(Object.assign({
      type: "meta",
      request_id: requestId || ""
    }, metadata));
  } catch (error) {
    await queueWsPayload({
      type: "meta",
      request_id: requestId || "",
      title: metadata.title,
      summary: metadata.summary,
      next_actions: metadata.next_actions,
      warning: error && error.message ? error.message : "Metadata refinement unavailable"
    });
  }

  await queueWsPayload({
    type: "done",
    request_id: requestId || "",
    title: metadata.title,
    summary: metadata.summary,
    body: articleBody,
    next_actions: metadata.next_actions,
    status: "Статья готова"
  });
}

async function buildArticle(graphContext) {
  if (provider !== "deepseek") {
    return buildFallbackArticle(graphContext, `Unsupported provider: ${provider}`);
  }

  const articleBody = ensureTelegramInvite(
    graphContext,
    await runDeepSeekBody(buildBodyPrompt(graphContext))
  );
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
  } catch (metadataError) {
    metadata.warning = metadataError && metadataError.message
      ? metadataError.message
      : "Metadata refinement unavailable";
  }

  return {
    title: metadata.title,
    summary: metadata.summary,
    body: articleBody,
    next_actions: metadata.next_actions,
    warning: metadata.warning
  };
}

module.exports.handler = async function handler(event, context) {
  const origin = event && event.headers
    ? event.headers.origin || event.headers.Origin || "*"
    : "*";
  const wsEvent = websocketEventType(event);

  if (wsEvent === "CONNECT" || wsEvent === "DISCONNECT") {
    return emptyTextResponse(200);
  }

  if (wsEvent === "MESSAGE") {
    const connectionId = websocketConnectionId(event);
    try {
      const rawBody = parseRawEventBody(event);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      if (payload.type !== "generate_article") {
        return emptyTextResponse(200);
      }

      const graphContext = collectContext(atomMap, payload.atomId, payload.trail);

      try {
        await streamDeepSeekArticleWs(graphContext, connectionId, context, payload.request_id || payload.requestId || "");
      } catch (error) {
        const fallbackArticle = buildFallbackArticle(
          graphContext,
          error && error.message ? error.message : "Runtime streaming unavailable"
        );
        await sendWsPayload(connectionId, {
          type: "done",
          request_id: payload.request_id || payload.requestId || "",
          article: fallbackArticle
        }, context);
      }

      return emptyTextResponse(200);
    } catch (error) {
      try {
        await sendWsPayload(connectionId, {
          type: "done",
          error: error && error.message ? error.message : "Runtime article streaming failed"
        }, context);
      } catch (_sendError) {
        // Ignore secondary websocket send failure.
      }
      return emptyTextResponse(200);
    }
  }

  const method = String(event && event.httpMethod || "GET").toUpperCase();

  if (method === "OPTIONS") {
    return jsonResponse(200, { ok: true }, origin);
  }

  if (method === "GET") {
    return jsonResponse(200, {
      ok: true,
      provider,
      model,
      atoms: graph.atoms ? graph.atoms.length : 0,
      hubs: graph.hubs ? graph.hubs.length : 0
    }, origin);
  }

  if (method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, origin);
  }

  try {
    const body = parseEventBody(event);
    const graphContext = collectContext(atomMap, body.atomId, body.trail);
    let article;

    try {
      article = await buildArticle(graphContext);
    } catch (error) {
      article = buildFallbackArticle(
        graphContext,
        error && error.message ? error.message : "Runtime model unavailable"
      );
    }

    return jsonResponse(200, article, origin);
  } catch (error) {
    return jsonResponse(500, {
      error: error && error.message ? error.message : "Runtime article generation failed"
    }, origin);
  }
};
