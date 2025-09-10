import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/home.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
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

  stations: any[] = [];
  stationMarkers: L.Marker[] = [];

  // 📊 Chart data
  onlineCount = 15;
  offlineCount = 5;

  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Online', 'Offline'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#66BB6A', '#273746'],
        hoverBackgroundColor: ['#148544', '#EF5350']
      }
    ]
  };
  pieChartType: 'pie' = 'pie';

  selectedView: 'daily' | 'monthly' = 'daily';

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Revenue' }
    },
    scales: {
      x: { title: { display: true, text: 'Day/Month' } },
      y: { title: { display: true, text: 'Revenue (INR)' } }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Revenue', data: [], backgroundColor: '#3f51b5' }]
  };
  barChartType: 'bar' = 'bar';

  // 🗺️ Map
  private map!: L.Map;
  searchQuery = '';
  highlightedMarker: L.Marker | null = null;

  ngOnInit(): void {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (response) => {
        const data = response?.data || [];
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => console.error('Dashboard API error:', error)
    });

    // Load pie and bar chart
    this.pieChartData.datasets[0].data = [this.onlineCount, this.offlineCount];
    this.loadRevenueData(this.selectedView);

    // Load stations + chargers from API
    const userId = '123'; // replace with real logged-in user id
    this.dashboardService.getAllChargingStationsWithChargersAndConnectorsCW(userId).subscribe({
      next: (res) => {
        this.stations = res?.data || [];
        this.renderStationsOnMap();
      },
      error: (err) => console.error('Station API error:', err)
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [28.6139, 77.2090],
      zoom: 7,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  // 📊 Revenue chart data
  loadRevenueData(view: 'daily' | 'monthly') {
    if (view === 'daily') {
      this.barChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Revenue', data: [1500, 2000, 1800, 2200, 1700], backgroundColor: '#273746' }]
      };
    } else {
      this.barChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{ label: 'Revenue', data: [42000, 39000, 45000, 47000, 43000, 34003, 45000, 90107, 40034, 89884, 34343, 34787], backgroundColor: '#3f51b5' }]
      };
    }
  }
  onViewChange() {
    this.loadRevenueData(this.selectedView);
  }

  // 🗺️ Render stations with chargers
  renderStationsOnMap(): void {
    if (!this.map) return;

    this.stationMarkers.forEach(m => this.map.removeLayer(m));
    this.stationMarkers = [];

    const icon = L.icon({
      iconUrl: 'assets/device-icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.stations.forEach(station => {
      if (!station.latitude || !station.longitude) return;

      const popupHtml = this.generateStationPopup(station);

      const marker = L.marker([station.latitude, station.longitude], { icon })
        .addTo(this.map)
        .bindPopup(popupHtml);

      this.stationMarkers.push(marker);
    });

    if (this.stations.length > 0) {
      const bounds = L.latLngBounds(this.stations.map(s => [s.latitude, s.longitude]));
      this.map.fitBounds(bounds);
    }
  }

  generateStationPopup(station: any): string {
    return `
      <b>Station: ${station.name}</b><br>
      <div><strong>CPO:</strong> ${station.cpo_name}</div>
      <hr>
      ${station.chargers.map((c: any) => `
        <div>
          🔌 <strong>${c.name}</strong> (${c.power})
          <br>Status: <span style="color:${c.status === 'Online' ? 'green' : 'red'}">${c.status}</span>
          <br><i>Connectors: ${c.connectors.map((con: any) => con.type).join(', ')}</i>
        </div><hr>
      `).join('')}
    `;
  }

  // 🔍 Search by station/charger name
  searchLocation(): void {
    if (!this.searchQuery.trim()) return;

    const query = this.searchQuery.toLowerCase();

    const foundStation = this.stations.find(st =>
      st.name.toLowerCase().includes(query) ||
      st.chargers.some((c: any) => c.name.toLowerCase().includes(query))
    );

    if (!foundStation) {
      alert('No station/charger found');
      return;
    }

    // Highlight & zoom to station
    const lat = foundStation.latitude;
    const lng = foundStation.longitude;
    this.map.setView([lat, lng], 14);

    if (this.highlightedMarker) {
      this.map.removeLayer(this.highlightedMarker);
    }

    const icon = L.icon({
      iconUrl: 'assets/device-icon.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -32]
    });

    this.highlightedMarker = L.marker([lat, lng], { icon })
      .addTo(this.map)
      .bindPopup(this.generateStationPopup(foundStation))
      .openPopup();
  }
}
