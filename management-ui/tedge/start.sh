#!/bin/sh
[ -f /app/tedge/tedge-ui-env ] && . /app/tedge/tedge-ui-env

if [ -z "$MONGO_HOST" ] &&   [ -z "$MONGO_PORT" ];  then
  echo "MONGO_HOST or MONGO_PORT are not set, please set it in /app/tedge/tedge-ui" >&2
  exit 1
fi

exec node /app/tedge/backend/server.js