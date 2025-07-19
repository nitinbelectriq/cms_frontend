import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-manage-cpo',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogContent,
    MatButtonModule
  ],
  templateUrl: './delete-manage-cpo.component.html',
  styleUrl: './delete-manage-cpo.component.scss'
})
export class DeleteManageCpoComponent {

  constructor(
    public dialogRef : MatDialogRef<DeleteManageCpoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ){}

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close();
  }

}
