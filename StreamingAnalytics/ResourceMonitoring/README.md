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

1. Copy the [project](project) directory to the `/etc/tedge/apama/project` directory on the thin-edge device. 
2. Restart the Apama service on the thin-edge device with `sudo service apama restart`.
This restarts the correlator and runs the project that was copied in the previous step.
3. Run the [resource-monitor.py](resource-monitor.py) script from this directory using Python 3
with the command `python3 resource-monitor.py`.
4. To see the measurements that will be sent to the cloud, run `tedge mqtt sub 'tedge/measurements'`.
5. If you have configured the thin-edge.io installation to connect to a cloud provider, your measurements 
will begin appearing there.

> Note: You may need to wait up to an hour for this
example to publish a message to the `tedge/measurements`
channel. If you want to speed this up, you could alter
the thresholds, intervals or CPU and memory usage
variables accordingly.

