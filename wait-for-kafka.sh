#!/bin/bash
set -e

HOST=$1
PORT=$2

echo "Waiting for Kafka at $HOST:$PORT..."

# Check if Kafka is up by using nc (netcat) to check if the port is open
until nc -z -v -w30 $HOST $PORT
do
  echo "Waiting for Kafka to be available..."
  sleep 5
done

echo "Kafka is up!"