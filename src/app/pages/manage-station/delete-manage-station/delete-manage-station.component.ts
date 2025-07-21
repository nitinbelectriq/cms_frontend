import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-manage-station',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-manage-station.component.html',
  styleUrl: './delete-manage-station.component.scss'
})
export class DeleteManageStationComponent {
  constructor(
    public dialogRef : MatDialogRef<DeleteManageStationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:number}
  ){}

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close();
  }

}
