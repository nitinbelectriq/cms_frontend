import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Custom
import { RoleService } from '../../services/manage-role.service';
import { ViewRoleComponent } from '../manage-role/view-role/view-role.component'; // adjust path as needed
import { MatCardModule } from '@angular/material/card';
import { AddNewRoleComponent } from './add-new-role/add-new-role.component';

interface RoleViewModel {
  roleName: string;
  client: string;
  code: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-manage-role',
  standalone: true,
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule
  ]
})
export class ManageRoleComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['roleName', 'client', 'code', 'description', 'status', 'action'];
  dataSource = new MatTableDataSource<RoleViewModel>([]);
  filterValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private roleService: RoleService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id') || '';
    const projectId = localStorage.getItem('project_id') || '';

    if (userId && projectId) {
      this.roleService.getRolesCW(userId, projectId).subscribe({
        next: (res) => {
          if (res?.data) {
            const roles: RoleViewModel[] = res.data.map((r) => ({
              roleName: r.name,
              client: r.client_name,
              code: r.code,
              description: r.description || '-',
              status: r.status === 'Y' ? 'Active' : 'Inactive',
            }));
            this.dataSource.data = roles;
          }
        },
        error: (err) => {
          console.error('Error fetching roles:', err);
        }
      });
    }

    this.dataSource.filterPredicate = (data: RoleViewModel, filter: string) => {
      const dataStr = `${data.roleName} ${data.client} ${data.code} ${data.description} ${data.status}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addRole(): void {
    //alert('Add new role clicked!');
    this.dialog.open(AddNewRoleComponent,{
      width: '80%',
      height: 'fit-content',
      position: {
        top: '0',
        right: '0',
      }

    });
  }

  viewRole(row: RoleViewModel): void {
    this.dialog.open(ViewRoleComponent, {
      width: '400px',
      data: row
    });
  }
  editRole(row: RoleViewModel) {
  alert(`Edit Role: ${row.roleName}`);
  // TODO: implement edit logic
}

deleteRole(row: RoleViewModel) {
  const confirmed = confirm(`Are you sure you want to delete role "${row.roleName}"?`);
  if (confirmed) {
    alert(`Deleting role: ${row.roleName}`);
    // TODO: call delete API and refresh table data
  }
}


  downloadCSV(){
    const csvRows= [];
    const headers= [ 'Role Name', 'Client Name', 'Code', 'Description', 'Status'];
    csvRows.push(headers.join(','));

    this.dataSource.data.forEach((rows:any)=>{
      const rowdata= [
        `"${rows.roleName}"`,
        `"${rows.client}"`,
        `"${rows.code}"`,
        `"${rows.description}"`,
        `"${rows.status}"`
      ];
      csvRows.push(rowdata.join(','));
    });
    // Create CSV blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'role-data.csv';
  a.click();
  URL.revokeObjectURL(url);

  }
}
