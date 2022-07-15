import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {Place} from "../../models/place.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail-place',
  templateUrl: './detail-place.component.html',
  styleUrls: ['./detail-place.component.scss']
})
export class DetailPlaceComponent implements OnInit,OnDestroy {

  sub:Subscription = new Subscription();
  place?:Place;
  rndInt:number = 1

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.sub = this.mapService.placeClickedEvent.subscribe({
      next:(data:Place) => {
        this.place = data
        this.rndInt= Math.floor(Math.random() * this.place!.images.length) + 1
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onClose() {
    this.mapService.isHidden.next(true);
  }
}
