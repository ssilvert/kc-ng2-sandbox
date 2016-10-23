import {Component} from "@angular/core";
import {KeycloakService} from "./keycloak.service";

@Component({
  selector: 'my-app',
  template: `
    <div id="content-area" class="col-md-9" role="main">
      <div id="content">
        <h1>Angular2 Klient</h1>
        <button type="button" (click)="logout()">Sign Out</button>
      </div>
    </div>
`
})
export class AppComponent {
  constructor(private kc: KeycloakService) {}

  logout() {
    this.kc.logout();
  }

}
