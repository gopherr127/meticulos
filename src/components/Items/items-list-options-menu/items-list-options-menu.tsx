import { Component, Element, Prop } from '@stencil/core';

@Component({
  tag: 'items-list-options-menu'
})
export class ItemsListOptionsMenu {

  @Element() el: any;
  @Prop() itemTypeId: string;
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-popover') as any).dismiss(data);
  }

  setRootComponent(component: string, componentProps?: any) {

    const navCtrl = document.querySelector('ion-nav');
    navCtrl.setRoot(component, componentProps);
  }

  refreshItem() {

    this.dismiss();
    this.setRootComponent('items-list',
    {
      itemTypeId: this.itemTypeId
    });
  }

  render() {
    return[
      <ion-item onClick={ () => this.refreshItem() }>
        <ion-label>Refresh</ion-label>
      </ion-item>
    ];
  }
}