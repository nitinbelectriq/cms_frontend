import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManageCpoComponent } from './view-manage-cpo.component';

describe('ViewManageCpoComponent', () => {
  let component: ViewManageCpoComponent;
  let fixture: ComponentFixture<ViewManageCpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewManageCpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewManageCpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
