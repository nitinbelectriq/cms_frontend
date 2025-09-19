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
export class ChargerDetailComponent implements OnInit, AfterViewInit {
  readonly displayedColumnsLogs: string[] = ['action', 'request', 'response', 'request_date'];
  readonly displayedColumns1: string[] = ['select', 'key', 'value', 'action'];

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
  unselectconnector: boolean = false;
  idTagType: string | null = null; // for radio button
  selectedRfid: string | null = null; // will hold the rf_id_no
  selectTrigger = '';

  getDiagnosticEndDate: Date | null= null;
  getDiagnosticStartDate: Date | null= null;

  vendorId: string= '';
  ChargingRateUnit='';
  compositeScheduleDuration=null;

  ChargingProfilePurpose='';
  clearChargingProfileId='';
  clearProfileFilter='';
  stackLevel= '';

  setChargingProfileId='';

dataTag='';
messageId='';
// 1. Add the fixed message IDs list:
messageids: string[] = [
  'GET_S_DNS',
  'GET_S_PORT',
  'GET_S_HSURL',
  'GET_S_WIFISSID',
  'GET_S_WIFIPASS',
  'SET_S_DNS',
  'SET_S_PORT',
  'SET_S_HSURL',
  'SET_S_WIFISSID',
  'SET_S_WIFIPASS',
  'SET_CLRLOGS',
  'CC_CONFIG',
  'SET_SCHEDULE'
];



// 2. Add a method to call the Data Transfer API:
  rfidselect = '';

  menus: any[] = [];
  availabilityTypes: any[] = [];
  heartbeatData: any;
  chargerStatus: any;
  rfidList: any[] = [];
  connectorStatus: any;
  expiryDate: Date | null = null;

  expandedConnectors: Set<number> = new Set();
  loginId: string = '';
  connectors: any[] = [];

  // DI via inject()
  private route = inject(ActivatedRoute);
  private ocppService = inject(OCPPService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.chargerId = this.route.snapshot.paramMap.get('id') || '';
    this.loginId = localStorage.getItem('user_id') || '';

    const payload = { cpo_id: '', station_id: '' };

    // load chargers and initialize if found
    this.ocppService.getChargersDynamic(this.loginId, payload).subscribe({
      next: (res: any) => {
        const found = (res?.data || []).find((item: any) => item.serial_no === this.chargerId);
        this.charger = found;

        if (!this.charger) return;

        // initialize connectors with connector_no and RFIDs placeholder
        this.connectors = (this.charger.connector_data || []).map((c: any, index: number) => ({
          ...c,
          connector_no: index + 1,
          rfids: [],
          selectedRfid: null,
        }));

        this.loadOcppLogs();

        // load RFIDs per connector (lazy; will noop if already loaded)
        this.connectors.forEach((connector) => {
          this.loadConnectorRFIDs(connector);
        });

        this.loadAdditionalData();
      },
      error: (err: any) => {
        this.handleApiError(err, 'Error fetching chargers');
      }
    });
  }

  ngAfterViewInit() {
    this.dataSourceLogs.paginator = this.paginator;
  }

  // ---------- Helpers ----------
  private showSnack(message: string, success = true, duration = 3000) {
    const panelClass = success ? ['snackbar-success'] : ['snackbar-error'];
    this.snackBar.open(message, 'Close', { duration, panelClass });
  }

  private handleApiError(err: any, fallbackMessage = 'Something went wrong') {
    console.error(fallbackMessage, err);
    const msg = err?.message || fallbackMessage;
    this.showSnack(msg, false);
  }

