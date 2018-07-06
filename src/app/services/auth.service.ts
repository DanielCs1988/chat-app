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
  userJoined = new EventEmitter<User>();

  private auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: AUTH_CONFIG.responseType,
    audience: AUTH_CONFIG.audience,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: AUTH_CONFIG.scope
  });

  private isProfileFetched = false;
  private USERS_URL = '/api/users/';
  private API_DOMAIN = 'localhost';
  private PORT = 8000;

  constructor(private router: Router, private socket: SocketClient, private http: HttpClient) { }

  login(): void {
    this.auth0.authorize();
  }

  handleAuthentication(): void {
    if (this.isAuthenticated()) {
      this.getProfile();
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
    this.socket.connect(this.API_DOMAIN, this.PORT, accessToken);
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigate(['/']);
  }

  private setSession(authResult: Auth0DecodedHash) {
    const expiresAt = JSON.stringify(new Date().getTime() + authResult.expiresIn * 1000);
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  private userLoginAccepted(accessToken: string) {
    console.log('login accepted');
    this.isProfileFetched = true;
    this.userJoined.emit(this.userProfile);
    this.initSocketConnection(accessToken);
    this.router.navigate(['/chat']);
  }

  private async getProfile() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }
    const profile = await this.http.post<User>(this.USERS_URL + 'login', {}).toPromise();
    this.userProfile = profile;
    if (!(profile.nickName && profile.introduction)) {
      this.router.navigate(['/user-details']);
    } else {
      this.userLoginAccepted(accessToken);
    }
  }

  public async updateProfile(nick: string, intro: string) {
    const accessToken = localStorage.getItem('access_token');
    this.userProfile.nickName = nick;
    this.userProfile.introduction = intro;
    await this.http.post(this.USERS_URL + 'update', this.userProfile).toPromise();
    this.userLoginAccepted(accessToken);
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
