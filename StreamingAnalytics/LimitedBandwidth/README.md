# Streaming Analytics Limited Bandwidth Sample

## Prerequisites
* An installation of Apama
* Thin-edge.io installed (or a local MQTT broker like Mosquitto)

## How to run the sample
1. Open an Apama command prompt
2. From this directory run `correlator 
--config config/connectivity/MQTT/MQTT.properties
--config config/connectivity/MQTT/MQTT.yaml
--config config/CorrelatorConfig.yaml`
