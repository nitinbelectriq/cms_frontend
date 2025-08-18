import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Subject, of } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';

import { roleActivity, Client, Role, MenuItem } from '../../services/role-activity.service';

import { MenuItemComponent } from '../manage-role-activity/menu-item/menu-item.component';

@Component({
  selector: 'app-manage-role-activity',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MenuItemComponent,
  ],
  templateUrl: './manage-role-activity.component.html',
  styleUrls: ['./manage-role-activity.component.scss'],
})
export class ManageRoleActivityComponent implements OnInit, OnDestroy {
  form: FormGroup;
  clients: Client[] = [];
  roles: Role[] = [];
  list: MenuItem[] = [];

  loadingClients = false;
  loadingRoles = false;
  loadingMenus = false;

  private fb = inject(FormBuilder);
  private roleActivityService = inject(roleActivity);

  private destroy$ = new Subject<void>();
  private userId = 0;
  private projectId = 0;

  constructor() {
    this.form = this.fb.group({
      client: [null],
      role: [null],
    });
  }

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('user_id')) || 0;
    this.projectId = Number(localStorage.getItem('project_id')) || 0;

    this.loadClients();
  }

  private loadClients(): void {
    this.loadingClients = true;
    this.roleActivityService.getActiveClientsCW(this.userId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingClients = false)),
        catchError(err => {
          console.error('Failed to load clients', err);
          return of([] as Client[]);
        })
      )
      .subscribe(clients => (this.clients = clients));
  }

  onClientChange(clientId: number | null): void {
    this.roles = [];
    this.list = [];
    this.form.patchValue({ role: null }, { emitEvent: false });

    if (!clientId) return;

    this.loadingRoles = true;
    this.roleActivityService.getActiveRolesByClientId(this.projectId, clientId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingRoles = false)),
        catchError(err => {
          console.error('Failed to load roles', err);
          return of({ status: false, err_code: 'ERR', message: '', count: 0, data: [] as Role[] });
        })
      )
      .subscribe(res => {
        if (res.data && res.status) {
          this.roles = res.data;
        } else {
          console.warn('Roles API returned false status', res);
        }
      });
  }

  onRoleChange(roleId: number | null): void {
    this.list = [];

    const clientId = this.form.get('client')?.value;
    if (!clientId || !roleId) return;

    this.loadingMenus = true;
    this.roleActivityService.getMenusByClientIdWithRole(this.projectId, clientId, roleId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingMenus = false)),
        catchError(err => {
          console.error('Failed to load menus', err);
          return of({ status: false, err_code: 'ERR', message: '', count: 0, data: [] as MenuItem[] });
        })
      )
      .subscribe(res => {
        if (res && res.status) {
          this.list = this.buildMenuTree(res.data);
        } else {
          console.warn('Menus API returned false status', res);
        }
      });
  }

  private buildMenuTree(flatMenus: MenuItem[]): MenuItem[] {
    const map = new Map<number, MenuItem>();
    const roots: MenuItem[] = [];

    flatMenus.forEach(item => {
      item.expanded = false;
      map.set(item.menu_id, { ...item, children: [] });
    });

    map.forEach(item => {
      if (item.parent_id === null) {
        roots.push(item);
      } else {
        const parent = map.get(item.parent_id);
        if (parent) {
          parent.children!.push(item);
        } else {
          roots.push(item); // fallback if parent missing
        }
      }
    });

    return roots;
  }

  onMenuItemToggle(node: MenuItem) {
    this.setChildrenChecked(node, node.isAssigned ?? false);
  }

  private setChildrenChecked(node: MenuItem, checked: boolean) {
    if (node.children) {
      node.children.forEach(child => {
        child.isAssigned = checked;
        this.setChildrenChecked(child, checked);
      });
    }
  }

  onMenuItemExpandToggle(node: MenuItem) {
    node.expanded = !node.expanded;
  }

  onSubmit() {
    const clientId = this.form.value.client;
    const roleId = this.form.value.role;

    if (!clientId || !roleId) {
      alert('Please select client and role');
      return;
    }

    const nowIso = new Date().toISOString();

    const selectedMenus = this.collectSelectedMenus(this.list, nowIso);

    if (selectedMenus.length === 0) {
      alert('Please select at least one menu');
      return;
    }

    const payload = {
      client_id: clientId,
      role_id: roleId,
      menus: selectedMenus,
      created_by: this.userId,
      modify_by: this.userId,
      created_date: nowIso,
      modify_date: nowIso,
      status: 'Active',
    };

    this.roleActivityService.saveRoleMenus(payload)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error('Failed to save role menus', err);
          alert('Failed to save menus');
          return of({ status: false, err_code: 'ERR', message: 'Error', count: 0, data: null });
        })
      )
      .subscribe(res => {
        if (res && res.status) {
          alert('Menus saved successfully!');
        } else {
          alert('Failed to save menus');
        }
      });
  }

  private collectSelectedMenus(nodes: MenuItem[], nowIso: string): any[] {
    const result: any[] = [];
    nodes.forEach(node => {
      if (node.isAssigned) {
        result.push({
          client_id: node.client_id,
          role_id: this.form.value.role,
          menu_id: node.menu_id,
          title: node.title,
          display_order: 0,
          menus: [],
          status: 'Active',
          created_date: nowIso,
          created_by: this.userId,
          modify_date: nowIso,
          modify_by: this.userId,
        });
      }
      if (node.children && node.children.length) {
        result.push(...this.collectSelectedMenus(node.children, nowIso));
      }
    });
    return result;
  }

  onCancel() {
    this.form.reset({ client: null, role: null });
    this.roles = [];
    this.list = [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
