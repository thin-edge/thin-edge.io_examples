FROM rust:alpine as builder

ARG VERSION=0.6.1

RUN apk add --no-cache musl-dev make git
WORKDIR /app
# TODO: fix clone version/url/...
#RUN git clone -b $VERSION https://github.com/thin-edge/thin-edge.io.git
# TODO: replace with original repo
#RUN git clone -b feature/759_self_update_agent https://github.com/cstoidner/thin-edge.io_selfup.git ./thin-edge.io

RUN git clone https://github.com/makr11st/thin-edge.io.git -b feature/759_tedge_updater ./thin-edge.io
WORKDIR /app/thin-edge.io
RUN git config pull.rebase true
RUN git config --global user.email "noone@empty"
RUN git config --global user.name "No One"
RUN git pull --no-edit https://github.com/makr11st/thin-edge.io.git feature/759_self_update_agent || true
RUN git pull --no-edit https://github.com/cstoidner/thin-edge.io.git feature-759-docker-plugin

# TODO: remove both patch files
#COPY ./tmp/repo-latest-changes.patch /tmp/
#RUN git config --global user.email "darth@imperium.galaxy"
#RUN git config --global user.name "Darth Vader"
#RUN git apply /tmp/repo-latest-changes.patch

# TODO: re-enable "--release"
RUN cargo build --release
#RUN cargo build

FROM alpine:latest

# TODO: fix path
ARG DEVICEID=tedge_alpine_selfup2

# Otherwise mosquitto fails
VOLUME ["/sys/fs/cgroup"]

# We need curl to get root certificates
RUN apk update \
    && apk upgrade \
    && apk --no-cache add mosquitto curl collectd sudo openrc

# Create /run/lock
RUN mkdir /run/lock
RUN chmod 1777 /run/lock/

# Add user and groups
RUN addgroup tedge-users
RUN addgroup -S tedge
RUN addgroup -S tedge-mapper
RUN addgroup -S tedge-agent
RUN adduser -g "" -H -D tedge -G tedge
RUN adduser -g "" -H -D tedge-mapper -G tedge-mapper
RUN adduser -g "" -H -D tedge-agent -G tedge-agent
RUN adduser tedge-mapper tedge
RUN adduser tedge-agent tedge

# Add tedge-agent to sudoers
RUN echo "%tedge-agent   ALL = (ALL) NOPASSWD: /etc/tedge/sm-plugins/[a-zA-Z0-9]*, /bin/sync, /sbin/init" >/etc/sudoers.d/tedge-agent

# Move built executables from build stage
COPY --from=builder /app/thin-edge.io/target/release/tedge /bin/tedge
COPY --from=builder /app/thin-edge.io/target/release/tedge_mapper /bin/tedge_mapper
COPY --from=builder /app/thin-edge.io/target/release/tedge_agent /bin/tedge_agent
COPY --from=builder /app/thin-edge.io/target/release/tedge_logfile_request_plugin /bin/tedge_logfile_request_plugin
COPY --from=builder /app/thin-edge.io/target/release/tedge_updater /bin/tedge_updater
RUN chown root:root /bin/tedge
RUN chown root:root /bin/tedge_agent
RUN chown root:root /bin/tedge_mapper
RUN chown root:root /bin/tedge_logfile_request_plugin
RUN chown root:root /bin/tedge_updater

# Create required directories by --init
RUN tedge --init
RUN sudo -u tedge-mapper tedge_mapper --init c8y
RUN sudo -u tedge-mapper tedge_mapper --init az
RUN sudo -u tedge-agent tedge_agent --init

COPY ./ /app
WORKDIR /app

RUN echo "Image from before update" > /image-version

# Copy mosquitto.conf
COPY ./etc/mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf

# Set init system to OpenRC:
COPY ./etc/init.d/mosquitto /etc/init.d/mosquitto
COPY ./etc/init.d/tedge-mapper-az /etc/init.d/tedge-mapper-az
COPY ./etc/init.d/tedge-mapper-c8y /etc/init.d/tedge-mapper-c8y
#COPY ./etc/init.d/tedge-mapper-collectd /etc/init.d/tedge-mapper-collectd
COPY ./etc/init.d/tedge-agent /etc/init.d/tedge-agent
RUN chmod +x /etc/init.d/mosquitto
RUN chmod +x /etc/init.d/tedge-mapper-az
RUN chmod +x /etc/init.d/tedge-mapper-c8y
#RUN chmod +x /etc/init.d/tedge-mapper-collectd
RUN chmod +x /etc/init.d/tedge-agent

# Copy system.toml
COPY ./etc/tedge/system.toml /etc/tedge/system.toml
RUN chmod 444 /etc/tedge/system.toml

# Copy dirty workaround for tedge-disconnect
COPY ./etc/tedge/rc-service_restart-wrapper /etc/tedge/rc-service_restart-wrapper

# Copy operation files
RUN cp -r ./etc/tedge/operations/c8y/* /etc/tedge/operations/c8y
RUN chown root:root /etc/tedge/operations/c8y/*
RUN chmod 644 /etc/tedge/operations/c8y/*

# Create sm-plugins directory
RUN install -g root -o root -m 755 -d /etc/tedge/sm-plugins
COPY --from=builder /app/thin-edge.io/plugins/tedge_docker_plugin/tedge_docker_plugin.sh /etc/tedge/sm-plugins/tedge_docker_plugin.sh
RUN chmod +x /etc/tedge/sm-plugins/tedge_docker_plugin.sh

# TODO: both lines below, decide about better path (Agent tries to load them as plugins)
RUN mkdir /etc/tedge/hooks/
COPY ./hook-start-or-rollback /etc/tedge/hooks/
COPY ./hook-stop-and-snapshot /etc/tedge/hooks/
RUN chmod + /etc/tedge/hooks/hook-start-or-rollback
RUN chmod + /etc/tedge/hooks/hook-stop-and-snapshot

# Clean up installation
RUN rm /app -r

# Create a self-signed certificate
RUN tedge cert create --device-id $DEVICEID

RUN ln -sf /sbin/openrc-init /sbin/init
ENTRYPOINT ["/sbin/init"]
#ENTRYPOINT ["/bin/echo", "Must called with epxplicit arguments to provide access to hosts docker (e.g. sockfile, binary, libs ...). Example how to call: .... /sbin/init"] 

