import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-connector-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule,MatButtonModule],
  templateUrl: './view-charger-connector.component.html',  // separate html file
  styleUrls: ['./view-charger-connector.component.scss']   // optional styles file
})
export class ConnectorViewDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConnectorViewDialogComponent>
  ) {}
}
