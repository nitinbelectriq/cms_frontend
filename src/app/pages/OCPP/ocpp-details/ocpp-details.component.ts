import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { OCPPService } from '../../../services/ocpp.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';

@Component({
  standalone: true,
  selector: 'app-charger-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    HttpClientModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatRadioButton
    
  ],
  providers: [DatePipe],
  templateUrl: './ocpp-details.component.html',
  styleUrls: ['./ocpp-details.component.scss']
})
export class ChargerDetailComponent implements OnInit {
  displayedColumns: string[] = ['action', 'request', 'response',  'request_date',];
  displayedColumns1: string[] = ['select', 'key', 'value', 'action'];

  dataSource = [
  {
    action: 'Remote Start',
    request: JSON.stringify({ connectorId: 1, idTag: 'USER123' }),
    response: JSON.stringify({ status: 'Accepted', message: 'Charging started' }),
    request_date: '2025-07-31 10:25:43'
  },
  {
    action: 'Remote Stop',
    request: JSON.stringify({ transactionId: 101 }),
    response: JSON.stringify({ status: 'Accepted', message: 'Charging stopped successfully' }),
    request_date: '2025-07-31 10:30:11'
  },
  {
    action: 'Set Configuration',
    request: JSON.stringify({ key: 'ConnectionTimeOut', value: '30' }),
    response: JSON.stringify({ status: 'Accepted' }),
    request_date: '2025-07-31 11:02:55'
  },
  {
    action: 'Unlock Connector',
    request: JSON.stringify({ connectorId: 2 }),
    response: JSON.stringify({ status: 'Rejected', message: 'Connector already unlocked' }),
    request_date: '2025-07-31 11:15:20'
  },
  {
    action: 'Clear Cache',
    request: JSON.stringify({}),
    response: JSON.stringify({ status: 'Accepted' }),
    request_date: '2025-07-31 11:35:05'
  }
];


  chargerId = '';
  charger: any;
  showActions = false;
  showSettings = false;
  //
  list: any[]=[];
  item={};
  id_of_active_transaction='';
  current_active_tranjection= '';
  resetbtn= false;
  binding='';

  //
  selectedAction: string | null = null;

  menus: any[] = [];
  availabilityTypes: any[] = [];
  heartbeatData: any;
  chargerStatus: any;
  rfidList: any[] = [];
  connectorStatus: any;

