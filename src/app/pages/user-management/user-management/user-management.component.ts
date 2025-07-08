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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const loginid = this.authService.getUserId() || 0;
    this.fetchUsers(loginid);
  }

  fetchUsers(loginid: number): void {
    this.userService.getUsers(loginid).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data || []);
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
  if (!confirm('Are you sure you want to delete this user?')) return;

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
}