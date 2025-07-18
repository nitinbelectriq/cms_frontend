// bulk-dispatch.component.ts
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DispatchService } from '../../../services/dispatch-charger.service';
import { AuthService } from '../../../services/login.service';

@Component({
  selector: 'app-bulk-dispatch',
  standalone: true,
  templateUrl: './bulk-dispatch.component.html',
  styleUrls: ['./bulk-dispatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class BulkDispatchComponent implements OnInit {
  form!: FormGroup;
  clients: any[] = [];
  userId: number = 0;
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<BulkDispatchComponent>,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() ?? 0;

    this.form = this.fb.group({
      clientName: ['', Validators.required],
      dispatch_date: ['', Validators.required],
      public: [true],
      status: [true],
    });

    this.loadClients();
  }

  loadClients() {
    this.dispatchService.getClients(this.userId).subscribe({
      next: (res) => {
        this.clients = res || [];
        this.cd.markForCheck();
      },
      error: () => {
        this.showMessage('Failed to load clients.', 'error');
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.endsWith('.csv')) {
        this.showMessage('Only CSV files are allowed.', 'error');
        this.selectedFile = undefined;
        return;
      }
      this.selectedFile = file;
      this.showMessage('CSV file selected successfully.', 'success');
      this.cd.markForCheck();
    }
  }

  submitBulkDispatch() {
    if (!this.form.valid) {
      this.showMessage('Please fill all required fields.', 'error');
      return;
    }

    if (!this.selectedFile) {
      this.showMessage('Please select a CSV file.', 'error');
      return;
    }

    const dispatchDate: Date = new Date(this.form.value.dispatch_date);
    dispatchDate.setHours(0, 0, 0, 0);
    const formattedDispatchDate = formatDate(
      dispatchDate,
      'yyyy-MM-dd HH:mm:ss',
      'en-IN'
    );

    const formData = new FormData();
    formData.append('client_id', this.form.value.clientName);
    formData.append('dispatch_date', formattedDispatchDate);
    formData.append('status', this.form.value.status ? 'Y' : 'N');
    formData.append('public', this.form.value.public ? '0' : '1');
    formData.append('dispatch_by', this.userId.toString());
    formData.append('file', this.selectedFile);

    this.dispatchService.dispatchChargers(formData).subscribe({
      next: (res) => {
        this.showMessage(res.message || 'Bulk dispatch successful!', 'success');
        if (res.status) {
          setTimeout(() => this.dialogRef.close(true), 1500);
        }
      },
      error: (err) => {
        const errMsg = err?.error?.message || 'Error during dispatch.';
        this.showMessage(errMsg, 'error');
      },
    });
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  downloadSampleCsv() {
    const sampleCsv = `serial_no,charger_display_id\n12345,CHG-001\n67890,CHG-002\n11223,CHG-003\n`;
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_bulk_dispatch.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
