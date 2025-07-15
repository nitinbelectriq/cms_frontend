import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-charger-variant',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatButtonModule],
  templateUrl: './delete-charger-variant.component.html',
  styleUrls: ['./delete-charger-variant.component.scss']
})
export class DeleteChargerVariantComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteChargerVariantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
