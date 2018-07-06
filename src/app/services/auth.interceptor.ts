import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'Bearer ' + AuthService.getToken();
    const reqWithAuth = req.clone({headers: req.headers.append('Authorization', token)});
    console.log(reqWithAuth);
    return next.handle(reqWithAuth);
  }

}
