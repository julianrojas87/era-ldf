/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

import bent from 'bent';
import formurlencoded from 'form-urlencoded';
import jsonld from 'jsonld';

async function doSPARQLQuery(opts) {
    try {
        const headers = {
            //'Authorization': 'Basic ZXJhdXNlcjplcmFrbm93bGVkZ2VncmFwaA==', // Base64 encoded user:password GraphDB
            'Accept': opts.accept,
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'curl/7.68.0'
        };
        const body = formurlencoded.default({ 
            query: opts.query, 
            infer: false, 
            "default-graph-uri": opts.namedGraph 
        });
        const post = bent('POST', headers);
        const res = await post(opts.source, body);
        if(opts.stream) {
            return res;
        } else {
            return await res.text();
        }
    } catch (err) {
        if (err.text) {
            console.error(`ERROR: ${await err.text()}`);
        } else {
            console.error(err);
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

async function parse2JSONLD(rdf, context) {
    return await jsonld.compact(await jsonld.fromRDF(rdf, 'application/n-quads'), context);
}

function* chunkArray(array, size) {
    for (let i = 0; i < array.length; i += size) {
        yield array.slice(i, i + size);
    }
}

export default {
    doSPARQLQuery,
    extractSPARQLResults,
    parse2JSONLD,
    chunkArray
}