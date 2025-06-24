import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmanagestationComponent } from './editmanagestation.component';

describe('EditmanagestationComponent', () => {
  let component: EditmanagestationComponent;
  let fixture: ComponentFixture<EditmanagestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmanagestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditmanagestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
