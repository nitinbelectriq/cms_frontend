import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCpoRfidComponent } from './view-cpo-rfid.component';

describe('ViewCpoRfidComponent', () => {
  let component: ViewCpoRfidComponent;
  let fixture: ComponentFixture<ViewCpoRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCpoRfidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCpoRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
