#!/bin/bash

# Replace config environment variables
envsub ./config/config.js

# Execute mapping process
node ./bin/ldf-serve.js