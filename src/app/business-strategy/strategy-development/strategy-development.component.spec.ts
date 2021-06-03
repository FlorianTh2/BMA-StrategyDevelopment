import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDevelopmentComponent } from './strategy-development.component';

describe('StrategyDevelopmentComponent', () => {
  let component: StrategyDevelopmentComponent;
  let fixture: ComponentFixture<StrategyDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyDevelopmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
