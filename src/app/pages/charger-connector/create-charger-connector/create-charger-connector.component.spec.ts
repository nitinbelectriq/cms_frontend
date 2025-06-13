import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargerConnectorComponent } from './create-charger-connector.component';

describe('CreateChargerConnectorComponent', () => {
  let component: CreateChargerConnectorComponent;
  let fixture: ComponentFixture<CreateChargerConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChargerConnectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateChargerConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
