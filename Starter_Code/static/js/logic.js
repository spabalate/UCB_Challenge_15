// Function to determine color based on depth
function getColor(depth) {
    if (depth < 10) {
      return "rgb(182, 244, 76)";
    } else if (depth < 30) {
      return "rgb(225, 243, 79)";
    } else if (depth < 50) {
      return "rgb(242, 220, 76)";
    } else if (depth < 70) {
      return "rgb(243, 186, 76)";
    } else if (depth < 90) {
      return "rgb(239, 167, 106)";
    } else {
      return "rgb(237, 106, 106)";
    }
  }
  
  // Initialize the Leaflet map
  var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  
  // Add the tile layer (you can use any tile layer you prefer)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);
  
  // Fetch earthquake data using Fetch API
  fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(response => response.json())
    .then(data => handleEarthquakeData(data))
    .catch(error => console.error("Error fetching earthquake data:", error));
  
  // Function to handle earthquake data
  function handleEarthquakeData(data) {
    try {
      // Create a legend
      var legend = L.control({ position: "bottomright" });
  
      legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend"),
          grades = [-10, 10, 30, 50, 70, 90],
          labels = [];
  
        // Loop through depth ranges and generate a label with a colored square for each range
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<div style="background:' + getColor(grades[i] + 1) + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></div> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
  
        return div;
      };
  
      legend.addTo(myMap);
  
      // Loop through the features in the GeoJSON data
      data.features.forEach(function (earthquake) {
        var magnitude = earthquake.properties.mag;
        var depth = earthquake.geometry.coordinates[2]; // Depth is the third coordinate
  
        // Log the magnitude and depth to the console
        console.log("Magnitude:", magnitude, "Depth:", depth);
  
        // Create a circle marker with a radius based on the magnitude
        // and color based on the depth
        var circle = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
          color: "black", // Set border color to black
          fillColor: getColor(depth),
          fillOpacity: 0.7,
          radius: magnitude * 20000, // Adjust the factor for better visualization
          weight: .5, // Adjust the border thickness
        }).addTo(myMap);
  
        // Add a popup with additional information
        circle.bindPopup(`<strong>Location:</strong> ${earthquake.properties.place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);
      });
  
      console.log("Markers added successfully");
    } catch (error) {
      console.error("Error adding markers:", error);
    }
  }
  
 