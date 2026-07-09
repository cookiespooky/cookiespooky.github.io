---
id: llm-readable-notes
title: LLM-читаемые заметки
slug: llm-readable-notes
kind: concept
hub: tools
summary: Формат заметок, в котором текст понятен человеку, а структура, связи и действия явно заданы для модели.
status: public
links:
- id: atomic-notes
  rel: extends
  strength: 0.55
  visibility: public
  can_surface: false
- id: note-to-site-pipeline
  rel: requires
  strength: 0.7
  visibility: public
  can_surface: true
- id: wikilinks
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: frontmatter
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: llm-site
  rel: enables
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить.
seo:
  title: LLM-читаемые заметки
  description: Формат заметок, в котором текст понятен человеку, а структура, связи и действия явно заданы для модели.
visibility: public
role: concept
audience:
- expert
- founder
- researcher
- developer
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Формат заметок, в котором текст понятен человеку, а структура, связи и действия явно заданы для модели.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# LLM-читаемые заметки

Формат заметок, в котором текст понятен человеку, а структура, связи и действия явно заданы для модели.

В работе с заметками это помогает превратить накопленные материалы из архива в рабочую систему: карту тем, страницы, контекст для модели или основу продукта.
