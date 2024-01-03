# thin-edge.io Raspberry Pi Sense HAT Demo

## Requirements

- Raspberry Pi 2/3 (RaspberryPi 4 should work as well but not tested)
- Raspberry Pi Sense HAT (https://www.raspberrypi.org/products/sense-hat/)

## Installation

1. Setup your Raspberry Pi with Raspberry Pi OS (other OS should also work but it is not always easy to get the Sense HAT working)
2. Make sure `sudo apt-get install sense-hat` is installed (it should be there by default in Raspberry Pi OS)
3. Install and connect the thin-edge (https://thin-edge.github.io/thin-edge.io/install/)
4. Clone this repository
5. On the level of setup.py run `sudo python setup.py install`

## Usage

After installation you can start the demo by running `thin-edge-sense-hat`. Optionally you can pass the sending interval and turn of the LEDs if you want to. `thin-edge-sense-hat --interval 5 --image False`.
The demo is also registered into systemctl and you can run it from there as a service `systemctl start thin-edge-sense-hat`.

## Troubleshooting

### I get a permission denied
If you get an error like `IOError: [Errno 13] Permission denied: '/dev/fb1'` right at the beginning your user cannot access the sensors. You can simply run the demo as sudo or give your user the permissions to be able to read those interfaces.