# Streaming Analytics Limited Bandwidth Sample

This example shows how Apama can be used on a thin-edge device to process and
filter events to reduce the frequency of messages sent to the cloud.

The EPL file in this sample
([ThinEdgeIoExample.mon](monitors/ThinEdgeIoExample.mon)) collates temperature,
pressure and vibration events, averages them and sends a measurement combining
those averages at 5 second intervals to thin-edge.io via MQTT.

## Prerequisites
Follow the setup and configuration instructions in the [README](../README.md)
file in the parent directory before running this sample.

## How to run the sample

> Note: If you intend to modify or extend this sample it is recommended that
> you delete the provided [config.yaml](config.yaml) file and use
> `engine_deploy` from a full Apama installation to build a deployable version
> of your project which you then copy to the thin-edge device. This is because
> building out this sample is likely to break the configuration in
> [config.yaml](config.yaml) and using `engine_deploy` works out the
> correct initialization order when creating a deployable project.

1. Copy the contents of this directory ([LimitedBandwidth](./)) to the
`/etc/tedge/apama/project` directory on the thin-edge device.
2. On the thin-edge device, restart the service with `sudo service apama
restart`. This restarts the correlator and runs the project that was copied
in the previous step.
3. Exercise the sample by publishing events to `sensors/temperature`,
`sensors/pressure` and `sensors/vibration` topics via `tedge mqtt pub`, script
or other MQTT utility.

Event examples: (topic: payload)
```
sensors/temperature: {"temperature":30.6}
sensors/pressure: {"pressure":68.265}
sensors/vibration: {"vibration":0.12098}
```

4. If you have configured thin-edge.io to connect to Cumulocity IoT or another
cloud service you should see the measurement(s) appear there.
Otherwise, run `cat <path to correlator log>` to print out the contents of
the correlator log file. The actual path to the correlator log file is
determined by the project's configuration or the `--logfile` argument passed
to the correlator in the [Apama service script](../src/service/apama). In the
correlator's output you should see log messages indicating that the combined
measurement has been sent to `tedge/measurements`.
> _Caution:_ The correlator fails to start if you specify the name of the
> logfile in both the project configuration and the `--logfile` argument to
> the correlator.
