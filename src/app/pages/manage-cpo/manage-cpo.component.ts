import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CreateManageCpoComponent } from './create-manage-cpo/create-manage-cpo.component';
import { ViewManageCpoComponent } from './view-manage-cpo/view-manage-cpo.component';
import { CpoService } from '../../services/manage-cpo.service';
import { DeleteManageCpoComponent } from './delete-manage-cpo/delete-manage-cpo.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-cpo',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './manage-cpo.component.html',
  styleUrls: ['./manage-cpo.component.scss']
})
export class ManageCpoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['clientName', 'cpoName', 'GSTIN', 'contactPerson', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private dialog = inject(MatDialog);
  private cpoService = inject(CpoService);
  private snackbar = inject(MatSnackBar);

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

   downloadCSV() {
  const csvRows = [];

  // Define headers
  const headers = ['CPO Name', 'Contact Person Name','Email','Mobile',
    'Description','GST Number', 'Client Name',
    'TIN Number', 'City',
    'State','Address','Created Date','Status'];
  csvRows.push(headers.join(','));

  // Format each row of data
  this.dataSource.data.forEach((row: any) => {
    //console.log('row :', row);
    const rowData = [
     
      `"${row.name}"`,
      `"${row.cp_name}"`,
      `"${row.email}"`,
      `"${row.mobile}"`,
      `"${row.description}"`,
      `"${row.gst_no}"`,
      `"${row.client_name}"`,
      `"${row.tin_no}"`,
      
      `"${row.city_name}"`,
      `"${row.state_name}"`,
      
      `"${row.address1}"`,
      `"${row.created_date}"`,
      
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
  a.download = 'cpo-data.csv';
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
    const loginId = Number(localStorage.getItem('user_id'));
    if (!loginId) return;

    this.cpoService.getCposByLoginId(loginId).subscribe({
      next: (data) =>{
        console.log(data);
        this.dataSource.data = data || [];
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const combined= `${data.client_name} ${data.name} ${data.cp_name} ${data.gst_no} ${this.mapStatus(data.status)}`.toLowerCase();
          return combined.includes(filter);
        }
      } ,
      error: (err) => console.error('Fetch error:', err)
    });
  }

  onCreate() {
    this.dialog.open(CreateManageCpoComponent, {
      width: '80%', height: '100%', position: { top: '0', right: '0' }
    }).afterClosed().subscribe(result => result && this.loadData());
  }

  onEdit(element: any) {
    this.dialog.open(CreateManageCpoComponent, {
      width: '80%', height: '100%', position: { top: '0', right: '0' },
      data: { id: element.id }
    }).afterClosed().subscribe(result => result && this.loadData());
  }

  onView(id: number) {
    const selectedItem = this.dataSource.data.find(i => i.id === id);
    if (selectedItem) {
      this.dialog.open(ViewManageCpoComponent, {
        data: selectedItem,
        width: '400px',
      });
    }
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DeleteManageCpoComponent, {
      data: id,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.cpoService.deleteCpo(id).subscribe({
          next: () =>{
            this.loadData();
            this.snackbar.open(`Successfully deleted`, 'close', {duration: 3000})
          } ,
          error: err => console.error('Delete error:', err)
        })
      }
    })

    // if (confirm('Delete this CPO?')) {
    //   this.cpoService.deleteCpo(id).subscribe({
    //     next: () => this.loadData(),
    //     error: err => console.error('Delete error:', err)
    //   });
    // }
    
  }
}