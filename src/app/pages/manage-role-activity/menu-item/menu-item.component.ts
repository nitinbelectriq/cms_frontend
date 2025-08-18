import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { MenuItem } from '../../../services/role-activity.service';

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
