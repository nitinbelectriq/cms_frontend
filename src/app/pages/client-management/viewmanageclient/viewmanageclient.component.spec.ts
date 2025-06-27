import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmanageclientComponent } from './viewmanageclient.component';

describe('ViewmanageclientComponent', () => {
  let component: ViewmanageclientComponent;
  let fixture: ComponentFixture<ViewmanageclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewmanageclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewmanageclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
