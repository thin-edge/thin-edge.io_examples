#!/usr/bin/env python3

# Copyright (c) 2022 Cumulocity GmbH, Duesseldorf, Germany and/or its affiliates and/or their licensors.
# Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Cumulocity GmbH.

# This python script is just for the sake of testing and does not provide real temperature readings.
import argparse
import json
import random
import time
from datetime import datetime
import paho.mqtt.client as mqtt

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--host",
        dest="broker",
        type=str,
        default="localhost",
        help="The hostname where the MQTT broker is running.",
    )
    parser.add_argument(
        "--port",
        dest="port",
        type=int,
        default=1883,
        help="The MQTT broker port to connect to.",
    )
    args = parser.parse_args()

    mqttClient = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "Low-latency")

    def on_publish(_client, _userdata, _result):  # create function for callback
        print("data published")

    def on_connect(_client, _userdata, _flags, rc):
        print("Connected to mosquitto " + args.broker + " with result {0}".format(rc))

    mqttClient.on_connect = on_connect
    mqttClient.on_publish = on_publish
    mqttClient.connect(args.broker, args.port)

    while True:
        now = datetime.now()
        data = {}
        data["time"] = now

        temp = random.uniform(0, 150)
        data["temperature"] = temp

        mqttClient.publish("sensors/temperature", json.dumps(data, default=str))
        time.sleep(0.5)
