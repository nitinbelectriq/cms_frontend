import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-createmanagestation',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatIconModule,
    ReactiveFormsModule,

  

  ],
  templateUrl: './createmanagestation.component.html',
  styleUrl: './createmanagestation.component.scss'
})
export class CreatemanagestationComponent {
 fb = inject(FormBuilder);

 form : FormGroup = this.fb.group({
  cpo: ['', Validators.required],
  name:['', Validators.required],
  code: [''],
  description: [''],
  latitude: ['', Validators.required],
  longitude: ['', Validators.required],
  locationtype: [''],
  contactpersonname: ['', Validators.required],
  mobile: ['', Validators.required],
  email: ['', Validators.required],
  address1: ['', Validators.required],
  address2: [''],
  pincode: ['', Validators.required],
  city: ['', Validators.required],
  state: ['', Validators.required],
  country: ['', Validators.required],
  landmark: [''],
  commissionDate: ['', Validators.required],
  registerAs: ['', Validators.required],
  electricityline: ['', Validators.required],
  opentime: ['', Validators.required],
  closetime: [''],
  status: [true]
 });

 constructor(
  private dialogRef: MatDialogRef<CreatemanagestationComponent>,
  
 ){}





  onCancel(){
    this.dialogRef.close();

  }
  onSubmit(){
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

}
