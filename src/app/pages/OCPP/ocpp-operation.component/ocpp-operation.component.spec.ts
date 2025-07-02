import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcppOperationComponent } from './ocpp-operation.component';

describe('OcppOperationComponentComponent', () => {
  let component: OcppOperationComponent;
  let fixture: ComponentFixture<OcppOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcppOperationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OcppOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
