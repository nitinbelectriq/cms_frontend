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
import { AuthService } from '../../services/login.service';
// Import your StationService (adjust the path as needed)
import { StationService } from '../../services/manage-station.service';

// Stub dialog components — replace with your actual components
@Component({ template: '', standalone: true }) export class CreatemanagestationComponent {}
@Component({ template: '', standalone: true }) export class EditmanagestationComponent {}
@Component({ template: '', standalone: true }) export class ViewmanagestationComponent {}

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
  fb = inject(FormBuilder);

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

  constructor(
    private dialog: MatDialog,
    private stationService: StationService,
    private AuthService:AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    const user_id = this.AuthService.getUserId() || 0;
    if (!user_id) {
      console.error('User ID not found');
      return;
    }

    this.stationService.getAllStations(user_id).subscribe({
      next: (data) => {
        console.log('API data:', data);
        this.dataSource.data = data.data || data;
      },
      error: (error) => {
        console.error('Failed to load charging stations', error);
      }
    });
  }

  onCreate() {
    this.dialog.open(CreatemanagestationComponent, {
      height: '100vh'
    });
  }

  onEdit(element: any) {
    this.dialog.open(EditmanagestationComponent, {
      height: '100vh',
      data: element
    });
  }

  onView(element: any) {
    this.dialog.open(ViewmanagestationComponent, {
      width: '400px',
      data: element
    });
  }

  onDelete(id: string) {
    console.log('Delete station with id:', id);
  }
}
