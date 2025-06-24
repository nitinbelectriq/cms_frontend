import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdishpatchmanagementComponent } from './viewdishpatchmanagement.component';

describe('ViewdishpatchmanagementComponent', () => {
  let component: ViewdishpatchmanagementComponent;
  let fixture: ComponentFixture<ViewdishpatchmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewdishpatchmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewdishpatchmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
