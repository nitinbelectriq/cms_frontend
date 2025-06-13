import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectorsComponent } from './charger-connector.component';
//import { ChargerConnectorComponent } from './charger-connector.component';

describe('ChargerConnectorComponent', () => {
  let component: ConnectorsComponent;
  let fixture: ComponentFixture<ConnectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
