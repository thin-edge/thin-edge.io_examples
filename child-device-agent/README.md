# Child Device Configuration Management Agent Prototype

This prototype implements the thin-edge child device configuration management agent contract described
[here](https://github.com/thin-edge/thin-edge.io/blob/main/docs/src/howto-guides/child_device_config_management_agent.md)
that is required to enable configuration management on child devices of thin-edge.

## Usage

1. Make sure thin-edge is connected to Cumulocity with `tedge connect c8y` and `c8y-configuration-plugin` is running.
1. (Optional) Install a virtual environment for this project: `python3 -m venv .venv`
1. Install the pip packages from the `requirements.txt` file: `pip install -r requirements.txt`
1. Update the `c8y-configuration-plugin.toml` file in this directory with some configuration file paths on your device.
1. Run the `child_device_agent.py` script from this directory: `python3 child_device_agent.py`
1. Trigger configuration management operations for the child device of thin-edge named `tedge-child` from Cumulocity.
