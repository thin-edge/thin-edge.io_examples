# This python script is just for the sake of testing and does not provide real temperature readings.
import paho.mqtt.client as mqtt
import time
import random, json
from datetime import datetime

mqttClient = mqtt.Client("Low-latency")
broker = "localhost"


def on_publish(client, userdata, result):  # create function for callback
    print("data published \n")
    pass


def on_connect(client, userdate, flags, rc):
    print("Connected to mosquitto with result {0}".format(rc))


mqttClient.on_connect = on_connect
mqttClient.on_publish = on_publish
mqttClient.connect(broker)

while True:
    now = datetime.now()
    data = {}
    data['time'] = now

    temp = random.uniform(0,150)
    data['temperature'] = temp

    mqttClient.publish('sensors/temperature', json.dumps(data , default = str))
    time.sleep(0.5)
