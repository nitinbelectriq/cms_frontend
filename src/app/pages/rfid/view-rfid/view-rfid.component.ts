import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-rfid',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule,MatDialogModule],
  templateUrl: './view-rfid.component.html',
  styleUrl: './view-rfid.component.scss'
})
export class ViewRfidComponent {
  constructor(public dialogRef: MatDialogRef<ViewRfidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
   ){}
   close(): void {
    this.dialogRef.close();

   }

}
