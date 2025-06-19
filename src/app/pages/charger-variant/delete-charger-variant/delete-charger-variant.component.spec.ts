import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChargerVariantComponent } from './delete-charger-variant.component';

describe('DeleteChargerVariantComponent', () => {
  let component: DeleteChargerVariantComponent;
  let fixture: ComponentFixture<DeleteChargerVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChargerVariantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteChargerVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
