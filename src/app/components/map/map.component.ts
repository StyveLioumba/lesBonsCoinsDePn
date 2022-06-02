import { Component, OnInit } from '@angular/core';
import {MapService} from "../../services/map.service";
import {AddPlaceComponent} from "../../modals/add-place/add-place.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Point} from "../../models/point.model";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  constructor(
    private mapService: MapService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.mapService.buildMap()
  }

  onTap() {
    this.mapService.map.on('click',(e)=>{
      this.onModal(e.lngLat as Point);
    })
  }


  onModal(lngLat:Point):void{
    this.dialogConfig.data=lngLat;
    this.dialogConfig.width = "50%";
    this.dialogConfig.height="90%";
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.disableClose = false;

    let modalDialog = this.matDialog.open(AddPlaceComponent, this.dialogConfig);

    modalDialog.afterClosed().subscribe({
      next:value=>{
        this.ngOnInit()
      },
      error:err => {
        console.error(err)
      }
    })
  }
}
