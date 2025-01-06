# Thin-edge.io and OPC UA Gateway Agent

This solution combines thin-edge.io and the OPC UA Gateway Agent together with a sample OPC UA Server.

See as well for additional information: 

[OPC UA Agent Cumulocity](https://cumulocity.com/guides/protocol-integration/opcua/)

[thin-edge.io](https://thin-edge.io)


The architecture allows that other components can be used on thin-edge.io. This is possible due to the concept of using mqtt as the underlying messaging broker. The module can be programmed in any language but needs to understand mqtt and its payload/topic structure.

However thats where a modified version of the OPC UA Gateway agent can be used. In this solution the steps to create that solution as well as the underlying idea are described.

<br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="90%" src="./images/thin-edge-diagram.svg">
  </center>
  </a>
</p>
<br/>

## Pre-requisites

To easy the configuration, the instructions assume that you have some tooling installed. Please following the setup in order to install the desired tooling.

and bootstrap the thin-edge.io container using [go-c8y-cli](https://goc8ycli.netlify.app/) and the [c8y-tedge](https://github.com/thin-edge/c8y-tedge) extension

1. Install [go-c8y-cli](https://goc8ycli.netlify.app/) using [these instructions](https://goc8ycli.netlify.app/docs/installation/shell-installation/)
2. Install the go-c8y-cli extension for thin-edge.io, [c8y-tedge](https://github.com/thin-edge/c8y-tedge)

    ```sh
    c8y extension install thin-edge/c8y-tedge
    ```

3. Create a Cumulocity IoT session file if you haven't already 

    ```sh
    c8y sessions create
    ```

## Quick start

1. Clone the project

    ```sh
    git clone https://github.com/thin-edge/thin-edge.io_examples
    cd thin_edge.io_examples/opcua-solution
    ```

2. Start the docker compose project

    ```sh
    docker compose up -d
    ```

    **Note:** The first time you run docker compose up it will hang waiting for the bootstrapping of the thin-edge.io container. Just leave the console as is, and continue the procedure.

3. Open a new console, and set the go-c8y-cli session to the Cumulocity IoT Tenant you wish to use the example with

    ```sh
    set-session
    ```

4. Bootstrap the thin-edge.io container using the [c8y-tedge extension](https://github.com/thin-edge/c8y-tedge)

    ```sh
    c8y tedge bootstrap-container bootstrap
    ```

    The command will open the Cumulocity IoT device management application to the device's page. Note, you may need to reload the web page after a few seconds if you don't the expected tabs.

5. In the Cumulocity IoT **Device Management** application, check that the OPC UA device gateway agent is a child device of the thin-edge.io device, though it will also be visible in the *All devices* list.

<br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="50%" src="http://g.recordit.co/I7s3OMhNT5.gif">
  </center>
  </a>
</p>
<br/>

If the device is not properly connected and the MQTT broker is not running proper, the OPC UA Gateway Agent will fail to start. You need to start it again after the thin-edge.io is successfully connected to Cumulocity IoT.

## Stopping the project

You can stop the project but still retain your data using:

```sh
docker compose down
```

If you would like to also remove all of the data (volumes) then run:

```sh
docker compose down -v
```

## Project setup

### OPC Simulation Server (service: opcua-server)

The Simulation Server simulates a machine within a factory. Values are updated every 2s.

<br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="70%" src="./images/OPC_Tree.png">
  </center>
  </a>
</p>
<br/>

You can change the tree before building the container.

Once the gateway scanned the OPCTree you can view its content within the device management and the corresponding device.

### OPC UA Gateway (service: gateway)

The device representation of the OPC UA Gateway is a child-device for the thin-edge.io parent device. The agent is currently in BETA and not meant for productive usage.

To connect to the simulation OPC UA server enter url `opc.tcp://opcua-server:4840` or the url of the real OPC UA Server.

<br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="60%" src="http://g.recordit.co/i7wj3cbYQm.gif">
  </center>
  </a>
</p>
<br/>

You can define which data points are translated in the device protocol section of cumulocity.

<br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="60%" src="./images/device-protocols.png">
  </center>
  </a>
</p>
<br/>

You can find more about the OPC UA Gateway implementation in the official [documentation](https://cumulocity.com/guides/protocol-integration/opcua/).

For the device protocol a new device as child device of the OPC UA Server will be registered. The mapped measurements can be found there.

<br/>
<p style="text-indent:30px;">
  <a>
  <center>
    <img width="50%" src="./images/Measurements.png">
  </center>
  </a>
</p>
<br/>

Until the device is not proper connected and the MQTT broker is not running proper, the OPC UA Gateway Agent will fail to start.

The registration data are stored in the ./data directory that are mapped as a volume to the docker service gateway.
