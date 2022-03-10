FROM alpine:latest

#Otherwise mosquitto fails
VOLUME ["/sys/fs/cgroup"]

#We need curl to get root certificates
RUN apk update
RUN apk upgrade
RUN apk add mosquitto
RUN apk add curl
RUN apk add collectd
RUN apk add sudo
RUN apk add openrc
RUN apk add bash

#ENVS
ENV VERSION=0.5.4
ENV ARCH=amd64

#Add user and groups
RUN addgroup tedge-users
RUN addgroup -S tedge
RUN addgroup -S tedge-agent
RUN addgroup -S tedge-mapper
RUN adduser -g "" -H -D tedge -G tedge
RUN adduser -g "" -H -D tedge-agent -G tedge-agent
RUN adduser -g "" -H -D tedge-mapper -G tedge-mapper

#Add tedge-agent to sudoers
RUN echo "%tedge-agent   ALL = (ALL) NOPASSWD: /etc/tedge/sm-plugins/[a-zA-Z0-9]*, /bin/sync, /sbin/init" >/etc/sudoers.d/tedge-agent

#Create /run/lock
RUN mkdir /run/lock
RUN chmod 1777 /run/lock/

COPY ./ /app
WORKDIR /app

#Copy binaries to /bin
RUN cp -r  ./bin/* /bin
RUN chown root:root /bin/tedge
RUN chown root:root /bin/tedge_agent
RUN chown root:root /bin/tedge_mapper
RUN chown root:root /bin/tedge_logfile_request_plugin

#Copy mosquitto.conf
COPY ./etc/mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf

#Set init system to openRC:
COPY ./etc/init.d/mosquitto /etc/init.d/mosquitto
RUN chmod +x /etc/init.d/mosquitto
COPY ./etc/init.d/tedge-mapper-az /etc/init.d/tedge-mapper-az
RUN chmod +x /etc/init.d/tedge-mapper-az
COPY ./etc/init.d/tedge-mapper-c8y /etc/init.d/tedge-mapper-c8y
RUN chmod +x /etc/init.d/tedge-mapper-c8y
COPY ./etc/init.d/tedge-agent /etc/init.d/tedge-agent
RUN chmod +x /etc/init.d/tedge-agent

#Create required tedge directories and files
RUN install -g tedge -o tedge -m 755 -d /var/log/tedge
RUN install -g tedge-agent -o tedge-agent -m 755 -d /var/log/tedge/agent
RUN install -g tedge -o tedge -m 755 -d /etc/tedge
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/mosquitto-conf
RUN install -g mosquitto -o mosquitto -m 755 -d /etc/tedge/device-certs
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/operations
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/operations/c8y
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/operations/az
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/plugins
RUN install -g tedge-agent -o tedge-agent -m 754 -d /etc/tedge/.agent
RUN install -g root -o root -m 755 -d /etc/tedge/sm-plugins
COPY ./etc/tedge/system.toml /etc/tedge/system.toml
RUN chmod 444 /etc/tedge/system.toml

#Copy operation files
RUN cp -r ./etc/tedge/operations/c8y/* /etc/tedge/operations/c8y
RUN chown root:root /etc/tedge/operations/c8y/*
RUN chmod 644 /etc/tedge/operations/c8y/*

#Copy sm dummy plugin
COPY ./etc/tedge/sm-plugins/tedge_dummy_plugin /etc/tedge/sm-plugins/tedge_dummy_plugin
RUN chown root:root /etc/tedge/sm-plugins/tedge_dummy_plugin
RUN chmod +x /etc/tedge/sm-plugins/tedge_dummy_plugin

#Clean up installation
RUN rm /app -r

RUN ln -sf /sbin/openrc-init /sbin/init
ENTRYPOINT ["/sbin/init"]
