#!/bin/bash

#
# Module-Test tedge_updater
#

CNOTE='\033[0;33m'
CINFO='\033[0;34m' # blue
CERROR='\033[0;31m'
CNORMAL='\033[0m' # No Color

# Args:
#   $1 - optional set to "force-wait" to wait for zusu user-key despite of option "-w"
wait_for_key() {
   if [ "$DO_WAIT" = "YES" ] || [ "$1" = "force-wait" ]; then
     echo -e "${CNOTE}Press any key to continue${CNORMAL}"
     read -n 1
     echo -e "${CNOTE}Thanks, going on..${CNORMAL}"
   fi
}

check_for_cmd() {
   if ! command -v $1 &> /dev/null
   then
      echo -e "${CERROR}ERROR: Command $1 could not be found"
      exit
   fi
}

# Args:
#   $1 - text to display
#   $2 - optional set to "force-wait" when wait for user-key despite of option "-w" 
test_info() {
   echo -e "${CINFO}INFO: $1${CNORMAL}"
   wait_for_key $2
}


echo "Check for required commands"
check_for_cmd read
check_for_cmd pushd

DO_BUILD="YES"
DO_WAIT="YES"
DO_UPLOAD_CERT="YES"

while [[ $# -gt 0 ]]; do
  case $1 in
    -b|--no-build)
      DO_BUILD="NO"
      echo "Disabled build by cmdline argument."
      shift # past argument
      ;;
    -w|--no-wait)
      DO_WAIT="NO"
      echo "Disabled user interaction."
      shift
      ;;
     -c|--no-cert-upload)
      DO_UPLOAD_CERT="NO"
      echo "Disabled upload of certificate to cloud."
      shift
      ;;
     --fail-container-start)
      echo "Forcing new container start to fail (to test rollback)"
      DO_CONTAINER_START_FAIL="YES"
      shift
      ;;
     -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

#
# (1) Building Docker Image
#

pushd ../docker/ > /dev/null

if [ "$DO_BUILD" = "YES" ]; then
   test_info "About to start docker image build (two images: one image under test, another image that is used as update)" "force-wait"
   ./build.sh
else
   echo "Skipping docker image build."
fi

#
# (2) Prepare container start
#

test_info "About to load image under test into docker"
set -x
docker load -i ./files/tedge_image-v0.6.1-before-update.docker-image-tarx
set -

#
# (3) Start container
#

test_info "About to start container"
set -x
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
set -


# 
# (4) Simulate selfupdate by directly calling tedge_updater
#

#
# (4.a) prepare test

test_info "Providing new image to current container"

# provide new image to existing container (would be done by SM agent in normal flow)
set -x
docker cp ./files/tedge_image-v0.6.1-after-update.docker-image-tarx thin-edge:/
docker exec -it thin-edge sh -c "echo -e 'components = [ "tedge_image" ]' >/etc/tedge/tedge_components.toml"
set -


## decouple hooks for tedge_updater to call them manually for that test
#test_info "Decoupling hooks to call them manually, for better test-control"
#set -x
#docker exec -it thin-edge sh -c "mv /etc/tedge/hooks/hook-start-or-rollback /etc/tedge/hooks/h2.sh"
#docker exec -it thin-edge sh -c "mv /etc/tedge/hooks/hook-stop-and-snapshot /etc/tedge/hooks/h1.sh"
#docker exec -it thin-edge sh -c "echo 'exit 0' >/etc/tedge/hooks/hook-start-or-rollback"
#docker exec -it thin-edge sh -c "echo 'exit 0' >/etc/tedge/hooks/hook-stop-and-snapshot"
#docker exec -it thin-edge sh -c "chmod +x /etc/tedge/hooks/hook-start-or-rollback"
#docker exec -it thin-edge sh -c "chmod +x /etc/tedge/hooks/hook-stop-and-snapshot"
#set -

# connect container to C8Y
test_info "Connecting to C8Y"
test_info "C8Y account data are hardcoded here! See both script lines below for tenent!"
set -x
docker exec -it thin-edge tedge config set c8y.url christoph.basic.stage.c8y.io
set -
if [ "$DO_UPLOAD_CERT" = "YES" ]; then
   test_info "Line below requires manual password input for your C8Y user. USER IS HARDCODED (name: Christoph)!" "force-wait"
   set -x
   docker exec -it thin-edge sudo tedge cert upload c8y --user Christoph
fi
set -x
docker exec -it thin-edge tedge connect c8y
set -

#
# (4.b) processing tedge_updater test

test_info "### Processing selfupdate"

## call h1 manually (hook stop)
#test_info "Calling hook1 (hook stop)"
#set -x
#docker exec -it thin-edge /etc/tedge/hooks/h1.sh
#set -
    ## check:
    ### now container shall be named "thin-edge_snapshot"
    ### tedge shall be disconnected and service stopped
    ### config is in /tmp/tedge-update-store/

if [ "$DO_CONTAINER_START_FAIL" = "YES" ]; then
   test_info "Forcing new container start to fail"
   # remove share folder to force container start fail
   sudo rm -rf /tmp/tedge-update-store
fi

# trigger tedge_updater
test_info "Triggering tedge_updater"
set -x
docker exec -it thin-edge sh -c "
      echo -e 'install\\ttedge_image\\tv0.6.1-after-update\\t/tedge_image-v0.6.1-after-update.docker-image-tarx' | /bin/tedge_updater update-list --plugin-name tedge_docker_plugin.sh"
set -

if [ "$DO_CONTAINER_START_FAIL" = "YES" ]; then
   # remove share folder to force container start fail
   mkdir -p /tmp/tedge-update-store
fi

#test_info "Calling hook2 (start-or-rollback) arg 0"
#set -x
#docker exec -it thin-edge_snapshot /etc/tedge/hooks/h2.sh 0
#set -

test_info "Test done."
popd

