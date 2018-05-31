import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { PopoverController } from '@ionic/core';
import { ENV } from '../../../environments/environment';
import { DashboardPanel } from '../../../interfaces/interfaces';

@Component({
  tag: 'dashboard-grid'
})
export class DashboardGrid {
  
  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;
  private dashboardPanels: Array<DashboardPanel> = [];
  @State() leftColumnPanels: Array<DashboardPanel> = [];
  @State() rightColumnPanels: Array<DashboardPanel> = [];

  async componentWillLoad() {

    await this.loadDashboardPanels();
  }

  @Listen('panelDeleted')
  async loadDashboardPanels() {
    
    let response = await fetch(
      this.apiBaseUrl + "/dashboardpanels", { 
        method: "GET"
    });
    
    if (response.ok) {

      this.dashboardPanels = await response.json();
      
      this.leftColumnPanels = this.dashboardPanels.splice(0, 
        Math.ceil(this.dashboardPanels.length / 2));
      this.rightColumnPanels = this.dashboardPanels;
    }
  }

  async presentOptionsMenu(event?: any) {

    const popover = await this.popoverCtrl.create({
      component: 'dashboard-grid-options-menu',
      ev: event
    });

    popover.style.zIndex = '99999';

    popover.present();
  }

  @Listen('ionFocus')
  async handleElementFocused(event: any) {

    if (event.target.id === "optionsMenu") {

      await this.presentOptionsMenu(event);
    }
  }

  
  @Listen('body:ionPopoverDidDismiss')
  async popoverDidDismiss(event: any) {
    
    if (event && event.detail && event.detail.data) {

      let newPanel: DashboardPanel = {
        id: "000000000000000000000000",
        typeId: 'bar',
        title: 'New Panel',
        jsonQueryDocument: ''
      };
      
      this.leftColumnPanels = [...this.leftColumnPanels, newPanel];
    }
  }

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

        <ion-grid>
          <ion-row align-items-stretch>
            <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch>
              { this.leftColumnPanels.map(panel => 
                <dashboard-pane panel-id={panel.id}></dashboard-pane>
              )}
            </ion-col>
            <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch>
              { this.rightColumnPanels.map(panel => 
                <dashboard-pane panel-id={panel.id}></dashboard-pane>
              )}
            </ion-col>
          </ion-row>
        </ion-grid>
      
      </ion-content>
    ];
  }
}