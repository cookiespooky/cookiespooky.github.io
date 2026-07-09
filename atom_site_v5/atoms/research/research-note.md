---
id: research-note
title: Исследовательская заметка
slug: research-note
kind: research
hub: research
summary: Исследовательская заметка хранит короткое объяснение наблюдения, принципа или гипотезы и связывает его с другими атомами.
status: public
links:
- id: atomic-notes
  rel: example_of
  strength: 0.6
  visibility: public
  can_surface: true
- id: knowledge-graph
  rel: part_of
  strength: 0.65
  visibility: public
  can_surface: true
- id: notepub
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: research-library
  rel: part_of
  strength: 0.65
  visibility: contextual
  can_surface: false
actions:
- label: Опубликовать заметки как граф
  target: lead-notepub-setup
  help: Поможет отделить публичные атомы от черновиков и сохранить связи для сайта и Obsidian.
- label: Посмотреть публичный vault
  target: public-vault
  help: Поможет понять, как заметки становятся навигационной системой для человека и модели.
seo:
  title: Исследовательская заметка
  description: Исследовательская заметка хранит короткое объяснение наблюдения, принципа или гипотезы и связывает его с другими атомами.
visibility: contextual
role: proof
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Исследовательская заметка хранит короткое объяснение наблюдения, принципа или гипотезы и связывает его с другими атомами.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Исследовательская заметка

Исследовательская заметка хранит короткое объяснение наблюдения, принципа или гипотезы и связывает его с другими атомами.

Формат исследовательской заметки подходит для коротких авторских мыслей, которые еще не стали полноценными статьями. Главное — не длина, а ясная связь с другими атомами.

Такие заметки особенно полезны для Notepub и Obsidian: они остаются человекочитаемыми, участвуют в графе и могут использоваться моделью как контекст.

## Связанные элементы

Атомарные заметки · Граф знаний · Notepub · Библиотека исследований
