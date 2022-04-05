
FROM rust:alpine as builder

ARG VERSION=0.6.1

RUN apk add --no-cache musl-dev make git
WORKDIR /app
RUN git clone -b $VERSION https://github.com/thin-edge/thin-edge.io.git
WORKDIR /app/thin-edge.io
RUN cargo build --release


FROM node:16-alpine3.15
#FROM alpine:latest


#Otherwise mosquitto fails
VOLUME ["/sys/fs/cgroup"]

#We need curl to get root certificates
# We need curl to get root certificates
RUN apk update \
    && apk upgrade \
    && apk --no-cache add mosquitto curl collectd sudo openrc collectd-mqtt mosquitto-libs

#Create /run/lock
RUN mkdir /run/lock
RUN chmod 1777 /run/lock/


#Add user and groups
RUN addgroup tedge-users
RUN addgroup -S tedge
RUN addgroup -S tedge-agent
RUN addgroup -S tedge-mapper
RUN addgroup -S tedge-ui
RUN adduser -g "" -H -D tedge -G tedge
RUN adduser -g "" -H -D tedge-mapper -G tedge-mapper
RUN adduser -g "" -H -D tedge-agent -G tedge-agent
RUN adduser -g "" -H -D tedge-ui -G tedge-ui
RUN adduser tedge-mapper tedge
RUN adduser tedge-agent tedge

#Add tedge-agent to sudoers
RUN echo "%tedge-agent   ALL = (ALL) NOPASSWD: /etc/tedge/sm-plugins/[a-zA-Z0-9]*, /bin/sync, /sbin/init" >/etc/sudoers.d/tedge-agent
#Add tedge-ui to sudoers
RUN echo "%tedge-ui   ALL = (ALL) NOPASSWD: ALL" >/etc/sudoers.d/tedge-ui

# Move built executables from build stage
COPY --from=builder /app/thin-edge.io/target/release/tedge /bin/tedge
COPY --from=builder /app/thin-edge.io/target/release/tedge_mapper /bin/tedge_mapper
COPY --from=builder /app/thin-edge.io/target/release/tedge_agent /bin/tedge_agent
COPY --from=builder /app/thin-edge.io/target/release/tedge_logfile_request_plugin /bin/tedge_logfile_request_plugin
RUN chown root:root /bin/tedge
RUN chown root:root /bin/tedge_agent
RUN chown root:root /bin/tedge_mapper
RUN chown root:root /bin/tedge_logfile_request_plugin

COPY ./ /app
WORKDIR /app

#Copy mosquitto.conf
COPY ./etc/mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf

#Copy binaries to /bin
RUN cp -r  ./bin/* /bin
RUN chown root:root /bin/tedge
RUN chown root:root /bin/tedge_agent
RUN chown root:root /bin/tedge_mapper
RUN chown root:root /bin/tedge_logfile_request_plugin


#Set init system to openRC:
COPY ./etc/init.d/mosquitto /etc/init.d/mosquitto
RUN chmod +x /etc/init.d/mosquitto
COPY ./etc/init.d/tedge-mapper-az /etc/init.d/tedge-mapper-az
RUN chmod +x /etc/init.d/tedge-mapper-az
COPY ./etc/init.d/tedge-mapper-c8y /etc/init.d/tedge-mapper-c8y
RUN chmod +x /etc/init.d/tedge-mapper-c8y
COPY ./etc/init.d/tedge-agent /etc/init.d/tedge-agent
RUN chmod +x /etc/init.d/tedge-agent
COPY ./etc/init.d/tedge-mapper-collectd /etc/init.d/tedge-mapper-collectd
RUN chmod +x /etc/init.d/tedge-mapper-collectd

#Add configuration for tedge-ui
COPY ./etc/init.d/tedge-ui /etc/init.d/tedge-ui
RUN chmod +x /etc/init.d/tedge-ui
# Start tedge-ui
RUN rc-update add tedge-ui default

# Copy system.toml
COPY ./etc/tedge/system.toml /etc/tedge/system.toml
RUN chmod 444 /etc/tedge/system.toml


#Create required tedge directories and files
RUN install -g tedge -o tedge -m 755 -d /var/log/tedge
RUN install -g tedge-agent -o tedge-agent -m 755 -d /var/log/tedge/agent
RUN install -g tedge -o tedge -m 755 -d /etc/tedge
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/mosquitto-conf
RUN install -g tedge-ui -o tedge-ui -m 755 -d /etc/tedge/tedge-ui
RUN install -g mosquitto -o mosquitto -m 755 -d /etc/tedge/device-certs
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/operations
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/operations/c8y
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/operations/az
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/plugins
RUN install -g tedge-agent -o tedge-agent -m 754 -d /etc/tedge/.agent
#Create sm-plugins directory
RUN install -g root -o root -m 755 -d /etc/tedge/sm-plugins

#Copy operation files
COPY ./etc/tedge/operations/c8y/* /etc/tedge/operations/c8y
RUN chown -R root:root /etc/tedge/operations/c8y
RUN chmod -R 644 /etc/tedge/operations/c8y

#Copy sm dummy plugin
COPY ./etc/tedge/sm-plugins/tedge_dummy_plugin /etc/tedge/sm-plugins/tedge_dummy_plugin
RUN chown root:root /etc/tedge/sm-plugins/tedge_dummy_plugin
RUN chmod +x /etc/tedge/sm-plugins/tedge_dummy_plugin

#Clean up installation
RUN rm /app -r

#Configure collectd
COPY ./etc/tedge/contrib/collectd/collectd.conf /etc/collectd/collectd.conf

#Build web app
# build angular app
WORKDIR /app/tedge
COPY ./ /app/tedge
# Set environment MONGO_HOTS, MONGO_PORT variavle in /app/tedge/tedge-ui-env
#ARG MONGO_HOST
ARG MONGO_PORT ${MONGO_PORT}
ARG MONGO_HOST ${MONGO_HOST}
RUN echo "export MONGO_HOST=$MONGO_HOST" >/app/tedge/tedge-ui-env
RUN echo "export MONGO_PORT=$MONGO_PORT" >>/app/tedge/tedge-ui-env
RUN npm install -g @angular/cli && npm install
RUN ng config -g cli.warnings.versionMismatch false
RUN ng build  --output-path=/app/tedge/dist/cumulocity-tedge-setup
# # Clean up
RUN rm -r /app/tedge/src
RUN rm -r /app/tedge/etc

# Copy sample certificates
#
#COPY ./etc/tedge/device-certs/*  /etc/tedge/device-certs/
#RUN chown mosquitto:mosquitto /etc/tedge/device-certs/
#COPY ./etc/tedge/tedge.toml  /etc/tedge/
#RUN chown tedge:tedge  /etc/tedge/tedge.toml

RUN ln -sf /sbin/openrc-init /sbin/init
ENTRYPOINT ["/sbin/init"]