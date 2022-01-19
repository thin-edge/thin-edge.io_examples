#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import json
import time

mqttClient = mqtt.Client("Demo-measurements")
broker = "localhost"

def on_publish(client, userdata, result):
    pass

def on_connect(client, userdate, flags, rc):
    print("Connected to MQTT broker on " + broker + " with result {0}".format(rc))

mqttClient.on_connect = on_connect
mqttClient.on_publish = on_publish
mqttClient.connect(broker)

while True:
    event = {}
    event['temperature'] = 41.23
    mqttClient.publish('sensors/temperature', json.dumps(event, default=str))
    event = {}
    event['pressure'] = 903.58
    mqttClient.publish('sensors/pressure', json.dumps(event, default=str))
    event = {}
    event['vibration'] = 0.014
    mqttClient.publish('sensors/vibration', json.dumps(event, default=str))

    time.sleep(1)
