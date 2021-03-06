/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const config = {
    urlBase: '${BASE_URL_PATH}',
    port: 3000,
    //sparql: 'http://era.ilabt.imec.be/repositories/ERA-KG', // GraphDB
    //sparql: 'https://test-linked.ec-dataplatform.eu/sparql', // Virtuoso (TEST env)
    sparql: '${SPARQL_ENDPOINT}', // Virtuoso (PROD env)
    sparqlTileBaseURI: '${TILE_BASE_URI}',
    concurrentQueries: true,
    responseHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept',
        'Cache-Control': 'public, max-age=${CACHE_MAX_AGE}' // Cache for 30 days
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
            "default-graph-uri": '${ERA_NAMED_GRAPH}' // Named graph needed for Virtuoso PROD env
            //"default-graph-uri": 'https://test-linked.ec-dataplatform.eu/era' // Named graph needed for Virtuoso TEST env
        }
    },
    logLevel: 'info'
};