import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-station',
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
