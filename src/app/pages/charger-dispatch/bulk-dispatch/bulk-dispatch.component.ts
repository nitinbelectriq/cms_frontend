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
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class BulkDispatchComponent implements OnInit {
  form!: FormGroup;
  clients: any[] = [];
  userId: number = 0;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<BulkDispatchComponent>,
    private cd: ChangeDetectorRef
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
        this.setMessage('Failed to load clients.', 'error');
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.endsWith('.csv')) {
        this.setMessage('Only CSV files are allowed.', 'error');
        this.selectedFile = undefined;
        return;
      }
      this.selectedFile = file;
      this.setMessage('CSV file selected successfully.', 'success');
      this.cd.markForCheck();
    }
  }

submitBulkDispatch() {
  if (!this.form.valid) {
    this.setMessage('Please fill all required fields.', 'error');
    return;
  }

  if (!this.selectedFile) {
    this.setMessage('Please select a CSV file.', 'error');
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
      // Show backend message, success or failure message
      this.setMessage(res.message || 'Bulk dispatch successful!', 'success');

      // Close dialog after short delay only if success
      if (res.status) {
        setTimeout(() => this.dialogRef.close(true), 1500);
      }
    },
    error: (err) => {
      // Show backend error message or fallback
      const errMsg = err?.error?.message || 'Error during dispatch. Please try again.';
      this.setMessage(errMsg, 'error');
      console.error(err);
    },
  });
}


  setMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    this.cd.markForCheck();

    setTimeout(() => {
      this.message = '';
      this.cd.markForCheck();
    }, 5000);
  }

  onCancel() {
    this.dialogRef.close();
  }

  downloadSampleCsv() {
    const sampleCsv = `serial_no,charger_display_id
12345,CHG-001
67890,CHG-002
11223,CHG-003
`;

    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_bulk_dispatch.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }
}
