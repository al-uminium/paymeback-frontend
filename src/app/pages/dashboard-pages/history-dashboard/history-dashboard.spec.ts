import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDashboard } from './history-dashboard';

describe('HistoryDashboard', () => {
  let component: HistoryDashboard;
  let fixture: ComponentFixture<HistoryDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
