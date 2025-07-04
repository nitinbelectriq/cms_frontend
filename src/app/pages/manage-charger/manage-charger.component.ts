import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CreateManageChargerComponent } from './create-manage-charger/create-manage-charger.component';
import { ViewManageChargerComponent } from './view-manage-charger/view-manage-charger.component';
import { ChargerService, Charger } from '../../services/manage-charger.service';

@Component({
  selector: 'app-manage-chargers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  templateUrl: './manage-charger.component.html',
  styleUrls: ['./manage-charger.component.scss']
})
export class ManageChargersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['clientName', 'name', 'serialNo', 'modelName', 'status', 'action'];
  dataSource = new MatTableDataSource<Charger>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private chargerService: ChargerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

 loadData(): void {
  this.chargerService.getChargers().subscribe({
    next: (res) => {
      if (res.status && Array.isArray(res.data)) {
        // Set clientName = 'Belectriq' for each item
        const transformedData = res.data.map(item => ({
          ...item,
          client_name: 'Belectriq'
        }));
        this.dataSource.data = transformedData;
      } else {
        this.dataSource.data = [];
        this.snackBar.open('No data found', 'Close', { duration: 3000 });
      }
    },
    error: (err) => {
      console.error('Error fetching chargers:', err);
      this.snackBar.open('Failed to load chargers', 'Close', { duration: 3000 });
    }
  });
}


  onEdit(id: number): void {
    const selectedItem = this.dataSource.data.find(item => item.id === id);
    if (selectedItem) {
      const dialogRef = this.dialog.open(CreateManageChargerComponent, {
        data: selectedItem,
        width: '88%',
      height: '100vh',
      position: {
        top: '0',
        right: '0',
      },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadData();
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this charger?')) {
      this.chargerService.deleteCharger(id).subscribe({
        next: (res) => {
          this.snackBar.open(res.message || 'Charger deleted successfully.', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to delete charger', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(CreateManageChargerComponent, {
      width: '88%',
      height: '100vh',
      position: {
        top: '0',
        right: '0',
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  onView(id: number): void {
    const selectedItem = this.dataSource.data.find(item => item.id === id);
    if (selectedItem) {
      this.dialog.open(ViewManageChargerComponent, {
        data: selectedItem,
        width: '400px',
      });
    }
  }
}
