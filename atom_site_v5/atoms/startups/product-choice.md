---
id: product-choice
title: Выбор продукта
slug: product-choice
kind: method
hub: topics
summary: Метод выбора одной продуктовой гипотезы для проверки, когда идей больше, чем ресурсов.
status: public
links:
- id: no-selection-criterion
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: hypothesis-testing
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: product-thinking
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: offer
  rel: related_to
  strength: 0.5
  visibility: public
  can_surface: false
- id: lead-product-choice
  rel: leads_to
  strength: 0.9
  visibility: public
  can_surface: true
- id: founder-decision-map
  rel: uses
  strength: 0.7
  visibility: public
  can_surface: true
- id: startup-hypothesis
  rel: narrows
  strength: 0.55
  visibility: public
  can_surface: false
- id: demand-validation
  rel: checked_by
  strength: 0.55
  visibility: public
  can_surface: false
actions:
- label: Выбрать главный продукт
  target: lead-product-choice
  help: Сузить список идей до одного фокуса и первого теста.
- label: Проверить спрос
  target: demand-validation
  help: Понять, есть ли интерес до полноценной разработки.
seo:
  title: Выбор продукта
  description: Метод выбора одной продуктовой гипотезы для проверки, когда идей больше, чем ресурсов.
visibility: public
role: method
audience:
- founder
- entrepreneur
routes:
- chaos-to-focus
- idea-to-mvp
surface_policy:
  can_be_main_topic: true
  can_be_linked: true
  show_on_home: false
  show_in_nav: false
  max_outbound_links: 3
allowed_claims:
- Можно говорить, что выбор продукта нужен для проверки одной гипотезы, а не для окончательного отказа от всех остальных.
- Можно говорить, что критерии выбора снижают распыление.
- Можно говорить, что выбранный фокус должен быть связан с проверкой спроса.
forbidden_claims:
- Нельзя обещать, что выбранный продукт точно станет главным бизнесом.
- Нельзя обесценивать остальные идеи как мусор.
- Нельзя обещать гарантированный результат, продажи, ясность или успешный запуск.
- Нельзя делать психологические, медицинские или финансовые выводы без отдельного основания.
- Нельзя превращать внутренние инструменты, платформы или технические детали в публичный следующий шаг для нетехнической аудитории.
- 'Нельзя добавлять ссылки на атомы с visibility: internal или can_surface: false.'
user_problem: Есть несколько направлений, но ни одно не получает достаточно внимания, чтобы пройти реальную проверку спроса.
input:
- список идей и продуктов
- ресурсы, ограничения и сроки
- признаки спроса или интереса
- личные критерии выбора
output:
- один рабочий фокус
- критерии выбора
- первый тест гипотезы
---

# Выбор продукта

Выбор продукта нужен не тогда, когда идей мало, а когда их слишком много. Пока все варианты остаются “почти главными”, ни один из них не получает достаточно внимания, чтобы стать реальной проверкой спроса.

Хороший выбор продукта — это не приговор остальным идеям. Это решение, какую гипотезу проверять первой, по каким критериям и каким минимальным действием.

Смысл выбора — не найти идеальный вариант в вакууме, а перестать жить в режиме вечной примерки будущего. Один фокус, один тест, один критерий: продолжать, менять или закрывать.
