import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ConnectorService } from '../../services/charger-connector.service';
import { ConnectorViewDialogComponent } from './view-charger-connector/view-charger-connector.component';
import { CreateChargerConnectorComponent } from './create-charger-connector/create-charger-connector.component';
import { AuthService } from '../../services/login.service';
import { DeleteChargerConectorComponent } from './delete-charger-conector/delete-charger-conector.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

interface ConnectorModel {
  id: number;
  vehicleModel: string;
  connectorType: string;
  vehicleType: string;
  status: string;
  modelImageUrl: string;
}

@Component({
  selector: 'app-charger-connector',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
     MatFormFieldModule,  
    MatInputModule ,
    MatCardModule
  ],
  templateUrl: './charger-connector.component.html',
  styleUrls: ['./charger-connector.component.scss']
})
export class ChargerConnectorComponent implements OnInit {

  displayedColumns: string[] = ['vehicleModel', 'connectorType', 'vehicleType', 'status', 'action'];
  dataSource = new MatTableDataSource<ConnectorModel>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private connectorService: ConnectorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadConnectorData();

    // Custom filter predicate for global search across multiple columns
    this.dataSource.filterPredicate = (data: ConnectorModel, filter: string) => {
      const dataStr = `${data.vehicleModel} ${data.connectorType} ${data.vehicleType} ${data.status}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  loadConnectorData(): void {
    this.connectorService.getAllConnectors().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          const mappedData: ConnectorModel[] = res.map(item => ({
            id: item.id,
            vehicleModel: item.vm_name,
            connectorType: item.ct_name,
            vehicleType: item.vType_name,
            status: this.mapStatus(item.status),
            modelImageUrl: item.model_image_url
          }));

          this.dataSource.data = mappedData;
          this.dataSource.paginator = this.paginator;
        } else {
          this.snackBar.open('Unexpected response format.', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error fetching connector data.', 'Close', { duration: 3000 });
      }
    });
  }

  private mapStatus(statusCode: string): string {
    switch (statusCode) {
      case 'Y': return 'Active';
      case 'N': return 'Inactive';
      default: return 'Unknown';
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // download data function

     downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['Vehicle Model', 'Connector Type	', 'Vehicle Type', 'Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    const rowData = [
      `"${row.vehicleModel}"`,
      `"${row.connectorType}"`,
      `"${row.vehicleType}"`,
      `"${row.vehicleType}"`,
      `"${row.vehicleType}"`,
      `"${row.vehicleType}"`,
      row.status 
    ];
    csvRows.push(rowData.join(','));
  });

  // Create CSV blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'charger-connector-data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

  onCreate(): void {
    const dialogRef = this.dialog.open(CreateChargerConnectorComponent, {
      width: '88%',
      height: 'fit-content',
      position: {
        top: '0',
        right: '0',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.snackBar.open('Connector created successfully.', 'Close', { duration: 2000 });
        this.loadConnectorData();
      }
    });
  }

  onView(id: number): void {
    const selected = this.dataSource.data.find(item => item.id === id);
    if (selected) {
      this.dialog.open(ConnectorViewDialogComponent, {
        width: '400px',
        data: selected
      });
    }
  }

  onEdit(id: number): void {
    const selected = this.dataSource.data.find(item => item.id === id);
    if (selected) {
      const dialogRef = this.dialog.open(CreateChargerConnectorComponent, {
        width: '88%',
        height: 'fit-content',
        position: {
          top: '0',
          right: '0',
        },
        data: selected
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.snackBar.open('Connector updated successfully.', 'Close', { duration: 2000 });
          this.loadConnectorData();
        }
      });
    }
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(DeleteChargerConectorComponent, {
      data: id,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const userId = this.authService.getUserId();

        if (userId === null || userId === undefined) {
          this.snackBar.open('User not logged in.', 'Close', { duration: 3000 });
          return;
        }

        this.connectorService.deleteMapping(id, userId).subscribe({
          next: () => {
            this.snackBar.open('Connector mapping deleted successfully.', 'Close', { duration: 3000 });
            this.loadConnectorData();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.snackBar.open('Failed to delete connector mapping.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
