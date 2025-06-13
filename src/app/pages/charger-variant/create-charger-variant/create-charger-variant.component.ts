import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-create-charger-variant',
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
  templateUrl: './create-charger-variant.component.html',
  styleUrl: './create-charger-variant.component.scss'
})
export class CreateChargerVariantComponent {

  dialogRef = inject(MatDialogRef<CreateChargerVariantComponent>);
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    variant: ['', Validators.required],
    decription: ['', Validators.required],
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
