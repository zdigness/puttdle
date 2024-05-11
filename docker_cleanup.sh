#!/bin/bash
set -e

echo "Stopping and removing all containers..."
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

echo "Removing all images..."
docker rmi $(docker images -aq)

echo "Removing all volumes..."
docker volume prune -f

echo "Cleanup complete."