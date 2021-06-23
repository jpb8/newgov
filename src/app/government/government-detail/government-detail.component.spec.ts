import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentDetailComponent } from './government-detail.component';

describe('GovernmentDetailComponent', () => {
  let component: GovernmentDetailComponent;
  let fixture: ComponentFixture<GovernmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernmentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
