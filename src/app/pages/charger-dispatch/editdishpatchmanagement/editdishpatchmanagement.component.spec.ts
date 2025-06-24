import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdishpatchmanagementComponent } from './editdishpatchmanagement.component';

describe('EditdishpatchmanagementComponent', () => {
  let component: EditdishpatchmanagementComponent;
  let fixture: ComponentFixture<EditdishpatchmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditdishpatchmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditdishpatchmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
