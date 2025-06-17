import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChargerModelDialogComponent } from './delete-charger-model-dialog.component';

describe('DeleteChargerModelDialogComponent', () => {
  let component: DeleteChargerModelDialogComponent;
  let fixture: ComponentFixture<DeleteChargerModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChargerModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteChargerModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
