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
    MatSnackBarModule
  ],
  templateUrl: './manage-cpo.component.html',
  styleUrls: ['./manage-cpo.component.scss']
})
export class ManageCpoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['clientName', 'cpoName', 'GSTIN', 'contactPerson', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);

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

  loadData() {
    const loginId = Number(localStorage.getItem('user_id'));
    if (!loginId) return;

    this.cpoService.getCposByLoginId(loginId).subscribe({
      next: (data) => this.dataSource.data = data || [],
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