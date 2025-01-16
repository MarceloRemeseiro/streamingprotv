#!/bin/bash
echo "Stopping application..."
docker compose --profile app down
echo "Rebuilding and starting application..."
docker compose --profile app up -d --build 