import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClientManagementComponent } from './delete-client-management.component';

describe('DeleteClientManagementComponent', () => {
  let component: DeleteClientManagementComponent;
  let fixture: ComponentFixture<DeleteClientManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClientManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteClientManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
