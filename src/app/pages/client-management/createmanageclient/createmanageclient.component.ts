import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../../services/client-management.service';
import { AuthService } from '../../../services/login.service';

@Component({
  selector: 'app-createmanageclient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './createmanageclient.component.html',
  styleUrls: ['./createmanageclient.component.scss']
})
export class CreatemanageclientComponent implements OnInit {
  clientForm!: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<CreatemanageclientComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any // Data for edit
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCountries();

    if (this.data) {
      this.isEditMode = true;
      this.clientForm.patchValue(this.data);
      this.loadStates(this.data.country_id);
      this.loadCities(this.data.state_id);
    }

    this.clientForm.get('country_id')?.valueChanges.subscribe((countryId) => {
      this.clientForm.patchValue({ state_id: '', city_id: '' });
      this.states = [];
      this.cities = [];
      if (countryId) this.loadStates(countryId);
    });

    this.clientForm.get('state_id')?.valueChanges.subscribe((stateId) => {
      this.clientForm.patchValue({ city_id: '' });
      this.cities = [];
      if (stateId) this.loadCities(stateId);
    });
  }

  initForm() {
    const userId = this.authService.getUserId() || 0;
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      cp_name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gst_no: [''],
      tin_no: [''],
      address1: ['', Validators.required],
      address2: [''],
      pin: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      landmark: [''],
      status: ['Y'],
      created_by: userId
    });
  }

  loadCountries() {
    this.clientService.getCountries().subscribe({
      next: (res) => (this.countries = res),
      error: (err: any) => console.error('Error loading countries', err)
    });
  }

  loadStates(countryId: number) {
    this.clientService.getStates(countryId).subscribe({
      next: (res) => (this.states = res),
      error: (err: any) => console.error('Error loading states', err)
    });
  }

  loadCities(stateId: number) {
    this.clientService.getCitiesByState(stateId).subscribe({
      next: (res) => (this.cities = res),
      error: (err: any) => console.error('Error loading cities', err)
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    const payload = this.clientForm.value;
    const userId = this.authService.getUserId() || 0;

    if (this.isEditMode && this.data?.id) {
      payload.modify_by = userId;
      payload.id = this.data.id;

      this.clientService.updateClient(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error('Failed to update client', err)
      });
    } else {
      payload.created_by = userId;

      this.clientService.createClient(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error('Failed to create client', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
