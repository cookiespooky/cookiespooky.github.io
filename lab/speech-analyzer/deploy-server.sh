#!/usr/bin/env bash
# Выкладка анализатора речи на свой сервер (194.58.100.5, reg.ru; до 3.11 — Beget 45.90.33.166) — вместо функции в Yandex Cloud (deploy.sh), с 2026-10-12.
#
#   ./deploy-server.sh            # обновить код и перезапустить службу
#   ./deploy-server.sh --pervyy   # первый раз: пользователь, каталоги, ключ, служба, адрес в nginx
#
# Служба speech-analyzer: /opt/speech-analyzer, пользователь speechan, слушает 127.0.0.1:8097.
# Наружу — https://assistant.antonlozhkin.ru/analiz-rechi: одна location в nginx-сайте assistant (своего домена и
# сертификата у анализатора нет; остальные адреса ассистента не тронуты). Ключ DeepSeek лежит в /etc/speech-analyzer/env
# и при первой выкладке копируется на самом сервере из /srv/assistant/.env — в этот скрипт и на экран он не попадает.
set -euo pipefail

HOST="${HOST:-root@194.58.100.5}"
KEY="${KEY:-$HOME/.ssh/regru_main}"
DIR=/opt/speech-analyzer
PORT=8097
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# одно соединение на весь прогон: fail2ban на сервере читает пачку подключений как подбор пароля
SSH_OPTS=(-i "$KEY" -o BatchMode=yes -o ConnectTimeout=15 -o ControlMaster=auto -o "ControlPath=/tmp/speech-ssh-%r@%h" -o ControlPersist=120)
run() { ssh "${SSH_OPTS[@]}" "$HOST" "$@"; }

node --check "$SRC/index.js"
node --check "$SRC/server.js"

if [[ "${1:-}" == "--pervyy" ]]; then
  run "set -e
    id speechan >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin speechan
    mkdir -p $DIR /etc/speech-analyzer
    if [ ! -s /etc/speech-analyzer/env ]; then
      grep -m1 '^DEEPSEEK_API_KEY=' /srv/assistant/.env > /etc/speech-analyzer/env
      echo 'PORT=$PORT' >> /etc/speech-analyzer/env
    fi
    chown root:speechan /etc/speech-analyzer/env && chmod 640 /etc/speech-analyzer/env
    cat > /etc/systemd/system/speech-analyzer.service <<'UNIT'
[Unit]
Description=Speech analyzer (antonlozhkin.ru/tools/analiz-rechi)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=speechan
WorkingDirectory=$DIR
EnvironmentFile=/etc/speech-analyzer/env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT
    systemctl daemon-reload
    systemctl enable speech-analyzer >/dev/null 2>&1
    N=/etc/nginx/sites-available/assistant; [ -f \$N ] || N=/etc/nginx/sites-enabled/assistant
    if ! grep -q 'location = /analiz-rechi' \$N; then
      cp -p \$N /root/assistant.nginx.before-speech-analyzer
      python3 - \$N <<'PY'
import sys
p = sys.argv[1]; s = open(p, encoding='utf-8').read()
block = '''    # Анализатор речи (site/lab/speech-analyzer, служба speech-analyzer) — отдельная служба под адресом этого сайта.
    location = /analiz-rechi {
        proxy_pass http://127.0.0.1:8097/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_read_timeout 90s;
        client_max_body_size 8k;
    }

'''
mark = '    # Ответ модели идёт потоком'
assert s.count(mark) == 1, 'не нашёл место в конфиге nginx'
open(p, 'w', encoding='utf-8').write(s.replace(mark, block + mark))
PY
      if ! nginx -t 2>/dev/null; then cp -p /root/assistant.nginx.before-speech-analyzer \$N; echo 'nginx -t не прошёл — конфиг возвращён' >&2; exit 1; fi
    fi"
fi

rsync -az -e "ssh ${SSH_OPTS[*]}" "$SRC/index.js" "$SRC/server.js" "$SRC/package.json" "$HOST:$DIR/"
run "chown -R root:root $DIR && chmod 755 $DIR && chmod 644 $DIR/* && systemctl restart speech-analyzer && sleep 1 && systemctl is-active speech-analyzer"
[[ "${1:-}" == "--pervyy" ]] && run "nginx -t 2>&1 | tail -1 && systemctl reload nginx"
echo "Проверка:"
curl -s -m 20 -o /dev/null -w "  https://assistant.antonlozhkin.ru/analiz-rechi → %{http_code}\n" https://assistant.antonlozhkin.ru/analiz-rechi
