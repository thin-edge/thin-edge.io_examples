#!/usr/bin/python3
# coding=utf-8
import logging

logger = logging.getLogger(__name__)
logFile = f'/var/log/c8y_NodeRed.log'
logging.basicConfig(level=log  ging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger.info(f'Logger for {__name__} was initialised')

import sys
import base64
from api import Connector
from paho.mqtt import client as mqtt_client
import json

broker = 'localhost'
port = 1883
client_id = f'{__name__}-operation-client'

url = 'http://localhost:1880'

logger.debug(f'Using the following local for mqtt: {url}')
logger.debug(f'Using the following client_id for mqtt: {client_id}')

try:
    array = sys.argv[1].split(",")
    logger.debug(f'Received the following data: {array}')
    
    data = base64.b64decode(array[2]).decode('utf-8')
    logger.debug(f'Got decoded data: {data}')
    c8yFlowId = array[4]
    logger.debug(f'Got c8yFlowId: {c8yFlowId}')
    type = array[3]
    logger.debug(f'Got type: {type}')
    localFlowId = array[5]
    logger.debug(f'Got localFlowId: {localFlowId}')

    client = mqtt_client.Client(client_id)
    client.connect(broker, port)
    client.publish('c8y/s/us',f'501,{__name__}')
    nodeRed = Connector(url)
    logger.debug("Checking if node-red is runnning locally")
    logger.debug(nodeRed.check_node_red())
    if nodeRed.check_node_red():
        logger.debug("Node-red is running")
        logger.debug("Checking if flowId already exists in runtime")
        if type == 'update':
            logger.info(f'Flow {localFlowId} does already exist, updating.')
            logger.debug(f'Using the following data to create flow: {data}')
            if(nodeRed.update_flow(localFlowId,data)):
                logger.debug("Flow uddated")
            else:
                logger.debug("Flow not updated.")
                raise Exception
        elif type == 'remove':
            logger.info(f'Flow {localFlowId} will be delted.')
            if(nodeRed.delete_flow(localFlowId)):
                logger.debug("Flow deleted")
            else:
                logger.debug("Flow not deleted")
                raise Exception
        elif type == 'create':
            logger.info("FlowId does not exist, creating it.")
            logger.debug(f'Using the following data to create flow: {data}')
            response = nodeRed.create_flow(data)
            if response:
                localFlowId = json.loads(response)['id']
                client.publish(f'c8y/s/uc/node-red/{c8yFlowId}',f'11,{c8yFlowId},{response}')
                logger.debug("Flow created")
            else:
                logger.debug("Flow not created")
                raise Exception
    else:
        logger.warning("Node-red is not running")
        client.publish('c8y/s/us',f'502,{__name__},"Error: Node-Red not running."')
    client.publish('c8y/s/us',f'503,{__name__},')
except Exception as e:
    try:
        client.publish('c8y/s/us',f'502,{__name__},"Error: {e}"')
    except Exception as e:
        logger.debug(f'Aborting due to error: {e}')
