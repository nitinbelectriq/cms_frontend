import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // for date pipe
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-cpo-rfid',
  standalone: true,
  imports: [
    CommonModule,       // provides built-in pipes like 'date'
    MatDialogModule,    // provides <mat-dialog-content>, <mat-dialog-actions>, etc.
    MatButtonModule,    // for mat-button
  ],
  templateUrl: './view-cpo-rfid.component.html',
  styleUrls: ['./view-cpo-rfid.component.scss'],
})
export class ViewCpoRfidComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewCpoRfidComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
