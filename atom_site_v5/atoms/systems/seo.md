---
id: "seo"
title: "SEO"
slug: "seo"
kind: "channel"
hub: "topics"
summary: "Оптимизация контента и структуры сайта для поиска, индексации и понятной навигации."
status: "public"
links:
- id: "atomic-notes"
  rel: "uses"
  strength: 0.7
  visibility: public
  can_surface: true
- id: "llm-site"
  rel: "related_to"
  strength: 0.5
  visibility: contextual
  can_surface: false
- id: "notepub"
  rel: "related_product"
  strength: 0.55
  visibility: public
  can_surface: false
- id: "knowledge-graph"
  rel: "compatible_with"
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: "Оптимизировать атом"
  target: "atomic-notes"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
- label: "Связать страницы"
  target: "atomic-notes"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
- label: "Понять LLM и SEO"
  target: "atomic-notes"
  help: "Поможет уточнить контекст и перейти к следующему связанному понятию."
seo:
  title: "SEO"
  description: "Оптимизация контента и структуры сайта для поиска, индексации и понятной навигации."
visibility: internal
role: implementation
audience:
- expert
- founder
- researcher
- developer
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: false
  can_be_linked: false
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
  use_for_generation_context: true
  public_link_replacement: use_nearest_public_atom
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Оптимизация контента и структуры сайта для поиска, индексации и понятной навигации.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
- Нельзя показывать этот атом как ссылку или главный раздел публичной статьи.
---

# SEO

Оптимизация контента и структуры сайта для поиска, индексации и понятной навигации.

Связанные элементы графа: [[atomic-notes|Атомарные заметки]], [[llm-site|LLM-сайт]], [[notepub|Notepub]], [[knowledge-graph|Граф знаний]].

## Связи

- [[atomic-notes]] — uses
- [[llm-site]] — related_to
- [[notepub]] — related_product
- [[knowledge-graph]] — compatible_with

## Следующие действия

- **Оптимизировать атом** → [[atomic-notes]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Связать страницы** → [[atomic-notes]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Понять LLM и SEO** → [[atomic-notes]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
