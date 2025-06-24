import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-viewdishpatchmanagement',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    
  ],
  templateUrl: './viewdishpatchmanagement.component.html',
  styleUrl: './viewdishpatchmanagement.component.scss'
})
export class ViewdishpatchmanagementComponent {
  constructor(
    public dialog: MatDialog,
    //public dialog : MatDialogRef<ViewdishpatchmanagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  close(){
    // this.dialog.close();
    this.dialog.closeAll();
  }

}
