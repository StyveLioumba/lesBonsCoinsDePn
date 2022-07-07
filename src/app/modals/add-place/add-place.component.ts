import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Point} from "../../models/point.model";
import {FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {Place} from "../../models/place.model";
import {ToastrService} from "ngx-toastr";
import {MapService} from "../../services/map.service";
import {ThemePalette} from "@angular/material/core";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {CompressImageService} from "../../services/compress-image.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit,OnDestroy {

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
  });


  files: File[] = [];

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'buffer';
  value = 50;
  bufferValue = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:Point,
    private matDialogRef : MatDialogRef<AddPlaceComponent>,
    private formBuilder:FormBuilder,
    private toastr:ToastrService,
    public mapService : MapService,
    private compressImage: CompressImageService
  ){
  }

  ngOnInit(): void {
    this.formBuilder.group(this.placeFormGroup);
    this.mapService.uploadPercent.subscribe({
      next:val=>{
        this.value = val
      }
    })

  }


  onClose() {
    this.matDialogRef.close();
  }

  onSubmit() {
    if (this.placeFormGroup.invalid){
      this.toastr.info(`Vous devez remplir tous les champs obligatoirs!`,`info`);
      this.validateAllFormFields(this.placeFormGroup);
      return;
    }
    let place = this.placeFormGroup.value as Place;
    place.lat = this.data.lat;
    place.lng = this.data.lng;
    place.images =[];

    this.mapService.addPlace(place,this.files);

    this.mapService.isUploaded.subscribe({
      next:response=>{
        if (response){
          this.toastr.success(`${place.name} a été bien ajouté !`,`Success`);
          this.matDialogRef.close();
          this.mapService.isUploaded.next(false);
        }
      }
    })

  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }


  onSelect(event:any) {
    event.addedFiles.map((file:File)=>{
      if (file.size>=2*1024){
        this.compressImage.compress(file)
          .pipe(take(1))
          .subscribe((compressedImage:File) => {
            console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
            // now you can do upload the compressed image
            this.files.push(compressedImage)
          })
      }else {
        this.files.push(file)
      }

    })
    //this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }


  get name(){return this.placeFormGroup.get('name')!;}
  get description(){return this.placeFormGroup.get('description')!;}
  get ville(){return this.placeFormGroup.get('ville')!;}
  get quartier(){return this.placeFormGroup.get('quartier')!;}
  get images(){return this.placeFormGroup.get('images')!;}

  ngOnDestroy(): void {this.matDialogRef.close();}
}
