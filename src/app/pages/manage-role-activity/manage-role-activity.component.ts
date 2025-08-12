import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-manage-role-activity',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule

  ],
  templateUrl: './manage-role-activity.component.html',
  styleUrl: './manage-role-activity.component.scss'
})
export class ManageRoleActivityComponent {
  clients: any[]=[];
  list: any[]=[];
  roles: any[]=[];
  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    client: [null],
    role: [null],
    item: [null],
    unselectAll: [false],
    uncollasped: [false],

  })

  onSubmit(){
    //
  }

  onCancel(){

  }

}
