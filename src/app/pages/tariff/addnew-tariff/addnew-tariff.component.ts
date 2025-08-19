import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-addnew-tariff',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './addnew-tariff.component.html',
  styleUrl: './addnew-tariff.component.scss'
})
export class AddnewTariffComponent {
  types: any=[];
  applicableTo: any=[];
  isEditMode= false;

  private fb= inject(FormBuilder);
  form: FormGroup = this.fb.group({
    type: [null],
    name: [''],
    costingType: [''],
    chargingFee: [''],
    idleFee: [''],
    stateTax: [''],
    weight: [''],
  });

  constructor(
    private dialogRef: MatDialogRef<AddnewTariffComponent>
  ){}

  onSubmit(){
    // code
  }

  onCancel(){
    this.dialogRef.close();
  }

  }


