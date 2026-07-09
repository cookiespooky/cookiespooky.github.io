---
id: wikilinks
title: Wikilinks
slug: wikilinks
kind: tool
hub: tools
summary: Ссылки формата Obsidian, которые связывают заметки в человекочитаемом тексте и создают дополнительный слой графа.
status: public
links:
- id: obsidian
  rel: used_in
  strength: 0.55
  visibility: public
  can_surface: false
- id: bidirectional-links
  rel: related_to
  strength: 0.5
  visibility: internal
  can_surface: false
- id: knowledge-graph
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: llm-readable-notes
  rel: used_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: frontmatter
  rel: complements
  strength: 0.55
  visibility: internal
  can_surface: false
actions:
- label: Понять структуру связей
  target: knowledge-graph
  help: Поможет отличить явные системные связи от обычных упоминаний в тексте.
seo:
  title: Wikilinks
  description: Ссылки формата Obsidian, которые связывают заметки в человекочитаемом тексте и создают дополнительный слой графа.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Ссылки формата Obsidian, которые связывают заметки в человекочитаемом тексте и создают дополнительный слой графа.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Wikilinks

Ссылки формата Obsidian, которые связывают заметки в человекочитаемом тексте и создают дополнительный слой графа.

Связанные элементы графа: [[obsidian]], [[bidirectional-links]], [[knowledge-graph]], [[llm-readable-notes]], [[frontmatter]].

## Связи

- [[obsidian]] — used_in
- [[bidirectional-links]] — related_to
- [[knowledge-graph]] — produces
- [[llm-readable-notes]] — used_by
- [[frontmatter]] — complements

## Следующие действия

- **Понять структуру связей** → [[knowledge-graph]]: Поможет отличить явные системные связи от обычных упоминаний в тексте.
