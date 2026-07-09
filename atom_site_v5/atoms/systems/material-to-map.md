---
id: material-to-map
title: От материала к карте
slug: material-to-map
kind: scenario
hub: methods
summary: Сценарий работы, в котором исходные заметки или описания превращаются в атомы, связи, карту ситуации и точки действия.
status: public
links:
- id: source-material
  rel: starts_from
  strength: 0.55
  visibility: public
  can_surface: false
- id: atomic-notes
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: graph-mapping
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: situation-map
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: action-point
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: lead-notes-analysis
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
actions:
- label: Разобрать мои заметки
  target: lead-notes-analysis
  help: Поможет пройти путь от хаотичного материала к карте и следующему действию.
- label: Посмотреть исходный материал
  target: source-material
  help: Поможет понять, что можно использовать для анализа.
- label: Понять построение графа
  target: graph-mapping
  help: Поможет увидеть техническую часть маршрута.
seo:
  title: От материала к карте
  description: Сценарий работы, в котором исходные заметки или описания превращаются в атомы, связи, карту ситуации и точки действия.
visibility: public
role: concept
audience:
- expert
- founder
- researcher
routes:
- notes-to-system
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Сценарий работы, в котором исходные заметки или описания превращаются в атомы, связи, карту ситуации и точки действия.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# От материала к карте

Маршрут от материала к карте начинается с сырых записей. Затем из них выделяются атомы: сущности, проблемы, идеи, цели, продукты, страхи, действия и повторяющиеся формулировки.

После атомизации между элементами задаются связи. Итогом становится карта, где видны узлы, сценарии, пустоты и возможные точки действия.
