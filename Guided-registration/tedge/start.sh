#!/bin/sh
python3 registration.py & >> ./Logs/registration.log
while true; do sleep 1; done
