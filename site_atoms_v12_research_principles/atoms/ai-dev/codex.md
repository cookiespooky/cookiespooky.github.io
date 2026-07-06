---
id: codex
title: Codex
slug: codex
kind: tool
hub: tools
summary: 'Codex — рабочий инструмент для разработки через модель: чтение репозитория,
  изменение кода, генерация файлов, рефакторинг и сборка прототипов под контролем
  человека.'
status: public
links:
- id: vibe-coding
  rel: used_by
- id: ai-development
  rel: part_of
- id: repo-map
  rel: uses
- id: context-package
  rel: uses
- id: lead-ai-mvp-build
  rel: leads_to
actions:
- label: Подготовить задачу для Codex
  target: prompt-brief
  help: Поможет превратить идею в понятное задание, чтобы модель меняла проект точнее.
- label: Собрать AI-MVP
  target: lead-ai-mvp-build
  help: Поможет определить минимальный прототип, контекст репозитория и первый технический
    проход.
---

# Codex

Codex — рабочий инструмент для разработки через модель: чтение репозитория, изменение кода, генерация файлов, рефакторинг и сборка прототипов под контролем человека.

Связанные элементы графа: [[vibe-coding]], [[ai-development]], [[repo-map]], [[context-package]], [[lead-ai-mvp-build]].

## Связи

- [[vibe-coding]] — used_by
- [[ai-development]] — part_of
- [[repo-map]] — uses
- [[context-package]] — uses
- [[lead-ai-mvp-build]] — leads_to

## Следующие действия

- **Подготовить задачу для Codex** → [[prompt-brief]]: Поможет превратить идею в понятное задание, чтобы модель меняла проект точнее.
- **Собрать AI-MVP** → [[lead-ai-mvp-build]]: Поможет определить минимальный прототип, контекст репозитория и первый технический проход.
