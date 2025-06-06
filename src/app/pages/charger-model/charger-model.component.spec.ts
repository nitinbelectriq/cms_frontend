import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerModelComponent } from './charger-model.component';

describe('ChargerModelComponent', () => {
  let component: ChargerModelComponent;
  let fixture: ComponentFixture<ChargerModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
