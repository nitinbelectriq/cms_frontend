import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { StationService } from '../../../services/manage-station.service';
import { AuthService } from '../../../services/login.service';
import { Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-charger-station-mapping',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatIconModule
  ],
  templateUrl: './charger-station-mapping.component.html',
  styleUrls: ['./charger-station-mapping.component.scss']
})
export class ChargerStationMappingComponent implements OnInit {
  form!: FormGroup;
  chargerOptions: any[] = [];
  isLoading = false;

  private fb = inject(FormBuilder);
  private stationService = inject(StationService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<ChargerStationMappingComponent>);

  // <-- THIS MUST BE PUBLIC for template access
  public data: any = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    const clientId = this.data?.client_id;

    this.form = this.fb.group({
      selectedChargers: [[], Validators.required],   // multiple chargers
      status: [this.data?.status === 'Y']
    });

    if (!clientId) {
      this.snackBar.open('Client ID not found for fetching serial numbers', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.stationService.getClientChargers(clientId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status && res.data?.length) {
          this.chargerOptions = res.data;
        } else {
          this.chargerOptions = [];
          this.snackBar.open('No chargers available for this client', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to fetch chargers', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please select at least one charger', 'Close', { duration: 3000 });
      return;
    }

    const selectedChargers = this.form.value.selectedChargers;

    const payload = {
      station_id: this.data?.id,
      status: this.form.value.status ? 'Y' : 'N',
      created_by: this.authService.getUserId(),
      charger_data: selectedChargers.map((charger: any) => ({
        charger_id: charger.charger_id,
        serial_no: charger.serial_no
      }))
    };

    this.isLoading = true;
    this.stationService.addCharger(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status) {
          this.snackBar.open('Chargers mapped successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(`Mapping failed: ${res.message}`, 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to map chargers', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
