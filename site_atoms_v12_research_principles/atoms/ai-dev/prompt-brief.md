---
id: prompt-brief
title: Промпт-бриф
slug: prompt-brief
kind: tool
hub: tools
summary: 'Промпт-бриф — короткое техническое задание для модели: цель изменения, текущий
  контекст, ограничения, ожидаемый результат и критерии проверки.'
status: public
links:
- id: context-package
  rel: uses
- id: codex
  rel: used_by
- id: technical-spec-from-idea
  rel: extends
- id: ai-dev-workflow
  rel: part_of
actions:
- label: Собрать бриф проекта
  target: technical-spec-from-idea
  help: Поможет превратить идею в задачу, которую можно дать модели или разработчику.
- label: Обсудить AI-MVP
  target: lead-ai-mvp-build
  help: Поможет быстро собрать первый контекст для разработки.
---

# Промпт-бриф

Промпт-бриф — короткое техническое задание для модели: цель изменения, текущий контекст, ограничения, ожидаемый результат и критерии проверки.

Связанные элементы графа: [[context-package]], [[codex]], [[technical-spec-from-idea]], [[ai-dev-workflow]].

## Связи

- [[context-package]] — uses
- [[codex]] — used_by
- [[technical-spec-from-idea]] — extends
- [[ai-dev-workflow]] — part_of

## Следующие действия

- **Собрать бриф проекта** → [[technical-spec-from-idea]]: Поможет превратить идею в задачу, которую можно дать модели или разработчику.
- **Обсудить AI-MVP** → [[lead-ai-mvp-build]]: Поможет быстро собрать первый контекст для разработки.
