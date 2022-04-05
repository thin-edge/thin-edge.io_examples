# Real thin-edge.io RemoteAcessConnect plugin

To access a device remotely that runs thin-edge.io, a plugin of the operation plugin concept is used. The tedge_agent is checking for cloud remote access operation and is triggering the particular plugin. You can use the remote access tab in device management to access the device via ssh or vnc.

## Requirements

- Working thin-edge.io installation

- Python3 and pip3 installation (will not work on python2)

- The Cloud Remote Access Feature is assigned to your Tenant. If not ask your Administrator to get it assigned to your Tenant. Please note that the Version must be at least 1007.2.0+

- The Cloud Remote Access Role must be assigned to the user who wants to use that Feature: Administration -> Role -> <any Role> -> check “Remote Access”. Assign the role to the user used for the next steps.

- OAuth must be the default authentication method (This can be configured in cumulocity under Administration - > Settings)


## Installation 

1. Clone this repo on the thin-edge.io device
2. run sudo -H pip3 install -r requirements.txt from the c8y_RemoteAccessConnect directory
3. Copy c8y_RemoteAccessConnect to the following directory "/etc/tedge/operations/c8y/"
4. Copy c8y_RemoteAccessConnect.py to the following directory "/bin/"
5. Make sure, that both files do have permissions for beeing executed by tedge_mapper ("chmod 644 c8y_RemoteAccessConnect and chmod 555 c8y_RemoteAccessConnect.py")


## Usage

Make sure thin-edge.io is connected to Cumulocity.
If installation is done properly according to the steps above, you hae to disconnect and reconnect thin-edge.io. In that way the suppoerted Operations will be updated.

```shell
sudo tedge disconnect c8y
```

and

```shell
sudo tedge connect c8y
```

However it would also to be sufficient to restart the tedge_mapper service via e.g.:

```shell
sudo systemctl tedge_mapper restart
```

You device within Cumulocity should look similar to this afterwards:


<br/><br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="70%" src="pics/dm.png">
  </center>
  </a>
</p>
<br/>

You can configure now within the Remote access tab to which e.g. VNC or SSH server you want to jump to. Please keep in mind that the Host is from the thin-edge.io point of view.

<br/><br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="70%" src="pics/remoteaccess.png">
  </center>
  </a>
</p>
<br/>

If you click on connect after the proper configuration an websocket window opens and thin-edge.io triggers the c8y_RemoteAccessConnect.py script to reach that websocket.


<br/><br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="70%" src="pics/websocket.png">
  </center>
  </a>
</p>
<br/>