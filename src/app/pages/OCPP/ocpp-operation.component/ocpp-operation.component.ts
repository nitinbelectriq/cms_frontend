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
  ],
  templateUrl: './ocpp-operation.component.html',
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

  ngOnInit(): void {
    const loginId = String(this.authService.getUserId() || 0);
    const payload = { cpo_id: '', station_id: '' };

    this.ocppService.getChargersDynamic(loginId, payload).subscribe({
      next: (res: ChargersResponse) => {
        if (res.status && res.data) {
          this.dataSource.data = res.data.map((item, index) => ({
            serial: index + 1,
            serial_no: item.serial_no,
            chargerId: item.serial_no,
            station: item.station_name,
            currentV: item.version_name,
            guns: item.no_of_guns,
            address: this.buildAddress(item),
            available: item.is_available === 1 ? 'Yes' : 'No',
            status: item.charger_status || 'Unknown',
            raw: item,
          }));
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
