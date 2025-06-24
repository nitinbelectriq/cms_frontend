import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { ConnectorService } from '../../../services/charger-connector.service';
import { AuthService } from '../../../services/login.service';

@Component({
  selector: 'app-create-charger-connector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './create-charger-connector.component.html',
  styleUrls: ['./create-charger-connector.component.scss'],
})
export class CreateChargerConnectorComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateChargerConnectorComponent>);
  private fb = inject(FormBuilder);
  private connectorService = inject(ConnectorService);
  private authService = inject(AuthService); // ✅ Inject AuthService

  form: FormGroup = this.fb.group({
    brandId: [null, Validators.required],
    modelId: [null, Validators.required],
    vehicleTypeId: [null, Validators.required],
    connectorTypes: [[], Validators.required],
    status: [true],
  });

  brands: any[] = [];
  vehicleTypes: any[] = [];
  models: any[] = [];
  connectorTypes: any[] = [];

  ngOnInit(): void {
    this.loadInitialData();

    this.form.get('brandId')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(brandId => {
      if (brandId) {
        this.connectorService.getVehicleModelsByBrand(brandId).subscribe({
          next: res => {
            this.models = res?.data || [];
            this.form.get('modelId')?.setValue(null);
            this.connectorTypes = [];
            this.form.get('connectorTypes')?.setValue([]);
          },
          error: err => {
            this.models = [];
            console.error('Vehicle Models error:', err);
          }
        });
      } else {
        this.models = [];
        this.connectorTypes = [];
        this.form.get('modelId')?.setValue(null);
        this.form.get('connectorTypes')?.setValue([]);
      }
    });

    this.form.get('modelId')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(modelId => {
      if (modelId) {
        this.connectorService.getConnectorTypesExcludingVModelId(modelId).subscribe({
          next: res => {
            this.connectorTypes = res?.data || [];
            this.form.get('connectorTypes')?.setValue([]);
          },
          error: err => {
            this.connectorTypes = [];
            console.error('Connector Types error:', err);
          }
        });
      } else {
        this.connectorTypes = [];
        this.form.get('connectorTypes')?.setValue([]);
      }
    });
  }

  loadInitialData(): void {
    this.connectorService.getBrands().subscribe({
      next: res => {
        this.brands = res?.data || [];
      },
      error: err => {
        console.error('Brands error:', err);
      }
    });

    this.connectorService.getVehicleTypes().subscribe({
      next: res => {
        this.vehicleTypes = res?.data || [];
      },
      error: err => {
        console.error('Vehicle Types error:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const payload = {
        ct_id: formValue.connectorTypes,       // connector type IDs
        vm_id: formValue.modelId,              // vehicle model ID
        vType_id: formValue.vehicleTypeId,     // vehicle type ID
        status: formValue.status ? 'Y' : 'N',  // convert boolean to Y/N
        created_by: this.authService.getUserId() // ✅ call method to get userId
      };

      this.connectorService.createVModelConnectorMapping(payload).subscribe({
        next: (res) => {
          console.log('Mapping saved successfully:', res);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error saving mapping:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
