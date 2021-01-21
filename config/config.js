/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const config = {
    //sparql: 'http://era.ilabt.imec.be/repositories/ERA-KG', // GraphDB
    sparql: 'https://test-linked.ec-dataplatform.eu/sparql', // Virtuoso
    sparqlTileBaseURI: 'http://era.ilabt.imec.be/sparql-tiles',
    namedGraph: 'urn:era-kg-v1.1.2.ttl' // Needed for Virtuoso
};