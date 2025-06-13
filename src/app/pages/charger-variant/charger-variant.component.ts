import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-charger-variant',
  standalone: true,
  imports: [CommonModule, MatTableModule],
 templateUrl: './charger-variant.component.html',
  styleUrls: ['./charger-variant.component.scss']
})
export class ChargerVariantComponent {
  displayedColumns: string[] = ['variant', 'description', 'status'];
  dataSource = [
    { variant: '8 Channel', description: 'Bulk variant', status: 'Active' },
    { variant: '16 Channel', description: 'Advanced variant', status: 'Inactive' }
  ];
}
