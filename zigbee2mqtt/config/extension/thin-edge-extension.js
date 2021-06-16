class ThinEdgeExtension {
  constructor(
    zigbee,
    mqtt,
    state,
    publishEntityState,
    eventBus,
    settings,
    logger
  ) {
    this.zigbee = zigbee;
    this.mqtt = mqtt;
    this.state = state;
    this.publishEntityState = publishEntityState;
    this.eventBus = eventBus;
    this.settings = settings;
    this.logger = logger;

    logger.info("Loaded  ThinEdgeExtension");
    this.eventBus.on(
      "publishEntityState",
      (data) => this.onPublishEntityState(data),
      this.constructor.name
    );
  }

  /**
   * This method is called by the controller once Zigbee has been started.
   */
  // onZigbeeStarted() {}

  /**
   * This method is called by the controller once connected to the MQTT server.
   */
  onMQTTConnected() {
    // might want to subscribe here in the future for operations received from the cloud
    // this.mqtt.subscribe('some/topic');
  }

  /**
   * Is called when a Zigbee message from a device is received.
   * @param {string} type Type of the message
   * @param {Object} data Data of the message
   * @param {Object?} resolvedEntity Resolved entity returned from this.zigbee.resolveEntity()
   * @param {Object?} settingsDevice Device settings
   */
  onZigbeeEvent(type, data, resolvedEntity) {
    // nothing to do
  }

  /**
   * Is called when a MQTT message is received
   * @param {string} topic Topic on which the message was received
   * @param {Object} message The received message
   * @return {boolean} if the message was handled
   */
  onMQTTMessage(topic, message) {
    // might want to handle received operations here in the future
  }

  async onPublishEntityState(data) {
    // Handling entity changes here
    const device = data.entity.device;
    const ieeeAddr = device.ieeeAddr;
    const input = data.messagePayload;
    const payload = {
    //   type: ieeeAddr,
      [ieeeAddr]: {},
    };

    // only numbers are currently handled by the measurements topic
    // states like 'ON' or 'OFF' need some conversion into a number
    // unknown non numeric values are skipped
    for (const key of Object.keys(input)) {
      if (input[key] === "ON") {
        payload[ieeeAddr][key] = 1;
      } else if (input[key] === "OFF") {
        payload[ieeeAddr][key] = 0;
      } else if (typeof input[key] === "number") {
        payload[ieeeAddr][key] = input[key];
      }
    }
    await this.mqtt.publish(
      "measurements",
      JSON.stringify(payload),
      {},
      "tedge"
    );
  }

  /**
   * Is called once the extension has to stop
   */
  stop() {
    this.eventBus.removeListenersExtension(this.constructor.name);
  }
}

module.exports = ThinEdgeExtension;
