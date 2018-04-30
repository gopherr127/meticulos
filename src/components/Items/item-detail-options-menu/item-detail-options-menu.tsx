import { Component, Element, Prop } from '@stencil/core';

@Component({
  tag: 'item-detail-options-menu'
})
export class ItemDetailOptionsMenu {

  @Element() el: any;
  @Prop() itemId: string;
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
      itemId: this.itemId,
      returnUrl: this.returnUrl
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