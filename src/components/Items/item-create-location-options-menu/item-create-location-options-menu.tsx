import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import * as GeolocationService from '../../../services/geolocation-service';

@Component({
  tag: 'item-create-location-options-menu'
})
export class ItemCreateLocationOptionsMenu {

  @Element() el: any;
  @Event() gpsLocationSelected: EventEmitter;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  
  dismiss(data?: any) {
    
    if (data) {

      this.gpsLocationSelected.emit(data);
    }
    (this.el.closest('ion-popover') as any).dismiss();
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