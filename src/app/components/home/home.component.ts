import { MapService } from './../../services/map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private mapService:MapService
  ) { }

  ngOnInit(): void {
  }

  onGeoloc():void{
    this.mapService.geoloacilised();
  }

}
