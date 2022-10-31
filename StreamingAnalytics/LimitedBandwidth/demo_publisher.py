#!/usr/bin/env python3

# Copyright (c) 2022 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.
# Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Software AG


import paho.mqtt.client as mqtt
import json
import random
import time
import argparse


if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument('--host', dest='broker', type=str, default='localhost', help='The hostname where the MQTT broker is running.')
	parser.add_argument('--port', dest='port', type=int, default=1883, help='The MQTT broker port to connect to.')
	args = parser.parse_args()
	
	mqttClient = mqtt.Client("Demo-measurements")

	def on_publish(client, userdata, result):
			pass

	def on_connect(client, userdate, flags, rc):
			print("Connected to MQTT broker on " + args.broker + " with result {0}".format(rc))

	mqttClient.on_connect = on_connect
	mqttClient.on_publish = on_publish
	mqttClient.connect(args.broker, args.port)

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
