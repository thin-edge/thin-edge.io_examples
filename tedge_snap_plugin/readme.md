# thin-edge.io `snap` Software Management plugin

## Requirements

* The `snap` package manager is installed and configured on the device.
  ** A guide on how to install the `snap` package manager can be found [here](https://snapcraft.io/docs).

* `thin-edge.io` is installed on the device.
  ** A guide on how to install `thin-edge.io` can be found [here](https://thin-edge.github.io/thin-edge.io/html/howto-guides/002_installation.html)

## Installation

* Check out this repo
* Run `pip3 install -r requirements`

For the plugin to be installed correctly and used by `thin-edge.io`, you need to copy the file `snap.py` to `thin-edge.io` configuration directory.

```shell
sudo cp snap.py /etc/thin-edge.io/sm-plugins/snap
```

## Usage

The plugin has been developed along the guidelines [in tutorials](https://thin-edge.github.io/thin-edge.io/html/tutorials/write-my-software-management-plugin.html).
