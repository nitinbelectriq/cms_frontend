import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-manage-chargers',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './manage-charger.component.html',
  styleUrls: ['./manage-charger.component.scss']
})
export class ManageChargersComponent {
  displayedColumns: string[] = ['chargerId', 'model', 'location', 'status'];
  dataSource = [
    { chargerId: 'CH001', model: 'Bulk Charger', location: 'Mumbai', status: 'Active' },
    { chargerId: 'CH002', model: 'Swapping Station', location: 'Delhi', status: 'Inactive' }
  ];
}
