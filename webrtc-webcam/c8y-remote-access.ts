#!/usr/bin/env node

import { WebSocket, MessageEvent } from 'ws';
import { Socket } from 'net';
import { exec } from 'child_process';
import { connect } from 'mqtt';
import * as winston from "winston";

const websocketPortMapping: {[key: string]: string} = {
  '1984': '/api/ws?src=tedge_cam'
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.simple(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({filename: 'c8y-remote-access-connect-nodejs.json'})],
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
    const mqttClient = connect({host: '127.0.0.1', clientId: 'c8y-remote-access-connect-nodejs'});
    mqttClient.once('connect', () => {
      mqttClient.once('message', (topic, payload) => {
        if (topic !== 'c8y/s/dat') {
          return;
        }
        mqttClient.end(true);
        const token = payload.toString();
        resolve(token.replace(/^71,/, ''));
      });
      mqttClient.subscribe('c8y/s/dat')
      mqttClient.publish('c8y/s/uat', '');
    });
    mqttClient.once('error', () => {
      mqttClient.end(true);
      reject()
    });
  });
}

async function establishRemoteConnection(host: string, port: number, connectionKey: string): Promise<void> {
	try {
    const url = await performCommand('tedge config get c8y.url');
    logger.info(`URL: ${url}`);
    const token = await getTokenViaMqtt();
    logger.info(`Token: retrieved.`);
    logger.debug(`Token: ${token}`);
    
    const webSocket = new WebSocket(
      `wss://${url}/service/remoteaccess/device/${connectionKey}`,
      ['binary'],
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (Object.keys(websocketPortMapping).includes(`${port}`)) {
      logger.info(`Connecting to ${host}:${port} via WebSocket`);
      await openWebSocket(webSocket, host, port);
    } else {
      logger.info(`Connecting to ${host}:${port} via TCP`)
      await openSocket(webSocket, host, port);
    }
  } catch (e) {
    logger.error(`Failure`);
  }
}

function openSocket(webSocket: WebSocket, host: string, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new Socket();
    webSocket.onmessage = (ev: MessageEvent) => {
      const messagePayload = String(ev.data);
      if (typeof ev.data === 'string') {
        logger.debug('WS string: ' + JSON.stringify(messagePayload));
        socket.write(ev.data);
      } else if (ev.data instanceof Buffer) {
        logger.debug('WS Buffer: ' + JSON.stringify(messagePayload));
        socket.write(ev.data);
      } else if (ev.data instanceof ArrayBuffer) {
        logger.debug('WS ArrayBuffer: ' + JSON.stringify(messagePayload));
        socket.write(messagePayload);
      } else if (Array.isArray(ev.data)) {
        logger.debug('WS Array: ' + JSON.stringify(messagePayload));
        socket.write(messagePayload);
      } else {
        logger.debug('WS else: ' + JSON.stringify(messagePayload));
        socket.write(messagePayload);
      }
    };
    webSocket.onerror = (e) => {
      socket.end();
      reject(e);
    };
    webSocket.onclose = () => {
      socket.end();
      resolve();
    };
    webSocket.onopen = () => {
      socket.connect({ host, port });
      socket.on('data', (data) => {
        const messagePayload = String(data);
        logger.debug('Socket: ' + JSON.stringify(messagePayload));
        webSocket.send(data);
      });
      socket.on('close', () => {
        logger.info(`Connection to socket: ${host}:${port} closed.`);
        logger.debug('Socket: closed');
        webSocket.close();
        resolve();
      });
      socket.on('error', (e) => {
        logger.error('Socket: error' + JSON.stringify(e));
        webSocket.close();
        reject(e);
      });
      socket.on('connect', () => {
        logger.info(`Connection to socket: ${host}:${port} established.`);
      });
    };
  });
}

function openWebSocket(webSocket: WebSocket, host: string, port: number): Promise<void> {
  const path = websocketPortMapping[`${port}`] || '';
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://${host}:${port}${path}`);
    socket.onmessage = (data) => {
      logger.debug(`Message received from: ${host}:${port}.`);
      if (typeof data.data === 'string') {
        logger.debug(data.data);
        webSocket.send(Buffer.from(data.data));
      }
    };
    socket.onclose = () => {
      logger.info(`Connection to socket: ${host}:${port} closed.`);
      logger.debug('Socket: closed');
      webSocket.close();
      resolve();
    };
    socket.onerror = (e) => {
      logger.error('Socket: error' + e.message);
      webSocket.close();
      reject(e);
    };
    socket.onopen = () => {
      logger.info(`Connection to socket: ${host}:${port} established.`);
    };
    webSocket.onmessage = (ev: MessageEvent) => {
      logger.debug(`Message received from: c8y.`);
      const messagePayload = String(ev.data);
      logger.debug(messagePayload);
      if (typeof ev.data === 'string') {
        logger.debug('WS string: ' + JSON.stringify(messagePayload));
        socket.send(ev.data);
      } else if (ev.data instanceof Buffer) {
        logger.debug('WS Buffer: ' + JSON.stringify(messagePayload));
        socket.send(ev.data);
      } else if (ev.data instanceof ArrayBuffer) {
        logger.debug('WS ArrayBuffer: ' + JSON.stringify(messagePayload));
        socket.send(messagePayload);
      } else if (Array.isArray(ev.data)) {
        logger.debug('WS Array: ' + JSON.stringify(messagePayload));
        socket.send(messagePayload);
      } else {
        logger.debug('WS else: ' + JSON.stringify(messagePayload));
        socket.send(messagePayload);
      }
    };
    webSocket.onerror = (e) => {
      logger.error('Websocket: error');
      logger.error(e.message);
      reject(e);
    };
    webSocket.onclose = () => {
      logger.info(`Websocket connection to: cumulocity closed.`);
      socket.close();
      resolve();
    };
    webSocket.onopen = () => {
      logger.info(`Websocket connection to: cumulocity established.`);
    };
  });
}

const [,,operationSmartREST] = process.argv;
const [operationId, externalId, host, port, connectionKey] = operationSmartREST.split(',');

logger.debug(`externalId: ${externalId}`);
logger.debug(`host: ${host}`);
logger.debug(`port: ${port}`);
logger.debug(`connectionKey: ${connectionKey}`);
establishRemoteConnection(host, Number(port), connectionKey);
