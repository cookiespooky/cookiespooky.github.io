#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const graphPath = path.join(rootDir, "content", "data", "site-graph.json");
const narrativesPath = path.join(rootDir, "content", "data", "graph-narratives.json");

function parseArgs(argv) {
  const atomsArg = argv.find((arg) => arg.startsWith("--atoms="));
  const modelArg = argv.find((arg) => arg.startsWith("--model="));
  const atoms = atomsArg ? atomsArg.slice("--atoms=".length).split(",").map((item) => item.trim()).filter(Boolean) : [];
  const model = modelArg ? modelArg.slice("--model=".length).trim() : "";
  return { atoms, model };
}

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function buildPrompt(atom, relatedAtoms) {
  return [
    "Сгенерируй краткое объяснение для главной страницы сайта как интерфейса к графу знаний.",
    "Ответь строго JSON-объектом без markdown-обертки.",
    'Формат: {"sections":["абзац 1","абзац 2","абзац 3"]}.',
    "Требования:",
    "- Пиши по-русски.",
    "- 2-3 коротких абзаца.",
    "- Без рекламной воды и без списка.",
    "- Объясни сущность, ее место в графе и почему пользователю логично идти в связанные понятия.",
    "- Не используй кавычки-елочки и не добавляй поля кроме sections.",
    "",
    `Атом: ${atom.title}`,
    `ID: ${atom.id}`,
    `Хаб: ${atom.hub}`,
    `Тип: ${atom.kind}`,
    `Summary: ${atom.summary}`,
    "Связанные атомы:",
    ...relatedAtoms.map((related) => `- ${related.title}: ${related.summary}`),
  ].join("\n");
}

function runCodex(prompt, model) {
  const outputPath = path.join(rootDir, ".codex-last-graph-narrative.json");
  const args = ["exec", "--skip-git-repo-check", "--output-last-message", outputPath];

  if (model) {
    args.push("--model", model);
  }

  args.push(prompt);

  const result = spawnSync("codex", args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "codex exec failed");
  }

  const raw = fs.readFileSync(outputPath, "utf8").trim();
  return JSON.parse(raw);
}

function main() {
  const { atoms: requestedAtoms, model } = parseArgs(process.argv.slice(2));
  const graph = loadJson(graphPath, null);
  if (!graph) {
    throw new Error("site-graph.json not found. Run build-site-graph-mvp.js first.");
  }

  const narratives = loadJson(narrativesPath, {
    generatedAt: null,
    generator: { source: "codex-cli", plannedReplacement: "deepseek" },
    narratives: {},
  });

  const atomMap = new Map(graph.atoms.map((atom) => [atom.id, atom]));
  const atomsToGenerate = (requestedAtoms.length ? requestedAtoms : graph.atoms.map((atom) => atom.id))
    .map((id) => atomMap.get(id))
    .filter(Boolean);

  atomsToGenerate.forEach((atom) => {
    const relatedAtoms = (atom.links || [])
      .map((link) => atomMap.get(link.id))
      .filter(Boolean)
      .slice(0, 4);

    const payload = runCodex(buildPrompt(atom, relatedAtoms), model);
    narratives.narratives[atom.id] = {
      generatedAt: new Date().toISOString(),
      model: model || "codex-cli-default",
      sections: Array.isArray(payload.sections) ? payload.sections : [],
    };
    console.log(`Generated narrative for ${atom.id}`);
  });

  narratives.generatedAt = new Date().toISOString();
  narratives.generator = {
    source: "codex-cli",
    plannedReplacement: "deepseek",
    model: model || "codex-cli-default",
  };

  saveJson(narrativesPath, narratives);
}

main();
