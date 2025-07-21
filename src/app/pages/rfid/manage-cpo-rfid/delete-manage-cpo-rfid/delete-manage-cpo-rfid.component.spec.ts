import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteManageCpoRfidComponent } from './delete-manage-cpo-rfid.component';

describe('DeleteManageCpoRfidComponent', () => {
  let component: DeleteManageCpoRfidComponent;
  let fixture: ComponentFixture<DeleteManageCpoRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteManageCpoRfidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteManageCpoRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
