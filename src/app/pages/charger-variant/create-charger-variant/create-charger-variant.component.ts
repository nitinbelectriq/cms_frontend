import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChargerVariantService } from '../../../services/charger-variant.service';
import { AuthService } from '../../../services/login.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-charger-variant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './create-charger-variant.component.html',
  styleUrls: ['./create-charger-variant.component.scss']
})
export class CreateChargerVariantComponent implements OnInit {
  form!: FormGroup;

  chargerModels: any[] = [];
  manufacturers: any[] = [];
  modelTypes: any[] = [];
  protocols: any[] = [];
  communicationModes = ['LAN', 'SIM', 'WIFI'];
  connectorOptions: any[] = [];
  ioTypeOptions: any[] = [];
  currentTypeOptions: any[] = [];

  isEditMode = false;
  editId: string | number | null = null;
   Snackbar = inject(MatSnackBar)

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateChargerVariantComponent>,
    private chargerVariantService: ChargerVariantService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
   
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();

    if (this.data && this.data.id) {
      this.isEditMode = true;
      this.editId = this.data.id;
      this.loadChargerVariant(this.editId!);
    } else {
      // Only add connector once on create mode
      this.addConnector();
      const userId = this.authService.getUserId();
      if (userId) {
        this.form.patchValue({ created_by: userId });
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      client_id: [null],
      charger_type_id: [null, Validators.required],
      manufacturer_id: [null, Validators.required],
      charger_model_type_id: [null, Validators.required],
      battery_backup: [false],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      communication_protocol_id: [null, Validators.required],
      communication_mode: [[], Validators.required],
      card_reader_type: [false],
      no_of_connectors: [0],
      isDual: [0],
      status: [true],
      created_by: [null],
      connector_data: this.fb.array([])
    });
  }

  get connector_data(): FormArray {
    return this.form.get('connector_data') as FormArray;
  }

  addConnector(connectorValue: any = null) {
    const connectorGroup = this.fb.group({
      connector: [connectorValue?.connector_type_id ?? null, Validators.required],
      iotype: [connectorValue?.io_type_id ?? null, Validators.required],
      currentType: [connectorValue?.current_type_id ?? null, Validators.required],
      voltage: [connectorValue?.voltage ?? '', Validators.required],
      phase: [connectorValue?.phase ?? '', Validators.required],
      maxampere: [connectorValue?.max_amp ?? '', Validators.required],
      power: [connectorValue?.power ?? '', Validators.required],
      frequency: [connectorValue?.frequency ?? '', Validators.required]
    });
    this.connector_data.push(connectorGroup);
    this.form.patchValue({ no_of_connectors: this.connector_data.length });
  }

  removeConnector(index: number) {
    if (this.connector_data.length > 1) {
      this.connector_data.removeAt(index);
      this.form.patchValue({ no_of_connectors: this.connector_data.length });
    }
  }

  loadDropdowns() {
    this.chargerVariantService.getChargerModels().subscribe(data => this.chargerModels = data);
    this.chargerVariantService.getManufacturers().subscribe(data => this.manufacturers = data);
    this.chargerVariantService.getModelTypes().subscribe(data => this.modelTypes = data);

    this.chargerVariantService.getProtocols().subscribe({
      next: (response: any) => {
        this.protocols = Array.isArray(response) ? response : [response];
      },
      error: (err) => {
        console.error('Error loading protocols', err);
        this.protocols = [];
      }
    });

    this.chargerVariantService.getConnectorTypes().subscribe(data => this.connectorOptions = data);
    this.chargerVariantService.getIoTypes().subscribe(data => this.ioTypeOptions = data);
    this.chargerVariantService.getCurrentTypes().subscribe(data => this.currentTypeOptions = data);
  }

  loadChargerVariant(id: string | number) {
    this.chargerVariantService.getChargerVariantById(id).subscribe({
      next: (data) => this.prefillForm(data),
      error: (error) => console.error('Error loading charger variant for edit', error)
    });
  }

  prefillForm(data: any) {
    // Clear connectors
    while (this.connector_data.length) {
      this.connector_data.removeAt(0);
    }

    this.form.patchValue({
      client_id: data.client_id,
      charger_type_id: data.charger_type_id,
      manufacturer_id: data.manufacturer_id,
      charger_model_type_id: data.charger_model_type_id,
      battery_backup: data.battery_backup === 'Y',
      code: data.code,
      name: data.name,
      description: data.description,
      communication_protocol_id: data.communication_protocol_id,
      communication_mode: data.communication_mode ? data.communication_mode.split(',') : [],
      card_reader_type: data.card_reader_type === 'Y',
      status: data.status === 'Y',
      created_by: data.createdby,
      isDual: 0
    });

    // Fill connectors from API data
    if (data.connectors && Array.isArray(data.connectors) && data.connectors.length > 0) {
      data.connectors.forEach((conn: any) => {
        this.addConnector({
          connector_type_id: conn.connector_type_id,
          io_type_id: conn.io_type_id,
          current_type_id: conn.current_type_id,
          voltage: conn.voltage,
          phase: conn.phase,
          max_amp: conn.max_amp,
          power: conn.power,
          frequency: conn.frequency
        });
      });
    } else {
      this.addConnector();
    }

    this.form.patchValue({ no_of_connectors: this.connector_data.length });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload = {
      client_id: formValue.client_id,
      charger_type_id: formValue.charger_type_id,
      manufacturer_id: formValue.manufacturer_id,
      charger_model_type_id: formValue.charger_model_type_id,
      battery_backup: formValue.battery_backup ? 'Y' : 'N',
      code: formValue.code,
      name: formValue.name,
      description: formValue.description,
      communication_protocol_id: formValue.communication_protocol_id,
      communication_mode: formValue.communication_mode.join(','),
      card_reader_type: formValue.card_reader_type ? 'Y' : 'N',
      no_of_connectors: this.connector_data.length,
      isDual: 0,
      status: formValue.status ? 'Y' : 'N',
      created_by: formValue.created_by,
      connector_data: formValue.connector_data.map((conn: any) => ({
        connector_type_id: conn.connector,
        io_type_id: conn.iotype,
        current_type_id: conn.currentType,
        voltage: conn.voltage,
        phase: conn.phase,
        max_amp: conn.maxampere,
        power: conn.power,
        frequency: conn.frequency
      }))
    };

    if (this.isEditMode && this.editId !== null) {
      const updatedData = { ...payload, id: this.editId ,modify_by: this.authService.getUserId()};
      this.chargerVariantService.update(updatedData).subscribe({
        next: (res) =>{
          
          this.Snackbar.open('Charger Variant successfully updated', 'Close', {duration: 3000});
          //this.dialogRef.close(res);
          this.dialogRef.close(true);
        } ,
        error: (err) =>{
          console.error('Error updating charger variant', err);
          this.Snackbar.open(`Failed to update charger. Please try again!. ${err.error.message}`,'Close', {duration: 4000})
        } 
      });
    } else {
      this.chargerVariantService.create(payload).subscribe({
       // next: () => this.dialogRef.close(true),
       next: (res) =>{
          
        this.Snackbar.open('Charger Variant successfully created', 'Close', {duration: 3000});
        //this.dialogRef.close(res);
        this.dialogRef.close(true);
      } ,
        error: (err) =>{
          console.error('Error creating charger variant', err);
          this.Snackbar.open(`Failed to create charger. Please try again!. ${err.error.message}`, 'Close', {duration: 4000})
        } 
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  // Helper functions to get selected names for display in edit mode (read-only fields)

  getSelectedChargerModelName(): string {
    const id = this.form.get('charger_type_id')?.value;
    const found = this.chargerModels.find(m => m.id === id);
    return found ? found.name : '';
  }

  getSelectedManufacturerName(): string {
    const id = this.form.get('manufacturer_id')?.value;
    const found = this.manufacturers.find(m => m.id === id);
    return found ? found.name : '';
  }

  getSelectedModelTypeName(): string {
    const id = this.form.get('charger_model_type_id')?.value;
    const found = this.modelTypes.find(m => m.id === id);
    return found ? found.name : '';
  }

  getSelectedProtocolName(): string {
    const id = this.form.get('communication_protocol_id')?.value;
    const found = this.protocols.find(m => m.id === id);
    return found ? found.name : '';
  }
}
