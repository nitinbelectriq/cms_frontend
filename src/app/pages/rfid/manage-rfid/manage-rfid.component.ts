import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RfidFormDialogComponent } from '../manage-rfid/create-component/create-component.component';
import { ViewRfidDialogComponent, RfidData } from './view-rfid-component/view-component.ts.component';
import { ManageRfidService } from '../../../services/manage-rfid.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DeleteManageRfidComponent } from './delete-manage-rfid/delete-manage-rfid.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-rfid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  templateUrl: './manage-rfid.component.html',
  styleUrls: ['./manage-rfid.component.scss']
})
export class ManageRfidComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['rfidNumber', 'expiryDate', 'status', 'action'];
  dataSource = new MatTableDataSource<RfidData>([]);
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private manageRfidService: ManageRfidService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadRfids();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  loadRfids() {
    this.manageRfidService.getAllRfids().pipe(
      catchError(err => {
        console.error('API call error:', err);
        this.snackBar.open('Failed to load RFID data', 'Close', { duration: 3000 });
        return of([]);
      })
    ).subscribe(response => {
      if (Array.isArray(response)) {
        this.dataSource.data = response;
        this.dataSource.filterPredicate = (data: RfidData, filter: string) => {
          const combined = `${data.rf_id_no} ${data.expiry_date} ${data.status}`.toLowerCase();
          return combined.includes(filter);
        };
      } else {
        console.error('Unexpected API response format:', response);
      }
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(RfidFormDialogComponent, {
      width: '88%',
      height: 'fit-content',
      position: { top: '0', right: '0' },
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.manageRfidService.createRfid(result).subscribe({
          next: () => {
            this.snackBar.open('RFID created successfully', 'Close', { duration: 3000 });
            this.loadRfids();
          },
          error: err => {
            console.error('Create error:', err);
            this.snackBar.open('Failed to create RFID', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onEdit(id: number) {
    const rfid = this.dataSource.data.find(x => x.id === id);
    if (!rfid) return;

    const dialogRef = this.dialog.open(RfidFormDialogComponent, {
      width: '88%',
      height: 'fit-content',
      position: { top: '0', right: '0' },
      data: rfid,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.manageRfidService.updateRfid(result).subscribe({
          next: () => {
            this.snackBar.open('RFID updated successfully', 'Close', { duration: 3000 });
            this.loadRfids();
          },
          error: err => {
            console.error('Update error:', err);
            this.snackBar.open('Failed to update RFID', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onView(id: number) {
    const rfid = this.dataSource.data.find(x => x.id === id);
    if (rfid) {
      this.dialog.open(ViewRfidDialogComponent, {
        data: rfid,
        width: '400px'
      });
    }
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DeleteManageRfidComponent, {
      data: id,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const userIdStr = localStorage.getItem('user_id');
        if (!userIdStr) {
          this.snackBar.open('User not logged in', 'Close', { duration: 3000 });
          return;
        }
        const userId = Number(userIdStr);

        this.manageRfidService.deleteRfid(id, userId).subscribe({
          next: () => {
            this.snackBar.open('RFID deleted successfully', 'Close', { duration: 3000 });
            this.loadRfids();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.snackBar.open('Failed to delete RFID', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
