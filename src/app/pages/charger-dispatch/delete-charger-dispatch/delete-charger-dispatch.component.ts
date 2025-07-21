import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-charger-dispatch',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-charger-dispatch.component.html',
  styleUrl: './delete-charger-dispatch.component.scss'
})
export class DeleteChargerDispatchComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteChargerDispatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ){}

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close();
  }

}
