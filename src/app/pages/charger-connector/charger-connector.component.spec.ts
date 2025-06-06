import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerConnectorComponent } from './charger-connector.component';

describe('ChargerConnectorComponent', () => {
  let component: ChargerConnectorComponent;
  let fixture: ComponentFixture<ChargerConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerConnectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
