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
                    ?mesoOPNe a era:NetElement;
                        era:elementPart ?microOPNe;
                        era:hasImplementation ?op.
                    ?microOPNe a era:NetElement.
                } WHERE {
                    ?mesoOPNe a era:NetElement;
                            era:elementPart ?microOPNe;
                            era:hasImplementation ?op.
                    
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
                    ?mesoSOLNe a era:NetElement;
                            era:elementPart ?microSOLNe;
                            era:hasImplementation ?sol.
                    ?microSOLNe a era:NetElement;
                                era:hasImplementation ?track;
                                era:length ?length.
                    ?mesoNr ?mesoNrp ?mesoNro.
                } WHERE {
                    ?mesoOPNe a era:NetElement;
                            era:hasImplementation [ wgs:location ?l ].
                
                    ?mesoSOLNe a era:NetElement;
                            era:elementPart ?microSOLNe;
                            era:hasImplementation ?sol.
                
                    ?microSOLNe a era:NetElement;
                                era:hasImplementation ?track;
                                era:length ?length.
                
                    ?mesoNr a era:NetRelation;
                            era:elementA|era:elementB ?mesoOPNe;
                            era:elementB|era:elementA ?mesoSOLNe;
                            ?mesoNrp ?mesoNro.
                    
                    ?sol a era:SectionOfLine.
                    
                    ?l wgs:lat ?lat;
                        wgs:long ?long.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
        },
        (lat1, lon1, lat2, lon2) => {
            // Query for all micro Net Relations in given bbox
            return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?microNr ?microNrp ?microNro.
                } WHERE {
                    ?mesoOPNe a era:NetElement;
                            era:elementPart ?microOPNe;
                            era:hasImplementation [ wgs:location ?l ].
                            
                    ?mesoSOLNe a era:NetElement;
                            era:hasImplementation [ a era:SectionOfLine ];
                            era:elementPart ?microSOLNe.
                
                    ?mesoNr a era:NetRelation;
                            era:elementA|era:elementB ?mesoOPNe;
                            era:elementB|era:elementA ?mesoSOLNe.
                
                    ?microNr a era:NetRelation;
                            era:elementA|era:elementB ?microOPNe;
                            era:elementB|era:elementA ?microSOLNe;
                            ?microNrp ?microNro.
                
                    ?l wgs:lat ?lat;
                        wgs:long ?long.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
        },
        (lat1, lon1, lat2, lon2) => {
            // Query for location and micro NetRelations of tile border elements
            return `
            PREFIX era: <http://data.europa.eu/949/>
            PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX geosparql: <http://www.opengis.net/ont/geosparql#>
            CONSTRUCT {
                ?outOP wgs:location ?outL;
                    era:hasAbstraction ?outMesoNe.
                ?outL geosparql:asWKT ?wkt.
                ?outMesoNe a era:NetElement;
                    era:elementPart ?outMicroNe;
                    era:hasImplementation ?outOP.
                ?outMicroNe a era:NetElement.
                ?microNr ?microNrp ?microNro.
            } WHERE {        
                ?inOP a era:OperationalPoint;
                      wgs:location [ wgs:lat ?inLat; wgs:long ?inLong ].
            
                ?sol a era:SectionOfLine;
                     era:hasAbstraction [ era:elementPart ?solMicroNe ];
                     era:opStart|era:opEnd ?inOP;
                     era:opEnd|era:opStart ?outOP.
                
                ?outOP wgs:location ?outL;
                       era:hasAbstraction ?outMesoNe.
                
                ?outL wgs:lat ?outLat;
                      wgs:long ?outLong;
                      geosparql:asWKT ?wkt.
                   
                ?outMesoNe a era:NetElement;
                           era:elementPart ?outMicroNe;
                           era:hasImplementation ?outOP.
                
                ?microNr a era:NetRelation;
                         era:elementA|era:elementB ?outMicroNe;
                         era:elementB|era:elementA ?solMicroNe;
                         ?microNrp ?microNro.
                
                # Conditions for OP to be inside the tile in question
                FILTER(?inLong >= ${lon1} && ?inLong <= ${lon2})
                FILTER(?inLat <= ${lat1} && ?inLat >= ${lat2})

                # Condition for OP to be outside the tile in question
                FILTER(?outLong < ${lon1} || ?outLong > ${lon2} || ?outLat > ${lat1} || ?outLat < ${lat2})
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