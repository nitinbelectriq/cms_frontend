import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateChargerVariantComponent } from './create-charger-variant/create-charger-variant.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ViewChargerVariantComponent } from './view-charger-variant/view-charger-variant.component';

@Component({
  selector: 'app-charger-variant',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIcon,
    MatDialogModule,RouterModule,HttpClientModule, MatButtonModule],
 templateUrl: './charger-variant.component.html',
  styleUrls: ['./charger-variant.component.scss']
})
export class ChargerVariantComponent {
  displayedColumns: string[] = ['variant', 'description', 'status','action'];
  dataSource = new MatTableDataSource<any>([
    { variant: '8 Channel', description: 'Bulk variant', status: 'Active' },
    { variant: '16 Channel', description: 'Advanced variant', status: 'Inactive' }
  ]);


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
      const dialogRef = this.dialog.open(CreateChargerVariantComponent,{
        width: '80%', // adjust as needed
  height: '100%',
  position: { top: '0', right: '0' }, // ✅ aligns to right
  //panelClass: 'custom-dialog-right'
      });
  
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
      this.dialog.open(ViewChargerVariantComponent, {
        data: selectedItem,
        width: '400px',
      });
    }
  }
}
