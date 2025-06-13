import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule , MatTableDataSource} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CreateChargerConnectorComponent } from './create-charger-connector/create-charger-connector.component';
import { ViewChargerConnectorComponent } from './view-charger-connector/view-charger-connector.component';

@Component({
  selector: 'app-connectors',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatIcon,MatButtonModule,
    MatDialogModule, RouterModule,HttpClientModule
  ],
  templateUrl: './charger-connector.component.html',
  styleUrls: ['./charger-connector.component.scss']
})
export class ConnectorsComponent {
  displayedColumns: string[] = ['connectorId', 'type', 'status', "action"];
  dataSource = new MatTableDataSource<any>([
    { connectorId: 'C001', type: 'Type2', status: 'Active' },
    { connectorId: 'C002', type: 'CCS', status: 'Inactive' }
  ]) 

  //constructor
  
    // @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(
      // private chargerModelService: ChargerModelService,
      private router: Router,
      private dialog: MatDialog
    ) {}

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
    const dialogRef = this.dialog.open(CreateChargerConnectorComponent);

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
    this.dialog.open(ViewChargerConnectorComponent, {
      data: selectedItem,
      width: '400px',
    });
  }
}
}
