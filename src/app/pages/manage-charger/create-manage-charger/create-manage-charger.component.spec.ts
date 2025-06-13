import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManageChargerComponent } from './create-manage-charger.component';

describe('CreateManageChargerComponent', () => {
  let component: CreateManageChargerComponent;
  let fixture: ComponentFixture<CreateManageChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateManageChargerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateManageChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
