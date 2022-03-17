#!/usr/bin/python3
# coding=utf-8
import sys
from paho.mqtt import client as mqtt_client
import os

broker = 'localhost'
port = 8883
topic = "/python/mqtt"
client_id = f'lkjashflkagfljkagsflkjafglkagsf'


command = sys.argv[1].split(',')[2]
client = mqtt_client.Client(client_id)
client.connect(broker, port)


client.publish('c8y/s/us','501,c8y_Command')
stream = os.popen(f'{command}')
output = stream.read()
print(output)
client.publish('c8y/s/us',f'503,c8y_Command,"{output}"')
