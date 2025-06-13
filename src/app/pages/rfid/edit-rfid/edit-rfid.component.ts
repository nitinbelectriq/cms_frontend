import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-edit-rfid',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule],
  templateUrl: './edit-rfid.component.html',
  styleUrl: './edit-rfid.component.scss'
})
export class EditRfidComponent {

  dialogRef= inject(MatDialogRef<EditRfidComponent>);
  fb = inject(FormBuilder);
  form : FormGroup = this.fb.group({
    rfidId: ['', Validators.required],
    assignedTo: ['', Validators.required],
    status: [true],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() :void{
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }


}
