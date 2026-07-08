---
type: article
id: "codex"
title: "Codex"
slug: "codex"
kind: "tool"
hub:
  - "tools"
summary: "Codex — рабочий инструмент для разработки через модель: чтение репозитория, изменение кода, генерация файлов, рефакторинг и сборка прототипов под контролем человека."
description: "Codex — рабочий инструмент для разработки через модель: чтение репозитория, изменение кода, генерация файлов, рефакторинг и сборка прототипов под контролем человека."
status: "public"
lang: "ru"
links:
  - id: "vibe-coding"
    rel: "used_by"
  - id: "ai-development"
    rel: "part_of"
  - id: "repo-map"
    rel: "uses"
  - id: "context-package"
    rel: "uses"
  - id: "lead-ai-mvp-build"
    rel: "leads_to"
actions:
  - label: "Подготовить задачу для Codex"
    target: "prompt-brief"
    help: "Поможет превратить идею в понятное задание, чтобы модель меняла проект точнее."
  - label: "Собрать AI-MVP"
    target: "lead-ai-mvp-build"
    help: "Поможет определить минимальный прототип, контекст репозитория и первый технический проход."
---
# Codex

Codex — рабочий инструмент для разработки через модель: чтение репозитория, изменение кода, генерация файлов, рефакторинг и сборка прототипов под контролем человека.

Связанные элементы графа: [[vibe-coding|Vibe coding]], [[ai-development|AI-разработка]], [[repo-map|Карта репозитория]], [[context-package|Пакет контекста]], [[lead-ai-mvp-build|Собрать AI-MVP]].

## Связи

- [[vibe-coding|Vibe coding]] — used_by
- [[ai-development|AI-разработка]] — part_of
- [[repo-map|Карта репозитория]] — uses
- [[context-package|Пакет контекста]] — uses
- [[lead-ai-mvp-build|Собрать AI-MVP]] — leads_to

## Следующие действия

- **Подготовить задачу для Codex** → [[prompt-brief|Промпт-бриф]]: Поможет превратить идею в понятное задание, чтобы модель меняла проект точнее.
- **Собрать AI-MVP** → [[lead-ai-mvp-build|Собрать AI-MVP]]: Поможет определить минимальный прототип, контекст репозитория и первый технический проход.
