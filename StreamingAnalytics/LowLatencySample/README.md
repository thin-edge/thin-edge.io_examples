# Streaming Analytics Low Latency Command and Control Sample
This example demonstrates the use of Apama to monitor temperature and calculate the average temperature recorded by a sensor in every 5 minutes interval. It reports it to the cloud in 5-minute cycles if the average temperature exceeds a threshold temperature (ex- 80C) or not.If the average temperature exceeds threshold temperature ,then it sends a shutdown operation.

## Prerequisites

Follow the setup and configuration instructions in the [README](https://github.com/sag-tgo/thin-edge.io_examples/blob/PAM-33149/StreamingAnalytics/README.md) file in the parent directory before running this sample.

## Running the Sample

1.Deploy the [Project](https://github.com/sag-tgo/thin-edge.io_examples/tree/PAM-33149/StreamingAnalytics/LowLatencySample/Temperature-Epl) using `engine_deploy --outputDeployDir project <project-src-dir>` (Take reference from [README](https://github.com/sag-tgo/thin-edge.io_examples/blob/PAM-33149/StreamingAnalytics/README.md)) and then Copy the project directory to the `/etc/tedge/apama/project` directory on the thin-edge device.

2.Restart the Apama service on the thin-edge device with `sudo service apama restart`. This restarts the correlator and runs the project that was copied in the previous step.

3.Run the [low-latency.py](https://github.com/sag-tgo/thin-edge.io_examples/blob/PAM-33149/StreamingAnalytics/LowLatencySample/low-latency.py) script from this directory using Python 3 with the command `python3 resource-monitor.py`.

4.To see the measurements that will be sent to the cloud, run `tedge mqtt sub 'alerts/temperature'`.

5.If you have configured the thin-edge.io installation to connect to a cloud provider, your measurements will begin appearing there.
