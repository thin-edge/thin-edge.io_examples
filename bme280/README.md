Sending data from the bme280 sensor to thin-edge.

## [BME280](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf)
* Temperature, humidity and pressure sensor
* We use the driver from [check_bme280](https://github.com/tilghman/check_bme280)
  - copied into [bme280](bme280).
  - use `git clone --recurse` to have this dependency cloned.

## Install

The pre-requisites are the `wiringpi`, `openssl` and `paho-mqtt` libraries.

```
sudo apt-get install wiringpi
sudo apt-get install libssl-dev
git clone https://github.com/eclipse/paho.mqtt.c.git
cd org.eclipse.paho.mqtt.c.git
make
sudo make install
```

One also needs to enable I2C.

```
sudo raspi-config
```

## Content

* `local_bme280.c` publishes sensor data on the console.
* `cloud_bme280.c` publishes sensor data to Cumulocity.
* `tedge_bme280.c` publishes sensor data to thin-edge.

## Resources

Enviro+:
* https://shop.pimoroni.com/products/enviro?variant=31155658457171
* https://learn.pimoroni.com/article/getting-started-with-enviro-plus#introduction
* https://github.com/pimoroni/enviroplus-python


BME280:
* https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf
* https://github.com/tilghman/check_bme280

C8Y:
* https://www.cumulocity.com/guides/device-sdk/mqtt-examples/#hello-mqtt-c
