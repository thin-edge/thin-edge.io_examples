# Prerequisites

- A Raspberry Pi <min version> running Raspberry Pi OS <min version> 
- Thin-edge.io installed to the Raspberry Pi, which can be done by following the instructions on this page.
- A full installation of Apama Community Edition including Designer on a laptop or PC


# Setup and Configuration
## Installing Apama Community Core to the Raspberry Pi
Download the Apama Community Core zip for Arm to the Raspberry Pi.  The latest version is available from the Apama Community Edition Downloads page.

Untar the archive to /opt/softwareag

```
mkdir /opt/softwareag
tar -xzf apama_core_<version>_armv7_linux.tar.gz --directory /opt/softwareag
```

## Installing the Apama Server Script
Clone the Thin-edge examples github repository to the home directory of the Raspberry Pi

```
cd ~
git clone https://github.com/thin-edge/thin-edge.io_examples.git
```

Copy the apama server script to /etc/init.d

`cp thin-edge.io_examples/StreamingAnalytics/server/apama /etc/init.d`

# Creating a Designer Project
## Creating a New Project
Open Designer on the laptop or PC and select a workspace (the default location is fine)

Start a new project by choosing File → New → Apama Project

Give your project a name then click next

Add the MQTT connectivity plug-in from 'Connectivity bundles' and JSON support from 'Standard bundles' to the project then click the  finish button.

## Creating a Monitor
Click the File dropdown and select New → EPL Monitor

Give the monitor a name, for this example we will use TedgeTestMonitor.  Copy and paste the EPL from below into the monitor file:

```
event MQTTNumber {
	integer number;
}

event NumberPlusOne {
	integer numberplusone;
}

/** This monitor is an arbitrary demonstration how to connect Apama and thin-edge.io
* 	It subscribes to the mqtt topic demo/number and sends the number incremented by 1 to mqtt topic tedge/measurements 
*/

monitor TedgeTestMonitor {
	action onload() {
		
		log "Loaded monitor TedgeTestMonitor" at INFO;
		
		monitor.subscribe("mqtt:demo/number");
		
		log "Subscribed to demo/number" at INFO;
		
		on all MQTTNumber() as n {
			log "Message recieved, incrementing number and sending to tedge/measurements" at INFO;
			send NumberPlusOne(n.number + 1) to "mqtt:tedge/measurements";
		}
	}
}
```


## Configuring MQTT Support
In the Project Explorer tab, MQTT can be found under Connectivity and Adapters. 

### Configuring the plug-in
Open the MQTT.properties file.  Edit the properties to match the configuration below (or replace the file by copying and pasting across)

```
# Use this setting to specify the URL of the broker you want to use for MQTT connectivity.
MQTT_brokerURL=127.0.0.1:1883

# Use these settings to specify credentials for authentication, if required.
MQTT_username=
MQTT_password=

# If non-validated server certificates are to be accepted or not
MQTT_acceptUnrecognizedCertificates=true

# Path to a CA certificate file for verifying the server in PEM format
MQTT_certificateAuthorityFile=

# Path to a certificate file for verifying the client in PEM format
MQTT_certificateFile=

# Path to the client's private key in PEM format, if not already included in the certificate file
MQTT_privateKeyFile=

# Used to decrypt the client's private key, if encrypted
MQTT_certificatePassword=
```

Explanation:

- The MQTT broker will be running on the same host as this project, so MQTT_brokerURL is set to the loopback address (but could equally be set to localhost)
- The default MQTT port for thin-edge.io is 1883
- The thin-edge mosquito broker accepts internal traffic without SSL/TLS or the need for password authentication

### Configuring the chain
MQTT messages need to be mapped to EPL events in order to be able to use them within Apama.  
- Open the MQTT.yaml file
- Copy and paste the configuration from below into the file

```
connectivityPlugins:
  MQTTTransport:
    libraryName: connectivity-mqtt
    class: MQTTTransport

# The chain manager, responsible for the connection to MQTT
dynamicChainManagers:
  MQTTManager:
    transport: MQTTTransport
    managerConfig:
      # WARNING: If you are using multiple MQTT bundles, make sure that each chain manager
      # is configured with a distinct prefix to avoid unexpected behaviour
      channelPrefix: "mqtt:"
      brokerURL: ${MQTT_brokerURL}
      certificateAuthorityFile: ${MQTT_certificateAuthorityFile}
      acceptUnrecognizedCertificates: ${MQTT_acceptUnrecognizedCertificates}
      authentication:
        username: ${MQTT_username}
        password: ${MQTT_password}
        certificateFile: ${MQTT_certificateFile}
        certificatePassword: ${MQTT_certificatePassword}
        privateKeyFile: ${MQTT_privateKeyFile}

dynamicChains:
  # This is a sample chain definition showing how to turn a JSON message from MQTT broker to EPL events
  MQTTChain:
    - apama.eventMap:
        suppressLoopback: true

    #- diagnosticCodec:

    - classifierCodec:
        rules:
	  - MQTTNumber:
	    - metadata.mqtt.topic: demo/number

    # Codec that logs message contents during testing/debugging - should be commented out in production
    #- diagnosticCodec:
    
    - jsonCodec:
    - stringCodec:
        nullTerminated: false
    
    - MQTTTransport
 
```

# Deploying and Launching

## Deploying to thin-edge.io
To deploy the project, 


# Launching the Project
To launch the project, invoke the server script on the Raspberry Pi

`sudo service apama start`
