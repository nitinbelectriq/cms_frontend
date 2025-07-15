import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerBulkComponent } from './charger-bulk.component';

describe('ChargerBulkComponent', () => {
  let component: ChargerBulkComponent;
  let fixture: ComponentFixture<ChargerBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerBulkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargerBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
