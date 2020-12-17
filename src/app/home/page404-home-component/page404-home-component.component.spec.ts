import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Page404HomeComponentComponent } from "./page404-home-component.component";

describe("Page404HomeComponentComponent", () => {
  let component: Page404HomeComponentComponent;
  let fixture: ComponentFixture<Page404HomeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Page404HomeComponentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page404HomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
