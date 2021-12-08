# Streaming Analytics Resource Monitoring Sample

This example demonstrates the use of Apama to monitor CPU und memory usage and calculate 
what percentage of the time the usage is over 70%. It reports it to the cloud 
in 5 minute cycles if this percentage is over 70% or once per hour otherwise.

Note that we are __not__ reporting the average CPU and memory usage, but the _percentage of time for 
which CPU or memory usage breached the threshold._

## Prerequisites

Follow the setup and configuration instructions in the [README](../README.md)
file in the parent directory before running this sample.

Ensure that the thin-edge device has Python 3 installed and that it is on your `$path` :

```
sudo apt-get install python3
pip3 install psutil
```

## Running the Sample

1. Copy the [project](project) directory to the `/etc/tedge/apama/project` directory on the thin-edge device. 
2. Restart the Apama service on the thin-edge device with `sudo service apama restart`.
This will restart the correlator running the project that was copied in the previous step.
3. Run the [resource-monitor.py](resource-monitor.py) script from this directory using Python 3
with the command `python3 resource-monitor.py`
4. To see the measurements that will be sent to the cloud run `tedge mqtt sub 'tedge/measurements'`
5. If you have configured thin-edge to connect to a cloud provider, your measurements 
will begin appearing there.

> Note: You may need to wait up to an hour for this
example to publish a message to the `tedge/measurements`
channel. If you want to speed this up you could alter
the threshold(s), interval(s) or CPU and memory usage
variables accordingly.

