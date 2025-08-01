import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ChargerModelService } from '../../../services/charger-model.service';
import { MatIconModule } from '@angular/material/icon';

export interface ChargerModel{
  name:string,
  description: string,
  status: string
}


@Component({
  selector: 'app-create-charger-model-dialog',
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
    MatSnackBarModule  // Added MatSnackBarModule here
  ],
  templateUrl: './create-charger-model-dialog.component.html',
  styleUrls: ['./create-charger-model-dialog.component.scss']
})
export class CreateChargerModelDialogComponent {
  dialogRef = inject(MatDialogRef<CreateChargerModelDialogComponent>);
  fb = inject(FormBuilder);
  chargerModelService = inject(ChargerModelService);
  snackBar = inject(MatSnackBar);  // Inject MatSnackBar

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    status: ['']  // boolean toggle
  });

  isLoading = false;

  onCancel(): void {
    this.dialogRef.close();
  }

 onSubmit(): void {
  if (this.form.invalid) return;

  this.isLoading = true;

  const formValue = this.form.value;
  const payload = {
    ...formValue,
    status: formValue.status ? 'Y' : 'N'
  };

  this.chargerModelService.create(payload).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.snackBar.open('Charger Model successfully created', 'Close', { duration: 3000 });
      this.dialogRef.close(res);
    },
    error: (err) => {
      this.isLoading = false;

      // Extract safe error message
      const backendMessage = err?.error?.message || 'Unknown error occurred.';
      const sqlMessage = err?.error?.error?.sqlMessage;

      const fullMessage = sqlMessage
        ? `Failed to create charger: ${sqlMessage}`
        : `Failed to create charger: ${backendMessage}`;

      console.error('Create Charger Model failed:', err);

      this.snackBar.open(fullMessage, 'Close', {
        duration: 6000,
        panelClass: ['snack-bar-error']
      });
    }
  });
}

}
