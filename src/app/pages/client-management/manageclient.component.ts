import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClientService } from '../../services/client-management.service';
import { AuthService } from '../../services/login.service';
import { CreatemanageclientComponent } from './createmanageclient/createmanageclient.component';
import { ViewmanageclientComponent } from './viewmanageclient/viewmanageclient.component'; // ✅ Add this
import { DeleteClientManagementComponent } from './delete-client-management/delete-client-management.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-manageclient',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule

  ],
  templateUrl: './manageclient.component.html',
  styleUrls: ['./manageclient.component.scss']
})
export class ManageclientComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['clientName', 'contactPerson', 'GSTIN', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  snackBar= inject(MatSnackBar);
  searchText= '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const loginId = this.authService.getUserId();
    if (loginId) {
      this.loadClients(loginId);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

     downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = [' Name', 'Contact Person Name','Email','Mobile',
    'Description','GST Number', 
    'TIN Number', 'City',
    'State','Address','Created Date','Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
   // console.log('row :', row);
    const rowData = [
     
      `"${row.name}"`,
      `"${row.cp_name}"`,
      `"${row.email}"`,
      `"${row.mobile}"`,
      `"${row.description}"`,
      `"${row.gst_no}"`,
      
      `"${row.tin_no}"`,
      
      `"${row.city_name}"`,
      `"${row.state_name}"`,
      
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
  a.download = 'client-data.csv';
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

  loadClients(loginId: number) {
    this.clientService.getClients(loginId).subscribe({
      next: (clients: any[]) => {
        this.dataSource.data = clients;
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const combined = `${data.cp_name} ${data.name} ${data.gst_no} ${this.mapStatus(data.status)}`.toLowerCase();
          return combined.includes(filter);
        }
      },
      error: (error: any) => {
        console.error('Failed to load clients', error);
      }
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreatemanageclientComponent, {
      width: '88%',
      height: '100vh',
      position: {
        top: '0',
        right: '0',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loginId = this.authService.getUserId();
        if (loginId) {
          this.loadClients(loginId);
        }
      }
    });
  }

  // ✅ FIXED: Open the View dialog
  onView(id: number) {
    const selectedClient = this.dataSource.data.find(c => c.id === id);
    if (selectedClient) {
      this.dialog.open(ViewmanageclientComponent, {
        width: '600px',
        data: selectedClient
      });
    } else {
      console.error('Client not found for ID:', id);
    }
  }

 onEdit(client: any) {
  const dialogRef = this.dialog.open(CreatemanageclientComponent, {
    width: '88%',
    height: '100vh',
    position: {
      top: '0',
      right: '0',
    },
    data: client
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const loginId = this.authService.getUserId();
      if (loginId) {
        this.loadClients(loginId);
      }
    }
  });
}


onDelete(id: number) {
  const dialogRef = this.dialog.open(DeleteClientManagementComponent,{
    data: id,
  });

  dialogRef.afterClosed().subscribe(result =>{
    if(result === true){
      this.clientService.deleteClient(id).subscribe({
        next: (res) => {
         // alert('Client deleted successfully');
          const loginId = this.authService.getUserId();
          if (loginId) {
            this.loadClients(loginId); // Refresh list
          }
          this.snackBar.open('Charger Model deleted successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          //alert('Failed to delete the client.');
          this.snackBar.open('Failed to delete Charger Model!', 'Close', {
            duration: 3000,
          });
        }
      })
    }
  })
  // if (confirm('Are you sure you want to delete this client?')) {
  //   this.clientService.deleteClient(id).subscribe({
  //     next: (res) => {
  //       alert('Client deleted successfully');
  //       const loginId = this.authService.getUserId();
  //       if (loginId) {
  //         this.loadClients(loginId); // Refresh list
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error deleting client:', error);
  //       alert('Failed to delete the client.');
  //     }
  //   });
  // }
}

}
