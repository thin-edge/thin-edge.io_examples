#!/usr/bin/python3
# coding=utf-8
import logging

logger = logging.getLogger(__name__)

import os
import requests
import json



class Connector(object):

    def __init__(self, url):
        logger.debug("Constructor called")
        self.url = url
        logging.debug(f'Using the following url: {url}')
        self.headers = {}
        self.payload = {}

    def get_flows(self):
        try:
            logger.debug('Get flows from node-red via /flows')
            response = requests.request("GET", f'{self.url}/flows', headers=self.headers, data=self.payload)
            logger.debug('Response from request: ' + str(response.text))
            logger.debug('Response from request with code : ' + str(response.status_code))
            if response.status_code == 200:
                logger.debug('Flows received')
                return response.text
            else:
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return False
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False

    def get_flow(self,id):
        try:
            logger.debug(f'Get individual flow from node-red via /flow/<id> for the following id: {id}')
            response = requests.request("GET", f'{self.url}/flow/{id}', headers=self.headers, data=self.payload)
            logger.debug('Response from request: ' + str(response.text))
            logger.debug('Response from request with code : ' + str(response.status_code))
            if response.status_code == 200:
                logger.debug('Individual flow received')
                return response.text
            elif response.status_code == 404:
                logger.warning(f'Flow {id} does not exist')
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return False
            else:
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return False
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False

    def update_flow(self,id,body):
        try:
            self.headers['Content-type'] = 'application/json'
            logger.debug(f'Updating the flow with id {id} and the following data: {body}')
            response = requests.request("PUT", f'{self.url}/flow/{id}', headers=self.headers, data=body)
            logger.debug('Response from request: ' + str(response.text))
            logger.debug('Response from request with code : ' + str(response.status_code))
            if response.status_code == 204:
                logger.debug('Flow updated')
                return response.text
            else:
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return False
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False

    def create_flow(self,body):
        try:
            self.headers['Content-type'] = 'application/json'
            logger.debug(f'Creating the flow with following data: {body}')
            response = requests.request("POST", f'{self.url}/flow', headers=self.headers, data=body)
            logger.debug('Response from request: ' + str(response.text))
            logger.debug('Response from request with code : ' + str(response.status_code))
            if response.status_code == 204:
                logger.debug('Flow created')
                return response.text
            else:
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return False
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False
    
    def delete_flow(self,id):
        try:
            logger.debug(f'Deleting the flow with following id: {id}')
            response = requests.request("DELETE", f'{self.url}/flow/{id}', headers=self.headers, data=self.payload)
            logger.debug('Response from request: ' + str(response.text))
            logger.debug('Response from request with code : ' + str(response.status_code))
            if response.status_code == 204:
                logger.debug('Flow created')
                return response.text
            else:
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return False
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False


    def get_settings(self):
        try:
            response = requests.request("GET", f'{self.url}/settings', headers=self.headers, data=self.payload)
            logger.debug('Response from request: ' + str(response.text))
            logger.debug('Response from request with code : ' + str(response.status_code))
            if response.status_code == 200:
                logger.debug('Flow created')
                return response.text
            else:
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return response.text
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False

    def get_auth(self):
        try:
            logger.debug(f'Checking auth endpoint on /auth/login')
            response = requests.request("GET", f'{self.url}/auth/login', headers=self.headers, data=self.payload)
            logger.debug('Response from request: ' + str(response.text))
            logger.debug('Response from request with code : ' + str(response.status_code))
            if response.status_code == 200:
                logger.debug('Auth does exist')
                return response
            else:
                logger.warning(f'Response from request: {response.text}')
                logger.warning(f'Got response with status_code: {response.status_code}')
                return response
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False

    def check_node_red(self):
        try:
            logger.debug(f'Checking whether node-red is running')
            self.get_auth()
            if self.get_auth().status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            logger.error(f'The following error occured: {e}')
            return False