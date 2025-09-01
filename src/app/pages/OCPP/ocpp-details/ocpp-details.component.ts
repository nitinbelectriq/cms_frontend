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
import { MatSnackBar } from '@angular/material/snack-bar';

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
 displayedColumnsLogs: string[] = ['action', 'request', 'response', 'request_date'];
  displayedColumns1: string[] = ['select', 'key', 'value', 'action'];

  dataSourceLogs: any[] = [];
  dataSource: any[] = [];


  chargerId = '';
  charger: any;
  showActions = false;
  showSettings = false;

  list: any[] = [];
  item = {};
  id_of_active_transaction = '';
  current_active_tranjection = '';
  resetbtn = false;
  binding = '';

  selectedAction: string | null = null;
  selectedTask: string | null = null;
idTagType: string | null = null;       // for radio button
selectedRfid: string | null = null; // will hold the rf_id_no
selectTrigger='';


  menus: any[] = [];
  availabilityTypes: any[] = [];
  heartbeatData: any;
  chargerStatus: any;
  rfidList: any[] = [];
  connectorStatus: any;

  expandedConnectors: Set<number> = new Set();
loginId: string = '';
  private route = inject(ActivatedRoute);
  private ocppService = inject(OCPPService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  private snackBar = inject(MatSnackBar);
connectors: any[] = [];
  ngOnInit(): void {
    this.chargerId = this.route.snapshot.paramMap.get('id') || '';
    const loginId = localStorage.getItem('user_id') || '';
    const payload = { cpo_id: '', station_id: '' };
  this.loginId = localStorage.getItem('user_id') || '';
    this.ocppService.getChargersDynamic(loginId, payload).subscribe((res) => {
      const found = res.data.find((item) => item.serial_no === this.chargerId);
      this.charger = found;
       if (this.charger) {
      this.connectors = this.charger.connector_data || [];
      this.loadAdditionalData();
    }
    });
  }
loadOcppLogs() {
  if (!this.charger) return;

 const toDate = new Date();
const fromDate = new Date(toDate);
fromDate.setDate(toDate.getDate() - 1);

// Only date (yyyy-MM-dd)
const fromDateStr = this.datePipe.transform(fromDate, 'yyyy-MM-dd', 'Asia/Kolkata')!;
const toDateStr = this.datePipe.transform(toDate, 'yyyy-MM-dd', 'Asia/Kolkata')!;

console.log('📅 Date Range:', fromDateStr, '→', toDateStr);

this.ocppService.getOcppLogs(
  this.charger.serial_no,
  this.loginId,
  fromDateStr,
  toDateStr
).subscribe({
  next: (res: any) => {
    console.log('✅ OCPP Logs Response:', res);

    // If API returns array directly, use it
    this.dataSourceLogs = Array.isArray(res) ? res : (res?.data || []);

    this.dataSourceLogs = this.dataSourceLogs.map((log: any) => ({
      ...log,
      request: JSON.stringify(log.request || log.charger_request || {}),
      response: JSON.stringify(log.response || log.charger_response || {})
    }));
  },
  error: (err: any) => {
    console.error('❌ OCPP Logs API Error:', err);
    this.snackBar.open('Error fetching OCPP logs', 'Close', { duration: 3000 });
  }
});

}

  loadAdditionalData() {
    const serialNo = this.charger.serial_no;
    const cpoId = this.charger.cpo_id || '1';

    // Fetch menus dynamically
    this.ocppService.getMenus().subscribe((res: any) => {
      console.log('Menus API response:', res[0].name); // Debug: check response
      this.menus = (res || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description
      }));
    });

    this.ocppService.getAvailabilityTypes().subscribe((res) => {
      this.availabilityTypes = res?.data || [];
    });

    this.ocppService.getHeartbeat({ charger_id: serialNo }).subscribe((res: any) => {
      this.heartbeatData = res.data;
      this.heartbeatData.formattedDate = this.datePipe.transform(
        res.data.last_ping_datetime,
        'dd-MM-yyyy, h:mm:ss a',
        'Asia/Kolkata'
      );
      this.chargerStatus = res?.message;
    });

