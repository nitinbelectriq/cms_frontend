import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemanagestationComponent } from './createmanagestation.component';

describe('CreatemanagestationComponent', () => {
  let component: CreatemanagestationComponent;
  let fixture: ComponentFixture<CreatemanagestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatemanagestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatemanagestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
