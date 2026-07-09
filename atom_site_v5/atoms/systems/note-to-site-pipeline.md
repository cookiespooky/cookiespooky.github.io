---
id: note-to-site-pipeline
title: Пайплайн заметки → сайт
slug: note-to-site-pipeline
kind: method
hub: tools
summary: Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели.
status: public
links:
- id: obsidian
  rel: starts_from
  strength: 0.55
  visibility: public
  can_surface: false
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: llm-readable-notes
  rel: requires
  strength: 0.7
  visibility: public
  can_surface: true
- id: notepub
  rel: published_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: knowledge-garden
  rel: produces
  strength: 0.8
  visibility: contextual
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
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить.
seo:
  title: Пайплайн заметки → сайт
  description: Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели.
visibility: public
role: method
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Пайплайн заметки → сайт

Процесс превращения личных заметок в публичные атомы, связанные страницы, маршруты пользователя и материал для модели.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