this.ocppService.getRFIDsByCpoId(cpoId).subscribe((res) => {
  this.rfidList = res?.data || [];
  if (this.rfidList.length > 0) {
    this.selectedRfid = this.rfidList[0].rf_id_no; // preselect first
  }
});
 

    this.ocppService.getChargerConnectorStatus(serialNo).subscribe((res) => {
      this.connectorStatus = res;
      if (res?.data) {
        this.charger.connector_data = res.data;
      }
    });
    this.loadOcppLogs();
  }

  toggleActions(): void {
    this.showActions = !this.showActions;
    this.showSettings = false;
    this.resetbtn = false;
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    this.showActions = false;

    if (this.showSettings) {
      this.ocppService.getMenus().subscribe((res: any) => {
        console.log('Menus API response:', res[0].name); 
        this.menus = (res || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description
        }));
      });
    }
  }

 toggleExpand(connectorNo: number) {
  if (this.expandedConnectors.has(connectorNo)) {
    this.expandedConnectors.delete(connectorNo);
    this.selectedTask = null;
    this.idTagType = null;
    this.selectedRfid = null;
  } else {
    this.expandedConnectors.add(connectorNo);
    if (!this.selectedTask) {
      this.selectedTask = 'Remote Start'; // default task when expanded
    }
  }
}
fetchActiveTransaction(connectorNo: number) {
  if (!this.charger) return;

  const chargerId = this.charger.serial_no;

  this.ocppService.getActiveTransactionId(chargerId, connectorNo).subscribe({
    next: (res: any) => {
      if (res) {
        this.current_active_tranjection = res.data;
      } else {
        this.current_active_tranjection = '';
        this.snackBar.open('No active transaction found', 'Close', { duration: 3000 });
      }
    },
    error: (err: any) => {
      this.snackBar.open('Error fetching active transaction', 'Close', { duration: 3000 });
      console.error(err);
    }
  });
}


  onMenuClick(menu: any, connectorNo?: number) {
  if (menu.name === 'Unlock Connector') {
    this.selectedTask = menu.name;
  }
  else if (menu.name === 'Remote Start') {
    this.selectedTask = menu.name;
  }
  else if (menu.name === 'Remote Stop') {
    this.selectedTask = menu.name;
    if (connectorNo) {
      this.fetchActiveTransaction(connectorNo);
    }
  }
  else if (menu.name === 'Manage Configurations') {
    this.selectedTask = menu.name;
  }
  else if (menu.name === 'Trigger Message') {
    this.selectedTask = menu.name;
  }
     else {
      //this.selectedTask = menu.name;
    }
  }

