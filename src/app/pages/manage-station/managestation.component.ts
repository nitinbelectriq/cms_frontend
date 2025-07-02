import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/login.service';
import { StationService } from '../../services/manage-station.service';

import { CreatemanagestationComponent } from './createmanagestation/createmanagestation.component';
import {ViewStationComponent} from './viewmanagestation/viewmanagestation.component';
@Component({
  selector: 'app-managestation',
  standalone: true,
  templateUrl: './managestation.component.html',
  styleUrls: ['./managestation.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ]
})
export class ManagestationComponent implements OnInit, AfterViewInit {
  private snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private stationService = inject(StationService);
  private authService = inject(AuthService);

  filterform: FormGroup = this.fb.group({
    client: [''],
    cpo: [''],
    chargingstations: ['']
  });

  displayedColumns: string[] = [
    'stationName',
    'contactperson',
    'cpo',
    'stationcode',
    'chargercount',
    'address',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    const user_id = this.authService.getUserId() || 0;
    if (!user_id) {
      console.error('User ID not found');
      return;
    }

    this.stationService.getAllStations(user_id).subscribe({
      next: (response) => {
        const stations = (response?.data || []).map((item: any) => ({
          stationName: item.name,
          contactperson: item.cp_name,
          cpo: item.cpo_name,
          stationcode: item.code,
          chargercount: item.total_chargers,
          address: `${item.address1 || ''}, ${item.address2 || ''}, ${item.city_name || ''}, ${item.state_name || ''}, ${item.country_name || ''} - ${item.PIN || ''}`,
          status: item.status === 'Y',
          raw: item
        }));

        this.dataSource.data = stations;
      },
      error: (error) => {
        console.error('Failed to load charging stations', error);
      }
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreatemanagestationComponent, {
      height: '100vh',
      width: '100vw',
      data: { edit: false }
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (formData) {
        const userId = this.authService.getUserId();
        const payload = {
          ...formData,
          created_by: userId,
          status: formData.status ? 'Y' : 'N',
          created_date: new Date().toISOString()
        };

        this.stationService.createStation(payload).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error('Error creating station:', err)
        });
      }
    });
  }

  onEdit(element: any) {
    const dialogRef = this.dialog.open(CreatemanagestationComponent, {
      height: '100vh',
      width: '100vw',
      data: {
        edit: true,
        station: element.raw
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

onView(element: any) {
  this.dialog.open(ViewStationComponent, {
    width: '600px',
    data: element.raw
  });
}

onDelete(id: string | number): void {
  if (!id) return;

  const confirmed = confirm('Are you sure you want to delete this station?');
  if (!confirmed) return;

  const stationId = typeof id === 'string' ? +id : id;

  this.stationService.deleteStation(stationId).subscribe({
    next: () => {
      this.snackBar.open('Station deleted successfully.', 'Close', {
        duration: 3000,
        panelClass: ['snack-bar-success']
      });
      this.loadData(); // Reload data after delete
    },
    error: (err) => {
      console.error('Failed to delete station:', err);
      this.snackBar.open('Failed to delete station. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['snack-bar-error']
      });
    }
  });
}

}
