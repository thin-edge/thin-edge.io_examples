from setuptools.command.install import install
from setuptools import setup
import os
from subprocess import check_call


class ServiceInstaller(install):

    def run(self):
        install.run(self)
        path = os.getcwd()
        check_call(('sh ' + path + '/register-service.sh').split())

setup(
    name='thin-edge-sense-hat',
    author='Tobias Sommer',
    version='0.0.1',
    description='Reading out the sensors of the RaspberryPi SenseHat and sending the data to thin-edge',
    install_requires=[
        'paho-mqtt',
        'sense-hat'
    ],
    packages=[
        'thin_edge_sense_hat', 
    ],
    entry_points = {
        'console_scripts': [
            'thin-edge-sense-hat = thin_edge_sense_hat.main:start'
        ]
    },
    cmdclass = {
        'install': ServiceInstaller
    }
)