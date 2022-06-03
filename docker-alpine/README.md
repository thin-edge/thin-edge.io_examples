# Docker for Alpine

By using this image,
you will have a docker container where all thin-edge.io processes and mosquitto run inside the same container.

## Configurable parameters

- This Dockerfile is supporting thin-edge.io version **0.7.0 or later**.
  You can change the version by modifying this part of Dockerfile.

```Dockerfile
ARG VERSION=0.7.0
```

- The default device ID is `tedge_alpine`. This is used to create a self-signed certificate.
  Also, you can change the device ID by modifying this part of Dockerfile.

```Dockerfile
ARG DEVICEID=tedge_alpine
```

- The default Cumulocity URL is `mqtt.cumulocity.com`.
  It's used to set `c8y.url` in the tedge configuration.
  Modify this part of Dockerfile to have your Cumulocity tenant URL.

```Dockerfile
ARG C8YURL=mqtt.cumulocity.com
```

- The default Azure IoT Hub URL is `example.azure-devices.net`.
  It's used to set `az.url` in the tedge configuration.
  Modify this part of Dockerfile to have your Azure IoT Hub URL.

```Dockerfile
ARG AZURL=example.azure-devices.net
```

## Create a container

1. Build the image

```shell
docker build -t tedge_docker_alpine .
```

2. Create and start a container

```shell
docker run -it -d --name=tedge tedge_docker_alpine
```

3. Enter the container

```shell
docker exec -it tedge sh
```

## After creation of container

The created container has a self-signed certificate already.
However, the certificate is not yet uploaded to your desired cloud.
More steps need to be done inside the container.


### Cumulocity IoT

1. Configure `c8y.url` and upload certificate to Cumulocity.

```shell
tedge cert upload c8y --user <C8YUSER>
```

2. Run `tedge connect c8y`. This command starts `mosquitto`, `tedge-mapper-c8y`, `tedge-agent` services defined in OpenRC.

```shell
tedge connect c8y
```

3. To enable and start `c8y-configuration-plugin` and `c8y-log-plugin`, run those commands.

```shell
rc-update add c8y-configuration-plugin default
rc-update add c8y-log-plugindefault
rc-service c8y-configuration-plugin start
rc-service c8y-log-plugin start
```

### Azure IoT Hub

1. Configure `az.url` and do this step: [Register a device on Azure IoT Hub](https://thin-edge.github.io/thin-edge.io/html/tutorials/connect-azure.html#register-the-device-on-azure-iot-hub).

2. Run `tedge connect az`. This command starts `mosquitto` and `tedge-mapper-az` services defined in OpenRC.

```shell
tedge connect az
```

## Known issues / potential improvements

(1) Supporting collectd is not yet completed.
[The `collectd.conf` in the thin-edge.io repository](https://github.com/thin-edge/thin-edge.io/blob/main/configuration/contrib/collectd/collectd.conf) doesn't work for Alpine.
The OpenRC script for `tedge-mapper-collectd` service is ready though. 

(2) Didn't create "APK software management plugin".
It's possible to manage APK packages from Cumulocity if there is a APK plugin.
If you want to place a software management plugin, add those steps in the Dockerfile.

```Dockerfile
COPY ./etc/tedge/sm-plugins/<your_plugin> /etc/tedge/sm-plugins/<your_plugin>
RUN chown root:root /etc/tedge/sm-plugins/<your_plugin>
RUN chmod +x /etc/tedge/sm-plugins/<your_plugin>
```
