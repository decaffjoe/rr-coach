#!/bin/bash

# Bind host ip to docker container
export HOST_IP=$(ip addr show wlp1s0 | grep -v inet6 | grep inet | awk '{ print $2 }' | cut -d/ -f1)

# Point DB_PATH (in .env) to host
echo "$HOST_IP    hostip" | sudo tee -a /etc/hosts
