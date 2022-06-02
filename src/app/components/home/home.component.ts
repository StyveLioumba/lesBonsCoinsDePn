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

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.placeSub = this.mapService.places.subscribe({
      next:(placeList:Place[])=>{
        this.places = placeList;
      },
      error:err => console.error(err)
    })
  }

  ngOnDestroy(): void {
    this.placeSub.unsubscribe()
  }

}
