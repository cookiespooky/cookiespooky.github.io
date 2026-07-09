---
id: comment-to-dm-flow
title: Переход из комментария в личку
slug: comment-to-dm-flow
kind: process
hub: topics
summary: Маршрут, где публичная реакция на пост превращается в личный диалог. Он нужен, чтобы не продавать в лоб и сохранить естественное продолжение интереса.
status: public
links:
- id: threads
  rel: uses
  strength: 0.7
  visibility: internal
  can_surface: false
- id: code-word-cta
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: warm-lead
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: sales-conversation
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: lead-content-map
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Настроить кодовое слово
  target: code-word-cta
  help: Поможет дать пользователю простой способ обозначить интерес.
- label: Понять теплый лид
  target: warm-lead
  help: Поможет отличить живой интерес от случайной реакции.
- label: Собрать маршрут заявки
  target: lead-content-map
  help: Поможет связать пост, комментарий, личку и предложение.
seo:
  title: Переход из комментария в личку
  description: Маршрут, где публичная реакция на пост превращается в личный диалог. Он нужен, чтобы не продавать в лоб и сохранить естественное продолжение интереса.
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Маршрут, где публичная реакция на пост превращается в личный диалог. Он нужен, чтобы не продавать в лоб и сохранить естественное продолжение интереса.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Переход из комментария в личку

Маршрут, где публичная реакция на пост превращается в личный диалог. Он нужен, чтобы не продавать в лоб и сохранить естественное продолжение интереса.

В контентной системе это отвечает за связку между вниманием и обращением: человек должен узнать свою ситуацию, понять предложение и увидеть естественный переход к диалогу.
