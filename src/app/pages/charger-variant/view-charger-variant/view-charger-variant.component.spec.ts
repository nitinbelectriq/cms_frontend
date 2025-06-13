import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChargerVariantComponent } from './view-charger-variant.component';

describe('ViewChargerVariantComponent', () => {
  let component: ViewChargerVariantComponent;
  let fixture: ComponentFixture<ViewChargerVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChargerVariantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewChargerVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
