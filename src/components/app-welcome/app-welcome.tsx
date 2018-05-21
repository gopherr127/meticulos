import { Component } from '@stencil/core';

@Component({
  tag: 'app-welcome'
})
export class AppWelcome {

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Meticulos</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-item>
          <ion-label>Hi there! Click "Sign In" to get started.</ion-label>
        </ion-item>
      </ion-content>
    ];
  }
}