import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { ItemLocation } from '../../../interfaces/interfaces';

@Component({
  tag: 'location-create'
})
export class LocationCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @State() name: string;
  @State() selectedParentLocation: ItemLocation;

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async handleSaveClick() {

    let bodyJson = this.selectedParentLocation
      ? JSON.stringify({
        name: this.name,
        parentId: this.selectedParentLocation.id
      })
      : JSON.stringify({
        name: this.name
      });

    let response = await fetch(
      this.apiBaseUrl + "/itemlocations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: bodyJson
    });

    if (response.ok) {
      
      this.dismiss();
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
      this.name = event.detail.target.value;
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Location</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="locationName" debounce={ 200 } value={ this.name }></ion-input>
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
          <ion-button color="primary" onClick={ () => this.dismiss()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}
