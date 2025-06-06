import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerVariantComponent } from './charger-variant.component';

describe('ChargerVarinatComponent', () => {
  let component: ChargerVariantComponent;
  let fixture: ComponentFixture<ChargerVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerVariantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
