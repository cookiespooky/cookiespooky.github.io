---
id: knowledge-garden
title: Сад знаний
slug: knowledge-garden
kind: concept
hub: research
summary: Публичная база связанных заметок, где материалы развиваются постепенно и остаются частью единого графа знаний.
status: public
links:
- id: public-vault
  rel: contains
  strength: 0.55
  visibility: public
  can_surface: false
- id: notepub
  rel: published_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: knowledge-graph
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: llm-site
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: seo
  rel: compatible_with
  strength: 0.55
  visibility: internal
  can_surface: false
actions:
- label: Собрать публикацию из заметок
  target: lead-notepub-setup
  help: Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива.
seo:
  title: Сад знаний
  description: Публичная база связанных заметок, где материалы развиваются постепенно и остаются частью единого графа знаний.
visibility: contextual
role: concept
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Публичная база связанных заметок, где материалы развиваются постепенно и остаются частью единого графа знаний.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Сад знаний

Публичная база связанных заметок, где материалы развиваются постепенно и остаются частью единого графа знаний.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
