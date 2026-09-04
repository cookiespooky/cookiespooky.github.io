# YCF graph-runtime

Эта функция выносит генерацию статьи по подграфу в Yandex Cloud Functions и может работать в двух режимах:

- обычный HTTP JSON endpoint;
- realtime stream через Yandex API Gateway WebSocket.

## Что деплоится

- `index.js` — HTTP handler для YCF.
- `data/site-graph.json` — нормализованный граф, тот же, что использует фронт.
- `prompts/system-prompt.md` — системный промпт для модели.

## Почему это помещается в free tier

По состоянию на 2026-07-07 у Yandex Cloud Functions есть free tier:

- 1,000,000 invocations в месяц.
- 10 GB x hour исполнения в месяц.

Практически это означает:

- при `128 MB` и `20 s` на запрос: около `14,400` запросов в месяц до выхода за `10 GB x hour`;
- при `128 MB` и `45 s` на запрос: около `6,400` запросов в месяц;
- при `256 MB` и `20 s` на запрос: около `7,200` запросов в месяц.

Поэтому для этой функции стартовая настройка должна быть:

- `memory=128m`
- `timeout=45s`
- без provisioned instances
- c WebSocket API Gateway для realtime stream

## Что отдается наружу

- `https://functions.yandexcloud.net/<function-id>` — обычный HTTP endpoint для `POST /`.
- `wss://<gateway-domain>.apigw.yandexcloud.net/ws` — realtime stream transport.

Фронт сохраняет тот же контракт событий:

- `start`
- `delta`
- `phase`
- `meta`
- `done`

## Сборка

```bash
./ycf/graph-runtime/build.sh
```

Результат:

```text
ycf/graph-runtime/graph-runtime.zip
```

## Деплой

Требования:

- установлен и инициализирован `yc`
- доступ к нужной папке Yandex Cloud
- выставлен `DEEPSEEK_API_KEY`

Пример:

```bash
export DEEPSEEK_API_KEY=...
./ycf/graph-runtime/deploy.sh
```

Опционально:

```bash
export YCF_FUNCTION_NAME=np-personal-graph-runtime
export YCF_MEMORY=128m
export YCF_TIMEOUT=45s
./ycf/graph-runtime/deploy.sh
```

## Подключение к сайту

После деплоя нужно взять публичный HTTPS URL функции и websocket URL gateway:

```yaml
graph_endpoint: https://<function-url>
graph_stream_endpoint: wss://<gateway-domain>.apigw.yandexcloud.net/ws
```

Если `graph_stream_endpoint` не задан, фронт работает через обычный JSON endpoint.

## GitHub Actions deploy

Workflow `.github/workflows/backend-runtime-deploy.yml` ожидает два секрета:

- `DEEPSEEK_API_KEY`
- `YC_SA_JSON_CREDENTIALS`

`YC_SA_JSON_CREDENTIALS` должен содержать JSON-ключ service account с правами на деплой функции и gateway.
