import * as auth0 from 'auth0-js';
import {AUTH_CONFIG} from './auth0-variables';
import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Auth0DecodedHash} from 'auth0-js';
import {SocketClient} from './SocketClient';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';

(window as any).global = window;

@Injectable()
export class AuthService {

  userProfile: User;
  userJoined = new EventEmitter<User>(); // TODO: trigger when profile is ready

  private auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: AUTH_CONFIG.responseType,
    audience: AUTH_CONFIG.audience,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: AUTH_CONFIG.scope
  });

  private isProfileFetched = false;
  private LOGIN_URL = 'http://localhost:8080/users/login';
  private API_DOMAIN = 'localhost';
  private PORT = 8080;

  constructor(private router: Router, private socket: SocketClient, private http: HttpClient) {
    if (this.isAuthenticated()) {
      this.getProfile();
    }
  }

  login(): void {
    this.auth0.authorize();
  }

  handleAuthentication(): void {
    if (this.isAuthenticated()) {
      this.getProfile();
      return;
    }
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.getProfile();
      } else if (err) {
        console.error(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    })
  }

  private initSocketConnection(accessToken: string) {
    this.socket.on('open', this.getProfile.bind(this));
    this.socket.connect(this.API_DOMAIN, this.PORT, accessToken);
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigate(['/']);
  }

  private setSession(authResult: Auth0DecodedHash): void {
    const expiresAt = JSON.stringify(new Date().getTime() + authResult.expiresIn * 1000);
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  private async getProfile(): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }
    const profile = await this.http.post<User>(this.LOGIN_URL, {}).toPromise();
    this.userProfile = profile;
    if (!(profile.nickName && profile.introduction)) {

      // TODO: NAVIGATE TO NEW COMPONENT; NEED TO PROVIDE AN UPDATER METHOD HERE

    } else {
      this.isProfileFetched = true;
      this.userJoined.emit(this.userProfile);
      this.initSocketConnection(accessToken);
      this.router.navigate(['/chat']);
    }
  }

  isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at") || '{}');
    return new Date().getTime() < expiresAt;
  }

  isLoggedIn(): boolean {
    return this.isProfileFetched;
  }

  static getToken() {
    return localStorage.getItem('access_token');
  }
}
