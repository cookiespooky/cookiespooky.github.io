---
id: graph-hygiene
title: Гигиена графа
slug: graph-hygiene
kind: method
hub: tools
summary: "Правила поддержания графа знаний в рабочем состоянии: убрать дубли, уточнить связи, разделить черновики, публичные атомы и архив."
status: public
links:
- id: knowledge-graph
  rel: maintains
  strength: 0.55
  visibility: public
  can_surface: false
- id: public-vault
  rel: requires
  strength: 0.7
  visibility: public
  can_surface: true
- id: frontmatter
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: vault-migration
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: note-to-site-pipeline
  rel: improves
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Провести разбор vault
  target: lead-notes-analysis
  help: Поможет понять, какие заметки стоит опубликовать, объединить, разрезать на атомы или оставить в архиве.
seo:
  title: Гигиена графа
  description: "Правила поддержания графа знаний в рабочем состоянии: убрать дубли, уточнить связи, разделить черновики, публичные атомы и архив."
visibility: contextual
role: method
audience:
- expert
- founder
- researcher
routes: &id001
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Правила поддержания графа знаний в рабочем состоянии: убрать дубли, уточнить связи, разделить черновики, публичные атомы и архив.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Гигиена графа

Правила поддержания графа знаний в рабочем состоянии: убрать дубли, уточнить связи, разделить черновики, публичные атомы и архив.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
