import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import * as mapboxgl from 'mapbox-gl';
import { Place } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  position: any = {
    lat: -4.793305195547416,
    lng: 11.859117477938655
  }
  zoom = 12

  private _places:Array<Place> = new Array<Place>();

  constructor() {
    mapboxgl!.accessToken = environment.mapbox.accessToken;
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      this.position.lat = position.coords.latitude
      this.position.lng = position.coords.longitude

      this.addMarker(this.position);
    })
  }

  buildMap() {
    this._map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      pitch: 36,
      hash: true,
      center: [this.position.lng, this.position.lat]
    });

    this._map.addControl(new mapboxgl.NavigationControl());
    this._map.addControl(
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

    this._places.map((place:Place)=>{
      this.addMarker(place.point);
    })
  }

  geoloacilised() {
    console.log("hello");
  }

  protected addMarker(position: any, color: string = "#0ea5e9", isDraggable: boolean = false): any {
    const marker = new mapboxgl.Marker({
      color: color,
      draggable: isDraggable
    })
    .setLngLat([position.lng, position.lat])
    .addTo(this._map!);

    return marker;
  }

  removeMarker(marker: any) {
    const lngLat = marker.getLngLat();
    console.log(`Longitude: ${lngLat.lng}, Latitude: ${lngLat.lat}`);
  }

  addPlace(newPlace:Place):void{
    this._places=[...this._places,newPlace];
    this.buildMap();
  }


  get places(): Array<Place> {
    return this._places;
  }

  get map(): mapboxgl.Map {
    return this._map!;
  }
}
