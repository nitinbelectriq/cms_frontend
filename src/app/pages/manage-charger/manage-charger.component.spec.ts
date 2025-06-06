import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChargerComponent } from './manage-charger.component';

describe('ManageChargerComponent', () => {
  let component: ManageChargerComponent;
  let fixture: ComponentFixture<ManageChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageChargerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
