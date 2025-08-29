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
  displayedColumns: string[] = ['action', 'request', 'response', 'request_date'];
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

  list: any[] = [];
  item = {};
  id_of_active_transaction = '';
  current_active_tranjection = '';
  resetbtn = false;
  binding = '';

  selectedAction: string | null = null;
  selectedTask: string | null = null;

  menus: any[] = [];
  availabilityTypes: any[] = [];
  heartbeatData: any;
  chargerStatus: any;
  rfidList: any[] = [];
  connectorStatus: any;

  expandedConnectors: Set<number> = new Set();

  private route = inject(ActivatedRoute);
  private ocppService = inject(OCPPService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  private snackBar = inject(MatSnackBar);

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
    });

    this.ocppService.getChargerConnectorStatus(serialNo).subscribe((res) => {
      this.connectorStatus = res;
      if (res?.data) {
        this.charger.connector_data = res.data;
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
    } else {
      this.expandedConnectors.add(connectorNo);
    }
  }

  onMenuClick(menu: any) {
    if (menu.name === 'Unlock Connector') {
      this.selectedTask = menu.name;
      //this.unlockConnector();
    }
    else if(menu.name === 'Remote Start'){
      this.selectedTask= menu.name;
     // this.remoteStart();
    }
    else if(menu.name === 'Remote Stop'){
      this.selectedTask=menu.name;

      //this.remoteStop();
    }
    else if(menu.name === 'Manage Configurations'){
      this.selectedTask = menu.name;
    }
    else if(menu.name=== 'Trigger Message'){
      this.selectedTask = menu.name;
    }
     else {
      //this.selectedTask = menu.name;
    }
  }

  performTask(connectorNo: number, task: string) {
    console.log(`Performing ${task} on connector ${connectorNo}`);
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
    this.resetbtn = !this.resetbtn;
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
      user_id: 63,
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
      user_id: 63,
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
}
