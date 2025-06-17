import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({ 
  selector: 'app-delete-charger-model-dialog',
  standalone: true,
  templateUrl: './delete-charger-model-dialog.component.html',
  styleUrls: ['./delete-charger-model-dialog.component.scss'],
  imports: [MatDialogModule, CommonModule]
})
export class DeleteChargerModelDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteChargerModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
