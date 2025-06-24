import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponentTsComponent } from './view-component.ts.component';

describe('ViewComponentTsComponent', () => {
  let component: ViewComponentTsComponent;
  let fixture: ComponentFixture<ViewComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewComponentTsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
