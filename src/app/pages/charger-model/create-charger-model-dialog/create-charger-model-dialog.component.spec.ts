import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargerModelDialogComponent } from './create-charger-model-dialog.component';

describe('CreateChargerModelDialogComponent', () => {
  let component: CreateChargerModelDialogComponent;
  let fixture: ComponentFixture<CreateChargerModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChargerModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateChargerModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
