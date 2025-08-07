import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/login.service';
import { StationService } from '../../services/manage-station.service';

import { CreatemanagestationComponent } from './createmanagestation/createmanagestation.component';
import { ViewStationComponent } from './viewmanagestation/viewmanagestation.component';
import { DeleteManageStationComponent } from './delete-manage-station/delete-manage-station.component';
import { MatCardModule } from '@angular/material/card';
import { ChargerStationMappingComponent } from '../manage-station/charger-station-mapping/charger-station-mapping.component'; // adjust path if needed

@Component({
  selector: 'app-managestation',
  standalone: true,
  templateUrl: './managestation.component.html',
  styleUrls: ['./managestation.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatCardModule,
    FormsModule,
    MatTooltipModule
  ]
})
export class ManagestationComponent implements OnInit, AfterViewInit {
  private snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private stationService = inject(StationService);
  private authService = inject(AuthService);
  searchText = '';

  filterform: FormGroup = this.fb.group({
    client: [''],
    cpo: [''],
    chargingstations: ['']
  });

  displayedColumns: string[] = [
    'stationName',
    'contactperson',
    'cpo',
    'stationcode',
    'chargercount',
    'address',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  loadData() {
    const user_id = this.authService.getUserId() || 0;
    if (!user_id) {
      console.error('User ID not found');
      return;
    }

    this.stationService.getAllStations(user_id).subscribe({
      next: (response) => {
        const stations = (response?.data || []).map((item: any) => ({
          stationName: item.name,
          contactperson: item.cp_name,
          cpo: item.cpo_name,
          stationcode: item.code,
          chargercount: item.total_chargers,
          address: `${item.address1 || ''}, ${item.address2 || ''}, ${item.city_name || ''}, ${item.state_name || ''}, ${item.country_name || ''} - ${item.PIN || ''}`,
          status: item.status === 'Y',
          raw: item
        }));

        this.dataSource.data = stations;
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const combined = `${data.stationName} ${data.contactperson} ${data.cpo} ${data.stationcode}`.toLowerCase();
          return combined.includes(filter);
        };
      },
      error: (error) => {
        console.error('Failed to load charging stations', error);
      }
    });
  }

  downloadCSV() {
    const csvRows = [];
    const headers = ['Station Name', 'Contact Person', 'CPO', 'Station Code', 'Charger Count', 'Address', 'Status'];
    csvRows.push(headers.join(','));

    this.dataSource.data.forEach((row: any) => {
      const rowData = [
        `"${row.stationName}"`,
        `"${row.contactperson}"`,
        `"${row.cpo}"`,
        `"${row.stationcode}"`,
        `"${row.chargercount}"`,
        `"${row.address}"`,
        row.status ? 'Active' : 'Inactive'
      ];
      csvRows.push(rowData.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'station-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreatemanagestationComponent, {
      height: '100vh',
      width: '92vw',
      position: { top: '0', right: '0' },
      data: { edit: false }
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (formData) {
        const userId = this.authService.getUserId();
        const payload = {
          ...formData,
          created_by: userId,
          status: formData.status ? 'Y' : 'N',
          created_date: new Date().toISOString()
        };

        this.stationService.createStation(payload).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error('Error creating station:', err)
        });
      }
    });
  }

  onEdit(element: any) {
    const dialogRef = this.dialog.open(CreatemanagestationComponent, {
      height: '100vh',
      width: '92vw',
      position: { top: '0', right: '0' },
      data: { edit: true, station: element.raw }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  onView(element: any) {
    this.dialog.open(ViewStationComponent, {
      width: '600px',
      data: element.raw
    });
  }

  onDelete(id: string | number): void {
    if (!id) return;
    const dialogRef = this.dialog.open(DeleteManageStationComponent, { data: id });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const stationId = typeof id === 'string' ? +id : id;
        this.stationService.deleteStation(stationId).subscribe({
          next: () => {
            this.snackBar.open('Station deleted successfully.', 'Close', {
              duration: 3000,
              panelClass: ['snack-bar-success']
            });
            this.loadData();
          },
          error: (err) => {
            console.error('Failed to delete station:', err);
            this.snackBar.open('Failed to delete station. Please try again.', 'Close', {
              duration: 3000,
              panelClass: ['snack-bar-error']
            });
          }
        });
      }
    });
  }

onAddCharger(station: any) {
    if (!station.client_id) {
    this.snackBar.open('Client ID not found for fetching serial numbers', 'Close', { duration: 3000 });
    return;
  }
  this.dialog.open(ChargerStationMappingComponent, {
    width: window.innerWidth < 850 ? '90vw' : '800px',
    maxHeight: '90vh',
    position: { top: '10px' },  // only top, no left
    data: {
      name: station.name,
      code: station.code,
      address1: station.address1 || '',
      address2: station.address2 || '',
      city_name: station.city_name || '',
      state_name: station.state_name || '',
      country_name: station.country_name || '',
      PIN: station.PIN || '',
      cpo_name: station.cpo_name,
      client_id:station.client_id,
      status:station.status,
      id:station.id
    }
  });
}



}
