import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChargerConnectorComponent } from './edit-charger-connector.component';

describe('EditChargerConnectorComponent', () => {
  let component: EditChargerConnectorComponent;
  let fixture: ComponentFixture<EditChargerConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditChargerConnectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditChargerConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
