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
  selector: 'app-add-new-role',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule

  ],
  templateUrl: './add-new-role.component.html',
  styleUrl: './add-new-role.component.scss'
})
export class AddNewRoleComponent {
  clients : any[] = [];
  isEditMode=false;

  private fb = inject(FormBuilder);
  form : FormGroup = this.fb.group({
    
    client: [null],
    description: [''],
    code: [''],
    name: [''],
    status: [true]


  });

  constructor(
    private dialogRef: MatDialogRef<AddNewRoleComponent>,
  ){}

  onSubmit(){
    // code
  }

  onCancel(){
    this.dialogRef.close();
  }


}
