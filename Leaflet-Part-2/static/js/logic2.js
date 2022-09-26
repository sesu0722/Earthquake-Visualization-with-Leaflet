//Leaflet-Part-2

function createMap(tectonicPlates,earthquakes)
{
// Create the tile layer that will be the background of our map.
var streetmap= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// grayscale layer
var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});
// water color layer
var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
});


// Create a baseMaps object to hold the streetmap layer.
var baseMaps = {
    "Street Map": streetmap,
    "Grayscale Map": grayscale,
    "Watercolor Map": waterColor
  };
// Create an overlayMaps object to hold the layers.
var overlayMaps = {
    "Tectonic Plates": tectonicPlates,
    "Earthquakes": earthquakes
  };
// Create the map object with options.
var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, tectonicPlates, earthquakes]
  });

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

// make a variable for the legend and position it
var legend = L.control({position: "bottomright"});
legend.onAdd = function () 
{
var div =L.DomUtil.create("div", "legend");    
var intervals =[-10,10,30,50,70,90]
var colors = ["#15f061","#85c50d","#ffff00","#ffbf00","#ff6a00","#ff0000"]

div.innerHTML += "<h4>Depth of <br> the Earthquake</h4>";
     // add the properties for the legend 
     for (var i=0; i<intervals.length; i++)
     { 
        div.innerHTML += "<i style='background:" +colors[i]+ "'></i>"+
         + intervals[i]
         + (intervals[i+1]? "&ndash;"+intervals[i+1]+"<br>":"+");
         
     }
     return div; 
}       
legend.addTo(map);
}


var tectonicPlates=new L.layerGroup(tectonicPlates)
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
  .then(function(data){
    console.log(data)
    L.geoJson(data).addTo(tectonicPlates);
  })

var queryurl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
d3.json(queryurl).then(function(data){
    //console.log(data);
    createMarkers(data.features);
});

  function createMarkers(earthquakedata){
    //function onEachFeature(feature, layer) 
    //{
       // layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
        //<br>Magnitude <b>${feature.properties.mag}</b>`); 
    //};
   // L.geoJSON(earthquakedata, {onEachFeature:onEachFeature});
    
    
    console.log(earthquakedata)
 
    var earthquakeMarker=[];
    for (var i=0; i< earthquakedata.length; i++)
   {
      var color
      if (earthquakedata[i].geometry.coordinates[2]>90)
          color = "#ff0000";
      else if(earthquakedata[i].geometry.coordinates[2]>70)
          color = "#ff6a00";
      else if (earthquakedata[i].geometry.coordinates[2]>50)
          color="#ffbf00";
      else if(earthquakedata[i].geometry.coordinates[2]>30)
          color ="#ffff00";
      else if(earthquakedata[i].geometry.coordinates[2]>10)
          color = "#85c50d";
      else
          color= "#15f061";
      
      var size= earthquakedata[i].properties.mag*18000
      
      
      // add circle to the map

     
      var earthquakes = L.circle([earthquakedata[i].geometry.coordinates[1],earthquakedata[i].geometry.coordinates[0]],
          {
              fillOpacity:.50,
              color: "black",
              fillColor: color,
              // adjust the radius.
              radius: size, 
              weight: .2
          }
          ).bindPopup(`<h3>${earthquakedata[i].properties.place}</h3><hr><p>${new Date(earthquakedata[i].properties.time)}</p>
          <br>Magnitude <b>${earthquakedata[i].properties.mag}</b>`)
          
          earthquakeMarker.push(earthquakes)
    };
   
    
    var earthquakelayer=new L.layerGroup(earthquakeMarker)
    createMap(tectonicPlates,earthquakelayer)
  };
  









