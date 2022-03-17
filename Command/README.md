#  thin-edge.io Command plugin

To use command on a device that runs thin-edge.io, a plugin of the operation plugin concept is used. The tedge_agent is checking for command operation and is triggering the particular plugin. You can use the Shell tab in device management to use a command. Please be aware of the power of such an feature. Somebody with access could start various shell commands. Its more designes as an idea on how the plugin mechanism works.

## Requirements

- Working thin-edge.io installation

- Python3 and pip3 installation (will not work on python2)


## Installation 

1. Clone this repo on the thin-edge.io device
2. run pip3 install -r requirements.txt from this Command directory
3. Copy c8y_Command to the following directory "/etc/tedge/operations/c8y/"
4. Copy c8y_Command.py to the following directory "/bin/tedge/"
5. Make sure, that both files do have permissions for beeing executed by tedge_mapper ("chmod 777 FILENAME")


## Usage

Make sure thin-edge.io is connected to Cumulocity.
If installation is done properly accoording to the steps above, you hae to disconnect and reconnect thin-edge.io. In that way the suppoertedOperations will be updated.

```shell
sudo tedge disconnect c8y
```

and

```shell
sudo tedge connect c8y
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

You can create a command you want to be executed on the device side, such as e.g. ls.

<br/><br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="70%" src="pics/command.png">
  </center>
  </a>
</p>
<br/>

If you click on "Execute" thin-edge.io triggers the c8y_Command.py script. You can check the output of the command in the section on the right.

<br/><br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="70%" src="pics/result.png">
  </center>
  </a>
</p>
<br/>