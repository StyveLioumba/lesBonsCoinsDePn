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

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.sub = this.mapService.placeClickedEvent.subscribe({
      next:(data:Place) => {
        this.place = data
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onClose() {
    this.mapService.onDetailPlaceClose(true);
  }
}
