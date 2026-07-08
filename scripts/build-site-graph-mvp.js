#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "site_atoms_v12_research_principles");
const sourceDataPath = path.join(sourceDir, "data", "atoms.json");
const sourceAtomsDir = path.join(sourceDir, "atoms");
const sourceHomePath = path.join(sourceDir, "Главная.md");
const contentDir = path.join(rootDir, "content");
const atomsDir = path.join(contentDir, "atoms");
const articlesDir = path.join(contentDir, "articles");
const dataDir = path.join(contentDir, "data");
const graphDataPath = path.join(dataDir, "site-graph.json");
const themeAssetsDir = path.join(rootDir, "theme", "assets");
const publicGraphDataPath = path.join(themeAssetsDir, "site-graph.json");
const homeOutputPath = path.join(contentDir, "home.md");

const hubMeta = [
  {
    id: "products",
    title: "Продукты",
    description: "Продукты и входные действия, через которые пользователь переходит к прикладному разбору.",
  },
  {
    id: "topics",
    title: "Темы",
    description: "Понятия, исследовательские узлы и смысловые темы, через которые удобно входить в граф.",
  },
  {
    id: "methods",
    title: "Методы",
    description: "Подходы, логики и способы разбора, которые можно применить к задаче или ситуации.",
  },
  {
    id: "tools",
    title: "Инструменты",
    description: "Технические и системные опоры: Obsidian, граф знаний, публикация заметок и AI-инструменты.",
  },
  {
    id: "research",
    title: "Исследования",
    description: "Наблюдения, гипотезы, принципы и исследовательские материалы для следующих маршрутов.",
  },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function quote(value) {
  return JSON.stringify(value, null, 0);
}

function readSourceAtomBody(relativeAtomPath) {
  if (!relativeAtomPath) {
    return "";
  }

  const absolutePath = path.join(sourceDir, relativeAtomPath);
  if (!fs.existsSync(absolutePath)) {
    return "";
  }

  return stripFrontmatter(
    fs.readFileSync(absolutePath, "utf8").replace(/\r\n/g, "\n").trim()
  );
}

function stripFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return source;
  }

  const closingIndex = source.indexOf("\n---\n", 4);
  if (closingIndex === -1) {
    return source;
  }

  return source.slice(closingIndex + 5).trim();
}

function normalizeActions(actions) {
  return Array.isArray(actions) ? actions.map((action) => ({
    label: String(action.label || "").trim(),
    target: String(action.target || "").trim(),
    help: String(action.help || "").trim(),
  })).filter((action) => action.label && action.target) : [];
}

function normalizeLinks(links) {
  return Array.isArray(links) ? links.map((link) => ({
    id: String(link.id || "").trim(),
    rel: String(link.rel || "related_to").trim(),
  })).filter((link) => link.id) : [];
}

function findAtomMarkdownPath(entry) {
  if (entry.kind === "hub") {
    const hubPath = path.join(sourceAtomsDir, "_hubs", `${entry.id}.md`);
    if (fs.existsSync(hubPath)) {
      return path.relative(sourceDir, hubPath).replace(/\\/g, "/");
    }
    return "";
  }

  const categories = fs.readdirSync(sourceAtomsDir, { withFileTypes: true })
    .filter((entryDir) => entryDir.isDirectory() && entryDir.name !== "_hubs")
    .map((entryDir) => entryDir.name);

  for (const category of categories) {
    const candidate = path.join(sourceAtomsDir, category, `${entry.id}.md`);
    if (fs.existsSync(candidate)) {
      return path.relative(sourceDir, candidate).replace(/\\/g, "/");
    }
  }

  return "";
}

function bodyFromSource(entry, relativeMarkdownPath) {
  const sourceBody = readSourceAtomBody(relativeMarkdownPath);
  if (sourceBody) {
    return `${sourceBody}\n`;
  }

  const lines = [
    `# ${entry.title}`,
    "",
    entry.summary || "",
  ].filter(Boolean);

  return `${lines.join("\n")}\n`;
}

