import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientService } from '../../../services/client-management.service';
import { AuthService } from '../../../services/login.service';

@Component({
  selector: 'app-createmanageclient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatSlideToggleModule
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
  showBankDetails = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<CreatemanageclientComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCountries();

    if (this.data) {
      this.isEditMode = true;
      this.clientForm.patchValue(this.data);

      this.showBankDetails = !!(this.data.bankName || this.data.accountNumber);

      this.loadStates(this.data.country_id);
      this.loadCities(this.data.state_id);

      // Update validators for bank details after patching data
      this.updateBankDetailsValidators();

      // Mark bank fields as touched and dirty to trigger validation and enable submit button
      if (this.showBankDetails) {
        ['accountHolderName', 'bankName', 'accountNumber', 'ifsc'].forEach(field => {
          this.clientForm.get(field)?.markAsTouched();
          this.clientForm.get(field)?.markAsDirty();
        });
      }
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
      status: ['Y'],  // Default active
      created_by: userId,
      accountHolderName: [''],
      bankName: [''],
      accountNumber: [''],
      ifsc: ['']
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

  onStatusToggle(event: any): void {
    const checked = event.checked;
    this.clientForm.patchValue({
      status: checked ? 'Y' : 'N'
    });
  }

  toggleBankDetails(): void {
    this.showBankDetails = !this.showBankDetails;
    this.updateBankDetailsValidators();

    if (this.showBankDetails) {
      ['accountHolderName', 'bankName', 'accountNumber', 'ifsc'].forEach(field => {
        this.clientForm.get(field)?.markAsTouched();
        this.clientForm.get(field)?.markAsDirty();
      });
    }
  }

  updateBankDetailsValidators() {
    if (this.showBankDetails) {
      this.clientForm.get('accountHolderName')?.setValidators([Validators.required]);
      this.clientForm.get('bankName')?.setValidators([Validators.required]);
      this.clientForm.get('accountNumber')?.setValidators([Validators.required]);
      this.clientForm.get('ifsc')?.setValidators([Validators.required]);
    } else {
      this.clientForm.get('accountHolderName')?.clearValidators();
      this.clientForm.get('bankName')?.clearValidators();
      this.clientForm.get('accountNumber')?.clearValidators();
      this.clientForm.get('ifsc')?.clearValidators();

      // Clear bank details fields
      this.clientForm.patchValue({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifsc: ''
      });
    }

    this.clientForm.get('accountHolderName')?.updateValueAndValidity();
    this.clientForm.get('bankName')?.updateValueAndValidity();
    this.clientForm.get('accountNumber')?.updateValueAndValidity();
    this.clientForm.get('ifsc')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    const payload = this.clientForm.value;
    const userId = this.authService.getUserId() || 0;

    if (!this.showBankDetails) {
      payload.accountHolderName = '';
      payload.bankName = '';
      payload.accountNumber = '';
      payload.ifsc = '';
    }

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
