# Streaming Analytics Limited Bandwidth Sample

This example shows how Apama can be used on a thin-edge device to process &
filter events to reduce the frequency of messages sent to the cloud.

This EPL file in this sample
([ThinEdgeIoExample.mon](monitors/ThinEdgeIoExample.mon) collates temperature,
pressure and vibration events, averages them and sends a measurement combining
those averages at 5 second intervals to thin-edge via MQTT.

## Prerequisites
Follow the setup and configuration instructions in the [README](../README.md)
file in the parent directory before running this sample.

## How to run the sample
1. Run `engine_deploy --outputDeployDir deployed` from your development/full
Apama installation.
2. Copy the `deployed` directory from the previous step to
`/etc/tedge/apama/project` on the thin-edge device.
3. On the thin-edge device, restart the service with `sudo service apama
restart`.
4. Publish events to sensors/temperature, sensors/pressure and
sensors/vibration topics via `tedge mqtt pub`, script or other MQTT
utility.

Event examples: (topic: payload)
```
sensors/temperature: {"temperature":30.6}
sensors/pressure: {"pressure":68.265}
sensors/vibration: {"vibration":0.12098}
```
