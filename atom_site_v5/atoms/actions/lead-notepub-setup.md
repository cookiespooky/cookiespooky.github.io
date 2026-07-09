---
id: lead-notepub-setup
title: Собрать публикацию из заметок
slug: lead-notepub-setup
kind: action
hub: products
summary: 'Сборка публикации из Obsidian, Markdown-заметок или базы знаний: структура, публичные атомы, страницы и связи.'
status: public
links:
- id: notepub
  rel: related_product
  strength: 0.55
  visibility: public
  can_surface: false
- id: obsidian
  rel: starts_from
  strength: 0.55
  visibility: public
  can_surface: false
- id: note-to-site-pipeline
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: public-vault
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: markdown-publishing
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
actions:
- label: Подготовить структуру публикации
  target: lead-notepub-setup
  help: Поможет выбрать, какие заметки публиковать, какие оставить черновиками и какие связи нужны для сайта.
seo:
  title: Собрать публикацию из заметок
  description: 'Сборка публикации из Obsidian, Markdown-заметок или базы знаний: структура, публичные атомы, страницы и связи.'
visibility: public
role: lead_action
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
- 'Можно использовать утверждения, прямо опирающиеся на смысл атома: Сборка публикации из Obsidian, Markdown-заметок или базы знаний: структура, публичные атомы, страницы и связи.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---

# Собрать публикацию из заметок

Этот формат подходит, когда заметки уже есть, но их нужно превратить в понятный публичный слой: страницы, маршруты, темы, продукты и связи.

Сначала определяется, какие материалы можно публиковать, какие оставить приватными, а какие использовать только как внутренний контекст. Потом из заметок выделяются атомы смысла и собирается структура сайта.

Итог — не просто экспорт базы, а публикация с понятными входами для человека и структурированным контекстом для модели.
