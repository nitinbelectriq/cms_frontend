import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/sidebar.component').then(m => m.SidebarComponent) // ✅ Make sure HomeComponent is exported
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
