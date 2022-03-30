/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import winston from 'winston';
import bent from 'bent';
import formurlencoded from 'form-urlencoded';
import { config } from '../config/config.js'

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
})

async function doSPARQLQuery(opts) {
    try {
        const body = formurlencoded({ 
            query: opts.query,
            ...opts.sparqlQueryConfig.options 
        });
        const post = bent('POST', { ...opts.sparqlQueryConfig.headers, ...opts.headers });
        const res = await post(opts.source, body);
        logger.debug(`SPARQL query response headers: ${JSON.stringify(res.headers, null, 3)}`);

        if(opts.stream) {
            return res;
        } else {
            return await res.text();
        }
    } catch (err) {
        if (err.text) {
            logger.error(`ERROR: ${await err.text()}`);
        } else {
            logger.error(err);
        }
        throw err;
    }
}

function extractSPARQLResults(res) {
    let jres = JSON.parse(res);
    let params = jres.head.vars;
    let output = [];

    for (const r of jres.results.bindings) {
        if (params.length > 1) {
            let temp = [];
            for (const p of params) {
                temp.push(r[p].value);
            }
            output.push(temp);
        } else {
            output.push(r[params[0]].value);
        }
    }
    return output;
}

function* chunkArray(array, size) {
    for (let i = 0; i < array.length; i += size) {
        yield array.slice(i, i + size);
    }
}

export default {
    logger,
    doSPARQLQuery,
    extractSPARQLResults,
    chunkArray
}