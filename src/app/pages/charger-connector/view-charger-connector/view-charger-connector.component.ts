import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connector-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './view-charger-connector.component.html',  // separate html file
  styleUrls: ['./view-charger-connector.component.scss']   // optional styles file
})
export class ConnectorViewDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConnectorViewDialogComponent>
  ) {}
}
