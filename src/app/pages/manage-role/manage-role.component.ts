// manage-role.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-role',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRoleComponent {
  displayedColumns: string[] = ['roleName', 'client', 'code', 'description', 'status', 'action'];
  dataSource = [
    {
      roleName: 'Admin',
      client: 'Client A',
      code: 'ADM001',
      description: 'Full access',
      status: 'Active',
    },
    {
      roleName: 'Viewer',
      client: 'Client B',
      code: 'VWR002',
      description: 'Read-only access',
      status: 'Inactive',
    }
  ];

  addRole() {
    // Add role logic (open dialog or navigate to add role page)
    alert('Add New Role Clicked');
  }
}
