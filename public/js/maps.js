/* global google */

var mapModule = (function(){

  var currentMap,
      currentMarkers = [],
      currentBounds = new google.maps.LatLngBounds(),
      iconPath = {
        hotel: '/images/lodging_0star.png',
        restaurant: '/images/restaurant.png',
        activity: '/images/star-3.png'
      },
      fullstackCampus = new google.maps.LatLng(40.705086, -74.009151);

  function initializeMap (options) {
    var mapCanvas = document.getElementById('map-canvas');
    currentMap = new google.maps.Map(mapCanvas, options);
  }

  // build and attach to DOM when ready
  // $(func) is a convenience method for $(document).ready(func)

  $(function(){
    initializeMap({
      center: fullstackCampus,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      // styles: styleArr
    });
  });

  // private module functions

  function extendBounds (marker) {
    currentBounds.extend(marker.position);
    currentMap.fitBounds(currentBounds);
  }

  // accessible module methods

  var methods = {

    drawAttraction: function (attraction) {
      var coords = attraction.place[0].location,
          options = {
            icon: iconPath[attraction.type],
            position: new google.maps.LatLng(coords[0], coords[1]),
            map: currentMap,
            animation: google.maps.Animation.DROP
          },
          marker = new google.maps.Marker(options);
      currentMarkers.push(marker);
      extendBounds(marker);
      return marker;
    },

    removeMarker: function (marker) {
      marker.setMap(null);
    }

  };

  // we return this object from the IIFE and store it on the global scope
  // that way we can use `drawAttraction` elsewhere

  return methods;

}());



// var styleArr = [{
//     featureType: 'landscape',
//     stylers: [{ saturation: -100 }, { lightness: 60 }]
//   }, {
//     featureType: 'road.local',
//     stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
//   }, {
//     featureType: 'transit',
//     stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
//   }, {
//     featureType: 'administrative.province',
//     stylers: [{ visibility: 'off' }]
//   }, {
//     featureType: 'water',
//     stylers: [{ visibility: 'on' }, { lightness: 30 }]
//   }, {
//     featureType: 'road.highway',
//     elementType: 'geometry.fill',
//     stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
//   }, {
//     featureType: 'road.highway',
//     elementType: 'geometry.stroke',
//     stylers: [{ visibility: 'off' }]
//   }, {
//     featureType: 'poi.park',
//     elementType: 'geometry.fill',
//     stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
//   }];
