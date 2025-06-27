import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemanageclientComponent } from './createmanageclient.component';

describe('CreatemanageclientComponent', () => {
  let component: CreatemanageclientComponent;
  let fixture: ComponentFixture<CreatemanageclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatemanageclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatemanageclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
