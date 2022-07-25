# thin-edge.io in Docker self-update

Self-update feature of thin-edge.io is very flexible and provides ways to add more robust updates for thin-edge.io like rollback and snapshot.

This example shows how the above can be achieved using a couple of additional hooks in docker deployed environment.

## Prerequisites

1. thin-edge.io version 0.6.1 (comes from github releases)
2. docker (if you need to add it to your system follow: [docker installation guide](https://docs.docker.com/desktop/linux/install/))
3. root access to the environment (most of the script require to be executed with `sudo`)
4. mosquitto_clients installed (mosquitto_pub in particular)
5. ...

## Setup

The below steps are reproduced in the test script

In this example we will setup thin-edge.io in a single container based on Alpine linux where we then can run the showcase script which will execute all necessary actions to create new container with updated version.

Before we start let's move to docker directory:

```shell
cd docker
```

- First step is to built docker images for our containers

```shell
sudo ./build.sh
```

- Now when the build is ready we can proceed with loading the images:

```shell
docker load -i ./files/tedge_image-v0.6.1-before-update.docker-image-tarx
```

We have to create a couple directories for the update

```shell
sudo mkdir -p /tmp/tedge-update-store
sudo mkdir -p /var/run/tedge_update
```

Let's start our container now:

> The next command requires you to choose the right binaries for your system:

If you are running on `arm` machine use this:

```shell
docker run -it -d --name=thin-edge \
       --mount type=bind,source=/tmp/tedge-update-store,target=/tmp/tedge-update-store \
       --mount type=bind,source=/var/run/tedge_update,target=/var/run/tedge_update \
       --mount type=bind,source=/usr/bin/docker,target=/usr/bin/docker \
       --mount type=bind,source=/var/run/docker.sock,target=/run/docker.sock \
       --mount type=bind,source=/lib/ld-linux-aarch64.so.1,target=/lib/ld-linux-aarch64.so.1 \
       --mount type=bind,source=/lib/aarch64-linux-gnu,target=/lib/aarch64-linux-gnu \
       tedge_image:v0.6.1-before-update
```

If you are on `x86_64` (on Ubuntu) follow with this command:

```shell
docker run -it -d --name=thin-edge \
   --mount type=bind,source=/tmp/tedge-update-store,target=/tmp/tedge-update-store \
   --mount type=bind,source=/var/run/tedge_update,target=/var/run/tedge_update \
   --mount type=bind,source=/usr/bin/docker,target=/usr/bin/docker \
   --mount type=bind,source=/var/run/docker.sock,target=/run/docker.sock \
   --mount type=bind,source=/lib64/ld-linux-x86-64.so.2,target=/lib64/ld-linux-x86-64.so.2 \
   --mount type=bind,source=/lib/x86_64-linux-gnu,target=/lib/x86_64-linux-gnu \
   tedge_image:v0.6.1-before-update \
```

The command above does the following:
It will start the container `thin-edge` as a daemon with a few mount files:

> /tmp/tedge-update-store
> /var/run/tedge_update
> These directories will be required to store temporary snapshots as well as provide image source for the updated version.

The next few binds are there to allow access to host's docker command from inside the container.

- Let's start thin-edge inside the container:
  First we configure our tenant

```shell
docker exec -it thin-edge tedge config set c8y.url tenant.url.com
```

Then upload certificate:

```shell
docker exec -it thin-edge sudo tedge cert upload c8y --user yourusername
```

And finally issue `tedge connect`:

```shell
docker exec -it thin-edge tedge connect c8y
```

- Now as we have prepared the images and container is running we need to trigger the self-update:

```shell
docker exec -it thin-edge mosquitto_pub -t c8y/s/ds -m '528,deviceid,tedge_image,0.6.1,url_to_image_path'
```

Or use your tenant to create software update operation.
