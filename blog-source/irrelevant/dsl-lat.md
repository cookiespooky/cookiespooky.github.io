---
type: article
title: "DSL: Linguistic Agency Transformation"
slug: dsl-lat
description: Формальный DSL LAT для анализа агента, действия, модальности, наблюдаемости и режима высказывания.
draft: false
noindex: false
---

# DSL: Linguistic Agency Transformation

DSL LAT — это формальный язык описания высказывания.

Его задача — превратить обычную фразу в структуру, с которой может работать человек, интерфейс или программа.

## Общая модель

```text
input(statement)
  → parse()
  → detect()
  → classify()
  → transform()
  → output(actionable_statement)
```

## Базовые сущности

### Statement

```json
{ "text": "Надо что-то менять" }
```

### Agent

```json
{
  "type": "explicit | implicit | absent",
  "value": "я | мы | null"
}
```

Агент отвечает на вопрос: **кто действует?**

### Action

```json
{
  "type": "present | absent | abstract",
  "verb": "пишу | выбираю | null"
}
```

Действие отвечает на вопрос: **что именно происходит?**

### Modality

```json
{
  "type": "external | internal | undefined",
  "markers": ["надо", "хочу", "решаю"]
}
```

Модальность показывает, откуда исходит импульс: снаружи или изнутри.

### Observability

```json
{ "level": "0..2" }
```

- 0 — «что-то менять»;
- 1 — «начать делать»;
- 2 — «написать 1 сообщение клиенту сегодня».

## Режимы высказывания

```text
mode =
  action      // есть агент и действие
  intention   // есть желание, но нет действия
  reflection  // описание без действия
  avoidance   // уход от агентности
```

## Правила трансформации

### Добавить агента

```text
IF agent.type == absent
THEN insert("я")
```

### Заменить внешнюю модальность

```text
IF modality.type == external
THEN replace_with_internal()
```

Пример:

```text
надо сделать → я делаю
```

### Конкретизировать действие

```text
IF action.type != present
THEN define_observable_action()
```

### Повысить наблюдаемость

```text
WHILE observability.level < 2
  → уточнить действие
```

## Пример

Вход:

```text
Надо что-то менять.
```

Детекция:

```text
agent: absent
action: abstract
modality: external
observability: 0
mode: avoidance
```

Трансформация:

```text
Я пишу одному клиенту сегодня.
```

## Минимальный API

```javascript
analyze(statement) → {
  agent,
  action,
  modality,
  observability,
  mode
}

transform(statement) → {
  variants: [neutral, direct, radical],
  recommended: actionable_statement
}
```

## Зачем нужен DSL

DSL нужен, чтобы LAT не оставался метафорой. Он делает язык объектом вычисления: высказывание можно разобрать, классифицировать, сравнить, трансформировать и встроить в продукт.

## Главное правило

> Нет агента → нет действия.  
> Нет действия → нет изменения.

Связанные страницы:

- [[agentnost-i-rezhim-vyskazyvaniya-kak-bazovyi-sloy-analiza-rechi|White Paper LAT]]
- [[lat-use-cases|Области применения LAT]]
- [[lat-for-positioning|LAT для позиционирования эксперта]]

---
## Связанные страницы

- [[home|Антон Ложкин]] — вернуться к общей карте проектов и смыслов.
- [[lat-old|LAT — лингвистический анализ мышления]] — перейти к языковому анализу мышления и агентности.
- [[agentnost-i-rezhim-vyskazyvaniya-kak-bazovyi-sloy-analiza-rechi|Агентность и режим высказывания как базовый слой анализа речи]] — прочитать развернутое теоретическое основание LAT.
- [[marketing-os-old|Marketing OS — локальная операционная система маркетинга]] — перейти к системе производства и публикации контента.
- [[content-system|Контент-система для соцсетей]] — перейти к системе контента для соцсетей.
- [[seo-fabric|SEO-фабрика]] — связать публикацию с SEO-производством.

