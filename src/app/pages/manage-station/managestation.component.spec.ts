import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagestationComponent } from './managestation.component';

describe('ManagestationComponent', () => {
  let component: ManagestationComponent;
  let fixture: ComponentFixture<ManagestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
