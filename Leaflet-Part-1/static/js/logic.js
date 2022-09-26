//Leaflet-Part-1
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var queryurl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
d3.json(queryurl).then(function(data){
    console.log(data);
    createFeatures(data.features);
});

  function createFeatures(earthquakedata){
    //function onEachFeature(feature, layer) 
    //{
       // layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
        //<br>Magnitude <b>${feature.properties.mag}</b>`); 
    //};
   // L.geoJSON(earthquakedata, {onEachFeature:onEachFeature});
    
    
    console.log(earthquakedata)
 
    
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


      L.circle([earthquakedata[i].geometry.coordinates[1],earthquakedata[i].geometry.coordinates[0]],
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
          .addTo(myMap)
      
    };


  };
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
    
     //legend.onAdd = function () { 
        //var div = L.DomUtil.create("div", "legend");
        
        //div.innerHTML += "<h4>Depth of the Earthquake</h4>";
        
        //div.innerHTML += '<i style="background: #15f061"></i><span><10</span><br>';
        //div.innerHTML += '<i style="background: #85c50d"></i><span>10-30</span><br>';
        //div.innerHTML += '<i style="background: #ffff00"></i><span>30-50</span><br>';
        //div.innerHTML += '<i style="background: #ffbf00"></i><span>50-70</span><br>';
        //div.innerHTML += '<i style="background: #ff6a00"></i><span>70-90</span><br>';
        //div.innerHTML += '<i style="background: #ff0000"></i><span>90+</span><br>';
       // return div;
     //};
legend.addTo(myMap);


