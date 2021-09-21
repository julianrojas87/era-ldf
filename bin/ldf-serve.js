/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import fastify from 'fastify';
import { preflight } from '../lib/routes/preflight.js';
import { sparqlTiles } from '../lib/routes/sparql-tiles.js';
import { vehicles } from '../lib/routes/vehicles.js';
import { search } from '../lib/routes/search.js';
import { count } from '../lib/routes/count.js';
import { config } from '../config/config.js'; 

const server = fastify({ logger: false });

server.register(preflight);
server.register(sparqlTiles);
server.register(vehicles);
server.register(search);
server.register(count);

server.listen(config.port, '0.0.0.0', (err, address) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
    console.log(`server listening on ${address}`);
});