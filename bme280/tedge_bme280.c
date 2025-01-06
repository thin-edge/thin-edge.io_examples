#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <MQTTClient.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <fcntl.h>
#include "bme280.h"

//Raspberry Pi's default I2C device file
#define IIC_Dev     "/dev/i2c-1"

int fd;

void user_delay_ms(uint32_t period)
{
    usleep(period*1000);
}

int8_t user_i2c_read(uint8_t id, uint8_t reg_addr, uint8_t *data, uint16_t len)
{
    write(fd, &reg_addr, 1);
    read(fd, data, len);
    return 0;
}

int8_t user_i2c_write(uint8_t id, uint8_t reg_addr, uint8_t *data, uint16_t len)
{
    int8_t *buf = alloca(len + 1);
    buf[0] = reg_addr;
    memcpy(buf + 1, data, len);
    write(fd, buf, len + 1);
    return 0;
}

void publish(MQTTClient client, char* topic, char* payload) {
    MQTTClient_message pubmsg = MQTTClient_message_initializer;
    pubmsg.payload = payload;
    pubmsg.payloadlen = strlen(pubmsg.payload);
    pubmsg.qos = 2;
    pubmsg.retained = 0;
    MQTTClient_deliveryToken token;
    MQTTClient_publishMessage(client, topic, &pubmsg, &token);
    MQTTClient_waitForCompletion(client, token, 1000L);
    printf("%s\n", payload);
}

int main(int argc, char* argv[]) {
    char buffer[1024];

    const char* mqtt_host = "localhost";
    const char* mqtt_client = argv[0];

    MQTTClient client;
    MQTTClient_create(&client, mqtt_host, mqtt_client, MQTTCLIENT_PERSISTENCE_NONE, NULL);
    MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;

    if ((fd = open(IIC_Dev, O_RDWR)) < 0) {
        printf("Failed to open the i2c bus %s", IIC_Dev);
        exit(1);
    }
    if (ioctl(fd, I2C_SLAVE, 0x76) < 0) {
        printf("Failed to acquire bus access and/or talk to slave.\n");
        exit(1);
    }
    if (MQTTClient_connect(client, &conn_opts) != MQTTCLIENT_SUCCESS) {
        printf("Failed to connect MQTT\n");
        exit(1);
    }

    struct bme280_dev dev = {
        .dev_id = BME280_I2C_ADDR_SEC,
        .intf = BME280_I2C_INTF,
        .read = user_i2c_read,
        .write = user_i2c_write,
        .delay_ms = user_delay_ms,
        .settings = {
            .osr_h = BME280_OVERSAMPLING_1X,
            .osr_p = BME280_OVERSAMPLING_16X,
            .osr_t = BME280_OVERSAMPLING_2X,
            .filter = BME280_FILTER_COEFF_16,
            .standby_time = BME280_STANDBY_TIME_62_5_MS
        }
    };
    uint8_t settings_sel = BME280_STANDBY_SEL | BME280_FILTER_SEL;
    struct bme280_data comp_data;

    settings_sel |= BME280_OSR_TEMP_SEL;
    settings_sel |= BME280_OSR_PRESS_SEL;
    settings_sel |= BME280_OSR_HUM_SEL;

    bme280_init(&dev);
    bme280_set_sensor_settings(settings_sel, &dev);
    bme280_set_sensor_mode(BME280_NORMAL_MODE, &dev);

    for (;;) {
        /* Delay while the sensor completes a measurement */
        dev.delay_ms(70);
        bme280_get_sensor_data(BME280_ALL, &comp_data, &dev);

        snprintf(buffer, sizeof(buffer),
            "{\"temperature °C\":%.2f, \"pressure hPa\":%.1f, \"humidity %%\":%.1f}",
            comp_data.temperature,
            comp_data.pressure / 100.0,
            comp_data.humidity);
        publish(client, "te/device/main///m/", buffer);
        sleep(2);
    }

    MQTTClient_disconnect(client, 1000);
    MQTTClient_destroy(&client);
    return 0;
}
