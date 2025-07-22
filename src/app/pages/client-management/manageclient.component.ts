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
    MatSnackBarModule
  ],
  templateUrl: './manageclient.component.html',
  styleUrls: ['./manageclient.component.scss']
})
export class ManageclientComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['clientName', 'contactPerson', 'GSTIN', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  snackBar= inject(MatSnackBar);

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

  loadClients(loginId: number) {
    this.clientService.getClients(loginId).subscribe({
      next: (clients: any[]) => {
        this.dataSource.data = clients;
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
