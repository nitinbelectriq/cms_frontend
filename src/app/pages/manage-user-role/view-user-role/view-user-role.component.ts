import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRole } from '../../../services/user-role.service';

@Component({
  selector: 'app-view-user-role',
  standalone: true,
  imports: [],
  templateUrl: './view-user-role.component.html',
  styleUrls: ['./view-user-role.component.scss']
})
export class ViewUserRoleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { role: UserRole }) {}
}
