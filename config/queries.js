/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const implementationTiles = {
    accept: 'application/n-triples',
    queries: [
        filter => {
            // Query for all operational points and their location in given bbox
            return `
            PREFIX era: <http://data.europa.eu/949/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            CONSTRUCT {
                ?op a era:OperationalPoint;
                    rdfs:label ?label;
                    era:uopid ?uopid;
                    era:tafTAPCode ?ttcode;
                    era:opType ?optype;
                    era:inCountry ?country;
                    era:hasAbstraction ?abs;
                    wgs:location ?l.
                ?l ?lp ?lo.
            } WHERE {
                ?op a era:OperationalPoint;
                    rdfs:label ?label;
                    era:uopid ?uopid;
                    era:opType ?optype;
                    era:inCountry ?country;
                    era:hasAbstraction ?abs;
                    wgs:location ?l.
                
                OPTIONAL {?op era:tafTAPCode ?ttcode}

                ?l wgs:lat ?lat;
                wgs:long ?long;
                ?lp ?lo.
                
                ${filter}
            }
        `;
        },
        filter => {
            // Query for all SoLs and Tracks in given bbox
            return `
            PREFIX era: <http://data.europa.eu/949/>
            PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            CONSTRUCT {
                ?track rdfs:label ?label;
                    era:trackId ?tid;
                    era:hasAbstraction ?tne;
                    era:gaugingProfile ?gprof;
                    era:trainDetectionSystem ?tds;
                    era:hasHotAxleBoxDetector ?habd;
                    era:railInclination ?ri;
                    era:wheelSetGauge ?wsg;
                    era:minimumWheelDiameter ?mwd;
                    era:minimumHorizontalRadius ?mhr;
                    era:minimumTemperature ?mintemp;
                    era:maximumTemperature ?maxtemp;
                    era:contactLineSystem ?cls;
                    era:minimumContactWireHeight ?mincwh;
                    era:maximumContactWireHeight ?maxcwh;
                    era:contactStripMaterial ?ctm;
                    era:isQuietRoute ?qr.
                ?cls era:contactLineSystemType ?clst; 
                    era:energySupplySystem ?ess;
                    era:maxCurrentStandstillPantograph ?maxcsp.
                ?tds era:trainDetectionSystemType ?tdst.
            } WHERE {
                ?sol a era:SectionOfLine;
                    era:opStart ?op;
                    era:track ?track.

                {
                    ?track a era:Track;
                        rdfs:label ?label;
                        era:trackId ?tid;
                        era:hasAbstraction ?tne.
                } 
                UNION {?track era:gaugingProfile ?gprof}
                UNION {?track era:hasHotAxleBoxDetector ?habd}
                UNION {?track era:railInclination ?ri}
                UNION {?track era:wheelSetGauge ?wsg}
                UNION {?track era:minimumWheelDiameter ?mwd}
                UNION {?track era:minimumHorizontalRadius ?mhr}
                UNION {?track era:minimumTemperature ?mintemp}
                UNION {?track era:maximumTemperature ?maxtemp}
                UNION {?track era:minimumContactWireHeight ?mincwh}
                UNION {?track era:maximumContactWireHeight ?maxcwh}
                UNION {?track era:contactStripMaterial ?ctm}
                UNION {?track era:isQuietRoute ?qr}
                UNION {?track era:contactLineSystem ?cls}
                UNION {
                    ?track era:contactLineSystem ?cls.
                    ?cls era:contactLineSystemType ?clst.
                }
                UNION {
                    ?track era:contactLineSystem ?cls.
                    ?cls era:energySupplySystem ?ess.
                }
                UNION {
                    ?track era:contactLineSystem ?cls.
                    ?cls era:maxCurrentStandstillPantograph ?maxcsp.
                }
                UNION {?track era:trainDetectionSystem ?tds}
                UNION
                {
                    ?track era:trainDetectionSystem ?tds.
                    ?tds era:trainDetectionSystemType ?tdst.
                }

                ?op a era:OperationalPoint;
                    wgs:location ?l.

                ?l wgs:lat ?lat;
                wgs:long ?long.
                
                ${filter}
            }
        `;
        },
        filter => {
            // Query for aggregation triples of elements within Operational Points in given bbox
            return `
            PREFIX era: <http://data.europa.eu/949/>
            PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            CONSTRUCT {
                ?impl era:elementPart ?ne.
            } WHERE {
                ?op a era:OperationalPoint;
                    wgs:location ?l;
                    era:hasAbstraction ?impl.

                ?impl era:elementPart ?ne.

                ?l wgs:lat ?lat;
                    wgs:long ?long.
                
                ${filter}
            }
        `;
        }
    ]
};

