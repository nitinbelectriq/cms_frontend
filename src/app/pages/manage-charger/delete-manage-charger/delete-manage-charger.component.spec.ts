import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteManageChargerComponent } from './delete-manage-charger.component';

describe('DeleteManageChargerComponent', () => {
  let component: DeleteManageChargerComponent;
  let fixture: ComponentFixture<DeleteManageChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteManageChargerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteManageChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
