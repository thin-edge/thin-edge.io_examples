# Docker for Alpine

## Prerequisites
1. Cross-compile with musl. This is an example how to cross-compile for x86_64 with musl.

```shell
cargo install cross
cross build --release --target=x86_64-unknown-linux-musl
```

2. Copy the binaries to respective directories.

`tedge`, `tedge_mapper`, `tedge_agent`, and `tedge_logfile_request_plugin` -> `./bin`

```shell
cp /path/to/thin-edge.io/target/<arch>/release/tedge ./bin
cp /path/to/thin-edge.io/target/<arch>/release/tedge_mapper ./bin
cp /path/to/thin-edge.io/target/<arch>/release/tedge_agent ./bin
cp /path/to/thin-edge.io/target/<arch>/release/tedge_logfile_request_plugin ./bin
```

`tedge_dummy_plugin` -> `./etc/tedge/sm-plugins`

```shell
cp /path/to/thin-edge.io/target/<arch>/release/tedge_dummy_plugin ./etc/tedge/sm-plugins
```

## Container

1. Build the image

```shell
docker build -t tedge_docker_alpine .
```

2. Create and start a container

```shell
docker run -it -d --name=tedge tedge_docker_alpine
```

3. Enter the container

```shell
docker exec -it tedge bash
```

## Known issues

`tedge connect <cloud>` always fails to stop all services. This is an example output.

```shell
Stopping tedge-mapper-az service.

Failed to stop tedge-mapper-az service: ServiceCommandFailedWithCode { service_command: "/sbin/rc-service tedge-mapper-az stop", code: 1 }
```

However, if you run `/sbin/rc-service <service-name> stop` manually, the service will stop without a problem.
