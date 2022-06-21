# thin-edge.io `apk` Software Management plugin

## Requirements

* The `apk` package manager is installed on the device, e.g. using alpine base image.

* `thin-edge.io` is installed on the device.
  ** A guide on how to install `thin-edge.io` can be found [here](https://thin-edge.github.io/thin-edge.io/html/howto-guides/002_installation.html)

## Installation

* Check out this repo or copy content of the apk file
~~* Install perl where since its needed by the plugin, e.g. `apk add perl`~~ Perl not needed anymore, thanks @https://github.com/reubenmiller

For the plugin to be installed correctly and used by `thin-edge.io`, you need to copy the file `apk` to `thin-edge.io` into the sm-plugins directory. You can find that in /etc/tedge/sm-plugins.


## Usage

The plugin has been developed along the guidelines [in tutorials](https://thin-edge.github.io/thin-edge.io/html/tutorials/write-my-software-management-plugin.html).