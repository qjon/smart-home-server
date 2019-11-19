#!/usr/bin/env bash

echo `date "+%Y-%m-%d %H:%M:%S"`;

PORT=API_PORT
NETSTAT=`netstat -nlp | grep $PORT`;

PATH_TO_DIST="PATH_TO_DIST_FOLDER"
LOG_PATH="PATH_TO_STORE_LOG_FILE"

if [[ "$NETSTAT" =~ "$PORT" ]]; then
    echo "Server is running...";
else
    echo "Restarting server..."
    cd $PATH_TO_DIST && /usr/local/bin/node main.js > $LOG_PATH/smart-home-server.log &
fi
