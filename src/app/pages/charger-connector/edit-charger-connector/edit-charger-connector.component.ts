import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ViewChargerConnectorComponent } from '../view-charger-connector/view-charger-connector.component';


@Component({
  selector: 'app-edit-charger-connector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
          MatDialogModule,
          MatFormFieldModule,
          MatInputModule,
          MatButtonModule,
          MatSlideToggleModule
  ],
  templateUrl: './edit-charger-connector.component.html',
  styleUrl: './edit-charger-connector.component.scss'
})
export class EditChargerConnectorComponent {
  dialogRef = inject(MatDialogRef<EditChargerConnectorComponent>);
      fb = inject(FormBuilder);
    
      form: FormGroup = this.fb.group({
        connectorId: ['', Validators.required],
        type: ['', Validators.required],
        status: [true]
      });
    
  
    onCancel(): void {
      this.dialogRef.close();
    }
  
    onSubmit(): void {
      if (this.form.valid) {
        this.dialogRef.close(this.form.value);
      }
    }
  

}
