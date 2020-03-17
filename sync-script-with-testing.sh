#!/bin/bash

rsync -av -e ssh --exclude '.git' --exclude 'adr' --exclude 'docs' /vol/WORKnARCH/SwProjects/writerwebsite/ root@digitalocean:/srv/sites/testing.webwritertechandhumanity.com/

exit
