import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {  MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-manage-charger',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './delete-manage-charger.component.html',
  styleUrl: './delete-manage-charger.component.scss'
})
export class DeleteManageChargerComponent {

  constructor(
    public dialogref: MatDialogRef<DeleteManageChargerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
  ){}

  onConfirm(){
    this.dialogref.close(true);
  }

  onCancel(){
    this.dialogref.close(false);
  }
}
