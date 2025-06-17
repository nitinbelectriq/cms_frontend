import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManageCpoComponent } from './edit-manage-cpo.component';

describe('EditManageCpoComponent', () => {
  let component: EditManageCpoComponent;
  let fixture: ComponentFixture<EditManageCpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditManageCpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditManageCpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
