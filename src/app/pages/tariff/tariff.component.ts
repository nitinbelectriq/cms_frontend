import { CommonModule } from '@angular/common';
import { Component, ViewChild, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { AddnewTariffComponent } from './addnew-tariff/addnew-tariff.component';

@Component({
  selector: 'app-tariff',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    FormsModule

  ],
  templateUrl: './tariff.component.html',
  styleUrl: './tariff.component.scss'
})
export class TariffComponent {

    displayedColumns: string[] = ['name', 'type', 'costingType','applicableTo','chargingFee','parkingFee', 'action'];
    dataSource = new MatTableDataSource<any>([]);
    searchText = '';
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
      private dialog: MatDialog,
    ){

    }

    onCreate(){
      this.dialog.open(AddnewTariffComponent,{
        width: '88%',
        height: '92vw',
        position: {
          top: '0',
          right: '0',
        }
      })
    }

    
   applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

    onView(id:number){

    }

    onEdit(id: number){

    }

    onDelete(id: number){

    }

    downloadCSV(){
      const csvRows= [];
      const headers = ['Name', 'Type', 'Cost Type', 'Charging Fee', 'Parking Fee', 'Applicable To'];
      csvRows.push(headers.join(','));

      
      //  Create CSV blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ocpp-data.csv';
  a.click();
  URL.revokeObjectURL(url);
    }
  

}
