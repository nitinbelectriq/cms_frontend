import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({ 
  selector: 'app-delete-charger-model-dialog',
  standalone: true,
  templateUrl: './delete-charger-model-dialog.component.html',
  styleUrls: ['./delete-charger-model-dialog.component.scss'],
  imports: [MatDialogModule, CommonModule,
    MatButtonModule,
    MatIconModule,
    
  ]
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
