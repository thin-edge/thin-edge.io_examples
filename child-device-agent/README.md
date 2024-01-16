# Child Device Connector Prototype

:warning: **Deprecation notice**

This example has been deprecated and a more comprehensive and production ready example is available under the [python-tedge-agent](https://github.com/thin-edge/python-tedge-agent) repository.

The instructions in this example are no longer applicable, however the example will be kept until the [thin-edge.io documentation](https://thin-edge.github.io/thin-edge.io/) links from the older versions (namely &lt; 1.0.0) have been removed.

---

This child device connector prototype implements the following specifications:

* [configuration management](https://github.com/thin-edge/thin-edge.io/blob/main/docs/src/howto-guides/child_device_config_management_agent.md)
* [firmware management](https://github.com/thin-edge/thin-edge.io/blob/main/docs/src/howto-guides/child_device_firmware_management.md)

to enable configuration management and firmware management on child devices of thin-edge.

## Usage

1. Make sure thin-edge is connected to Cumulocity with `tedge connect c8y` and `c8y-configuration-plugin` is running.
1. (Optional) Install a virtual environment for this project: `python3 -m venv .venv`
1. Install the pip packages from the `requirements.txt` file: `pip install -r requirements.txt`
1. Update the `c8y-configuration-plugin.toml` file in this directory with some configuration file paths on your device.
1. Run the `child_device_agent.py` script from this directory: `python3 child_device_agent.py`
1. Trigger configuration management operations for the child device of thin-edge named `tedge-child` from Cumulocity.
1. Similarly, perform firmware update operations on the same device.
