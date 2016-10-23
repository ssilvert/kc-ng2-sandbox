import {Injectable} from "@angular/core";

declare var Keycloak: any;

@Injectable()
export class KeycloakService {
  static auth: any = {};

  static init(): Promise<any> {
    let keycloakAuth: any = new Keycloak('keycloak.json');
    KeycloakService.auth.loggedIn = false;

      return new Promise((resolve, reject) => {
        keycloakAuth.init({ onLoad: 'login-required' })
          .success(() => {
            KeycloakService.auth.loggedIn = true;
            KeycloakService.auth.authz = keycloakAuth;
            KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl 
                + "/realms/klient-realm/protocol/openid-connect/logout?redirect_uri=http://localhost:3000/";
            resolve();
          })
          .error(() => {
            reject();
          });
      });
    }

  logout() {
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;

    window.location.href = KeycloakService.auth.logoutUrl;
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (KeycloakService.auth.authz.token) {
        KeycloakService.auth.authz.updateToken(5)
          .success(() => {
            resolve(<string>KeycloakService.auth.authz.token);
          })
          .error(() => {
            reject('Failed to refresh token');
          });
      }
    });
  }
}
