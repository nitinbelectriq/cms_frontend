
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-manage-charger',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule],
  templateUrl: './view-manage-charger.component.html',
  styleUrl: './view-manage-charger.component.scss'
})
export class ViewManageChargerComponent {

  constructor(
    public dialogRef: MatDialogRef<ViewManageChargerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }


}
