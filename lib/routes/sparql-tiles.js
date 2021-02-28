/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import { config } from '../../config/config.js';
import utils from '../utils.js';
import accepts from 'accepts';
import { implementationTiles, abstractionTiles } from '../../config/queries.js';

export async function sparqlTiles(fastify, options) {
    const logger = utils.logger;
    const urlBase = config.urlBase;
    const source = config.sparql;
    const mimeTypes = config.mimeTypes;
    const sparqlQueryConfig = config.sparqlQueryConfig;

    fastify.get(`/${urlBase}/sparql-tiles/implementation/:z/:x/:y`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.protocol}://${request.hostname}${request.url}`);
        const lat1 = tile2lat(parseFloat(request.params.y), parseFloat(request.params.z));
        const lon1 = tile2long(parseFloat(request.params.x), parseFloat(request.params.z));

        const lat2 = tile2lat(parseFloat(request.params.y) + 1, parseFloat(request.params.z));
        const lon2 = tile2long(parseFloat(request.params.x) + 1, parseFloat(request.params.z));

        let triples = '';

        for (const q of implementationTiles.graph) {
            const sparql = q.query(lat1, lon1, lat2, lon2);
            logger.debug(`Executing the following SPARQL query: \n${sparql}`);
            sparqlQueryConfig.headers['Accept'] = q.accept;

            triples = triples.concat(await utils.doSPARQLQuery({
                source,
                sparqlQueryConfig,
                query: sparql
            }));
        }

        const accept = accepts(request.raw).type(mimeTypes);
        const opts = {
            type: 'implementation',
            x: request.params.x,
            y: request.params.y,
            z: request.params.z
        }

        reply.headers(config.responseHeaders);

        switch (accept) {
            case 'application/ld+json':
                logger.debug(`Parsing response data to JSON-LD format`);
                reply.header('content-type', 'application/ld+json');
                return await utils.parse2JSONLD(getMetadata(opts) + addGraph(triples.split('\n'), opts), implementationTiles["@context"]);
            case 'application/n-quads':
                logger.debug(`Parsing response data to N-Quads format`);
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            case 'application/n-triples':
                logger.debug(`Parsing response data to N-Quads format`);
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            default:
                logger.debug(`Parsing response data to N-Quads format`);
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
        }
    });

    fastify.get(`/${urlBase}/sparql-tiles/abstraction/:z/:x/:y`, async (request, reply) => {
        logger.info('--------------------------------------------------------------------------');
        logger.info(`Received request ${request.url}`);
        const lat1 = tile2lat(parseFloat(request.params.y), parseFloat(request.params.z));
        const lon1 = tile2long(parseFloat(request.params.x), parseFloat(request.params.z));

        const lat2 = tile2lat(parseFloat(request.params.y) + 1, parseFloat(request.params.z));
        const lon2 = tile2long(parseFloat(request.params.x) + 1, parseFloat(request.params.z));

        let triples = '';

        for (const q of abstractionTiles.graph) {
            const sparql = q.query(lat1, lon1, lat2, lon2);
            logger.debug(`Executing the following SPARQL query: \n${sparql}`);
            sparqlQueryConfig.headers['Accept'] = q.accept;

            triples = triples.concat(await utils.doSPARQLQuery({
                source,
                sparqlQueryConfig,
                query: sparql
            }));
        }

        const accept = accepts(request.raw).type(mimeTypes);
        const opts = {
            type: 'abstraction',
            x: request.params.x,
            y: request.params.y,
            z: request.params.z
        }

        reply.headers(config.responseHeaders);

        switch (accept) {
            case 'application/ld+json':
                logger.debug(`Parsing response data to JSON-LD format`);
                reply.header('content-type', 'application/ld+json');
                return await utils.parse2JSONLD(getMetadata(opts) + addGraph(triples.split('\n'), opts), abstractionTiles["@context"]);
            case 'application/n-quads':
                logger.debug(`Parsing response data to N-Quads format`);
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            case 'application/n-triples':
                logger.debug(`Parsing response data to N-Quads format`);
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            default:
                logger.debug(`Parsing response data to N-Quads format`);
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
        }
    });
}

function tile2long(x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
}

function tile2lat(y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

function addGraph(triples, opts) {
    let quads = [];
    triples.pop();
    for (let t of triples) {
        t = t.slice(0, -2);
        quads.push(`${t} <${config.sparqlTileBaseURI}/${opts.type}/${opts.z}/${opts.x}/${opts.y}> .`);
    }

    return quads.join('\n');
}

function getMetadata(opts) {
    const xsd = 'http://www.w3.org/2001/XMLSchema#';
    const tiles = 'https://w3id.org/tree/terms#';
    const dct = 'http://purl.org/dc/terms/';
    const hydra = 'http://www.w3.org/ns/hydra/core#';
    const a = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
    const tileURI = `${config.sparqlTileBaseURI}/${opts.type}/${opts.z}/${opts.x}/${opts.y}`;
    const collection = `${config.sparqlTileBaseURI}/${opts.type}`;

    return `
<${tileURI}> <${tiles}zoom> "${opts.z}"^^<${xsd}integer> .
<${tileURI}> <${tiles}longitudeTile> "${opts.x}"^^<${xsd}integer> .
<${tileURI}> <${tiles}latitudeTile> "${opts.y}"^^<${xsd}integer> .
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
_:b1 <${hydra}property> <${tiles}longitudeTile> .
_:b1 <${hydra}required> "true"^^<${xsd}boolean> .
_:b2 <${a}> <${hydra}IriTemplateMapping> .
_:b2 <${hydra}variable> "y" .
_:b2 <${hydra}property> <${tiles}latitudeTile> .
_:b2 <${hydra}required> "true"^^<${xsd}boolean> .
_:b3 <${a}> <${hydra}IriTemplateMapping> .
_:b3 <${hydra}variable> "z" .
_:b3 <${hydra}property> <${tiles}zoom> .
_:b3 <${hydra}required> "true"^^<${xsd}boolean> .
`;
}