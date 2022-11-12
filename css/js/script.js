
// Initialize and add the map
function initMap() {
    // The location of West Midlands
    const westMidlands = { lat: 52.4751, lng: -1.8298 };

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

    // The map, centered over the West Midlands
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 9,
      center: westMidlands,
      styles: mapStyles
    });

    // The marker, positioned at the center of the West Midlands
    const marker = new google.maps.Marker({
      position: westMidlands,
      map: map,
    });

    const service = new google.maps.places.PlacesService(map);

    const searchTextElement = document.getElementById('search-text');
    const searchFormElement = document.getElementById('search-form');

    // Create an info window to show information in after clicking a marker
    const infoWindow = new google.maps.InfoWindow();

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
              map.setZoom(14);
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
                    let result = results[i];
                    console.log(result);

                    if (results[i].rating >= 4) {
                        const marker = new google.maps.Marker({
                            position: result.geometry.location,
                            map: map,
                            title: result.name
                        });

                        marker.addListener('click', function() {
                            const content = result.name + " - " + result.rating;
                            infoWindow.setContent(content);
                            infoWindow.open({
                              anchor: marker,
                              map,
                            });
                        });
                    }
                }
            }
        });
    }

    map.addListener('center_changed', centerChangedHandler);

    searchFormElement.addEventListener('submit', searchHandler);
}

window.initMap = initMap;