performTask(connectorNo: any, task: string) {
  if (!this.charger) return;

  // Prevent Remote Start if no RFID is selected
  if (task === 'Remote Start' && !this.selectedRfid) {
    this.snackBar.open('Please select an RFID before performing Remote Start', 'Close', { duration: 3000 });
    return;
  }

  // Map task -> command
  let command = '';
  if (task === 'Remote Start') {
    command = 'START_CHARGING';
  } else if (task === 'Remote Stop') {
    command = 'STOP_CHARGING';
  } else {
    this.snackBar.open(`No API implemented for ${task}`, 'Close', { duration: 3000 });
    return;
  }

  const payload: any = {
    command,
    charger_id: this.charger.serial_no,          // dynamic
    charger_sr_no: this.charger.serial_no,        // dynamic
    connector: connectorNo,                       // dynamic
    id_tag: this.selectedRfid,                    // dropdown value
    id_tag_type: "RF_ID",
    user_id: this.loginId,                        // dynamic user_id
    command_source: "web",
    device_id: null,
    app_version: null,
    os_version: null,
    station_id: this.charger?.station_id || 1,    // dynamic
    mobile_no: null,
    vehicle_id: null,
    vehicle_number: null
  };

  console.log('Perform Task Payload:', payload);

  if (task === 'Remote Start') {
    this.ocppService.startChargingStation(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message || `${task} command sent successfully!`, 'Close', { duration: 3000 });
      },
      error: (err: any) => {
        this.snackBar.open(`Failed to send ${task} command`, 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  } else if (task === 'Remote Stop') {
    this.ocppService.stopChargingStation(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message || `${task} command sent successfully!`, 'Close', { duration: 3000 });
      },
      error: (err: any) => {
        this.snackBar.open(`Failed to send ${task} command`, 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }
}


  performCommand(command: string): void {
    console.log(`Executing ${command}...`);
  }

  getLocalListVersion(connectorNo: number = 1) {
    if (!this.charger) return;
    const payload = {
      command: 'GET_LOCAL_LIST_VERSION',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.chargerId,
      connector: connectorNo
    };

    this.ocppService.getLocalListVersion(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
        });
      },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  clearCache() {
    if (!this.charger) return;
    const payload = {
      command: 'CLEAR_CACHE',
      charger_id: this.charger.charger_id,
      charger_sr_no: this.chargerId,
      connector: this.charger?.ConnectorData?.connector_no || 1
    };

    this.performCommand('Clear Cache');

    this.ocppService.clearCache(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
        });
      },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  reset() {
    this.resetbtn= !this.resetbtn;
   // this.performCommand('Reset');

    
  }  
   


  hardReset() {
    if (!this.charger) return;
    const payload = {
      command: 'RESET_HARD',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.chargerId
    };

    this.ocppService.resetHard(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
        });
      },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  softReset() {
    if (!this.charger) return;
    const payload = {
      command: 'RESET_SOFT',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.chargerId
    };

    this.ocppService.resetSoft(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
        });
      },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  unlockConnector() {
    if (!this.charger) return;
    const payload = {
      command: 'UNLOCK_CONNECTOR',
      charger_id: this.charger.charger_id,
      charger_sr_no: this.chargerId,
      connector: this.charger?.ConnectorData?.connector_no || 1
    };

    console.log('Unlock Connector payload:', payload);

    this.ocppService.unlockConnector(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
        });
      },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  goBackToLogs(): void {
    this.router.navigate(['/home/ocpp-diagnostic']);
  }

  getConnectorIconColor(status: string): string {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'charging':
        return 'primary';
      case 'available':
        return 'accent';
      case 'faulted':
      case 'unavailable':
        return 'warn';
      case 'offline':
        return 'default';
      default:
        return 'default';
    }
  }
 
  remoteStart(){
    if (!this.charger) return;
    const payload = {
 
      command: "START_CHARGING",
      charger_id: this.charger.charger_id,
      charger_sr_no: this.charger.serial_no,
      connector: 1,
      id_tag: "20211227173626",
      id_tag_type: "tagType",
      user_id: this.loginId,
      command_source: "web",
      device_id: null,
      app_version: null,
      os_version: null,
      station_id: 1,
      mobile_no: null,
      vehicle_id: null,
      vehicle_number: null
    }

    console.log('this payload :', payload);
    this.ocppService.startChargingStation(payload).subscribe({
      next: (res: any) =>{
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
      });
    },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  remoteStop(){
      if (!this.charger) return;
    const payload = {
 
      command: "STOP_CHARGING",
      charger_id: this.charger.charger_id,
      charger_sr_no: this.charger.serial_no,
      connector: 1,
      id_tag: "20211227173626",
      id_tag_type: "tagType",
      user_id: this.loginId,
      command_source: "web",
      device_id: null,
      app_version: null,
      os_version: null,
      station_id: 1,
      mobile_no: null,
      vehicle_id: null,
      vehicle_number: null
    }

    console.log('this payload :', payload);
    this.ocppService.stopChargingStation(payload).subscribe({
      next: (res: any) =>{
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
      });
    },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });

  }

  // remoteStart(){
  //   if (!this.charger) return;
  //   const payload = {
 
  //     command: "START_CHARGING",
  //     charger_id: this.charger.charger_id,
  //     charger_sr_no: this.charger.serial_no,
  //     connector: 1,
  //     id_tag: "20211227173626",
  //     id_tag_type: "tagType",
  //     user_id: 63,
  //     command_source: "web",
  //     device_id: null,
  //     app_version: null,
  //     os_version: null,
  //     station_id: 1,
  //     mobile_no: null,
  //     vehicle_id: null,
  //     vehicle_number: null
  //   }

  //   console.log('this payload :', payload);
  //   this.ocppService.startChargingStation(payload).subscribe({
  //     next: (res: any) =>{
  //       this.snackBar.open(res?.message, 'Close', {
  //         duration: 3000,
  //         panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
  //     });
  //   },
  //     error: (err: any) => {
  //       this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
  //         duration: 3000,
  //         panelClass: ['snackbar-error']
  //       });
  //     }
  //   });
  // }

  // remoteStop(){
  //     if (!this.charger) return;
  //   const payload = {
 
  //     command: "STOP_CHARGING",
  //     charger_id: this.charger.charger_id,
  //     charger_sr_no: this.charger.serial_no,
  //     connector: 1,
  //     id_tag: "20211227173626",
  //     id_tag_type: "tagType",
  //     user_id: 63,
  //     command_source: "web",
  //     device_id: null,
  //     app_version: null,
  //     os_version: null,
  //     station_id: 1,
  //     mobile_no: null,
  //     vehicle_id: null,
  //     vehicle_number: null
  //   }

  //   console.log('this payload :', payload);
  //   this.ocppService.stopChargingStation(payload).subscribe({
  //     next: (res: any) =>{
  //       this.snackBar.open(res?.message, 'Close', {
  //         duration: 3000,
  //         panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
  //     });
  //   },
  //     error: (err: any) => {
  //       this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
  //         duration: 3000,
  //         panelClass: ['snackbar-error']
  //       });
  //     }
  //   });

  // }

  getTriggerMessage(){
    if(!this.charger){
      return ;
    }

    const payload= {
      charger_id: this.chargerId,
      f_date : this.charger,
      t_date : this.charger,
      connector: '',
    }
     const loginId = localStorage.getItem('user_id') || '';

    this.ocppService.getTriggermessage(loginId,payload).subscribe({
      next: (res: any) =>{
        this.snackBar.open(res?.message, 'Close', {
          duration: 3000,
          panelClass: res?.status ? ['snackbar-success'] : ['snackbar-error']
      });
    },
      error: (err: any) => {
        this.snackBar.open(`Error: ${err?.message || err}`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }

    })
  }

  performTriggerTask(connectorNo: number, trigger: string) {
  switch (trigger) {
    case 'MeterValues':
      {
      const payload= {
          command: "METER_VALUES",
          charger_id: this.chargerId,
          charger_sr_no: this.charger.serial_no,
          connector: 1
      }
      this.ocppService.getTriggermessage(this.loginId, payload).subscribe(res => {
        console.log('Meter Values response:', res);
      });
      break;
    }

    case 'BootNotification':
      { 
        const payload= {
          command: "BOOT_NOTIFICATION",
          charger_id: this.chargerId,
          charger_sr_no: this.charger.serial_no,
          connector: 1
        }
       this.ocppService.getTriggermessage(this.loginId, payload).subscribe(res => {
        console.log('Boot Notification response:', res);
      });
      break;
    }

    case 'StatusNotification': 
    {
      const payload = {
          command: "STATUS_NOTIFICATION",
          charger_id: this.chargerId,
          charger_sr_no: this.charger.serial_no,
          connector: 1
      }
        this.ocppService.getTriggermessage(this.loginId, payload).subscribe(res => {
        console.log('Status Notification response:', res);
      });
      break;
    }
    

    case 'DiagnosticsStatusNotification':
      {
        const payload={
           command: "DIAGNOSTICSSTATUS_NOTIFICATION",
          charger_id: this.chargerId,
          charger_sr_no: this.charger.serial_no,
          connector: 1
        }
         this.ocppService.getTriggermessage(this.loginId, payload).subscribe(res => {
           console.log('Diagnostics Status Notification response:', res);
           });
        break;
      }
     

    case 'Heartbeat':
      {
        const payload={
           command: "HEART_BEAT",
          charger_id: this.chargerId,
          charger_sr_no: this.charger.serial_no,
          connector: 1
        }
       this.ocppService.getTriggermessage(this.loginId, payload).subscribe(res => {
        console.log('Heartbeat response:', res);
      });
      break;
      }
      

    case 'FirmwareStatusNotification':
      {
          const payload={
           command: "FIRMWARESTATUS_NOTIFICATION",
          charger_id: this.chargerId,
          charger_sr_no: this.charger.serial_no,
          connector: 1
        }
       this.ocppService.getTriggermessage(this.loginId, payload).subscribe(res => {
        console.log('Firmware Status Notification response:', res);
      });
      break;
      }
      

    default:
      console.warn('No trigger selected');
  }
}



}