  // ---------- Logs ----------
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
        this.showSnack('Error fetching OCPP logs', false);
      }
    });
  }

  // Keep public method name
  refreshLogs() {
    this.loadOcppLogs();
  }

  // refresh complete page
  refreshPage() {
  window.location.reload();
}

  exportLogsToCsv() {
    const logs = this.dataSourceLogs.data;
    if (!logs || logs.length === 0) {
      this.showSnack('No logs available to export', false);
      return;
    }

    const escapeCsv = (value: any): string => {
      if (value == null) return '';
      let str = String(value);
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = ['Action', 'Request', 'Response', 'Request Date'];
    const csvRows: string[] = [headers.join(',')];

    logs.forEach(log => {
      const row = [
        escapeCsv(log.action),
        escapeCsv(log.request),
        escapeCsv(log.response),
        escapeCsv(log.request_date)
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ocpp_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // ---------- Additional data ----------
  loadAdditionalData() {
    if (!this.charger) return;
    const serialNo = this.charger.serial_no;
    const cpoId = this.charger.cpo_id || '1';

    // menus
    this.ocppService.getMenus().subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          console.log('Menus API first item:', res[0].name);
          this.menus = res.map((item: any) => ({ id: item.id, name: item.name, description: item.description }));
        } else if (res?.data && Array.isArray(res.data)) {
          console.log('Menus API first item:', res.data[0]?.name);
          this.menus = res.data.map((item: any) => ({ id: item.id, name: item.name, description: item.description }));
        } else {
          console.warn('Menus API returned no items:', res);
          this.menus = [];
        }
      },
      error: (err: any) => this.handleApiError(err, 'Failed to load menus')
    });

    this.ocppService.getAvailabilityTypes().subscribe({
      next: (res: any) => (this.availabilityTypes = res?.data || []),
      error: (err: any) => this.handleApiError(err, 'Failed to load availability types')
    });

    // heartbeat
    this.ocppService.getHeartbeat({ charger_id: serialNo }).subscribe({
      next: (res: any) => {
        this.heartbeatData = res.data;
        if (res?.data?.last_ping_datetime) {
          this.heartbeatData.formattedDate = this.datePipe.transform(
            res.data.last_ping_datetime,
            'dd-MM-yyyy, h:mm:ss a',
            'Asia/Kolkata'
          );
        }
        this.chargerStatus = res?.message;
      },
      error: (err: any) => this.handleApiError(err, 'Failed to load heartbeat')
    });

    // global RFIDs (used as fallback)
    this.ocppService.getRFIDsByCpoId(cpoId).subscribe({
      next: (res: any) => {
        this.rfidList = res?.data || [];
        if (this.rfidList.length > 0) {
          this.selectedRfid = this.rfidList[0].rf_id_no;
        }
      },
      error: (err: any) => this.handleApiError(err, 'Failed to load RFIDs')
    });

    // connector status
    this.ocppService.getChargerConnectorStatus(serialNo).subscribe({
      next: (res: any) => {
        this.connectorStatus = res;
        if (res?.data) {
          this.charger.connector_data = res.data;
        }
      },
      error: (err: any) => this.handleApiError(err, 'Failed to load connector status')
    });

    this.loadOcppLogs();
  }

  // ---------- Connector-level RFID handling ----------
  onIdTagTypeChange(connector: any) {
    if (connector.selectedIdTagType === 'rfid') {
      this.loadConnectorRFIDs(connector);
    } else {
      connector.rfids = [];
      connector.selectedRfid = null;
    }
  }

  loadConnectorRFIDs(connector: any) {
    if (!this.charger) return;
    if (connector.rfids && connector.rfids.length > 0) return; // already loaded

    const cpoId = this.charger?.cpo_id || '1';
    this.ocppService.getRFIDsByCpoId(cpoId).subscribe({
      next: (res: any) => {
        const rfidList = res?.data || [];
        connector.rfids = rfidList;
        connector.selectedRfid = rfidList.length > 0 ? rfidList[0].rf_id_no : null;
      },
      error: (err: any) => {
        console.error('Failed to load RFIDs for connector:', err);
        connector.rfids = [];
        connector.selectedRfid = null;
      }
    });
  }

  // ---------- UI toggles ----------
  toggleActions(): void {
    this.showActions = !this.showActions;
    this.showSettings = false;
    this.resetbtn = false;
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    this.showActions = false;
    this.resetbtn = false;
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
        this.selectedTask = 'Remote Start';
      }
    }
  }

  fetchActiveTransaction(connectorNo: number, callback?: () => void) {
    if (!this.charger) return;

    const chargerId = this.charger.serial_no;
    this.ocppService.getActiveTransactionId(chargerId, connectorNo).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.current_active_tranjection = res.data;
          if (callback) callback();
        } else {
          this.current_active_tranjection = '';
          this.showSnack('No active transaction found', false);
        }
      },
      error: (err: any) => {
        this.handleApiError(err, 'Error fetching active transaction');
      }
    });
  }

  onMenuClick(menu: any, connectorNo?: number) {
    // preserve original branching and names
    if (menu.name === 'Unlock Connector') this.selectedTask = menu.name;
    else if (menu.name === 'Remote Start') this.selectedTask = menu.name;
    else if (menu.name === 'Remote Stop') this.selectedTask = menu.name;
    else if (menu.name === 'Manage Configurations') this.selectedTask = menu.name;
    else if (menu.name === 'Trigger Message') this.selectedTask = menu.name;
    else if (menu.name === 'Reserve Now') this.selectedTask = menu.name;
    else if (menu.name === 'Change Availability') this.selectedTask = menu.name;
    else if (menu.name === 'Update Firmware'){
      this.selectedTask = menu.name;
      this.unselectconnector= !this.unselectconnector;

    } 
    else if(menu.name ==='Get Diagnostics') this.selectedTask = menu.name;
    else if(menu.name === 'Data Transfer') this.selectedTask = menu.name;
    else if(menu.name === 'Get Composite Schedule') this.selectedTask = menu.name;
    else if(menu.name === 'Clear Charging Profile') this.selectedTask = menu.name;
    else if(menu.name === 'Set Charging Profile') this.selectedTask = menu.name;

    // intentionally leave default behavior untouched
  }

  performTask(connectorNo: number, task: string) {
    const connector = this.connectors.find(c => c.connector_no === connectorNo);
    if (!connector) {
      this.showSnack(`Connector ${connectorNo} not found.`, false);
      return;
    }

    console.log(connector);

    if (task === 'Remote Start') {
      this.remoteStart(connectorNo);
    } else if (task === 'Remote Stop') {
      this.fetchActiveTransaction(connectorNo, () => {
        this.remoteStop(connectorNo);
      });
    } else if (task === 'Unlock Connector') {
      this.unlockConnector(connectorNo);
    }
    else if (task === 'Update Firmware') {
    this.updateFirmware(connectorNo);
  }
  else if (task === 'Data Transfer') {
    this.callDataTransfer(connectorNo);
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
        this.showSnack(res?.message, !!res?.status);
      },
      error: (err: any) => this.handleApiError(err, 'Error getting local list version')
    });
  }

  clearCache(connectorNo: number = 1) {
    if (!this.charger) return;

    const payload = {
      command: 'CLEAR_CACHE',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.charger.serial_no,
      connector: connectorNo
    };

    this.performCommand('Clear Cache');

    this.ocppService.clearCache(payload).subscribe({
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error clearing cache')
    });
  }

  reset() {
    this.resetbtn = !this.resetbtn;
    // this.performCommand('Reset'); // preserved original commented intent
  }

  hardReset() {
    if (!this.charger) return;
    const payload = {
      command: 'RESET_HARD',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.chargerId
    };

    this.ocppService.resetHard(payload).subscribe({
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error performing hard reset')
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
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error performing soft reset')
    });
  }

  unlockConnector(connectorNo: number = 1) {
    if (!this.charger) return;

    const payload = {
      command: 'UNLOCK_CONNECTOR',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.charger.serial_no,
      connector: connectorNo
    };

    console.log('Unlock Connector payload:', payload);

    this.ocppService.unlockConnector(payload).subscribe({
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error unlocking connector')
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
    if (!connector || !this.charger) return;

    const payload = {
      command: 'START_CHARGING',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.charger.serial_no,
      connector: connectorNo,
      id_tag: this.rfidselect,
      id_tag_type: 'RF_ID',
      user_id: this.loginId,
      command_source: 'web',
      device_id: null,
      app_version: null,
      os_version: null,
      station_id: this.charger.station_id || 1,
      mobile_no: null,
      vehicle_id: null,
      vehicle_number: null
    };

    this.ocppService.startChargingStation(payload).subscribe({
      next: (_res: any) => { /* handle response if needed */ },
      error: (err: any) => this.handleApiError(err, 'Error on remote start')
    });
  }

  remoteStop(connectorNo: number = 1) {
    if (!this.charger) return;

    const connector = this.connectors.find(c => c.connector_no === connectorNo);
    if (!connector) {
      this.showSnack(`Connector ${connectorNo} not found`, false);
      return;
    }

    const transactionId = this.id_of_active_transaction || this.current_active_tranjection;
    if (!transactionId) {
      this.showSnack(`No active transaction found for Connector ${connectorNo}`, false);
      return;
    }

    const payload = {
      command: 'STOP_CHARGING',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.charger.serial_no,
      connector: connectorNo,
      transaction_id: transactionId,
      user_id: this.loginId,
      command_source: 'web',
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
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error on remote stop')
    });
  }

  // ---------- Trigger / Message operations ----------
  getTriggerMessage() {
    if (!this.charger) return;

    const payload = {
      charger_id: this.chargerId,
      f_date: this.charger,
      t_date: this.charger,
      connector: ''
    };
    const loginId = localStorage.getItem('user_id') || '';

    this.ocppService.getTriggermessage(loginId, payload).subscribe({
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error getting trigger message')
    });
  }

  performTriggerTask(connectorNo: number, trigger: string) {
    if (!this.charger) return;

    const commonPayloadBase = {
      charger_id: this.chargerId,
      charger_sr_no: this.charger.serial_no,
      connector: connectorNo
    };

    switch (trigger) {
      case 'MeterValues': {
        const payload = { command: 'METER_VALUES', ...commonPayloadBase };
        this.ocppService.getTriggermessage(this.loginId, payload).subscribe({
          next: (res: any) => this.showSnack(res?.message, !!res?.status),
          error: (err: any) => this.handleApiError(err, 'Error triggering MeterValues')
        });
        break;
      }
      case 'BootNotification': {
        const payload = { command: 'BOOT_NOTIFICATION', ...commonPayloadBase };
        this.ocppService.getTriggermessage(this.loginId, payload).subscribe({
          next: (res: any) => this.showSnack(res?.message, !!res?.status),
          error: (err: any) => this.handleApiError(err, 'Error triggering BootNotification')
        });
        break;
      }
      case 'StatusNotification': {
        const payload = { command: 'STATUS_NOTIFICATION', ...commonPayloadBase };
        this.ocppService.getTriggermessage(this.loginId, payload).subscribe({
          next: (res: any) => this.showSnack(res?.message, !!res?.status),
          error: (err: any) => this.handleApiError(err, 'Error triggering StatusNotification')
        });
        break;
      }
      case 'DiagnosticsStatusNotification': {
        const payload = { command: 'DIAGNOSTICSSTATUS_NOTIFICATION', ...commonPayloadBase };
        this.ocppService.getTriggermessage(this.loginId, payload).subscribe({
          next: (res: any) => this.showSnack(res?.message, !!res?.status),
          error: (err: any) => this.handleApiError(err, 'Error triggering DiagnosticsStatusNotification')
        });
        break;
      }
      case 'Heartbeat': {
        const payload = { command: 'HEART_BEAT', ...commonPayloadBase };
        this.ocppService.getTriggermessage(this.loginId, payload).subscribe({
          next: (res: any) => this.showSnack(res?.message, !!res?.status),
          error: (err: any) => this.handleApiError(err, 'Error triggering Heartbeat')
        });
        break;
      }
      case 'FirmwareStatusNotification': {
        const payload = { command: 'FIRMWARESTATUS_NOTIFICATION', ...commonPayloadBase };
        this.ocppService.getTriggermessage(this.loginId, payload).subscribe({
          next: (res: any) => this.showSnack(res?.message, !!res?.status),
          error: (err: any) => this.handleApiError(err, 'Error triggering FirmwareStatusNotification')
        });
        break;
      }
      default:
        console.warn('No trigger selected');
    }
  }

  // ---------- Availability / Reserve ----------
  selectedAvailability: string = 'Operative';
firmwareLocation: string = '';
firmwareRetries: number = 5;
firmwareRetryInterval: number = 0;
firmwareRetrieveDate: Date | null = null;

  changeAvailability(connectorNo: number = 1) {
    if (!this.charger) return;

    const payload = {
      command: 'CHANGE_AVAILABILITY',
      charger_id: this.charger.serial_no,
      charger_sr_no: this.charger.serial_no,
      connector: connectorNo,
      type: this.selectedAvailability
    };

    console.log('Change Availability Payload:', payload);

    this.ocppService.changeAvailability(payload).subscribe({
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error changing availability')
    });
  }

  getReserveNow(connectorNo: number = 1) {
    if (!this.charger) return;

    const payload = {
      command: 'RESERVE_NOW',
      charger_id: this.chargerId,
      charger_sr_no: this.charger.serial_no,
      charger_connector: connectorNo,
      charger_idtag: this.selectedRfid,
      charger_parentIdTag: '0',
      reservation_id: '1234',
      charger_expiry_date: this.expiryDate
    };

    console.log('Reserve Now Payload:', payload);

    this.ocppService.changeAvailability(payload).subscribe({
      next: (res: any) => this.showSnack(res?.message, !!res?.status),
      error: (err: any) => this.handleApiError(err, 'Error reserving now')
    });
  }
  
  updateFirmware(connectorNo: number = 1) {
  if (!this.charger) return;

  const payload = {
    command: 'UPDATE_FIRMWARE',
    charger_id: this.charger.serial_no,
    charger_sr_no: this.charger.serial_no,
    connector: connectorNo,
    location: this.firmwareLocation || 'http://ftps.p2power.com/Q1_FINAL_TYPE2.bin',
    retries: this.firmwareRetries ,
    retryInterval: this.firmwareRetryInterval ,
    retrieve_date: this.firmwareRetrieveDate
      ? new Date(this.firmwareRetrieveDate).toISOString()
      : new Date().toISOString()
  };

  console.log('Update Firmware Payload:', payload);

  this.ocppService.updateFirmware(payload).subscribe({
    next: (res: any) => this.showSnack(res?.message || 'Firmware update triggered', !!res?.status),
    error: (err: any) => this.handleApiError(err, 'Error updating firmware')
  });
}
// Inside ChargerDetailComponent class


callDataTransfer(connectorNo: number) {
  if (!this.charger) return;

  const payload = {
    command: 'DATA_TRANSFER',
    child_command: this.messageId,  // selected dropdown option
    charger_id: this.charger.serial_no,
    charger_sr_no: this.charger.serial_no,
    connector: connectorNo,
    vendor_id: this.vendorId,
    data: this.dataTag || '0'
  };

  console.log('Data Transfer payload:', payload);

  this.ocppService.callDataTransfer(payload).subscribe({
    next: (res: any) => {
      this.showSnack(res?.message || 'Data Transfer executed', !!res?.status);
    },
    error: (err: any) => this.handleApiError(err, 'Error executing Data Transfer')
  });
}



}