  private route = inject(ActivatedRoute);
  private ocppService = inject(OCPPService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  

  ngOnInit(): void {
    this.chargerId = this.route.snapshot.paramMap.get('id') || '';
    const loginId = localStorage.getItem('user_id') || '';
    const payload = { cpo_id: '', station_id: '' };

    this.ocppService.getChargersDynamic(loginId, payload).subscribe((res) => {
      const found = res.data.find((item) => item.serial_no === this.chargerId);
      this.charger = found;

      if (this.charger) {
        this.loadAdditionalData();
      }
    });
  }

  loadAdditionalData() {
    const serialNo = this.charger.serial_no;
    const cpoId = this.charger.cpo_id || '1';

    this.ocppService.getMenus().subscribe((res) => {
      this.menus = res?.data || [];
    });

    this.ocppService.getAvailabilityTypes().subscribe((res) => {
      this.availabilityTypes = res?.data || [];
    });

    this.ocppService.getHeartbeat({ charger_id: this.charger.serial_no }).subscribe((res) => {
      this.heartbeatData = res.data;
      this.heartbeatData.formattedDate = this.datePipe.transform(
        res.data.last_ping_datetime,
        'dd-MM-yyyy, h:mm:ss a',
        'Asia/Kolkata'
      );
      this.chargerStatus = res;
    });

    this.ocppService.getRFIDsByCpoId(cpoId).subscribe((res) => {
      this.rfidList = res?.data || [];
    });

    this.ocppService.getChargerConnectorStatus(serialNo).subscribe((res) => {
      this.connectorStatus = res;
      // Update charger.connector_data with connector status if needed
      // Assuming you want to overwrite or augment charger.connector_data
      if (res?.data) {
        this.charger.connector_data = res.data;
      }
    });
  }

  toggleActions(): void {
    this.showActions = !this.showActions;
    this.showSettings = false;
    this.resetbtn= false;
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    this.showActions = false;
  }

  //

// Global selected task from the shared panel
selectedTask: string | null = null;


performTask(connectorNo: number, task: string) {
  console.log(`Performing ${task} on connector ${connectorNo}`);
  // Add API call or business logic here
}



  //

  // expanding the connector
  expandedConnectors: Set<number> = new Set();

toggleExpand(connectorNo: number) {
  if (this.expandedConnectors.has(connectorNo)) {
    this.expandedConnectors.delete(connectorNo);
  } else {
    this.expandedConnectors.add(connectorNo);
  }
}


  performCommand(command: string): void {
    console.log(`Executing ${command}...`);
  }

  getLocalListVersion() {
    this.performCommand('Get Local List Version');
    this.ocppService.getlocallistversion().subscribe((res)=>{

    });
  }

  // clearCache() {
  //   this.performCommand('Clear Cache');
  //   this.ocppService.clearCache({command: 'CLEAR_CACHE', charger_id: this.charger.serial_no, 
  //     charger_sr_no: this.chargerId , connector: this.charger.connector_no}).subscribe((res)=>{
  //       console.log('this is clear cache result :', res);
  //     })
  // }

  clearCache() {
  const payload = {
    command: 'CLEAR_CACHE',
    charger_id: this.charger.charger_id,
    charger_sr_no: this.chargerId,
    connector: this.charger?.ConnectorData?.connector_no || 1,
  };

  console.log('Sending clear cache payload:', payload);
  console.log('Charger object:', this.charger);


  this.performCommand('Clear Cache');
  this.ocppService.clearCache(payload).subscribe({
    next: (res) => {
      console.log('Clear cache response:', res);
    },
    error: (err) => {
      console.error('Clear cache error:', err);
    }
  });
}


  reset() {
    this.resetbtn= !this.resetbtn;
   // this.performCommand('Reset');

    
  }
  hardReset(){
    //
    this.ocppService.resetHard({command: 'RESET_HARD', charger_id: this.charger.serial_no,
      charger_sr_no: this.chargerId , connector: this.charger.connector_no
     }).subscribe((res)=>{
      console.log(res);
     })
  }

  startChargingStation(){
    this.ocppService.startChargingStation({}).subscribe((res)=>{

    });
  }

  stopChargingStation(){
    this.ocppService.stopChargingStation({}).subscribe();
  }

  changeAvailability(){
    this.ocppService.changeAvailability({}).subscribe((res)=>{

    });
  }

  unlockConnector(){
    this.ocppService.unlockConnector({}).subscribe((res)=>{

    });
  }

  dataTransfer(){
    this.ocppService.dataTransfer({}).subscribe((res)=>{

    });
  }

  getAvailabilityType(){
    this.ocppService.getAvailabilityTypes().subscribe((res)=>{

    });
  }

  getdiagnostics(){
    this.ocppService.getdiagnostics({}).subscribe();
  }

  getUpdateFirmware(){
    this.ocppService.getUpdateFirmware({}).subscribe();
  }

  getDataTriggerMessage(){
    this.ocppService.getDataTriggerMessage({}).subscribe();
  }

  getChangeConfiguration(){
    this.ocppService.getChangeConfiguration({}).subscribe();
  }

  getReserveNow(){
    this.ocppService.getReserveNow({}).subscribe();
  }

  getActiveChargingStationsWithChargersAndConnectorsCW(){
     const loginId = localStorage.getItem('user_id') || '';
    this.ocppService.getActiveChargingStationsWithChargersAndConnectorsCW(loginId).subscribe((res)=>{

    });
  }

  getActiveChargingStationsCW(){
    const loginId = localStorage.getItem('user_id') || '';
    this.ocppService.getActiveChargingStationsCW(loginId).subscribe((res)=>{

    });
  }

  getAllChargingStationsWithChargersAndConnectorsCW(){
    const userId = localStorage.getItem('user_id') || '';
    this.ocppService.getAllChargingStationsWithChargersAndConnectorsCW(userId).subscribe((res) =>{

    });
  }

  getConfiguration(){
    this.ocppService.getConfiguration({}).subscribe();
  }

  getStatus(){
    this.ocppService.getStatus({}).subscribe((res) =>{

    });
  }

  getChargerConfigurationKeys(){
    this.ocppService.getChargerConfigurationKeys().subscribe((res)=>{

    })
  }

  getChargingStationsByUserRoleAndLatLong(){
     const userId = localStorage.getItem('user_id') || '';
    this.ocppService.getChargingStationsByUserRoleAndLatLong(userId, {}).subscribe((res) =>{

    });
  }

  getchargerConnectorStatus(){
    this.ocppService.getChargerConnectorStatus(this.charger.charger_id).subscribe(()=>{

    });
  }

  getChargingStationsByUserRoleAndLatLongUW(){
     const userId = localStorage.getItem('user_id') || '';
    this.ocppService.getChargingStationsByUserRoleAndLatLongUW(userId, {}).subscribe(() => {

    });
  }



  goBackToLogs(): void {
    this.router.navigate(['/home/ocpp-diagnostic']);
  }

  // Map connector status to Angular Material color
  getConnectorIconColor(status: string): string {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'charging':
        return 'primary'; // blue or any primary color
      case 'available':
        return 'accent';  // usually pink-ish
      case 'faulted':
      case 'unavailable':
        return 'warn';    // red
      case 'offline':
        return 'default'; // grey or default
      default:
        return 'default';
    }
  }
}
