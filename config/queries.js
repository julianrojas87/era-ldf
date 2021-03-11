/**
 * author: Julián Rojas (julianandres.rojasmelendez@ugent.be)
 * Ghent University - imec - IDLab
 */

export const vocab = {
    '@context': {
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        skos: "http://www.w3.org/2004/02/skos/core#",
        era: "http://era.europa.eu/ns#",
        "era-op-types": "http://era.europa.eu/concepts/op-types#",
        "era-vehicles": "http://era.europa.eu/concepts/vehicles#",
        "era-tds": "http://era.europa.eu/concepts/train-detection#",
        "era-gaugings": "http://era.europa.eu/concepts/gaugings#",
        "era-am": "http://era.europa.eu/concepts/axle-monitoring#",
        "era-ri": "http://era.europa.eu/concepts/rail-inclinations#",
        "era-ess": "http://era.europa.eu/concepts/energy-supply-systems#",
        "era-csm": "http://era.europa.eu/concepts/contact-strip-materials#",
        "era-rsf": "http://era.europa.eu/concepts/rolling-stock-fire#",
        "era-manufacturers": "http://era.europa.eu/concepts/manufacturers#",
        "eu-country": "http://publications.europa.eu/resource/authority/country/",
        "rdfs:subClassOf": { "@type": "@id" },
        "skos:broader": { "@type": "@id" }
    },
    graph: [
        { // Query for vocabulary predicates and needed taxonomies in visualization. Used UNION as it improves the performance 
            accept: 'application/n-triples',
            query: `
                PREFIX owl: <http://www.w3.org/2002/07/owl#>
                PREFIX era: <http://era.europa.eu/ns#>
                PREFIX era-op-types: <http://era.europa.eu/concepts/op-types#>
                PREFIX era-vehicles: <http://era.europa.eu/concepts/vehicles#>
                PREFIX era-manufacturers: <http://era.europa.eu/concepts/manufacturers#>
                PREFIX era-gaugings: <http://era.europa.eu/concepts/gaugings#>
                PREFIX era-tds: <http://era.europa.eu/concepts/train-detection#>
                PREFIX era-am: <http://era.europa.eu/concepts/axle-monitoring#>
                PREFIX era-ri: <http://era.europa.eu/concepts/rail-inclinations#>
                PREFIX era-ess: <http://era.europa.eu/concepts/energy-supply-systems#>
                PREFIX era-csm: <http://era.europa.eu/concepts/contact-strip-materials#>
                PREFIX era-rc: <http://era.europa.eu/concepts/restrictions#>

                CONSTRUCT {
                    ?term ?termp ?termo.
                    ?opt ?optp ?opto.
                    ?vc ?vcp ?vco.
                    ?vsc ?vscp ?vsco.
                    ?mnf ?mnfp ?mnfo.
                    ?gg ?ggp ?ggo.
                    ?tds ?tdsp ?tdso.
                    ?hab ?habp ?habo.
                    ?ri ?rip ?rio.
                    ?ess ?essp ?esso.
                    ?csm ?csmp ?csmo.
                    ?rest ?restp ?resto.
                } WHERE {
                    {   
                        VALUES ?class {owl:ObjectProperty owl:DatatypeProperty}.
                        ?term a ?class;
                            ?termp ?termo.
                    }
                    UNION
                    {
                        ?opt a era-op-types:OperationalPointType;
                            ?optp ?opto.
                    }
                    UNION
                    {
                        ?vc a era-vehicles:Category;
                            ?vcp ?vco.
                    }
                    UNION
                    {
                        ?vsc a era-vehicles:SubCategory;
                            ?vscp ?vsco.
                    }
                    UNION
                    {
                        ?mnf a era-manufacturers:Manufacturer;
                            ?mnfp ?mnfo.
                    }
                    UNION
                    {
                        ?gg a era-gaugings:GaugingProfile;
                            ?ggp ?ggo.
                    }
                    UNION
                    {
                        ?tds a era-tds:TrainDetectionSystem;
                            ?tdsp ?tdso.
                    }
                    UNION
                    {
                        ?hab a era-am:AxleBearingMonitoring;
                            ?habp ?habo.
                    }
                    UNION
                    {
                        ?ri a era-ri:RailInclination;
                            ?rip ?rio.
                    }
                    UNION
                    {
                        ?ess a era-ess:EnergySupplySystem;
                            ?essp ?esso.
                    }
                    UNION
                    {
                        ?csm a era-csm:ContactStripMaterial;
                            ?csmp ?csmo.
                    }
                    UNION
                    {
                        ?rest a era-rc:Restriction;
                            ?restp ?resto.
                    }
                }
           `
        }
    ]
}

