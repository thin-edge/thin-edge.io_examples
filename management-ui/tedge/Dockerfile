
FROM rust:alpine as builder

ARG VERSION=0.8.1

RUN apk add --no-cache musl-dev make git
WORKDIR /app
RUN git clone -b $VERSION https://github.com/thin-edge/thin-edge.io.git
WORKDIR /app/thin-edge.io
RUN cargo build --release

FROM node:16-alpine3.15

# Otherwise mosquitto fails
VOLUME ["/sys/fs/cgroup"]

# We need curl to get root certificates
# We need curl to get root certificates
RUN apk update \
    && apk upgrade \
    && apk --no-cache add mosquitto curl collectd sudo openrc collectd-mqtt mosquitto-libs

# Create /run/lock
RUN mkdir /run/lock
RUN chmod 1777 /run/lock/

#Add user and groups
RUN addgroup tedge-users
RUN addgroup -S tedge
RUN addgroup -S tedge-ui
RUN adduser -g "" -H -D tedge -G tedge
RUN adduser -g "" -H -D tedge-ui -G tedge-ui

# Add tedge-agent to sudoers
RUN echo "%tedge   ALL = (ALL) NOPASSWD: ALL" >/etc/sudoers.d/tedge
##RUN echo "%tedge   ALL = (ALL) NOPASSWD: /etc/tedge/sm-plugins/[a-zA-Z0-9]*, /bin/sync, /sbin/init" >/etc/sudoers.d/tedge
# Add tedge-ui to sudoers
RUN echo "%tedge-ui   ALL = (ALL) NOPASSWD: ALL" >/etc/sudoers.d/tedge-ui

# Move built executables from build stage
COPY --from=builder /app/thin-edge.io/target/release/tedge /bin/tedge
COPY --from=builder /app/thin-edge.io/target/release/tedge_mapper /bin/tedge_mapper
COPY --from=builder /app/thin-edge.io/target/release/tedge_agent /bin/tedge_agent
COPY --from=builder /app/thin-edge.io/target/release/c8y_log_plugin /bin/c8y_log_plugin
COPY --from=builder /app/thin-edge.io/target/release/c8y_configuration_plugin /bin/c8y_configuration_plugin
RUN chown root:root /bin/tedge*
RUN chown root:root /bin/c8y*

# Create required directories by --init
RUN tedge --init
RUN sudo -u tedge tedge_mapper --init c8y
RUN sudo -u tedge tedge_mapper --init az
#RUN sudo -u tedge tedge_agent --init
RUN sudo tedge_agent --init
RUN sudo -u root c8y_log_plugin --init
RUN sudo -u root c8y_configuration_plugin --init

# Copy mosquitto.conf
COPY ./etc/mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf

# Set init system to openRC:
COPY ./etc/init.d/* /etc/init.d/
RUN chmod +x /etc/init.d/*

# Copy system.toml
COPY ./etc/tedge/contrib/system.toml /etc/tedge/system.toml
RUN chmod 444 /etc/tedge/system.toml

# Create sm-plugins directory
RUN install -g root -o root -m 755 -d /etc/tedge/sm-plugins

# Start tedge-ui
RUN rc-update add tedge-ui default

# Copy c8y-log-plugin.toml
COPY ./etc/tedge/contrib/c8y-log-plugin.toml /etc/tedge/c8y/c8y-log-plugin.toml
RUN chmod 444 /etc/tedge/c8y/c8y-log-plugin.toml

# Copy c8y-configuration-plugin.toml
COPY ./etc/tedge/contrib/c8y-configuration-plugin.toml /etc/tedge/c8y/c8y-configuration-plugin.toml
RUN chmod 444 /etc/tedge/c8y/c8y-configuration-plugin.toml

# Create required tedge directories and files
RUN install -g tedge -o tedge -m 755 -d /etc/tedge
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/mosquitto-conf
RUN install -g tedge-ui -o tedge-ui -m 755 -d /etc/tedge/tedge-ui
RUN install -g mosquitto -o mosquitto -m 755 -d /etc/tedge/device-certs
RUN install -g tedge -o tedge -m 755 -d /etc/tedge/plugins
RUN install -g tedge -o tedge -m 754 -d /etc/tedge/.agent

# Copy operation files
# COPY ./etc/tedge/operations/c8y/* /etc/tedge/operations/c8y
# RUN chown -R root:root /etc/tedge/operations/c8y
# RUN chmod -R 644 /etc/tedge/operations/c8y

# Copy sm dummy plugin
COPY ./etc/tedge/sm-plugins/* /etc/tedge/sm-plugins/
RUN chown root:root /etc/tedge/sm-plugins/*
RUN chmod +x /etc/tedge/sm-plugins/*

# Configure collectd
COPY ./etc/tedge/contrib/collectd/collectd.conf /etc/collectd/collectd.conf

# Comment out getty's, since they cause error messages
COPY ./etc/inittab /etc/inittab
#Build web app
WORKDIR /app/tedge
COPY ./ /app/tedge

# Set environment MONGO_HOTS, MONGO_PORT variavle in /app/tedge/tedge-ui-env
ARG MONGO_PORT ${MONGO_PORT}
ARG MONGO_HOST ${MONGO_HOST}
RUN echo "export MONGO_HOST=$MONGO_HOST" >/app/tedge/tedge-ui-env
RUN echo "export MONGO_PORT=$MONGO_PORT" >>/app/tedge/tedge-ui-env
RUN npm install -g @angular/cli && npm install
RUN npm run build

# # Clean up
##RUN rm -r /app/tedge/src
##RUN rm -r /app/tedge/etc

COPY ./etc/tedge/contrib/tedge.toml  /etc/tedge/
RUN chown tedge:tedge  /etc/tedge/tedge.toml

ENTRYPOINT ["/sbin/init"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]