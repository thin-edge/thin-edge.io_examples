# Streaming Analytics Limited Bandwidth Sample

This example shows how Apama can be used to process & filter events to reduce
the frequency of messages sent to the cloud.

## Prerequisites
* An installation of Apama
* Thin-edge.io installed (or a local MQTT broker like Mosquitto)

## How to run the sample
1. Open an Apama command prompt
2. From this directory run `correlator --config config`
3. Publish events to sensors/temperature, sensors/pressure and 
sensors/vibration topics via thin-edge, script or other MQTT utility.

Examples: (topic: payload)
```
sensors/temperature: {"temperature":30.6}
sensors/pressure: {"pressure":68.265}
sensors/vibration: {"vibration":0.12098}
```
