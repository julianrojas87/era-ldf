# era-ldf
Linked Data Fragments Web API for serving geospatial data fragments based on the [ERA KG](https://linked.ec-dataplatform.eu/sparql).

## Run WITH Docker

This application has been _dockerized_ to facilitate its deployment. We use [`docker-compose`](https://docs.docker.com/compose/) to deploy the application together with a [NGINX](https://www.nginx.com/) instance that acts as a reverse proxy and cache manager.

To deploy follow these steps:

1. Make sure to have a recent version of [Docker](https://docs.docker.com/engine/install/) installed.

2. Set the environment configuration parameters in the [`.env`](https://github.com/julianrojas87/era-ldf/blob/main/.env) file:

   ```yaml
   NGINX_PORT=8080 # TCP port where NGINX will receive HTTP connections
   
   ERA_LDF_PORT=3000 # TCP port where the application will receive HTTP connections
   
   BASE_URL_PATH=ldf # Base path for the API URL. E.g. http://localhost:3000/ldf/...
   
   SPARQL_ENDPOINT=https://linked.ec-dataplatform.eu/sparql # Remote SPARQL endpoint hosting the KG
   
   TILE_BASE_URI=http://era.ilabt.imec.be/ldf/sparql-tiles # Base URI for identifying each tile
   
   CACHE_MAX_AGE=2592000 # Time in seconds that determines the max age a tile will be cached
   
   ERA_NAMED_GRAPH=https://linked.ec-dataplatform.eu/era # Named graph ID
   ```

   
3. Build and run the docker containers:

   ```bash
   docker-compose up
   ```



## Run WITHOUT Docker

To directly run this application you need to install first:

- [Node.js](https://nodejs.org/en/download/)  at least v12.

Then follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/julianrojas87/era-ldf.git
   ```

   

2. Go inside the cloned folder and install dependencies:

   ```bash
   npm install
   ```

   

3. Fill in the configuration parameters in the [`config.js`](https://github.com/julianrojas87/era-ldf/blob/main/config/config.js) file. Replace all the required values with the form  `${value}`. For example, replace `${SPARQL_ENDPOINT}` for the actual [SPARQL endpoint address](https://github.com/julianrojas87/era-ldf/blob/main/config/config.js#L11).

4. Once all the configuration parameters have been filled, run the application:

   ```  bash
   node bin/ldf-serve.js
   ```

Unlike the dockerized deploy, in this way a NGINX instance is not set up automatically. Check the [`nginx.conf`](https://github.com/julianrojas87/era-ldf/blob/main/nginx/nginx.conf) file in this repository to see how it can be configured.

