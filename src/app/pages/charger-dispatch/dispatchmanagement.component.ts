import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { CreatedishpatchmanagementComponent } from './createdishpatchmanagement/createdishpatchmanagement.component';
import { ViewdishpatchmanagementComponent } from './viewdishpatchmanagement/viewdishpatchmanagement.component';
import { DispatchService } from '../../services/dispatch-charger.service';
import { MatButtonModule } from '@angular/material/button';
import { DeleteChargerDispatchComponent } from './delete-charger-dispatch/delete-charger-dispatch.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

interface ChargerData {
  charger_id: number;
  nick_name: string | null;
  client_id: number;
  dispatch_date: string;
  dispatch_by: number;
  id: number;
  serial_no: string;
  name: string;
  model_id: number;
  model_name: string;
  station_id: number;
  client_name: string;
  station_name: string;
  current_version_id: number;
  version_name: string;
  no_of_guns: number;
  address1: string;
  address2: string;
  PIN: number;
  landmark: string;
  city_id: number;
  city_name: string | null;
  state_id: number;
  state_name: string | null;
  country_id: number;
  country_name: string | null;
  Lat: string;
  Lng: string;
  OTA_Config: string;
  Periodic_Check_Ref_Time: string | null;
  Periodicity_in_hours: number;
  When_to_Upgrade: string;
  Upgrade_Specific_Time: string | null;
  is_available: number;
  status: string;
  created_date: string;
  createdby: number;
  modifyby: number | null;
  modify_date: string | null;
  connector_data?: any[];
}

interface ChargerDisplay extends ChargerData {
  clientName: string;
  serialnumber: string;
  modelname: string;
}

interface Client {
  id: number;
  name: string;
}

interface Cpo {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dispatchmanagement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    RouterModule,
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    
  ],
  templateUrl: './dispatchmanagement.component.html',
  styleUrls: ['./dispatchmanagement.component.scss']
})
export class DispatchmanagementComponent implements OnInit, AfterViewInit {
  filterForm: FormGroup;
  displayedColumns: string[] = ['clientName', 'name', 'serialnumber', 'modelname', 'status', 'action'];
  dataSource = new MatTableDataSource<ChargerDisplay>([]);
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private dispatchService = inject(DispatchService);

  constructor() {
    this.filterForm = this.fb.group({
      chargingStation: ['']
    });
  }

  ngOnInit(): void {
    const loginId = Number(localStorage.getItem('user_id'));
    if (!loginId) {
      console.error('Login ID not found in localStorage');
      return;
    }

    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['Serial No.','Charger Name', 'Dispatch Date',
    'Model Name','No. of Guns', 'Client Name',
    'Version Name','Station Id', 'Station Name', 'City',
    'State','OTA Config','Periodic Check Ref Time','Periodicity in hours','charger status','When to Upgrade','is_available','Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    //console.log('row :', row);
    const rowData = [
      `"${row.serialnumber}"`,
      `"${row.name}"`,
      `"${row.dispatch_date}"`,
      
      `"${row.modelname}"`,
      `"${row.no_of_guns}"`,
      `"${row.clientName}"`,
      `"${row.version_name}"`,
      `"${row.station_id}"`,
      `"${row.station_name}"`,
      `"${row.city_name}"`,
      `"${row.state_name}"`,
      `"${row.OTA_Config}"`,
      `"${row.Periodic_Check_Ref_Time}"`,
      `"${row.Periodicity_in_hours}"`,
      `"${row.charger_status}"`,
      `"${row.When_to_Upgrade}"`,
      row.is_available== '1'? 'YES' : 'NO',
      row.status == 'Y' ? 'Active' : 'Inactive' 
    ];
    csvRows.push(rowData.join(','));
  });

  // Create CSV blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'charger-dispatch-data.csv';
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

  loadData(): void {
    const loginId = Number(localStorage.getItem('user_id'));
    if (!loginId) {
      console.error('Login ID not found in localStorage');
      return;
    }

    this.dispatchService.getClientChargers(loginId).subscribe({
      next: (res) => {
        const rawData: ChargerData[] = res?.data || [];
        const mappedData: ChargerDisplay[] = rawData.map((item: ChargerData) => ({
          ...item,
          clientName: item.client_name,
          serialnumber: item.serial_no,
          modelname: item.model_name
        }));
        this.dataSource.data = mappedData;
        this.dataSource.filterPredicate = (data: ChargerData, filter: string) => {
          const combined = `${data.client_name} ${data.model_name} ${data.serial_no} ${data.name}`.toLowerCase();
          return combined.includes(filter);
        }
      },
      error: (err) => {
        console.error('Error fetching charger dispatch data:', err);
      }
    });
  }

  onCreate(): void {
    //console.log(this.dataSource);
    this.dialog.open(CreatedishpatchmanagementComponent, {
      width: '88%',
      height: 'fit-content',
      position: { top: '0',
        right: '0',
       },
    }).afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  onEdit(element: ChargerDisplay): void {
    this.dialog.open(CreatedishpatchmanagementComponent, {
      width: '88%',
      height: 'fit-content',
      position: { top: '0',
        right: '0',
       },
      data: element
    }).afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  onView(id: number): void {
    const selectedItem = this.dataSource.data.find(item => item.id === id);
    if (selectedItem) {
      this.dialog.open(ViewdishpatchmanagementComponent, {
        data: selectedItem,
        width: '400px'
      });
    }
  }

 onDelete(id: number): void {

  const dialogRef = this.dialog.open(DeleteChargerDispatchComponent, {
    data: id,
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result === true){
      const user_id = Number(localStorage.getItem('user_id'));
      this.dispatchService.deleteCharger(id, user_id).subscribe({
        next: () => {
          alert('Charger deleted successfully');
          this.loadData();
        },
        error: (err) => {
          console.error('Error deleting charger:', err);
          alert('Failed to delete charger');
        }
      });
    }

  })
  
// const user_id = Number(localStorage.getItem('user_id'));
  // if (confirm('Are you sure you want to delete this record?')) {
  //   this.dispatchService.deleteCharger(id, user_id).subscribe({
  //     next: () => {
  //       alert('Charger deleted successfully');
  //       this.loadData();
  //     },
  //     error: (err) => {
  //       console.error('Error deleting charger:', err);
  //       alert('Failed to delete charger');
  //     }
  //   });
  // }
}

}

