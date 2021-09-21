/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import utils from '../utils.js';

export async function count(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;

    fastify.get(`/${urlBase}/count`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);
        const query = request.query.query;
        logger.debug(`Executing the following SPARQL query: \n${query}`);

        sparqlQueryConfig.headers['Accept'] = 'application/sparql-results+json';
        
        const rdf = await utils.doSPARQLQuery({
            stream: false,
            source,
            sparqlQueryConfig,
            query: query
        });

        reply.headers(config.responseHeaders);
        reply.header('content-type', 'application/sparql-results+json');
        return rdf;
    });
}