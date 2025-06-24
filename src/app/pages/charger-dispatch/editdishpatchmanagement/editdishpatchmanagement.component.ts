import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule as matradio } from '@angular/material/radio';
import { MatDialogRef } from '@angular/material/dialog';
import {ChangeDetectionStrategy} from '@angular/core';


import {provideNativeDateAdapter} from '@angular/material/core';


@Component({
  selector: 'app-editdishpatchmanagement',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    matradio,
    MatDialogModule,
  ],
  templateUrl: './editdishpatchmanagement.component.html',
  styleUrl: './editdishpatchmanagement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class EditdishpatchmanagementComponent {
  form: FormGroup = this.fb.group({
    clientName: [''],
    expirydate: [''],
    public: [false],
    status: [true],
  });

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<EditdishpatchmanagementComponent>) {
    // Initialize the form with default values or any necessary logic
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // Handle form submission logic here
    this.dialogRef.close(this.form.value);
  }

}
