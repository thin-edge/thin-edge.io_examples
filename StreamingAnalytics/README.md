# Prerequisites

- A Raspberry Pi (minimum version 3) running Raspberry Pi OS 32bit 
- Thin-edge.io installed to the Raspberry Pi, which can be done by following the instructions on [this page](https://github.com/thin-edge/thin-edge.io/blob/main/docs/src/howto-guides/002_installation.md).
- A full installation of [Apama Community Edition](https://apamacommunity.com) including Designer on a laptop or PC


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

```
cp thin-edge.io_examples/StreamingAnalytics/server/apama /etc/init.d
```

# Creating a Designer Project
## Creating a New Project
Open Designer on the laptop or PC and select a workspace (the default location is fine)

Start a new project by choosing File → New → Apama Project

Give your project a name then click next

Add the MQTT connectivity plug-in from 'Connectivity bundles' and JSON support from 'Standard bundles' to the project then click the  finish button.

## Creating a Monitor
Click the File dropdown and select New → EPL Monitor

Give the monitor a name, for this example we will use TedgeTestMonitor.  

The EPL code [here](src/Instructions/project/monitors/TedgeTestMonitor.mon) will listen for messages on the mqtt topic demo/number.  When an event is recieved on that topic, the number provided is incremented by 1 then published to the tedge/measurements topic.

Copy and paste the code into your newly created monitor file.

## Configuring MQTT Support
In the Project Explorer tab, MQTT can be found under Connectivity and Adapters. 

### Configuring the plug-in
Open the MQTT.properties file.  Edit the properties to match [this configuration](src/Instructions/project/config/connectivity/MQTT/MQTT.properties) (or replace the whole file)

Explanation:

- The MQTT broker will be running on the same host as this project, so MQTT_brokerURL is set to the loopback address (but could equally be set to localhost)
- The default MQTT port for thin-edge.io is 1883
- The thin-edge mosquito broker accepts internal traffic without SSL/TLS or the need for password authentication

### Configuring the chain
MQTT messages need to be mapped to EPL events in order to be able to use them within Apama.  
- Open the MQTT.yaml file
- Remove the pre-populated configurations
- Copy in the configuration [found here](src/Instructions/project/config/connectivity/MQTT/MQTT.yaml) or replace the whole file

### Configuring the correlator
Once MQTT is configured, the correlator must be configured to include the configs and inject monitor files in the correct order.

Copy the configuration [from here](src/Instructions/project/config/CorrelatorConfig.yaml) into the CorrelatorConfig.yaml file found in the config directory in the project explorer.
# Deploying and Launching

## Deploying to thin-edge.io
To deploy the project, copy the config and monitor directories from your Designer project to the /etc/tedge/apama/project directory on the Raspberry Pi.

Alternatively, you can copy the directory [here](src/Instructions/project)  if you wish to skip the Designer project steps for a quick demo.


# Launching the Project
To launch the project, invoke the server script on the Raspberry Pi

`sudo service apama start`
