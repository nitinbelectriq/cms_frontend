import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AssignRoleComponent } from './assign-role/assign-role.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

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
    MatCardModule,

    MatInputModule,
  ],
  templateUrl: './manage-user-role.component.html',
  styleUrl: './manage-user-role.component.scss'
})
export class ManageUserRoleComponent {
  
  displayedColumns: string[] = ['roleName', 'client', 'code',  'status', 'action'];
  dataSource =new MatTableDataSource([
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
  ]);

  searchText='';
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

  downloadCSV(){
    const arr= [];
    const headers= [
      'Role Name', 'Client', 'Code', 'Status'
    ];
    arr.push(headers.join(','));

    this.dataSource.data.forEach((rows: any)=>{
      const rowData= [
        `"${rows.roleName}"`,
        `"${rows.client}"`,
        `"${rows.code}"`,
        `"${rows.status}"`
      ];
      arr.push(rowData.join(','));
    });

     // Create CSV blob and download
  const csvContent = arr.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'role-user-data.csv';
  a.click();
  URL.revokeObjectURL(url);



  }

    applyFilter() {
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    const combined = `${data.roleName} ${data.client} ${data.code} ${data.status} `.toLowerCase();
    return combined.includes(filter);
  };

  this.dataSource.filter = this.searchText.trim().toLowerCase();
}


    private mapStatus(statusCode: string): string {
    switch (statusCode) {
      case 'Y': return 'Active';
      case 'N': return 'Inactive';
      default: return 'Unknown';
    }
  }

}
