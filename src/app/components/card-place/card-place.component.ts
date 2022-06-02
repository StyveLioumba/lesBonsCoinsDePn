import { MapService } from 'src/app/services/map.service';
import {Component, Input, OnInit} from '@angular/core';
import {Place} from "../../models/place.model";

@Component({
  selector: 'app-card-place',
  templateUrl: './card-place.component.html',
  styleUrls: ['./card-place.component.scss']
})
export class CardPlaceComponent implements OnInit {

  @Input()
  place?:Place

  constructor(
    private mapService:MapService
  ) {
  }

  ngOnInit(): void {
  }

  onShowPlace() {
    this.mapService.onPlaceClicked(this.place!);
    this.mapService.onDetailPlaceClose(false);
  }
}
