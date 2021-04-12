cp -f "thin-edge-sense-hat.service" /lib/systemd/system
chown root:root /lib/systemd/system/thin-edge-sense-hat.service

systemctl daemon-reload
systemctl enable thin-edge-sense-hat.service