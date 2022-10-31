FROM rust:alpine as builder

ARG VERSION=0.7.7

RUN apk add --no-cache musl-dev make git
WORKDIR /app
RUN git clone -b $VERSION https://github.com/thin-edge/thin-edge.io.git
WORKDIR /app/thin-edge.io
RUN cargo build --release


# stick alpine to an intentional fixed version, to avoid issues of unexpected future imcompatibilities
FROM alpine:3.15

ARG DEVICEID=tedge_alpine
ARG C8YURL=mqtt.cumulocity.com
ARG AZURL=example.azure-devices.net

# Otherwise mosquitto fails
VOLUME ["/sys/fs/cgroup"]

# We need curl to get root certificates
RUN apk update \
    && apk upgrade \
    && apk --no-cache add mosquitto curl collectd collectd-mqtt sudo openrc

# Create /run/lock
RUN mkdir /run/lock
RUN chmod 1777 /run/lock/

# Add user and groups
RUN addgroup -S tedge
RUN adduser -g "" -H -D tedge -G tedge

# Add tedge to sudoers
RUN echo "%tedge   ALL = (ALL) NOPASSWD: /etc/tedge/sm-plugins/[a-zA-Z0-9]*, /bin/sync, /sbin/init" >/etc/sudoers.d/tedge

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
RUN sudo -u tedge tedge_agent --init
RUN sudo -u root c8y_log_plugin --init
RUN sudo -u root c8y_configuration_plugin --init

COPY ./ /app
WORKDIR /app

# Copy mosquitto.conf
COPY ./etc/mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf

# Copy collectd.conf
COPY ./etc/collectd/collectd.conf /etc/collectd/collectd.conf

# Set OpenRC service scripts to /etc/init.d
COPY ./etc/init.d/* /etc/init.d/
RUN chmod +x /etc/init.d/*

# Copy system.toml
COPY ./etc/tedge/system.toml /etc/tedge/system.toml
RUN chmod 444 /etc/tedge/system.toml

# Create sm-plugins directory
RUN install -g root -o root -m 755 -d /etc/tedge/sm-plugins

# Clean up installation
WORKDIR /
RUN rm -r /app

# Create a self-signed certificate
RUN tedge cert create --device-id $DEVICEID

# Set tedge config parameter
RUN tedge config set c8y.url $C8YURL
RUN tedge config set az.url $AZURL

ENTRYPOINT ["/sbin/init"]
