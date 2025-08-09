#!/bin/bash

if [ "$(id -u)" -ne 0 ]; then
  echo "Use 'sudo' for start this script!"
  exit 1
fi
