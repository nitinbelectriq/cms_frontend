import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { OCPPService } from '../../../services/ocpp.service';

@Component({
  standalone: true,
  selector: 'app-charger-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  templateUrl: './ocpp-details.component.html',
  styleUrls: ['./ocpp-details.component.scss']
})
export class ChargerDetailComponent implements OnInit {
  chargerId = '';
  charger: any;
  showActions = false;
  showSettings = false;
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
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    this.showActions = false;
  }

  performCommand(command: string): void {
    console.log(`Executing ${command}...`);
  }

  getLocalListVersion() {
    this.performCommand('Get Local List Version');
  }

  clearCache() {
    this.performCommand('Clear Cache');
  }

  reset() {
    this.performCommand('Reset');
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
