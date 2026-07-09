---
id: narrow-pain-post
title: Пост под узкую боль
slug: narrow-pain-post
kind: format
hub: topics
summary: Публикация, описывающая одну узнаваемую проблему конкретной аудитории. Такой пост снижает абстракцию и помогает человеку увидеть связь между своим состоянием и предложением автора.
status: public
links:
- id: icp
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: offer
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: content-to-leads
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: code-word-cta
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: comment-to-dm-flow
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Уточнить аудиторию
  target: icp
  help: Поможет написать пост не для всех, а для конкретного человека с конкретной ситуацией.
- label: Связать с действием
  target: code-word-cta
  help: Поможет сделать следующий шаг простым и неагрессивным.
- label: Проверить посты
  target: lead-content-map
  help: Поможет найти темы, которые могут давать заявки.
seo:
  title: Пост под узкую боль
  description: Публикация, описывающая одну узнаваемую проблему конкретной аудитории. Такой пост снижает абстракцию и помогает человеку увидеть связь между своим состоянием и предложением автора.
visibility: public
role: support_context
audience:
- entrepreneur
- founder
- expert
- developer
routes:
- content-to-leads
surface_policy:
  can_be_main_topic: false
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Публикация, описывающая одну узнаваемую проблему конкретной аудитории. Такой пост снижает абстракцию и помогает человеку увидеть связь между своим состоянием и предложением автора.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Пост под узкую боль

Публикация, описывающая одну узнаваемую проблему конкретной аудитории. Такой пост снижает абстракцию и помогает человеку увидеть связь между своим состоянием и предложением автора.

В контентной системе это отвечает за связку между вниманием и обращением: человек должен узнать свою ситуацию, понять предложение и увидеть естественный переход к диалогу.
