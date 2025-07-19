import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-user-management.component.html',
  styleUrl: './delete-user-management.component.scss'
})
export class DeleteUserManagementComponent {
  constructor(
    public dialogref: MatDialogRef<DeleteUserManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ){}

  onConfirm(){
    this.dialogref.close(true);
  }

  onCancel(){
    this.dialogref.close();
  }

}
