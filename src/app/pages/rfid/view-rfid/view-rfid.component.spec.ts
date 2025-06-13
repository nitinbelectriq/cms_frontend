import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRfidComponent } from './view-rfid.component';

describe('ViewRfidComponent', () => {
  let component: ViewRfidComponent;
  let fixture: ComponentFixture<ViewRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRfidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
