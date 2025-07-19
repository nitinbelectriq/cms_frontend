import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteManageStationComponent } from './delete-manage-station.component';

describe('DeleteManageStationComponent', () => {
  let component: DeleteManageStationComponent;
  let fixture: ComponentFixture<DeleteManageStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteManageStationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteManageStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
