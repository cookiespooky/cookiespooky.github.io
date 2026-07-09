---
id: context-package
title: Пакет контекста
slug: context-package
kind: tool
hub: tools
summary: Пакет контекста — набор файлов, правил, ограничений и описаний, которые модель получает перед техническим проходом по проекту.
status: public
links:
- id: repo-map
  rel: includes
  strength: 0.55
  visibility: internal
  can_surface: false
- id: prompt-brief
  rel: used_by
  strength: 0.55
  visibility: internal
  can_surface: false
- id: codex
  rel: used_by
  strength: 0.55
  visibility: internal
  can_surface: false
- id: llm-readable-notes
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
actions:
- label: Собрать контекст проекта
  target: repo-map
  help: Поможет модели увидеть структуру проекта и не чинить дверь через окно.
- label: Подготовить AI-разработку
  target: lead-ai-mvp-build
  help: Поможет определить, какие материалы нужны для первого технического прохода.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Пакет контекста — набор файлов, правил, ограничений и описаний, которые модель получает перед техническим проходом по проекту.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
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
