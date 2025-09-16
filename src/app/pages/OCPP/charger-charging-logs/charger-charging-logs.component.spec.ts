import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerChargingLogsComponent } from './charger-charging-logs.component';

describe('ChargerChargingLogsComponent', () => {
  let component: ChargerChargingLogsComponent;
  let fixture: ComponentFixture<ChargerChargingLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerChargingLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerChargingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
