---
id: source-material
title: Исходный материал
slug: source-material
kind: concept
hub: research
summary: Текст, заметки, диалоги, посты, дневниковые записи или описания ситуаций, из которых извлекаются атомы и связи.
status: public
links:
- id: diary
  rel: example_of
  strength: 0.6
  visibility: contextual
  can_surface: false
- id: atomic-notes
  rel: derived_from
  strength: 0.55
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: graph-mapping
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Подготовить материал для разбора
  target: lead-notes-analysis
  help: Поможет понять, какие заметки или тексты подходят для анализа.
- label: Посмотреть дневник как источник
  target: diary
  help: Поможет увидеть, как регулярные записи становятся материалом для реконструкции.
- label: Перейти к атомизации
  target: atomic-notes
  help: Поможет понять, как текст дробится на узлы графа.
seo:
  title: Исходный материал
  description: Текст, заметки, диалоги, посты, дневниковые записи или описания ситуаций, из которых извлекаются атомы и связи.
visibility: public
role: concept
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Текст, заметки, диалоги, посты, дневниковые записи или описания ситуаций, из которых извлекаются атомы и связи.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Исходный материал

Исходный материал — все, что содержит следы мышления, решений и повторяющихся объяснений. Это могут быть заметки, посты, расшифровки разговоров, список проектов, описания проблем или дневник.

Качество исходного материала влияет на точность реконструкции. Чем конкретнее материал, тем легче выделить сущности, связи и сценарии.
