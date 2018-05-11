import { Component, State } from '@stencil/core';
import * as AuthService from '../../../services/auth-service';

@Component({
  tag: 'public-home'
})
export class PublicHome {

  @State() isUserAuthenticated: boolean;

  async componentWillLoad() {

    // Possibly redirect if user is already authenticated
  }

  // e.preventDefault will prevent the event's default action
  // from taking place, e.g., a button click will not continue to route

  public async login() {
    
    await AuthService.initiateAuthentication();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Meticulos</ion-title>
          <ion-buttons slot="end">
            <ion-button id="signInButton" onClick={ () => this.login() }>
              Sign In
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        
      </ion-content>
    ];
  }
}