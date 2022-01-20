#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import json
import random
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
    event['temperature'] = 25.0 + (random.random() * 35.0)
    mqttClient.publish('sensors/temperature', json.dumps(event, default=str))
    event = {}
    event['pressure'] = 0.5 + random.random()
    mqttClient.publish('sensors/pressure', json.dumps(event, default=str))
    event = {}
    event['vibration'] = 1000.0 + (random.random() * 500.0)
    mqttClient.publish('sensors/vibration', json.dumps(event, default=str))

    time.sleep(1)
