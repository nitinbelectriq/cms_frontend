import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,  // Added MatSnackBarModule here
  ],
  templateUrl: './edit-charger-model-dialog.component.html',
  styleUrls: ['./edit-charger-model-dialog.component.scss']
})
export class EditChargerModelDialogComponent {
  dialogRef = inject(MatDialogRef<EditChargerModelDialogComponent>);
  fb = inject(FormBuilder);
  chargerModelService = inject(ChargerModelService);
  snackBar = inject(MatSnackBar);  // Inject MatSnackBar

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ChargerModel
  ) {}

  form: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    description: ['', Validators.required],
    status: [true]
  });

  isLoading = false;

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    // Convert boolean to 'Y' or 'N'
    const formValue = this.form.value;
    const payload = {
      ...formValue,
      status: formValue.status ? 'Y' : 'N'
    };

    this.chargerModelService.update(payload).subscribe({ 
      next: (res) => {
        this.isLoading = false;
        // Show snackbar success message for 3 seconds
        this.snackBar.open('Charger Model successfully updated', 'Close', { duration: 3000 });
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Update Charger Model failed', err);
        // Show snackbar error message for 3 seconds
        this.snackBar.open('Failed to update charger. Please try again!', 'Close', { duration: 3000 });
      }
    });
  }
}
