import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBackManagementCloseRequestComponent } from './call-back-management-close-request.component';

describe('CallBackManagementCloseRequestComponent', () => {
  let component: CallBackManagementCloseRequestComponent;
  let fixture: ComponentFixture<CallBackManagementCloseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallBackManagementCloseRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallBackManagementCloseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
