# this dockerfile creates an image mongosetup for
# 1. creating a replica set
# 2. creating an index responsible for removing  old measurements, TTL setting

FROM mongo:latest

WORKDIR /config
COPY wait-for-it.sh .
COPY mongo-setup.js .
COPY mongo-setup.sh .
RUN chmod +x /config/wait-for-it.sh
RUN chmod +x /config/mongo-setup.sh
CMD [ "bash", "-c", "/config/wait-for-it.sh mongodb1:27017 -- /config/mongo-setup.sh"]