import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { UserService, User } from '../../../services/user-management.service';
import { AuthService } from '../../../services/login.service';
import { ViewUserComponent } from '../view-user/view-user.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { DeleteUserManagementComponent } from '../delete-user-management/delete-user-management.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,

  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class ManageUserComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'employeeCode',
    'email',
    'mobile',
    'userName',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<User>();

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const loginid = this.authService.getUserId() || 0;
    this.fetchUsers(loginid);
  }

     downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['First Name','Midle Name','Last Name','Username','Email','DoB','Employee code','Role',
    'Aadhar','PAN Card','Mobile','Alternate mobile number',
   'Address','Created Date','Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    //console.log('row :', row);
    const rowData = [
     
      `"${row.f_name}"`,
      `"${row.m_name}"`,
      `"${row.l_name}"`,
       `"${row.username}"`,
      `"${row.email}"`,
      
      `"${row.dob}"`,
     
      `"${row.employee_code}"`,
      `"${row.role_name}"`,
      
      `"${row.aadhar}"`,
      `"${row.PAN}"`,
      `"${row.mobile}"`,
      `"${row.alt_mobile}"`,
      
      
     
      `"${row.address1}"`,
      `"${row.created_date}"`,
      
      row.status == 'Y' ? 'Active' : 'Inactive' 
    ];
    csvRows.push(rowData.join(','));
  });

  // Create CSV blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'user-data.csv';
  a.click();
  URL.revokeObjectURL(url);
}



    applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

    private mapStatus(statusCode: string): string {
    switch (statusCode) {
      case 'Y': return 'Active';
      case 'N': return 'Inactive';
      default: return 'Unknown';
    }
  }

  fetchUsers(loginid: number): void {
    this.userService.getUsers(loginid).subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res.data || []);
        this.dataSource.filterPredicate = (data:any , filter: string) => {
          const combined = `${data.username} ${data.f_name}  ${data.l_name} ${data.mobile} ${data.employee_code}`.toLowerCase();
          return combined.includes(filter);
        }
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  onView(id: number): void {
    const user = this.dataSource.data.find((u) => u.id === id);
    if (user) {
      this.dialog.open(ViewUserComponent, {
        data: user,
        width: '500px',
      });
    }
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '88%',
      height: '100vh',
      position: {
        top: '0',
        right: '0',
      },
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
        this.fetchUsers(this.authService.getUserId() || 0);
      }
    });
  }

  onEdit(id: number): void {
    const user = this.dataSource.data.find((u) => u.id === id);
    if (!user) return;

    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '88%',
      height: '100vh',
      position: {
        top: '0',
        right: '0',
      },
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.fetchUsers(this.authService.getUserId() || 0);
      }
    });
  }

onDelete(id: number): void {
  const dialogRef = this.dialog.open(DeleteUserManagementComponent,{
    data: id,
  });

  dialogRef.afterClosed().subscribe(result =>{
    if(result === true){
const loginUserId = Number(localStorage.getItem('user_id'));

  this.userService.deleteUser(id, loginUserId).subscribe({
    next: (res) => {
      if (res?.status) {
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.fetchUsers(loginUserId); // Refresh the table
      } else {
        this.snackBar.open(res?.message || 'Delete failed', 'Close', { duration: 3000 });
      }
    },
    error: () => {
      this.snackBar.open('Server error', 'Close', { duration: 3000 });
    }
  });
    }
  })
  //if (!confirm('Are you sure you want to delete this user?')) return;

  
}
}