/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import { config } from '../../config/config.js';
import { vehicleTypes } from '../../config/queries.js';
import utils from '../utils.js';

const mimeTypes = ['text/turtle', 'application/n-triples'];

export async function vehicles(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;

    fastify.get(`/${urlBase}/vehicle-types`, async (request, reply) => {
        const accept = request.headers['accept'];
        const headers = { accept: mimeTypes.includes(accept) ? accept : vehicleTypes.accept };

        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url} with accept header ${headers.accept}`);
        logger.debug(`Executing the following SPARQL query: \n${vehicleTypes.query}`);
        
        const rdf = await utils.doSPARQLQuery({
            stream: true,
            source,
            sparqlQueryConfig,
            headers,
            query: vehicleTypes.query
        });

        reply.headers(config.responseHeaders);
        reply.header('content-type', headers.accept);
        return rdf;
    });
}