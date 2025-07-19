import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-manage-cpo-rfid',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-manage-cpo-rfid.component.html',
  styleUrl: './delete-manage-cpo-rfid.component.scss'
})
export class DeleteManageCpoRfidComponent {

  constructor(
    public dialogRef : MatDialogRef<DeleteManageCpoRfidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ){}

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close();
  }

}
