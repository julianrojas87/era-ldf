import accepts from 'accepts';
import { config } from '../../config/config.js';

export async function preflight(fastify, options) {

    fastify.options(`/${config.urlBase}/sparql-tiles/*`, async (request, reply) => {
        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': accepts(request.raw).type(config.mimeTypes)
        });

        reply.send();
    });
}