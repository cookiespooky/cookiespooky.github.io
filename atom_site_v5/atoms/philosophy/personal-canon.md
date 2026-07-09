---
id: personal-canon
title: Личный канон
slug: personal-canon
kind: concept
hub: research
summary: Набор текстов, образов, идей, авторов и сюжетов, которые формируют устойчивую личную систему смыслов.
status: public
links:
- id: personal-myth
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
- id: world-model
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: dante-map
  rel: example_of
  strength: 0.6
  visibility: internal
  can_surface: false
- id: notepub
  rel: stored_in
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Собрать канон в заметки
  target: notepub
  help: Поможет превратить личные источники смысла в структуру заметок и публичный граф.
- label: Посмотреть личный миф
  target: personal-myth
  help: Поможет связать источники с текущей траекторией.
- label: Посмотреть Данте как карту
  target: dante-map
  help: Поможет увидеть пример канонического текста как навигационной структуры.
seo:
  title: Личный канон
  description: Набор текстов, образов, идей, авторов и сюжетов, которые формируют устойчивую личную систему смыслов.
visibility: contextual
role: concept
audience:
- entrepreneur
- founder
- expert
- researcher
routes: &id001
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Набор текстов, образов, идей, авторов и сюжетов, которые формируют устойчивую личную систему смыслов.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Личный канон

Личный канон — набор источников, которые регулярно возвращаются в мышлении человека и задают его язык, образы и критерии выбора. Это могут быть книги, мифы, авторы, фильмы, музыка, места, личные заметки и повторяющиеся символы.

Связи: Личный миф, Картина мира, Данте как карта, Notepub.
