import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChargerModelDialogComponent } from './view-charger-model-dialog.component';

describe('ViewChargerModelDialogComponent', () => {
  let component: ViewChargerModelDialogComponent;
  let fixture: ComponentFixture<ViewChargerModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChargerModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewChargerModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
