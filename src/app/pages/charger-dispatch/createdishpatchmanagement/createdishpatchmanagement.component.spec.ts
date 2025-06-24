import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedishpatchmanagementComponent } from './createdishpatchmanagement.component';

describe('CreatedishpatchmanagementComponent', () => {
  let component: CreatedishpatchmanagementComponent;
  let fixture: ComponentFixture<CreatedishpatchmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedishpatchmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatedishpatchmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
