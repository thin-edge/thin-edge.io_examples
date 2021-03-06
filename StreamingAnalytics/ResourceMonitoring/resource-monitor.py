import psutil
import paho.mqtt.client as mqtt
import time

mqttClient = mqtt.Client("Resource-monitor")
broker = "localhost"

def on_publish(client,userdata,result):             #create function for callback
	print("data published \n")
	pass

def on_connect(client, userdate, flags, rc):
	print("Connected to MQTT broker on " + broker + " with result {0}".format(rc))

mqttClient.on_connect = on_connect
mqttClient.on_publish = on_publish
mqttClient.connect(broker)

# Junk call to psutil.cpu_percent() - see https://psutil.readthedocs.io/en/latest/#psutil.cpu_percent
psutil.cpu_percent()

while True:
	cpuPercent = psutil.cpu_percent()
	# the results from psutil.virtual_memory() refer to the virtual_memory excluding swap_space
	# which essentially means the resident_memory. For more details refer the docs for module 'psutil'
	memPercent = psutil.virtual_memory().percent
	timestamp = f'{time.time():.3f}'
	
	mqttClient.publish('collectd/thin-edge/cpu/percent-active', timestamp + ":" + str(cpuPercent))
	mqttClient.publish('collectd/thin-edge/mem/percent-used', timestamp + ":" + str(memPercent))
	time.sleep(5)


