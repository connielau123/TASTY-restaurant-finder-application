
// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.031 };

    // Map styles - turn off Points of Interest
    var mapStyles =[
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                  { visibility: "off" }
            ]
        }
    ];

    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: uluru,
      styles: mapStyles
    });

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });

    const service = new google.maps.places.PlacesService(map);

    const searchTextElement = document.getElementById('search-text');
    const searchFormElement = document.getElementById('search-form');

    function searchHandler(event) {
        event.preventDefault();

        // Get the place to search for
        const searchText = searchTextElement.value;
        console.log(searchText);

        var request = {
            query: searchText,
            fields: ['name', 'geometry'],
        };

        // Make a request to Google Places API for location
        service.findPlaceFromQuery(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              map.setCenter(results[0].geometry.location);
            }
        });
    }

    function centerChangedHandler() {
        console.log('Map Center changed')
        const request = {
            bounds: map.getBounds(),
            type: ['restaurant']
        }

        service.nearbySearch(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i=0; i<results.length; i++) {
                    console.log(results[i]);

                    const infoWindow = new google.maps.InfoWindow({
                        content: results[i].name,
                    });

                    const marker = new google.maps.Marker({
                        position: results[i].geometry.location,
                        map: map,
                        title: results[i].name
                    });

                    marker.addListener('click', function() {
                        infoWindow.open({
                          anchor: marker,
                          map,
                        });
                    });
                }
            }
        });
    }

    map.addListener('center_changed', centerChangedHandler);

    searchFormElement.addEventListener('submit', searchHandler);
}

window.initMap = initMap;