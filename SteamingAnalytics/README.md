# Prerequisites

- A Raspberry Pi <min version> running Raspberry Pi OS <min version> 
- Thin-edge.io installed to the Raspberry Pi, which can be done by following the instructions on this page.
- A full installation of Apama Community Edition including Designer on a laptop or PC


# Setup and Configuration
## Installing Apama Community Core to the Raspberry Pi
Download the Apama Community Core zip for Arm to the Raspberry Pi.  The latest version is available from the Apama Community Edition Downloads page.

Untar the archive to /opt/softwareag

`mkdir /opt/softwareag
tar -xzf apama_core_<version>_armv7_linux.tar.gz --directory /opt/softwareag`

## Installing the Apama Server Script
Clone the Thin-edge examples github repository to the home directory of the Raspberry Pi

`cd ~
git clone https://github.com/thin-edge/thin-edge.io_examples.git`

Copy the apama server script to /etc/init.d

`cp thin-edge.io_examples/StreamingAnalytics/server/apama /etc/init.d`

# Creating a Designer Project
## Creating a New Project
Open Designer on the laptop or PC and select a workspace (the default location is fine)

Start a new project by choosing File → New → Apama Project

Give your project a name then click next

Add the MQTT connectivity plug-in from 'Connectivity bundles' and JSON support from 'Standard bundles' to the project then click the  finish button.

## Creating an Event
Add an Event Definition by navigating to File→ New→ Event Definition. 

## Configuring MQTT Support
In the Project Explorer tab, MQTT can be found under Connectivity and Adapters. 

### Configuring the plug-in
Open the MQTT.properties file.  Edit the properties to match the configuration below (or replace the file by copying and pasting across)

Explanation:

- The MQTT broker will be running on the same host as this project, so MQTT_brokerURL is set to the loopback address (but could equally be set to localhost)
- The default MQTT port for thin-edge.io is 1883
- The thin-edge mosquito broker accepts internal traffic without SSL/TLS or the need for password authentication

### Configuring the chain
MQTT messages need to be mapped to EPL events in order to be able to use them within Apama.  Open the MQTT.yaml file.  

# Deploying and Launching

## Deploying to thin-edge.io

# Launching the Project
To launch the project, invoke the server script on the Raspberry Pi

`sudo service apama start`
