import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule as matradio } from '@angular/material/radio';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DispatchService } from '../../../services/dispatch-charger.service';
import { AuthService } from '../../../services/login.service';
import { BulkDispatchComponent } from '../bulk-dispatch/bulk-dispatch.component';

@Component({
  selector: 'app-createdishpatchmanagement',
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
    MatSnackBarModule
  ],
  templateUrl: './createdishpatchmanagement.component.html',
  styleUrls: ['./createdishpatchmanagement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()]
})
export class CreatedishpatchmanagementComponent implements OnInit {
  form!: FormGroup;
  clients: any[] = [];
  chargers: any[] = [];
  userId: number = 0;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatedishpatchmanagementComponent>,
    private dispatchService: DispatchService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() ?? 0;
    this.isEdit = !!this.data?.id;

    this.form = this.fb.group({
      clientName: [this.data?.client_id || '', Validators.required],
      dispatch_date: [this.data?.dispatch_date ? new Date(this.data.dispatch_date) : '', Validators.required],
      public: [this.data?.is_private === 1 ? false : true],
      status: [this.data?.dispatch_status === 'Y' ? true : false],
      serialNo: [this.isEdit ? this.data?.charger_id || '' : this.data?.charger_data || [], Validators.required],
      warranty_start: [null],
      warranty_end: [null]
    });

    this.loadClients();
    this.loadChargers();
  }

  loadClients() {
    this.dispatchService.getClients(this.userId).subscribe({
      next: (res) => (this.clients = res || []),
      error: (err) => {
        console.error('Failed to load clients', err);
        this.snackBar.open('Failed to load clients', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  loadChargers() {
    this.dispatchService.getChargers().subscribe({
      next: (res) => (this.chargers = res?.data || []),
      error: (err) => {
        console.error('Failed to load chargers', err);
        this.snackBar.open('Failed to load chargers', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  openBulkDispatchDialog() {
    this.dialog.open(BulkDispatchComponent, {
      width: '600px',
      data: { clientId: this.form?.value?.clientName || null }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
  if (!this.form.valid || !this.userId) return;

  const dispatchDate: Date = new Date(this.form.value.dispatch_date);
  dispatchDate.setHours(0, 0, 0, 0);
  const formattedDate = formatDate(dispatchDate, 'yyyy-MM-dd HH:mm:ss', 'en-IN');

  const warrantyStart = this.form.value.warranty_start
    ? formatDate(new Date(this.form.value.warranty_start), 'yyyy-MM-dd', 'en-IN')
    : null;

  const warrantyEnd = this.form.value.warranty_end
    ? formatDate(new Date(this.form.value.warranty_end), 'yyyy-MM-dd', 'en-IN')
    : null;

  const basePayload = {
    id: this.data?.id,
    client_id: this.form.value.clientName,
    sub_client_id: 0,
    is_private: this.form.value.public ? 0 : 1,
    dispatch_status: this.form.value.status ? 'Y' : 'N',
    dispatch_date: formattedDate,
    dispatch_by: this.userId,
    status: this.form.value.status ? 'Y' : 'N',
    warranty_start: warrantyStart,
    warranty_end: warrantyEnd,
    created_by: this.userId,
    modify_by: this.userId
  };

  let payload: any;

  if (this.isEdit) {
    payload = {
      ...basePayload,
      charger_id: this.form.value.serialNo
    };
  } else {
    payload = {
      ...basePayload,
      charger_data: this.form.value.serialNo.map((id: number) => ({
        id,
        warranty_start: warrantyStart,
        warranty_end: warrantyEnd
      }))
    };
  }

  const apiCall = this.isEdit
    ? this.dispatchService.updateClientChargers(payload)
    : this.dispatchService.dispatchChargers(payload);

  apiCall.subscribe({
    next: (res) => {
      if(res.status === true){
        this.snackBar.open(
        this.isEdit ? 'Dispatch updated successfully!' : 'Dispatch created successfully!',
        'Close',
        { duration: 3000, panelClass: 'success-snackbar' }
      );
      this.dialogRef.close(true);
      }
      else{
        this.snackBar.open(`${res.message}`, 'Close', {duration: 4000});
      }
      
    },
    error: (err) => {
      console.error(`${this.isEdit ? 'Update' : 'Create'} failed:`, err);
      this.snackBar.open('Operation failed. Please try again.', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    }
  });
}

}