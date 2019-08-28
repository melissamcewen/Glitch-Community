#!/bin/bash
set -o allexport; source .env; set +o allexport

npm i -g cypress@3.1.5
cypress open --config baseUrl=
