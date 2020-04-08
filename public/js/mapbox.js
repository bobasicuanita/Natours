/* eslint-disable */

export const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiYm9iYXNpY3Vhbml0YSIsImEiOiJjazhsbjFtN3kwMTJtM2VtZGZycmRncHo2In0.Ok-w8ga810FfKvSP4CCxzA';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/bobasicuanita/ck8lofrjj0v1d1iodtexrkels',
        scrollZoom: false
        // center: [-118.105557, 34.104282],
        // zoom: 4,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create MArker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
