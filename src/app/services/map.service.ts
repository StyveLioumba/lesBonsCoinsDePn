import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  position: any = {
    lat: -4.793305195547416,
    lng: 11.859117477938655
  }
  zoom = 12

  constructor() {
    mapboxgl!.accessToken = environment.mapbox.accessToken;
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      this.position.lat = position.coords.latitude
      this.position.lng = position.coords.longitude

      console.log(this.addMarker(this.position));
    })
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.position.lng, this.position.lat]
    })

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );
  }

  geoloacilised() {
    console.log("hello");
  }

  addMarker(position: any, color: string = "#0ea5e9", isDraggable: boolean = false): any {

    const marker = new mapboxgl.Marker({
      color: color,
      draggable: isDraggable
    }).setLngLat([position.lng, position.lat])
      .addTo(this.map!);
    
    return marker
  }

  removeMarker(marker: any) {
    // Store the marker's longitude and latitude coordinates in a variable
    const lngLat = marker.getLngLat();
    // Print the marker's longitude and latitude values in the console
    console.log(`Longitude: ${lngLat.lng}, Latitude: ${lngLat.lat}`);
  }


}
