import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Apollo } from "apollo-angular";
import { LoginGQL, RegisterGQL, User } from "../../graphql/generated/graphql";
import jwtDecode from "jwt-decode";
import { JwtPayload } from "../../shared/models/jwtPayload";
@Injectable({
  providedIn: "root"
})
export class AuthorizationService {
  private header: HttpHeaders;

  private user: User = null;
  private userSource = new BehaviorSubject<User>(this.user);
  userObservable = this.userSource.asObservable();

  constructor(
    private apollo: Apollo,
    private loginGQL: LoginGQL,
    private registerGQL: RegisterGQL
  ) {}

  loginUser(email: string, password: string) {
    return this.loginGQL.mutate({ email: email, password: password }).pipe(
      map((a) => {
        let token = a.data.login as string;
        let decodedToken: JwtPayload = jwtDecode(token);
        const user: User = decodedToken.user as User;
        if (decodedToken && user) {
          this.updateLoggedInUser(user, token);
        }
      })
    );
  }

  updateLoggedInUser(user: User, token: string): void {
    this.userSource.next(user);
    this.setAuthorization(token);
  }

  // return token
  registerUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Observable<string> {
    return this.registerGQL
      .mutate({
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname
      })
      .pipe(map((a) => a.data.register as string));
  }

  logoutUser(): void {
    localStorage.removeItem("token");
    localStorage.clear();
    this.userSource.next(null);
  }

  setAuthorization(token: string): void {
    this.setTokenToLocalStorage(token);
  }

  isUserLoggedIn(): Boolean {
    const token = localStorage.getItem("token");
    return Boolean(token);
  }

  tryCreationOfUserFromJwtAfterPageReload() {
    const token = localStorage.getItem("token");
    let decodedToken: JwtPayload = jwtDecode(token);
    const user: User = decodedToken.user as User;
    if (decodedToken && user) {
      this.updateLoggedInUser(user, token);
    }
  }

  setTokenToLocalStorage(token: string): void {
    localStorage.setItem("token", token);
  }
}
