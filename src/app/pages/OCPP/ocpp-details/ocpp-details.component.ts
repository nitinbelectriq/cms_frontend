import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
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
    MatRadioButton,
    MatDatepickerModule,
    MatPaginatorModule
  ],
  providers: [DatePipe],
  templateUrl: './ocpp-details.component.html',
  styleUrls: ['./ocpp-details.component.scss']
})
export class ChargerDetailComponent implements OnInit {
displayedColumnsLogs: string[] = ['action', 'request', 'response', 'request_date'];
  displayedColumns1: string[] = ['select', 'key', 'value', 'action'];

  dataSourceLogs = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
  this.loginId = localStorage.getItem('user_id') || '';

  const payload = { cpo_id: '', station_id: '' };

  this.ocppService.getChargersDynamic(this.loginId, payload).subscribe((res) => {
    const found = res.data.find((item: any) => item.serial_no === this.chargerId);
    this.charger = found;

    if (this.charger) {
      // ✅ Initialize connectors with index-based numbering and placeholders for RFID
      this.connectors = (this.charger.connector_data || []).map((c: any, index: number) => ({
        ...c,
        connector_no: index + 1,
        rfids: [],
        selectedRfid: null,
      }));

      // Load logs and connector-specific RFIDs
      this.loadOcppLogs();
      this.connectors.forEach((connector) => {
        this.loadConnectorRFIDs(connector);
      });

      // Load other data if required
      this.loadAdditionalData();
    }
  });
}

