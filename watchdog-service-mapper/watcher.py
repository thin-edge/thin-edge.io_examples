#!/usr/bin/python3
# coding=utf-8
import sys
from paho.mqtt import client as mqtt_client

import time
import logging
import json
import os

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger.info('Logger for service watchdog mapper was initialised')


broker = 'localhost'
port = 1883
client_id = 'watchdog-service-mapper-client'
stream = os.popen(f'tedge config get device.id')
device_id = f'{stream.read()}'.strip()


client = mqtt_client.Client(client_id)

def on_message(client, userdata, msg):
    try:
        message = json.loads(msg.payload)

        name = msg.topic.split("/")[-1]
        logger.debug(f'Name is: {name}')

        logger.debug(f'device_id is {device_id}')

        service = "systemd"
        logger.debug(f'Service is: {service}')

        status = message['status']
        logger.debug(f'Status is: {status}')
        #Publishing message
        payload = f'102,{device_id}_{name},{service},{name},{status}'
        logger.debug(f'Sending the following payload: {payload}')
        client.publish("c8y/s/us",f'{payload}')
    except Exception as e:
        logger.error(f'The following error occured: {e}, skipping message')

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    pass

def on_disconnect(client, userdata, rc):
    if rc != 0:
        logger.warning("Unexpected MQTT disconnection. Will auto-reconnect")
    pass

client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect

if __name__== "__main__":
    try:
        logger.info("Starting")
        while True:
            client.connect(broker, port)
            client.subscribe("tedge/health/#")
            client.loop_forever()
    except KeyboardInterrupt:
        sys.exit(1)
    except Exception as e:
        logger.error(f'The following error occured: {e}')
    finally:
        client.disconnect()
