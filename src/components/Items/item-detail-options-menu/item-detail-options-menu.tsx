import { Component, Element, Prop } from '@stencil/core';
import { Item } from '../../../interfaces/interfaces';

@Component({
  tag: 'item-detail-options-menu'
})
export class ItemDetailOptionsMenu {

  @Element() el: any;
  @Prop() item: Item;
  
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
      itemId: this.item.id
    });
  }

  async viewItemOnMap() {
    
    this.dismiss();

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.push('item-map', {
      item: this.item
    });
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