/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import { vocab } from '../../config/queries.js';
import utils from '../utils.js';

export async function vocabulary(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;

    fastify.get(`/${urlBase}/vocabulary`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);

        let rdf = '';
        for (const q of vocab.graph) {
            logger.debug(`Executing the following SPARQL query: \n${q.query}`);
            sparqlQueryConfig.headers['Accept'] = q.accept;

            rdf = rdf.concat(await utils.doSPARQLQuery({
                source,
                sparqlQueryConfig,
                query: q.query
            }));
        }

        reply.headers(config.responseHeaders);
        reply.header('content-type', 'application/n-triples');
        return rdf;
    });
}