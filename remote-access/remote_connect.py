import logging
import sys
from time import time
from c8ydp.device_proxy import DeviceProxy, WebSocketFailureException
from paho_mqtt_helper import mqtt_helper
import concurrent.futures
import os
import time


logging.basicConfig(filename='remote-access.log',filemode='a',level=logging.DEBUG,format='%(asctime)s %(name)s %(message)s')
logger = logging.getLogger(__name__)
logger.addHandler(logging.StreamHandler(sys.stdout))

def setCommandExecuting(command):
    logger.info('Setting command: '+ command + ' to executing')
    c8y.publish('c8y/s/us','501,'+command)

def setCommandSuccessfull(command):
    logger.info('Setting command: '+ command + ' to successful')
    c8y.publish('c8y/s/us','503,'+command)

def setCommandFailed(command,errorMessage):
    logger.info('Setting command: '+ command + ' to failed cause: ' +errorMessage)
    c8y.publish('c8y/s/us','502,'+command+','+errorMessage)

def on_message(client, obj, msg):
    message = msg.payload.decode('utf-8')
    logger.info("Message Received: " + msg.topic + " " + str(msg.qos) + " " + message)
    if message.startswith('71'):
        fields = message.split(",")
        c8y.token = fields[1]
        logger.info('New JWT Token received')
    if message.startswith('530'):
        fields = message.split(",")
        tcp_host = fields[2]
        tcp_port = int(fields[3])
        connection_key = fields[4]
        logger.info('Received Remote Connect.')
        setCommandExecuting('c8y_RemoteAccessConnect') 
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(remoteConnect,tcp_host,tcp_port,connection_key,'https://'+url )
            return_value = future.result()
            logger.info('Remote Connect Result:' + return_value)
            if return_value.startswith('success'):
                setCommandSuccessfull('c8y_RemoteAccessConnect') 
            else:
                setCommandFailed('c8y_RemoteAccessConnect',return_value)


def on_close_handler(close_status, close_reason):
    logger.info('Remote connection closed Reason: ' + str(close_reason) + ' Status:'  + str(close_status))



def remoteConnect( tcp_host,tcp_port,connection_key,base_url):
    try:
        logger.info('Starting Remote to: ' + str(tcp_host) + ':' + str(tcp_port) + ' Key: ' + str(connection_key) + ' url: ' + str(base_url))
        devProx = DeviceProxy(  tcp_host,
                                tcp_port,
                                65536,
                                connection_key,
                                base_url,
                                None,
                                None,
                                c8y.token,
                                on_close_handler
                                )
        devProx.connect()
        logger.info('Remote Connection successfull finished')
        return 'success'
    except Exception as e:
        logger.error('Remote Connection error:' + str(e))
        return str(e)

def refresh_token():
    logger.info("Starting refresh token thread ")
    while c8y.connected == 0:
        logger.info("Refreshing Token")
        c8y.client.publish("c8y/s/uat", "",0)
        time.sleep(60.0)
#
#  Get connection from tedge config
stream = os.popen('sudo tedge config get c8y.url')
url=stream.read().strip() 
logger.info('Got tenant URL: '+ url)
c8y = mqtt_helper.MQTTHelper('remote_connect','localhost',1883,'c8y/s/ds,c8y/s/e,c8y/s/dt,c8y/s/dat')
connected = c8y.connect(on_message)
logger.info('Connection Result:' + str(connected))
if connected != 0:
    logger.error('Connection not possible: ' + str(connected))
    exit()
    
refresh_token()





