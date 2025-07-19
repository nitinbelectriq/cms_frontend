import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-manage-rfid',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-manage-rfid.component.html',
  styleUrl: './delete-manage-rfid.component.scss'
})
export class DeleteManageRfidComponent {

  constructor(
    public dialogRef : MatDialogRef<DeleteManageRfidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ){}

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close();
  }

}
