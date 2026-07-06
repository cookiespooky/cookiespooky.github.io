---
type: article
id: "ai-dev-workflow"
title: "AI-dev workflow"
slug: "ai-dev-workflow"
kind: "method"
hub: "methods"
summary: "AI-dev workflow — порядок работы, в котором человек формулирует цель, готовит контекст, модель меняет код, а результат проверяется короткими итерациями."
description: "AI-dev workflow — порядок работы, в котором человек формулирует цель, готовит контекст, модель меняет код, а результат проверяется короткими итерациями."
status: "public"
lang: "ru"
links:
  - id: "vibe-coding"
    rel: "explains"
  - id: "context-package"
    rel: "uses"
  - id: "prompt-brief"
    rel: "uses"
  - id: "technical-spec-from-idea"
    rel: "starts_with"
  - id: "ai-assisted-refactoring"
    rel: "includes"
  - id: "lead-ai-mvp-build"
    rel: "leads_to"
actions:
  - label: "Посмотреть структуру задачи"
    target: "prompt-brief"
    help: "Поможет понять, какие данные нужны модели для точной разработки."
  - label: "Обсудить AI-MVP"
    target: "lead-ai-mvp-build"
    help: "Поможет собрать первый проход разработки без лишней архитектурной магии."
---
# AI-dev workflow

AI-dev workflow — порядок работы, в котором человек формулирует цель, готовит контекст, модель меняет код, а результат проверяется короткими итерациями.

Связанные элементы графа: [[vibe-coding]], [[context-package]], [[prompt-brief]], [[technical-spec-from-idea]], [[ai-assisted-refactoring]], [[lead-ai-mvp-build]].

## Связи

- [[vibe-coding]] — explains
- [[context-package]] — uses
- [[prompt-brief]] — uses
- [[technical-spec-from-idea]] — starts_with
- [[ai-assisted-refactoring]] — includes
- [[lead-ai-mvp-build]] — leads_to

## Следующие действия

- **Посмотреть структуру задачи** → [[prompt-brief]]: Поможет понять, какие данные нужны модели для точной разработки.
- **Обсудить AI-MVP** → [[lead-ai-mvp-build]]: Поможет собрать первый проход разработки без лишней архитектурной магии.
