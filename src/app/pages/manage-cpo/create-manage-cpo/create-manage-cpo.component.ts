import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-create-manage-cpo',
  standalone: true,
  imports: [
      CommonModule,
      MatTableModule,
      MatDialogModule,
      MatButtonModule,
      MatSlideToggleModule, 
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule],
  templateUrl: './create-manage-cpo.component.html',
  styleUrls: ['./create-manage-cpo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateManageCpoComponent {
  form = this.fb.group({
    clientName: ['', { validators: [Validators.required], updateOn: 'blur' }],
    cpoName: ['', Validators.required],
    GSTIN: ['', Validators.required],
    tinnumber: ['', Validators.required],
    contactPerson: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    addressline1: ['', Validators.required], 
    addressline2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    pincode: ['', Validators.required],
    landmark: [''],

    status: [true],
  });

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateManageCpoComponent>
  ){}

  onSubmit(){
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(){
    this.dialogRef.close();
  }



}
