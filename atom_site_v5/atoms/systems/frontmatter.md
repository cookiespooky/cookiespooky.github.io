---
id: frontmatter
title: Frontmatter
slug: frontmatter
kind: tool
hub: tools
summary: Метаданные в начале Markdown-заметки, где фиксируются тип атома, хаб, статус, явные связи, действия и SEO-описание.
status: public
links:
- id: llm-readable-notes
  rel: used_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: wikilinks
  rel: complements
  strength: 0.55
  visibility: internal
  can_surface: false
- id: llm-site
  rel: enables
  strength: 0.55
  visibility: contextual
  can_surface: false
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
actions:
- label: Собрать схему атома
  target: lead-notes-analysis
  help: Поможет привести заметки к формату, который работает и в Obsidian, и на сайте, и в модели.
seo:
  title: Frontmatter
  description: Метаданные в начале Markdown-заметки, где фиксируются тип атома, хаб, статус, явные связи, действия и SEO-описание.
visibility: internal
role: implementation
audience:
- expert
- founder
- researcher
- developer
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  use_for_generation_context: true
  public_link_replacement: use_nearest_public_atom
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Метаданные в начале Markdown-заметки, где фиксируются тип атома, хаб, статус, явные связи, действия и SEO-описание.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Frontmatter

Метаданные в начале Markdown-заметки, где фиксируются тип атома, хаб, статус, явные связи, действия и SEO-описание.

Связанные элементы графа: [[llm-readable-notes]], [[wikilinks]], [[llm-site]], [[graph-hygiene]], [[note-to-site-pipeline]].

## Связи

- [[llm-readable-notes]] — used_by
- [[wikilinks]] — complements
- [[llm-site]] — enables
- [[graph-hygiene]] — requires
- [[note-to-site-pipeline]] — part_of

## Следующие действия

- **Собрать схему атома** → [[lead-notes-analysis]]: Поможет привести заметки к формату, который работает и в Obsidian, и на сайте, и в модели.
