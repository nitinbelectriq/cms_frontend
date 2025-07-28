import {
  Component,
  OnInit,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import {
  OCPPService,
  ChargerRaw,
  ChargersResponse,
} from '../../../services/ocpp.service';
import { AuthService } from '../../../services/login.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ocpp-operation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule, // ✅ correct module import
    HttpClientModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './ocpp-operation.component.html',
  styleUrls: ['./ocpp-operation.component.scss'],
})
export class OcppOperationComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'serial',
    'chargerId',
    'station',
    'currentV',
    'guns',
    'address',
    'available',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private authService = inject(AuthService);
  private ocppService = inject(OCPPService);
  private router = inject(Router);
  searchText= '';

  ngOnInit(): void {
    const loginId = String(this.authService.getUserId() || 0);
    const payload = { cpo_id: '', station_id: '' };

    this.ocppService.getChargersDynamic(loginId, payload).subscribe({
      next: (res: ChargersResponse) => {
        if (res.status && res.data) {
          this.dataSource.data = res.data.map((item, index) => ({
            serial: index + 1,
           // serial_no: item.serial_no,
            chargerId: item.serial_no,
            station: item.station_name,
            currentV: item.version_name,
            guns: item.no_of_guns,
            address: this.buildAddress(item),
            available: item.is_available === 1 ? 'Yes' : 'No',
            status: item.charger_status || 'Unknown',
            //raw: item,
            ...item
          }));
          this.dataSource.filterPredicate= (data: any, filter: string) =>{
            const combined = `${data.chargerId} ${data.station} ${data.status} ${data.currentV}`.toLowerCase();
            return combined.includes(filter);
          }
        } else {
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        console.error('Failed to load charger data:', err);
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

    downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['Serial no.','Name','Model Name','Charger Batch Name','Station ID','Station Name','Current Version ID','Version',
    'No. of Gun','Address','City','Latitude','Longitude','Available','Periodic_Check_Ref_Time','Periodicity_in_hours','Created date','Charger Status','Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    console.log('row :', row);
    const rowData = [
      `"${row.serial_no}"`,
      `"${row.name}"`,
      `"${row.model_name}"`,
      `"${row.charger_batch_name}"`,
      `"${row.station_id}"`,
      `"${row.station}"`,
      `"${row.current_version_id}"`,
      `"${row.currentV}"`,
      `"${row.guns}"`,
      `"${row.address}"`,
      `"${row.city_name}"`,
      `"${row.Lat}"`,
      `"${row.Lng}"`,
      `"${row.available}"`,
      `"${row.Periodic_Check_Ref_Time}"`,
      `"${row.Periodicity_in_hours}"`,
      `"${row.created_date}"`,
      `"${row.charger_status}"`,
      row.status ? 'Active' : 'Inactive'
    ];
    csvRows.push(rowData.join(','));
  });

  // Create CSV blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ocpp-data.csv';
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

  buildAddress(item: ChargerRaw): string {
    const parts = [
      item.address1,
      item.address2,
      item.landmark,
      item.city_name,
      item.state_name,
      item.country_name,
    ];
    return parts.filter(Boolean).join(', ');
  }

  onNavigate(message: string) {
    alert(message);
  }

  onActionClick(row: any) {
    this.navigateToDetail(row); // or call any other logic
  }

  navigateToDetail(row: any) {
    this.router.navigate(['/home/ocpp-diagnostic/charger', row.chargerId]); // ✅ match your routing
  }
}
