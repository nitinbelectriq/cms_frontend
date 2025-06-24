import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { inject } from '@angular/core';



import { MatDialog } from '@angular/material/dialog';

import { MatIcon } from '@angular/material/icon';

import { Router, RouterModule } from '@angular/router';


import { HttpClientModule } from '@angular/common/http';
import { CreatemanagestationComponent } from './createmanagestation/createmanagestation.component';


@Component({
  selector: 'app-managestation',
  standalone: true,
  imports: [CommonModule,
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
    MatIcon

  ],
  templateUrl: './managestation.component.html',
  styleUrl: './managestation.component.scss'
})
export class ManagestationComponent {
  fb = inject(FormBuilder);

  filterform : FormGroup = this.fb.group({
    client: [''],
    cpo: [''],
    chargingstations: ['']
  })
  displayedColumns: string[]= ['stationName','contactperson','cpo','stationcode','chargercount','address','status','action']
  dataSource = new MatTableDataSource<any>([
    {
      stationName: 'Station A',
      contactperson: 'John Doe',
      cpo: 'CPO A',
      stationcode: 'ST123',
      chargercount: 5,
      address: '123 Main St, City, State, ZIP',
      status: "Active"
    },
    {
      stationName: 'Station B',
      contactperson: 'Jane Smith',
      cpo: 'CPO B',
      stationcode: 'ST456',
      chargercount: 3,
      address: '456 Elm St, City, State, ZIP',
      status: 'Inactive'
    },
    {
      stationName: 'Station C',
      contactperson: 'Alice Johnson',
      cpo: 'CPO C',
      stationcode: 'ST789',
      chargercount: 4,
      address: '789 Oak St, City, State, ZIP',
      status: 'Active'
    }


  ]);

  constructor(
    private dialog: MatDialog,

  ){ }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  onEdit(element:any){
    // edit
  }

  onView(id:string){
    // view
  }

  onCreate(){
    // create
    const dialogRef = this.dialog.open(CreatemanagestationComponent,{
    height: '100vh'
    });
  }


  onDelete(id : string){
    // delete
  }

}
