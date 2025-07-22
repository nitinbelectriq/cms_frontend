import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { ChargerModelService, ChargerModel } from '../../../services/charger-model.service';

@Component({
  selector: 'app-edit-charger-model-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-charger-model-dialog.component.html',
  styleUrls: ['./edit-charger-model-dialog.component.scss']
})
export class EditChargerModelDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<EditChargerModelDialogComponent>);
  fb = inject(FormBuilder);
  chargerModelService = inject(ChargerModelService);
  snackBar = inject(MatSnackBar);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ChargerModel) {}

  form: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    description: ['', Validators.required],
    status: [true] // default to true
  });

  isLoading = false;

 ngOnInit(): void {
  if (this.data) {
    this.form.patchValue({
      ...this.data,
     status: typeof this.data.status === 'string'
  ? this.data.status === 'Y'
  : !!this.data.status

    });
  }
}


  onCancel(): void {
    this.dialogRef.close();
  }

onSubmit(): void {
  if (this.form.invalid) return;

  const formValue = this.form.value;

  const payload: ChargerModel = {
    id: formValue.id,
    name: formValue.name,
    description: formValue.description,
    status: formValue.status // <-- Keep as boolean
  };

  this.isLoading = true;

  this.chargerModelService.update(payload).subscribe({
    next: (res) => {
      this.isLoading = false;
      
        console.log(res);
          this.snackBar.open('Charger Model successfully updated', 'Close', { duration: 3000 });
     
    
      this.dialogRef.close(res);
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Update Charger Model failed', err);
      this.snackBar.open(`Failed to update charger. Please try again!. ${err.error.message}`, 'Close', { duration: 4000 });
    }
  });
}



}
