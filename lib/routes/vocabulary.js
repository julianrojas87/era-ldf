/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import { vocab } from '../../config/queries.js';
import utils from '../utils.js';
import accepts from 'accepts';

export async function vocabulary(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const namedGraph = config.namedGraph;
    const mimeTypes = config.mimeTypes;

    fastify.get(`/${urlBase}/vocabulary`, async (request, reply) => {
        logger.info(`Received request: ${request.url}`);

        let rdf = '';
        for (const q of vocab.graph) {
            logger.debug(`Executing the following SPARQL query: \n${q.query}`);
            rdf = rdf.concat(await utils.doSPARQLQuery({
                source,
                namedGraph,
                accept: q.accept,
                query: q.query
            }));
        }

        const accept = accepts(request.raw).type(mimeTypes);

        reply.headers(config.responseHeaders);

        switch (accept) {
            case 'application/ld+json':
                logger.debug('Parsing response data to JSON-LD format');
                reply.header('content-type', 'application/ld+json');
                return await utils.parse2JSONLD(rdf, vocab["@context"]);
            case 'application/n-quads':
                logger.debug('Parsing response data to N-Quads format');
                reply.header('content-type', 'application/n-quads');
                return rdf;
            case 'application/n-triples':
                logger.debug('Parsing response data to N-Quads format');
                reply.header('content-type', 'application/n-quads');
                return rdf;
            default:
                logger.debug('Parsing response data to N-Quads format');
                reply.header('content-type', 'application/n-quads');
                return rdf;
        }
    });
}