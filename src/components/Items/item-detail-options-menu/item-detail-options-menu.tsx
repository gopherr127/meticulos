import { Component, Element, Prop } from '@stencil/core';
import { Item } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-detail-options-menu'
})
export class ItemDetailOptionsMenu {

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

  refreshItem() {

    this.dismiss();

    this.setRootComponent('item-detail',
    {
      itemId: this.item.id,
      returnUrl: this.returnUrl
    });
  }

  async viewItemOnMap() {
    
    this.dismiss();

    const modal = await this.modalCtrl.create({
      component: 'item-map',
      componentProps: { itemLocation: { 
        latitude: this.item.location.gps.latitude,
        longitude: this.item.location.gps.longitude
       }}
    });

    await modal.present();
  }

  render() {
    return[
      <ion-item onClick={ () => this.refreshItem() }>
        <ion-label>Refresh</ion-label>
      </ion-item>,
      <ion-item onClick={ () => this.viewItemOnMap() }>
        <ion-label>View on Map</ion-label>
      </ion-item>
    ];
  }
}