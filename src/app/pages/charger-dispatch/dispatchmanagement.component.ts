import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';


import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreatedishpatchmanagementComponent } from './createdishpatchmanagement/createdishpatchmanagement.component';
import { EditdishpatchmanagementComponent } from './editdishpatchmanagement/editdishpatchmanagement.component';
import { ViewdishpatchmanagementComponent } from './viewdishpatchmanagement/viewdishpatchmanagement.component';



@Component({
  selector: 'app-dispatchmanagement',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    RouterModule,
    MatTableModule,
    MatIcon,
    HttpClientModule,
    ReactiveFormsModule
  
    
  ],
  templateUrl: './dispatchmanagement.component.html',
  styleUrls: ['./dispatchmanagement.component.scss']
})
export class DispatchmanagementComponent {
  filterform : FormGroup = this.fb.group({
    client: [''],
    cpo: [''],
    chargingstations: [''],
  })


  displayedColumns: string[]= ['clientName', 'name', 'serialnumber', 'modelname', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([
    {
      clientName: 'Client A',
      name: 'Device A',
      serialnumber: 'SN123456',
      modelname: 'Model X',
      status: 'Active',
    },
    {
      clientName: 'Client B',
      name: 'Device B',
      serialnumber: 'SN654321',
      modelname: 'Model Y',
      status: 'Inactive',
    },
    {
      clientName: 'Client C',
      name: 'Device C',
      serialnumber: 'SN789012',
      modelname: 'Model Z',
      status: 'Active',
    }
  ]) ;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

      constructor(
        
        private router: Router,
        private dialog: MatDialog,
        private fb : FormBuilder
      ) {};



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



  // delete button functionality
  onDelete(id:number){

  }

  // edit button functionality
  onEdit(element : any){
    const dialogRef = this.dialog.open(EditdishpatchmanagementComponent,{
      width: '60%',
      height: '100%',
      position: {
        top: '0',
        // right: '0',
      },
      data: element,
    })

  }

  // create button functionality
  onCreate(){
    const dialogRef = this.dialog.open(CreatedishpatchmanagementComponent, {
      width: '60%',
      height: '100%',
      position: {
        top: '0',
        // right: '0',
      }

    });
  }

  // view button functionality
  onView(id: string) {
          const selectedItem = this.dataSource.data.find(item => item.id === id);
            if (selectedItem) {
              this.dialog.open(ViewdishpatchmanagementComponent, {
                data: selectedItem,
                width: '400px',
              });
            }
  }

}
