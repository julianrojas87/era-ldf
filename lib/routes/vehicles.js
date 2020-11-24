/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import { vehicleTypes, vehicleInstances } from '../../config/queries.js';
import utils from '../utils.js';
import accepts from 'accepts';

export async function vehicles(fastify, options) {
    const source = config.sparql;
    const mimeTypes = ['text/turtle', 'application/ld+json', 'application/n-quads', 'application/n-triples'];

    fastify.get('/ldf/vehicle-types', async (request, reply) => {
        let rdf = '';
        for (const q of vehicleTypes.graph) {
            rdf = rdf.concat(await utils.doSPARQLQuery({
                source,
                accept: q.accept,
                query: q.query
            }));
        }

        const accept = accepts(request.raw).type(mimeTypes);
        const midnight = new Date().setHours(24, 0, 0, 0);

        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Accept',
            'Cache-Control': `public, max-age=${Math.floor((midnight - new Date()) / 1000)}`
        });

        switch (accept) {
            case 'text/turtle':
                reply.header('content-type', 'text/turtle');
                return rdf;
            case 'application/ld+json':
                reply.header('content-type', 'application/ld+json');
                return rdf;
            case 'application/n-quads':
                reply.header('content-type', 'application/n-quads');
                return rdf;
            case 'application/n-triples':
                reply.header('content-type', 'application/n-quads');
                return rdf;
            default:
                reply.header('content-type', 'text/turtle');
                return rdf;
        }
    });

    fastify.get('/ldf/vehicles', async (request, reply) => {
        let rdf = '';
        for (const q of vehicleInstances.graph) {
            rdf = rdf.concat(await utils.doSPARQLQuery({
                source,
                accept: q.accept,
                query: q.query
            }));
        }

        const accept = accepts(request.raw).type(mimeTypes);
        const midnight = new Date().setHours(24, 0, 0, 0);

        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Accept',
            'Cache-Control': `public, max-age=${Math.floor((midnight - new Date()) / 1000)}`
        });

        switch (accept) {
            case 'text/turtle':
                reply.header('content-type', 'text/turtle');
                return rdf;
            case 'application/ld+json':
                reply.header('content-type', 'application/ld+json');
                return rdf;
            case 'application/n-quads':
                reply.header('content-type', 'application/n-quads');
                return rdf;
            case 'application/n-triples':
                reply.header('content-type', 'application/n-quads');
                return rdf;
            default:
                reply.header('content-type', 'text/turtle');
                return rdf;
        }
    });
}