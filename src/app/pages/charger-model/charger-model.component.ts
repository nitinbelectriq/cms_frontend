import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'; // <--- Import MatSnackBarModule & MatSnackBar
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ChargerModelService, ChargerModel } from '../../services/charger-model.service';
import { CreateChargerModelDialogComponent } from './create-charger-model-dialog/create-charger-model-dialog.component';
import { EditChargerModelDialogComponent } from './edit-charger-model-dialog/edit-charger-model-dialog.component';
import { ViewChargerModelDialogComponent } from './view-charger-model-dialog/view-charger-model-dialog.component';
import { DeleteChargerModelDialogComponent } from './delete-charger-model-dialog/delete-charger-model-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-charger-model',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,         // <--- Add here
    RouterModule,
    HttpClientModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './charger-model.component.html',
  styleUrls: ['./charger-model.component.scss'],
})
export class ChargerModelComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['model', 'description', 'status', 'action'];
  dataSource = new MatTableDataSource<ChargerModel>([]);
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private chargerModelService: ChargerModelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar   // <--- Inject MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

   downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['Model Name', 'Description', 'Created by', 'Modify Date', 'Modify by' ,'Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    const rowData = [
      `"${row.name}"`,
      `"${row.description}"`,
      `"${row.createdby}"`,
      `"${row.modify_date}"`,
      `"${row.modifyby}"`,
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
  a.download = 'charger-model-data.csv';
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

  loadData() {
    this.chargerModelService.getAll().subscribe((data) => {
      this.dataSource.data = data;
      //console.log(data);
      this.dataSource.filterPredicate = (data: ChargerModel, filter: string) => {
                const combined = `${data.name} ${data.description} ${(data.status== true ? 'active' : 'inactive')}`.toLowerCase();
                return combined.includes(filter);
              };
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateChargerModelDialogComponent, {
      width: '88%',
      height: 'fit-content',
      position: {
        top: '0',
        //left: '0',
        right: '0',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.snackBar.open('Charger Model created successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  onEdit(id: number) {
    const selectedItem = this.dataSource.data.find(item => item.id === id);
    if (!selectedItem) return;

    const dialogRef = this.dialog.open(EditChargerModelDialogComponent, {
      data: selectedItem,
      width: '88%',
      height: 'fit-content',
      position: {
        top: '0',
        right: '0',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Charger Model updated successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DeleteChargerModelDialogComponent, {
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.chargerModelService.delete(id).subscribe({
          next: () => {
            this.loadData(); // reload table data
            this.snackBar.open('Charger Model deleted successfully!', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error('Delete failed', err);
            this.snackBar.open('Failed to delete Charger Model. Please try again.', 'Close', {
              duration: 3000,
            });
          }
        });
      }
    });
  }

  onView(id: number) {
    const selectedItem = this.dataSource.data.find(item => item.id === id);
    if (!selectedItem) return;

    this.dialog.open(ViewChargerModelDialogComponent, {
      data: selectedItem,
      width: '400px',
    });
  }
}
