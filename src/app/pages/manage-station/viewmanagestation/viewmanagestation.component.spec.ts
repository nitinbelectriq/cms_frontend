import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmanagestationComponent } from './viewmanagestation.component';

describe('ViewmanagestationComponent', () => {
  let component: ViewmanagestationComponent;
  let fixture: ComponentFixture<ViewmanagestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewmanagestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewmanagestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
