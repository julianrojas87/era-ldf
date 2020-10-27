/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import fastify from 'fastify';
import { sparqlTiles } from '../lib/routes/sparql-tiles.js';
import { vocabulary } from '../lib/routes/vocabulary.js';
import { vehicles } from '../lib/routes/vehicles.js'; 

const server = fastify();

server.register(sparqlTiles);
server.register(vocabulary);
server.register(vehicles);

server.listen(3000, (err, address) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
    server.log.info(`server listening on ${address}`)
});