import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateRfidComponent } from './create-rfid/create-rfid.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatDialogRef} from '@angular/material/dialog';
import { ViewRfidComponent } from './view-rfid/view-rfid.component';


@Component({
  selector: 'app-rfid',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatIcon,MatButtonModule,
      MatDialogModule, RouterModule,HttpClientModule, MatSlideToggleModule],
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.scss']
})
export class RfidComponent {
  displayedColumns: string[] = ['rfidId', 'assignedTo', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([
    { rfidId: 'RF001', assignedTo: 'Driver A', status: 'Active' },
    { rfidId: 'RF002', assignedTo: 'Driver B', status: 'Inactive' }
  ]);

  constructor(private router: Router, private dialog: MatDialog){}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  loadData() {
    // this.chargerModelService.getAll().subscribe((data) => {
    //   this.dataSource.data = data;
    // });
  }

  onEdit(id: string) {
    // this.router.navigate(['/home/charger-model/edit', id]);
  }

  onDelete(id: string) {
    // if (confirm('Are you sure you want to delete this model?')) {
    //   this.chargerModelService.delete(id).subscribe(() => this.loadData());
    // }
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateRfidComponent);

    dialogRef.afterClosed().subscribe((result) => {
      // if (result) {
      //   this.chargerModelService.create(result).subscribe(() => {
      //     this.loadData();
      //   });
      // }
    });
  }
  onView(id: string) {
  const selectedItem = this.dataSource.data.find(item => item.id === id);
  if (selectedItem) {
    this.dialog.open(ViewRfidComponent, {
      data: selectedItem,
      width: '400px',
    });
  }
}
}
