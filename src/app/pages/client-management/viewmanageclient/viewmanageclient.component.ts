import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-viewmanageclient',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './viewmanageclient.component.html',
  styleUrls: ['./viewmanageclient.component.scss']
})
export class ViewmanageclientComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
