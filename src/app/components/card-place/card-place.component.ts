import { MapService } from 'src/app/services/map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-place',
  templateUrl: './card-place.component.html',
  styleUrls: ['./card-place.component.scss']
})
export class CardPlaceComponent implements OnInit {

  places:any[]=[];

  constructor(private mapService:MapService) { 
  }

  ngOnInit(): void {

    this.places = this.mapService.getPlaces();
  }

}
