import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CreateManageChargerComponent } from './create-manage-charger/create-manage-charger.component';
import { ViewManageChargerComponent } from './view-manage-charger/view-manage-charger.component';
import { ChargerService, Charger } from '../../services/manage-charger.service';
import { DeleteManageChargerComponent } from './delete-manage-charger/delete-manage-charger.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-manage-chargers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule

  ],
  templateUrl: './manage-charger.component.html',
  styleUrls: ['./manage-charger.component.scss']
})
export class ManageChargersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['clientName', 'name', 'serialNo', 'modelName', 'status', 'action'];
  dataSource = new MatTableDataSource<Charger>([]);
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private chargerService: ChargerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

       downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['Serial No	','Charger Name','Batch id','Batch Name',
    'Model Name','No. of Guns', 'Client Name',
    'Version Name','Station Id', 'Station Name', 'City',
    'State','OTA Config','Periodic Check Ref Time','Periodicity in hours','charger status','When to Upgrade','is_available','Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    const rowData = [
      `"${row.serial_no}"`,
      `"${row.name}"`,
      `"${row.batch_id}"`,
       `"${row.charger_batch_name}"`,
      `"${row.model_name}"`,
      `"${row.no_of_guns}"`,
      `"${row.clientName}"`,
      `"${row.version_name}"`,
      `"${row.station_id}"`,
      `"${row.station_name}"`,
      `"${row.city_name}"`,
      `"${row.state_name}"`,
      `"${row.OTA_Config}"`,
      `"${row.Periodic_Check_Ref_Time}"`,
      `"${row.Periodicity_in_hours}"`,
      `"${row.charger_status}"`,
      `"${row.When_to_Upgrade}"`,
      row.is_available== '1'? 'YES' : 'NO',
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
  a.download = 'charger-data.csv';
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

 loadData(): void {
  this.chargerService.getChargers().subscribe({
    next: (res) => {
      
      if (res.status && Array.isArray(res.data)) {
        // Set clientName = 'Belectriq' for each item
        const transformedData = res.data.map(item => ({
          ...item,
          clientName: 'Belectriq'
        }));
        this.dataSource.data = transformedData;
        //console.log(this.dataSource.data)

        this.dataSource.filterPredicate = (data: any, filter: string) => {
             const combined = `${data.clientName} ${data.model_name} ${data.id} ${data.serial_no} ${data.name} ${this.mapStatus(data.status)}`.toLowerCase();
               console.log(data.serial_no, data.name);
                return combined.includes(filter);
                
           };
        console.log(transformedData);


      } else {
        this.dataSource.data = [];
        this.snackBar.open('No data found', 'Close', { duration: 3000 });
      }
    },
    error: (err) => {
      console.error('Error fetching chargers:', err);
      this.snackBar.open('Failed to load chargers', 'Close', { duration: 3000 });
    }
  });
}


  onEdit(id: number): void {
    const selectedItem = this.dataSource.data.find(item => item.id === id);
    if (selectedItem) {
      const dialogRef = this.dialog.open(CreateManageChargerComponent, {
        data: selectedItem,
        width: '88%',
      height: 'fit-content',
      position: {
        top: '0',
        right: '0',
      },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadData();
      });
    }
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(DeleteManageChargerComponent, {
      data: id,
    })

    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
        this.chargerService.deleteCharger(id).subscribe({
              next: (res) => {
                this.snackBar.open(res.message || 'Charger deleted successfully.', 'Close', { duration: 3000 });
                this.loadData();
              },
              error: (err) => {
                this.snackBar.open(err?.error?.message || 'Failed to delete charger', 'Close', { duration: 3000 });
              }
            });
      }
    })
    // if (confirm('Are you sure you want to delete this charger?')) {
    //   this.chargerService.deleteCharger(id).subscribe({
    //     next: (res) => {
    //       this.snackBar.open(res.message || 'Charger deleted successfully.', 'Close', { duration: 3000 });
    //       this.loadData();
    //     },
    //     error: (err) => {
    //       this.snackBar.open(err?.error?.message || 'Failed to delete charger', 'Close', { duration: 3000 });
    //     }
    //   });
    // }
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(CreateManageChargerComponent, {
      width: '88%',
      height: 'fit-content',
      position: {
        top: '0',
        right: '0',
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  onView(id: number): void {
    const selectedItem = this.dataSource.data.find(item => item.id === id);
    if (selectedItem) {
      this.dialog.open(ViewManageChargerComponent, {
        data: selectedItem,
        width: '400px',
      });
    }
  }

}
