import { Component, Input, OnInit, Output } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title:any;

  constructor(private mapService:MapService) { }

  ngOnInit(): void {
  }

  onAddMarker():void{
    this.mapService.addPlace({
      id:'qksdhj',
      name:'lieu 1',
      description:'bla bla',
      point:{
        lng:11.873594133483696,
        lat:-4.798238432733955
      }
    })
    
  }

}
