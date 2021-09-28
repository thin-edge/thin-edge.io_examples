# thin-edge.io remote access

To access a device remotely that runs thin edge, `remote_connect.py` can be used. After startup, it will connect to the Cumulocity cloud/edge instance. From that point on you can use the remote access tab in device management to access the device. In addition your can use a local proxy or connect any local port on the device.

## Requirements

- Working thin edge installation

- Python3 and pip3 installation

- The Cloud Remote Access Feature is assigned to your Tenant. If not ask your Administrator to get it assigned to your Tenant. Please note that the Version must be at least 1007.2.0+

- The Cloud Remote Access Role must be assigned to the user who wants to use that Feature: Administration -> Role -> <any Role> -> check “Remote Access”. Assign the role to the user used for the next steps.


## Installation 

1. Check out this repo
2. run pip install -r requirements.txt


## Usage

Make sure thin edge is connected to  Cumulocity.

run 

```python
python3 remote_connect.py
```

### Connect from Cloud (Cumulocity Web UI)

    Use default option in the remote access tab of the cumulocity device management UI. Create a new connection of one of the three available options( ssh, vnc, telnet)
    You can click on the connect button to open the remote connection

### Connect using a local proxy

To tunnel any protocol to the device you can use the tool c8ylp to connect your pc to the cumulocity cloud tenant and then tunnel any protocol to the device.

- Add “Passthrough” configuration to the device you want to connect to. Currently the Passthrough functionality is not enabled in the UI. As a workaround you can add it via REST API Endpoint: 

```json
POST <cumulocity tenant url>/service/remoteaccess/devices/<InternalDeviceID>/configurations

Body: 
{
    "name": "Passthrough",
    "hostname": "127.0.0.1",
    "port": 80,
    "protocol": "PASSTHROUGH",
    "credentialsType": "NONE"
}
```
- Install local proxy on your PC/Client:
Easiest way is to install python3 + pip3 and afterwards execute 

```python
pip3 install c8ylp
```

- Make sure pip installed modules are available in your PATH of the shell.
- Test if c8ylp is installed by entering “c8ylp” in the shell. You should see the help message printed.

- Test Steps:

    - Check if your device is online in cumulocity UI Device Management.
    - Start the c8ylp with the required parameters (host, external ID, Tenant ID, user and password):
    - Example: c8ylp  -h examples.cumulocity.com -d test-device -t t1111 -u user -p verysecret (the device id is the external id of the device per default c8y_Serial is used as external id type)
    - Per default the local port 2222 is used.
    - Wait until it states that the WebSocket connection is open and waiting for incoming connections…
    - This will tunnel remote web server running on 127.0.0.1:80 on the device to the local client on port 2222
    - Open the browser and try to reach localhost:2222. If everything is working fine you should see the UI of the Web server of the device.



