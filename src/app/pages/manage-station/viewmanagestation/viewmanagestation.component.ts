import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-viewmanagestation',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule

  ],
  templateUrl: './viewmanagestation.component.html',
  styleUrl: './viewmanagestation.component.scss'
})
export class ViewmanagestationComponent {
  constructor(
    private dailogRef: MatDialogRef<ViewmanagestationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){

  }

  close(){
    this.dailogRef.close();

  }

}
