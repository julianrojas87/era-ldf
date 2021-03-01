/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import { vehicleTypes, vehicleInstances } from '../../config/queries.js';
import utils from '../utils.js';

export async function vehicles(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;

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

        reply.headers(config.responseHeaders);
        reply.header('content-type', 'text/turtle');
        return rdf;
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

        reply.headers(config.responseHeaders);
        reply.header('content-type', 'text/turtle');
        return rdf;
    });
}