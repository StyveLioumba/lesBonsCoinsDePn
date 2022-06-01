import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Point} from "../../models/point.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Place} from "../../models/place.model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {

  placeFormGroup = new FormGroup({
    name: new FormControl('',
      [
        Validators.required,
        Validators.maxLength(30),
      ]),
    description: new FormControl(''),
    ville: new FormControl('',[ Validators.required]),
    quartier: new FormControl('',[ Validators.required]),
    images: new FormControl('')
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:Point,
    private matDialogRef : MatDialogRef<AddPlaceComponent>,
    private formBuilder:FormBuilder,
    private toastr:ToastrService
  ){ }

  ngOnInit(): void {
    this.formBuilder.group(this.placeFormGroup)
  }


  onClose() {
    this.matDialogRef.close();
  }

  onSubmit() {
    let place = this.placeFormGroup.value as Place
    place.point = this.data

    console.log(place)

  }

  get name(){return this.placeFormGroup.get('name')!;}
  get description(){return this.placeFormGroup.get('description')!;}
  get ville(){return this.placeFormGroup.get('ville')!;}
  get quartier(){return this.placeFormGroup.get('quartier')!;}
  get images(){return this.placeFormGroup.get('images')!;}
}
