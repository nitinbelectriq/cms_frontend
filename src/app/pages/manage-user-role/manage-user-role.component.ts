import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AssignRoleComponent } from './assign-role/assign-role.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-user-role',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatToolbarModule,
    MatDialogModule,
    MatTableModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    FormsModule,
    
    

    
  ],
  templateUrl: './manage-user-role.component.html',
  styleUrl: './manage-user-role.component.scss'
})
export class ManageUserRoleComponent {
  
  displayedColumns: string[] = ['roleName', 'client', 'code',  'status', 'action'];
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
constructor(private dialog: MatDialog,){};
  assignRole(){
    // code
    this.dialog.open(AssignRoleComponent,{
      width: '80%',
      height: 'fit-content',
      position: {
        top: '0',
        right: '0',
      }
    });
  }

  onEdit(id:any){
    //
  }

}
