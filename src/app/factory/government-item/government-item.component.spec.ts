import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentItemComponent } from './government-item.component';

describe('GovernmentItemComponent', () => {
  let component: GovernmentItemComponent;
  let fixture: ComponentFixture<GovernmentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernmentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernmentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
