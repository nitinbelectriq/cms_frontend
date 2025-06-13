
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-charger-connector',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule],
  templateUrl: './view-charger-connector.component.html',
  styleUrl: './view-charger-connector.component.scss'
})
export class ViewChargerConnectorComponent {

  constructor(
      public dialogRef: MatDialogRef<ViewChargerConnectorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    close(): void {
      this.dialogRef.close();
    }

}
