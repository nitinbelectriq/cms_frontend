import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-rfid',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.scss']
})
export class RfidComponent {
  displayedColumns: string[] = ['rfidId', 'assignedTo', 'status'];
  dataSource = [
    { rfidId: 'RF001', assignedTo: 'Driver A', status: 'Active' },
    { rfidId: 'RF002', assignedTo: 'Driver B', status: 'Inactive' }
  ];
}