export const abstractionTiles = {
    accept: 'application/n-triples',
    queries: [
        (lat1, lon1, lat2, lon2) => {
            // Query for all OP topology nodes and their connections within given bbox
            return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX geosparql: <http://www.opengis.net/ont/geosparql#>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                PREFIX era-nv: <http://data.europa.eu/949/concepts/navigabilities/>
                CONSTRUCT {
                    ?opne geosparql:asWKT ?wkt;
                        era:partOf ?mesoOPNe;
                        era:linkedTo ?nextNe.
                    ?mesoOPNe era:hasImplementation ?OP.
                } WHERE {
                    ?opne a era:NetElement;
                        ^era:elementPart ?mesoOPNe.
                
                    ?mesoOPNe era:hasImplementation ?OP.
                            
                    ?OP a era:OperationalPoint;
                        wgs:location [ 
                            geosparql:asWKT ?wkt;
                            wgs:lat ?lat;
                            wgs:long ?long
                        ].
                
                    VALUES ?navAB { era-nv:AB era-nv:Both }
                    VALUES ?navBA { era-nv:BA era-nv:Both }
                
                    {
                        ?nr1 a era:NetRelation;
                            era:elementA ?opne;
                            era:elementB ?nextNe;
                            era:navigability ?navAB.   
                    }
                    UNION
                    {
                        ?nr2 a era:NetRelation;
                            era:elementA ?nextNe;
                            era:elementB ?opne;
                            era:navigability ?navBA.
                    }
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
        },
        (lat1, lon1, lat2, lon2) => {
            // Query for all SoL topology nodes and their connections within given bbox
            return `
                PREFIX era: <http://data.europa.eu/949/>
                PREFIX geosparql: <http://www.opengis.net/ont/geosparql#>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                PREFIX era-nv: <http://data.europa.eu/949/concepts/navigabilities/>
                CONSTRUCT {
                    ?solne era:length ?length;
                            era:lineNationalId ?line;
                            era:partOf ?mesoSOLNe;
                            era:linkedTo ?opne.
                    ?mesoSOLNe era:hasImplementation ?SoL.
                } WHERE {
                    ?opne a era:NetElement;
                            ^era:elementPart [ era:hasImplementation ?OP ].
                    
                    ?OP a era:OperationalPoint;
                        wgs:location [ 
                                wgs:lat ?lat;
                                wgs:long ?long
                        ].
                    
                    ?solne a era:NetElement;
                            era:length ?length;
                            ^era:elementPart ?mesoSOLNe.
                    
                    ?mesoSOLNe era:hasImplementation ?SoL.
                        
                    ?SoL a era:SectionOfLine;
                        era:lineNationalId ?line;
                        era:opStart|era:opEnd ?OP.
                    
                    VALUES ?navAB { era-nv:AB era-nv:Both }
                    VALUES ?navBA { era-nv:BA era-nv:Both }
                    
                    {
                        ?nr1 a era:NetRelation;
                                era:elementA ?solne;
                                era:elementB ?opne;
                                era:navigability ?navAB.
                    }
                    UNION
                    {
                        ?nr2 a era:NetRelation;
                                era:elementA ?opne;
                                era:elementB ?solne;
                                era:navigability ?navBA.
                    }
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
        },
        (lat1, lon1, lat2, lon2) => {
            // Query for SoL topology nodes at the borders of bbox
            return `
            PREFIX era: <http://data.europa.eu/949/>
            PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            PREFIX geosparql: <http://www.opengis.net/ont/geosparql#>
            PREFIX era-nv: <http://data.europa.eu/949/concepts/navigabilities/>
            CONSTRUCT {
                ?solne era:length ?length;
                    era:lineNationalId ?line;
                    era:partOf ?solMesoNe;
                    era:linkedTo ?opne.
                ?opne geosparql:asWKT ?wkt;
                    era:partOf ?outMesoNe.
            } WHERE {        
                ?inOP a era:OperationalPoint;
                    wgs:location [ wgs:lat ?inLat; wgs:long ?inLong ].

                ?outOP era:hasAbstraction ?outMesoNe;
                    wgs:location [
                        wgs:lat ?outLat;
                        wgs:long ?outLong;
                        geosparql:asWKT ?wkt 
                    ].

                ?outMesoNe a era:NetElement;
                        era:elementPart ?opne;
                        era:hasImplementation ?outOP.
                
                ?sol a era:SectionOfLine;
                    era:length ?length;
                    era:lineNationalId ?line;
                    era:hasAbstraction ?solMesoNe;
                    era:opStart|era:opEnd ?inOP;
                    era:opEnd|era:opStart ?outOP.
                
                ?solMesoNe era:elementPart ?solne.
                
                VALUES ?navAB { era-nv:AB era-nv:Both }
                VALUES ?navBA { era-nv:BA era-nv:Both }

                {
                    ?nr1 a era:NetRelation;
                        era:elementA ?solne;
                        era:elementB ?opne;
                        era:navigability ?navAB.
                }
                UNION
                {
                    ?nr2 a era:NetRelation;
                        era:elementA ?opne;
                        era:elementB ?solne;
                        era:navigability ?navBA.
                }
                
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