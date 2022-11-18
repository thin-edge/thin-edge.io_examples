COPYRIGHT NOTICE

# Copyright (c) 2022 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.
# Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Software AG


# Streaming Analytics Limited Bandwidth Sample

This example shows how Apama can be used on a thin-edge device to process and
filter events to reduce the frequency of messages sent to the cloud.

The EPL file in this sample ([ThinEdgeIoExample.mon](project/monitors/ThinEdgeIoExample.mon)) collates temperature, pressure and vibration events, averages them and sends a measurement combining those averages at 5 second intervals to thin-edge.io via
MQTT.

## Prerequisites
Follow the setup and configuration instructions in the [README](../README.md)
file in the parent directory before running this sample.

Ensure that the thin-edge device has Python 3 installed, that it is on your
`$path`, and that you have installed `paho-mqtt`:
```
sudo apt-get install python3
pip install paho-mqtt
```

## How to run the sample

> Note: If you intend to modify or extend this sample it is recommended that
> you delete the provided [config.yaml](./project/config.yaml) file and use
> `engine_deploy` from a full Apama installation to build a deployable version
> of your project which you then copy to the thin-edge device. This is because
> changing this sample could break the configuration in
> [config.yaml](./project/config.yaml) and using `engine_deploy` works out the
> correct initialization order when creating a deployable project.

Zip the project located in the `LimitedBandwidth` directory of this repository. Note that you must use the zip format and not some other compression utility. Then use your tenant to deploy the zipped project to your thin-edge device by following these steps:

1. In your Cumulocity IoT tenant, go to the **Device Management** app and go to the **Management** menu option and select the **Software repository**.
2. Click **Add software** at the right of the top menu bar. 
3. In the **ADD SOFTWARE** dialog enter the following details:
- **Software**: apama-limited-bandwidth
- **Description**: apama-limited-bandwidth (or something else if you choose)
- **Device Filter Type**: (leave empty)
- **Software Type**: apama
- **Version**: 1.0::apama
- **SOFTWARE FILE**: select the **Upload a binary** option and either drag and drop the project zip file created previously, or use the file chooser to navigate to it in your file system. 
4. Click the **Add software** button.
5. Now return to the **Devices** menu option and then select **All devices**.
6. In the list of devices, select the thin-edge device installed previously.
7. In the sub-menu for the device, select the **Software** option.
8. Click the **Install software** button in the bottom left; the apama-limited-bandwidth project should be listed.
9. Click the drop-down arrow on the right and check the 1.0::apama radio button. Then, click **Install**.
10. Finally, click the Apply changes button in the lower right of the panel.
11. Copy the  `demo_publisher.py` script in the `LimitedBandwidth` directory to the
`/etc/tedge/apama/project` directory on the thin-edge device. Execute the script to send some fake
temperature, pressure and vibration measurements to the Apama application.
12. If you have configured thin-edge.io to connect to Cumulocity IoT or another
cloud service you should see the measurement(s) appear there.
Otherwise, run `tail /var/log/apama/correlator.log` to print out the end of
the correlator log file. In the correlator's output you should see log messages
indicating that the combined measurement has been sent to `tedge/measurements`.

> _Note:_ The actual path to the correlator log file is
> determined by the project's configuration or the `--logfile` argument passed
> to the correlator in the [Apama service script](../src/service/apama).

> _Caution:_ The correlator fails to start if you specify the name of the
> logfile in both the project configuration and the `--logfile` argument to
> the correlator.
