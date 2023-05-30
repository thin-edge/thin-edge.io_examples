# remote-access-connect

This remote access connect plugin for thin-edge is able to establish a WebSocket connection between c8y and a server running on the thin-edge device in addition to the usual TCP capabilities.

This functionality can be used together with the [cumulocity-webrtc-webcam-plugin](https://github.com/SoftwareAG/cumulocity-webrtc-webcam-plugin) to view a video stream from a camera connected to the thin-edge device.

The video stream is transferred via a separate peer-to-peer connection between the users browser and a server running locally on the device using [WebRTC](https://en.wikipedia.org/wiki/WebRTC).

For the WebRTC functionality on the thin-edge side we can utilize an existing WebRTC solution: [go2rtc](https://github.com/AlexxIT/go2rtc) to stream e.g. a video feed from an USB Webcams, a Raspberry Pi camera module or any kind RTSP stream.

The remote access connect plugin is configured to establish a WebSocket connection for any operation that should connect to port `1984` on host `127.0.0.1`. For all other operations it will establish the usual TCP connections that are required for e.g. SSH.

Below installation instructions have been verified on a Raspberry Pi 4 using Ubuntu 22.04 64 bit.

## Installation instructions

- uninstall the `c8y-remote-access-plugin` if installed:
```bash
sudo apt remove c8y-remote-access-plugin
```
- install a recent version of nodejs:
```bash
sudo apt update
sudo apt install curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt update
sudo apt install nodejs
```
- checkout this repo
- build and install the remote access connect plugin:
```bash
npm i
npm run pack
sudo npm i -g ./c8y-remote-access-*.tgz
```
- create the file: `/etc/tedge/operations/c8y/c8y_RemoteAccessConnect` with this content:
```
[exec]
command = "/usr/bin/c8y-remote-access"
topic = "c8y/s/ds"
on_message = "530"
```
- reconnect tedge:
```bash
sudo tedge disconnect c8y
sudo tedge connect c8y
```

## Installation instructions go2rtc

- download the latest release of [go2rtc](https://github.com/AlexxIT/go2rtc/releases) that matches the architecture of your device to your current users home directory
```bash
wget https://github.com/AlexxIT/go2rtc/releases/download/v1.3.1/go2rtc_linux_arm64
```
- copy the `go2rtc.yaml` file also into your home directory
- Adjust the `streams` section of the `go2rtc.yaml` file according to your needs, just keep the `tedge_cam` as the name of your stream.
- You can verify the setup, by starting it temporarily by executing the previously downloaded binary:
```bash
./go2rtc_linux_arm64
```
by connecting to `http://<local-ip-of-tedge>:1984/stream.html?src=tedge_cam&mode=webrtc` with your browser you should be able to see the camera stream.
- Depending on your firewall setup you may also need to add a [TURN server](https://en.wikipedia.org/wiki/Traversal_Using_Relays_around_NAT) to the `ice_servers` section.
- You might want to adjust the `listen` attributes of the `api`, `rtsp`, and `srtp` sections of these files to be prefixed with `127.0.0.1` (e.g. `127.0.0.1:1984` for the `api`) to only allow local connections
- copy and adjust the `go2rtc.service` file to `/etc/systemd/system/go2rtc.service`, adjust it to your setup (e.g. the `ExecStart`, `WorkingDirectory`, `User` and `Group` settings might need to be adjusted if you are not using a user called `ubuntu`)
- you can then start and enable the service:
```bash
sudo systemctl start go2rtc
sudo systemctl enable go2rtc
```

## Usage

- install the [cumulocity-webrtc-webcam-plugin](https://github.com/SoftwareAG/cumulocity-webrtc-webcam-plugin) to cockpit and/or devicemanagement application
- create a new remote access configuration of type `PASSTHROUGH` and set the host to `127.0.0.1` and the port to `1984` and ensure that the name contains `webcam`.
- after refreshing the page or navigating another time to the device you should see a `Webcam` tab, where you can start the video stream

## Debugging

- the WebRTC connection can be e.g. debugged from firefox by visiting `about:webrtc`.
