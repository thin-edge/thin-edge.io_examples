COPYRIGHT NOTICE

# Copyright (c) 2022 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.
# Use, reproduction, transfer, publication or disclosure is prohibited except as specifically provided for in your License Agreement with Software AG

# Streaming Analytics Resource Monitoring Sample

This example demonstrates the use of Apama to monitor CPU and memory usage and calculate 
what percentage of the time the usage is over 70%. It reports it to the cloud 
in 5-minute cycles if this percentage is over 70% or once per hour otherwise.

Note that we are __not__ reporting the average CPU and memory usage, but the _percentage of time for 
which CPU or memory usage breached the threshold._

## Prerequisites

Follow the setup and configuration instructions in the [README](../README.md)
file in the parent directory before running this sample.

Ensure that the thin-edge device has Python 3 installed, that it is on your
`$path`, and that you have installed `psutil` and `paho-mqtt`:
```
sudo apt-get install python3
pip install psutil
pip install paho-mqtt
```

## Running the Sample

Zip the project located in the `ResourceMonitoring` directory of this repository. Note that you must use the zip format and not some other compression utility. Then use your tenant to deploy the zipped project to your thin-edge device by following these steps:

1. In your Cumulocity IoT tenant, go to the **Device Management** app and go to the **Management** menu option and select the **Software repository**.
2. Click **Add software** at the right of the top menu bar. 
3. In the **ADD SOFTWARE** dialog enter the following details:
- **Software**: apama-resource-monitoring
- **Description**: apama-resource-monitoring (or something else if you choose)
- **Device Filter Type**: (leave empty)
- **Software Type**: apama
- **Version**: 1.0::apama
- **SOFTWARE FILE**: select the **Upload a binary** option and either drag and drop the project zip file created previously or use the file chooser to navigate to it in your file system. 
4. Click the **Add software** button.
5. Now return to the **Devices** menu option and then select **All devices**.
6. In the list of devices, select the thin-edge device installed previously.
7. In the sub-menu for the device, select the **Software** option.
8. Click the **Install software** button in the bottom left; the apama-resource-monitoring should be listed.
9. Click the drop-down arrow on the right and check the 1.0::apama radio button. Then, click **Install**.
10. Finally, click the **Apply changes** button in the lower right of the panel.
11. Copy the  `resource-monitor.py.py` script in the `ResourceMonitoring` directory to the
`/etc/tedge/apama/project` directory on the thin-edge device. Run the [resource-monitor.py](resource-monitor.py) script from this directory using Python 3
with the command `python3 resource-monitor.py`.
12. To see the measurements that will be sent to the cloud, run `tedge mqtt sub 'tedge/measurements'`.
13. If you have configured the thin-edge.io installation to connect to a cloud provider, your measurements 
will begin appearing there.

> Note: You may need to wait up to an hour for this
example to publish a message to the `tedge/measurements`
channel. If you want to speed this up, you could alter
the thresholds, intervals or CPU and memory usage
variables accordingly.