export const implementationTiles = {
    '@context': {
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        era: "http://era.europa.eu/ns#",
        wgs: "http://www.w3.org/2003/01/geo/wgs84_pos#",
        geosparql: "http://www.opengis.net/ont/geosparql#",
        tiles: "https://w3id.org/tree/terms#",
        hydra: "http://www.w3.org/ns/hydra/core#",
        dcterms: "http://purl.org/dc/terms/",
        "era-op-types": "http://era.europa.eu/concepts/op-types#",
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
        { // Query for all operational points and their location in given bbox
            accept: 'application/n-triples',
            query: (lat1, lon1, lat2, lon2) => {
                return `
                PREFIX era: <http://era.europa.eu/ns#>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?mnto ?mntop ?mntoo.
                    ?l ?lp ?lo.
                } WHERE {
                    ?mnto a era:OperationalPoint;
                        wgs:location ?l;
                        ?mntop ?mntoo.
                    
                    ?l wgs:lat ?lat;
                        wgs:long ?long;
                        ?lp ?lo.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
            }
        },
        { // Query for all tracks in given bbox
            accept: 'application/n-triples',
            query: (lat1, lon1, lat2, lon2) => {
                return `
                PREFIX era: <http://era.europa.eu/ns#>
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                CONSTRUCT {
                    ?tr ?trp ?tro.
                } WHERE {
                    ?np wgs:lat ?lat;
                        wgs:long ?long.
                    
                    ?link a era:MicroLink;
                        era:startPort ?np;
                        era:hasImplementation ?tr.
                    
                    ?tr ?trp ?tro.
                    
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
        era: "http://era.europa.eu/ns#",
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
        { // Query for all node ports in given bbox
            accept: 'application/n-triples',
            query: (lat1, lon1, lat2, lon2) => {
                return `
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                PREFIX era: <http://era.europa.eu/ns#>
                CONSTRUCT {
                    ?np ?npp ?npo.
                    ?mna ?mnap ?mnao.
                } WHERE {
                    ?np era:belongsToNode ?mna;
                        wgs:lat ?lat;
                        wgs:long ?long;
                        ?npp ?npo.
                    
                    ?mna ?mnap ?mnao.
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
            }
        },
        { // Query for all departing micro links and internal links in given bbox
            accept: 'application/n-triples',
            query: (lat1, lon1, lat2, lon2) => {
                return `
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                PREFIX era: <http://era.europa.eu/ns#>
                CONSTRUCT {
                    ?startLink ?startLinkp ?startLinko.
                    ?enp ?enpp ?enpo.
                } WHERE {
                    ?startLink era:startPort ?np;
                        era:endPort ?enp;
                        ?startLinkp ?startLinko.
                    ?enp ?enpp ?enpo.

                    ?np wgs:lat ?lat;
                        wgs:long ?long.
                    
                    
                    FILTER(?long >= ${lon1} && ?long <= ${lon2})
                    FILTER(?lat <= ${lat1} && ?lat >= ${lat2})
                }
            `;
            }
        },
        {   // Query to get related incoming micro links that are bidirectional 
            accept: 'application/n-triples',
            query: (lat1, lon1, lat2, lon2) => {
                return `
                PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
                PREFIX era: <http://era.europa.eu/ns#>
                CONSTRUCT {
                    ?mna ?mnap ?mnao.
                    ?endLink ?endLinkp ?endLinko.
                    ?stp ?stpp ?stpo.
                } WHERE {
                    ?np era:belongsToNode ?mna;
                        wgs:lat ?lat;
                        wgs:long ?long.
                        
                    ?mna ?mnap ?mnao.

                    ?endLink era:endPort ?np;
                        era:bidirectional "true"^^xsd:boolean;
                        era:startPort ?stp;
                        ?endLinkp ?endLinko.
                
                    ?stp ?stpp ?stpo.

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
        era: "http://era.europa.eu/ns#",
        "era-vehicles": "http://era.europa.eu/concepts/vehicles#",
        "era-tds": "http://era.europa.eu/concepts/train-detection#",
        "era-gaugings": "http://era.europa.eu/concepts/gaugings#",
        "era-rs-fire": "http://era.europa.eu/concepts/rs-fire#",
        "era-manufacturers": "http://era.europa.eu/concepts/manufacturers#",
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
        PREFIX era: <http://era.europa.eu/ns#>
        CONSTRUCT WHERE {
            ?s a era:VehicleType;
                ?p ?o.
        }
        `
    }
};

export const vehicleInstances = {
    '@context': {
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        era: "http://era.europa.eu/ns#",
        "era-vehicles": "http://era.europa.eu/concepts/vehicles#"
    },
    graph: { // Query for all vehicle types
        accept: 'text/turtle',
        query: `
        PREFIX era: <http://era.europa.eu/ns#>
        CONSTRUCT {
            <http://era.europa.eu/implementation#V_238029424542> ?p1 ?o1.
            <http://era.europa.eu/implementation#V_278043638529> ?p2 ?o2.
            ?s a era:Vehicle;
                era:vehicleNumber ?vn;
                era:vehicleSeries ?vs;
                era:vehicleType ?vt;
                era:operationalRestriction ?or;
                era:quieterRoutesExemptedCountry ?ec.
        } WHERE {
            { <http://era.europa.eu/implementation#V_238029424542> ?p1 ?o1 }
            UNION
            { <http://era.europa.eu/implementation#V_278043638529> ?p2 ?o2 }
            UNION
            {
                ?s a era:Vehicle;
                    era:vehicleNumber ?vn;
                    era:vehicleSeries ?vs;
                    era:vehicleType ?vt.
                OPTIONAL { ?s era:operationalRestriction ?or }
                OPTIONAL { ?s era:quieterRoutesExemptedCountry ?ec }   
            }
        }
        `
    }
};