import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBackManagementOpenRequestComponent } from './call-back-management-open-request.component';

describe('CallBackManagementOpenRequestComponent', () => {
  let component: CallBackManagementOpenRequestComponent;
  let fixture: ComponentFixture<CallBackManagementOpenRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallBackManagementOpenRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallBackManagementOpenRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
