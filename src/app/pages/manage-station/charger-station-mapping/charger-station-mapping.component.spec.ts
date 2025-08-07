import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerStationMappingComponent } from './charger-station-mapping.component';

describe('ChargerStationMappingComponent', () => {
  let component: ChargerStationMappingComponent;
  let fixture: ComponentFixture<ChargerStationMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerStationMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerStationMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
