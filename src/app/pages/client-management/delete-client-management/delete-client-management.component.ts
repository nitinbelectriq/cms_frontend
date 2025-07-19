import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-client-management',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-client-management.component.html',
  styleUrl: './delete-client-management.component.scss'
})
export class DeleteClientManagementComponent {
  constructor(
    public dialogRef : MatDialogRef<DeleteClientManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ){}

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close();
  }

}
