// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">
let map, heatmap;

function initMap() {
  var latLon = {lat: -9.271064, lng: -75.98777};

  map = new google.maps.Map(document.getElementById("map"), {
    mapTypeId: "satellite",
  });
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map,
  });

  /* Si el navegador tiene geolocalizacion */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
          latLon.lat = position.coords.latitude; /*Guardamos nuestra latitud*/
          latLon.lng = position.coords.longitude; /*Guardamos nuestra longitud*/
        }
        ,function() {
          handleLocationError('Error: The Geolocation service failed.');
        });
  }else{
    // Browser doesn't support Geolocation
    handleLocationError('Error: Your browser doesn\'t support geolocation.');
  }
  map.setCenter(latLon);
  map.setZoom(6);
  ActualizaMap();
}

function handleLocationError(error) {
  //alert(error);
  return;
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)",
  ];
  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function ActualizaMap() {
  let positions = []
  $.get( "https://arcadioenciso.github.io/HeadMap/data.json", function(data) {
    for(let i=0; i < data.data.length; i++){
      positions.push(new google.maps.LatLng(data.data[i].Latitud, data.data[i].Longitud))
    }
    heatmap.setData(new google.maps.MVCArray(positions));
  })
      .done(function() {
        // alert( "second success" );
      })
      .fail(function() {
        // alert( "error" );
      })
      .always(function() {
        // alert( "finished" );
      });
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
  return [
    new google.maps.LatLng(37.782551, -122.445368),
    new google.maps.LatLng(37.782745, -122.444586),
    new google.maps.LatLng(37.782842, -122.443688),
    new google.maps.LatLng(37.782919, -122.442815),
    new google.maps.LatLng(37.782992, -122.442112),
    new google.maps.LatLng(37.7831, -122.441461),
    new google.maps.LatLng(37.783206, -122.440829),
    new google.maps.LatLng(37.783273, -122.440324),
    new google.maps.LatLng(37.783316, -122.440023),
    new google.maps.LatLng(37.783357, -122.439794),
    new google.maps.LatLng(37.783371, -122.439687),
    new google.maps.LatLng(37.783368, -122.439666),
    new google.maps.LatLng(37.783383, -122.439594),
    new google.maps.LatLng(37.783508, -122.439525),
    new google.maps.LatLng(37.783842, -122.439591),
    new google.maps.LatLng(37.784147, -122.439668),
    new google.maps.LatLng(37.784206, -122.439686),
    new google.maps.LatLng(37.784386, -122.43979),
    new google.maps.LatLng(37.784701, -122.439902),
    new google.maps.LatLng(37.753837, -122.403172),
    new google.maps.LatLng(37.752986, -122.403112),
    new google.maps.LatLng(37.751266, -122.403355),
  ];
}
