import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ManageRfidService } from '../../../services/cpo-rfid-mapping.service';
import { AuthService } from '../../../services/login.service';
import { ViewCpoRfidComponent } from '../manage-cpo-rfid/view-cpo-rfid/view-cpo-rfid.component';
import { CreateCpoRfidComponent } from '../manage-cpo-rfid/create-cpo-rfid/create-cpo-rfid.component'; // ✅ Correct import
import { DeleteManageCpoRfidComponent } from './delete-manage-cpo-rfid/delete-manage-cpo-rfid.component';

interface RfidRecord {
  id: number;
  clientName: string;
  cpoName: string;
  rfidNo: string;
  status: 'Y' | 'N';
  expiryDate?: string;
  client_id?: number;
  cpo_id?: number;
  rfid_id?: number;
}

@Component({
  selector: 'app-manage-cpo-rfid',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './manage-cpo-rfid.component.html',
  styleUrls: ['./manage-cpo-rfid.component.scss'],
})
export class ManageCpoRfidComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['clientName', 'cpoName', 'rfidNo', 'status', 'action'];
  dataSource = new MatTableDataSource<RfidRecord>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentLoginId: string = '';

  constructor(
    private manageRfidService: ManageRfidService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentLoginId =
      this.authService.getUserId()?.toString() ||
      localStorage.getItem('login_id') ||
      'default_id';
    this.loadData(this.currentLoginId);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(login_id: string) {
    this.manageRfidService.getCpoRFidMapping(login_id).subscribe({
      next: (res: any[]) => {
        const mappedData: RfidRecord[] = res.map(item => ({
          id: item.map_id,
          clientName: item.client_name,
          cpoName: item.cpo_name,
          rfidNo: item.rf_id_no,
          status: item.status,
          expiryDate: item.expiry_date,
          client_id: item.client_id,
          cpo_id: item.cpo_id,
          rfid_id: item.rf_id,
        }));
        this.dataSource.data = mappedData;
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });
  }

  onView(id: number) {
    const record = this.dataSource.data.find(item => item.id === id);
    if (!record) {
      console.error('Record not found for id:', id);
      return;
    }

    this.dialog.open(ViewCpoRfidComponent, {
      width: '400px',
      data: record,
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateCpoRfidComponent, {
      width: '88%',
      height: 'fit-content',
      position: {
        top: '0',
        right: '0',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData(this.currentLoginId);
      }
    });
  }

onEdit(id: number) {
  console.log('Edit button clicked, id:', id);
  const record = this.dataSource.data.find(r => r.id === id);
  console.log('Record found:', record);
  if (!record) return;

  const dialogRef = this.dialog.open(CreateCpoRfidComponent, {
    width: '88%',
    height: 'fit-content',
    position: {
      top: '0',
      right: '0',
    },
    data: record,
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadData(this.currentLoginId);
    }
  });
}



onDelete(id: number) {

  const dialogRef = this.dialog.open(DeleteManageCpoRfidComponent,{
    data: id,
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result=== true){
      if (!id) return;

      const userId = Number(this.currentLoginId);
    
      if (!userId) {
        this.snackBar.open('User ID not found. Please login again.', 'Close', { duration: 3000 });
        return;
      }


      this.manageRfidService.deleteCpoRfidMapping(id, userId).subscribe({
        next: (res: any) => {
          if (res.status === true) {
            this.snackBar.open('RFID mapping deleted successfully!', 'Close', { duration: 3000 });
            this.loadData(this.currentLoginId);
          } else {
            this.snackBar.open('Delete failed: ' + (res.message || 'Unknown error'), 'Close', { duration: 5000 });
          }
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.snackBar.open('Error occurred while deleting RFID mapping.', 'Close', { duration: 3000 });
        },
      });
    }
  })
  // if (!id) return;

  // const userId = Number(this.currentLoginId);

  // if (!userId) {
  //   this.snackBar.open('User ID not found. Please login again.', 'Close', { duration: 3000 });
  //   return;
  // }

  // if (!confirm('Are you sure you want to delete this RFID mapping?')) {
  //   return;
  // }

  // this.manageRfidService.deleteCpoRfidMapping(id, userId).subscribe({
  //   next: (res: any) => {
  //     if (res.status === true) {
  //       this.snackBar.open('RFID mapping deleted successfully!', 'Close', { duration: 3000 });
  //       this.loadData(this.currentLoginId);
  //     } else {
  //       this.snackBar.open('Delete failed: ' + (res.message || 'Unknown error'), 'Close', { duration: 5000 });
  //     }
  //   },
  //   error: (err) => {
  //     console.error('Delete error:', err);
  //     this.snackBar.open('Error occurred while deleting RFID mapping.', 'Close', { duration: 3000 });
  //   },
  // });
}


}
