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

pushd ../docker-image/ > /dev/null

# FIX 1: check changes in local repo
# FIX 2: in build.sh solve local-repo's patch handling
# FIX 3: use include in Dockerfile new version dummy
# FIX 4: check "Manual Steps" output in build.sh and solve/remove as much as possible
# FIX 5: Consider fail on "--init" of tedge_agent and tedge_mapper ("Connection Error I/O: Connection refused (os error 111)")
#        Similar reason as "tedge disconnect" (-> mosquitto (re)start takes long?) ?
# FIX 6: Maybe better names for image version and image files as "...before|after-update"?
# FIX 7: Device ID is hardcoded in Dockerfile
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


# decouple hooks for tedge_updater to call them manually for that test
test_info "Decoupling hooks to call them manually, for better test-control"
set -x
docker exec -it thin-edge sh -c "mv /etc/tedge/hooks/hook-start-or-rollback /etc/tedge/hooks/h2.sh"
docker exec -it thin-edge sh -c "mv /etc/tedge/hooks/hook-stop-and-snapshot /etc/tedge/hooks/h1.sh"
docker exec -it thin-edge sh -c "echo 'exit 0' >/etc/tedge/hooks/hook-start-or-rollback"
docker exec -it thin-edge sh -c "echo 'exit 0' >/etc/tedge/hooks/hook-stop-and-snapshot"
docker exec -it thin-edge sh -c "chmod +x /etc/tedge/hooks/hook-start-or-rollback"
docker exec -it thin-edge sh -c "chmod +x /etc/tedge/hooks/hook-stop-and-snapshot"
set -

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

# call h1 manually (hook stop)
test_info "Calling hook1 (hook stop)"
set -x
docker exec -it thin-edge /etc/tedge/hooks/h1.sh
set -
    ## check:
    ### now container shall be named "thin-edge_snapshot"
    ### tedge shall be disconnected and service stopped
    ### config is in /tmp/tedge-update-store/

# trigger tedge_updater
test_info "Triggering tedge_updater"
set -x
docker exec -it thin-edge_snapshot sh -c "
      echo -e 'install\\ttedge_image\\tv0.6.1-after-update\\t/tedge_image-v0.6.1-after-update.docker-image-tarx' | /bin/tedge_updater update-list --plugin-name /etc/tedge/sm-plugins/tedge_docker_plugin.sh"
set -
    ## check:
    ### new image shall be on docker
    ### new container shall be started
    ### "0" in /var/run/tedge_update/update_result


    ### BUG: STDIN not forwarded from tedge_updater to sm-plugin's command 'update-list'
    ###      'LoggedCommand' used by tedge_updater to call sm-plugin breaks somehow STDIN forwarding
    
    ### BUG: Initial container from sm-plugin is running:
    ###       /bin # docker ps -a
    ###       CONTAINER ID   IMAGE                              COMMAND        CREATED         STATUS         PORTS     NAMES
    ###       5737644c3b1e   tedge_image:v0.6.1-after-update    "/sbin/init"   8 minutes ago   Up 7 minutes             silly_bhabha
    ###       17ed3f0724d6   tedge_image:v0.6.1-before-update   "/sbin/init"   3 hours ago     Up 3 hours               thin-edge_snapshot
    ### 
    ### => to be avoid start in sm-plugin or stop and remove in hook!

