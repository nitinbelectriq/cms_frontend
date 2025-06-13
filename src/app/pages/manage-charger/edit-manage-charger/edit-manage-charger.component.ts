import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-edit-manage-charger',
  standalone: true,
  imports: [
    CommonModule, 
        MatDialogModule,
         MatButtonModule,
         MatInputModule,
          MatFormFieldModule,
         ReactiveFormsModule,
         MatSlideToggleModule
  ],
  templateUrl: './edit-manage-charger.component.html',
  styleUrl: './edit-manage-charger.component.scss'
})
export class EditManageChargerComponent {

     dialogRef = inject(MatDialogRef<EditManageChargerComponent>);
        fb = inject(FormBuilder);
      
        form: FormGroup = this.fb.group({
          chargerId: ['', Validators.required],
          model: ['', Validators.required],
          location: ['', Validators.required],
          status: [true]
        });
      
    
      onCancel(): void {
        this.dialogRef.close();
      }
    
      onSubmit(): void {
        if (this.form.valid) {
          this.dialogRef.close(this.form.value);
        }
      }
    

}
