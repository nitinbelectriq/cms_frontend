import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteManageCpoComponent } from './delete-manage-cpo.component';

describe('DeleteManageCpoComponent', () => {
  let component: DeleteManageCpoComponent;
  let fixture: ComponentFixture<DeleteManageCpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteManageCpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteManageCpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
