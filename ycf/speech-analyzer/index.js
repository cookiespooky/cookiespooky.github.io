"use strict";

const REQUIRED_FILTERS = [
  "neutral",
  "direct",
  "radical",
  "aggressive",
  "toxic"
];

const FILTER_METADATA = {
  neutral: { label: "Нейтральный", irritabilityLevel: 10 },
  direct: { label: "Прямолинейный", irritabilityLevel: 30 },
  radical: { label: "Радикальный", irritabilityLevel: 55 },
  aggressive: { label: "Агрессивный", irritabilityLevel: 78 },
  toxic: { label: "Токсичный", irritabilityLevel: 95 }
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "600",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function jsonResponse(statusCode, body, origin) {
  return {
    statusCode,
    headers: corsHeaders(origin),
    body: JSON.stringify(body)
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
  } catch (_err) {
    return null;
  }
}

function normalizeResponse(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("DeepSeek returned invalid JSON");
  }

  const out = {};

  for (const key of REQUIRED_FILTERS) {
    const node = parsed[key];
    if (!node || typeof node !== "object") {
      throw new Error(`Missing filter block: ${key}`);
    }

    const objectiveText = String(node.objective_text || "").trim();
    const agencyAnalysis = String(node.agency_analysis || "").trim();

    if (!objectiveText) {
      throw new Error(`Missing objective_text for ${key}`);
    }

    out[key] = {
      ...FILTER_METADATA[key],
      key,
      objective_text: objectiveText,
      agency_analysis: agencyAnalysis
    };
  }

  return out;
}

async function analyzeWithDeepSeek(text, apiKey) {
  const systemPrompt = [
    "Ты лингвистический аналитик агентности высказывания.",
    "Твоя задача: проанализировать исходную фразу и дать 5 версий переформулировки на более объективный язык.",
    "Сохраняй факты исходного сообщения, убирай когнитивные искажения, ярлыки, чтение мыслей и эмоциональные обобщения.",
    "Ответ строго в JSON без пояснений и без markdown.",
    "Формат JSON:",
    "{",
    "  \"neutral\": { \"objective_text\": string, \"agency_analysis\": string },",
    "  \"direct\": { \"objective_text\": string, \"agency_analysis\": string },",
    "  \"radical\": { \"objective_text\": string, \"agency_analysis\": string },",
    "  \"aggressive\": { \"objective_text\": string, \"agency_analysis\": string },",
    "  \"toxic\": { \"objective_text\": string, \"agency_analysis\": string }",
    "}",
    "Требования к стилям:",
    "neutral: максимально спокойный, фактический, без оценок.",
    "direct: коротко и прямо, но без оскорблений.",
    "radical: предельно жесткая деконструкция самообмана, но в рамках анализа.",
    "aggressive: резкий, конфронтационный тон без прямых угроз.",
    "toxic: намеренно провокационный и манипулятивный тон (как антипример).",
    "agency_analysis: 1-2 предложения о том, где в исходной фразе снимается ответственность и как вернуть субъектность."
  ].join("\n");

  const payload = {
    model: "deepseek-chat",
    temperature: 0.5,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          "Исходная фраза для анализа:",
          text,
          "",
          "Сгенерируй все 5 фильтров сразу."
        ].join("\n")
      }
    ],
    response_format: {
      type: "json_object"
    }
  };

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data && data.error && data.error.message) ||
      `DeepSeek error (${response.status})`;
    throw new Error(message);
  }

  const content =
    data &&
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;

  const parsed = extractJsonObject(content);
  return normalizeResponse(parsed);
}

module.exports.handler = async function handler(event) {
  const headers = event.headers || {};
  const origin = headers.origin || headers.Origin || "*";
  const method = (event.httpMethod || "POST").toUpperCase();

  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(origin),
      body: ""
    };
  }

  if (method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, origin);
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "DEEPSEEK_API_KEY is not set" }, origin);
  }

  let parsedBody;
  try {
    parsedBody = event.body ? JSON.parse(event.body) : {};
  } catch (_err) {
    return jsonResponse(400, { error: "Invalid JSON body" }, origin);
  }

  const text = String(parsedBody.text || "").trim();
  if (!text) {
    return jsonResponse(400, { error: "Field 'text' is required" }, origin);
  }
  if (text.length > 500) {
    return jsonResponse(400, { error: "Text must be 500 characters or less" }, origin);
  }

  try {
    const results = await analyzeWithDeepSeek(text, apiKey);
    return jsonResponse(200, { results }, origin);
  } catch (err) {
    return jsonResponse(502, {
      error: "DeepSeek request failed",
      details: err && err.message ? err.message : "Unknown error"
    }, origin);
  }
};
