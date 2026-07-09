---
id: case-anonymization
title: Анонимизация кейса
slug: case-anonymization
kind: method
hub: methods
summary: Очистка кейса от личных деталей перед публикацией или использованием как примера в публичном графе.
status: public
links:
- id: case-to-article
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: case-evidence
  rel: related_to
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: research-notes
  rel: compatible_with
  strength: 0.55
  visibility: hidden
  can_surface: false
actions:
- label: Подготовить кейс к публикации
  target: case-to-article
  help: Поможет сохранить пользу кейса без лишней личной информации.
seo:
  title: Анонимизация кейса
  description: Очистка кейса от личных деталей перед публикацией или использованием как примера в публичном графе.
visibility: contextual
role: method
audience:
- entrepreneur
- founder
- expert
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
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Очистка кейса от личных деталей перед публикацией или использованием как примера в публичном графе.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Анонимизация кейса

Очистка кейса от личных деталей перед публикацией или использованием как примера в публичном графе.

В карте ситуации это помогает назвать повторяющийся элемент, увидеть его связи с другими частями системы и найти место, где возможно действие.
