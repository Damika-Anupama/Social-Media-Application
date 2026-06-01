import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = sessionStorage.getItem('token');
    let tokenizedReq = null;
    if(token !== null){
      tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }else {
      tokenizedReq = req;
    }
    // console.log(tokenizedReq)
    return next.handle(tokenizedReq);
  }
}
