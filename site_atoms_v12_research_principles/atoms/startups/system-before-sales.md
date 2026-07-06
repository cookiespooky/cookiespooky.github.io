---
id: system-before-sales
title: Система вместо продаж
slug: system-before-sales
kind: pattern
hub: topics
summary: Паттерн, в котором человек строит инфраструктуру до проверки спроса и живого
  контакта с рынком.
status: public
links:
- id: hypothesis-testing
  rel: uses
- id: mvp
  rel: uses
- id: false-preparation
  rel: related_to
- id: repeating-scenarios
  rel: related_to
- id: technical-spec-from-idea
  rel: balances
- id: ai-product-prototype
  rel: leads_to
- id: build-trap
  rel: example_of
- id: demand-validation
  rel: counterbalance
- id: concierge-mvp
  rel: alternative
actions:
- label: Найти ближайшую проверку
  target: hypothesis-testing
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Сократить инфраструктуру
  target: hypothesis-testing
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Связать с повторяющимся сценарием
  target: hypothesis-testing
  help: Поможет уточнить контекст и перейти к следующему связанному понятию.
- label: Собрать минимальный прототип
  target: lead-ai-mvp-build
  help: Поможет не строить космодром до проверки, есть ли вообще ракета.
- label: Проверить, не строю ли лишнее
  target: lead-startup-diagnostic
  help: Поможет отличить нужную разработку от избегания проверки спроса.
seo:
  title: Система вместо продаж
  description: Паттерн, в котором человек строит инфраструктуру до проверки спроса
    и живого контакта с рынком.
---

# Система вместо продаж

Паттерн, в котором человек строит инфраструктуру до проверки спроса и живого контакта с рынком.

Связанные элементы графа: [[hypothesis-testing|Проверка гипотез]], [[mvp|MVP]], [[false-preparation|Подготовка вместо действия]], [[repeating-scenarios|Повторяющиеся сценарии]].

## Связи

- [[hypothesis-testing]] — uses
- [[mvp]] — uses
- [[false-preparation]] — related_to
- [[repeating-scenarios]] — related_to

## Следующие действия

- **Найти ближайшую проверку** → [[hypothesis-testing]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Сократить инфраструктуру** → [[hypothesis-testing]]: Поможет уточнить контекст и перейти к следующему связанному понятию.
- **Связать с повторяющимся сценарием** → [[hypothesis-testing]]: Поможет уточнить контекст и перейти к следующему связанному понятию.


## Дополнение: стартап-маршрут

Сценарий системы до продаж связан с [[build-trap]], [[demand-validation]] и [[concierge-mvp]].
