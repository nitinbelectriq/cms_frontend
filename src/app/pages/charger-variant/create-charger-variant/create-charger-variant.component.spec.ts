import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargerVariantComponent } from './create-charger-variant.component';

describe('CreateChargerVariantComponent', () => {
  let component: CreateChargerVariantComponent;
  let fixture: ComponentFixture<CreateChargerVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChargerVariantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateChargerVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
