---
id: baseline-state
title: Базовое состояние
slug: baseline-state
kind: concept
hub: tools
summary: Базовое состояние описывает обычный уровень энергии, внимания, настроения и нагрузки,
  от которого удобно замечать отклонения.
status: public
links:
- id: state-log
  rel: produces
- id: energy-tracking
  rel: related_to
- id: attention-tracking
  rel: related_to
- id: self-tracking-signals
  rel: uses
- id: intervention-log
  rel: related_to
actions:
- label: Определить базовую линию
  target: state-log
  help: Поможет сравнивать состояние не с идеалом, а с собственным обычным уровнем.
- label: Связать с изменениями
  target: intervention-log
  help: Поможет понять, какие действия действительно меняют состояние.
- label: Настроить наблюдение
  target: lead-self-tracking-setup
  help: Поможет выбрать простые показатели базового состояния.
seo:
  title: Базовое состояние
  description: Базовое состояние описывает обычный уровень энергии, внимания, настроения и нагрузки,
    от которого удобно замечать отклонения.
---

# Базовое состояние

Базовое состояние — личная точка отсчета. Оно описывает, как обычно выглядят энергия, внимание, настроение и нагрузка, когда нет сильного провала или подъема.

Без базовой линии сложно понять, что именно изменилось. Наблюдение начинает путать обычное состояние, временную усталость и устойчивый сдвиг.

Связанные элементы графа: [[state-log]], [[energy-tracking]], [[attention-tracking]], [[self-tracking-signals]], [[intervention-log]].

## Связи

- [[state-log]] — produces
- [[energy-tracking]] — related_to
- [[attention-tracking]] — related_to
- [[self-tracking-signals]] — uses
- [[intervention-log]] — related_to

## Следующие действия

- **Определить базовую линию** → [[state-log]]: Поможет сравнивать состояние не с идеалом, а с собственным обычным уровнем.
- **Связать с изменениями** → [[intervention-log]]: Поможет понять, какие действия действительно меняют состояние.
- **Настроить наблюдение** → [[lead-self-tracking-setup]]: Поможет выбрать простые показатели базового состояния.
