/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import fastify from 'fastify';
import { preflight } from '../lib/routes/preflight.js';
import { sparqlTiles } from '../lib/routes/sparql-tiles.js';
import { vocabulary } from '../lib/routes/vocabulary.js';
import { vehicles } from '../lib/routes/vehicles.js';
import { config } from '../config/config.js'; 

const server = fastify({ logger: false });

server.register(preflight);
server.register(sparqlTiles);
server.register(vocabulary);
server.register(vehicles);

server.listen(config.port, '0.0.0.0', (err, address) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
    console.log(`server listening on ${address}`);
});