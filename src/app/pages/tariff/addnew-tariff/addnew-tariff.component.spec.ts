import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewTariffComponent } from './addnew-tariff.component';

describe('AddnewTariffComponent', () => {
  let component: AddnewTariffComponent;
  let fixture: ComponentFixture<AddnewTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddnewTariffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddnewTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
