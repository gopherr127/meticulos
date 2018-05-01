import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { ItemLocation } from '../../../interfaces/interfaces';

@Component({
  tag: 'location-detail'
})
export class LocationDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() itemLocationId: string;
  @State() subtitle: string = 'Location: ';
  @State() location: ItemLocation;
  @State() selectedParentLocation: ItemLocation;
  
  async componentWillLoad() {

    await this.loadItemLocation();
  }

  popComponent() {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.pop();
  }

  async loadItemLocation() {

    let response = await fetch(
      this.apiBaseUrl + "/itemlocations/" + this.itemLocationId, {
      method: "GET"
    });

    if (response.ok) {

      this.location = await response.json();
      this.selectedParentLocation = this.location.parent;
      this.subtitle = `Location: ${this.location.name}`;
    }
  }

  async handleSaveClick() {

    let response = await fetch(
      this.apiBaseUrl + `/itemlocations/${this.itemLocationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.location)
    });

    if (response.ok) {
      
      this.popComponent();
    }
  }

  async presentLocationSearch() {

    const modal = await this.modalCtrl.create({
      component: 'location-search'
    });

    await modal.present();
  }
  
  @Listen('body:ionModalDidDismiss')
  async modalDidDismiss(event: CustomEvent) {
    if (event) {

      this.selectedParentLocation = event.detail.data;
    }
  }

  @Listen('ionInput')
  handleNameChanged(event: any) {

    if (event.target.id === "locationName") {
      this.location.name = event.detail.target.value;
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>Meticulos</ion-title>
        </ion-toolbar>

        <ion-toolbar color="secondary">
          <ion-title>{ this.subtitle }</ion-title>
          <ion-buttons slot="end">
            <ion-button>
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="locationName" debounce={ 200 } value={ this.location.name }></ion-input>
        </ion-item>
        <ion-item button onClick={ () => this.presentLocationSearch() }>
          <ion-label position='fixed'>Parent Location</ion-label>
          <ion-input slot="end" disabled value={ this.selectedParentLocation ? this.selectedParentLocation.name : "" }></ion-input>
          <ion-icon slot="end" name="more" color="tertiary"></ion-icon>
        </ion-item>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" onClick={ () => this.popComponent()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}