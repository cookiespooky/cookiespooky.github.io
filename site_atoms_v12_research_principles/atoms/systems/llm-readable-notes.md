---
id: llm-readable-notes
title: LLM-читаемые заметки
slug: llm-readable-notes
kind: concept
hub: tools
summary: Формат заметок, в котором текст понятен человеку, а структура, связи и действия
  явно заданы для модели.
status: public
links:
- id: atomic-notes
  rel: extends
- id: note-to-site-pipeline
  rel: requires
- id: wikilinks
  rel: uses
- id: frontmatter
  rel: uses
- id: llm-site
  rel: enables
- id: lead-notes-analysis
  rel: leads_to
actions:
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а
    что нужно достроить.
seo:
  title: LLM-читаемые заметки
  description: Формат заметок, в котором текст понятен человеку, а структура, связи
    и действия явно заданы для модели.
---

# LLM-читаемые заметки

Формат заметок, в котором текст понятен человеку, а структура, связи и действия явно заданы для модели.

Связанные элементы графа: [[atomic-notes]], [[note-to-site-pipeline]], [[wikilinks]], [[frontmatter]], [[llm-site]], [[lead-notes-analysis]].

## Связи

- [[atomic-notes]] — extends
- [[note-to-site-pipeline]] — requires
- [[wikilinks]] — uses
- [[frontmatter]] — uses
- [[llm-site]] — enables
- [[lead-notes-analysis]] — leads_to

## Следующие действия

- **Разобрать мои заметки** → [[lead-notes-analysis]]: Поможет увидеть, какие темы, сценарии и продукты уже есть в материалах, а что нужно достроить.
