import { Component } from '@stencil/core';
import * as AuthService from '../../../services/auth-service';

@Component({
  tag: 'auth-redirect'
})
export class AuthRedirect {

  async componentWillLoad() {

    await AuthService.handleAuthentication();

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.setRoot('dashboard-grid');
  }

}