import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchmanagementComponent } from './dispatchmanagement.component';

describe('DispatchmanagementComponent', () => {
  let component: DispatchmanagementComponent;
  let fixture: ComponentFixture<DispatchmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatchmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
