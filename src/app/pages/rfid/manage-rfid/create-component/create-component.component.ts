import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AuthService } from '../../../../services/login.service';

export interface RfidData {
  id?: number;
  rf_id_no: string;
  expiry_date: string;
  status: string;  // 'Y' or 'N'
}

@Component({
  selector: 'app-rfid-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.scss'],
})
export class RfidFormDialogComponent implements OnInit {
  rfidForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RfidFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RfidData | null,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.rfidForm = this.fb.group({
      rf_id_no: [this.data?.rf_id_no || '', Validators.required],
      expiry_date: [this.data?.expiry_date || '', Validators.required],
      status: [this.data?.status === 'Y'],
    });
  }

  onSubmit() {
    if (this.rfidForm.valid) {
      const formValue = this.rfidForm.value;

      // Convert boolean toggle to 'Y' or 'N'
      const statusValue = formValue.status ? 'Y' : 'N';

      // Get logged-in user ID
      const userId = this.authService.getUserId();

      const result = {
        ...this.data,
        ...formValue,
        status: statusValue,
        created_by: userId,
        modify_by: userId
      };

      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
