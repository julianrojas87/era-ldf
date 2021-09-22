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
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);
        logger.debug(`Executing the following SPARQL query: \n${OPs.query}`);

        sparqlQueryConfig.headers['Accept'] = request.headers['Accept'] || OPs.accept;
        
        const rdf = await utils.doSPARQLQuery({
            stream: true,
            source,
            sparqlQueryConfig,
            query: OPs.query
        });

        reply.headers(config.responseHeaders);
        reply.header('content-type', sparqlQueryConfig.headers['Accept']);
        return rdf;
    });
}