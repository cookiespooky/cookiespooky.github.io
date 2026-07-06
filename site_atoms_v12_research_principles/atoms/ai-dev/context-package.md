---
id: context-package
title: Пакет контекста
slug: context-package
kind: tool
hub: tools
summary: Пакет контекста — набор файлов, правил, ограничений и описаний, которые модель
  получает перед техническим проходом по проекту.
status: public
links:
- id: repo-map
  rel: includes
- id: prompt-brief
  rel: used_by
- id: codex
  rel: used_by
- id: llm-readable-notes
  rel: related_to
actions:
- label: Собрать контекст проекта
  target: repo-map
  help: Поможет модели увидеть структуру проекта и не чинить дверь через окно.
- label: Подготовить AI-разработку
  target: lead-ai-mvp-build
  help: Поможет определить, какие материалы нужны для первого технического прохода.
---

# Пакет контекста

Пакет контекста — набор файлов, правил, ограничений и описаний, которые модель получает перед техническим проходом по проекту.

Связанные элементы графа: [[repo-map]], [[prompt-brief]], [[codex]], [[llm-readable-notes]].

## Связи

- [[repo-map]] — includes
- [[prompt-brief]] — used_by
- [[codex]] — used_by
- [[llm-readable-notes]] — related_to

## Следующие действия

- **Собрать контекст проекта** → [[repo-map]]: Поможет модели увидеть структуру проекта и не чинить дверь через окно.
- **Подготовить AI-разработку** → [[lead-ai-mvp-build]]: Поможет определить, какие материалы нужны для первого технического прохода.
