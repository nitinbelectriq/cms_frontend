import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import("./pages/login.component").then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import("./pages/sidebar.component").then((m) => m.SidebarComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import("./pages/home.component").then((m) => m.HomeComponent),
      },
      {
        path: 'charger-model',
        children: [
          {
            path: '',
            loadComponent: () =>
              import("./pages/charger-model/charger-model.component").then((m) => m.ChargerModelComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import("./pages/charger-model/edit-charger-model-dialog/edit-charger-model-dialog.component").then((m) => m.EditChargerModelDialogComponent),
          }
        ],
      },
      {
        path: 'charger-variant',
        loadComponent: () =>
          import("./pages/charger-variant/charger-variant.component").then((m) => m.ChargerVariantComponent),
      },
      {
        path: 'manage-chargers',
        loadComponent: () =>
          import("./pages/manage-charger/manage-charger.component").then((m) => m.ManageChargersComponent),
      },
      {
        path: 'connectors',
        loadComponent: () =>
          import("./pages/charger-connector/charger-connector.component").then((m) => m.ConnectorsComponent),
      },
      {
        path: 'rfid',
        loadComponent: () =>
          import("./pages/rfid/rfid.component").then((m) => m.RfidComponent),
      },
      {
        path: 'manage-cpo',
        loadComponent: () => import('./pages/manage-cpo/manage-cpo.component').then(m => m.ManageCpoComponent)
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

