interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  audience: string;
  responseType: string;
  scope: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'hf9N-twx_HdoCwvbTjfXuEEh0AW2lHPi',
  domain: 'danielcs88.eu.auth0.com',
  callbackURL: 'http://localhost:4200/callback',
  audience: 'http://localhost:8080/chat',
  responseType: 'token id_token',
  scope: 'openid profile email'
};
