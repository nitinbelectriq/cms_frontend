import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ViewChargerVariantComponent } from './view-charger-variant/view-charger-variant.component';
import { ChargerVariantService, ChargerVariant } from '../../services/charger-variant.service';
import { CreateChargerVariantComponent } from './create-charger-variant/create-charger-variant.component';
import { DeleteChargerVariantComponent } from '../charger-variant/delete-charger-variant/delete-charger-variant.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-charger-variant',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormsModule
    // DO NOT add DeleteChargerVariantComponent here
  ],
  templateUrl: './charger-variant.component.html',
  styleUrls: ['./charger-variant.component.scss']
})
export class ChargerVariantComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchText = '';

  displayedColumns: string[] = ['name', 'chargerType', 'manufacturer', 'status', 'action'];

  dataSource = new MatTableDataSource<ChargerVariant>([]);

  constructor(
    private dialog: MatDialog,
    private chargerVariantService: ChargerVariantService,
    private snackBar: MatSnackBar
  ) { }

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
    this.chargerVariantService.getAll().subscribe(response => {
     // console.log(response);
       if (Array.isArray(response)) {
      this.dataSource.data = response;
       this.dataSource.filterPredicate = (data: ChargerVariant, filter: string) => {
                const combined = `${data.charger_model_type_name} ${data.manufacturer_name} ${data.id} ${data.name} ${this.mapStatus(data.status)}`.toLowerCase();
                return combined.includes(filter);
              };
            }
    }, error => {
      console.error('Error loading charger variants', error);
    });
  }

    downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['Variant Name', 'Charger Model', 'Charger Model Type	',
     'Manufacturer','Battery Backup','Card Reader', 'Description','Code','NO. of Connector',
     'Communication mode', 
     'Communication Protocol','Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    const rowData = [
      `"${row.name}"`,
      `"${row.charger_type_name}"`,
      `"${row.charger_model_type_name}"`,
      `"${row.manufacturer_name}"`,
      `"${row.battery_backup}"`,
      `"${row.card_reader_type}"`,
       `"${row.description}"`,
      `"${row.code}"`,
      `"${row.no_of_connectors}"`,
     
      `"${row.communication_mode}"`,
      `"${row.communication_protocol_name}"`,
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
  a.download = 'charger-variant-data.csv';
  a.click();
  URL.revokeObjectURL(url);
}


  onEdit(id: string) {
    const selectedItem = this.dataSource.data.find(item => item.id == +id);
    if (selectedItem) {
      const dialogRef = this.dialog.open(CreateChargerVariantComponent, {
        data: selectedItem,
        width: '88%',
    
        height: '100vh',
        position: {
          top: '0',
          right: '0',
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadData();
        }
      });
    }
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(DeleteChargerVariantComponent, {
      width: '400px',
      data: { id: Number(id) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.chargerVariantService.delete(Number(id)).subscribe({
          next: (res: any) => {
            this.loadData();
            this.snackBar.open(res.message || 'Charger variant deleted successfully.', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error('Error deleting charger variant:', err);
            const errorMessage = err?.error?.message || 'Failed to delete charger variant.';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
            });
          }
        });
      }
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(CreateChargerVariantComponent, {
      width: '88%',
    
      height: '100vh',
      position: {
        top: '0',
        right: '0',
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  onView(id: string) {
    const selectedItem = this.dataSource.data.find(item => item.id == +id);
    if (selectedItem) {
      this.dialog.open(ViewChargerVariantComponent, {
        data: selectedItem,
        width: '400px',
      });
    }
  }
}
