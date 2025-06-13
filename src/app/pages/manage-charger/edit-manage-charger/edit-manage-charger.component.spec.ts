import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManageChargerComponent } from './edit-manage-charger.component';

describe('EditManageChargerComponent', () => {
  let component: EditManageChargerComponent;
  let fixture: ComponentFixture<EditManageChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditManageChargerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditManageChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
