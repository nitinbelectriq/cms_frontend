import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { OCPPService } from '../../../services/ocpp.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-charger-detail',
  imports: [CommonModule, MatCardModule, MatButtonModule,
    MatIconModule,
    RouterModule

  ],
  templateUrl: './ocpp-details.component.html',
  styleUrls: ['./ocpp-details.component.scss']
})
export class ChargerDetailComponent implements OnInit {
  chargerId = '';
  charger: any;
  // conn=[
  //   {
  //     connector_no: "1",
  //     connector_type_name: 'acc'
  //   },
  //   {
  //     connector_no: '2',
  //     connector_type_name: 'css'
  //   }
  // ];

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



  // 

  showActions = false;
  showSettings = false;
  selectedAction: string | null = null;

  toggleActions(): void {
    this.showActions = !this.showActions;
    this.showSettings = false;
    console.log(this.charger);
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    this.showActions = false; // close actions if open
    console.log('setting open ')
  }

  getLocalListVersion(){
    // code for get local list

  }

  

  clearCache(){
    // write the code for clear cache

  }

  reset(){
    // reset
  }
}