# call h2 manually (hook start or rollback)
#/etc/tedge/hooks/h2.sh
# doing that call later, due to bug below

    ### BUG: Error when calling hook 2. Reason (cert files ownerships):
    ###   /etc/tedge/device-certs # ls -la
    ###   total 20
    ###   drwxrwxr-x    1 mosquitt mosquitt      4096 May 13 20:49 .
    ###   drwxrwxr-x    1 tedge    tedge         4096 May 14 10:52 ..
    ###   -r--r--r--    1 root     root           676 May 13 20:49 tedge-certificate.pem
    ###   -r--------    1 root     root           246 May 13 20:49 tedge-private-key.pem
    ###
    ### Other imported config files might be also impacted!
    ###    /etc/tedge # ls -laR
    ###    .:
    ###    total 68
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 .
    ###    drwxr-xr-x    1 root     root          4096 May 13 20:49 ..
    ###    drwxrwxr-x    2 tedge-ag tedge-ag      4096 May 13 12:06 .agent
    ###    drwxrwxr-x    1 mosquitt mosquitt      4096 May 13 20:49 device-certs
    ###    drwxr-xr-x    1 root     root          4096 May 15 11:53 hooks
    ###    drwxr-xr-x    2 root     root          4096 May 15 11:46 hooks_goal
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 14 10:58 mosquitto-conf
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 13 12:05 operations
    ###    drwxrwxr-x    2 tedge    tedge         4096 May 13 12:05 plugins
    ###    -rwxr-xr-x    1 root     root           275 May 13 20:49 rc-service_restart-wrapper
    ###    drwxr-xr-x    1 root     root          4096 May 13 20:49 sm-plugins
    ###    -r--r--r--    1 root     root           316 May 13 20:49 system.toml
    ###    -rw-r--r--    1 tedge    tedge          135 May 14 10:58 tedge.toml
    ###    -rw-r--r--    1 root     root            29 May 15 11:39 tedge_components.toml
    ###    
    ###    ./.agent:
    ###    total 12
    ###    drwxrwxr-x    2 tedge-ag tedge-ag      4096 May 13 12:06 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    
    ###    ./device-certs:
    ###    total 20
    ###    drwxrwxr-x    1 mosquitt mosquitt      4096 May 13 20:49 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    -r--r--r--    1 mosquitt mosquitt       676 May 13 20:49 tedge-certificate.pem
    ###    -r--------    1 mosquitt mosquitt       246 May 13 20:49 tedge-private-key.pem
    ###    
    ###    ./hooks:
    ###    total 28
    ###    drwxr-xr-x    1 root     root          4096 May 15 11:53 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    -rwxr-xr-x    1 root     root           545 May 13 20:49 h1.sh
    ###    -rwxr-xr-x    1 root     root          2698 May 13 20:49 h2.sh
    ###    -rwxr-xr-x    1 root     root             7 May 15 11:53 hook_start-or-rollback.sh
    ###    -rwxr-xr-x    1 root     root             7 May 15 11:53 hook_stop-and-snapshot.sh
    ###    
    ###    ./hooks_goal:
    ###    total 28
    ###    drwxr-xr-x    2 root     root          4096 May 15 11:46 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    -rwxr-xr-x    1 root     root           545 May 15 11:46 h1.sh
    ###    -rwxr-xr-x    1 root     root          2698 May 15 11:46 h2.sh
    ###    -rwxr-xr-x    1 root     root             7 May 15 11:46 hook_start-or-rollback.sh
    ###    -rwxr-xr-x    1 root     root             7 May 15 11:46 hook_stop-and-snapshot.sh
    ###    
    ###    ./mosquitto-conf:
    ###    total 20
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 14 10:58 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    -rw-------    1 tedge    tedge         1113 May 14 10:58 c8y-bridge.conf
    ###    -rw-------    1 tedge    tedge          261 May 14 10:58 tedge-mosquitto.conf
    ###    
    ###    ./operations:
    ###    total 24
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 13 12:05 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    drwxrwxr-x    2 tedge-ma tedge-ma      4096 May 13 12:05 az
    ###    drwxrwxr-x    1 tedge-ma tedge-ma      4096 May 13 20:49 c8y
    ###    
    ###    ./operations/az:
    ###    total 12
    ###    drwxrwxr-x    2 tedge-ma tedge-ma      4096 May 13 12:05 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 13 12:05 ..
    ###    
    ###    ./operations/c8y:
    ###    total 16
    ###    drwxrwxr-x    1 tedge-ma tedge-ma      4096 May 13 20:49 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 13 12:05 ..
    ###    -rw-r--r--    1 root     root            91 May 13 20:49 c8y_LogfileRequest
    ###    -rw-r--r--    1 root     root             0 May 13 20:49 c8y_Restart
    ###    -rw-r--r--    1 root     root             0 May 13 20:49 c8y_SoftwareUpdate
    ###    
    ###    ./plugins:
    ###    total 12
    ###    drwxrwxr-x    2 tedge    tedge         4096 May 13 12:05 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    
    ###    ./sm-plugins:
    ###    total 20
    ###    drwxr-xr-x    1 root     root          4096 May 13 20:49 .
    ###    drwxrwxr-x    1 tedge    tedge         4096 May 15 11:46 ..
    ###    -rwxr-xr-x    1 root     root          6704 May 13 20:49 tedge_docker_plugin.sh
    ###    /etc/tedge # 

# TODO: workaround below was moved to hook 2 (start or rollback)
# workaround for bug above
#test_info "Workaround: Fixing ownership of cert-files in new container"
#docker exec -it thin-edge chown mosquitto:mosquitto ./tedge-certificate.pem 
#docker exec -it thin-edge chown mosquitto:mosquitto ./tedge-private-key.pem 

test_info "Calling hook2 (start-or-rollback)"
set -x
docker exec -it thin-edge_snapshot /etc/tedge/hooks/h2.sh
set -
# doing that call later, due to bug below

    ### BUG: If some error occurs in h2.sh script will be exited instead of callin rollback function (e.g. there was mv -r .. ..)!

    ### BUG: Do NOT copy whole /etc/tedge since that is not just config, but also plugins, hooks, ...!!!!!

    ### BUG: image name and tag are for now hardcoded in h1 and h2.


    ### BUG: add stop&rm&rmi of old container&image into h2 via docker exec into new cointainer.

    ### TODO: add open topics from final-run-in-testing.txt

test_info "Test done."
popd

