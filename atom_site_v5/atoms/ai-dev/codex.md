---
id: codex
title: Codex
slug: codex
kind: tool
hub: tools
summary: 'Codex — рабочий инструмент для разработки через модель: чтение репозитория, изменение кода, генерация файлов, рефакторинг и сборка прототипов под контролем человека.'
status: public
links:
- id: vibe-coding
  rel: used_by
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-development
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: repo-map
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: context-package
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: lead-ai-mvp-build
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Подготовить задачу для Codex
  target: prompt-brief
  help: Поможет превратить идею в понятное задание, чтобы модель меняла проект точнее.
- label: Собрать AI-MVP
  target: lead-ai-mvp-build
  help: Поможет определить минимальный прототип, контекст репозитория и первый технический проход.
visibility: internal
role: implementation
audience:
- founder
- entrepreneur
- developer
routes:
- idea-to-mvp
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  use_for_generation_context: true
  public_link_replacement: use_nearest_public_atom
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Codex — рабочий инструмент для разработки через модель: чтение репозитория, изменение кода, генерация файлов, рефакторинг и сборка прототипов под контролем человека.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
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
