/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import { vehicleTypes, vehicleInstances } from '../../config/queries.js';
import utils from '../utils.js';
import accepts from 'accepts';

export async function vehicles(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;
    const mimeTypes = config.mimeTypes;

    fastify.get(`/${urlBase}/vehicle-types`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);
        logger.debug(`Executing the following SPARQL query: \n${vehicleTypes.graph.query}`);

        sparqlQueryConfig.headers['Accept'] = vehicleTypes.graph.accept;
        
        const rdf = await utils.doSPARQLQuery({
            stream: true,
            source,
            sparqlQueryConfig,
            query: vehicleTypes.graph.query
        });

        const accept = accepts(request.raw).type(mimeTypes);

        reply.headers(config.responseHeaders);

        switch (accept) {
            case 'text/turtle':
                logger.debug('Parsing response data to Turtle format');
                reply.header('content-type', 'text/turtle');
                return rdf;
            case 'application/ld+json':
                logger.debug('Parsing response data to JSON-LD format');
                reply.header('content-type', 'application/ld+json');
                return rdf;
            case 'application/n-quads':
                logger.debug('Parsing response data to N-Quads format');
                reply.header('content-type', 'application/n-quads');
                return rdf;
            case 'application/n-triples':
                logger.debug('Parsing response data to N-Quads format');
                reply.header('content-type', 'application/n-quads');
                return rdf;
            default:
                logger.debug('Parsing response data to Turtle format');
                reply.header('content-type', 'text/turtle');
                return rdf;
        }
    });

    fastify.get(`/${urlBase}/vehicles`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);
        logger.debug(`Executing the following SPARQL query: \n${vehicleInstances.graph.query}`);

        sparqlQueryConfig.headers['Accept'] = vehicleInstances.graph.accept;

        const rdf = await utils.doSPARQLQuery({
            stream: true,
            source,
            sparqlQueryConfig,
            query: vehicleInstances.graph.query
        });

        const accept = accepts(request.raw).type(mimeTypes);

        reply.headers(config.responseHeaders);

        switch (accept) {
            case 'text/turtle':
                logger.debug('Parsing response data to Turtle format');
                reply.header('content-type', 'text/turtle');
                return rdf;
            case 'application/ld+json':
                logger.debug('Parsing response data to JSON-LD format');
                reply.header('content-type', 'application/ld+json');
                return rdf;
            case 'application/n-quads':
                logger.debug('Parsing response data to N-Quads format');
                reply.header('content-type', 'application/n-quads');
                return rdf;
            case 'application/n-triples':
                logger.debug('Parsing response data to N-Quads format');
                reply.header('content-type', 'application/n-quads');
                return rdf;
            default:
                logger.debug('Parsing response data to Turtle format');
                reply.header('content-type', 'text/turtle');
                return rdf;
        }
    });
}