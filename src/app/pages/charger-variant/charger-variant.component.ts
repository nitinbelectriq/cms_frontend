import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-charger-variant',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIcon, MatButtonModule],
 templateUrl: './charger-variant.component.html',
  styleUrls: ['./charger-variant.component.scss']
})
export class ChargerVariantComponent {
  displayedColumns: string[] = ['variant', 'description', 'status','action'];
  dataSource = [
    { variant: '8 Channel', description: 'Bulk variant', status: 'Active' },
    { variant: '16 Channel', description: 'Advanced variant', status: 'Inactive' }
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
