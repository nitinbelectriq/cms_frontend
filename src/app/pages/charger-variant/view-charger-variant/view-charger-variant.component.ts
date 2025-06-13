import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-view-charger-variant',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './view-charger-variant.component.html',
  styleUrl: './view-charger-variant.component.scss'
})
export class ViewChargerVariantComponent {
  constructor(
        public dialogRef: MatDialogRef<ViewChargerVariantComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) {}
    
      close(): void {
        this.dialogRef.close();
      }
  

}
