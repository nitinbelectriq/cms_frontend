import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManageChargerComponent } from './view-manage-charger.component';

describe('ViewManageChargerComponent', () => {
  let component: ViewManageChargerComponent;
  let fixture: ComponentFixture<ViewManageChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewManageChargerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewManageChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
