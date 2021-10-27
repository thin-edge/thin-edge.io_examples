# Streaming Analytics Limited Bandwidth Sample

This example shows how Apama can be used to process & filter events to reduce
the frequency of messages sent to the cloud.

## Prerequisites
Before trying to use this sample, please follow the instructions in the 
[README](../README.md) file in the parent directory.

## How to run the sample
1. Run `engine_deploy --outputDeployDir deployed` from your development/full
Apama installation.
2. Copy the `deployed` directory from the previous step to
`/etc/tedge/apama/project` on the thin-edge device.
3. On the thin-edge device, restart the service with `sudo service apama
restart`.
4. Publish events to sensors/temperature, sensors/pressure and
sensors/vibration topics via `thin-edge mqtt pub`, script or other MQTT
utility.

Examples: (topic: payload)
```
sensors/temperature: {"temperature":30.6}
sensors/pressure: {"pressure":68.265}
sensors/vibration: {"vibration":0.12098}
```
