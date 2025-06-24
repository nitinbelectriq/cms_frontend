import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
  selector: 'app-create-manage-charger',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  templateUrl: './create-manage-charger.component.html',
  styleUrls: ['./create-manage-charger.component.scss']
})
export class CreateManageChargerComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<CreateManageChargerComponent>);
  private fb = inject(FormBuilder);
  private chargerService = inject(ChargerService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private data = inject(MAT_DIALOG_DATA);

  form!: FormGroup;
  isEditMode = false;
  editId: number | null = null;

  modelVariants: ModelVariant[] = [];
  versionList: Version[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadModelVariants();
    this.loadVersions();

    if (this.data && this.data.id) {
      this.isEditMode = true;
      this.editId = this.data.id;
      this.prefillForm(this.data);
    }
  }

  initForm() {
    this.form = this.fb.group({
      model_id: [null, Validators.required],
      serial_no: ['', Validators.required],
      charger_display_id: ['', Validators.required],
      current_version_id: [null, Validators.required],
      is_available: [true],
      status: [true]
    });
  }

  prefillForm(data: any) {
    this.form.patchValue({
      model_id: data.model_id,
      serial_no: data.serial_no,
      charger_display_id: data.name,
      current_version_id: data.current_version_id,
      is_available: data.is_available === '1' || data.is_available === true,
      status: data.status === 'Y' || data.status === true
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
      }
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
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const userId = this.authService.getUserId();

    const basePayload = {
      ...formValue,
      is_available: formValue.is_available ? '1' : '0',
      status: formValue.status ? 'Y' : 'N'
    };

    if (this.isEditMode && this.editId !== null) {
      const updatePayload = {
        ...basePayload,
        id: this.editId,
        modify_by: userId
      };

      this.chargerService.updateCharger(updatePayload).subscribe({
        next: (res) => {
          this.snackBar.open('Charger updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Update failed', err);
          this.snackBar.open('Failed to update charger.', 'Close', { duration: 3000 });
        }
      });
    } else {
      const createPayload = {
        ...basePayload,
        created_by: userId
      };

      this.chargerService.createCharger(createPayload).subscribe({
        next: (res) => {
          if (res.status) {
            this.snackBar.open('Charger created successfully!', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open(`Create failed: ${res.message}`, 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Create error', err);
          this.snackBar.open('Failed to create charger.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
