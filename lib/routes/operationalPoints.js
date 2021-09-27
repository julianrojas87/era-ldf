/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import { OPs } from '../../config/queries.js';
import utils from '../utils.js';

export async function operationalPoints(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;

    fastify.get(`/${urlBase}/operational-points`, async (request, reply) => {
        const headers = { accept: request.headers['accept'] || OPs.accept };
        
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url} with accept header ${headers.accept}`);
        logger.debug(`Executing the following SPARQL query: \n${OPs.query}`);
        
        const rdf = await utils.doSPARQLQuery({
            stream: true,
            source,
            sparqlQueryConfig,
            headers,
            query: OPs.query
        });

        reply.headers(config.responseHeaders);
        reply.header('content-type', headers.accept);
        return rdf;
    });
}