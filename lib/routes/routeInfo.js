/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import { config } from '../../config/config.js';
import utils from '../utils.js';
import { implementationTiles } from '../../config/queries.js';

export async function routeInfo(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;

    fastify.post(`/${urlBase}/route-info`, async (request, reply) => {
        const headers = { accept: implementationTiles.accept };
        const nodes = JSON.parse(request.body);
        const filter = `FILTER(?op IN (${nodes.map(n => `<${n}>`).join(',')}))`;
        const sparqlRes = [];

        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.protocol}://${request.hostname}${request.url} with accept header ${headers.accept}`);

        if (config.concurrentQueries) {
            await Promise.all(implementationTiles.queries.map(async q => {
                const sparql = q(filter);
                logger.debug(`Executing the following SPARQL query: \n${sparql}`);

                sparqlRes.push(
                    await utils.doSPARQLQuery({
                        source,
                        sparqlQueryConfig,
                        headers,
                        query: sparql
                    })
                );
            }));
        } else {
            for (const q of implementationTiles.queries) {
                const sparql = q(filter);
                logger.debug(`Executing the following SPARQL query: \n${sparql}`);

                sparqlRes.push(
                    await utils.doSPARQLQuery({
                        source,
                        sparqlQueryConfig,
                        headers,
                        query: sparql
                    })
                );
            }
        }

        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Accept',
            'content-type': 'application/n-triples; charset=UTF-8',
            'Cache-Control': 'no-cache'
        });

        return sparqlRes.join('');
    });
} 