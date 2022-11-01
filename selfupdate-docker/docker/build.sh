#!/bin/bash

# build images
echo "**** Building tegde docker image"
docker build -t tedge_image:v0.6.1-before-update .

echo "**** Copying image and changing image version text-file /image-version, to have an image to play the update process"
sudo mkdir -p /tmp/tedge-update-store
sudo mkdir -p /var/run/tedge_update
docker run -it -d --name=thin-edge \
       --mount type=bind,source=/tmp/tedge-update-store,target=/tmp/tedge-update-store \
       --mount type=bind,source=/var/run/tedge_update,target=/var/run/tedge_update \
       --mount type=bind,source=/usr/bin/docker,target=/usr/bin/docker \
       --mount type=bind,source=/var/run/docker.sock,target=/run/docker.sock \
       --mount type=bind,source=/lib/ld-linux-aarch64.so.1,target=/lib/ld-linux-aarch64.so.1 \
       --mount type=bind,source=/lib/aarch64-linux-gnu,target=/lib/aarch64-linux-gnu \
       tedge_image:v0.6.1-before-update

docker exec thin-edge sh -c 'echo "Image from after update" >/image-version'
docker stop thin-edge
docker commit thin-edge tedge_image:v0.6.1-after-update
docker rm thin-edge

# save images as files
echo "**** Saving both images to files"
mkdir -p ./files
docker save -o ./files/tedge_image-v0.6.1-before-update.docker-image-tarx tedge_image:v0.6.1-before-update
docker save -o ./files/tedge_image-v0.6.1-after-update.docker-image-tarx tedge_image:v0.6.1-after-update

# removing images from docker
docker rmi tedge_image:v0.6.1-before-update
docker rmi tedge_image:v0.6.1-after-update
