/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const config = {
    urlBase: 'ldf-virtuoso',
    port: 3001,
    //sparql: 'http://era.ilabt.imec.be/repositories/ERA-KG', // GraphDB
    //sparql: 'https://test-linked.ec-dataplatform.eu/sparql', // Virtuoso (TEST env)
    sparql: 'https://linked.ec-dataplatform.eu/sparql', // Virtuoso (PROD env)
    sparqlTileBaseURI: 'http://era.ilabt.imec.be/sparql-tiles',
    concurrentQueries: true,
    responseHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept',
        'Cache-Control': 'public, max-age=2592000' // Cache for 30 days
    },
    sparqlQueryConfig: {
        headers: {
            //'Authorization': 'Basic ZXJhdXNlcjplcmFrbm93bGVkZ2VncmFwaA==', // Base64 encoded user:password GraphDB
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'curl/7.68.0'
        },
        options: {
            infer: false,
            timeout: 0,
            "default-graph-uri": 'https://linked.ec-dataplatform.eu/era' // Named graph needed for Virtuoso PROD env
            //"default-graph-uri": 'https://test-linked.ec-dataplatform.eu/era' // Named graph needed for Virtuoso TEST env
        }
    },
    mimeTypes: [
        'text/turtle',
        'application/ld+json',
        'application/n-quads',
        'application/n-triples'
    ],
    logLevel: 'debug'
};