import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-station',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  
    ],
  templateUrl: './viewmanagestation.component.html',
  styleUrls: ['./viewmanagestation.component.scss']
})
export class ViewStationComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ViewStationComponent>);

  close() {
    this.dialogRef.close();
  }
}
