import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../services/login.service'; // Adjust path if needed

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isSectionOpen: { [key: string]: boolean } = {
    charger: false,
    rfid: false,
    dispatch: false,
    client: false,
    cpo: false,
    station: false,
    ocpp: false,
    user: false, // Added User Management section
  };

  constructor(private router: Router, private authService: AuthService) {}

  toggleSection(section: string): void {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
