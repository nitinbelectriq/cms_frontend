import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

export interface MenuItem {
  rm_map_id: number;
  menu_id: number;
  title: string;
  client_id: number;
  parent_id: number | null;
  children?: MenuItem[];
  isAssigned?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() node!: MenuItem;
  @Output() toggleCheckbox = new EventEmitter<MenuItem>();
  @Output() toggleExpand = new EventEmitter<MenuItem>();

  onCheckboxChange() {
    this.toggleCheckbox.emit(this.node);
  }

  onToggleExpand() {
    this.toggleExpand.emit(this.node);
  }
}
