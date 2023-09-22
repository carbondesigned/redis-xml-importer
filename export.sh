#!/bin/bash

while getopts ":v:" opt; do
  case $opt in
    v)
      xmlPath="$OPTARG"
      docker-compose run app node dist/exporter.js "$xmlPath" -v
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done
