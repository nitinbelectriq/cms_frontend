import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-connectors',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './charger-connector.component.html',
  styleUrls: ['./charger-connector.component.scss']
})
export class ConnectorsComponent {
  displayedColumns: string[] = ['connectorId', 'type', 'status'];
  dataSource = [
    { connectorId: 'C001', type: 'Type2', status: 'Active' },
    { connectorId: 'C002', type: 'CCS', status: 'Inactive' }
  ];
}
