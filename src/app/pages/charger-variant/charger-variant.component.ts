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
    MatSnackBarModule
    // DO NOT add DeleteChargerVariantComponent here
  ],
  templateUrl: './charger-variant.component.html',
  styleUrls: ['./charger-variant.component.scss']
})
export class ChargerVariantComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['variantName', 'chargerType', 'manufacturer', 'status', 'action'];

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

  loadData() {
    this.chargerVariantService.getAll().subscribe(data => {
      this.dataSource.data = data;
    }, error => {
      console.error('Error loading charger variants', error);
    });
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
