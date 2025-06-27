import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CpoService } from '../../../services/manage-cpo.service';
import { AuthService } from '../../../services/login.service';

@Component({
  selector: 'app-create-manage-cpo',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule,
    MatButtonModule, MatSelectModule
  ],
  templateUrl: './create-manage-cpo.component.html',
  styleUrls: ['./create-manage-cpo.component.scss']
})
export class CreateManageCpoComponent implements OnInit {
  form!: FormGroup;
  clients: any[] = []; countries: any[] = []; states: any[] = []; cities: any[] = [];

  private cpoService = inject(CpoService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateManageCpoComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  ngOnInit(): void {
    const loginId = Number(this.authService.getUserId() ?? 0);
    this.initForm();

    this.cpoService.getClients(loginId).subscribe(res => this.clients = res || []);
    this.cpoService.getCountries(loginId).subscribe(res => this.countries = res || []);

    this.form.get('country')?.valueChanges.subscribe(cid => {
      if (cid) this.cpoService.getStates(cid).subscribe(r => this.states = r || []);
      this.form.get('state')?.reset();
    });

    this.form.get('state')?.valueChanges.subscribe(sid => {
      if (sid) this.cpoService.getCitiesByState(sid).subscribe(r => this.cities = r || []);
      this.form.get('city')?.reset();
    });

    if (this.data?.id) this.loadForEdit(this.data.id);
  }

  initForm() {
    this.form = this.fb.group({
      clientName: [null, Validators.required],
      cpoName: [null, Validators.required],
      contactPerson: [null, Validators.required],
      phone: [null, Validators.required],
      GSTIN: [null, Validators.required],
      tinnumber: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      addressline1: [null, Validators.required],
      addressline2: [null],
      pincode: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      country: [null, Validators.required],
      landmark: [null],
      status: [true]
    });
  }

  loadForEdit(id: number) {
    this.cpoService.getCpoById(id).subscribe({
      next: (res) => {
        const data = res?.data?.[0];
        if (!data) return;

        this.form.patchValue({
          clientName: data.client_id,
          cpoName: data.name,
          contactPerson: data.cp_name,
          phone: data.mobile,
          GSTIN: data.gst_no,
          tinnumber: data.tin_no,
          email: data.email,
          addressline1: data.address1,
          addressline2: data.address2,
          pincode: data.PIN,
          country: data.country_id,
          state: data.state_id,
          city: data.city_id,
          landmark: data.landmark,
          status: data.status === 'Y'
        });

        this.cpoService.getStates(data.country_id).subscribe(r => this.states = r || []);
        this.cpoService.getCitiesByState(data.state_id).subscribe(r => this.cities = r || []);
      },
      error: (err) => console.error('Edit fetch error:', err)
    });
  }

  onSubmit(): void {
    console.log('Submit triggered', this.form.value);
    if (this.form.invalid) return;

    const loginId = this.authService.getUserId();
    const f = this.form.value;

    const payload = {
      id: this.data?.id ?? null,
      client_id: f.clientName,
      name: f.cpoName,
      cp_name: f.contactPerson,
      mobile: f.phone,
      gst_no: f.GSTIN,
      tin_no: f.tinnumber,
      email: f.email,
      address1: f.addressline1,
      address2: f.addressline2,
      PIN: f.pincode,
      city_id: f.city,
      state_id: f.state,
      country_id: f.country,
      landmark: f.landmark,
      logoPath: '',
      status: f.status ? 'Y' : 'N',
      created_date: !this.data?.id ? new Date().toISOString().slice(0, 10) : null,
      created_by: !this.data?.id ? loginId : null,
      modify_date: this.data?.id ? new Date().toISOString().slice(0, 10) : null,
      modify_by: this.data?.id ? loginId : null
    };

    const apiCall$ = this.data?.id ? this.cpoService.updateCpo(payload) : this.cpoService.createCpo(payload);
    apiCall$.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Save error:', err)
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}