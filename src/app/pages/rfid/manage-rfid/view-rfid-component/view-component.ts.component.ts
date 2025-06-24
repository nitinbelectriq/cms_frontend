import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // <-- Added MatDialogModule here
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface RfidData {
  id: number;
  rf_id_no: string;
  expiry_date: string;
  status: string;
  name?: string | null;
  description?: string | null;
  created_date?: string | null;
  createdby?: number | null;
  modifyby?: number | null;
  modify_date?: string | null;
}

@Component({
  selector: 'app-view-rfid-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>RFID Details</h2>
    <mat-dialog-content>
      <p><strong>RFID Number:</strong> {{ data.rf_id_no }}</p>
      <p><strong>Expiry Date:</strong> {{ data.expiry_date | date:'mediumDate' }}</p>
      <p><strong>Status:</strong> {{ data.status === 'Y' ? 'Active' : 'Inactive' }}</p>
    
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Close</button>
    </mat-dialog-actions>
  `
})
export class ViewRfidDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RfidData,
    private dialogRef: MatDialogRef<ViewRfidDialogComponent>
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
