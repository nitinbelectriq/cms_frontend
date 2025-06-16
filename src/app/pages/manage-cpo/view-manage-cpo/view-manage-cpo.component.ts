import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-view-manage-cpo',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    

  ],
  templateUrl: './view-manage-cpo.component.html',
  styleUrl: './view-manage-cpo.component.scss'
})
export class ViewManageCpoComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewManageCpoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  close(){
    this.dialogRef.close();
  }

}
