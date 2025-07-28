import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoleActivityComponent } from './manage-role-activity.component';

describe('ManageRoleActivityComponent', () => {
  let component: ManageRoleActivityComponent;
  let fixture: ComponentFixture<ManageRoleActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoleActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageRoleActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
