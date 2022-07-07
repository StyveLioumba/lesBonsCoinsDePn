import {EventEmitter, Injectable, Output} from '@angular/core';
import { environment } from "../../environments/environment";
import * as mapboxgl from 'mapbox-gl';
import { Place } from '../models/place.model';
import {BehaviorSubject, Observable} from "rxjs";
import {Point} from "../models/point.model";
import {AddPlaceComponent} from "../modals/add-place/add-place.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EventData} from "mapbox-gl";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";
import { UUID } from 'angular2-uuid';
import {arrayUnion} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _map?: mapboxgl.Map;
  private dialogConfig = new MatDialogConfig();

  private placeCollection: AngularFirestoreCollection<Place>;
  private fileRef : AngularFireStorageReference;

  style = 'mapbox://styles/mapbox/streets-v11';
  position: any = {
    lat: -4.793305195547416,
    lng: 11.859117477938655
  }
  zoom = 12

  private _places:Array<Place> = new Array<Place>();
  private downloadUrls:Array<string> = new Array<string>()

  private _placeBehavior: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>(new Array<Place>());

  uploadPercent: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  downloadURL: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isUploaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output()
  placeClickedEvent = new EventEmitter<Place>();

  constructor(
    private matDialog:MatDialog,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.placeCollection = this.firestore.collection<Place>('Places');
    this.fileRef = this.storage.ref(``);

    mapboxgl!.accessToken = environment.mapbox.accessToken;
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      this.position.lat = position.coords.latitude
      this.position.lng = position.coords.longitude
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
    this._map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
    }));

    this._places.map((place:Place)=>{
      this.addMarker(place);
    })



    this.map.on('dblclick',(e:EventData)=>{
      this.onModal(e.lngLat as Point);
    })

    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on('mouseenter', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', () => {
      this.map.getCanvas().style.cursor = '';
    });

  }

  protected addMarker(place: Place, color: string = "#0ea5e9", isDraggable: boolean = false): any {
    // create the popup

    const html = `
    <main>
        <h3>${place.name}</h3>
        <div>
            <p>${place.description}</p>
        </div>
        <button type="submit" >supprimer</button>
    </main>
    `;

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setText(place.name!).setHTML(html);

    const marker = new mapboxgl.Marker({
      color: color,
      draggable: isDraggable
    })
      .setLngLat([place!.lng, place!.lat])
      .setPopup(popup)
      .addTo(this._map!);



    return marker;
  }

  removeMarker(marker: any) {
    const lngLat = marker.getLngLat();
    console.log(`Longitude: ${lngLat.lng}, Latitude: ${lngLat.lat}`);
  }

  uploadFile(files:File[]) {
    if (files.length >0)
      files.map(((file:File) => {
      const filePath = `places_images/${UUID.UUID()}`;
      this.fileRef.child(filePath);

      const task = this.storage.upload(filePath, file);

      // observe percentage changes
      task.percentageChanges().subscribe({
        next:value => {
          if (value) {
            this.uploadPercent.next(value);
          }
        },
        error:err=>console.error(err)
      })

      // get notified when the download URL is available

      task.snapshotChanges().subscribe({
        next:value => {
          if(value) value?.ref.getDownloadURL().then((downloadLink =>{
            this.downloadURL.next(downloadLink)
          } ))
        }
      })
    }))

  }

  addPlace(newPlace:Place,files:File[] = []):void{
    this.uploadFile(files)

    const id = this.firestore.createId();
    newPlace.id = id;

    const data : Place = {
      id: id,
      name:newPlace.name,
      description:newPlace.description,
      ville:newPlace.ville,
      quartier:newPlace.quartier,
      images:newPlace.images,
      lat:newPlace.lat,
      lng:newPlace.lng
    }


    this.placeCollection.add(data).then((response)=>{

      this.downloadURL.subscribe({
        next:link=>{
          this.firestore.collection('Places')
            .doc(response.id)
            .update({images:arrayUnion(link)})
            .then(r=>{
              this.isUploaded.next(true);
            })
        }
      })

      this.buildMap();

    })


  }

  onPlaceClicked(place: Place):void {
    this.placeClickedEvent.emit(place);
  }

  onModal(lngLat:Point):void{
    this.dialogConfig.data=lngLat;
    this.dialogConfig.width = "50%";
    this.dialogConfig.height="90%";
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.disableClose = false;

    let modalDialog = this.matDialog.open(AddPlaceComponent, this.dialogConfig);

    modalDialog.afterClosed().subscribe({
      next:value=>{
        this.buildMap()
      },
      error:err => {
        console.error(err)
      }
    })
  }


  get places(): Observable<Array<Place>>{
    return this.placeCollection.valueChanges();
  }

  get map(): mapboxgl.Map {
    return this._map!;
  }
}
