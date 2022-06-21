#!/usr/bin/python3
# coding=utf-8
import sys
import configparser
from os import path,makedirs
from paho.mqtt import client as mqtt_client

import time
from watchdog.observers.polling import PollingObserver as Observer
from watchdog.events import LoggingEventHandler


broker = 'localhost'
port = 1883
client_id = 'toml-reader-client'
base_dir='/etc/tedge/'
config_file = f'{base_dir}tedge.toml'
base_topic='config/'

client = mqtt_client.Client(client_id)

 
def on_modified(event):
    config = configparser.ConfigParser()
    config.read(config_file)
    client.connect(broker, port)
    for i in config.sections():
        for key in config[i]:
            topic = f'{base_topic}{i}'
            payload = f'{key}={config[i][key]}'
            client.publish(topic,payload,retain=True)
    client.disconnect


if __name__ == "__main__":
    try:
        if not path.exists(config_file):
            time.sleep(1)
        my_event_handler = LoggingEventHandler()
        my_event_handler.on_modified = on_modified
        my_observer = Observer()
        my_observer.schedule(my_event_handler, config_file, recursive=False)
        my_observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            my_observer.stop()
            my_observer.join()
    except Exception as e:
            print(e)   
