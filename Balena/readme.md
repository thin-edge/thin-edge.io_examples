# Use Thin-edge.io and Balena together

## WORK IN PROGRESS, UNDER REVIEW

By using this example, you can combine an existing Balena container with an additional docker container where all thin-edge.io processes and mosquito run.

We used a Balena image, which can be found on the Balena website. For thin-edge.io we used the existing Alpine example, which can be found here.

To make this possible a few things must be done:

After you downloaded the Balena image, you need to place the thin-edge-alpine folder in the Balena folder (in the same folder as the docker compose file).

Insert image floder tree

In the dockerfile change the DEVICEID and C8YURL to your needs.
Every time when a new build has taken place, a new certificate is created and must be uploaded to the cloud tenant. To use the same certificate every time, replace line ```'RUN tedge cert create --device-id $DEVICEID'``` with the following"
:
```
# Create a self-signed certificate, and upload it to cloud tennant
# RUN tedge cert create --device-id $DEVICEID
COPY ./certs/tedge-certificate.pem /etc/tedge/device-certs/
COPY ./certs/tedge-private-key.pem /etc/tedge/device-certs/
```
To create a self-signed certificate, you can do the following:

Generate new cert inside the thin-edge container:
```
$ tedge cert create --device-id [DEVICEID]
•	copy both files from /etc/tedge/device-certs/ from inside thin-edge container to 
cat /etc/tedge/device-certs/tedge-certificate.pem
cat /etc/tedge/device-certs/tedge-private-key.pem
```
To connect both docker images via MQTT you need add some lines to the docker compose file, this maps the internal ports to the host system:
```
thin-edge:
    build: ./thin-edge-alpine
    network_mode: "host"
    ports:
      - "1883:1883"
      - "8883:8883"
  ```    
todo: add dependency check if thin-edge.io has started

