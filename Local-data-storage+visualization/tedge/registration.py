#!/usr/bin/python3
# coding=utf-8
from types import MappingProxyType
from flask import Flask, flash, request, redirect, render_template, send_file
import logging
import sys
import os
import subprocess
import configparser

from werkzeug.datastructures import cache_property


UPLOAD_FOLDER = './'

logFile = './Logs/registration.log'
logger = logging.getLogger('Upload Server Logging')
logging.basicConfig(filename=logFile,level=logging.DEBUG,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger.info('Logger for registration UI was initialized')

app = Flask(__name__,static_url_path='/static')
app.config['SESSION_TYPE'] = 'memcached'
app.config['SECRET_KEY'] = 'super-secret-key'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def updateConfig():
    pass

def checkConfig():
    try:
        return os.path.exists("/etc/tedge/edge.toml")
    except Exception as e:
       logging.error("The following error occured: %s" % (e))
       return False

def getConfig():
    try:
       toml = configparser.ConfigParser()
       toml.read('/etc/tedge/edge.toml')
       deviceID=toml['Device']['id']
       tenantURL=toml['MQTT']['URL']
       return deviceID,tenantURL
    except Exception as e:
       logging.error("The following error occured: %s" % (e))
       return 0,0


def configuration(deviceID,tenantURL):
    try:
        logging.debug('Starting certification creation via subprocess')
        createCertification = subprocess.Popen(["tedge", "cert", "create", "--device-id", deviceID],stdout=subprocess.PIPE)
        logging.debug('Received the following feedback from certification create: %s' % (createCertification.stdout.read()))
        logging.debug('Starting config set of tenant url creation via subprocess')
        tenantConfig = subprocess.Popen(["tedge", "config", "set", "c8y.url", tenantURL],stdout=subprocess.PIPE)
        logging.debug('Received the following feedback from tenant configuration: %s' % (tenantConfig.stdout.read()))
    except Exception as e:
       logging.error("The following error occured: %s" % (e))

def start():
    try:
        os.system('tedge connect c8y')
        logging.debug('Adding allow anonymus true to config of mosquitto')
        os.system("awk '!/listener/' /etc/tedge/mosquitto-conf/tedge-mosquitto.conf > temp && mv temp /etc/tedge/mosquitto-conf/tedge-mosquitto.conf")
        logging.debug('Adding listenener 1883 to config of mosquitto')
        os.system("echo 'listener 1883' >> /etc/tedge/mosquitto-conf/tedge-mosquitto.conf")
        os.system("awk '!/pid_file/' /etc/mosquitto/mosquitto.conf > temp && mv temp /etc/mosquitto/mosquitto.conf")
        os.system('mosquitto -c /etc/mosquitto/mosquitto.conf -v -d')
        os.system('tedge connect c8y --test')
        os.system('tedge_mapper c8y &')
        os.system('tedge_mapper collectd &')
        os.system('collectd &')
        os.system('tedge config set software.plugin.default docker')
        os.system('tedge_mapper sm-c8y &')
        os.system('tedge_agent &')
    except Exception as e:
       logging.error("The following error occured: %s" % (e))

@app.route('/test', methods=['GET','POST'])
def test():
    return render_template('./download.html')

@app.route('/reset', methods=['GET','POST'])
def delete():
        try:
            logging.debug('Starting deletion of certification via subprocess')
            deleteCertification = subprocess.Popen(["tedge", "cert", "remove"],stdout=subprocess.PIPE)
            logging.debug('Received the following feedback from deletion of certification: %s' % (deleteCertification.stdout.read()))
            logging.debug('Starting disconnecting c8y via subprocess')
            tedgeDisconnect = subprocess.Popen(["tedge", "disconnect", "c8y"],stdout=subprocess.PIPE)
            logging.debug('Received the following feedback from disconnect: %s' % (tedgeDisconnect.stdout.read()))
            logging.debug('Starting kill mosquitto via subprocess')
            killMosquitto = subprocess.Popen(["pkill", "mosquitto"],stdout=subprocess.PIPE)
            logging.debug('Received the following feedback from shutdown mosquitto: %s' % (killMosquitto.stdout.read()))
            logging.debug('Starting kill tedge via subprocess')
            killtedgeMapper = subprocess.Popen(["pkill", "tedge_mapper"],stdout=subprocess.PIPE)
            logging.debug('Received the following feedback from shutdown tedge: %s' % (killtedgeMapper.stdout.read()))
            logging.debug('Starting kill tedge agent via subprocess')
            killtedgeAgent = subprocess.Popen(["pkill", "tedge_agent"],stdout=subprocess.PIPE)
            logging.debug('Received the following feedback from shutdown tedge agent: %s' % (killtedgeAgent.stdout.read()))
            return render_template('./home.html',configurationDone=0)
        except Exception as e:
            logging.error("The following error occured: %s" % (e))
            return render_template('./home.html')

@app.route('/downloads/certificate', methods=['GET', 'POST'])
def download():
    try:
        file = request.values['deviceID']
        logging.info('Starting start procedure')
        start()
        return send_file("/etc/tedge/device-certs/tedge-certificate.pem", download_name=file + '.pem', as_attachment=True)
    except Exception as e:
       logging.error("The following error occured: %s" % (e))
       return render_template('./home.html',configurationDone=0)

@app.route('/home', methods=['GET', 'POST'])
def home():
   try: 
        logging.debug('Received the following request: %s'%(request))
        logging.debug('Received the following request method: %s'%(request.method))
        if request.method == 'GET':
            logging.info('GET received, returning home.html')
            if checkConfig():
                deviceID,tenantURL = getConfig()
                configurationDone = 1
                return render_template('./home.html',deviceID=deviceID,tenantURL=tenantURL,configurationDone=configurationDone)
            else:
                return render_template('./home.html')
        if request.method == 'POST':
            logging.info('POST received')
            tenantURL = request.values['Tenant-URL']
            logging.debug('Tenant URL is: %s'%(tenantURL))
            deviceID = request.values['Device-ID']
            logging.debug('Device ID is: %s'%(deviceID))
            logging.info('Starting configuration')
            configuration(deviceID,tenantURL)
            logging.info('Done, returning download.html')
            return render_template('./download.html',deviceID=deviceID)
   except Exception as e:
       logging.error("The following error occured: %s" % (e))
       return render_template('./home.html')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)
