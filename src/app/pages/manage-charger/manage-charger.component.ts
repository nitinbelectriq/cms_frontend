import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manage-chargers',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIcon, MatButtonModule],
  templateUrl: './manage-charger.component.html',
  styleUrls: ['./manage-charger.component.scss']
})
export class ManageChargersComponent {
  displayedColumns: string[] = ['chargerId', 'model', 'location', 'status', 'action'];
  dataSource = [
    { chargerId: 'CH001', model: 'Bulk Charger', location: 'Mumbai', status: 'Active' },
    { chargerId: 'CH002', model: 'Swapping Station', location: 'Delhi', status: 'Inactive' }
  ];


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
    // const dialogRef = this.dialog.open(CreateChargerModelDialogComponent);

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.chargerModelService.create(result).subscribe(() => {
    //       this.loadData();
    //     });
    //   }
    // });
  }
  onView(id: string) {
  // const selectedItem = this.dataSource.data.find(item => item.id === id);
  // if (selectedItem) {
  //   this.dialog.open(, {
  //     data: selectedItem,
  //     width: '400px',
  //   });
  // }
}
}
