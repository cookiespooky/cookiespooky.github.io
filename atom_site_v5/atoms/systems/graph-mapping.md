---
id: graph-mapping
title: Построение графа
slug: graph-mapping
kind: method
hub: methods
summary: Процесс выделения сущностей и связей из текста, заметок, диалога или описания ситуации.
status: public
links:
- id: situation-graph
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: knowledge-graph
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет превратить хаотичные записи в карту связанных смыслов.
- label: Посмотреть граф ситуации
  target: situation-graph
  help: Поможет понять результат построения графа.
- label: Связать с атомизацией
  target: atomic-notes
  help: Поможет увидеть, как заметки становятся узлами графа.
seo:
  title: Построение графа
  description: Процесс выделения сущностей и связей из текста, заметок, диалога или описания ситуации.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Процесс выделения сущностей и связей из текста, заметок, диалога или описания ситуации.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Построение графа

Построение графа начинается с выделения сущностей. Затем между ними задаются связи: причина, часть, следствие, инструмент, метод, продукт, действие или пример.

Граф полезен, когда линейный текст скрывает структуру. Он показывает, какие элементы ситуации действительно связаны, а какие просто находятся рядом в одном описании.
