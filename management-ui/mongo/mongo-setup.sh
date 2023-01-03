#!/usr/bin/env bash

if [ ! -f /data/mongo-init.flag ]; then
    echo "Init replicaset"
    mongosh mongodb://mongodb1:27017/localDB mongo-setup.js
    touch /data/mongo-init.flag
else
    echo "Replicaset already initialized"
fi
