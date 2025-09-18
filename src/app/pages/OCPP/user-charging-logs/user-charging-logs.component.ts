import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-user-charging-logs',
  standalone: true,
  imports: [
    CommonModule,
   // MatTableDataSource,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    MatToolbarModule,
    MatToolbarModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        FormsModule,
  
  ],
  templateUrl: './user-charging-logs.component.html',
  styleUrl: './user-charging-logs.component.scss'
  
})
export class UserChargingLogsComponent {

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
    dataSource = new MatTableDataSource<any>();

    private dialog = inject(MatDialog);
      private snackBar = inject(MatSnackBar);
      searchText = '';
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;

      onCreate(){

      }

      onView(id:any){

      }

      onEdit(id:any){

      }

      onDelete(id: any){

      }

      downloadCSV(){

      }

      applyFilter(){

      }

}
