import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-charger-model-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">
        <mat-icon>add_circle</mat-icon>
        Create Charger Model
      </h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Model Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter model name" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">
            Model name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput rows="3" formControlName="description" placeholder="Enter description"></textarea>
        </mat-form-field>

        <mat-slide-toggle formControlName="status" color="primary">
          Active
        </mat-slide-toggle>

        <div class="button-row">
          <button mat-stroked-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Create</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 100%;
      max-width: 450px;
      padding: 24px;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 22px;
      margin-bottom: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .button-row {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    @media (max-width: 500px) {
      .dialog-container {
        padding: 16px;
      }

      .dialog-title {
        font-size: 18px;
      }
    }
  `]
})
export class CreateChargerModelDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateChargerModelDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: [true] // true means Active
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close({
        name: this.form.value.name,
        description: this.form.value.description,
        status: this.form.value.status ? 'Active' : 'Inactive'
      });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
