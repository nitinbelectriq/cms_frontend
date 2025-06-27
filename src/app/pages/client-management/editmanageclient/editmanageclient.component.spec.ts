import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmanageclientComponent } from './editmanageclient.component';

describe('EditmanageclientComponent', () => {
  let component: EditmanageclientComponent;
  let fixture: ComponentFixture<EditmanageclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmanageclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditmanageclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
