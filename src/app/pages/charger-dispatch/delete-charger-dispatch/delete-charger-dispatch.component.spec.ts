import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChargerDispatchComponent } from './delete-charger-dispatch.component';

describe('DeleteChargerDispatchComponent', () => {
  let component: DeleteChargerDispatchComponent;
  let fixture: ComponentFixture<DeleteChargerDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChargerDispatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteChargerDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
