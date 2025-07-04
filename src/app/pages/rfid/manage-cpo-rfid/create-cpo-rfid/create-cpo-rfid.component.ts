import {
  Component,
  Inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManageRfidService } from '../../../../services/cpo-rfid-mapping.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../../services/login.service';
import { MatIconModule } from '@angular/material/icon';

interface RfidPayload {
  client_id: number;
  cpo_id: number;
  rfid_data: number[];
  status: string;
  map_id?: number;
  created_by?: number;
  modify_by?: number;
}

@Component({
  selector: 'app-create-cpo-rfid',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatOptionModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './create-cpo-rfid.component.html',
  styleUrls: ['./create-cpo-rfid.component.scss'],
})
export class CreateCpoRfidComponent implements OnInit {
  form!: FormGroup;
  clients: any[] = [];
  cpos: any[] = [];
  rfids: any[] = [];

  loadingClients = false;
  loadingCpos = false;
  loadingRfids = false;

  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private rfidService: ManageRfidService,
    private dialogRef: MatDialogRef<CreateCpoRfidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit() {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      cpoId: [{ value: '', disabled: true }, Validators.required],
      rfidId: [{ value: '', disabled: true }, Validators.required],
      status: [true],
    });

    this.loadClients().then(() => {
      if (this.isEditMode && this.data) {
        this.form.get('clientId')!.setValue(this.data.client_id);

        this.loadCpos(this.data.client_id).then(() => {
          this.form.get('cpoId')!.enable();
          this.form.get('cpoId')!.setValue(this.data.cpo_id);

          this.rfidService
            .getAllRFidsWithMappedCPOs(this.data.cpo_id)
            .subscribe({
              next: (res) => {
                this.rfids = res.data ?? [];

                if (this.rfids.length) {
                  this.form.get('rfidId')!.enable();

                  let selectedRfids: number[] = [];
                  const rawRfid = this.data.rfid_id;

                  if (Array.isArray(rawRfid)) {
                    selectedRfids = rawRfid.map((id: number) => +id);
                  } else if (
                    typeof rawRfid === 'string' &&
                    rawRfid.includes(',')
                  ) {
                    selectedRfids = rawRfid
                      .split(',')
                      .map((id: string) => +id);
                  } else if (typeof rawRfid === 'number') {
                    selectedRfids = [rawRfid];
                  } else if (typeof rawRfid === 'string') {
                    selectedRfids = [+rawRfid];
                  }

                  console.log('Prefilling with RFIDs:', selectedRfids);
                  this.form.get('rfidId')!.setValue(selectedRfids);
                } else {
                  this.form.get('rfidId')!.disable();
                }
              },
              error: (err: any) => {
                console.error('Error loading RFIDs:', err);
                this.rfids = [];
                this.form.get('rfidId')!.disable();
              },
            });
        });

        this.form.get('status')!.setValue(this.data.status === 'Y');
      }
    });

    this.form.get('clientId')!.valueChanges.subscribe((clientId) => {
      this.cpos = [];
      this.rfids = [];
      this.form.patchValue({ cpoId: '', rfidId: '' }, { emitEvent: false });

      if (clientId) {
        this.loadCpos(clientId).then(() => {
          this.form.get('cpoId')!.enable();
        });
        this.form.get('rfidId')!.disable();
      } else {
        this.form.get('cpoId')!.disable();
        this.form.get('rfidId')!.disable();
      }
    });

    this.form.get('cpoId')!.valueChanges.subscribe((cpoId) => {
      this.rfids = [];
      this.form.patchValue({ rfidId: '' }, { emitEvent: false });

      if (cpoId) {
        this.loadRfids(cpoId).then(() => {
          if (this.rfids.length) {
            this.form.get('rfidId')!.enable();
          } else {
            this.form.get('rfidId')!.disable();
          }
        });
      } else {
        this.form.get('rfidId')!.disable();
      }
    });
  }

  loadClients(): Promise<void> {
    this.loadingClients = true;
    return new Promise((resolve) => {
      this.rfidService.getActiveClientsCW(66).subscribe({
        next: (res) => {
          this.clients = res;
          this.loadingClients = false;
          resolve();
        },
        error: () => {
          this.loadingClients = false;
          resolve();
        },
      });
    });
  }

  loadCpos(clientId: number): Promise<void> {
    this.loadingCpos = true;
    return new Promise((resolve) => {
      this.rfidService.getCpoByClientId(clientId).subscribe({
        next: (res) => {
          this.cpos = res;
          this.loadingCpos = false;
          resolve();
        },
        error: () => {
          this.cpos = [];
          this.loadingCpos = false;
          resolve();
        },
      });
    });
  }

  loadRfids(cpoId: number): Promise<void> {
    this.loadingRfids = true;
    return new Promise((resolve) => {
      this.rfidService.getAllRFidsWithMappedCPOs(cpoId).subscribe({
        next: (res) => {
          this.rfids = res.data ?? [];
          this.loadingRfids = false;

          if (this.rfids.length) {
            this.form.get('rfidId')!.enable();
          } else {
            this.form.get('rfidId')!.disable();
          }

          resolve();
        },
        error: () => {
          this.rfids = [];
          this.loadingRfids = false;
          this.form.get('rfidId')!.disable();
          resolve();
        },
      });
    });
  }

  onSubmit() {
  if (this.form.invalid) return;

  const userId = this.authService.getUserId() ?? 0;

  // Fallback logic to ensure cpoId and rfidId are extracted even if form fails to reflect value
  const selectedClientId = this.form.get('clientId')!.value;
  const selectedCpoId = this.form.get('cpoId')!.value ?? this.data?.cpo_id;
  const selectedRfids = this.form.get('rfidId')!.value ?? [];

  const payload: RfidPayload = {
    client_id: selectedClientId,
    cpo_id: selectedCpoId,
    rfid_data: selectedRfids,
    status: this.form.value.status ? 'Y' : 'N',
    map_id: this.isEditMode ? this.data.map_id : undefined,
  };

  const finalPayload = {
    ...payload,
    created_by: this.isEditMode ? undefined : userId,
    modify_by: this.isEditMode ? userId : undefined,
  };

  // ✅ DEBUG: Log everything to ensure proper values
  console.log('--- FORM VALUES ---', this.form.value);
  console.log('--- FALLBACKS ---');
  console.log('client_id:', selectedClientId);
  console.log('cpo_id:', selectedCpoId);
  console.log('rfid_data:', selectedRfids);
  console.log('Final Payload:', finalPayload);

  const request$ = this.isEditMode
    ? this.rfidService.updateCpoRfidMapping(finalPayload)
    : this.rfidService.createCpoRfidMapping(finalPayload);

  request$.subscribe({
    next: (res: any) => {
      if (res.status === true) {
        this.snackBar.open(
          `RFID Mapping ${this.isEditMode ? 'updated' : 'created'} successfully!`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      } else {
        this.snackBar.open(`Failed: ${res.message || 'Unknown error'}`, 'Close', {
          duration: 5000,
        });
      }
    },
    error: (err: any) => {
      console.error(err);
      this.snackBar.open(
        `Error ${this.isEditMode ? 'updating' : 'creating'} RFID mapping`,
        'Close',
        { duration: 3000 }
      );
    },
  });
}


onCancel(){
  this.dialogRef.close()
}

}
