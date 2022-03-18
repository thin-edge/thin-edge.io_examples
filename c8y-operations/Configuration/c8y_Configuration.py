#!/usr/bin/python3
# coding=utf-8
import sys
from paho.mqtt import client as mqtt_client

broker = 'localhost'
port = 1883
client_id = 'configuration-operation-client'


config = sys.argv[1].split(',')[2]
client = mqtt_client.Client(client_id)
client.connect(broker, port)
client.publish('c8y/s/us','501,c8y_Configuration')
client.publish('c8y/s/us',f'113,{config}')
###Enter code here for doing somethin with the configuration
client.publish('c8y/s/us','503,c8y_Configuration')
