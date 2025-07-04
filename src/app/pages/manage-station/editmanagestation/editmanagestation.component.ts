import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-editmanagestation',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './editmanagestation.component.html',
  styleUrl: './editmanagestation.component.scss'
})
export class EditmanagestationComponent {
  fb = inject(FormBuilder);
  
    form : FormGroup = this.fb.group({
    cpo: [this.data?.cpo || '', Validators.required],
    name:[this.data?.stationName ||'', Validators.required],
    code: [this.data?.stationcode || ''],
    description: [this.data?.description || ''],
    latitude: [this.data?.latitude || '', Validators.required],
    longitude: [this.data?.longitude || '', Validators.required],
    locationtype: [this.data?.locationtype || ''],
    contactpersonname: [this.data?.contactperson || '', Validators.required],
    mobile: [this.data?.mobile || '', Validators.required],
    email: [this.data?.email || '', Validators.required],
    address1: [this.data?.address || '', Validators.required],
    address2: [this.data?.address2 || ''],
    pincode: [this.data?.pincode || '', Validators.required],
    city: [this.data?.city || '', Validators.required],
    state: [this.data?.state || '', Validators.required],
    country: [this.data?.country || '', Validators.required],
    landmark: [this.data?.landmark || ''],
    commissionDate: [this.data?.commissionDate || '', Validators.required],
    registerAs: [this.data?.registerAs || '', Validators.required],
    electricityline: [this.data?.electricityline || '', Validators.required],
    opentime: ['', Validators.required],
    closetime: [''],
    status: [this.data?.status ?? false]
   });
  
   constructor(
    private dialogRef: MatDialogRef<EditmanagestationComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    
   ){}
  
  
  
  
  
    onCancel(){
      this.dialogRef.close();
  
    }
    // onSubmit(){
    //   if(this.form.valid){
    //     this.dialogRef.close(this.form.value);
    //   }
    // }

    // ngOnInit(): void {
    //   //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //   //Add 'implements OnInit' to the class.
    //   this.form.patchValue(this.data.element);
    // }
  

}
