
# build images
echo "**** Building tegde docker image"
docker build -t tedge_image:v0.6.1-before-update .


echo "**** Copying image and changing image version text-file /image-version, to have an image to play the update process"
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
docker save -o ./files/tedge_image-v0.6.1-after-update.docker-image-tarx  tedge_image:v0.6.1-after-update


# removing images from docker
docker rmi tedge_image:v0.6.1-before-update
docker rmi tedge_image:v0.6.1-after-update


echo "Manual steps left todo:
        (*) 1) build local git: ../../thin-edge.io_selfup/ 
	(*) 2) copy local git's plugins/tedge_docker_plugin/tedge_docker_plugin.sh into image(s)
	(*) 3) copy local git's target/release/tedge_updater into image(s)


        4) Assure folder do exist on host:
	     mkdir /tmp/tedge-update-store -p
	     mkdir /var/run/tedge_update   -p

	(*) 5) save images
	   and rmi images

        6) Initially start productive container:
              docker run -it -d --name=thin-edge \
       --mount type=bind,source=/tmp/tedge-update-store,target=/tmp/tedge-update-store \
       --mount type=bind,source=/var/run/tedge_update,target=/var/run/tedge_update \
       --mount type=bind,source=/usr/bin/docker,target=/usr/bin/docker \
       --mount type=bind,source=/var/run/docker.sock,target=/run/docker.sock \
       --mount type=bind,source=/lib/ld-linux-aarch64.so.1,target=/lib/ld-linux-aarch64.so.1 \
       --mount type=bind,source=/lib/aarch64-linux-gnu,target=/lib/aarch64-linux-gnu \
       tedge_image:v0.6.1-before-update	

        7) create /etc/tedge/tedge_components.toml
           See https://github.com/cstoidner/thin-edge.io_selfup/blob/feature/759_self_update_agent/crates/core/plugin_sm/src/plugin_manager.rs#L257

           Example:
             echo -e 'components = [ \\\"tedge_1st-plugin\\\" ]' >/etc/tedge/tedge_components.toml	      
"
