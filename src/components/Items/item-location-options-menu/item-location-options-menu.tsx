import { Component, Element, Prop } from '@stencil/core';
import { Item } from '../../../interfaces/interfaces';
import * as GeolocationService from '../../../services/geolocation-service';

@Component({
  tag: 'item-location-options-menu'
})
export class ItemLocationOptionsMenu {

  @Element() el: any;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() item: Item;
  @Prop() returnUrl = '/';
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-popover') as any).dismiss(data);
  }

  setRootComponent(component: string, componentProps?: any) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.setRoot(component, componentProps);
  }

  async selectLocation() {

    this.dismiss();

    const modal = await this.modalCtrl.create({
      component: 'location-search'
    });

    await modal.present();
  }

  async useCurrentGps() {
    
    this.dismiss(await GeolocationService.getDeviceCurrentLocation());
  }

  render() {
    return[
      <ion-item onClick={ () => this.selectLocation() }>
        <ion-label>Select location...</ion-label>
      </ion-item>,
      <ion-item onClick={ () => this.useCurrentGps() }>
        <ion-label>Use current GPS</ion-label>
      </ion-item>
    ];
  }
}