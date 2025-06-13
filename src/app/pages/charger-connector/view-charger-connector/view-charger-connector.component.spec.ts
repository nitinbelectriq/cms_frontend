import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChargerConnectorComponent } from './view-charger-connector.component';

describe('ViewChargerConnectorComponent', () => {
  let component: ViewChargerConnectorComponent;
  let fixture: ComponentFixture<ViewChargerConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChargerConnectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewChargerConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
