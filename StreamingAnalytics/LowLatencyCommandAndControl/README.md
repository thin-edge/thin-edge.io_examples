# Streaming Analytics Low Latency Command and Control Sample
This example demonstrates the use of Apama to average temperature
sensor values over a 10 second window. If the average temperature
exceeds a threshold (80 in this example) then an alert is sent to the
cloud and a shutdown is initiated.

## Prerequisites

Follow the setup and configuration instructions in the
[README](../README.md) file in the parent directory before running this sample.

Ensure that the thin-edge device has Python 3 installed, that it is on your `$path`,
and that you have installed the paho-mqtt Python library:

```
sudo apt-get install python3
pip3 install paho-mqtt
```

## Running the Sample

1. Copy the [project](project) directory to the `/etc/tedge/apama/project` directory on the thin-edge device.

2. Restart the Apama service on the thin-edge device with `sudo service apama restart`.
This restarts the correlator and runs the project that was copied in the previous step.

3. This project expects the sensor to publish the temperature readings on
this mqtt topic `'sensors/temperature'`.

4. To see the measurements that will be sent
to the cloud, run `tedge mqtt sub 'alerts/temperature'`.

5. This project publishes a shutdown message to the mqtt topic `'device/operations'`
to trigger shutdown operation whenever average temperature in last 10 seconds window
exceeds threshold temperature. 

6. If you have configured the thin-edge.io installation to
connect to a cloud provider, your measurements will begin appearing there.
