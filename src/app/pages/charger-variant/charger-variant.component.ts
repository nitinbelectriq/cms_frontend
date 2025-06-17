import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ViewChargerVariantComponent } from './view-charger-variant/view-charger-variant.component';
import { ChargerVariantService, ChargerVariant } from'../../services/charger-variant.service';
import { CreateChargerVariantComponent } from './create-charger-variant/create-charger-variant.component';

@Component({
  selector: 'app-charger-variant',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule
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
    private chargerVariantService: ChargerVariantService
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
    console.log('Edit clicked', id);
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this model?')) {
      this.chargerVariantService.delete(Number(id)).subscribe(() => this.loadData(), error => console.error('Error during deletion', error)); 
    }
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(CreateChargerVariantComponent, {
      width: '650px',
      disableClose: true // optional, prevents closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with form data!', result);
        this.loadData();
      }
    });
  }

  onView(id: string) {
    const selectedItem = this.dataSource.data.find((item: ChargerVariant) => item.id == +id);
    if (selectedItem) {
      this.dialog.open(ViewChargerVariantComponent, {
        data: selectedItem,
        width: '400px',
      });
    }
  }
}
