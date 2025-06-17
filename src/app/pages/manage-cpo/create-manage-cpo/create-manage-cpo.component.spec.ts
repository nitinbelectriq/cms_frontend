import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManageCpoComponent } from './create-manage-cpo.component';

describe('CreateManageCpoComponent', () => {
  let component: CreateManageCpoComponent;
  let fixture: ComponentFixture<CreateManageCpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateManageCpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateManageCpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
