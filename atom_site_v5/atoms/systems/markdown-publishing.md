---
id: markdown-publishing
title: Публикация Markdown
slug: markdown-publishing
kind: tool
hub: tools
summary: Подход, при котором Markdown-заметки становятся страницами сайта без потери структуры, ссылок, frontmatter и графа.
status: public
links:
- id: notepub
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: frontmatter
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: wikilinks
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: public-vault
  rel: publishes
  strength: 0.55
  visibility: public
  can_surface: false
- id: seo
  rel: supports
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
  title: Публикация Markdown
  description: Подход, при котором Markdown-заметки становятся страницами сайта без потери структуры, ссылок, frontmatter и графа.
visibility: public
role: support_context
audience:
- expert
- founder
- researcher
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Подход, при котором Markdown-заметки становятся страницами сайта без потери структуры, ссылок, frontmatter и графа.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Публикация Markdown

Подход, при котором Markdown-заметки становятся страницами сайта без потери структуры, ссылок, frontmatter и графа.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
