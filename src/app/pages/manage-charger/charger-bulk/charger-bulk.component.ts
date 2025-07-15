import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';

import { ChargerService } from '../../../services/manage-charger.service';
import { AuthService } from '../../../services/login.service';

interface ModelVariant {
  id: number;
  charger_type_name: string;
  name: string;
}

interface Version {
  id: number;
  name: string;
}

@Component({
  selector: 'app-bulk-upload-charger',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule,
  ],
  templateUrl: './charger-bulk.component.html',
  styleUrls: ['./charger-bulk.component.scss'],
})
export class BulkUploadChargerComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<BulkUploadChargerComponent>);
  private fb = inject(FormBuilder);
  private chargerService = inject(ChargerService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  modelVariants: ModelVariant[] = [];
  versionList: Version[] = [];

  uploadFile?: File;
  backendMessage = '';
  backendError = false;
  isUploading = false;

  ngOnInit(): void {
    this.initForm();
    this.loadModelVariants();
    this.loadVersions();
  }

  initForm(): void {
    this.form = this.fb.group({
      model_id: [null, Validators.required],
      current_version_id: [null, Validators.required],
      is_available: [true],
      status: [true],
      file: [null, Validators.required],
    });
  }

  loadModelVariants(): void {
    this.chargerService.getModelVariants().subscribe({
      next: (res: any) => {
        this.modelVariants = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error('Failed to load model variants', err);
        this.modelVariants = [];
      },
    });
  }

  loadVersions(): void {
    this.chargerService.getAllVersions().subscribe({
      next: (res: any) => {
        this.versionList = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error('Failed to load versions', err);
        this.versionList = [];
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.uploadFile = file;
    this.backendMessage = '';
    this.backendError = false;

    if (file) {
      this.form.get('file')?.setValue(file);
    } else {
      this.form.get('file')?.setValue(null);
    }
  }

  onDownloadSample() {
    const csvContent = 'serial_no,charger_display_id\nEX12345,Charger1\nEX67890,Charger2';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'charger_bulk_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

onSubmit(): void {
  if (this.form.invalid || !this.uploadFile) {
    this.form.markAllAsTouched();
    if (!this.uploadFile) {
      this.snackBar.open('Please select a file to upload.', 'Close', { duration: 3000 });
    }
    return;
  }

  this.isUploading = true;

  const formValue = this.form.value;
  const userId = this.authService.getUserId();

  const formData = new FormData();
  formData.append('file', this.uploadFile);
  formData.append('model_id', formValue.model_id.toString());
  formData.append('current_version_id', formValue.current_version_id.toString());
  formData.append('is_available', formValue.is_available ? '1' : '0');
  formData.append('status', formValue.status ? 'Y' : 'N');
  formData.append('created_by', userId !== null ? userId.toString() : '0');

  // Optional: log formData for debugging
 for (const [key, value] of (formData as any).entries()) {
  console.log(`${key}:`, value);
}


  this.chargerService.bulkUploadChargers(formData).subscribe({
    next: (res: any) => {
      this.isUploading = false;
      if (res.status) {
        this.snackBar.open('Bulk upload successful!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      } else {
        this.snackBar.open(`Error: ${res.message || 'Unknown error'}`, 'Close', { duration: 5000 });
      }
    },
    error: (err) => {
      this.isUploading = false;
      const errorMsg =
        err?.error?.message || err?.message || (typeof err?.error === 'string' ? err.error : 'Server error');
      this.snackBar.open(`Upload failed: ${errorMsg}`, 'Close', { duration: 5000 });
    },
  });
}




  onCancel(): void {
    this.dialogRef.close(false);
  }
}
