#!/usr/bin/python3
# coding=utf-8
import sys
from paho.mqtt import client as mqtt_client
from c8ydp import DeviceProxy
import os
import logging
import time

is_close = False
jwt = ''


broker = 'localhost'
port = 1883
client_id = 'remote-access-client'


##This function is called as soon as a message appears on the broker. We are waiting for a jwt token, that is delivered on c8y/s/dat and begins with 71. The string after 71, is the jwt token that is used.
def on_message(client, userdata, msg):  # The callback for when a PUBLISH message is received from the server.
    global jwt
    message = msg.payload.decode('UTF-8').split(',')[0]
    #logger.info("Message received-> " + msg.topic + " " + str(msg.payload))  # Print a received msg
    if message == '71':
        jwt = msg.payload.decode('UTF-8').split(',')[1]
    

client = mqtt_client.Client(client_id)
client.on_message = on_message
client.connect(broker, port)

## Subscribing to the topic for the jwt token
client.subscribe('c8y/s/dat')

## Triggering the jwt token creation on c8y side
client.publish('c8y/s/uat','')
client.loop_start()

## Unless there is no jwt token, wait before going on.
while len(jwt)==0:
    time.sleep(1)

## tedge_mapper initiates this script with the argument of the smartrest payload. We split that and extract the needed information.
host = sys.argv[1].split(',')[2]
port= sys.argv[1].split(',')[3]
connectionKey= sys.argv[1].split(',')[4]

## Is needed to keep connection open until the websocket window is closed. If closed, is_closed will be true and while loop and the end exits.
def on_close_handler(close_status, close_reason):
    global is_close
    is_close = True
    client.disconnect()


client.publish('c8y/s/us','501,c8y_RemoteAccessConnect')
device_proxy = DeviceProxy(host, int(port), None, connectionKey, 'mqtt.eu-latest.cumulocity.com', None, None, jwt, on_close_handler)

try:
    device_proxy.connect()
    client.publish('c8y/s/us',f'503,c8y_RemoteAccessConnect')
except Exception as ex:
    client.publish('c8y/s/us',f'502,c8y_RemoteAccessConnect,{ex}')


while not is_close:
    time.sleep(1)
