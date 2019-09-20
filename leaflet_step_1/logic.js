const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place
    + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
    "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  const earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        var markers = {
          radius: 6 * feature.properties.mag,
          fillColor: getColor(feature.properties.mag),
          color: "lightgrey",
          weight: 1,
          fillOpacity: 0.75
        };
        return L.circleMarker(latlng, markers)
      }
  });
  function getColor(color) {
    return color <= 2.5 ? "lightyellow" :
        color <= 3.5 ? "yellow" :
        color <= 4.5 ? "orange" :
        color <= 5.5 ? "orangered" : 
        color <= 6.5 ? "darkred" : "scarlet";
  }

  createMap(earthquakes);
}


function createMap(earthquakes) {

  const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  const satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  const baseMaps = {
    "Outdoor Map": streetmap,
    "Light Map": lightmap,
    "Satellite Map": satellitemap
  };

  const overlayMaps = {
    Earthquakes: earthquakes
  };

  const myMap = L.map("map", {
    center: [
      38, -105
    ],
    zoom: 4.5,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  function getColor(color) {
    return color <= 2.5 ? 
        "lightyellow" :
        color <= 3.5 ? 
        "yellow" :
        color <= 4.5 ? 
        "orange" :
        color <= 5.5 ? 
        "orangered" : 'darkred' ;
  }

  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [2.5,3.5,4.5,5.5,6.5],
          labels = [];
  
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + 
              getColor(grades[i]) + 
              '"></i> ' +
              grades[i] + 
              (grades[i + 1] ? '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
}