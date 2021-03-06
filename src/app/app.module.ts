import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NotfoundComponent } from './components/notfound/notfound.component';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { HeaderComponent } from './components/header/header.component';
import { CardPlaceComponent } from './components/card-place/card-place.component';
import { AddPlaceComponent } from './modals/add-place/add-place.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import { PlacesComponent } from './components/places/places.component';
import {MatIconModule} from "@angular/material/icon";
import { DetailPlaceComponent } from './components/detail-place/detail-place.component';
import {ToastrModule} from "ngx-toastr";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {NgxPaginationModule} from "ngx-pagination";
import {FilterPipeModule} from "ngx-filter-pipe";
import {NgxDropzoneModule} from "ngx-dropzone";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment.prod";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule,BUCKET} from "@angular/fire/compat/storage";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HomeComponent,
    MapComponent,
    HeaderComponent,
    CardPlaceComponent,
    AddPlaceComponent,
    PlacesComponent,
    DetailPlaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true
    }),
    NgxSkeletonLoaderModule,
    NgxPaginationModule,
    FilterPipeModule,
    NgxDropzoneModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatProgressBarModule
  ],
  providers: [
    { provide: BUCKET, useValue: environment.firebaseConfig.storageBucket },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
