import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-edit-manage-cpo',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    HttpClientModule,

  ],
  templateUrl: './edit-manage-cpo.component.html',
  styleUrl: './edit-manage-cpo.component.scss'
})
export class EditManageCpoComponent {
  form = this.fb.group({
    clientName: [this.data?.clientName || '', { validators: [Validators.required], updateOn: 'blur' }],
    cpoName: [this.data?.cpoName || '', Validators.required],
    GSTIN: [this.data?.GSTIN || '', Validators.required],
    contactPerson: [this.data?.contactPerson || '', Validators.required],
    status: [this.data?.status || true],


    
    
    tinnumber: ['', Validators.required],
   
    email: ['', Validators.required],
    phone: ['', Validators.required],
    addressline1: ['', Validators.required], 
    addressline2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    pincode: ['', Validators.required],
    landmark: [''],
  });

  constructor(private fb: FormBuilder,
    private dialogRef : MatDialogRef<EditManageCpoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form.patchValue(this.data.element);
  }

}
