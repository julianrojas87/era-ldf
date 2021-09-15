/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const implementationTiles = {
    '@context': {
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        era: "http://data.europa.eu/949/",
        wgs: "http://www.w3.org/2003/01/geo/wgs84_pos#",
        geosparql: "http://www.opengis.net/ont/geosparql#",
        tiles: "https://w3id.org/tree/terms#",
        hydra: "http://www.w3.org/ns/hydra/core#",
        dcterms: "http://purl.org/dc/terms/",
        "era-op-types": "http://data.europa.eu/949/concepts/op-types#",
        "eu-country": "http://publications.europa.eu/resource/authority/country/",
        "dcterms:license": { "@type": "@id" },
        "hydra:variableRepresentation": { "@type": "@id" },
        "hydra:property": { "@type": "@id" },
        "geo:location": { "@type": "@id" },
        "geosparql:hasGeometry": { "@type": "@id" },
        "era:opType": { "@type": "@id" },
        "era:hasAbstraction": { "@type": "@id" },
        "era:inCountry": { "@type": "@id" }
    },
    graph: [
        { // Query for all OPs, SoLs, SoL Tracks and their location in given bbox
            accept: 'application/n-triples',
            query: (lat1, lon1, lat2, lon2) => {
                return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?sol ?solp ?solo.
                    ?track ?trackp ?tracko.
                    ?op ?opp ?opo.
                    ?l ?lp ?lo.
                } WHERE {
                    ?sol a era:SectionOfLine;
                        era:opStart ?op;
                        era:track ?track;
                        ?solp ?solo.

                    ?track ?trackp ?tracko.

                    ?op a era:OperationalPoint;
                        wgs:location ?l;
                        ?opp ?opo.

                    ?l wgs:lat ?lat;
                       wgs:long ?long;
                       ?lp ?lo.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
            }
        }
    ]
};

export const abstractionTiles = {
    '@context': {
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        era: "http://data.europa.eu/949/",
        wgs: "http://www.w3.org/2003/01/geo/wgs84_pos#",
        geosparql: "http://www.opengis.net/ont/geosparql#",
        tiles: "https://w3id.org/tree/terms#",
        hydra: "http://www.w3.org/ns/hydra/core#",
        dcterms: "http://purl.org/dc/terms/",
        "dcterms:license": { "@type": "@id" },
        "hydra:variableRepresentation": { "@type": "@id" },
        "hydra:property": { "@type": "@id" },
        "geo:location": { "@type": "@id" },
        "geosparql:hasGeometry": { "@type": "@id" },
        "era:belongsToNode": { "@type": "@id" },
        "era:hasImplementation": { "@type": "@id" },
        "era:startPort": { "@type": "@id" },
        "era:endPort": { "@type": "@id" }
    },
    graph: [
        { // Query for all meso and micro elements/relations in given bbox
            accept: 'application/n-triples',
            query: (lat1, lon1, lat2, lon2) => {
                return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?mesoOPNe ?mesoOPNep ?mesoOPNeo.
                    ?microOPNe ?microOPNep ?microOPNeo.
                    ?mesoSOLNe ?mesoSOLNep ?mesoSOLNeo.
                    ?microSOLNe ?microSOLNep ?microSOLNeo.
                    ?mesoNr ?mesoNrp ?mesoNro.
                    ?microNr ?microNrp ?microNro.
                } WHERE {
                    ?mesoOPNe a era:NetElement;
                            era:elementPart ?microOPNe;
                            era:hasImplementation ?op;
                            ?mesoOPNep ?mesoOPNeo.
                    
                    ?microOPNe ?microOPNep ?microOPNeo.
                    
                    ?mesoSOLNe a era:NetElement;
                            era:elementPart ?microSOLNe;
                            era:hasImplementation ?sol;
                            ?mesoSOLNep ?mesoSOLNeo.
                    
                    ?microSOLNe ?microSOLNep ?microSOLNeo.
                    
                    ?mesoNr a era:NetRelation;
                            era:elementA ?mesoOPNe;
                            era:elementB ?mesoSOLNe;
                            ?mesoNrp ?mesoNro.
                            
                    ?microNr a era:NetRelation;
                            era:elementA|era:elementB ?microOPNe;
                            era:elementB|era:elementA ?microSOLNe;
                            ?microNrp ?microNro.
                    
                    ?op wgs:location ?l.
                    
                    ?l wgs:lat ?lat;
                        wgs:long ?long.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
            }
        }
    ]
};

export const vehicleTypes = {
    '@context': {
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        era: "http://data.europa.eu/949/",
        "era-vehicles": "http://data.europa.eu/949/concepts/vehicles#",
        "era-tds": "http://data.europa.eu/949/concepts/train-detection#",
        "era-gaugings": "http://data.europa.eu/949/concepts/gaugings#",
        "era-rs-fire": "http://data.europa.eu/949/concepts/rs-fire#",
        "era-manufacturers": "http://data.europa.eu/949/concepts/manufacturers#",
        "era:category": { "@type": "@id" },
        "era:subCategory": { "@type": "@id" },
        "era:country": { "@type": "@id" },
        "era:gaugingProfile": { "@type": "@id" },
        "era:manufacturer": { "@type": "@id" },
        "era:trainDetectionSystem": { "@type": "@id" }
    },
    graph: { // Query for all vehicle types
        accept: 'text/turtle',
        query: `
        PREFIX era: <http://data.europa.eu/949/>
        CONSTRUCT WHERE {
            ?s a era:VehicleType;
                ?p ?o.
        }
        `
    }
};