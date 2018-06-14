import {Injectable} from '@angular/core';
import {ChatService} from './chat.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private chat: ChatService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.chat.name == undefined) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
