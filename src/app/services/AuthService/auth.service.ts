import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from 'src/app/models/LoginRequest';
import { LoginResponse } from 'src/app/models/LoginResponse';
import { SignupRequest } from 'src/app/models/SignupRequest';
import { Response } from 'src/app/models/Response';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(signupRequest: SignupRequest): Observable<Response>{
    return this.http.post<Response>(`${environment.apiUrl}api/auth/signup`, signupRequest);
  }

  login(LoginRequest: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.apiUrl}api/auth/login`,LoginRequest)
    .pipe(tap(loginResponse => {
      localStorage.setItem("jwt",loginResponse.token);
      localStorage.setItem("refreshToken", loginResponse.refreshToken);
      localStorage.setItem("username", loginResponse.username);
      return loginResponse;
    }));
  }

  logout(): Observable<Response> | null{
    let refreshToken : string | null;
    if(refreshToken = localStorage.getItem("refreshToken")){
      localStorage.clear();
      return this.http.post<Response>(`${environment.apiUrl}api/auth/logout`,{refreshToken});
    }
    return null;
  }

  userIsLogged(): boolean{
    if(this.getRefreshToken() && this.getJwtToken() && this.getUsername()) return true;
    return false;
  }

  getRefreshToken(): string | null{
    return localStorage.getItem("refreshToken");
  }

  getJwtToken(): string | null{
    return localStorage.getItem("jwt");
  }

  getUsername(): string | null{
    return localStorage.getItem("username");
  }

}
