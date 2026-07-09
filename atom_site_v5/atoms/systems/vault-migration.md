---
id: vault-migration
title: Миграция vault
slug: vault-migration
kind: method
hub: tools
summary: Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц.
status: public
links:
- id: obsidian
  rel: starts_from
  strength: 0.55
  visibility: public
  can_surface: false
- id: atomic-notes
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: public-vault
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: graph-hygiene
  rel: requires
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: note-to-site-pipeline
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить.
- label: Собрать публикацию из заметок
  target: lead-notepub-setup
  help: Поможет понять, какие заметки можно превратить в публичный граф и сайт без ручного переписывания всего архива.
seo:
  title: Миграция vault
  description: Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Миграция vault

Перенос существующей базы заметок в структуру атомов, хабов, связей, маршрутов и публичных страниц.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
