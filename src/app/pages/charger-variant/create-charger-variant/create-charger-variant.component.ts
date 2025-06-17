import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-charger-variant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './create-charger-variant.component.html',
  styleUrls: ['./create-charger-variant.component.scss']
})
export class CreateChargerVariantComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateChargerVariantComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({ 
      chargermodel: ['', Validators.required],
      manufacturer: ['', Validators.required],
      chargermodeltype: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      protocol: ['', Validators.required],
      mode: ['', Validators.required],
      cardreadertype: ['', Validators.required],
      numberOfConnectors: ['', Validators.required],
      batteryBackup1: [false],
      batteryBackup2: [false],
      batteryBackup3: [false],
      connector1: ['', Validators.required],
      iotype: ['', Validators.required],
      currentType: ['', Validators.required],
      voltage: ['', Validators.required],
      phase: ['', Validators.required],
      maxampere: ['', Validators.required],
      power: ['', Validators.required],
      frequency: ['', Validators.required],
      status: [true]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted!', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
