---
id: social-proof-loop
title: Петля социального доказательства
slug: social-proof-loop
kind: process
hub: topics
summary: Механизм, где результаты, отзывы, вопросы и кейсы возвращаются в контент и усиливают доверие к продукту или методу.
status: public
links:
- id: content-system
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: case
  rel: related_to
  strength: 0.5
  visibility: hidden
  can_surface: false
- id: threads
  rel: compatible_with
  strength: 0.55
  visibility: internal
  can_surface: false
- id: offer
  rel: supports
  strength: 0.55
  visibility: public
  can_surface: false
- id: lead-content-map
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Собрать кейсы
  target: case
  help: Поможет показать метод на реальных ситуациях.
- label: Связать с контентом
  target: content-system
  help: Поможет регулярно возвращать доказательства в публикации.
- label: Настроить петлю доверия
  target: lead-content-map
  help: Поможет понять, какие результаты стоит показывать аудитории.
seo:
  title: Петля социального доказательства
  description: Механизм, где результаты, отзывы, вопросы и кейсы возвращаются в контент и усиливают доверие к продукту или методу.
visibility: public
role: mechanism
audience:
- entrepreneur
- founder
- expert
routes:
- content-to-leads
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Механизм, где результаты, отзывы, вопросы и кейсы возвращаются в контент и усиливают доверие к продукту или методу.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Петля социального доказательства

Механизм, где результаты, отзывы, вопросы и кейсы возвращаются в контент и усиливают доверие к продукту или методу.

В контентной системе это отвечает за связку между вниманием и обращением: человек должен узнать свою ситуацию, понять предложение и увидеть естественный переход к диалогу.
