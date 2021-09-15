/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const implementationTiles = [
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
];

export const abstractionTiles = [
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
];

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