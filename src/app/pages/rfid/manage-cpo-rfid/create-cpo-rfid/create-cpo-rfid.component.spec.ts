import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCpoRfidComponent } from './create-cpo-rfid.component';

describe('CreateCpoRfidComponent', () => {
  let component: CreateCpoRfidComponent;
  let fixture: ComponentFixture<CreateCpoRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCpoRfidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCpoRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
