// Define the style for restricted areas
var AreaStyle = {
    color: "#FFA500", // Orange color that does not change
    fillOpacity: 0.6
};

// Adding restricted area layer with provided coordinates
var Area = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [75.9151821, 11.68917586],
                    [75.91821435, 11.69038761],
                    [75.92000000, 11.69250000],
                    [75.91700000, 11.69350000],
                    [75.9151821, 11.68917586]
                ]]
            },
            "properties": {
                "name": "Restricted Area"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [75.9205000, 11.6950000],
                    [75.9220000, 11.6965000],
                    [75.9235000, 11.6955000],
                    [75.9220000, 11.6940000],
                    [75.9205000, 11.6950000]
                ]]
            },
            "properties": {
                "name": "Restricted Area 2"
            }
        }
    ]
};

// Add restricted area to layer control
var areaLayer = L.geoJSON(Area, {
    style: AreaStyle
});


