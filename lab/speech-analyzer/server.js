"use strict";

// Анализатор речи как обычная служба на своём сервере — тот же handler, что у функции в Yandex Cloud (index.js),
// обёрнутый в http-сервер без зависимостей. Появился 2026-10-12, когда Yandex Cloud перестал отвечать.
// Слушает только 127.0.0.1: наружу его отдаёт nginx сайта assistant по адресу /analiz-rechi (deploy-server.sh).
// Записи в YDB здесь нет (DOCAPI_ENDPOINT не задан) и фразы посетителей в журнал не пишутся — только длина и исход.

const http = require("node:http");
const { handler } = require("./index.js");

const PORT = Number(process.env.PORT || 8097);
const PER_IP_HOUR = Number(process.env.PER_IP_HOUR || 20);   // на публичном адресе платный ключ: те же числа, что у ассистента
const PER_DAY = Number(process.env.PER_DAY || 300);
const MAX_BODY = 4096;

const byIp = new Map();
let day = { key: "", n: 0 };

function allowed(ip) {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  if (day.key !== today) day = { key: today, n: 0 };
  if (day.n >= PER_DAY) return "day";
  const hits = (byIp.get(ip) || []).filter((t) => now - t < 3600e3);
  if (hits.length >= PER_IP_HOUR) { byIp.set(ip, hits); return "ip"; }
  hits.push(now); byIp.set(ip, hits); day.n++;
  if (byIp.size > 5000) for (const [k, v] of byIp) if (!v.some((t) => now - t < 3600e3)) byIp.delete(k);
  return "";
}

function send(res, out) {
  res.writeHead(out.statusCode, out.headers);
  res.end(out.body || "");
}

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json; charset=utf-8"
  };
}

http.createServer((req, res) => {
  const origin = req.headers.origin || "*";
  const ip = String(req.headers["x-real-ip"] || req.socket.remoteAddress || "");
  if (req.method === "GET") { send(res, { statusCode: 200, headers: cors(origin), body: JSON.stringify({ ok: true }) }); return; }

  let size = 0;
  const chunks = [];
  req.on("data", (c) => {
    size += c.length;
    if (size > MAX_BODY) { send(res, { statusCode: 413, headers: cors(origin), body: JSON.stringify({ error: "Body is too large" }) }); req.destroy(); return; }
    chunks.push(c);
  });
  req.on("end", async () => {
    if (res.writableEnded) return;
    if (req.method === "POST") {
      const why = allowed(ip);
      if (why) {
        console.log(`limit ${why}`);
        send(res, { statusCode: 429, headers: cors(origin), body: JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }) });
        return;
      }
    }
    const body = Buffer.concat(chunks).toString("utf8");
    try {
      const out = await handler({ httpMethod: req.method, headers: req.headers, body });
      if (req.method === "POST") console.log(`analyze ${out.statusCode} len=${body.length}`);
      send(res, out);
    } catch (err) {
      console.error("handler failed:", err && err.message ? err.message : err);
      send(res, { statusCode: 500, headers: cors(origin), body: JSON.stringify({ error: "Internal error" }) });
    }
  });
}).listen(PORT, "127.0.0.1", () => console.log(`speech-analyzer on 127.0.0.1:${PORT}`));
