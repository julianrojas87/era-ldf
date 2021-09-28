/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const implementationTiles = {
    accept: 'application/n-triples',
    queries: [
        (lat1, lon1, lat2, lon2) => {
            // Query for all operational points and their location in given bbox
            return `
            PREFIX era: <http://data.europa.eu/949/>
            PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            CONSTRUCT {
                ?op ?opp ?opo.
                ?l ?lp ?lo.
            } WHERE {
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
        },
        (lat1, lon1, lat2, lon2) => {
            // Query for all SoLs and Tracks in given bbox
            return `
            PREFIX era: <http://data.europa.eu/949/>
            PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            CONSTRUCT {
                ?sol ?solp ?solo.
                ?track ?trackp ?tracko.
            } WHERE {
                ?sol a era:SectionOfLine;
                    era:opStart ?op;
                    era:track ?track;
                    ?solp ?solo.

                ?track ?trackp ?tracko.

                ?op a era:OperationalPoint;
                    wgs:location ?l.

                ?l wgs:lat ?lat;
                    wgs:long ?long.
                
                FILTER(?long >= ${lon1} && ?long <= ${lon2})
                FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
            }
        `;
        }
    ]
};

export const abstractionTiles = {
    accept: 'application/n-triples',
    queries: [
        (lat1, lon1, lat2, lon2) => {
            // Query for all OP-related Net Elements in given bbox
            return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?mesoOPNe ?mesoOPNep ?mesoOPNeo.
                    ?microOPNe ?microOPNep ?microOPNeo.
                } WHERE {
                    ?mesoOPNe a era:NetElement;
                            era:elementPart ?microOPNe;
                            era:hasImplementation ?op;
                            ?mesoOPNep ?mesoOPNeo.
                
                    ?microOPNe ?microOPNep ?microOPNeo.
                    
                    ?op wgs:location ?l.
                
                    ?l wgs:lat ?lat;
                        wgs:long ?long.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
        },
        (lat1, lon1, lat2, lon2) => {
            // Query for all SoL-related Net Elements and meso Net Relations in given bbox
            return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?mesoSOLNe ?mesoSOLNep ?mesoSOLNeo.
                    ?microSOLNe ?microSOLNep ?microSOLNeo.
                    ?mesoNr ?mesoNrp ?mesoNro.
                } WHERE {
                    ?mesoOPNe a era:NetElement;
                            era:hasImplementation ?op.
                
                    ?mesoSOLNe a era:NetElement;
                            era:elementPart ?microSOLNe;
                            era:hasImplementation ?sol;
                            ?mesoSOLNep ?mesoSOLNeo.
                
                    ?microSOLNe ?microSOLNep ?microSOLNeo.
                
                    ?mesoNr a era:NetRelation;
                            era:elementA|era:elementB ?mesoOPNe;
                            era:elementB|era:elementA ?mesoSOLNe;
                            ?mesoNrp ?mesoNro.
                
                    ?op wgs:location ?l.
                    
                    ?sol a era:SectionOfLine.
                
                    ?l wgs:lat ?lat;
                        wgs:long ?long.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
        },
        (lat1, lon1, lat2, lon2) => {
            // Query for all Net Relations in given bbox
            return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?microNr ?microNrp ?microNro.
                } WHERE {
                    ?mesoOPNe a era:NetElement;
                            era:elementPart ?microOPNe;
                            era:hasImplementation ?op.
                            
                    ?mesoSOLNe a era:NetElement;
                            era:hasImplementation ?sol;
                            era:elementPart ?microSOLNe.
                
                    ?mesoNr a era:NetRelation;
                            era:elementA|era:elementB ?mesoOPNe;
                            era:elementB|era:elementA ?mesoSOLNe.
                
                    ?microNr a era:NetRelation;
                            era:elementA|era:elementB ?microOPNe;
                            era:elementB|era:elementA ?microSOLNe;
                            ?microNrp ?microNro.
                
                    ?op wgs:location ?l.

                    ?sol a era:SectionOfLine.
                
                    ?l wgs:lat ?lat;
                        wgs:long ?long.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
        }
    ]
};

export const vehicleTypes = { // Query for all vehicle types
    accept: 'text/turtle',
    query: `
        PREFIX era: <http://data.europa.eu/949/>
        CONSTRUCT WHERE {
            ?s a era:VehicleType;
                ?p ?o.
        }
        `
};

export const OPs = { // Query for all operational points label and location
    accept: 'text/turtle',
    query: `
        PREFIX era: <http://data.europa.eu/949/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX geosparql: <http://www.opengis.net/ont/geosparql#>
        CONSTRUCT {
            ?op rdfs:label ?oplabel;
                era:uopid ?uopid;
                wgs:location ?l.
            ?l geosparql:asWKT ?wkt.
        } WHERE {
            ?op a era:OperationalPoint;
                rdfs:label ?oplabel;
                era:uopid ?uopid;
                wgs:location ?l.
        
            ?l geosparql:asWKT ?wkt.
        }
        `
};