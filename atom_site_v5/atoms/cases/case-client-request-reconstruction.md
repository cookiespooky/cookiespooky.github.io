---
id: case-client-request-reconstruction
title: Клиентский запрос для реконструкции
slug: case-client-request-reconstruction
kind: case
hub: research
summary: "Типовой вход в когнитивную реконструкцию: человек не просит готовый совет, а приносит запутанную ситуацию, где нужно восстановить структуру."
status: public
links:
- id: cognitive-reconstruction
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: situation-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: cognitive-gaps
  rel: explains
  strength: 0.75
  visibility: public
  can_surface: true
- id: lens-analysis
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: action-point
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Построить карту ситуации
  target: lead-cognitive-reconstruction
  help: Поможет увидеть структуру запроса, а не спорить с отдельными симптомами.
- label: Посмотреть линзы анализа
  target: lens-analysis
  help: Поможет понять, как один материал можно читать с разных сторон.
seo:
  title: Клиентский запрос для реконструкции
  description: "Типовой вход в когнитивную реконструкцию: человек не просит готовый совет, а приносит запутанную ситуацию, где нужно восстановить структуру."
visibility: public
role: proof
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Типовой вход в когнитивную реконструкцию: человек не просит готовый совет, а приносит запутанную ситуацию, где нужно восстановить структуру.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Клиентский запрос для реконструкции

Такой запрос обычно содержит несколько уровней: события, эмоции, объяснения, идеи, страхи и незавершенные решения. Реконструкция отделяет факты от интерпретаций, выделяет узлы и связи, затем собирает карту ситуации. Связанные элементы: Карта ситуации, Когнитивные пустоты, Линзирование и Точка действия.
