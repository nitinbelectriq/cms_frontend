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
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {provideNativeDateAdapter} from '@angular/material/core';


@Component({
  selector: 'app-create-rfid',
  standalone: true,
  imports: [CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatDatepickerModule,
       
      ],
  templateUrl: './create-rfid.component.html',
  styleUrl: './create-rfid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class CreateRfidComponent {
  dialogRef= inject(MatDialogRef<CreateRfidComponent>);
  fb = inject(FormBuilder);
  form : FormGroup = this.fb.group({
    rfidId: ['', Validators.required],
    expirydate: [''],
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
