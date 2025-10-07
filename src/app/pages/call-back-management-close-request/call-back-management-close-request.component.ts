import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-call-back-management-close-request',
  standalone: true,
  imports: [
    CommonModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatPaginatorModule, // ✅ correct module import
        HttpClientModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatIconModule
    

  ],
  templateUrl: './call-back-management-close-request.component.html',
  styleUrl: './call-back-management-close-request.component.scss'
})
export class CallBackManagementCloseRequestComponent {
  displayedColumns = [
      'Name',
      'Question',
      'Mobile',
      'Date',
      'Remarks',
      'action',
    ];
  
    dataSource = new MatTableDataSource<any>([
      {
        Name: 'abc',
        Question: 'any question',
        Mobile: '897978878',
        Date: '11/11/11',
        Remarks: "perfect",
      
      }
    ]);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchText='';
  private router = inject(Router);

  onNavigate(s:any){

  }

  downloadCSV(){

  }
  applyFilter(){

  }

  goBackToOpenRequest(): void {
    this.router.navigate(['/home/manage-callback-open']);
  }
  goToCloseRequest(){
    this.router.navigate(['/home/manage-callback-close'])
  }
  onActionClick(row: any){

  }

}
