// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">
let map, heatmap;
let infowindow    = null;
let markerCluster = null;

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

  infowindow = new google.maps.InfoWindow({
    maxWidth: 400
  });

  google.maps.event.addListener(map,"click", function(event){
    if (infowindow){
      infowindow.close();
    }
  });

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
let positions = []
let ids = []
let puestos = []

function ActualizaMap() {

  $.get( "https://arcadioenciso.github.io/HeadMap/data.json", function(data) {
    puestos = data.data
    for(let i=0; i < puestos.length; i++){
      positions.push(new google.maps.LatLng(data.data[i].Latitud, data.data[i].Longitud))
      ids.push(data.data[i].IdEstablecimiento)
    }

    addmarkers(ids, positions)
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
    new google.maps.LatLng(-9.271064, -75.98777),
  ];
}

function agregarMarcadores(arrayHotelesMapa) {

  if (arrayHotelesMapa) {
    addmarkers(arrayHotelesMapa.id,arrayHotelesMapa.location);
  }

}

//AGREGAR EVENTO CLICK AL MARCADOR
function addmarkers(id,locations){
  // Limpiar todas las marcas
  if (markerCluster) {
    markerCluster.clearMarkers();
  }

  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "locations" array.
  // The map() method here has nothing to do with the Google Maps API.
  var markers = locations.map(function(location, i) {
    var marca = new google.maps.Marker({ position : location, id : id[i] });
    google.maps.event.addListener(marca, 'click', function(){clickMark(marca);});
    return marca;
  });

  var imagenCluster = {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'};

  // Add a marker clusterer to manage the markers.
  markerCluster = new MarkerClusterer(map,markers,imagenCluster);
}

function clickMark(marca){
  const data = puestos.find( puesto => puesto.IdEstablecimiento === marca.id );
      infowindow.setContent(htmlWindow(data));
      infowindow.open(map, marca);
}

function htmlWindow(data){
  return  ('<head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/></head><body><div id="content">'+
      '<div id="siteNotice"><h3> <a href="/hotel/' + data.IdEstablecimiento +'"" target="_blank">' + data.EstNombre + '</a></h3></div>'+
      '<h5 id="firstHeading" class="firstHeading">Meta: ' + data.Meta + ' vacunados '+ data.VacunadosPorcentaje + '%</h5>'+
      '<h5 id="firstHeading" class="firstHeading">Stock: ' + data.Stock + '</h5>'+
      '<h5 id="firstHeading" class="firstHeading">Avance: ' + data.Avance + '</h5>'+
      '<h5 id="firstHeading" class="firstHeading">Dirección:' + data.Direccion + '</h5>'+
      '<div id="bodyContent">'+
      ((data.precioDesde)?('Precio desde:' + data.precioDesde):('')+'<br>') +
      ((data.nroTelefono)?('Teléfono:'     + data.nroTelefono):('')) +
      '<hr>' +
      '<p><h3><b><a href="#"> Incidencia </a></b></h3> '+
      '</div>'+
      '</div>' +
      '<form action="#" method="post">\n' +
      'DNI:<br><input type="text" value="12345678"><br>' +
      'Tipo de incidencia:<br><select name="select">\n' +
      '  <option value="value1" selected>Se acabaron las vacunas</option>\n' +
      '  <option value="value2">Robo al punto de vacunación</option>\n' +
      '  <option value="value3">Centro de salud cerrado</option>\n' +
      '  <option value="value1">Centro de salud no existe (La dirección no es correcta)</option>\n' +
      '  <option value="value2">Mala minupulación</option>\n' +
      '  <option value="value3">Aglomeración en el puesto de vaunación</option>\n' +
      '  <option value="value2">No hay resguardo/Control en el punto de vigilación</option>\n' +
      '  <option value="value3">Materiales incompletos</option>\n' +
      '</select>'+
      'Incidencia:<br><textarea>\n' +
      '</textarea><br>' +
      '<li class="button">\n' +
      '  <button type="submit">Envíe su mensaje</button>\n' +
      '</li>'+
      '</form>' +
      '<body>');
}
