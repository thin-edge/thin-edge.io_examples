#!/usr/bin/python3
# coding=utf-8
import logging

logger = logging.getLogger(__name__)
logFile = f'/var/log/{__name__}.log'
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger.info(f'Logger for {__name__} was initialised')

import sys
import base64
from api import Connector
from paho.mqtt import client as mqtt_client

broker = 'localhost'
port = 1883
client_id = f'{__name__}-operation-client'

url = 'http://localhost:1880'

logger.debug(f'Using the following local for mqtt: {url}')
logger.debug(f'Using the following client_id for mqtt: {client_id}')

try:
    array = sys.argv[1].split(",")
    logger.debug(f'Received the following data: {array}')
    
    data = base64(array[2]).decode('utf-8')
    flowId = array[3]
    type = array[4]

    client = mqtt_client.Client(client_id)
    client.connect(broker, port)
    client.publish('c8y/s/us',f'501,{__name__}')
    nodeRed = Connector(url)
    logger.debug("Checking if node-red is runnning locally")
    logger.debug(nodeRed.check_node_red())
    if nodeRed.check_node_red():
        logger.debug("Node-red is running")
        logger.debug("Checking if flowId already exists in runtime")
        if nodeRed.get_flow(flowId):
            logger.info(f'Flow {flowId} does already exist, updating.')
            logger.debug(f'Using the following data to create flow: {data}')
            nodeRed.update_flow(flowId,data)
            logger.debug("Flow udpdated")
        else:
            logger.info("FlowId does not exist, creating it.")
            logger.debug(f'Using the following data to create flow: {data}')
            nodeRed.create_flow(data)
            logger.debug("Flow created")
    else:
        logger.warning("Node-red is not running")
        client.publish('c8y/s/us',f'502,{__name__},"Error: Node-Red not running."')
    client.publish('c8y/s/us',f'503,{__name__},')
except Exception as e:
    try:
        client.publish('c8y/s/us',f'502,{__name__},"Error: {e}"')
    except Exception as e:
        logger.debug(f'Aborting due to error: {e}')
