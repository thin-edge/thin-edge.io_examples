# Streaming Analytics Limited Bandwidth Sample

This example shows how Apama can be used on a thin-edge device to process &
filter events to reduce the frequency of messages sent to the cloud.

This EPL file in this sample
([ThinEdgeIoExample.mon](monitors/ThinEdgeIoExample.mon)) collates temperature,
pressure and vibration events, averages them and sends a measurement combining
those averages at 5 second intervals to thin-edge via MQTT.

## Prerequisites
Follow the setup and configuration instructions in the [README](../README.md)
file in the parent directory before running this sample.

## How to run the sample
1. Run `engine_deploy --outputDeployDir deployed .` in this folder from your
development/full Apama installation.
2. Copy the contents of the `deployed` directory that was created by the
previous step to the `/etc/tedge/apama/project` directory on the thin-edge
device.
3. On the thin-edge device, restart the service with `sudo service apama
restart`. This will restart the correlator and run the project that was copied
in the previous step.
4. Exercise the sample by publishing events to sensors/temperature,
sensors/pressure and sensors/vibration topics via `tedge mqtt pub`, script or
other MQTT utility.

Event examples: (topic: payload)
```
sensors/temperature: {"temperature":30.6}
sensors/pressure: {"pressure":68.265}
sensors/vibration: {"vibration":0.12098}
```

5. Run `cat /var/log/<correlator log filename>` to print out the contents of
the correlator log file. The actual correlator log filename is determined by
the and project's configuration and any `--logfile` argument passed to the
correlator in the [apama service script](../service/apama).
In the correlator's output you should see log messages indicating that the
combined measurement has been sent to `tedge/measurements`.
If you have also configured thin-edge to connect to Cumulocity IoT or another
cloud service you should also see the measurement(s) appear there.
