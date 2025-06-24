import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCpoRfidComponent } from './manage-cpo-rfid.component';

describe('ManageCpoRfidComponent', () => {
  let component: ManageCpoRfidComponent;
  let fixture: ComponentFixture<ManageCpoRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCpoRfidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCpoRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
