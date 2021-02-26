import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectelementPickerComponent } from './projectelement-picker.component';

describe('ProjectelementPickerComponent', () => {
  let component: ProjectelementPickerComponent;
  let fixture: ComponentFixture<ProjectelementPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectelementPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectelementPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
