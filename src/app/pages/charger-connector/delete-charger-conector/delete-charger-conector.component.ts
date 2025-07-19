import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-charger-conector',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-charger-conector.component.html',
  styleUrl: './delete-charger-conector.component.scss'
})
export class DeleteChargerConectorComponent {

  constructor(
    public Dialogref : MatDialogRef<DeleteChargerConectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:number}
  ){}

  onConfirm(){
    this.Dialogref.close(true);
  }

  onCancel(){
    this.Dialogref.close();
  }

}
