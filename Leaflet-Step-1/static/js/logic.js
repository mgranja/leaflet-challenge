// store geoJSON
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Perform a GET request to the query URL
d3.json(link).then((data)=> {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features);
});


function createMap(earthquakes) {
  // Define base layer
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
  });

  //Define dark layer
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold base layers
  var baseMaps =
    {  
    "Light": lightmap,
    "Dark": darkmap
    };

  // Create overlay object to hold overlay layer
  var overlayMaps =
    {
    Earthquakes: earthquakes
    };

  // Create map
  var myMap = L.map("map", {
    center: [37.6207251, -119.4836838],
    zoom: 5,
    layers: [lightmap, earthquakes]
    });
    
    L.control.layers(baseMaps, overlayMaps,{
      collapsed: false
    }).addTo(myMap);
  
  // Create function to set color based on earthquake mag

  function getColor(d) {
    return d > 5 ? '#f06b6b' :
      d >= 4 ? '#f0a76b' :
        d >= 3 ? '#f3ba4e' :
          d >= 2 ? '#f3db4c' :
            d >= 1 ? '#e1f34c' :
              '#b7f34d';
  }

  // Add legend information
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function(myMap) {
    const div = L.DomUtil.create('div', 'info legend');
    const magnitudes = [0, 1, 2, 3, 4, 5];
    const labels = [];

    //Create a loop 
    for (var i = 0; i < magnitudes.length; i++) 
    {
      div.innerHTML +=
      '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' 
      + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
      
    }
    return div;
  };
  legend.addTo(myMap);

}


function createFeatures(edata) {
  function onEachFeature(feature, layer) {
    layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Magnitude: ' + feature.properties.mag + '</h4>')
  }
  const eqlayer  = L.geoJSON(edata, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      let radius = feature.properties.mag * 4.5;
        if (feature.properties.mag > 5) {
          fillcolor = '#f06b6b';}
          else if (feature.properties.mag >= 4) {
            fillcolor = '#f0a76b';
          }
          else if (feature.properties.mag >= 3) {
            fillcolor = '#f3ba4e';
          }
          else if (feature.properties.mag >= 2) {
            fillcolor = '#f3db4c';
          }
          else if (feature.properties.mag >= 1) {
            fillcolor = '#e1f34c';
          }
          else  fillcolor = '#b7f34d';
          return L.circleMarker(latlng, {
            radius: radius,
            color: '#00000',
            fillColor: fillcolor,
            fillOpacity: 1,
            weight: 1
          });
        }
      });
      createMap(eqlayer);
}




