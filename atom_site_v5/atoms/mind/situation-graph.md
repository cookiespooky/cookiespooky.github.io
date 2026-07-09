---
id: situation-graph
title: Граф ситуации
slug: situation-graph
kind: artifact
hub: methods
summary: Визуальная или структурная модель ситуации, где элементы представлены узлами, а отношения между ними — связями.
status: public
links:
- id: situation-map
  rel: visualizes
  strength: 0.55
  visibility: public
  can_surface: false
- id: knowledge-graph
  rel: instance_of
  strength: 0.55
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: produced_by
  strength: 0.55
  visibility: public
  can_surface: false
- id: graph-mapping
  rel: produced_by
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-cognitive-reconstruction
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Построить граф моей ситуации
  target: lead-cognitive-reconstruction
  help: Поможет вынести сложность из головы в структуру, где видны узлы и связи.
- label: Понять карту ситуации
  target: situation-map
  help: Поможет отличить карту от графа и выбрать удобный формат.
- label: Открыть связь с Obsidian
  target: obsidian
  help: Поможет использовать граф как рабочую базу заметок.
seo:
  title: Граф ситуации
  description: Визуальная или структурная модель ситуации, где элементы представлены узлами, а отношения между ними — связями.
visibility: public
role: support_context
audience:
- entrepreneur
- founder
- expert
routes:
- situation-to-map
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Визуальная или структурная модель ситуации, где элементы представлены узлами, а отношения между ними — связями.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Граф ситуации

Граф ситуации — способ представить сложную ситуацию как систему элементов и связей. Узлами могут быть цели, идеи, страхи, продукты, люди, ограничения, действия и повторяющиеся сценарии.

Граф помогает видеть не только отдельные проблемы, но и структуру: какие элементы усиливают друг друга, какие конкурируют, какие ведут к действию.
