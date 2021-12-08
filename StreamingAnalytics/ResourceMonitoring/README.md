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

> Note: If you intend to modify or extend this sample it is recommended that
> you delete the provided [config.yaml](config.yaml) file and use
> `engine_deploy` from a full Apama installation to build a deployable version
> of your project which you then copy to the thin-edge device. This is because
> building out this sample is likely to break the configuration in
> [config.yaml](config.yaml) and using `engine_deploy` works out the
> correct initialization order when creating a deployable project.

1. Copy the [project](project) directory to the `/etc/tedge/apama/project` directory on the thin-edge device. 
2. Restart the Apama service on the thin-edge device with `sudo service apama restart`.
This will restart the correlator running the project that was copied in the previous step.
3. Run the [resource-monitor.py](resource-monitor.py) script from this directory using Python 3
with the command `python3 resource-monitor.py`
4. To see the measurements that will be sent to the cloud run `tedge sub 'tedge/measurements'`
5. If you have configured thin-edge to connect to a cloud provider, your measurements 
will begin appearing there.

> Note: This project reports to the cloud once per five minutes __only__ if resource
> usage exceeds the 70% threshold for at least 70% of that five minutes.  Otherwise
> it will report only once per hour meaning you may have to wait some time to see
> measurements appearing in the `tedge/measurements` topic or cloud provider unless you artifcially
> manipulate resource use to exceed the threshold.


