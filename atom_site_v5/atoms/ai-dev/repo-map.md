---
id: repo-map
title: Карта репозитория
slug: repo-map
kind: artifact
hub: tools
summary: 'Карта репозитория — краткое описание структуры проекта: папки, ключевые файлы, точки входа, зависимости и места, которые нельзя менять без причины.'
status: public
links:
- id: context-package
  rel: part_of
  strength: 0.65
  visibility: internal
  can_surface: false
- id: codex
  rel: used_by
  strength: 0.55
  visibility: internal
  can_surface: false
- id: full-stack-mvp
  rel: supports
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: ai-assisted-refactoring
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
actions:
- label: Собрать карту проекта
  target: lead-ai-mvp-build
  help: Поможет начать разработку с понимания структуры, а не с шаманского поиска файла app2_final_REAL.js.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Карта репозитория — краткое описание структуры проекта: папки, ключевые файлы, точки входа, зависимости и места, которые нельзя менять без причины.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Карта репозитория

Карта репозитория — краткое описание структуры проекта: папки, ключевые файлы, точки входа, зависимости и места, которые нельзя менять без причины.

Связанные элементы графа: [[context-package]], [[codex]], [[full-stack-mvp]], [[ai-assisted-refactoring]].

## Связи

- [[context-package]] — part_of
- [[codex]] — used_by
- [[full-stack-mvp]] — supports
- [[ai-assisted-refactoring]] — uses

## Следующие действия

- **Собрать карту проекта** → [[lead-ai-mvp-build]]: Поможет начать разработку с понимания структуры, а не с шаманского поиска файла app2_final_REAL.js.
