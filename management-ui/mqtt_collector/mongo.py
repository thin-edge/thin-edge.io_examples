from typing import List
from datetime import datetime
import paho.mqtt.client as mqtt
import pymongo
import pymongo.database
import pymongo.collection
import pymongo.errors
import threading
import os
import json
from flatten_json import flatten

MONGO_HOST = os.environ['MONGO_HOST']
MONGO_PORT = int(os.environ['MONGO_PORT'])
MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"  # mongodb://user:pass@ip:port || mongodb://ip:port
MONGO_DB = "localDB"
MONGO_COLLECTION_MEASUREMENT = "measurement"
MONGO_COLLECTION_SERIES = "serie"
MONGO_TIMEOUT = 1  # Time in seconds


class Mongo(object):
    def __init__(self):
        self.client: pymongo.MongoClient = None
        self.database: pymongo.database.Database = None
        self.collectionMeasurement: pymongo.collection.Collection = None
        self.collectionSeries: pymongo.collection.Collection = None
        self.queue: List[mqtt.MQTTMessage] = list()

    def connect(self):
        print("Connecting Mongo")
        self.client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=MONGO_TIMEOUT*1000.0)
        self.database = self.client.get_database(MONGO_DB)
        self.collectionMeasurement = self.database.get_collection(MONGO_COLLECTION_MEASUREMENT)
        self.collectionSeries = self.database.get_collection(MONGO_COLLECTION_SERIES)

    def disconnect(self):
        print("Disconnecting Mongo")
        if self.client:
            self.client.close()
            self.client = None

    def connected(self) -> bool:
        if not self.client:
            return False
        try:
            self.client.admin.command("ismaster")
        except pymongo.errors.PyMongoError:
            return False
        else:
            return True
    
    def save(self, msg: mqtt.MQTTMessage):
        # print("Saving")
        if msg.retain:
            print("Skipping retained message")
            return
        if self.connected():
            self._store(msg)
        else:
            self._enqueue(msg)

    def _enqueue(self, msg: mqtt.MQTTMessage):
        print("Enqueuing")
        self.queue.append(msg)
        # TODO process queue

    def __store_thread_f(self, msg: mqtt.MQTTMessage):
        # print("Storing")
        try:
            # Check here for payload parsing of measurement
            for y, x in json.loads(msg.payload).items():
                if y == "type":
                    messageType = x
            
            payload = {}
            # initialize time with current time and overwrite with time in payload later
            time = datetime.now()
            try:        
                payload = json.loads(msg.payload)
                # use time from message 
                if time in payload:
                    time = payload.time
            except Exception as ex:
                print("Could not parse payload as json", ex)
                payload = msg.payload

            document = {
                "topic": msg.topic,
                "payload": payload,
                "type": messageType,
                "qos": msg.qos,
                "timestamp": int(time.timestamp()),
                "datetime": time,
            }
            resultMeasurement = self.collectionMeasurement.insert_one(document)

            # update series list
            seriesList = flatten(document['payload'], '_')
            seriesListCleaned = {}
            seriesListCleaned['type'] = document['type']
            seriesListCleaned['datetime'] = time
            for key in seriesList:
                # ignore meta properties, since not relevant for series
                if ( key != 'type' and key != 'time'):
                    # replace existing '.' for '-' to avoid being recognized as objects
                    seriesListCleaned[key.replace(".", "_")] = ""

            for key in seriesList:
                # ignore meta properties, since not relevant for series
                if ( key != 'type' and key != 'time'):
                    # replace existing '.' for '-' to avoid being recognized as objects
                    seriesListCleaned[key.replace(".", "_")] = ""
            
            resultSeries = self.collectionSeries.update_one(  { 'type': document['type']}, { "$set": seriesListCleaned } , True)           
            print("Saved  measurementId/seriesId/modifiedCount:", resultMeasurement.inserted_id,  resultSeries.modified_count)
            if not resultMeasurement.acknowledged:
                # Enqueue message if it was not saved properly
                self._enqueue(msg)
        except Exception as ex:
            print(ex)

    def _store(self, msg):
        th = threading.Thread(target=self.__store_thread_f, args=(msg,))
        th.daemon = True
        th.start()