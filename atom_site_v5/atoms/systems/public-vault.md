---
id: public-vault
title: Публичный vault
slug: public-vault
kind: concept
hub: tools
summary: Часть базы знаний, которую можно показывать пользователям, индексировать поисковиками и использовать как контекст для модели.
status: public
links:
- id: obsidian
  rel: stored_in
  strength: 0.55
  visibility: public
  can_surface: false
- id: notepub
  rel: published_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: knowledge-garden
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: graph-hygiene
  rel: requires
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: seo
  rel: compatible_with
  strength: 0.55
  visibility: internal
  can_surface: false
- id: lead-notepub-setup
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Собрать публикацию из заметок
  target: lead-notepub-setup
  help: Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива.
seo:
  title: Публичный vault
  description: Часть базы знаний, которую можно показывать пользователям, индексировать поисковиками и использовать как контекст для модели.
visibility: public
role: concept
audience:
- expert
- founder
- researcher
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Часть базы знаний, которую можно показывать пользователям, индексировать поисковиками и использовать как контекст для модели.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Публичный vault

Часть базы знаний, которую можно показывать пользователям, индексировать поисковиками и использовать как контекст для модели.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
