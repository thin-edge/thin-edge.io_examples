import time
import paho.mqtt.client as mqtt
import os

from mongo import Mongo


#MQTT_BROKER = "mosquitto"
#MQTT_PORT = 1883

MQTT_BROKER = os.environ['MQTT_BROKER']
MQTT_PORT = int(os.environ['MQTT_PORT'])
MQTT_KEEPALIVE = 60
MQTT_QOS = 2
MQTT_TOPICS = ("c8y/#",)  # Array of topics to subscribe; '#' subscribe to ALL available topics

#MQTT_BROKER = os.getenv("MQTT_BROKER", MQTT_BROKER)
#MQTT_PORT = os.getenv("MQTT_PORT", MQTT_PORT)
#MQTT_KEEPALIVE = os.getenv("MQTT_KEEPALIVE", MQTT_KEEPALIVE)
#MQTT_QOS = os.getenv("MQTT_QOS", MQTT_QOS)
#MQTT_TOPICS = os.getenv("MQTT_TOPICS", MQTT_TOPICS)  # As ENV, comma separated
if isinstance(MQTT_TOPICS, str):
    MQTT_TOPICS = [e.strip() for e in MQTT_TOPICS.split(",")]


class MQTT(object):
    def __init__(self, mongo: Mongo):
        self.mongo: Mongo = mongo
        self.mqtt_client = mqtt.Client()
        self.mqtt_client.on_connect = self.on_connect
        self.mqtt_client.on_message = self.on_message
        self.mqtt_client.on_disconnect = self.on_disconnect
        self.mqtt_client.connected_flag=False #set flag initially
        self.mqtt_client.bad_connection_flag=False #set flag

    # noinspection PyUnusedLocal
    @staticmethod
    def on_connect(client: mqtt.Client, userdata, flags, rc):
        if rc==0:
            client.connected_flag=True #set flag
            print("connected OK Returned code=",rc)
            for topic in MQTT_TOPICS:
                client.subscribe(topic, MQTT_QOS)
        #client.subscribe(topic)
        else:
            print("Bad connection Returned code= ",rc)
            print("Connected MQTT")
            client.bad_connection_flag=True #set flag

    # noinspection PyUnusedLocal
    @staticmethod
    def on_disconnect(client: mqtt.Client, userdata, flags, rc=0):
        print("Disconnected flags" + "result code " + str(rc) + "client_id")
        client.connected_flag=False #set flag

    # noinspection PyUnusedLocal
    def on_message(self, client: mqtt.Client, userdata, msg: mqtt.MQTTMessage):
        # print("Rx MQTT")
        self.mongo.save(msg)

    def run(self):
        print('Running MQTT', MQTT_BROKER, MQTT_PORT)
        try:
            self.mqtt_client.connect(MQTT_BROKER, MQTT_PORT, MQTT_KEEPALIVE)
            while not self.mqtt_client.connected_flag and not self.mqtt_client.bad_connection_flag: #wait in loop
                time.sleep(2)
                print ("New attempt:" + str(time))
        except:
            print ("Connection failed")       
        self.mqtt_client.loop_start()

    def stop(self):
        print("Stopping MQTT")
        self.mqtt_client.loop_stop()
        self.mqtt_client.disconnect()
