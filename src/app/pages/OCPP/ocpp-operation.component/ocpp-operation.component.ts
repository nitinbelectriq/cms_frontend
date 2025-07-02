import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ocpp-operation',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule],
  templateUrl: './ocpp-operation.component.html',
})
export class OcppOperationComponent {
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

  dataSource = [
    {
      chargerId: 'CHG123',
      station: 'Station A',
      currentV: '220V',
      guns: 2,
      address: 'Sector 21, Delhi',
      available: 'Yes',
      status: 'Active',
    },
    {
      chargerId: 'CHG456',
      station: 'Station B',
      currentV: '230V',
      guns: 1,
      address: 'MG Road, Mumbai',
      available: 'No',
      status: 'Inactive',
    },
  ];

  onNavigate(message: string) {
    alert(message);
  }

  onActionClick(row: any) {
    alert(`Action clicked for Charger ID: ${row.chargerId}`);
  }
}
