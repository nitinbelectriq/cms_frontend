import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService, User } from '../../../services/user-management.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<CreateUserComponent>);
  private data = inject(MAT_DIALOG_DATA) as User | null;

  form!: FormGroup;
  isEdit = false;
  userId: number | null = null;

  ngOnInit(): void {
    this.buildForm();

    if (this.data) {
      this.isEdit = true;
      this.userId = this.data.id;
      this.form.patchValue({
        ...this.data,
        status: this.data.status === 'Y',
        password: '',
        confirm_password: '',
      });
      this.form.get('password')?.clearValidators();
      this.form.get('confirm_password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('confirm_password')?.updateValueAndValidity();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      client_id: [null, Validators.required],
      role_id: [null, Validators.required],
      f_name: ['', Validators.required],
      m_name: [''],
      l_name: ['', Validators.required],
      dob: [''],
      email: ['', [Validators.required, Validators.email]],
      employee_code: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      mobile: ['', Validators.required],
      alt_mobile: [''],
      PAN: [''],
      aadhar: [''],
      address1: ['', Validators.required],
      address2: [''],
      PIN: ['', Validators.required],
      city_id: [null, Validators.required],
      state_id: [null, Validators.required],
      country_id: [null, Validators.required],
      landmark: [''],
      status: [true],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      status: this.form.value.status ? 'Y' : 'N',
    };

    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userId, payload).subscribe({
        next: () => this.dialogRef.close('success'),
        error: (err) => console.error(err),
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => this.dialogRef.close('success'),
        error: (err) => console.error(err),
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
