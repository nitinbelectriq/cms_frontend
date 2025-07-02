import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { OCPPService } from '../../../services/ocpp.service';

@Component({
  standalone: true,
  selector: 'app-charger-detail',
  imports: [CommonModule, MatCardModule],
  templateUrl: './ocpp-details.component.html',
})
export class ChargerDetailComponent implements OnInit {
  chargerId = '';
  charger: any;

  private route = inject(ActivatedRoute);
  private ocppService = inject(OCPPService);

  ngOnInit(): void {
    this.chargerId = this.route.snapshot.paramMap.get('id') || '';

    // Call your service to fetch by ID
    const loginId = localStorage.getItem('user_id') || '';
    const payload = { cpo_id: '', station_id: '' };

    this.ocppService.getChargersDynamic(loginId, payload).subscribe((res) => {
      const found = res.data.find((item) => item.serial_no === this.chargerId);
      this.charger = found;
    });
  }
}
