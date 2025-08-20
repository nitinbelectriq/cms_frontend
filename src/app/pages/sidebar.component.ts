import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../services/login.service';

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
export class SidebarComponent implements OnInit {
  userName: string = 'User';
  isSectionOpen: { [key: string]: boolean } = {
    charger: false,
    rfid: false,
    dispatch: false,
    client: false,
    cpo: false,
    station: false,
    ocpp: false,
    user: false,
    tariff: false,
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const storedName = localStorage.getItem('userName');
    if (storedName && storedName !== 'undefined') {
      this.userName = storedName;
    }
  }

  toggleSection(section: string): void {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  logout(): void {
    this.authService.logout();
    localStorage.clear(); // Optional: clear all data on logout
    this.router.navigate(['/login']);
  }
}
