import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCpoComponent } from './manage-cpo.component';

describe('ManageCpoComponent', () => {
  let component: ManageCpoComponent;
  let fixture: ComponentFixture<ManageCpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
