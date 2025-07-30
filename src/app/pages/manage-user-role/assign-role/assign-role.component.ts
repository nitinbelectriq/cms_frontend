import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-assign-role',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule


  ],
  templateUrl: './assign-role.component.html',
  styleUrl: './assign-role.component.scss'
})
export class AssignRoleComponent {
  private fb= inject(FormBuilder);
  

  clients: any[]=[];
  roles: any[]= [];
  users: any[]= [];

  constructor(
    private dialogRef: MatDialogRef<AssignRoleComponent>,
  ){

  }


  form: FormGroup = this.fb.group({
    client: [null],
    user: [null],
    role: [null],
  });

  onSubmit(){
    //
  }

  onCancel(){
    //
    this.dialogRef.close();
  }

}
