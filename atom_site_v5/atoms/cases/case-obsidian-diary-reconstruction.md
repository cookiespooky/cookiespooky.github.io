---
id: case-obsidian-diary-reconstruction
title: Кейс дневника в Obsidian
slug: case-obsidian-diary-reconstruction
kind: case
hub: research
summary: Кейс, где хаотичные заметки, дневник и граф используются как материал для поиска повторяющихся сценариев и точек действия.
status: public
links:
- id: diary
  rel: uses
  strength: 0.7
  visibility: contextual
  can_surface: false
- id: obsidian
  rel: compatible_with
  strength: 0.55
  visibility: public
  can_surface: false
- id: atomic-notes
  rel: produces
  strength: 0.8
  visibility: public
  can_surface: true
- id: repeating-scenarios
  rel: explains
  strength: 0.75
  visibility: public
  can_surface: true
- id: lead-self-tracking-setup
  rel: leads_to
  strength: 0.9
  visibility: contextual
  can_surface: false
actions:
- label: Разобрать заметки
  target: lead-self-tracking-setup
  help: Поможет превратить дневник в наблюдаемую систему.
- label: Посмотреть атомизацию
  target: atomic-notes
  help: Поможет понять, как хаотичные записи становятся графом.
seo:
  title: Кейс дневника в Obsidian
  description: Кейс, где хаотичные заметки, дневник и граф используются как материал для поиска повторяющихся сценариев и точек действия.
visibility: public
role: proof
audience:
- expert
- founder
- researcher
- entrepreneur
routes:
- notes-to-system
- situation-to-map
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- 'Можно использовать только утверждения, прямо опирающиеся на summary атома: Кейс, где хаотичные заметки, дневник и граф используются как материал для поиска повторяющихся сценариев и точек действия.'
forbidden_claims:
- Нельзя добавлять обещания результата, которых нет в атоме.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать техническую или внутреннюю сущность в публичный следующий шаг для нетехнической аудитории.
---
# Кейс дневника в Obsidian

Дневник в Obsidian становится полезен не только как архив, а как материал для анализа связей. Заметки можно атомизировать, связать в граф и использовать для реконструкции ситуации. Такой кейс соединяет Дневник, Obsidian, Атомарные заметки, Повторяющиеся сценарии и Когнитивная реконструкция.
