import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPickerCardComponent } from './project-picker-card.component';

describe('ProjectPickerCardComponent', () => {
  let component: ProjectPickerCardComponent;
  let fixture: ComponentFixture<ProjectPickerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPickerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPickerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
