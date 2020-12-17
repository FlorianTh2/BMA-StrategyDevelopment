import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Page404AuthComponentComponent } from "./page404-auth-component.component";

describe("Page404AuthComponentComponent", () => {
  let component: Page404AuthComponentComponent;
  let fixture: ComponentFixture<Page404AuthComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Page404AuthComponentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page404AuthComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
