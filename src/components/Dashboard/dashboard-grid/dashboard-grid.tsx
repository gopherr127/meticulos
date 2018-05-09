import { Component } from '@stencil/core';

@Component({
  tag: 'dashboard-grid'
})
export class DashboardGrid {

  render() {
    return [
      <ion-header>

        <ion-action-sheet-controller></ion-action-sheet-controller>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>Meticulos</ion-title>
        </ion-toolbar>

        <ion-toolbar color="secondary">
          <ion-title>Dashboard</ion-title>
          <ion-buttons slot="end">
            <ion-button id="optionsMenu">
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </ion-header>,

      <ion-content class="outer-content">

        <dashboard-report-panel></dashboard-report-panel>
      
      </ion-content>
    ];
  }
}