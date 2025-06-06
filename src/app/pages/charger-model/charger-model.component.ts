import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChargerModelService } from '../../services/charger-model.service';

@Component({
  selector: 'app-charger-model',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './charger-model.component.html',
  styleUrls: ['./charger-model.component.scss']
})
export class ChargerModelComponent implements OnInit {
  displayedColumns: string[] = ['model', 'description', 'status', 'action'];
  dataSource: any[] = [];

  constructor(
    private chargerModelService: ChargerModelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.chargerModelService.getAll().subscribe((data: any[]) => {
      this.dataSource = data;
    });
  }

  onView(id: string) {
    this.router.navigate(['/home/charger-model/view', id]);
  }

  onEdit(id: string) {
    this.router.navigate(['/home/charger-model/edit', id]);
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this model?')) {
      this.chargerModelService.delete(id).subscribe(() => {
        this.loadData(); // Reload list after delete
      });
    }
  }
}
