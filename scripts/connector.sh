#!/bin/bash
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379

USER_EXISTS=$(/usr/bin/redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" EXISTS "$common_name");
USER_INACTIVE=$(/usr/bin/redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" GET "$common_name");
TIMESTAMP=$(date +%s)

if [ "$USER_EXISTS" -eq 0 ]; then
    exit 0
elif [ "$USER_INACTIVE" = "inactive" ]; then
    exit 0
elif [ -n "$USER_INACTIVE" ] && [ "$TIMESTAMP" -lt "$USER_INACTIVE" ]; then
    /usr/bin/redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" SET "$common_name" "inactive"
    exit 0
else
    exit 1
fi
