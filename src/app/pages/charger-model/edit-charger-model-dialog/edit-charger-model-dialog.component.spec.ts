import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChargerModelDialogComponent } from './edit-charger-model-dialog.component';

describe('EditChargerModelDialogComponent', () => {
  let component: EditChargerModelDialogComponent;
  let fixture: ComponentFixture<EditChargerModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditChargerModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditChargerModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
