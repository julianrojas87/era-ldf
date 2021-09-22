/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import { config } from '../../config/config.js';
import utils from '../utils.js';
import { implementationTiles, abstractionTiles } from '../../config/queries.js';

export async function sparqlTiles(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const sparqlQueryConfig = config.sparqlQueryConfig;

    fastify.get(`/${urlBase}/sparql-tiles/implementation/:z/:x/:y`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.protocol}://${request.hostname}${request.url}`);
        const lat1 = tile2lat(parseFloat(request.params.y), parseFloat(request.params.z));
        const lon1 = tile2long(parseFloat(request.params.x), parseFloat(request.params.z));

        const lat2 = tile2lat(parseFloat(request.params.y) + 1, parseFloat(request.params.z));
        const lon2 = tile2long(parseFloat(request.params.x) + 1, parseFloat(request.params.z));

        const sparqlRes = [];

        if (config.concurrentQueries) {
            await Promise.all(implementationTiles.map(async q => {
                const sparql = q.query(lat1, lon1, lat2, lon2);
                logger.debug(`Executing the following SPARQL query: \n${sparql}`);
                sparqlQueryConfig.headers['Accept'] = request.headers['Accept'] || q.accept;

                sparqlRes.push(
                    await utils.doSPARQLQuery({
                        source,
                        sparqlQueryConfig,
                        query: sparql
                    })
                );
            }));
        } else {
            for (const q of implementationTiles) {
                const sparql = q.query(lat1, lon1, lat2, lon2);
                logger.debug(`Executing the following SPARQL query: \n${sparql}`);
                sparqlQueryConfig.headers['Accept'] = request.headers['Accept'] || q.accept;

                sparqlRes.push(
                    await utils.doSPARQLQuery({
                        source,
                        sparqlQueryConfig,
                        query: sparql
                    })
                );
            }
        }

        const opts = {
            type: 'implementation',
            x: request.params.x,
            y: request.params.y,
            z: request.params.z
        }

        reply.headers(config.responseHeaders);
        reply.header('content-type', request.headers['Accept'] || implementationTiles[0].accept);

        return addMetadata(sparqlRes.join(''), opts);
    });

    fastify.get(`/${urlBase}/sparql-tiles/abstraction/:z/:x/:y`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);
        const lat1 = tile2lat(parseFloat(request.params.y), parseFloat(request.params.z));
        const lon1 = tile2long(parseFloat(request.params.x), parseFloat(request.params.z));

        const lat2 = tile2lat(parseFloat(request.params.y) + 1, parseFloat(request.params.z));
        const lon2 = tile2long(parseFloat(request.params.x) + 1, parseFloat(request.params.z));

        const sparqlRes = [];

        if (config.concurrentQueries) {
            await Promise.all(abstractionTiles.map(async q => {
                const sparql = q.query(lat1, lon1, lat2, lon2);
                logger.debug(`Executing the following SPARQL query: \n${sparql}`);
                sparqlQueryConfig.headers['Accept'] = request.headers['Accept'] || q.accept;

                sparqlRes.push(
                    await utils.doSPARQLQuery({
                        source,
                        sparqlQueryConfig,
                        query: sparql
                    })
                );
            }));
        } else {
            for (const q of abstractionTiles) {
                const sparql = q.query(lat1, lon1, lat2, lon2);
                logger.debug(`Executing the following SPARQL query: \n${sparql}`);
                sparqlQueryConfig.headers['Accept'] = request.headers['Accept'] || q.accept;

                sparqlRes.push(
                    await utils.doSPARQLQuery({
                        source,
                        sparqlQueryConfig,
                        query: sparql
                    })
                );
            }
        }

        const opts = {
            type: 'abstraction',
            x: request.params.x,
            y: request.params.y,
            z: request.params.z
        }

        reply.headers(config.responseHeaders);
        reply.header('content-type', request.headers['Accept'] || abstractionTiles[0].accept);

        return addMetadata(sparqlRes.join(''), opts);

    });
}

function tile2long(x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
}

function tile2lat(y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

function addMetadata(triples, opts) {
    const xsd = 'http://www.w3.org/2001/XMLSchema#';
    const tree = 'https://w3id.org/tree/terms#';
    const dct = 'http://purl.org/dc/terms/';
    const hydra = 'http://www.w3.org/ns/hydra/core#';
    const a = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
    const tileURI = `${config.sparqlTileBaseURI}/${opts.type}/${opts.z}/${opts.x}/${opts.y}`;
    const collection = `${config.sparqlTileBaseURI}/${opts.type}`;

    const members = [];
    const memberSet = new Set();
    let lines = triples.split('\n');

    for (let t of lines) {
        t = t.slice(0, t.indexOf('>') + 1);
        if(t!== '' && !memberSet.has(t)) {
            members.push(`<${tileURI}> <${tree}member> ${t} .`);
            memberSet.add(t);
        }
    }

    return `
<${tileURI}> <${tree}zoom> "${opts.z}"^^<${xsd}integer> .
<${tileURI}> <${tree}longitudeTile> "${opts.x}"^^<${xsd}integer> .
<${tileURI}> <${tree}latitudeTile> "${opts.y}"^^<${xsd}integer> .
<${tileURI}> <${dct}isPartOf> <${collection}> .
<${collection}> <${a}> <${hydra}Collection> .
<${collection}> <${dct}license> <http://opendatacommons.org/licenses/odbl/1-0/> .
<${collection}> <${hydra}search> _:b0 .
_:b0 <${a}> <${hydra}IriTemplate> .
_:b0 <${hydra}template> "${collection}/{z}/{x}/{y}" .
_:b0 <${hydra}variableRepresentation> <${hydra}BasicRepresentation> .
_:b0 <${hydra}mapping> _:b1 .
_:b0 <${hydra}mapping> _:b2 .
_:b0 <${hydra}mapping> _:b3 .
_:b1 <${a}> <${hydra}IriTemplateMapping> .
_:b1 <${hydra}variable> "x" .
_:b1 <${hydra}property> <${tree}longitudeTile> .
_:b1 <${hydra}required> "true"^^<${xsd}boolean> .
_:b2 <${a}> <${hydra}IriTemplateMapping> .
_:b2 <${hydra}variable> "y" .
_:b2 <${hydra}property> <${tree}latitudeTile> .
_:b2 <${hydra}required> "true"^^<${xsd}boolean> .
_:b3 <${a}> <${hydra}IriTemplateMapping> .
_:b3 <${hydra}variable> "z" .
_:b3 <${hydra}property> <${tree}zoom> .
_:b3 <${hydra}required> "true"^^<${xsd}boolean> .
${members.join('\n')}
${triples}
`;
}