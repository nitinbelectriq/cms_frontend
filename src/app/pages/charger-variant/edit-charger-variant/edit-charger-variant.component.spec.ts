import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChargerVariantComponent } from './edit-charger-variant.component';

describe('EditChargerVariantComponent', () => {
  let component: EditChargerVariantComponent;
  let fixture: ComponentFixture<EditChargerVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditChargerVariantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditChargerVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
