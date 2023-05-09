# this dockerfile creates an image mongosetup for the following tasks:
# 1. creating a replica set, required for streaming (collection watch)
# 2. creating an index responsible for removing  old measurements, TTL setting

FROM mongo:latest

WORKDIR /config
COPY wait-for-port.sh .
COPY mongo-setup.js .
COPY mongo-setup.sh .
RUN chmod +x /config/wait-for-port.sh
RUN chmod +x /config/mongo-setup.sh
CMD [ "bash", "-c", "/config/wait-for-port.sh mongodb1:27017 -- /config/mongo-setup.sh"]