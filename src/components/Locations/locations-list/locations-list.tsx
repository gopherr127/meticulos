import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { ItemLocation } from '../../../interfaces/interfaces';

@Component({
  tag: 'locations-list'
})
export class LocationsList {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  locationsList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: HTMLIonPopoverControllerElement;
  @State() queryText = '';
  @State() locations: Array<ItemLocation> = [];

  async componentWillLoad() {

    await this.loadItemLocations();
  }

  componentDidLoad() {

    this.locationsList = this.el.querySelector('#locationsList');
  }

  async pushComponent(componentName: string, componentProps?: any) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.push(componentName, componentProps);
  }
  
  @Listen('body:ionModalDidDismiss')
  async loadItemLocations() {

    let response = await fetch(
      this.apiBaseUrl + "/itemlocations", { 
        method: "GET"
    });

    if (response.ok) {

      this.locations = await response.json();
    }
    else {
      console.log(response);
      console.log(await response.text());
    }
  }

  handleQrSearchClick() {

  }

  async handleAddFabClick() {

    const modal = await this.modalCtrl.create({
      component: 'location-create'
    });
    
    await modal.present();
  }

  async handleLocationClick(location: ItemLocation) {

    this.pushComponent('location-detail', {
      locationId: location.id
    })
  }

  async handleDeleteClick(location: ItemLocation) {

    let response = await fetch(
      this.apiBaseUrl + `/itemlocations/${location.id}`, {
        method: "DELETE"
    });

    if (response.ok) {

      await this.loadItemLocations();
      this.locationsList.closeSlidingItems();
    }
  }

  async presentOptionsMenu(event?: any) {

    const popover = await this.popoverCtrl.create({
      component: 'locations-list-options-menu',
      ev: event
    });

    await popover.present();
  }

  @Listen('ionFocus')
  async handleElementFocused(event: any) {

    if (event.target.id === "optionsMenu") {

      await this.presentOptionsMenu(event);
    }
  }
  
  render() {
    return [
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Meticulos</ion-title>
        </ion-toolbar>

        <ion-toolbar color="secondary">
          <ion-title>Locations</ion-title>
          <ion-buttons slot="end">
            <ion-button id="optionsMenu">
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
          <ion-buttons slot="end">
            <ion-button onClick={ () => this.handleQrSearchClick() }>
              <ion-icon slot="icon-only" name="barcode"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="locationsList">
          {this.locations.map(location => 
            <ion-item-sliding>
              <ion-item onClick={ () => this.handleLocationClick(location) }>
                { location.parent 
                ? <ion-label>
                    <h2>{location.name}</h2>
                    <p>{location.parent.name}</p>
                  </ion-label>
                : <ion-label>
                    <h2>{location.name}</h2>
                  </ion-label>
                }
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () => this.handleDeleteClick(location) }>
                  Delete
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

        <ion-fab horizontal="end" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.handleAddFabClick() }>Add</ion-fab-button>
        </ion-fab>

      </ion-content>
    ];
  }
}