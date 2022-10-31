#!/usr/bin/env python3

# Copyright (c) 2022 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.
# Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Software AG

import psutil
import paho.mqtt.client as mqtt
import time
import argparse

if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument('--host', dest='broker', type=str, default='localhost', help='The hostname where the MQTT broker is running.')
	parser.add_argument('--port', dest='port', type=int, default=1883, help='The MQTT broker port to connect to.')
	args = parser.parse_args()
	

	mqttClient = mqtt.Client("Resource-monitor")

	def on_publish(client,userdata,result):  #create function for callback
		print("data published \n")

	def on_connect(client, userdate, flags, rc):
		print("Connected to MQTT broker on " + args.broker + " with result {0}".format(rc))

	mqttClient.on_connect = on_connect
	mqttClient.on_publish = on_publish
	mqttClient.connect(args.broker, args.port)

	# Junk call to psutil.cpu_percent() - see https://psutil.readthedocs.io/en/latest/#psutil.cpu_percent
	psutil.cpu_percent()

	while True:
		cpuPercent = psutil.cpu_percent()
		# the results from psutil.virtual_memory() refer to the virtual_memory excluding swap_space
		# which essentially means the resident_memory. For more details refer the docs for module 'psutil'
		memPercent = psutil.virtual_memory().percent
		timestamp = f'{time.time():.3f}'
		
		mqttClient.publish('collectd/thin-edge/cpu/percent-active', timestamp + ":" + str(cpuPercent))
		mqttClient.publish('collectd/thin-edge/mem/percent-used', timestamp + ":" + str(memPercent))
		time.sleep(5)


