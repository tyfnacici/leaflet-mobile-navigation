const map = L.map("map").setView([39.57, 32.53], 6)
const osm = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map)
const icon = L.icon({
  iconUrl: "./man.svg",
  iconSize: [30, 30],
})

const matchedInstructions = []
var output
var marker, circle
var navigation = false

setInterval(() => {
  navigator.geolocation.getCurrentPosition(getPosition)
}, 2000)

function calcCrow(lat1, lon1, lat2, lon2) 
    {
      // var R = 7076; // km
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d * 1000;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

const getPosition = (position) => {
  var lat = position.coords.latitude
  var long = position.coords.longitude

  if (marker) {
    map.removeLayer(marker)
  }

  if (circle) {
    map.removeLayer(circle)
  }

  marker = L.marker([lat, long], { icon: icon })

  var featureGroup = L.featureGroup([marker]).addTo(map)

  if (!navigation) {
    navigation = true

    L.Routing.control({
      waypoints: [
        L.latLng(lat, long),
        L.latLng(40.703554489718584, 29.889390739873413),
      ],
      router: new L.Routing.graphHopper("b6e9a11d-407c-4109-9722-06ce7d2012d4"),
      autoRoute: true,
      showAlternatives: false,
      collapsible: true,
      show: false,
      routeWhileDragging: false
    })
      .on("routesfound", (e) => {
        output = e.routes[0].coordinates
        console.log(e.routes[0])
      })
      .addTo(map)
  }

  // map.fitBounds(featureGroup.getBounds()) bu komut bizi ekranın merkezine alıyor
}

// alert(calcCrow(59.3293371,13.4877472,59.3225525,13.4619422).toFixed(1));

