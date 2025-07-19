import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteManageRfidComponent } from './delete-manage-rfid.component';

describe('DeleteManageRfidComponent', () => {
  let component: DeleteManageRfidComponent;
  let fixture: ComponentFixture<DeleteManageRfidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteManageRfidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteManageRfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
