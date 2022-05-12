import { MapService } from './../../services/map.service';
import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/models/place.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private map: MapService) { }

  ngOnInit(): void {
  }

}
