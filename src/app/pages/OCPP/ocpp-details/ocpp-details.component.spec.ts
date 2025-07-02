import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcppDetailsComponent } from './ocpp-details.component';

describe('OcppDetailsComponent', () => {
  let component: OcppDetailsComponent;
  let fixture: ComponentFixture<OcppDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcppDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OcppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
