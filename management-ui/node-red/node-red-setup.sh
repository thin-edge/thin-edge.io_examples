#!/usr/bin/env bash

if [ ! -f /service/node-red-init.flag ]; then
    echo "Init Node-Red"
    curl -d '[
    {
        "id": "f6f2187d.f17ca8",
        "type": "tab",
        "label": "Flow 1",
        "disabled": false,
        "info": ""
    },
    {
        "id": "e9738faf9b0558bb",
        "type": "mqtt-broker",
        "name": "thin-edge-setup.io",
        "broker": "thin-edge-setup.io",
        "port": "8883",
        "clientid": "",
        "autoConnect": true,
        "usetls": false,
        "protocolVersion": "4",
        "keepalive": "60",
        "cleansession": true,
        "birthTopic": "",
        "birthQos": "0",
        "birthPayload": "",
        "birthMsg": {},
        "closeTopic": "",
        "closeQos": "0",
        "closePayload": "",
        "closeMsg": {},
        "willTopic": "",
        "willQos": "0",
        "willPayload": "",
        "willMsg": {},
        "userProps": "",
        "sessionExpiry": ""
    },
    {
        "id": "3cc11d24.ff01a2",
        "type": "comment",
        "z": "f6f2187d.f17ca8",
        "name": "WARNING: please check you have started this container with a volume that is mounted to /data\\n otherwise any flow changes are lost when you redeploy or upgrade the container\\n (e.g. upgrade to a more recent node-red docker image).\\n  If you are using named volumes you can ignore this warning.\\n Double click or see info side panel to learn how to start Node-RED in Docker to save your work",
        "info": "\nTo start docker with a bind mount volume (-v option), for example:\n\n```\ndocker run -it -p 1880:1880 -v /home/user/node_red_data:/data --name mynodered nodered/node-red\n```\n\nwhere `/home/user/node_red_data` is a directory on your host machine where you want to store your flows.\n\nIf you do not do this then you can experiment and redploy flows, but if you restart or upgrade the container the flows will be disconnected and lost. \n\nThey will still exist in a hidden data volume, which can be recovered using standard docker techniques, but that is much more complex than just starting with a named volume as described above.",
        "x": 350,
        "y": 80,
        "wires": []
    },
    {
        "id": "4789764e57efdc5d",
        "type": "mqtt in",
        "z": "f6f2187d.f17ca8",
        "name": "",
        "topic": "c8y/#",
        "qos": "2",
        "datatype": "auto-detect",
        "broker": "e9738faf9b0558bb",
        "nl": false,
        "rap": true,
        "rh": 0,
        "inputs": 0,
        "x": 190,
        "y": 220,
        "wires": [
            [
                "9b34e20a89459a50"
            ]
        ]
    },
    {
        "id": "9b34e20a89459a50",
        "type": "debug",
        "z": "f6f2187d.f17ca8",
        "name": "debug 1",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 420,
        "y": 220,
        "wires": []
    }
]' -H "Content-Type: application/json" -X POST http://node-red:1880/flows
    touch /service/node-red-init.flag
else
    echo "Node-Red already initialized"
fi
