---
id: research-library
title: Библиотека исследований
slug: research-library
kind: collection
hub: research
summary: Библиотека исследований собирает авторские наблюдения, принципы, гипотезы и кейсы в отдельный слой графа.
status: public
links:
- id: field-observation
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: hypothesis
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: research-note
  rel: contains
  strength: 0.55
  visibility: contextual
  can_surface: false
- id: case-library
  rel: related_to
  strength: 0.5
  visibility: hidden
  can_surface: false
- id: lead-research-to-product-map
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Посмотреть принципы
  target: principle-map-before-plan
  help: Поможет перейти от общего слоя исследований к рабочим правилам принятия решений.
- label: Связать исследования с продуктом
  target: lead-research-to-product-map
  help: Поможет понять, какие наблюдения можно превратить в продукт, метод или контент.
seo:
  title: Библиотека исследований
  description: Библиотека исследований собирает авторские наблюдения, принципы, гипотезы и кейсы в отдельный слой графа.
visibility: contextual
role: support_context
audience:
- entrepreneur
- founder
- expert
- researcher
routes: &id001
- situation-to-map
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  show_only_in_routes: *id001
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Библиотека исследований собирает авторские наблюдения, принципы, гипотезы и кейсы в отдельный слой графа.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Библиотека исследований

Библиотека исследований собирает авторские наблюдения, принципы, гипотезы и кейсы в отдельный слой графа.

Этот слой нужен для материалов, которые еще не являются продуктом или методом, но уже содержат повторяемое знание. Он связывает наблюдения из практики с гипотезами, принципами, кейсами и будущими атомами.

Библиотека исследований помогает не терять авторские находки и постепенно превращать их в публичные статьи, маршруты сайта и продуктовые входы.

## Связанные элементы

Полевое наблюдение · Гипотеза · Исследовательская заметка · case library · Связать исследования с продуктом
