#!/usr/bin/env node

import { WebSocket, MessageEvent } from "ws";
import { Socket } from "net";
import { exec } from "child_process";
import { connect } from "mqtt";
import * as winston from "winston";

// TODO: move to e.g. a local configuration file
const websocketPortMapping: { [key: string]: string } = {
  "127.0.0.1:1984": "ws://127.0.0.1:1984/api/ws?src=tedge_cam",
};

const mqttBrokerHost = "127.0.0.1";
const mqttTokenRetrievalTopic = "c8y/s/dat";
const mqttTokenRequestTopic = "c8y/s/uat";
const c8yUrlRetrievalCommand = "tedge config get c8y.url";
const pluginIdentifier = "c8y-remote-access-connect-nodejs";
const logLevel = process.env.LOG_LEVEL || "info";

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.simple(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: `${pluginIdentifier}.json` }),
  ],
});

function performCommand(cmd: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const child = exec(cmd, { timeout: 60000 }, (err, stdout, stderr) => {
      if (child.exitCode !== 0) {
        return reject(stderr || err?.message);
      } else {
        return resolve(stdout);
      }
    });
  });
}

function getTokenViaMqtt(): Promise<string> {
  return new Promise((resolve, reject) => {
    const mqttClient = connect({
      host: mqttBrokerHost,
      clientId: pluginIdentifier,
    });
    mqttClient.once("connect", () => {
      mqttClient.once("message", (topic, payload) => {
        if (topic !== mqttTokenRetrievalTopic) {
          return;
        }
        mqttClient.end(true);
        const token = payload.toString();
        resolve(token.replace(/^71,/, ""));
      });
      mqttClient.subscribe(mqttTokenRetrievalTopic);
      mqttClient.publish(mqttTokenRequestTopic, "");
    });
    mqttClient.once("error", () => {
      mqttClient.end(true);
      reject();
    });
  });
}

async function establishRemoteConnection(
  host: string,
  port: number,
  connectionKey: string
): Promise<void> {
  try {
    const url = await performCommand(c8yUrlRetrievalCommand);
    logger.info(`URL: ${url}`);
    const token = await getTokenViaMqtt();
    logger.info(`Token: retrieved.`);
    logger.debug(`Token: ${token}`);

    const c8yWebSocket = new WebSocket(
      `wss://${url}/service/remoteaccess/device/${connectionKey}`,
      ["binary"],
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const websocketMapping = websocketPortMapping[`${host}:${port}`];
    if (websocketMapping) {
      logger.info(`Connecting to ${websocketMapping} via WebSocket`);
      await openWebSocket(c8yWebSocket, websocketMapping);
    } else {
      logger.info(`Connecting to ${host}:${port} via TCP`);
      await openSocket(c8yWebSocket, host, port);
    }
  } catch (e) {
    logger.error(`Failure`);
  }
}

function openSocket(
  c8yWebSocket: WebSocket,
  host: string,
  port: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new Socket();
    c8yWebSocket.onmessage = (ev: MessageEvent) => {
      const messagePayload = String(ev.data);
      if (typeof ev.data === "string") {
        logger.debug("WS string: " + JSON.stringify(messagePayload));
        socket.write(ev.data);
      } else if (ev.data instanceof Buffer) {
        logger.debug("WS Buffer: " + JSON.stringify(messagePayload));
        socket.write(ev.data);
      } else if (ev.data instanceof ArrayBuffer) {
        logger.debug("WS ArrayBuffer: " + JSON.stringify(messagePayload));
        socket.write(messagePayload);
      } else if (Array.isArray(ev.data)) {
        logger.debug("WS Array: " + JSON.stringify(messagePayload));
        socket.write(messagePayload);
      } else {
        logger.debug("WS else: " + JSON.stringify(messagePayload));
        socket.write(messagePayload);
      }
    };
    c8yWebSocket.onerror = (e) => {
      socket.end();
      reject(e);
    };
    c8yWebSocket.onclose = () => {
      socket.end();
      resolve();
    };
    c8yWebSocket.onopen = () => {
      socket.connect({ host, port });
      socket.on("data", (data) => {
        const messagePayload = String(data);
        logger.debug("Socket: " + JSON.stringify(messagePayload));
        c8yWebSocket.send(data);
      });
      socket.on("close", () => {
        logger.info(`Connection to socket: ${host}:${port} closed.`);
        logger.debug("Socket: closed");
        c8yWebSocket.close();
        resolve();
      });
      socket.on("error", (e) => {
        logger.error("Socket: error" + JSON.stringify(e));
        c8yWebSocket.close();
        reject(e);
      });
      socket.on("connect", () => {
        logger.info(`Connection to socket: ${host}:${port} established.`);
      });
    };
  });
}

function openWebSocket(
  c8yWebSocket: WebSocket,
  address: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const localWebSocket = new WebSocket(address);
    localWebSocket.onmessage = (data) => {
      logger.debug(`Message received from: ${host}:${port}.`);
      if (typeof data.data === "string") {
        logger.debug(data.data);
        c8yWebSocket.send(Buffer.from(data.data));
      }
    };
    localWebSocket.onclose = () => {
      logger.info(`Connection to socket: ${host}:${port} closed.`);
      logger.debug("Socket: closed");
      c8yWebSocket.close();
      resolve();
    };
    localWebSocket.onerror = (e) => {
      logger.error("Socket: error" + e.message);
      c8yWebSocket.close();
      reject(e);
    };
    localWebSocket.onopen = () => {
      logger.info(`Connection to socket: ${host}:${port} established.`);
    };
    c8yWebSocket.onmessage = (ev: MessageEvent) => {
      logger.debug(`Message received from: c8y.`);
      const messagePayload = String(ev.data);
      logger.debug(messagePayload);
      if (typeof ev.data === "string") {
        logger.debug("WS string: " + JSON.stringify(messagePayload));
        localWebSocket.send(ev.data);
      } else if (ev.data instanceof Buffer) {
        logger.debug("WS Buffer: " + JSON.stringify(messagePayload));
        localWebSocket.send(ev.data);
      } else if (ev.data instanceof ArrayBuffer) {
        logger.debug("WS ArrayBuffer: " + JSON.stringify(messagePayload));
        localWebSocket.send(messagePayload);
      } else if (Array.isArray(ev.data)) {
        logger.debug("WS Array: " + JSON.stringify(messagePayload));
        localWebSocket.send(messagePayload);
      } else {
        logger.debug("WS else: " + JSON.stringify(messagePayload));
        localWebSocket.send(messagePayload);
      }
    };
    c8yWebSocket.onerror = (e) => {
      logger.error("Websocket: error");
      logger.error(e.message);
      reject(e);
    };
    c8yWebSocket.onclose = () => {
      logger.info(`Websocket connection to: cumulocity closed.`);
      localWebSocket.close();
      resolve();
    };
    c8yWebSocket.onopen = () => {
      logger.info(`Websocket connection to: cumulocity established.`);
    };
  });
}

const [, , operationSmartREST] = process.argv;
const [operationId, externalId, host, port, connectionKey] =
  operationSmartREST.split(",");

logger.debug(`externalId: ${externalId}`);
logger.debug(`host: ${host}`);
logger.debug(`port: ${port}`);
logger.debug(`connectionKey: ${connectionKey}`);
establishRemoteConnection(host, Number(port), connectionKey);
