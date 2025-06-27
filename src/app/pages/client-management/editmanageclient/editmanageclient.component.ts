import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@Component({
  selector: 'app-editmanageclient',
  standalone: true,
  imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSlideToggleModule
  ],
  templateUrl: './editmanageclient.component.html',
  styleUrl: './editmanageclient.component.scss'
})
export class EditmanageclientComponent {

  form: FormGroup = this.fb.group({
    cpo: [this.data.cpo || '', Validators.required],
    contactperson: [this.data.contactperson || '', Validators.required],
    GSTINnumber: [this.data.GSTINnumber || '', Validators.required],
    clientName: [this.data.clientName || '',Validators.required],
    status: [this.data.element || false]
  })
  constructor(
    private dailogRef: MatDialogRef<EditmanageclientComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ){

  }

  onCancel(){
    // clsoe dailog
    this.dailogRef.close()
  }
  onSubmit(){
    if(this.form.valid){
      this.dailogRef.close(this.form.value);
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form.patchValue(this.data.element);
  }


}
