# thin-edge.io Zigbee2MQTT Demo

## Introduction

[Zigbee2MQTT](https://www.zigbee2mqtt.io) is an opensource application that allows you to use Zigbee devices without being forced to use a Zigbee bridge of a specific vendor.

A List of supported Zigbee devices (1400+ devices) from more than 200 manufacturers can be found [here](https://www.zigbee2mqtt.io/information/supported_devices.html).

## Requirements

- Device capable of running [thin-edge.io](https://github.com/thin-edge/thin-edge.io/blob/main/docs/src/supported-platforms.md) and [Zigbee2MQTT](https://www.zigbee2mqtt.io/getting_started/what_do_i_need.html)
- A [supported Zigbee adapter](https://www.zigbee2mqtt.io/information/supported_adapters.html)
- At least one of the [supported Zigbee devices](https://www.zigbee2mqtt.io/information/supported_devices.html)

## Installation

First of all you need to install thin-edge.io itself.
Afterwards you can install Zigbee2MQTT. This can be done in two ways:
- [Using a Docker container](#Zigbee2MQTT-docker-installation)
- [bare-metal installation](#Zigbee2MQTT-bare-metal-installation)

### thin-edge.io installation
1. Setup your devices operating system
2. Install and connect the [thin-edge](https://github.com/thin-edge/thin-edge.io/blob/main/docs/src/howto-guides/002_installation.md) to your desired destination cloud

### Zigbee2MQTT docker installation
1. Make sure you've got docker and docker-compose available on your system
2. Adjust the [configuration.yaml](config/configuration.yaml) and [docker-compose.yaml](docker-compose.yaml) files to your needs (the path to your Zigbee adapter might be different)
3. Startup the docker container by running `docker-compose up -d` within the same folder where also the docker-compose.yaml file is

Further details on Zigbee2MQTT and docker can be found [here](https://www.zigbee2mqtt.io/information/docker.html)

### Zigbee2MQTT bare-metal installation
1. Follow the [instructions](https://www.zigbee2mqtt.io/getting_started/running_zigbee2mqtt.html) to install Zigbee2MQTT on bare-metal
2. Add the [thin-edge-extension.js](config/extension/thin-edge-extension.js) to your Zigbee2MQTT installation ([Instructions](https://www.zigbee2mqtt.io/information/user_extensions.html))
3. Adjust the default configuration.yaml file delivered with Zigbee2MQTT according to your requirements. You can have a look at the sample that is used within the docker installation: [configuration.yaml](config/configuration.yaml)
4. Start/Restart Zigbee2MQTT

## Usage

### Enable/disable joining

For enabling/disabling joining we can use the following MQTT topic: `zigbee2mqtt/bridge/request/permit_join` with the payload `{"value": true}`. If value is set to true, you will enable joining, if false, you will disable joining.

You can use the tedge cli to do this:
`tedge mqtt pub 'zigbee2mqtt/bridge/request/permit_join' '{"value": true}'`

In a later stage we might support operations to enable or disable joining.

Make sure that you are disabling joining after you've added all your devices.

## Datastructure

As thin-edge.io at this point in time does not support creating sub-devices or creating events, we are only able to create measurements for the thin-edge device by now.
Measurements only support numerical values, non numerical values received by Zigbee2MQTT are not transmitted.

To be able to distinguish between measurements sent by different devices, we grouped them by the unique ieee address of the Zigbee device that sent the measurements.
This results in e.g. Cumulocity measurements having the ieee address of the device as a fragment and all values that have been sent by the device as series:
```json
{
    "time": "2021-06-16T17:42:03.431+02:00",
    "id": "48729498",
    "source": {
        "id": "46248768"
    },
    "type": "ThinEdgeMeasurement",
    "0x00158d00033ddd77": {
        "linkquality": {
            "value": 86
        },
        "temperature": {
            "value": 25.74
        },
        "humidity": {
            "value": 60.82
        },
        "pressure": {
            "value": 989
        },
        "battery": {
            "value": 41
        },
        "voltage": {
            "value": 2895
        }
    }
}
```

## Troubleshooting

### I do have issues using Zigbee2MQTT
Zigbee2MQTT is logging a lot of information so in case of issues try to look into these logs to find the cause of your issues.
On Docker installations you can access the logs using `docker logs zigbee2mqtt`

You can also have a look at the [FAQ of Zigbee2MQTT](https://www.zigbee2mqtt.io/information/FAQ.html)