/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */
import utils from '../utils.js';
import { readFileSync } from 'fs';
import { config } from '../../config/config.js';
import undici from 'undici';

export async function osrm(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const osrmEngine = config.osrmEngine;
    const idMap = new Map(JSON.parse(readFileSync(config.osrmIdMap, { encoding: 'utf-8' })));

    fastify.get(`/${urlBase}/osrm`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);
        const from = request.query.from;
        const to = request.query.to;
        logger.debug(`Executing an OSRM query from ${from} to ${to} `);

        const { body } = await undici.request(`${osrmEngine}/route/v1/driving/${from};${to}?annotations=true`);
        const rawRes = await body.json();

        const route = [];

        if (rawRes.routes && rawRes.routes.length > 0) {
            for (const node of rawRes.routes[0].legs[0].annotation.nodes) {
                const entry = idMap.get(node.toString());
                if (entry.length || entry.length === 0) {
                    route.push({
                        id: entry.id,
                        length: entry.length
                    });
                } else {
                    route.push({
                        id: entry.id,
                        lngLat: entry.lngLat
                    });
                }
            }
        }

        reply.headers(config.responseHeaders);
        reply.header('content-type', 'application/json');

        return route;
    });
}