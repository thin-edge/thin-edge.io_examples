import shutil
import requests
import tempfile
import json

from paho.mqtt import client as mqtt_client
from paho.mqtt.client import Client,MQTTMessage


broker = 'localhost'
port = 1883
child_device_id = 'tedge-child'
c8y_config_plugin_path = "./c8y-configuration-plugin.toml"

def bootstrap(client):
    URL = "http://127.0.0.1:8000/tedge/file-transfer/{}/c8y-configuration-plugin".format(child_device_id)
    CONFIG_TYPE = "c8y-configuration-plugin"

    print(f"Uploading the config file")
    with open(c8y_config_plugin_path, 'rb') as file:
        content = file.read()

    response = requests.put(URL, data=content)
    print(URL, response.status_code)

    # Set config update command status to successful
    print(f"Setting config_snapshot status for config-type: {CONFIG_TYPE} to successful")
    config_snapshot_response_topic = f"tedge/{child_device_id}/commands/res/config_snapshot" # {config_type}
    message_payload = json.dumps({
            "path": "",
            "type": CONFIG_TYPE,
    })
    client.publish(f"{config_snapshot_response_topic}", message_payload)

def connect_mqtt() -> mqtt_client.Client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(child_device_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client.Client):
    def on_config_snapshot_request(client, userdata, msg: MQTTMessage):
        print(f"Config snapshot request received `{msg.payload.decode()}` on `{msg.topic}` topic")

        payload = json.loads(msg.payload.decode())
        print(payload)

        path = payload["path"]
        config_type = payload["type"]
        upload_url_path = payload["url"]

        # Set config update command status to executing
        print(f"Setting config_snapshot status for config-type: {config_type} to executing")
        config_snapshot_executing_topic = f"tedge/{child_device_id}/commands/res/config_snapshot" # {config_type}
        message_payload = json.dumps({
                "status": "executing",
                "path": path,
                "type": config_type,
        })
        client.publish(f"{config_snapshot_executing_topic}", message_payload)


        if config_type == "c8y-configuration-plugin":
            path = c8y_config_plugin_path

        # Upload the requested file
        print(f"Uploading the config file")
        with open(path, 'rb') as file:
            content = file.read()
        response = requests.put(upload_url_path, data=content)
        print(upload_url_path, response.status_code)

        # Set config update command status to successful
        print(f"Setting config_snapshot status for config-type: {config_type} to successful")
        config_snapshot_executing_topic = f"tedge/{child_device_id}/commands/res/config_snapshot" # {config_type}
        message_payload = json.dumps({
                "status": "successful",
                "path": path,
                "type": config_type,
        })
        client.publish(f"{config_snapshot_executing_topic}", message_payload)

    config_snapshot_req_topic = f"tedge/{child_device_id}/commands/req/config_snapshot"
    client.subscribe(config_snapshot_req_topic)
    client.message_callback_add(config_snapshot_req_topic, on_config_snapshot_request)

    def on_config_update_request(client: Client, userdata, msg: MQTTMessage):
        print(f"Config update request received `{msg.payload.decode()}` from `{msg.topic}` topic")

        payload = json.loads(msg.payload.decode())

        payload_path = payload["path"]
        download_url = payload["url"]
        if payload["type"] == None:
            config_type = payload["path"]
        else:
            config_type = payload["type"]

        # Set config update command status to executing
        config_snapshot_executing_topic = f"tedge/{child_device_id}/commands/res/config_update" # {config_type}
        message_payload = json.dumps({
                "status": "executing",
                "path": payload_path,
                "type": config_type,
        })
        client.publish(f"{config_snapshot_executing_topic}", message_payload)

        # Download the config file update from tedge
        print(download_url)
        response = requests.get(download_url)
        print(response.content, response.status_code)
        target_path = tempfile.NamedTemporaryFile(prefix=config_type, delete=False)
        print(target_path.name)
        try:
            target_path.write(response.content)
        finally:
            target_path.close()

        # Replace the existing config file with the updated file downloaded from tedge
        shutil.move(target_path.name, payload_path)

        # Set config update command status to successful
        config_snapshot_executing_topic = f"tedge/{child_device_id}/commands/res/config_update"
        message_payload = json.dumps({
                "status": "successful",
                "path": payload_path,
                "type": config_type,
        })
        client.publish(config_snapshot_executing_topic, message_payload)

    config_update_topic = f"tedge/{child_device_id}/commands/req/config_update"
    client.subscribe(config_update_topic)
    client.message_callback_add(config_update_topic, on_config_update_request)

def run():

    client = connect_mqtt()
    subscribe(client)
    bootstrap(client)
    client.loop_forever()


if __name__ == '__main__':
    run()
