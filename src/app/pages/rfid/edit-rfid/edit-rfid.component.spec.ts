import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRfidComponent } from './edit-rfid.component';

describe('EditRfidComponent', () => {
  let component: EditRfidComponent;
  let fixture: ComponentFixture<EditRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRfidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
