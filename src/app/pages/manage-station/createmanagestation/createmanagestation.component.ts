import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { StationService } from '../../../services/manage-station.service';
import { AuthService } from '../../../services/login.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface DialogData {
  edit?: boolean;
  view?: boolean;
  station?: any;
}

@Component({
  selector: 'app-createmanagestation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './createmanagestation.component.html',
  styleUrls: ['./createmanagestation.component.scss']
})
export class CreatemanagestationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreatemanagestationComponent>);
  private stationService = inject(StationService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  public data = inject<DialogData>(MAT_DIALOG_DATA, { optional: true });

  stationId: number | null = null;

  form: FormGroup = this.fb.group({
    cpo: ['', Validators.required],
    name: ['', Validators.required],
    code: [''],
    description: [''],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required],
    locationtype: ['', Validators.required],
    contactpersonname: ['', Validators.required],
    mobile: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address1: ['', Validators.required],
    address2: [''],
    pincode: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    landmark: [''],
    commissionDate: ['', Validators.required],
    registerAs: ['', Validators.required],
    electricityline: ['', Validators.required],
    opentime: ['', Validators.required],
    closetime: [''],
    status: [true],
    amenities: [[], Validators.required]
  });

  cpoList: any[] = [];
  locationTypes: any[] = [];
  registrationTypes: any[] = [];
  electricityLines: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  amenitiesList: any[] = [];

  async ngOnInit() {
    const userId = this.authService.getUserId();

    if (userId) {
      await this.loadDropdowns(userId);

      if (this.data?.edit || this.data?.view) {
        if (this.data.station?.id) {
          this.stationId = this.data.station.id;
        }
        this.patchForm(this.data.station);

        if (this.data.view) {
          this.form.disable(); // Disable form for view-only mode
        }
      }
    }

    this.form.get('state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.stationService.getCitiesByState(stateId).subscribe({
          next: res => {
            this.cities = res || [];
            if (!this.data?.edit && !this.data?.view) {
              this.form.get('city')?.setValue('');
            }
          },
          error: err => console.error('Failed to load cities', err)
        });
      } else {
        this.cities = [];
        this.form.get('city')?.setValue('');
      }
    });
  }

  async loadDropdowns(userId: number): Promise<void> {
    try {
      const cpos = await firstValueFrom(this.stationService.getCpoList(userId));
      const locationTypes = await firstValueFrom(this.stationService.getLocationTypes());
      const registrationTypes = await firstValueFrom(this.stationService.getChargerRegistrationTypes());
      const electricityLines = await firstValueFrom(this.stationService.getElectricityLineTypes());
      const countries = await firstValueFrom(this.stationService.getCountries());
      const states = await firstValueFrom(this.stationService.getStates());
      const amenitiesResponse = await firstValueFrom(this.stationService.getAmenities());

      this.cpoList = cpos || [];
      this.locationTypes = locationTypes || [];
      this.registrationTypes = registrationTypes || [];
      this.electricityLines = electricityLines || [];
      this.countries = countries || [];
      this.states = states || [];
      this.amenitiesList = amenitiesResponse?.data || [];
    } catch (error) {
      console.error('Error loading dropdowns', error);
    }
  }

  patchForm(station: any) {
    this.form.patchValue({
      cpo: +station.cpo_id,
      name: station.name,
      code: station.code,
      description: station.description,
      latitude: station.lat,
      longitude: station.lng,
      locationtype: +station.location_type_id,
      contactpersonname: station.cp_name,
      mobile: station.mobile,
      email: station.email,
      address1: station.address1,
      address2: station.address2,
      pincode: station.PIN,
      state: +station.state_id,
      country: +station.country_id,
      landmark: station.landmark,
      commissionDate: this.formatDateForInput(station.commissioned_dt),
      registerAs: +station.register_as,
      electricityline: +station.electricity_line_id,
      opentime: station.o_time,
      closetime: station.c_time,
      status: station.status === 'Y',
      amenities: station.amenities?.map((a: any) => a.id) || []
    });

    if (station.state_id) {
      this.stationService.getCitiesByState(station.state_id).subscribe({
        next: res => {
          this.cities = res || [];
          this.form.get('city')?.setValue(+station.city_id);
        },
        error: err => console.error('Failed to load cities for edit', err)
      });
    }
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.form.invalid || this.data?.view) return;

    const userId = this.authService.getUserId();
    const payload: any = {
      cpo_id: this.form.value.cpo,
      name: this.form.value.name,
      code: this.form.value.code,
      description: this.form.value.description,
      address1: this.form.value.address1 || '',
      address2: this.form.value.address2 || '',
      PIN: this.form.value.pincode || 0,
      landmark: this.form.value.landmark || '',
      city_id: this.form.value.city,
      state_id: this.form.value.state,
      country_id: this.form.value.country,
      lat: this.form.value.latitude,
      lng: this.form.value.longitude,
      location_type_id: this.form.value.locationtype,
      cp_name: this.form.value.contactpersonname,
      mobile: this.form.value.mobile,
      email: this.form.value.email,
      commissioned_dt: this.form.value.commissionDate || '',
      register_as: this.form.value.registerAs,
      electricity_line_id: this.form.value.electricityline,
      o_time: this.form.value.opentime,
      c_time: this.form.value.closetime,
      status: this.form.value.status ? 'Y' : 'N',
      amenities: this.form.value.amenities
    };

    if (this.data?.edit && this.stationId) {
      payload.id = this.stationId;
      payload.modified_by = userId;
      payload.modified_date = new Date().toISOString();
      this.stationService.updateStation(this.stationId, payload).subscribe({
        next: res =>{
          console.log(res);
          if(res.status == true){
            this.snackBar.open('Successfully updated','Close', {duration: 3000});
          }
          else{
            this.snackBar.open(`${res.message}`, 'close', {duration: 4000})
          }
          
          this.dialogRef.close(res);
        } ,
        error: err => console.error('Update failed:', err)
      });
    } else {
      payload.created_by = userId;
      payload.created_date = new Date().toISOString();
      this.stationService.createStation(payload).subscribe({
        next: res =>{

          console.log(res);
          if(res.status== true){
            this.snackBar.open('successfully created', 'Close');
          }
          else{
            this.snackBar.open(`${res.message}`, 'Close', {duration: 4000});
          }
          
          this.dialogRef.close(res)
        } ,
        error: err => console.error('Create failed:', err)
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
