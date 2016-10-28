import {Injectable} from "@angular/core";

declare var Keycloak: any;

@Injectable()
export class KeycloakService {
    static auth: any = {};
    static keycloakAuth: any = new Keycloak('keycloak.json');

    static init(): Promise<any> {
        KeycloakService.auth.loggedIn = false;

        return new Promise((resolve, reject) => {
            KeycloakService.keycloakAuth.init({ onLoad: 'login-required' })
                .success(() => {
                    console.log("------------------------------");
                    console.log(`authServerUrl=${KeycloakService.keycloakAuth.authServerUrl}`);
                    console.log(`realm=${KeycloakService.keycloakAuth.realm}`);
                    console.log(`resource=${KeycloakService.keycloakAuth.resource}`);
                    console.log(`publicClient=${KeycloakService.keycloakAuth.publicClient}`);
                    console.log(`subject=${KeycloakService.keycloakAuth.subject}`);
                    console.log(`realmAccess=${JSON.stringify(KeycloakService.keycloakAuth.realmAccess)}`);
                    console.log(`idTokenParsed=${JSON.stringify(KeycloakService.keycloakAuth.idTokenParsed)}`);
                    console.log(`logoutUrl=${KeycloakService.keycloakAuth.createLogoutUrl()}`);
                    console.log("------------------------------");

                    KeycloakService.auth.loggedIn = true;
                    KeycloakService.auth.authz = KeycloakService.keycloakAuth;
                    KeycloakService.auth.logoutUrl = KeycloakService.keycloakAuth.createLogoutUrl();
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
        KeycloakService.keycloakAuth.logout();
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
