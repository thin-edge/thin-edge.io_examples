# Using OPC UA Container with thin-edge.io natively

This guide shows how to use the `thin-edge/opcua-device-gateway` container to run under docker whilst communicating with a thin-edge.io setup which is running natively on the Operation System.

## Pre-requisites

* **arm64**, **amd64** or **armv7** Linux Operating System
* thin-edge.io installed on your host operating system and it is already connected to Cumulocity IoT
* docker engine >=20.18
* docker compose plugin

## Getting started

### Using docker / docker compose

1. Enable the mqtt listener to accept connections other than from 127.0.0.1

    ```sh
    tedge config set mqtt.bind.address 0.0.0.0
    tedge refresh-bridges
    ```

2. Create a folder on your device called `opcua`

    ```sh
    mkdir opcua
    cd opcua
    ```

3. Create the compose file and copy the linked file contents to it

    ```sh
    docker-compose.yaml
    ```

    Copy the contents from this file: [docker-compose.yaml](./docker-compose.yml)

4. Start the docker compose project

    ```sh
    docker compose up -d
    ```
    
    You can view the logs using the following command:

    ```sh
    docker compose logs gateway -f
    ```

### Using podman / podman-compose

1. Enable the mqtt listener to accept connections other than from 127.0.0.1

    ```sh
    tedge config set mqtt.bind.address 0.0.0.0
    tedge refresh-bridges
    ```

2. Create a folder on your device called `opcua`

    ```sh
    mkdir opcua
    cd opcua
    ```

3. Create the docker compose file and copy the linked file contents to it

    ```sh
    docker-compose.yaml
    ```

    Copy the contents from this file: [docker-compose.yaml](./docker-compose.podman.yml)

4. Start the compose project

    ```sh
    podman-compose up -d
    ```
    
    You can view the logs using the following command:

    ```sh
    podman-compose logs gateway -f
    ```

## Example public OPC UA Servers

You can test the setup by connecting to a few public OPC UA servers, though be aware that these can be slow to respond, but it should at least give you and idea if your setup is working.

### opcua.demo-this.com

The node scan takes about 6-7 minutes.

|Property|Value|
|--|--|
|server|opc.tcp://opcua.demo-this.com:51210/UA/SampleServer|
|Security Mode|None|
|Security Policy|None|
|Authentication|Anonymous|


### opcuaserver.com

The node scan takes > 30 mins!

|Property|Value|
|--|--|
|server|opc.tcp://opcuaserver.com:48010|
|Security Mode|None|
|Security Policy|None|
|Authentication|Anonymous|


## Known errors

### java.lang.UnsatisfiedLinkError

Currently the following warning occurs on some setups when the `gateway` service starts. The application continues after the warning is printed. It is currently unknown what the exact impact is.

```log
Caused by: java.lang.UnsatisfiedLinkError: could not get native definition for type `POINTER`, original error message follows: java.lang.UnsatisfiedLinkError: Unable to execute or load jffi binary stub from `/tmp`. Set `TMPDIR` or Java property `java.io.tmpdir` to a read/write path that is not mounted "noexec".
/app/jffi12820354458810240894.so: Error loading shared library ld-linux-aarch64.so.1: No such file or directory (needed by /app/jffi12820354458810240894.so)
```
