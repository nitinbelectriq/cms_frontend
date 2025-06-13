import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ViewChargerModelDialogComponent } from './view-charger-model-dialog/view-charger-model-dialog.component';

import { ChargerModelService } from '../../services/charger-model.service';
import { CreateChargerModelDialogComponent } from './create-charger-model-dialog/create-charger-model-dialog.component';

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
    RouterModule,
    HttpClientModule
    // DO NOT import CreateChargerModelDialogComponent here
  ],
  templateUrl: './charger-model.component.html',
  styleUrls: ['./charger-model.component.scss'],
})
export class ChargerModelComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['model', 'description', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([
    {name:'abc', description:"xyz", status:'active'}
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private chargerModelService: ChargerModelService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    this.chargerModelService.getAll().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  onEdit(id: string) {
    this.router.navigate(['/home/charger-model/edit', id]);
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this model?')) {
      this.chargerModelService.delete(id).subscribe(() => this.loadData());
    }
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateChargerModelDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.chargerModelService.create(result).subscribe(() => {
          this.loadData();
        });
      }
    });
  }
  onView(id: string) {
  const selectedItem = this.dataSource.data.find(item => item.id === id);
  if (selectedItem) {
    this.dialog.open(ViewChargerModelDialogComponent, {
      data: selectedItem,
      width: '400px',
    });
  }
}

}