function outputHubDir(hubId) {
  switch (hubId) {
    case "products":
      return "products";
    case "methods":
      return "methods";
    case "tools":
      return "tools";
    case "research":
      return "research";
    case "topics":
    default:
      return "topics";
  }
}

function toYamlLines(atom) {
  const pageType = atom.kind === "hub" ? "hub" : "article";
  const lines = [
    "---",
    `type: ${pageType}`,
    `id: ${quote(atom.id)}`,
    `title: ${quote(atom.title)}`,
    `slug: ${quote(atom.slug)}`,
    `kind: ${quote(atom.kind)}`,
    `hub: ${quote(atom.hub)}`,
    `summary: ${quote(atom.summary)}`,
    `description: ${quote(atom.summary)}`,
    `status: ${quote(atom.status)}`,
    `lang: ${quote(atom.lang || "ru")}`,
    "links:",
  ];

  atom.links.forEach((link) => {
    lines.push(`  - id: ${quote(link.id)}`);
    lines.push(`    rel: ${quote(link.rel)}`);
  });

  lines.push("actions:");
  atom.actions.forEach((action) => {
    lines.push(`  - label: ${quote(action.label)}`);
    lines.push(`    target: ${quote(action.target)}`);
    if (action.help) {
      lines.push(`    help: ${quote(action.help)}`);
    }
  });

  if (atom.seo && atom.seo.title) {
    lines.push("seo:");
    lines.push(`  title: ${quote(atom.seo.title)}`);
    if (atom.seo.description) {
      lines.push(`  description: ${quote(atom.seo.description)}`);
    }
  }

  lines.push("---", "");
  return lines.join("\n");
}

function collectAtoms() {
  const rawAtoms = JSON.parse(fs.readFileSync(sourceDataPath, "utf8"));

  return rawAtoms.map((entry) => {
    const relativeMarkdownPath = findAtomMarkdownPath(entry);
    const body = bodyFromSource(entry, relativeMarkdownPath);
    const hub = String(entry.hub || "topics");

    return {
      id: entry.id,
      title: entry.title,
      slug: entry.slug || entry.id,
      kind: entry.kind || "concept",
      hub,
      summary: entry.summary || "",
      status: entry.status || "public",
      lang: "ru",
      links: normalizeLinks(entry.links),
      actions: normalizeActions(entry.actions),
      seo: entry.seo || null,
      body,
      sourcePath: relativeMarkdownPath,
      outputPath: path.join(atomsDir, outputHubDir(hub), `${entry.slug || entry.id}.md`),
      url: `/${entry.slug || entry.id}`,
    };
  });
}

function writeAtoms(atoms) {
  fs.rmSync(atomsDir, { recursive: true, force: true });
  ensureDir(atomsDir);

  atoms.forEach((atom) => {
    const content = `${toYamlLines(atom)}${atom.body}`;
    writeFile(atom.outputPath, content);
  });
}

function writePlaceholders() {
  writeFile(path.join(articlesDir, "ru", ".gitkeep"), "");
  writeFile(path.join(articlesDir, "en", ".gitkeep"), "");
}

