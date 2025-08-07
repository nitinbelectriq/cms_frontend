// view-role.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-role',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule, MatButtonModule],
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss'],
})
export class ViewRoleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
