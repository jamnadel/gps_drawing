'use strict'

console.log('Loaded map.js')

mapboxgl.accessToken = 'pk.eyJ1IjoiamFtbmFkZWwiLCJhIjoiY2s4NmdpMW93MGhicjNscnEyNTVzNDQzbCJ9.duijjHslyNDxEtAfMBvh-w'

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jamnadel/ck8f57b281lib1iqpqx0qmkn9',
    center: [-73.96216,40.80779],
    zoom: 16
})

let navigation = new mapboxgl.NavigationControl({
    showCompass: false
})
map.addControl(navigation, 'top-left')

let scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
})
map.addControl(scale, 'bottom-right')

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    fitBoundsOptions: {
    }
})
map.addControl(geolocate, 'top-left')

geolocate.on('geolocate', function(event) {

})

let current_location = [-73.96216, 40.80779]

geolocate.on('geolocate', function(event) {
    current_location = [event.coords.longitude, event.coords.latitude]
    console.log('geolocated', current_location)   

    if (active) {
        path.push(current_loaction)
        map.getSource('drawing').setData(geojson)
    }
})

map.on('click', function(event) {
    current_location = [event.lngLat.lng, event.lngLat.lat]
    console.log('clicked', current_location)   

    if (active) {
        path.push(current_location)
        console.log(path)
        map.getSource('drawing').setData(geojson) 
    }     
})

let draw_btn = document.getElementById('draw_btn')

draw_btn.addEventListener('click', function() {

    console.log('clicked draw_btn')

    if (active) {
        stopDrawing()
    } else {
        startDrawing()
    }

})

let active = false 
let start_marker = new mapboxgl.Marker()

let path = []

function startDrawing() {

    active = true

    start_marker.setLngLat(current_location)
    start_marker.addTo(map)

    draw_btn.style['background-color'] = "red"
    draw_btn.style['color'] = "white"
    draw_btn.value = 'Stop and save'

    path.push(current_location)

    geojson.features.push({
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": path 
        }
    })
    map.getSource('drawing').setData(geojson)
}

function stopDrawing() { 

    active = false 

    draw_btn.style['background-color'] = "white"
    draw_btn.style['color'] = "black"
    draw_btn.value = 'Start'
}

map.on('load', function() {
     map.addLayer({ 
        'id': 'drawing',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': null
        },
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#50C3DF',
            'line-width': 5,
            'line-opacity': .8
        }
    })
})

let geojson = {
    "type": "FeatureCollection",
    "features": []
}

