// manage-role.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddNewRoleComponent } from './add-new-role/add-new-role.component';

@Component({
  selector: 'app-manage-role',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
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

  constructor(private dialog: MatDialog){};

  addRole() {
    // Add role logic (open dialog or navigate to add role page)
    //alert('Add New Role Clicked');
    this.dialog.open(AddNewRoleComponent,{
       width: '80%',
        height: 'fit-content',
        position: { top: '0', right: '0' }

    });
  }

  onEdit(id:any){
    this.dialog.open(AddNewRoleComponent,{
      width: '80%',
        height: 'fit-content',
        position: { top: '0', right: '0' }
    })

  }
}
