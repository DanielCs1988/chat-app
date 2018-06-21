import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  name: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.name = this.authService.userProfile ? this.authService.userProfile.givenName : '';
    this.authService.userJoined.subscribe(name => this.name = name);
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return AuthService.isAuthenticated();
  }

}
