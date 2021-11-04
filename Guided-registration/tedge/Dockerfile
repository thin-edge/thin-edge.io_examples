FROM mcr.microsoft.com/vscode/devcontainers/base:debian


RUN apt update
RUN apt install -y software-properties-common
RUN apt update
RUN apt install -y mosquitto
RUN apt install -y supervisor
RUN apt install -y python-all
RUN apt install -y python3-all
RUN apt install -y python3-stdeb
RUN apt install -y devscripts
RUN apt install -y dh-python
RUN apt install -y libmosquitto1
RUN apt install -y collectd-core
RUN apt install -y collectd
RUN apt install -y python3-paho-mqtt
RUN apt install -y python3-pip
RUN apt install -y nano
RUN apt install -y docker.io

COPY ./ /app
WORKDIR /app
RUN pip3 install -r ./requirements.txt
RUN curl -fsSL https://raw.githubusercontent.com/thin-edge/thin-edge.io/b4e41d42ed35ceb07c663612e09a0722a86b6239/get-thin-edge_io.sh | sudo sh -s 0.4.0
RUN cp /etc/tedge/contrib/collectd/collectd.conf /etc/collectd/collectd.conf
#RUN wget https://github.com/thin-edge/thin-edge.io/releases/download/0.4.0/tedge_apt_plugin_0.4.0_arm64.deb -P /tmp/tedge
#RUN wget https://github.com/thin-edge/thin-edge.io/releases/download/0.4.0/tedge_agent_0.4.0_arm64.deb -P /tmp/tedge
#RUN dpkg -i /tmp/tedge/tedge_apt_plugin_0.4.0_arm64.deb
#RUN dpkg -i /tmp/tedge/tedge_agent_0.4.0_arm64.deb
RUN chmod +x ./start.sh
CMD ["./start.sh"]