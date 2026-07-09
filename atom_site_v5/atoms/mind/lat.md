---
id: lat
title: LAT
slug: lat
kind: method
hub: methods
summary: Анализ речи по маркерам мышления, агентности, времени, причинности и источника знания.
status: public
links:
- id: language-markers
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: agency
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: causality
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: world-model
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: cognitive-gaps
  rel: detects
  strength: 0.55
  visibility: public
  can_surface: false
- id: analysis-lens
  rel: example_of
  strength: 0.6
  visibility: public
  can_surface: true
actions:
- label: Показать языковые маркеры
  target: language-markers
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с реконструкцией
  target: lead-cognitive-reconstruction
  help: Поможет собрать карту ситуации и увидеть связи, которые трудно удержать в голове.
- label: Разобрать фразу
  target: language-markers
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Посмотреть LAT как линзу
  target: analysis-lens
  help: Поможет понять, как языковой анализ становится рамкой чтения ситуации.
seo:
  title: LAT
  description: Анализ речи по маркерам мышления, агентности, времени, причинности и источника знания.
visibility: public
role: method
audience:
- entrepreneur
- founder
- expert
routes:
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Анализ речи по маркерам мышления, агентности, времени, причинности и источника знания.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# LAT

LAT — языковая аналитическая рамка для поиска маркеров мышления в речи и тексте. Метод обращает внимание на субъект, агентность, источник знания, время, причинность и модальность.

LAT помогает обнаруживать места, где в речи отсутствует действующее лицо, критерий, причина или конкретный следующий шаг.
