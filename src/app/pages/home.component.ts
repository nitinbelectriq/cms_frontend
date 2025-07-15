import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/home.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GoogleMapsModule } from '@angular/google-maps';
import * as L from 'leaflet';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
     MatTableModule,
     MatPaginatorModule,
     NgChartsModule,
     MatCardModule,
     MatOptionModule,
     MatFormFieldModule,
     MatSelectModule,
     GoogleMapsModule,
     MatInputModule,
     FormsModule
    
    ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['cpo', 'station', 'name', 'status'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (response) => {
        const data = response?.data || [];
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        console.log('Dashboard data:', data);
      },
      error: (error) => {
        console.error('Dashboard API error:', error);
      }
    });

    this.pieChartData.datasets[0].data = [this.onlineCount, this.offlineCount];
    this.loadRevenueData(this.selectedView);
  }





    // Dummy values for now
    onlineCount = 15;
    offlineCount = 5;
  
    pieChartData: ChartData<'pie', number[], string> = {
      labels: ['Online', 'Offline'],
      datasets: [
        {
          data: [], // will be set in ngOnInit()
          backgroundColor: ['#66BB6A', '#273746'], // Material green/red
          hoverBackgroundColor: ['#148544', '#EF5350']
        }
      ]
    };
  
    pieChartType: 'pie' = 'pie';
  
    
  
    // bar char added

    selectedView: 'daily' | 'monthly' = 'daily';

    barChartOptions: ChartOptions<'bar'> = {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: 'Revenue'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Day/Month'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Revenue (INR)'
          }
        }
      }
    };
  
    barChartData: ChartData<'bar'> = {
      labels: [],
      datasets: [
        {
          label: 'Revenue',
          data: [],
          backgroundColor: '#3f51b5'
        }
      ]
    };
  
   


    loadRevenueData(view: 'daily' | 'monthly') {
      if (view === 'daily') {
        this.barChartData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [
            {
              label: 'Revenue',
              data: [1500, 2000, 1800, 2200, 1700],
              backgroundColor: '#273746'
            }
          ]
        };
      } else {
        this.barChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Revenue',
              data: [42000, 39000, 45000, 47000, 43000, 34003, 45000, 90107, 40034, 89884, 34343, 34787],
              backgroundColor: '#3f51b5'
            }
          ]
        };
      }
    }
    
  
    onViewChange() {
      this.loadRevenueData(this.selectedView);
    }

    barChartType: 'bar'='bar';




  // leaflet map
  private map!: L.Map;
  searchQuery = '';
  searchedMarker: L.Marker | null = null;

  chargers = [
    { name: 'Charger A', status: 'Online', power: '50kW', lat: 28.6139, lng: 77.2090 },
    { name: 'Charger B', status: 'Offline', power: '22kW', lat: 28.6139, lng: 77.2090 },
    { name: 'Charger C', status: 'Online', power: '60kW', lat: 28.7041, lng: 77.1025 },
    { name: 'Charger D', status: 'Online', power: '80kW', lat: 28.5355, lng: 77.3910 }
  ];

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [28.6139, 77.2090],
      zoom: 7,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.renderGroupedChargers();

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  // 🔹 GROUP chargers by lat/lng and show only 1 marker per location
  renderGroupedChargers(): void {
    const icon = L.icon({
      iconUrl: 'assets/device-icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // const grouped = new Map<string, any[]>();

    // this.chargers.forEach(c => {
    //   const key = `${c.lat},${c.lng}`;
    //   if (!grouped.has(key)) grouped.set(key, []);
    //   grouped.get(key)?.push(c);
    // });

    // grouped.forEach((chargersAtLocation, key) => {
    //   const [lat, lng] = key.split(',').map(Number);
    //   const popupHtml = this.generatePopupHtml(chargersAtLocation);

    //   const marker = L.marker([lat, lng], { icon }).addTo(this.map);
    //   marker.bindPopup(popupHtml);
    // });
  }

  // 🔹 Generate popup content for a group of chargers
  private generatePopupHtml(chargers: any[]): string {
    return `
      <b>${chargers.length} Charger(s) at ${this.searchQuery} location</b><br><br>
      ${chargers.map(c => `
        <div>
          🔌 <strong>${c.name}</strong><br>
          Power: ${c.power}<br>
          Status: <span style="color:${c.status === 'Online' ? 'green' : 'red'}">${c.status}</span>
        </div><hr>`).join('')}
    `;
  }

  // 🔹 Search a location and show a marker with dummy chargers
  searchLocation(): void {
    if (!this.searchQuery.trim()) return;
  
    const query = encodeURIComponent(this.searchQuery);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) {
          alert('No results found');
          return;
        }
  
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
  
        // Remove previous search marker
        if (this.searchedMarker) {
          this.map.removeLayer(this.searchedMarker);
          this.searchedMarker = null;
        }
  
        // Find chargers in the array near the searched lat/lng
        const foundChargers = this.chargers.filter(c =>
          Math.abs(c.lat - lat) < 0.1 && Math.abs(c.lng - lng) < 0.1
        );
  
        const icon = L.icon({
          iconUrl: 'assets/device-icon.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
  
        const popupHtml = foundChargers.length > 0
          ? this.generatePopupHtml(foundChargers)
          : `<b>No charger available at this location</b>`;
  
        this.searchedMarker = L.marker([lat, lng], { icon })
          .addTo(this.map)
          .bindPopup(popupHtml)
          .openPopup();
  
        this.map.setView([lat, lng], 14);
      })
      .catch(error => {
        console.error('Geocoding error:', error);
        alert('Failed to find location');
      });
  }
  
    
}
