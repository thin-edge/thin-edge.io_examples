COPYRIGHT NOTICE

# Copyright (c) 2022 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.
# Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Software AG

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

Zip the project located in the `LowLatencyCommandAndControl` directory of this repository. Note that you must use the zip format and not some other compression utility. Then use your tenant to deploy the zipped project to your thin-edge device by following these steps:

1. In your Cumulocity IoT tenant, go to the **Device Management** app and go to the **Management** menu option and select the **Software repository**.
2. Click **Add software** at the right of the top menu bar. 
3. In the **ADD SOFTWARE** dialog enter the following details:
- **Software**: apama-low-latency
- **Description**: apama-low-latency (or something else if you choose)
- **Device Filter Type**: (leave empty)
- **Software Type**: apama
- **Version**: 1.0::apama
- **SOFTWARE FILE**: select the **Upload a binary** option and either drag and drop the project zip file created previously or use the file chooser to navigate to it in your file system. 
4. Click the **Add software** button.
5. Now return to the **Devices** menu option and then select **All devices**.
6. In the list of devices, select the thin-edge device installed previously.
7. In the sub-menu for the device, select the **Software** option.
8. Click the **Install software** button in the bottom left; the apama-low-latency project should be listed.
9. Click the drop-down arrow on the right and check the 1.0::apama radio button. Then, click **Install**.
10. Finally, click the **Apply changes** button in the lower right of the panel.
11. Copy the  `test_publisher.py` script in the `LowLatencyCommandAndControl` directory to the
`/etc/tedge/apama/project` directory on the thin-edge device. Execute the script to send some fake
temperature measurements to the Apama application.
12. This project expects the sensor to publish the temperature readings on
this mqtt topic `'sensors/temperature'`. 
13. To see the measurements that will be sent
to the cloud, run `tedge mqtt sub 'alerts/temperature'`.
14. This project publishes a shutdown message to the mqtt topic `'device/operations'`
to trigger shutdown operation whenever average temperature in last 10 seconds window
exceeds threshold temperature. 
15. If you have configured the thin-edge.io installation to connect to a cloud provider, your measurements will begin appearing there.
