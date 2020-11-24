/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import { config } from '../../config/config.js';
import utils from '../utils.js';
import accepts from 'accepts';
import { implementationTiles, abstractionTiles } from '../../config/queries.js';

export async function sparqlTiles(fastify, options) {

    const source = config.sparql;
    const mimeTypes = ['application/ld+json', 'application/n-quads', 'application/n-triples'];

    fastify.options('/ldf/sparql-tiles/*', async (request, reply) => {
        const accept = accepts(request.raw).type(mimeTypes);
        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': accept
        });
        reply.send();
    });

    fastify.get('/sparql-tiles/implementation/:z/:x/:y', async (request, reply) => {
        const lat1 = tile2lat(parseFloat(request.params.y), parseFloat(request.params.z));
        const lon1 = tile2long(parseFloat(request.params.x), parseFloat(request.params.z));

        const lat2 = tile2lat(parseFloat(request.params.y) + 1, parseFloat(request.params.z));
        const lon2 = tile2long(parseFloat(request.params.x) + 1, parseFloat(request.params.z));

        let triples = '';

        for (const q of implementationTiles.graph) {
            triples = triples.concat(await utils.doSPARQLQuery({
                source,
                accept: q.accept,
                query: q.query(lat1, lon1, lat2, lon2)
            }));
        }

        const accept = accepts(request.raw).type(mimeTypes);
        const opts = {
            type: 'implementation',
            x: request.params.x,
            y: request.params.y,
            z: request.params.z
        }

        const midnight = new Date().setHours(24, 0, 0, 0);
        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Accept',
            'Cache-Control': `public, max-age=2592000`
            //'Cache-Control': `public, max-age=${Math.floor((midnight - new Date()) / 1000)}`
        });

        switch (accept) {
            case 'application/ld+json':
                reply.header('content-type', 'application/ld+json');
                return await utils.parse2JSONLD(getMetadata(opts) + addGraph(triples.split('\n'), opts), implementationTiles["@context"]);
            case 'application/n-quads':
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            case 'application/n-triples':
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            default:
                reply.header('content-type', 'application/ld+json');
                return await utils.parse2JSONLD(getMetadata(opts) + addGraph(triples.split('\n'), opts), implementationTiles["@context"]);
        }
    });

    fastify.get('/sparql-tiles/abstraction/:z/:x/:y', async (request, reply) => {
        const lat1 = tile2lat(parseFloat(request.params.y), parseFloat(request.params.z));
        const lon1 = tile2long(parseFloat(request.params.x), parseFloat(request.params.z));

        const lat2 = tile2lat(parseFloat(request.params.y) + 1, parseFloat(request.params.z));
        const lon2 = tile2long(parseFloat(request.params.x) + 1, parseFloat(request.params.z));

        console.log(lat1, lon1);
        console.log(lat2, lon2);

        let triples = '';

        for (const q of abstractionTiles.graph) {
            triples = triples.concat(await utils.doSPARQLQuery({
                source,
                accept: q.accept,
                query: q.query(lat1, lon1, lat2, lon2)
            }));
        }

        const accept = accepts(request.raw).type(mimeTypes);
        const opts = {
            type: 'abstraction',
            x: request.params.x,
            y: request.params.y,
            z: request.params.z
        }

        const midnight = new Date().setHours(24, 0, 0, 0);
        reply.headers({
            'Access-Control-Allow-Origin': '*',
            'Vary': 'Accept',
            'Cache-Control': `public, max-age=2592000`
            // 'Cache-Control': `public, max-age=${Math.floor((midnight - new Date()) / 1000)}`
        });

        switch (accept) {
            case 'application/ld+json':
                reply.header('content-type', 'application/ld+json');
                return await utils.parse2JSONLD(getMetadata(opts) + addGraph(triples.split('\n'), opts), abstractionTiles["@context"]);
            case 'application/n-quads':
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            case 'application/n-triples':
                reply.header('content-type', 'application/n-quads');
                return getMetadata(opts) + addGraph(triples.split('\n'), opts);
            default:
                reply.header('content-type', 'application/ld+json');
                return await utils.parse2JSONLD(getMetadata(opts) + addGraph(triples.split('\n'), opts), abstractionTiles["@context"]);
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