function buildGraphIndex(atoms) {
  const contentAtoms = atoms.filter((atom) => atom.kind !== "hub");
  const counts = contentAtoms.reduce((acc, atom) => {
    acc[atom.hub] = (acc[atom.hub] || 0) + 1;
    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    generator: {
      source: "site_atoms_v12_research_principles",
      textModel: "deepseek-v4-flash",
      promptFile: "content/prompts/system-prompt.md",
    },
    hubs: hubMeta.map((hub) => ({
      ...hub,
      count: counts[hub.id] || 0,
      atoms: contentAtoms
        .filter((atom) => atom.hub === hub.id)
        .map((atom) => ({
          id: atom.id,
          title: atom.title,
          slug: atom.slug,
          kind: atom.kind,
          summary: atom.summary,
        })),
    })),
    atoms: contentAtoms.map((atom) => ({
      id: atom.id,
      title: atom.title,
      slug: atom.slug,
      kind: atom.kind,
      hub: atom.hub,
      summary: atom.summary,
      status: atom.status,
      lang: atom.lang,
      url: atom.url,
      links: atom.links,
      actions: atom.actions,
      seo: atom.seo || undefined,
    })),
  };
}

function writeHomeMarkdown() {
  const sourceHome = stripFrontmatter(
    fs.readFileSync(sourceHomePath, "utf8").replace(/\r\n/g, "\n").trim()
  );
  const graphEndpoint = process.env.GRAPH_ENDPOINT || defaultGraphEndpoint();
  const graphStreamEndpoint = process.env.GRAPH_STREAM_ENDPOINT || defaultGraphStreamEndpoint(graphEndpoint);
  const frontmatter = [
    "---",
    "type: home",
    "title: Антон Ложкин",
    "slug: home",
    "description: Главная страница как интерфейс к графу знаний о продуктах, темах, методах, инструментах и исследованиях",
    "draft: false",
    "noindex: false",
    "image: /media/main.webp",
    `graph_endpoint: ${quote(graphEndpoint)}`,
    ...(graphStreamEndpoint ? [`graph_stream_endpoint: ${quote(graphStreamEndpoint)}`] : []),
    "---",
    "",
  ].join("\n");

  writeFile(homeOutputPath, `${frontmatter}${sourceHome}\n`);
}

function defaultGraphEndpoint() {
  return "https://functions.yandexcloud.net/d4eqlv2pdrq0ckas1eq6";
}

function defaultGraphStreamEndpoint(graphEndpoint) {
  if (!graphEndpoint) {
    return "";
  }

  try {
    const url = new URL(graphEndpoint);
    if (
      url.protocol === "https:" &&
      url.hostname === "functions.yandexcloud.net" &&
      url.pathname === "/d4eqlv2pdrq0ckas1eq6"
    ) {
      return "wss://d5dldktr6e9jr03hm045.nkhmighe.apigw.yandexcloud.net/ws";
    }
  } catch (_error) {
    return "";
  }

  return inferStreamEndpoint(graphEndpoint);
}

function inferStreamEndpoint(graphEndpoint) {
  if (!graphEndpoint) {
    return "";
  }

  try {
    const url = new URL(graphEndpoint);
    if (url.pathname === "/v1/graph/article") {
      url.pathname = "/v1/graph/article/stream";
      return url.toString();
    }
  } catch (_error) {
    return "";
  }

  return "";
}

function main() {
  fs.rmSync(atomsDir, { recursive: true, force: true });
  fs.rmSync(dataDir, { recursive: true, force: true });
  fs.rmSync(path.join(contentDir, "prompts"), { recursive: true, force: true });
  fs.rmSync(path.join(contentDir, "routes"), { recursive: true, force: true });
  ensureDir(atomsDir);
  ensureDir(dataDir);

  const atoms = collectAtoms();
  writeAtoms(atoms);
  writePlaceholders();
  writeHomeMarkdown();

  const graphIndex = buildGraphIndex(atoms);
  writeFile(graphDataPath, `${JSON.stringify(graphIndex, null, 2)}\n`);
  writeFile(publicGraphDataPath, `${JSON.stringify(graphIndex, null, 2)}\n`);

  console.log(`Generated ${atoms.filter((atom) => atom.kind !== "hub").length} atoms into ${path.relative(rootDir, atomsDir)}`);
  console.log(`Wrote graph index to ${path.relative(rootDir, graphDataPath)}`);
  console.log(`Published graph index to ${path.relative(rootDir, publicGraphDataPath)}`);
  console.log(`Updated home page from ${path.relative(rootDir, sourceHomePath)}`);
}

main();
