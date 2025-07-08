import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from '../../../services/user-management.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  clients: any[] = [];
  roles: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  loggedInUserId = Number(localStorage.getItem('user_id')) || 1;
  projectId = 1; // Replace with actual project ID if needed

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      client_id: ['', Validators.required],
      role_id: ['', Validators.required],
      employee_code: [''],
      f_Name: ['', Validators.required],
      m_Name: [''],
      l_Name: ['', Validators.required],
      dob: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', this.data ? [] : Validators.required],
      confirm_password: ['', this.data ? [] : Validators.required],
      mobile: ['', Validators.required],
      alt_mobile: [''],
      PAN: [''],
      aadhar: [''],
      address1: ['', Validators.required],
      address2: [''],
      PIN: ['', Validators.required],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      landmark: [''],
      status: [true],
    });

    this.loadDropdowns();

    if (this.data) {
      this.isEdit = true;
      this.form.patchValue(this.data);
      this.loadRoles(this.data.client_id); // prefill roles
      this.loadCities(this.data.state_id); // prefill cities
    }

    this.form.get('client_id')?.valueChanges.subscribe((clientId) => {
      this.loadRoles(clientId);
    });

    this.form.get('state_id')?.valueChanges.subscribe((stateId) => {
      this.loadCities(stateId);
    });
  }

  loadDropdowns() {
    this.userService.getActiveClientsCW(this.loggedInUserId).subscribe(res => {
  this.clients = res; // ✅ NOT res.data
});

    this.userService.getCountries().subscribe(res => {
      this.countries = res || [];
    });

    this.userService.getStates().subscribe(res => {
      this.states = res || [];
    });
  }

  loadRoles(clientId: number) {
    if (clientId) {
      this.userService.getActiveRoles(this.projectId, clientId).subscribe(res => {
        this.roles = res.data || [];
      });
    }
  }

  loadCities(stateId: number) {
    if (stateId) {
      this.userService.getCitiesByState(stateId).subscribe(res => {
        this.cities = res || [];
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (!this.isEdit && this.form.value.password !== this.form.value.confirm_password) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.form.value;

    const payload = {
      ...formValue,
      status: formValue.status ? 'Y' : 'N',
      created_by: this.isEdit ? formValue.created_by : this.loggedInUserId,
      created_date: this.isEdit ? formValue.created_date : new Date(),
      modify_by: this.isEdit ? this.loggedInUserId : null,
      modify_date: this.isEdit ? new Date() : null,
    };

    const request$ = this.isEdit
      ? this.userService.updateUser(payload)
      : this.userService.createUser(payload);

    request$.subscribe({
      next: (res) => {
        if (res?.status) {
          this.snackBar.open(this.isEdit ? 'User updated successfully' : 'User created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close('success');
        } else {
          this.snackBar.open(res?.message || 'Failed to save user', 'Close', { duration: 3000 });
        }
      },
      error: () => this.snackBar.open('Server error occurred', 'Close', { duration: 3000 }),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