ngAfterViewInit() {
    this.dataSourceLogs.paginator = this.paginator;
  }

  loadOcppLogs() {
    if (!this.charger) return;

    const toDate = new Date();
    const fromDate = new Date(toDate);
    fromDate.setDate(toDate.getDate() - 1);

    const fromDateStr = this.datePipe.transform(fromDate, 'yyyy-MM-dd', 'Asia/Kolkata')!;
    const toDateStr = this.datePipe.transform(toDate, 'yyyy-MM-dd', 'Asia/Kolkata')!;

    console.log('📅 Date Range:', fromDateStr, '→', toDateStr);

    this.ocppService.getOcppLogs(this.charger.serial_no, this.loginId, fromDateStr, toDateStr).subscribe({
      next: (res: any) => {
        console.log('✅ OCPP Logs Response:', res);

        const logs = Array.isArray(res) ? res : (res?.data || []);

        this.dataSourceLogs.data = logs.map((log: any) => ({
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
// ✅ Fetch RFID list for each connector individually
onIdTagTypeChange(connector: any) {
  if (connector.selectedIdTagType === 'rfid') {
    this.loadConnectorRFIDs(connector);
  } else {
    connector.rfids = [];
    connector.selectedRfid = null;
  }
}

loadConnectorRFIDs(connector: any) {
  if (connector.rfids && connector.rfids.length > 0) {
    return; // already loaded once
  }

  const cpoId = this.charger?.cpo_id || '1';

   this.ocppService.getRFIDsByCpoId(cpoId).subscribe({
    next: (res) => {
      const rfidList = res?.data || [];
      connector.rfids = rfidList;

      // ✅ Preselect first RFID if available
      connector.selectedRfid = rfidList.length > 0 ? rfidList[0].rf_id_no : null;
    },
    error: (err) => {
      console.error("Failed to load RFIDs:", err);
      connector.rfids = [];
      connector.selectedRfid = null;
    }
  });
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
  else if(menu.name === 'Reserve Now'){
    this.selectedTask = menu.name;
  }
  else if(menu.name === 'Change Availability'){
    this.selectedTask = menu.name;
  }
  else if(menu.name === 'Update Firmware'){
    this.selectedTask = menu.name;
  }
     else {
      //this.selectedTask = menu.name;
    }
  }

performTask(connectorNo: number, task: string) {
  const connector = this.connectors.find(c => c.connector_no === connectorNo);
  if (!connector) {
    this.snackBar.open(`Connector ${connectorNo} not found.`, "Close", {
      duration: 3000,
      panelClass: ["snackbar-error"]
    });
    return;
  }

  let payload: any = {
    charger_id: this.charger.serial_no,
    charger_sr_no: this.charger.serial_no,
    connector: connectorNo,
    user_id: this.loginId,
    command_source: "web",
    device_id: null,
    app_version: null,
    os_version: null,
    station_id: this.charger.station_id || 1,
    mobile_no: null,
    vehicle_id: null,
    vehicle_number: null
  };

  if (task === "Remote Start") {
    if (!connector.selectedRfid) {
      this.snackBar.open("Please select an RFID before starting.", "Close", {
        duration: 3000,
        panelClass: ["snackbar-error"]
      });
      return;
    }

    payload.command = "START_CHARGING";
    payload.id_tag = connector.selectedRfid;
    payload.id_tag_type = "RF_ID";

    this.ocppService.startChargingStation(payload).subscribe({
      next: res => {
        console.log("Remote Start response:", res);
        this.snackBar.open(res?.message || "Start command sent.", "Close", {
          duration: 3000,
          panelClass: ["snackbar-success"]
        });
      },
      error: err => {
        this.snackBar.open(`Error: ${err?.message || err}`, "Close", {
          duration: 3000,
          panelClass: ["snackbar-error"]
        });
      }
    });

  } else if (task === "Remote Stop") {
    const transactionId = this.id_of_active_transaction || this.current_active_tranjection;
    if (!transactionId) {
      this.snackBar.open("No active transaction found to stop.", "Close", {
        duration: 3000,
        panelClass: ["snackbar-error"]
      });
      return;
    }

    payload.command = "STOP_CHARGING";
    payload.transaction_id = transactionId;

    this.ocppService.stopChargingStation(payload).subscribe({
      next: res => {
        console.log("Remote Stop response:", res);
        this.snackBar.open(res?.message || "Stop command sent.", "Close", {
          duration: 3000,
          panelClass: ["snackbar-success"]
        });
      },
      error: err => {
        this.snackBar.open(`Error: ${err?.message || err}`, "Close", {
          duration: 3000,
          panelClass: ["snackbar-error"]
        });
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
 
remoteStart(connectorNo: number = 1) {
  const connector = this.connectors.find(c => c.connector_no === connectorNo);
  if (!connector) return;

  const payload = {
    command: "START_CHARGING",
    charger_id: this.charger.serial_no,
    charger_sr_no: this.charger.serial_no,
    connector: connectorNo,
    id_tag: connector.selectedRfid,  // ✅ Required for Remote Start
    id_tag_type: "RF_ID",
    user_id: this.loginId,
    command_source: "web",
    device_id: null,
    app_version: null,
    os_version: null,
    station_id: this.charger.station_id || 1,
    mobile_no: null,
    vehicle_id: null,
    vehicle_number: null
  };

  this.ocppService.startChargingStation(payload).subscribe({
    next: (res: any) => { /* handle response */ },
    error: (err: any) => { /* handle error */ }
  });
}



remoteStop(connectorNo: number = 1) {
  if (!this.charger) return;

  const connector = this.connectors.find(c => c.connector_no === connectorNo);
  if (!connector) {
    this.snackBar.open(`Connector ${connectorNo} not found`, 'Close', { duration: 3000 });
    return;
  }

  // Use either user input or API value
  const transactionId = this.id_of_active_transaction || this.current_active_tranjection;
  if (!transactionId) {
    this.snackBar.open(`No active transaction found for Connector ${connectorNo}`, 'Close', { duration: 3000 });
    return;
  }

  const payload = {
    command: "STOP_CHARGING",
    charger_id: this.charger.serial_no,
    charger_sr_no: this.charger.serial_no,
    connector: connectorNo,
    transaction_id: transactionId,  // ✅ Correct property
    user_id: this.loginId,
    command_source: "web",
    device_id: null,
    app_version: null,
    os_version: null,
    station_id: this.charger.station_id || 1,
    mobile_no: null,
    vehicle_id: null,
    vehicle_number: null
  };

  console.log('Remote Stop Payload:', payload);

  this.ocppService.stopChargingStation(payload).subscribe({
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

selectedAvailability: string = 'Operative'; // default option

changeAvailability(connectorNo: number = 1) {
  if (!this.charger) return;

  const payload = {
    command: "CHANGE_AVAILABILITY",
    charger_id: this.charger.serial_no,
    charger_sr_no: this.charger.serial_no,
    connector: connectorNo,
    type: this.selectedAvailability   // <-- bound from dropdown
  };

  console.log('Change Availability Payload:', payload);

  this.ocppService.changeAvailability(payload).subscribe({
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

getReserveNow(connectorNo: number = 1) {
  if (!this.charger) return;

  const payload = {
       "command": "RESERVE_NOW",
      "charger_id": "TEST001",
      "charger_sr_no": "TEST001",  
      "charger_connector":1,  
      "charger_idtag":"1234",
      "charger_parentIdTag":"0",
      "reservation_id":"1234",
      "charger_expiry_date":"2025-07-20T16:26:56.350Z" // <-- bound from dropdown
  };

  console.log('Change Availability Payload:', payload);

  this.ocppService.changeAvailability(payload).subscribe({
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
}
