import { TestBed } from "@angular/core/testing";

import { AuthorizationService } from "./authorization.service";

describe("AutorizationService", () => {
  let service: AuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
