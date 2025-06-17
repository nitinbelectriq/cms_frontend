import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CreateManageCpoComponent } from './create-manage-cpo/create-manage-cpo.component';
import { EditManageCpoComponent } from './edit-manage-cpo/edit-manage-cpo.component';
import { ViewManageCpoComponent } from './view-manage-cpo/view-manage-cpo.component';
import { BrowserModule } from '@angular/platform-browser';


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
        MatIcon
  ],
  templateUrl: './manage-cpo.component.html',
  styleUrls: ['./manage-cpo.component.scss']
})
export class ManageCpoComponent {
  displayedColumns:string[] = ['clientName','cpoName', 'GSTIN','contactPerson', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([
    {
      clientName: 'Client A',
      cpoName: 'CPO A',
      GSTIN: '27AABCU9600R1ZV',
      contactPerson: 'John Doe',
      status: 'Active',
    },
    {
      clientName: 'Client B',
      cpoName: 'CPO B',
      GSTIN: '27AABCU9600R1ZV',
      contactPerson: 'Jane Smith',
      status: 'Inactive',
      
    },
    {
      clientName: 'Client C',
      cpoName: 'CPO C',
      GSTIN: '27AABCU9600R1ZV',
      contactPerson: 'Alice Johnson',
      status: 'Active',
    },
    {
      clientName: 'Client D',
      cpoName: 'CPO D',
      GSTIN: '27AABCU9600R1ZV',
      contactPerson: 'Bob Brown',
      status: 'Inactive',
    },
    {
      clientName: 'Client E',
      cpoName: 'CPO E',
      GSTIN: '27AABCU9600R1ZV',
      contactPerson: 'Charlie Black',
      status: 'Active',   
    },
    {
      clientName: 'Client F',
      cpoName: 'CPO F',
      GSTIN: '27AABCU9600R1ZV',
      contactPerson: 'David White',
      status: 'Inactive',
    }

  ]);


   @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(
      
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
      // this.chargerService.getAll().subscribe((data) => {
      //   this.dataSource.data = data;
      // });
    }
  


    onDelete(id:number){

    }

    onEdit(element:any){
      const dialogRef = this.dialog.open(EditManageCpoComponent,{
        width: '400px',
        data: { element: element } // Pass the ID to the dialog
      })

    }
    onCreate(){
      const dialogRef = this.dialog.open(CreateManageCpoComponent, {
        width: '80%',
        height: '100%',
        position: {top: '0', right: '0'}
      })

    }

    onView(id:number){
      // this.router.navigate(['/home/manage-cpo/view', id]);
      const selectedItem = this.dataSource.data.find(item => item.id === id);
        if (selectedItem) {
          this.dialog.open(ViewManageCpoComponent, {
            data: selectedItem,
            width: '400px',
          });
        }

    }

}
