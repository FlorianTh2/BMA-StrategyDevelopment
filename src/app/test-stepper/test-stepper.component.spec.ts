import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStepperComponent } from './test-stepper.component';

describe('TestStepperComponent', () => {
  let component: TestStepperComponent;
  let fixture: ComponentFixture<TestStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
