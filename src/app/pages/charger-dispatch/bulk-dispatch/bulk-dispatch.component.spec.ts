import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDispatchComponent } from './bulk-dispatch.component';

describe('BulkDispatchComponent', () => {
  let component: BulkDispatchComponent;
  let fixture: ComponentFixture<BulkDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkDispatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
