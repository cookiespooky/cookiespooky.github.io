---
id: bidirectional-links
title: Двусторонние связи
slug: bidirectional-links
kind: concept
hub: tools
summary: Связи между заметками, которые позволяют видеть не только исходящую ссылку, но и обратные контексты упоминания.
status: public
links:
- id: wikilinks
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: obsidian
  rel: supported_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: knowledge-graph
  rel: strengthens
  strength: 0.55
  visibility: public
  can_surface: false
- id: repeating-scenarios
  rel: helps_detect
  strength: 0.55
  visibility: public
  can_surface: false
- id: graph-hygiene
  rel: requires
  strength: 0.7
  visibility: contextual
  can_surface: false
actions:
- label: Посмотреть граф знаний
  target: knowledge-graph
  help: Поможет понять, как связи между заметками превращаются в карту тем и сценариев.
seo:
  title: Двусторонние связи
  description: Связи между заметками, которые позволяют видеть не только исходящую ссылку, но и обратные контексты упоминания.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Связи между заметками, которые позволяют видеть не только исходящую ссылку, но и обратные контексты упоминания.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# Двусторонние связи

Связи между заметками, которые позволяют видеть не только исходящую ссылку, но и обратные контексты упоминания.

Связанные элементы графа: [[wikilinks]], [[obsidian]], [[knowledge-graph]], [[repeating-scenarios]], [[graph-hygiene]].

## Связи

- [[wikilinks]] — uses
- [[obsidian]] — supported_by
- [[knowledge-graph]] — strengthens
- [[repeating-scenarios]] — helps_detect
- [[graph-hygiene]] — requires

## Следующие действия

- **Посмотреть граф знаний** → [[knowledge-graph]]: Поможет понять, как связи между заметками превращаются в карту тем и сценариев.
