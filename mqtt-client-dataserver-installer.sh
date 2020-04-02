#!/usr/bin/env bash

# This script is require Node.js and pm2 process manager to be installed:
# https://github.com/axhelp/plcnext-nodejs-installer

# Also you can install Node.js from PLCnext Store:
# https://www.plcnextstore.com/#/225

# Manual offline Node.js installation instructions can be found on the PLCnext Makers Blog:
# https://www.plcnext-community.net/en/hn-makers-blog/418-install-node-red-and-pm2-offline.html

# You can also check AWS and Azure examples from PxC USA team:
# https://github.com/plcnextusa/PLCnext_AWS_AZURE


# Checking if Node.js installed
echo "Making sure Node.js is available please wait....."
type node >/dev/null 2>&1 || { echo >&2 "Node.js is not installed.  Aborting."; break; }

# Checking if pm2 installed correctly.
echo "Making sure pm2 is available please wait....."
type pm2 >/dev/null 2>&1 || { echo >&2 "pm2 process manager is not installed.  Aborting."; break; }
pm2 startup &> /dev/null

# Getting project files
echo "Retrieving .js files please wait....."
cd /opt/plcnext/projects/
git clone -b deploy --single-branch https://github.com/axhelp/mqtt-client-dataserver.git

# Installing project at startup
cd /opt/plcnext/projects/mqtt-client-dataserver/server/
pm2 start node bundle-mqtt-client-dataserver.js
pm2 save
pm2 startup
