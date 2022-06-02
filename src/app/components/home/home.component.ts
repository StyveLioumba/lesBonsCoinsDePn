import { MapService } from '../../services/map.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Place } from 'src/app/models/place.model';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {

  places:Place[] = new Array<Place>();
  placeSub : Subscription = new Subscription();

  skeletonloader: boolean = true;
  page: number = 1;
  perPage:number = 5;
  placeLength:number=0;
  placeFilter = {
    name:''
  };

  isClose:boolean = true;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.placeSub = this.mapService.places.subscribe({
      next:(placeList:Place[])=>{
        this.skeletonloader = false;
        this.places = placeList;
        this.placeLength = this.places.length;
      },
      error:err => console.error(err)
    })

    this.mapService.detailPlaceClickedEvent.subscribe({
      next:(isClose:boolean)=>{
        this.isClose = isClose;
      }
    })
  }

  ngOnDestroy(): void {
    this.placeSub.unsubscribe()
  }

}
