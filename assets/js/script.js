// Initialize and add the map
function initMap() {
    // Predefined Locations
    const locations = {
        westMidlands: { lat: 52.4751, lng: -1.8298 },
        london: { lat: 51.507359, lng: -0.136439},
        birmingham: { lat: 52.489471, lng: -1.898575},
        nottingham: { lat: 52.950001, lng: -1.150000},
        sheffield: { lat: 53.383331, lng: -1.466667},
        manchester: { lat: 53.478062, lng: -2.244644},
        liverpool: { lat: 53.400002, lng: -2.983333},
        leicester: { lat: 52.6333310, lng: -1.133333},
    }

    // The location of West Midlands
    const westMidlands = locations.westMidlands;

    // Map styles - turn off Points of Interest
    var mapStyles = [
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

    const service = new google.maps.places.PlacesService(map);

    const searchTextElement = document.getElementById('search-text');
    const searchFormElement = document.getElementById('search-form');
    const myRestaurantsElement = document.getElementById('my-restaurants');
    const locationButtonElements = document.querySelectorAll('.location-btn');

    // Create an info window to show information in after clicking a marker
    const infoWindow = new google.maps.InfoWindow();

    function showMyRestaurants() {
        myRestaurantsElement.innerHTML=""
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("my-restaurants-")) {
                const restaurant = JSON.parse(localStorage.getItem(key));
                const restaurantElement = document.createElement('div');
                restaurantElement.innerHTML = restaurant.name;
                myRestaurantsElement.appendChild(restaurantElement);
            }
          }
    }

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
              map.setZoom(13);
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
                    // console.log(result);

                    if (results[i].rating >= 4) {
                        const marker = new google.maps.Marker({
                            position: result.geometry.location,
                            map: map,
                            title: result.name
                        });

                        marker.addListener('click', function() {
                            const contentElement = document.createElement('div');
                            contentElement.innerHTML = `
                                <h4>${result.name}</h4>
                                <p>
                                  <strong>Rating:</strong> ${result.rating}
                                </p>
                                <button class="save-restaurant">Add to My Restaurants</button>
                            `;

                            const saveRestaurantElement = contentElement.querySelector('.save-restaurant');

                            saveRestaurantElement.addEventListener('click', function(event) {
                                console.log('Save restaurant button clicked');

                                // Save restaurant to local storage
                                const key = `my-restaurants-${result.place_id}`;

                                console.log('Looking in local storage for ', key);
                                const existingItem = window.localStorage.getItem(key);
                                console.log('Existing item', existingItem);

                                if (!existingItem) {
                                    window.localStorage.setItem(key, JSON.stringify(result));
                                    showMyRestaurants();
                                }
                            });

                            //const content = result.name + " - " + result.rating;
                            infoWindow.setContent(contentElement);
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

    showMyRestaurants();

    for (var i=0; i<locationButtonElements.length; i++) {
        let locationButtonElement = locationButtonElements[i];
        locationButtonElement.addEventListener('click', function(event) {
            const locationId = event.target.getAttribute("id");
            const location = locations[locationId];
            map.setCenter(location);
            map.setZoom(13);
        });
    }
}

window.initMap = initMap;