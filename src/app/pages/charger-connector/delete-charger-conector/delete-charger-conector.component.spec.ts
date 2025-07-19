import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChargerConectorComponent } from './delete-charger-conector.component';

describe('DeleteChargerConectorComponent', () => {
  let component: DeleteChargerConectorComponent;
  let fixture: ComponentFixture<DeleteChargerConectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChargerConectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteChargerConectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
