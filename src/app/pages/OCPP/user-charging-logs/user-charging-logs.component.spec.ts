import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChargingLogsComponent } from './user-charging-logs.component';

describe('UserChargingLogsComponent', () => {
  let component: UserChargingLogsComponent;
  let fixture: ComponentFixture<UserChargingLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChargingLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserChargingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
