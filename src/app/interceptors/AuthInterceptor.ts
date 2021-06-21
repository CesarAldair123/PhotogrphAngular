import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable} from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { RefreshResponse } from "../models/RefreshResponse";
import { AuthService } from "../services/AuthService/auth.service";

@Injectable({
    providedIn: "root"
})
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService,
        private http: HttpClient){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(req.url === `${environment.apiUrl}api/auth/refresh`) return next.handle(req);

        let authReq: HttpRequest<any>;
        let jwt: string | null = this.authService.getJwtToken();
        let refreshToken: string | null = this.authService.getRefreshToken();
        let username: string | null = this.authService.getUsername();

        if(jwt && refreshToken && username){ 
            authReq = req.clone({
                headers: req.headers.set("Authorization",`Bearer ${jwt}`)
            });
            return next.handle(authReq).pipe(
                catchError(err => {
                    console.warn(err);
                    if(err.status == 401){
                        return this.http.post<RefreshResponse>(`${environment.apiUrl}api/auth/refresh`,{refreshToken,username})
                        .pipe(
                            switchMap(refreshResponse=>{
                                console.warn("JWT HAS EXPIRED AN WAS REFRESHED");
                                localStorage.setItem("jwt",refreshResponse.token);
                                authReq = req.clone({
                                    headers: req.headers.set("Authorization",`Bearer ${refreshResponse.token}`)
                                });
                                return next.handle(authReq);    
                            })
                        );
                    }
                    //localStorage.clear();
                    return next.handle(req);
                }),
            );    
        }
        localStorage.clear();
        return next.handle(req);
    }

}